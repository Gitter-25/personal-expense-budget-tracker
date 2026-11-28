import { View, StyleSheet } from "react-native";

// Shared decorative background for all screens.
export default function Background({ screen }) {
  const circles = screenCircles[screen];
  return (
    <>
      {circles.map((circle) => (
        <View key={circle} pointerEvents="none" style={styles[circle]} />
      ))}
    </>
  );
}

const screenCircles = {
  Login: ["circle1", "circle2", "circle3"],
  Signup: ["circle1", "circle2", "circle3"],
  Home: ["circle1", "circle4"],
  AddExpense: ["circle1", "circle5"],
  EditExpense: ["circle1", "circle5"],
  Budget: ["circle1", "circle5", "circle6"],
  Statistics: ["circle1", "circle7"],
  Settings: ["circle1", "circle8"],
  Profile: ["circle1", "circle9"]
};

const styles = StyleSheet.create({
  circle1: {
    position: "absolute",
    left: -112,
    top: -96,
    height: 288,
    width: 288,
    borderRadius: 9999,
    backgroundColor: "#D8EAFE"
  },

  circle2: {
    position: "absolute",
    right: -144,
    top: 208,
    height: 320,
    width: 320,
    borderRadius: 9999,
    backgroundColor: "#E4F0FF"
  },

  circle3: {
    position: "absolute",
    bottom: -160,
    left: -96,
    height: 320,
    width: 320,
    borderRadius: 9999,
    backgroundColor: "#D9EAFF"
  },

  circle4: {
    position: "absolute",
    right: -160,
    top: 176,
    height: 320,
    width: 320,
    borderRadius: 9999,
    backgroundColor: "#E6F1FF"
  },

  circle5: {
    position: "absolute",
    right: -160,
    top: 176,
    height: 320,
    width: 320,
    borderRadius: 9999,
    backgroundColor: "#E4F0FF"
  },

  circle6: {
    position: "absolute",
    bottom: -176,
    left: -112,
    height: 320,
    width: 320,
    borderRadius: 9999,
    backgroundColor: "#D9EAFF"
  },

  circle7: {
    position: "absolute",
    right: -160,
    top: 112,
    height: 320,
    width: 320,
    borderRadius: 9999,
    backgroundColor: "#E8E7FF"
  },

  circle8: {
    position: "absolute",
    right: -144,
    top: 176,
    height: 320,
    width: 320,
    borderRadius: 9999,
    backgroundColor: "#E4F0FF"
  },

  circle9: {
    position: "absolute",
    right: -144,
    top: 160,
    height: 320,
    width: 320,
    borderRadius: 9999,
    backgroundColor: "#E4F0FF"
  }
});
