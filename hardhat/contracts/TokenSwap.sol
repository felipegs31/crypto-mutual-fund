// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;
import "./ITokenSwap.sol";

//import the uniswap router
//the contract needs to use swapExactTokensForTokens
//this will allow us to import swapExactTokensForTokens into our contract
interface IUniswapV2Router {
    function getAmountsOut(uint256 amountIn, address[] memory path)
        external
        view
        returns (uint256[] memory amounts);

    function swapExactETHForTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable returns (uint[] memory amounts);

    function WETH() external pure returns (address);
}

contract TokenSwap is ITokenSwap {
    //address of the uniswap v2 router
    address public UNISWAP_V2_ROUTER;
    address public WETH;

    //address of WETH token.  This is needed because some times it is better to trade through WETH.
    //you might get a better price using WETH.
    //example trading from token A to WETH then WETH to token B might result in a better price
    constructor(address uniswapV2Router) {
        UNISWAP_V2_ROUTER = uniswapV2Router;
        WETH = IUniswapV2Router(UNISWAP_V2_ROUTER).WETH();
    }

    function swapEth(
        address _tokenOut,
        uint256 _amountOutMin,
        address _to
    ) external payable returns (uint[] memory amounts) {
        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = _tokenOut;

        uint[] memory swap = IUniswapV2Router(UNISWAP_V2_ROUTER).swapExactETHForTokens{
            value: msg.value
        }(_amountOutMin, path, _to, block.timestamp);

        return swap;
    }

    //this function will return the minimum amount from a swap
    //input the 3 parameters below and it will return the minimum amount out
    //this is needed for the swap function above
    function getAmountOutMin(
        address _tokenOut,
        uint256 _amountIn
    ) external view returns (uint256) {
        //path is an array of addresses.
        //this path array will have 3 addresses [tokenIn, WETH, tokenOut]
        //the if statement below takes into account if token in or token out is WETH.  then the path is only 2 addresses
        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = _tokenOut;

        uint256[] memory amountOutMins = IUniswapV2Router(UNISWAP_V2_ROUTER)
            .getAmountsOut(_amountIn, path);
        return amountOutMins[path.length - 1];
    }
}
