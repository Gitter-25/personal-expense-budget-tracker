import { readList, updateList } from "./storageHelpers";

const CATEGORIES_KEY = "pesotrack_categories";
const DEFAULT_CATEGORIES = ["Food", "Transport", "Shopping", "Bills"];

// Provide the four course-project categories for each account.
export async function getCategories(userId) {
  if (!userId) throw new Error("A user ID is required.");
  const records = await readList(CATEGORIES_KEY);
  const saved = records.find((item) => item.user_id === userId);
  return saved ? saved.categories : [...DEFAULT_CATEGORIES];
}

export async function ensureDefaultCategories(userId) {
  if (!userId) throw new Error("A user ID is required.");
  await updateList(CATEGORIES_KEY, (records) => {
    if (records.some((item) => item.user_id === userId)) return records;
    return [...records, { user_id: userId, categories: [...DEFAULT_CATEGORIES] }];
  });
  return getCategories(userId);
}
