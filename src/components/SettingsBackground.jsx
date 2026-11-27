import { View, StyleSheet } from "react-native";
export default function SettingsBackground() {
 return <>
<View
        pointerEvents="none"
        style={styles.screen}
      />
      <View
        pointerEvents="none"
        style={styles.screen2}
      />
 </>;
}

// UI styles: edit these values during visual debugging.
const styles = StyleSheet.create({
  screen: {position: "absolute", left: -112, top: -96, height: 288, width: 288, borderRadius: 9999, backgroundColor: "#D8EAFE"},
  screen2: {position: "absolute", right: -144, top: 176, height: 320, width: 320, borderRadius: 9999, backgroundColor: "#E4F0FF"},
});
