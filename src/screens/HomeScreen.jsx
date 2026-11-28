import RecentExpenseList from "../components/RecentExpenseList";
import HomeBackground from "../components/HomeBackground";
import BudgetSummary from "../components/BudgetSummary";
import { Ionicons } from "@expo/vector-icons";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getExpenses, deleteExpense } from "../storage/expenseStorage";
import { getMonthlyBudget } from "../storage/budgetStorage";
import { getCategoryOptions, toScreenExpense } from "../utils/finance";

export default function HomeScreen() {

  const navigation = useNavigation();
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState(0);

  const monthlySpent = useMemo(() => {
    return expenses.reduce(
      (total, expense) => total + Number(expense.amount),
      0,
    );
  }, [expenses]);

  const remainingBudget = monthlyBudget - monthlySpent;

  const budgetProgress =
    monthlyBudget > 0 ? Math.min(monthlySpent / monthlyBudget, 1) : 0;

  const budgetProgressPercentage =
    monthlyBudget > 0
      ? Math.min(Math.round((monthlySpent / monthlyBudget) * 100), 100)
      : 0;

  const recentExpenses = expenses.slice(0, 5);

  const loadExpenses = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoadingExpenses(true);
      }

      const now = new Date();

      const currentMonth = `${now.getFullYear()}-${String(
        now.getMonth() + 1,
      ).padStart(2, "0")}-01`;

      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      const nextMonth = `${nextMonthDate.getFullYear()}-${String(
        nextMonthDate.getMonth() + 1,
      ).padStart(2, "0")}-01`;

      const [records, budget, categories] = await Promise.all([
        getExpenses(user.id), getMonthlyBudget(user.id, currentMonth.slice(0, 7)), getCategoryOptions(user.id),
      ]);
      setMonthlyBudget(budget?.amount ?? 0);
      setExpenses(records.map(toScreenExpense)
        .filter(e => e.expense_date >= currentMonth && e.expense_date < nextMonth)
        .sort((a,b) => b.expense_date.localeCompare(a.expense_date) || b.created_at.localeCompare(a.created_at))
        .map(e => ({...e, category: categories.find(c => c.id === e.category_id) ?? null})));
    } catch (error) {
      console.error("Unexpected error loading home data:", error);

      Alert.alert(
        "Unable to load data",
        "An unexpected error occurred while loading your data.",
      );
    } finally {
      if (showLoading) {
        setLoadingExpenses(false);
      }
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadExpenses(false);
    } finally {
      setRefreshing(false);
    }
  }, [loadExpenses]);

  const handleDeleteExpense = (expenseId) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteExpense(user.id, expenseId);

              setExpenses((currentExpenses) =>
                currentExpenses.filter((expense) => expense.id !== expenseId),
              );

              Alert.alert("Expense deleted", "The expense has been deleted.");
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "An unexpected error occurred.";

              Alert.alert("Unable to delete expense", message);
            }
          },
        },
      ],
    );
  };

  const handleEditExpense = (expense) => {
    navigation.navigate("EditExpense", { id: expense.id });
  };

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [loadExpenses]),
  );
  return (
    <SafeAreaView
      style={styles.layout}
      edges={["top", "left", "right"]}
    >
      <HomeBackground />
      <ScrollView
        style={styles.pesotrackBranding3}
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
              <Ionicons name="home" size={25} color="#FFFFFF" />
            </View>
            <Text style={styles.topBar4}>Home</Text>
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

        {/* PesoTrack branding */}
        <View style={styles.pesotrackBranding}>
          <View style={styles.pesotrackBranding2}>
            <Ionicons name="wallet" size={38} color="#FFFFFF" />
          </View>
          <View style={styles.pesotrackBranding3}>
            <View style={styles.pesotrackBranding4}>
              <Text style={styles.pesotrackBranding5}>
                Peso
              </Text>
              <Text style={styles.pesotrackBranding6}>
                Track
              </Text>
            </View>
            <Text style={styles.pesotrackBranding7}>
              Manage your personal expenses
            </Text>
          </View>
        </View>
        <BudgetSummary {...{ monthlyBudget, monthlySpent, remainingBudget, budgetProgress, budgetProgressPercentage }} />

        {/* Recent expenses header */}
        <View style={styles.recentExpensesHeader}>
          <Text style={styles.recentExpensesHeader2}>
            Recent Expenses
          </Text>

          {expenses.length > 5 && (
            <TouchableOpacity
              style={styles.topBar2}
              onPress={() => navigation.navigate("Statistics")}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="View all expense statistics"
            >
              <Text style={styles.recentExpensesHeader3}>
                View All
              </Text>
              <Ionicons name="chevron-forward" size={17} color="#1677F2" />
            </TouchableOpacity>
          )}
        </View>

        <RecentExpenseList loadingExpenses={loadingExpenses} recentExpenses={recentExpenses} navigation={navigation} handleEditExpense={handleEditExpense} handleDeleteExpense={handleDeleteExpense} />
        
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles for this UI.
const styles = StyleSheet.create({
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

  pesotrackBranding: {
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center"
  },

  pesotrackBranding2: {
    marginRight: 16,
    height: 70,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#1677F2"
  },

  pesotrackBranding3: {
    flex: 1
  },

  pesotrackBranding4: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline"
  },

  pesotrackBranding5: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.85,
    color: "#071B46"
  },

  pesotrackBranding6: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.85,
    color: "#1677F2"
  },

  pesotrackBranding7: {
    marginTop: 4,
    fontSize: 15,
    color: "#65758B"
  },

  recentExpensesHeader: {
    marginBottom: 16,
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  recentExpensesHeader2: {
    fontSize: 24,
    fontWeight: "800",
    color: "#071B46"
  },

  recentExpensesHeader3: {
    marginRight: 4,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: "#1677F2"
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
