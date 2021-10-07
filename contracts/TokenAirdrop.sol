// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenAirdrop is Ownable {
    event Receive(address from, uint256 value);
    event Fallback(address from, uint256 value, bytes data);
    event Withdraw(address token, uint256 amount);
    event Airdrop(
        address from,
        uint256 value,
        ERC20 token,
        address[] accounts,
        uint256[] values
    );
    event AirdropWithAmount(
        address from,
        uint256 value,
        ERC20 token,
        address[] accounts,
        uint256 amount
    );

    receive() external payable {
        emit Receive(msg.sender, msg.value);
    }

    fallback() external payable {
        emit Fallback(msg.sender, msg.value, msg.data);
    }

    function airdrop(
        ERC20 token,
        address[] calldata accounts,
        uint256[] calldata values
    ) external payable returns (bool) {
        // 手续费必须大于等于 0.05 个主币
        require(msg.value >= 5 * 10**uint256(16));
        require(accounts.length == values.length);
        require(accounts.length <= 255);
        // ERC20 token = ERC20(tokenAddress);
        for (uint8 i = 0; i < accounts.length; i++) {
            assert(
                token.transferFrom(msg.sender, accounts[i], values[i]) == true
            );
        }
        emit Airdrop(msg.sender, msg.value, token, accounts, values);
        return true;
    }

    function airdropWithAmount(
        ERC20 token,
        address[] calldata accounts,
        uint256 amount
    ) external payable {
        // 手续费必须大于等于 0.05 个主币
        require(msg.value >= 5 * 10**uint256(16));
        uint256 valuePerAccount = amount / accounts.length;
        for (uint256 i = 0; i < accounts.length; i++) {
            assert(
                token.transferFrom(msg.sender, accounts[i], valuePerAccount) ==
                    true
            );
        }
        emit AirdropWithAmount(msg.sender, msg.value, token, accounts, amount);
    }

    function withdraw(address token, uint256 amount) external onlyOwner {
        uint256 balance;
        if (token == address(0)) {
            balance = address(this).balance;
            require(balance >= amount, "withdraw amount exceeds balance");
            payable(owner()).transfer(amount);
            emit Withdraw(token, amount);
            return;
        }
        ERC20 erc20 = ERC20(token);
        balance = ERC20(token).balanceOf(address(this));
        require(balance >= amount, "withdraw amount exceeds balance");
        assert(erc20.transfer(owner(), amount) == true);
        emit Withdraw(token, amount);
    }
}
