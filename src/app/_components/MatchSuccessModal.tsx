"use client";

import { CircleCheck, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

interface MatchSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchData?: {
    id: string;
    otherUserId: string;
    otherUserName: string;
  };
}

const MatchSuccessModal = ({
  isOpen,
  onClose,
  matchData,
}: MatchSuccessModalProps) => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [showRating, setShowRating] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Add review mutation
  const addReviewMutation = api.user.addProfileReview.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    },
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSubmitRating = () => {
    if (!matchData?.otherUserId) return;

    addReviewMutation.mutate({
      userId: matchData.otherUserId,
      review,
      rating,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="w-full max-w-md transform overflow-hidden rounded-2xl bg-bm-black p-6 text-left align-middle shadow-xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {!showRating ? (
              <div className="flex flex-col items-center">
                <CircleCheck className="mb-4 h-12 w-12 text-bm-green" />
                <h3 className="text-center text-lg font-medium leading-6 text-bm-white">
                  Match Accepted!
                </h3>
                <div className="mt-2">
                  <p className="text-center text-sm text-bm-white/80">
                    Congratulations! You can now chat with your match to arrange
                    the swap.
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-bm-green px-4 py-2 text-sm font-medium text-bm-black transition-all duration-300 hover:bg-bm-green/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => setShowRating(true)}
                  >
                    Rate {matchData?.otherUserName ?? "User"}
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-bm-white/20 bg-transparent px-4 py-2 text-sm font-medium text-bm-white transition-all duration-300 hover:bg-bm-white/10 focus:outline-none"
                    onClick={onClose}
                  >
                    Skip
                  </button>
                </div>
              </div>
            ) : submitted ? (
              <div className="flex flex-col items-center">
                <CircleCheck className="mb-4 h-12 w-12 text-bm-green" />
                <h3 className="text-center text-lg font-medium leading-6 text-bm-white">
                  Thank You!
                </h3>
                <p className="mt-2 text-center text-sm text-bm-white/80">
                  Your rating has been submitted successfully.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                <h3 className="mb-4 text-center text-lg font-medium leading-6 text-bm-white">
                  Rate your experience with {matchData?.otherUserName ?? "User"}
                </h3>

                <div className="mb-4 flex justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`h-8 w-8 ${star <= rating ? "fill-bm-green text-bm-green" : "text-bm-white/30"}`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  className="mb-4 h-24 w-full resize-none rounded-lg border border-bm-white/20 bg-bm-black p-3 text-bm-white placeholder-bm-white/50 focus:border-bm-green focus:outline-none"
                  placeholder="Share your experience with this swap (optional)"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-bm-white/20 bg-transparent px-4 py-2 text-sm font-medium text-bm-white transition-all duration-300 hover:bg-bm-white/10 focus:outline-none"
                    onClick={() => setShowRating(false)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-bm-green px-4 py-2 text-sm font-medium text-bm-black transition-all duration-300 hover:bg-bm-green/70 focus:outline-none"
                    onClick={handleSubmitRating}
                    disabled={addReviewMutation.isPending}
                  >
                    {addReviewMutation.isPending
                      ? "Submitting..."
                      : "Submit Rating"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchSuccessModal;
