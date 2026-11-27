
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { Alert, Keyboard } from "react-native";

import { useAuth } from "../context/AuthContext";
import { getExpenseById, updateExpense } from "../storage/expenseStorage";

import { getCategoryOptions, toScreenExpense } from "../utils/finance";

export default function useEditExpense() {
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

  return { navigation, amount, description, setDescription, categoryId, setCategoryId, categories, loading, saving, hasChanges, handleAmountChange, handleSave };
}
