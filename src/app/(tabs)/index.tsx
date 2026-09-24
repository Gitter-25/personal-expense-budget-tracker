import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

const formatCurrency = (value: number) => {
  return `₱${value.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatExpenseDate = (date: string) => {
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

export default function HomeScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
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

      const [expenseResult, budgetResult] = await Promise.all([
        supabase
          .from("expenses")
          .select(
            "id, amount, description, expense_date, category_id, created_at",
          )
          .gte("expense_date", currentMonth)
          .lt("expense_date", nextMonth)
          .order("expense_date", {
            ascending: false,
          })
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("budgets")
          .select("amount")
          .eq("month", currentMonth)
          .maybeSingle(),
      ]);

      const { data: expenseData, error: expenseError } = expenseResult;
      const { data: budgetData, error: budgetError } = budgetResult;

      if (expenseError) {
        Alert.alert("Unable to load expenses", expenseError.message);
        return;
      }

      if (budgetError) {
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

      let categoryMap = new Map<
        string,
        {
          name: string;
          icon: string | null;
        }
      >();

      if (categoryIds.length > 0) {
        const { data: categoryData, error: categoryError } = await supabase
          .from("categories")
          .select("id, name, icon")
          .in("id", categoryIds);

        if (categoryError) {
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

      const formattedExpenses: Expense[] = (expenseData ?? []).map(
        (expense) => ({
          id: expense.id,
          amount: Number(expense.amount),
          description: expense.description,
          expense_date: expense.expense_date,
          category_id: expense.category_id,
          category: expense.category_id
            ? (categoryMap.get(expense.category_id) ?? null)
            : null,
        }),
      );

      setExpenses(formattedExpenses);
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
            try {
              const {
                data: { user },
                error: userError,
              } = await supabase.auth.getUser();

              if (userError || !user) {
                Alert.alert(
                  "Session error",
                  "Your session could not be verified. Please log in again.",
                );
                return;
              }

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

  const handleEditExpense = (expense: Expense) => {
    router.push({
      pathname: "/edit-expense",
      params: {
        id: expense.id,
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [loadExpenses]),
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F4F9FF",
      }}
      edges={["top", "left", "right"]}
    >
      {/* Background decorations */}
      <View
        pointerEvents="none"
        className="absolute -left-28 -top-24 h-72 w-72 rounded-full bg-[#D8EAFE]"
      />

      <View
        pointerEvents="none"
        className="absolute -right-40 top-44 h-80 w-80 rounded-full bg-[#E6F1FF]"
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40,
        }}
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
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="mr-3 h-12 w-12 items-center justify-center rounded-2xl bg-[#1677F2]">
              <Ionicons name="home" size={25} color="#FFFFFF" />
            </View>

            <Text className="text-2xl font-extrabold text-[#071B46]">Home</Text>
          </View>

          <TouchableOpacity
            className="h-12 w-12 items-center justify-center rounded-full border border-[#E3EDF8] bg-white"
            onPress={() => router.push("/(tabs)/settings")}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
          >
            <Ionicons name="settings-outline" size={25} color="#1677F2" />
          </TouchableOpacity>
        </View>

        {/* PesoTrack branding */}
        <View className="mb-6 flex-row items-center">
          <View className="mr-4 h-[70px] w-[70px] items-center justify-center rounded-[22px] bg-[#1677F2]">
            <Ionicons name="wallet" size={38} color="#FFFFFF" />
          </View>

          <View className="flex-1">
            <View className="flex-row flex-wrap items-baseline">
              <Text className="text-[34px] font-extrabold tracking-tight text-[#071B46]">
                Peso
              </Text>

              <Text className="text-[34px] font-extrabold tracking-tight text-[#1677F2]">
                Track
              </Text>
            </View>

            <Text className="mt-1 text-[15px] text-[#65758B]">
              Manage your personal expenses
            </Text>
          </View>
        </View>

        {/* Monthly budget summary */}
        <View className="overflow-hidden rounded-[28px] bg-[#1E63E9] px-5 py-6">
          <View
            pointerEvents="none"
            className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#6955F5]"
          />

          <View
            pointerEvents="none"
            className="absolute -bottom-28 left-10 h-56 w-56 rounded-full bg-[#0D83ED]"
          />

          <View className="flex-row items-center">
            <View className="mr-4 h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <Ionicons name="wallet-outline" size={29} color="#FFFFFF" />
            </View>

            <View className="flex-1">
              <Text className="text-[15px] font-medium text-white/80">
                Monthly Budget
              </Text>

              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                className="mt-1 text-[32px] font-extrabold text-white"
              >
                {formatCurrency(monthlyBudget)}
              </Text>
            </View>
          </View>

          <View className="mt-6">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-xs font-medium text-white/75">
                Budget used
              </Text>

              <Text className="text-xs font-bold text-white">
                {budgetProgressPercentage}%
              </Text>
            </View>

            <View className="h-3 overflow-hidden rounded-full bg-white/25">
              <View
                style={{
                  width: `${budgetProgress * 100}%`,
                }}
                className="h-full rounded-full bg-[#40D8EA]"
              />
            </View>
          </View>

          <View className="mt-6 flex-row">
            <View className="flex-1 flex-row items-center">
              <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-white/15">
                <Ionicons name="card-outline" size={23} color="#FFFFFF" />
              </View>

              <View className="flex-1">
                <Text className="text-xs text-white/70">Total Spent</Text>

                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  className="mt-1 text-lg font-extrabold text-white"
                >
                  {formatCurrency(monthlySpent)}
                </Text>
              </View>
            </View>

            <View className="mx-3 w-px bg-white/25" />

            <View className="flex-1 flex-row items-center">
              <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-white/15">
                <Ionicons name="time-outline" size={23} color="#FFFFFF" />
              </View>

              <View className="flex-1">
                <Text className="text-xs text-white/70">Remaining</Text>

                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  className={`mt-1 text-lg font-extrabold ${
                    remainingBudget < 0 ? "text-[#FFD7DF]" : "text-white"
                  }`}
                >
                  {formatCurrency(remainingBudget)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent expenses header */}
        <View className="mb-4 mt-7 flex-row items-center justify-between">
          <Text className="text-[24px] font-extrabold text-[#071B46]">
            Recent Expenses
          </Text>

          {expenses.length > 5 && (
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => router.push("/(tabs)/statistics")}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="View all expense statistics"
            >
              <Text className="mr-1 text-sm font-bold text-[#1677F2]">
                View All
              </Text>

              <Ionicons name="chevron-forward" size={17} color="#1677F2" />
            </TouchableOpacity>
          )}
        </View>

        {/* Expense content */}
        {loadingExpenses ? (
          <View className="items-center rounded-[24px] border border-[#E3EDF8] bg-white px-5 py-10">
            <ActivityIndicator size="small" color="#1677F2" />

            <Text className="mt-3 text-sm text-[#718096]">
              Loading expenses...
            </Text>
          </View>
        ) : recentExpenses.length === 0 ? (
          <View className="items-center rounded-[24px] border border-[#E3EDF8] bg-white px-6 py-10">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-[#EAF3FF]">
              <Ionicons name="receipt-outline" size={30} color="#1677F2" />
            </View>

            <Text className="mt-4 text-lg font-extrabold text-[#071B46]">
              No expenses yet
            </Text>

            <Text className="mt-2 text-center text-sm leading-5 text-[#7A879A]">
              Add your first expense and it will appear here.
            </Text>

            <TouchableOpacity
              className="mt-5 flex-row items-center rounded-2xl bg-[#1677F2] px-5 py-3"
              onPress={() => router.push("/(tabs)/add-expense")}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Add your first expense"
            >
              <Ionicons name="add" size={19} color="#FFFFFF" />

              <Text className="ml-2 font-bold text-white">Add Expense</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {recentExpenses.map((expense, index) => (
              <View
                key={expense.id}
                className="mb-4 overflow-hidden rounded-[24px] border border-[#E3EDF8] bg-white"
              >
                <View
                  className={`absolute bottom-0 left-0 top-0 w-1.5 ${
                    index % 2 === 0 ? "bg-[#FFC85A]" : "bg-[#8566F6]"
                  }`}
                />

                <View className="p-5">
                  <View className="flex-row items-start justify-between">
                    <View className="mr-3 flex-1 flex-row">
                      <View className="mr-3 h-14 w-14 items-center justify-center rounded-full bg-[#FFF6D9]">
                        <Text className="text-2xl">
                          {expense.category?.icon ?? "💰"}
                        </Text>
                      </View>

                      <View className="flex-1">
                        <Text
                          numberOfLines={1}
                          className="text-[17px] font-extrabold text-[#071B46]"
                        >
                          {expense.category?.name ?? "Uncategorized"}
                        </Text>

                        <Text
                          numberOfLines={2}
                          className="mt-1 text-sm leading-5 text-[#6F7E92]"
                        >
                          {expense.description || "No description"}
                        </Text>

                        <View className="mt-2 flex-row items-center">
                          <Ionicons
                            name="calendar-outline"
                            size={15}
                            color="#1677F2"
                          />

                          <Text className="ml-1.5 text-xs text-[#75859A]">
                            {formatExpenseDate(expense.expense_date)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View className="max-w-[38%] rounded-full bg-[#FCE8F0] px-3 py-2">
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        className="font-extrabold text-[#9B174C]"
                      >
                        {formatCurrency(Number(expense.amount))}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-4 flex-row">
                    <TouchableOpacity
                      className="mr-3 flex-row items-center rounded-xl bg-[#EAF4FF] px-4 py-2.5"
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

                      <Text className="ml-2 text-sm font-bold text-[#1677F2]">
                        Edit
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="flex-row items-center rounded-xl bg-[#FDE9F0] px-4 py-2.5"
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

                      <Text className="ml-2 text-sm font-bold text-[#E91E63]">
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
