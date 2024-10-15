"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Linkedin, X } from "lucide-react";
import SpinningWheel from "@/components/SpinningWheel";
import { motion } from "framer-motion";

export default function Home() {
  const [name, setName] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [linkedinUsername, setLinkedinUsername] = useState("");
  const [instagramFollowed, setInstagramFollowed] = useState(false);
  const [linkedinFollowed, setLinkedinFollowed] = useState(false);
  const [prizes, setPrizes] = useState([]);
  const [canSpin, setCanSpin] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({ type: "", url: "" });
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({ instagram: "", linkedin: "" });

  useEffect(() => {
    fetchPrizes();
    fetchUsers();
  }, []);

  useEffect(() => {
    updateCanSpin();
  }, [
    name,
    instagramUsername,
    linkedinUsername,
    instagramFollowed,
    linkedinFollowed,
    errors,
  ]);

  const fetchPrizes = async () => {
    const response = await fetch("https://generatech.app/wheel/api/prizes");
    const data = await response.json();
    setPrizes(data);
  };

  const fetchUsers = async () => {
    const response = await fetch("https://generatech.app/wheel/api/users");
    const data = await response.json();
    setUsers(data);
  };

  const updateCanSpin = () => {
    setCanSpin(
      name.trim() !== "" &&
        instagramUsername.trim() !== "" &&
        linkedinUsername.trim() !== "" &&
        instagramFollowed &&
        linkedinFollowed &&
        !errors.instagram &&
        !errors.linkedin
    );
  };

  const handleSocialFollow = (type) => {
    const url =
      type === "instagram"
        ? "https://www.instagram.com/zaiminovasyon/"
        : "https://www.linkedin.com/company/zaiminovasyon/";

    window.open(url, "_blank", "noopener,noreferrer");
    setPopupContent({ type, url });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    if (popupContent.type === "instagram") {
      setInstagramFollowed(true);
    } else if (popupContent.type === "linkedin") {
      setLinkedinFollowed(true);
    }
  };

  const handleInputChange = (setter, value, type) => {
    setter(value);
    const existingUser = users.find((user) =>
      type === "instagram"
        ? user.instagramUsername === value
        : user.linkedinUsername === value
    );
    setErrors((prev) => ({
      ...prev,
      [type]: existingUser ? `Bu ${type} kullanıcı adı zaten kullanılmış` : "",
    }));
  };

  const handleSpin = async (prize) => {
    await fetch("https://generatech.app/wheel/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        instagramUsername,
        linkedinUsername,
        prize: prize.name,
        instaFollow: instagramFollowed,
        linkedinFollow: linkedinFollowed,
      }),
    });
    setCanSpin(false);
    fetchUsers();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Çark Çevir ve Kazan!
      </h1>

      <div className="max-w-md mx-auto mb-8">
        <div className="mb-4">
          <Label htmlFor="name">İsim</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="instagram">Instagram Kullanıcı Adı</Label>
          <Input
            id="instagram"
            value={instagramUsername}
            onChange={(e) =>
              handleInputChange(
                setInstagramUsername,
                e.target.value,
                "instagram"
              )
            }
            required
          />
          {errors.instagram && (
            <p className="text-red-500 text-sm mt-1">{errors.instagram}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="linkedin">LinkedIn Kullanıcı Adı</Label>
          <Input
            id="linkedin"
            value={linkedinUsername}
            onChange={(e) =>
              handleInputChange(setLinkedinUsername, e.target.value, "linkedin")
            }
            required
          />
          {errors.linkedin && (
            <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>
          )}
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-8">
        <Button
          className="flex items-center"
          onClick={() => handleSocialFollow("instagram")}
          disabled={instagramFollowed}
        >
          <Instagram className="mr-2 h-4 w-4" />
          {instagramFollowed ? "Takip Edildi" : "Instagram'da Takip Et"}
        </Button>
        <Button
          className="flex items-center"
          onClick={() => handleSocialFollow("linkedin")}
          disabled={linkedinFollowed}
        >
          <Linkedin className="mr-2 h-4 w-4" />
          {linkedinFollowed ? "Takip Edildi" : "LinkedIn'de Takip Et"}
        </Button>
      </div>

      {prizes.length > 0 && (
        <SpinningWheel
          prizes={prizes}
          canSpin={canSpin}
          onSpinEnd={handleSpin}
        />
      )}

      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white p-8 rounded-2xl shadow-2xl relative max-w-md w-full mx-4"
          >
            <button
              className="absolute bg-transparent rounded-full top-4 right-4"
              onClick={closePopup}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </button>
            <div className="text-center">
              {popupContent.type === "instagram" ? (
                <Instagram className="h-12 w-12 mx-auto mb-4 text-pink-500" />
              ) : (
                <Linkedin className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              )}
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {popupContent.type === "instagram" ? "Instagram" : "LinkedIn"}
                'de Takip Et
              </h2>
              <p className="mb-6 text-gray-600">
                Yeni açılan sekmede bizi takip ettiyseniz, lütfen onaylayın.
              </p>
              <div className="flex justify-center items-center w-full gap-4">
                <Button className="w-full text-lg py-6" onClick={closePopup}>
                  Takip Ettim
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-lg py-6"
                  onClick={closePopup}
                >
                  Daha Sonra
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
