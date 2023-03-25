const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Denial of Service attack", function(){
    it("After being declare the winner, Attack.sol should not allow anyone to be a winner", async function(){

    //Deploy the Good Contract.
    const goodFactory  = await ethers.getContractFactory("Good");
    const goodContract = await goodFactory.deploy();
    await goodContract.deployed();
console.log("Good ADD", goodContract);
    //Deploy the attack contract.
    const attackFactory = await ethers.getContractFactory("Attack");
    const attackContract = await attackFactory.deploy(goodContract.address);
    await attackContract.deployed();

    //Let's attack the good contract and get the two addresses.
    const [_,addr1, addr2] = await ethers.getSigners();
     let tx = await goodContract.connect(addr1).setCurrentAuctionPrice({
        value : ethers.utils.parseEther("1")
     });
     await tx.wait();

     //Start the attack and make the attack.sol the winner.
     tx = await attackContract.attack({
        value : ethers.utils.parseEther("3")
     })
     await tx.wait();

     tx = await goodContract.connect(addr2).setCurrentAuctionPrice({
        value : ethers.utils.parseEther("4")
     });
     await tx.wait();

     //Now let's check if the current winner is still attack contract.
     expect(await goodContract.currentWinner()).to.equal(attackContract.address);
    })
})