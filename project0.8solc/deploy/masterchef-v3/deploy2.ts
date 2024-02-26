import { deployContract, deployProxyContract, getWallet } from "../utils";

import { formatEther } from "ethers/lib/utils";

import bn from "bignumber.js";
import { Contract, utils, BigNumber } from "ethers";
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

  const masterChefV3 = await deployContract("MasterChefV3", [
    dtnAddress,
    nftPositionManagerAddress,
    WETH,
  ]);
  console.log("masterChefV3", masterChefV3.address);
  // masterChefV3 0x0cFa5EaC08b90d33c789F48236409b55D12896f2

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );
}
