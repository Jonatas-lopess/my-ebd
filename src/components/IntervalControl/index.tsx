import { ThemeProps } from "@theme";
import { useTheme } from "@shopify/restyle";
import { FlatList, Keyboard, TouchableOpacity, View } from "react-native";
import ThemedView from "@components/ThemedView";
import ThemedText from "@components/ThemedText";
import { useRef, useState } from "react";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import {
  BottomSheetEventType,
  CustomBottomModal,
} from "@components/CustomBottomModal";
import IntervalMonthlyControl from "./IntervalMonthlyControl";
import IntervalQuarterlyControl from "./IntervalQuarterlyControl";
import IntervalLessonsControl from "./IntervalLessonsControl";
import IntervalCustomControl from "./IntervalCustomControl";
import { StackHeader } from "@components/StackHeader";

type IntervalOptionTypes =
  | "Intervalo Personalizado"
  | "Mensal"
  | "Trimestral"
  | "Últimas X aulas";

type IntervalMonthlyTypes =
  | "Janeiro"
  | "Fevereiro"
  | "Março"
  | "Abril"
  | "Maio"
  | "Junho"
  | "Julho"
  | "Agosto"
  | "Setembro"
  | "Outubro"
  | "Novembro"
  | "Dezembro";

type IntervalQuarterlyTypes =
  | "1º Trimestre"
  | "2º Trimestre"
  | "3º Trimestre"
  | "4º Trimestre";

export type IntervalCustomObj = {
  initialDate: Date;
  finalDate: Date;
};

export type IntervalMonthlyObj = {
  month: IntervalMonthlyTypes;
};

export type IntervalQuarterlyObj = {
  quarter: IntervalQuarterlyTypes;
};

export type IntervalLessonsObj = {
  lessonsCount: number;
};

type IntervalObjTypes =
  | IntervalCustomObj
  | IntervalMonthlyObj
  | IntervalQuarterlyObj
  | IntervalLessonsObj;

export type IntervalObj = {
  type: IntervalOptionTypes;
  object: IntervalObjTypes | null;
};

type IntervalControlProps = {
  interval: IntervalObj | null;
  display?: "default" | "compact";
  onSelect?: ((interval: IntervalObj) => void) | undefined;
};

export default function IntervalControl({
  interval,
  display = "default",
  onSelect,
}: IntervalControlProps) {
  const theme = useTheme<ThemeProps>();
  const intervalSheetRef = useRef<BottomSheetModal>(null);
  const optionsSheetRef = useRef<BottomSheetModal>(null);
  const [tempType, setTempType] = useState<IntervalOptionTypes | null>(null);
  const [tempInterval, setTempInterval] = useState<IntervalObjTypes | null>(
    null
  );

  const containerStyle =
    interval?.type === "Intervalo Personalizado"
      ? { paddingBottom: theme.spacing.m }
      : {};
  const localeOpt: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  function handleIntervalSheet(e: BottomSheetEventType) {
    if (e.type === "open") {
      if (interval?.type) setTempType(interval.type);
      if (interval?.object) setTempInterval(interval.object);
      intervalSheetRef.current?.present();
    }

    if (e.type === "set") {
      if (onSelect && tempType && tempInterval) {
        onSelect(e.value as IntervalObj);
      }

      handleIntervalSheet({ type: "close" });
    }

    if (e.type === "close") {
      setTempType(null);
      setTempInterval(null);
      optionsSheetRef.current?.dismiss();
      intervalSheetRef.current?.dismiss();
    }
  }

  function handleOptionsSheet(e: BottomSheetEventType) {
    if (e.type === "open") {
      Keyboard.dismiss();
      optionsSheetRef.current?.present();
    }

    if (e.type === "set") {
      setTempType(e.value as IntervalOptionTypes);
      optionsSheetRef.current?.dismiss();
    }

    if (e.type === "close") optionsSheetRef.current?.dismiss();
  }

  function generateContent() {
    if (!interval?.object) return "Selecione o intervalo";

    switch (interval.type) {
      case "Intervalo Personalizado":
        return `De ${(
          interval.object as IntervalCustomObj
        ).initialDate.toLocaleDateString("pt-BR", localeOpt)} até ${(
          interval.object as IntervalCustomObj
        ).finalDate.toLocaleDateString("pt-BR", localeOpt)}`;
      case "Mensal":
        return `Mês: ${(interval.object as IntervalMonthlyObj).month}`;
      case "Trimestral":
        return `Trimestre: ${
          (interval.object as IntervalQuarterlyObj).quarter
        }`;
      case "Últimas X aulas":
        return `Últimas ${
          (interval.object as IntervalLessonsObj).lessonsCount
        } aulas`;
      default:
        return null;
    }
  }

  function handleCustomSet(date: Date | undefined, type: "initial" | "final") {
    if (!date) return;

    if (type === "initial") {
      setTempInterval((prev) => ({
        ...(prev as IntervalCustomObj),
        initialDate: date,
      }));
    } else {
      setTempInterval((prev) => ({
        ...(prev as IntervalCustomObj),
        finalDate: date,
      }));
    }
  }

  return (
    <>
      {display === "compact" ? (
        <StackHeader.Action
          name={
            (interval?.object as IntervalCustomObj).finalDate ||
            (interval?.object as IntervalCustomObj).finalDate
              ? "calendar-times-o"
              : "calendar-clear-outline"
          }
          onPress={() => handleIntervalSheet({ type: "open" })}
          color={
            (interval?.object as IntervalCustomObj).finalDate ||
            (interval?.object as IntervalCustomObj).finalDate
              ? theme.colors.lightBlue
              : theme.colors.gray
          }
        />
      ) : (
        <View style={containerStyle}>
          <ThemedView
            flexDirection="row"
            borderRadius={10}
            py="s"
            px="m"
            my="m"
          >
            <ThemedText
              onPress={() => handleIntervalSheet({ type: "open" })}
              fontSize={16}
              fontWeight="600"
            >
              {generateContent()}
            </ThemedText>
          </ThemedView>
        </View>
      )}

      <BottomSheetModalProvider>
        <CustomBottomModal.Root
          ref={intervalSheetRef}
          onDismiss={() => setTempInterval(null)}
          stackBehavior="replace"
        >
          <CustomBottomModal.Content
            title="Filtrar por Intervalo"
            subtitle="Selecione o formato do intervalo."
          >
            <ThemedView g="s">
              <TouchableOpacity
                onPress={() => handleOptionsSheet({ type: "open" })}
              >
                <ThemedView
                  padding="s"
                  borderWidth={1}
                  borderColor="lightgrey"
                  borderRadius={25}
                >
                  <ThemedText style={{ color: tempType ? "black" : "#a0a0a0" }}>
                    {tempType ? tempType : "Tipo de Intervalo"}
                  </ThemedText>
                </ThemedView>
              </TouchableOpacity>

              {tempType === "Intervalo Personalizado" && (
                <>
                  <IntervalCustomControl.Initial
                    initialDate={
                      (tempInterval as IntervalCustomObj).initialDate
                    }
                    onSelectDate={(date) => handleCustomSet(date, "initial")}
                  />
                  <IntervalCustomControl.Final
                    finalDate={(tempInterval as IntervalCustomObj).finalDate}
                    onSelectDate={(date) => handleCustomSet(date, "final")}
                  />
                </>
              )}

              {tempType === "Mensal" && (
                <IntervalMonthlyControl
                  interval={tempInterval as IntervalMonthlyObj | null}
                  onSelect={(value) => setTempInterval(value)}
                />
              )}

              {tempType === "Trimestral" && (
                <IntervalQuarterlyControl
                  interval={tempInterval as IntervalQuarterlyObj | null}
                  onSelect={(value) => setTempInterval(value)}
                />
              )}

              {tempType === "Últimas X aulas" && (
                <IntervalLessonsControl
                  interval={tempInterval as IntervalLessonsObj | null}
                  onSelect={(value) => setTempInterval(value)}
                />
              )}

              <CustomBottomModal.Action
                onPress={() =>
                  handleIntervalSheet({
                    type: "set",
                    value: { type: tempType, object: tempInterval },
                  })
                }
              />
            </ThemedView>
          </CustomBottomModal.Content>
        </CustomBottomModal.Root>

        <CustomBottomModal.Root ref={optionsSheetRef} stackBehavior="push">
          <CustomBottomModal.Content title="Tipos de Intervalo">
            <FlatList
              data={[
                "Intervalo Personalizado",
                "Mensal",
                "Trimestral",
                "Últimas X aulas",
              ]}
              style={{ marginBottom: theme.spacing.m }}
              contentContainerStyle={{ gap: theme.spacing.s }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    handleOptionsSheet({ type: "set", value: item })
                  }
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
      </BottomSheetModalProvider>
    </>
  );
}
