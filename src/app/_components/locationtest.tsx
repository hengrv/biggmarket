"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function LocationTester() {
    // State
    const [postcode, setPostcode] = useState("");
    const [locationResult, setLocationResult] = useState({
        postcode: "",
        latitude: 0,
        longitude: 0,
    });
    const [errorMessage, setErrorMessage] = useState("");
    const { isLoading, refetch } = api.user.postcodeToLongLat.useQuery(postcode, {
        enabled: false,
    });

    // Api hooks
    const updateProfileMutation = api.user.updateProfile.useMutation({
        onSuccess: () => {
            console.log("Profile updated successfully");
        },
        onError: (err) => {
            console.error("Error updating profile:", err);
            setErrorMessage("Error updating profile location.");
        },
    });

    // Form handler
    const handlePostcodeLookup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const result = await refetch();

            if (result.data) {
                const { longitude, latitude } = result.data;

                setLocationResult({
                    postcode: postcode,
                    longitude: longitude,
                    latitude: latitude,
                });

                updateProfileMutation.mutate({
                    location: { longitude, latitude },
                });
            } else {
                setErrorMessage("Invalid postcode");
            }
        } catch (err) {
            setErrorMessage("Error fetching postcode data: " + (err instanceof Error ? err.message : "Unknown error"));
        }
    };

    return (
        <div className="w-full max-w-xs">
            <div className="mb-8 rounded border p-4">
                <h2 className="mb-4 text-xl font-semibold">Update location</h2>
                {locationResult.latitude !== 0 && locationResult.longitude !== 0 ? (
                    <div>
                        <p className="truncate">Successfully updated!</p>
                        <p className="truncate">Postcode: {postcode}</p>
                        <p className="truncate">Long: {locationResult.longitude}</p>
                        <p className="truncate">Lat: {locationResult.latitude}</p>
                    </div>
                ) : ("")}

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                <form onSubmit={handlePostcodeLookup} className="space-y-4">
                    <input
                        type="text"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        className="w-full rounded border p-2 text-black"
                        placeholder="SW1A 1AA"
                    />
                    <button
                        type="submit"
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        disabled={postcode.length < 7 || isLoading}
                    >
                        {isLoading ? "Loading..." : "Set Location"}
                    </button>
                </form>
            </div>
        </div>
    );
}