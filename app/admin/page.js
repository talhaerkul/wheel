"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Login } from "@/components/Login";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [prizes, setPrizes] = useState([]);
  const [users, setUsers] = useState([]);
  const [newPrize, setNewPrize] = useState({ name: "", quantity: 1 });
  const [showOnlyFollowers, setShowOnlyFollowers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      fetchPrizes();
      fetchUsers();
    }
  }, [isLoggedIn]);

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

  const addPrize = async (event) => {
    event.preventDefault();

    const quantity = parseInt(newPrize.quantity, 10);
    if (isNaN(quantity) || quantity < 1) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli bir adet giriniz.",
        variant: "destructive",
      });
      return;
    }

    const response = await fetch("https://generatech.app/wheel/api/prizes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newPrize, quantity }),
    });

    if (response.ok) {
      fetchPrizes();
      setNewPrize({ name: "", quantity: 1 });
      toast({
        title: "Ödül eklendi",
        description: "Yeni ödül başarıyla eklendi.",
      });
    } else {
      toast({
        title: "Hata",
        description: "Ödül eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const deletePrize = async (id) => {
    const response = await fetch(
      `https://generatech.app/wheel/api/prizes/${id}`,
      { method: "DELETE" }
    );
    if (response.ok) {
      fetchPrizes();
      toast({
        title: "Ödül silindi",
        description: "Ödül başarıyla silindi.",
      });
    }
  };

  const updateFollowers = async () => {
    fetchUsers();
    toast({
      title: "Takipçiler güncellendi",
      description: "Takipçi listesi başarıyla güncellendi.",
    });
  };

  const updateUser = async (id, prize, instaFollow, linkedinFollow) => {
    const response = await fetch(
      `https://generatech.app/wheel/api/users/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prize, instaFollow, linkedinFollow }),
      }
    );
    if (response.ok) {
      fetchUsers();
    }
  };

  const deleteUser = async (id) => {
    const response = await fetch(
      `https://generatech.app/wheel/api/users/${id}`,
      { method: "DELETE" }
    );
    if (response.ok) {
      fetchUsers();
      toast({
        title: "Kullanıcı silindi",
        description: "Kullanıcı başarıyla silindi.",
      });
    } else {
      toast({
        title: "Hata",
        description: "Kullanıcı silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users
    .filter(
      (user) => !showOnlyFollowers || user.instaFollow || user.linkedinFollow
    )
    .filter(
      (user) =>
        searchTerm === "" ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.instagramUsername
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.linkedinUsername.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (!isLoggedIn) {
    return <Login onLogin={setIsLoggedIn} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Ödüller</h2>
        <form onSubmit={addPrize} className="mb-4">
          <div className="flex space-x-4">
            <div className="flex-grow">
              <Label htmlFor="prizeName">Ödül Adı</Label>
              <Input
                id="prizeName"
                value={newPrize.name}
                onChange={(e) =>
                  setNewPrize({ ...newPrize, name: e.target.value })
                }
                required
              />
            </div>
            <div className="w-24">
              <Label htmlFor="prizeQuantity">Adet</Label>
              <Input
                id="prizeQuantity"
                type="number"
                value={newPrize.quantity}
                onChange={(e) =>
                  setNewPrize({
                    ...newPrize,
                    quantity: e.target.value,
                  })
                }
                required
                min="1"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit">Ekle</Button>
            </div>
          </div>
        </form>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ödül Adı</TableHead>
              <TableHead>Adet</TableHead>
              <TableHead>İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prizes.map((prize) => (
              <TableRow key={prize.id}>
                <TableCell>{prize.name}</TableCell>
                <TableCell>{prize.quantity}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => deletePrize(prize.id)}
                  >
                    Sil
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Kullanıcılar</h2>
        <div className="mb-4">
          <Label htmlFor="search">Ara</Label>
          <Input
            id="search"
            type="text"
            placeholder="Ad, soyad, e-posta, bölüm, Instagram veya LinkedIn kullanıcı adı"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center mb-4">
          <Button onClick={updateFollowers}>Takipçileri Güncelle</Button>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showOnlyFollowers"
              checked={showOnlyFollowers}
              onCheckedChange={setShowOnlyFollowers}
            />
            <Label htmlFor="showOnlyFollowers">Sadece takipçileri göster</Label>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fotoğraf</TableHead>
              <TableHead>Ad Soyad</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>E-posta</TableHead>
              <TableHead>Bölüm</TableHead>
              <TableHead>Sınıf</TableHead>
              <TableHead>Instagram</TableHead>
              <TableHead>LinkedIn</TableHead>
              <TableHead>Ödül</TableHead>
              <TableHead>Instagram Takip</TableHead>
              <TableHead>LinkedIn Takip</TableHead>
              <TableHead>İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.imageUrl && (
                    <Image
                      src={user.imageUrl}
                      alt={`${user.name}'s photo`}
                      width={50}
                      height={50}
                      className="rounded-full object-cover"
                    />
                  )}
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.year}</TableCell>
                <TableCell>{user.instagramUsername}</TableCell>
                <TableCell>{user.linkedinUsername}</TableCell>
                <TableCell>{user.prize}</TableCell>
                <TableCell>
                  <Select
                    value={user.instaFollow ? "Evet" : "Hayır"}
                    onValueChange={(value) =>
                      updateUser(
                        user.id,
                        user.prize,
                        value === "Evet",
                        user.linkedinFollow
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {user.instaFollow ? "Evet" : "Hayır"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Evet">Evet</SelectItem>
                      <SelectItem value="Hayır">Hayır</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={user.linkedinFollow ? "Evet" : "Hayır"}
                    onValueChange={(value) =>
                      updateUser(
                        user.id,
                        user.prize,
                        user.instaFollow,
                        value === "Evet"
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {user.linkedinFollow ? "Evet" : "Hayır"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Evet">Evet</SelectItem>
                      <SelectItem value="Hayır">Hayır</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => deleteUser(user.id)}
                  >
                    Sil
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Toaster />
    </div>
  );
}
