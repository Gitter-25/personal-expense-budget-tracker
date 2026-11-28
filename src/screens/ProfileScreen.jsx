import ProfileBackground from "../components/ProfileBackground";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, Alert, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/ProfileScreen.styles";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { restoreSession } from "../storage/sessionStorage";
import { updateUserName } from "../storage/userStorage";

export default function ProfileScreen() {

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
  if (loading) {
    return (
      <SafeAreaView
        style={styles.layout}
        edges={["top", "left", "right", "bottom"]}
      >
        <View style={styles.screen}>
          <ActivityIndicator size="small" color="#1677F2" />
          <Text style={styles.screen2}>
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.layout}
      edges={["top", "left", "right", "bottom"]}
    >
      <ProfileBackground />
      <KeyboardAvoidingView
        style={styles.header3}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.header3}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.header2}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={24} color="#1677F2" />
            </TouchableOpacity>
            <View style={styles.header3}>
              <Text style={styles.header4}>
                My Profile
              </Text>
              <Text style={styles.header5}>
                Manage your account information
              </Text>
            </View>
          </View>

          {/* Profile summary */}
          <View style={styles.profileSummary}>
            <View style={styles.profileSummary2}>
              <Ionicons name="person" size={38} color="#1677F2" />
            </View>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={styles.profileSummary3}
            >
              {fullName.trim() || "PesoTrack User"}
            </Text>
            <Text
              numberOfLines={1}
              style={styles.profileSummary4}
            >
              {email || "No email available"}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email */}
            <Text style={styles.email}>Email</Text>
            <View style={styles.email2}>
              <Ionicons name="mail-outline" size={21} color="#8AA0BB" />
              <View style={styles.email3} />
              <TextInput
                style={styles.layout2}
                value={email}
                editable={false}
                accessibilityLabel="Email address"
              />
            </View>
            <Text style={styles.email}>
              Full Name
            </Text>
            <View style={styles.email4}>
              <Ionicons name="person-outline" size={21} color="#6EA8F4" />
              <View style={styles.email3} />
              <TextInput
                style={styles.layout3}
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
            <Text style={styles.email5}>
              {fullName.length}/80
            </Text>

            {/* Save */}
            <TouchableOpacity
              style={[styles.save, saving
                  ? styles.saveState
                  : hasChanges
                    ? styles.saveState2
                    : styles.saveState3]}
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
                  <Text style={styles.save2}>
                    Saving...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="save-outline" size={21} color="#FFFFFF" />
                  <Text style={styles.save3}>
                    {hasChanges ? "Save Changes" : "Saved"}
                  </Text>
                  <Ionicons name="checkmark" size={21} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.save4}>
            <Text style={styles.save5}>
              Better habits. Brighter future.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
