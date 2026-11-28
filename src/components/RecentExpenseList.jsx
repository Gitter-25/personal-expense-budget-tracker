import { ActivityIndicator, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "../utils/formatCurrency";
const formatExpenseDate = (date) => {
  const [year, month, day] = date.split("-").map(Number);

  if (!year || !month || !day) {
    return date;
  }

  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
};


export default function RecentExpenseList({ loadingExpenses, recentExpenses, navigation, handleEditExpense, handleDeleteExpense }) {
  return <>
    {loadingExpenses ? (
          <View style={styles.expenseContent}>
            <ActivityIndicator size="small" color="#1677F2" />
            <Text style={styles.expenseContent2}>
              Loading expenses...
            </Text>
          </View>
        ) : recentExpenses.length === 0 ? (
          <View style={styles.expenseContent3}>
            <View style={styles.expenseContent4}>
              <Ionicons name="receipt-outline" size={30} color="#1677F2" />
            </View>
            <Text style={styles.expenseContent5}>
              No expenses yet
            </Text>
            <Text style={styles.expenseContent6}>
              Add your first expense and it will appear here.
            </Text>
            <TouchableOpacity
              style={styles.expenseContent7}
              onPress={() => navigation.navigate("AddExpense")}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Add your first expense"
            >
              <Ionicons name="add" size={19} color="#FFFFFF" />
              <Text style={styles.expenseContent8}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {recentExpenses.map((expense, index) => (
              <View
                key={expense.id}
                style={styles.expenseContent9}
              >
                <View
                  style={[styles.expenseContent10, index % 2 === 0 ? styles.expenseContentState : styles.expenseContentState2]}
                />
                <View style={styles.expenseContent11}>
                  <View style={styles.expenseContent12}>
                    <View style={styles.expenseContent13}>
                      <View style={styles.expenseContent14}>
                        <Text style={styles.expenseContent15}>
                          {expense.category?.icon ?? "💰"}
                        </Text>
                      </View>
                      <View style={styles.pesotrackBranding3}>
                        <Text
                          numberOfLines={1}
                          style={styles.expenseContent16}
                        >
                          {expense.category?.name ?? "Uncategorized"}
                        </Text>
                        <Text
                          numberOfLines={2}
                          style={styles.expenseContent17}
                        >
                          {expense.description || "No description"}
                        </Text>
                        <View style={styles.expenseContent18}>
                          <Ionicons
                            name="calendar-outline"
                            size={15}
                            color="#1677F2"
                          />
                          <Text style={styles.expenseContent19}>
                            {formatExpenseDate(expense.expense_date)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.expenseContent20}>
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={styles.expenseContent21}
                      >
                        {formatCurrency(Number(expense.amount))}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.expenseContent22}>
                    <TouchableOpacity
                      style={styles.expenseContent23}
                      onPress={() => handleEditExpense(expense)}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel="Edit expense"
                    >
                      <Ionicons
                        name="create-outline"
                        size={18}
                        color="#1677F2"
                      />
                      <Text style={styles.expenseContent24}>
                        Edit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.expenseContent25}
                      onPress={() => handleDeleteExpense(expense.id)}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel="Delete expense"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#E91E63"
                      />
                      <Text style={styles.expenseContent26}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
  </>;
}

// Styles for this UI.
const styles = StyleSheet.create({
  pesotrackBranding3: {flex: 1},
  expenseContent: {alignItems: "center", borderRadius: 24, borderWidth: 1, borderColor: "#E3EDF8", backgroundColor: "#FFFFFF", paddingHorizontal: 20, paddingVertical: 40},
  expenseContent2: {marginTop: 12, fontSize: 14, lineHeight: 20, color: "#718096"},
  expenseContent3: {alignItems: "center", borderRadius: 24, borderWidth: 1, borderColor: "#E3EDF8", backgroundColor: "#FFFFFF", paddingHorizontal: 24, paddingVertical: 40},
  expenseContent4: {height: 64, width: 64, alignItems: "center", justifyContent: "center", borderRadius: 9999, backgroundColor: "#EAF3FF"},
  expenseContent5: {marginTop: 16, fontSize: 18, lineHeight: 28, fontWeight: "800", color: "#071B46"},
  expenseContent6: {marginTop: 8, textAlign: "center", fontSize: 14, lineHeight: 20, color: "#7A879A"},
  expenseContent7: {marginTop: 20, flexDirection: "row", alignItems: "center", borderRadius: 16, backgroundColor: "#1677F2", paddingHorizontal: 20, paddingVertical: 12},
  expenseContent8: {marginLeft: 8, fontWeight: "700", color: "#FFFFFF"},
  expenseContent9: {marginBottom: 16, overflow: "hidden", borderRadius: 24, borderWidth: 1, borderColor: "#E3EDF8", backgroundColor: "#FFFFFF"},
  expenseContentState: {backgroundColor: "#FFC85A"},
  expenseContentState2: {backgroundColor: "#8566F6"},
  expenseContent10: {position: "absolute", bottom: 0, left: 0, top: 0, width: 6},
  expenseContent11: {padding: 20},
  expenseContent12: {flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between"},
  expenseContent13: {marginRight: 12, flex: 1, flexDirection: "row"},
  expenseContent14: {marginRight: 12, height: 56, width: 56, alignItems: "center", justifyContent: "center", borderRadius: 9999, backgroundColor: "#FFF6D9"},
  expenseContent15: {fontSize: 24, lineHeight: 32},
  expenseContent16: {fontSize: 17, fontWeight: "800", color: "#071B46"},
  expenseContent17: {marginTop: 4, fontSize: 14, lineHeight: 20, color: "#6F7E92"},
  expenseContent18: {marginTop: 8, flexDirection: "row", alignItems: "center"},
  expenseContent19: {marginLeft: 6, fontSize: 12, lineHeight: 16, color: "#75859A"},
  expenseContent20: {maxWidth: "38%", borderRadius: 9999, backgroundColor: "#FCE8F0", paddingHorizontal: 12, paddingVertical: 8},
  expenseContent21: {fontWeight: "800", color: "#9B174C"},
  expenseContent22: {marginTop: 16, flexDirection: "row"},
  expenseContent23: {marginRight: 12, flexDirection: "row", alignItems: "center", borderRadius: 12, backgroundColor: "#EAF4FF", paddingHorizontal: 16, paddingVertical: 10},
  expenseContent24: {marginLeft: 8, fontSize: 14, lineHeight: 20, fontWeight: "700", color: "#1677F2"},
  expenseContent25: {flexDirection: "row", alignItems: "center", borderRadius: 12, backgroundColor: "#FDE9F0", paddingHorizontal: 16, paddingVertical: 10},
  expenseContent26: {marginLeft: 8, fontSize: 14, lineHeight: 20, fontWeight: "700", color: "#E91E63"},
});
