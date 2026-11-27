import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "../storage/userStorage";
import { createSession, restoreSession, clearSession } from "../storage/sessionStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadSession() {
    setLoading(true);
    setError(null);
    try {
      setUser(await restoreSession());
    } catch (error) {
      setError(error.message || "Unable to restore session.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadSession(); }, []);

  async function signIn(email, password) {
    const account = await loginUser(email, password);
    await createSession(account.id);
    setUser(account);
  }

  async function signOut() {
    await clearSession();
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, error, loadSession, signIn, signOut }}>
    {children}
  </AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
