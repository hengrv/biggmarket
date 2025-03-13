"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Trash2, Upload, Loader2, Info } from "lucide-react"
import Image from "next/image"

export default function UploadItemScreen({
  handleItemUpload,
}: {
  handleItemUpload: () => void
}) {
  const [itemName, setItemName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Furniture")
  const [condition, setCondition] = useState("New")
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAddImage = () => {
    
    const newImage = `/placeholder.svg?height=${200 + Math.floor(Math.random() * 100)}&width=${200 + Math.floor(Math.random() * 100)}`
    setImages([...images, newImage])
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    
    setTimeout(() => {
      setIsLoading(false)
      handleItemUpload()
    }, 1500)
  }

  return (
    <div className="h-full pb-16 overflow-auto">
      <div className="p-4">
        <div className="flex items-center mb-6">
          <h2 className="text-foreground text-xl font-bold flex-1">Upload Your First Item</h2>
        </div>

        <div className="bg-secondary rounded-lg p-4 mb-6">
          <p className="text-foreground text-sm mb-4">
            <span className="text-[#c1ff72] font-semibold">Welcome to BiggMarket!</span> To start swapping, you need to
            upload at least one item. This helps create a community of sharers.
          </p>

          <div className="flex items-center text-muted text-xs">
            <Info className="w-4 h-4 mr-1 text-[#c1ff72]" />
            <span>You&apos;ll be able to browse and swap after uploading.</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-muted text-xs block">Item Photos (required)</label>
            <div className="grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square bg-secondary rounded-lg overflow-hidden">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Item photo ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <button
                  type="button"
                  className="aspect-square bg-secondary border-2 border-dashed border-[#3a3a3a] rounded-lg flex flex-col items-center justify-center"
                  onClick={handleAddImage}
                >
                  <Camera className="w-6 h-6 text-primary mb-1" />
                  <span className="text-muted text-xs">Add Photo</span>
                </button>
              )}
            </div>
            {images.length === 0 && <p className="text-red-400 text-xs">At least one photo is required</p>}
          </div>

          <div>
            <label className="text-muted text-xs block mb-1">Item Name (required)</label>
            <input
              type="text"
              placeholder="e.g. Vintage Chair"
              className="w-full bg-secondary text-foreground rounded-lg p-3 outline-none border border-[#3a3a3a] focus:border-primary"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-muted text-xs block mb-1">Description</label>
            <textarea
              placeholder="Describe your item..."
              className="w-full bg-secondary text-foreground rounded-lg p-3 outline-none border border-[#3a3a3a] focus:border-primary h-24 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-muted text-xs block mb-1">Category</label>
              <select
                className="w-full bg-secondary text-foreground rounded-lg p-3 outline-none border border-[#3a3a3a] focus:border-primary appearance-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Furniture</option>
                <option>Clothing</option>
                <option>Electronics</option>
                <option>Books</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="text-muted text-xs block mb-1">Condition</label>
              <select
                className="w-full bg-secondary text-foreground rounded-lg p-3 outline-none border border-[#3a3a3a] focus:border-primary appearance-none"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option>New</option>
                <option>Like New</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#c1ff72] text-black font-semibold rounded-lg py-3 mt-4 flex items-center justify-center shadow-lg hover:bg-[#b4f55e] transition-colors"
            disabled={isLoading || images.length === 0 || !itemName}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Upload className="w-5 h-5 mr-2" />}
            {isLoading ? "Uploading..." : "Upload Item & Continue"}
          </button>
        </form>
      </div>
    </div>
  )
}
