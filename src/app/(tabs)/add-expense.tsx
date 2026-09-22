import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";

type Category = {
  id: string;
  name: string;
  icon: string | null;
};

export default function AddExpenseScreen() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);

      const { data, error } = await supabase
        .from("categories")
        .select("id, name, icon")
        .order("created_at", { ascending: true });

      if (error) {
        Alert.alert("Unable to load categories", error.message);
        return;
      }

      setCategories(data ?? []);
    } catch (error) {
      console.error("Unexpected error loading categories:", error);

      Alert.alert(
        "Unable to load categories",
        "An unexpected error occurred while loading your categories.",
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  const getLocalDate = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleSaveExpense = async () => {
    if (saving) return;

    if (!amount.trim()) {
      Alert.alert("Missing amount", "Please enter the expense amount.");
      return;
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert("Invalid amount", "Please enter an amount greater than 0.");
      return;
    }

    if (!categoryId) {
      Alert.alert("Missing category", "Please select a category.");
      return;
    }

    try {
      setSaving(true);

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

      const { error } = await supabase.from("expenses").insert({
        user_id: user.id,
        category_id: categoryId,
        amount: numericAmount,
        description: description.trim() || null,
        expense_date: getLocalDate(),
      });

      if (error) {
        Alert.alert("Unable to save expense", error.message);
        return;
      }

      Alert.alert("Success", "Expense saved successfully.");

      setAmount("");
      setDescription("");
      setCategoryId("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      Alert.alert("Unable to save expense", message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-100"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-10 pt-6"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-3xl font-bold text-gray-900">Add Expense</Text>

        <Text className="mt-2 text-base text-gray-500">
          Record your spending
        </Text>

        {/* Amount */}
        <View className="mt-8">
          <Text className="mb-2 text-sm font-semibold text-gray-700">
            Amount
          </Text>

          <View className="flex-row items-center rounded-2xl bg-white px-4">
            <Text className="mr-2 text-2xl font-bold text-gray-900">₱</Text>

            <TextInput
              className="flex-1 py-4 text-2xl font-bold text-gray-900"
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        {/* Category */}
        <View className="mt-6">
          <Text className="mb-2 text-sm font-semibold text-gray-700">
            Category
          </Text>

          {loadingCategories ? (
            <View className="rounded-2xl bg-white p-4">
              <Text className="text-gray-500">Loading categories...</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {categories.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className={`mb-3 w-[48%] rounded-2xl p-4 ${
                    categoryId === item.id ? "bg-blue-600" : "bg-white"
                  }`}
                  onPress={() => setCategoryId(item.id)}
                >
                  <Text className="text-2xl">{item.icon}</Text>

                  <Text
                    className={`mt-2 text-base font-semibold ${
                      categoryId === item.id ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Description */}
        <View className="mt-3">
          <Text className="mb-2 text-sm font-semibold text-gray-700">
            Description
          </Text>

          <TextInput
            className="rounded-2xl bg-white px-4 py-4 text-base text-gray-900"
            placeholder="What did you spend on?"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Save */}
        <TouchableOpacity
          className={`mt-8 items-center rounded-2xl py-4 ${
            saving ? "bg-blue-400" : "bg-blue-600"
          }`}
          onPress={handleSaveExpense}
          disabled={saving}
        >
          <Text className="text-base font-bold text-white">
            {saving ? "Saving..." : "Save Expense"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
