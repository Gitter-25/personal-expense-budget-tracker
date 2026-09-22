import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

const formatCurrency = (value: number) => {
  return `₱${value.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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

  const totalSpent = useMemo(() => {
    return expenses.reduce(
      (total, expense) => total + Number(expense.amount),
      0,
    );
  }, [expenses]);

  const remainingBudget = monthlyBudget - totalSpent;

  const budgetPercentage =
    monthlyBudget > 0 ? Math.min((totalSpent / monthlyBudget) * 100, 100) : 0;

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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F4F9FF",
      }}
      edges={["top", "left", "right"]}
    >
      {/* Decorative background */}
      <View
        pointerEvents="none"
        className="absolute -left-28 -top-24 h-72 w-72 rounded-full bg-[#D8EAFE]"
      />

      <View
        pointerEvents="none"
        className="absolute -right-40 top-28 h-80 w-80 rounded-full bg-[#E8E7FF]"
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="mr-3 h-12 w-12 items-center justify-center rounded-2xl bg-[#1677F2]">
              <Ionicons name="bar-chart" size={25} color="#FFFFFF" />
            </View>

            <Text className="text-2xl font-extrabold text-[#071B46]">
              Statistics
            </Text>
          </View>

          <TouchableOpacity
            className="h-12 w-12 items-center justify-center rounded-full bg-white"
            onPress={() => router.push("/(tabs)/settings")}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
          >
            <Ionicons name="settings" size={26} color="#1677F2" />
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View className="mb-6 flex-row items-center">
          <View className="mr-4 h-[70px] w-[70px] items-center justify-center rounded-[22px] bg-[#E7F1FF]">
            <Ionicons name="stats-chart" size={36} color="#1677F2" />
          </View>

          <View className="flex-1">
            <Text className="text-[32px] font-extrabold text-[#071B46]">
              Statistics
            </Text>

            <Text className="mt-1 text-[15px] text-[#65758B]">
              Your spending overview for this month.
            </Text>
          </View>
        </View>

        {loading ? (
          <View className="items-center rounded-[24px] border border-[#E3EDF8] bg-white px-5 py-12">
            <ActivityIndicator size="small" color="#1677F2" />

            <Text className="mt-3 text-sm text-[#718096]">
              Loading statistics...
            </Text>
          </View>
        ) : (
          <>
            {/* Total Spent Card */}
            <View className="overflow-hidden rounded-[28px] bg-[#174EAE] px-5 py-6">
              <View
                pointerEvents="none"
                className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#674EF3]"
              />

              <View
                pointerEvents="none"
                className="absolute -bottom-32 right-6 h-56 w-56 rounded-full bg-[#315AE2]"
              />

              <View className="flex-row items-center">
                <View className="mr-4 h-14 w-14 items-center justify-center rounded-full bg-white/15">
                  <Ionicons name="cash-outline" size={29} color="#FFFFFF" />
                </View>

                <View className="flex-1">
                  <Text className="text-[15px] text-white/80">
                    Total Spent This Month
                  </Text>

                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    className="mt-1 text-[34px] font-extrabold text-white"
                  >
                    {formatCurrency(totalSpent)}
                  </Text>

                  <Text className="mt-2 text-sm text-white/70">
                    {expenses.length} expense
                    {expenses.length === 1 ? "" : "s"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Budget Card */}
            <View className="mt-6 rounded-[26px] border border-[#E3EDF8] bg-white p-5">
              <View className="flex-row items-center">
                <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-[#EAF3FF]">
                  <Ionicons name="wallet" size={25} color="#1677F2" />
                </View>

                <Text className="text-[22px] font-extrabold text-[#071B46]">
                  Monthly Budget
                </Text>
              </View>

              <View className="mt-5 flex-row justify-between">
                <View>
                  <Text className="text-sm text-[#718096]">Budget</Text>

                  <Text className="mt-1 text-xl font-extrabold text-[#071B46]">
                    {formatCurrency(monthlyBudget)}
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="text-sm text-[#718096]">Remaining</Text>

                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    className="mt-1 text-xl font-extrabold text-[#071B46]"
                  >
                    {formatCurrency(remainingBudget)}
                  </Text>
                </View>
              </View>

              <View className="mt-5 h-3 overflow-hidden rounded-full bg-[#E4ECF5]">
                <View
                  className="h-full rounded-full bg-[#3D88F7]"
                  style={{
                    width: `${budgetPercentage}%`,
                  }}
                />
              </View>

              <Text className="mt-3 text-sm text-[#65758B]">
                {budgetPercentage.toFixed(1)}% of your budget used
              </Text>
            </View>

            {/* Last 7 Days */}
            <View className="mt-6 rounded-[26px] border border-[#E3EDF8] bg-white p-5">
              <View className="mb-1 flex-row items-center">
                <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-[#EEE9FF]">
                  <Ionicons name="bar-chart" size={24} color="#6B54F5" />
                </View>

                <View>
                  <Text className="text-[22px] font-extrabold text-[#071B46]">
                    Last 7 Days
                  </Text>

                  <Text className="mt-0.5 text-sm text-[#718096]">
                    Your daily spending
                  </Text>
                </View>
              </View>

              <View className="mt-6 flex-row items-end justify-between">
                {lastSevenDays.map((day) => {
                  const barHeight =
                    day.total > 0
                      ? Math.max((day.total / maxDailySpending) * 120, 10)
                      : 5;

                  return (
                    <View key={day.date} className="flex-1 items-center">
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        className="mb-2 text-[10px] font-semibold text-[#17335F]"
                      >
                        {day.total > 0
                          ? `₱${day.total.toLocaleString("en-PH", {
                              maximumFractionDigits: 0,
                            })}`
                          : "₱0"}
                      </Text>

                      <View className="h-[120px] w-8 items-center justify-end overflow-hidden rounded-xl bg-[#F0F5FB]">
                        <View
                          className="w-full rounded-xl bg-[#4A84F5]"
                          style={{
                            height: barHeight,
                          }}
                        />
                      </View>

                      <Text className="mt-2 text-[10px] font-medium text-[#65758B]">
                        {day.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Category Breakdown */}
            <View className="mt-6 rounded-[26px] border border-[#E3EDF8] bg-white p-5">
              <View className="flex-row items-center">
                <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-[#FFF1D8]">
                  <Ionicons name="pie-chart" size={24} color="#F59E0B" />
                </View>

                <View>
                  <Text className="text-[22px] font-extrabold text-[#071B46]">
                    Spending by Category
                  </Text>

                  <Text className="mt-0.5 text-sm text-[#718096]">
                    Where your money went this month
                  </Text>
                </View>
              </View>

              {categoryTotals.length === 0 ? (
                <View className="mt-6 items-center rounded-2xl bg-[#F8FBFF] px-5 py-8">
                  <Ionicons
                    name="pie-chart-outline"
                    size={30}
                    color="#A0AEC0"
                  />

                  <Text className="mt-3 text-sm text-[#718096]">
                    No category spending yet.
                  </Text>
                </View>
              ) : (
                <View className="mt-2">
                  {categoryTotals.map((category) => (
                    <View key={category.id} className="mt-5">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 flex-row items-center">
                          <View className="h-11 w-11 items-center justify-center rounded-full bg-[#F7FAFD]">
                            <Text className="text-xl">
                              {category.icon ?? "📁"}
                            </Text>
                          </View>

                          <View className="ml-3 flex-1">
                            <Text className="font-bold text-[#071B46]">
                              {category.name}
                            </Text>

                            <Text className="mt-0.5 text-xs text-[#718096]">
                              {category.percentage.toFixed(1)}% of spending
                            </Text>
                          </View>
                        </View>

                        <Text className="ml-3 font-extrabold text-[#071B46]">
                          {formatCurrency(category.total)}
                        </Text>
                      </View>

                      <View className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#E8EEF5]">
                        <View
                          className="h-full rounded-full bg-[#1677F2]"
                          style={{
                            width: `${Math.min(category.percentage, 100)}%`,
                          }}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
