"use client";

import React, { useState } from "react";
import { getWalletData } from "./lib/blockchain";

// wallet = 0xdDb5A848c3c1F22285b43E2c33d23EAedBFCCE33

const WalletExplorer = () => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleQuery = async () => {
    if (!address) {
      setError("Please enter an address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const result = await getWalletData(address);
      setData(result);
    } catch (err) {
      setError("Failed to fetch wallet data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {/* Main Container */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-black">Ethereum Wallet Explorer</h2>

        {/* Search Section */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Ethereum address (0x...)"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-black-500"
          />
          <button
            onClick={handleQuery}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Querying..." : "Query Data"}
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
      </div>

      {data && (
        <>
          {/* Statistics Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl text-black font-bold mb-4">Transaction Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-500">Min Transaction</p>
                <p className="text-lg font-bold text-black">{data.stats.minValue} ETH</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-500">Max Transaction</p>
                <p className="text-lg font-bold text-black">{data.stats.maxValue} ETH</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-500">Average Value</p>
                <p className="text-lg font-bold text-black">{data.stats.avgValue} ETH</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-500">Total Value</p>
                <p className="text-lg font-bold text-black">{data.stats.totalValue} ETH</p>
              </div>
            </div>
          </div>

          {/* Transactions List Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-black">Transactions List</h2>
            <div className="space-y-4">
              {data.transactions.map((tx) => (
                <div key={tx.hash} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">Hash</p>
                      <p className="font-mono text-black truncate">{tx.hash}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Value</p>
                      <p className="text-black truncate">{tx.value} ETH</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="font-mono text-black truncate">{tx.from}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">To</p>
                      <p className="font-mono text-black truncate">{tx.to}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WalletExplorer;
