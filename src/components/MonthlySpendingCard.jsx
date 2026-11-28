import { ActivityIndicator, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "../utils/formatCurrency";

export default function MonthlySpendingCard({ totalSpent, expenses }) {
  return <>
    <View style={styles.totalSpent}>
              <View
                pointerEvents="none"
                style={styles.totalSpent2}
              />
              <View
                pointerEvents="none"
                style={styles.totalSpent3}
              />
              <View style={styles.topBar2}>
                <View style={styles.totalSpent4}>
                  <Ionicons name="cash-outline" size={29} color="#FFFFFF" />
                </View>
                <View style={styles.header3}>
                  <Text style={styles.totalSpent5}>
                    Total Spent This Month
                  </Text>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={styles.totalSpent6}
                  >
                    {formatCurrency(totalSpent)}
                  </Text>
                  <Text style={styles.totalSpent7}>
                    {expenses.length} expense
                    {expenses.length === 1 ? "" : "s"}
                  </Text>
                </View>
              </View>
            </View>
  </>;
}

// Styles for this UI.
const styles = StyleSheet.create({
  topBar2: {
    flexDirection: "row",
    alignItems: "center"
  },

  header3: {
    flex: 1
  },

  totalSpent: {
    overflow: "hidden",
    borderRadius: 28,
    backgroundColor: "#174EAE",
    paddingHorizontal: 20,
    paddingVertical: 24
  },

  totalSpent2: {
    position: "absolute",
    right: -64,
    top: -80,
    height: 208,
    width: 208,
    borderRadius: 9999,
    backgroundColor: "#674EF3"
  },

  totalSpent3: {
    position: "absolute",
    bottom: -128,
    right: 24,
    height: 224,
    width: 224,
    borderRadius: 9999,
    backgroundColor: "#315AE2"
  },

  totalSpent4: {
    marginRight: 16,
    height: 56,
    width: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "rgba(255, 255, 255, 0.15)"
  },

  totalSpent5: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)"
  },

  totalSpent6: {
    marginTop: 4,
    fontSize: 34,
    fontWeight: "800",
    color: "#FFFFFF"
  },

  totalSpent7: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(255, 255, 255, 0.7)"
  },

});
