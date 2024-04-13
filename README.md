# Etherscan verification

```shell
npx hardhat run --network goerli scripts/deploy_token.js
npx hardhat run --network mumbai scripts/deploy_token.js
npx hardhat run --network optimism scripts/deploy_token.js
npx hardhat run --network private1 scripts/deploy_token.js
npx hardhat run --network private2 scripts/deploy_token.js

```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell

npx hardhat verify --network rinkeby DEPLOYED_CONTRACT_ADDRESS
```
