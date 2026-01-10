import structuredClone from "@ungap/structured-clone";

export function updateItemById<T extends Record<string, any>>(
  arr: T[],
  id: any,
  updater: (item: T) => T
): T[] {
  return arr.map((item) => {
    if (String(item.id) !== String(id)) return item;
    const copy = structuredClone(item);
    return updater(copy);
  });
}

export function replaceItemById<T extends Record<string, any>>(arr: T[], id: any, newItem: T): T[] {
  return arr.map((item) => (String(item.id) === String(id) ? structuredClone(newItem) : item));
}
