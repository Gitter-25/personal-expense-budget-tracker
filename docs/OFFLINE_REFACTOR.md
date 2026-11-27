# Offline foundation

This replaces the earlier foundation proposal. No screens are connected yet.
On Android install compatible dependencies with:
```powershell
npx expo install --fix
npx expo install expo-crypto expo-secure-store
npm install @noble/hashes@1.8.0
npx expo-doctor
```
Dependency lockfile changes must be generated and verified locally. SecureStore targets native Android/iOS, not web.
The password utility uses salted PBKDF2-SHA256 (600,000 iterations); benchmark on the target device.
AsyncStorage is not encrypted and local account separation is not a security boundary against device tampering.
Existing Supabase data is not imported. Existing screens still use Supabase.
Next milestone: connect authentication and navigation, then migrate expense screens and test persistence.
