// lib/blockchain.js
import { ethers } from 'ethers';

// Initialize provider for Polygon Mainnet
const POLYGON_RPC = 'https://polygon-rpc.com/';
const provider = new ethers.JsonRpcProvider(POLYGON_RPC);

// export async function getWalletData(address) {
//   try {
//     // Get the latest block number
//     const currentBlock = await provider.getBlockNumber();
    
//     // Get balance
//     const balance = await provider.getBalance(address);
    
//     // Get latest transactions by scanning recent blocks
//     const transactions = [];
//     const blocksToScan = 10; // Adjust this number based on how many blocks back you want to scan
    
//     for (let i = 0; i < blocksToScan; i++) {
//       const block = await provider.getBlock(currentBlock - i, true);
      
//       if (block && block.prefetchedTransactions) {
//         const blockTxs = block.prefetchedTransactions.filter(
//           tx => 
//             tx.from?.toLowerCase() === address.toLowerCase() || 
//             tx.to?.toLowerCase() === address.toLowerCase()
//         );
        
//         for (const tx of blockTxs) {
//           transactions.push({
//             hash: tx.hash,
//             value: ethers.formatEther(tx.value),
//             from: tx.from,
//             to: tx.to,
//             blockNumber: block.number,
//           });
//         }
//       }
      
//       // Break if we have enough transactions
//       if (transactions.length >= 10) break;
//     }

//     // Calculate statistics from found transactions
//     const values = transactions.map(tx => parseFloat(tx.value));
//     const stats = {
//       currentBalance: ethers.formatEther(balance),
//       minValue: values.length ? Math.min(...values).toFixed(6) : '0',
//       maxValue: values.length ? Math.max(...values).toFixed(6) : '0',
//       avgValue: values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(6) : '0',
//       totalValue: values.length ? values.reduce((a, b) => a + b, 0).toFixed(6) : '0'
//     };

//     return {
//       transactions,
//       stats
//     };
//   } catch (error) {
//     console.error('Error fetching wallet data:', error);
//     throw error;
//   }
// }

// Alternatively, using Polygonscan API (recommended for production)
export async function getWalletData(address) {
  const POLYGONSCAN_API_KEY = "P8PDIF3HIDYDM5BIUQKB95SDEWREH7ZKE4"; // Make sure to add this to your .env file
  const POLYGONSCAN_API = 'https://api.polygonscan.com/api';

  try {
    const response = await fetch(
      `${POLYGONSCAN_API}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${POLYGONSCAN_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status !== '1') {
      throw new Error(data.message || 'Failed to fetch transactions');
    }

    // Get current balance
    const balance = await provider.getBalance(address);

    // Process transactions
    const transactions = data.result.map(tx => ({
      hash: tx.hash,
      value: ethers.formatEther(tx.value),
      from: tx.from,
      to: tx.to,
      timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
      blockNumber: parseInt(tx.blockNumber)
    }));

    // Calculate statistics
    const values = transactions.map(tx => parseFloat(tx.value));
    const stats = {
      currentBalance: ethers.formatEther(balance),
      minValue: values.length ? Math.min(...values).toFixed(6) : '0',
      maxValue: values.length ? Math.max(...values).toFixed(6) : '0',
      avgValue: values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(6) : '0',
      totalValue: values.length ? values.reduce((a, b) => a + b, 0).toFixed(6) : '0'
    };

    return {
      transactions,
      stats
    };
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    throw error;
  }
}