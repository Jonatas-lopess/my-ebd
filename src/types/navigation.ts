import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DrawerScreenProps } from "@react-navigation/drawer";

export type AdminRootTabParamList = {
  Lessons: NavigatorScreenParams<HomeStackParamList>;
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
  LessonList: undefined;
  LessonDetails: { lessonId: string };
  ClassReport: { classId: string; lessonId: string };
};

export type HomeStackProps<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>;

export type StudentStackParamList = {
  RegisterList: undefined;
  RegisterHistory: { studentId: string };
};

export type StudentStackProps<T extends keyof StudentStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<StudentStackParamList, T>,
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

export type StatisticsDrawerParamList = {
  Statistics: undefined;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

export type StatisticsDrawerProps<T extends keyof StatisticsDrawerParamList> =
  DrawerScreenProps<StatisticsDrawerParamList, T>;

export type SettingsStackParamList = {
  SettingsList: undefined;
  AccountInfo: undefined;
  TeacherAccess: undefined;
  AdminAccess: undefined;
  ManageBranch: undefined;
  ManageHeadquarter: undefined;
  ScoreOptions: undefined;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList
      extends AdminRootTabParamList,
        TeacherRootTabParamList,
        LoginStackParamList {}
  }
}
