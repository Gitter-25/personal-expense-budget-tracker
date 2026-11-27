import HomeBackground from "../components/HomeBackground";
import { formatCurrency } from "../utils/formatCurrency";
import BudgetSummary from "../components/BudgetSummary";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { getExpenses, getExpenseById, addExpense, updateExpense, deleteExpense } from "../storage/expenseStorage";
import { getMonthlyBudget, saveMonthlyBudget } from "../storage/budgetStorage";
import { getCategoryOptions, toScreenExpense } from "../utils/finance";

const formatExpenseDate = (date) => {
  const [year, month, day] = date.split("-").map(Number);

  if (!year || !month || !day) {
    return date;
  }

  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
};

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

        {/* Expense content */}
        {loadingExpenses ? (
          <View style={styles.expenseContent}>
            <ActivityIndicator size="small" color="#1677F2" />
            <Text style={styles.expenseContent2}>
              Loading expenses...
            </Text>
          </View>
        ) : recentExpenses.length === 0 ? (
          <View style={styles.expenseContent3}>
            <View style={styles.expenseContent4}>
              <Ionicons name="receipt-outline" size={30} color="#1677F2" />
            </View>
            <Text style={styles.expenseContent5}>
              No expenses yet
            </Text>
            <Text style={styles.expenseContent6}>
              Add your first expense and it will appear here.
            </Text>
            <TouchableOpacity
              style={styles.expenseContent7}
              onPress={() => navigation.navigate("AddExpense")}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Add your first expense"
            >
              <Ionicons name="add" size={19} color="#FFFFFF" />
              <Text style={styles.expenseContent8}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {recentExpenses.map((expense, index) => (
              <View
                key={expense.id}
                style={styles.expenseContent9}
              >
                <View
                  style={[styles.expenseContent10, index % 2 === 0 ? styles.expenseContentState : styles.expenseContentState2]}
                />
                <View style={styles.expenseContent11}>
                  <View style={styles.expenseContent12}>
                    <View style={styles.expenseContent13}>
                      <View style={styles.expenseContent14}>
                        <Text style={styles.expenseContent15}>
                          {expense.category?.icon ?? "💰"}
                        </Text>
                      </View>
                      <View style={styles.pesotrackBranding3}>
                        <Text
                          numberOfLines={1}
                          style={styles.expenseContent16}
                        >
                          {expense.category?.name ?? "Uncategorized"}
                        </Text>
                        <Text
                          numberOfLines={2}
                          style={styles.expenseContent17}
                        >
                          {expense.description || "No description"}
                        </Text>
                        <View style={styles.expenseContent18}>
                          <Ionicons
                            name="calendar-outline"
                            size={15}
                            color="#1677F2"
                          />
                          <Text style={styles.expenseContent19}>
                            {formatExpenseDate(expense.expense_date)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.expenseContent20}>
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={styles.expenseContent21}
                      >
                        {formatCurrency(Number(expense.amount))}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.expenseContent22}>
                    <TouchableOpacity
                      style={styles.expenseContent23}
                      onPress={() => handleEditExpense(expense)}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel="Edit expense"
                    >
                      <Ionicons
                        name="create-outline"
                        size={18}
                        color="#1677F2"
                      />
                      <Text style={styles.expenseContent24}>
                        Edit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.expenseContent25}
                      onPress={() => handleDeleteExpense(expense.id)}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel="Delete expense"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#E91E63"
                      />
                      <Text style={styles.expenseContent26}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// UI styles: edit these values during visual debugging.
const styles = StyleSheet.create({
  topBar: {marginBottom: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between"},
  topBar2: {flexDirection: "row", alignItems: "center"},
  topBar3: {marginRight: 12, height: 48, width: 48, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: "#1677F2"},
  topBar4: {fontSize: 24, lineHeight: 32, fontWeight: "800", color: "#071B46"},
  topBar5: {height: 48, width: 48, alignItems: "center", justifyContent: "center", borderRadius: 9999, borderWidth: 1, borderColor: "#E3EDF8", backgroundColor: "#FFFFFF"},
  pesotrackBranding: {marginBottom: 24, flexDirection: "row", alignItems: "center"},
  pesotrackBranding2: {marginRight: 16, height: 70, width: 70, alignItems: "center", justifyContent: "center", borderRadius: 22, backgroundColor: "#1677F2"},
  pesotrackBranding3: {flex: 1},
  pesotrackBranding4: {flexDirection: "row", flexWrap: "wrap", alignItems: "baseline"},
  pesotrackBranding5: {fontSize: 34, fontWeight: "800", letterSpacing: -0.85, color: "#071B46"},
  pesotrackBranding6: {fontSize: 34, fontWeight: "800", letterSpacing: -0.85, color: "#1677F2"},
  pesotrackBranding7: {marginTop: 4, fontSize: 15, color: "#65758B"},
  recentExpensesHeader: {marginBottom: 16, marginTop: 28, flexDirection: "row", alignItems: "center", justifyContent: "space-between"},
  recentExpensesHeader2: {fontSize: 24, fontWeight: "800", color: "#071B46"},
  recentExpensesHeader3: {marginRight: 4, fontSize: 14, lineHeight: 20, fontWeight: "700", color: "#1677F2"},
  expenseContent: {alignItems: "center", borderRadius: 24, borderWidth: 1, borderColor: "#E3EDF8", backgroundColor: "#FFFFFF", paddingHorizontal: 20, paddingVertical: 40},
  expenseContent2: {marginTop: 12, fontSize: 14, lineHeight: 20, color: "#718096"},
  expenseContent3: {alignItems: "center", borderRadius: 24, borderWidth: 1, borderColor: "#E3EDF8", backgroundColor: "#FFFFFF", paddingHorizontal: 24, paddingVertical: 40},
  expenseContent4: {height: 64, width: 64, alignItems: "center", justifyContent: "center", borderRadius: 9999, backgroundColor: "#EAF3FF"},
  expenseContent5: {marginTop: 16, fontSize: 18, lineHeight: 28, fontWeight: "800", color: "#071B46"},
  expenseContent6: {marginTop: 8, textAlign: "center", fontSize: 14, lineHeight: 20, color: "#7A879A"},
  expenseContent7: {marginTop: 20, flexDirection: "row", alignItems: "center", borderRadius: 16, backgroundColor: "#1677F2", paddingHorizontal: 20, paddingVertical: 12},
  expenseContent8: {marginLeft: 8, fontWeight: "700", color: "#FFFFFF"},
  expenseContent9: {marginBottom: 16, overflow: "hidden", borderRadius: 24, borderWidth: 1, borderColor: "#E3EDF8", backgroundColor: "#FFFFFF"},
  expenseContentState: {backgroundColor: "#FFC85A"},
  expenseContentState2: {backgroundColor: "#8566F6"},
  expenseContent10: {position: "absolute", bottom: 0, left: 0, top: 0, width: 6},
  expenseContent11: {padding: 20},
  expenseContent12: {flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between"},
  expenseContent13: {marginRight: 12, flex: 1, flexDirection: "row"},
  expenseContent14: {marginRight: 12, height: 56, width: 56, alignItems: "center", justifyContent: "center", borderRadius: 9999, backgroundColor: "#FFF6D9"},
  expenseContent15: {fontSize: 24, lineHeight: 32},
  expenseContent16: {fontSize: 17, fontWeight: "800", color: "#071B46"},
  expenseContent17: {marginTop: 4, fontSize: 14, lineHeight: 20, color: "#6F7E92"},
  expenseContent18: {marginTop: 8, flexDirection: "row", alignItems: "center"},
  expenseContent19: {marginLeft: 6, fontSize: 12, lineHeight: 16, color: "#75859A"},
  expenseContent20: {maxWidth: "38%", borderRadius: 9999, backgroundColor: "#FCE8F0", paddingHorizontal: 12, paddingVertical: 8},
  expenseContent21: {fontWeight: "800", color: "#9B174C"},
  expenseContent22: {marginTop: 16, flexDirection: "row"},
  expenseContent23: {marginRight: 12, flexDirection: "row", alignItems: "center", borderRadius: 12, backgroundColor: "#EAF4FF", paddingHorizontal: 16, paddingVertical: 10},
  expenseContent24: {marginLeft: 8, fontSize: 14, lineHeight: 20, fontWeight: "700", color: "#1677F2"},
  expenseContent25: {flexDirection: "row", alignItems: "center", borderRadius: 12, backgroundColor: "#FDE9F0", paddingHorizontal: 16, paddingVertical: 10},
  expenseContent26: {marginLeft: 8, fontSize: 14, lineHeight: 20, fontWeight: "700", color: "#E91E63"},
  layout: {flex: 1, backgroundColor: "#F4F9FF"},
  scrollContent: {paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40},
});
