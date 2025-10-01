import { FlatList, KeyboardAvoidingView, Platform } from "react-native";
import ThemedView from "@components/ThemedView";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { ThemeProps } from "@theme";
import { useTheme } from "@shopify/restyle";
import { InfoCard } from "@components/InfoCard";
import { StackHeader } from "@components/StackHeader";
import { useNavigation } from "@react-navigation/native";
import { CustomBottomModal } from "@components/CustomBottomModal";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import ThemedText from "@components/ThemedText";
import { _Class } from "./type";
import { useAuth } from "@providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import config from "config";
import ClassForm from "@components/ClassForm";

export default function ClassScreen() {
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { token } = useAuth().authState;
  const [isPendingMutate, setIsPendingMutate] = useState(false);

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
              name="add-outline"
              onPress={() => bottomSheetRef.current?.present()}
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
                  <ThemedText>Adicionando a nova turma...</ThemedText>
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

      <BottomSheetModalProvider>
        <CustomBottomModal.Root
          ref={bottomSheetRef}
          onDismiss={() => bottomSheetRef.current?.dismiss()}
        >
          <CustomBottomModal.Content
            title="Nova Turma"
            subtitle="Preencha o nome e a faixa etária da turma. As categorias servem apenas para ordenar as turmas no aplicativo."
          >
            <ClassForm mutateFallback={setIsPendingMutate} />
          </CustomBottomModal.Content>
        </CustomBottomModal.Root>
      </BottomSheetModalProvider>
    </KeyboardAvoidingView>
  );
}
