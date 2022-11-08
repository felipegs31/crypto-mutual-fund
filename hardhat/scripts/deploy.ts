import { ethers } from "hardhat";
import { CONTRACT_DAI, CONTRACT_LINK, CONTRACT_USDC } from "../constants/goerliContracts";
import { UNISWAP_V2_ROUTER } from "../constants/goerliUniswap";
import { CHAINLINK_DAI_USD, CHAINLINK_ETH_USD, CHAINLINK_LINK_USD, CHAINLINK_USDC_USD } from "../constants/goreliChainlinkContracts";
import verify from "../utils/verify";

async function main() {

  const TokenSwap = await ethers.getContractFactory("TokenSwap");
  const tokenSwap = await TokenSwap.deploy(UNISWAP_V2_ROUTER);

  await tokenSwap.deployed();

  await tokenSwap.deployTransaction.wait(6)

  const Mutual = await ethers.getContractFactory("Mutual");
  const mutualFund = await Mutual.deploy(
    CHAINLINK_ETH_USD,
    [CONTRACT_USDC, CONTRACT_DAI, CONTRACT_LINK],
    [CHAINLINK_DAI_USD, CHAINLINK_USDC_USD, CHAINLINK_LINK_USD],
    [50, 30, 20],
    20,
    "STABLE",
    "S",
    tokenSwap.address
  );

  await mutualFund.deployed();

  await mutualFund.deployTransaction.wait(6)

  console.log(`deployed to ${mutualFund.address}`);

  if (
    process.env.ETHERSCAN_API_KEY
  ) {

    await verify(tokenSwap.address, [
      UNISWAP_V2_ROUTER
    ])

    await verify(mutualFund.address, [
      [CONTRACT_USDC, CONTRACT_DAI, CONTRACT_LINK],
      [CHAINLINK_DAI_USD, CHAINLINK_USDC_USD, CHAINLINK_LINK_USD],
      [50, 30, 20],
      20,
      "STABLE",
      "S",
      tokenSwap.address
    ])
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
