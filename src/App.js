import React, { useState } from "react";

function App() {
  const [country, setCountry] = useState("");
  const [minted, setMinted] = useState(false);

  const countries = [
    { name: "🇺🇸 USA", value: "usa" },
    { name: "🇫🇷 France", value: "france" },
    { name: "🇯🇵 Japan", value: "japan" },
    { name: "🇩🇪 Germany", value: "germany" },
    { name: "🇮🇹 Italy", value: "italy" },
  ];

  const handleMint = () => {
    if (!country) {
      alert("Выбери страну перед минтом!");
      return;
    }
    // Здесь потом добавим код для вызова NFT mint
    setMinted(true);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "Arial" }}>
      <h1>🌍 Выбери свою страну</h1>

      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        style={{ padding: "10px", fontSize: "16px" }}
      >
        <option value="">-- Выбери страну --</option>
        {countries.map((c) => (
          <option key={c.value} value={c.value}>
            {c.name}
          </option>
        ))}
      </select>

      <div style={{ marginTop: "30px" }}>
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

      {minted && (
        <div style={{ marginTop: "40px", fontSize: "20px" }}>
          ✅ NFT с флагом {country.toUpperCase()} успешно заминчен!
        </div>
      )}
    </div>
  );
}

export default App;
