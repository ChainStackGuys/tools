import { ethers } from 'hardhat';
import { assert, expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber, Contract, ContractFactory, utils } from 'ethers';

describe('CustomToken contract', async () => {
  const fifty = utils.parseEther('50');
  const hundred = utils.parseEther('100');
  const decimals = 18;
  let Factory: ContractFactory;
  let instance: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let rest: SignerWithAddress[];

  // `beforeEach` 将在每一次测试时运行, 每一次测试时重新部署合约.
  beforeEach(async () => {
    // Get the Signers and ContractFactory here.
    Factory = await ethers.getContractFactory('CustomToken');
    const accounts: SignerWithAddress[] = await ethers.getSigners();
    assert(
      accounts.length > 0,
      `Accounts length (${accounts.length}) should be more then zero`
    );
    console.log('\t accounts.length =', accounts.length);
    // first is the default account
    [owner, addr1, addr2, ...rest] = accounts;

    // To deploy our contract, we just have to call Factory.deploy() and await for
    // it to be deployed(), which happens onces its transaction has been mined.
    instance = await Factory.deploy(
      'DogToken',
      'DOG',
      decimals,
      utils.parseEther('1000')
    );
    // wait until the transaction is mined
    await instance.deployed();
  });

  describe('Deployment', () => {
    it('Should get the chainId', async () => {
      const chainId = await owner.getChainId();
      console.log('\t current chainId =', chainId);
      expect(chainId).to.gt(0);
    });

    // If the callback function is async, Mocha will `await` it.
    it('Should set the right owner', async () => {
      expect(await instance.owner()).to.equal(owner.address);
    });

    it('Should set the right decimals', async () => {
      // const d = await instance.decimals();
      // console.log('decimals', d, typeof d);
      expect(await instance.decimals()).to.equal(decimals);
    });
  });

  describe('Transactions', async () => {
    it('Should transfer tokens between accounts', async () => {
      const ownerBalance: BigNumber = await instance.balanceOf(owner.address);

      expect(await instance.totalSupply()).to.equal(ownerBalance);

      // Transfer fifty tokens from owner to addr1
      await instance.transfer(addr1.address, fifty);
      expect(await instance.balanceOf(addr1.address)).to.equal(fifty);

      // 使用 Contract 的 connect() 方法将其连接到其他帐户
      instance = instance.connect(addr1);
      expect(instance.signer).to.equal(addr1);
      // Transfer fifty tokens from addr1 to addr2
      await instance.transfer(addr2.address, fifty);
      expect(await instance.balanceOf(addr1.address)).to.equal(0);
      expect(await instance.balanceOf(addr2.address)).to.equal(fifty);
    });

    it(`Should fail if sender doesn’t have enough tokens`, async () => {
      const initialOwnerBalance: BigNumber = await instance.balanceOf(
        owner.address
      );
      console.log(
        '\t initialOwnerBalance =',
        utils.formatEther(initialOwnerBalance)
      );
      // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
      // EVM `require` will evaluate false and revert the transaction.
      // note: await expect
      await expect(
        instance.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith('ERC20: transfer amount exceeds balance');

      // Owner balance shouldn't have changed.
      expect(await instance.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it('Should update balances after transfer', async function () {
      const initialOwnerBalance: BigNumber = await instance.balanceOf(
        owner.address
      );

      // Transfer fifty tokens from owner to addr1.
      await instance.transfer(addr1.address, fifty);

      // Transfer another hundred tokens from owner to addr2.
      await instance.transfer(addr2.address, hundred);

      // Check balances.
      const finalOwnerBalance: BigNumber = await instance.balanceOf(
        owner.address
      );
      console.log(
        '\t finalOwnerBalance =',
        utils.formatEther(finalOwnerBalance)
      );
      expect(finalOwnerBalance).to.equal(
        initialOwnerBalance.sub(fifty).sub(hundred)
      );

      const addr1Balance: BigNumber = await instance.balanceOf(addr1.address);
      console.log('\t addr1Balance =', utils.formatEther(addr1Balance));
      expect(addr1Balance).to.equal(fifty);

      const addr2Balance: BigNumber = await instance.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(hundred);
    });
  });
});
