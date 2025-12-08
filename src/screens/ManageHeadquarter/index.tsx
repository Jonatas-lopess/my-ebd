import { CustomCard } from "@components/CustomCard";
import { StackHeader } from "@components/StackHeader";
import ThemedView from "@components/ThemedView";
import { useAuth } from "@providers/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import config from "config";
import copyToClipboard from "utils/copyToClipboard";

export default function ManageHeadquarter() {
  const navigation = useNavigation();
  const { user, token } = useAuth().authState;

  const { data, status, refetch } = useQuery({
    queryKey: ["headquarter-info"],
    queryFn: async () => {
      const response = await fetch(config.apiBaseUrl + "/tokens?type=plan", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const resJson = await response.json();
      if (!response.ok)
        throw new Error(resJson.message, { cause: resJson.error });

      return resJson.planToken;
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
          <StackHeader.Title>Gerenciar Sede</StackHeader.Title>
        </StackHeader.Content>
      </StackHeader.Root>

      <ThemedView flex={1} backgroundColor="white" py="s" gap="s">
        <CustomCard.Root>
          <CustomCard.Title>Vincule à sua sede</CustomCard.Title>
          <CustomCard.Detail>
            Informe o código abaixo à sua superintendência regional caso queira
            vincular sua filial ao perfil dela. Você receberá uma mensagem de
            confirmação. Clique no campo para copiar o código.
          </CustomCard.Detail>
          {status === "pending" && (
            <CustomCard.Pressable text="Carregando..." onPress={() => {}} />
          )}
          {status === "success" && (
            <CustomCard.Pressable
              text={data}
              onPress={() => copyToClipboard(data)}
            />
          )}
          {status === "error" && (
            <CustomCard.Pressable
              text="Erro ao carregar o código... Clique para tentar novamente."
              onPress={refetch}
            />
          )}
        </CustomCard.Root>
      </ThemedView>
    </>
  );
}
