import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addToCart,
  clearCart,
  removeFromCart,
  updateQuantity,
} from "../store/slices/cartSlice";

export function useCart() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);

  return {
    cart,
    add: (item: any) => dispatch(addToCart(item)),
    remove: (id: string) => dispatch(removeFromCart(id)),
    update: (id: string, quantity: number) =>
      dispatch(updateQuantity({ id, quantity })),
    clear: () => dispatch(clearCart()),
  };
}
