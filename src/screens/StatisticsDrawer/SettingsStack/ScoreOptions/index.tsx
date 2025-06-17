import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { StackHeader } from "@components/StackHeader";
import ThemedView from "@components/ThemedView";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "@theme";
import { CustomCard } from "@components/CustomCard";
import { Alert, FlatList, TextInput, TouchableOpacity } from "react-native";
import TextButton from "@components/TextButton";
import ThemedText from "@components/ThemedText";
import CustomIcon from "@components/CustomIcon";
import {
  BottomSheetEventType,
  CustomBottomModal,
} from "@components/CustomBottomModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import { Score } from "./type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import config from "config";
import { useAuth } from "@providers/AuthProvider";

export default function ScoreOptions() {
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { token, user } = useAuth().authState;
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const optionsSheetRef = useRef<BottomSheetModal>(null);
  const [tempScore, setTempScore] = useState<Partial<Score>>({
    flag: user?.plan,
  });

  const { data } = useQuery({
    queryKey: ["scores"],
    queryFn: async (): Promise<Score[]> => {
      const response = await fetch(config.apiBaseUrl + "/scores", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await response.json();
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (score: Score) => {
      const response = await fetch(config.apiBaseUrl + "/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(score),
      });

      return await response.json();
    },
    onSuccess: () => {
      handleCloseBottomSheet();
      return queryClient.invalidateQueries({ queryKey: ["scores"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    setTempScore({});
    handleOptionsSheet({ type: "close" });
    bottomSheetRef.current?.dismiss();
  }, [tempScore]);

  function createNewScore() {
    if (
      tempScore.type === undefined ||
      tempScore.title === undefined ||
      tempScore.weight === undefined
    )
      return Alert.alert("Please fill in all fields");
    mutate(tempScore as Score);
  }

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

  return (
    <>
      <FocusAwareStatusBar style="dark" translucent />

      <StackHeader.Root>
        <StackHeader.Content>
          <StackHeader.Action
            name="arrow-back"
            onPress={() => navigation.goBack()}
            color={theme.colors.gray}
          />
          <StackHeader.Title>Pontuação</StackHeader.Title>
        </StackHeader.Content>
        <StackHeader.Action
          name="add-outline"
          onPress={handleOpenBottomSheet}
          color={theme.colors.gray}
        />
      </StackHeader.Root>

      <ThemedView flex={1} py="s" backgroundColor="white">
        <CustomCard.Root>
          <CustomCard.Detail>
            Lista de opções para pontuar alunos e professores. Clique sobre o
            campo para editar, caso deseje.
          </CustomCard.Detail>
          <FlatList
            data={data}
            contentContainerStyle={{ gap: theme.spacing.xs }}
            renderItem={({ item }) => (
              <TextButton
                variant="outline"
                justifyContent="space-between"
                onClick={() => {}}
              >
                <ThemedText fontSize={16}>{item.title}</ThemedText>
                <ThemedView gap="xs" flexDirection="row" alignItems="center">
                  <CustomIcon name="star" color="#ffd700" size={20} />
                  <ThemedText>{item.weight}</ThemedText>
                </ThemedView>
              </TextButton>
            )}
          />
        </CustomCard.Root>
      </ThemedView>

      <CustomBottomModal.Root
        ref={bottomSheetRef}
        onDismiss={handleCloseBottomSheet}
      >
        <CustomBottomModal.Content
          title="Nova Pontuação"
          subtitle="Preencha o título, tipo e valor da pontuação."
        >
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
          <TouchableOpacity
            onPress={() => handleOptionsSheet({ type: "open" })}
          >
            <ThemedView
              padding="s"
              borderWidth={1}
              borderColor="lightgrey"
              borderRadius={25}
            >
              <ThemedText
                style={{ color: tempScore.type ? "black" : "#a0a0a0" }}
              >
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
        </CustomBottomModal.Content>
        <CustomBottomModal.Action onPress={createNewScore} />
      </CustomBottomModal.Root>

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
