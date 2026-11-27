import HomeBackground from "../components/HomeBackground";
import { formatCurrency } from "../utils/formatCurrency";
import BudgetSummary from "../components/BudgetSummary";
import { Ionicons } from "@expo/vector-icons";

import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

import styles from "../styles/HomeScreen.styles";
import useHome from "../hooks/useHome";

export default function HomeScreen() {
  const { navigation, expenses, loadingExpenses, refreshing, monthlyBudget, monthlySpent, remainingBudget, budgetProgress, budgetProgressPercentage, recentExpenses, handleRefresh, handleDeleteExpense, handleEditExpense } = useHome();
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

