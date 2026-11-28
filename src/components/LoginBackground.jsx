import { View, StyleSheet } from "react-native";
export default function LoginBackground() {
 return <>
<View
        pointerEvents="none"
        style={styles.screen}
      />
      <View
        pointerEvents="none"
        style={styles.screen2}
      />
      <View
        pointerEvents="none"
        style={styles.screen3}
      />
 </>;
}

// UI styles: edit these values during visual debugging.
const styles = StyleSheet.create({
  screen: {
    position: "absolute",
    left: -112,
    top: -96,
    height: 288,
    width: 288,
    borderRadius: 9999,
    backgroundColor: "#D8EAFE"
  },

  screen2: {
    position: "absolute",
    right: -144,
    top: 208,
    height: 320,
    width: 320,
    borderRadius: 9999,
    backgroundColor: "#E4F0FF"
  },

  screen3: {
    position: "absolute",
    bottom: -160,
    left: -96,
    height: 320,
    width: 320,
    borderRadius: 9999,
    backgroundColor: "#D9EAFF"
  },

});
