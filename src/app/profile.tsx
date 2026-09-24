import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

export default function ProfileScreen() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [originalFullName, setOriginalFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert(
          "Session error",
          "Your account could not be verified. Please log in again.",
        );

        router.replace("/login");
        return;
      }

      setEmail(user.email ?? "");

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        Alert.alert("Unable to load profile", error.message);
        return;
      }

      const loadedName = data?.full_name ?? "";

      setFullName(loadedName);
      setOriginalFullName(loadedName);
    } catch (error) {
      console.error("Unexpected error loading profile:", error);

      Alert.alert(
        "Unable to load profile",
        "An unexpected error occurred while loading your profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (saving) return;

    Keyboard.dismiss();

    const trimmedName = fullName.trim();

    if (!trimmedName) {
      Alert.alert("Missing information", "Please enter your full name.");
      return;
    }

    if (trimmedName.length < 2) {
      Alert.alert("Invalid name", "Please enter at least 2 characters.");
      return;
    }

    if (trimmedName === originalFullName.trim()) {
      Alert.alert(
        "No changes",
        "Your profile information is already up to date.",
      );
      return;
    }

    try {
      setSaving(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert(
          "Session error",
          "Your session could not be verified. Please log in again.",
        );

        router.replace("/login");
        return;
      }

      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          full_name: trimmedName,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        },
      );

      if (error) {
        Alert.alert("Unable to save profile", error.message);
        return;
      }

      setFullName(trimmedName);
      setOriginalFullName(trimmedName);

      Alert.alert(
        "Profile saved",
        "Your profile has been updated successfully.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      Alert.alert("Unable to save profile", message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#F4F9FF",
        }}
        edges={["top", "left", "right", "bottom"]}
      >
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#1677F2" />

          <Text className="mt-3 text-sm text-[#718096]">
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const hasChanges = fullName.trim() !== originalFullName.trim();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F4F9FF",
      }}
      edges={["top", "left", "right", "bottom"]}
    >
      {/* Background decorations */}
      <View
        pointerEvents="none"
        className="absolute -left-28 -top-24 h-72 w-72 rounded-full bg-[#D8EAFE]"
      />

      <View
        pointerEvents="none"
        className="absolute -right-36 top-40 h-80 w-80 rounded-full bg-[#E4F0FF]"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="mb-7 flex-row items-center">
            <TouchableOpacity
              className="mr-3 h-12 w-12 items-center justify-center rounded-2xl border border-[#E3EDF8] bg-white"
              onPress={() => router.back()}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={24} color="#1677F2" />
            </TouchableOpacity>

            <View className="flex-1">
              <Text className="text-[26px] font-extrabold text-[#071B46]">
                My Profile
              </Text>

              <Text className="mt-0.5 text-sm text-[#66758D]">
                Manage your account information
              </Text>
            </View>
          </View>

          {/* Profile summary */}
          <View className="mb-5 items-center rounded-[26px] border border-[#E3EDF8] bg-white p-5">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-[#EAF3FF]">
              <Ionicons name="person" size={38} color="#1677F2" />
            </View>

            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              className="mt-4 max-w-full text-[22px] font-extrabold text-[#071B46]"
            >
              {fullName.trim() || "PesoTrack User"}
            </Text>

            <Text
              numberOfLines={1}
              className="mt-1 max-w-full text-sm text-[#718096]"
            >
              {email || "No email available"}
            </Text>
          </View>

          {/* Form */}
          <View className="rounded-[26px] border border-[#E3EDF8] bg-white p-5">
            {/* Email */}
            <Text className="mb-2 text-sm font-bold text-[#17335F]">Email</Text>

            <View className="mb-5 flex-row items-center rounded-2xl border border-[#D7E5F4] bg-[#F3F6FA] px-4">
              <Ionicons name="mail-outline" size={21} color="#8AA0BB" />

              <View className="mx-3 h-7 w-px bg-[#DCE8F5]" />

              <TextInput
                style={{
                  flex: 1,
                  minHeight: 54,
                  color: "#66758D",
                  fontSize: 16,
                }}
                value={email}
                editable={false}
                accessibilityLabel="Email address"
              />
            </View>

            <Text className="mb-2 text-sm font-bold text-[#17335F]">
              Full Name
            </Text>

            <View className="flex-row items-center rounded-2xl border border-[#D7E5F4] bg-[#F8FBFF] px-4">
              <Ionicons name="person-outline" size={21} color="#6EA8F4" />

              <View className="mx-3 h-7 w-px bg-[#DCE8F5]" />

              <TextInput
                style={{
                  flex: 1,
                  minHeight: 54,
                  color: "#071B46",
                  fontSize: 16,
                }}
                placeholder="Enter your full name"
                placeholderTextColor="#A0AEC0"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!saving}
                returnKeyType="done"
                onSubmitEditing={handleSave}
                maxLength={80}
                accessibilityLabel="Full name"
              />
            </View>

            <Text className="mt-2 text-right text-xs text-[#94A3B8]">
              {fullName.length}/80
            </Text>

            {/* Save */}
            <TouchableOpacity
              className={`mt-5 min-h-[56px] flex-row items-center justify-center rounded-2xl ${
                saving
                  ? "bg-[#7CB3F8]"
                  : hasChanges
                    ? "bg-[#1677F2]"
                    : "bg-[#B7D3F7]"
              }`}
              onPress={handleSave}
              disabled={saving || !hasChanges}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Save profile changes"
              accessibilityState={{
                disabled: saving || !hasChanges,
              }}
            >
              {saving ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />

                  <Text className="ml-3 text-base font-extrabold text-white">
                    Saving...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="save-outline" size={21} color="#FFFFFF" />

                  <Text className="mx-3 text-base font-extrabold text-white">
                    {hasChanges ? "Save Changes" : "Saved"}
                  </Text>

                  <Ionicons name="checkmark" size={21} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>

          <View className="mt-6 items-center">
            <Text className="text-sm font-medium italic text-[#79A9DB]">
              Better habits. Brighter future.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
