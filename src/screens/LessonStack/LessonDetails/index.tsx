import { useTheme } from "@shopify/restyle";
import FocusAwareStatusBar from "../../../components/FocusAwareStatusBar";
import { StackHeader } from "../../../components/StackHeader";
import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView";
import { HomeStackProps } from "../../../types/navigation";
import { ThemeProps } from "../../../theme";
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

type ClassesType = {
  id: number;
  name: string;
  description?: string;
};

type TeacherCallType = {
  id: number;
  name: string;
  isPresent: boolean;
};

type TeacherInfoType = {
  bibles: number;
  books: number;
  offer: number;
};

export default function LessonDetails({
  route,
}: HomeStackProps<"Lessons_Details">) {
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
            onPress={() => setIsEditable(!isEditable)}
            color={theme.colors.gray}
          />
        </StackHeader.Actions>
      </StackHeader.Root>

      <ThemedView flex={1} backgroundColor="white" padding="s">
        <ScrollView nestedScrollEnabled contentContainerStyle={{ gap: 10 }}>
          <ThemedView
            style={{ backgroundColor: "white" }}
            padding="s"
            borderRadius={20}
          >
            <ThemedText variant="h3" textAlign="center">
              Relatório Geral
            </ThemedText>
            <ThemedText color="gray" textAlign="center">
              O relatório geral é o conjunto de dados do dia de aula. É
              necessário que todas as chamadas sejam feitas para obter um
              resultado completo.
            </ThemedText>
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
          </ThemedView>

          <ThemedView
            style={{ backgroundColor: "white" }}
            padding="s"
            borderRadius={20}
          >
            <ThemedText variant="h3" textAlign="center">
              Relatórios por Classes
            </ThemedText>
            <ThemedText color="gray" textAlign="center">
              Aqui você acompanha o relatório das chamadas feitas em cada
              classe.
            </ThemedText>
            <FlatList
              data={TURMAS}
              scrollEnabled={false}
              contentContainerStyle={{
                gap: theme.spacing.s,
                marginTop: theme.spacing.s,
              }}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {}}>
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
          </ThemedView>

          <ThemedView
            style={{ backgroundColor: "white" }}
            padding="s"
            borderRadius={20}
          >
            <ThemedText variant="h3" textAlign="center">
              Chamada de Professores
            </ThemedText>
            <ThemedText color="gray" textAlign="center">
              Clique sobre os nomes para confirmar a presença.
            </ThemedText>
            <FlatList
              data={TURMAS}
              scrollEnabled={false}
              contentContainerStyle={{
                gap: theme.spacing.s,
                marginTop: theme.spacing.s,
              }}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => isEditable && handleTeachersChange(item.id)}
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
                      borderLeftColor: "green",
                    }}
                    borderRightColor="lightgrey"
                    borderBottomColor="lightgrey"
                    borderTopColor="lightgrey"
                    opacity={
                      teachers.find((teacher) => teacher.id === item.id)!
                        .isPresent
                        ? 1
                        : 0.3
                    }
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
                  </ThemedView>
                </Pressable>
              )}
            />
          </ThemedView>

          <ThemedView
            style={{ backgroundColor: "white" }}
            padding="s"
            borderRadius={20}
            gap="s"
          >
            <ThemedText variant="h3" textAlign="center">
              Relatório de Professores
            </ThemedText>
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
                      setTeacherInfos((teacherInfos) => ({
                        ...teacherInfos,
                        bibles: teacherInfos.bibles + 1,
                      }))
                    }
                  />
                )}

                <ThemedText variant="h3">{teacherInfos.bibles}</ThemedText>

                {isEditable && (
                  <Ionicons
                    name="arrow-down"
                    size={25}
                    style={{ margin: 0 }}
                    onPress={() =>
                      setTeacherInfos((teacherInfos) => ({
                        ...teacherInfos,
                        bibles:
                          teacherInfos.bibles === 0
                            ? teacherInfos.bibles
                            : teacherInfos.bibles - 1,
                      }))
                    }
                    disabled={teacherInfos.bibles === 0}
                    color={teacherInfos.bibles === 0 ? "lightgrey" : "black"}
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
                      setTeacherInfos((teacherInfos) => ({
                        ...teacherInfos,
                        books: teacherInfos.books + 1,
                      }))
                    }
                  />
                )}

                <ThemedText variant="h3">{teacherInfos.books}</ThemedText>

                {isEditable && (
                  <Ionicons
                    name="arrow-down"
                    size={25}
                    style={{ margin: 0 }}
                    onPress={() =>
                      setTeacherInfos((teacherInfos) => ({
                        ...teacherInfos,
                        books:
                          teacherInfos.books === 0
                            ? teacherInfos.books
                            : teacherInfos.books - 1,
                      }))
                    }
                    disabled={teacherInfos.books === 0}
                    color={teacherInfos.books === 0 ? "lightgrey" : "black"}
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
                <Ionicons name="cash-outline" size={25} style={{ margin: 0 }} />
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
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
}
