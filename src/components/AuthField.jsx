import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

// Styles for this UI.
const styles = StyleSheet.create({
  label: {marginBottom:8,fontSize:14,lineHeight:20,fontWeight:"700",color:"#17335F"},
  field: {flexDirection:"row",alignItems:"center",borderRadius:16,borderWidth:1,borderColor:"#D7E5F4",backgroundColor:"#F8FBFF",paddingHorizontal:16},
  divider: {marginHorizontal:12,height:28,width:1,backgroundColor:"#DCE8F5"},
  input: {flex:1,minHeight:56,color:"#071B46",fontSize:16},
  toggle: {marginLeft:8,height:40,width:40,alignItems:"center",justifyContent:"center"},
});
