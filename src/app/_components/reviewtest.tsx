"use client";

import { useState } from "react";
import Image from "next/image";

import { api } from "~/trpc/react";
import { number } from "zod";

export function ReviewTester() {
   const [reviewData, setReviewData] = useState({
        userId: "",
        review: "",
        rating: 0,
    });

    // API Hooks
    const { data: userReviews, refetch: refetchReviews } = api.user.getProfileReviews.useQuery();
    const addReview = api.user.addProfileReview.useMutation();

    // Handler
    const handleReview = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await addReview.mutateAsync(reviewData);
            setReviewData({ userId: "", review: "", rating: 0 });
        } catch (error) {
            console.error("Review error:", error);
        }
    };
    
    return (
    <div className="mx-auto max-w-4xl p-4">
        <h1 className="mb-4 text-2xl font-bold">Review API Tester</h1>

        {/* Create Item Form */}
        <div className="mb-8 rounded border p-4">
            <h2 className="mb-4 text-xl font-semibold">Create New Item</h2>
            <form onSubmit={handleReview} className="space-y-4">
                <div>
                <label className="mb-1 block">User ID:</label>
                <input
                    type="text"
                    value={reviewData.userId}
                    onChange={(e) =>
                    setReviewData((prev) => ({ ...prev, userId: e.target.value }))
                    }
                    className="w-full rounded border p-2 text-black"
                    placeholder="User ID"
                />
                </div>
                <div>
                <label className="mb-1 block">Rating (1-5):</label>
                <input
                    type="number"
                    value={reviewData.rating}
                    onChange={(e) =>
                    setReviewData((prev) => ({
                        ...prev,
                        rating: parseInt(e.target.value),
                    }))
                    }
                    className="w-full rounded border p-2 text-black"
                    placeholder="5"
                />
                </div>
                <div>
                <label className="mb-1 block">Description:</label>
                <textarea
                    value={reviewData.review}
                    onChange={(e) =>
                    setReviewData((prev) => ({
                        ...prev,
                        review: e.target.value,
                    }))
                    }
                    className="w-full rounded border p- text-black"
                    placeholder="Write review here..."
                />
                </div>
                <button
                type="submit"
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                disabled={addReview.isPending}
                >
                {addReview.isPending ? "Sending..." : "Add Review"}
                </button>
            </form>
        </div>

        <h1 className="mb-4 text-2xl font-bold">Your Reviews</h1>
            {userReviews?.map((review) => (
                <div key={review.id} className="mb-4 rounded border p-4">
                    <p className="truncate">ID: {review.id}</p>
                    <p className="truncate">User ID: {review.userId}</p>
                    <p className="truncate">Reviewer: {review.reviewer}</p>
                    <p className="truncate">Rating: {review.rating}</p>
                </div>
            ))}
    </div>
    );
}
