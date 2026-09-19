import { useCallback, useEffect, useState } from "react";
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

export default function StatisticsScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadStatistics = useCallback(async () => {
    setLoading(true);

    const now = new Date();

    const firstDayOfMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}-01`;

    // Load this month's expenses
    const { data: expenseData, error: expenseError } = await supabase
      .from("expenses")
      .select("id, amount, expense_date, category_id")
      .gte("expense_date", firstDayOfMonth)
      .order("expense_date", { ascending: false });

    if (expenseError) {
      setLoading(false);

      Alert.alert("Unable to load statistics", expenseError.message);

      return;
    }

    // Load this month's budget
    const { data: budgetData, error: budgetError } = await supabase
      .from("budgets")
      .select("amount")
      .eq("month", firstDayOfMonth)
      .maybeSingle();

    if (budgetError) {
      setLoading(false);

      Alert.alert("Unable to load budget", budgetError.message);

      return;
    }

    setMonthlyBudget(Number(budgetData?.amount ?? 0));

    // Get category IDs used by this month's expenses
    const categoryIds = [
      ...new Set(
        (expenseData ?? [])
          .map((expense) => expense.category_id)
          .filter((id): id is string => Boolean(id)),
      ),
    ];

    // Load category information
    if (categoryIds.length > 0) {
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id, name, icon")
        .in("id", categoryIds);

      if (categoryError) {
        setLoading(false);

        Alert.alert("Unable to load categories", categoryError.message);

        return;
      }

      setCategories(categoryData ?? []);
    } else {
      setCategories([]);
    }

    setExpenses(expenseData ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  // Total spending
  const totalSpent = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0,
  );

  // Remaining budget
  const remainingBudget = monthlyBudget - totalSpent;

  // Percentage of budget used
  const budgetPercentage =
    monthlyBudget > 0 ? Math.min((totalSpent / monthlyBudget) * 100, 100) : 0;

  // Spending by category
  // Spending by category
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

  // Last 7 days spending
  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();

    date.setDate(date.getDate() - (6 - index));

    const dateString = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    const total = expenses
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
                      {/* Category Name */}
                      <View className="flex-1 flex-row items-center">
                        <Text className="text-xl">{category.icon ?? "📁"}</Text>

                        <Text className="ml-3 font-medium text-gray-900">
                          {category.name}
                        </Text>
                      </View>

                      {/* Amount and Percentage */}
                      <View className="items-end">
                        <Text className="font-bold text-gray-900">
                          ₱{category.total.toFixed(2)}
                        </Text>

                        <Text className="text-sm text-gray-500">
                          {category.percentage.toFixed(1)}%
                        </Text>
                      </View>
                    </View>

                    {/* Category Progress Bar */}
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
