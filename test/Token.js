
const { expect } = require("chai");
const hre = require("hardhat");

describe("Token contract", function () {

    const deployContract = async(
        contractName,
        constructorArgs = [],
        fromAddress = undefined,
    ) => {

        const senderAcct = web3.utils.isAddress(fromAddress) ? 
                            fromAddress : 
                            (await web3.eth.getAccounts())[0];
   
        const artifact = await hre.artifacts.readArtifact(contractName);

        const contract = new web3.eth.Contract(artifact.abi);
        const deployedContract = await contract.deploy({
            input: artifact.bytecode, 
            arguments: constructorArgs
        }).send({
            from: senderAcct
        });

        return deployedContract;
    }

    it("Deployment should assign the total supply of tokens to the owner", async function () {

        const unlockedAccounts = await web3.eth.getAccounts();

        const deployedContract = await deployContract("Token");

        const ownerBalance = await deployedContract.methods.balanceOf(unlockedAccounts[0]).call();
        
        expect(await deployedContract.methods.totalSupply().call()).to.equal(ownerBalance);
        
    });

 
});