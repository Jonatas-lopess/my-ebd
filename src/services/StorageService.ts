import * as SecureStore from "expo-secure-store";

export default class StorageService {
  static setItem(key: string, value: any) {
    return SecureStore.setItem(key, value);
  }

  static getItem(key: string) {
    return SecureStore.getItem(key);
  }

  static async removeItem(key: string) {
    return await SecureStore.deleteItemAsync(key);
  }
}
