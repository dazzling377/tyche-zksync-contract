import { deployContract, getWallet } from "../utils";
import { ContractFactory } from "ethers";
import { formatEther } from "ethers";
import * as hre from "hardhat";

// const ethers = hre.ethers;

// import { ethers, network } from "hardhat";
// This script is used to deploy an NFT contract
// as well as verify it on Block Explorer if possible for the network
export default async function () {
  const deployer = getWallet();

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );

  // const PoolAddressTest = await deployContract("PoolAddressTest");

  const pancakeV3PoolDeployer_address =
    "0xE6ce7b370EB40220525Db2003E0CaE258895e3ad";
  const pancakeV3Factory_address = "0x14ba9B8fac9fc25541861F196D8C227fA96E7B1E";

  const positionManager_address = "0x7345B451712e45121a68B43a919687541a703Ae4";

  const WETH = "0x02968DB286f24cB18bB5b24903eC8eBFAcf591C0";

  // const smartRouterHelper = await await deployContract("SmartRouterHelper");
  //  smartRouterHelper 0xce79ff535c57926A6f9436922498C0c2A7429119
  // console.log("smartRouterHelper:", smartRouterHelper.target);

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );

  // return;


  const zeroAddress = "0x0000000000000000000000000000000000000000";

  // const SmartRouter = await ethers.getContractFactory("SmartRouter", {
  //   libraries: {
  //     SmartRouterHelper: smartRouterHelper.address,
  //   },
  // });

  // const smartRouter = await SmartRouter.deploy(
  //     config.factoryV2[networkName],
  //     config.factoryV3[networkName],
  //     config.positionManager[networkName],
  //     config.stableFactory[networkName],
  //     config.stableInfo[networkName],
  //     config.WETH[networkName],
  // );

  // await smartRouter.deployed();

  const smartRouter = await deployContract("SmartRouter", [
    zeroAddress,
    pancakeV3PoolDeployer_address,
    pancakeV3Factory_address,
    positionManager_address,
    zeroAddress,
    zeroAddress,
    WETH,
  ]);

  console.log("SmartRouter deployed to:", smartRouter.target);

  // SmartRouter deployed to: 0x724E6256EF01ad1c05E1D415Dd6F2D26C71e2A32

  // const smartRouter = await SmartRouter.deploy(
  //   config.v2Factory,
  //   pancakeV3PoolDeployer_address,
  //   pancakeV3Factory_address,
  //   positionManager_address,
  //   config.stableFactory,
  //   config.stableInfo,
  //   config.WNATIVE
  // );


  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );
}
