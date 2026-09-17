import { Text, View } from "react-native";

export default function AddExpenseScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-3xl font-bold text-gray-900">Add Expense</Text>

      <Text className="mt-2 text-gray-500">Add a new expense here.</Text>
    </View>
  );
}
