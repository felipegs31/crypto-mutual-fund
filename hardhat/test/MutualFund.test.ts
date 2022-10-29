import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { CONTRACT_DAI, CONTRACT_LINK, CONTRACT_USDC } from "../constants/goerliContracts";
import { CHAINLINK_DAI_USD, CHAINLINK_LINK_USD, CHAINLINK_USDC_USD } from "../constants/goreliChainlinkContracts";

const DECIMALS = "8"
const DAI_PRICE = "100000000"
const USDC_PRICE = "99986000"
const LINK_PRICE = "712200000"
const ETH_PRICE = "155412200000"

describe("MutualFund", function () {
  async function deployMutualFundFixture() {

    const MockV3AggregatorETH = await ethers.getContractFactory("MockV3Aggregator");
    const mockV3AggregatorETH = await MockV3AggregatorETH.deploy(18, ETH_PRICE)
    await mockV3AggregatorETH.deployed();

    const MockV3AggregatorDAI = await ethers.getContractFactory("MockV3Aggregator");
    const mockV3AggregatorDAI = await MockV3AggregatorDAI.deploy(DECIMALS, DAI_PRICE)
    await mockV3AggregatorDAI.deployed();

    const MockV3AggregatorUSDC = await ethers.getContractFactory("MockV3Aggregator");
    const mockV3AggregatorUSDC = await MockV3AggregatorUSDC.deploy(DECIMALS, USDC_PRICE)
    await mockV3AggregatorUSDC.deployed();

    const MockV3AggregatorLINK = await ethers.getContractFactory("MockV3Aggregator");
    const mockV3AggregatorLINK = await MockV3AggregatorLINK.deploy(DECIMALS, LINK_PRICE)
    await mockV3AggregatorLINK.deployed();

    const Mutual = await ethers.getContractFactory("Mutual");
    const mutualFund = await Mutual.deploy(
      mockV3AggregatorETH.address,
      [CONTRACT_DAI, CONTRACT_USDC, CONTRACT_LINK],
      [mockV3AggregatorDAI.address, mockV3AggregatorUSDC.address, mockV3AggregatorLINK.address],
      [50, 30, 20],
      20, {
        value: ethers.utils.parseEther('0.1')
      }
    );
    await mutualFund.deployed();

    return { mutualFund, mockV3AggregatorDAI, mockV3AggregatorUSDC, mockV3AggregatorLINK};
  }

  describe("Deployment", function () {
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
    });

  });

});
