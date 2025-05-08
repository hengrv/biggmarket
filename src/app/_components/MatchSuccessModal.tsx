import { CircleCheck } from "lucide-react";
import { useEffect } from "react";

interface MatchSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const MatchSuccessModal = ({ isOpen, onClose }: MatchSuccessModalProps) => {
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

              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-bm-green px-4 py-2 text-sm font-medium text-bm-black transition-all duration-300 hover:bg-bm-green/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={onClose}
                >
                  Got it, thanks!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchSuccessModal;
