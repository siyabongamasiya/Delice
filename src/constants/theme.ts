import { Colors } from "./colors";
import { Spacing } from "./spacing";

export const Theme = {
  colors: Colors,
  spacing: Spacing,
  borderRadius: 8,
  font: {
    header: { fontSize: 32, fontWeight: "bold", color: Colors.text },
    title: { fontSize: 24, fontWeight: "bold", color: Colors.text },
    subtitle: { fontSize: 16, color: Colors.text },
    body: { fontSize: 14, color: Colors.text },
    caption: { fontSize: 12, color: Colors.text },
  },
};
