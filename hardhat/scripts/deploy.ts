import { ethers, network } from "hardhat";
import verify from "../utils/verify";
import { developmentChains, networkConfig } from "../helper-hardhat-config"

async function main() {

  const chainId = network.config.chainId!
  const { CHAINLINK_ETH_USD, CONTRACT_FTT, CONTRACT_DAI, CONTRACT_UNI, CONTRACT_AAVE, CHAINLINK_FTT_USD, CHAINLINK_DAI_USD, CHAINLINK_UNI_USD, CHAINLINK_AAVE_USD, UNISWAP_V2_ROUTER } = networkConfig[chainId]



  const Mutual = await ethers.getContractFactory("Mutual");
  const mutualFund = await Mutual.deploy(
    CHAINLINK_ETH_USD!,
    [CONTRACT_FTT!, CONTRACT_DAI!, CONTRACT_UNI!, CONTRACT_AAVE!],
    [CHAINLINK_FTT_USD!, CHAINLINK_DAI_USD!, CHAINLINK_UNI_USD!, CHAINLINK_AAVE_USD!],
    [40, 30, 20, 10],
    20,
    "STABLE",
    "S",
    UNISWAP_V2_ROUTER!, {
      value: ethers.utils.parseEther('0.1')
    }
  );

  await mutualFund.deployed();

  console.log(`deployed to ${mutualFund.address}`);

  if (
    process.env.ETHERSCAN_API_KEY &&
    !developmentChains.includes(network.name)
  ) {

    await verify(mutualFund.address, [
      CHAINLINK_ETH_USD!,
      [CONTRACT_FTT!, CONTRACT_DAI!, CONTRACT_UNI!, CONTRACT_AAVE!],
      [CHAINLINK_FTT_USD!, CHAINLINK_DAI_USD!, CHAINLINK_UNI_USD!, CHAINLINK_AAVE_USD!],
      [40, 30, 20, 10],
      20,
      "STABLE",
      "S",
      UNISWAP_V2_ROUTER!
    ])
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
