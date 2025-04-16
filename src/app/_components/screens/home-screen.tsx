"use client";

import { useState } from "react";
import ProductDetailsScreen from "./product-details-screen";
import ProductScreen from "./product-screen";

import { ProductOwner, Product } from "@components/screens/product-screen";

export default function HomeScreen() {
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  return showProductDetails ? (
    <ProductDetailsScreen
      product={currentProduct}
      setShowProductDetails={setShowProductDetails}
    />
  ) : (
    <ProductScreen
      setShowProductDetails={setShowProductDetails}
      setCurrentProduct={(product: Product) => setCurrentProduct(product)}
    />
  );
}
