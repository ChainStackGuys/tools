import React, { useContext, useState, useCallback, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Statistic, Row, Col } from 'antd';
import { useIntl } from 'umi';
import { utils } from 'ethers';
import { noop } from 'lodash';

import {
  BalanceCheckerContext,
  CurrentAddressContext,
  CustomTokenContext,
  ProviderContext,
  SignerContext,
  TokenAirdropContext,
} from '@/hardhat/SymfoniContext';
import tokens from '@/constants/tokens.json';

interface Props {}

type AirdropData = {
  token: string;
  accounts: string;
  amount: number;
};

type TokenData = {
  address: string;
  chainId: number;
  name: string;
  symbol: string;
  decimal: number;
  logoURI: string;
  balance?: string;
};

type Tokens = {
  [name: string]: TokenData;
};

const Airdrop: React.FC<Props> = () => {
  const intl = useIntl();
  const [signer, setSigner] = useContext(SignerContext);
  const [provider, setProvider] = useContext(ProviderContext);
  const [currentAddress, setCurrentAddress] = useContext(CurrentAddressContext);
  const airdrop = useContext(TokenAirdropContext);
  const customToken = useContext(CustomTokenContext);
  const balanceChecker = useContext(BalanceCheckerContext);
  const [eth, setEth] = useState('');
  const [state, setState] = useState<AirdropData>({ token: '', accounts: '', amount: 0 });
  const [tokenList, setTokenList] = useState<TokenData[]>([]);

  useEffect(() => {
    const doAsync = async () => {
      await getBalances();
    };
    doAsync().then(noop);
    return () => {};
  }, [balanceChecker]);

  const getEth = useCallback(async () => {
    if (!airdrop.instance) return;
    const balance = await airdrop.instance.provider.getBalance(airdrop.instance.address);
    const etherString = utils.formatEther(balance);
    console.log('Contract Balance => ', etherString, balance.toString());
    setEth(() => etherString);
  }, [airdrop]);

  useEffect(() => {
    if (!airdrop.instance) return;
    airdrop.instance.on('Receive', (from, value, ...rest) => {
      console.log('onReceive', from, value, rest);
      getEth().then(noop);
    });
  }, [airdrop, getEth]);

  const getBalances = async () => {
    if (!balanceChecker.instance) return;
    if (!currentAddress) {
      console.error('????????????????????????');
      return;
    }
    let addresses: string[] = [];
    let addressMap: Tokens = {};
    tokens.forEach((token) => {
      addresses.push(token.address);
      addressMap[token.address] = token;
    });

    const balances = await balanceChecker.instance.balances([currentAddress], addresses);
    const list = balances.map((v, i) => {
      const data = addressMap[addresses[i]];
      data.balance = utils.formatEther(v);
      console.log(data.symbol, utils.formatEther(v));
      return data;
    });
    setTokenList(list);
  };

  /**
   *
   * @param token ???????????????????????????
   * @param address ??????????????????????????????
   * @returns
   */
  const handleApprove = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // ??????Provider ????????????????????????????????????????????????
    if (!signer) {
      console.error('signer instance not ready');
      return;
    }
    if (!customToken.instance) {
      console.error('customToken instance not ready');
      return;
    }
    if (!airdrop.instance) {
      console.error('TokenAirdrop instance not ready');
      return;
    }

    const { token, amount } = state;
    // const tokenInstance = new ethers.Contract(token, abi, provider);
    const tokenInstance = customToken.instance.attach(token).connect(signer);
    // ??????????????????????????????????????? approve ???????????????????????????
    const approve = await tokenInstance.approve(
      airdrop.instance.address,
      utils.parseEther(amount.toString()), // ?????????????????????????????????
    );
    await approve.wait();
  };

  const handleAirdrop = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!airdrop.instance) {
      console.error('TokenAirdrop instance not ready');
      return;
    }
    const { token, accounts, amount } = state;
    console.log('token, accounts, amount', token, accounts, amount);
    // await handleApprove(token, airdrop.instance.address, amount)

    const list = accounts.split(',').map((v) => v.trim());
    // const gas = await airdrop.instance.estimateGas.airdrop(
    //   token,
    //   list,
    //   utils.parseEther(amount.toString()),
    // );
    // console.log('gas', gas);
    // return;
    const tx = await airdrop.instance.airdropWithAmount(
      token,
      list,
      utils.parseEther(amount.toString()),
      {
        value: utils.parseEther('0.1'),
      },
    );
    console.log('airdrop tx', tx);
    await tx.wait();
    console.log('airdrop mined');
    await getEth();
  };

  const handleWithdraw = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!airdrop.instance) {
      console.error('TokenFactory instance not ready');
      return;
    }
    const tx = await airdrop.instance.withdraw('0x0', utils.parseEther(eth));
    console.log('withdraw tx', tx);
    await tx.wait();
    console.log('withdraw mined');
    await getEth();
  };

  const changeHandle = (_: any, values: AirdropData) => {
    setState(values);
  };

  return (
    <>
      <Form name="airdrop" layout="vertical" onValuesChange={changeHandle}>
        <Form.Item
          name="token"
          label={intl.formatMessage({ id: 'pages.airdrop.token' })}
          tooltip={intl.formatMessage({ id: 'pages.airdrop.token.tip' })}
          rules={[{ type: 'string', len: 42 }]}
        >
          <Input style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          name="accounts"
          label={intl.formatMessage({ id: 'pages.airdrop.accounts' })}
          tooltip={{ title: intl.formatMessage({ id: 'pages.airdrop.accounts.tip' }) }}
        >
          <Input style={{ width: 300 }} placeholder="0x48E91dF1c5B0037a63c16f9747aCDED8E037AC83" />
        </Form.Item>
        <Form.Item
          name="amount"
          label={intl.formatMessage({ id: 'pages.airdrop.amount' })}
          tooltip={{ title: intl.formatMessage({ id: 'pages.airdrop.amount.tip' }) }}
          rules={[{ type: 'number', min: 0, max: 9000000000000000 }]}
        >
          <InputNumber style={{ width: 300 }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" style={{ width: 300 }} onClick={handleApprove}>
            ??????
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" style={{ width: 300 }} onClick={handleAirdrop}>
            {intl.formatMessage({ id: 'pages.airdrop.submit' })}
          </Button>
        </Form.Item>
      </Form>
      <Row gutter={16}>
        <Col span={12}>
          <Statistic title="Contract Balance (ETH)" value={eth} precision={8} />
          <Button style={{ marginTop: 16, width: 300 }} type="primary" onClick={handleWithdraw}>
            ??????
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Airdrop;
