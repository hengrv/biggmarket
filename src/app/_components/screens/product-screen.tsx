"use client";

import type React from "react";

import { useState, useRef, useEffect, memo, useCallback, useMemo } from "react";
import { MapPin, Eye, X, Check, AlertTriangle, Filter } from "lucide-react";
import Image from "next/image";
import AppShell from "@/components/app-shell";
import { api } from "~/trpc/react";

export interface ProductOwner {
  id: string;
  name: string | null;
  rating: number | null;
  image: string | null;
}

export interface Product {
  id: string;
  title: string;
  images: string[];
  distance: number; // meters
  description: string;
  category: string; // added category
  status: string;
  user: ProductOwner;
  createdAt: Date;
  updatedAt: Date;
}

interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  className?: string;
}

// Memoized action buttons
const ActionButton = memo(function ActionButton({
  icon: Icon,
  label,
  onClick,
  className,
}: ActionButtonProps) {
  return (
    <button
      className={`mr-3 flex flex-1 items-center justify-center rounded-full bg-[#242424] px-3 py-2 text-sm text-[#f3f3f3] transition-colors hover:bg-[#2a2a2a] ${className ?? ""}`}
      onClick={onClick}
    >
      <Icon className="mr-1 h-4 w-4 text-[#c1ff72]" />
      {label}
    </button>
  );
});
ActionButton.displayName = "ActionButton";

interface SwipeButtonProps {
  onClick: () => void;
  icon: React.ElementType;
  iconColor: string;
}

// Memoized swipe buttons
const SwipeButton = memo(function SwipeButton({
  onClick,
  icon: Icon,
  iconColor,
}: SwipeButtonProps) {
  return (
    <button
      className="flex h-14 w-14 items-center justify-center rounded-full bg-[#242424] shadow-lg transition-colors hover:bg-[#2a2a2a]"
      onClick={onClick}
    >
      <Icon className={`h-7 w-7 ${iconColor}`} />
    </button>
  );
});
SwipeButton.displayName = "SwipeButton";

const ProductScreen = function ProductScreen({
  setShowProductDetails,
  setCurrentProduct,
}: {
  setShowProductDetails: (show: boolean) => void;
  setCurrentProduct: (product: Product) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  // Add swipe mutation
  const swipeMutation = api.item.swipeItem.useMutation();

  // Categories list
  const categories = [
    "Electronics & Tech",
    "Fashion & Apparel",
    "Home & Living",
    "Health & Beauty",
    "Sports & Outdoors",
    "Kids & Baby",
    "Automotive & Tools",
    "Books & Entertainment",
    "Pet Supplies",
    "Cooking Supplies",
  ];

  // get products
  const productsData = api.item.getItemsOnLocation.useQuery();
  const [products, setProducts] = useState<Product[]>([]);

  // Update products when query data changes
  useEffect(() => {
    if (productsData.data) {
      setProducts(productsData.data);
    }
  }, [productsData.data]);

  const filteredProducts =
    selectedCategory !== null
      ? products.filter((product) => product.category === selectedCategory)
      : products;

  // reset index
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  const cardRef = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const swipeThreshold = 100;

  const { data: user } = api.user.getProfile.useQuery();

  // Get the current product safely
  const product = useMemo<Product>(() => {
    return filteredProducts.length > 0
      ? filteredProducts[currentIndex % filteredProducts.length]!
      : {
        id: "0",
        title: "",
        images: [],
        distance: 0,
        description: "",
        category: "",
        status: "",
        user: { id: "0", name: "", rating: null, image: "" },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
  }, [filteredProducts, currentIndex]);

  // Define all hooks before any conditional returns
  const handleViewDetails = useCallback(() => {
    if (filteredProducts.length > 0) {
      setCurrentProduct(product);
      setShowProductDetails(true);
    }
  }, [
    product,
    setCurrentProduct,
    setShowProductDetails,
    filteredProducts.length,
  ]);

  const handleReport = useCallback(() => {
    if (filteredProducts.length === 0) return;

    const reason = window.prompt(
      "Please select a reason for reporting this item:\n\n1. Prohibited item\n2. Inappropriate content\n3. Suspected scam\n4. Other",
    );

    if (reason) {
      alert("Thank you for your report. Our team will review this item.");
      console.log("Item reported:", product.title, "Reason:", reason);
    }
  }, [product.title, filteredProducts.length]);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    // @ts-expect-error this code doesn't care if e is undefined
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (startX === 0) return;
    // @ts-expect-error this code doesn't care if e is undefined
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    setOffsetX(diff);

    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${diff}px) rotate(${diff * 0.05}deg)`;
    }
  };

  const handleTouchEnd = () => {
    if (cardRef.current) {
      if (offsetX > swipeThreshold) {
        // right swipe
        cardRef.current.style.transform = `translateX(1000px) rotate(30deg)`;
        setTimeout(() => {
          setCurrentIndex(
            (prev) => (prev + 1) % Math.max(1, filteredProducts.length),
          );
          setOffsetX(0);

          // Call the swipe API
          swipeMutation.mutate({
            itemId: product.id,
            direction: "RIGHT",
          });
          console.log("Swiped right");
        }, 300);
      } else if (offsetX < -swipeThreshold) {
        // left swipe
        cardRef.current.style.transform = `translateX(-1000px) rotate(-30deg)`;
        setTimeout(() => {
          setCurrentIndex(
            (prev) => (prev + 1) % Math.max(1, filteredProducts.length),
          );
          setOffsetX(0);

          // Call the swipe API
          swipeMutation.mutate({
            itemId: product.id,
            direction: "LEFT",
          });
          console.log("Swiped left");
        }, 300);
      } else {
        cardRef.current.style.transform = `translateX(0) rotate(0)`;
        setOffsetX(0);
      }
    }
    setStartX(0);
  };

  // Create stable callback functions for each swipe direction
  const handleLeftSwipe = useCallback(() => {
    if (filteredProducts.length === 0) return;

    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(-1000px) rotate(-30deg)`;

      // Call the swipe API
      swipeMutation.mutate({
        itemId: product.id,
        direction: "LEFT",
      });
      console.log("Swiped left");

      setTimeout(() => {
        setCurrentIndex(
          (prev) => (prev + 1) % Math.max(1, filteredProducts.length),
        );
        setOffsetX(0);
      }, 300);
    }
  }, [filteredProducts.length, product.id, swipeMutation]);

  const handleRightSwipe = useCallback(() => {
    if (filteredProducts.length === 0) return;

    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(1000px) rotate(30deg)`;

      // Call the swipe API
      swipeMutation.mutate({
        itemId: product.id,
        direction: "RIGHT",
      });
      console.log("Swiped right");

      setTimeout(() => {
        setCurrentIndex(
          (prev) => (prev + 1) % Math.max(1, filteredProducts.length),
        );
        setOffsetX(0);
      }, 300);
    }
  }, [filteredProducts.length, product.id, swipeMutation]);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(0) rotate(0)`;
    }
  }, [cardRef, currentIndex]);

  if (filteredProducts.length === 0) {
    return (
      <AppShell
        activeScreen="home"
        title={`Hiya ${user?.name ? user?.name : ""}`}
      >
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Find Items</h2>
            <button
              className="rounded-full bg-[#242424] p-2"
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            >
              <Filter className="h-5 w-5 text-[#c1ff72]" />
            </button>
          </div>

          {showCategoryFilter && (
            <div className="mb-6 rounded-lg bg-[#242424] p-3 shadow-lg duration-200 animate-in fade-in">
              <h3 className="mb-2 text-sm font-medium">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`rounded-full px-3 py-1 text-xs ${selectedCategory === null
                      ? "bg-[#c1ff72] text-black"
                      : "bg-[#1a1a1a] text-[#f3f3f3]"
                    }`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All Items
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`rounded-full px-3 py-1 text-xs ${selectedCategory === category
                        ? "bg-[#c1ff72] text-black"
                        : "bg-[#1a1a1a] text-[#f3f3f3]"
                      }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg bg-[#242424] p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1a1a1a]">
              <AlertTriangle className="h-8 w-8 text-[#c1ff72]" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No items found</h3>
            <p className="mb-4 text-sm text-[#a9a9a9]">
              There are no items in the {selectedCategory} category right now.
            </p>
            <button
              className="rounded-lg bg-[#c1ff72] px-4 py-2 font-medium text-black"
              onClick={() => setSelectedCategory(null)}
            >
              View All Items
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      activeScreen="home"
      title={`Hiya ${user?.name ? user?.name : ""}`}
    >
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Find Items</h2>
          <button
            className="rounded-full bg-[#242424] p-2"
            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
          >
            <Filter className="h-5 w-5 text-[#c1ff72]" />
          </button>
        </div>

        {showCategoryFilter && (
          <div className="mb-6 rounded-lg bg-[#242424] p-3 shadow-lg duration-200 animate-in fade-in">
            <h3 className="mb-2 text-sm font-medium">Filter by Category</h3>
            <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
              <button
                className={`rounded-full px-3 py-1 text-xs ${selectedCategory === null
                    ? "bg-[#c1ff72] text-black"
                    : "bg-[#1a1a1a] text-[#f3f3f3]"
                  }`}
                onClick={() => setSelectedCategory(null)}
              >
                All Items
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`rounded-full px-3 py-1 text-xs ${selectedCategory === category
                      ? "bg-[#c1ff72] text-black"
                      : "bg-[#1a1a1a] text-[#f3f3f3]"
                    }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        <div
          ref={cardRef}
          className="mb-3 overflow-hidden rounded-lg bg-[#242424] shadow-lg transition-transform duration-300 ease-out"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          <div className="relative">
            <Image
              src={product.images[0] ?? "/placeholder.svg"}
              alt=""
              width={300}
              height={400}
              className="h-[400px] w-full object-cover"
              draggable={false}
            />
            <div className="absolute bottom-1 left-2 flex items-center rounded-full bg-black/50 px-3 py-1">
              <MapPin className="mr-1 h-3 w-3 text-[#c1ff72]" />
              <span className="text-xs text-white">
                {(product.distance / 1000).toFixed(1)} km
              </span>
            </div>
            <div className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-1">
              <span className="text-xs text-white">{product.category}</span>
            </div>
          </div>

          <div className="p-3">
            <h2 className="text-lg font-bold text-[#f3f3f3]">
              {product.title}
            </h2>
            <div className="mt-1 flex items-center">
              <div className="mr-1 h-5 w-5 overflow-hidden rounded-full">
                <Image
                  src={product.user.image ?? "/profile-placeholder.svg"}
                  alt={product.user.name ?? ""}
                  width={20}
                  height={20}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
              <span className="text-xs text-[#a9a9a9]">
                {product.user.name} • {product.user.rating} ★
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center">
          <ActionButton
            icon={Eye}
            label="View Details"
            onClick={handleViewDetails}
          />
          <ActionButton
            icon={AlertTriangle}
            label="Report"
            onClick={handleReport}
            className="flex-1"
          />
        </div>

        <div className="mt-6 flex justify-between">
          <SwipeButton
            onClick={handleLeftSwipe}
            icon={X}
            iconColor="text-[#f93030]"
          />

          <SwipeButton
            onClick={handleRightSwipe}
            icon={Check}
            iconColor="text-[#6efa73]"
          />
        </div>
      </div>
    </AppShell>
  );
};

export default memo(ProductScreen);
