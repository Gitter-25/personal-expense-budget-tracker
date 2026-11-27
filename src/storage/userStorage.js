import * as Crypto from "expo-crypto";
import { readList, updateList } from "./storageHelpers";
import { createPassword, verifyPassword } from "../utils/passwordUtils";

const USERS_KEY = "pesotrack_users";
const normalizeEmail = (email) => email.trim().toLowerCase();

// Never return password information to screens.
function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

export async function registerUser({ name, email, password, confirmPassword }) {
  name = name.trim();
  email = normalizeEmail(email);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid name and email.");
  }
  if (password.length < 8) throw new Error("Use at least 8 characters.");
  if (password !== confirmPassword) throw new Error("Passwords do not match.");
  const credentials = await createPassword(password);
  const user = { id: Crypto.randomUUID(), name, email, ...credentials };
  // Check duplicate emails inside the queued update.
  await updateList(USERS_KEY, (users) => {
    if (users.some((item) => item.email === email)) throw new Error("Email already registered.");
    return [...users, user];
  });
  return publicUser(user);
}

export async function loginUser(email, password) {
  const users = await readList(USERS_KEY);
  const user = users.find((item) => item.email === normalizeEmail(email));
  if (!user || !(await verifyPassword(password, user))) {
    throw new Error("Invalid email or password.");
  }
  return publicUser(user);
}

export async function getUserById(id) {
  const user = (await readList(USERS_KEY)).find((item) => item.id === id);
  return user ? publicUser(user) : null;
}

export async function updateUserName(id, name) {
  name = name.trim();
  if (!name) throw new Error("Enter your name.");
  let updated;
  await updateList(USERS_KEY, (users) => {
    if (!users.some((item) => item.id === id)) throw new Error("Account not found.");
    return users.map((item) => {
      if (item.id !== id) return item;
      updated = { ...item, name };
      return updated;
    });
  });
  return publicUser(updated);
}
