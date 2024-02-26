import bn from "bignumber.js";
import { Contract, ContractFactory, utils, BigNumber } from "ethers";

import { formatEther } from "ethers/lib/utils";

import { deployContract, getWallet } from "../utils";



type ContractJson = { abi: any; bytecode: string };
const artifacts: { [name: string]: ContractJson } = {
  // eslint-disable-next-line global-require
  OutputCodeHash: require("../../artifacts-zk/contracts/v3-core/contracts/test/OutputCodeHash.sol/OutputCodeHash.json"),
};

async function main() {
  const deployer = getWallet();

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );

  console.log("deployer", deployer.address);

  // const OutputCodeHash = new ContractFactory(
  //   artifacts.OutputCodeHash.abi,
  //   artifacts.OutputCodeHash.bytecode,
  //   deployer
  // );
  // const outputCodeHash = await OutputCodeHash.deploy();
  // console.log("outputCodeHash", outputCodeHash.address);

  const outputCodeHash = await deployContract("OutputCodeHash");

  console.log("outputCodeHash:", outputCodeHash.address);

  // deployer must set factory address
  const hash = await outputCodeHash.getInitCodeHash();
  console.log('hash: ', hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
