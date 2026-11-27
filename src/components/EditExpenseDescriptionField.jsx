import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/EditExpenseScreen.styles";

export default function EditExpenseDescriptionField({ description, setDescription, saving }) {
  return <>
    <View style={styles.description}>
            <View style={styles.amount2}>
              <View style={styles.category2}>
                <Ionicons name="create-outline" size={20} color="#1677F2" />
              </View>
              <Text style={styles.category3}>
                Description
              </Text>
              <Text style={styles.description2}>Optional</Text>
            </View>
            <View style={styles.amount}>
              <TextInput
                style={styles.layout3}
                value={description}
                onChangeText={setDescription}
                placeholder="What did you spend on?"
                placeholderTextColor="#A0AEC0"
                multiline
                textAlignVertical="top"
                editable={!saving}
                maxLength={150}
                accessibilityLabel="Expense description"
              />
              <Text style={styles.description3}>
                {description.length}/150
              </Text>
            </View>
          </View>
  </>;
}
