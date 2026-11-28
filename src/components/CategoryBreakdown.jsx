import { ActivityIndicator, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "../utils/formatCurrency";

export default function CategoryBreakdown({ categoryTotals, navigation }) {
  return <>
    <View style={styles.budget}>
              <View style={styles.topBar2}>
                <View style={styles.categoryBreakdown}>
                  <Ionicons name="pie-chart" size={24} color="#F59E0B" />
                </View>
                <View style={styles.header3}>
                  <Text style={styles.budget3}>
                    Spending by Category
                  </Text>
                  <Text style={styles.last7Days3}>
                    Where your money went this month
                  </Text>
                </View>
              </View>

              {categoryTotals.length === 0 ? (
                <View style={styles.categoryBreakdown2}>
                  <View style={styles.categoryBreakdown3}>
                    <Ionicons
                      name="pie-chart-outline"
                      size={27}
                      color="#1677F2"
                    />
                  </View>
                  <Text style={styles.categoryBreakdown4}>
                    No spending data yet
                  </Text>
                  <Text style={styles.categoryBreakdown5}>
                    Add expenses to see your category breakdown.
                  </Text>
                  <TouchableOpacity
                    style={styles.categoryBreakdown6}
                    onPress={() => navigation.navigate("AddExpense")}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel="Add expense"
                  >
                    <Ionicons name="add" size={18} color="#FFFFFF" />
                    <Text style={styles.categoryBreakdown7}>
                      Add Expense
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.categoryBreakdown8}>
                  {categoryTotals.map((category) => (
                    <View key={category.id} style={styles.categoryBreakdown9}>
                      <View style={styles.categoryBreakdown10}>
                        <View style={styles.categoryBreakdown11}>
                          <View style={styles.categoryBreakdown12}>
                            <Text style={styles.categoryBreakdown13}>
                              {category.icon ?? "📁"}
                            </Text>
                          </View>
                          <View style={styles.categoryBreakdown14}>
                            <Text
                              numberOfLines={1}
                              style={styles.categoryBreakdown15}
                            >
                              {category.name}
                            </Text>
                            <Text style={styles.categoryBreakdown16}>
                              {category.percentage.toFixed(1)}% of spending
                            </Text>
                          </View>
                        </View>
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          style={styles.categoryBreakdown17}
                        >
                          {formatCurrency(category.total)}
                        </Text>
                      </View>
                      <View style={styles.categoryBreakdown18}>
                        <View
                          style={[styles.categoryBreakdown19, {
                            width: `${Math.min(category.percentage, 100)}%`,
                          }]}
                        />
                      </View>
                    </View>
                  ))}
                </View>
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

  header3: {
    flex: 1
  },

  budget: {
    marginTop: 24,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF",
    padding: 20
  },

  budget3: {
    fontSize: 22,
    fontWeight: "800",
    color: "#071B46"
  },

  last7Days3: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    color: "#718096"
  },

  categoryBreakdown: {
    marginRight: 12,
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#FFF1D8"
  },

  categoryBreakdown2: {
    marginTop: 24,
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#F8FBFF",
    paddingHorizontal: 20,
    paddingVertical: 32
  },

  categoryBreakdown3: {
    height: 56,
    width: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#EAF3FF"
  },

  categoryBreakdown4: {
    marginTop: 12,
    fontWeight: "700",
    color: "#17335F"
  },

  categoryBreakdown5: {
    marginTop: 4,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    color: "#718096"
  },

  categoryBreakdown6: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#1677F2",
    paddingHorizontal: 16,
    paddingVertical: 10
  },

  categoryBreakdown7: {
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: "#FFFFFF"
  },

  categoryBreakdown8: {
    marginTop: 8
  },

  categoryBreakdown9: {
    marginTop: 20
  },

  categoryBreakdown10: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  categoryBreakdown11: {
    marginRight: 12,
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },

  categoryBreakdown12: {
    height: 44,
    width: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#F7FAFD"
  },

  categoryBreakdown13: {
    fontSize: 20,
    lineHeight: 28
  },

  categoryBreakdown14: {
    marginLeft: 12,
    flex: 1
  },

  categoryBreakdown15: {
    fontWeight: "700",
    color: "#071B46"
  },

  categoryBreakdown16: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: "#718096"
  },

  categoryBreakdown17: {
    maxWidth: "38%",
    fontWeight: "800",
    color: "#071B46"
  },

  categoryBreakdown18: {
    marginTop: 12,
    height: 10,
    overflow: "hidden",
    borderRadius: 9999,
    backgroundColor: "#E8EEF5"
  },

  categoryBreakdown19: {
    height: "100%",
    borderRadius: 9999,
    backgroundColor: "#1677F2"
  },

});
