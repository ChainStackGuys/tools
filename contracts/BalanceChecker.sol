// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// ERC20 contract interface
interface Token {
    function balanceOf(address) external view returns (uint256);
}

contract BalanceChecker {
    event Fallback(address, bytes);

    /* fallback function, don't receive any ETH */
    fallback() external {
        emit Fallback(msg.sender, msg.data);
    }

    /*
    Check the token balance of a wallet in a token contract

    Returns the balance of the token for user. Avoids possible errors:
      - return 0 on non-contract address 
      - returns 0 if the contract doesn't implement balanceOf
  */
    function tokenBalance(address user, Token token)
        public
        view
        returns (uint256)
    {
        // check if token is actually a contract
        uint256 tokenCode;
        assembly {
            tokenCode := extcodesize(token)
        } // contract code size

        // is it a contract and does it implement balanceOf
        if (tokenCode == 0) {
            return 0;
        }
        // NOTE: 8.0以上使用 call 会导致不能返回 view, TODO
        // (bool canCall, ) = address(token).call(
        //     abi.encodeWithSignature("balanceOf()")
        // );
        // if (!canCall) {
        //     return 0;
        // }
        return Token(token).balanceOf(user);
    }

    /*
    Check the token balances of a wallet for multiple tokens.
    Pass 0x0 as a "token" address to get ETH balance.

    Possible error throws:
      - extremely large arrays for user and or tokens (gas cost too high) 
          
    Returns a one-dimensional that's user.length * tokens.length long. The
    array is ordered by all of the 0th users token balances, then the 1th
    user, and so on.
  */
    function balances(address[] memory users, address[] memory tokens)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory addrBalances = new uint256[](
            tokens.length * users.length
        );

        for (uint256 i = 0; i < users.length; i++) {
            for (uint256 j = 0; j < tokens.length; j++) {
                uint256 addrIdx = j + tokens.length * i;
                if (tokens[j] != address(0x0)) {
                    addrBalances[addrIdx] = tokenBalance(
                        users[i],
                        Token(tokens[j])
                    );
                } else {
                    addrBalances[addrIdx] = users[i].balance; // ETH balance
                }
            }
        }

        return addrBalances;
    }
}
