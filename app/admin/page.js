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

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [prizes, setPrizes] = useState([]);
  const [users, setUsers] = useState([]);
  const [newPrize, setNewPrize] = useState({ name: "", priority: 1 });
  const [showOnlyFollowers, setShowOnlyFollowers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      fetchPrizes();
      fetchUsers();
    }
  }, [isLoggedIn]);

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

  const addPrize = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/prizes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPrize),
    });
    if (response.ok) {
      fetchPrizes();
      setNewPrize({ name: "", priority: 1 });
      toast({
        title: "Ödül eklendi",
        description: "Yeni ödül başarıyla eklendi.",
      });
    }
  };

  const deletePrize = async (id) => {
    const response = await fetch(`/api/prizes/${id}`, { method: "DELETE" });
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
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prize, instaFollow, linkedinFollow }),
    });
    if (response.ok) {
      fetchUsers();
    }
  };

  const filteredUsers = users
    .filter(
      (user) => !showOnlyFollowers || user.instaFollow || user.linkedinFollow
    )
    .filter(
      (user) =>
        searchTerm === "" ||
        user.prize.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              <Label htmlFor="prizePriority">Öncelik</Label>
              <Input
                id="prizePriority"
                type="number"
                value={newPrize.priority}
                onChange={(e) =>
                  setNewPrize({
                    ...newPrize,
                    priority: parseInt(e.target.value),
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
              <TableHead>Öncelik</TableHead>
              <TableHead>İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prizes.map((prize) => (
              <TableRow key={prize.id}>
                <TableCell>{prize.name}</TableCell>
                <TableCell>{prize.priority}</TableCell>
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
            placeholder="Ödül adı, Instagram veya LinkedIn kullanıcı adı"
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
              <TableHead>İsim</TableHead>
              <TableHead>Instagram</TableHead>
              <TableHead>LinkedIn</TableHead>
              <TableHead>Ödül</TableHead>
              <TableHead>Instagram Takip</TableHead>
              <TableHead>LinkedIn Takip</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.instagramUsername}</TableCell>
                <TableCell>{user.linkedinUsername}</TableCell>
                <TableCell>
                  <Select
                    value={user.prize}
                    onValueChange={(value) =>
                      updateUser(
                        user.id,
                        value,
                        user.instaFollow,
                        user.linkedinFollow
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue>{user.prize}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {prizes.map((prize) => (
                        <SelectItem key={prize.id} value={prize.name}>
                          {prize.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Toaster />
    </div>
  );
}
