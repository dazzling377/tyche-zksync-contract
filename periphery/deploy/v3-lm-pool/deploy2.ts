import { deployContract, getWallet,verifyContract } from "../utils";
import { formatEther } from "ethers";


import bn from "bignumber.js";
import { Contract } from "ethers";
import * as hre from "hardhat";

// This script is used to deploy an NFT contract
// as well as verify it on Block Explorer if possible for the network
export default async function () {
  const deployer = getWallet();

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );


  const pancakeV3PoolDeployer_address =
    "0xE6ce7b370EB40220525Db2003E0CaE258895e3ad";
  const pancakeV3Factory_address = "0x14ba9B8fac9fc25541861F196D8C227fA96E7B1E";

  const WETH = "0x02968DB286f24cB18bB5b24903eC8eBFAcf591C0";

  const positionManager_address = "0x7345B451712e45121a68B43a919687541a703Ae4";

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

  const masterChefV3Address = "0x863b2ab784af474Fb216066822123610F1A4dA41";

  const pancakeV3LmPoolDeployer = await deployContract(
    "PancakeV3LmPoolDeployer",
    [masterChefV3Address]
  );
  console.log("pancakeV3LmPoolDeployer", pancakeV3LmPoolDeployer.target);
  // pancakeV3LmPoolDeployer 0x7409C182cde6f553d7C2379121e6686dfBaAD340

  const v3PancakeFactoryArtifact = await hre.artifacts.readArtifact(
    "IPancakeV3Factory"
  );
  // Initialize contract instance for interaction
  const v3PancakeFactory = new Contract(
    pancakeV3Factory_address,
    v3PancakeFactoryArtifact.abi,
    deployer // Interact with the contract on behalf of this wallet
  );

  let transaction;

  transaction = await v3PancakeFactory.setLmPoolDeployer(
    pancakeV3LmPoolDeployer.target
  );
  console.log(
    `Transaction hash of v3PancakeFactory setLmPoolDeployer: ${transaction.hash}`
  );

  // Wait until transaction is processed
  await transaction.wait();

  const MasterChefV3Artifact = await hre.artifacts.readArtifact("MasterChefV3");
  // Initialize contract instance for interaction
  const masterChefV3 = new Contract(
    masterChefV3Address,
    MasterChefV3Artifact.abi,
    deployer // Interact with the contract on behalf of this wallet
  );

  transaction = await masterChefV3.setLmPoolDeployer(
    pancakeV3LmPoolDeployer.target
  );
  console.log(
    `Transaction hash of masterChefV3 setLmPoolDeployer : ${transaction.hash}`
  );

  // Wait until transaction is processed
  await transaction.wait();

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );
}
