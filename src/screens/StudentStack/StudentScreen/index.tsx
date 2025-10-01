import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "@theme";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackHeader } from "@components/StackHeader";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { RegisterFromApi } from "./type";
import { useAuth } from "@providers/AuthProvider";
import config from "config";
import { useQuery } from "@tanstack/react-query";
import { CustomBottomModal } from "@components/CustomBottomModal";
import RegisterForm from "@components/RegisterForm";

export default function StudentScreen() {
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [birthdayFilter, setBirthdayFilter] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const { token, user } = useAuth().authState;
  const [mutateState, setMutateState] = useState(false);

  async function getRegisters(): Promise<RegisterFromApi[]> {
    if (user === undefined) throw new Error("User is undefined");

    if (user.role === "teacher") {
      const res = await fetch(
        config.apiBaseUrl +
          "/registers?hasUser=false&class=" +
          user.register?.class,
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

    const res = await fetch(config.apiBaseUrl + "/registers", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const resJson = await res.json();
    if (!res.ok) throw new Error(resJson.message, { cause: resJson.error });

    return resJson;
  }

  const { data, error, isError, isPending } = useQuery({
    queryKey: ["register"],
    queryFn: getRegisters,
  });

  const matchMonth = (aniversary: Date) => {
    const month = aniversary.getMonth() + 1;
    return month === new Date().getMonth() + 1;
  };

  const filteredData = data
    ? data.filter((item) => {
        if (birthdayFilter)
          return item.aniversary && matchMonth(new Date(item.aniversary));
        if (nameFilter)
          return item.name.toLowerCase().includes(nameFilter.toLowerCase());

        return true;
      })
    : undefined;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ThemedView style={{ backgroundColor: "white" }}>
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
              onPress={() => bottomSheetRef.current?.present()}
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

        {isPending && (
          <ThemedView flex={1} justifyContent="center" alignItems="center">
            <ThemedText>Carregando...</ThemedText>
          </ThemedView>
        )}
        {isError && (
          <ThemedView flex={1} justifyContent="center" alignItems="center">
            <ThemedText>
              Erro ao carregar os cadastros: {error.message}
            </ThemedText>
          </ThemedView>
        )}
        {filteredData && (
          <FlatList
            data={filteredData}
            renderItem={({ item }) => {
              const dateFormatAniversary =
                item.aniversary && new Date(item.aniversary);

              return (
                <Pressable
                  onPress={() =>
                    navigation.navigate("Cadastros", {
                      screen: "RegisterHistory",
                      params: { studentId: item._id },
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
                    {dateFormatAniversary &&
                      matchMonth(dateFormatAniversary) && (
                        <ThemedView
                          flexDirection="row"
                          alignItems="center"
                          gap="s"
                        >
                          <ThemedText color="secondary">
                            {dateFormatAniversary.toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                            })}
                          </ThemedText>
                          <FontAwesome
                            name="birthday-cake"
                            color={theme.colors.secondary}
                            size={18}
                          />
                        </ThemedView>
                      )}
                  </ThemedView>
                </Pressable>
              );
            }}
            ListFooterComponent={() =>
              mutateState && (
                <ThemedView
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  gap="s"
                >
                  <ThemedText>Adicionando o novo aluno...</ThemedText>
                </ThemedView>
              )
            }
            keyExtractor={(item, index) => item._id ?? index.toString()}
            style={{
              backgroundColor: theme.colors.white,
              height: "100%",
            }}
            contentContainerStyle={{
              gap: theme.spacing.s,
              marginTop: theme.spacing.s,
              paddingHorizontal: theme.spacing.s,
            }}
          />
        )}
      </ThemedView>

      <BottomSheetModalProvider>
        <CustomBottomModal.Root
          ref={bottomSheetRef}
          onDismiss={() => {
            bottomSheetRef.current?.dismiss();
          }}
        >
          <CustomBottomModal.Content title="Novo Cadastro">
            <RegisterForm mutateFallback={setMutateState} />
          </CustomBottomModal.Content>
        </CustomBottomModal.Root>
      </BottomSheetModalProvider>
    </KeyboardAvoidingView>
  );
}
