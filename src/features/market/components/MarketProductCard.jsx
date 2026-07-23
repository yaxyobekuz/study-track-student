// Router
import { Link } from "react-router-dom";

// Utils
import { cn } from "@/shared/utils/cn";
import { getMarketProductBadge } from "@/shared/utils/market.utils";

/**
 * Renders a single market product card item.
 * @param {object} props Component props.
 * @param {object} props.product Product object.
 * @returns {JSX.Element} Product card component.
 */
const MarketProductCard = ({ product }) => {
  const badge = getMarketProductBadge(product);

  return (
    <Link to={`/market/products/${product.id}`} className="block">
      {/* Image */}
      <div className="relative">
        <img
          width={264}
          height={264}
          alt={product.name}
          src={product?.images?.[0]?.variants?.md?.url}
          className="w-full h-auto bg-white aspect-square rounded-2xl object-cover"
        />

        {/* Badge */}
        {badge && (
          <span
            children={badge.label}
            className={cn(
              "absolute top-3.5 right-3.5 text-[10px] px-1.5 py-0.5 rounded-full",
              badge.className,
            )}
          />
        )}
      </div>

      {/* Product Details */}
      <div className="p-1.5 space-y-1.5">
        {/* Title */}
        <h3 className="line-clamp-2 text-xs font-semibold text-gray-900 xs:text-sm">
          {product.name}
        </h3>

        {/* Price */}
        <p className="text-primary font-semibold text-sm xs:text-base">
          {product.price} tanga
        </p>
      </div>
    </Link>
  );
};

export default MarketProductCard;
