import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  LoginStack: NavigatorScreenParams<LoginStackParamList>;
  Tab: NavigatorScreenParams<RootTabParamList>;
};

export type RootStackProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type RootTabParamList = {
  Inicio: undefined;
  Alunos: NavigatorScreenParams<StudentStackParamList>;
};

export type RootTabProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;

export type StudentStackParamList = {
  Alunos_Lista: undefined;
  Alunos_Historico: { studentId: string };
};

export type StudentStackProps<T extends keyof StudentStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<StudentStackParamList, T>,
    RootTabProps<keyof RootTabParamList>
  >;

export type LoginStackParamList = {
  Login: undefined;
  Register: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
