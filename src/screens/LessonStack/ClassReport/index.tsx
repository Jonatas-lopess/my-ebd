import { CustomCard } from "@components/CustomCard";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { StackHeader } from "@components/StackHeader";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { HomeStackProps } from "@custom/types/navigation";
import { ScrollView, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "@theme";
import { useCallback, useRef, useState } from "react";
import { FakeCurrencyInput } from "react-native-currency-input";
import { useNavigation } from "@react-navigation/native";
import TextButton from "@components/TextButton";
import { CustomBottomModal } from "@components/CustomBottomModal";
import { ListItemType } from "../LessonDetails/type";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export default function ClassReport({ route }: HomeStackProps<"ClassReport">) {
  const { classId } = route.params;
  const navigation = useNavigation();
  const theme = useTheme<ThemeProps>();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [isEditable, setIsEditable] = useState(false);

  const list: ListItemType[] = [
    {
      id: 1,
      name: "Josué",
      isPresent: false,
      report: {
        bibles: false,
        books: false,
        offer: 0,
      },
    },
    {
      id: 2,
      name: "Maria",
      isPresent: false,
      report: {
        bibles: false,
        books: false,
        offer: 0,
      },
    },
  ];
  const [classReport, setReport] = useState<ListItemType[]>(list);
  const [tempItem, setTempItem] = useState<
    Partial<Omit<ListItemType, "name" | "isPresent">>
  >({});

  const handleOpenBottomSheet = useCallback(
    (id: number) => {
      setTempItem(JSON.parse(JSON.stringify(findItem(id))));
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

  function findItem(id: number) {
    const item = classReport.find((item) => item.id === id);

    if (typeof item === "undefined") throw new Error("Item not found");
    return item;
  }

  function handleToggleScoreOption(option: "bibles" | "books") {
    const newValue = tempItem.report ?? {
      bibles: false,
      books: false,
      offer: 0,
    };

    newValue[option] = !newValue[option];

    setTempItem((prev) => ({
      ...prev,
      report: newValue,
    }));
  }

  function handleChangeOffer(value: number | null) {
    const newValue = tempItem.report ?? {
      bibles: false,
      books: false,
      offer: 0,
    };

    newValue.offer = value ?? 0;

    setTempItem({
      id: tempItem.id,
      report: newValue,
    });
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
          <StackHeader.Title>Josué</StackHeader.Title>
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
          </CustomCard.Root>
        </ScrollView>
      </ThemedView>

      <CustomBottomModal.Root
        ref={bottomSheetRef}
        onDismiss={onSheetDismiss}
        stackBehavior="replace"
      >
        <CustomBottomModal.Content
          title={tempItem.id ? findItem(tempItem.id).name : ""}
        >
          <TextButton
            justifyContent="space-between"
            variant="outline"
            onClick={() => handleToggleScoreOption("bibles")}
          >
            <ThemedView flexDirection="row" alignItems="center">
              <Ionicons name="bookmark" size={25} style={{ margin: 0 }} />
              <ThemedText fontSize={16} fontWeight="bold" ml="s">
                Bíblia
              </ThemedText>
            </ThemedView>

            <Ionicons
              name={
                tempItem.report?.bibles ? "checkmark-circle" : "close-circle"
              }
              size={28}
              style={{ margin: 0, padding: 0 }}
              color={tempItem.report?.bibles ? "green" : "red"}
            />
          </TextButton>

          <TextButton
            justifyContent="space-between"
            variant="outline"
            onClick={() => handleToggleScoreOption("books")}
          >
            <ThemedView flexDirection="row" alignItems="center">
              <Ionicons name="book" size={25} style={{ margin: 0 }} />
              <ThemedText fontSize={16} fontWeight="bold" ml="s">
                Revista
              </ThemedText>
            </ThemedView>
            <Ionicons
              name={
                tempItem.report?.books ? "checkmark-circle" : "close-circle"
              }
              size={28}
              style={{ margin: 0, padding: 0 }}
              color={tempItem.report?.books ? "green" : "red"}
            />
          </TextButton>
          <TextButton justifyContent="space-between" variant="outline" disabled>
            <ThemedView flexDirection="row" alignItems="center">
              <Ionicons name="cash-outline" size={25} style={{ margin: 0 }} />
              <ThemedText fontSize={16} fontWeight="bold" ml="s">
                Oferta
              </ThemedText>
            </ThemedView>
            <FakeCurrencyInput
              value={tempItem.report?.offer ?? 0}
              placeholder="R$0,00"
              prefix="R$"
              delimiter="."
              separator=","
              precision={2}
              minValue={0}
              onChangeValue={(value) => handleChangeOffer(value)}
              style={{
                textAlignVertical: "center",
                padding: 0,
                margin: 0,
                fontWeight: "bold",
                fontSize: 20,
              }}
            />
          </TextButton>
        </CustomBottomModal.Content>
        <CustomBottomModal.Action
          text="Confirmar"
          onPress={handleSaveReportChanges}
        />
      </CustomBottomModal.Root>
    </ThemedView>
  );
}
