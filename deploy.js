// Import the ethers package
const ethers = require("ethers");

//Require some packages for file handling
const fs = require("fs-extra");
require("dotenv").config();

// Define Main Function which deploys the contract
async function main() {
    // Firstly Compile the contract by using
    //yarn solcjs --bin --abi --include-path node_modules/ --base-path . -o . SimpleStorage.sol
    // We added scripts to package json, to compile write yarn compile for shortness
    // Then power up the ganache

    let provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL); // Create the RPC Provider with Node Provider URL which is written in .env file
    //or define at the terminal

    let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    // Create wallet with one random private key selected from ganache accounts

    const abi = fs.readFileSync("SimpleStorage_sol_SimpleStorage.abi", "utf-8");
    const bin = fs.readFileSync("SimpleStorage_sol_SimpleStorage.bin", "utf-8");
    // Read the abi and binaries of the contract

    //Deploy Contract to Chain
    const contractFactory = new ethers.ContractFactory(abi, bin, wallet);
    const contract = await contractFactory.deploy();
    // Wait Until Deployment is confirmed
    const deploymentReceipt = await contract.deployTransaction.wait(1);
    console.log(`Contract deployed to ${contract.address}`);

    // Interact with Contract
    let currentFavoriteNumber = await contract.retrieve();
    console.log(`Current Favorite Number: ${currentFavoriteNumber}`);
    console.log("Updating favorite number...");
    let transactionResponse = await contract.store(7);
    let transactionReceipt = await transactionResponse.wait();
    currentFavoriteNumber = await contract.retrieve();
    console.log(`New Favorite Number: ${currentFavoriteNumber}`);
}

// More Secure Version of the main function with crypthing the private and other keys
async function main_more_secure_encrypted() {
    let provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        encryptedJson,
        process.env.PRIVATE_KEY_PASSWORD
    );
    wallet = wallet.connect(provider);

    const abi = fs.readFileSync("SimpleStorage_sol_SimpleStorage.abi", "utf-8");
    const bin = fs.readFileSync("SimpleStorage_sol_SimpleStorage.bin", "utf-8");

    const contractFactory = new ethers.ContractFactory(abi, bin, wallet);
    const contract = await contractFactory.deploy();
    const deploymentReceipt = await contract.deployTransaction.wait(1);
    console.log(`Contract deployed to ${contract.address}`);

    let currentFavoriteNumber = await contract.retrieve();
    console.log(`Current Favorite Number: ${currentFavoriteNumber}`);
    console.log("Updating favorite number...");
    let transactionResponse = await contract.store(7);
    let transactionReceipt = await transactionResponse.wait();
    currentFavoriteNumber = await contract.retrieve();
    console.log(`New Favorite Number: ${currentFavoriteNumber}`);
}

async function main_testnet() {
    let provider = new ethers.providers.JsonRpcProvider(
        process.env.RPC_URL_TESTNET
    );
    const encryptedJson = fs.readFileSync(
        "./.encryptedKeyTestnet.json",
        "utf8"
    );
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        encryptedJson,
        process.env.PRIVATE_KEY_PASSWORD
    );
    wallet = wallet.connect(provider);

    const abi = fs.readFileSync("SimpleStorage_sol_SimpleStorage.abi", "utf-8");
    const bin = fs.readFileSync("SimpleStorage_sol_SimpleStorage.bin", "utf-8");

    const contractFactory = new ethers.ContractFactory(abi, bin, wallet);
    const contract = await contractFactory.deploy();
    const deploymentReceipt = await contract.deployTransaction.wait(1);
    console.log(`Contract deployed to ${contract.address}`);

    let currentFavoriteNumber = await contract.retrieve();
    console.log(`Current Favorite Number: ${currentFavoriteNumber}`);
    console.log("Updating favorite number...");
    let transactionResponse = await contract.store(7);
    let transactionReceipt = await transactionResponse.wait();
    currentFavoriteNumber = await contract.retrieve();
    console.log(`New Favorite Number: ${currentFavoriteNumber}`);
}

main_testnet()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
