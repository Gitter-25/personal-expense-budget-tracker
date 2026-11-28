import { formatCurrency } from "../utils/formatCurrency";
import Background from "../components/Background";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getExpenses, deleteExpense } from "../storage/expenseStorage";
import { getMonthlyBudget } from "../storage/budgetStorage";
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
      <Background screen="Home" />
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
        {/* Budget Summary */}
        <View style={styles.budgetSummary_screen}>
          <View
            pointerEvents="none"
            style={styles.budgetSummary_screen2}
          />
          <View
            pointerEvents="none"
            style={styles.budgetSummary_screen3}
          />
          <View style={styles.budgetSummary_screen4}>
            <View style={styles.budgetSummary_screen5}>
              <Ionicons name="wallet-outline" size={29} color="#FFFFFF" />
            </View>
            <View style={styles.budgetSummary_screen6}>
              <Text style={styles.budgetSummary_screen7}>
                Monthly Budget
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={styles.budgetSummary_screen8}
              >
                {formatCurrency(monthlyBudget)}
              </Text>
            </View>
          </View>
          <View style={styles.budgetSummary_screen9}>
            <View style={styles.budgetSummary_screen10}>
              <Text style={styles.budgetSummary_screen11}>
                Budget used
              </Text>
              <Text style={styles.budgetSummary_screen12}>
                {budgetProgressPercentage}%
              </Text>
            </View>
            <View style={styles.budgetSummary_screen13}>
              <View
                style={[styles.budgetSummary_screen14, {
                  width: `${budgetProgress * 100}%`,
                }]}
              />
            </View>
          </View>
          <View style={styles.budgetSummary_screen15}>
            <View style={styles.budgetSummary_screen16}>
              <View style={styles.budgetSummary_screen17}>
                <Ionicons name="card-outline" size={23} color="#FFFFFF" />
              </View>
              <View style={styles.budgetSummary_screen6}>
                <Text style={styles.budgetSummary_screen18}>Total Spent</Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={styles.budgetSummary_screen19}
                >
                  {formatCurrency(monthlySpent)}
                </Text>
              </View>
            </View>
            <View style={styles.budgetSummary_screen20} />
            <View style={styles.budgetSummary_screen16}>
              <View style={styles.budgetSummary_screen17}>
                <Ionicons name="time-outline" size={23} color="#FFFFFF" />
              </View>
              <View style={styles.budgetSummary_screen6}>
                <Text style={styles.budgetSummary_screen18}>Remaining</Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={[styles.budgetSummary_screen21, remainingBudget < 0 ? styles.budgetSummary_screenState : styles.budgetSummary_screenState2]}
                >
                  {formatCurrency(remainingBudget)}
                </Text>
              </View>
            </View>
          </View>
        </View>

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

        {/* Recent Expense List */}
        <>
    {loadingExpenses ? (
          <View style={styles.recentExpenseList_expenseContent}>
            <ActivityIndicator size="small" color="#1677F2" />
            <Text style={styles.recentExpenseList_expenseContent2}>
              Loading expenses...
            </Text>
          </View>
        ) : recentExpenses.length === 0 ? (
          <View style={styles.recentExpenseList_expenseContent3}>
            <View style={styles.recentExpenseList_expenseContent4}>
              <Ionicons name="receipt-outline" size={30} color="#1677F2" />
            </View>
            <Text style={styles.recentExpenseList_expenseContent5}>
              No expenses yet
            </Text>
            <Text style={styles.recentExpenseList_expenseContent6}>
              Add your first expense and it will appear here.
            </Text>
            <TouchableOpacity
              style={styles.recentExpenseList_expenseContent7}
              onPress={() => navigation.navigate("AddExpense")}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Add your first expense"
            >
              <Ionicons name="add" size={19} color="#FFFFFF" />
              <Text style={styles.recentExpenseList_expenseContent8}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {recentExpenses.map((expense, index) => (
              <View
                key={expense.id}
                style={styles.recentExpenseList_expenseContent9}
              >
                <View
                  style={[styles.recentExpenseList_expenseContent10, index % 2 === 0 ? styles.recentExpenseList_expenseContentState : styles.recentExpenseList_expenseContentState2]}
                />
                <View style={styles.recentExpenseList_expenseContent11}>
                  <View style={styles.recentExpenseList_expenseContent12}>
                    <View style={styles.recentExpenseList_expenseContent13}>
                      <View style={styles.recentExpenseList_expenseContent14}>
                        <Text style={styles.recentExpenseList_expenseContent15}>
                          {expense.category?.icon ?? "💰"}
                        </Text>
                      </View>
                      <View style={styles.recentExpenseList_pesotrackBranding3}>
                        <Text
                          numberOfLines={1}
                          style={styles.recentExpenseList_expenseContent16}
                        >
                          {expense.category?.name ?? "Uncategorized"}
                        </Text>
                        <Text
                          numberOfLines={2}
                          style={styles.recentExpenseList_expenseContent17}
                        >
                          {expense.description || "No description"}
                        </Text>
                        <View style={styles.recentExpenseList_expenseContent18}>
                          <Ionicons
                            name="calendar-outline"
                            size={15}
                            color="#1677F2"
                          />
                          <Text style={styles.recentExpenseList_expenseContent19}>
                            {formatExpenseDate(expense.expense_date)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.recentExpenseList_expenseContent20}>
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={styles.recentExpenseList_expenseContent21}
                      >
                        {formatCurrency(Number(expense.amount))}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.recentExpenseList_expenseContent22}>
                    <TouchableOpacity
                      style={styles.recentExpenseList_expenseContent23}
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
                      <Text style={styles.recentExpenseList_expenseContent24}>
                        Edit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.recentExpenseList_expenseContent25}
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
                      <Text style={styles.recentExpenseList_expenseContent26}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
  </>
        
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles for this UI.
const styles = StyleSheet.create({

  budgetSummary_screen: {
    overflow: "hidden",
    borderRadius: 28,
    backgroundColor: "#1E63E9",
    paddingHorizontal: 20,
    paddingVertical: 24
  },

  budgetSummary_screen2: {
    position: "absolute",
    right: -80,
    top: -80,
    height: 208,
    width: 208,
    borderRadius: 9999,
    backgroundColor: "#6955F5"
  },

  budgetSummary_screen3: {
    position: "absolute",
    bottom: -112,
    left: 40,
    height: 224,
    width: 224,
    borderRadius: 9999,
    backgroundColor: "#0D83ED"
  },

  budgetSummary_screen4: {
    flexDirection: "row",
    alignItems: "center"
  },

  budgetSummary_screen5: {
    marginRight: 16,
    height: 56,
    width: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.15)"
  },

  budgetSummary_screen6: {
    flex: 1
  },

  budgetSummary_screen7: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)"
  },

  budgetSummary_screen8: {
    marginTop: 4,
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF"
  },

  budgetSummary_screen9: {
    marginTop: 24
  },

  budgetSummary_screen10: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  budgetSummary_screen11: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.75)"
  },

  budgetSummary_screen12: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    color: "#FFFFFF"
  },

  budgetSummary_screen13: {
    height: 12,
    overflow: "hidden",
    borderRadius: 9999,
    backgroundColor: "rgba(255, 255, 255, 0.25)"
  },

  budgetSummary_screen14: {
    height: "100%",
    borderRadius: 9999,
    backgroundColor: "#40D8EA"
  },

  budgetSummary_screen15: {
    marginTop: 24,
    flexDirection: "row"
  },

  budgetSummary_screen16: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },

  budgetSummary_screen17: {
    marginRight: 12,
    height: 44,
    width: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "rgba(255, 255, 255, 0.15)"
  },

  budgetSummary_screen18: {
    fontSize: 12,
    lineHeight: 16,
    color: "rgba(255, 255, 255, 0.7)"
  },

  budgetSummary_screen19: {
    marginTop: 4,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "800",
    color: "#FFFFFF"
  },

  budgetSummary_screen20: {
    marginHorizontal: 12,
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.25)"
  },

  budgetSummary_screenState: {
    color: "#FFD7DF"
  },

  budgetSummary_screenState2: {
    color: "#FFFFFF"
  },

  budgetSummary_screen21: {
    marginTop: 4,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "800"
  },



  recentExpenseList_pesotrackBranding3: {
    flex: 1
  },

  recentExpenseList_expenseContent: {
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 40
  },

  recentExpenseList_expenseContent2: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: "#718096"
  },

  recentExpenseList_expenseContent3: {
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 40
  },

  recentExpenseList_expenseContent4: {
    height: 64,
    width: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#EAF3FF"
  },

  recentExpenseList_expenseContent5: {
    marginTop: 16,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "800",
    color: "#071B46"
  },

  recentExpenseList_expenseContent6: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    color: "#7A879A"
  },

  recentExpenseList_expenseContent7: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#1677F2",
    paddingHorizontal: 20,
    paddingVertical: 12
  },

  recentExpenseList_expenseContent8: {
    marginLeft: 8,
    fontWeight: "700",
    color: "#FFFFFF"
  },

  recentExpenseList_expenseContent9: {
    marginBottom: 16,
    overflow: "hidden",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF"
  },

  recentExpenseList_expenseContentState: {
    backgroundColor: "#FFC85A"
  },

  recentExpenseList_expenseContentState2: {
    backgroundColor: "#8566F6"
  },

  recentExpenseList_expenseContent10: {
    position: "absolute",
    bottom: 0,
    left: 0,
    top: 0,
    width: 6
  },

  recentExpenseList_expenseContent11: {
    padding: 20
  },

  recentExpenseList_expenseContent12: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between"
  },

  recentExpenseList_expenseContent13: {
    marginRight: 12,
    flex: 1,
    flexDirection: "row"
  },

  recentExpenseList_expenseContent14: {
    marginRight: 12,
    height: 56,
    width: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#FFF6D9"
  },

  recentExpenseList_expenseContent15: {
    fontSize: 24,
    lineHeight: 32
  },

  recentExpenseList_expenseContent16: {
    fontSize: 17,
    fontWeight: "800",
    color: "#071B46"
  },

  recentExpenseList_expenseContent17: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: "#6F7E92"
  },

  recentExpenseList_expenseContent18: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center"
  },

  recentExpenseList_expenseContent19: {
    marginLeft: 6,
    fontSize: 12,
    lineHeight: 16,
    color: "#75859A"
  },

  recentExpenseList_expenseContent20: {
    maxWidth: "38%",
    borderRadius: 9999,
    backgroundColor: "#FCE8F0",
    paddingHorizontal: 12,
    paddingVertical: 8
  },

  recentExpenseList_expenseContent21: {
    fontWeight: "800",
    color: "#9B174C"
  },

  recentExpenseList_expenseContent22: {
    marginTop: 16,
    flexDirection: "row"
  },

  recentExpenseList_expenseContent23: {
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#EAF4FF",
    paddingHorizontal: 16,
    paddingVertical: 10
  },

  recentExpenseList_expenseContent24: {
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: "#1677F2"
  },

  recentExpenseList_expenseContent25: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#FDE9F0",
    paddingHorizontal: 16,
    paddingVertical: 10
  },

  recentExpenseList_expenseContent26: {
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: "#E91E63"
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
