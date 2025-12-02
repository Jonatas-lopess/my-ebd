import ThemedText from "@components/ThemedText";
import { IntervalMonthlyObj } from "..";
import {
  BottomSheetEventType,
  CustomBottomModal,
} from "@components/CustomBottomModal";
import { FlatList, TouchableOpacity } from "react-native";
import ThemedView from "@components/ThemedView";
import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "@theme";
import { useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

type Props = {
  interval: IntervalMonthlyObj | null;
  onSelect: ((interval: IntervalMonthlyObj) => void) | undefined;
};

export default function IntervalMonthlyControl({ interval, onSelect }: Props) {
  const theme = useTheme<ThemeProps>();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  function handleBottomSheet(e: BottomSheetEventType) {
    if (e.type === "open") {
      bottomSheetRef.current?.present();
    }

    if (e.type === "set") {
      bottomSheetRef.current?.dismiss();
      if (onSelect) onSelect({ month: e.value });
    }
  }

  return (
    <>
      <ThemedText
        fontSize={16}
        fontWeight="600"
        onPress={() => handleBottomSheet({ type: "open" })}
      >
        {interval ? interval.month : "Selecione o mês"}
      </ThemedText>

      <CustomBottomModal.Root ref={bottomSheetRef} stackBehavior="push">
        <CustomBottomModal.Content title="Mês">
          <FlatList
            data={[
              "Janeiro",
              "Fevereiro",
              "Março",
              "Abril",
              "Maio",
              "Junho",
              "Julho",
              "Agosto",
              "Setembro",
              "Outubro",
              "Novembro",
              "Dezembro",
            ]}
            style={{ marginBottom: theme.spacing.m }}
            contentContainerStyle={{ gap: theme.spacing.s }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleBottomSheet({ type: "set", value: item })}
              >
                <ThemedView
                  py="s"
                  px="m"
                  borderWidth={1}
                  borderColor="lightgrey"
                  borderRadius={25}
                >
                  <ThemedText>{item}</ThemedText>
                </ThemedView>
              </TouchableOpacity>
            )}
          />
        </CustomBottomModal.Content>
      </CustomBottomModal.Root>
    </>
  );
}
