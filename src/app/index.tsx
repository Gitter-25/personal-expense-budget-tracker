import { router } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function HomeScreen() {
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.replace("/login");
      }
    };

    checkSession();
  }, []);

  return (
    <View className="flex-1 bg-gray-100 px-5 pt-16">
      <Text className="text-3xl font-bold text-gray-900">Budget Tracker</Text>

      <Text className="mt-2 text-base text-gray-500">
        Manage your personal expenses
      </Text>

      {/* Budget Card */}
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

      {/* Add Expense */}
      <TouchableOpacity className="mt-4 items-center rounded-xl bg-blue-600 py-4">
        <Text className="text-base font-bold text-white">+ Add Expense</Text>
      </TouchableOpacity>

      {/* Categories */}
      <Text className="mb-3 mt-7 text-xl font-bold text-gray-900">
        Expense Categories
      </Text>

      <View className="flex-row flex-wrap justify-between">
        <View className="mb-3 w-[48%] rounded-2xl bg-white p-4">
          <Text className="text-sm text-gray-500">Food</Text>
          <Text className="mt-2 text-lg font-bold text-gray-900">₱0</Text>
        </View>

        <View className="mb-3 w-[48%] rounded-2xl bg-white p-4">
          <Text className="text-sm text-gray-500">Transport</Text>
          <Text className="mt-2 text-lg font-bold text-gray-900">₱0</Text>
        </View>

        <View className="mb-3 w-[48%] rounded-2xl bg-white p-4">
          <Text className="text-sm text-gray-500">Shopping</Text>
          <Text className="mt-2 text-lg font-bold text-gray-900">₱0</Text>
        </View>

        <View className="mb-3 w-[48%] rounded-2xl bg-white p-4">
          <Text className="text-sm text-gray-500">Bills</Text>
          <Text className="mt-2 text-lg font-bold text-gray-900">₱0</Text>
        </View>
      </View>
    </View>
  );
}
