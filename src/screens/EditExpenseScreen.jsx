import EditExpenseBackground from "../components/EditExpenseBackground";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
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
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { getExpenses, getExpenseById, addExpense, updateExpense, deleteExpense } from "../storage/expenseStorage";
import { getMonthlyBudget, saveMonthlyBudget } from "../storage/budgetStorage";
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

          {/* Amount */}
          <View style={styles.amount}>
            <View style={styles.amount2}>
              <View style={styles.amount3}>
                <Text style={styles.amount4}>
                  ₱
                </Text>
              </View>
              <Text style={styles.amount5}>
                Expense Amount
              </Text>
            </View>
            <View style={styles.amount6}>
              <Text style={styles.amount7}>
                ₱
              </Text>
              <View style={styles.amount8} />
              <TextInput
                style={styles.layout2}
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
          <View style={styles.category}>
            <View style={styles.amount2}>
              <View style={styles.category2}>
                <Ionicons name="grid-outline" size={20} color="#1677F2" />
              </View>
              <Text style={styles.category3}>
                Category
              </Text>
            </View>

            {categories.length === 0 ? (
              <View style={styles.category4}>
                <Ionicons
                  name="folder-open-outline"
                  size={30}
                  color="#A0AEC0"
                />
                <Text style={styles.screen2}>
                  No categories available.
                </Text>
              </View>
            ) : (
              <View style={styles.category5}>
                {categories.map((category) => {
                  const selected = categoryId === category.id;

                  return (
                    <TouchableOpacity
                      key={category.id}
                      style={[styles.category6, selected
                          ? styles.categoryState
                          : styles.categoryState2]}
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
                        style={[styles.category7, selected ? styles.categoryState3 : styles.categoryState4]}
                      >
                        <Text style={styles.category8}>{category.icon ?? "📁"}</Text>
                      </View>
                      <Text
                        numberOfLines={1}
                        style={[styles.category9, selected ? styles.categoryState5 : styles.categoryState6]}
                      >
                        {category.name}
                      </Text>

                      {selected && (
                        <View style={styles.category10}>
                          <Ionicons
                            name="checkmark-circle"
                            size={14}
                            color="#FFFFFF"
                          />
                          <Text style={styles.category11}>
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
          <View style={styles.description}>
            <View style={styles.amount2}>
              <View style={styles.category2}>
                <Ionicons name="create-outline" size={20} color="#1677F2" />
              </View>
              <Text style={styles.category3}>
                Description
              </Text>
              <Text style={styles.description2}>Optional</Text>
            </View>
            <View style={styles.amount}>
              <TextInput
                style={styles.layout3}
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
              <Text style={styles.description3}>
                {description.length}/150
              </Text>
            </View>
          </View>

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

// UI styles: edit these values during visual debugging.
const styles = StyleSheet.create({
  screen: {flex: 1, alignItems: "center", justifyContent: "center"},
  screen2: {marginTop: 12, fontSize: 14, lineHeight: 20, color: "#718096"},
  header: {marginBottom: 24, flexDirection: "row", alignItems: "center"},
  header2: {marginRight: 12, height: 48, width: 48, alignItems: "center", justifyContent: "center", borderRadius: 16, borderWidth: 1, borderColor: "#E3EDF8", backgroundColor: "#FFFFFF"},
  header3: {flex: 1},
  header4: {fontSize: 25, fontWeight: "800", color: "#071B46"},
  header5: {marginTop: 2, fontSize: 14, lineHeight: 20, color: "#66758D"},
  amount: {borderRadius: 22, borderWidth: 1, borderColor: "#E3EDF8", backgroundColor: "#FFFFFF", padding: 16},
  amount2: {marginBottom: 12, flexDirection: "row", alignItems: "center"},
  amount3: {marginRight: 12, height: 36, width: 36, alignItems: "center", justifyContent: "center", borderRadius: 9999, backgroundColor: "#EAF3FF"},
  amount4: {fontSize: 21, fontWeight: "800", color: "#17335F"},
  amount5: {fontSize: 18, fontWeight: "800", color: "#071B46"},
  amount6: {flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: "#D7E5F4", backgroundColor: "#F8FBFF", paddingHorizontal: 16},
  amount7: {marginRight: 12, fontSize: 24, fontWeight: "700", color: "#586A84"},
  amount8: {marginRight: 12, height: 28, width: 1, backgroundColor: "#DCE8F5"},
  category: {marginTop: 20},
  category2: {marginRight: 12, height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 9999, backgroundColor: "#EEF5FF"},
  category3: {fontSize: 20, fontWeight: "800", color: "#071B46"},
  category4: {alignItems: "center", borderRadius: 22, borderWidth: 1, borderColor: "#E3EDF8", backgroundColor: "#FFFFFF", paddingHorizontal: 20, paddingVertical: 28},
  category5: {flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between"},
  categoryState: {borderColor: "#1677F2", backgroundColor: "#1677F2"},
  categoryState2: {borderColor: "#E3EDF8", backgroundColor: "#FFFFFF"},
  category6: {marginBottom: 8, width: "48%", borderRadius: 18, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10},
  categoryState3: {backgroundColor: "rgba(255, 255, 255, 0.15)"},
  categoryState4: {backgroundColor: "#F5F9FF"},
  category7: {height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 9999},
  category8: {fontSize: 20, lineHeight: 28},
  categoryState5: {color: "#FFFFFF"},
  categoryState6: {color: "#071B46"},
  category9: {marginTop: 6, fontSize: 14, lineHeight: 20, fontWeight: "800"},
  category10: {marginTop: 4, flexDirection: "row", alignItems: "center"},
  category11: {marginLeft: 4, fontSize: 12, lineHeight: 16, fontWeight: "500", color: "rgba(255, 255, 255, 0.9)"},
  description: {marginTop: 16},
  description2: {marginLeft: 8, fontSize: 12, lineHeight: 16, color: "#94A3B8"},
  description3: {marginTop: 8, textAlign: "right", fontSize: 12, lineHeight: 16, color: "#94A3B8"},
  saveState: {backgroundColor: "#7CB3F8"},
  saveState2: {backgroundColor: "#1677F2"},
  saveState3: {backgroundColor: "#B7D3F7"},
  save: {marginTop: 20, minHeight: 56, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 16},
  save2: {marginLeft: 12, fontSize: 16, lineHeight: 24, fontWeight: "800", color: "#FFFFFF"},
  save3: {marginHorizontal: 12, fontSize: 16, lineHeight: 24, fontWeight: "800", color: "#FFFFFF"},
  layout: {flex: 1, backgroundColor: "#F4F9FF"},
  scrollContent: {paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32},
  layout2: {flex: 1, minHeight: 54, color: "#071B46", fontSize: 22, fontWeight: "700"},
  layout3: {minHeight: 72, color: "#071B46", fontSize: 16, lineHeight: 23},
});
