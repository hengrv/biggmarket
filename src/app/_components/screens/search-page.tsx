"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import Image from "next/image"
import AppShell from "@/components/app-shell"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"all" | "items" | "accounts">("all")
  const [showResults, setShowResults] = useState(false)

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowResults(true)
    }
  }

  return (
    <AppShell activeScreen="search" title="Search">
      <div className="p-4">
        <div className="bg-secondary rounded-lg flex items-center px-4 py-2 mb-4 shadow-lg">
          <Search className="w-4 h-4 text-primary mr-2" />
          <input
            type="text"
            placeholder="Search for item or @username"
            className="bg-transparent outline-none flex-1 text-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          {searchQuery && <X className="w-4 h-4 text-muted cursor-pointer" onClick={() => setSearchQuery("")} />}
        </div>

        <div className="flex mb-6 bg-secondary rounded-lg p-1 shadow-lg">
          <button
            className={`flex-1 py-2 text-sm rounded-md ${searchType === "all" ? "bg-[#c1ff72] text-black font-medium" : "text-muted"}`}
            onClick={() => setSearchType("all")}
          >
            All
          </button>
          <button
            className={`flex-1 py-2 text-sm rounded-md ${searchType === "items" ? "bg-[#c1ff72] text-black font-medium" : "text-muted"}`}
            onClick={() => setSearchType("items")}
          >
            Items
          </button>
          <button
            className={`flex-1 py-2 text-sm rounded-md ${searchType === "accounts" ? "bg-[#c1ff72] text-black font-medium" : "text-muted"}`}
            onClick={() => setSearchType("accounts")}
          >
            Accounts
          </button>
        </div>

        {!showResults ? (
          <div className="text-center">
            <h2 className="text-foreground text-3xl font-bold leading-tight mb-4">
              Wey aye, <br />
              divvent waste, <br />
              just give it <br />a place!
            </h2>
          </div>
        ) : (
          <SearchResults query={searchQuery} type={searchType} setShowResults={setShowResults} />
        )}
      </div>
    </AppShell>
  )
}

function SearchResults({
  query,
  type,
  setShowResults,
}: {
  query: string
  type: string
  setShowResults: (show: boolean) => void
}) {
  const itemResults = [
    {
      id: 1,
      name: "Vintage Chair",
      image: "/placeholder.svg?height=100&width=100",
      distance: "2 miles away",
    },
    {
      id: 2,
      name: "Blue T-Shirt",
      image: "/placeholder.svg?height=100&width=100",
      distance: "3 miles away",
    },
  ].filter((item) => (query ? item.name.toLowerCase().includes(query.toLowerCase()) : true))

  const accountResults = [
    {
      id: 3,
      name: "Katie",
      username: "@katie1993",
      image: "/placeholder.svg?height=40&width=40",
      rating: 5,
    },
    {
      id: 4,
      name: "Jacob",
      username: "@jacob_swapper",
      image: "/placeholder.svg?height=40&width=40",
      rating: 4,
    },
  ].filter((account) =>
    query
      ? account.name.toLowerCase().includes(query.toLowerCase()) ||
      account.username.toLowerCase().includes(query.toLowerCase())
      : true,
  )

  const filteredItemResults = type === "accounts" ? [] : itemResults
  const filteredAccountResults = type === "items" ? [] : accountResults

  const handleBackToSearch = () => {
    setShowResults(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Results for &quot;{query}&quot;</h3>
        <button onClick={handleBackToSearch} className="text-sm text-primary">
          Clear Results
        </button>
      </div>

      {filteredItemResults.length > 0 && (
        <div>
          <div className="mb-3 flex items-center font-semibold text-foreground">
            <Search className="mr-2 h-4 w-4 text-primary" />
            Items ({filteredItemResults.length})
          </div>
          <div className="grid grid-cols-2 gap-3">
            {filteredItemResults.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-lg bg-secondary shadow-lg">
                <div className="relative">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="h-32 w-full object-cover"
                    draggable={false}
                  />
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold text-foreground">{item.name}</div>
                  <div className="mt-1 flex items-center text-xs text-muted">
                    <span>{item.distance}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredAccountResults.length > 0 && (
        <div>
          <div className="mb-3 flex items-center font-semibold text-foreground">
            <Search className="mr-2 h-4 w-4 text-primary" />
            Accounts ({filteredAccountResults.length})
          </div>
          <div className="space-y-3">
            {filteredAccountResults.map((account) => (
              <div key={account.id} className="flex cursor-pointer items-center rounded-lg bg-secondary p-3 shadow-lg">
                <div className="mr-3 h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={account.image || "/placeholder.svg"}
                    alt={account.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>

                <div className="flex-1">
                  <div className="font-semibold text-foreground">{account.name}</div>
                  <div className="text-xs text-muted">{account.username}</div>
                </div>

                <div className="flex items-center">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} className={`text-xs ${i < account.rating ? "text-primary" : "text-[#3a3a3a]"}`}>
                        ★
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredItemResults.length === 0 && filteredAccountResults.length === 0 && (
        <div className="rounded-lg bg-secondary p-6 text-center shadow-lg">
          <Search className="mx-auto mb-3 h-10 w-10 text-primary" />
          <h3 className="mb-2 font-semibold text-foreground">No results found</h3>
          <p className="text-sm text-muted">Try different keywords or check your spelling</p>
        </div>
      )}
    </div>
  )
}

