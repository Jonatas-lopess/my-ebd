import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { StackHeader } from "@components/StackHeader";
import ThemedView from "@components/ThemedView";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "@theme";
import { CustomCard } from "@components/CustomCard";
import { FlatList, KeyboardAvoidingView, Platform } from "react-native";
import TextButton from "@components/TextButton";
import ThemedText from "@components/ThemedText";
import CustomIcon from "@components/CustomIcon";
import { CustomBottomModal } from "@components/CustomBottomModal";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import { Score } from "./type";
import { useQuery } from "@tanstack/react-query";
import config from "config";
import { useAuth } from "@providers/AuthProvider";
import ScoreForm from "@components/ScoreForm";

export default function ScoreOptions() {
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();
  const { token } = useAuth().authState;
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [isPendingMutate, setIsPendingMutate] = useState<boolean>(false);

  const { data } = useQuery({
    queryKey: ["scores"],
    queryFn: async (): Promise<Score[]> => {
      const response = await fetch(config.apiBaseUrl + "/scores", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await response.json();
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <FocusAwareStatusBar style="dark" translucent />

      <StackHeader.Root>
        <StackHeader.Content>
          <StackHeader.Action
            name="arrow-back"
            onPress={() => navigation.goBack()}
            color={theme.colors.gray}
          />
          <StackHeader.Title>Pontuação</StackHeader.Title>
        </StackHeader.Content>
        <StackHeader.Action
          name="add-outline"
          onPress={() => bottomSheetRef.current?.present()}
          color={theme.colors.gray}
        />
      </StackHeader.Root>

      <ThemedView flex={1} py="s" backgroundColor="white">
        <CustomCard.Root>
          <CustomCard.Detail>
            Lista de opções para pontuar alunos e professores. Clique sobre o
            campo para editar, caso deseje.
          </CustomCard.Detail>
          <FlatList
            data={data}
            contentContainerStyle={{ gap: theme.spacing.xs }}
            renderItem={({ item }) => (
              <TextButton
                variant="outline"
                justifyContent="space-between"
                onClick={() => {}}
              >
                <ThemedText fontSize={16}>{item.title}</ThemedText>
                <ThemedView gap="xs" flexDirection="row" alignItems="center">
                  <CustomIcon name="star" color="#ffd700" size={20} />
                  <ThemedText>{item.weight}</ThemedText>
                </ThemedView>
              </TextButton>
            )}
            ListFooterComponent={() =>
              isPendingMutate && (
                <ThemedView
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  gap="s"
                >
                  <ThemedText>Adicionando nova pontuação...</ThemedText>
                </ThemedView>
              )
            }
            keyExtractor={(item) => item._id!}
          />
        </CustomCard.Root>
      </ThemedView>

      <BottomSheetModalProvider>
        <CustomBottomModal.Root
          ref={bottomSheetRef}
          onDismiss={() => bottomSheetRef.current?.dismiss()}
        >
          <CustomBottomModal.Content
            title="Nova Pontuação"
            subtitle="Preencha o título, tipo e valor da pontuação."
          >
            <ScoreForm mutateFallback={setIsPendingMutate} />
          </CustomBottomModal.Content>
        </CustomBottomModal.Root>
      </BottomSheetModalProvider>
    </KeyboardAvoidingView>
  );
}
