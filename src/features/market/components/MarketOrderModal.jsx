// Roaster
import { toast } from "sonner";

// React
import { useState } from "react";

// API
import { marketAPI } from "@/features/market/api/market.api";

// Components
import ModalWrapper from "@/shared/components/ui/ModalWrapper";

// Tanstack Query
import { Button } from "@/shared/components/shadcn/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Market order modal component.
 * @returns {JSX.Element} Order modal.
 */
const MarketOrderModal = () => (
  <ModalWrapper
    name="marketOrder"
    title="Buyurtma berish"
    description="Mahsulot sonini tanlang"
  >
    <Content />
  </ModalWrapper>
);

const Content = ({ product, close }) => {
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);

  const createOrderMutation = useMutation({
    mutationFn: () =>
      marketAPI.createOrder({
        productId: product?._id,
        quantity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market", "products"] });
      queryClient.invalidateQueries({
        queryKey: ["market", "product", product?._id],
      });
      queryClient.invalidateQueries({ queryKey: ["market", "my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["coins", "balance"] });
      queryClient.invalidateQueries({ queryKey: ["coins", "transactions"] });
      toast.success("Buyurtma qabul qilindi");
      close();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  const maxQuantity = Number(product?.quantity || 0);

  /**
   * Decreases order quantity while keeping minimum value.
   */
  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  /**
   * Increases order quantity while keeping stock limit.
   */
  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(maxQuantity || 1, prev + 1));
  };

  // Handle create order form submission
  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (quantity < 1 || quantity > maxQuantity) return;
    createOrderMutation.mutate();
  };

  return (
    <form className="space-y-4" onSubmit={handleCreateOrder}>
      {/* Increment/Decrement */}
      <div className="flex gap-4">
        <Button
          type="button"
          className="min-w-10"
          disabled={quantity <= 1}
          onClick={decrementQuantity}
        >
          -
        </Button>

        <div className="flex items-center justify-center w-full border rounded-lg bg-white font-semibold">
          {quantity} ta
        </div>

        <Button
          type="button"
          disabled={quantity >= maxQuantity || maxQuantity < 1}
          onClick={incrementQuantity}
          className="min-w-10"
        >
          +
        </Button>
      </div>

      {/* Total */}
      <p>
        <span>Jami: </span>
        <span className="text-primary font-semibold xs:text-lg">
          {(Number(product?.price || 0) * quantity).toLocaleString()} tanga
        </span>
      </p>

      {/* Buttons */}
      <div className="flex flex-col gap-4 xs:flex-row xs:justify-end">
        <Button variant="secondary" type="button" onClick={close}>
          Bekor qilish
        </Button>

        <Button
          type="submit"
          disabled={createOrderMutation.isPending || maxQuantity < 1}
        >
          Buyurtma berish
        </Button>
      </div>
    </form>
  );
};

export default MarketOrderModal;
