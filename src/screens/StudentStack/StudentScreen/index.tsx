import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "@theme";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackHeader } from "@components/StackHeader";
import {
  BottomSheetEventType,
  CustomBottomModal,
} from "@components/CustomBottomModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import MaskInput, { Masks } from "react-native-mask-input";
import { RegisterFromApp, RegisterFromApi } from "./type";
import { useAuth } from "@providers/AuthProvider";
import config from "config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function StudentScreen() {
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const optionsSheetRef = useRef<BottomSheetModal>(null);
  const queryClient = useQueryClient();
  const [birthdayFilter, setBirthdayFilter] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [newRegister, setNewRegister] = useState<RegisterFromApp>({
    name: "",
    isTeacher: false,
    class: { id: "", name: "" },
  });
  const { token, user } = useAuth().authState;
  const TODAY = new Date();

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

  const { data: data_classes, isError: isErrorClass } = useQuery({
    queryKey: ["altclass"],
    queryFn: async () => {
      const res = await fetch(config.apiBaseUrl + "/classes", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.message, { cause: resJson.error });

      return resJson;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newData: RegisterFromApp) => {
      const res = await fetch(config.apiBaseUrl + "/registers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message, { cause: data.error });

      return data;
    },
    onSuccess: () => {
      cleanUp();
      return queryClient.invalidateQueries({ queryKey: ["register"] });
    },
    onError: (error) => {
      Alert.alert(
        "Algo deu errado!",
        `Erro ao criar o registro. Confira sua conexão de internet e tente novamente.`
      );
      console.log(error.message, error.cause);
    },
  });

  const { isPending: isPendingMutate, variables, mutate } = mutation;

  const matchMonth = (aniversary: Date) => {
    const month = aniversary.getMonth() + 1;
    return month === TODAY.getMonth() + 1;
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

  function cleanUp() {
    optionsSheetRef.current?.dismiss();
    setNewRegister({ name: "", class: { id: "", name: "" }, isTeacher: false });
  }

  const handleBottomSheet = useCallback((e: BottomSheetEventType) => {
    if (e.type === "open") bottomSheetRef.current?.present();
    if (e.type === "close") {
      cleanUp();
    }
  }, []);

  const handleOptionsSheet = useCallback((e: BottomSheetEventType) => {
    if (e.type === "open") optionsSheetRef.current?.present();
    if (e.type === "set") {
      setNewRegister((prev) => ({
        ...prev,
        class: { id: e.value._id, name: e.value.name, group: e.value.group },
      }));
      optionsSheetRef.current?.dismiss();
    }
    if (e.type === "close") optionsSheetRef.current?.dismiss();
  }, []);

  const handleNewRegisterDateChange = (
    e: DateTimePickerEvent,
    selectedDate?: Date
  ) =>
    e.type === "set" &&
    setNewRegister((prev) => {
      return {
        ...prev,
        aniversary: selectedDate?.toISOString() ?? prev.aniversary,
      };
    });

  function handleCreateNewRegister() {
    if (!newRegister.name || !newRegister.class.id) {
      return Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
    }

    mutate(newRegister);
    cleanUp();
  }

  return (
    <>
      <ThemedView flex={1} style={{ backgroundColor: "white" }}>
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
              isPendingMutate && (
                <ThemedView
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  gap="s"
                >
                  <ThemedText>
                    Adicionando o aluno {variables.name}...
                  </ThemedText>
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

      <CustomBottomModal.Root
        ref={bottomSheetRef}
        onDismiss={() => handleBottomSheet({ type: "close" })}
      >
        <CustomBottomModal.Content title="Novo Cadastro">
          <TextInput
            value={newRegister.name}
            placeholder="Nome*"
            onChangeText={(text) =>
              setNewRegister((prev) => ({ ...prev, name: text }))
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
                style={{ color: newRegister.class ? "black" : "#a0a0a0" }}
              >
                {newRegister.class ? newRegister.class.name : "Turma*"}
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>

          <ThemedText color="gray" fontWeight="bold" textAlign="center">
            Informações Extras
          </ThemedText>
          <ThemedView flexDirection="row" gap="s">
            <MaskInput
              value={newRegister.phone}
              placeholder="Número de Celular"
              onChangeText={(value) =>
                setNewRegister((prev) => ({
                  ...prev,
                  phone: value,
                }))
              }
              mask={Masks.BRL_PHONE}
              keyboardType="phone-pad"
              style={{
                flex: 2,
                borderWidth: 1,
                borderColor: theme.colors.lightgrey,
                borderRadius: 25,
                padding: theme.spacing.s,
              }}
            />
            <TouchableOpacity
              onPress={() =>
                DateTimePickerAndroid.open({
                  value: TODAY,
                  maximumDate: TODAY,
                  onChange: handleNewRegisterDateChange,
                })
              }
            >
              <ThemedView
                flex={1}
                padding="s"
                borderWidth={1}
                borderColor="lightgrey"
                borderRadius={25}
              >
                <ThemedText
                  style={{
                    color: newRegister.aniversary ? "black" : "#a0a0a0",
                  }}
                >
                  {newRegister.aniversary
                    ? new Date(newRegister.aniversary).toLocaleDateString(
                        "pt-BR"
                      )
                    : "Data de Nascimento"}
                </ThemedText>
              </ThemedView>
            </TouchableOpacity>
          </ThemedView>

          <Pressable
            onPress={() =>
              setNewRegister((prev) => ({
                ...prev,
                isTeacher: !prev.isTeacher,
              }))
            }
          >
            <ThemedView
              backgroundColor={
                newRegister.isTeacher ? "secondary" : "lightgrey"
              }
              borderRadius={25}
              py="s"
            >
              <ThemedText
                textAlign="center"
                color={newRegister.isTeacher ? "white" : "gray"}
              >
                Criar como Professor
              </ThemedText>
            </ThemedView>
          </Pressable>
        </CustomBottomModal.Content>
        <CustomBottomModal.Action onPress={handleCreateNewRegister} />
      </CustomBottomModal.Root>

      <CustomBottomModal.Root ref={optionsSheetRef} stackBehavior="push">
        <CustomBottomModal.Content title="Turmas">
          <FlatList
            data={data_classes}
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
                  <ThemedText>{item.name}</ThemedText>
                </ThemedView>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() =>
              isErrorClass ? (
                <ThemedText color="gray" textAlign="center">
                  Erro ao carregar as turmas.
                </ThemedText>
              ) : (
                <ThemedText textAlign="center" color="gray">
                  Nenhuma turma encontrada.
                </ThemedText>
              )
            }
          />
        </CustomBottomModal.Content>
      </CustomBottomModal.Root>
    </>
  );
}
