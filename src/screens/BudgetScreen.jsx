import Background from "../components/Background";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, Alert, Keyboard, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
      <Background screen="Budget" />
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

// Styles for this UI.
const styles = StyleSheet.create({
  topBrandRow: {
    marginBottom: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  topBrandRow2: {
    flexDirection: "row",
    alignItems: "center"
  },

  topBrandRow3: {
    marginRight: 12,
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#1677F2"
  },

  topBrandRow4: {
    fontSize: 24,
    fontWeight: "800",
    color: "#071B46"
  },

  topBrandRow5: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    color: "#66758D"
  },

  topBrandRow6: {
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF"
  },

  hero: {
    marginBottom: 28
  },

  hero2: {
    marginRight: 16,
    height: 74,
    width: 74,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "#EAF3FF"
  },

  hero3: {
    flex: 1
  },

  hero4: {
    fontSize: 38,
    fontWeight: "800",
    lineHeight: 42,
    color: "#071B46"
  },

  hero5: {
    fontSize: 38,
    fontWeight: "800",
    lineHeight: 42,
    color: "#1677F2"
  },

  hero6: {
    marginTop: 20,
    maxWidth: 310,
    fontSize: 17,
    lineHeight: 28,
    color: "#586A84"
  },

  budgetCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#E0EBF6",
    backgroundColor: "#FFFFFF",
    padding: 24
  },

  budgetCard2: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  budgetCard3: {
    marginRight: 12,
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#DDEEFF"
  },

  budgetCard4: {
    fontSize: 27,
    fontWeight: "800",
    color: "#12305D"
  },

  budgetCard5: {
    fontSize: 22,
    fontWeight: "800",
    color: "#071B46"
  },

  budgetCard6: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: "#718096"
  },

  budgetCard7: {
    minHeight: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D7E5F4",
    backgroundColor: "#F8FBFF"
  },

  budgetCard8: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 16,
    color: "#718096"
  },

  budgetCard9: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D7E5F4",
    backgroundColor: "#F8FBFF",
    paddingHorizontal: 16
  },

  budgetCard10: {
    marginRight: 12,
    fontSize: 25,
    fontWeight: "700",
    color: "#56667D"
  },

  budgetCard11: {
    marginRight: 12,
    height: 32,
    width: 1,
    backgroundColor: "#DCE8F5"
  },

  budgetCard12: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 20,
    color: "#8794A8"
  },

  budgetCardState: {
    backgroundColor: "#7CB3F8"
  },

  budgetCardState2: {
    backgroundColor: "#1677F2"
  },

  budgetCard13: {
    marginTop: 20,
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16
  },

  budgetCard14: {
    marginLeft: 12,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "800",
    color: "#FFFFFF"
  },

  budgetCard15: {
    marginHorizontal: 12,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "800",
    color: "#FFFFFF"
  },

  tip: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 22,
    backgroundColor: "#EAF4FF",
    padding: 16
  },

  tip2: {
    marginRight: 12,
    marginTop: 2,
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#FFFFFF"
  },

  tip3: {
    fontWeight: "700",
    color: "#17335F"
  },

  tip4: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: "#66758D"
  },

  layout: {
    flex: 1,
    backgroundColor: "#F4F9FF"
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40
  },

  layout2: {
    flex: 1,
    minHeight: 68,
    color: "#071B46",
    fontSize: 23,
    fontWeight: "600"
  },

});
