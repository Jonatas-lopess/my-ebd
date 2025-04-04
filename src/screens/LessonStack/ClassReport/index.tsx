import { CustomCard } from "@components/CustomCard";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { StackHeader } from "@components/StackHeader";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { HomeStackProps } from "@custom/types/navigation";
import { ScrollView, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { ThemeProps } from "@theme";
import { useState } from "react";
import { FakeCurrencyInput } from "react-native-currency-input";
import { useNavigation } from "@react-navigation/native";

export default function ClassReport({ route }: HomeStackProps<"ClassReport">) {
  const { classId } = route.params;
  const navigation = useNavigation();
  const theme = useTheme<ThemeProps>();
  const [isEditable, setIsEditable] = useState(false);
  const [report, setReport] = useState({
    bibles: 0,
    books: 0,
    offer: 0,
  });

  const ALUNOS = [
    {
      id: 1,
      name: "Josué",
      isPresent: true,
    },
    {
      id: 2,
      name: "Maria",
      isPresent: true,
    },
  ];

  return (
    <ThemedView flex={1} style={{ backgroundColor: "white" }}>
      <FocusAwareStatusBar style="dark" translucent />

      <StackHeader.Root>
        <StackHeader.Content>
          <StackHeader.Action
            name="arrow-back"
            onPress={() => navigation.goBack()}
            color={theme.colors.gray}
          />
          <StackHeader.Title>Josué</StackHeader.Title>
        </StackHeader.Content>
        <StackHeader.Action
          name={isEditable ? "close" : "pencil"}
          onPress={() => setIsEditable((prev) => !prev)}
          color={theme.colors.gray}
        />
      </StackHeader.Root>

      <ThemedView flex={1} padding="s" backgroundColor="white">
        <ScrollView nestedScrollEnabled contentContainerStyle={{ gap: 10 }}>
          <CustomCard.Root borderRadius={20}>
            <CustomCard.Title>Chamada dos Alunos</CustomCard.Title>
            <CustomCard.Detail>
              Clique sobre os nomes dos alunos para confirmar a presença.
            </CustomCard.Detail>
            <FlatList
              data={ALUNOS}
              scrollEnabled={false}
              contentContainerStyle={{
                gap: theme.spacing.s,
                marginTop: theme.spacing.s,
              }}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {}} disabled={!isEditable}>
                  <ThemedView
                    padding="xs"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    borderRadius={25}
                    borderWidth={1}
                    borderLeftWidth={6}
                    style={{
                      borderLeftColor: item.isPresent ? "green" : "orange",
                    }}
                    borderRightColor="lightgrey"
                    borderBottomColor="lightgrey"
                    borderTopColor="lightgrey"
                  >
                    <ThemedText fontSize={16} fontWeight="bold" ml="s">
                      {item.name}
                    </ThemedText>
                    <Ionicons
                      name={
                        item.isPresent ? "checkmark-circle" : "alert-circle"
                      }
                      size={35}
                      style={{ margin: 0 }}
                      color={item.isPresent ? "green" : "orange"}
                    />
                  </ThemedView>
                </TouchableOpacity>
              )}
            />
          </CustomCard.Root>

          <CustomCard.Root borderRadius={20}>
            <CustomCard.Title>Relatório de Professores</CustomCard.Title>
            <ThemedView gap="xs" mt="s">
              <ThemedView
                py="xs"
                px="s"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                borderRadius={25}
                borderWidth={1}
                borderColor="lightgrey"
              >
                <ThemedView flexDirection="row" alignItems="center">
                  <Ionicons name="bookmark" size={25} style={{ margin: 0 }} />
                  <ThemedText fontSize={16} fontWeight="bold" ml="s">
                    Bíblias
                  </ThemedText>
                </ThemedView>
                <ThemedView flexDirection="row" gap="m">
                  {isEditable && (
                    <Ionicons
                      name="arrow-up"
                      size={25}
                      style={{ margin: 0 }}
                      onPress={() =>
                        setReport((prev) => ({
                          ...prev,
                          bibles: prev.bibles + 1,
                        }))
                      }
                    />
                  )}

                  <ThemedText variant="h3">{report.bibles}</ThemedText>

                  {isEditable && (
                    <Ionicons
                      name="arrow-down"
                      size={25}
                      style={{ margin: 0 }}
                      onPress={() =>
                        setReport((prev) => ({
                          ...prev,
                          bibles:
                            prev.bibles === 0 ? prev.bibles : prev.bibles - 1,
                        }))
                      }
                      disabled={report.bibles === 0}
                      color={report.bibles === 0 ? "lightgrey" : "black"}
                    />
                  )}
                </ThemedView>
              </ThemedView>

              <ThemedView
                py="xs"
                px="s"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                borderRadius={25}
                borderWidth={1}
                borderColor="lightgrey"
              >
                <ThemedView flexDirection="row" alignItems="center">
                  <Ionicons name="book" size={25} style={{ margin: 0 }} />
                  <ThemedText fontSize={16} fontWeight="bold" ml="s">
                    Revistas
                  </ThemedText>
                </ThemedView>
                <ThemedView flexDirection="row" gap="m">
                  {isEditable && (
                    <Ionicons
                      name="arrow-up"
                      size={25}
                      style={{ margin: 0 }}
                      onPress={() =>
                        setReport((prev) => ({
                          ...prev,
                          books: prev.books + 1,
                        }))
                      }
                    />
                  )}

                  <ThemedText variant="h3">{report.books}</ThemedText>

                  {isEditable && (
                    <Ionicons
                      name="arrow-down"
                      size={25}
                      style={{ margin: 0 }}
                      onPress={() =>
                        setReport((prev) => ({
                          ...prev,
                          books: prev.books === 0 ? prev.books : prev.books - 1,
                        }))
                      }
                      disabled={report.books === 0}
                      color={report.books === 0 ? "lightgrey" : "black"}
                    />
                  )}
                </ThemedView>
              </ThemedView>
              <ThemedView
                py="xs"
                px="s"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                borderRadius={25}
                borderWidth={1}
                borderColor="lightgrey"
              >
                <ThemedView flexDirection="row" alignItems="center">
                  <Ionicons
                    name="cash-outline"
                    size={25}
                    style={{ margin: 0 }}
                  />
                  <ThemedText fontSize={16} fontWeight="bold" ml="s">
                    Oferta
                  </ThemedText>
                </ThemedView>
                <FakeCurrencyInput
                  editable={isEditable}
                  value={report.offer}
                  placeholder="R$0,00"
                  prefix="R$"
                  delimiter="."
                  separator=","
                  precision={2}
                  minValue={0}
                  onChangeValue={(value) =>
                    setReport((prev) => ({
                      ...prev,
                      offer: value ? value : 0,
                    }))
                  }
                  style={{
                    textAlignVertical: "center",
                    padding: 0,
                    margin: 0,
                    fontWeight: "bold",
                    fontSize: 20,
                  }}
                />
              </ThemedView>
            </ThemedView>
          </CustomCard.Root>
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
}
