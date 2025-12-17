import { CustomCard } from "@components/CustomCard";
import { InfoCard } from "@components/InfoCard";
import { StackHeader } from "@components/StackHeader";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { useAuth } from "@providers/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import config from "config";
import { FlatList } from "react-native";
import copyToClipboard from "utils/copyToClipboard";

type Request = {
  _id: string;
  idBranch: string;
  idHeadquarter: string;
  createdAt: string;
};

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

  const { data: requests, isPending } = useQuery({
    queryKey: ["headquarter-requests"],
    queryFn: async (): Promise<Request[]> => {
      const response = await fetch(config.apiBaseUrl + "/afiliations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const resJson = await response.json();
      if (!response.ok)
        throw new Error(resJson.message, { cause: resJson.error });

      return resJson;
    },
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

        <ThemedText variant="h3">
          Abaixo estão os pedidos de afiliação. Confirme com sua sede antes de
          aceitar um pedido.
        </ThemedText>

        {isPending && (
          <ThemedText textAlign="center">Carregando pedidos...</ThemedText>
        )}
        {requests && (
          <FlatList
            data={requests}
            renderItem={({ item }) => (
              <InfoCard.Root>
                <InfoCard.Content>
                  <ThemedText>Pedido de: {item.idHeadquarter}</ThemedText>
                </InfoCard.Content>
              </InfoCard.Root>
            )}
          />
        )}
      </ThemedView>
    </>
  );
}
