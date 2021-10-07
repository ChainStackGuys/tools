import { ethers } from 'hardhat';
import { assert, expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber, Contract, ContractFactory, utils } from 'ethers';

describe('TokenFactory contract', async () => {
  const fifty = utils.parseEther('50');
  const decimals = 18;
  let Factory: ContractFactory;
  let instance: Contract;
  let customFactory: ContractFactory;
  let customToken: Contract;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  // `beforeEach` 将在每一次测试时运行, 每一次测试时重新部署合约.
  beforeEach(async () => {
    // Get the Signers and ContractFactory here.
    Factory = await ethers.getContractFactory('TokenFactory');
    const accounts: SignerWithAddress[] = await ethers.getSigners();
    assert(
      accounts.length > 0,
      `Accounts length (${accounts.length}) should be more then zero`
    );
    console.log('\t accounts.length =', accounts.length);
    // first is the default account
    [owner, user1, user2] = accounts;

    // To deploy our contract, we just have to call Factory.deploy() and await for
    // it to be deployed(), which happens onces its transaction has been mined.
    instance = await Factory.deploy();
    // wait until the transaction is mined
    await instance.deployed();
  });

  describe('Transactions', () => {
    it('Should get the chainId', async () => {
      const chainId = await owner.getChainId();
      console.log('\t current chainId =', chainId);
      expect(chainId).to.gt(0);
    });

    it('createToken', async () => {
      // 使用 Contract 的 connect() 方法将其连接到其他帐户
      instance = instance.connect(user1);
      expect(instance.signer).to.equal(user1);

      const tx = await instance.createToken(
        'DogToken',
        'DOG',
        decimals,
        utils.parseEther('1000'),
        {
          value: utils.parseEther('0.05'),
        }
      );
      const res = await tx.wait();
      //   console.log('\t res =>', res);
      const address = res.events[0].address;
      customFactory = await ethers.getContractFactory('CustomToken');
      customToken = customFactory.attach(address).connect(user1);
    });

    it('Should set the right owner', async () => {
      expect(await customToken.owner()).to.equal(user1.address);
      const balance: BigNumber = await customToken.balanceOf(user1.address);
      expect(await customToken.totalSupply()).to.equal(balance);
    });

    it('Should update balances after transfer', async () => {
      await customToken.transfer(user2.address, fifty);
      expect(await customToken.balanceOf(user2.address)).to.equal(fifty);
    });
  });
});
