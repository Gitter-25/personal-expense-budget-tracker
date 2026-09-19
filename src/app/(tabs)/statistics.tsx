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
  const [loading, setLoading] = useState(true);

  const loadStatistics = useCallback(async () => {
    setLoading(true);

    const now = new Date();
    const firstDayOfMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}-01`;

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

    const categoryIds = [
      ...new Set(
        (expenseData ?? [])
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

  const totalSpent = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0,
  );

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

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="px-5 pb-8 pt-16">
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
                        style={{ width: `${category.percentage}%` }}
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
