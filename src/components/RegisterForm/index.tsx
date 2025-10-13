import ThemedView from "@components/ThemedView";
import ThemedText from "@components/ThemedText";
import {
  TextInput,
  TouchableOpacity,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import MaskInput, { Masks } from "react-native-mask-input";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { RegisterFromApp } from "@screens/RegisterStack/RegisterScreen/type";
import { useCallback, useEffect, useRef, useState } from "react";
import { theme } from "@theme";
import {
  BottomSheetEventType,
  CustomBottomModal,
} from "@components/CustomBottomModal";
import config from "config";
import { useAuth } from "@providers/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

type Props = {
  mutateFallback?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RegisterForm({ mutateFallback }: Props) {
  const TODAY = new Date();
  const [inputs, setInputs] = useState<Partial<RegisterFromApp>>({});
  const { token } = useAuth().authState;
  const optionsSheetRef = useRef<BottomSheetModal>(null);
  const queryClient = useQueryClient();

  const handleNewRegisterDateChange = (
    e: DateTimePickerEvent,
    selectedDate?: Date
  ) =>
    e.type === "set" &&
    setInputs((prev) => {
      return {
        ...prev,
        aniversary: selectedDate?.toISOString() ?? prev?.aniversary,
      };
    });

  const { data, isError } = useQuery({
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

  const { isPending, mutate } = mutation;

  const handleOptionsSheet = useCallback((e: BottomSheetEventType) => {
    if (e.type === "open") optionsSheetRef.current?.present();
    if (e.type === "set") {
      setInputs((prev) => ({
        ...prev,
        class: { id: e.value._id, name: e.value.name, group: e.value.group },
      }));
      optionsSheetRef.current?.dismiss();
    }
    if (e.type === "close") optionsSheetRef.current?.dismiss();
  }, []);

  function handleCreateNewRegister() {
    if (!inputs.name || !inputs.class?.id) {
      return Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
    }

    //console.log(inputs);
    mutate(inputs as RegisterFromApp);
    optionsSheetRef.current?.dismiss();
    setInputs({});
  }

  useEffect(() => {
    mutateFallback?.(isPending);
  }, [isPending]);

  return (
    <>
      <ThemedView gap="s">
        <TextInput
          placeholder="Nome*"
          placeholderTextColor="#a0a0a0"
          value={inputs.name}
          onChangeText={(text) =>
            setInputs((prev) => ({ ...prev, name: text }))
          }
          style={{
            borderWidth: 1,
            borderColor: theme.colors.lightgrey,
            borderRadius: 25,
            padding: theme.spacing.s,
          }}
        />

        <TouchableOpacity onPress={() => handleOptionsSheet({ type: "open" })}>
          <ThemedView
            padding="s"
            borderWidth={1}
            borderColor="lightgrey"
            borderRadius={25}
          >
            <ThemedText
              style={{ color: inputs.class?.name ? "black" : "#a0a0a0" }}
            >
              {inputs.class && inputs.class.name !== ""
                ? inputs.class.name
                : "Turma*"}
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>

        <ThemedText color="gray" fontWeight="bold" textAlign="center">
          Informações Extras
        </ThemedText>
        <ThemedView flexDirection="row" gap="s">
          <MaskInput
            placeholder="Número de Celular"
            placeholderTextColor="#a0a0a0"
            value={inputs.phone}
            onChangeText={(text) =>
              setInputs((prev) => ({ ...prev, phone: text }))
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
                  color: inputs.aniversary ? "black" : "#a0a0a0",
                }}
              >
                {inputs.aniversary
                  ? new Date(inputs.aniversary).toLocaleDateString("pt-BR")
                  : "Data de Nascimento"}
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>

        <Pressable
          onPress={() =>
            setInputs((prev) => ({
              ...prev,
              isTeacher: !prev.isTeacher,
            }))
          }
        >
          <ThemedView
            backgroundColor={inputs.isTeacher ? "secondary" : "lightgrey"}
            borderRadius={25}
            py="s"
          >
            <ThemedText
              textAlign="center"
              color={inputs.isTeacher ? "white" : "gray"}
            >
              Criar como Professor
            </ThemedText>
          </ThemedView>
        </Pressable>

        <CustomBottomModal.Action onPress={handleCreateNewRegister} />
      </ThemedView>

      <CustomBottomModal.Root ref={optionsSheetRef} stackBehavior="push">
        <CustomBottomModal.Content title="Turmas">
          <ThemedView mb="m">
            <FlatList
              data={data}
              contentContainerStyle={{ gap: theme.spacing.s }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    handleOptionsSheet({ type: "set", value: item })
                  }
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
                isError ? (
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
          </ThemedView>
        </CustomBottomModal.Content>
      </CustomBottomModal.Root>
    </>
  );
}
