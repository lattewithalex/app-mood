'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Plus, Pencil, Trash2 } from "lucide-react"
import { useAppContext } from '../context/AppContext'

type WarehouseItem = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  photo?: string;
}

export default function WarehousePage() {
  const { warehouseItems, categories, addWarehouseItem, updateWarehouseItem, deleteWarehouseItem } = useAppContext()
  const [newItem, setNewItem] = useState<Omit<WarehouseItem, 'id'>>({ name: '', category: categories[0], quantity: 0, photo: '' })
  const [editingItem, setEditingItem] = useState<WarehouseItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddItem = () => {
    if (newItem.name && newItem.category && newItem.quantity > 0) {
      addWarehouseItem(newItem)
      setNewItem({ name: '', category: categories[0], quantity: 0, photo: '' })
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleUpdateItem = () => {
    if (editingItem) {
      updateWarehouseItem(editingItem.id, editingItem)
      setEditingItem(null)
    }
  }

  const handleDeleteItem = (id: number) => {
    deleteWarehouseItem(id)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean = false) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (isEditing && editingItem) {
          setEditingItem({ ...editingItem, photo: reader.result as string })
        } else {
          setNewItem({ ...newItem, photo: reader.result as string })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const filteredItems = selectedCategory
    ? warehouseItems.filter(item => item.category === selectedCategory)
    : warehouseItems

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Warehouse Stock</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
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
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mb-4">
        <Select onValueChange={(value) => setSelectedCategory(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="mr-2" />
                  {item.name}
                </div>
                <div>
                  <Button variant="ghost" size="icon" onClick={() => setEditingItem(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Category: {item.category}</p>
              <p>Quantity: {item.quantity}</p>
              {item.photo && <img src={item.photo} alt="Item" className="mt-2 w-full h-32 object-cover" />}
            </CardContent>
          </Card>
        ))}
      </div>
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editName" className="text-right">
                  Name
                </Label>
                <Input
                  id="editName"
                  value={editingItem.name}
                  onChange={(e) => 
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editCategory" className="text-right">
                  Category
                </Label>
                <Select
                  onValueChange={(value) =>
                    setEditingItem({ ...editingItem, category: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editQuantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="editQuantity"
                  type="number"
                  value={editingItem.quantity}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      quantity: parseInt(e.target.value),
                    })
                  }
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
            <Button onClick={handleUpdateItem}>Update Item</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}