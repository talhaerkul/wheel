"use client";

import { useState } from "react";
import SpinningWheel from "../components/SpinningWheel";

export default function Home() {
  const [prizes, setPrizes] = useState([]);
  const [prizeName, setPrizeName] = useState("");
  const [error, setError] = useState("");

  const sendResultToBackend = async (prize) => {
    try {
      const response = await fetch("/api/wheel-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          instagramUsername,
          linkedinUsername,
          prize: prize.name,
        }),
      });
      if (!response.ok) throw new Error("Failed to send result to backend");
    } catch (error) {
      console.error("Error sending result to backend:", error);
    }
  };

  const addPrize = (e) => {
    e.preventDefault();
    if (prizeName.trim() === "") {
      setError("Prize name cannot be empty");
      return;
    }
    if (
      prizes.some(
        (prize) => prize.name.toLowerCase() === prizeName.trim().toLowerCase()
      )
    ) {
      setError("Prize already exists");
      return;
    }
    setPrizes([...prizes, { name: prizeName.trim() }]);
    setPrizeName("");
    setError("");
  };

  const removePrize = (index) => {
    setPrizes(prizes.filter((_, i) => i !== index));
  };

  const clearPrizes = () => {
    setPrizes([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">
        Spinning Wheel of Prizes
      </h1>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={addPrize} className="mb-4">
          <div className="flex mb-2">
            <input
              type="text"
              placeholder="Enter prize name"
              value={prizeName}
              onChange={(e) => setPrizeName(e.target.value)}
              className="flex-grow border rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Prize
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Prize List:</h2>
          {prizes.length === 0 ? (
            <p className="text-gray-500">No prizes added yet.</p>
          ) : (
            <ul className="list-disc pl-5">
              {prizes.map((prize, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center mb-1"
                >
                  <span>{prize.name}</span>
                  <button
                    onClick={() => removePrize(index)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {prizes.length > 0 && (
          <button
            onClick={clearPrizes}
            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Clear All Prizes
          </button>
        )}
      </div>
      {prizes.length > 1 && <SpinningWheel prizes={prizes} />}
    </div>
  );
}
