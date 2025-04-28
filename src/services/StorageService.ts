import * as SecureStore from "expo-secure-store";

export default class StorageService {
  static setItem(key: string, value: any) {
    return SecureStore.setItem(key, value);
  }

  static getItem(key: string) {
    const data = SecureStore.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  static async removeItem(key: string) {
    return await SecureStore.deleteItemAsync(key);
  }
}
