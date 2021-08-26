// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CustomToken is ERC20, Ownable {
    address private _creator;

    constructor(
        string memory name,
        string memory symbol,
        uint256 _initialSupply
    ) ERC20(name, symbol) {
        uint256 initialSupply = _initialSupply * 10**uint256(decimals());
        _creator = msg.sender;
        _mint(tx.origin, initialSupply);
    }

    function creator() external view returns (address) {
        return _creator;
    }
}

contract TokenFactory is Ownable {
    ERC20[] contracts;

    function getContracts() public view returns (ERC20[] memory) {
        return contracts;
    }

    function destroy() external onlyOwner {
        selfdestruct(payable(owner()));
    }

    event TokenCreated(
        string name,
        string symbol,
        uint256 initialSupply,
        address tokenAddress,
        address tokenCreator,
        address tokenOwner
    );
    event Fallback(address from, bytes data);
    event Receive(address from, uint256 value);
    event Withdraw(address from, uint256 value);

    function createToken(
        string calldata name,
        string calldata symbol,
        uint256 initialSupply
    ) external payable returns (CustomToken tokenAddress) {
        // 大于等于 0.05 个主币
        require(msg.value >= 5 * 10**uint256(16));
        tokenAddress = new CustomToken(name, symbol, initialSupply);
        tokenAddress.transferOwnership(_msgSender());
        contracts.push(tokenAddress);
        emit TokenCreated(
            name,
            symbol,
            initialSupply,
            address(tokenAddress),
            _msgSender(),
            tokenAddress.owner()
        );
    }

    function withdraw(uint256 amount) external onlyOwner {
        payable(owner()).transfer(amount);
        emit Withdraw(owner(), amount);
    }

    // function isTokenTransferOK(address currentOwner, address newOwner)
    //     external
    //     pure
    //     returns (bool ok)
    // {
    //     return keccak256(abi.encodePacked(currentOwner, newOwner))[0] == 0x7f;
    // }

    fallback() external payable {
        emit Fallback(msg.sender, msg.data);
    }

    receive() external payable {
        emit Receive(msg.sender, msg.value);
    }
}
