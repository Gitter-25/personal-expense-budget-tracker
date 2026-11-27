import { useNavigation } from "@react-navigation/native";

import { useEffect, useState } from "react";
import { Alert, Keyboard } from "react-native";

import { useAuth } from "../context/AuthContext";
import { addExpense } from "../storage/expenseStorage";

import { getCategoryOptions } from "../utils/finance";

export default function useAddExpense() {
  const navigation = useNavigation();
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

  const loadCategories = async () => {
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
  };

  const getLocalDate = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleAmountChange = (value) => {
    // Allow numbers with a maximum of two decimal places.
    const cleanedValue = value.replace(",", ".");

    if (/^\d*\.?\d{0,2}$/.test(cleanedValue)) {
      setAmount(cleanedValue);
    }
  };

  const handleSaveExpense = async () => {
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
  };

  return { amount, description, setDescription, categoryId, setCategoryId, categories, loadingCategories, saving, handleAmountChange, handleSaveExpense, navigation };
}
