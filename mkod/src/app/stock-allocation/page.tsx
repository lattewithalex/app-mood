'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Home, Package, Plus, X } from "lucide-react"
import { useAppContext } from '../context/AppContext'
import { Badge } from "@/components/ui/badge"

type AllocatedItem = {
  id: number;
  warehouseItemId: number;
  quantity: number;
}

type House = {
  id: number;
  name: string;
  progress: number;
  address: string;
}

type HouseWithItems = House & {
  allocatedItems: AllocatedItem[];
}

type WarehouseItem = {
  id: number;
  name: string;
  category: string;
}

export default function StockAllocation() {
  const { houses, warehouseItems, addHouse, updateHouse } = useAppContext()
  const [housesWithItems, setHousesWithItems] = useState<HouseWithItems[]>([])
  const [selectedHouse, setSelectedHouse] = useState<HouseWithItems | null>(null)
  const [newHouse, setNewHouse] = useState<Omit<House, 'id'>>({ name: '', progress: 0, address: '' })
  const [allocatingItem, setAllocatingItem] = useState<{ itemId: number, quantity: number } | null>(null)

  useEffect(() => {
    const updatedHouses: HouseWithItems[] = houses.map(house => ({
      ...house,
      allocatedItems: (house as HouseWithItems).allocatedItems || []
    }))
    setHousesWithItems(updatedHouses)
  }, [houses])

  const handleAddHouse = () => {
    if (newHouse.name && newHouse.address) {
      const addedHouse = addHouse(newHouse)
      const newHouseWithItems: HouseWithItems = {
        ...addedHouse,
        allocatedItems: []
      }
      setHousesWithItems([...housesWithItems, newHouseWithItems])
      setNewHouse({ name: '', progress: 0, address: '' })
    }
  }

  const handleAllocateItem = () => {
    if (selectedHouse && allocatingItem) {
      const updatedItems = [...selectedHouse.allocatedItems]
      const existingItemIndex = updatedItems.findIndex(item => item.warehouseItemId === allocatingItem.itemId)
      
      if (existingItemIndex !== -1) {
        updatedItems[existingItemIndex].quantity += allocatingItem.quantity
      } else {
        updatedItems.push({
          id: Date.now(),
          warehouseItemId: allocatingItem.itemId,
          quantity: allocatingItem.quantity
        })
      }

      const updatedHouse = {
        ...selectedHouse,
        allocatedItems: updatedItems
      }

      setSelectedHouse(updatedHouse)
      updateHouse(updatedHouse.id, updatedHouse)

      const updatedHouses = housesWithItems.map(house => 
        house.id === updatedHouse.id ? updatedHouse : house
      )
      setHousesWithItems(updatedHouses)

      setAllocatingItem(null)
    }
  }

  const handleRemoveAllocatedItem = (itemId: number) => {
    if (selectedHouse) {
      const updatedItems = selectedHouse.allocatedItems.filter(item => item.id !== itemId)
      const updatedHouse = {
        ...selectedHouse,
        allocatedItems: updatedItems
      }

      setSelectedHouse(updatedHouse)
      updateHouse(updatedHouse.id, updatedHouse)

      const updatedHouses = housesWithItems.map(house => 
        house.id === updatedHouse.id ? updatedHouse : house
      )
      setHousesWithItems(updatedHouses)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Stock Allocation</h1>
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
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="houseName" className="text-right">
                  Name
                </Label>
                <Input
                  id="houseName"
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
                  value={newHouse.progress}
                  onChange={(e) => setNewHouse({ ...newHouse, progress: parseInt(e.target.value) })}
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
            </div>
            <Button onClick={handleAddHouse}>Add House</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {housesWithItems.map((house) => (
          <Card key={house.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedHouse(house)}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="mr-2" />
                {house.name}
              </CardTitle>
              <CardDescription>{house.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Progress: {house.progress}%</p>
              <div className="mt-2">
                <p className="font-semibold">Allocated Items:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {house.allocatedItems.map((item) => {
                    const warehouseItem = warehouseItems.find(wi => wi.id === item.warehouseItemId)
                    return warehouseItem ? (
                      <Badge key={item.id} variant="secondary">
                        {warehouseItem.name}: {item.quantity}
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedHouse && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {selectedHouse.name} - Allocated Items
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Allocate Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Allocate Item</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="item" className="text-right">
                        Item
                      </Label>
                      <Select onValueChange={(value) => setAllocatingItem({ itemId: parseInt(value), quantity: 1 })}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select an item" />
                        </SelectTrigger>
                        <SelectContent>
                          {warehouseItems.map((item) => (
                            <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
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
                        value={allocatingItem?.quantity || 0}
                        onChange={(e) => setAllocatingItem(prev => prev ? { ...prev, quantity: parseInt(e.target.value) } : null)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAllocateItem}>Allocate</Button>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedHouse.allocatedItems.map((allocatedItem) => {
                  const item = warehouseItems.find(i => i.id === allocatedItem.warehouseItemId)
                  return item ? (
                    <TableRow key={allocatedItem.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{allocatedItem.quantity}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveAllocatedItem(allocatedItem.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : null
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}