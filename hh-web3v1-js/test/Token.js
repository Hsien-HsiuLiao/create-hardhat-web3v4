const { expect } = require("chai");
const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const hardhatRuntime = require("hardhat");

describe("Token contract", function () {

    const deployContract = async (
        contractName,
        constructorArgs = [],
        fromAddress = undefined,
    ) => {

        const senderAcct = web3.utils.isAddress(fromAddress) ?
            fromAddress :
            (await web3.eth.getAccounts())[0];

        const artifact = await hardhatRuntime.artifacts.readArtifact(contractName);

        const contract = new web3.eth.Contract(artifact.abi);
        const deployedContract = await contract.deploy({
          //  input: artifact.bytecode,
            data: artifact.bytecode,
            arguments: constructorArgs
        }).send({
            from: senderAcct
        });

        // this will be used for sending transactions to contract in .send() function calls 
        deployedContract.defaultAccount = senderAcct; 
        return deployedContract;
    }

    async function deployTokenFixture() {

        const [owner, addr1, addr2] = await web3.eth.getAccounts();
        const hardhatToken = await deployContract("Token");

        return { hardhatToken, owner, addr1, addr2 };
    }


    describe("Deployment", function () {

        it("Should set the right owner", async function () {

            const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
            expect(await hardhatToken.methods.owner().call()).to.equal(owner);
        });

        it("Should assign the total supply of tokens to the owner", async function () {
            const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
            const ownerBalance = await hardhatToken.methods.balanceOf(owner).call();
            expect(await hardhatToken.methods.totalSupply().call()).to.equal(ownerBalance);
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            const getBalance = async (address) => await hardhatToken.methods.balanceOf(address).call();

            const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );

            const ownerBalance = await getBalance(owner);
            const addr1Balance = await getBalance(addr1);

            // Transfer 50 tokens from owner to addr1
            //https://docs.web3js.org/guides/hardhat_tutorial/#compile-test-and-deploy-the-contract
  // To change the status of the data we previously saved, we have to access the method container for the function (s) 
  //we desire and invoke the .send to broadcast our intention to the network , .send({from: deployer}).
            await hardhatToken.methods.transfer(addr1, 50).send({from: owner});

           /*  expect(await getBalance(owner)).to.be.equal(ownerBalance - BigInt(50));
            expect(await getBalance(addr1)).to.be.equal(addr1Balance + BigInt(50));

            // Transfer 50 tokens from addr1 to addr2
            const addr1BalanceB = await getBalance(addr1);
            const addr2BalanceB = await getBalance(addr2);

            await hardhatToken.methods.transfer(addr2, 50).send({ from: addr1 });

            expect(await getBalance(addr1)).to.be.equal(addr1BalanceB - BigInt(50));
            expect(await getBalance(addr2)).to.be.equal(addr2BalanceB + BigInt(50)); */
        });

        it("Should emit Transfer events", async function () {
            const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );

            const transferEventToAddr1Promise = new Promise((resolve) => {
                console.log("transferEventToAddr1Promise:", hardhatToken.events.Transfer({
                    filter: { _from: owner }
                }));

                const subscription = hardhatToken.events.Transfer({
                    filter: { _from: owner }
                })
                   // .on('data', function (event) {
                    .on('Subscription', function (event) {
                        console.log("event: ", event);
                        // Check if the event parameters are correct
                        expect(event.returnValues._from).to.be.equal(owner);
                        expect(event.returnValues._to).to.be.equal(addr1);
                        expect(event.returnValues._value).to.be.equal("50");

                        // Unsubscribe and resolve the promise
                        if (subscription) {
                            subscription.unsubscribe();
                        }
                        resolve();
                    });
            });

            const transferEventToAddr2Promise = new Promise((resolve) => {
                const subscription = hardhatToken.events.Transfer({
                    filter: { _from: addr1 }
                })
                    .on('data', function (event) {
                        // Check if the event parameters are correct
                        expect(event.returnValues._from).to.be.equal(addr1);
                        expect(event.returnValues._to).to.be.equal(addr2);
                        expect(event.returnValues._value).to.be.equal("35");

                        // Unsubscribe and resolve the promise
                        if (subscription) {
                            subscription.unsubscribe();
                        }
                        resolve();
                    });
            });
//https://docs.web3js.org/guides/hardhat_tutorial/#compile-test-and-deploy-the-contract
  // To change the status of the data we previously saved, we have to access the method container for the function (s) 
  //we desire and invoke the .send to broadcast our intention to the network , .send({from: owner}).
            await hardhatToken.methods.transfer(addr1, 50).send({from: owner});
            await transferEventToAddr1Promise;

            await hardhatToken.methods.transfer(addr2, 35).send({ from: addr1 });
            await transferEventToAddr2Promise;

        });

        it("Should fail if sender doesn't have enough tokens", async function () {
            const { hardhatToken, owner, addr1 } = await loadFixture(
                deployTokenFixture
            );
            const initialOwnerBalance = await hardhatToken.methods.balanceOf(owner).call();

            // Try to send 1 token from addr1 (0 tokens) to owner.
            await expect(
                hardhatToken.methods.transfer(owner, 1).send({from: addr1})
            //).to.be.rejectedWith("Error happened while trying to execute a function inside a smart contract");
            ).to.be.rejectedWith("VM Exception while processing transaction: reverted with reason string 'Not enough tokens'");


            // Owner balance shouldn't have changed.
            expect(await hardhatToken.methods.balanceOf(owner).call()).to.equal(
                initialOwnerBalance
            );
        });
    });
});
