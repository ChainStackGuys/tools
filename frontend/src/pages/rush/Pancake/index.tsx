import React, { useContext, useState } from 'react';
import { TokenAirdropContext } from '@/hardhat/SymfoniContext';
import { utils } from 'ethers';
import hre from 'hardhat';

interface Props {}

const Pancake: React.FC<Props> = () => {
  const airdrop = useContext(TokenAirdropContext);
  const [amount, setAmount] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [accounts, setAccounts] = useState<string>('');

  const handleAirdrop = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!airdrop.instance) {
      console.error('TokenCreator instance not ready');
      return;
    }
    const list = accounts.split(',').map((v) => v.trim());
    const gas = await airdrop.instance.estimateGas.airdrop(token, list, utils.parseEther(amount), {
      value: utils.parseEther('0.1'),
      // gasLimit: 400000,
    });
    console.log('gas', gas);
    // const tx = await airdrop.instance.airdrop(token, list, utils.parseEther(amount), {
    //   value: utils.parseEther('0.01'),
    // });
    // console.log('airdrop tx', tx);
    // await tx.wait();
    // console.log('airdrop mined');
    // await getEth();
  };

  return (
    <div>
      <span>空投:</span>
      <input placeholder="token总数" onChange={(e) => setAmount(e.target.value)} />
      <input placeholder="token地址" onChange={(e) => setToken(e.target.value)} />
      <input placeholder="空投对象地址" onChange={(e) => setAccounts(e.target.value)} />
      <button onClick={handleAirdrop}>空投</button>
    </div>
  );
};

export default Pancake;
