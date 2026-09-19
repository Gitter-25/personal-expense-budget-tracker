import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../lib/supabase";

type Expense = {
  id: string;
  amount: number;
  description: string | null;
  expense_date: string;
  category_id: string | null;
  category: {
    name: string;
    icon: string | null;
  } | null;
};

export default function HomeScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [monthlyBudget, setMonthlyBudget] = useState(0);

  const handleDeleteExpense = (expenseId: string) => {
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
            const { error } = await supabase
              .from("expenses")
              .delete()
              .eq("id", expenseId);

            if (error) {
              Alert.alert("Unable to delete expense", error.message);
              return;
            }

            setExpenses((currentExpenses) =>
              currentExpenses.filter((expense) => expense.id !== expenseId),
            );

            Alert.alert("Expense deleted", "The expense has been deleted.");
          },
        },
      ],
    );
  };

  const handleEditExpense = (expense: Expense) => {
    router.push({
      pathname: "/edit-expense",
      params: {
        id: expense.id,
      },
    });
  };

  const monthlySpent = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0,
  );

  const remainingBudget = monthlyBudget - monthlySpent;

  const loadExpenses = useCallback(async () => {
    setLoadingExpenses(true);

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}-01`;

    const [expenseResult, budgetResult] = await Promise.all([
      supabase
        .from("expenses")
        .select("id, amount, description, expense_date, category_id")
        .order("expense_date", { ascending: false })
        .order("created_at", { ascending: false }),

      supabase
        .from("budgets")
        .select("amount")
        .eq("month", currentMonth)
        .maybeSingle(),
    ]);

    const { data: expenseData, error: expenseError } = expenseResult;
    const { data: budgetData, error: budgetError } = budgetResult;

    if (expenseError) {
      setLoadingExpenses(false);
      Alert.alert("Unable to load expenses", expenseError.message);
      return;
    }

    if (budgetError) {
      setLoadingExpenses(false);
      Alert.alert("Unable to load budget", budgetError.message);
      return;
    }

    setMonthlyBudget(Number(budgetData?.amount ?? 0));

    const categoryIds = [
      ...new Set(
        (expenseData ?? [])
          .map((expense) => expense.category_id)
          .filter((id): id is string => Boolean(id)),
      ),
    ];

    let categoryMap = new Map<string, { name: string; icon: string | null }>();

    if (categoryIds.length > 0) {
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id, name, icon")
        .in("id", categoryIds);

      if (categoryError) {
        setLoadingExpenses(false);
        Alert.alert("Unable to load categories", categoryError.message);
        return;
      }

      categoryMap = new Map(
        (categoryData ?? []).map((category) => [
          category.id,
          {
            name: category.name,
            icon: category.icon,
          },
        ]),
      );
    }

    const formattedExpenses: Expense[] = (expenseData ?? []).map((expense) => ({
      id: expense.id,
      amount: expense.amount,
      description: expense.description,
      expense_date: expense.expense_date,
      category_id: expense.category_id,
      category: expense.category_id
        ? (categoryMap.get(expense.category_id) ?? null)
        : null,
    }));

    setExpenses(formattedExpenses);
    setLoadingExpenses(false);
  }, []);
  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [loadExpenses]),
  );

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="px-5 pb-8 pt-16">
        <Text className="text-3xl font-bold text-gray-900">Budget Tracker</Text>

        <Text className="mt-2 text-base text-gray-500">
          Manage your personal expenses
        </Text>

        <View className="mt-6 rounded-2xl bg-gray-900 p-6">
          <Text className="text-sm text-gray-300">Monthly Budget</Text>

          <Text className="mt-1 text-xl font-bold text-white">
            ₱{monthlyBudget.toFixed(2)}
          </Text>

          <View className="my-5 h-px bg-gray-700" />

          <View className="flex-row justify-between">
            <View>
              <Text className="text-sm text-gray-400">Total Spent</Text>
              <Text className="mt-1 text-xl font-bold text-white">
                ₱{monthlySpent.toFixed(2)}
              </Text>
            </View>

            <View>
              <Text className="text-sm text-gray-400">Remaining</Text>
              <Text className="mt-1 text-xl font-bold text-white">
                ₱{remainingBudget.toFixed(2)}
              </Text>
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
                      {expense.category?.icon ?? "💰"}
                    </Text>

                    <View className="flex-1">
                      <Text className="text-base font-bold text-gray-900">
                        {expense.category?.name ?? "Uncategorized"}
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

                <View className="mt-3 flex-row">
                  <TouchableOpacity
                    className="mr-2 rounded-lg bg-gray-100 px-3 py-2"
                    onPress={() => handleEditExpense(expense)}
                  >
                    <Text className="text-sm font-medium text-gray-700">
                      Edit
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="rounded-lg bg-red-100 px-3 py-2"
                    onPress={() => handleDeleteExpense(expense.id)}
                  >
                    <Text className="text-sm font-medium text-red-600">
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
