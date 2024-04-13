const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DiamondToken", function () {
    let [accountA, accountB, accountC] = []
    let token
    let amount = ethers.utils.parseUnits("100", "ether")
    let totalSupply = ethers.utils.parseUnits("1000000", "ether")
    beforeEach(async () => {
        [accountA, accountB, accountC] = await ethers.getSigners();
        const DiamondToken = await ethers.getContractFactory("DiamondToken");
        token = await DiamondToken.deploy()
        await token.deployed()
    })
    describe("common", function () {
        it("total supply should return right value", async function () {
            expect(await token.totalSupply()).to.be.equal(totalSupply)
        });
        it("balance of account A should return right value", async function () {
            expect(await token.balanceOf(accountA.address)).to.be.equal(totalSupply)
        });
        it("balance of account B should return right value", async function () {
            expect(await token.balanceOf(accountB.address)).to.be.equal(0)
        });
    })
});