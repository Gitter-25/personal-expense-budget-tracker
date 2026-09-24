import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
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

const formatCurrency = (value: number) => {
  return `₱${value.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function BudgetScreen() {
  const [budget, setBudget] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingBudget, setLoadingBudget] = useState(true);

  const currentMonthLabel = useMemo(() => {
    return new Date().toLocaleDateString("en-PH", {
      month: "long",
      year: "numeric",
    });
  }, []);

  const getCurrentMonth = () => {
    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0",
    )}-01`;
  };

  const loadBudget = useCallback(async () => {
    try {
      setLoadingBudget(true);

      const now = new Date();

      const currentMonth = `${now.getFullYear()}-${String(
        now.getMonth() + 1,
      ).padStart(2, "0")}-01`;

      const { data, error } = await supabase
        .from("budgets")
        .select("amount")
        .eq("month", currentMonth)
        .maybeSingle();

      if (error) {
        Alert.alert("Unable to load budget", error.message);
        return;
      }

      setBudget(
        data?.amount !== undefined && data?.amount !== null
          ? String(data.amount)
          : "",
      );
    } catch (error) {
      console.error("Unexpected error loading budget:", error);

      Alert.alert(
        "Unable to load budget",
        "An unexpected error occurred while loading your budget.",
      );
    } finally {
      setLoadingBudget(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBudget();
    }, [loadBudget]),
  );

  const handleBudgetChange = (value: string) => {
    const cleanedValue = value.replace(",", ".");

    if (/^\d*\.?\d{0,2}$/.test(cleanedValue)) {
      setBudget(cleanedValue);
    }
  };

  const handleSave = async () => {
    if (saving) return;

    Keyboard.dismiss();

    const trimmedBudget = budget.trim();

    if (!trimmedBudget) {
      Alert.alert("Missing budget", "Please enter your monthly budget amount.");
      return;
    }

    const amount = Number(trimmedBudget);

    if (!Number.isFinite(amount) || amount < 0) {
      Alert.alert("Invalid budget", "Please enter a valid budget amount.");
      return;
    }

    if (amount > 999999999.99) {
      Alert.alert("Budget too large", "Please enter a smaller budget amount.");
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

      const currentMonth = getCurrentMonth();

      const { error } = await supabase.from("budgets").upsert(
        {
          user_id: user.id,
          month: currentMonth,
          amount,
        },
        {
          onConflict: "user_id,month",
        },
      );

      if (error) {
        Alert.alert("Unable to save budget", error.message);
        return;
      }

      setBudget(String(amount));

      Alert.alert(
        "Budget saved",
        amount === 0
          ? `Your budget for ${currentMonthLabel} has been set to ₱0.00.`
          : `Your budget for ${currentMonthLabel} is now ${formatCurrency(
              amount,
            )}.`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      Alert.alert("Unable to save budget", message);
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
      {/* Background decorations */}
      <View
        pointerEvents="none"
        className="absolute -left-28 -top-24 h-72 w-72 rounded-full bg-[#D8EAFE]"
      />

      <View
        pointerEvents="none"
        className="absolute -right-40 top-44 h-80 w-80 rounded-full bg-[#E4F0FF]"
      />

      <View
        pointerEvents="none"
        className="absolute -bottom-44 -left-28 h-80 w-80 rounded-full bg-[#D9EAFF]"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top brand row */}
          <View className="mb-7 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="mr-3 h-12 w-12 items-center justify-center rounded-2xl bg-[#1677F2]">
                <Ionicons name="wallet" size={25} color="#FFFFFF" />
              </View>

              <View>
                <Text className="text-[24px] font-extrabold text-[#071B46]">
                  PesoTrack
                </Text>

                <Text className="mt-0.5 text-sm text-[#66758D]">
                  Plan today. Build tomorrow.
                </Text>
              </View>
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

          {/* Hero */}
          <View className="mb-7">
            <View className="flex-row items-center">
              <View className="mr-4 h-[74px] w-[74px] items-center justify-center rounded-[24px] bg-[#EAF3FF]">
                <Ionicons name="cash-outline" size={38} color="#1677F2" />
              </View>

              <View className="flex-1">
                <Text className="text-[38px] font-extrabold leading-[42px] text-[#071B46]">
                  Monthly
                </Text>

                <Text className="text-[38px] font-extrabold leading-[42px] text-[#1677F2]">
                  Budget
                </Text>
              </View>
            </View>

            <Text className="mt-5 max-w-[310px] text-[17px] leading-7 text-[#586A84]">
              Set how much you want to spend this month.
            </Text>
          </View>

          {/* Budget card */}
          <View className="rounded-[28px] border border-[#E0EBF6] bg-white p-6">
            <View className="mb-5 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-[#DDEEFF]">
                  <Text className="text-[27px] font-extrabold text-[#12305D]">
                    ₱
                  </Text>
                </View>

                <View>
                  <Text className="text-[22px] font-extrabold text-[#071B46]">
                    Budget Amount
                  </Text>

                  <Text className="mt-0.5 text-xs text-[#718096]">
                    {currentMonthLabel}
                  </Text>
                </View>
              </View>
            </View>

            {loadingBudget ? (
              <View className="min-h-[72px] items-center justify-center rounded-2xl border border-[#D7E5F4] bg-[#F8FBFF]">
                <ActivityIndicator size="small" color="#1677F2" />

                <Text className="mt-2 text-xs text-[#718096]">
                  Loading budget...
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center rounded-2xl border border-[#D7E5F4] bg-[#F8FBFF] px-4">
                <Text className="mr-3 text-[25px] font-bold text-[#56667D]">
                  ₱
                </Text>

                <View className="mr-3 h-8 w-px bg-[#DCE8F5]" />

                <TextInput
                  style={{
                    flex: 1,
                    minHeight: 68,
                    color: "#071B46",
                    fontSize: 23,
                    fontWeight: "600",
                  }}
                  value={budget}
                  onChangeText={handleBudgetChange}
                  keyboardType="decimal-pad"
                  placeholder="10000.00"
                  placeholderTextColor="#A0AEC0"
                  editable={!saving}
                  returnKeyType="done"
                  onSubmitEditing={handleSave}
                  maxLength={12}
                  accessibilityLabel="Monthly budget amount"
                />
              </View>
            )}

            <Text className="mt-3 text-xs leading-5 text-[#8794A8]">
              Enter 0 if you do not want to set a spending limit for this month.
            </Text>

            <TouchableOpacity
              className={`mt-5 min-h-[58px] flex-row items-center justify-center rounded-2xl ${
                saving || loadingBudget ? "bg-[#7CB3F8]" : "bg-[#1677F2]"
              }`}
              onPress={handleSave}
              disabled={saving || loadingBudget}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Save monthly budget"
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
                  <Ionicons name="save-outline" size={22} color="#FFFFFF" />

                  <Text className="mx-3 text-base font-extrabold text-white">
                    Save Budget
                  </Text>

                  <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Tip */}
          <View className="mt-5 flex-row items-start rounded-[22px] bg-[#EAF4FF] p-4">
            <View className="mr-3 mt-0.5 h-9 w-9 items-center justify-center rounded-full bg-white">
              <Ionicons name="bulb-outline" size={20} color="#1677F2" />
            </View>

            <View className="flex-1">
              <Text className="font-bold text-[#17335F]">Budget tip</Text>

              <Text className="mt-1 text-sm leading-5 text-[#66758D]">
                Choose an amount that covers your regular expenses while leaving
                room for savings and unexpected costs.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
