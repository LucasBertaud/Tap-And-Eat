import { ProductDetailView } from "@/src/views/ProductDetailView";
import { useLocalSearchParams } from "expo-router";

/**
 * Page de détail d'un produit
 * Route dynamique: /product/[id]
 */
export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return <ProductDetailView productId={id} />;
}
