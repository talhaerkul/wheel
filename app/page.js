"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Linkedin, X } from "lucide-react";
import SpinningWheel from "@/components/SpinningWheel";

export default function Home() {
  const [name, setName] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [linkedinUsername, setLinkedinUsername] = useState("");
  const [instagramFollowed, setInstagramFollowed] = useState(false);
  const [linkedinFollowed, setLinkedinFollowed] = useState(false);
  const [prizes, setPrizes] = useState([]);
  const [canSpin, setCanSpin] = useState(false);
  const [isSpinned, setIsSpinned] = useState(false);
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
    const response = await fetch("/api/prizes");
    const data = await response.json();
    setPrizes(data);
  };

  const fetchUsers = async () => {
    const response = await fetch("/api/users");
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
        ? "https://www.instagram.com/ttalhaerkul"
        : "https://www.linkedin.com/in/talhaerkul";

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
    await fetch("/api/users", {
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
          onClick={() => handleSocialFollow("instagram")}
          disabled={instagramFollowed}
        >
          <Instagram className="mr-2 h-4 w-4" />
          {instagramFollowed ? "Takip Edildi" : "Instagram'da Takip Et"}
        </Button>
        <Button
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl relative">
            <Button
              className="absolute top-2 right-2"
              variant="ghost"
              size="icon"
              onClick={closePopup}
            >
              <X className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-bold mb-4">
              {popupContent.type === "instagram" ? "Instagram" : "LinkedIn"}'de
              Takip Et
            </h2>
            <p className="mb-4">
              Yeni açılan sekmede bizi takip ettiyseniz, lütfen onaylayın.
            </p>
            <Button className="w-full" onClick={closePopup}>
              Takip Ettim
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
