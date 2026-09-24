import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

type Category = {
  id: string;
  name: string;
  icon: string | null;
};

type OriginalExpense = {
  amount: string;
  description: string;
  categoryId: string;
};

export default function EditExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [originalExpense, setOriginalExpense] =
    useState<OriginalExpense | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadExpense = async () => {
      if (!id) {
        Alert.alert("Missing expense", "Expense ID is missing.", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);

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

        const [expenseResult, categoryResult] = await Promise.all([
          supabase
            .from("expenses")
            .select("id, amount, description, category_id")
            .eq("id", id)
            .eq("user_id", user.id)
            .maybeSingle(),

          supabase
            .from("categories")
            .select("id, name, icon")
            .order("created_at", { ascending: true }),
        ]);

        const { data: expense, error: expenseError } = expenseResult;
        const { data: categoryData, error: categoryError } = categoryResult;

        if (expenseError) {
          Alert.alert("Unable to load expense", expenseError.message);
          return;
        }

        if (categoryError) {
          Alert.alert("Unable to load categories", categoryError.message);
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

        const loadedAmount = String(expense.amount);
        const loadedDescription = expense.description ?? "";
        const loadedCategoryId = expense.category_id ?? "";

        setAmount(loadedAmount);
        setDescription(loadedDescription);
        setCategoryId(loadedCategoryId);
        setCategories(categoryData ?? []);

        setOriginalExpense({
          amount: loadedAmount,
          description: loadedDescription,
          categoryId: loadedCategoryId,
        });
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

  const handleAmountChange = (value: string) => {
    const cleanedValue = value.replace(",", ".");

    if (/^\d*\.?\d{0,2}$/.test(cleanedValue)) {
      setAmount(cleanedValue);
    }
  };

  const hasChanges = useMemo(() => {
    if (!originalExpense) {
      return false;
    }

    return (
      amount.trim() !== originalExpense.amount.trim() ||
      description.trim() !== originalExpense.description.trim() ||
      categoryId !== originalExpense.categoryId
    );
  }, [amount, description, categoryId, originalExpense]);

  const handleSave = async () => {
    if (saving) return;

    Keyboard.dismiss();

    const trimmedAmount = amount.trim();
    const numericAmount = Number(trimmedAmount);

    if (
      !trimmedAmount ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      Alert.alert("Invalid amount", "Please enter an amount greater than 0.");
      return;
    }

    if (numericAmount > 999999999.99) {
      Alert.alert("Amount too large", "Please enter a smaller expense amount.");
      return;
    }

    if (!categoryId) {
      Alert.alert("Category required", "Please select a category.");
      return;
    }

    if (!id) {
      Alert.alert("Missing expense", "Expense ID is missing.");
      return;
    }

    if (!hasChanges) {
      Alert.alert("No changes", "There are no changes to save.");
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
        .eq("id", id)
        .eq("user_id", user.id);

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
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#F4F9FF",
        }}
        edges={["top", "left", "right", "bottom"]}
      >
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#1677F2" />

          <Text className="mt-3 text-sm text-[#718096]">
            Loading expense...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F4F9FF",
      }}
      edges={["top", "left", "right", "bottom"]}
    >
      {/* Background decorations */}
      <View
        pointerEvents="none"
        className="absolute -left-28 -top-24 h-72 w-72 rounded-full bg-[#D8EAFE]"
      />

      <View
        pointerEvents="none"
        className="absolute -right-40 top-44 h-80 w-80 rounded-full bg-[#E4F0FF]"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 32,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="mb-6 flex-row items-center">
            <TouchableOpacity
              className="mr-3 h-12 w-12 items-center justify-center rounded-2xl border border-[#E3EDF8] bg-white"
              onPress={() => router.back()}
              disabled={saving}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={24} color="#1677F2" />
            </TouchableOpacity>

            <View className="flex-1">
              <Text className="text-[25px] font-extrabold text-[#071B46]">
                Edit Expense
              </Text>

              <Text className="mt-0.5 text-sm text-[#66758D]">
                Update your expense details
              </Text>
            </View>
          </View>

          {/* Amount */}
          <View className="rounded-[22px] border border-[#E3EDF8] bg-white p-4">
            <View className="mb-3 flex-row items-center">
              <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-[#EAF3FF]">
                <Text className="text-[21px] font-extrabold text-[#17335F]">
                  ₱
                </Text>
              </View>

              <Text className="text-[18px] font-extrabold text-[#071B46]">
                Expense Amount
              </Text>
            </View>

            <View className="flex-row items-center rounded-2xl border border-[#D7E5F4] bg-[#F8FBFF] px-4">
              <Text className="mr-3 text-[24px] font-bold text-[#586A84]">
                ₱
              </Text>

              <View className="mr-3 h-7 w-px bg-[#DCE8F5]" />

              <TextInput
                style={{
                  flex: 1,
                  minHeight: 54,
                  color: "#071B46",
                  fontSize: 22,
                  fontWeight: "700",
                }}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0.00"
                placeholderTextColor="#A0AEC0"
                keyboardType="decimal-pad"
                editable={!saving}
                maxLength={12}
                accessibilityLabel="Expense amount"
              />
            </View>
          </View>

          {/* Category */}
          <View className="mt-5">
            <View className="mb-3 flex-row items-center">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#EEF5FF]">
                <Ionicons name="grid-outline" size={20} color="#1677F2" />
              </View>

              <Text className="text-[20px] font-extrabold text-[#071B46]">
                Category
              </Text>
            </View>

            {categories.length === 0 ? (
              <View className="items-center rounded-[22px] border border-[#E3EDF8] bg-white px-5 py-7">
                <Ionicons
                  name="folder-open-outline"
                  size={30}
                  color="#A0AEC0"
                />

                <Text className="mt-3 text-sm text-[#718096]">
                  No categories available.
                </Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap justify-between">
                {categories.map((category) => {
                  const selected = categoryId === category.id;

                  return (
                    <TouchableOpacity
                      key={category.id}
                      className={`mb-2 w-[48%] rounded-[18px] border px-3 py-2.5 ${
                        selected
                          ? "border-[#1677F2] bg-[#1677F2]"
                          : "border-[#E3EDF8] bg-white"
                      }`}
                      onPress={() => setCategoryId(category.id)}
                      disabled={saving}
                      activeOpacity={0.85}
                      accessibilityRole="button"
                      accessibilityLabel={`${category.name} category`}
                      accessibilityState={{
                        selected,
                        disabled: saving,
                      }}
                    >
                      <View
                        className={`h-10 w-10 items-center justify-center rounded-full ${
                          selected ? "bg-white/15" : "bg-[#F5F9FF]"
                        }`}
                      >
                        <Text className="text-xl">{category.icon ?? "📁"}</Text>
                      </View>

                      <Text
                        numberOfLines={1}
                        className={`mt-1.5 text-sm font-extrabold ${
                          selected ? "text-white" : "text-[#071B46]"
                        }`}
                      >
                        {category.name}
                      </Text>

                      {selected && (
                        <View className="mt-1 flex-row items-center">
                          <Ionicons
                            name="checkmark-circle"
                            size={14}
                            color="#FFFFFF"
                          />

                          <Text className="ml-1 text-xs font-medium text-white/90">
                            Selected
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Description */}
          <View className="mt-4">
            <View className="mb-3 flex-row items-center">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#EEF5FF]">
                <Ionicons name="create-outline" size={20} color="#1677F2" />
              </View>

              <Text className="text-[20px] font-extrabold text-[#071B46]">
                Description
              </Text>

              <Text className="ml-2 text-xs text-[#94A3B8]">Optional</Text>
            </View>

            <View className="rounded-[22px] border border-[#E3EDF8] bg-white p-4">
              <TextInput
                style={{
                  minHeight: 72,
                  color: "#071B46",
                  fontSize: 16,
                  lineHeight: 23,
                }}
                value={description}
                onChangeText={setDescription}
                placeholder="What did you spend on?"
                placeholderTextColor="#A0AEC0"
                multiline
                textAlignVertical="top"
                editable={!saving}
                maxLength={150}
                accessibilityLabel="Expense description"
              />

              <Text className="mt-2 text-right text-xs text-[#94A3B8]">
                {description.length}/150
              </Text>
            </View>
          </View>

          {/* Save */}
          <TouchableOpacity
            disabled={saving || !hasChanges}
            onPress={handleSave}
            className={`mt-5 min-h-[56px] flex-row items-center justify-center rounded-2xl ${
              saving
                ? "bg-[#7CB3F8]"
                : hasChanges
                  ? "bg-[#1677F2]"
                  : "bg-[#B7D3F7]"
            }`}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Save expense changes"
            accessibilityState={{
              disabled: saving || !hasChanges,
            }}
          >
            {saving ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />

                <Text className="ml-3 text-base font-extrabold text-white">
                  Saving...
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name={
                    hasChanges ? "save-outline" : "checkmark-circle-outline"
                  }
                  size={21}
                  color="#FFFFFF"
                />

                <Text className="mx-3 text-base font-extrabold text-white">
                  {hasChanges ? "Save Changes" : "No Changes"}
                </Text>

                {hasChanges && (
                  <Ionicons name="arrow-forward" size={21} color="#FFFFFF" />
                )}
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
