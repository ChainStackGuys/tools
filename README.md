# Get started

[Hardhat官方教程](https://www.zhihu.com/tardis/sogou/art/353251375)

[Hardhat官方案例](https://github.com/nomiclabs/hardhat-hackathon-boilerplate)

1. Clone the repo and cd into it `git clone https://github.com/ChainStackGuys/tools.git MyProject && cd MyProject`
2. Install deps with yarn `yarn` or npm `npm install`
3. rename `hardhat.config.example.ts` to `hardhat.config.ts`
4. Start hardhat `npx hardhat node --watch` **使用 hardhat node**
5. Deploy `npx hardhat deploy --network ganache` **不使用 hardhat node, 直接部署到指定网络**

```text
It runs up a Hardhat node, compile contracts, generates typescript interfaces,
creates React context and instantiates your contract instances and factories
with frontend provider.
```

6. Open up a new terminal
7. Enter the frontend directory: `cd frontend`
8. Install dependencies with yarn `yarn` or npm `npm install`
9. Import seed phrase in Metamask. The default mnemonic currently used by hardhat is `test test test test test test test test test test test junk`
10. Please note that you need to sign out from your current Metamask wallet to import a new one. **Instead of logging out**, you can use a new browser profile to do your Ethereum development:
11. Click your profile icon in the top right corner of Chrome (right next to the hamburger menu icon)
12. Click "Add"
13. Give the profile a name and click "Add"
14. In this new browser window, install Metamask and import the keyPhrase above
15. Ensure Metamask RPC is set to `http://localhost:8545` and chainID `31337`.
16. Start the React app: `npm start`

The frontend should open at http://localhost:3000/

Because of this default hardhat.config.ts it will first try to connect with an injected provider like Metamask (web3modal package does this).

If nothing found it will try to connect with your hardhat node. On localhost and hardhat nodes it will inject your mnemonic into the frontend so you have a "browser wallet" that can both call and send transactions. NB! Don't ever put a mnemonic with actual value here.

In hardhat.config.ts there is example on how to instruct your hardhat-network to use mnemonic or privatekey.

```ts
const config: HardhatUserConfig = {
  react: {
    providerPriority: ['web3modal', 'hardhat'],
  },
};
```

Ensure you are using RPC to http://localhost:8545.

You may also need to set the chainID to 31337 if you are using Hardhat blockchain development node.

## Invalid nonce.

```bash
eth_sendRawTransaction
  Invalid nonce. Expected X but got X.
```

Reset your account in Metamask.

# We ❤️ these **Ethereum** projects:

- [Hardhat 👷](https://hardhat.org/)
- [Hardhat-deploy 🤘](https://hardhat.org/plugins/hardhat-deploy.html)
- [Typechain 🔌](https://github.com/ethereum-ts/Typechain#readme)
- [@typechain/hardhat 🧙‍♀️](https://hardhat.org/plugins/hardhat-typechain.html)
- [ethers.js v5 🎉](https://github.com/ethers-io/ethers.js#readme)
- [web3modal 💸](https://github.com/Web3Modal/web3modal#web3modal)
- [ts-morph 🏊‍♂️](https://github.com/dsherret/ts-morph)
- [@symfoni/hardhat-react 🎻](https://www.npmjs.com/package/@symfoni/hardhat-react)
- [hardhat-react-boilerplate 🎸](https://github.com/symfoni/hardhat-react-boilerplate)
