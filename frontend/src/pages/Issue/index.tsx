import React, { useContext, useState, useEffect, useCallback } from 'react';
import { utils } from 'ethers';
import { Form, Input, InputNumber, Button, Statistic, Row, Col } from 'antd';
import { useIntl } from 'umi';
import { noop } from 'lodash';

import { TokenFactoryContext } from '@/hardhat/SymfoniContext';

interface Props {}

type CreateTokenData = { name: string; symbol: string; decimals: string; supply: string };

const Issue: React.FC<Props> = () => {
  const intl = useIntl();
  const factory = useContext(TokenFactoryContext);
  const [eth, setEth] = useState('');

  useEffect(() => {
    if (!factory.instance) return;
    console.log('TokenFactory is deployed at ', factory.instance.address);
  }, [factory]);

  const getEth = useCallback(async () => {
    if (!factory.instance) return;
    const balance = await factory.instance.provider.getBalance(factory.instance.address);
    const etherString = utils.formatEther(balance);
    console.log('Contract Balance => ', etherString, balance.toString());
    setEth(() => etherString);
  }, [factory]);

  useEffect(() => {
    if (!factory.instance) return;
    factory.instance.on('Receive', (from, value, ...rest) => {
      console.log('onReceive', from, value, rest);
      getEth().then(noop);
    });
  }, [factory, getEth]);

  useEffect(() => {
    const doAsync = async () => {
      await getEth();
    };
    doAsync().then(noop);
  }, [getEth]);

  // const handleCreateToken = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   e.preventDefault();
  // };

  const handleCreateToken = async (values: CreateTokenData) => {
    console.log('handleCreateToken values =>', values);
    if (!factory.instance) {
      console.error('TokenFactory instance not ready');
      return;
    }
    console.log('handleCreateToken tx start...');
    const { name, symbol, decimals, supply } = values;
    console.log('name, symbol, decimals, supply', name, symbol, decimals, supply);
    // const gasLimit = await factory.instance.estimateGas.createToken(name, symbol, decimals, utils.parseEther(supply));
    // console.log('gasLimit =>', gasLimit);
    // return;
    const tx = await factory.instance.createToken(
      name,
      symbol,
      decimals,
      utils.parseEther(supply),
      {
        value: utils.parseEther('0.05'),
      },
    );
    console.log('handleCreateToken tx', tx);
    await tx.wait();
    console.log('handleCreateToken mined');
    // await getEth();
  };

  const handleWithdraw = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!factory.instance) {
      console.error('TokenFactory instance not ready');
      return;
    }
    const tx = await factory.instance.withdraw('0x0', utils.parseEther(eth));
    console.log('withdraw tx', tx);
    const res = await tx.wait();
    console.log('withdraw mined', res);
    // await getEth();
  };

  return (
    <>
      <Form name="issueToken" layout="vertical" onFinish={handleCreateToken}>
        <Form.Item
          name="name"
          label={intl.formatMessage({ id: 'pages.issue.name' })}
          tooltip={intl.formatMessage({ id: 'pages.issue.name.tip' })}
          rules={[
            {
              type: 'string',
              pattern: /^\w{2,30}$/,
              message: intl.formatMessage({ id: 'pages.issue.name.pattern' }),
            },
          ]}
        >
          <Input style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          name="symbol"
          label={intl.formatMessage({ id: 'pages.issue.symbol' })}
          tooltip={{ title: intl.formatMessage({ id: 'pages.issue.symbol.tip' }) }}
          rules={[
            {
              type: 'string',
              pattern: /^[A-Za-z0-9]{2,10}$/,
              message: intl.formatMessage({ id: 'pages.issue.symbol.pattern' }),
            },
          ]}
        >
          <Input style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          name="decimals"
          label={intl.formatMessage({ id: 'pages.issue.decimals' })}
          rules={[{ type: 'integer', min: 0, max: 18 }]}
        >
          <InputNumber style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          name="supply"
          label={intl.formatMessage({ id: 'pages.issue.supply' })}
          rules={[{ type: 'integer', min: 1, max: 9000000000000000 }]}
        >
          <InputNumber style={{ width: 300 }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: 300 }}>
            {intl.formatMessage({ id: 'pages.issue.create' })}
          </Button>
        </Form.Item>
      </Form>
      <Row gutter={16}>
        <Col span={12}>
          <Statistic title="Contract Balance (ETH)" value={eth} precision={8} />
          <Button style={{ marginTop: 16, width: 300 }} type="primary" onClick={handleWithdraw}>
            取款
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Issue;
