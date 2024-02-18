import { getWallet, deployContract } from "./utils";
import { ethers, Contract } from "ethers";
import { formatEther } from "ethers";
import * as hre from "hardhat";
// import { sortedTokens } from "./test/shared/tokenSort";
import { FeeAmount } from "./test/shared/constants";
// const hre = require("hardhat");
import { encodePriceSqrt } from "./test/shared/encodePriceSqrt";
export async function compareToken(a: Contract, b: Contract) {
  const aAddress = await a.getAddress();
  const bAddress = await b.getAddress();
  return aAddress.toLowerCase() < bAddress.toLowerCase() ? -1 : 1;
}

export async function sortedTokens(a: Contract, b: Contract) {
  const check = await compareToken(a, b);
  return check < 0 ? [a, b] : [b, a];
}

// This script is used to deploy an NFT contract
// as well as verify it on Block Explorer if possible for the network
export default async function main() {
  const deployer = getWallet();

  const poolAddressTestAddress = "0x6037233454917A19E286500e3F994760aAA7B6EF";
  const nftPositionManagerAddress =
    "0x7345B451712e45121a68B43a919687541a703Ae4";

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );

  const WETH = "0x02968DB286f24cB18bB5b24903eC8eBFAcf591C0";

  const tokenArtifacts = await hre.artifacts.readArtifact("MyERC20Token");
  // Initialize contract instance for interaction

  const usdccontract = new Contract(
    "0x120Ea21d56F94D62E49018cBCe6270f8E403fE6F",
    tokenArtifacts.abi,
    deployer // Interact with the contract on behalf of this wallet
  );


  const dtncontract = new Contract(
    "0x97863E4A85cA99AEc56A588674E60C8d4Ab1D311",
    tokenArtifacts.abi,
    deployer // Interact with the contract on behalf of this wallet
  );

  const WETHcontract = new Contract(
    WETH,
    tokenArtifacts.abi,
    deployer // Interact with the contract on behalf of this wallet
  );

  const ttncontract = new Contract(
    "0xBABF0dDcD1D89efFE50aA271B12FED48A8B32BCa",
    tokenArtifacts.abi,
    deployer // Interact with the contract on behalf of this wallet
  );

  const nftPositionManagerArtifacts = await hre.artifacts.readArtifact(
    "NonfungiblePositionManager"
  );

  const nft = new Contract(
    nftPositionManagerAddress,
    nftPositionManagerArtifacts.abi,
    deployer // Interact with the contract on behalf of this wallet
  );

  const pancakeV3PoolDeployer_address = await nft.deployer();

  const pancakeV3Factory_address = await nft.factory();

  console.log(`nft deployer:`, pancakeV3PoolDeployer_address);

  console.log(`nft factory:`, pancakeV3Factory_address);

  const v3FactoryArtifacts = await hre.artifacts.readArtifact(
    "IPancakeV3Factory"
  );
  const v3Factorycontract = new Contract(
    pancakeV3Factory_address,
    v3FactoryArtifacts.abi,
    deployer // Interact with the contract on behalf of this wallet
  );

  const [token0, token1] = await sortedTokens(WETHcontract, usdccontract);

  console.log(`sortedTokens:`, token0.target, token1.target);

  let tx;
  // tx = await nft.createAndInitializePoolIfNecessary(
  //   token0.target,
  //   token1.target,
  //   FeeAmount.MEDIUM,
  //   encodePriceSqrt(1, 1)
  // );
  // console.log(
  //   `Transaction hash of createAndInitializePoolIfNecessary: ${tx.hash}`
  // );

  // await tx.wait();

  const createdPool = await v3Factorycontract.getPool(
    token0.target,
    token1.target,
    FeeAmount.MEDIUM
  );

  console.log(`createdPool from v3 Factory:`, createdPool);

  // const PoolAddressTest = await deployContract("PoolAddressTest");

  const PoolAddressTestArtifacts = await hre.artifacts.readArtifact(
    "PoolAddressTest"
  );
  const PoolAddressTest = new ethers.Contract(
    poolAddressTestAddress,
    PoolAddressTestArtifacts.abi,
    deployer // Interact with the contract on behalf of this wallet
  );

  console.log("PoolAddressTest:", PoolAddressTest.target);

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
      token0.target,
      token1.target,
      FeeAmount.MEDIUM
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
