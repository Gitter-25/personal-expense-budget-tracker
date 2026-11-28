import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { getUserById } from "./userStorage";

const SESSION_KEY = "pesotrack_session";

// Save the account ID using storage supported by the platform.
export async function createSession(userId) {
  if (!(await getUserById(userId))) {
    throw new Error("Account not found.");
  }

  if (Platform.OS === "web") {
    await AsyncStorage.setItem(SESSION_KEY, userId);
  } else {
    await SecureStore.setItemAsync(SESSION_KEY, userId);
  }
}

// Restore the saved account when the app opens.
export async function restoreSession() {
  let id;

  if (Platform.OS === "web") {
    id = await AsyncStorage.getItem(SESSION_KEY);
  } else {
    id = await SecureStore.getItemAsync(SESSION_KEY);
  }

  if (!id) return null;

  const user = await getUserById(id);
  if (!user) await clearSession();
  return user;
}

// Remove the session when the user logs out.
export async function clearSession() {
  if (Platform.OS === "web") {
    await AsyncStorage.removeItem(SESSION_KEY);
  } else {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }
}
