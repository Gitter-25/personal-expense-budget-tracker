import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { supabase } from "../../lib/supabase";

type Expense = {
  id: string;
  amount: number;
  expense_date: string;
  category_id: string | null;
};

type Category = {
  id: string;
  name: string;
  icon: string | null;
};

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function StatisticsScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [lastSevenDayExpenses, setLastSevenDayExpenses] = useState<Expense[]>(
    [],
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true);

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

      const [expenseResult, budgetResult] = await Promise.all([
        supabase
          .from("expenses")
          .select("id, amount, expense_date, category_id")
          .gte("expense_date", queryStart)
          .lt("expense_date", firstDayOfNextMonth)
          .order("expense_date", { ascending: false }),

        supabase
          .from("budgets")
          .select("amount")
          .eq("month", firstDayOfMonth)
          .maybeSingle(),
      ]);

      const { data: expenseData, error: expenseError } = expenseResult;
      const { data: budgetData, error: budgetError } = budgetResult;

      if (expenseError) {
        Alert.alert("Unable to load statistics", expenseError.message);
        return;
      }

      if (budgetError) {
        Alert.alert("Unable to load budget", budgetError.message);
        return;
      }

      const allLoadedExpenses = expenseData ?? [];

      const monthlyExpenses = allLoadedExpenses.filter(
        (expense) =>
          expense.expense_date >= firstDayOfMonth &&
          expense.expense_date < firstDayOfNextMonth,
      );

      setExpenses(monthlyExpenses);
      setLastSevenDayExpenses(allLoadedExpenses);
      setMonthlyBudget(Number(budgetData?.amount ?? 0));

      const categoryIds = [
        ...new Set(
          monthlyExpenses
            .map((expense) => expense.category_id)
            .filter((id): id is string => Boolean(id)),
        ),
      ];

      if (categoryIds.length > 0) {
        const { data: categoryData, error: categoryError } = await supabase
          .from("categories")
          .select("id, name, icon")
          .in("id", categoryIds);

        if (categoryError) {
          Alert.alert("Unable to load categories", categoryError.message);
          return;
        }

        setCategories(categoryData ?? []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Unexpected error loading statistics:", error);

      Alert.alert(
        "Unable to load statistics",
        "An unexpected error occurred while loading your statistics.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStatistics();
    }, [loadStatistics]),
  );

  // Total spending for the current month
  const totalSpent = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0,
  );

  // Remaining monthly budget
  const remainingBudget = monthlyBudget - totalSpent;

  // Percentage of monthly budget used
  const budgetPercentage =
    monthlyBudget > 0 ? Math.min((totalSpent / monthlyBudget) * 100, 100) : 0;

  // Spending by category for the current month
  const categoryTotals = categories.map((category) => {
    const total = expenses
      .filter((expense) => expense.category_id === category.id)
      .reduce((sum, expense) => sum + Number(expense.amount), 0);

    const percentage = totalSpent > 0 ? (total / totalSpent) * 100 : 0;

    return {
      ...category,
      total,
      percentage,
    };
  });

  // Spending during the last 7 calendar days
  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();

    date.setDate(date.getDate() - (6 - index));

    const dateString = formatLocalDate(date);

    const total = lastSevenDayExpenses
      .filter((expense) => expense.expense_date === dateString)
      .reduce((sum, expense) => sum + Number(expense.amount), 0);

    return {
      date: dateString,
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      total,
    };
  });

  // Highest spending in a single day
  const maxDailySpending = Math.max(
    ...lastSevenDays.map((day) => day.total),
    1,
  );

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="px-5 pb-8 pt-16">
        {/* Header */}
        <Text className="text-3xl font-bold text-gray-900">Statistics</Text>

        <Text className="mt-2 text-base text-gray-500">
          Your spending overview for this month.
        </Text>

        {loading ? (
          <View className="mt-8 items-center">
            <ActivityIndicator />

            <Text className="mt-3 text-gray-500">Loading statistics...</Text>
          </View>
        ) : (
          <>
            {/* Total Spent */}
            <View className="mt-8 rounded-2xl bg-gray-900 p-6">
              <Text className="text-sm text-gray-300">
                Total Spent This Month
              </Text>

              <Text className="mt-2 text-3xl font-bold text-white">
                ₱{totalSpent.toFixed(2)}
              </Text>

              <Text className="mt-2 text-sm text-gray-400">
                {expenses.length} expense
                {expenses.length === 1 ? "" : "s"}
              </Text>
            </View>

            {/* Monthly Budget */}
            <View className="mt-6 rounded-2xl bg-white p-5">
              <Text className="text-lg font-bold text-gray-900">
                Monthly Budget
              </Text>

              <View className="mt-4 flex-row justify-between">
                <View>
                  <Text className="text-sm text-gray-500">Budget</Text>

                  <Text className="mt-1 text-xl font-bold text-gray-900">
                    ₱{monthlyBudget.toFixed(2)}
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="text-sm text-gray-500">Remaining</Text>

                  <Text className="mt-1 text-xl font-bold text-gray-900">
                    ₱{remainingBudget.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Budget Progress Bar */}
              <View className="mt-5 h-3 overflow-hidden rounded-full bg-gray-200">
                <View
                  className="h-3 rounded-full bg-gray-900"
                  style={{
                    width: `${budgetPercentage}%`,
                  }}
                />
              </View>

              <Text className="mt-2 text-sm text-gray-500">
                {budgetPercentage.toFixed(1)}% of your budget used
              </Text>
            </View>

            {/* Last 7 Days */}
            <View className="mt-6 rounded-2xl bg-white p-5">
              <Text className="text-lg font-bold text-gray-900">
                Last 7 Days
              </Text>

              <Text className="mt-1 text-sm text-gray-500">
                Your daily spending
              </Text>

              <View className="mt-6 flex-row items-end justify-between">
                {lastSevenDays.map((day) => {
                  const barHeight =
                    day.total > 0
                      ? Math.max((day.total / maxDailySpending) * 120, 8)
                      : 4;

                  return (
                    <View key={day.date} className="flex-1 items-center">
                      <Text className="mb-2 text-xs font-medium text-gray-700">
                        {day.total > 0 ? `₱${day.total.toFixed(0)}` : "₱0"}
                      </Text>

                      <View className="h-[120px] items-center justify-end">
                        <View
                          className="w-7 rounded-t-lg bg-gray-900"
                          style={{
                            height: barHeight,
                          }}
                        />
                      </View>

                      <Text className="mt-2 text-xs text-gray-500">
                        {day.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Spending By Category */}
            <View className="mt-6 rounded-2xl bg-white p-5">
              <Text className="text-lg font-bold text-gray-900">
                Spending by Category
              </Text>

              {categoryTotals.length === 0 ? (
                <Text className="mt-4 text-gray-500">
                  No category spending yet.
                </Text>
              ) : (
                categoryTotals.map((category) => (
                  <View key={category.id} className="mt-5">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1 flex-row items-center">
                        <Text className="text-xl">{category.icon ?? "📁"}</Text>

                        <Text className="ml-3 font-medium text-gray-900">
                          {category.name}
                        </Text>
                      </View>

                      <View className="items-end">
                        <Text className="font-bold text-gray-900">
                          ₱{category.total.toFixed(2)}
                        </Text>

                        <Text className="text-sm text-gray-500">
                          {category.percentage.toFixed(1)}%
                        </Text>
                      </View>
                    </View>

                    <View className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                      <View
                        className="h-2 rounded-full bg-gray-900"
                        style={{
                          width: `${category.percentage}%`,
                        }}
                      />
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
