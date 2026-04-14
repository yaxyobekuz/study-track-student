// React
import { useState } from "react";

// Tanstack Query
import { useQuery } from "@tanstack/react-query";

// API
import { marketAPI } from "@/features/market/api/market.api";

// Components
import Card from "@/shared/components/ui/Card";
import MarketProductCard from "@/features/market/components/MarketProductCard";

const MarketProductsPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["market", "products", page],
    queryFn: () =>
      marketAPI
        .getProducts({ page, limit: 12 })
        .then((response) => response.data),
  });

  const products = data?.data || [];
  const pagination = data?.pagination;

  if (isLoading) {
    return <Card className="text-center py-10">Yuklanmoqda...</Card>;
  }

  if (!products?.length) {
    return (
      <Card className="text-center py-10 text-gray-500">
        Mahsulotlar mavjud emas
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <MarketProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-sm">
          <button
            disabled={!pagination.hasPrevPage}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="px-3 py-1 rounded-md bg-white disabled:opacity-50"
          >
            Oldingi
          </button>

          <span className="text-gray-500">
            {pagination.page} / {pagination.totalPages}
          </span>

          <button
            disabled={!pagination.hasNextPage}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-3 py-1 rounded-md bg-white disabled:opacity-50"
          >
            Keyingi
          </button>
        </div>
      )}
    </>
  );
};

export default MarketProductsPage;
