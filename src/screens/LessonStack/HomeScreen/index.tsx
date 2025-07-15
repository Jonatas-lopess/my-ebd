import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { ThemeProps } from "@theme";
import { useTheme } from "@shopify/restyle";
import { Alert, FlatList } from "react-native";
import { InfoCard } from "@components/InfoCard";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@providers/AuthProvider";
import { StackHeader } from "@components/StackHeader";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { CustomBottomModal } from "@components/CustomBottomModal";
import { Lesson } from "./type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import config from "config";

export default function HomeScreen() {
  //TODO: create a teacher screen to manage lessons
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { user, token } = useAuth().authState;
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const today = new Date();
  const [newLesson, setNewLesson] = useState<Lesson>({
    flag: user?.plan ?? "",
    number: undefined,
    date: today,
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["lessons"],
    queryFn: async (): Promise<Lesson[]> => {
      const response = await fetch(config.apiBaseUrl + "/lessons", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await response.json();
    },
  });

  const defaultLessonNumber = data && data.length + 1;

  const {
    mutate,
    isPending: isPendingMutate,
    variables,
  } = useMutation({
    mutationFn: async (newLesson: Lesson) => {
      const response = await fetch(config.apiBaseUrl + "/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newLesson),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message, { cause: data });

      return data;
    },
    onSuccess: () => {
      bottomSheetRef.current?.dismiss();
      return queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
    onError: (error) => {
      Alert.alert(
        "Algo deu errado!",
        "Não foi possível criar a aula. Tente novamente mais tarde."
      );

      console.log(error.message, error.cause);
    },
  });

  const handleOpenBottomSheet = () => {
    if (isPending === false) bottomSheetRef.current?.present();
  };

  const handleNewLessonDateChange = (
    e: DateTimePickerEvent,
    selectedDate?: Date
  ) =>
    e.type === "set" &&
    setNewLesson((oldLesson) => {
      return {
        ...oldLesson,
        date: selectedDate ?? oldLesson.date,
      };
    });

  const handleCreateNewLesson = () => {
    const body = {
      ...newLesson,
      number: newLesson.number ?? defaultLessonNumber,
    };

    mutate(body);
    setNewLesson({
      flag: user?.plan ?? "",
      number: undefined,
      date: today,
    });
    bottomSheetRef.current?.dismiss();
  };

  const formattedDateFromISO = (isoDateString: string): string => {
    const date = new Date(isoDateString);

    return `${date.getUTCDate().toString().padStart(2, "0")}/${(
      date.getUTCMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getUTCFullYear()}`;
  };

  return (
    <>
      <ThemedView flex={1} style={{ backgroundColor: "white" }}>
        <FocusAwareStatusBar style="dark" translucent />

        <StackHeader.Root>
          <StackHeader.Title>Minha EBD</StackHeader.Title>
          <StackHeader.Actions>
            <StackHeader.Action
              name="calendar-clear"
              onPress={() => {}}
              color={theme.colors.gray}
            />
            <StackHeader.Action
              name="add-outline"
              onPress={handleOpenBottomSheet}
              color={theme.colors.gray}
            />
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
                    if (user === undefined) throw new Error("User not found");

                    if (user.role === "teacher" && user.register === undefined)
                      throw new Error("User register not found");

                    if (user.role === "teacher")
                      return navigation.navigate("Inicio", {
                        screen: "ClassReport",
                        params: {
                          classId: user.register!.class,
                          lessonId: item._id!,
                        },
                      });

                    navigation.navigate("Inicio", {
                      screen: "LessonDetails",
                      params: { lessonId: item._id! },
                    });
                  }}
                  onLongPress={() =>
                    user?.role === "admin" && console.log("log")
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
                  {item.rollcalls && rollcallDone !== item.rollcalls.length && (
                    <ThemedText style={{ color: "red" }}>
                      {item.rollcalls.length - rollcallDone!} chamadas pendentes
                    </ThemedText>
                  )}
                  <InfoCard.Content>
                    <ThemedText>Presentes: -</ThemedText>
                    <ThemedView
                      borderLeftWidth={1}
                      borderLeftColor="lightgrey"
                    />
                    <ThemedText>Ausentes: -</ThemedText>
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
                  <ThemedText>
                    Adicionando a lição {variables.number}...
                  </ThemedText>
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
          />
        )}

        <CustomBottomModal.Root ref={bottomSheetRef}>
          <CustomBottomModal.Content
            title="Nova Lição"
            subtitle="Selecione a data e o número da lição para realizar o cadastro e
                fazer as chamadas."
          >
            <ThemedView
              py="xs"
              px="m"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              borderRadius={25}
              borderWidth={1}
              borderColor="lightgrey"
            >
              <ThemedText fontSize={16} style={{ color: "grey" }}>
                Data da aula
              </ThemedText>
              <ThemedText
                onPress={() =>
                  DateTimePickerAndroid.open({
                    value: today,
                    minimumDate: today,
                    onChange: handleNewLessonDateChange,
                  })
                }
                fontSize={16}
                fontWeight="600"
              >
                {newLesson.date.toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </ThemedText>
            </ThemedView>
            <ThemedView
              py="xs"
              px="m"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              borderRadius={25}
              borderWidth={1}
              borderColor="lightgrey"
            >
              <ThemedText fontSize={16} style={{ color: "grey" }}>
                Número da lição
              </ThemedText>
              <ThemedView flexDirection="row" gap="s">
                <Ionicons
                  name="arrow-up"
                  size={25}
                  style={{ margin: 0 }}
                  onPress={() =>
                    setNewLesson((prev) => ({
                      ...prev,
                      number:
                        prev.number === undefined
                          ? defaultLessonNumber! + 1
                          : prev.number + 1,
                    }))
                  }
                />
                <ThemedText fontSize={16} fontWeight="600">
                  {newLesson.number ?? defaultLessonNumber}
                </ThemedText>
                <Ionicons
                  name="arrow-down"
                  size={25}
                  style={{ margin: 0 }}
                  onPress={() => {
                    if (
                      (newLesson.number === undefined &&
                        defaultLessonNumber === 1) ||
                      newLesson.number === 1
                    ) {
                      return;
                    }

                    setNewLesson((prev) => ({
                      ...prev,
                      number:
                        prev.number === undefined
                          ? defaultLessonNumber! - 1
                          : prev.number - 1,
                    }));
                  }}
                  color={
                    (newLesson.number === undefined &&
                      defaultLessonNumber === 1) ||
                    newLesson.number === 1
                      ? theme.colors.lightgrey
                      : "black"
                  }
                />
              </ThemedView>
            </ThemedView>
          </CustomBottomModal.Content>
          <CustomBottomModal.Action onPress={handleCreateNewLesson} />
        </CustomBottomModal.Root>
      </ThemedView>
    </>
  );
}
