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
      const res = await fetch(config.apiBaseUrl + "/classes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message, { cause: data.error });

      return data;
    },
    onSuccess: () => {
      optionsSheetRef.current?.dismiss();
      return queryClient.invalidateQueries({ queryKey: ["altclass"] });
    },
    onError: (error) => {
      Alert.alert(
        "Algo deu errado!",
        `Erro ao criar a turma. Confira sua conexão de internet e tente novamente.`
      );
      console.log(error.message, error.cause);
    },
  });
  const { isPending, mutate } = mutation;

  function handleCreateNewClass() {
    if (!inputs.name || !inputs.group) {
      return Alert.alert("Alerta", "Preencha todos os campos.");
    }

    //console.log(inputs);
    mutate(inputs as _Class);
    optionsSheetRef.current?.dismiss();
    setInputs(EMPTYCLASSDATA);
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
