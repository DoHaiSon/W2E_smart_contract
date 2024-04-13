const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Sale", function () {
    let [accountA, accountB, accountC] = []
    let token
    let tokenSale
    let tokenSaleSupply = ethers.utils.parseEther("20000")
    let rate = 10

    let ownerEthBalance
    let ownerTokenBalance

    beforeEach(async () => {
        [accountA, accountB, accountC] = await ethers.getSigners();

        const DiamondToken = await ethers.getContractFactory("DiamondToken");
        token = await DiamondToken.deploy()
        await token.deployed()

        const TokenSale = await ethers.getContractFactory("TokenSale");
        tokenSale = await TokenSale.deploy(token.address, rate)
        await tokenSale.deployed()

        await token.transfer(tokenSale.address, tokenSaleSupply)
        ownerEthBalance = await ethers.provider.getBalance(accountA.address)
        ownerTokenBalance = await token.balanceOf(accountA.address)
    })
    describe("common", function () {
        it("rate should be return right value", async function () {
            expect(await tokenSale.getRate()).to.be.equals(rate)
        })
    })
    describe("buy", function () {
        it("should revert if amount of wei sent in the transaction exceeds balacne", async function () {
            let ethValue = tokenSaleSupply.div(rate).add(1)
            await expect(tokenSale.buy({value: ethValue}))
            .to.be.revertedWith("TokenSale: exceeds balacne")
        })
        it("should buy token correctly", async function () {
            let ethValue = ethers.utils.parseEther("100")
            let amountToken = ethValue.mul(rate)

            let buyTx = await tokenSale.connect(accountB).buy({value: ethValue})
            await expect(buyTx).to.be.emit(tokenSale, "TokenSold").withArgs(accountB.address, amountToken)
            expect(await ethers.provider.getBalance(tokenSale.address)).to.be.equal(ethValue)
            expect(await token.balanceOf(accountB.address)).to.be.equal(amountToken)
        })
    })
    describe("endSale", function () {
        it("should revert if sender isn't owner", async function () {
            await expect(tokenSale.connect(accountB).endSale())
            .to.be.revertedWith("Ownable: caller is not the owner")
        })
        it("should end sale correctly", async function () {
            let ethValue = ethers.utils.parseEther("100")
            let amountToken = ethValue.mul(rate)

            await tokenSale.connect(accountB).buy({value: ethValue})
            await tokenSale.endSale()

            expect(await token.balanceOf(accountA.address))
            .to.be.equal(ownerTokenBalance.add(tokenSaleSupply.sub(amountToken)))
        })
    })
});