import { ActivityIndicator, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
export default function AuthButton({ title, busyTitle, loading, onPress }) {
  return <TouchableOpacity style={[styles.button, loading ? styles.disabled : styles.enabled]} onPress={onPress} disabled={loading} activeOpacity={0.85} accessibilityRole="button" accessibilityLabel={title} accessibilityState={{disabled:loading}}>
    {loading && <ActivityIndicator size="small" color="#FFFFFF" />}
    <Text style={[styles.label, loading && styles.busy]}>{loading ? busyTitle : title}</Text>
    {!loading && <View style={styles.arrow}><Ionicons name="arrow-forward" size={21} color="#FFFFFF" /></View>}
  </TouchableOpacity>;
}

// Styles for this UI.
const styles = StyleSheet.create({button:{minHeight:56,flexDirection:"row",alignItems:"center",justifyContent:"center",borderRadius:16},disabled:{backgroundColor:"#7CB3F8"},enabled:{backgroundColor:"#1677F2"},label:{fontSize:16,lineHeight:24,fontWeight:"800",color:"#FFFFFF"},busy:{marginLeft:12},arrow:{marginLeft:8}});
