import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { networkConfig } from "../../helper-hardhat-config";
import { ERC20ABI } from "../../utils/ERC20ABI";

const chainId = network.config.chainId!
const { CONTRACT_FTT, CONTRACT_DAI, CONTRACT_UNI, CONTRACT_AAVE, CHAINLINK_FTT_USD, CHAINLINK_DAI_USD, CHAINLINK_UNI_USD, CHAINLINK_AAVE_USD, UNISWAP_V2_ROUTER } = networkConfig[chainId]

async function deployMutualFundFixture() {
 
  const Mutual = await ethers.getContractFactory("Mutual");
  const mutualFund = await Mutual.deploy(
    networkConfig[chainId].CHAINLINK_ETH_USD!,
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

  return { mutualFund };
}

describe("MutualFund buyAssets", function () {
  it("Should buyAssets correctly", async function () {
    const { mutualFund } = await loadFixture(deployMutualFundFixture);

    await mutualFund.joinFund({ value: ethers.utils.parseEther('0.64') })

    await mutualFund.buyAssets()

    const provider = ethers.provider

    const FTT = new ethers.Contract(CONTRACT_FTT!, ERC20ABI, provider)
    const FTTBalance = await FTT.balanceOf(mutualFund.address)
    expect(FTTBalance).to.be.greaterThan(ethers.BigNumber.from(0))

    const DAI = new ethers.Contract(CONTRACT_DAI!, ERC20ABI, provider)
    const DAIBalance = await DAI.balanceOf(mutualFund.address)
    expect(DAIBalance).to.be.greaterThan(ethers.BigNumber.from(0))

    const UNI = new ethers.Contract(CONTRACT_UNI!, ERC20ABI, provider)
    const UNIBalance = await UNI.balanceOf(mutualFund.address)
    expect(UNIBalance).to.be.greaterThan(ethers.BigNumber.from(0))

    const AAVE = new ethers.Contract(CONTRACT_AAVE!, ERC20ABI, provider)
    const AAVEBalance = await AAVE.balanceOf(mutualFund.address)
    expect(AAVEBalance).to.be.greaterThan(ethers.BigNumber.from(0))

    // console.log('DAIBalance', DAIBalance)
    // console.log('FTTBalance', FTTBalance)
    // console.log('UNIBalance', UNIBalance)
    // console.log('AAVEBalance', AAVEBalance)

    const ftt = await mutualFund.assetsMap(CONTRACT_FTT!)
    const dai = await mutualFund.assetsMap(CONTRACT_DAI!)
    const uni = await mutualFund.assetsMap(CONTRACT_UNI!)
    const aave = await mutualFund.assetsMap(CONTRACT_AAVE!)

    expect(ftt.balance).to.be.equal(FTTBalance)
    expect(dai.balance).to.be.equal(DAIBalance)
    expect(uni.balance).to.be.equal(UNIBalance)
    expect(aave.balance).to.be.equal(AAVEBalance)

  })
})

describe("MutualFund buyAssets", function () {
  it("Should buyAssets correctly", async function () {
    const { mutualFund } = await loadFixture(deployMutualFundFixture);

    await mutualFund.joinFund({ value: ethers.utils.parseEther('0.64') })

    await mutualFund.buyAssets()

    const provider = ethers.provider

    const FTT = new ethers.Contract(CONTRACT_FTT!, ERC20ABI, provider)
    const FTTBalance = await FTT.balanceOf(mutualFund.address)
    expect(FTTBalance).to.be.greaterThan(ethers.BigNumber.from(0))

    const DAI = new ethers.Contract(CONTRACT_DAI!, ERC20ABI, provider)
    const DAIBalance = await DAI.balanceOf(mutualFund.address)
    expect(DAIBalance).to.be.greaterThan(ethers.BigNumber.from(0))

    const UNI = new ethers.Contract(CONTRACT_UNI!, ERC20ABI, provider)
    const UNIBalance = await UNI.balanceOf(mutualFund.address)
    expect(UNIBalance).to.be.greaterThan(ethers.BigNumber.from(0))

    const AAVE = new ethers.Contract(CONTRACT_AAVE!, ERC20ABI, provider)
    const AAVEBalance = await AAVE.balanceOf(mutualFund.address)
    expect(AAVEBalance).to.be.greaterThan(ethers.BigNumber.from(0))

    // console.log('DAIBalance', DAIBalance)
    // console.log('FTTBalance', FTTBalance)
    // console.log('UNIBalance', UNIBalance)
    // console.log('AAVEBalance', AAVEBalance)

    const ftt = await mutualFund.assetsMap(CONTRACT_FTT!)
    const dai = await mutualFund.assetsMap(CONTRACT_DAI!)
    const uni = await mutualFund.assetsMap(CONTRACT_UNI!)
    const aave = await mutualFund.assetsMap(CONTRACT_AAVE!)

    expect(ftt.balance).to.be.equal(FTTBalance)
    expect(dai.balance).to.be.equal(DAIBalance)
    expect(uni.balance).to.be.equal(UNIBalance)
    expect(aave.balance).to.be.equal(AAVEBalance)

  })
})


