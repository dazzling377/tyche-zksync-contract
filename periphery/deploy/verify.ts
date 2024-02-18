import * as hre from "hardhat";
import { getWallet, verifyContractWithName } from "./utils";
import { ethers } from "ethers";

// An example of a script to interact with the contract
export default async function () {
  // Load compiled contract info
  const contractArtifact = await hre.artifacts.readArtifact("PancakeV3LmPool");

  // Initialize contract instance for interaction
  const contract = new ethers.Contract(
    "0x0d6C37eDe4b0F17822b944B44B739Ca6D73c2ce9",
    contractArtifact.abi,
    getWallet() // Interact with the contract on behalf of this wallet
  );

  // Run contract read function
  const response = await contract.pool();
  console.log(`Current pool is: ${response}`);

//   const response = await contract.masterChef();
  console.log(`Current masterChef is: ${await contract.masterChef()}`);

  await verifyContractWithName(
    "0x0d6C37eDe4b0F17822b944B44B739Ca6D73c2ce9",
    "PancakeV3LmPool",
    []
  );
}
