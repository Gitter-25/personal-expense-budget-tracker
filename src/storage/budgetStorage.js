import { readList, updateList } from "./storageHelpers";

const BUDGETS_KEY = "pesotrack_budgets";

// Store months as YYYY-MM to avoid mixing different years.
export function getMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export async function getMonthlyBudget(userId, month = getMonthKey()) {
  if (!userId) throw new Error("A user ID is required.");
  const records = await readList(BUDGETS_KEY);
  return records.find((item) => item.user_id === userId && item.month === month) ?? null;
}

// An upsert updates only this user's matching month.
export async function saveMonthlyBudget(userId, month, amount) {
  if (!userId) throw new Error("A user ID is required.");
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new Error("Invalid budget month.");
  const value = Number(amount);
  if (!Number.isFinite(value) || value < 0) throw new Error("Enter a valid budget amount.");
  const budget = { user_id: userId, month, amount: value };
  await updateList(BUDGETS_KEY, (records) => {
    const others = records.filter((item) => !(item.user_id === userId && item.month === month));
    return [...others, budget];
  });
  return budget;
}
