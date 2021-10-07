// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";
import "./CustomToken.sol";

contract TokenFactory is Ownable {
    event Receive(address from, uint256 value);
    event Fallback(address from, uint256 value, bytes data);
    event Withdraw(address token, uint256 amount);
    event TokenCreated(
        string name,
        string symbol,
        uint8 decimals,
        uint256 initialSupply,
        address tokenAddress,
        address tokenCreator,
        address tokenOwner
    );

    receive() external payable {
        emit Receive(msg.sender, msg.value);
    }

    fallback() external payable {
        emit Fallback(msg.sender, msg.value, msg.data);
    }

    function destroy() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
        emit Withdraw(address(0), balance);
        selfdestruct(payable(owner()));
    }

    function createToken(
        string calldata name,
        string calldata symbol,
        uint8 decimals,
        uint256 initialSupply
    ) external payable returns (CustomToken tokenAddress) {
        // 手续费必须大于等于 0.05 个主币
        require(msg.value >= 0.05 ether, "fee must >= 0.05 main coin");
        tokenAddress = new CustomToken(name, symbol, decimals, initialSupply);
        tokenAddress.transferOwnership(_msgSender());
        // tokenAddress.transferOwnership(tx.origin); // 明确是源交易发起者
        console.log(
            "\t createToken => %s %s %s",
            address(tokenAddress),
            owner(),
            tokenAddress.owner()
        );
        emit TokenCreated(
            name,
            symbol,
            decimals,
            initialSupply,
            address(tokenAddress),
            _msgSender(),
            tokenAddress.owner()
        );
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
