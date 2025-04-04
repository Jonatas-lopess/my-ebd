import { FlatList, TextInput, TouchableOpacity } from "react-native";
import ThemedView from "@components/ThemedView";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { ThemeProps } from "@theme";
import { useTheme } from "@shopify/restyle";
import { InfoCard } from "@components/InfoCard";
import { StackHeader } from "@components/StackHeader";
import { useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetEventType,
  CustomBottomModal,
} from "@components/CustomBottomModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import ThemedText from "@components/ThemedText";
import { NewClass } from "./type";

export default function ClassScreen() {
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const optionsSheetRef = useRef<BottomSheetModal>(null);
  const [newClass, setNewClass] = useState<NewClass>({
    name: "",
    type: undefined,
  });

  const DATA_CLASS = [
    { id: 1, name: "Josué", students: 10, type: "Jovens" },
    { id: 2, name: "Abraão", students: 14, type: "Adultos" },
  ];

  const handleBottomSheet = useCallback((e: BottomSheetEventType) => {
    if (e.type === "open") bottomSheetRef.current?.present();
    if (e.type === "close") setNewClass({ name: "", type: undefined });
  }, []);

  const handleOptionsSheet = useCallback((e: BottomSheetEventType) => {
    if (e.type === "open") optionsSheetRef.current?.present();
    if (e.type === "set") {
      setNewClass((prev) => ({ ...prev, type: e.value }));
      optionsSheetRef.current?.dismiss();
    }
    if (e.type === "close") optionsSheetRef.current?.dismiss();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView flex={1} style={{ backgroundColor: "white" }}>
        <FocusAwareStatusBar style="dark" translucent />

        <StackHeader.Root>
          <StackHeader.Content>
            <StackHeader.Title>Minha EBD</StackHeader.Title>
            <StackHeader.Detail>• Vila Mury</StackHeader.Detail>
          </StackHeader.Content>
          <StackHeader.Actions>
            <StackHeader.Action
              name="add-outline"
              onPress={() => handleBottomSheet({ type: "open" })}
              color={theme.colors.gray}
            />
          </StackHeader.Actions>
        </StackHeader.Root>

        <FlatList
          data={DATA_CLASS}
          renderItem={({ item }) => (
            <InfoCard.Root
              onPress={() =>
                navigation.navigate("Turmas", {
                  screen: "ClassDetails",
                  params: { classId: item.id.toString() },
                })
              }
              onLongPress={() => {}}
            >
              <ThemedView flexDirection="row" alignItems="center" gap="xs">
                <InfoCard.Title>{item.name}</InfoCard.Title>
                <InfoCard.Detail>• {item.type}</InfoCard.Detail>
              </ThemedView>
              <InfoCard.Content>
                <ThemedText>Alunos: {item.students.toString()}</ThemedText>
                <ThemedView borderLeftWidth={1} borderLeftColor="lightgrey" />
                <ThemedText>Media: 100%</ThemedText>
              </InfoCard.Content>
            </InfoCard.Root>
          )}
          keyExtractor={(item) => item.id.toString()}
          style={{ backgroundColor: theme.colors.white }}
          contentContainerStyle={{
            gap: theme.spacing.s,
            marginTop: theme.spacing.s,
            paddingHorizontal: theme.spacing.s,
          }}
        />
      </ThemedView>

      <CustomBottomModal.Root
        ref={bottomSheetRef}
        onDismiss={() => handleBottomSheet({ type: "close" })}
      >
        <CustomBottomModal.Content
          title="Nova Turma"
          subtitle="Preencha o nome e a faixa etária da turma. As categorias servem apenas para ordenar as turmas no aplicativo."
        >
          <TextInput
            placeholder="Nome"
            onChangeText={(text) =>
              setNewClass((prev) => ({ ...prev, name: text }))
            }
            style={{
              borderWidth: 1,
              borderColor: theme.colors.lightgrey,
              borderRadius: 25,
              padding: theme.spacing.s,
            }}
          />
          <TouchableOpacity
            onPress={() => handleOptionsSheet({ type: "open" })}
          >
            <ThemedView
              padding="s"
              borderWidth={1}
              borderColor="lightgrey"
              borderRadius={25}
            >
              <ThemedText
                style={{ color: newClass.type ? "black" : "#a0a0a0" }}
              >
                {newClass.type ? newClass.type : "Faixa Etária"}
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </CustomBottomModal.Content>
        <CustomBottomModal.Action onPress={() => {}} />
      </CustomBottomModal.Root>

      <CustomBottomModal.Root ref={optionsSheetRef} stackBehavior="push">
        <CustomBottomModal.Content title="Faixas Etárias">
          <FlatList
            data={[
              "Discipulados",
              "Adultos",
              "Jovens",
              "Adolescentes",
              "Crianças",
              "Maternal",
            ]}
            contentContainerStyle={{ gap: theme.spacing.s }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleOptionsSheet({ type: "set", value: item })}
              >
                <ThemedView
                  py="s"
                  px="m"
                  borderWidth={1}
                  borderColor="lightgrey"
                  borderRadius={25}
                >
                  <ThemedText>{item}</ThemedText>
                </ThemedView>
              </TouchableOpacity>
            )}
          />
        </CustomBottomModal.Content>
      </CustomBottomModal.Root>
    </GestureHandlerRootView>
  );
}
