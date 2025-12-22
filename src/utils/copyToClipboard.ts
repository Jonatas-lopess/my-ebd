import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";

export default async function copyToClipboard(text: string) {
  await Clipboard.setStringAsync(text);
  Toast.show({
    type: "success",
    text1: "Texto copiado para a área de transferência.",
  });
}
