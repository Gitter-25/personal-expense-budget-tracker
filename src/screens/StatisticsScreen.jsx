import { formatCurrency } from "../utils/formatCurrency";
import Background from "../components/Background";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getExpenses } from "../storage/expenseStorage";
import { getMonthlyBudget } from "../storage/budgetStorage";
import { getCategoryOptions, toScreenExpense } from "../utils/finance";

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

export default function StatisticsScreen() {

  const navigation = useNavigation();
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [lastSevenDayExpenses, setLastSevenDayExpenses] = useState(
    [],
  );
  const [categories, setCategories] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStatistics = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const now = new Date();

      const firstDayOfMonth = formatLocalDate(
        new Date(now.getFullYear(), now.getMonth(), 1),
      );

      const firstDayOfNextMonth = formatLocalDate(
        new Date(now.getFullYear(), now.getMonth() + 1, 1),
      );

      const sevenDaysAgoDate = new Date(now);
      sevenDaysAgoDate.setDate(now.getDate() - 6);

      const sevenDaysAgo = formatLocalDate(sevenDaysAgoDate);

      const queryStart =
        sevenDaysAgo < firstDayOfMonth ? sevenDaysAgo : firstDayOfMonth;

      const [records, budget, categories] = await Promise.all([
        getExpenses(user.id), getMonthlyBudget(user.id, firstDayOfMonth.slice(0, 7)), getCategoryOptions(user.id),
      ]);
      const all = records.map(toScreenExpense);
      setExpenses(all.filter(e => e.expense_date >= firstDayOfMonth && e.expense_date < firstDayOfNextMonth));
      setLastSevenDayExpenses(all.filter(e => e.expense_date >= sevenDaysAgo && e.expense_date <= formatLocalDate(now)));
      setMonthlyBudget(budget?.amount ?? 0);
      setCategories(categories);
    } catch (error) {
      console.error("Unexpected error loading statistics:", error);

      Alert.alert(
        "Unable to load statistics",
        "An unexpected error occurred while loading your statistics.",
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadStatistics(false);
    } finally {
      setRefreshing(false);
    }
  }, [loadStatistics]);

  useFocusEffect(
    useCallback(() => {
      loadStatistics();
    }, [loadStatistics]),
  );

  const totalSpent = useMemo(() => {
    return expenses.reduce(
      (total, expense) => total + Number(expense.amount),
      0,
    );
  }, [expenses]);

  const remainingBudget = monthlyBudget - totalSpent;
  const isOverBudget = monthlyBudget > 0 && remainingBudget < 0;

  const actualBudgetPercentage =
    monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;

  const budgetBarPercentage = Math.min(actualBudgetPercentage, 100);

  const categoryTotals = useMemo(() => {
    return categories
      .map((category) => {
        const total = expenses
          .filter((expense) => expense.category_id === category.id)
          .reduce((sum, expense) => sum + Number(expense.amount), 0);

        const percentage = totalSpent > 0 ? (total / totalSpent) * 100 : 0;

        return {
          ...category,
          total,
          percentage,
        };
      })
      .filter((category) => category.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [categories, expenses, totalSpent]);

  const lastSevenDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();

      date.setDate(date.getDate() - (6 - index));

      const dateString = formatLocalDate(date);

      const total = lastSevenDayExpenses
        .filter((expense) => expense.expense_date === dateString)
        .reduce((sum, expense) => sum + Number(expense.amount), 0);

      return {
        date: dateString,
        label: date
          .toLocaleDateString("en-US", {
            weekday: "short",
          })
          .toUpperCase(),
        total,
      };
    });
  }, [lastSevenDayExpenses]);

  const maxDailySpending = Math.max(
    ...lastSevenDays.map((day) => day.total),
    1,
  );
  return (
    <SafeAreaView
      style={styles.layout}
      edges={["top", "left", "right"]}
    >
      <Background screen="Statistics" />
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
            {/* Monthly Spending Card */}
        <>
    <View style={styles.monthlySpendingCard_totalSpent}>
              <View
                pointerEvents="none"
                style={styles.monthlySpendingCard_totalSpent2}
              />
              <View
                pointerEvents="none"
                style={styles.monthlySpendingCard_totalSpent3}
              />
              <View style={styles.monthlySpendingCard_topBar2}>
                <View style={styles.monthlySpendingCard_totalSpent4}>
                  <Ionicons name="cash-outline" size={29} color="#FFFFFF" />
                </View>
                <View style={styles.monthlySpendingCard_header3}>
                  <Text style={styles.monthlySpendingCard_totalSpent5}>
                    Total Spent This Month
                  </Text>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={styles.monthlySpendingCard_totalSpent6}
                  >
                    {formatCurrency(totalSpent)}
                  </Text>
                  <Text style={styles.monthlySpendingCard_totalSpent7}>
                    {expenses.length} expense
                    {expenses.length === 1 ? "" : "s"}
                  </Text>
                </View>
              </View>
            </View>
  </>
        {/* Statistics Budget Card */}
        <>
    <View style={styles.statisticsBudgetCard_budget}>
              <View style={styles.statisticsBudgetCard_topBar2}>
                <View style={styles.statisticsBudgetCard_budget2}>
                  <Ionicons name="wallet" size={25} color="#1677F2" />
                </View>
                <Text style={styles.statisticsBudgetCard_budget3}>
                  Monthly Budget
                </Text>
              </View>
              <View style={styles.statisticsBudgetCard_budget4}>
                <View style={styles.statisticsBudgetCard_budget5}>
                  <Text style={styles.statisticsBudgetCard_budget6}>Budget</Text>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={styles.statisticsBudgetCard_budget7}
                  >
                    {formatCurrency(monthlyBudget)}
                  </Text>
                </View>
                <View style={styles.statisticsBudgetCard_budget8}>
                  <Text style={styles.statisticsBudgetCard_budget6}>
                    {isOverBudget ? "Over Budget" : "Remaining"}
                  </Text>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={[styles.statisticsBudgetCard_budget9, isOverBudget ? styles.statisticsBudgetCard_budgetState : styles.statisticsBudgetCard_budgetState2]}
                  >
                    {isOverBudget
                      ? formatCurrency(Math.abs(remainingBudget))
                      : formatCurrency(remainingBudget)}
                  </Text>
                </View>
              </View>

              {monthlyBudget > 0 ? (
                <>
                  <View style={styles.statisticsBudgetCard_budget10}>
                    <View
                      style={[[styles.statisticsBudgetCard_budget11, isOverBudget ? styles.statisticsBudgetCard_budgetState3 : styles.statisticsBudgetCard_budgetState4], {
                        width: `${budgetBarPercentage}%`,
                      }]}
                    />
                  </View>
                  <Text
                    style={[styles.statisticsBudgetCard_budget12, isOverBudget
                        ? styles.statisticsBudgetCard_budgetState5
                        : styles.statisticsBudgetCard_budgetState6]}
                  >
                    {actualBudgetPercentage.toFixed(1)}%{" of your budget used"}
                  </Text>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.statisticsBudgetCard_budget13}
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
                  <Text style={styles.statisticsBudgetCard_budget14}>
                    Set a monthly budget
                  </Text>
                </TouchableOpacity>
              )}
            </View>
  </>
        {/* Weekly Spending Chart */}
        <>
    <View style={styles.weeklySpendingChart_budget}>
              <View style={styles.weeklySpendingChart_last7Days}>
                <View style={styles.weeklySpendingChart_last7Days2}>
                  <Ionicons name="bar-chart" size={24} color="#6B54F5" />
                </View>
                <View style={styles.weeklySpendingChart_header3}>
                  <Text style={styles.weeklySpendingChart_budget3}>
                    Last 7 Days
                  </Text>
                  <Text style={styles.weeklySpendingChart_last7Days3}>
                    Your daily spending
                  </Text>
                </View>
              </View>
              <View style={styles.weeklySpendingChart_last7Days4}>
                {lastSevenDays.map((day) => {
                  const barHeight =
                    day.total > 0
                      ? Math.max((day.total / maxDailySpending) * 120, 10)
                      : 5;

                  return (
                    <View key={day.date} style={styles.weeklySpendingChart_last7Days5}>
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.7}
                        style={styles.weeklySpendingChart_last7Days6}
                      >
                        {formatCompactCurrency(day.total)}
                      </Text>
                      <View style={styles.weeklySpendingChart_last7Days7}>
                        <View
                          style={[styles.weeklySpendingChart_last7Days8, {
                            height: barHeight,
                          }]}
                        />
                      </View>
                      <Text style={styles.weeklySpendingChart_last7Days9}>
                        {day.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
  </>
        {/* Category Breakdown */}
        <>
    <View style={styles.categoryBreakdown_budget}>
              <View style={styles.categoryBreakdown_topBar2}>
                <View style={styles.categoryBreakdown_categoryBreakdown}>
                  <Ionicons name="pie-chart" size={24} color="#F59E0B" />
                </View>
                <View style={styles.categoryBreakdown_header3}>
                  <Text style={styles.categoryBreakdown_budget3}>
                    Spending by Category
                  </Text>
                  <Text style={styles.categoryBreakdown_last7Days3}>
                    Where your money went this month
                  </Text>
                </View>
              </View>

              {categoryTotals.length === 0 ? (
                <View style={styles.categoryBreakdown_categoryBreakdown2}>
                  <View style={styles.categoryBreakdown_categoryBreakdown3}>
                    <Ionicons
                      name="pie-chart-outline"
                      size={27}
                      color="#1677F2"
                    />
                  </View>
                  <Text style={styles.categoryBreakdown_categoryBreakdown4}>
                    No spending data yet
                  </Text>
                  <Text style={styles.categoryBreakdown_categoryBreakdown5}>
                    Add expenses to see your category breakdown.
                  </Text>
                  <TouchableOpacity
                    style={styles.categoryBreakdown_categoryBreakdown6}
                    onPress={() => navigation.navigate("AddExpense")}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel="Add expense"
                  >
                    <Ionicons name="add" size={18} color="#FFFFFF" />
                    <Text style={styles.categoryBreakdown_categoryBreakdown7}>
                      Add Expense
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.categoryBreakdown_categoryBreakdown8}>
                  {categoryTotals.map((category) => (
                    <View key={category.id} style={styles.categoryBreakdown_categoryBreakdown9}>
                      <View style={styles.categoryBreakdown_categoryBreakdown10}>
                        <View style={styles.categoryBreakdown_categoryBreakdown11}>
                          <View style={styles.categoryBreakdown_categoryBreakdown12}>
                            <Text style={styles.categoryBreakdown_categoryBreakdown13}>
                              {category.icon ?? "📁"}
                            </Text>
                          </View>
                          <View style={styles.categoryBreakdown_categoryBreakdown14}>
                            <Text
                              numberOfLines={1}
                              style={styles.categoryBreakdown_categoryBreakdown15}
                            >
                              {category.name}
                            </Text>
                            <Text style={styles.categoryBreakdown_categoryBreakdown16}>
                              {category.percentage.toFixed(1)}% of spending
                            </Text>
                          </View>
                        </View>
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          style={styles.categoryBreakdown_categoryBreakdown17}
                        >
                          {formatCurrency(category.total)}
                        </Text>
                      </View>
                      <View style={styles.categoryBreakdown_categoryBreakdown18}>
                        <View
                          style={[styles.categoryBreakdown_categoryBreakdown19, {
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
        
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles for this UI.
const styles = StyleSheet.create({

  monthlySpendingCard_topBar2: {
    flexDirection: "row",
    alignItems: "center"
  },

  monthlySpendingCard_header3: {
    flex: 1
  },

  monthlySpendingCard_totalSpent: {
    overflow: "hidden",
    borderRadius: 28,
    backgroundColor: "#174EAE",
    paddingHorizontal: 20,
    paddingVertical: 24
  },

  monthlySpendingCard_totalSpent2: {
    position: "absolute",
    right: -64,
    top: -80,
    height: 208,
    width: 208,
    borderRadius: 9999,
    backgroundColor: "#674EF3"
  },

  monthlySpendingCard_totalSpent3: {
    position: "absolute",
    bottom: -128,
    right: 24,
    height: 224,
    width: 224,
    borderRadius: 9999,
    backgroundColor: "#315AE2"
  },

  monthlySpendingCard_totalSpent4: {
    marginRight: 16,
    height: 56,
    width: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "rgba(255, 255, 255, 0.15)"
  },

  monthlySpendingCard_totalSpent5: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)"
  },

  monthlySpendingCard_totalSpent6: {
    marginTop: 4,
    fontSize: 34,
    fontWeight: "800",
    color: "#FFFFFF"
  },

  monthlySpendingCard_totalSpent7: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(255, 255, 255, 0.7)"
  },



  statisticsBudgetCard_topBar2: {
    flexDirection: "row",
    alignItems: "center"
  },

  statisticsBudgetCard_budget: {
    marginTop: 24,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF",
    padding: 20
  },

  statisticsBudgetCard_budget2: {
    marginRight: 12,
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#EAF3FF"
  },

  statisticsBudgetCard_budget3: {
    fontSize: 22,
    fontWeight: "800",
    color: "#071B46"
  },

  statisticsBudgetCard_budget4: {
    marginTop: 20,
    flexDirection: "row"
  },

  statisticsBudgetCard_budget5: {
    marginRight: 12,
    flex: 1
  },

  statisticsBudgetCard_budget6: {
    fontSize: 14,
    lineHeight: 20,
    color: "#718096"
  },

  statisticsBudgetCard_budget7: {
    marginTop: 4,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "800",
    color: "#071B46"
  },

  statisticsBudgetCard_budget8: {
    flex: 1,
    alignItems: "flex-end"
  },

  statisticsBudgetCard_budgetState: {
    color: "#E91E63"
  },

  statisticsBudgetCard_budgetState2: {
    color: "#071B46"
  },

  statisticsBudgetCard_budget9: {
    marginTop: 4,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "800"
  },

  statisticsBudgetCard_budget10: {
    marginTop: 20,
    height: 12,
    overflow: "hidden",
    borderRadius: 9999,
    backgroundColor: "#E4ECF5"
  },

  statisticsBudgetCard_budgetState3: {
    backgroundColor: "#E91E63"
  },

  statisticsBudgetCard_budgetState4: {
    backgroundColor: "#3D88F7"
  },

  statisticsBudgetCard_budget11: {
    height: "100%",
    borderRadius: 9999
  },

  statisticsBudgetCard_budgetState5: {
    fontWeight: "600",
    color: "#E91E63"
  },

  statisticsBudgetCard_budgetState6: {
    color: "#65758B"
  },

  statisticsBudgetCard_budget12: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20
  },

  statisticsBudgetCard_budget13: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#EAF4FF",
    paddingHorizontal: 16,
    paddingVertical: 12
  },

  statisticsBudgetCard_budget14: {
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: "#1677F2"
  },



  weeklySpendingChart_header3: {
    flex: 1
  },

  weeklySpendingChart_budget: {
    marginTop: 24,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF",
    padding: 20
  },

  weeklySpendingChart_budget3: {
    fontSize: 22,
    fontWeight: "800",
    color: "#071B46"
  },

  weeklySpendingChart_last7Days: {
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center"
  },

  weeklySpendingChart_last7Days2: {
    marginRight: 12,
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#EEE9FF"
  },

  weeklySpendingChart_last7Days3: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    color: "#718096"
  },

  weeklySpendingChart_last7Days4: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between"
  },

  weeklySpendingChart_last7Days5: {
    flex: 1,
    alignItems: "center"
  },

  weeklySpendingChart_last7Days6: {
    marginBottom: 8,
    width: "100%",
    textAlign: "center",
    fontSize: 10,
    fontWeight: "600",
    color: "#17335F"
  },

  weeklySpendingChart_last7Days7: {
    height: 120,
    width: 28,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: "#F0F5FB"
  },

  weeklySpendingChart_last7Days8: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#4A84F5"
  },

  weeklySpendingChart_last7Days9: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: "500",
    color: "#65758B"
  },



  categoryBreakdown_topBar2: {
    flexDirection: "row",
    alignItems: "center"
  },

  categoryBreakdown_header3: {
    flex: 1
  },

  categoryBreakdown_budget: {
    marginTop: 24,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF",
    padding: 20
  },

  categoryBreakdown_budget3: {
    fontSize: 22,
    fontWeight: "800",
    color: "#071B46"
  },

  categoryBreakdown_last7Days3: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    color: "#718096"
  },

  categoryBreakdown_categoryBreakdown: {
    marginRight: 12,
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#FFF1D8"
  },

  categoryBreakdown_categoryBreakdown2: {
    marginTop: 24,
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#F8FBFF",
    paddingHorizontal: 20,
    paddingVertical: 32
  },

  categoryBreakdown_categoryBreakdown3: {
    height: 56,
    width: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#EAF3FF"
  },

  categoryBreakdown_categoryBreakdown4: {
    marginTop: 12,
    fontWeight: "700",
    color: "#17335F"
  },

  categoryBreakdown_categoryBreakdown5: {
    marginTop: 4,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    color: "#718096"
  },

  categoryBreakdown_categoryBreakdown6: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#1677F2",
    paddingHorizontal: 16,
    paddingVertical: 10
  },

  categoryBreakdown_categoryBreakdown7: {
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: "#FFFFFF"
  },

  categoryBreakdown_categoryBreakdown8: {
    marginTop: 8
  },

  categoryBreakdown_categoryBreakdown9: {
    marginTop: 20
  },

  categoryBreakdown_categoryBreakdown10: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  categoryBreakdown_categoryBreakdown11: {
    marginRight: 12,
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },

  categoryBreakdown_categoryBreakdown12: {
    height: 44,
    width: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#F7FAFD"
  },

  categoryBreakdown_categoryBreakdown13: {
    fontSize: 20,
    lineHeight: 28
  },

  categoryBreakdown_categoryBreakdown14: {
    marginLeft: 12,
    flex: 1
  },

  categoryBreakdown_categoryBreakdown15: {
    fontWeight: "700",
    color: "#071B46"
  },

  categoryBreakdown_categoryBreakdown16: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: "#718096"
  },

  categoryBreakdown_categoryBreakdown17: {
    maxWidth: "38%",
    fontWeight: "800",
    color: "#071B46"
  },

  categoryBreakdown_categoryBreakdown18: {
    marginTop: 12,
    height: 10,
    overflow: "hidden",
    borderRadius: 9999,
    backgroundColor: "#E8EEF5"
  },

  categoryBreakdown_categoryBreakdown19: {
    height: "100%",
    borderRadius: 9999,
    backgroundColor: "#1677F2"
  },



  topBar: {
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  topBar2: {
    flexDirection: "row",
    alignItems: "center"
  },

  topBar3: {
    marginRight: 12,
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#1677F2"
  },

  topBar4: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "800",
    color: "#071B46"
  },

  topBar5: {
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF"
  },

  header: {
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center"
  },

  header2: {
    marginRight: 16,
    height: 70,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#E7F1FF"
  },

  header3: {
    flex: 1
  },

  header4: {
    fontSize: 32,
    fontWeight: "800",
    color: "#071B46"
  },

  header5: {
    marginTop: 4,
    fontSize: 15,
    color: "#65758B"
  },

  header6: {
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 48
  },

  header7: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: "#718096"
  },

  layout: {
    flex: 1,
    backgroundColor: "#F4F9FF"
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40
  },

});
