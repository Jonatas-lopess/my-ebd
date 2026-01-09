import { CustomCard } from "@components/CustomCard";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { StackHeader } from "@components/StackHeader";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { useAuth } from "@providers/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import {
  RegisterFromApi,
} from "@screens/RegisterStack/RegisterScreen/type";
import { useTheme } from "@shopify/restyle";
import { useQuery } from "@tanstack/react-query";
import { ThemeProps } from "@theme";
import getRegisters from "api/getRegisters";
import { Base64 } from "js-base64";
import { useCallback } from "react";
import { FlatList, RefreshControl } from "react-native";
import copyToClipboard from "utils/copyToClipboard";

type AccessArray = {
  name: string;
  token: string | null;
}[];

export default function TeacherAccess() {
  const navigation = useNavigation();
  const theme = useTheme<ThemeProps>();
  const { token } = useAuth().authState;

  const handleApiData = useCallback((data: RegisterFromApi[]): AccessArray => {
    return data.map((item) => {
      const token = item.user ? Base64.encode(`teacher:${item.user}`) : null;

      return {
        name: item.name,
        token,
      };
    });
  }, []);

  const { data, status, isRefetching, refetch } = useQuery({
    queryKey: ["register", true],
    queryFn: () => getRegisters({ hasUser: true, token }),
    select: handleApiData,
  });

  return (
    <>
      <FocusAwareStatusBar style="light" translucent />

      <StackHeader.Root>
        <StackHeader.Content>
          <StackHeader.Action
            name="arrow-back"
            onPress={() => navigation.goBack()}
          />
          <ThemedText color="secondary" fontSize={24} fontWeight="bold">
            Acesso dos Professores
          </ThemedText>
        </StackHeader.Content>
      </StackHeader.Root>

      <ThemedView flex={1} backgroundColor="white" gap="s" py="s">
        <CustomCard.Root>
          <CustomCard.Detail>
            Aqui você pode criar os acessos para os professores. Com este tokem
            os professores poderão entrar no aplicativo em seus próprios
            aparelhos.
          </CustomCard.Detail>
        </CustomCard.Root>

        {status === "error" && (
          <ThemedText textAlign="center">
            Erro ao carregar os registros.
          </ThemedText>
        )}
        {status === "pending" && (
          <ThemedText textAlign="center">Carregando registros...</ThemedText>
        )}
        {status === "success" && data && data.length > 0 && (
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <CustomCard.Root>
                <CustomCard.Title>{item.name}</CustomCard.Title>
                <CustomCard.Detail>
                  Pressione sobre o campo para copiar o tokem.
                </CustomCard.Detail>
                <CustomCard.Pressable
                  text={item.token ?? "Nenhum token disponível"}
                  onPress={() => item.token && copyToClipboard(item.token)}
                />
              </CustomCard.Root>
            )}
            style={{
              backgroundColor: theme.colors.white,
              height: "100%",
            }}
            contentContainerStyle={{
              gap: theme.spacing.s,
              marginTop: theme.spacing.s,
              paddingHorizontal: theme.spacing.s,
            }}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
          />
        )}
      </ThemedView>
    </>
  );
}
