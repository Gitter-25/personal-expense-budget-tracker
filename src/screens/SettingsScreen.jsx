import SettingsBackground from "../components/SettingsBackground";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/SettingsScreen.styles";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function SettingsScreen() {

  const navigation = useNavigation();
  const { user, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [userLoadFailed, setUserLoadFailed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      setLoadingUser(true);
      setUserLoadFailed(false);

      if (!user) {
        setEmail("");
        setUserLoadFailed(true);
        return;
      }

      setEmail(user.email ?? "");
    } catch (error) {
      console.error("Unexpected error loading user:", error);
      setUserLoadFailed(true);
    } finally {
      setLoadingUser(false);
    }
  }, [user]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleLogout = () => {
    if (loggingOut) return;

    Alert.alert("Log Out", "Are you sure you want to log out of PesoTrack?", [
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

            await signOut();
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
      style={styles.layout}
      edges={["top", "left", "right"]}
    >
      <SettingsBackground />
      <ScrollView
        style={styles.header3}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.header2}>
            <Ionicons name="settings" size={26} color="#FFFFFF" />
          </View>
          <View style={styles.header3}>
            <Text style={styles.header4}>
              Settings
            </Text>
            <Text style={styles.header5}>
              Manage your account and preferences
            </Text>
          </View>
        </View>

        {/* Account */}
        <View style={styles.account}>
          <View style={styles.account2}>
            <View style={styles.account3}>
              <Ionicons name="person" size={28} color="#1677F2" />
            </View>
            <View style={styles.header3}>
              <Text style={styles.account4}>
                Account
              </Text>

              {loadingUser ? (
                <View style={styles.account5}>
                  <ActivityIndicator size="small" color="#1677F2" />
                  <Text style={styles.account6}>
                    Loading account...
                  </Text>
                </View>
              ) : userLoadFailed ? (
                <View style={styles.account7}>
                  <Text style={styles.account8}>
                    Unable to load account.
                  </Text>
                  <TouchableOpacity
                    style={styles.account9}
                    onPress={loadUser}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel="Retry loading account"
                  >
                    <Ionicons name="refresh" size={16} color="#1677F2" />
                    <Text style={styles.account10}>
                      Retry
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text numberOfLines={1} style={styles.account11}>
                  {email || "No email available"}
                </Text>
              )}
            </View>
          </View>

          {/* Profile */}
          <TouchableOpacity
            style={styles.profile}
            onPress={() => navigation.navigate("Profile")}
            disabled={loadingUser || loggingOut}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Open my profile"
            accessibilityHint="View and update your profile details"
            accessibilityState={{
              disabled: loadingUser || loggingOut,
            }}
          >
            <View style={styles.profile2}>
              <Ionicons name="person-outline" size={21} color="#1677F2" />
            </View>
            <View style={styles.header3}>
              <Text style={styles.profile3}>My Profile</Text>
              <Text style={styles.profile4}>
                View and update your profile details
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8AA0BB" />
          </TouchableOpacity>
        </View>

        {/* App information */}
        <View style={styles.appInformation}>
          <View style={styles.account2}>
            <View style={styles.appInformation2}>
              <Ionicons name="wallet" size={23} color="#1677F2" />
            </View>
            <View style={styles.header3}>
              <Text style={styles.appInformation3}>
                PesoTrack
              </Text>
              <Text style={styles.appInformation4}>
                Plan today. Build tomorrow.
              </Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logout, loggingOut ? styles.logoutState : styles.logoutState2]}
          onPress={handleLogout}
          disabled={loggingOut}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Log out"
          accessibilityState={{
            disabled: loggingOut,
          }}
        >
          {loggingOut ? (
            <>
              <ActivityIndicator size="small" color="#D92D5E" />
              <Text style={styles.logout2}>
                Logging out...
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="log-out-outline" size={21} color="#D92D5E" />
              <Text style={styles.logout3}>
                Log Out
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footer2}>PesoTrack</Text>
          <Text style={styles.footer3}>
            Better habits. Brighter future.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
