import { Text, TextInput, View, StyleSheet } from "react-native";

export default function ExpenseAmountField({ editing = false, amount, handleAmountChange, saving }) {
  const styles = editing ? editStyles : addStyles;
  return <>
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
  </>;
}

// Add expense styles.
const addStyles = StyleSheet.create({
  amount: {borderRadius: 26, borderWidth: 1, borderColor: "#E3EDF8", backgroundColor: "#FFFFFF", padding: 16},
  amount2: {marginBottom: 16, flexDirection: "row", alignItems: "center"},
  amount3: {marginRight: 12, height: 36, width: 36, alignItems: "center", justifyContent: "center", borderRadius: 9999, backgroundColor: "#EAF3FF"},
  amount4: {fontSize: 24, fontWeight: "800", color: "#17335F"},
  amount5: {fontSize: 18, fontWeight: "800", color: "#071B46"},
  amount6: {flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: "#D7E5F4", backgroundColor: "#F8FBFF", paddingHorizontal: 16},
  amount7: {marginRight: 12, fontSize: 26, fontWeight: "700", color: "#586A84"},
  amount8: {marginRight: 12, height: 32, width: 1, backgroundColor: "#DCE8F5"},
  layout2: {flex: 1, minHeight: 54, color: "#071B46", fontSize: 16, lineHeight: 22},
});

// Edit expense styles.
const editStyles = StyleSheet.create({
  amount: {borderRadius: 22, borderWidth: 1, borderColor: "#E3EDF8", backgroundColor: "#FFFFFF", padding: 16},
  amount2: {marginBottom: 12, flexDirection: "row", alignItems: "center"},
  amount3: {marginRight: 12, height: 36, width: 36, alignItems: "center", justifyContent: "center", borderRadius: 9999, backgroundColor: "#EAF3FF"},
  amount4: {fontSize: 21, fontWeight: "800", color: "#17335F"},
  amount5: {fontSize: 18, fontWeight: "800", color: "#071B46"},
  amount6: {flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: "#D7E5F4", backgroundColor: "#F8FBFF", paddingHorizontal: 16},
  amount7: {marginRight: 12, fontSize: 24, fontWeight: "700", color: "#586A84"},
  amount8: {marginRight: 12, height: 28, width: 1, backgroundColor: "#DCE8F5"},
  layout2: {flex: 1, minHeight: 54, color: "#071B46", fontSize: 22, fontWeight: "700"},
});
