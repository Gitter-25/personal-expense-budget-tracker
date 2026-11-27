import { Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ExpenseDescriptionField({ styles, editing = false, description, setDescription, saving }) {
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
