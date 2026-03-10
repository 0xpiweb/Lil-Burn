// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable2Step, Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract LilBurn is ERC721URIStorage, Ownable2Step {
    uint256 public constant MAX_SUPPLY = 1000;
    uint256 public constant MINT_PRICE = 2 ether;
    uint256 public constant MAX_WHITELIST_MINT = 2;
    uint256 public constant MAX_OWNER_MINT = 8;
    uint256 public constant MAX_PUBLIC_MINT = 20;
    uint256 public constant BURN_MILESTONE_INTERVAL = 50;

    uint256 private _nextTokenId = 1;
    uint256 public burnCount;
    uint256 public ownerMintCount;

    enum MintPhase {
        Closed,
        Holder,
        Whitelist,
        Public
    }

    uint64 public holderStart;
    uint64 public whitelistStart;
    uint64 public publicStart;
    bool public paused;

    bytes32 public holderMerkleRoot;
    bytes32 public whitelistMerkleRoot;
    string private _baseTokenURI;

    mapping(address => uint256) public holderMintCount;
    mapping(address => uint256) public whitelistMintCount;

    error MintPhaseNotActive();
    error InvalidMerkleProof();
    error ExceedsMaxMint();
    error ExceedsMaxSupply();
    error IncorrectPayment();
    error WithdrawFailed();
    error MerkleRootNotSet();
    error ZeroQuantity();
    error NotOwnerOrApproved();
    error InvalidPhaseSchedule();
    error OwnerMintNotComplete();
    error ExceedsOwnerMint();

    event PhaseScheduleSet(
        uint64 holderStart,
        uint64 whitelistStart,
        uint64 publicStart
    );
    event MintPaused(bool paused);
    event Minted(
        address indexed to,
        uint256 indexed startTokenId,
        uint256 quantity
    );
    event Withdrawn(address indexed to, uint256 amount);
    event BurnMilestone(uint256 indexed milestone);
    event HolderMerkleRootSet(bytes32 root);
    event WhitelistMerkleRootSet(bytes32 root);
    event BaseURISet(string baseURI);
    event TokenURISet(uint256 indexed tokenId, string uri);

    constructor(
        address initialOwner
    ) ERC721("Lil Burn", "Lil-B") Ownable(initialOwner) {}

    function mintPhase() public view returns (MintPhase) {
        if (paused) return MintPhase.Closed;

        if (publicStart != 0 && block.timestamp >= publicStart)
            return MintPhase.Public;

        if (whitelistStart != 0 && block.timestamp >= whitelistStart)
            return MintPhase.Whitelist;

        if (holderStart != 0 && block.timestamp >= holderStart)
            return MintPhase.Holder;

        return MintPhase.Closed;
    }

    function setPhaseSchedule(
        uint64 _holderStart,
        uint64 _whitelistStart,
        uint64 _publicStart
    ) external onlyOwner {
        bool allZero = _holderStart == 0 &&
            _whitelistStart == 0 &&
            _publicStart == 0;

        if (
            !allZero &&
            (_holderStart == 0 ||
                _whitelistStart == 0 ||
                _publicStart == 0 ||
                _whitelistStart < _holderStart ||
                _publicStart < _whitelistStart)
        ) revert InvalidPhaseSchedule();

        holderStart = _holderStart;
        whitelistStart = _whitelistStart;
        publicStart = _publicStart;

        emit PhaseScheduleSet(_holderStart, _whitelistStart, _publicStart);
    }

    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;

        emit MintPaused(_paused);
    }

    function setHolderMerkleRoot(bytes32 _root) external onlyOwner {
        holderMerkleRoot = _root;

        emit HolderMerkleRootSet(_root);
    }

    function setWhitelistMerkleRoot(bytes32 _root) external onlyOwner {
        whitelistMerkleRoot = _root;

        emit WhitelistMerkleRootSet(_root);
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;

        emit BaseURISet(baseURI);
    }

    function setTokenURI(
        uint256 tokenId,
        string calldata uri
    ) external onlyOwner {
        _setTokenURI(tokenId, uri);

        emit TokenURISet(tokenId, uri);
    }

    function withdraw() external onlyOwner {
        address recipient = owner();

        uint256 balance = address(this).balance;

        (bool success, ) = payable(recipient).call{value: balance}("");

        if (!success) revert WithdrawFailed();

        emit Withdrawn(recipient, balance);
    }

    function totalSupply() public view returns (uint256) {
        return _nextTokenId - 1 - burnCount;
    }

    function nextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721URIStorage) returns (string memory) {
        return string.concat(super.tokenURI(tokenId), ".json");
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function burn(uint256 tokenId) external {
        address tokenOwner = ownerOf(tokenId);

        if (
            msg.sender != tokenOwner &&
            !isApprovedForAll(tokenOwner, msg.sender) &&
            getApproved(tokenId) != msg.sender
        ) revert NotOwnerOrApproved();

        _burn(tokenId);

        burnCount++;

        if (burnCount % BURN_MILESTONE_INTERVAL == 0) {
            emit BurnMilestone(burnCount / BURN_MILESTONE_INTERVAL);
        }
    }

    function ownerMint(address to, uint256 quantity) external onlyOwner {
        if (quantity == 0) revert ZeroQuantity();

        if (ownerMintCount + quantity > MAX_OWNER_MINT)
            revert ExceedsOwnerMint();

        if (_nextTokenId - 1 + quantity > MAX_SUPPLY) revert ExceedsMaxSupply();

        ownerMintCount += quantity;

        _mintBatch(to, quantity);
    }

    function holderMint(
        uint256 quantity,
        uint256 maxQuantity,
        bytes32[] calldata proof
    ) external payable {
        if (mintPhase() != MintPhase.Holder) revert MintPhaseNotActive();

        if (ownerMintCount < MAX_OWNER_MINT) revert OwnerMintNotComplete();

        if (quantity == 0) revert ZeroQuantity();

        if (holderMerkleRoot == bytes32(0)) revert MerkleRootNotSet();

        if (_nextTokenId - 1 + quantity > MAX_SUPPLY) revert ExceedsMaxSupply();

        if (msg.value != quantity * MINT_PRICE) revert IncorrectPayment();

        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(msg.sender, maxQuantity)))
        );

        if (!MerkleProof.verify(proof, holderMerkleRoot, leaf))
            revert InvalidMerkleProof();

        if (holderMintCount[msg.sender] + quantity > maxQuantity)
            revert ExceedsMaxMint();

        holderMintCount[msg.sender] += quantity;

        _mintBatch(msg.sender, quantity);
    }

    function whitelistMint(
        uint256 quantity,
        bytes32[] calldata proof
    ) external payable {
        if (mintPhase() != MintPhase.Whitelist) revert MintPhaseNotActive();

        if (ownerMintCount < MAX_OWNER_MINT) revert OwnerMintNotComplete();

        if (quantity == 0) revert ZeroQuantity();

        if (whitelistMerkleRoot == bytes32(0)) revert MerkleRootNotSet();

        if (_nextTokenId - 1 + quantity > MAX_SUPPLY) revert ExceedsMaxSupply();

        if (whitelistMintCount[msg.sender] + quantity > MAX_WHITELIST_MINT)
            revert ExceedsMaxMint();

        if (msg.value != quantity * MINT_PRICE) revert IncorrectPayment();

        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(msg.sender)))
        );

        if (!MerkleProof.verify(proof, whitelistMerkleRoot, leaf))
            revert InvalidMerkleProof();

        whitelistMintCount[msg.sender] += quantity;

        _mintBatch(msg.sender, quantity);
    }

    function publicMint(uint256 quantity) external payable {
        if (mintPhase() != MintPhase.Public) revert MintPhaseNotActive();

        if (ownerMintCount < MAX_OWNER_MINT) revert OwnerMintNotComplete();

        if (quantity == 0) revert ZeroQuantity();

        if (quantity > MAX_PUBLIC_MINT) revert ExceedsMaxMint();

        if (_nextTokenId - 1 + quantity > MAX_SUPPLY) revert ExceedsMaxSupply();

        if (msg.value != quantity * MINT_PRICE) revert IncorrectPayment();

        _mintBatch(msg.sender, quantity);
    }

    function tokensOfOwner(
        address owner
    ) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);

        uint256[] memory tokens = new uint256[](balance);

        uint256 count = 0;

        for (uint256 i = 1; i < _nextTokenId; i++) {
            if (_ownerOf(i) == owner) {
                tokens[count++] = i;
            }
        }

        return tokens;
    }

    function _mintBatch(address to, uint256 quantity) internal {
        uint256 startTokenId = _nextTokenId;

        _nextTokenId += quantity;

        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(to, startTokenId + i);
        }

        emit Minted(to, startTokenId, quantity);
    }
}
