import type { ProductWithOptions } from "@/src/models";
import { menuService } from "@/src/services";
import { useEffect, useState } from "react";

export class ProductDetailViewModel {
  async loadProductDetails(
    productId: string
  ): Promise<ProductWithOptions | null> {
    try {
      return await menuService.getProductWithOptions(productId);
    } catch (error) {
      console.error("Error loading product details:", error);
      throw error;
    }
  }
}

export function useProductDetailViewModel(productId: string) {
  const [product, setProduct] = useState<ProductWithOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const viewModel = new ProductDetailViewModel();

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await viewModel.loadProductDetails(productId);
        setProduct(data);
      } catch (err) {
        setError("Impossible de charger le produit");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const reload = async () => {
    const viewModel = new ProductDetailViewModel();
    try {
      setLoading(true);
      setError(null);
      const data = await viewModel.loadProductDetails(productId);
      setProduct(data);
    } catch (err) {
      setError("Impossible de charger le produit");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    product,
    loading,
    error,
    reload,
  };
}
