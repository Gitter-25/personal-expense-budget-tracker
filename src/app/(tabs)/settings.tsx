import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function SettingsScreen() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setEmail(user?.email ?? "");
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase.auth.signOut();

          if (error) {
            Alert.alert("Unable to log out", error.message);
            return;
          }

          router.replace("/login");
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
          className="mt-5 rounded-xl bg-red-100 px-4 py-4"
          onPress={handleLogout}
        >
          <Text className="text-center font-semibold text-red-600">
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
