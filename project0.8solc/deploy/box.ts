import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { Wallet } from "zksync-ethers";
import { formatEther } from "ethers/lib/utils";
import * as hre from "hardhat";
import { getWallet } from "./utils";

async function main() {
  const contractName = "Box";
  console.log("Deploying " + contractName + "...");


  const zkWallet =  getWallet();

  const deployer = new Deployer(hre, zkWallet);

  console.log(
    "deployer:",
    zkWallet.address,
    formatEther(await zkWallet.getBalance())
  );

  const contract = await deployer.loadArtifact(contractName);
  const box = await hre.zkUpgrades.deployProxy(deployer.zkWallet, contract, [42], { initializer: "initialize" });

  try {

    // await box.waitForDeployment();
    console.log(contractName + " 1: deployed to:", await box.address);
    console.log(contractName + " 2: deployed to:", await box.getAddress());

  } catch (error) {
    
  }

  console.log(
    "deployer:",
    zkWallet.address,
    formatEther(await zkWallet.getBalance())
  );
  

  box.connect(zkWallet);
  const value = await box.retrieve();
  console.log("Box value is: ", value);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
