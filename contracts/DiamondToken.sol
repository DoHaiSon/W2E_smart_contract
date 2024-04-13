// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DiamondToken is ERC20, Ownable {
    constructor() ERC20("DiamondToken", "DMD") {
        _mint(_msgSender(), 1000000 * 10**decimals());
    }

    /** @dev public mint token
     */
    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }
}
