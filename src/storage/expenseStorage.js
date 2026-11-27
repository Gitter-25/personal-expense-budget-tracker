import { newId, readList, updateList } from "./storageHelpers";

const EXPENSES_KEY = "pesotrack_expenses";

// Always filter by user ID to keep accounts separated.
export async function getExpenses(userId) {
  if (!userId) throw new Error("A user ID is required.");
  const records = await readList(EXPENSES_KEY);
  return records.filter((record) => record.user_id === userId);
}

export async function getExpenseById(userId, expenseId) {
  const records = await getExpenses(userId);
  return records.find((record) => record.id === expenseId) ?? null;
}

// Keep category, date and description as part of each saved record.
export async function addExpense(userId, details) {
  if (!userId) throw new Error("A user ID is required.");
  const amount = Number(details.amount);
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Enter a valid expense amount.");
  const expense = {
    id: newId(),
    user_id: userId,
    amount,
    category: details.category,
    description: details.description ?? "",
    date: details.date ?? new Date().toISOString(),
    created_at: new Date().toISOString(),
  };
  await updateList(EXPENSES_KEY, (records) => [...records, expense]);
  return expense;
}

export async function updateExpense(userId, expenseId, changes) {
  if (!userId) throw new Error("A user ID is required.");
  const allowed = {};
  for (const key of ["amount", "category", "description", "date"]) {
    if (Object.prototype.hasOwnProperty.call(changes, key)) allowed[key] = changes[key];
  }
  if (allowed.amount !== undefined) {
    allowed.amount = Number(allowed.amount);
    if (!Number.isFinite(allowed.amount) || allowed.amount <= 0) {
      throw new Error("Enter a valid expense amount.");
    }
  }
  let updatedExpense = null;
  await updateList(EXPENSES_KEY, (records) =>
    records.map((record) => {
      if (record.id !== expenseId || record.user_id !== userId) return record;
      updatedExpense = { ...record, ...allowed };
      return updatedExpense;
    }),
  );
  if (!updatedExpense) throw new Error("Expense not found for this account.");
  return updatedExpense;
}

export async function deleteExpense(userId, expenseId) {
  if (!userId) throw new Error("A user ID is required.");
  let found = false;
  await updateList(EXPENSES_KEY, (records) => records.filter((record) => {
    if (record.id === expenseId && record.user_id === userId) {
      found = true;
      return false;
    }
    return true;
  }));
  if (!found) throw new Error("Expense not found for this account.");
}
