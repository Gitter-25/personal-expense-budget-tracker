import ExpenseDescriptionField from "../components/ExpenseDescriptionField";
import ExpenseCategorySelector from "../components/ExpenseCategorySelector";
import ExpenseAmountField from "../components/ExpenseAmountField";
import Background from "../components/Background";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View, Alert, Keyboard, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addExpense } from "../storage/expenseStorage";
import { getCategoryOptions } from "../utils/finance";

export default function AddExpenseScreen() {
  // Screen state and navigation.
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoadingCategories(true);

      setCategories(await getCategoryOptions(user.id));
    } catch (error) {
      console.error("Unexpected error loading categories:", error);

      Alert.alert(
        "Unable to load categories",
        "An unexpected error occurred while loading your categories.",
      );
    } finally {
      setLoadingCategories(false);
    }
  }

  function getLocalDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function handleAmountChange(value) {
    // Allow numbers with a maximum of two decimal places.
    const cleanedValue = value.replace(",", ".");

    if (/^\d*\.?\d{0,2}$/.test(cleanedValue)) {
      setAmount(cleanedValue);
    }
  }

  async function handleSaveExpense() {
    if (saving) return;

    Keyboard.dismiss();

    const trimmedAmount = amount.trim();

    if (!trimmedAmount) {
      Alert.alert("Missing amount", "Please enter the expense amount.");
      return;
    }

    const numericAmount = Number(trimmedAmount);

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

      await addExpense(user.id, { amount: numericAmount, category: categoryId, description: description.trim(), date: getLocalDate() });

      setAmount("");
      setDescription("");
      setCategoryId("");

      Alert.alert(
        "Expense saved",
        "Your expense has been recorded successfully.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      Alert.alert("Unable to save expense", message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <SafeAreaView
      style={styles.layout}
      edges={["top", "left", "right"]}
    >
      <Background screen="AddExpense" />
      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flexContainer}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="add" size={28} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.headerTitle}>
                Add Expense
              </Text>
              <Text style={styles.headerSubtitle}>
                Record your spending
              </Text>
            </View>
          </View>

          <ExpenseAmountField amount={amount} handleAmountChange={handleAmountChange} saving={saving} />
        <ExpenseCategorySelector loadCategories={loadCategories} categories={categories} categoryId={categoryId} setCategoryId={setCategoryId} saving={saving} loadingCategories={loadingCategories} />
        <ExpenseDescriptionField description={description} setDescription={setDescription} saving={saving} />
        {/* Save */}
          <TouchableOpacity
            style={[styles.saveButton, saving || loadingCategories ? styles.disabledButton : styles.enabledButton]}
            onPress={handleSaveExpense}
            disabled={saving || loadingCategories}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Save expense"
          >
            {saving ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.savingText}>
                  Saving...
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>
                  Save Expense
                </Text>
                <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Tip */}
          <View style={styles.tip}>
            <View style={styles.tipIcon}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#1677F2"
              />
            </View>
            <View style={styles.flexContainer}>
              <Text style={styles.tipTitle}>Quick tip</Text>
              <Text style={styles.tipText}>
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

// Styles for this screen.
const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center"
  },

  headerIcon: {
    marginRight: 12,
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#1677F2"
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#071B46"
  },

  headerSubtitle: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    color: "#66758D"
  },

  disabledButton: {
    backgroundColor: "#7CB3F8"
  },

  enabledButton: {
    backgroundColor: "#1677F2"
  },

  saveButton: {
    marginTop: 28,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16
  },

  savingText: {
    marginLeft: 12,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "800",
    color: "#FFFFFF"
  },

  saveButtonText: {
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

  tipIcon: {
    marginRight: 12,
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#FFFFFF"
  },

  flexContainer: {
    flex: 1
  },

  tipTitle: {
    fontWeight: "700",
    color: "#17335F"
  },

  tipText: {
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40
  },

});
