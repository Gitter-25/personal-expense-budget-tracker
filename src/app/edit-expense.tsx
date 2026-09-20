import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

type Category = {
  id: string;
  name: string;
  icon: string | null;
};

export default function EditExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadExpense = async () => {
      if (!id) {
        Alert.alert("Error", "Expense ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          Alert.alert(
            "Session error",
            "Your session could not be verified. Please log in again.",
          );
          router.replace("/login");
          return;
        }

        const { data: expense, error: expenseError } = await supabase
          .from("expenses")
          .select("id, amount, description, category_id")
          .eq("id", id)
          .maybeSingle();

        if (expenseError) {
          Alert.alert("Unable to load expense", expenseError.message);
          return;
        }

        if (!expense) {
          Alert.alert("Expense not found", "This expense no longer exists.", [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]);
          return;
        }

        setAmount(String(expense.amount));
        setDescription(expense.description ?? "");
        setCategoryId(expense.category_id ?? "");

        const { data: categoryData, error: categoryError } = await supabase
          .from("categories")
          .select("id, name, icon")
          .order("created_at", { ascending: true });

        if (categoryError) {
          Alert.alert("Unable to load categories", categoryError.message);
          return;
        }

        setCategories(categoryData ?? []);
      } catch (error) {
        console.error("Unexpected error loading expense:", error);

        Alert.alert(
          "Unable to load expense",
          "An unexpected error occurred while loading the expense.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadExpense();
  }, [id]);

  const handleSave = async () => {
    if (saving) return;

    const numericAmount = Number(amount);

    if (
      !amount.trim() ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      Alert.alert("Invalid amount", "Please enter an amount greater than 0.");
      return;
    }

    if (!categoryId) {
      Alert.alert("Category required", "Please select a category.");
      return;
    }

    if (!id) {
      Alert.alert("Error", "Expense ID is missing.");
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
        router.replace("/login");
        return;
      }

      const { error } = await supabase
        .from("expenses")
        .update({
          amount: numericAmount,
          description: description.trim() || null,
          category_id: categoryId,
        })
        .eq("id", id);

      if (error) {
        Alert.alert("Unable to update expense", error.message);
        return;
      }

      Alert.alert(
        "Expense updated",
        "Your expense has been updated successfully.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      Alert.alert("Unable to update expense", message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator />

        <Text className="mt-3 text-gray-500">Loading expense...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-100"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="px-5 pb-10 pt-16">
          <Text className="text-3xl font-bold text-gray-900">Edit Expense</Text>

          <Text className="mt-2 text-base text-gray-500">
            Update your expense details.
          </Text>

          {/* Amount */}
          <View className="mt-8">
            <Text className="mb-2 text-sm font-medium text-gray-700">
              Amount
            </Text>

            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              className="rounded-2xl bg-white px-4 py-4 text-base text-gray-900"
            />
          </View>

          {/* Description */}
          <View className="mt-5">
            <Text className="mb-2 text-sm font-medium text-gray-700">
              Description
            </Text>

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="What did you spend on?"
              className="rounded-2xl bg-white px-4 py-4 text-base text-gray-900"
            />
          </View>

          {/* Category */}
          <View className="mt-5">
            <Text className="mb-2 text-sm font-medium text-gray-700">
              Category
            </Text>

            <View className="rounded-2xl bg-white p-3">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setCategoryId(category.id)}
                  className={`mb-2 flex-row items-center rounded-xl p-3 ${
                    categoryId === category.id ? "bg-gray-900" : "bg-gray-100"
                  }`}
                >
                  <Text className="text-xl">{category.icon ?? "📁"}</Text>

                  <Text
                    className={`ml-3 font-medium ${
                      categoryId === category.id
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Save */}
          <TouchableOpacity
            disabled={saving}
            onPress={handleSave}
            className={`mt-7 rounded-2xl p-4 ${
              saving ? "bg-gray-400" : "bg-gray-900"
            }`}
          >
            <Text className="text-center text-base font-bold text-white">
              {saving ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
