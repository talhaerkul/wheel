"use client";

import SpinningWheel from "@/components/SpinningWheel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Instagram, Linkedin, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [linkedinUsername, setLinkedinUsername] = useState("");
  const [instagramFollowed, setInstagramFollowed] = useState(false);
  const [linkedinFollowed, setLinkedinFollowed] = useState(false);
  const [prizes, setPrizes] = useState([]);
  const [canSpin, setCanSpin] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({ type: "", url: "" });
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({
    instagram: "",
    linkedin: "",
    email: "",
    phone: "",
  });
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchPrizes();
    fetchUsers();
  }, []);

  useEffect(() => {
    updateCanSpin();
  }, [
    name,
    surname,
    phone,
    email,
    department,
    year,
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
        surname.trim() !== "" &&
        phone.trim() !== "" &&
        email.trim() !== "" &&
        department.trim() !== "" &&
        year.trim() !== "" &&
        instagramUsername.trim() !== "" &&
        linkedinUsername.trim() !== "" &&
        instagramFollowed &&
        linkedinFollowed &&
        !errors.instagram &&
        !errors.linkedin &&
        !errors.email &&
        !errors.phone
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
    let error = "";
    if (type === "instagram" || type === "linkedin") {
      const existingUser = users.find((user) =>
        type === "instagram"
          ? user.instagramUsername === value
          : user.linkedinUsername === value
      );
      error = existingUser ? `Bu ${type} kullanıcı adı zaten kullanılmış` : "";
    } else if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      error = !emailRegex.test(value) ? "Geçerli bir e-posta adresi girin" : "";
    } else if (type === "phone") {
      const phoneRegex = /^[0-9]{10}$/;
      error = !phoneRegex.test(value)
        ? "Geçerli bir telefon numarası girin"
        : "";
    }
    setErrors((prev) => ({ ...prev, [type]: error }));
  };

  const handleSpin = async (prize) => {
    await fetch("https://generatech.app/wheel/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${name} ${surname}`,
        phone,
        email,
        department,
        year,
        instagramUsername,
        linkedinUsername,
        prize: prize.name,
        instaFollow: instagramFollowed,
        linkedinFollow: linkedinFollowed,
        image,
      }),
    });
    setCanSpin(false);
    fetchUsers();
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    const file = files[0];
    if (file.type.startsWith("image/")) {
      setIsUploading(true);
      try {
        await uploadImage(file);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
    } else {
      console.log("Invalid file type");
    }
  };

  const uploadImage = async (file) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const dataURL = URL.createObjectURL(file);
      const response = await fetch(dataURL);

      const blob = await response.blob();
      const formData = new FormData();
      formData.append("image", blob, file.name);
      const result = await fetch("https://generatech.app/image/upload", {
        method: "POST",
        body: formData,
        headers: {
          vynkrhnyt:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF0Zm9ybSI6IeyJwbGFm1vYmlsZSIsImNyZWF0aW9uRGF0ZSI6IjIwE2WiIsImlhdCI6MTY5MTA5NDEyMH0.gycuQMGhGkb75IWC8pyp3y8pyp3y",
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDA4Y2UyMmQ0MWMwNmY1MTE5ZGQ4NSIsImlhdCI6MTcyNjMzMzg1M30.9RbsvOmzelQvPqQWG099TKEw_MWv5ZecOxM4MtuTaYM",
        },
      });
      const data = await result.json();
      setImage(data.data.image);
      setUploadedImage(dataURL);
      toast({
        title: "Upload successful",
        description: "Your image has been uploaded.",
      });
    } catch (error) {
      console.error("Image upload failed:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your image.",
      });
      throw error;
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
  };

  return (
    <div className="container mx-auto px-4 pt-10 pb-20">
      <h1 className="text-lg lg:text-3xl font-bold mb-6 text-center">
        İnovasyon Çarkını Çevir ve Kazan!
      </h1>

      <div className="max-w-lg grid lg:grid-cols-2 gap-4 mx-auto mb-8">
        <div className="mx-2">
          <Label htmlFor="name">Ad</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mx-2">
          <Label htmlFor="surname">Soyad</Label>
          <Input
            id="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>

        <div className="mx-2">
          <Label htmlFor="phone">Telefon (0 olmadan)</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) =>
              handleInputChange(setPhone, e.target.value, "phone")
            }
            required
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="mx-2">
          <Label htmlFor="email">E-posta</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) =>
              handleInputChange(setEmail, e.target.value, "email")
            }
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mx-2">
          <Label htmlFor="department">Bölüm</Label>
          <Input
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="year">Sınıf</Label>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger>
              <SelectValue placeholder="Sınıfınızı seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hazırlık">Hazırlık</SelectItem>
              <SelectItem value="1">1. Sınıf</SelectItem>
              <SelectItem value="2">2. Sınıf</SelectItem>
              <SelectItem value="3">3. Sınıf</SelectItem>
              <SelectItem value="4">4. Sınıf</SelectItem>
              <SelectItem value="5+">5+ Sınıf</SelectItem>
            </SelectContent>
          </Select>
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

      <div className=" mb-8">
        <div className="flex flex-col gap-4 items-center lg:flex-row justify-start lg:justify-center lg:space-x-4">
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

        <div className="max-w-lg mx-auto mt-8 p-6 border rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Etkinlikten bir fotoğraf
          </h2>
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                dragActive
                  ? "border-primary bg-primary/10"
                  : "border-gray-300 hover:border-primary"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                disabled={isUploading}
              />
              {uploadedImage ? (
                <div className="relative">
                  <Image
                    src={uploadedImage}
                    alt="Uploaded image"
                    width={300}
                    height={300}
                    className="mx-auto rounded-lg"
                  />
                  <button
                    className="absolute top-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer hover:bg-white hover:text-primary transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                    disabled={isUploading}
                  >
                    <X className="h-6 w-6" />
                    <span className="sr-only">Remove image</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  {isUploading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-primary"
                    >
                      Uploading...
                    </motion.div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Fotoğrafı yüklemek için tıkla veya sürükle bırak
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
            {uploadedImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-gray-500"
              >
                Fotoğraf yüklendi
              </motion.div>
            )}
          </div>
        </div>
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
