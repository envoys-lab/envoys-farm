const { ethers } = require("hardhat");

async function deploy(factoryName, constructor) {
    process.stdout.write(`${factoryName} deploy..`);
    const Factory = await ethers.getContractFactory(factoryName);
    const contract = await Factory.deploy(...constructor);
    process.stdout.write(`. ${contract.deployTransaction.hash}`);
    await contract.deployTransaction.wait();
    process.stdout.write(` OK\n`);
    return contract;
}

async function main() {
    const [deployer] = await ethers.getSigners();
    const block = await deployer.provider.getBlock("latest");

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());


    const envoysTokenConstructor = [];
    const envoysToken = await deploy("EvtToken", envoysTokenConstructor);
    
    const masterChefConstructor = [
        envoysToken.address,
        deployer.address,
        "40000000000000000000",
        block.number + 1
    ];
    const master = await deploy("MasterChef", masterChefConstructor);

    const sousChefConstructor = [
        "10000000000000000000",
        block.number + 1,
        block.number + 5000000
    ];
    const sous = await deploy("SousChef", sousChefConstructor);

    await envoysToken['mint(address,uint256)'](deployer.address, ethers.utils.parseEther("10000"));
    
    process.stdout.write("Transfer ownership EvtToken to MasterChef..");
    let tx = await envoysToken.transferOwnership(master.address);
    process.stdout.write(`. ${tx.hash}`);
    await tx.wait();
    process.stdout.write(` OK\n`);

    console.log("MasterChef:", master.address);
    console.log("SousChef:", sous.address);
    console.log("EVT:", envoysToken.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });