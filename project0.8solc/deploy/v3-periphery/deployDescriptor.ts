import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { Wallet } from "zksync-ethers";
import { formatEther } from "ethers/lib/utils";
import * as hre from "hardhat";
import { getWallet } from "../utils";


async function main() {
  const contractName = "NonfungibleTokenPositionDescriptorOffChain";
  console.log("Deploying " + contractName + "...");


  const zkWallet =  getWallet();

  const deployer = new Deployer(hre, zkWallet);

  console.log(
    "deployer:",
    zkWallet.address,
    formatEther(await zkWallet.getBalance())
  );

  const baseTokenUri = "https://nft.tycheswap.com/v3/";

  const contract = await deployer.loadArtifact(contractName);
  const box = await hre.zkUpgrades.deployProxy(deployer.zkWallet, contract, [baseTokenUri], { initializer: "initialize" });


//   Implementation contract was deployed to 0xd388a45BD4eae09224198883179d816f33192972
// Admin was deployed to 0xd60790c949ce851337B118530a2e00999be8AF3A
// Transparent proxy was deployed to 0xc0f5660d42508ca6F71b7b66EE15D2e425F0b37f
// NonfungibleTokenPositionDescriptorOffChain 1: deployed to: 0xc0f5660d42508ca6F71b7b66EE15D2e425F0b37f

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
  

//   box.connect(zkWallet);
//   const value = await box.retrieve();
//   console.log("Box value is: ", value);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
