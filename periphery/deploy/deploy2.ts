import {
  deployContract,
  getWallet,
} from "./utils";
import { ContractFactory, ethers } from "ethers";
import { formatEther } from "ethers";

// This script is used to deploy an NFT contract
// as well as verify it on Block Explorer if possible for the network
export default async function () {
  const deployer = getWallet();
  const owner = getWallet();

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );

  // const PoolAddressTest = await deployContract("PoolAddressTest");


  const pancakeV3PoolDeployer_address =
    "0xE6ce7b370EB40220525Db2003E0CaE258895e3ad";
  const pancakeV3Factory_address = "0x14ba9B8fac9fc25541861F196D8C227fA96E7B1E";

  const WETH = "0x02968DB286f24cB18bB5b24903eC8eBFAcf591C0";

  // const nonfungiblePositionManager = await deployContract(
  //   "NonfungiblePositionManager",
  //   [
  //     pancakeV3PoolDeployer_address,
  //     pancakeV3Factory_address,
  //     WETH,
  //     "0x6aBbC08df061AF08B1223aE53813ce075FF5E0d8",
  //   ]
  // );
  // console.log("nonfungiblePositionManager", nonfungiblePositionManager.target);


  const SwapRouterContract = await deployContract("SwapRouter", [
    pancakeV3PoolDeployer_address,
    pancakeV3Factory_address,
    WETH,
  ]);

  console.log("SwapRouterContract:", SwapRouterContract.target);

  const tickLens = await deployContract("TickLens");
  console.log("TickLens", tickLens.target);
  // TickLens 0x7fA906967bA6f5B6DEd3282aF96099907E5030E4
  const quoterV2 = await deployContract("QuoterV2", [
    pancakeV3PoolDeployer_address,
    pancakeV3Factory_address,
    WETH,
  ]);
  console.log("QuoterV2", quoterV2.target);
  // QuoterV2  0x644169b5f35Fc39eAe79347FA534d10C91D50346

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );
}
