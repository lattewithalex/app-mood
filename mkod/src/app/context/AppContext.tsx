'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type WarehouseItem = {
  id: number
  name: string
  category: string
  quantity: number
  photo?: string
}

type House = {
  id: number
  name: string
  progress: number
  address: string
  photo?: string
}

type Key = {
  id: number
  houseId: number
  keyNumber: string
  photo?: string
}

type AppContextType = {
  warehouseItems: WarehouseItem[]
  houses: House[]
  keys: Key[]
  categories: string[]
  addWarehouseItem: (item: Omit<WarehouseItem, 'id'>) => void
  updateWarehouseItem: (id: number, item: Partial<WarehouseItem>) => void
  deleteWarehouseItem: (id: number) => void
  addHouse: (house: Omit<House, 'id'>) => void
  updateHouse: (id: number, house: Partial<House>) => void
  deleteHouse: (id: number) => void
  addKey: (key: Omit<Key, 'id'>) => void
  updateKey: (id: number, key: Partial<Key>) => void
  deleteKey: (id: number) => void
  addStockToHouse: (houseId: number, itemId: number, quantity: number) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>([])
  const [houses, setHouses] = useState<House[]>([])
  const [keys, setKeys] = useState<Key[]>([])
  const [categories] = useState<string[]>(['Furniture', 'Lighting', 'Decor', 'Appliances', 'Textiles'])

  const addWarehouseItem = (item: Omit<WarehouseItem, 'id'>) => {
    setWarehouseItems(prev => [...prev, { ...item, id: prev.length + 1 }])
  }

  const updateWarehouseItem = (id: number, item: Partial<WarehouseItem>) => {
    setWarehouseItems(prev => prev.map(i => i.id === id ? { ...i, ...item } : i))
  }

  const deleteWarehouseItem = (id: number) => {
    setWarehouseItems(prev => prev.filter(i => i.id !== id))
  }

  const addHouse = (house: Omit<House, 'id'>) => {
    setHouses(prev => [...prev, { ...house, id: prev.length + 1 }])
  }

  const updateHouse = (id: number, house: Partial<House>) => {
    setHouses(prev => prev.map(h => h.id === id ? { ...h, ...house } : h))
  }

  const deleteHouse = (id: number) => {
    setHouses(prev => prev.filter(h => h.id !== id))
  }

  const addKey = (key: Omit<Key, 'id'>) => {
    setKeys(prev => [...prev, { ...key, id: prev.length + 1 }])
  }

  const updateKey = (id: number, key: Partial<Key>) => {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, ...key } : k))
  }

  const deleteKey = (id: number) => {
    setKeys(prev => prev.filter(k => k.id !== id))
  }

  const addStockToHouse = (houseId: number, itemId: number, quantity: number) => {
    // This is a placeholder function. In a real application, you'd need to implement
    // a more complex state management system to track stock allocation per house.
    console.log(`Added ${quantity} of item ${itemId} to house ${houseId}`)
  }

  return (
    <AppContext.Provider value={{
      warehouseItems,
      houses,
      keys,
      categories,
      addWarehouseItem,
      updateWarehouseItem,
      deleteWarehouseItem,
      addHouse,
      updateHouse,
      deleteHouse,
      addKey,
      updateKey,
      deleteKey,
      addStockToHouse
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}