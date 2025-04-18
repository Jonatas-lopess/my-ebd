import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { ThemeProps } from "@theme";
import { useTheme } from "@shopify/restyle";
import { FlatList } from "react-native";
import { InfoCard } from "@components/InfoCard";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@providers/AuthProvider";
import { StackHeader } from "@components/StackHeader";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { CustomBottomModal } from "@components/CustomBottomModal";
import { Lesson, NewLesson } from "./type";

export default function HomeScreen() {
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();
  const { user } = useAuth().authState!;
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const today = new Date();
  const [newLesson, setNewLesson] = useState<NewLesson>({
    lesson: undefined,
    date: today,
  });

  const DATA_LESSONS: Lesson[] = [
    {
      id: "aDe1",
      title: "Aula 1",
      date: "10/01/2023",
      total: 32,
      reports: {
        pending: 0,
        presents: 20,
      },
    },
    {
      id: "aDe2",
      title: "Aula 2",
      date: "10/01/2023",
      total: 32,
      reports: {
        pending: 0,
        presents: 20,
      },
    },
    {
      id: "aDe3",
      title: "Aula 3",
      date: "10/01/2023",
      total: 32,
      reports: {
        pending: 2,
      },
    },
  ];

  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleNewLessonDateChange = (
    e: DateTimePickerEvent,
    selectedDate?: Date
  ) =>
    e.type === "set" &&
    setNewLesson((oldLesson) => {
      return {
        ...oldLesson,
        date: selectedDate || oldLesson.date,
      };
    });

  const handleCreateNewLesson = () => {};

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

        <FlatList
          data={DATA_LESSONS}
          renderItem={({ item }) => (
            <InfoCard.Root
              onPress={() =>
                navigation.navigate("Inicio", {
                  screen: "LessonDetails",
                  params: { lessonId: item.id },
                })
              }
              onLongPress={() => user?.role === "admin" && alert("edit")}
            >
              <ThemedView flexDirection="row" alignItems="center">
                <InfoCard.Title>{`${item.title} - ${item.date}`}</InfoCard.Title>
                <InfoCard.Detail>
                  {item.reports.presents
                    ? `• ${((item.reports.presents / item.total) * 100).toFixed(
                        2
                      )}%`
                    : ""}
                </InfoCard.Detail>
              </ThemedView>
              {item.reports.pending !== 0 && (
                <ThemedText style={{ color: "red" }}>
                  2 chamadas pendentes
                </ThemedText>
              )}
              <InfoCard.Content>
                <ThemedText>
                  Presentes:{" "}
                  {item.reports.presents
                    ? item.reports.presents.toString()
                    : "-"}
                </ThemedText>
                <ThemedView borderLeftWidth={1} borderLeftColor="lightgrey" />
                <ThemedText>
                  Ausentes:{" "}
                  {item.reports.presents
                    ? (item.total - item.reports.presents).toString()
                    : "-"}
                </ThemedText>
              </InfoCard.Content>
            </InfoCard.Root>
          )}
          keyExtractor={(item) => item.id}
          style={{ backgroundColor: theme.colors.white }}
          contentContainerStyle={{
            gap: theme.spacing.s,
            paddingVertical: theme.spacing.s,
            paddingHorizontal: theme.spacing.s,
          }}
        />

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
                {newLesson.date.toLocaleDateString("pt-BR")}
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
                    setNewLesson((oldLesson) => {
                      return {
                        ...oldLesson,
                        lesson: oldLesson.lesson
                          ? oldLesson.lesson + 1
                          : DATA_LESSONS.length + 2,
                      };
                    })
                  }
                />
                <ThemedText fontSize={16} fontWeight="600">
                  {newLesson.lesson || DATA_LESSONS.length + 1}
                </ThemedText>
                <Ionicons
                  name="arrow-down"
                  size={25}
                  style={{ margin: 0 }}
                  onPress={() => {
                    if (
                      newLesson.lesson !== DATA_LESSONS.length + 1 ||
                      undefined
                    ) {
                      setNewLesson((oldLesson) => {
                        return {
                          ...oldLesson,
                          lesson: oldLesson.lesson! - 1,
                        };
                      });
                    }
                  }}
                  color={
                    newLesson.lesson === (DATA_LESSONS.length + 1 || undefined)
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
