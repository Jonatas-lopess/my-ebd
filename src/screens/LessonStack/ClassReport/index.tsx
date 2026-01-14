import { CustomCard } from "@components/CustomCard";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { StackHeader } from "@components/StackHeader";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { LessonStackProps } from "@custom/types/navigation";
import { ScrollView, FlatList, Alert, ActivityIndicator, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "@theme";
import { useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import TextButton from "@components/TextButton";
import { CustomBottomModal } from "@components/CustomBottomModal";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import config from "config";
import { useAuth } from "@providers/AuthProvider";
import { Rollcall } from "../type";
import { Score } from "@screens/ScoreOptions/type";
import ScoreOption from "@components/ScoreOption";
import { Lesson } from "../LessonScreen/type";
import { updateItemById } from "utils/immutability";
import Toast from "react-native-toast-message";


export default function ClassReport({
  route,
}: LessonStackProps<"ClassReport">) {
  const { classId, lessonId } = route.params;
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const theme = useTheme<ThemeProps>();
  const { token } = useAuth().authState;
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [tempItem, setTempItem] = useState<Partial<Rollcall>>({});

  const { data: classData } = useQuery({
    queryKey: ["classDetails", classId],
    queryFn: async (): Promise<{ name: string }> => {
      const res = await fetch(
        config.apiBaseUrl + `/classes/${classId}?select=name`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.message, { cause: resJson.error });

      return resJson;
    },
    enabled: !!classId && !!token,
  });

  const { data: lessonInfo, isSuccess } = useQuery({
    queryKey: ["lessonInfo", lessonId],
    queryFn: async (): Promise<Lesson> => {
      const response = await fetch(config.apiBaseUrl + `/lessons/${lessonId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const resJson = await response.json();
      if (!response.ok)
        throw new Error(resJson.message, { cause: resJson.error });

      return resJson;
    },
    enabled: !!lessonId && !!token,
  });

  const {
    data: scoreInfo,
    isLoading: isLoadingScores,
    isError: isErrorScores,
  } = useQuery({
    queryKey: ["scores"],
    queryFn: async (): Promise<Score[]> => {
      const response = await fetch(config.apiBaseUrl + "/scores", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const resJson = await response.json();
      if (!response.ok)
        throw new Error(resJson.message, { cause: resJson.error });

      return resJson;
    },
    enabled: !!token,
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["classReport", lessonId, classId],
    queryFn: async (): Promise<Rollcall[]> => {
      const res = await fetch(
        config.apiBaseUrl + `/rollcalls?class=${classId}&lesson=${lessonId}&hasUser=false`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.message, { cause: resJson.error });

      return resJson;
    },
    enabled: !!classId && !!token,
  });

  const { mutate } = useMutation({
    mutationFn: async (data: Rollcall[]) => {
      const res = await fetch(config.apiBaseUrl + "/report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          list: data,
          isFinished: false,
        }),
      });

      return res.json();
    },
    onSuccess: () => {
      bottomSheetRef.current?.close();
      queryClient.invalidateQueries({ queryKey: ["lessonInfo", lessonId] });
      queryClient.invalidateQueries({
        queryKey: ["teacherRollcalls", lessonId],
      });
      navigation.goBack();
    },
    onError: (error) => {
      console.log(error.message, error.cause);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível salvar o relatório. Tente novamente mais tarde.",
      });
    },
  });

  function handleOpenBottomSheet(item: Rollcall) {
    setTempItem(item);
    bottomSheetRef.current?.present();
  };

  function onSheetDismiss() {
    setTempItem({});
  }

  function handleSaveReportChanges() {
    queryClient.setQueryData<Rollcall[]>(["classReport", lessonId, classId], (prev) => {
      if (!prev) return prev;

      return updateItemById(prev, tempItem._id, (item) => ({
        ...item,
        score: (tempItem.score) ?? item.score,
        isPresent: true,
      }));
    });

    bottomSheetRef.current?.close();
  };

  function saveReport() {
    if (lessonInfo?.isFinished) return;

    Alert.alert("Atenção", "Tem certeza que deseja finalizar o registro?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: () => {
          if (!data) return Toast.show({
            type: "error",
            text1: "Erro",
            text2: "Nenhum dado para salvar.",
          });

          mutate(data);
        },
      },
    ]);
  }

  return (
    <ThemedView flex={1} style={{ backgroundColor: "white" }}>
      <FocusAwareStatusBar style="dark" translucent />

      <StackHeader.Root>
        <StackHeader.Content>
          <StackHeader.Action
            name="arrow-back"
            onPress={() => navigation.goBack()}
            color={theme.colors.gray}
          />
          <StackHeader.Title>{classData?.name ?? "-"}</StackHeader.Title>
        </StackHeader.Content>
        {isSuccess && lessonInfo.isFinished === undefined && (
          <StackHeader.Action
            name={isEditable ? "close" : "pencil"}
            onPress={() => setIsEditable((prev) => !prev)}
            color={theme.colors.gray}
          />
        )}
      </StackHeader.Root>

      <ThemedView flex={1} padding="s" backgroundColor="white">
        <ScrollView nestedScrollEnabled contentContainerStyle={{ gap: 10 }}>
          <CustomCard.Root borderRadius={20}>
            <CustomCard.Title>Chamada dos Alunos</CustomCard.Title>
            <CustomCard.Detail>
              Clique sobre os nomes dos alunos para confirmar a presença.
            </CustomCard.Detail>
            {isLoading && <ActivityIndicator size="small" />}
            {isError && (
              <ThemedView flex={1} justifyContent="center" alignItems="center">
                <ThemedText>
                  Erro ao carregar a chamada: {error?.message}
                </ThemedText>
              </ThemedView>
            )}
            {data && (
              <FlatList
                data={data}
                scrollEnabled={false}
                contentContainerStyle={{
                  gap: theme.spacing.s,
                  marginTop: theme.spacing.s,
                }}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                  <TextButton
                    variant="outline"
                    disabled={!isEditable}
                    onClick={() => handleOpenBottomSheet(item)}
                  >
                    <ThemedView
                      flex={1}
                      minHeight={35}
                      opacity={item.isPresent ? 1 : 0.3}
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <ThemedText fontSize={16} fontWeight="bold" ml="s">
                        {item.register.name}
                      </ThemedText>
                      {item.isPresent && (
                        <Ionicons
                          name="checkmark-circle"
                          size={35}
                          style={{ margin: 0 }}
                          color="green"
                        />
                      )}
                    </ThemedView>
                  </TextButton>
                )}
                ListFooterComponent={() =>
                  lessonInfo?.isFinished === undefined && (
                    <ThemedView
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center"
                      my="s"
                      mx="m"
                    >
                      <TextButton disabled={!isEditable} onClick={saveReport}>
                        <ThemedText
                          fontSize={18}
                          fontWeight="bold"
                          color="white"
                          my="xs"
                          mx="m"
                        >
                          Finalizar
                        </ThemedText>
                      </TextButton>
                      <TextButton
                        variant="outline"
                        disabled={!isEditable}
                        onClick={refetch}
                      >
                        <ThemedText
                          fontSize={18}
                          fontWeight="bold"
                          mx="m"
                          my="xs"
                        >
                          Resetar
                        </ThemedText>
                      </TextButton>
                    </ThemedView>
                  )
                }
                ListEmptyComponent={
                  <ThemedView
                    flex={1}
                    justifyContent="center"
                    alignItems="center"
                    padding="m"
                  >
                    <ThemedText>Nenhum aluno encontrado.</ThemedText>
                  </ThemedView>
                }
                refreshControl={
                  <RefreshControl refreshing={isLoading} onRefresh={
                    () => data.length === 0
                      ? refetch()
                      : Toast.show({
                          type: "info",
                          text1: "Para recarregar a lista, pressione o botão de resetar.",
                      })
                  } />
                }
              />
            )}
          </CustomCard.Root>
        </ScrollView>
      </ThemedView>

      <BottomSheetModalProvider>
        <CustomBottomModal.Root
          ref={bottomSheetRef}
          onDismiss={onSheetDismiss}
          stackBehavior="replace"
        >
          <CustomBottomModal.Content title={tempItem.register?.name ?? ""}>
            <ThemedView g="s" mb="m">
              {isLoadingScores && (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              )}
              {isErrorScores && (
                <ThemedText>
                  Erro ao carregar as informações de pontuação.
                </ThemedText>
              )}
              {!isLoadingScores &&
                !isErrorScores &&
                scoreInfo &&
                scoreInfo.length > 0 && (
                  <ThemedText textAlign="center">
                    Clique sobre os ícones para editar as informações.
                  </ThemedText>
                )}
              {!isLoadingScores &&
                !isErrorScores &&
                scoreInfo &&
                scoreInfo.length === 0 && (
                  <ThemedText textAlign="center">
                    Não há informações de pontuação registradas.
                  </ThemedText>
                )}
              {scoreInfo?.map((item) => {
                if (item.type === "BooleanScore")
                  return (
                    <ScoreOption
                      key={item._id}
                      type={item.type}
                      icon="star"
                      title={
                        item.title.charAt(0).toUpperCase() + item.title.slice(1)
                      }
                      value={
                        (tempItem.score?.find((r) => r.scoreInfo === item._id)
                          ?.value as boolean) ?? false
                      }
                      onClick={() => {
                        const scoreItemIndex = tempItem.score?.findIndex(
                          (s) => s.scoreInfo === item._id
                        );
                        const newState = { ...tempItem };

                        if (
                          scoreItemIndex !== undefined &&
                          scoreItemIndex >= 0
                        ) {
                          newState.score![scoreItemIndex].value = !newState
                            .score![scoreItemIndex].value;
                        } else {
                          newState.score = [
                            ...(newState.score ?? []),
                            { scoreInfo: item._id, kind: "BooleanScore", value: true },
                          ];
                        }
                      }}
                    />
                  );

                if (item.type === "NumberScore")
                  return (
                    <ScoreOption
                      key={item._id}
                      type={item.type}
                      icon="star"
                      title={
                        item.title.charAt(0).toUpperCase() + item.title.slice(1)
                      }
                      value={
                        (tempItem.score?.find((r) => r.scoreInfo === item._id)
                          ?.value as number) ?? 0
                      }
                      onChange={(value) => {
                        const scoreItemIndex = tempItem.score?.findIndex(
                          (s) => s.scoreInfo === item._id
                        );
                        const newState = { ...tempItem };

                        if (
                          scoreItemIndex !== undefined &&
                          scoreItemIndex >= 0
                        ) {
                          newState.score![scoreItemIndex].value = value ?? 0;
                        } else {
                          newState.score = [
                            ...(newState.score ?? []),
                            { scoreInfo: item._id, kind: "NumberScore", value: value ?? 0 },
                          ];
                        }
                      }}
                    />
                  );
              }) ?? <ThemedText>Sem informações disponíveis.</ThemedText>}
            </ThemedView>
          </CustomBottomModal.Content>
          <CustomBottomModal.Action
            text="Confirmar"
            onPress={handleSaveReportChanges}
          />
        </CustomBottomModal.Root>
      </BottomSheetModalProvider>
    </ThemedView>
  );
}
