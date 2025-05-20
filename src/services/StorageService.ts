import * as SecureStore from "expo-secure-store";

export default class StorageService {
  static setItem(key: string, value: any) {
    return SecureStore.setItemAsync(key, value);
  }

  static getItem(key: string) {
    return SecureStore.getItemAsync(key);
  }

  static async removeItem(key: string) {
    return await SecureStore.deleteItemAsync(key);
  }
}
