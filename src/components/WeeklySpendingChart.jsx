import { ActivityIndicator, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "../utils/formatCurrency";
const formatCompactCurrency = (value) => {
  if (value >= 1_000_000) {
    return `₱${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `₱${(value / 1_000).toFixed(1)}K`;
  }

  return `₱${value.toLocaleString("en-PH", {
    maximumFractionDigits: 0,
  })}`;
};


export default function WeeklySpendingChart({ lastSevenDays, maxDailySpending }) {
  return <>
    <View style={styles.budget}>
              <View style={styles.last7Days}>
                <View style={styles.last7Days2}>
                  <Ionicons name="bar-chart" size={24} color="#6B54F5" />
                </View>
                <View style={styles.header3}>
                  <Text style={styles.budget3}>
                    Last 7 Days
                  </Text>
                  <Text style={styles.last7Days3}>
                    Your daily spending
                  </Text>
                </View>
              </View>
              <View style={styles.last7Days4}>
                {lastSevenDays.map((day) => {
                  const barHeight =
                    day.total > 0
                      ? Math.max((day.total / maxDailySpending) * 120, 10)
                      : 5;

                  return (
                    <View key={day.date} style={styles.last7Days5}>
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.7}
                        style={styles.last7Days6}
                      >
                        {formatCompactCurrency(day.total)}
                      </Text>
                      <View style={styles.last7Days7}>
                        <View
                          style={[styles.last7Days8, {
                            height: barHeight,
                          }]}
                        />
                      </View>
                      <Text style={styles.last7Days9}>
                        {day.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
  </>;
}

// Styles for this UI.
const styles = StyleSheet.create({
  header3: {
    flex: 1
  },

  budget: {
    marginTop: 24,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF",
    padding: 20
  },

  budget3: {
    fontSize: 22,
    fontWeight: "800",
    color: "#071B46"
  },

  last7Days: {
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center"
  },

  last7Days2: {
    marginRight: 12,
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#EEE9FF"
  },

  last7Days3: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    color: "#718096"
  },

  last7Days4: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between"
  },

  last7Days5: {
    flex: 1,
    alignItems: "center"
  },

  last7Days6: {
    marginBottom: 8,
    width: "100%",
    textAlign: "center",
    fontSize: 10,
    fontWeight: "600",
    color: "#17335F"
  },

  last7Days7: {
    height: 120,
    width: 28,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: "#F0F5FB"
  },

  last7Days8: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#4A84F5"
  },

  last7Days9: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: "500",
    color: "#65758B"
  },

});
