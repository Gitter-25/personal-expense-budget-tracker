import ExpenseDescriptionField from "../components/ExpenseDescriptionField";
import ExpenseCategorySelector from "../components/ExpenseCategorySelector";
import ExpenseAmountField from "../components/ExpenseAmountField";
import EditExpenseBackground from "../components/EditExpenseBackground";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View, Alert, Keyboard, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getExpenseById, updateExpense } from "../storage/expenseStorage";
import { getCategoryOptions, toScreenExpense } from "../utils/finance";

export default function EditExpenseScreen() {

  const navigation = useNavigation();
  const { user } = useAuth();
  const { id } = useRoute().params ?? {};

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [originalExpense, setOriginalExpense] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadExpense = async () => {
      if (!id) {
        Alert.alert("Missing expense", "Expense ID is missing.", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);

        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [record, categoryData] = await Promise.all([getExpenseById(user.id, id), getCategoryOptions(user.id)]);
        const expense = record ? toScreenExpense(record) : null;

        if (!expense) {
          Alert.alert("Expense not found", "This expense no longer exists.", [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
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

  const handleAmountChange = (value) => {
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

      await updateExpense(user.id, id, { amount: numericAmount, description: description.trim(), category: categoryId });

      Alert.alert(
        "Expense updated",
        "Your expense has been updated successfully.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
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
        style={styles.layout}
        edges={["top", "left", "right", "bottom"]}
      >
        <View style={styles.screen}>
          <ActivityIndicator size="small" color="#1677F2" />
          <Text style={styles.screen2}>
            Loading expense...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.layout}
      edges={["top", "left", "right", "bottom"]}
    >
      <EditExpenseBackground />
      <KeyboardAvoidingView
        style={styles.header3}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.header3}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.header2}
              onPress={() => navigation.goBack()}
              disabled={saving}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={24} color="#1677F2" />
            </TouchableOpacity>
            <View style={styles.header3}>
              <Text style={styles.header4}>
                Edit Expense
              </Text>
              <Text style={styles.header5}>
                Update your expense details
              </Text>
            </View>
          </View>

          <ExpenseAmountField editing amount={amount} handleAmountChange={handleAmountChange} saving={saving} />
        <ExpenseCategorySelector editing categories={categories} categoryId={categoryId} setCategoryId={setCategoryId} saving={saving} />
        <ExpenseDescriptionField editing description={description} setDescription={setDescription} saving={saving} />
        {/* Save */}
          <TouchableOpacity
            disabled={saving || !hasChanges}
            onPress={handleSave}
            style={[styles.save, saving
                ? styles.saveState
                : hasChanges
                  ? styles.saveState2
                  : styles.saveState3]}
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
                <Text style={styles.save2}>
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
                <Text style={styles.save3}>
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

// Styles for this screen.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  screen2: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: "#718096"
  },

  header: {
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center"
  },

  header2: {
    marginRight: 12,
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF"
  },

  header3: {
    flex: 1
  },

  header4: {
    fontSize: 25,
    fontWeight: "800",
    color: "#071B46"
  },

  header5: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    color: "#66758D"
  },

  saveState: {
    backgroundColor: "#7CB3F8"
  },

  saveState2: {
    backgroundColor: "#1677F2"
  },

  saveState3: {
    backgroundColor: "#B7D3F7"
  },

  save: {
    marginTop: 20,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16
  },

  save2: {
    marginLeft: 12,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "800",
    color: "#FFFFFF"
  },

  save3: {
    marginHorizontal: 12,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "800",
    color: "#FFFFFF"
  },

  layout: {
    flex: 1,
    backgroundColor: "#F4F9FF"
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32
  },

});
