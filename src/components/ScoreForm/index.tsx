import {
  BottomSheetEventType,
  CustomBottomModal,
} from "@components/CustomBottomModal";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useAuth } from "@providers/AuthProvider";
import { Score } from "@screens/ScoreOptions/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { theme } from "@theme";
import config from "config";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  TextInput,
  TouchableOpacity,
} from "react-native";

type Props = {
  mutateFallback: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ScoreForm({ mutateFallback }: Props) {
  const optionsSheetRef = useRef<BottomSheetModal>(null);
  const queryClient = useQueryClient();

  const { user, token } = useAuth().authState;
  const [tempScore, setTempScore] = useState<Partial<Score>>({
    flag: user?.plan,
  });

  const handleOptionsSheet = useCallback((e: BottomSheetEventType) => {
    if (e.type === "open") {
      Keyboard.dismiss();
      optionsSheetRef.current?.present();
    }
    if (e.type === "set") {
      setTempScore((prev) => ({
        ...prev,
        type: e.value as Score["type"],
      }));
      optionsSheetRef.current?.dismiss();
    }
    if (e.type === "close") optionsSheetRef.current?.dismiss();
  }, []);

  const { isPending, mutate } = useMutation({
    mutationFn: async (scoreInfo: Score) => {
      const response = await fetch(config.apiBaseUrl + "/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(scoreInfo),
      });

      return await response.json();
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["scores"] });
    },
    onError: (err) => {
      Alert.alert(
        "Algo deu errado!",
        `Erro ao criar o registro. Confira sua conexão de internet e tente novamente.`
      );
      console.log(err.message, err.cause);
    },
  });

  function createNewScore() {
    if (
      tempScore.type === undefined ||
      tempScore.title === undefined ||
      tempScore.weight === undefined
    )
      return Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");

    mutate(tempScore as Score);
    optionsSheetRef.current?.dismiss();
    setTempScore({ flag: user?.plan });
  }

  useEffect(() => {
    mutateFallback(isPending);
  }, [isPending]);

  return (
    <>
      <ThemedView g="s">
        <TextInput
          placeholder="Título"
          placeholderTextColor="#a0a0a0"
          value={tempScore.title}
          onChangeText={(text) =>
            setTempScore((prev) => ({ ...prev, title: text }))
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
            <ThemedText style={{ color: tempScore.type ? "black" : "#a0a0a0" }}>
              {tempScore.type ? tempScore.type : "Tipo"}
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>
        <TextInput
          placeholder="Valor"
          value={tempScore.weight?.toString()}
          placeholderTextColor="#a0a0a0"
          keyboardType="numeric"
          onChangeText={(text) =>
            setTempScore((prev) => ({ ...prev, weight: Number(text) }))
          }
          style={{
            borderWidth: 1,
            borderColor: theme.colors.lightgrey,
            borderRadius: 25,
            padding: theme.spacing.s,
          }}
        />
        <CustomBottomModal.Action onPress={createNewScore} />
      </ThemedView>

      <CustomBottomModal.Root ref={optionsSheetRef} stackBehavior="push">
        <CustomBottomModal.Content title="Tipos de Pontuação">
          <FlatList
            data={["BooleanScore", "NumberScore"]}
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
                  <ThemedText>
                    {item === "BooleanScore"
                      ? "Pontuação Booleana"
                      : "Pontuação Numérica"}
                  </ThemedText>
                </ThemedView>
              </TouchableOpacity>
            )}
          />
        </CustomBottomModal.Content>
      </CustomBottomModal.Root>
    </>
  );
}
