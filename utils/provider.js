import dotenv from "dotenv";
import { ethers } from "ethers";
import upload from "../abi/upload.json" assert { type: 'json' };
dotenv.config();
const privateKey = process.env.PRIVATE_KEY
const rpcUrl =  process.env.RPC_URL
const contractAddress = process.env.CONTRACT_ADDRESS
const getProvider = async (option) => {
    const wallet = new ethers.Wallet(privateKey);
    const provider = new ethers.getDefaultProvider(rpcUrl);
    const connectedWallet =await wallet.connect(provider);
    const contract = new ethers.Contract(contractAddress, upload, connectedWallet);
 
    return contract
};

export default getProvider; 