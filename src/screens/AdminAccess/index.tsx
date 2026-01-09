import { CustomCard } from "@components/CustomCard";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { StackHeader } from "@components/StackHeader";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { useAuth, User } from "@providers/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@shopify/restyle";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ThemeProps } from "@theme";
import config from "config";
import { Base64 } from "js-base64";
import { Alert, FlatList, RefreshControl } from "react-native";
import copyToClipboard from "utils/copyToClipboard";

export default function AdminAccess() {
  const navigation = useNavigation();
  const theme = useTheme<ThemeProps>();
  const queryClient = useQueryClient();
  const { user } = useAuth().authState;
  const token = user && Base64.encode("admin:" + user.plan);

  const { data, status, isRefetching, refetch } = useQuery({
    queryKey: ["admins"],
    queryFn: async (): Promise<User[]> => {
      const res = await fetch(config.apiBaseUrl + `/admins`, {
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

  const { mutate: deleteAdmin } = useMutation({
    mutationFn: async (adminId: string) => {
      const res = await fetch(config.apiBaseUrl + `/admins/${adminId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.message, { cause: resJson.error });

      return resJson;
    },
    onMutate: async (adminId) => {
      await queryClient.cancelQueries({ queryKey: ["admins"] });

      const previousData = queryClient.getQueryData<User[]>(["admins"]);

      queryClient.setQueryData<User[]>(["admins"], (oldData) => {
        if (!oldData) return [];
        return oldData.filter((admin) => admin._id !== adminId);
      });

      return { previousData };
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["admins"] }),
    onError: (error, _, context) => {
      console.error("Error deleting admin:", error.cause);

      queryClient.setQueryData<User[]>(["admins"], context?.previousData);
      Alert.alert(
        "Erro",
        "Não foi possível excluir o administrador. Tente novamente mais tarde."
      );
    },
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
            Acesso Administrativo
          </ThemedText>
        </StackHeader.Content>
      </StackHeader.Root>

      <ThemedView flex={1} backgroundColor="white" gap="s" py="s">
        <CustomCard.Root>
          <CustomCard.Detail>
            Aqui você pode criar acessos para outros administradores. Com este
            tokem eles poderão entrar no aplicativo em seus próprios aparelhos.
          </CustomCard.Detail>
        </CustomCard.Root>

        <CustomCard.Root>
          <CustomCard.Title>Administrativo</CustomCard.Title>
          <CustomCard.Detail>
            Pressione sobre o campo para copiar o tokem.
          </CustomCard.Detail>
          <CustomCard.Pressable
            text={token ?? ""}
            onPress={() => token && copyToClipboard(token)}
          />
        </CustomCard.Root>

        {status === "error" && (
          <ThemedText textAlign="center">
            Erro ao carregar lista de administradores.
          </ThemedText>
        )}
        {status === "pending" && (
          <ThemedText textAlign="center">
            Carregando lista de administradores...
          </ThemedText>
        )}
        {status === "success" && data && data.length > 0 && (
          <CustomCard.Root>
            <FlatList
              data={data}
              keyExtractor={(item) => item._id}
              ListHeaderComponent={
                <>
                  <CustomCard.Title>Lista de Administradores</CustomCard.Title>
                  <CustomCard.Detail>
                    Aqui estão os administradores com acesso ao aplicativo.
                    Clique sobre o nome para excluir o acesso.
                  </CustomCard.Detail>
                </>
              }
              renderItem={({ item }) => (
                <CustomCard.Pressable
                  key={item._id}
                  text={item.name ?? item.email}
                  onPress={() =>
                    Alert.alert(
                      "Excluir Administrador",
                      `Tem certeza que deseja excluir o administrador ${
                        item.name ?? item.email
                      }?`,
                      [
                        {
                          text: "Cancelar",
                          style: "cancel",
                        },
                        {
                          text: "Excluir",
                          style: "destructive",
                          onPress: () => deleteAdmin(item._id),
                        },
                      ]
                    )
                  }
                />
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
          </CustomCard.Root>
        )}
      </ThemedView>
    </>
  );
}
