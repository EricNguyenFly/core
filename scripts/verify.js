const { run } = require("hardhat");
// const contracts = require("../contracts.json");

async function main() {
    const jobs = [
        run("verify:verify", {
            address: "0x451a32Fe376a699Ea25b6Cafc00E446ECC8452A9",
        }),
        // run("verify:verify", {
        //     address: contracts.monkey1155Verify,
        // }),
    ];

    await Promise.all(jobs.map((job) => job.catch(console.log)));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
