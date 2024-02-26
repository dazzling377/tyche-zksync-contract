import { deployContract, getWallet } from "../utils";
import { ContractFactory } from "ethers";
import { formatEther } from "ethers/lib/utils";
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

  console.log(
    "pancakeV3PoolDeployerContract:",
    pancakeV3PoolDeployerContract.address
  );

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );

  const pancakeV3FactoryContract = await deployContract("PancakeV3Factory", [
    pancakeV3PoolDeployerContract.address,
  ]);

  console.log("pancakeV3FactoryContract:", pancakeV3FactoryContract.address);

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
    pancakeV3FactoryContract.address
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

  // // pancakeV3PoolDeployerContract:  0x6F3a415d6E577322A259CCE2214371B09c33BB64
  // // pancakeV3FactoryContract:  0x53C361887aa789fF66097758a51c0aFE9331052f

    // pancakeV3PoolDeployerContract:  0x9735F1071D2D3A56715e0686F0cfB87Dd5C1C57f
  // pancakeV3FactoryContract:  0x0ff560A617a4EeB7B5D1f4108F428d900983BB74
  // 0x31ce3ccd3eb517b0485138e8f612f8e345f49eeb626a71efbd7c5a547794bf57

  ///0x283fe30302338b1ee0071ef5aee34684d7f92e64cbdd8ccc73f28fc7c8ea7d9a

}
