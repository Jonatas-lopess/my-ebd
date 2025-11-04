import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { ThemeProps } from "@theme";
import { useTheme } from "@shopify/restyle";
import { Alert, FlatList, RefreshControl } from "react-native";
import { InfoCard } from "@components/InfoCard";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@providers/AuthProvider";
import { StackHeader } from "@components/StackHeader";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";

import { CustomBottomModal } from "@components/CustomBottomModal";
import { Lesson } from "./type";
import { skipToken, useQuery } from "@tanstack/react-query";
import config from "config";
import LessonForm from "@components/LessonForm";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

type IntervalObj = {
  initialDate: Date | undefined;
  finalDate: Date | undefined;
};

export default function LessonScreen() {
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();
  const { user: { role: userRole, register: userRegister } = {}, token } =
    useAuth().authState;
  const { class: classId } = userRegister || {};
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const intervalSheetRef = useRef<BottomSheetModal>(null);
  const [isPendingMutate, setIsPendingMutate] = useState(false);
  const today = new Date();
  const defaultInt = {
    initialDate: undefined,
    finalDate: undefined,
  };
  const [interval, setInterval] = useState<IntervalObj>(defaultInt);
  const [tempInterval, setTempInterval] = useState<IntervalObj>(defaultInt);

  const {
    data: rawData,
    isPending,
    isError,
    error,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["lessons"],
    queryFn: async (): Promise<Lesson[]> => {
      const response = await fetch(config.apiBaseUrl + "/lessons", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch lessons");
      }

      return await response.json();
    },
  });

  const filterData = useCallback(() => {
    if (!rawData) return [];
    if (!interval.initialDate || !interval.finalDate) return rawData;

    return rawData.filter((item) => {
      const lessonDate = new Date(item.date);

      return (
        lessonDate >= interval.initialDate! && lessonDate <= interval.finalDate!
      );
    });
  }, [rawData, interval]);

  const data = filterData();

  async function getClassDetails(): Promise<{ students: string[] }> {
    const res = await fetch(
      config.apiBaseUrl + `/classes/${classId}?select=students`,
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
  }

  const { data: classData } = useQuery({
    queryKey: ["classDetails", classId],
    queryFn:
      userRole === "teacher" && classId !== undefined
        ? getClassDetails
        : skipToken,
  });

  const defaultLessonNumber = data && data.length + 1;

  const handleOpenBottomSheet = () => {
    if (isPending === false) bottomSheetRef.current?.present();
  };

  const handleOpenIntervalSheet = () => {
    if (interval.finalDate || interval.initialDate) setInterval(defaultInt);
    else intervalSheetRef.current?.present();
  };

  const formattedDateFromISO = (isoDateString: string): string => {
    const date = new Date(isoDateString);

    return `${date.getUTCDate().toString().padStart(2, "0")}/${(
      date.getUTCMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getUTCFullYear()}`;
  };

  function handleSetInterval() {
    if (
      tempInterval.finalDate === undefined ||
      tempInterval.initialDate === undefined
    )
      return;

    setInterval(tempInterval);
    intervalSheetRef.current?.dismiss();
  }

  return (
    <>
      <ThemedView flex={1} style={{ backgroundColor: "white" }}>
        <FocusAwareStatusBar style="dark" translucent />

        <StackHeader.Root>
          <StackHeader.Title>Minha EBD</StackHeader.Title>
          <StackHeader.Actions>
            <StackHeader.Action
              name={
                interval.finalDate || interval.finalDate
                  ? "calendar-times-o"
                  : "calendar-clear-outline"
              }
              onPress={handleOpenIntervalSheet}
              color={
                interval.finalDate || interval.finalDate
                  ? theme.colors.lightBlue
                  : theme.colors.gray
              }
            />
            {(userRole === "owner" || userRole === "admin") && (
              <StackHeader.Action
                name="add-outline"
                onPress={handleOpenBottomSheet}
                color={theme.colors.gray}
              />
            )}
          </StackHeader.Actions>
        </StackHeader.Root>

        {isPending && (
          <ThemedView flex={1} justifyContent="center" alignItems="center">
            <ThemedText>Carregando...</ThemedText>
          </ThemedView>
        )}

        {isError && (
          <ThemedView flex={1} justifyContent="center" alignItems="center">
            <ThemedText>Erro ao carregar as lições: {error.message}</ThemedText>
          </ThemedView>
        )}
        {data && (
          <FlatList
            data={data}
            renderItem={({ item }) => {
              const rollcallDone = item.rollcalls?.reduce(
                (acc, val): number => acc + (val.isDone ? 1 : 0),
                0
              );

              return (
                <InfoCard.Root
                  onPress={() => {
                    if (userRole === undefined)
                      throw new Error("User not found");

                    if (userRole === "teacher" && classId === undefined) {
                      console.log(userRegister);
                      throw new Error("User register not found");
                    }

                    if (userRole === "teacher")
                      return navigation.navigate("Lessons", {
                        screen: "ClassReport",
                        params: {
                          classId: classId!,
                          lessonId: item._id!,
                        },
                      });

                    navigation.navigate("Lessons", {
                      screen: "LessonDetails",
                      params: { lessonId: item._id! },
                    });
                  }}
                  onLongPress={() =>
                    (userRole === "admin" || userRole === "owner") &&
                    Alert.alert("log")
                  }
                >
                  <ThemedView flexDirection="row" alignItems="center">
                    <InfoCard.Title>{`${
                      item.title ? item.title : item.number
                    } - ${formattedDateFromISO(
                      item.date as string
                    )}`}</InfoCard.Title>
                    <InfoCard.Detail>
                      {rollcallDone !== undefined
                        ? `• ${(
                            (rollcallDone / item.rollcalls!.length) *
                            100
                          ).toFixed(2)}%`
                        : ""}
                    </InfoCard.Detail>
                  </ThemedView>
                  {(userRole === "admin" || userRole === "owner") &&
                    item.rollcalls &&
                    rollcallDone !== item.rollcalls.length && (
                      <ThemedText style={{ color: "red" }}>
                        {item.rollcalls.length - rollcallDone!} chamadas
                        pendentes
                      </ThemedText>
                    )}
                  <InfoCard.Content>
                    {userRole === "admin" || userRole === "owner" ? (
                      item.rollcalls && (
                        <ThemedText>Turmas: {item.rollcalls.length}</ThemedText>
                      )
                    ) : (
                      <ThemedText>
                        Alunos: {classData?.students.length ?? "-"}
                      </ThemedText>
                      /* <>
                        <ThemedText>Presentes: -</ThemedText>
                        <ThemedView
                          borderLeftWidth={1}
                          borderLeftColor="lightgrey"
                        />
                        <ThemedText>Ausentes: -</ThemedText>
                      </> */
                    )}
                  </InfoCard.Content>
                </InfoCard.Root>
              );
            }}
            ListFooterComponent={() =>
              isPendingMutate && (
                <ThemedView
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  gap="s"
                >
                  <ThemedText>Adicionando a nova lição...</ThemedText>
                </ThemedView>
              )
            }
            keyExtractor={(item) => item._id!}
            style={{ backgroundColor: theme.colors.white }}
            contentContainerStyle={{
              gap: theme.spacing.s,
              paddingVertical: theme.spacing.s,
              paddingHorizontal: theme.spacing.s,
            }}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
          />
        )}
      </ThemedView>

      <BottomSheetModalProvider>
        <CustomBottomModal.Root ref={bottomSheetRef} stackBehavior="replace">
          <CustomBottomModal.Content
            title="Nova Lição"
            subtitle="Selecione a data e o número da lição para realizar o cadastro e
                fazer as chamadas."
          >
            <LessonForm
              mutateFallback={setIsPendingMutate}
              defaultLessonNumber={defaultLessonNumber}
            />
          </CustomBottomModal.Content>
        </CustomBottomModal.Root>

        <CustomBottomModal.Root
          ref={intervalSheetRef}
          onDismiss={() => setTempInterval(defaultInt)}
          stackBehavior="replace"
        >
          <CustomBottomModal.Content
            title="Filtrar por Intervalo"
            subtitle="Selecione a data de início e fim do intervalo."
          >
            <ThemedView
              flexDirection="row"
              justifyContent="space-evenly"
              ml="s"
              mb="m"
            >
              <ThemedView bg="lightgrey" borderRadius={10} py="s" px="m">
                <ThemedText
                  onPress={() =>
                    DateTimePickerAndroid.open({
                      value: today,
                      maximumDate: today,
                      onChange: (_, value) =>
                        setTempInterval((oldInt) => {
                          return { ...oldInt, initialDate: value };
                        }),
                    })
                  }
                  fontSize={16}
                  fontWeight="600"
                >
                  {tempInterval.initialDate?.toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }) ?? "Selecionar início"}
                </ThemedText>
              </ThemedView>

              <ThemedText textAlignVertical="center">até</ThemedText>

              <ThemedView bg="lightgrey" borderRadius={10} py="s" px="m">
                <ThemedText
                  onPress={() =>
                    DateTimePickerAndroid.open({
                      value: today,
                      minimumDate: tempInterval.initialDate,
                      maximumDate: today,
                      onChange: (_, value) =>
                        setTempInterval((oldInt) => {
                          return { ...oldInt, finalDate: value };
                        }),
                    })
                  }
                  fontSize={16}
                  fontWeight="600"
                >
                  {tempInterval.finalDate?.toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }) ?? "Selecionar fim"}
                </ThemedText>
              </ThemedView>
            </ThemedView>

            <CustomBottomModal.Action
              text="Selecionar"
              onPress={handleSetInterval}
            />
          </CustomBottomModal.Content>
        </CustomBottomModal.Root>
      </BottomSheetModalProvider>
    </>
  );
}
