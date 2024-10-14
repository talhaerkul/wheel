"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Linkedin } from "lucide-react";

// Hypothetical prizes list with priorities
const prizes = [
  { id: 1, name: "10% İndirim", priority: 5 },
  { id: 2, name: "25% İndirim", priority: 3 },
  { id: 3, name: "50% İndirim", priority: 1 },
  { id: 4, name: "Ücretsiz Ürün", priority: 1 },
  { id: 5, name: "5% İndirim", priority: 5 },
  { id: 6, name: "Hediye Çeki", priority: 2 },
];

export default function WheelOfFortune() {
  const [name, setName] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [linkedinUsername, setLinkedinUsername] = useState("");
  const [instagramFollowed, setInstagramFollowed] = useState(false);
  const [linkedinFollowed, setLinkedinFollowed] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);
  const wheelRef = useRef(null);

  const openPopup = (url) => {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    window.open(
      url,
      "popup",
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  const handleInstagramFollow = () => {
    openPopup(`https://www.instagram.com/${instagramUsername}`);
    const checkPopupClosed = setInterval(() => {
      if (!window.open("", "popup").closed) return;
      clearInterval(checkPopupClosed);
      setInstagramFollowed(true);
    }, 1000);
  };

  const handleLinkedinFollow = () => {
    openPopup(`https://www.linkedin.com/in/${linkedinUsername}`);
    const checkPopupClosed = setInterval(() => {
      if (!window.open("", "popup").closed) return;
      clearInterval(checkPopupClosed);
      setLinkedinFollowed(true);
    }, 1000);
  };

  const spinWheel = () => {
    if (spinning || hasSpun) return;

    setSpinning(true);
    const wheel = wheelRef.current;
    const totalWeight = prizes.reduce((sum, prize) => sum + prize.priority, 0);
    const randomWeight = Math.random() * totalWeight;
    let currentWeight = 0;
    let winningPrize;

    for (const prize of prizes) {
      currentWeight += prize.priority;
      if (randomWeight <= currentWeight) {
        winningPrize = prize;
        break;
      }
    }

    const rotationAngle =
      360 * 5 + (360 / prizes.length) * prizes.indexOf(winningPrize);
    wheel.style.transition = "transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)";
    wheel.style.transform = `rotate(${rotationAngle}deg)`;

    setTimeout(() => {
      setSpinning(false);
      setWinner(winningPrize);
      setHasSpun(true);
      sendResultToBackend(winningPrize);
    }, 5000);
  };

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

  const canSpin =
    name &&
    instagramUsername &&
    linkedinUsername &&
    instagramFollowed &&
    linkedinFollowed &&
    !hasSpun;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Çark Çevir ve Kazan!
      </h1>

      <div className="mb-6">
        <Label htmlFor="name">İsim</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="mb-6">
        <Label htmlFor="instagram">Instagram Kullanıcı Adı</Label>
        <Input
          id="instagram"
          value={instagramUsername}
          onChange={(e) => setInstagramUsername(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="mb-6">
        <Label htmlFor="linkedin">LinkedIn Kullanıcı Adı</Label>
        <Input
          id="linkedin"
          value={linkedinUsername}
          onChange={(e) => setLinkedinUsername(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="flex justify-center space-x-4 mb-8">
        <Button onClick={handleInstagramFollow} disabled={instagramFollowed}>
          <Instagram className="mr-2 h-4 w-4" />
          {instagramFollowed ? "Takip Edildi" : "Instagram'da Takip Et"}
        </Button>
        <Button onClick={handleLinkedinFollow} disabled={linkedinFollowed}>
          <Linkedin className="mr-2 h-4 w-4" />
          {linkedinFollowed ? "Takip Edildi" : "LinkedIn'de Takip Et"}
        </Button>
      </div>

      <div className="relative w-64 h-64 mx-auto mb-8">
        <div
          ref={wheelRef}
          className="w-full h-full rounded-full border-4 border-gray-300 relative overflow-hidden"
          style={{
            transform: "rotate(0deg)",
            transition: "transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)",
          }}
        >
          {prizes.map((prize, index) => (
            <div
              key={prize.id}
              className="absolute w-full h-full"
              style={{
                transform: `rotate(${(index * 360) / prizes.length}deg)`,
              }}
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0"
                style={{
                  borderLeft: "32px solid transparent",
                  borderRight: "32px solid transparent",
                  borderBottom: "128px solid",
                  borderBottomColor: `hsl(${
                    (index * 360) / prizes.length
                  }, 70%, 50%)`,
                }}
              ></div>
              <span className="absolute top-12 left-1/2 -translate-x-1/2 text-white text-xs font-bold whitespace-nowrap transform -rotate-90">
                {prize.name}
              </span>
            </div>
          ))}
        </div>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "20px solid black",
          }}
        ></div>
      </div>

      <div className="text-center">
        <Button onClick={spinWheel} disabled={!canSpin || spinning}>
          {spinning ? "Çark Dönüyor..." : "Çarkı Çevir"}
        </Button>
      </div>

      {winner && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold">Tebrikler!</h2>
          <p className="text-xl">Kazandığınız ödül: {winner.name}</p>
        </div>
      )}
    </div>
  );
}
