// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;

    IERC721 public immutable nftContract;
    IERC20 public immutable erc20Contract;

    struct MarketItem {
        uint256 itemId;
        address seller;
        address buyer;
        uint256 tokenId;
        uint256 price;
    }

    mapping(uint256 => MarketItem) private _id2Item;

    event MarketItemAdded(
        uint256 indexed itemId,
        address indexed seller,
        uint256 indexed tokenId,
        uint256 price
    );

    event MarketItemCancelled(uint256 indexed itemId);

    event MarketItemSold(
        uint256 indexed itemId,
        address indexed seller,
        address indexed buyer,
        uint256 tokenId,
        uint256 price
    );

    constructor(address nftAddress, address erc20Address) {
        require(
            nftAddress != address(0),
            "Marketplace: nftAddress is zero address"
        );
        require(
            erc20Address != address(0),
            "Marketplace: erc20Address is zero address"
        );

        nftContract = IERC721(nftAddress);
        erc20Contract = IERC20(erc20Address);
    }

    function isSeller(uint256 itemId, address seller)
        public
        view
        returns (bool)
    {
        return _id2Item[itemId].seller == seller;
    }

    function addMarketItem(uint256 tokenId, uint256 price) public {
        address operator = address(this);

        require(
            nftContract.ownerOf(tokenId) == _msgSender(),
            "Marketplace: sender must be owner"
        );
        require(
            nftContract.getApproved(tokenId) == operator ||
                nftContract.isApprovedForAll(_msgSender(), operator),
            "Marketplace: this contract is unauthorized to manage this token"
        );
        require(price > 0, "Marketplace: price must be greater than 0");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        _id2Item[itemId] = MarketItem(
            itemId,
            _msgSender(),
            address(0),
            tokenId,
            price
        );
        nftContract.transferFrom(_msgSender(), operator, tokenId);

        emit MarketItemAdded(itemId, _msgSender(), tokenId, price);
    }

    function cancelMarketItem(uint256 itemId) external {
        address operator = address(this);
        MarketItem storage item = _id2Item[itemId];

        require(
            isSeller(itemId, _msgSender()),
            "Marketplace: sender must be owner"
        );
        require(
            item.buyer == address(0),
            "Marketplace: the item must be available"
        );

        uint256 tokenId = item.tokenId;
        delete _id2Item[itemId];
        nftContract.transferFrom(operator, _msgSender(), tokenId);

        emit MarketItemCancelled(itemId);
    }

    function executeMarketItem(uint256 itemId) external {
        address buyer = _msgSender();
        address operator = address(this);
        MarketItem storage item = _id2Item[itemId];

        require(item.price > 0, "Marketplace: the item has been canceled");
        require(
            !isSeller(itemId, buyer),
            "Marketplace: buyer must be different from seller"
        );
        require(
            item.buyer == address(0),
            "Marketplace: the item must be available"
        );
        require(
            erc20Contract.allowance(buyer, operator) >= item.price,
            "Marketplace: insufficient allowance"
        );

        item.buyer = buyer;
        erc20Contract.transferFrom(buyer, item.seller, item.price);
        nftContract.transferFrom(operator, buyer, item.tokenId);

        emit MarketItemSold(
            itemId,
            item.seller,
            item.buyer,
            item.tokenId,
            item.price
        );
    }
}
