'use client'

import React from 'react'
import { Building, Key, Package, Home, LayoutDashboard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useAppContext } from './context/AppContext'

export default function Dashboard() {
  const { warehouseItems, houses, keys } = useAppContext()

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { id: 'warehouse', label: 'Warehouse Stock', icon: Package, href: '/warehouse' },
    { id: 'houses', label: 'Houses', icon: Home, href: '/houses' },
    { id: 'keys', label: 'Keys', icon: Key, href: '/keys' },
    { id: 'stockAllocation', label: 'Stock Allocation', icon: Building, href: '/stock-allocation' },
  ]

  const totalStockItems = warehouseItems.reduce((sum, item) => sum + item.quantity, 0)
  const housesInProgress = houses.filter((house) => house.progress < 100).length
  const totalKeys = keys.length
  const stockCategories = new Set(warehouseItems.map((item) => item.category)).size

  const recentUpdates = [
    ...warehouseItems.slice(-3).map((item) => `Added ${item.name} to Warehouse - Quantity: ${item.quantity}`),
    ...houses.slice(-3).map((house) => `Updated ${house.name} - Progress: ${house.progress}%`)
  ]

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <Link href={tab.href} key={tab.id}>
            <Button
              variant="outline"
              className="flex items-center space-x-2 whitespace-nowrap"
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </Button>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totalStockItems}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Houses in Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{housesInProgress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totalKeys}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Stock Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stockCategories}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recentUpdates.map((update, index) => (
                <li key={index}>{update}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>House Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {houses.map((house) => (
                <li key={house.id}>
                  {house.name} - {house.progress}% complete
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-1">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${house.progress}%`}}></div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}