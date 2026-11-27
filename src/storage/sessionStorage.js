import * as SecureStore from "expo-secure-store";
import { getUserById } from "./userStorage";

const SESSION_KEY = "pesotrack_session";

// Store only the local authenticated account ID in encrypted native storage.
export async function createSession(userId) {
  if (!(await getUserById(userId))) throw new Error("Account not found.");
  await SecureStore.setItemAsync(SESSION_KEY, userId);
}

export async function restoreSession() {
  const id = await SecureStore.getItemAsync(SESSION_KEY);
  if (!id) return null;
  const user = await getUserById(id);
  if (!user) await clearSession();
  return user;
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
