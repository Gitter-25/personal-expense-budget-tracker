import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

export default function SettingsScreen() {
  const [email, setEmail] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoadingUser(true);

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
      } finally {
        setLoadingUser(false);
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F4F9FF",
      }}
      edges={["top", "left", "right"]}
    >
      {/* Decorative background */}
      <View
        pointerEvents="none"
        className="absolute -left-28 -top-24 h-72 w-72 rounded-full bg-[#D8EAFE]"
      />

      <View
        pointerEvents="none"
        className="absolute -right-36 top-44 h-80 w-80 rounded-full bg-[#E4F0FF]"
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-7 flex-row items-center">
          <View className="mr-3 h-12 w-12 items-center justify-center rounded-2xl bg-[#1677F2]">
            <Ionicons name="settings" size={26} color="#FFFFFF" />
          </View>

          <View className="flex-1">
            <Text className="text-[26px] font-extrabold text-[#071B46]">
              Settings
            </Text>

            <Text className="mt-0.5 text-sm text-[#66758D]">
              Manage your account and preferences
            </Text>
          </View>
        </View>

        {/* Account Card */}
        <View className="rounded-[26px] border border-[#E3EDF8] bg-white p-5">
          <View className="flex-row items-center">
            <View className="mr-4 h-14 w-14 items-center justify-center rounded-full bg-[#EAF3FF]">
              <Ionicons name="person" size={28} color="#1677F2" />
            </View>

            <View className="flex-1">
              <Text className="text-[20px] font-extrabold text-[#071B46]">
                Account
              </Text>

              {loadingUser ? (
                <View className="mt-2 flex-row items-center">
                  <ActivityIndicator size="small" color="#1677F2" />

                  <Text className="ml-2 text-sm text-[#718096]">
                    Loading account...
                  </Text>
                </View>
              ) : (
                <Text numberOfLines={1} className="mt-1 text-sm text-[#66758D]">
                  {email || "No email available"}
                </Text>
              )}
            </View>
          </View>

          {/* Profile */}
          <TouchableOpacity
            className="mt-6 flex-row items-center rounded-2xl bg-[#F7FAFF] px-4 py-4"
            onPress={() => router.push("/profile")}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#E8F2FF]">
              <Ionicons name="person-outline" size={21} color="#1677F2" />
            </View>

            <View className="flex-1">
              <Text className="font-bold text-[#071B46]">My Profile</Text>

              <Text className="mt-0.5 text-xs text-[#7A879A]">
                View and update your profile details
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#8AA0BB" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="mt-5 rounded-[26px] border border-[#E3EDF8] bg-white p-5">
          <View className="flex-row items-center">
            <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-[#EAF3FF]">
              <Ionicons name="wallet" size={23} color="#1677F2" />
            </View>

            <View className="flex-1">
              <Text className="text-[18px] font-extrabold text-[#071B46]">
                PesoTrack
              </Text>

              <Text className="mt-1 text-sm text-[#718096]">
                Plan today. Build tomorrow.
              </Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          className={`mt-6 min-h-[56px] flex-row items-center justify-center rounded-2xl ${
            loggingOut ? "bg-[#F5B5C5]" : "bg-[#FDE8EE]"
          }`}
          onPress={handleLogout}
          disabled={loggingOut}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          {loggingOut ? (
            <>
              <ActivityIndicator size="small" color="#D92D5E" />

              <Text className="ml-3 font-extrabold text-[#D92D5E]">
                Logging out...
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="log-out-outline" size={21} color="#D92D5E" />

              <Text className="ml-2 font-extrabold text-[#D92D5E]">
                Log Out
              </Text>
            </>
          )}
        </TouchableOpacity>

        <View className="mt-7 items-center">
          <Text className="text-xs text-[#9AA8B9]">PesoTrack</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
