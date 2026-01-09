import {
  BottomSheetEventType,
  CustomBottomModal,
} from "@components/CustomBottomModal";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useAuth } from "@providers/AuthProvider";
import { _Class } from "@screens/ClassStack/ClassScreen/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { theme } from "@theme";
import config from "config";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, Keyboard, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";

type Props = {
  mutateFallback?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ClassForm({ mutateFallback }: Props) {
  const { token, user } = useAuth().authState;
  const EMPTYCLASSDATA: _Class = {
    name: "",
    group: undefined,
    flag: user?.plan ?? "",
  };
  const [inputs, setInputs] = useState<Partial<_Class>>(EMPTYCLASSDATA);
  const queryClient = useQueryClient();
  const optionsSheetRef = useRef<BottomSheetModal>(null);

  const handleOptionsSheet = useCallback((e: BottomSheetEventType<string>) => {
    if (e.type === "open") {
      Keyboard.dismiss();
      optionsSheetRef.current?.present();
    }
    if (e.type === "set") {
      setInputs((prev) => ({ ...prev, group: e.value }));
      optionsSheetRef.current?.dismiss();
    }
    if (e.type === "close") optionsSheetRef.current?.dismiss();
  }, []);

  const mutation = useMutation({
    mutationFn: async (classData: _Class) => {
      if (!token) {
        throw new Error("Authentication token missing.");
      }

      const res = await fetch(config.apiBaseUrl + "/classes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message = (data && data.message) || `Request failed with status ${res.status}`;
        const err = (data && data.error) || null;

        throw Object.assign(new Error(message), { cause: err, status: res.status });
      }

      return data;
    },
    onSuccess: () => {
      optionsSheetRef.current?.dismiss();
      setInputs(EMPTYCLASSDATA);
      return queryClient.invalidateQueries({ queryKey: ["altclass"] });
    },
    onError: (error: unknown) => {
      const defaultMessage =
        "Erro ao criar a turma. Confira sua conexão de internet e tente novamente.";
      const message =
        error && typeof (error as { message?: unknown }).message === "string"
          ? (error as { message: string }).message
          : defaultMessage;
          
      Alert.alert("Algo deu errado!", message);
      console.error("Create class error:", error);
    },
  });
  const { isPending, mutate } = mutation;

  function handleCreateNewClass() {
    if (!inputs.name || !inputs.group) {
      return Alert.alert("Alerta", "Preencha todos os campos.");
    }

    mutate(inputs as _Class);
  }

  useEffect(() => {
    mutateFallback?.(isPending);
  }, [isPending]);

  return (
    <>
      <ThemedView g="s">
        <TextInput
          placeholder="Nome*"
          placeholderTextColor="#a0a0a0"
          value={inputs.name}
          onChangeText={(text) =>
            setInputs((prev) => ({ ...prev, name: text }))
          }
          style={{
            borderWidth: 1,
            borderColor: theme.colors.lightgrey,
            borderRadius: 25,
            padding: theme.spacing.s,
          }}
        />
        <TouchableOpacity onPress={() => handleOptionsSheet({ type: "open" })}>
          <ThemedView
            padding="s"
            borderWidth={1}
            borderColor="lightgrey"
            borderRadius={25}
          >
            <ThemedText style={{ color: inputs.group ? "black" : "#a0a0a0" }}>
              {inputs.group ? inputs.group : "Faixa Etária"}
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>

        <CustomBottomModal.Action onPress={handleCreateNewClass} />
      </ThemedView>

      <CustomBottomModal.Root ref={optionsSheetRef} stackBehavior="push">
        <CustomBottomModal.Content title="Faixas Etárias">
          <FlatList
            data={[
              "Discipulados",
              "Adultos",
              "Jovens",
              "Adolescentes",
              "Crianças",
              "Maternal",
            ]}
            keyExtractor={(item) => item}
            style={{ marginBottom: theme.spacing.m }}
            contentContainerStyle={{ gap: theme.spacing.s }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleOptionsSheet({ type: "set", value: item })}
              >
                <ThemedView
                  py="s"
                  px="m"
                  borderWidth={1}
                  borderColor="lightgrey"
                  borderRadius={25}
                >
                  <ThemedText>{item}</ThemedText>
                </ThemedView>
              </TouchableOpacity>
            )}
          />
        </CustomBottomModal.Content>
      </CustomBottomModal.Root>
    </>
  );
}
