const hre = require("hardhat");
const { globalAdrresses } = require("../utils/constant");

async function main() {
  const rate = 2000;

  const diamond = await ethers.getContractAt("DiamondToken", globalAdrresses.goerli.token)
  const TokenSale = await ethers.getContractFactory("TokenSale")
  const tokenSale = await TokenSale.deploy(globalAdrresses.goerli.token, rate)
  await tokenSale.deployed()
  console.log("TokenSale deployed to:", tokenSale.address);

  const transferTx = await diamond.transfer(tokenSale.address, ethers.utils.parseEther("100000"))
  await transferTx.wait()

  console.log("TokenSale has balance:", await diamond.balanceOf(tokenSale.address));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});