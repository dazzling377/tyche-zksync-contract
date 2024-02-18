import { deployContract, getWallet } from "./utils";
import { formatEther } from "ethers";
// This script is used to deploy an NFT contract
// as well as verify it on Block Explorer if possible for the network
export default async function () {
  const deployer = getWallet();

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );

  const pancakeV3PoolDeployerContract = await deployContract(
    "PancakeV3PoolDeployer"
  );

  const pancakeV3PoolDeployerAddress =
    await pancakeV3PoolDeployerContract.getAddress();

  console.log("pancakeV3PoolDeployerContract:", pancakeV3PoolDeployerAddress);

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );

  const pancakeV3FactoryContract = await deployContract("PancakeV3Factory", [
    pancakeV3PoolDeployerAddress,
  ]);
  const v3FactoryAddress = await pancakeV3FactoryContract.getAddress();

  console.log("pancakeV3FactoryContract:", v3FactoryAddress);

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );

  // // Run contract read function
  // const response = await pancakeV3PoolDeployerContract.greet();
  // console.log(`Current message is: ${response}`);

  // Run contract write function
  const transaction = await pancakeV3PoolDeployerContract.setFactoryAddress(
    v3FactoryAddress
  );
  console.log(`Transaction hash of setFactoryAddress: ${transaction.hash}`);

  // Wait until transaction is processed
  await transaction.wait();

  console.log("setFactoryAddress finish");

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );

  // pancakeV3PoolDeployerContract: 0xE6ce7b370EB40220525Db2003E0CaE258895e3ad
  // pancakeV3FactoryContract: 0x14ba9B8fac9fc25541861F196D8C227fA96E7B1E
}
