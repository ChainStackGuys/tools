import React, { useContext, useEffect, useState } from 'react';
import {
  CurrentAddressContext,
  CustomTokenContext,
  ProviderContext,
  SignerContext,
} from '@/hardhat/SymfoniContext';
import { Button } from 'antd';
import { utils } from 'ethers';

interface Props {}

const Token: React.FC<Props> = () => {
  const token = useContext(CustomTokenContext);
  const [signer, setSigner] = useContext(SignerContext);
  const [provider, setProvider] = useContext(ProviderContext);
  const [currentAddress, setCurrentAddress] = useContext(CurrentAddressContext);
  const [name, setName] = useState('');
  const [totalSupply, setTotalSupply] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientBalance, setRecipientBalance] = useState('');

  useEffect(() => {
    const doAsync = async () => {
      if (!token.instance) return;
      console.log('Token is deployed at ', token.instance.address);
      setName(await token.instance.name());
      const supply = await token.instance.totalSupply();
      setTotalSupply(utils.formatEther(supply));
      // setMessage(lastTx) TODO: finish
    };
    doAsync();
  }, [token]);

  useEffect(() => {
    console.log('currentAddress', currentAddress);
    const doAsync = async () => {
      setBalance(await checkUserBalance(currentAddress));
    };
    doAsync();
  }, [currentAddress]);

  const amountEntered = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value);

  const recipientAddressEntered = (e: React.ChangeEvent<HTMLInputElement>) =>
    setRecipientAddress(e.target.value);

  const tokenTransfer = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!token.instance) throw Error('Token instance not ready');
    const tx = await token.instance.transfer(recipientAddress, utils.parseEther(amount));
    console.log('tx:', tx);
    await tx.wait();
    // setMessage(tx.toString()); // TODO:
    setBalance(await checkUserBalance(currentAddress));
    setRecipientBalance(await checkUserBalance(recipientAddress));
  };

  // const checkBalanceHandle = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   e.preventDefault();
  //   if (!token.instance) throw Error('Token instance not ready');
  //   const balance = await token.instance.balanceOf(recipientAddress);
  //   setRecipientBalance(utils.formatEther(balance));
  // };

  const checkUserBalance = async (address: string) => {
    if (!token.instance) return '';
    if (!address) {
      console.error('地址不得为空');
      return '';
    }
    const balance = await token.instance.balanceOf(address);
    return utils.formatEther(balance);
  };

  return (
    <div>
      <p>token: {name}</p>
      <p>supply: {totalSupply}</p>
      <p>my balance: {balance}</p>

      <div className="s20"></div>
      <p>send transaction (amount, recipient):</p>
      <div>
        <div>
          <input className="input" placeholder="100" onChange={amountEntered} />
        </div>
        <div>
          <input
            className="input"
            placeholder="0x818c10C013fa411f86725893ec602FD95cb089f1"
            onChange={recipientAddressEntered}
          />
          <p>recipient balance: {recipientBalance}</p>
          {/* <Button color="primary" onClick={checkBalanceHandle}>
            Check
          </Button> */}
        </div>
        <div>
          <Button color="primary" onClick={tokenTransfer}>
            Send
          </Button>
        </div>
      </div>
      <div className="s20"></div>
    </div>
  );
};

export default Token;
