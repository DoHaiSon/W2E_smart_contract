const hre = require("hardhat");
const { globalAdrresses } = require("../utils/constant");

async function main() {
    let [sender] = await ethers.getSigners();
    console.log("Sender Address:", sender.address);
    let startBalance = await sender.getBalance();

    const token = await ethers.getContractAt("DiamondToken", globalAdrresses.goerli.token);

    let startTime = performance.now();
    const transferTx = await token.transfer("0x29E625F1c84d35a12048b32bf1C639A94fd4A8FE", ethers.utils.parseEther("100"));
    await transferTx.wait();
    // let tx = await sender.sendTransaction({
    //     to: "0x29E625F1c84d35a12048b32bf1C639A94fd4A8FE",
    //     value: ethers.utils.parseEther("0.0001"),
    // });
    // await tx.wait();

    let endTime = performance.now();
    console.log(`Take ${endTime - startTime} milliseconds`);


    let afterBalance = await sender.getBalance();
    let deployFee = startBalance.sub(afterBalance).sub(ethers.utils.parseEther("0.0001"));
    console.log(`Take ${ethers.utils.formatEther(deployFee)} ethers`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});