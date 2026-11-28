import { ActivityIndicator, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "../utils/formatCurrency";

export default function StatisticsBudgetCard({ monthlyBudget, isOverBudget, remainingBudget, budgetBarPercentage, actualBudgetPercentage, navigation }) {
  return <>
    <View style={styles.budget}>
              <View style={styles.topBar2}>
                <View style={styles.budget2}>
                  <Ionicons name="wallet" size={25} color="#1677F2" />
                </View>
                <Text style={styles.budget3}>
                  Monthly Budget
                </Text>
              </View>
              <View style={styles.budget4}>
                <View style={styles.budget5}>
                  <Text style={styles.budget6}>Budget</Text>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={styles.budget7}
                  >
                    {formatCurrency(monthlyBudget)}
                  </Text>
                </View>
                <View style={styles.budget8}>
                  <Text style={styles.budget6}>
                    {isOverBudget ? "Over Budget" : "Remaining"}
                  </Text>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={[styles.budget9, isOverBudget ? styles.budgetState : styles.budgetState2]}
                  >
                    {isOverBudget
                      ? formatCurrency(Math.abs(remainingBudget))
                      : formatCurrency(remainingBudget)}
                  </Text>
                </View>
              </View>

              {monthlyBudget > 0 ? (
                <>
                  <View style={styles.budget10}>
                    <View
                      style={[[styles.budget11, isOverBudget ? styles.budgetState3 : styles.budgetState4], {
                        width: `${budgetBarPercentage}%`,
                      }]}
                    />
                  </View>
                  <Text
                    style={[styles.budget12, isOverBudget
                        ? styles.budgetState5
                        : styles.budgetState6]}
                  >
                    {actualBudgetPercentage.toFixed(1)}%{" of your budget used"}
                  </Text>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.budget13}
                  onPress={() => navigation.navigate("Budget")}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Set monthly budget"
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={19}
                    color="#1677F2"
                  />
                  <Text style={styles.budget14}>
                    Set a monthly budget
                  </Text>
                </TouchableOpacity>
              )}
            </View>
  </>;
}

// Styles for this UI.
const styles = StyleSheet.create({
  topBar2: {
    flexDirection: "row",
    alignItems: "center"
  },

  budget: {
    marginTop: 24,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF",
    padding: 20
  },

  budget2: {
    marginRight: 12,
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#EAF3FF"
  },

  budget3: {
    fontSize: 22,
    fontWeight: "800",
    color: "#071B46"
  },

  budget4: {
    marginTop: 20,
    flexDirection: "row"
  },

  budget5: {
    marginRight: 12,
    flex: 1
  },

  budget6: {
    fontSize: 14,
    lineHeight: 20,
    color: "#718096"
  },

  budget7: {
    marginTop: 4,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "800",
    color: "#071B46"
  },

  budget8: {
    flex: 1,
    alignItems: "flex-end"
  },

  budgetState: {
    color: "#E91E63"
  },

  budgetState2: {
    color: "#071B46"
  },

  budget9: {
    marginTop: 4,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "800"
  },

  budget10: {
    marginTop: 20,
    height: 12,
    overflow: "hidden",
    borderRadius: 9999,
    backgroundColor: "#E4ECF5"
  },

  budgetState3: {
    backgroundColor: "#E91E63"
  },

  budgetState4: {
    backgroundColor: "#3D88F7"
  },

  budget11: {
    height: "100%",
    borderRadius: 9999
  },

  budgetState5: {
    fontWeight: "600",
    color: "#E91E63"
  },

  budgetState6: {
    color: "#65758B"
  },

  budget12: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20
  },

  budget13: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#EAF4FF",
    paddingHorizontal: 16,
    paddingVertical: 12
  },

  budget14: {
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: "#1677F2"
  },

});
