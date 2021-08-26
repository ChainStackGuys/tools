// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenAirdrop is Ownable {
    event Fallback(address, uint256);
    event Receive(address, uint256);
    event Withdraw(address, uint256);
    event Airdrop(ERC20, address[], uint256);

    // function _airdrop(
    //     ERC20 token,
    //     address[] calldata accounts,
    //     uint256 amount
    // ) private {
    //     uint256 valuePerAccount = amount / accounts.length;
    //     for (uint256 i = 0; i < accounts.length; i++) {
    //         token.transferFrom(msg.sender, accounts[i], valuePerAccount);
    //     }
    // }

    function sendToken(
        address tokenAddress,
        address[] calldata accounts,
        uint256[] calldata values
    ) external payable returns (bool) {
        require(accounts.length == values.length);
        require(accounts.length <= 255);
        ERC20 token = ERC20(tokenAddress);
        for (uint8 i = 0; i < accounts.length; i++) {
            assert(
                token.transferFrom(msg.sender, accounts[i], values[i]) == true
            );
        }
        return true;
    }

    function airdrop(
        ERC20 token,
        address[] calldata accounts,
        uint256 amount
    ) external payable {
        // 大于等于 0.05 个主币
        require(msg.value >= 5 * 10**uint256(16));
        uint256 valuePerAccount = amount / accounts.length;
        for (uint256 i = 0; i < accounts.length; i++) {
            token.transferFrom(msg.sender, accounts[i], valuePerAccount);
        }
        emit Airdrop(token, accounts, amount);
    }

    function airdropByOwner(
        ERC20 token,
        address[] calldata accounts,
        uint256 amount
    ) external {
        require(msg.sender == owner(), "TokenAirdrop: caller is not the owner");
        uint256 valuePerAccount = amount / accounts.length;
        for (uint256 i = 0; i < accounts.length; i++) {
            token.transferFrom(msg.sender, accounts[i], valuePerAccount);
        }
        emit Airdrop(token, accounts, amount);
    }

    function withdraw(uint256 amount) external onlyOwner {
        payable(owner()).transfer(amount);
        emit Withdraw(owner(), amount);
    }

    fallback() external payable {
        emit Fallback(msg.sender, msg.value);
    }

    receive() external payable {
        emit Receive(msg.sender, msg.value);
    }
}
