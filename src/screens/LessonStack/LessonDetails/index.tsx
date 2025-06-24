import { useTheme } from "@shopify/restyle";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { StackHeader } from "@components/StackHeader";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { HomeStackProps } from "@custom/types/navigation";
import { ThemeProps } from "@theme";
import { useNavigation } from "@react-navigation/native";
import { Alert, FlatList, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import { ListItemType } from "./type";
import { CustomCard } from "@components/CustomCard";
import TextButton from "@components/TextButton";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CustomBottomModal } from "@components/CustomBottomModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@providers/AuthProvider";
import config from "config";
import { RegisterFromApi } from "@screens/StudentStack/StudentScreen/type";
import { Lesson } from "../HomeScreen/type";
import ScoreOption from "@components/ScoreOption";
import { Score } from "@screens/StatisticsDrawer/SettingsStack/ScoreOptions/type";

export default function LessonDetails({
  route,
}: HomeStackProps<"LessonDetails">) {
  const { lessonId } = route.params;
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();
  const [isEditable, setIsEditable] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
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

      return await response.json();
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

      return await response.json();
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

      return await response.json();
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
          },
        }),
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.message, { cause: resJson.error });

      return resJson;
    },
    onSuccess: () => setIsLocked(true),
    onError: (error) => {
      console.log(error.message, error.cause);
    },
  });

  function generateList(data: RegisterFromApi[] | undefined): ListItemType[] {
    if (!data) return [];

    const list: ListItemType[] = [];
    const report = scoreInfo?.reduce((acc, cur) => {
      if (cur.type === "NumberScore") {
        acc[cur.title] = {
          id: cur._id!,
          value: 0,
        };
        return acc;
      }

      acc[cur.title] = {
        id: cur._id!,
        value: false,
      };
      return acc;
    }, {} as NonNullable<ListItemType["report"]>);

    data.forEach((item) => {
      if (lessonInfo?.rollcalls?.find((r) => r.classId === item.class.id))
        list.push({
          id: item._id,
          name: item.name,
          class: item.class.id,
          isPresent: false, // TODO: get from rollcall
          report: report,
        });
    });

    return list;
  }

  const [teachersList, setTeachersList] = useState<ListItemType[]>(
    generateList(data)
  );
  const [tempItem, setTempItem] = useState<Partial<ListItemType>>({});

  const {
    data: classes,
    isPending: isPendingClasses,
    isError: isErrorClasses,
    error: errorClasses,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
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
    [tempItem]
  );

  function onSheetDismiss() {
    setTempItem({});
  }

  const handleSaveReportChanges = useCallback(() => {
    const newValue = teachersList.map((item) =>
      item.id === tempItem.id
        ? { ...item, report: tempItem.report, isPresent: true }
        : item
    );

    setTeachersList(newValue);
    bottomSheetRef.current?.close();
  }, [teachersList]);

  function saveReport() {
    if (isLocked) return;

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

  return (
    <>
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
              {isSuccess && (lessonInfo.title ?? lessonInfo.number!.toString())}
            </StackHeader.Title>
          </StackHeader.Content>
          <StackHeader.Actions>
            <StackHeader.Action
              name={isLocked ? "lock" : "lock-open"}
              onPress={saveReport}
              color={theme.colors.gray}
            />
            <StackHeader.Action
              name={isEditable ? "close" : "pencil"}
              onPress={() => setIsEditable((prev) => !prev)}
              color={theme.colors.gray}
            />
          </StackHeader.Actions>
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
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Inicio", {
                          screen: "ClassReport",
                          params: { classId: item._id, lessonId },
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
                          borderLeftColor: item.description
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
                            item.description
                              ? "checkmark-circle"
                              : "alert-circle"
                          }
                          size={35}
                          style={{ margin: 0 }}
                          color={item.description ? "green" : "orange"}
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

      <CustomBottomModal.Root ref={bottomSheetRef} onDismiss={onSheetDismiss}>
        <CustomBottomModal.Content title={tempItem.name ?? ""}>
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
          })}
        </CustomBottomModal.Content>
        <CustomBottomModal.Action
          text="Confirmar"
          onPress={handleSaveReportChanges}
        />
      </CustomBottomModal.Root>
    </>
  );
}
