import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootTabParamList = {
  Inicio: undefined;
  Alunos: NavigatorScreenParams<StudentStackParamList>;
};

export type RootStackScreenProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;

export type StudentStackParamList = {
  Alunos_Lista: undefined;
  Alunos_Historico: { studentId: string };
};

export type StudentStackScreenProps<T extends keyof StudentStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<StudentStackParamList, T>,
    RootStackScreenProps<keyof RootTabParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
