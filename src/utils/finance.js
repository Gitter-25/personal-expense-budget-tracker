import { ensureDefaultCategories } from "../storage/categoryStorage";
const icons = { Food: "restaurant-outline", Transport: "car-outline", Shopping: "cart-outline", Bills: "receipt-outline" };
export async function getCategoryOptions(userId) {
  return (await ensureDefaultCategories(userId)).map(name => ({ id: name, name, icon: icons[name] }));
}
// Convert saved records to the existing screen display format.
export function toScreenExpense(record) {
  return { ...record, category_id: record.category, expense_date: record.date.slice(0, 10) };
}
