import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/AddExpenseScreen.styles";

export default function AddExpenseDescriptionField({ description, setDescription, saving }) {
  return <>
    <View style={styles.description}>
            <View style={styles.category2}>
              <View style={styles.category3}>
                <Ionicons name="create-outline" size={20} color="#1677F2" />
              </View>
              <Text style={styles.category4}>
                Description
              </Text>
              <Text style={styles.description2}>Optional</Text>
            </View>
            <View style={styles.description3}>
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
              <Text style={styles.description4}>
                {description.length}/150
              </Text>
            </View>
          </View>
  </>;
}
