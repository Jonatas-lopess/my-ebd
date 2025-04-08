import { useTheme } from "@shopify/restyle";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { StackHeader } from "@components/StackHeader";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { HomeStackProps } from "@custom/types/navigation";
import { ThemeProps } from "@theme";
import { useNavigation } from "@react-navigation/native";
import { FlatList, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import { FakeCurrencyInput } from "react-native-currency-input";
import { ListItemType, ClassesType, InfoType } from "./type";
import { CustomCard } from "@components/CustomCard";
import TextButton from "@components/TextButton";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CustomBottomModal } from "@components/CustomBottomModal";

export default function LessonDetails({
  route,
}: HomeStackProps<"LessonDetails">) {
  const { lessonId } = route.params;
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();
  const [isEditable, setIsEditable] = useState(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const list: ListItemType[] = [
    {
      id: 1,
      name: "João",
      isPresent: true,
      report: {
        bibles: true,
        books: true,
        offer: 0,
      },
    },
    {
      id: 2,
      name: "Ana",
      isPresent: true,
      report: {
        bibles: false,
        books: false,
        offer: 0,
      },
    },
    {
      id: 3,
      name: "Pedro",
      isPresent: false,
      report: {
        bibles: true,
        books: false,
        offer: 0,
      },
    },
  ];

  const [teachersList, setTeachersList] = useState<ListItemType[]>(list);
  const [tempItem, setTempItem] = useState<
    Partial<Omit<ListItemType, "name" | "isPresent">>
  >({});

  const classes: ClassesType[] = [
    {
      id: 1,
      name: "Jovem",
      description: "Classe Jovem",
    },
    {
      id: 2,
      name: "Homem",
      description: "Classe Jovem",
    },
    {
      id: 3,
      name: "Criança",
    },
    {
      id: 4,
      name: "Adolescente",
      description: "Classe Jovem",
    },
    {
      id: 5,
      name: "Mulher",
    },
  ];

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
    const newValue = teachersList.map((item) =>
      item.id === tempItem.id
        ? { ...item, report: tempItem.report, isPresent: true }
        : item
    );

    setTeachersList(newValue);
    bottomSheetRef.current?.close();
  }, [teachersList]);

  function findItem(id: number) {
    const item = teachersList.find((item) => item.id === id);

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
            <StackHeader.Title>{lessonId}</StackHeader.Title>
          </StackHeader.Content>
          <StackHeader.Actions>
            <StackHeader.Action
              name="lock-open"
              onPress={() => {}}
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
              <FlatList
                data={classes}
                scrollEnabled={false}
                contentContainerStyle={{
                  gap: theme.spacing.s,
                  marginTop: theme.spacing.s,
                }}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Inicio", {
                        screen: "ClassReport",
                        params: { classId: item.id.toString() },
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
                        borderLeftColor: item.description ? "green" : "orange",
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
                          item.description ? "checkmark-circle" : "alert-circle"
                        }
                        size={35}
                        style={{ margin: 0 }}
                        color={item.description ? "green" : "orange"}
                      />
                    </ThemedView>
                  </TouchableOpacity>
                )}
              />
            </CustomCard.Root>

            <CustomCard.Root borderRadius={20}>
              <CustomCard.Title>Chamada de Professores</CustomCard.Title>
              <CustomCard.Detail>
                Clique sobre os nomes para confirmar a presença.
              </CustomCard.Detail>
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
            </CustomCard.Root>
          </ScrollView>
        </ThemedView>
      </ThemedView>

      <CustomBottomModal.Root ref={bottomSheetRef} onDismiss={onSheetDismiss}>
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
    </>
  );
}
