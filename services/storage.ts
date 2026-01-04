import AsyncStorage from '@react-native-async-storage/async-storage';

export const persistStorageItem = async (itemName: string, data: any) => {
  try {
    await AsyncStorage.setItem(itemName, JSON.stringify(data));
  } catch (_) {}
};

export const getStorageItem = async (itemName: string) => {
  try {
    const dataStr = await AsyncStorage.getItem(itemName);
    if (dataStr) {
      const data = JSON.parse(dataStr || '') || {};
      return data;
    }
  } catch (_) {
    return undefined;
  }
};

export const removeStorageItem = async (itemName: string) => {
  try {
    await AsyncStorage.removeItem(itemName);
  } catch (_) {
    return undefined;
  }
};
