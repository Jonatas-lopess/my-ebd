import { CustomBottomModal } from "@components/CustomBottomModal";
import ThemedView from "@components/ThemedView";
import { useAuth } from "@providers/AuthProvider";
import { useTheme } from "@shopify/restyle";
import { useMutation } from "@tanstack/react-query";
import { ThemeProps } from "@theme";
import config from "config";
import { useState } from "react";
import { Alert, TextInput } from "react-native";

export default function BranchForm() {
  const theme = useTheme<ThemeProps>();
  const { token } = useAuth().authState;
  const [code, setCode] = useState<string>();

  const { mutate } = useMutation({
    mutationFn: async (code: string) => {
      const res = await fetch(config.apiBaseUrl + "/afiliation", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "branch",
          identifier: code,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message, { cause: data.error });

      return data;
    },
  });

  function handleSubmit() {
    if (code === undefined) return;

    mutate(code);
    setCode(undefined);
    Alert.alert("Pedido enviado... A filial deve aceitá-lo em até 7 dias.");
  }

  return (
    <ThemedView g="s">
      <TextInput
        placeholder="Código*"
        placeholderTextColor="#a0a0a0"
        value={code}
        onChangeText={setCode}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.lightgrey,
          borderRadius: 25,
          padding: theme.spacing.s,
        }}
      />

      <CustomBottomModal.Action onPress={handleSubmit} text="Confirmar" />
    </ThemedView>
  );
}
