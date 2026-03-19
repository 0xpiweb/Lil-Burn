// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Ownable2Step, Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract WarChest is Ownable2Step, Pausable {
    uint256 public constant MIN_DONATION = 0.1 ether;
    uint256 public constant EPOCH_DURATION = 90 days;
    uint256 public immutable startTimestamp;

    error InsufficientDonation();
    error WithdrawFailed();
    error NothingToWithdraw();

    event Donated(address indexed donor, uint256 indexed epoch, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);

    constructor(address initialOwner) Ownable(initialOwner) {
        startTimestamp = block.timestamp;
    }

    function currentEpoch() public view returns (uint256) {
        return (block.timestamp - startTimestamp) / EPOCH_DURATION + 1;
    }

    function nextEpochStart() public view returns (uint256) {
        return startTimestamp + currentEpoch() * EPOCH_DURATION;
    }

    receive() external payable {
        _donate(msg.sender, msg.value);
    }

    function donate() external payable {
        _donate(msg.sender, msg.value);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _donate(address donor, uint256 amount) internal whenNotPaused {
        if (amount < MIN_DONATION) revert InsufficientDonation();

        emit Donated(donor, currentEpoch(), amount);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;

        if (balance == 0) revert NothingToWithdraw();

        (bool success, ) = payable(msg.sender).call{value: balance}("");

        if (!success) revert WithdrawFailed();

        emit Withdrawn(msg.sender, balance);
    }
}
