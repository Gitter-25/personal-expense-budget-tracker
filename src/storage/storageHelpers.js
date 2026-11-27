import AsyncStorage from "@react-native-async-storage/async-storage";

// Read a JSON array; an unused key starts with an empty list.
export async function readList(key) {
  const saved = await AsyncStorage.getItem(key);
  if (saved === null) return [];
  const records = JSON.parse(saved);
  if (!Array.isArray(records)) throw new Error(`Invalid stored records: ${key}`);
  return records;
}

// Write a whole list only after a successful update.
export async function writeList(key, records) {
  await AsyncStorage.setItem(key, JSON.stringify(records));
}

// Queue changes so overlapping writes in the same app session do not lose data.
let writeQueue = Promise.resolve();
export function updateList(key, change) {
  const operation = writeQueue.then(async () => {
    const records = await readList(key);
    const updated = change(records);
    await writeList(key, updated);
    return updated;
  });
  writeQueue = operation.catch(() => {});
  return operation;
}

// Create identifiers without depending on an online service.
export function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}
