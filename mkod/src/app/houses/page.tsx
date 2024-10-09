'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Home, Plus, Pencil, Trash2, AlertCircle } from "lucide-react"
import { useAppContext } from '../context/AppContext'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type House = {
  id: number;
  name: string;
  progress: number;
  address: string;
  photo?: string;
}

export default function HousesPage() {
  const { houses, addHouse, updateHouse, deleteHouse } = useAppContext()
  const [newHouse, setNewHouse] = useState<Omit<House, 'id'>>({ name: '', progress: 0, address: '', photo: '' })
  const [editingHouse, setEditingHouse] = useState<House | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddHouse = () => {
    if (newHouse.name && newHouse.address) {
      addHouse(newHouse)
      setNewHouse({ name: '', progress: 0, address: '', photo: '' })
      if (fileInputRef.current) fileInputRef.current.value = ''
      setError(null)
    } else {
      setError('Please fill in both name and address fields.')
    }
  }

  const handleUpdateHouse = () => {
    if (editingHouse && editingHouse.name && editingHouse.address) {
      updateHouse(editingHouse.id, editingHouse)
      setEditingHouse(null)
      setError(null)
    } else {
      setError('Please fill in both name and address fields.')
    }
  }

  const handleDeleteHouse = (id: number) => {
    if (window.confirm('Are you sure you want to delete this house?')) {
      deleteHouse(id)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean = false) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (isEditing && editingHouse) {
          setEditingHouse({ ...editingHouse, photo: reader.result as string })
        } else {
          setNewHouse({ ...newHouse, photo: reader.result as string })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Houses</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New House
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New House</DialogTitle>
            </DialogHeader>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newHouse.name}
                  onChange={(e) => setNewHouse({ ...newHouse, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="progress" className="text-right">
                  Progress
                </Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={newHouse.progress}
                  onChange={(e) => setNewHouse({ ...newHouse, progress: Math.min(100, Math.max(0, parseInt(e.target.value))) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  value={newHouse.address}
                  onChange={(e) => setNewHouse({ ...newHouse, address: e.target.value })}
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
                  accept="image/*"
                />
              </div>
            </div>
            <Button onClick={handleAddHouse}>Add House</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {houses.map(house => (
          <Card key={house.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Home className="mr-2" />
                  {house.name}
                </div>
                <div>
                  <Button variant="ghost" size="icon" onClick={() => setEditingHouse(house)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteHouse(house.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Progress: {house.progress}%</p>
              <p>Address: {house.address}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{width: `${house.progress}%`}}
                ></div>
              </div>
              {house.photo && <img src={house.photo} alt="House" className="mt-2 w-full h-32 object-cover rounded-md" />}
            </CardContent>
          </Card>
        ))}
      </div>
      {editingHouse && (
        <Dialog open={!!editingHouse} onOpenChange={() => setEditingHouse(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit House</DialogTitle>
            </DialogHeader>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editName" className="text-right">
                  Name
                </Label>
                <Input
                  id="editName"
                  value={editingHouse.name}
                  onChange={(e) => setEditingHouse({ ...editingHouse, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editProgress" className="text-right">
                  Progress
                </Label>
                <Input
                  id="editProgress"
                  type="number"
                  min="0"
                  max="100"
                  value={editingHouse.progress}
                  onChange={(e) => setEditingHouse({ ...editingHouse, progress: Math.min(100, Math.max(0, parseInt(e.target.value))) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editAddress" className="text-right">
                  Address
                </Label>
                <Input
                  id="editAddress"
                  value={editingHouse.address}
                  onChange={(e) => setEditingHouse({ ...editingHouse, address: e.target.value })}
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
                  accept="image/*"
                />
              </div>
            </div>
            <Button onClick={handleUpdateHouse}>Update House</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}