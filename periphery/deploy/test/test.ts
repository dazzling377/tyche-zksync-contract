import { getWallet } from "../utils";
import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
// Address of the contract to interact with
import * as hre from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { sortedTokens } from "./shared/tokenSort";
import { encodePriceSqrt } from "./shared/encodePriceSqrt";
import { FeeAmount, TICK_SPACINGS } from "./shared/constants";
import { getMaxTick, getMinTick } from "./shared/ticks";
import { extractJSONFromURI } from "./shared/extractJSONFromURI";
import snapshotGasCost from "./shared/snapshotGasCost";

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getArtifact(contractArtifactName) {
  const wallet = getWallet();
  // Load compiled contract info
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer
    .loadArtifact(contractArtifactName)
    .catch((error) => {
      if (
        error?.message?.includes(
          `Artifact for contract "${contractArtifactName}" not found.`
        )
      ) {
        console.error(error.message);
        throw `⛔️ Please make sure you have compiled your contracts or specified the correct contract name!`;
      } else {
        throw error;
      }
    });

  return artifact;
}

// An example of a script to interact with the contract
export default async function main() {
  console.log(`Running script to nft position test script`);

  const deployer = getWallet();

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );

  const nftPositionManagerArtifacts = await hre.artifacts.readArtifact(
    "NonfungiblePositionManager"
  );

  const nft = new ethers.Contract(
    "0x63aD2844499F23bE91881a071815C682ecF6A337",
    nftPositionManagerArtifacts.abi,
    deployer // Interact with the contract on behalf of this wallet
  );

  // const artifact = await getArtifact("MyERC20Token");

  // Load compiled contract info
  const tokenArtifacts = await hre.artifacts.readArtifact("MyERC20Token");
  // Initialize contract instance for interaction
  const dtncontract = new ethers.Contract(
    "0x97863E4A85cA99AEc56A588674E60C8d4Ab1D311",
    tokenArtifacts.abi,
    deployer // Interact with the contract on behalf of this wallet
  );

  const ttncontract = new ethers.Contract(
    "0xBABF0dDcD1D89efFE50aA271B12FED48A8B32BCa",
    tokenArtifacts.abi,
    deployer // Interact with the contract on behalf of this wallet
  );

  const quoterArtifacts = await hre.artifacts.readArtifact("QuoterV2");
  const quoterV2contract = new ethers.Contract(
    "0x333CcFd995FD998C5dDC9B05d10822De1db408A1",
    quoterArtifacts.abi,
    deployer // Interact with the contract on behalf of this wallet
  );

  const v3FactoryArtifacts = await hre.artifacts.readArtifact(
    "PancakeV3Factory"
  );
  const v3Factorycontract = new ethers.Contract(
    "0x0ff560A617a4EeB7B5D1f4108F428d900983BB74",
    v3FactoryArtifacts.abi,
    deployer // Interact with the contract on behalf of this wallet
  );

  // Run contract read function
  const response = await dtncontract.balanceOf(deployer.address);
  console.log(`dtn balance is: ${formatEther(response)}`);
  console.log(
    `ttn balance is: ${formatEther(
      await ttncontract.balanceOf(deployer.address)
    )}`
  );

  console.log(
    `ttn allowance to nft manager is: ${formatEther(
      await ttncontract.allowance(deployer.address, nft.address)
    )}`
  );

  console.log(
    `dtn allowance to nft manager is: ${formatEther(
      await dtncontract.allowance(deployer.address, nft.address)
    )}`
  );

  const [token0, token1] = sortedTokens(dtncontract, ttncontract);
  console.log(`sortedTokens:`, token0.address, token1.address);

  let tx;

  tx = await nft.createAndInitializePoolIfNecessary(
    token0.address,
    token1.address,
    FeeAmount.MEDIUM,
    encodePriceSqrt(1, 1)
  );
  console.log(
    `Transaction hash of createAndInitializePoolIfNecessary: ${tx.hash}`,
    tx
  );

  await tx.wait();

  tx = await dtncontract.approve(nft.address, 100);
  await tx.wait();
  tx = await ttncontract.approve(nft.address, 100);
  await tx.wait();

  console.log(`approve the token on position manager:`);

  await sleep(10000)

//sortedTokens: 0x97863E4A85cA99AEc56A588674E60C8d4Ab1D311 0xBABF0dDcD1D89efFE50aA271B12FED48A8B32BCa

  const createdPool = await v3Factorycontract.getPool(
    token0.address,
    token1.address,
    FeeAmount.MEDIUM
  );

  console.log(`createdPool from v3 Factory:`, createdPool);
  //0x498943aE26C751Ca39290bd4EE0DC930F27F4BDf
  // const poolAddress = await quoterV2contract.getPool(
  //   token0.address,
  //   token1.address,
  //   FeeAmount.MEDIUM
  // );

  // console.log(`poolAddress from quoterV2:`, poolAddress);

  console.log(`start check estimate gas price`);

  await snapshotGasCost(
    nft.estimateGas.mint({
      token0: token0.address,
      token1: token1.address,
      fee: FeeAmount.MEDIUM,
      tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
      tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
      recipient: deployer.address,
      amount0Desired: 100,
      amount1Desired: 100,
      amount0Min: 0,
      amount1Min: 0,
      deadline: 1,
    })
  );

  console.log(`start mint`);

  tx = await nft.mint({
    token0: token0.address,
    token1: token1.address,
    fee: FeeAmount.MEDIUM,
    tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
    tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
    recipient: deployer.address,
    amount0Desired: 100,
    amount1Desired: 100,
    amount0Min: 0,
    amount1Min: 0,
    deadline: 1,
  });
  console.log(`Transaction hash of mint: ${tx.hash}`);

  await tx.wait();

  const metadata = extractJSONFromURI(await nft.tokenURI(1));
  console.log(`metadata: ${metadata}`);

  console.log(
    "deployer:",
    deployer.address,
    formatEther(await deployer.getBalance())
  );

  // // Run contract write function
  // const transaction = await contract.setGreeting("Hello people!");
  // console.log(`Transaction hash of setting new message: ${transaction.hash}`);

  // // Wait until transaction is processed
  // await transaction.wait();

  // // Read message after transaction
  // console.log(`The message now is: ${await contract.greet()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
