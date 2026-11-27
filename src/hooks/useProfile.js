
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Keyboard } from "react-native";

import { restoreSession } from "../storage/sessionStorage";
import { updateUserName } from "../storage/userStorage";

export default function useProfile() {
  const navigation = useNavigation();
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

      const user = await restoreSession();

      if (!user) {
        Alert.alert(
          "Session error",
          "Your account could not be verified. Please log in again.",
        );

        navigation.goBack();
        return;
      }

      setEmail(user.email ?? "");

      const loadedName = user.name;

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

      const user = await restoreSession();

      if (!user) {
        Alert.alert(
          "Session error",
          "Your session could not be verified. Please log in again.",
        );

        navigation.goBack();
        return;
      }

      await updateUserName(user.id, trimmedName);

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

  const hasChanges = fullName.trim() !== originalFullName.trim();

  return { navigation, email, fullName, setFullName, loading, saving, handleSave, hasChanges };
}
