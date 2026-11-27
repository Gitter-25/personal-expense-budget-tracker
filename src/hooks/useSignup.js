
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert } from "react-native";

import { registerUser } from "../storage/userStorage";

export default function useSignup() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (loading) return;

    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim() || !trimmedEmail || !password || !confirmPassword) {
      Alert.alert("Missing information", "Please complete all fields.");
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      // Register locally; no email confirmation or internet is required.
      await registerUser({ name, email: trimmedEmail, password, confirmPassword });
      Alert.alert("Account created", "You can now log in.", [
        { text: "Go to Login", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      Alert.alert("Signup failed", message);
    } finally {
      setLoading(false);
    }
  };

  return { navigation, name, setName, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, loading, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, handleSignup };
}
