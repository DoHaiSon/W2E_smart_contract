require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: process.env.GOERLI_RPC,
      accounts: [`0x${process.env.GOERLI_PRIVATE_KEY}`]
    },
    mumbai: {
      url: process.env.MUMBAI_RPC,
      accounts: [`0x${process.env.MUMBAI_PRIVATE_KEY}`]
    },
    optimism: {
      url: process.env.OPTIMISM_RPC,
      accounts: [`0x${process.env.OPTIMISM_PRIVATE_KEY}`]
    },
    private1: {
      url: process.env.PRIVATE_ETHEREUM_V1_RPC,
      accounts: [`0x${process.env.PRIVATE_ETHEREUM_V1_PRIVATE_KEY}`]
    },
    private2: {
      url: process.env.PRIVATE_ETHEREUM_V2_RPC,
      accounts: [`0x${process.env.PRIVATE_ETHEREUM_V2_PRIVATE_KEY}`]
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
