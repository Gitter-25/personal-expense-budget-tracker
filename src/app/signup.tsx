import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email.trim() || !password || !confirmPassword) {
      Alert.alert("Missing information", "Please complete all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Signup failed", error.message);
      return;
    }

    Alert.alert(
      "Account created",
      "Your account has been created. You can now log in.",
      [
        {
          text: "OK",
          onPress: () => router.replace("/login"),
        },
      ],
    );
  };

  return (
    <View className="flex-1 justify-center bg-gray-100 px-6">
      <View className="mb-8">
        <Text className="text-4xl font-bold text-gray-900">Budget Tracker</Text>

        <Text className="mt-2 text-base text-gray-500">
          Create your account
        </Text>
      </View>

      <View className="rounded-2xl bg-white p-6">
        <Text className="mb-6 text-2xl font-bold text-gray-900">Sign Up</Text>

        <Text className="mb-2 text-sm font-semibold text-gray-700">Email</Text>

        <TextInput
          className="mb-4 rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
          placeholder="Enter your email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <Text className="mb-2 text-sm font-semibold text-gray-700">
          Password
        </Text>

        <TextInput
          className="mb-4 rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
          placeholder="Create a password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text className="mb-2 text-sm font-semibold text-gray-700">
          Confirm Password
        </Text>

        <TextInput
          className="mb-6 rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
          placeholder="Confirm your password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          className={`items-center rounded-xl py-4 ${
            loading ? "bg-blue-400" : "bg-blue-600"
          }`}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text className="text-base font-bold text-white">
            {loading ? "Creating account..." : "Create Account"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-5 items-center"
          onPress={() => router.replace("/login")}
        >
          <Text className="text-gray-500">
            Already have an account?{" "}
            <Text className="font-bold text-blue-600">Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
