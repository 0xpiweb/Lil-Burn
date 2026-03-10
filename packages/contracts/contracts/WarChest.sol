// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Ownable2Step, Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";

contract WarChest is Ownable2Step {
    uint256 public constant MIN_DONATION = 0.1 ether;
    uint256 public constant EPOCH_DURATION = 90 days;
    uint256 public immutable startTimestamp;

    mapping(uint256 => mapping(address => uint256)) public donations;
    mapping(uint256 => uint256) public epochTotals;
    mapping(uint256 => uint256) public epochDonorCount;
    mapping(uint256 => uint256) public epochDonationCount;
    mapping(uint256 => mapping(address => bool)) private _hasDonatedInEpoch;

    uint256 public totalDonated;
    uint256 public totalDonors;
    uint256 public totalDonations;
    mapping(address => bool) private _hasDonated;

    error InsufficientDonation();
    error WithdrawFailed();
    error NothingToWithdraw();

    event Donated(address indexed donor, uint256 indexed epoch, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);

    constructor(address initialOwner) Ownable(initialOwner) {
        startTimestamp = block.timestamp;
    }

    function currentEpoch() public view returns (uint256) {
        return (block.timestamp - startTimestamp) / EPOCH_DURATION;
    }

    receive() external payable {
        _donate(msg.sender, msg.value);
    }

    function donate() external payable {
        _donate(msg.sender, msg.value);
    }

    function _donate(address donor, uint256 amount) internal {
        if (amount < MIN_DONATION) revert InsufficientDonation();

        uint256 epoch = currentEpoch();

        donations[epoch][donor] += amount;

        epochTotals[epoch] += amount;
        epochDonationCount[epoch] += 1;

        if (!_hasDonatedInEpoch[epoch][donor]) {
            _hasDonatedInEpoch[epoch][donor] = true;
            epochDonorCount[epoch] += 1;
        }

        totalDonated += amount;
        totalDonations += 1;

        if (!_hasDonated[donor]) {
            _hasDonated[donor] = true;
            totalDonors += 1;
        }

        emit Donated(donor, epoch, amount);
    }

    function withdraw() external onlyOwner {
        address recipient = owner();

        uint256 balance = address(this).balance;

        if (balance == 0) revert NothingToWithdraw();

        (bool success, ) = payable(recipient).call{value: balance}("");

        if (!success) revert WithdrawFailed();

        emit Withdrawn(recipient, balance);
    }
}
