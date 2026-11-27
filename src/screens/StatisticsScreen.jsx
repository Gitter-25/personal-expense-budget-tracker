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
            {/* Total spent */}
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

            {/* Budget */}
            <View style={styles.budget}>
              <View style={styles.topBar2}>
                <View style={styles.budget2}>
                  <Ionicons name="wallet" size={25} color="#1677F2" />
                </View>
                <Text style={styles.budget3}>
                  Monthly Budget
                </Text>
              </View>
              <View style={styles.budget4}>
                <View style={styles.budget5}>
                  <Text style={styles.budget6}>Budget</Text>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={styles.budget7}
                  >
                    {formatCurrency(monthlyBudget)}
                  </Text>
                </View>
                <View style={styles.budget8}>
                  <Text style={styles.budget6}>
                    {isOverBudget ? "Over Budget" : "Remaining"}
                  </Text>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={[styles.budget9, isOverBudget ? styles.budgetState : styles.budgetState2]}
                  >
                    {isOverBudget
                      ? formatCurrency(Math.abs(remainingBudget))
                      : formatCurrency(remainingBudget)}
                  </Text>
                </View>
              </View>

              {monthlyBudget > 0 ? (
                <>
                  <View style={styles.budget10}>
                    <View
                      style={[[styles.budget11, isOverBudget ? styles.budgetState3 : styles.budgetState4], {
                        width: `${budgetBarPercentage}%`,
                      }]}
                    />
                  </View>
                  <Text
                    style={[styles.budget12, isOverBudget
                        ? styles.budgetState5
                        : styles.budgetState6]}
                  >
                    {actualBudgetPercentage.toFixed(1)}%{" of your budget used"}
                  </Text>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.budget13}
                  onPress={() => navigation.navigate("Budget")}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Set monthly budget"
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={19}
                    color="#1677F2"
                  />
                  <Text style={styles.budget14}>
                    Set a monthly budget
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Last 7 days */}
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

            {/* Category breakdown */}
            <View style={styles.budget}>
              <View style={styles.topBar2}>
                <View style={styles.categoryBreakdown}>
                  <Ionicons name="pie-chart" size={24} color="#F59E0B" />
                </View>
                <View style={styles.header3}>
                  <Text style={styles.budget3}>
                    Spending by Category
                  </Text>
                  <Text style={styles.last7Days3}>
                    Where your money went this month
                  </Text>
                </View>
              </View>

              {categoryTotals.length === 0 ? (
                <View style={styles.categoryBreakdown2}>
                  <View style={styles.categoryBreakdown3}>
                    <Ionicons
                      name="pie-chart-outline"
                      size={27}
                      color="#1677F2"
                    />
                  </View>
                  <Text style={styles.categoryBreakdown4}>
                    No spending data yet
                  </Text>
                  <Text style={styles.categoryBreakdown5}>
                    Add expenses to see your category breakdown.
                  </Text>
                  <TouchableOpacity
                    style={styles.categoryBreakdown6}
                    onPress={() => navigation.navigate("AddExpense")}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel="Add expense"
                  >
                    <Ionicons name="add" size={18} color="#FFFFFF" />
                    <Text style={styles.categoryBreakdown7}>
                      Add Expense
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.categoryBreakdown8}>
                  {categoryTotals.map((category) => (
                    <View key={category.id} style={styles.categoryBreakdown9}>
                      <View style={styles.categoryBreakdown10}>
                        <View style={styles.categoryBreakdown11}>
                          <View style={styles.categoryBreakdown12}>
                            <Text style={styles.categoryBreakdown13}>
                              {category.icon ?? "📁"}
                            </Text>
                          </View>
                          <View style={styles.categoryBreakdown14}>
                            <Text
                              numberOfLines={1}
                              style={styles.categoryBreakdown15}
                            >
                              {category.name}
                            </Text>
                            <Text style={styles.categoryBreakdown16}>
                              {category.percentage.toFixed(1)}% of spending
                            </Text>
                          </View>
                        </View>
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          style={styles.categoryBreakdown17}
                        >
                          {formatCurrency(category.total)}
                        </Text>
                      </View>
                      <View style={styles.categoryBreakdown18}>
                        <View
                          style={[styles.categoryBreakdown19, {
                            width: `${Math.min(category.percentage, 100)}%`,
                          }]}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

