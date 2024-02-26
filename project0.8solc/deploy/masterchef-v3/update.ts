import { deployContract, deployProxyContract, getWallet } from "../utils";

import { formatEther, parseEther, parseUnits } from "ethers/lib/utils";

import bn from "bignumber.js";
import { Contract, utils, BigNumber, ethers } from "ethers";
import * as hre from "hardhat";

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
    "0xE6ce7b370EB40220525Db2003E0CaE258895e3ad";
  const pancakeV3Factory_address = "0x14ba9B8fac9fc25541861F196D8C227fA96E7B1E";

  const WETH = "0x02968DB286f24cB18bB5b24903eC8eBFAcf591C0";

  const nftPositionManagerAddress =
    "0x7345B451712e45121a68B43a919687541a703Ae4";

  const dtnAddress = "0x97863E4A85cA99AEc56A588674E60C8d4Ab1D311";

  const masterChefV3Address = "0x863b2ab784af474Fb216066822123610F1A4dA41";

  const pancakeV3LmPoolDeployer = "0x7409C182cde6f553d7C2379121e6686dfBaAD340";

  const tokenArtifacts = await hre.artifacts.readArtifact("MyERC20Token");
  // Initialize contract instance for interaction
  const dtncontract = new Contract(
    "0x97863E4A85cA99AEc56A588674E60C8d4Ab1D311",
    tokenArtifacts.abi,
    deployer // Interact with the contract on behalf of this wallet
  );

  const ttncontract = new Contract(
    "0xBABF0dDcD1D89efFE50aA271B12FED48A8B32BCa",
    tokenArtifacts.abi,
    deployer // Interact with the contract on behalf of this wallet
  );

  //   const masterChefV3 = await deployContract("MasterChefV3", [
  //     dtnAddress,
  //     nftPositionManagerAddress,
  //     WETH,
  //   ]);
  //   console.log("masterChefV3", masterChefV3.address);
  // masterChefV3 0x0cFa5EaC08b90d33c789F48236409b55D12896f2

  const MasterChefV3Artifact = await hre.artifacts.readArtifact("MasterChefV3");
  // Initialize contract instance for interaction
  const masterChefV3 = new Contract(
    masterChefV3Address,
    MasterChefV3Artifact.abi,
    deployer // Interact with the contract on behalf of this wallet
  );
  console.log("start approve");

  let transaction;

  transaction = await masterChefV3.setLMPoolDeployer(
    pancakeV3LmPoolDeployer
  );
  console.log(
    `Transaction hash of masterChefV3 setLMPoolDeployer : ${transaction.hash}`
  );

  // Wait until transaction is processed
  await transaction.wait();

  console.log("Start approve of dtn to chefv3")

  transaction = await dtncontract.approve(
    masterChefV3Address,
    ethers.constants.MaxUint256
  );
  // Wait until transaction is processed
  await transaction.wait();

  console.log("start set receiver self");
  transaction = await masterChefV3.setReceiver(deployer.address);
  await transaction.wait();

  console.log("start start upkeep  for farm tyche reward");

  //   function upkeep(uint256 _amount, uint256 _duration, bool _withUpdate) external onlyReceiver {
  const duration = 3600 * 24 * 25;
  transaction = await masterChefV3.upkeep(parseEther("100"), duration, false);
  await transaction.wait();

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );
}
