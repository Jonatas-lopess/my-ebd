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
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ListItemType } from "./type";
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
import { RegisterFromApi } from "@screens/RegisterStack/RegisterScreen/type";
import { Lesson } from "../LessonScreen/type";
import ScoreOption from "@components/ScoreOption";
import { Score } from "@screens/ScoreOptions/type";
import { Rollcall } from "../type";
import { _Class } from "@screens/ClassStack/ClassScreen/type";
import structuredClone from "@ungap/structured-clone";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

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

  const { data: scoreInfo } = useQuery({
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

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["teacherRegister"],
    queryFn: async (): Promise<RegisterFromApi[]> => {
      const response = await fetch(
        config.apiBaseUrl + "/registers?hasUser=true",
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

  const { data: teacherRollcalls } = useQuery({
    queryKey: ["teacherRollcalls", lessonId],
    queryFn: async (): Promise<Rollcall[]> => {
      const response = await fetch(
        config.apiBaseUrl + `/rollcalls?lesson=${lessonId}&register=hasUser`,
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

  const { mutate } = useMutation({
    mutationFn: async (data: ListItemType[]) => {
      const res = await fetch(config.apiBaseUrl + "/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          list: data,
          lesson: {
            id: lessonId,
            number: lessonInfo?.number,
            date: lessonInfo?.date,
            isFinished: true,
          },
        }),
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.message, { cause: resJson.error });

      return resJson;
    },
    onSuccess: () => {
      bottomSheetRef.current?.close();
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      navigation.goBack();
    },
    onError: (error) => {
      console.log(error.message, error.cause);
    },
  });

  const report = useMemo(() => {
    if (!scoreInfo) return undefined;

    return scoreInfo.reduce((acc: ListItemType["report"], cur) => {
      if (cur.type === "NumberScore") {
        acc!.push({
          id: cur._id!,
          value: 0,
        });
      } else {
        acc!.push({
          id: cur._id!,
          value: false,
        });
      }

      return acc;
    }, []);
  }, [scoreInfo]);

  const generateList = useCallback(
    (data: RegisterFromApi[] | undefined): ListItemType[] => {
      if (!data || !report) return [];
      const list: ListItemType[] = [];

      data.forEach((item) => {
        if (lessonInfo?.rollcalls?.find((r) => r.classId === item.class.id))
          list.push({
            id: item._id,
            name: item.name,
            class: item.class.id,
            isPresent: teacherRollcalls
              ? teacherRollcalls.find((r) => r.register.id === item._id)
                  ?.isPresent ?? false
              : false,
            report: structuredClone(report),
          });
      });

      return list;
    },
    [lessonInfo, teacherRollcalls, report]
  );

  const [teachersList, setTeachersList] = useState<ListItemType[]>([]);
  const [tempItem, setTempItem] = useState<Partial<ListItemType>>({});

  useEffect(() => {
    if (isPending || isError || !data || !scoreInfo || !lessonInfo) return;
    setTeachersList(generateList(data));
  }, [data, scoreInfo, lessonInfo, teacherRollcalls]);

  const {
    data: classes,
    isPending: isPendingClasses,
    isError: isErrorClasses,
    error: errorClasses,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: async (): Promise<_Class[]> => {
      const response = await fetch(config.apiBaseUrl + "/classes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await response.json();
    },
  });

  const handleOpenBottomSheet = useCallback(
    (id: string) => {
      const item = teachersList.find((item) => item.id === id);
      if (item === undefined)
        return Alert.alert(
          "Error",
          "Item não encontrado por conta de divergência de dados."
        );

      setTempItem(item);
      bottomSheetRef.current?.present();
    },
    [teachersList]
  );

  function onSheetDismiss() {
    setTempItem({});
  }

  const handleSaveReportChanges = useCallback(() => {
    setTeachersList((prev) =>
      prev.map((item) =>
        item.id === tempItem.id
          ? { ...item, report: tempItem.report, isPresent: true }
          : item
      )
    );
    bottomSheetRef.current?.close();
  }, [tempItem]);

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
          mutate(teachersList);
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

  async function printToFile() {
    if (!lessonId || lessonInfo?.isFinished === undefined)
      return Alert.alert(
        "Erro",
        "Não foi possível gerar o relatório. A lição ainda está em aberto."
      );

    setIsRenderingReport(true);

    try {
      const report: Rollcall[] = await (
        await fetch(config.apiBaseUrl + `/rollcalls?lesson=${lessonId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      ).json();
      console.log(report);

      const html = `<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <title>Relatório de Chamada</title>
        <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        h2, h4, h5 {
            margin: 0;
            padding: 0;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        </style>
    </head>
    <body>
        <div style="text-align: center;text-transform: uppercase;margin-bottom: 2rem;">
            <h2>Lição Nº ${lessonInfo.number} ${
        lessonInfo.title ? "- " + lessonInfo.title : ""
      }</h2>
            <h2>${formatDate(lessonInfo.date)}</h2>
        </div>
        <div style="margin-bottom: 2rem;">
            <h4 style="text-transform: uppercase;">Relatório dos Professores</h4>
            <hr>
            <table border="1" cellspacing="0" cellpadding="5" width="100%">
                <tr>
                    <th>Professor</th>
                    <th>Classe</th>
                    ${
                      scoreInfo
                        ?.map((score) => `<th>${score.title}</th>`)
                        .join("") ?? ""
                    }
                </tr>
                ${report
                  .map((rollcall) => {
                    const scoresHtml =
                      scoreInfo
                        ?.map((score) => {
                          const reportItem = rollcall.score?.find(
                            (r) => r.scoreInfo === score._id
                          );
                          return `<td>${
                            reportItem
                              ? typeof reportItem.value === "number"
                                ? reportItem.value
                                : reportItem.value
                                ? "Sim"
                                : "Não"
                              : ""
                          }</td>`;
                        })
                        .join("") ?? "";

                    return `<tr>
                    <td>${rollcall.register.name}</td>
                    <td>${rollcall.register.class}</td>
                    ${scoresHtml}
                </tr>`;
                  })
                  .join("")}
            </table>
        </div>
        <div>
            <h4 style="text-transform: uppercase;">Relatório dos Alunos</h4>
            <hr>
            ${classes
              ?.map((cls) => {
                const classRollcalls = report.filter(
                  (r) => r.register.class === cls._id
                );

                return `<h5>${cls.name}</h5>
              <table border="1" cellspacing="0" cellpadding="5" width="100%">
                  <tr>
                      <th>Aluno</th>
                      ${
                        scoreInfo
                          ?.map((score) => `<th>${score.title}</th>`)
                          .join("") ?? ""
                      }
                  </tr>
                  ${classRollcalls
                    .map((rollcall) => {
                      const scoresHtml =
                        scoreInfo
                          ?.map((score) => {
                            const reportItem = rollcall.score?.find(
                              (r) => r.scoreInfo === score._id
                            );

                            return `<td>${
                              reportItem
                                ? typeof reportItem.value === "number"
                                  ? reportItem.value
                                  : reportItem.value
                                  ? "Sim"
                                  : "Não"
                                : ""
                            }</td>`;
                          })
                          .join("") ?? "";

                      return `<tr>
                          <td>${rollcall.register.name}</td>
                          ${scoresHtml}
                      </tr>`;
                    })
                    .join("")}
              </table>`;
              })
              .join("")}
        </div>
    </body>
    </html>`;

      const { uri } = await printToFileAsync({ html });
      console.log("File has been saved to:", uri);

      setIsRenderingReport(false);
      await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
    } catch (error) {
      setIsRenderingReport(false);
      console.log(error);
      Alert.alert("Erro", "Não foi possível gerar o relatório.");
      return;
    }
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
                onPress={printToFile}
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
              {isPending && (
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
              {teachersList && (
                <FlatList
                  data={teachersList}
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
                />
              )}
            </CustomCard.Root>
          </ScrollView>
        </ThemedView>
      </ThemedView>

      <BottomSheetModalProvider>
        <CustomBottomModal.Root ref={bottomSheetRef} onDismiss={onSheetDismiss}>
          <CustomBottomModal.Content title={tempItem.name ?? ""}>
            <ThemedView g="s" mb="m">
              {scoreInfo === undefined || scoreInfo.length === 0 ? (
                <ThemedView justifyContent="center" alignItems="center">
                  <ThemedText color="gray">
                    Nenhum tipo de pontuação cadastrada.
                  </ThemedText>
                </ThemedView>
              ) : (
                scoreInfo.map((item) => {
                  if (item.type === "BooleanScore")
                    return (
                      <ScoreOption
                        key={item._id}
                        type={item.type}
                        icon="star"
                        title={
                          item.title.charAt(0).toUpperCase() +
                          item.title.slice(1)
                        }
                        value={
                          (tempItem.report?.find((r) => r.id === item._id)
                            ?.value as boolean) ?? false
                        }
                        onClick={() => {
                          const newState = { ...tempItem };
                          newState.report!.find(
                            (r) => r.id === item._id
                          )!.value = !newState.report!.find(
                            (r) => r.id === item._id
                          )!.value;
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
                          item.title.charAt(0).toUpperCase() +
                          item.title.slice(1)
                        }
                        value={
                          (tempItem.report?.find((r) => r.id === item._id)
                            ?.value as number) ?? 0
                        }
                        onChange={(value) => {
                          const newState = { ...tempItem };
                          newState.report!.find(
                            (r) => r.id === item._id
                          )!.value = value ?? 0;
                          setTempItem(newState);
                        }}
                      />
                    );
                })
              )}
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
