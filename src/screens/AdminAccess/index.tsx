import { CustomCard } from "@components/CustomCard";
import { StackHeader } from "@components/StackHeader";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { useAuth } from "@providers/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import config from "config";
import copyToClipboard from "utils/copyToClipboard";

export default function AdminAccess() {
  const navigation = useNavigation();
  const { user, token } = useAuth().authState;

  const { data, status, refetch } = useQuery({
    queryKey: ["admin-token"],
    queryFn: async () => {
      const response = await fetch(
        config.apiBaseUrl +
          "/tokens?id=" +
          user!.plan +
          "." +
          user!._id +
          "&type=administrator",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resJson = await response.json();
      if (!response.ok)
        throw new Error(resJson.message, { cause: resJson.error });

      return resJson.adminToken;
    },
    enabled: user && user.role === "owner",
  });

  return (
    <>
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
          {status === "pending" && (
            <CustomCard.Pressable text="Carregando..." onPress={() => {}} />
          )}
          {status === "success" && data && (
            <CustomCard.Pressable
              text={data}
              onPress={() => copyToClipboard(data)}
            />
          )}
          {status === "error" && (
            <CustomCard.Pressable
              text="Erro ao carregar o tokem... Clique para tentar novamente."
              onPress={refetch}
            />
          )}
        </CustomCard.Root>
      </ThemedView>
    </>
  );
}
