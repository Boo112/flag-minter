import React, { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./constants";

function App() {
  const [country, setCountry] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");

  const countries = [
    { name: "🇺🇸 USA", value: "usa" },
    { name: "🇫🇷 France", value: "france" },
    { name: "🇯🇵 Japan", value: "japan" },
    { name: "🇩🇪 Germany", value: "germany" },
    { name: "🇮🇹 Italy", value: "italy" },
  ];

  // Подключение кошелька
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask не найден!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
      setMessage(`✅ Кошелек подключен: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);
    } catch (err) {
      console.error(err);
      setMessage(`❌ Ошибка подключения: ${err.message}`);
    }
  };

  // Переключение сети на Base Sepolia Testnet
  const switchToBaseSepolia = async () => {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x14a34" }], // 84532 decimal
      });
      return true;
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x14a34",
                chainName: "Base Sepolia",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://sepolia.base.org"],
                blockExplorerUrls: ["https://sepolia.basescan.org"],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error("Ошибка добавления сети:", addError);
          return false;
        }
      } else {
        console.error("Ошибка переключения сети:", switchError);
        return false;
      }
    }
  };

  // Минт NFT
  const handleMint = async () => {
    if (!walletAddress) {
      alert("Сначала подключи кошелек!");
      return;
    }
    if (!country) {
      alert("Выбери страну перед минтом!");
      return;
    }

    // Переключаем сеть на Base Sepolia
    const switched = await switchToBaseSepolia();
    if (!switched) {
      setMessage("Не удалось переключить сеть на Base Sepolia");
      return;
    }

    try {
      setMessage("Минтинг NFT... Подтверди транзакцию в кошельке.");

      console.log("Contract address:", CONTRACT_ADDRESS);
      if (!CONTRACT_ADDRESS) throw new Error("Contract address не задан");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.mintFlag(walletAddress, country);
      await tx.wait();

      setMessage(`✅ NFT с флагом ${country.toUpperCase()} успешно заминчен!`);
    } catch (err) {
      console.error(err);
      setMessage(`❌ Ошибка: ${err.message}`);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "Arial" }}>
      <h1>🌍 Выбери свою страну</h1>

      {!walletAddress && (
        <button
          onClick={connectWallet}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          🔌 Connect Wallet
        </button>
      )}

      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", marginBottom: "20px" }}
      >
        <option value="">-- Выбери страну --</option>
        {countries.map((c) => (
          <option key={c.value} value={c.value}>
            {c.name}
          </option>
        ))}
      </select>

      <div>
        <button
          onClick={handleMint}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          🚀 Mint NFT
        </button>
      </div>

      {message && <p style={{ marginTop: "20px", fontSize: "18px" }}>{message}</p>}
    </div>
  );
}

export default App;
