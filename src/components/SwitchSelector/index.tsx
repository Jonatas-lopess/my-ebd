import React, { useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
  ViewStyle,
} from "react-native";
import { theme } from "@theme";

type SwitchSelectorProps = {
  options: string[];
  initialIndex?: number;
  onChange?: (index: number, value: string) => void;
  containerStyle?: ViewStyle;
};

export default function SwitchSelector({
  options,
  initialIndex = 0,
  onChange,
  containerStyle,
}: SwitchSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex);
  const translateX = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState<number>(0);

  function onContainerLayout(e: LayoutChangeEvent) {
    const w = e.nativeEvent.layout.width;
    setContainerWidth(w);
    // set initial position
    const optionWidth = w / options.length;
    translateX.setValue(initialIndex * optionWidth);
  }

  function handlePress(i: number) {
    if (i === selectedIndex) return;
    setSelectedIndex(i);
    const optionWidth = containerWidth / options.length || 0;
    Animated.timing(translateX, {
      toValue: i * optionWidth,
      duration: 180,
      useNativeDriver: true,
    }).start();
    onChange?.(i, options[i]);
  }

  const optionWidth = containerWidth / options.length || 0;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={styles.container} onLayout={onContainerLayout}>
        {containerWidth > 0 && (
          <Animated.View
            style={[
              styles.selector,
              {
                width: optionWidth,
                transform: [{ translateX }],
                backgroundColor: theme.colors.primary,
              },
            ]}
          />
        )}

        {options.map((opt, i) => (
          <TouchableOpacity
            key={`${opt}-${i}`}
            style={styles.option}
            activeOpacity={0.8}
            onPress={() => handlePress(i)}
          >
            <Text
              style={[
                styles.optionText,
                i === selectedIndex
                  ? styles.optionTextActive
                  : styles.optionTextInactive,
              ]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  container: {
    borderRadius: 28,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    padding: 3,
    backgroundColor: "#fff",
    overflow: "hidden",
    flexDirection: "row",
  },
  selector: {
    position: "absolute",
    top: 3,
    bottom: 3,
    left: 3,
    borderRadius: 24,
  },
  option: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    zIndex: 2,
  },
  optionText: {
    fontSize: 14,
    textAlign: "center",
  },
  optionTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  optionTextInactive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
