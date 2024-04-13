// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenSale is Ownable {
    IERC20 public immutable erc20Contract;
    uint256 private _rate;
    mapping(address => uint256) public contributions;

    event TokenSold(address buyer, uint256 amount);

    event RateChanged(uint256 rate);

    constructor(address _tokenAddress, uint256 rate) {
        erc20Contract = IERC20(_tokenAddress);
        _rate = rate;
    }

    function buy() public payable {
        uint256 amountToken = msg.value * _rate;
        require(
            erc20Contract.balanceOf(address(this)) > amountToken,
            "TokenSale: exceeds balacne"
        );
        contributions[msg.sender] += amountToken;
        erc20Contract.transfer(msg.sender, amountToken);
        emit TokenSold(msg.sender, amountToken);
    }

    function getRate() public view returns (uint256) {
        return _rate;
    }

    function updateRate(uint256 rate) public onlyOwner {
        require(rate > 0, "TokenSale: rate need to be greater than zero");
        _rate = rate;
    }

    function endSale() public onlyOwner {
        address _owner = owner();
        erc20Contract.transfer(_owner, erc20Contract.balanceOf(address(this)));
        payable(_owner).transfer(address(this).balance);
    }
}
