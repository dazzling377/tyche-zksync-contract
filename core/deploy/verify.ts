import * as hre from "hardhat";
import { getWallet, verifyContractWithName } from "./utils";
import { ethers } from "ethers";

// An example of a script to interact with the contract
export default async function () {
  // Load compiled contract info
  const contractArtifact = await hre.artifacts.readArtifact("PancakeV3Pool");

  // Initialize contract instance for interaction
  const contract = new ethers.Contract(
    "0x2D16047C78d064Af10A7C6878283E11B8945f701",
    contractArtifact.abi,
    getWallet() // Interact with the contract on behalf of this wallet
  );

  // Run contract read function
  const response = await contract.lmPool();
  console.log(`Current lmPool is: ${response}`);

  await verifyContractWithName(
    "0x2D16047C78d064Af10A7C6878283E11B8945f701",
    "PancakeV3Pool",
    []
  );
}
