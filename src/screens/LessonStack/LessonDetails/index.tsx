import { useTheme } from "@shopify/restyle";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { StackHeader } from "@components/StackHeader";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { LessonStackProps } from "@custom/types/navigation";
import { ThemeProps } from "@theme";
import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { CustomCard } from "@components/CustomCard";
import TextButton from "@components/TextButton";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { CustomBottomModal } from "@components/CustomBottomModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@providers/AuthProvider";
import config from "config";
import { Lesson } from "../LessonScreen/type";
import ScoreOption from "@components/ScoreOption";
import { Score } from "@screens/ScoreOptions/type";
import { Rollcall } from "../type";
import { _Class } from "@screens/ClassStack/ClassScreen/type";
import { updateItemById } from "utils/immutability";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import { readAsStringAsync } from "expo-file-system";
import { Asset } from "expo-asset";
import diaryReport from "@assets/diaryReport.html";
import Toast from "react-native-toast-message";

export default function LessonDetails({
  route,
}: LessonStackProps<"LessonDetails">) {
  const { lessonId } = route.params;
  const theme = useTheme<ThemeProps>();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [isEditable, setIsEditable] = useState(false);
  const [isRenderingReport, setIsRenderingReport] = useState(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { token } = useAuth().authState;
  const [tempItem, setTempItem] = useState<Partial<Rollcall>>({});

  const {
    data: lessonInfo,
    isSuccess,
    refetch,
    isRefetching,
  } = useQuery({
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

  const { data, isLoading, isError, error, refetch: refetchRollcalls } = useQuery({
    queryKey: ["teacherRollcalls", lessonId],
    queryFn: async (): Promise<Rollcall[]> => {
      const response = await fetch(
        config.apiBaseUrl + `/rollcalls?lesson=${lessonId}&hasUser=true`,
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
    enabled: !!lessonId && !!token,
  });

  const { mutate } = useMutation({
    mutationFn: async (data: Rollcall[]) => {
      const res = await fetch(config.apiBaseUrl + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          list: data,
          isFinished: true,
        }),
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.message, { cause: resJson.error });

      return resJson;
    },
    onSuccess: () => {
      bottomSheetRef.current?.close();
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
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

  const {
    data: classes,
    isPending: isPendingClasses,
    isError: isErrorClasses,
    error: errorClasses,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: async (): Promise<_Class[]> => {
      const response = await fetch(
        config.apiBaseUrl + `/classes?lesson=${lessonId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return await response.json();
    },
    enabled: !!lessonId && !!token,
  });

  function handleOpenBottomSheet(item: Rollcall) {
    setTempItem(item);
    bottomSheetRef.current?.present();
  };

  function onSheetDismiss() {
    setTempItem({});
  }

  function handleSaveReportChanges() {
    queryClient.setQueryData<Rollcall[]>(["teacherRollcalls", lessonId], (prev) => {
      if (!prev) return prev;

      return updateItemById(prev, tempItem._id, (item) => ({
        ...item,
        score: (tempItem.score) ?? item.score,
        isPresent: true,
      }));
    });

    bottomSheetRef.current?.close();
  };

  function isClassReportDone(classId: string): boolean {
    return (
      lessonInfo?.rollcalls?.find((r) => r.classId === classId)?.isDone ?? false
    );
  }

  function saveReport() {
    if (lessonInfo?.isFinished) return;

    if (!classes?.every((item) => isClassReportDone(item._id!))) {
      return Alert.alert(
        "Atenção",
        "Não é possível executar esta ação pois existem chamadas não finalizadas."
      );
    }

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

  function formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  async function printReport() {
    if (lessonInfo === undefined || lessonInfo.isFinished === undefined)
      return Alert.alert(
        "Erro",
        "Não foi possível gerar o relatório. A lição ainda está em aberto."
      );

    setIsRenderingReport(true);

    try {
      const report: Rollcall[] = await (
        await fetch(config.apiBaseUrl + `/rollcalls?lesson=${lessonInfo._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      ).json();

      if (!report || report.length === 0) {
        setIsRenderingReport(false);
        Alert.alert("Erro", "Não foi possível gerar o relatório.");
        return console.log(report);
      }

      const asset = await Asset.fromModule(diaryReport).downloadAsync();
      let html = await readAsStringAsync(asset.localUri ?? "");

      // General Information Hydration
      html = html.replace(
        "{{DATA_DA_AULA}}",
        formatDate(lessonInfo?.date ?? "")
      );
      html = html.replace(
        "{{NUMERO_DA_LICAO}}",
        lessonInfo?.number?.toString() ?? ""
      );
      html = html.replace("{{TITULO_DA_LICAO}}", lessonInfo?.title ?? "");
      // Header Hydration
      html = html.replace(
        "{{SCORE_CABECALHOS}}",
        scoreInfo?.map((score) => `<th>${score.title}</th>`).join("") ?? ""
      );
      // Teacher Cells Hydration
      const teacherListLength = data?.length;
      const teachersPresent = data?.reduce(
        (acc, t) => acc + (t.isPresent ? 1 : 0),
        0
      );
      html = html.replace(
        "{{PROF_MATRICULADOS}}",
        teacherListLength?.toString() ?? "-"
      );
      html = html.replace("{{PROF_PRESENTES}}", teachersPresent?.toString() ?? "-");

      const profFreq = teacherListLength === 0 ||
        teacherListLength === undefined ||
        teachersPresent === undefined
          ? "-"
          : ((teachersPresent / teacherListLength) * 100).toFixed(2).concat("%");
      
      html = html.replace("{{PROF_FREQ}}", profFreq);
      html = html.replace(
        "{{PROF_SCORES}}",
        scoreInfo
          ?.map((score) => {
            const total = data?.reduce((acc, t) => {
              const tr = t.score?.find((tr) => tr.scoreInfo === score._id);

              if (score.type === "BooleanScore")
                return acc + (tr?.value ? 1 : 0);

              if (score.type === "NumberScore")
                return acc + Number(tr?.value ?? 0);

              return acc;
            }, 0);

            return "<td>" + total + "</td>";
          })
          .join("") ?? ""
      );
      html = html.replace("{{PROF_OFERTA}}", "-");
      // Classes Cells Hydration
      html = html.replace(
        "{{LINHAS_DAS_CLASSES}}",
        classes
          ?.map((cls) => {
            const classRlc = report.filter((r) => r.register.class === cls._id && r.register.isTeacher === false);
            const studentsNumber = classRlc.length;
            const studentsPresent = classRlc.reduce(
              (acc, r) => acc + (r.isPresent ? 1 : 0),
              0
            );
            const classScoreCells =
              scoreInfo
                ?.map((score) => {
                  const total = classRlc.reduce((acc, r) => {
                    const rs = r.score?.find((rs) => rs.scoreInfo === score._id);

                    if (score.type === "BooleanScore")
                      return acc + (rs?.value ? 1 : 0);

                    if (score.type === "NumberScore")
                      return acc + Number(rs?.value ?? 0);

                    return acc;
                  }, 0);

                  return "<td>" + total + "</td>";
                })
                .join("") ?? "";

            const classFreq = studentsNumber === 0 ? "-" : ((studentsPresent / studentsNumber) * 100).toFixed(2).concat("%");

            return (
              "<tr>" +
              "<td>" +
              cls.name +
              "</td>" +
              "<td>" +
              studentsNumber +
              "</td>" +
              "<td>" +
              studentsPresent +
              "</td>" +
              "<td>" +
              classFreq +
              "</td>" +
              classScoreCells +
              "<td> - </td>" + // Ofertas das turmas
              "</tr>"
            );
          })
          .join("") ?? ""
      );

      const { uri } = await printToFileAsync({ html });
      console.log("File has been saved to:", uri);

      setIsRenderingReport(false);
      await shareAsync(uri, {
        UTI: "com.adobe.pdf",
        mimeType: "application/pdf",
      });
    } catch (error) {
      setIsRenderingReport(false);
      console.log(error);
      return Alert.alert("Erro", "Não foi possível gerar o relatório.");
    }
  }

  function onRefreshReport() {
    refetch();
    refetchRollcalls();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ThemedView flex={1} style={{ backgroundColor: "white" }}>
        <FocusAwareStatusBar style="dark" translucent />

        <StackHeader.Root>
          <StackHeader.Content>
            <StackHeader.Action
              name="arrow-back"
              onPress={() => navigation.goBack()}
              color={theme.colors.gray}
            />
            <StackHeader.Title>
              {isSuccess &&
                (lessonInfo.title ?? `${lessonInfo.number!.toString()}º Lição`)}
            </StackHeader.Title>
          </StackHeader.Content>
          {isSuccess && (
            <StackHeader.Actions>
              <StackHeader.Action
                name={lessonInfo.isFinished ? "lock" : "lock-open"}
                onPress={saveReport}
                color={theme.colors.gray}
              />
              {lessonInfo.isFinished === undefined && (
                <StackHeader.Action
                  name={isEditable ? "close" : "pencil"}
                  onPress={() => setIsEditable((prev) => !prev)}
                  color={theme.colors.gray}
                />
              )}
            </StackHeader.Actions>
          )}
        </StackHeader.Root>

        <ThemedView flex={1} backgroundColor="white">
          <ScrollView
            nestedScrollEnabled
            contentContainerStyle={{ gap: 10, padding: theme.spacing.s }}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={onRefreshReport} />
            }
          >
            <CustomCard.Root borderRadius={20}>
              <CustomCard.Title>Relatório Geral</CustomCard.Title>
              <CustomCard.Detail>
                O relatório geral é o conjunto de dados do dia de aula. É
                necessário que todas as chamadas sejam feitas para obter um
                resultado completo.
              </CustomCard.Detail>
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.secondary,
                  paddingVertical: 10,
                  borderRadius: 20,
                  marginTop: theme.spacing.s,
                }}
                onPress={printReport}
              >
                <ThemedText
                  fontSize={16}
                  fontWeight="bold"
                  textTransform="uppercase"
                  color="white"
                  textAlign="center"
                >
                  Gerar Relatório
                </ThemedText>
              </TouchableOpacity>
            </CustomCard.Root>

            <CustomCard.Root borderRadius={20}>
              <CustomCard.Title>Relatórios por Classe</CustomCard.Title>
              <CustomCard.Detail>
                Aqui você acompanha o relatório das chamadas feitas em cada
                classe.
              </CustomCard.Detail>
              {isPendingClasses && (
                <ThemedView
                  flex={1}
                  justifyContent="center"
                  alignItems="center"
                >
                  <ThemedText>Carregando...</ThemedText>
                </ThemedView>
              )}
              {isErrorClasses && (
                <ThemedView
                  flex={1}
                  justifyContent="center"
                  alignItems="center"
                >
                  <ThemedText>
                    Erro ao carregar as classes: {errorClasses.message}
                  </ThemedText>
                </ThemedView>
              )}
              {classes && (
                <FlatList
                  data={classes}
                  scrollEnabled={false}
                  contentContainerStyle={{
                    gap: theme.spacing.s,
                    marginTop: theme.spacing.s,
                  }}
                  keyExtractor={(item) => item._id!}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Lessons", {
                          screen: "ClassReport",
                          params: { classId: item._id!, lessonId },
                        })
                      }
                    >
                      <ThemedView
                        padding="xs"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        borderRadius={25}
                        borderWidth={1}
                        borderLeftWidth={6}
                        style={{
                          borderLeftColor: isClassReportDone(item._id!)
                            ? "green"
                            : "orange",
                        }}
                        borderRightColor="lightgrey"
                        borderBottomColor="lightgrey"
                        borderTopColor="lightgrey"
                      >
                        <ThemedText fontSize={16} fontWeight="bold" ml="s">
                          {item.name}
                        </ThemedText>
                        <Ionicons
                          name={
                            isClassReportDone(item._id!)
                              ? "checkmark-circle"
                              : "alert-circle"
                          }
                          size={35}
                          style={{ margin: 0 }}
                          color={
                            isClassReportDone(item._id!) ? "green" : "orange"
                          }
                        />
                      </ThemedView>
                    </TouchableOpacity>
                  )}
                />
              )}
            </CustomCard.Root>

            <CustomCard.Root borderRadius={20}>
              <CustomCard.Title>Chamada de Professores</CustomCard.Title>
              <CustomCard.Detail>
                Clique sobre os nomes para confirmar a presença.
              </CustomCard.Detail>
              {isLoading && (
                <ThemedView
                  flex={1}
                  justifyContent="center"
                  alignItems="center"
                >
                  <ThemedText>Carregando...</ThemedText>
                </ThemedView>
              )}
              {isError && (
                <ThemedView
                  flex={1}
                  justifyContent="center"
                  alignItems="center"
                >
                  <ThemedText>
                    Erro ao carregar os professores: {error.message}
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
                  ListEmptyComponent={
                    <ThemedView
                      flex={1}
                      justifyContent="center"
                      alignItems="center"
                      padding="m"
                    >
                      <ThemedText>Nenhum professor encontrado.</ThemedText>
                    </ThemedView>
                  }
                />
              )}
            </CustomCard.Root>
          </ScrollView>
        </ThemedView>
      </ThemedView>

      <BottomSheetModalProvider>
        <CustomBottomModal.Root ref={bottomSheetRef} onDismiss={onSheetDismiss}>
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
            {scoreInfo !== undefined && scoreInfo.length > 0 && (
              <CustomBottomModal.Action
                text="Confirmar"
                onPress={handleSaveReportChanges}
              />
            )}
          </CustomBottomModal.Content>
        </CustomBottomModal.Root>
      </BottomSheetModalProvider>

      <Modal visible={isRenderingReport} transparent animationType="fade">
        <ThemedView flex={1} justifyContent="center" alignItems="center">
          <ThemedText>Gerando relatório...</ThemedText>
          <ActivityIndicator size="large" color="primary" />
        </ThemedView>
      </Modal>
    </KeyboardAvoidingView>
  );
}
