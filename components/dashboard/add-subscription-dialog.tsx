"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useSubscriptionStore } from "@/lib/store/useSubscriptionStore"

interface AddSubscriptionDialogProps {
  onAdd: () => void
  prefilledDate?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AddSubscriptionDialog({ onAdd, prefilledDate, open, onOpenChange }: AddSubscriptionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const { addSubscription, isLoading } = useSubscriptionStore()
  const [formData, setFormData] = useState({
    serviceName: "",
    cost: "",
    renewalDate: prefilledDate || "",
    duration: "monthly",
    customCycle: "",
    category: "Entertainment",
  })

  const categories = ["Entertainment", "Productivity", "Software", "Music", "Video", "News", "Fitness", "Other"]

  const isOpen = open !== undefined ? open : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const subscriptionData: any = {
      ...formData,
      cost: Number.parseFloat(formData.cost),
      renewalDate: formData.renewalDate,
    }

    if (formData.duration === "custom" && formData.customCycle) {
      subscriptionData.customCycle = Number.parseInt(formData.customCycle)
    }

    const success = await addSubscription(subscriptionData)

    if (success) {
      setFormData({
        serviceName: "",
        cost: "",
        renewalDate: prefilledDate || "",
        duration: "monthly",
        customCycle: "",
        category: "Entertainment",
      })
      setIsOpen(false)
      onAdd()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!open && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Subscription
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serviceName">Service Name</Label>
            <Input
              id="serviceName"
              value={formData.serviceName}
              onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="renewalDate">Next Renewal Date</Label>
            <Input
              id="renewalDate"
              type="date"
              value={formData.renewalDate}
              onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Billing Cycle</Label>
            <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Every 3 months</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.duration === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customCycle">Custom Cycle (months)</Label>
              <Input
                id="customCycle"
                type="number"
                min="1"
                max="60"
                value={formData.customCycle}
                onChange={(e) => setFormData({ ...formData, customCycle: e.target.value })}
                placeholder="e.g., 6 for every 6 months"
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Subscription"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
