import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/colors";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
} from "../store/slices/cartSlice";

interface MenuCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  available: boolean;
  category: string;
}

const MenuCard: React.FC<MenuCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  available,
  category,
}) => {
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector((s) => s.cart.items.find((i) => i.id === id));

  const onAdd = () =>
    dispatch(addToCart({ id, name, price, quantity: 1, imageUrl, category }));
  const onInc = () =>
    dispatch(updateQuantity({ id, quantity: (cartItem?.quantity || 0) + 1 }));
  const onDec = () => {
    const next = (cartItem?.quantity || 0) - 1;
    if (next <= 0) dispatch(removeFromCart(id));
    else dispatch(updateQuantity({ id, quantity: next }));
  };

  return (
    <View style={[styles.card, !available && styles.unavailable]}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View
          style={[
            styles.image,
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
          <Text style={{ color: Colors.muted }}>No image</Text>
        </View>
      )}
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.row}>
        <Text style={styles.price}>R{price.toFixed(2)}</Text>
        {available ? (
          cartItem && cartItem.quantity > 0 ? (
            <View style={styles.qtyControls}>
              <TouchableOpacity
                style={[styles.ctrlBtn, styles.outline]}
                onPress={onDec}
              >
                <Text style={styles.ctrlText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{cartItem.quantity}</Text>
              <TouchableOpacity style={styles.ctrlBtn} onPress={onInc}>
                <Text style={[styles.ctrlText, { color: "#000" }]}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
              <Text style={styles.addText}>Add to Cart</Text>
            </TouchableOpacity>
          )
        ) : (
          <Text style={styles.unavailableText}>Unavailable</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unavailable: {
    opacity: 0.5,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: Colors.muted,
  },
  name: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    color: Colors.text,
    fontSize: 14,
    marginVertical: 4,
  },
  price: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  unavailableText: {
    color: Colors.error,
    fontWeight: "bold",
    marginTop: 8,
  },
  row: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addText: { color: "#000", fontWeight: "bold" },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ctrlBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  ctrlText: { color: Colors.text, fontWeight: "bold", fontSize: 16 },
  qtyText: { color: Colors.text, minWidth: 24, textAlign: "center" },
});

export default MenuCard;
