const hre = require("hardhat");

async function main() {
  let [deployer] = await ethers.getSigners();
  console.log("Deployer Address:", deployer.address);
  let startBalance = await deployer.getBalance();

  let startTime = performance.now();
  let DiamondToken = await ethers.getContractFactory("DiamondToken");
  let token = await DiamondToken.deploy();
  await token.deployed();
  let endTime = performance.now();
  console.log(`Deploy DiamondToken take ${endTime - startTime} milliseconds`);

  let endBalance = await deployer.getBalance();
  let deployFee = startBalance.sub(endBalance);
  console.log(`Deploy DiamondToken take ${ethers.utils.formatEther(deployFee)} ethers`);

  console.log("DiamondToken Address:", token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});