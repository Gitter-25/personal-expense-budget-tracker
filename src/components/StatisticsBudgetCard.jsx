import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/StatisticsScreen.styles";
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
