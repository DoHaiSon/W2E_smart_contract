const hre = require("hardhat");
const { globalAdrresses } = require("../utils/constant");

async function main() {
  let [deployer] = await ethers.getSigners();
  console.log("Deployer Address:", deployer.address);
  let beforeBalance = await deployer.getBalance();

  const token = await ethers.getContractAt("DiamondToken", globalAdrresses.goerli.token);
  const nft = await ethers.getContractAt("MyNFT", globalAdrresses.goerli.nft);

  let startTime = performance.now();
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(nft.address, token.address);
  await marketplace.deployed();
  let endTime = performance.now();
  console.log(`Deploy Marketplace take ${endTime - startTime} milliseconds`);

  let afterBalance = await deployer.getBalance();
  let deployFee = beforeBalance.sub(afterBalance);
  console.log(`Deploy Marketplace take ${ethers.utils.formatEther(deployFee)} ethers`);

  console.log("Marketplace deployed to:", marketplace.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});