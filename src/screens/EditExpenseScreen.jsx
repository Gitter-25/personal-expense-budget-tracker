import ExpenseDescriptionField from "../components/ExpenseDescriptionField";
import ExpenseCategorySelector from "../components/ExpenseCategorySelector";
import ExpenseAmountField from "../components/ExpenseAmountField";
import EditExpenseBackground from "../components/EditExpenseBackground";
import { Ionicons } from "@expo/vector-icons";

import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "../styles/EditExpenseScreen.styles";
import useEditExpense from "../hooks/useEditExpense";

export default function EditExpenseScreen() {
  const { navigation, amount, description, setDescription, categoryId, setCategoryId, categories, loading, saving, hasChanges, handleAmountChange, handleSave } = useEditExpense();
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

          <ExpenseAmountField styles={styles} amount={amount} handleAmountChange={handleAmountChange} saving={saving} />
        <ExpenseCategorySelector styles={styles} editing categories={categories} categoryId={categoryId} setCategoryId={setCategoryId} saving={saving} />
        <ExpenseDescriptionField styles={styles} editing description={description} setDescription={setDescription} saving={saving} />
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

