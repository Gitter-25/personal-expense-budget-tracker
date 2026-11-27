import RecentExpenseList from "../components/RecentExpenseList";
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

        <RecentExpenseList loadingExpenses={loadingExpenses} recentExpenses={recentExpenses} navigation={navigation} handleEditExpense={handleEditExpense} handleDeleteExpense={handleDeleteExpense} />
        
      </ScrollView>
    </SafeAreaView>
  );
}

