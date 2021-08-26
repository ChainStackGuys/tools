import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@symfoni/hardhat-react';
import '@typechain/ethers-v5';
// import '@typechain/hardhat';
import 'hardhat-deploy-ethers';
import 'hardhat-deploy';
import 'hardhat-typechain';

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
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
const config: HardhatUserConfig = {
  react: {
    providerPriority: ['web3modal', 'hardhat'],
  },
  defaultNetwork: 'ganache', // 默认的网络 npx hardhat deploy --network ganache
  networks: {
    ganache: {
      url: 'http://127.0.0.1:7545',
      accounts: [
        'e9900c2e7f5c31c5dc4d05b0000', // 改为自己的私钥
      ],
    },
    ropsten: {
      url: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      accounts: [
        'e9900c2e7f5c31c5dc4d05b000', // 改为自己的私钥
      ],
    },
    hardhat: {
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk', // test test test test test test test test test test test junk
      },
      // accounts: [
      //   {
      //     balance: '10000000000000000000000',
      //     privateKey: '',
      //   },
      // ],
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.4',
        settings: {
          optimizer: {
            enabled: true,
            runs: 50,
          },
        },
      },
    ],
    overrides: {
      // 'contracts/TokenCreator.sol': {
      //   version: '0.7.3',
      //   settings: {},
      // },
    },
  },
};

export default config;
