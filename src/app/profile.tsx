import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function ProfileScreen() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert("Error", "Unable to load your account.");
      router.replace("/login");
      return;
    }

    setEmail(user.email ?? "");

    const { data, error } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (error) {
      Alert.alert("Error", "Unable to load your profile.");
      setLoading(false);
      return;
    }

    setFullName(data.full_name ?? "");
    setLoading(false);
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Missing information", "Please enter your full name.");
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      Alert.alert("Error", "Your session has expired. Please log in again.");
      router.replace("/login");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      Alert.alert("Save failed", error.message);
      return;
    }

    Alert.alert("Profile saved", "Your profile has been updated.");
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-base text-gray-500">Loading profile...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 px-6 pt-16">
      <TouchableOpacity onPress={() => router.back()}>
        <Text className="text-base font-semibold text-blue-600">← Back</Text>
      </TouchableOpacity>

      <View className="mb-8 mt-6">
        <Text className="text-3xl font-bold text-gray-900">My Profile</Text>

        <Text className="mt-2 text-base text-gray-500">
          Manage your account information
        </Text>
      </View>

      <View className="rounded-2xl bg-white p-6">
        <Text className="mb-2 text-sm font-semibold text-gray-700">Email</Text>

        <TextInput
          className="mb-5 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
          value={email}
          editable={false}
        />

        <Text className="mb-2 text-sm font-semibold text-gray-700">
          Full Name
        </Text>

        <TextInput
          className="mb-6 rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
          placeholder="Enter your full name"
          placeholderTextColor="#9CA3AF"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />

        <TouchableOpacity
          className={`items-center rounded-xl py-4 ${
            saving ? "bg-blue-400" : "bg-blue-600"
          }`}
          onPress={handleSave}
          disabled={saving}
        >
          <Text className="text-base font-bold text-white">
            {saving ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
