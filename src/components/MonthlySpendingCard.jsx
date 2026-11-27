import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/StatisticsScreen.styles";
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
