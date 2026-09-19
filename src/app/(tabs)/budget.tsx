import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function BudgetScreen() {
  const [budget, setBudget] = useState("10000");

  const handleSave = () => {
    const amount = Number(budget);

    if (!budget.trim() || Number.isNaN(amount) || amount < 0) {
      Alert.alert("Invalid budget", "Please enter a valid budget amount.");
      return;
    }

    Alert.alert("Budget", `Budget set to ₱${amount.toFixed(2)}`);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-100"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 px-5 pb-8 pt-16">
        <Text className="text-3xl font-bold text-gray-900">Monthly Budget</Text>

        <Text className="mt-2 text-base text-gray-500">
          Set how much you want to spend this month.
        </Text>

        <View className="mt-8 rounded-2xl bg-white p-5">
          <Text className="mb-3 text-sm font-semibold text-gray-700">
            Budget Amount
          </Text>

          <View className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-4">
            <Text className="mr-2 text-lg font-semibold text-gray-700">₱</Text>

            <TextInput
              className="flex-1 py-4 text-lg text-gray-900"
              value={budget}
              onChangeText={setBudget}
              keyboardType="decimal-pad"
              placeholder="10000"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity
            className="mt-5 items-center rounded-xl bg-blue-600 py-4"
            onPress={handleSave}
          >
            <Text className="text-base font-bold text-white">Save Budget</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
