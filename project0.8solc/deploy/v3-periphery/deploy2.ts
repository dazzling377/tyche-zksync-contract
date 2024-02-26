import {
  deployContract,
  deployProxyContract,
  getWallet,
} from "../utils";
import { ContractFactory, ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { linkLibraries } from "./util/linkLibraries";
import bn from "bignumber.js";
import { Contract, utils, BigNumber } from "ethers";
import * as hre from "hardhat";

// const hre = require("hardhat");

type ContractJson = { abi: any; bytecode: string };
const artifacts: { [name: string]: ContractJson } = {
  QuoterV2: require("../../artifacts-zk/contracts/v3-periphery/contracts/lens/QuoterV2.sol/QuoterV2.json"),
  TickLens: require("../../artifacts-zk/contracts/v3-periphery/contracts/lens/TickLens.sol/TickLens.json"),
  V3Migrator: require("../../artifacts-zk/contracts/v3-periphery/contracts/V3Migrator.sol/V3Migrator.json"),
  PancakeInterfaceMulticall: require("../../artifacts-zk/contracts/v3-periphery/contracts/lens/PancakeInterfaceMulticall.sol/PancakeInterfaceMulticall.json"),
  NonfungibleTokenPositionDescriptorOffChain: require("../../artifacts-zk/contracts/v3-periphery/contracts/NonfungibleTokenPositionDescriptorOffChain.sol/NonfungibleTokenPositionDescriptorOffChain.json"),

  // eslint-disable-next-line global-require
  SwapRouter: require("../../artifacts-zk/contracts/v3-periphery/contracts/SwapRouter.sol/SwapRouter.json"),
  // eslint-disable-next-line global-require
  NFTDescriptor: require("../../artifacts-zk/contracts/v3-periphery/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json"),
  // eslint-disable-next-line global-require
  NFTDescriptorEx: require("../../artifacts-zk/contracts/v3-periphery/contracts/NFTDescriptorEx.sol/NFTDescriptorEx.json"),
  // eslint-disable-next-line global-require
  NonfungibleTokenPositionDescriptor: require("../../artifacts-zk/contracts/v3-periphery/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json"),
  // eslint-disable-next-line global-require
  NonfungiblePositionManager: require("../../artifacts-zk/contracts/v3-periphery/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
};

bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });
function encodePriceSqrt(reserve1: any, reserve0: any) {
  return BigNumber.from(
    // eslint-disable-next-line new-cap
    new bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      // eslint-disable-next-line new-cap
      .multipliedBy(new bn(2).pow(96))
      .integerValue(3)
      .toString()
  );
}

function isAscii(str: string): boolean {
  return /^[\x00-\x7F]*$/.test(str);
}
function asciiStringToBytes32(str: string): string {
  if (str.length > 32 || !isAscii(str)) {
    throw new Error("Invalid label, must be less than 32 characters");
  }

  return "0x" + Buffer.from(str, "ascii").toString("hex").padEnd(64, "0");
}

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

  const pancakeV3PoolDeployer_address =
    "0x9735F1071D2D3A56715e0686F0cfB87Dd5C1C57f";
  const pancakeV3Factory_address = "0x0ff560A617a4EeB7B5D1f4108F428d900983BB74";

  const WETH = "0x02968DB286f24cB18bB5b24903eC8eBFAcf591C0";




  // await tryVerify(nonfungibleTokenPositionDescriptor)

  // const NonfungiblePositionManager = new ContractFactory(
  //   artifacts.NonfungiblePositionManager.abi,
  //   artifacts.NonfungiblePositionManager.bytecode,
  //   owner
  // );
  // const nonfungiblePositionManager = await NonfungiblePositionManager.deploy(
  //   pancakeV3PoolDeployer_address,
  //   pancakeV3Factory_address,
  //   config.WNATIVE,
  //   nonfungibleTokenPositionDescriptor.address
  // );

  const nonfungiblePositionManager = await deployContract(
    "NonfungiblePositionManager",
    [
      pancakeV3PoolDeployer_address,
      pancakeV3Factory_address,
      WETH,
      "0x6aBbC08df061AF08B1223aE53813ce075FF5E0d8",
    ]
  );
  console.log("nonfungiblePositionManager", nonfungiblePositionManager.address);

  // nonfungiblePositionManager 0x22a169C7Ccb54958DDf55871508372fEe1E6E8c5

  // const tickLens = await deployContract("TickLens");
  // console.log("TickLens", tickLens.address);
  // // TickLens 0x7fA906967bA6f5B6DEd3282aF96099907E5030E4
  // const quoterV2 = await deployContract("QuoterV2", [
  //   pancakeV3PoolDeployer_address,
  //   pancakeV3Factory_address,
  //   WETH,
  // ]);
  // console.log("QuoterV2", quoterV2.address);
  // // QuoterV2  0x644169b5f35Fc39eAe79347FA534d10C91D50346

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );
}
