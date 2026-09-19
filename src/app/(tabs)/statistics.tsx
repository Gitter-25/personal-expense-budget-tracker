import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { supabase } from "../../lib/supabase";

type Expense = {
  id: string;
  amount: number;
  expense_date: string;
  category_id: string | null;
};

export default function StatisticsScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStatistics = useCallback(async () => {
    setLoading(true);

    const now = new Date();
    const firstDayOfMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}-01`;

    const { data, error } = await supabase
      .from("expenses")
      .select("id, amount, expense_date, category_id")
      .gte("expense_date", firstDayOfMonth)
      .order("expense_date", { ascending: false });

    if (error) {
      setLoading(false);
      Alert.alert("Unable to load statistics", error.message);
      return;
    }

    setExpenses(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  const totalSpent = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0,
  );

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
                Spending Overview
              </Text>

              <Text className="mt-3 text-gray-500">
                Category statistics will appear here next.
              </Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
