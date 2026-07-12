"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/redux/hooks";
import {
  useAddToWishlistMutation,
  useListWishlistIdsQuery,
  useRemoveFromWishlistMutation,
} from "@/app/redux/services/wishlistApi";
import { HeartIcon } from "@/components/ui/Icons";
import Swal from "sweetalert2";

export function WishlistButton({
  productId,
  className = "",
}: {
  productId: string;
  className?: string;
}) {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state) => state.auth.isCustomerLoggedIn);
  const { data: wishlistIds = [] } = useListWishlistIdsQuery(undefined, {
    skip: !isLoggedIn,
  });
  const [addToWishlist, { isLoading: adding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: removing }] = useRemoveFromWishlistMutation();

  const isWishlisted = wishlistIds.includes(productId);
  const loading = adding || removing;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(productId).unwrap();
      } else {
        await addToWishlist(productId).unwrap();
        await Swal.fire({
          icon: "success",
          title: "Wishlist-এ যোগ হয়েছে",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    } catch {
      await Swal.fire({ icon: "error", title: "Wishlist update failed" });
    }
  };

  return (
    <button
      type="button"
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      disabled={loading}
      onClick={(e) => void handleClick(e)}
      className={`rounded-full p-2 transition-colors hover:bg-brand-gray disabled:opacity-60 ${className} ${
        isWishlisted ? "text-red-500" : "text-gray-500 hover:text-brand-orange"
      }`}
    >
      <HeartIcon filled={isWishlisted} />
    </button>
  );
}
