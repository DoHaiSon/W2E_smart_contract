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

*We encourage you to also perform reproducible research!. If you use these code, please acknowledge the following papers:*

1. Do Hai Son, Nguyen Danh Hao, Tran Thi Thuy Quynh, and Le Quang Minh, “W2E (Workout to Earn): A Low Cost DApp based on ERC-20 and ERC-721 standards,”  in *9th International Conference on Integrated Circuits, Design, and Verification (ICDV)*, Hanoi, Vietnam, Jun. 2024.

License and Referencing
These code is licensed under the GPLv3 license. If you in any way use these code for research that results in publications, please cite our original article listed above.
