import { Text, TextInput, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ExpenseDescriptionField({ editing = false, description, setDescription, saving }) {
  const styles = editing ? editStyles : addStyles;
  return <>
    <View style={styles.description}>
            <View style={editing ? styles.amount2 : styles.category2}>
              <View style={editing ? styles.category2 : styles.category3}>
                <Ionicons name="create-outline" size={20} color="#1677F2" />
              </View>
              <Text style={editing ? styles.category3 : styles.category4}>
                Description
              </Text>
              <Text style={styles.description2}>Optional</Text>
            </View>
            <View style={editing ? styles.amount : styles.description3}>
              <TextInput
                style={styles.layout3}
                placeholder="What did you spend on?"
                placeholderTextColor="#A0AEC0"
                multiline
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
                editable={!saving}
                maxLength={150}
                accessibilityLabel="Expense description"
              />
              <Text style={editing ? styles.description3 : styles.description4}>
                {description.length}/150
              </Text>
            </View>
          </View>
  </>;
}

// Add expense styles.
const addStyles = StyleSheet.create({
  amount: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF",
    padding: 16
  },

  amount2: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center"
  },

  category2: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center"
  },

  category3: {
    marginRight: 12,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#EEF5FF"
  },

  category4: {
    fontSize: 20,
    fontWeight: "800",
    color: "#071B46"
  },

  description: {
    marginTop: 16
  },

  description2: {
    marginLeft: 8,
    fontSize: 12,
    lineHeight: 16,
    color: "#94A3B8"
  },

  description3: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF",
    padding: 16
  },

  description4: {
    marginTop: 8,
    textAlign: "right",
    fontSize: 12,
    lineHeight: 16,
    color: "#94A3B8"
  },

  layout3: {
    minHeight: 40,
    color: "#071B46",
    fontSize: 16,
    lineHeight: 22
  },

});

// Edit expense styles.
const editStyles = StyleSheet.create({
  amount: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF",
    padding: 16
  },

  amount2: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center"
  },

  category2: {
    marginRight: 12,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#EEF5FF"
  },

  category3: {
    fontSize: 20,
    fontWeight: "800",
    color: "#071B46"
  },

  category4: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E3EDF8",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 28
  },

  description: {
    marginTop: 16
  },

  description2: {
    marginLeft: 8,
    fontSize: 12,
    lineHeight: 16,
    color: "#94A3B8"
  },

  description3: {
    marginTop: 8,
    textAlign: "right",
    fontSize: 12,
    lineHeight: 16,
    color: "#94A3B8"
  },

  layout3: {
    minHeight: 72,
    color: "#071B46",
    fontSize: 16,
    lineHeight: 23
  },

});
