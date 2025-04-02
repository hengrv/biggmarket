"use client"

import { useState } from "react"
import ProductDetailsScreen from "./product-details-screen"
import ProductScreen from "./product-screen"

interface ProductOwner {
  id: string;
  name: string;
  rating: number | null;
  image: string;
}

interface Product {
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

export default function HomeScreen() {
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  return showProductDetails ? (
    <ProductDetailsScreen product={currentProduct} setShowProductDetails={setShowProductDetails} />
  ) : (
    <ProductScreen
      setShowProductDetails={setShowProductDetails}
      setCurrentProduct={(product: Product) => setCurrentProduct(product)}
    />
  )
}