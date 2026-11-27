import { Stack } from "expo-router";
import { ActivityIndicator, View, Text, TouchableOpacity } from "react-native";
import "../global.css";
import { AuthProvider, useAuth } from "../context/AuthContext";

function RootNavigator() {
  const { user, loading, error, loadSession } = useAuth();
  if (loading || error) {
    return <View className="flex-1 items-center justify-center bg-gray-100">
      {loading ? <ActivityIndicator /> : <>
        <Text>{error}</Text>
        <TouchableOpacity onPress={loadSession}><Text>Retry</Text></TouchableOpacity>
      </>}
    </View>;
  }

  // Protected routes prevent returning to private screens after logout.
  return <Stack screenOptions={{ headerShown: false }}>
    <Stack.Protected guard={!user}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack.Protected>
    <Stack.Protected guard={!!user}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="edit-expense" />
    </Stack.Protected>
  </Stack>;
}

export default function RootLayout() {
  return <AuthProvider><RootNavigator /></AuthProvider>;
}
