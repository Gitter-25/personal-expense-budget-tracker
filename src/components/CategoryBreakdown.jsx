import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/StatisticsScreen.styles";
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
