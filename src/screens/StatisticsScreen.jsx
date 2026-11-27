import CategoryBreakdown from "../components/CategoryBreakdown";
import WeeklySpendingChart from "../components/WeeklySpendingChart";
import StatisticsBudgetCard from "../components/StatisticsBudgetCard";
import MonthlySpendingCard from "../components/MonthlySpendingCard";
import StatisticsBackground from "../components/StatisticsBackground";
import { formatCurrency } from "../utils/formatCurrency";
import { Ionicons } from "@expo/vector-icons";

import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

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

import styles from "../styles/StatisticsScreen.styles";
import useStatistics from "../hooks/useStatistics";

export default function StatisticsScreen() {
  const { navigation, expenses, monthlyBudget, loading, refreshing, handleRefresh, totalSpent, remainingBudget, isOverBudget, actualBudgetPercentage, budgetBarPercentage, categoryTotals, lastSevenDays, maxDailySpending } = useStatistics();
  return (
    <SafeAreaView
      style={styles.layout}
      edges={["top", "left", "right"]}
    >
      <StatisticsBackground />
      <ScrollView
        style={styles.header3}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#1677F2"
          />
        }
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.topBar2}>
            <View style={styles.topBar3}>
              <Ionicons name="bar-chart" size={25} color="#FFFFFF" />
            </View>
            <Text style={styles.topBar4}>
              Statistics
            </Text>
          </View>
          <TouchableOpacity
            style={styles.topBar5}
            onPress={() => navigation.navigate("Settings")}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
          >
            <Ionicons name="settings-outline" size={25} color="#1677F2" />
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.header2}>
            <Ionicons name="stats-chart" size={36} color="#1677F2" />
          </View>
          <View style={styles.header3}>
            <Text style={styles.header4}>
              Statistics
            </Text>
            <Text style={styles.header5}>
              Your spending overview for this month.
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.header6}>
            <ActivityIndicator size="small" color="#1677F2" />
            <Text style={styles.header7}>
              Loading statistics...
            </Text>
          </View>
        ) : (
          <>
            <MonthlySpendingCard totalSpent={totalSpent} expenses={expenses} />
        <StatisticsBudgetCard monthlyBudget={monthlyBudget} isOverBudget={isOverBudget} remainingBudget={remainingBudget} budgetBarPercentage={budgetBarPercentage} actualBudgetPercentage={actualBudgetPercentage} navigation={navigation} />
        <WeeklySpendingChart lastSevenDays={lastSevenDays} maxDailySpending={maxDailySpending} />
        <CategoryBreakdown categoryTotals={categoryTotals} navigation={navigation} />
        
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

