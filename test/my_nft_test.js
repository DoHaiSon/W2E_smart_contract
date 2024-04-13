
   
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT", function () {
    let [accountA, accountB, accountC] = []
    let nft
    let address0 = "0x0000000000000000000000000000000000000000"
    let uri = "sampleuri.com/"
    beforeEach(async () => {
        [accountA, accountB, accountC] = await ethers.getSigners();
        const MyNFT = await ethers.getContractFactory("MyNFT");
        nft = await MyNFT.deploy()
        await nft.deployed()
    })
    describe("mint", function () {
        it("should revert if mint to zero address", async function () {
            await expect(nft.mint(address0)).to.be.revertedWith("ERC721: mint to the zero address")
        });
        it("should mint token correctly", async function () {
            const mintTx = await nft.mint(accountA.address)
            await expect(mintTx).to.be.emit(nft, "Transfer").withArgs(address0, accountA.address, 1)
            expect(await nft.balanceOf(accountA.address)).to.be.equal(1)
            expect(await nft.ownerOf(1)).to.be.equal(accountA.address)
            const mintTx2 = await nft.mint(accountA.address)
            await expect(mintTx2).to.be.emit(nft, "Transfer").withArgs(address0, accountA.address, 2)
            expect(await nft.balanceOf(accountA.address)).to.be.equal(2)
            expect(await nft.ownerOf(2)).to.be.equal(accountA.address)
        });
    })
})