
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

import { useAuth } from "../context/AuthContext";

export default function useSettings() {
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

  return { navigation, email, loadingUser, userLoadFailed, loggingOut, loadUser, handleLogout };
}
