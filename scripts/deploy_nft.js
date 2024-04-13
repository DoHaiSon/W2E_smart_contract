const hre = require("hardhat");

async function main() {
  let [deployer] = await ethers.getSigners();
  console.log("Deployer Address:", deployer.address);
  let beforeBalance = await deployer.getBalance();

  let startTime = performance.now();
  let MyNFT = await ethers.getContractFactory("MyNFT")
  let nft = await MyNFT.deploy();
  await nft.deployed()
  let endTime = performance.now();
  console.log(`Deploy MyNFT take ${endTime - startTime} milliseconds`);

  let afterBalance = await deployer.getBalance();
  let deployFee = beforeBalance.sub(afterBalance);
  console.log(`Deploy MyNFT take ${ethers.utils.formatEther(deployFee)} ethers`);

  console.log("MyNFT deployed to:", nft.address)
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});