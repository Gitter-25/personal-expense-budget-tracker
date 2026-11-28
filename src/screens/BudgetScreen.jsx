import BudgetBackground from "../components/BudgetBackground";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, Alert, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/BudgetScreen.styles";
import { formatCurrency } from "../utils/formatCurrency";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMonthlyBudget, saveMonthlyBudget } from "../storage/budgetStorage";

export default function BudgetScreen() {

  const navigation = useNavigation();
  const { user } = useAuth();
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

      const data = await getMonthlyBudget(user.id, currentMonth.slice(0, 7));

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

  const handleBudgetChange = (value) => {
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

      await saveMonthlyBudget(user.id, getCurrentMonth().slice(0, 7), amount);

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
      style={styles.layout}
      edges={["top", "left", "right"]}
    >
      <BudgetBackground />
      <KeyboardAvoidingView
        style={styles.hero3}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.hero3}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top brand row */}
          <View style={styles.topBrandRow}>
            <View style={styles.topBrandRow2}>
              <View style={styles.topBrandRow3}>
                <Ionicons name="wallet" size={25} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.topBrandRow4}>
                  PesoTrack
                </Text>
                <Text style={styles.topBrandRow5}>
                  Plan today. Build tomorrow.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.topBrandRow6}
              onPress={() => navigation.navigate("Settings")}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Open settings"
            >
              <Ionicons name="settings-outline" size={25} color="#1677F2" />
            </TouchableOpacity>
          </View>

          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.topBrandRow2}>
              <View style={styles.hero2}>
                <Ionicons name="cash-outline" size={38} color="#1677F2" />
              </View>
              <View style={styles.hero3}>
                <Text style={styles.hero4}>
                  Monthly
                </Text>
                <Text style={styles.hero5}>
                  Budget
                </Text>
              </View>
            </View>
            <Text style={styles.hero6}>
              Set how much you want to spend this month.
            </Text>
          </View>

          {/* Budget card */}
          <View style={styles.budgetCard}>
            <View style={styles.budgetCard2}>
              <View style={styles.topBrandRow2}>
                <View style={styles.budgetCard3}>
                  <Text style={styles.budgetCard4}>
                    ₱
                  </Text>
                </View>
                <View>
                  <Text style={styles.budgetCard5}>
                    Budget Amount
                  </Text>
                  <Text style={styles.budgetCard6}>
                    {currentMonthLabel}
                  </Text>
                </View>
              </View>
            </View>

            {loadingBudget ? (
              <View style={styles.budgetCard7}>
                <ActivityIndicator size="small" color="#1677F2" />
                <Text style={styles.budgetCard8}>
                  Loading budget...
                </Text>
              </View>
            ) : (
              <View style={styles.budgetCard9}>
                <Text style={styles.budgetCard10}>
                  ₱
                </Text>
                <View style={styles.budgetCard11} />
                <TextInput
                  style={styles.layout2}
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
            <Text style={styles.budgetCard12}>
              Enter 0 if you do not want to set a spending limit for this month.
            </Text>
            <TouchableOpacity
              style={[styles.budgetCard13, saving || loadingBudget ? styles.budgetCardState : styles.budgetCardState2]}
              onPress={handleSave}
              disabled={saving || loadingBudget}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Save monthly budget"
            >
              {saving ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.budgetCard14}>
                    Saving...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="save-outline" size={22} color="#FFFFFF" />
                  <Text style={styles.budgetCard15}>
                    Save Budget
                  </Text>
                  <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Tip */}
          <View style={styles.tip}>
            <View style={styles.tip2}>
              <Ionicons name="bulb-outline" size={20} color="#1677F2" />
            </View>
            <View style={styles.hero3}>
              <Text style={styles.tip3}>Budget tip</Text>
              <Text style={styles.tip4}>
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
