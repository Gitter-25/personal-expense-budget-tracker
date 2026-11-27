

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";

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

export default function useStatistics() {
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

  return { navigation, expenses, monthlyBudget, loading, refreshing, handleRefresh, totalSpent, remainingBudget, isOverBudget, actualBudgetPercentage, budgetBarPercentage, categoryTotals, lastSevenDays, maxDailySpending };
}
