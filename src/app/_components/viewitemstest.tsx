"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import Image from "next/image";

export function ViewItemsTester() {
    // State
    const [userProfile] = api.user.getProfile.useSuspenseQuery();
    const [items, { refetch: refetchItems }] = api.algorithm.getItemsByDistance.useSuspenseQuery({
        longitude: Number(userProfile?.location?.longitude) ?? 0,
        latitude: Number(userProfile?.location?.latitude) ?? 0,
    });
    const [errorMessage, setErrorMessage] = useState("");

    return (
        <div className="w-full max-w-xs">
            <div className="mb-8 rounded border p-4">
                <h2 className="mb-4 text-xl font-semibold">View items near you</h2>
                {items.map((item) => (
                    <div key={item.id}>
                        <Image src={item.image} width='100' height='100' alt="Item image" className="w-24 h-24" />
                        <p className="truncate">ID: {item.id}</p>
                        <p className="truncate">Description: {item.description}</p>
                        <p className="truncate">Category: {item.category}</p>
                        <p className="truncate">Distance: {Number(item.distance / 1000).toFixed(1)} Km</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
