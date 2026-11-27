import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/AuthButton.styles";
export default function AuthButton({ title, busyTitle, loading, onPress }) {
  return <TouchableOpacity style={[styles.button, loading ? styles.disabled : styles.enabled]} onPress={onPress} disabled={loading} activeOpacity={0.85} accessibilityRole="button" accessibilityLabel={title} accessibilityState={{disabled:loading}}>
    {loading && <ActivityIndicator size="small" color="#FFFFFF" />}
    <Text style={[styles.label, loading && styles.busy]}>{loading ? busyTitle : title}</Text>
    {!loading && <View style={styles.arrow}><Ionicons name="arrow-forward" size={21} color="#FFFFFF" /></View>}
  </TouchableOpacity>;
}
