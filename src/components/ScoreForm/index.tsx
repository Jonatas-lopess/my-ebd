import {
  BottomSheetEventType,
  CustomBottomModal,
} from "@components/CustomBottomModal";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useAuth } from "@providers/AuthProvider";
import { Score } from "@screens/StatisticsDrawer/SettingsStack/ScoreOptions/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { theme } from "@theme";
import config from "config";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, TextInput, TouchableOpacity } from "react-native";

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
    if (e.type === "open") optionsSheetRef.current?.present();
    if (e.type === "set") {
      setTempScore((prev) => ({
        ...prev,
        type: e.value as Score["type"],
      }));
      optionsSheetRef.current?.dismiss();
    }
    if (e.type === "close") optionsSheetRef.current?.dismiss();
  }, []);

  const { isPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch(config.apiBaseUrl + "/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tempScore),
      });

      return await response.json();
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["scores"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  function createNewScore() {
    if (
      tempScore.type === undefined ||
      tempScore.title === undefined ||
      tempScore.weight === undefined
    )
      return Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");

    console.log(tempScore);
    //mutate();
    optionsSheetRef.current?.dismiss();
    setTempScore({ flag: user?.plan });
  }

  useEffect(() => {
    mutateFallback(isPending);
  }, [isPending]);

  return (
    <>
      <ThemedView>
        <TextInput
          placeholder="Título"
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
