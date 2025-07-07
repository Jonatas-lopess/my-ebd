import { Alert, FlatList, TextInput, TouchableOpacity } from "react-native";
import ThemedView from "@components/ThemedView";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { ThemeProps } from "@theme";
import { useTheme } from "@shopify/restyle";
import { InfoCard } from "@components/InfoCard";
import { StackHeader } from "@components/StackHeader";
import { useNavigation } from "@react-navigation/native";
import {
  BottomSheetEventType,
  CustomBottomModal,
} from "@components/CustomBottomModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import ThemedText from "@components/ThemedText";
import { _Class } from "./type";
import { useAuth } from "@providers/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import config from "config";

export default function ClassScreen() {
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const optionsSheetRef = useRef<BottomSheetModal>(null);
  const queryClient = useQueryClient();
  const { token, user } = useAuth().authState;
  const EMPTYCLASSDATA: _Class = {
    name: "",
    group: undefined,
    flag: user?.plan ?? "",
  };
  const [newClass, setNewClass] = useState(EMPTYCLASSDATA);

  const {
    data: DATA_CLASS,
    error,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["altclass"],
    queryFn: async (): Promise<_Class[]> => {
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
    mutationFn: async (newData: _Class) => {
      const res = await fetch(config.apiBaseUrl + "/classes", {
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
      bottomSheetRef.current?.dismiss();
      return queryClient.invalidateQueries({ queryKey: ["altclass"] });
    },
    onError: (error, variables) => {
      Alert.alert(
        "Algo deu errado!",
        `Erro ao criar a turma ${variables.name}. Confira sua conexão de internet e tente novamente.`
      );
      console.log(error.message, error.cause);
    },
  });

  const { isPending: isPendingMutate, variables, mutate } = mutation;

  const handleBottomSheet = useCallback((e: BottomSheetEventType) => {
    if (e.type === "open") bottomSheetRef.current?.present();
    if (e.type === "close") setNewClass(EMPTYCLASSDATA);
  }, []);

  const handleOptionsSheet = useCallback((e: BottomSheetEventType) => {
    if (e.type === "open") optionsSheetRef.current?.present();
    if (e.type === "set") {
      setNewClass((prev) => ({ ...prev, group: e.value }));
      optionsSheetRef.current?.dismiss();
    }
    if (e.type === "close") optionsSheetRef.current?.dismiss();
  }, []);

  function handleCreateNewClass() {
    if (!newClass.name || !newClass.group) {
      return Alert.alert("Alerta", "Preencha todos os campos.");
    }

    mutate(newClass);
    setNewClass(EMPTYCLASSDATA);
    bottomSheetRef.current?.dismiss();
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
              name="add-outline"
              onPress={() => handleBottomSheet({ type: "open" })}
              color={theme.colors.gray}
            />
          </StackHeader.Actions>
        </StackHeader.Root>

        {isPending && (
          <ThemedView flex={1} justifyContent="center" alignItems="center">
            <ThemedText>Carregando...</ThemedText>
          </ThemedView>
        )}
        {isError && (
          <ThemedView flex={1} justifyContent="center" alignItems="center">
            <ThemedText>Erro ao carregar as turmas: {error.message}</ThemedText>
          </ThemedView>
        )}
        {DATA_CLASS && (
          <FlatList
            data={DATA_CLASS}
            renderItem={({ item }) => (
              <InfoCard.Root
                onPress={() =>
                  navigation.navigate("Turmas", {
                    screen: "ClassDetails",
                    params: { classId: item._id!.toString() },
                  })
                }
                onLongPress={() => console.log(item)}
              >
                <ThemedView flexDirection="row" alignItems="center" gap="xs">
                  <InfoCard.Title>{item.name}</InfoCard.Title>
                  <InfoCard.Detail>• {item.group}</InfoCard.Detail>
                </ThemedView>
                <InfoCard.Content>
                  <ThemedText>
                    Alunos: {item.students?.length.toString()}
                  </ThemedText>
                  <ThemedView borderLeftWidth={1} borderLeftColor="lightgrey" />
                  <ThemedText>Media: 100%</ThemedText>
                </InfoCard.Content>
              </InfoCard.Root>
            )}
            ListFooterComponent={() =>
              isPendingMutate && (
                <ThemedView
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  gap="s"
                >
                  <ThemedText>
                    Adicionando a turma {variables.name}...
                  </ThemedText>
                </ThemedView>
              )
            }
            keyExtractor={(item) => item._id!.toString()}
            style={{ backgroundColor: theme.colors.white }}
            contentContainerStyle={{
              gap: theme.spacing.s,
              marginTop: theme.spacing.s,
              paddingHorizontal: theme.spacing.s,
            }}
            showsVerticalScrollIndicator={false}
          />
        )}
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
            placeholder="Nome*"
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
                style={{ color: newClass.group ? "black" : "#a0a0a0" }}
              >
                {newClass.group ? newClass.group : "Faixa Etária"}
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </CustomBottomModal.Content>
        <CustomBottomModal.Action onPress={handleCreateNewClass} />
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
    </>
  );
}
