import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/AuthField.styles";

export default function AuthField({ label, icon, bottom = 20, visible, onToggle, editable = true, ...props }) {
  return <>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.field, { marginBottom: bottom }]}>
      <Ionicons name={icon} size={21} color="#6EA8F4" />
      <View style={styles.divider} />
      <TextInput {...props} style={styles.input} editable={editable} placeholderTextColor="#A0AEC0" secureTextEntry={!!onToggle && !visible} />
      {onToggle && <TouchableOpacity style={styles.toggle} onPress={onToggle} disabled={!editable} accessibilityRole="button" accessibilityLabel={(visible ? "Hide " : "Show ") + label.toLowerCase()}>
        <Ionicons name={visible ? "eye-outline" : "eye-off-outline"} size={22} color="#8191A9" />
      </TouchableOpacity>}
    </View>
  </>;
}
