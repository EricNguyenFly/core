const { ethers } = require("hardhat");
const fs = require("fs");
require("dotenv").config();
const env = process.env;

async function main() {
    //* Get network */
    const accounts = await ethers.getSigners();

    console.log("==========================================================================");
    console.log("ACCOUNTS:");
    console.log("==========================================================================");
    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        console.log(` Account ${i}: ${account.address}`);
    }

    //* Loading contract factory */
    const ArthurPair = await ethers.getContractFactory("ArthurPair");
    const ArthurFactory = await ethers.getContractFactory("ArthurFactory");

    



    const LoanChecksAndCalculations = await hre.ethers.getContractFactory('LoanChecksAndCalculations');
    const NFTfiSigningUtils = await hre.ethers.getContractFactory('NFTfiSigningUtils');
    const LendingPool = await ethers.getContractFactory("LendingPoolV3");
    const WXCR = await ethers.getContractFactory("WXCR");
    const LiquidateNFTPool = await ethers.getContractFactory("LiquidateNFTPool");

    //* Deploy contracts */
    console.log("==========================================================================");
    console.log("DEPLOYING CONTRACTS");
    console.log("==========================================================================");

    // let loanChecksAndCalculations = await LoanChecksAndCalculations.deploy();
    // await loanChecksAndCalculations.deployed()
    // console.log("Library LoanChecksAndCalculations deployed to:", loanChecksAndCalculations.address);

    // let nftfiSigningUtils = await NFTfiSigningUtils.deploy();
    // await nftfiSigningUtils.deployed()
    // console.log("Library NFTfiSigningUtils deployed to:", nftfiSigningUtils.address);

    // const permittedNFTs = await PermittedNFTs.deploy(accounts[0].address);
    // await permittedNFTs.deployed();
    // console.log("PermittedNFTs                        deployed to:>>", permittedNFTs.address);

    const liquidateNFTPool = await LiquidateNFTPool.deploy(accounts[0].address);
    await liquidateNFTPool.deployed();
    console.log("LiquidateNFTPool                        deployed to:>>", liquidateNFTPool.address);

    const loanChecksAndCalculations = await LoanChecksAndCalculations.attach("0xF46E912d82e49104d332D69c2A9E1Aa0B7440892");
    const nftfiSigningUtils = await NFTfiSigningUtils.attach("0x4A0c460a775404B87674E2fBff48CA6607b7fBB3");
    const permittedNFTs = await PermittedNFTs.attach("0x6b556f1A587ebEa1b3A42Ba9F6275966CA17BCd5");
    const wXCR = await WXCR.attach("0x747ae7Dcf3Ea10D242bd17bA5dfA034ca6102108");

    const DirectLoanFixedOffer = await ethers.getContractFactory("DirectLoanFixedOffer", {
        libraries: {
            LoanChecksAndCalculations: loanChecksAndCalculations.address,
            NFTfiSigningUtils: nftfiSigningUtils.address
        },
    });

    // const lendingPool = await LendingPool.deploy(wXCR.address, "0x4F9EF07A6DDF73494D2fF51A8f7B78e9c5815eb2", "10000000000000000000", 0);
    // await lendingPool.deployed();
    // console.log("LendingPool                     deployed to:>>", lendingPool.address);

    const lendingPool = await LendingPool.attach("0x985F6aC9bA18C97Ce59c1334Df716074ef02A684");

    const directLoanFixedOffer = await DirectLoanFixedOffer.deploy(accounts[0].address, lendingPool.address, liquidateNFTPool.address, permittedNFTs.address, [wXCR.address]);
    await directLoanFixedOffer.deployed();
    console.log("DirectLoanFixedOffer                        deployed to:>>", directLoanFixedOffer.address);

    await lendingPool.approve(directLoanFixedOffer.address, ethers.constants.MaxUint256);

    console.log("==========================================================================");
    console.log("VERIFY CONTRACTS");
    console.log("==========================================================================");

    // await hre
    //     .run("verify:verify", {
    //         address: wXCR.address
    //     })
    //     .catch(console.log);

    // await hre
    //     .run("verify:verify", {
    //         address: wXCRS.address
    //     })
    //     .catch(console.log);

    // await hre
    //     .run("verify:verify", {
    //         address: lendingPool.address,
    //         constructorArguments: [wXCR.address,
    //         wXCRS.address
    //         ]
    //     })
    //     .catch(console.log);

    console.log("==========================================================================");
    console.log("DONE");
    console.log("==========================================================================");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });