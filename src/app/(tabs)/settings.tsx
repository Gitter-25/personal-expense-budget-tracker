import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function SettingsScreen() {
  const [email, setEmail] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Unable to load user:", error.message);
          return;
        }

        setEmail(user?.email ?? "");
      } catch (error) {
        console.error("Unexpected error loading user:", error);
      }
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    if (loggingOut) return;

    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            setLoggingOut(true);

            const { error } = await supabase.auth.signOut();

            if (error) {
              Alert.alert("Unable to log out", error.message);
              return;
            }

            router.replace("/login");
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : "An unexpected error occurred.";

            Alert.alert("Unable to log out", message);
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-100 px-5 pb-8 pt-16">
      <Text className="text-3xl font-bold text-gray-900">Settings</Text>

      <Text className="mt-2 text-base text-gray-500">
        Manage your account and app settings.
      </Text>

      <View className="mt-8 rounded-2xl bg-white p-5">
        <Text className="text-lg font-bold text-gray-900">Account</Text>

        <Text className="mt-2 text-gray-500">{email}</Text>

        <TouchableOpacity
          className="mt-5 rounded-xl bg-gray-100 px-4 py-4"
          onPress={() => router.push("/profile")}
        >
          <Text className="text-center font-semibold text-gray-900">
            My Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`mt-5 rounded-xl px-4 py-4 ${
            loggingOut ? "bg-red-50" : "bg-red-100"
          }`}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          <Text className="text-center font-semibold text-red-600">
            {loggingOut ? "Logging out..." : "Log Out"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
