import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { supabase } from "../../lib/supabase";

type Expense = {
  id: string;
  amount: number;
  description: string | null;
  expense_date: string;
  categories:
    | {
        name: string;
        icon: string | null;
      }[]
    | null;
};

export default function HomeScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);

  const loadExpenses = useCallback(async () => {
    setLoadingExpenses(true);

    const { data, error } = await supabase
      .from("expenses")
      .select(
        `
        id,
        amount,
        description,
        expense_date,
        categories (
          name,
          icon
        )
      `,
      )
      .order("expense_date", { ascending: false })
      .order("created_at", { ascending: false });

    setLoadingExpenses(false);

    if (error) {
      Alert.alert("Unable to load expenses", error.message);
      return;
    }

    setExpenses((data as Expense[]) ?? []);
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="px-5 pb-8 pt-16">
        <Text className="text-3xl font-bold text-gray-900">Budget Tracker</Text>

        <Text className="mt-2 text-base text-gray-500">
          Manage your personal expenses
        </Text>

        <View className="mt-6 rounded-2xl bg-gray-900 p-6">
          <Text className="text-sm text-gray-300">Monthly Budget</Text>

          <Text className="mt-1 text-4xl font-bold text-white">₱10,000</Text>

          <View className="my-5 h-px bg-gray-700" />

          <View className="flex-row justify-between">
            <View>
              <Text className="text-sm text-gray-400">Total Spent</Text>
              <Text className="mt-1 text-xl font-bold text-white">₱0</Text>
            </View>

            <View>
              <Text className="text-sm text-gray-400">Remaining</Text>
              <Text className="mt-1 text-xl font-bold text-white">₱10,000</Text>
            </View>
          </View>
        </View>

        <Text className="mb-3 mt-7 text-xl font-bold text-gray-900">
          Recent Expenses
        </Text>

        {loadingExpenses ? (
          <View className="rounded-2xl bg-white p-5">
            <Text className="text-center text-gray-500">
              Loading expenses...
            </Text>
          </View>
        ) : expenses.length === 0 ? (
          <View className="rounded-2xl bg-white p-5">
            <Text className="text-center text-gray-500">No expenses yet.</Text>

            <Text className="mt-1 text-center text-sm text-gray-400">
              Add your first expense to see it here.
            </Text>
          </View>
        ) : (
          <View>
            {expenses.map((expense) => (
              <View key={expense.id} className="mb-3 rounded-2xl bg-white p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 flex-row items-center">
                    <Text className="mr-3 text-2xl">
                      {expense.categories?.[0]?.icon ?? "💰"}
                    </Text>

                    <View className="flex-1">
                      <Text className="text-base font-bold text-gray-900">
                        {expense.categories?.[0]?.name ?? "Uncategorized"}
                      </Text>

                      <Text className="mt-1 text-sm text-gray-500">
                        {expense.description || "No description"}
                      </Text>
                    </View>
                  </View>

                  <Text className="ml-3 text-base font-bold text-gray-900">
                    ₱{Number(expense.amount).toFixed(2)}
                  </Text>
                </View>

                <Text className="mt-3 text-xs text-gray-400">
                  {expense.expense_date}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
