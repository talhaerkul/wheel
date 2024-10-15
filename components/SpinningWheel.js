"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { X } from "lucide-react";

export default function SpinningWheel({ prizes, canSpin, onSpinEnd }) {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [winningPrize, setWinningPrize] = useState(null);

  // Generate colors for each prize
  const colors = prizes.map((_, index) => {
    const hue = (index * 360) / prizes.length;
    return {
      start: `hsl(${hue}, 85%, 65%)`,
      end: `hsl(${hue}, 85%, 55%)`,
    };
  });

  const drawWheel = (ctx, width, height) => {
    const numOptions = prizes.length;
    const arcSize = (2 * Math.PI) / numOptions;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);

    for (let i = 0; i < numOptions; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      const gradient = ctx.createLinearGradient(0, 0, width / 2, 0);
      gradient.addColorStop(0, colors[i].start);
      gradient.addColorStop(1, colors[i].end);
      ctx.fillStyle = gradient;
      ctx.arc(0, 0, width / 2 - 20, i * arcSize, (i + 1) * arcSize);
      ctx.lineTo(0, 0);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.rotate(i * arcSize + arcSize / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillText(prizes[i].name, width / 2 - 40, 0);
      ctx.restore();
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#f3f4f6";
    ctx.fill();
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    drawWheel(ctx, width, height);
  }, [prizes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.translate(-width / 2, -height / 2);
    drawWheel(ctx, width, height);
    ctx.restore();
  }, [angle]);

  const spinWheel = () => {
    if (isSpinning || !canSpin) return;
    setIsSpinning(true);

    const duration = 5000;
    const start = performance.now();
    const extraSpins = 5;
    const randomAngle = Math.floor(Math.random() * 360);
    const finalAngle = extraSpins * 360 + randomAngle;

    const spin = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const newAngle = easeOut * finalAngle;
      setAngle(newAngle);

      if (progress < 1) {
        requestAnimationFrame(spin);
      } else {
        setIsSpinning(false);

        // Corrected index calculation
        const degrees = newAngle % 360;
        const numOptions = prizes.length;
        const arcSize = 360 / numOptions;
        const adjustedDegrees = (degrees + arcSize / 2) % 360;
        const index =
          Math.floor((360 - adjustedDegrees) / arcSize) % numOptions;
        const prize = prizes[index];
        setWinningPrize(prize);
        setShowModal(true);

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        onSpinEnd(prize);
      }
    };

    requestAnimationFrame(spin);
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="rounded-full shadow-lg"
        />
        {/* Correct Arrow Position */}
        <div
          className="absolute top-10 rotate-180 left-1/2 transform -translate-x-1/2 -translate-y-full"
          style={{
            width: 0,
            height: 0,
            borderLeft: "25px solid transparent",
            borderRight: "25px solid transparent",
            borderBottom: "50px solid red",
            filter: "drop-shadow(0 0 5px rgba(0,0,0,0.5))",
          }}
        />
      </div>
      <motion.button
        onClick={spinWheel}
        disabled={isSpinning || !canSpin}
        className={`mt-8 px-8 py-3 bg-blue-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ${
          isSpinning || !canSpin ? "opacity-50 cursor-not-allowed" : ""
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={
          isSpinning
            ? {}
            : {
                scale: [1, 1.05, 1],
                transition: { repeat: Infinity, duration: 2 },
              }
        }
      >
        {isSpinning ? "Spinning..." : "Spin the Wheel!"}
      </motion.button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center">
                Congratulations!
              </h2>
              <p className="text-lg text-center">
                You won:{" "}
                <span className="font-semibold text-green-500">
                  {winningPrize?.name}
                </span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
