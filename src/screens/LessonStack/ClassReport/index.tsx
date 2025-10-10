import { CustomCard } from "@components/CustomCard";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { StackHeader } from "@components/StackHeader";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { HomeStackProps } from "@custom/types/navigation";
import { ScrollView, FlatList, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "@theme";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import TextButton from "@components/TextButton";
import { CustomBottomModal } from "@components/CustomBottomModal";
import { ListItemType } from "../LessonDetails/type";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import config from "config";
import { useAuth } from "@providers/AuthProvider";
import { Rollcall } from "../type";
import { Score } from "@screens/ScoreOptions/type";
import ScoreOption from "@components/ScoreOption";
import { Lesson } from "../HomeScreen/type";
import structuredClone from "@ungap/structured-clone";
import { RegisterFromApi } from "@screens/RegisterStack/StudentScreen/type";

export default function ClassReport({ route }: HomeStackProps<"ClassReport">) {
  const { classId, lessonId } = route.params;
  const navigation = useNavigation();
  const theme = useTheme<ThemeProps>();
  const queryClient = useQueryClient();
  const { token } = useAuth().authState;
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [isEditable, setIsEditable] = useState(false);

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
  });

  const { data, error, isPending, isError } = useQuery({
    queryKey: ["students", classId],
    queryFn: async (): Promise<RegisterFromApi[]> => {
      const response = await fetch(
        config.apiBaseUrl + `/registers?class=${classId}&hasUser=false`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resJson = await response.json();
      if (!response.ok)
        throw new Error(resJson.message, { cause: resJson.error });

      return resJson;
    },
  });

  const { data: rollcalls, isPending: isRollcallsPending } = useQuery({
    queryKey: ["classReport", lessonId, classId],
    queryFn: async (): Promise<Rollcall[]> => {
      const res = await fetch(
        config.apiBaseUrl + `/rollcalls?class=${classId}&lesson=${lessonId}`,
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
  });

  const { mutate } = useMutation({
    mutationFn: async (data: ListItemType[]) => {
      const res = await fetch(config.apiBaseUrl + "/report", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          list: data,
          lesson: {
            id: lessonId,
            number: lessonInfo?.number,
            date: lessonInfo?.date,
          },
          class: classId,
        }),
      });

      return res.json();
    },
    onSuccess: () => {
      bottomSheetRef.current?.close();
    },
    onError: (error) => {
      console.log(error.message, error.cause);
    },
  });

  const report = useMemo(() => {
    if (!scoreInfo) return undefined;

    return scoreInfo.reduce((acc, cur) => {
      if (cur.type === "NumberScore") {
        acc[cur.title] = {
          id: cur._id!,
          value: 0,
        };
      } else {
        acc[cur.title] = {
          id: cur._id!,
          value: false,
        };
      }

      return acc;
    }, {} as NonNullable<ListItemType["report"]>);
  }, [scoreInfo]);

  const generateList = useCallback(
    (rawList: RegisterFromApi[] | undefined): ListItemType[] => {
      if (!rawList || !report) return [];
      const list: ListItemType[] = [];

      if (rawList) {
        rawList.forEach((item) => {
          list.push({
            id: item._id,
            name: item.name,
            class: classId,
            isPresent:
              rollcalls?.some(
                (rollcall) =>
                  rollcall.lesson.id === lessonId &&
                  rollcall.register.id === item._id &&
                  rollcall.isPresent
              ) ?? false,
            report: structuredClone(report),
          });
        });
      }

      return list;
    },
    [report, classId, lessonId, rollcalls]
  );

  const [classReport, setReport] = useState<ListItemType[]>([]);
  const [tempItem, setTempItem] = useState<Partial<ListItemType>>({});

  useEffect(() => {
    if (isPending || isError || isRollcallsPending) return;
    setReport(generateList(data));
  }, [isRollcallsPending, isPending, isError]);

  useEffect(() => {
    if (error) console.log(error.message, error.cause);
  }, [error]);

  const handleOpenBottomSheet = useCallback(
    (id: string) => {
      const item = classReport.find((item) => item.id === id);
      if (typeof item === "undefined")
        return Alert.alert(
          "Error",
          "Item não encontrado por conta de divergência de dados."
        );

      setTempItem(item);
      bottomSheetRef.current?.present();
    },
    [classReport]
  );

  function onSheetDismiss() {
    setTempItem({});
  }

  const handleSaveReportChanges = useCallback(() => {
    setReport((prev) =>
      prev.map((item) =>
        item.id === tempItem.id
          ? { ...item, report: tempItem.report, isPresent: true }
          : item
      )
    );

    bottomSheetRef.current?.close();
  }, [tempItem]);

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
          mutate(classReport);
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
            {isPending && <ActivityIndicator size="small" />}
            {isError && (
              <ThemedView flex={1} justifyContent="center" alignItems="center">
                <ThemedText>
                  Erro ao carregar a chamada: {error.message}
                </ThemedText>
              </ThemedView>
            )}
            {data && (
              <FlatList
                data={classReport}
                scrollEnabled={false}
                contentContainerStyle={{
                  gap: theme.spacing.s,
                  marginTop: theme.spacing.s,
                }}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TextButton
                    variant="outline"
                    disabled={!isEditable}
                    onClick={() => handleOpenBottomSheet(item.id)}
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
                        {item.name}
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
                ListFooterComponent={(): React.ReactNode =>
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
                        onClick={() =>
                          queryClient.invalidateQueries({
                            queryKey: ["students", classId],
                          })
                        }
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
              />
            )}
          </CustomCard.Root>
        </ScrollView>
      </ThemedView>

      <CustomBottomModal.Root
        ref={bottomSheetRef}
        onDismiss={onSheetDismiss}
        stackBehavior="replace"
      >
        <CustomBottomModal.Content title={tempItem.name ?? ""}>
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
              <ThemedText textAlign="center" mb="s">
                Clique sobre os ícones para editar as informações.
              </ThemedText>
            )}
          {!isLoadingScores &&
            !isErrorScores &&
            scoreInfo &&
            scoreInfo.length === 0 && (
              <ThemedText textAlign="center" mb="s">
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
                    (tempItem.report?.[item.title].value as boolean) ?? false
                  }
                  onClick={() => {
                    const newState = { ...tempItem };
                    newState.report![item.title].value =
                      !newState.report![item.title].value;
                    setTempItem(newState);
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
                  value={(tempItem.report?.[item.title].value as number) ?? 0}
                  onChange={(value) => {
                    const newState = { ...tempItem };
                    newState.report![item.title].value = value ?? 0;
                    setTempItem(newState);
                  }}
                />
              );
          }) ?? <ThemedText>Sem informações disponíveis.</ThemedText>}
        </CustomBottomModal.Content>
        <CustomBottomModal.Action
          text="Confirmar"
          onPress={handleSaveReportChanges}
        />
      </CustomBottomModal.Root>
    </ThemedView>
  );
}
