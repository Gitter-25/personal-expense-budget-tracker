# PesoTrack offline refactor — milestone 1

This branch adds a standalone AsyncStorage data layer for expenses, monthly budgets, and the four default categories. **The application screens still use Supabase.** The UI, routing, login, and expense flows have intentionally not changed yet.

## Current repository vs intended final app
- Current: Expo Router, TypeScript/TSX, NativeWind and Supabase.
- Target: JavaScript/JSX, React Navigation Native Stack, offline AsyncStorage.
- AsyncStorage is already installed in package.json; do not reinstall it.
- Do not remove Supabase or routing dependencies until all screens have been migrated and tested.
- Existing Supabase records are **not** transferred to device storage by these helpers.

## New modules
- `src/storage/storageHelpers.js`: JSON list IO and serialized updates.
- `src/storage/expenseStorage.js`: user-scoped expense create/read/update/delete.
- `src/storage/budgetStorage.js`: user/month-scoped budget retrieval and saving.
- `src/storage/categoryStorage.js`: four per-user default categories.

All modules accept a user ID provided by the eventual offline authentication layer. Never use user-controlled account IDs as proof of identity in a production app; this is an offline coursework design.

## Test plan (next milestone)
1. Create offline user and session storage with password hashing.
2. Adapt authentication screens while preserving their JSX/styling.
3. Connect expense screens to storage helpers and verify CRUD, including relaunch persistence.
4. Connect budget/home/statistics and ensure user isolation and monthly calculations.
5. Migrate navigation, remove obsolete Supabase/TypeScript files and packages, then run Expo diagnostics.

Do not merge this milestone as a fully working offline app: these files are not yet connected to the screens.
