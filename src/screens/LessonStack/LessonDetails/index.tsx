import { useTheme } from "@shopify/restyle";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { StackHeader } from "@components/StackHeader";
import ThemedText from "@components/ThemedText";
import ThemedView from "@components/ThemedView";
import { HomeStackProps } from "@custom/types/navigation";
import { ThemeProps } from "@theme";
import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FakeCurrencyInput } from "react-native-currency-input";
import { TeacherCallType, TeacherInfoType, ClassesType } from "./type";
import { CustomCard } from "@components/CustomCard";
import TextButton from "@components/TextButton";
import NumberPick from "@components/NumberPick";

export default function LessonDetails({
  route,
}: HomeStackProps<"LessonDetails">) {
  const { lessonId } = route.params;
  const theme = useTheme<ThemeProps>();
  const navigation = useNavigation();
  const [isEditable, setIsEditable] = useState(false);
  const [teacherInfos, setTeacherInfos] = useState<TeacherInfoType>({
    bibles: 0,
    books: 0,
    offer: 0,
  });

  const initialTeachersValue: TeacherCallType[] = [
    {
      id: 1,
      name: "João",
      isPresent: true,
    },
    {
      id: 2,
      name: "Maria",
      isPresent: true,
    },
    {
      id: 3,
      name: "Pedro",
      isPresent: false,
    },
    {
      id: 4,
      name: "Ana",
      isPresent: true,
    },
    {
      id: 5,
      name: "Carlos",
      isPresent: false,
    },
    {
      id: 6,
      name: "Mariana",
      isPresent: true,
    },
    {
      id: 7,
      name: "Lucas",
      isPresent: false,
    },
    {
      id: 8,
      name: "Laura",
      isPresent: true,
    },
  ];

  const [teachers, setTeachers] =
    useState<TeacherCallType[]>(initialTeachersValue);

  const TURMAS: ClassesType[] = [
    {
      id: 1,
      name: "Jovem",
      description: "Classe Jovem",
    },
    {
      id: 2,
      name: "Homem",
      description: "Classe Jovem",
    },
    {
      id: 3,
      name: "Criança",
    },
    {
      id: 4,
      name: "Adolescente",
      description: "Classe Jovem",
    },
    {
      id: 5,
      name: "Mulher",
    },
  ];

  const handleTeachersChange = (id: number) => {
    setTeachers((prevTeachers) => {
      return prevTeachers.map((teacher) => {
        if (teacher.id === id)
          return {
            ...teacher,
            isPresent: !teacher.isPresent,
          };

        return teacher;
      });
    });
  };

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
          <StackHeader.Title>{lessonId}</StackHeader.Title>
        </StackHeader.Content>
        <StackHeader.Actions>
          <StackHeader.Action
            name="lock-open"
            onPress={() => {}}
            color={theme.colors.gray}
          />
          <StackHeader.Action
            name={isEditable ? "close" : "pencil"}
            onPress={() => setIsEditable((prev) => !prev)}
            color={theme.colors.gray}
          />
        </StackHeader.Actions>
      </StackHeader.Root>

      <ThemedView flex={1} backgroundColor="white">
        <ScrollView
          nestedScrollEnabled
          contentContainerStyle={{ gap: 10, padding: theme.spacing.s }}
        >
          <CustomCard.Root borderRadius={20}>
            <CustomCard.Title>Relatório Geral</CustomCard.Title>
            <CustomCard.Detail>
              O relatório geral é o conjunto de dados do dia de aula. É
              necessário que todas as chamadas sejam feitas para obter um
              resultado completo.
            </CustomCard.Detail>
            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.secondary,
                paddingVertical: 10,
                borderRadius: 20,
                marginTop: theme.spacing.s,
              }}
            >
              <ThemedText
                fontSize={16}
                fontWeight="bold"
                textTransform="uppercase"
                color="white"
                textAlign="center"
              >
                Gerar Relatório
              </ThemedText>
            </TouchableOpacity>
          </CustomCard.Root>

          <CustomCard.Root borderRadius={20}>
            <CustomCard.Title>Relatórios por Classe</CustomCard.Title>
            <CustomCard.Detail>
              Aqui você acompanha o relatório das chamadas feitas em cada
              classe.
            </CustomCard.Detail>
            <FlatList
              data={TURMAS}
              scrollEnabled={false}
              contentContainerStyle={{
                gap: theme.spacing.s,
                marginTop: theme.spacing.s,
              }}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Inicio", {
                      screen: "ClassReport",
                      params: { classId: item.id.toString() },
                    })
                  }
                >
                  <ThemedView
                    padding="xs"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    borderRadius={25}
                    borderWidth={1}
                    borderLeftWidth={6}
                    style={{
                      borderLeftColor: item.description ? "green" : "orange",
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
                        item.description ? "checkmark-circle" : "alert-circle"
                      }
                      size={35}
                      style={{ margin: 0 }}
                      color={item.description ? "green" : "orange"}
                    />
                  </ThemedView>
                </TouchableOpacity>
              )}
            />
          </CustomCard.Root>

          <CustomCard.Root borderRadius={20}>
            <CustomCard.Title>Chamada de Professores</CustomCard.Title>
            <CustomCard.Detail>
              Clique sobre os nomes para confirmar a presença.
            </CustomCard.Detail>
            <FlatList
              data={TURMAS}
              scrollEnabled={false}
              contentContainerStyle={{
                gap: theme.spacing.s,
                marginTop: theme.spacing.s,
              }}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TextButton
                  justifyContent="space-between"
                  variant="outline"
                  onClick={() => isEditable && handleTeachersChange(item.id)}
                  disabled
                >
                  <ThemedText fontSize={16} fontWeight="bold" ml="s">
                    {item.name}
                  </ThemedText>
                  <Ionicons
                    name="checkmark-circle"
                    size={35}
                    style={{ margin: 0 }}
                    color="green"
                  />
                </TextButton>
              )}
            />
          </CustomCard.Root>

          <CustomCard.Root borderRadius={20}>
            <CustomCard.Title>Relatório de Professores</CustomCard.Title>
            <ThemedView gap="xs" mt="s">
              <TextButton
                justifyContent="space-between"
                variant="outline"
                disabled
              >
                <ThemedView flexDirection="row" alignItems="center">
                  <Ionicons name="bookmark" size={25} style={{ margin: 0 }} />
                  <ThemedText fontSize={16} fontWeight="bold" ml="s">
                    Bíblias
                  </ThemedText>
                </ThemedView>
                <NumberPick
                  value={teacherInfos.bibles}
                  onChange={(value) =>
                    setTeacherInfos((teacherInfos) => ({
                      ...teacherInfos,
                      bibles: value!,
                    }))
                  }
                  minValue={0}
                  isLocked={!isEditable}
                />
              </TextButton>

              <TextButton
                justifyContent="space-between"
                variant="outline"
                disabled
              >
                <ThemedView flexDirection="row" alignItems="center">
                  <Ionicons name="book" size={25} style={{ margin: 0 }} />
                  <ThemedText fontSize={16} fontWeight="bold" ml="s">
                    Revistas
                  </ThemedText>
                </ThemedView>
                <NumberPick
                  value={teacherInfos.books}
                  onChange={(value) =>
                    setTeacherInfos((teacherInfos) => ({
                      ...teacherInfos,
                      books: value!,
                    }))
                  }
                  minValue={0}
                  isLocked={!isEditable}
                />
              </TextButton>
              <TextButton
                justifyContent="space-between"
                variant="outline"
                disabled
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
                  value={teacherInfos.offer}
                  placeholder="R$0,00"
                  prefix="R$"
                  delimiter="."
                  separator=","
                  precision={2}
                  minValue={0}
                  onChangeValue={(value) =>
                    setTeacherInfos((teacherInfos) => ({
                      ...teacherInfos,
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
              </TextButton>
            </ThemedView>
          </CustomCard.Root>
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
}
