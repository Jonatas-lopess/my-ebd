import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DrawerScreenProps } from "@react-navigation/drawer";

export type AdminRootTabParamList = {
  Inicio: NavigatorScreenParams<HomeStackParamList>;
  Turmas: NavigatorScreenParams<ClassStackParamList>;
  Cadastros: NavigatorScreenParams<StudentStackParamList>;
  Geral: NavigatorScreenParams<StatisticsDrawerParamList>;
};

export type AdminRootTabProps<T extends keyof AdminRootTabParamList> =
  BottomTabScreenProps<AdminRootTabParamList, T>;

export type TeacherRootTabParamList = {
  Inicio: NavigatorScreenParams<HomeStackParamList>;
  Alunos: NavigatorScreenParams<StudentStackParamList>;
  Geral: NavigatorScreenParams<StatisticsDrawerParamList>;
};

export type TeacherRootTabProps<T extends keyof TeacherRootTabParamList> =
  BottomTabScreenProps<TeacherRootTabParamList, T>;

export type HomeStackParamList = {
  Lessons_List: undefined;
  Lessons_Details: { lessonId: string };
};

export type HomeStackProps<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>;

export type StudentStackParamList = {
  Alunos_Lista: undefined;
  Alunos_Historico: { studentId: string };
};

export type StudentStackProps<T extends keyof StudentStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<StudentStackParamList, T>,
    AdminRootTabProps<keyof AdminRootTabParamList>
  >;

export type LoginStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type ClassStackParamList = {
  Class_List: undefined;
  Class_Details: { classId: string };
  Class_Details_Student: { studentId: string };
};

export type ClassStackProps<T extends keyof ClassStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ClassStackParamList, T>,
    AdminRootTabProps<keyof AdminRootTabParamList>
  >;

export type StatisticsDrawerParamList = {
  Statistics: undefined;
  Settings: undefined;
};

export type StatisticsDrawerProps<T extends keyof StatisticsDrawerParamList> =
  DrawerScreenProps<StatisticsDrawerParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList
      extends AdminRootTabParamList,
        TeacherRootTabParamList {}
  }
}
