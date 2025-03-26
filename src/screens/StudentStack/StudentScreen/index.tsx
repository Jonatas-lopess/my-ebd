import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "../../../theme";
import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView";
import FocusAwareStatusBar from "../../../components/FocusAwareStatusBar";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackHeader } from "../../../components/StackHeader";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetEventType,
  CustomBottomModal,
} from "../../../components/CustomBottomModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

type Student = {
  id: string;
  name: string;
  birthday: string;
};

type Register = {
  name: string;
  class: string | undefined;
  isProfessor: boolean;
};

export default function StudentScreen() {
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const optionsSheetRef = useRef<BottomSheetModal>(null);
  const [birthdayFilter, setBirthdayFilter] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [newRegister, setNewRegister] = useState<Register>({
    name: "",
    class: undefined,
    isProfessor: false,
  });

  const DATA: Student[] = [
    { id: "eqEQ213", name: "João", birthday: "07/12" },
    { id: "eqEQ210", name: "Maria", birthday: "18/06" },
    { id: "eqEQ221", name: "Pedro", birthday: "21/03" },
  ];

  const matchMounth = (item: Student) => {
    const [_, month] = item.birthday.split("/").map(Number);
    return month === new Date().getMonth() + 1;
  };

  const DATA_FILTERED = DATA.filter((item) => {
    if (birthdayFilter) return matchMounth(item);
    if (nameFilter) {
      return item.name.includes(nameFilter);
    }
    return true;
  });

  const handleBottomSheet = useCallback((e: BottomSheetEventType) => {
    if (e.type === "open") bottomSheetRef.current?.present();
    if (e.type === "close") {
      setNewRegister({ name: "", class: "", isProfessor: false });
      optionsSheetRef.current?.dismiss();
    }
  }, []);

  const handleOptionsSheet = useCallback((e: BottomSheetEventType) => {
    if (e.type === "open") optionsSheetRef.current?.present();
    if (e.type === "set") {
      setNewRegister((prev) => ({ ...prev, class: e.value }));
      optionsSheetRef.current?.dismiss();
    }
    if (e.type === "close") optionsSheetRef.current?.dismiss();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView flex={1} style={{ backgroundColor: "#fff" }}>
        <FocusAwareStatusBar style="dark" translucent />

        <StackHeader.Root>
          <StackHeader.Content>
            <StackHeader.Title>Minha EBD</StackHeader.Title>
            <StackHeader.Detail>• Vila Mury</StackHeader.Detail>
          </StackHeader.Content>
          <StackHeader.Actions>
            <StackHeader.Action
              name="birthday-cake"
              onPress={() => setBirthdayFilter(!birthdayFilter)}
              color={birthdayFilter ? theme.colors.primary : theme.colors.gray}
            />
            <StackHeader.Action
              name="add-outline"
              onPress={() => handleBottomSheet({ type: "open" })}
              color={theme.colors.gray}
            />
          </StackHeader.Actions>
        </StackHeader.Root>

        <TextInput
          placeholder="Pesquisar por nome"
          value={nameFilter}
          onChangeText={setNameFilter}
          style={{
            backgroundColor: theme.colors.white,
            borderRadius: 20,
            padding: theme.spacing.s,
            marginBottom: theme.spacing.s,
            marginHorizontal: theme.spacing.s,
          }}
        />

        <FlatList
          data={DATA_FILTERED}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate("Cadastros", {
                  screen: "Alunos_Historico",
                  params: { studentId: item.id },
                })
              }
            >
              <ThemedView
                py="s"
                px="m"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                borderRadius={20}
                style={{ backgroundColor: "#fff" }}
              >
                <ThemedText fontSize={16}>{item.name}</ThemedText>
                {matchMounth(item) && (
                  <ThemedView flexDirection="row" alignItems="center" gap="s">
                    <ThemedText color="secondary">{item.birthday}</ThemedText>
                    <FontAwesome
                      name="birthday-cake"
                      color={theme.colors.secondary}
                      size={18}
                    />
                  </ThemedView>
                )}
              </ThemedView>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
          style={{
            backgroundColor: theme.colors.white,
            height: "100%",
          }}
          contentContainerStyle={{
            gap: theme.spacing.s,
            marginTop: theme.spacing.s,
            paddingHorizontal: theme.spacing.s,
          }}
        ></FlatList>
      </ThemedView>

      <CustomBottomModal.Root
        ref={bottomSheetRef}
        onDismiss={() => handleBottomSheet({ type: "close" })}
      >
        <CustomBottomModal.Content title="Novo Cadastro">
          <TextInput
            placeholder="Nome"
            onChangeText={(text) => {}}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.lightgrey,
              borderRadius: 25,
              padding: 10,
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
                style={{ color: newRegister.class ? "black" : "#a0a0a0" }}
              >
                {newRegister.class ? newRegister.class : "Turma"}
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>

          <ThemedView
            flexDirection="row"
            justifyContent="space-between"
            gap="s"
          >
            <Pressable
              style={{ flex: 2 }}
              onPress={() =>
                setNewRegister((prev) => ({
                  ...prev,
                  isProfessor: !prev.isProfessor,
                }))
              }
            >
              <ThemedView
                backgroundColor={
                  newRegister.isProfessor ? "secondary" : "lightgrey"
                }
                borderRadius={25}
                py="s"
              >
                <ThemedText
                  textAlign="center"
                  color={newRegister.isProfessor ? "white" : "gray"}
                >
                  Criar como Professor
                </ThemedText>
              </ThemedView>
            </Pressable>
            <Pressable style={{ flex: 1 }} onPress={() => {}}>
              <ThemedView backgroundColor="lightgrey" borderRadius={25} py="s">
                <ThemedText textAlign="center" color="gray">
                  Dados Extras
                </ThemedText>
              </ThemedView>
            </Pressable>
          </ThemedView>
        </CustomBottomModal.Content>
        <CustomBottomModal.Action onPress={() => {}} />
      </CustomBottomModal.Root>

      <CustomBottomModal.Root ref={optionsSheetRef} stackBehavior="push">
        <CustomBottomModal.Content title="Turmas">
          <FlatList
            data={["Josué", "Abraão"]}
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
