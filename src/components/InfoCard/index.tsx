import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";
import { Pressable, TouchableOpacity } from "react-native";

type Info = {
  title: string;
  detail: string;
};

type BaseInfoCardProps = {
  title: string;
  detail?: string;
  onPress?: () => void;
  onLongPress?: () => void;
};

type PropsWithInfo = BaseInfoCardProps & {
  info: Info;
};

type PropsWithExtraInfo = BaseInfoCardProps & {
  extraInfo: Info;
};

type InfoCardProps = PropsWithInfo | PropsWithExtraInfo;

export default function InfoCard({
  detail,
  title,
  onPress,
  onLongPress,
  ...rest
}: InfoCardProps) {
  const { info } = rest as PropsWithInfo;
  const { extraInfo } = rest as PropsWithExtraInfo;

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <ThemedView
        style={{ backgroundColor: "white" }}
        borderRadius={10}
        py="s"
        px="m"
      >
        <ThemedView alignItems="center" flexDirection="row" mb="s">
          <ThemedText variant="h3" mr="xs">
            {title}
          </ThemedText>
          {detail && (
            <ThemedText variant="body" color="gray">
              • {detail}
            </ThemedText>
          )}
        </ThemedView>
        <ThemedView
          borderTopWidth={1}
          borderColor="lightgrey"
          flexDirection="row"
          justifyContent="space-around"
          pt="s"
        >
          {info && (
            <ThemedText>
              {info.title}: {info.detail}
            </ThemedText>
          )}
          {extraInfo && (
            <>
              <ThemedView borderLeftWidth={1} borderLeftColor="lightgrey" />
              <ThemedText>
                {extraInfo.title}: {extraInfo.detail}
              </ThemedText>
            </>
          )}
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
}
