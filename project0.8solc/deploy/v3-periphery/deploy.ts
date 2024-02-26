import {
  deployContract,
  getWallet,
} from "../utils";
import { ContractFactory, ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { linkLibraries } from "./util/linkLibraries";
import bn from "bignumber.js";
import { Contract, utils, BigNumber } from "ethers";

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

  // SwapRouterContract: 0x619a703eaFB106fF7bCe1dE21D986100396C93AC

  const SwapRouterContract = await deployContract("SwapRouter", [
    pancakeV3PoolDeployer_address,
    pancakeV3Factory_address,
    WETH,
  ]);

  console.log("SwapRouterContract:", SwapRouterContract.address);

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );

  // const nftDescriptor = await deployContract("NFTDescriptor");

  // console.log("nftDescriptor", nftDescriptor.address);

  // nftDescriptor 0x50C5291FD3B6Dc1F5a5018bD05267f7Ca453f477
  // const nftDescriptorEx = await deployContract("NFTDescriptorEx");

  // console.log("nftDescriptorEx", nftDescriptorEx.address);
  // nftDescriptorEx 0x664a111Bfb08dD1101Fa78222451f942F6F81c8C
  const linkedBytecode = linkLibraries(
    {
      bytecode: artifacts.NonfungibleTokenPositionDescriptor.bytecode,
      linkReferences: {
        "NFTDescriptor.sol": {
          NFTDescriptor: [
            {
              length: 20,
              start: 1261,
            },
          ],
        },
      },
    },
    {
      NFTDescriptor: "0x50C5291FD3B6Dc1F5a5018bD05267f7Ca453f477",
    }
  );

  // const nonfungibleTokenPositionDescriptor =
  //   await deployContractWithLinkedBytecode(
  //     "NonfungibleTokenPositionDescriptor",
  //     linkedBytecode,
  //     [WETH, asciiStringToBytes32("ETH"), "0x664a111Bfb08dD1101Fa78222451f942F6F81c8C"]
  //   );

  // const NonfungibleTokenPositionDescriptor = new ContractFactory(
  //   artifacts.NonfungibleTokenPositionDescriptor.abi,
  //   linkedBytecode,
  //   owner
  // );

  // const nonfungibleTokenPositionDescriptor =
  //   await NonfungibleTokenPositionDescriptor.deploy(
  //     WETH,
  //     asciiStringToBytes32("ETH"),
  //     nftDescriptorEx.address
  //   );

  // Contract address: 0xa64677C30AfdD45bf1A9A4C22C0fF30AB7aC10B6
  //   "NonfungibleTokenPositionDescriptor" was successfully deployed:
  //  - Contract address: 0xd2921dE82F9cfF2cC5d43A1E17d3bb6219bC25d0

  // console.log(
  //   "nonfungibleTokenPositionDescriptor",
  //   nonfungibleTokenPositionDescriptor.address
  // );

  // console.log(
  //   "deployer:",
  //   deployer.address,
  //   formatEther(await deployer.getBalance())
  // );

  // const nonfungiblePositionManager = await deployContract(
  //   "NonfungiblePositionManager",
  //   [
  //     pancakeV3PoolDeployer_address,
  //     pancakeV3Factory_address,
  //     WETH,
  //     "0xa64677C30AfdD45bf1A9A4C22C0fF30AB7aC10B6",
  //   ]
  // );
  // console.log("nonfungiblePositionManager", nonfungiblePositionManager.address);

  // nonfungiblePositionManager 0xF614209f521370bB124b86E3F9ab50F5da51aE2f

//   "NonfungiblePositionManager" was successfully deployed:
//  - Contract address: 0x4156cF086D836885B0f0c8Bbe12dDD77eCDBf658
  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );
}
