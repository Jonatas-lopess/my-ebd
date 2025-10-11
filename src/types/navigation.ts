import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DrawerScreenProps } from "@react-navigation/drawer";

export type AdminRootTabParamList = {
  Lessons: NavigatorScreenParams<LessonStackParamList>;
  Turmas: NavigatorScreenParams<ClassStackParamList>;
  Cadastros: NavigatorScreenParams<RegisterStackParamList>;
  Geral: NavigatorScreenParams<GeneralStackParamList>;
};

export type AdminRootTabProps<T extends keyof AdminRootTabParamList> =
  BottomTabScreenProps<AdminRootTabParamList, T>;

export type TeacherRootTabParamList = {
  Lessons: NavigatorScreenParams<LessonStackParamList>;
  Cadastros: NavigatorScreenParams<RegisterStackParamList>;
  Geral: NavigatorScreenParams<GeneralStackParamList>;
};

export type TeacherRootTabProps<T extends keyof TeacherRootTabParamList> =
  BottomTabScreenProps<TeacherRootTabParamList, T>;

export type LessonStackParamList = {
  LessonList: undefined;
  LessonDetails: { lessonId: string };
  ClassReport: { classId: string; lessonId: string };
};

export type GeneralStackParamList = {
  Home: undefined;
  GeneralScreen: undefined;
};

export type GeneralStackProps<T extends keyof GeneralStackParamList> =
  NativeStackScreenProps<GeneralStackParamList, T>;

export type LessonStackProps<T extends keyof LessonStackParamList> =
  NativeStackScreenProps<LessonStackParamList, T>;

export type RegisterStackParamList = {
  RegisterList: undefined;
  RegisterHistory: { studentId: string };
};

export type RegisterStackProps<T extends keyof RegisterStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<RegisterStackParamList, T>,
    AdminRootTabProps<keyof AdminRootTabParamList>
  >;

export type LoginStackParamList = {
  Login: undefined;
  Signin: undefined;
};

export type ClassStackParamList = {
  ClassList: undefined;
  ClassDetails: { classId: string };
  StudentDetails: { studentId: string };
};

export type ClassStackProps<T extends keyof ClassStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ClassStackParamList, T>,
    AdminRootTabProps<keyof AdminRootTabParamList>
  >;

export type AppDrawerParamList = {
  Home: { renderTab: "admin" | "teacher" };
  AccountInfo: undefined;
  TeacherAccess: undefined;
  AdminAccess: undefined;
  ManageBranch: undefined;
  ManageHeadquarter: undefined;
  ScoreOptions: undefined;
};

export type AppDrawerProps<T extends keyof AppDrawerParamList> =
  DrawerScreenProps<AppDrawerParamList, T>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList
      extends AdminRootTabParamList,
        TeacherRootTabParamList,
        LoginStackParamList,
        AppDrawerParamList {}
  }
}
