# DeFund (Chainlink Fall 2022 hackathon project)

This project consists of 2 main folders
- Frontend (react)
- Hardhat (solidity)

Each one of those folders have a readme so its possible to test

The tests made on the videos were using a hardhat fork with the mainnet, because the frontend uses the address from mainnet for the tokens, Chainlink and Uniswap

## The project
With DeFund anyone can create a mutual fund and anyone can join a mutual fund as well. On fund creation you can select which assets will be part of the fund as well as their percentages, a Smart Contract is deployed with an ERC20 token that will be used as shares, and the holders of this ERC20 token can claim later money from the fund.
The contract only accepts Eth from the users and automatically trades those Eths for the assets on Uniswap, respecting the percentage of those assets
Economics: The protocol makes money when the ERC20 is returned and the users withdraw their Eths, 0.03% of the transaction goes to the fund owner (as a management fee) and 0.02 goes to the protocol

### The math behind it

When an user tries to join the fund, we sum all tokens that the fund has and use Chainlink oracles to get the total value of this fund, then we devide for the amount of ERC20 tokes issued:


Ex. Imagine a fund that has:
(remembering that the user always deposit Ethers, then the contract buys tokens according to the % division)
- 10 Tokens A (each worth 1usd)
- 2 Tokens B (each worth 2usd)
- 1 Tokens B (each worth 5usd)

The total value is 29 usd, if we have issued 10 ERC20 tokens, the value of a new one is 2.9 usd.
If another user in this case joins the token depositing Eth that corresponds to 5.8 usd, he will get back 2 tokens 

The same calculation is valid when selling back ERC20 tokens to the contract

### Disclaimer

When deploying contracts, it will save the new contract address to the localstorage, and then the list page will get those from there, we have some mocked funds and values to serve a filler for presentation