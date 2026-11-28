import { Text, TextInput, View, StyleSheet } from "react-native";

export default function ExpenseAmountField({ editing = false, amount, handleAmountChange, saving }) {
  const styles = editing ? editStyles : addStyles;
  return <>
    <View style={styles.amountCard}>
            <View style={styles.amountHeader}>
              <View style={styles.currencyIcon}>
                <Text style={styles.currencyIconText}>
                  ₱
                </Text>
              </View>
              <Text style={styles.amountTitle}>
                Expense Amount
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>
                ₱
              </Text>
              <View style={styles.inputDivider} />
              <TextInput
                style={styles.amountInput}
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
  amountCard: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF",
    padding: 16
  },

  amountHeader: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center"
  },

  currencyIcon: {
    marginRight: 12,
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#EAF3FF"
  },

  currencyIconText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#17335F"
  },

  amountTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#071B46"
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D7E5F4",
    backgroundColor: "#F8FBFF",
    paddingHorizontal: 16
  },

  currencySymbol: {
    marginRight: 12,
    fontSize: 26,
    fontWeight: "700",
    color: "#586A84"
  },

  inputDivider: {
    marginRight: 12,
    height: 32,
    width: 1,
    backgroundColor: "#DCE8F5"
  },

  amountInput: {
    flex: 1,
    minHeight: 54,
    color: "#071B46",
    fontSize: 16,
    lineHeight: 22
  },

});

// Edit expense styles.
const editStyles = StyleSheet.create({
  amountCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF",
    padding: 16
  },

  amountHeader: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center"
  },

  currencyIcon: {
    marginRight: 12,
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#EAF3FF"
  },

  currencyIconText: {
    fontSize: 21,
    fontWeight: "800",
    color: "#17335F"
  },

  amountTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#071B46"
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D7E5F4",
    backgroundColor: "#F8FBFF",
    paddingHorizontal: 16
  },

  currencySymbol: {
    marginRight: 12,
    fontSize: 24,
    fontWeight: "700",
    color: "#586A84"
  },

  inputDivider: {
    marginRight: 12,
    height: 28,
    width: 1,
    backgroundColor: "#DCE8F5"
  },

  amountInput: {
    flex: 1,
    minHeight: 54,
    color: "#071B46",
    fontSize: 22,
    fontWeight: "700"
  },

});
