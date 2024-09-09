# create-hardhat-web3

## Introduction

This tool helps to create `Web3.js` based `Hardhat` project for contracts develpoment, testing and deployment. It includes a sample contract, some tests for that contract, and a script that deploys the contract.

The project utilizes:
- Hardhat as the development environment
- Chai for assertions
- web3.js for interacting with Ethereum

### Web3.js Hardhat JS Template
Contains template using: Web3.js, Hardhat and JavaScript

### Web3.js Hardhat TS Template
Contains template using: Web3.js, Hardhat and TypeScript

## Prerequisites

- [Node.js and npm](https://nodejs.org/en/download/) (latest version)
- Basic understanding of JavaScript and Ethereum smart contracts

## Getting Started

Follow these steps to set up and run the project locally.

### Installation

1. Make a new directory:
   
   `mkdir newproj`

Note: If you install `create-hardhat-web3` globally in your local computer using 
`npm install -g create-hardhat-web3`, step 2 and step 3 can be skipped and directly project can be created using step 4.

2. Create Node.js project using NPM or Yarn:
   
   `npm init -y` or
   `yarn init -y`

3. Install create-hardhat-web3 .

   `npm i create-hardhat-web3` or
   `yarn add create-hardhat-web3`

4. Use required template for initilization of your project.

For Hardhat, Web3.js, Javascript project :
   `npx create-hardhat-web3 init js`

For Hardhat, Web3.js Typescript project :

   `npx create-hardhat-web3 init ts`

### Install dependencies
Once project is created using template install dependencies using:
   `npm i` or `yarn`

### Compiling the Contract

After installing dependencies compile the smart contract with:

`npx hardhat compile`

This compiles contracts in the `contracts/` directory and generates artifacts.

### Running Tests

Execute tests with:

`npx hardhat test`

This runs all test files in the `test/` directory.

## Project Structure

- `contracts/`: Solidity smart contracts
- `test/`: Test files for smart contracts
- `hardhat.config.js`: Hardhat configuration
