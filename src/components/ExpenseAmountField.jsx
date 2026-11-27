import { Text, TextInput, View } from "react-native";

export default function ExpenseAmountField({ styles, amount, handleAmountChange, saving }) {
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
