
   
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace", function () {
    let [admin, seller, buyer] = []
    let nft, token, marketplace
    let defaultPrice = ethers.utils.parseEther("100")
    let defaultBalance = ethers.utils.parseEther("10000")
    beforeEach(async () => {
        [admin, seller, buyer] = await ethers.getSigners();     

        const DiamondToken = await ethers.getContractFactory("DiamondToken");
        token = await DiamondToken.deploy()
        await token.deployed()
      

        const MyNFT = await ethers.getContractFactory("MyNFT");
        nft = await MyNFT.deploy()
        await nft.deployed()

        const Marketplace = await ethers.getContractFactory("Marketplace");
        marketplace = await Marketplace.deploy(nft.address, token.address)
        await marketplace.deployed()

        await token.transfer(seller.address, defaultBalance)
        await token.transfer(buyer.address, defaultBalance)

    })
    describe("addMarketItem", function () {
        beforeEach(async () => {
            await nft.mint(seller.address)
        })
        it("should revert if sender isn't nft owner", async function () {
            await nft.connect(buyer).setApprovalForAll(marketplace.address, true)
            await expect(marketplace.connect(buyer).addMarketItem(1, defaultPrice))
            .to.be.revertedWith("Marketplace: sender must be owner")
          
        });
        it("should revert if nft hasn't been approve for marketplace contract", async function () {
            await expect(marketplace.connect(seller).addMarketItem(1, defaultPrice))
                .to.be.revertedWith("Marketplace: this contract is unauthorized to manage this token")
        });
        it("should revert if price is 0", async function () {
            await nft.connect(seller).setApprovalForAll(marketplace.address, true)
            await expect(marketplace.connect(seller).addMarketItem(1, 0))
                .to.be.revertedWith("Marketplace: price must be greater than 0")
        });
        it("should add item correctly", async function () {
            await nft.connect(seller).setApprovalForAll(marketplace.address, true)

            const addMarketItemTx = await marketplace.connect(seller).addMarketItem(1, defaultPrice)
            await expect(addMarketItemTx).to.be.emit(marketplace, "MarketItemAdded")
                .withArgs(1, seller.address, 1, defaultPrice)
            expect(await nft.ownerOf(1)).to.be.equal(marketplace.address)
            
            await nft.mint(seller.address)
            const addMarketItemTx2 = await marketplace.connect(seller).addMarketItem(2, defaultPrice)
            await expect(addMarketItemTx2).to.be.emit(marketplace, "MarketItemAdded")
                .withArgs(2, seller.address, 2, defaultPrice)
            expect(await nft.ownerOf(2)).to.be.equal(marketplace.address)
        });
    })
    describe("cancelMarketItem", function () {
        beforeEach(async () => {
            await nft.mint(seller.address)
            await nft.connect(seller).setApprovalForAll(marketplace.address, true)
            await marketplace.connect(seller).addMarketItem(1, defaultPrice)           
            await token.connect(buyer).approve(marketplace.address, defaultPrice)

        })
        it("should revert if sender isn't nft owner", async function () {
            await expect(marketplace.connect(buyer).cancelMarketItem(1))
            .to.be.revertedWith("Marketplace: sender must be owner")
          
        });
        it("should revert if item is no longer", async function () {
            await marketplace.connect(buyer).executeMarketItem(1)
            await expect(marketplace.connect(seller).cancelMarketItem(1))
                .to.be.revertedWith("Marketplace: the item must be available")
        });
        it("should cancel item correctly", async function () {
            const cancelMarketItemTx = await marketplace.connect(seller).cancelMarketItem(1)
            await expect(cancelMarketItemTx).to.be.emit(marketplace, "MarketItemCancelled").withArgs(1)
        });
    })
    describe("executeMarketItem", function () {
        beforeEach(async () => {
            await nft.mint(seller.address)
            await nft.connect(seller).setApprovalForAll(marketplace.address, true)
            await marketplace.connect(seller).addMarketItem(1, defaultPrice)   
            await token.connect(buyer).approve(marketplace.address, defaultPrice)
        })
        it("should revert if buyer is seller", async function () {
            await expect(marketplace.connect(seller).executeMarketItem(1))
                .to.be.revertedWith("Marketplace: buyer must be different from seller")
        });
        it("should revert if item is no longer", async function () {
            await marketplace.connect(seller).cancelMarketItem(1)
            await expect(marketplace.connect(buyer).executeMarketItem(1))
                .to.be.revertedWith("Marketplace: the item has been canceled")
        });
        it("should revert if item has been sold", async function () {
            await marketplace.connect(buyer).executeMarketItem(1)
            await expect(marketplace.connect(buyer).executeMarketItem(1))
                .to.be.revertedWith("Marketplace: the item must be available")
        });
        it("should revert if price exceeds allowance", async function () {
            await token.connect(buyer).decreaseAllowance(marketplace.address, defaultPrice)
            await expect(marketplace.connect(buyer).executeMarketItem(1))
                .to.be.revertedWith("Marketplace: insufficient allowance")
        });
        it("should execute item correctly", async function () {
            const executeMarketItemTx = await marketplace.connect(buyer).executeMarketItem(1)
            await expect(executeMarketItemTx).to.be.emit(marketplace, "MarketItemSold")
            .withArgs(1, seller.address, buyer.address, 1, defaultPrice)
            expect(await nft.ownerOf(1)).to.be.equal(buyer.address)
            expect(await token.balanceOf(seller.address)).to.be.equal(defaultBalance.add(defaultPrice))
            expect(await token.balanceOf(buyer.address)).to.be.equal(defaultBalance.sub(defaultPrice))
        });
    })

})