import { CustomCard } from "@components/CustomCard";
import { StackHeader } from "@components/StackHeader";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { useNavigation } from "@react-navigation/native";

export default function TeacherAccess() {
  const navigation = useNavigation();

  return (
    <>
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

        <CustomCard.Root>
          <CustomCard.Title>Josué</CustomCard.Title>
          <CustomCard.Detail>
            Pressione sobre o campo para copiar o tokem.
          </CustomCard.Detail>
          <CustomCard.Pressable text="tokem" onPress={() => {}} />
        </CustomCard.Root>
      </ThemedView>
    </>
  );
}
