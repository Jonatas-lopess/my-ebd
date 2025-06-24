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
import { useCallback, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import TextButton from "@components/TextButton";
import { CustomBottomModal } from "@components/CustomBottomModal";
import { ListItemType } from "../LessonDetails/type";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import config from "config";
import { useAuth } from "@providers/AuthProvider";
import { Rollcall } from "../type";
import { Score } from "@screens/StatisticsDrawer/SettingsStack/ScoreOptions/type";
import ScoreOption from "@components/ScoreOption";

export default function ClassReport({ route }: HomeStackProps<"ClassReport">) {
  const { classId, lessonId } = route.params;
  const navigation = useNavigation();
  const theme = useTheme<ThemeProps>();
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

      return res.json();
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

  const { data, error, isPending, isError } = useQuery({
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

      return res.json();
    },
  });

  function generateList(data: Rollcall[] | undefined): ListItemType[] {
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

    if (data) {
      data.forEach((item) => {
        list.push({
          id: item.register.id,
          name: item.register.name,
          class: classId,
          isPresent: item.isPresent,
          report: report,
        });
      });
    }

    return list;
  }

  const [classReport, setReport] = useState<ListItemType[]>(generateList(data));
  const [tempItem, setTempItem] = useState<Partial<ListItemType>>({});

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
    [tempItem]
  );

  function onSheetDismiss() {
    setTempItem({});
  }

  const handleSaveReportChanges = useCallback(() => {
    const newValue = classReport.map((item) =>
      item.id === tempItem.id
        ? { ...item, report: tempItem.report, isPresent: true }
        : item
    );

    setReport(newValue);
    bottomSheetRef.current?.close();
  }, [classReport]);

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
        <StackHeader.Action
          name={isEditable ? "close" : "pencil"}
          onPress={() => setIsEditable((prev) => !prev)}
          color={theme.colors.gray}
        />
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
    </ThemedView>
  );
}
