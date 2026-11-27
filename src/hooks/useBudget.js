import { formatCurrency } from "../utils/formatCurrency";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { Alert, Keyboard } from "react-native";

import { useAuth } from "../context/AuthContext";

import { getMonthlyBudget, saveMonthlyBudget } from "../storage/budgetStorage";

export default function useBudget() {
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

  return { navigation, budget, saving, loadingBudget, currentMonthLabel, handleBudgetChange, handleSave };
}
