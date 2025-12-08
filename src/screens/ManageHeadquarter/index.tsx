import { CustomCard } from "@components/CustomCard";
import { StackHeader } from "@components/StackHeader";
import ThemedView from "@components/ThemedView";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import copyToClipboard from "utils/copyToClipboard";

export default function ManageHeadquarter() {
  const navigation = useNavigation();

  const { data, status, refetch } = useQuery({
    queryKey: ["headquarter-info"],
    queryFn: async () => {
      // Fetch headquarter info logic here
      return "código";
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
      </ThemedView>
    </>
  );
}
