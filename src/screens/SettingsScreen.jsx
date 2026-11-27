import SettingsBackground from "../components/SettingsBackground";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

// UI styles: edit these values during visual debugging.
const styles = StyleSheet.create({
  header: {marginBottom: 28, flexDirection: "row", alignItems: "center"},
  header2: {marginRight: 12, height: 48, width: 48, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: "#1677F2"},
  header3: {flex: 1},
  header4: {fontSize: 26, fontWeight: "800", color: "#071B46"},
  header5: {marginTop: 2, fontSize: 14, lineHeight: 20, color: "#66758D"},
  account: {borderRadius: 26, borderWidth: 1, borderColor: "#E3EDF8", backgroundColor: "#FFFFFF", padding: 20},
  account2: {flexDirection: "row", alignItems: "center"},
  account3: {marginRight: 16, height: 56, width: 56, alignItems: "center", justifyContent: "center", borderRadius: 9999, backgroundColor: "#EAF3FF"},
  account4: {fontSize: 20, fontWeight: "800", color: "#071B46"},
  account5: {marginTop: 8, flexDirection: "row", alignItems: "center"},
  account6: {marginLeft: 8, fontSize: 14, lineHeight: 20, color: "#718096"},
  account7: {marginTop: 8},
  account8: {fontSize: 14, lineHeight: 20, color: "#D92D5E"},
  account9: {marginTop: 8, alignSelf: "flex-start", flexDirection: "row", alignItems: "center"},
  account10: {marginLeft: 4, fontSize: 14, lineHeight: 20, fontWeight: "700", color: "#1677F2"},
  account11: {marginTop: 4, fontSize: 14, lineHeight: 20, color: "#66758D"},
  profile: {marginTop: 24, flexDirection: "row", alignItems: "center", borderRadius: 16, backgroundColor: "#F7FAFF", paddingHorizontal: 16, paddingVertical: 16},
  profile2: {marginRight: 12, height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 9999, backgroundColor: "#E8F2FF"},
  profile3: {fontWeight: "700", color: "#071B46"},
  profile4: {marginTop: 2, fontSize: 12, lineHeight: 16, color: "#7A879A"},
  appInformation: {marginTop: 20, borderRadius: 26, borderWidth: 1, borderColor: "#E3EDF8", backgroundColor: "#FFFFFF", padding: 20},
  appInformation2: {marginRight: 12, height: 44, width: 44, alignItems: "center", justifyContent: "center", borderRadius: 9999, backgroundColor: "#EAF3FF"},
  appInformation3: {fontSize: 18, fontWeight: "800", color: "#071B46"},
  appInformation4: {marginTop: 4, fontSize: 14, lineHeight: 20, color: "#718096"},
  logoutState: {backgroundColor: "#F5B5C5"},
  logoutState2: {backgroundColor: "#FDE8EE"},
  logout: {marginTop: 24, minHeight: 56, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 16},
  logout2: {marginLeft: 12, fontWeight: "800", color: "#D92D5E"},
  logout3: {marginLeft: 8, fontWeight: "800", color: "#D92D5E"},
  footer: {marginTop: 28, alignItems: "center"},
  footer2: {fontSize: 12, lineHeight: 16, fontWeight: "500", color: "#9AA8B9"},
  footer3: {marginTop: 4, fontSize: 11, color: "#AAB5C3"},
  layout: {flex: 1, backgroundColor: "#F4F9FF"},
  scrollContent: {paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40},
});
