// Router
import { useParams } from "react-router-dom";

// Hooks
import useModal from "@/shared/hooks/useModal";

// Tanstack Query
import { useQuery } from "@tanstack/react-query";

// API
import { marketAPI } from "@/features/market/api/market.api";
import { authAPI } from "@/features/auth/api/auth.api";

// Components
import Card from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/shadcn/button";
import BackHeader from "@/shared/components/layout/BackHeader";
import MarketOrderModal from "@/features/market/components/MarketOrderModal";

const MarketProductDetailPage = () => {
  const { openModal } = useModal();
  const { productId } = useParams();

  const { data: me } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authAPI.getMe().then((res) => res.data.data),
  });

  const { data: product, isLoading } = useQuery({
    queryKey: ["market", "product", productId],
    queryFn: () =>
      marketAPI
        .getProductById(productId)
        .then((response) => response.data.data),
  });

  const imageUrl =
    product?.images?.[0]?.variants?.md?.url ||
    product?.images?.[0]?.variants?.original?.url ||
    "";

  return (
    <div className="min-h-screen pb-28 bg-gray-100 animate__animated animate__fadeIn">
      <BackHeader href="/market/products" title="Mahsulot" />

      <div className="container pt-4 space-y-4">
        {isLoading ? (
          <Card className="text-center py-10">Yuklanmoqda...</Card>
        ) : !product ? (
          <Card className="text-center py-10 text-gray-500">
            Mahsulot topilmadi
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Image */}
            <img
              width={544}
              height={544}
              src={imageUrl}
              alt={product.name}
              className="w-full h-auto bg-white rounded-2xl"
            />

            {/* Product Info */}
            <div className="space-y-1.5">
              <h1 className="font-semibold text-gray-900 xs:text-lg">
                {product.name}
              </h1>

              <p className="text-sm text-gray-500 xs:text-base">
                {product.description || "Tavsif kiritilmagan"}
              </p>
            </div>

            {/* Product Details */}
            <p className="text-primary font-semibold xs:text-lg">
              {product.price} tanga
            </p>

            {/* Create Order Button */}
            {me?.penaltyPoints > 3 ? (
              <div className="space-y-2">
                <p className="text-sm text-red-600 text-center">
                  Jarima balingiz 3 dan yuqori bo'lgani uchun buyurtma bera
                  olmaysiz.
                </p>
                <Button className="w-full" disabled>
                  Buyurtma berish
                </Button>
              </div>
            ) : (
              <Button
                className="w-full"
                disabled={product.quantity < 1}
                onClick={() => openModal("marketOrder", { product })}
              >
                Buyurtma berish
              </Button>
            )}
          </div>
        )}
      </div>

      <MarketOrderModal />
    </div>
  );
};

export default MarketProductDetailPage;
