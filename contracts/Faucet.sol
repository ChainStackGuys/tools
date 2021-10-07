// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Faucet {
    event Receive(address from, uint256 value);
    event Fallback(address from, uint256 value, bytes data);
    event Withdraw(address from, uint256 amount);

    constructor() payable {}

    receive() external payable {
        emit Receive(msg.sender, msg.value);
    }

    fallback() external payable {
        emit Fallback(msg.sender, msg.value, msg.data);
    }

    function withdraw(uint256 amount) public {
        require(amount <= 1 ether);
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }
}
