import bn from "bignumber.js";
import { Contract, ContractFactory } from "ethers";
import { getWallet } from "./utils";
import { formatEther } from "ethers";
import { deployContract } from "./utils";
import * as hre from "hardhat";
export default async function () {
  const deployer = getWallet();

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );

  // const OutputCodeHashArtifacts = await hre.artifacts.readArtifact(
  //   "OutputCodeHash"
  // );
  // const OutputCodeHashCcontract = new Contract(
  //   "0x41fE609212Aff985308dc85156ACb80EB51ccE90",
  //   OutputCodeHashArtifacts.abi,
  //   deployer // Interact with the contract on behalf of this wallet
  // );

  // // deployer must set factory address
  // const hash1 = await OutputCodeHashCcontract.getInitCodeHash();
  // console.log("hash1: ", hash1);


  const OutputCodeHash = await deployContract("OutputCodeHash");

  // deployer must set factory address
  const hash = await OutputCodeHash.getInitCodeHash();
  console.log("hash: ", hash);

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );
}
