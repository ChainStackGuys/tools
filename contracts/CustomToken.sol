// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract CustomToken is ERC20, Ownable {
    uint8 private _decimals;

    event Withdraw(address token, uint256 amount);

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply_
    ) ERC20(name_, symbol_) {
        console.log("\t constructor => %s %s %s", name_, symbol_, decimals_);
        _decimals = decimals_;
        // 前端计算，省点燃料
        // uint256 initialSupply = initialSupply_ * 10**uint256(decimals_);
        _mint(tx.origin, initialSupply_);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
        emit Withdraw(address(0), balance);
    }
}
