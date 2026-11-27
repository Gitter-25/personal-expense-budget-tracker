

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";

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

export default function useHome() {
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

  return { navigation, expenses, loadingExpenses, refreshing, monthlyBudget, monthlySpent, remainingBudget, budgetProgress, budgetProgressPercentage, recentExpenses, handleRefresh, handleDeleteExpense, handleEditExpense };
}
