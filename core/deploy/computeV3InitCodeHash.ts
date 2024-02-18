// import { ethers } from 'hardhat'
import {keccak256} from "ethers"
import { Contract, ContractFactory, utils } from "zksync-ethers";
import PancakeV3PoolArtifact from '../artifacts-zk/contracts/PancakeV3Pool.sol/PancakeV3Pool.json'

const hash = keccak256(PancakeV3PoolArtifact.bytecode)
console.log("v3-codeHash:",hash)

const hash2 = utils.hashBytecode(PancakeV3PoolArtifact.bytecode)
console.log("v3-codeHash2:",hash2)

var string = new TextDecoder().decode(hash2);
console.log("v3-codeHash2 string:",string)

let hex = Buffer.from(hash2).toString('hex');
console.log("v3-codeHash2 hex:",hex)