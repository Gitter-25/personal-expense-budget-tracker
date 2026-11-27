import AddExpenseDescriptionField from "../components/AddExpenseDescriptionField";
import AddExpenseCategorySelector from "../components/AddExpenseCategorySelector";
import AddExpenseAmountField from "../components/AddExpenseAmountField";

import AddExpenseBackground from "../components/AddExpenseBackground";
import { Ionicons } from "@expo/vector-icons";

import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "../styles/AddExpenseScreen.styles";
import useAddExpense from "../hooks/useAddExpense";

export default function AddExpenseScreen() {
  const { amount, description, setDescription, categoryId, setCategoryId, categories, loadingCategories, saving, handleAmountChange, handleSaveExpense, navigation } = useAddExpense();
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

          <AddExpenseAmountField amount={amount} handleAmountChange={handleAmountChange} saving={saving} />
        <AddExpenseCategorySelector categories={categories} categoryId={categoryId} setCategoryId={setCategoryId} saving={saving} loadingCategories={loadingCategories} />
        <AddExpenseDescriptionField description={description} setDescription={setDescription} saving={saving} />
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

