import { CustomBottomModal } from "@components/CustomBottomModal";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useAuth } from "@providers/AuthProvider";
import { Lesson } from "@screens/LessonStack/LessonScreen/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import config from "config";
import { theme } from "@theme";
import { Alert } from "react-native/Libraries/Alert/Alert";

type Props = {
  mutateFallback: React.Dispatch<React.SetStateAction<boolean>>;
  defaultLessonNumber: number | undefined;
};

export default function LessonForm({
  mutateFallback,
  defaultLessonNumber,
}: Props) {
  const today = new Date();
  const queryClient = useQueryClient();
  const { user, token } = useAuth().authState;
  const DEFAULTLESSON: Lesson = {
    flag: user?.plan ?? "",
    number: defaultLessonNumber,
    date: today,
  };
  const [newLesson, setNewLesson] = useState<Lesson>(DEFAULTLESSON);

  const isLessonNumberInvalid =
    newLesson.number === undefined ||
    newLesson.number === defaultLessonNumber ||
    newLesson.number === 1;

  const { isPending } = useMutation({
    mutationFn: async () => {
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
    //mutate();
    console.log(newLesson);
  };

  useEffect(() => {
    mutateFallback(isPending);
  }, [isPending]);

  return (
    <ThemedView g="s">
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
              if (isLessonNumberInvalid) return;

              setNewLesson((prev) => ({
                ...prev,
                number:
                  prev.number === undefined
                    ? defaultLessonNumber! - 1
                    : prev.number - 1,
              }));
            }}
            color={isLessonNumberInvalid ? theme.colors.lightgrey : "black"}
          />
        </ThemedView>
      </ThemedView>

      <CustomBottomModal.Action onPress={handleCreateNewLesson} />
    </ThemedView>
  );
}
