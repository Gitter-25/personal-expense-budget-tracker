import AddExpenseBackground from "../components/AddExpenseBackground";
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
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { getExpenses, getExpenseById, addExpense, updateExpense, deleteExpense } from "../storage/expenseStorage";
import { getMonthlyBudget, saveMonthlyBudget } from "../storage/budgetStorage";
import { getCategoryOptions, toScreenExpense } from "../utils/finance";

export default function AddExpenseScreen() {
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

  return (
    <SafeAreaView
      style={styles.layout}
      edges={["top", "left", "right"]}
    >
      <AddExpenseBackground />
      <KeyboardAvoidingView
        style={styles.tip3}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.tip3}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.header2}>
              <Ionicons name="add" size={28} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.header3}>
                Add Expense
              </Text>
              <Text style={styles.header4}>
                Record your spending
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
                placeholder="0.00"
                placeholderTextColor="#A0AEC0"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={handleAmountChange}
                editable={!saving}
                maxLength={12}
                accessibilityLabel="Expense amount"
              />
            </View>
          </View>

          {/* Category */}
          <View style={styles.category}>
            <View style={styles.category2}>
              <View style={styles.category3}>
                <Ionicons name="grid-outline" size={20} color="#1677F2" />
              </View>
              <Text style={styles.category4}>
                Category
              </Text>
            </View>

            {loadingCategories ? (
              <View style={styles.category5}>
                <ActivityIndicator size="small" color="#1677F2" />
                <Text style={styles.category6}>
                  Loading categories...
                </Text>
              </View>
            ) : categories.length === 0 ? (
              <View style={styles.category7}>
                <View style={styles.category8}>
                  <Ionicons
                    name="folder-open-outline"
                    size={24}
                    color="#1677F2"
                  />
                </View>
                <Text style={styles.category9}>
                  No categories available
                </Text>
                <Text style={styles.category10}>
                  Try loading your categories again.
                </Text>
                <TouchableOpacity
                  style={styles.category11}
                  onPress={loadCategories}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Retry loading categories"
                >
                  <Ionicons name="refresh" size={18} color="#1677F2" />
                  <Text style={styles.category12}>
                    Retry
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.category13}>
                {categories.map((item) => {
                  const selected = categoryId === item.id;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.category14, selected
                          ? styles.categoryState
                          : styles.categoryState2]}
                      onPress={() => setCategoryId(item.id)}
                      disabled={saving}
                      activeOpacity={0.85}
                      accessibilityRole="button"
                      accessibilityLabel={`${item.name} category`}
                      accessibilityState={{
                        selected,
                        disabled: saving,
                      }}
                    >
                      <View
                        style={[styles.category15, selected ? styles.categoryState3 : styles.categoryState4]}
                      >
                        <Text style={styles.category16}>{item.icon ?? "📁"}</Text>
                      </View>
                      <Text
                        numberOfLines={1}
                        style={[styles.category17, selected ? styles.categoryState5 : styles.categoryState6]}
                      >
                        {item.name}
                      </Text>

                      {selected && (
                        <View style={styles.category18}>
                          <Ionicons
                            name="checkmark-circle"
                            size={15}
                            color="#FFFFFF"
                          />
                          <Text style={styles.category19}>
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
            <View style={styles.category2}>
              <View style={styles.category3}>
                <Ionicons name="create-outline" size={20} color="#1677F2" />
              </View>
              <Text style={styles.category4}>
                Description
              </Text>
              <Text style={styles.description2}>Optional</Text>
            </View>
            <View style={styles.description3}>
              <TextInput
                style={styles.layout3}
                placeholder="What did you spend on?"
                placeholderTextColor="#A0AEC0"
                multiline
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
                editable={!saving}
                maxLength={150}
                accessibilityLabel="Expense description"
              />
              <Text style={styles.description4}>
                {description.length}/150
              </Text>
            </View>
          </View>

          {/* Save */}
          <TouchableOpacity
            style={[styles.save, saving || loadingCategories ? styles.saveState : styles.saveState2]}
            onPress={handleSaveExpense}
            disabled={saving || loadingCategories}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Save expense"
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
                <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
                <Text style={styles.save3}>
                  Save Expense
                </Text>
                <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Tip */}
          <View style={styles.tip}>
            <View style={styles.tip2}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#1677F2"
              />
            </View>
            <View style={styles.tip3}>
              <Text style={styles.tip4}>Quick tip</Text>
              <Text style={styles.tip5}>
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

// UI styles: edit these values during visual debugging.
const styles = StyleSheet.create({
  header: {marginBottom: 24, flexDirection: "row", alignItems: "center"},
  header2: {marginRight: 12, height: 48, width: 48, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: "#1677F2"},
  header3: {fontSize: 25, fontWeight: "800", color: "#071B46"},
  header4: {marginTop: 2, fontSize: 14, lineHeight: 20, color: "#66758D"},
  amount: {borderRadius: 26, borderWidth: 1, borderColor: "#E3EDF8", backgroundColor: "#FFFFFF", padding: 16},
  amount2: {marginBottom: 16, flexDirection: "row", alignItems: "center"},
  amount3: {marginRight: 12, height: 36, width: 36, alignItems: "center", justifyContent: "center", borderRadius: 9999, backgroundColor: "#EAF3FF"},
  amount4: {fontSize: 24, fontWeight: "800", color: "#17335F"},
  amount5: {fontSize: 18, fontWeight: "800", color: "#071B46"},
  amount6: {flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: "#D7E5F4", backgroundColor: "#F8FBFF", paddingHorizontal: 16},
  amount7: {marginRight: 12, fontSize: 26, fontWeight: "700", color: "#586A84"},
  amount8: {marginRight: 12, height: 32, width: 1, backgroundColor: "#DCE8F5"},
  category: {marginTop: 24},
  category2: {marginBottom: 12, flexDirection: "row", alignItems: "center"},
  category3: {marginRight: 12, height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 9999, backgroundColor: "#EEF5FF"},
  category4: {fontSize: 20, fontWeight: "800", color: "#071B46"},
  category5: {alignItems: "center", borderRadius: 24, borderWidth: 1, borderColor: "#E3EDF8", backgroundColor: "#FFFFFF", paddingVertical: 32},
  category6: {marginTop: 12, fontSize: 14, lineHeight: 20, color: "#718096"},
  category7: {alignItems: "center", borderRadius: 24, borderWidth: 1, borderColor: "#E3EDF8", backgroundColor: "#FFFFFF", paddingHorizontal: 20, paddingVertical: 28},
  category8: {height: 48, width: 48, alignItems: "center", justifyContent: "center", borderRadius: 9999, backgroundColor: "#EAF3FF"},
  category9: {marginTop: 12, fontWeight: "700", color: "#17335F"},
  category10: {marginTop: 4, textAlign: "center", fontSize: 14, lineHeight: 20, color: "#718096"},
  category11: {marginTop: 16, flexDirection: "row", alignItems: "center", borderRadius: 12, backgroundColor: "#EAF4FF", paddingHorizontal: 16, paddingVertical: 10},
  category12: {marginLeft: 8, fontSize: 14, lineHeight: 20, fontWeight: "700", color: "#1677F2"},
  category13: {flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between"},
  categoryState: {borderColor: "#1677F2", backgroundColor: "#1677F2"},
  categoryState2: {borderColor: "#E3EDF8", backgroundColor: "#FFFFFF"},
  category14: {marginBottom: 12, width: "48%", borderRadius: 22, borderWidth: 1, padding: 10},
  categoryState3: {backgroundColor: "rgba(255, 255, 255, 0.15)"},
  categoryState4: {backgroundColor: "#F5F9FF"},
  category15: {height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 9999},
  category16: {fontSize: 20, lineHeight: 28},
  categoryState5: {color: "#FFFFFF"},
  categoryState6: {color: "#071B46"},
  category17: {marginTop: 6, fontSize: 16, lineHeight: 24, fontWeight: "800"},
  category18: {marginTop: 4, flexDirection: "row", alignItems: "center"},
  category19: {marginLeft: 4, fontSize: 12, lineHeight: 16, fontWeight: "500", color: "rgba(255, 255, 255, 0.9)"},
  description: {marginTop: 16},
  description2: {marginLeft: 8, fontSize: 12, lineHeight: 16, color: "#94A3B8"},
  description3: {borderRadius: 24, borderWidth: 1, borderColor: "#E3EDF8", backgroundColor: "#FFFFFF", padding: 16},
  description4: {marginTop: 8, textAlign: "right", fontSize: 12, lineHeight: 16, color: "#94A3B8"},
  saveState: {backgroundColor: "#7CB3F8"},
  saveState2: {backgroundColor: "#1677F2"},
  save: {marginTop: 28, minHeight: 56, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 16},
  save2: {marginLeft: 12, fontSize: 16, lineHeight: 24, fontWeight: "800", color: "#FFFFFF"},
  save3: {marginHorizontal: 12, fontSize: 16, lineHeight: 24, fontWeight: "800", color: "#FFFFFF"},
  tip: {marginTop: 20, flexDirection: "row", alignItems: "flex-start", borderRadius: 22, backgroundColor: "#EAF4FF", padding: 16},
  tip2: {marginRight: 12, height: 36, width: 36, alignItems: "center", justifyContent: "center", borderRadius: 9999, backgroundColor: "#FFFFFF"},
  tip3: {flex: 1},
  tip4: {fontWeight: "700", color: "#17335F"},
  tip5: {marginTop: 4, fontSize: 14, lineHeight: 20, color: "#66758D"},
  layout: {flex: 1, backgroundColor: "#F4F9FF"},
  scrollContent: {paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40},
  layout2: {flex: 1, minHeight: 54, color: "#071B46", fontSize: 16, lineHeight: 22},
  layout3: {minHeight: 40, color: "#071B46", fontSize: 16, lineHeight: 22},
});
