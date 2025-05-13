import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "@theme";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useCallback, useRef, useState } from "react";
import { FlatList, Pressable, TextInput, TouchableOpacity } from "react-native";
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
import { Register } from "./type";
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
  const [newRegister, setNewRegister] = useState<Partial<Register>>({
    _id: undefined,
    name: "",
    phone: "",
    class: undefined,
    isProfessor: false,
  });
  const { authState } = useAuth();
  const TODAY = new Date();

  const { data, error, isError, isPending } = useQuery({
    queryKey: ["register", authState?.token],
    queryFn: async (): Promise<Register[]> => {
      const res = await fetch(config.apiBaseUrl + "/registers", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authState?.token}`,
          "Content-Type": "application/json",
        },
      });

      return res.json();
    },
    enabled: !!authState?.token,
  });

  const mutation = useMutation({
    mutationFn: async (newData: Partial<Register>) => {
      const registerData = {
        name: "Teste aluno",
        class: {
          id: "67ffb25e9f8621cad42ac5b5",
          name: "Josué",
        },
      };

      const res = await fetch(config.apiBaseUrl + "/registers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message, { cause: data.error });

      return data;
    },
    onSuccess: (data) => {
      //queryClient.invalidateQueries({ queryKey: ["register"] });
      console.log("New register added:", data);
      cleanUp();
    },
    onError: (error) => {
      console.log(error.message, error.cause);
    },
  });

  const matchMounth = (anniversary: Date) => {
    const month = anniversary.getMonth() + 1;
    return month === TODAY.getMonth() + 1;
  };

  const DATA_FILTERED = data?.filter((item) => {
    if (birthdayFilter)
      return item.anniversary && matchMounth(item.anniversary);
    if (nameFilter)
      return item.name.toLowerCase().includes(nameFilter.toLowerCase());

    return true;
  });

  function cleanUp() {
    optionsSheetRef.current?.dismiss();
    setNewRegister({
      class: undefined,
      isProfessor: false,
      anniversary: undefined,
      phone: undefined,
    });
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
      setNewRegister((prev) => ({ ...prev, class: e.value }));
      optionsSheetRef.current?.dismiss();
    }
    if (e.type === "close") optionsSheetRef.current?.dismiss();
  }, []);

  const handleNewRegisterDateChange = (
    e: DateTimePickerEvent,
    selectedDate?: Date
  ) =>
    e.type === "set" &&
    setNewRegister((oldRegister) => {
      return {
        ...oldRegister,
        anniversary: selectedDate || oldRegister.anniversary,
      };
    });

  return (
    <>
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

        {isPending && (
          <ThemedView
            flex={1}
            justifyContent="center"
            alignItems="center"
            style={{ backgroundColor: "#fff" }}
          >
            <ThemedText>Carregando...</ThemedText>
          </ThemedView>
        )}
        {isError && (
          <ThemedView
            flex={1}
            justifyContent="center"
            alignItems="center"
            style={{ backgroundColor: "#fff" }}
          >
            <ThemedText>
              Erro ao carregar os cadastros: {error.message}
            </ThemedText>
          </ThemedView>
        )}
        {DATA_FILTERED && (
          <FlatList
            data={DATA_FILTERED}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("Cadastros", {
                    screen: "RegisterHistory",
                    params: { studentId: item._id! },
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
                  {item.anniversary && matchMounth(item.anniversary!) && (
                    <ThemedView flexDirection="row" alignItems="center" gap="s">
                      <ThemedText color="secondary">
                        {item.anniversary.toLocaleDateString("pt-BR", {
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
            )}
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
            placeholder="Nome"
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
                {newRegister.class ? newRegister.class : "Turma"}
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
                    color: newRegister.anniversary ? "black" : "#a0a0a0",
                  }}
                >
                  {newRegister.anniversary
                    ? newRegister.anniversary.toLocaleDateString("pt-BR")
                    : "Data de Nascimento"}
                </ThemedText>
              </ThemedView>
            </TouchableOpacity>
          </ThemedView>

          <Pressable
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
        </CustomBottomModal.Content>
        <CustomBottomModal.Action
          onPress={() => mutation.mutate(newRegister)}
        />
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
    </>
  );
}
