'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Key, Pencil, Plus, Trash2 } from "lucide-react"
import { useAppContext } from '../context/AppContext'

type KeyItem = {
  id: number;
  houseId: number;
  photo?: string;
  keyNumber: string; // Added keyNumber property
}

type House = {
  id: number;
  name: string;
  // Add other properties of House if needed
}

export default function KeysPage() {
  const { keys, houses, addKey, updateKey, deleteKey } = useAppContext()
  const [newKey, setNewKey] = useState<Omit<KeyItem, 'id'>>({ houseId: 0, photo: '', keyNumber: '' })
  const [editingKey, setEditingKey] = useState<KeyItem | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddKey = () => {
    if (newKey.houseId) {
      addKey(newKey)
      setNewKey({ houseId: 0, photo: '', keyNumber: '' })
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleUpdateKey = () => {
    if (editingKey) {
      updateKey(editingKey.id, editingKey)
      setEditingKey(null)
    }
  }

  const handleDeleteKey = (id: number) => {
    deleteKey(id)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean = false) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (isEditing && editingKey) {
          setEditingKey({ ...editingKey, photo: reader.result as string })
        } else {
          setNewKey({ ...newKey, photo: reader.result as string })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Key Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Key</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="house" className="text-right">
                  House
                </Label>
                <Select
                  value={newKey.houseId.toString()}
                  onValueChange={(value) => setNewKey({ ...newKey, houseId: parseInt(value) })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a house" />
                  </SelectTrigger>
                  <SelectContent>
                    {houses.map((house: House) => (
                      <SelectItem key={house.id} value={house.id.toString()}>{house.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="keyNumber" className="text-right">
                  Key Number
                </Label>
                <Input
                  id="keyNumber"
                  value={newKey.keyNumber}
                  onChange={(e) => setNewKey({ ...newKey, keyNumber: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="photo" className="text-right">
                  Photo
                </Label>
                <Input
                  id="photo"
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileChange(e)}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddKey}>Add Key</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {keys.map((key: KeyItem) => (
          <Card key={key.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Key className="mr-2" />
                  {houses.find((h: House) => h.id === key.houseId)?.name}
                </div>
                <div>
                  <Button variant="ghost" size="icon" onClick={() => setEditingKey(key)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteKey(key.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Key Number: {key.keyNumber}</p>
              {key.photo && <img src={key.photo} alt="Key" className="mt-2 w-full h-32 object-cover" />}
            </CardContent>
          </Card>
        ))}
      </div>
      {editingKey && (
        <Dialog open={!!editingKey} onOpenChange={() => setEditingKey(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Key</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editHouse" className="text-right">
                  House
                </Label>
                <Select
                  value={editingKey.houseId.toString()}
                  onValueChange={(value) => setEditingKey({ ...editingKey, houseId: parseInt(value) })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a house" />
                  </SelectTrigger>
                  <SelectContent>
                    {houses.map((house: House) => (
                      <SelectItem key={house.id} value={house.id.toString()}>{house.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editKeyNumber" className="text-right">
                  Key Number
                </Label>
                <Input
                  id="editKeyNumber"
                  value={editingKey.keyNumber}
                  onChange={(e) => setEditingKey({ ...editingKey, keyNumber: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editPhoto" className="text-right">
                  Photo
                </Label>
                <Input
                  id="editPhoto"
                  type="file"
                  onChange={(e) => handleFileChange(e, true)}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleUpdateKey}>Update Key</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}