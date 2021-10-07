import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { utils } from 'ethers';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();
  const contractName = 'CustomToken';
  // 检查是否是自己的地址
  console.log(contractName, '创建者地址:', deployer);
  // 以下只会在未部署过或合约代码有改变时执行部署
  await deploy(contractName, {
    from: deployer,
    contract: contractName,
    args: ['DogToken', 'DOG', 18, utils.parseEther('100000000')],
    log: true,
  });
  // console.log(contractName, '合约部署地址:', result.address);
};

export default func;
