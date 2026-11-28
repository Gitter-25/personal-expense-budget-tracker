import CategoryBreakdown from "../components/CategoryBreakdown";
import WeeklySpendingChart from "../components/WeeklySpendingChart";
import StatisticsBudgetCard from "../components/StatisticsBudgetCard";
import MonthlySpendingCard from "../components/MonthlySpendingCard";
import StatisticsBackground from "../components/StatisticsBackground";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/StatisticsScreen.styles";
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
