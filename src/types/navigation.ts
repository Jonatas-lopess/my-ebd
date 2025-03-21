import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type AdminRootTabParamList = {
  Inicio: NavigatorScreenParams<HomeStackParamList>;
  Turmas: undefined;
  Cadastros: NavigatorScreenParams<StudentStackParamList>;
  Geral: undefined;
};

export type AdminRootTabProps<T extends keyof AdminRootTabParamList> =
  BottomTabScreenProps<AdminRootTabParamList, T>;

export type TeacherRootTabParamList = {
  Inicio: NavigatorScreenParams<HomeStackParamList>;
  Alunos: NavigatorScreenParams<StudentStackParamList>;
  Geral: undefined;
};

export type TeacherRootTabProps<T extends keyof TeacherRootTabParamList> =
  BottomTabScreenProps<TeacherRootTabParamList, T>;

export type HomeStackParamList = {
  Lessons_List: undefined;
  Lessons_Details: { lessonId: string };
};

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
};

export type ClassStackProps<T extends keyof ClassStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ClassStackParamList, T>,
    AdminRootTabProps<keyof AdminRootTabParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList
      extends AdminRootTabParamList,
        TeacherRootTabParamList {}
  }
}
