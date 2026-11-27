import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/StatisticsScreen.styles";
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
