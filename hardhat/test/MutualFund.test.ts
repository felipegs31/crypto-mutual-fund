import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { CONTRACT_DAI, CONTRACT_LINK, CONTRACT_USDC } from "../constants/goerliContracts";
import { CHAINLINK_DAI_USD, CHAINLINK_LINK_USD, CHAINLINK_USDC_USD } from "../constants/goreliChainlinkContracts";

const DECIMALS = "8"
const DAI_PRICE_D0 = "100000000"
const USDC_PRICE_D0 = "99986000"
const LINK_PRICE_D0 = "712200000"
const ETH_PRICE_D0 = "155412200000"

const DAI_PRICE_D1 = "110000000"
const USDC_PRICE_D1 = "98986000"
const LINK_PRICE_D1 = "682200000"
const ETH_PRICE_D1 = "155412200000"

const TEN_TO_TENTH = 10000000000

async function deployMutualFundFixture() {
  const [deployerAccount, otherAccount] = await ethers.getSigners();

  const MockV3AggregatorETH = await ethers.getContractFactory("MockV3Aggregator");
  const mockV3AggregatorETH = await MockV3AggregatorETH.deploy(18, ETH_PRICE_D0)
  await mockV3AggregatorETH.deployed();

  const MockV3AggregatorDAI = await ethers.getContractFactory("MockV3Aggregator");
  const mockV3AggregatorDAI = await MockV3AggregatorDAI.deploy(DECIMALS, DAI_PRICE_D0)
  await mockV3AggregatorDAI.deployed();

  const MockV3AggregatorUSDC = await ethers.getContractFactory("MockV3Aggregator");
  const mockV3AggregatorUSDC = await MockV3AggregatorUSDC.deploy(DECIMALS, USDC_PRICE_D0)
  await mockV3AggregatorUSDC.deployed();

  const MockV3AggregatorLINK = await ethers.getContractFactory("MockV3Aggregator");
  const mockV3AggregatorLINK = await MockV3AggregatorLINK.deploy(DECIMALS, LINK_PRICE_D0)
  await mockV3AggregatorLINK.deployed();


  const Mutual = await ethers.getContractFactory("Mutual");
  const mutualFund = await Mutual.deploy(
    mockV3AggregatorETH.address,
    [CONTRACT_DAI, CONTRACT_USDC, CONTRACT_LINK],
    [mockV3AggregatorDAI.address, mockV3AggregatorUSDC.address, mockV3AggregatorLINK.address],
    [50, 30, 20],
    20,
    "STABLE",
    "S", {
    value: ethers.utils.parseEther('0.1')
  }
  );
  await mutualFund.deployed();

  return { mutualFund, mockV3AggregatorDAI, mockV3AggregatorUSDC, mockV3AggregatorLINK, mockV3AggregatorETH, deployerAccount };
}

describe("MutualFund Deployment", function () {
  it("Should deploy correctly", async function () {
    const { mutualFund } = await loadFixture(deployMutualFundFixture);

    const dai = await mutualFund.assetsMap(CONTRACT_DAI)
    const usdc = await mutualFund.assetsMap(CONTRACT_USDC)
    const link = await mutualFund.assetsMap(CONTRACT_LINK)

    console.log('dai', dai)
    console.log('usdc', usdc)
    console.log('link', link)

    expect(dai.percentage).to.be.equal(50)
    expect(usdc.percentage).to.be.equal(30)
    expect(link.percentage).to.be.equal(20)

    const assetQuantity = await mutualFund.assetQuantity()

    expect(assetQuantity).to.be.equal(3)

    const minimumUSDJoin = await mutualFund.minimumUSDJoin()
    const minimumInEth = ethers.utils.formatEther(minimumUSDJoin);
    expect("20.0").to.be.equal(minimumInEth)

    const initialTotalValue = await mutualFund.initialTotalValue()

    const daiMult = dai.initialPrice.mul(dai.percentage)
    const usdcMult = usdc.initialPrice.mul(usdc.percentage)
    const linkMult = link.initialPrice.mul(link.percentage)

    let calcInitialTotalValue = daiMult.add(usdcMult).add(linkMult)
    calcInitialTotalValue = calcInitialTotalValue.div(100) // div by 100 because of percentage

    expect(initialTotalValue).to.be.equal(calcInitialTotalValue)
  });

});

describe("MutualFund calculateCoinReturn", function () {
  it("Should calculateCoinReturn correctly", async function () {
    const { mutualFund, mockV3AggregatorDAI, mockV3AggregatorUSDC, mockV3AggregatorLINK } = await loadFixture(deployMutualFundFixture);

    // Changing coin prices for testing this function
    await mockV3AggregatorDAI.updateAnswer(DAI_PRICE_D1)
    await mockV3AggregatorUSDC.updateAnswer(USDC_PRICE_D1)
    await mockV3AggregatorLINK.updateAnswer(LINK_PRICE_D1)

    const dai = await mutualFund.assetsMap(CONTRACT_DAI)
    const usdc = await mutualFund.assetsMap(CONTRACT_USDC)
    const link = await mutualFund.assetsMap(CONTRACT_LINK)

    const daiTotalValue = ethers.BigNumber.from(DAI_PRICE_D1).mul(TEN_TO_TENTH).mul(dai.percentage).div(100)
    const usdcTotalValue = ethers.BigNumber.from(USDC_PRICE_D1).mul(TEN_TO_TENTH).mul(usdc.percentage).div(100)
    const linkTotalValue = ethers.BigNumber.from(LINK_PRICE_D1).mul(TEN_TO_TENTH).mul(link.percentage).div(100)

    const currentTotalValue = daiTotalValue.add(usdcTotalValue).add(linkTotalValue)
    const initialTotalValue = await mutualFund.initialTotalValue()

    // Math on lib
    const aScaled = initialTotalValue.mul(TEN_TO_TENTH);
    const divScaled = aScaled.div(currentTotalValue); // b is not scaled!

    const decNTest = divScaled.div(TEN_TO_TENTH);
    const decFracTest = divScaled.mod(TEN_TO_TENTH);
    //


    const [decN, decFrac] = await mutualFund.calculateCoinReturn()

    expect(decNTest).to.be.equal(decN)
    expect(decFracTest).to.be.equal(decFrac)

  })
})

describe("MutualFund joinFund", function () {
  it("Should joinFund correctly", async function () {
    const { mutualFund, mockV3AggregatorDAI, mockV3AggregatorUSDC, mockV3AggregatorLINK, deployerAccount } = await loadFixture(deployMutualFundFixture);

    // Changing coin prices for testing this function
    await mockV3AggregatorDAI.updateAnswer(DAI_PRICE_D1)
    await mockV3AggregatorUSDC.updateAnswer(USDC_PRICE_D1)
    await mockV3AggregatorLINK.updateAnswer(LINK_PRICE_D1)

    const initialContractEthAmount = await mutualFund.provider.getBalance(mutualFund.address)

    const erc20CoinBalanceBefore = await mutualFund.balanceOf(deployerAccount.address)
    expect(erc20CoinBalanceBefore.toString()).to.be.equal("0")

    await mutualFund.joinFund({ value: ethers.utils.parseEther('0.64') })

    const erc20CoinBalanceAfter = await mutualFund.balanceOf(deployerAccount.address)
    expect(erc20CoinBalanceAfter).to.be.greaterThan(0)
  
    const contractEthAmount = await mutualFund.provider.getBalance(mutualFund.address)
    const finalContractAmount = initialContractEthAmount.add(ethers.utils.parseEther('0.64'))
    expect(contractEthAmount).to.be.equal(finalContractAmount)

  })
})

describe("MutualFund ERC20", function () {
  it("Should have correct name and symbol ERC20 coin", async function () {
    const { mutualFund, mockV3AggregatorDAI, mockV3AggregatorUSDC, mockV3AggregatorLINK } = await loadFixture(deployMutualFundFixture);
    const coinName = await mutualFund.name()
    const coinSymbol = await mutualFund.symbol()

    expect(coinName).to.be.equal("CF STABLE")
    expect(coinSymbol).to.be.equal("CFS")
  })
})


