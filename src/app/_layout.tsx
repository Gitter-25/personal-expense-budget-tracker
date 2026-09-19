import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="signup"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />

      <Stack.Screen
        name="explore"
        options={{
          title: "Explore",
        }}
      />

      <Stack.Screen
        name="edit-expense"
        options={{
          title: "Edit Expense",
        }}
      />
    </Stack>
  );
}
