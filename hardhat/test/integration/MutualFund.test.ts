import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { networkConfig } from "../../helper-hardhat-config";
import { ERC20ABI } from "../../utils/ERC20ABI";

const chainId = network.config.chainId!
const { CONTRACT_APE, CONTRACT_DAI, CONTRACT_UNI, CONTRACT_AAVE, CHAINLINK_APE_USD, CHAINLINK_DAI_USD, CHAINLINK_UNI_USD, CHAINLINK_AAVE_USD, UNISWAP_V2_ROUTER } = networkConfig[chainId]

async function deployMutualFundFixture() {
 
  const [deployerAccount, otherAccount] = await ethers.getSigners();

  const Mutual = await ethers.getContractFactory("Mutual");
  const mutualFund = await Mutual.deploy(
    networkConfig[chainId].CHAINLINK_ETH_USD!,
    [CONTRACT_APE!, CONTRACT_DAI!, CONTRACT_UNI!, CONTRACT_AAVE!],
    [CHAINLINK_APE_USD!, CHAINLINK_DAI_USD!, CHAINLINK_UNI_USD!, CHAINLINK_AAVE_USD!],
    [40, 30, 20, 10],
    20,
    "STABLE",
    "S",
    UNISWAP_V2_ROUTER!, {
      value: ethers.utils.parseEther('0.1')
    }
  );

  await mutualFund.deployed();

  return { mutualFund, deployerAccount, otherAccount };
}

describe("MutualFund Deployment", function () {
  it("Should deploy correctly", async function () {
    const { mutualFund, deployerAccount } = await loadFixture(deployMutualFundFixture);

    const ape = await mutualFund.assetsMap(CONTRACT_APE!)
    const dai = await mutualFund.assetsMap(CONTRACT_DAI!)
    const uni = await mutualFund.assetsMap(CONTRACT_UNI!)
    const aave = await mutualFund.assetsMap(CONTRACT_AAVE!)

    expect(ape.percentage).to.be.equal(40)
    expect(dai.percentage).to.be.equal(30)
    expect(uni.percentage).to.be.equal(20)
    expect(aave.percentage).to.be.equal(10)

    expect(ape.balance).to.be.greaterThan(0)
    expect(dai.balance).to.be.greaterThan(0)
    expect(uni.balance).to.be.greaterThan(0)
    expect(aave.balance).to.be.greaterThan(0)

    const assetQuantity = await mutualFund.assetQuantity()

    expect(assetQuantity).to.be.equal(4)

    const minimumUSDJoin = await mutualFund.minimumUSDJoin()
    const minimumInEth = ethers.utils.formatEther(minimumUSDJoin);
    expect("20.0").to.be.equal(minimumInEth)

    const initialTotalValue = await mutualFund.initialTotalValue()

    const apeMult = ape.initialPrice.mul(ape.percentage)
    const daiMult = dai.initialPrice.mul(dai.percentage)
    const uniMult = uni.initialPrice.mul(uni.percentage)
    const aaveMult = aave.initialPrice.mul(aave.percentage)

    let calcInitialTotalValue = apeMult.add(daiMult).add(uniMult).add(aaveMult)
    calcInitialTotalValue = calcInitialTotalValue.div(100) // div by 100 because of percentage

    expect(initialTotalValue).to.be.equal(calcInitialTotalValue)

    const balanceOfERC20Token = await mutualFund.balanceOf(deployerAccount.address)
    const sharesTotalSupply = await mutualFund.totalSupply()

    expect(balanceOfERC20Token).to.be.greaterThan(ethers.BigNumber.from(0))
    expect(sharesTotalSupply).to.be.greaterThan(ethers.BigNumber.from(0))
  });

});

describe("MutualFund joinFund", function () {
  it("Should joinFund and buyAssets correctly", async function () {
    const { mutualFund, deployerAccount } = await loadFixture(deployMutualFundFixture);

    const balanceOfERC20TokenBefore = await mutualFund.balanceOf(deployerAccount.address)

    await mutualFund.joinFund({ value: ethers.utils.parseEther('0.2') })

    const provider = ethers.provider

    const APE = new ethers.Contract(CONTRACT_APE!, ERC20ABI, provider)
    const APEBalance = await APE.balanceOf(mutualFund.address)
    expect(APEBalance).to.be.greaterThan(ethers.BigNumber.from(0))

    const DAI = new ethers.Contract(CONTRACT_DAI!, ERC20ABI, provider)
    const DAIBalance = await DAI.balanceOf(mutualFund.address)
    expect(DAIBalance).to.be.greaterThan(ethers.BigNumber.from(0))

    const UNI = new ethers.Contract(CONTRACT_UNI!, ERC20ABI, provider)
    const UNIBalance = await UNI.balanceOf(mutualFund.address)
    expect(UNIBalance).to.be.greaterThan(ethers.BigNumber.from(0))

    const AAVE = new ethers.Contract(CONTRACT_AAVE!, ERC20ABI, provider)
    const AAVEBalance = await AAVE.balanceOf(mutualFund.address)
    expect(AAVEBalance).to.be.greaterThan(ethers.BigNumber.from(0))

    const ape = await mutualFund.assetsMap(CONTRACT_APE!)
    const dai = await mutualFund.assetsMap(CONTRACT_DAI!)
    const uni = await mutualFund.assetsMap(CONTRACT_UNI!)
    const aave = await mutualFund.assetsMap(CONTRACT_AAVE!)

    expect(ape.balance).to.be.equal(APEBalance)
    expect(dai.balance).to.be.equal(DAIBalance)
    expect(uni.balance).to.be.equal(UNIBalance)
    expect(aave.balance).to.be.equal(AAVEBalance)

    const balanceOfERC20TokenAfter = await mutualFund.balanceOf(deployerAccount.address)

    expect(balanceOfERC20TokenAfter).to.be.greaterThan(balanceOfERC20TokenBefore)
  })
})

describe("MutualFund exitFund", function () {
  it("Should exitFund correctly", async function () {
    const { mutualFund, deployerAccount, otherAccount } = await loadFixture(deployMutualFundFixture);

    await mutualFund.joinFund({ value: ethers.utils.parseEther('0.2') })

    await mutualFund.connect(otherAccount).joinFund({ value: ethers.utils.parseEther('0.2') })

    const ape = await mutualFund.assetsMap(CONTRACT_APE!)
    const dai = await mutualFund.assetsMap(CONTRACT_DAI!)
    const uni = await mutualFund.assetsMap(CONTRACT_UNI!)
    const aave = await mutualFund.assetsMap(CONTRACT_AAVE!)

    const balanceOfERC20Token = await mutualFund.balanceOf(otherAccount.address)
    const otherAccountBalanceBeforeExitFund = await ethers.provider.getBalance(otherAccount.address);

    const getAmountOfTokensWillBeSold = await mutualFund.connect(otherAccount).getAmountOfTokensWillBeSold(balanceOfERC20Token)

    await mutualFund.connect(otherAccount).exitFund(balanceOfERC20Token)

    const balanceOfERC20TokenAfterSell = await mutualFund.balanceOf(otherAccount.address)

    const otherAccountBalanceAfterExitFund = await ethers.provider.getBalance(otherAccount.address);

    const apeAfter = await mutualFund.assetsMap(CONTRACT_APE!)
    const daiAfter = await mutualFund.assetsMap(CONTRACT_DAI!)
    const uniAfter = await mutualFund.assetsMap(CONTRACT_UNI!)
    const aaveAfter = await mutualFund.assetsMap(CONTRACT_AAVE!)

    expect(balanceOfERC20TokenAfterSell).to.be.equal(ethers.BigNumber.from(0))
    expect(otherAccountBalanceAfterExitFund).to.be.greaterThan(otherAccountBalanceBeforeExitFund)

    expect(ape.balance).to.be.greaterThan(apeAfter.balance)
    expect(dai.balance).to.be.greaterThan(daiAfter.balance)
    expect(uni.balance).to.be.greaterThan(uniAfter.balance)
    expect(aave.balance).to.be.greaterThan(aaveAfter.balance)

  })
})


