import BudgetBackground from "../components/BudgetBackground";

import { Ionicons } from "@expo/vector-icons";

import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "../styles/BudgetScreen.styles";
import useBudget from "../hooks/useBudget";

export default function BudgetScreen() {
  const { navigation, budget, saving, loadingBudget, currentMonthLabel, handleBudgetChange, handleSave } = useBudget();
  return (
    <SafeAreaView
      style={styles.layout}
      edges={["top", "left", "right"]}
    >
      <BudgetBackground />
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

