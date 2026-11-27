import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";
import { formatCurrency } from "../utils/formatCurrency";

export default function BudgetSummary({ monthlyBudget, monthlySpent, remainingBudget, budgetProgress, budgetProgressPercentage }) {
  return (
    <View style={styles.screen}>
          <View
            pointerEvents="none"
            style={styles.screen2}
          />
          <View
            pointerEvents="none"
            style={styles.screen3}
          />
          <View style={styles.screen4}>
            <View style={styles.screen5}>
              <Ionicons name="wallet-outline" size={29} color="#FFFFFF" />
            </View>
            <View style={styles.screen6}>
              <Text style={styles.screen7}>
                Monthly Budget
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={styles.screen8}
              >
                {formatCurrency(monthlyBudget)}
              </Text>
            </View>
          </View>
          <View style={styles.screen9}>
            <View style={styles.screen10}>
              <Text style={styles.screen11}>
                Budget used
              </Text>
              <Text style={styles.screen12}>
                {budgetProgressPercentage}%
              </Text>
            </View>
            <View style={styles.screen13}>
              <View
                style={[styles.screen14, {
                  width: `${budgetProgress * 100}%`,
                }]}
              />
            </View>
          </View>
          <View style={styles.screen15}>
            <View style={styles.screen16}>
              <View style={styles.screen17}>
                <Ionicons name="card-outline" size={23} color="#FFFFFF" />
              </View>
              <View style={styles.screen6}>
                <Text style={styles.screen18}>Total Spent</Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={styles.screen19}
                >
                  {formatCurrency(monthlySpent)}
                </Text>
              </View>
            </View>
            <View style={styles.screen20} />
            <View style={styles.screen16}>
              <View style={styles.screen17}>
                <Ionicons name="time-outline" size={23} color="#FFFFFF" />
              </View>
              <View style={styles.screen6}>
                <Text style={styles.screen18}>Remaining</Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={[styles.screen21, remainingBudget < 0 ? styles.screenState : styles.screenState2]}
                >
                  {formatCurrency(remainingBudget)}
                </Text>
              </View>
            </View>
          </View>
        </View>
  );
}

// UI styles: edit these values during visual debugging.
const styles = StyleSheet.create({
  screen: {overflow: "hidden", borderRadius: 28, backgroundColor: "#1E63E9", paddingHorizontal: 20, paddingVertical: 24},
  screen2: {position: "absolute", right: -80, top: -80, height: 208, width: 208, borderRadius: 9999, backgroundColor: "#6955F5"},
  screen3: {position: "absolute", bottom: -112, left: 40, height: 224, width: 224, borderRadius: 9999, backgroundColor: "#0D83ED"},
  screen4: {flexDirection: "row", alignItems: "center"},
  screen5: {marginRight: 16, height: 56, width: 56, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: "rgba(255, 255, 255, 0.15)"},
  screen6: {flex: 1},
  screen7: {fontSize: 15, fontWeight: "500", color: "rgba(255, 255, 255, 0.8)"},
  screen8: {marginTop: 4, fontSize: 32, fontWeight: "800", color: "#FFFFFF"},
  screen9: {marginTop: 24},
  screen10: {marginBottom: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between"},
  screen11: {fontSize: 12, lineHeight: 16, fontWeight: "500", color: "rgba(255, 255, 255, 0.75)"},
  screen12: {fontSize: 12, lineHeight: 16, fontWeight: "700", color: "#FFFFFF"},
  screen13: {height: 12, overflow: "hidden", borderRadius: 9999, backgroundColor: "rgba(255, 255, 255, 0.25)"},
  screen14: {height: "100%", borderRadius: 9999, backgroundColor: "#40D8EA"},
  screen15: {marginTop: 24, flexDirection: "row"},
  screen16: {flex: 1, flexDirection: "row", alignItems: "center"},
  screen17: {marginRight: 12, height: 44, width: 44, alignItems: "center", justifyContent: "center", borderRadius: 9999, backgroundColor: "rgba(255, 255, 255, 0.15)"},
  screen18: {fontSize: 12, lineHeight: 16, color: "rgba(255, 255, 255, 0.7)"},
  screen19: {marginTop: 4, fontSize: 18, lineHeight: 28, fontWeight: "800", color: "#FFFFFF"},
  screen20: {marginHorizontal: 12, width: 1, backgroundColor: "rgba(255, 255, 255, 0.25)"},
  screenState: {color: "#FFD7DF"},
  screenState2: {color: "#FFFFFF"},
  screen21: {marginTop: 4, fontSize: 18, lineHeight: 28, fontWeight: "800"},
});
