import { Contract, providers } from "ethers";
import { mutual } from "../contract/Mutual";
import console from 'console-browserify'



 export const assetsMapQuery = async (contractAddress: string, address: string, provider: any) => {
  const web3Provider = new providers.Web3Provider(provider!);

  try {
    const tokenContract = new Contract(
      contractAddress,
      mutual.abi,
      web3Provider
    );
    const assetMapData = await tokenContract.assetsMap(address);
    return assetMapData;
  } catch (err) {
    console.error(err);
  }
};

