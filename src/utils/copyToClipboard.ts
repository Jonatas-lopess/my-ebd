import Clipboard from "@react-native-clipboard/clipboard";
import { Alert } from "react-native/Libraries/Alert/Alert";

export default function copyToClipboard(text: string) {
  Clipboard.setString(text);
  Alert.alert("Texto copiado para a área de transferência.");
}
