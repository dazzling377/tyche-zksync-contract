import { deployContract, getWallet } from "../utils";
import { ContractFactory, ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { linkLibraries } from "./util/linkLibraries";
import bn from "bignumber.js";
import { Contract, utils, BigNumber } from "ethers";
import * as hre from "hardhat";
import { sortedTokens } from "../test/shared/tokenSort";
import { FeeAmount } from "../test/shared/constants";
// const hre = require("hardhat");

type ContractJson = { abi: any; bytecode: string };
const artifacts: { [name: string]: ContractJson } = {
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

  const tokenArtifacts = await hre.artifacts.readArtifact("MyERC20Token");
  // Initialize contract instance for interaction
  const dtncontract = new ethers.Contract(
    "0x97863E4A85cA99AEc56A588674E60C8d4Ab1D311",
    tokenArtifacts.abi,
    deployer // Interact with the contract on behalf of this wallet
  );

  const ttncontract = new ethers.Contract(
    "0xBABF0dDcD1D89efFE50aA271B12FED48A8B32BCa",
    tokenArtifacts.abi,
    deployer // Interact with the contract on behalf of this wallet
  );

  const v3FactoryArtifacts = await hre.artifacts.readArtifact(
    "PancakeV3Factory"
  );
  const v3Factorycontract = new ethers.Contract(
    "0x0ff560A617a4EeB7B5D1f4108F428d900983BB74",
    v3FactoryArtifacts.abi,
    deployer // Interact with the contract on behalf of this wallet
  );

  const nftPositionManagerArtifacts = await hre.artifacts.readArtifact(
    "NonfungiblePositionManager"
  );

  const nft = new ethers.Contract(
    "0x73b4eC60D25CA25a1DE01F2Bbe8b28532E9048e7",
    nftPositionManagerArtifacts.abi,
    deployer // Interact with the contract on behalf of this wallet
  );
  console.log(`nft deployer:`, await nft.deployer());

  console.log(`nft factory:`, await nft.factory());

  const [token0, token1] = sortedTokens(dtncontract, ttncontract);

  console.log(`sortedTokens:`, token0.address, token1.address);

  const createdPool = await v3Factorycontract.getPool(
    token0.address,
    token1.address,
    FeeAmount.MEDIUM
  );

  

  console.log(`createdPool from v3 Factory:`, createdPool);



//   const PoolAddressTest = await deployContract("PoolAddressTest");

  const PoolAddressTestArtifacts = await hre.artifacts.readArtifact(
    "PoolAddressTest"
  );
  const PoolAddressTest = new ethers.Contract(
    "0x24982dDE432C06ef42ad4D1886DCeB2f859ccef9",
    PoolAddressTestArtifacts.abi,
    deployer // Interact with the contract on behalf of this wallet
  );


  console.log("PoolAddressTest:", PoolAddressTest.address);

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );

  console.log(
    "PoolAddressTest POOL_INIT_CODE_HASH:",
    await PoolAddressTest.POOL_INIT_CODE_HASH()
  );

  console.log(
    "PoolAddressTest computeAddress:",
    await PoolAddressTest.computeAddress(
      pancakeV3PoolDeployer_address,
      token0.address,
      token1.address,
      FeeAmount.MEDIUM
    )
  );

  console.log(
    "PoolAddressTest computeAddress:",
    await PoolAddressTest.computeAddress(
      deployer.address,
      token0.address,
      token1.address,
      FeeAmount.MEDIUM
    )
  );
}
