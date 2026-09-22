import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
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

    Keyboard.dismiss();

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
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="mb-6 flex-row items-center">
            <View className="mr-3 h-12 w-12 items-center justify-center rounded-2xl bg-[#1677F2]">
              <Ionicons name="add" size={28} color="#FFFFFF" />
            </View>

            <View>
              <Text className="text-[25px] font-extrabold text-[#071B46]">
                Add Expense
              </Text>

              <Text className="mt-0.5 text-sm text-[#66758D]">
                Record your spending
              </Text>
            </View>
          </View>

          {/* Amount Card */}
          <View className="rounded-[26px] border border-[#E3EDF8] bg-white p-4">
            <View className="mb-4 flex-row items-center">
              <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-[#EAF3FF]">
                <Text className="text-[24px] font-extrabold text-[#17335F]">
                  ₱
                </Text>
              </View>

              <Text className="text-[18px] font-extrabold text-[#071B46]">
                Expense Amount
              </Text>
            </View>

            <View className="flex-row items-center rounded-2xl border border-[#D7E5F4] bg-[#F8FBFF] px-4">
              <Text className="mr-3 text-[26px] font-bold text-[#586A84]">
                ₱
              </Text>

              <View className="mr-3 h-8 w-px bg-[#DCE8F5]" />

              <TextInput
                style={{
                  minHeight: 54,
                  color: "#071B46",
                  fontSize: 16,
                  lineHeight: 22,
                }}
                placeholder="0.00"
                placeholderTextColor="#A0AEC0"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
                editable={!saving}
              />
            </View>
          </View>

          {/* Category */}
          <View className="mt-6">
            <View className="mb-3 flex-row items-center">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#EEF5FF]">
                <Ionicons name="grid-outline" size={20} color="#1677F2" />
              </View>

              <Text className="text-[20px] font-extrabold text-[#071B46]">
                Category
              </Text>
            </View>

            {loadingCategories ? (
              <View className="items-center rounded-[24px] border border-[#E3EDF8] bg-white py-8">
                <ActivityIndicator size="small" color="#1677F2" />

                <Text className="mt-3 text-sm text-[#718096]">
                  Loading categories...
                </Text>
              </View>
            ) : categories.length === 0 ? (
              <View className="rounded-[24px] border border-[#E3EDF8] bg-white px-5 py-8">
                <Text className="text-center text-sm text-[#718096]">
                  No categories available.
                </Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap justify-between">
                {categories.map((item) => {
                  const selected = categoryId === item.id;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      className={`mb-3 w-[48%] rounded-[22px] border p-2.5 ${
                        selected
                          ? "border-[#1677F2] bg-[#1677F2]"
                          : "border-[#E3EDF8] bg-white"
                      }`}
                      onPress={() => setCategoryId(item.id)}
                      disabled={saving}
                      activeOpacity={0.85}
                    >
                      <View
                        className={`h-10 w-10 items-center justify-center rounded-full ${
                          selected ? "bg-white/15" : "bg-[#F5F9FF]"
                        }`}
                      >
                        <Text className="text-l">{item.icon ?? "📁"}</Text>
                      </View>

                      <Text
                        className={`mt-1.5 text-base font-extrabold ${
                          selected ? "text-white" : "text-[#071B46]"
                        }`}
                      >
                        {item.name}
                      </Text>
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
            </View>

            <View className="rounded-[24px] border border-[#E3EDF8] bg-white p-4">
              <TextInput
                style={{
                  minHeight: 40,
                  color: "#071B46",
                  fontSize: 16,
                  lineHeight: 22,
                }}
                placeholder="What did you spend on?"
                placeholderTextColor="#A0AEC0"
                multiline
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
                editable={!saving}
                maxLength={150}
              />

              <Text className="mt-2 text-right text-xs text-[#94A3B8]">
                {description.length}/150
              </Text>
            </View>
          </View>

          {/* Save */}
          <TouchableOpacity
            className={`mt-7 min-h-[56px] flex-row items-center justify-center rounded-2xl ${
              saving ? "bg-[#7CB3F8]" : "bg-[#1677F2]"
            }`}
            onPress={handleSaveExpense}
            disabled={saving || loadingCategories}
            activeOpacity={0.85}
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
                <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />

                <Text className="mx-3 text-base font-extrabold text-white">
                  Save Expense
                </Text>

                <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Tip */}
          <View className="mt-5 flex-row items-start rounded-[22px] bg-[#EAF4FF] p-4">
            <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-white">
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#1677F2"
              />
            </View>

            <View className="flex-1">
              <Text className="font-bold text-[#17335F]">Quick tip</Text>

              <Text className="mt-1 text-sm leading-5 text-[#66758D]">
                Choose the category that best matches your purchase so your
                statistics stay accurate.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
