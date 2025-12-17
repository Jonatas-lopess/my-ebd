import BranchForm from "@components/BranchForm";
import { CustomBottomModal } from "@components/CustomBottomModal";
import { CustomCard } from "@components/CustomCard";
import CustomTextCard from "@components/CustomTextCard";
import { StackHeader } from "@components/StackHeader";
import ThemedView from "@components/ThemedView";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";

export default function ManageBranch() {
  const navigation = useNavigation();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  return (
    <BottomSheetModalProvider>
      <StackHeader.Root>
        <StackHeader.Content>
          <StackHeader.Action
            name="arrow-back"
            onPress={() => navigation.goBack()}
          />
          <StackHeader.Title>Gerenciar Filial</StackHeader.Title>
        </StackHeader.Content>
      </StackHeader.Root>

      <ThemedView flex={1} backgroundColor="white" py="s" gap="s">
        <CustomCard.Root>
          <CustomCard.Title>Adicione Novas Igrejas</CustomCard.Title>
          <CustomCard.Detail>
            Clique no botão abaixo para adicionar uma nova igreja como filial
            dentro do seu plano. Ao adicionar uma filial, você terá acesso aos
            relatórios dela.
          </CustomCard.Detail>
          <CustomTextCard text="Adicionar Filial" onPress={() => {}} />
        </CustomCard.Root>
      </ThemedView>

      <CustomBottomModal.Root ref={bottomSheetRef}>
        <CustomBottomModal.Content
          title="Adicionar Filial"
          subtitle="Cole no campo abaixo o código da filial."
        >
          <BranchForm />
        </CustomBottomModal.Content>
      </CustomBottomModal.Root>
    </BottomSheetModalProvider>
  );
}
