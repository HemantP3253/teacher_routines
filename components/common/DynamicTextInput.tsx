import { DynamicTextInputProps } from "@/interfaces/interfaces";
import { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { ThemedPressable, ThemedText, ThemedTextInput } from "../themed";

const DynamicTextInput = ({
  inputFields,
  onSubmit,
  defaultValues,
}: DynamicTextInputProps) => {
  const [textValues, setTextValues] = useState<string[]>(() => {
    return defaultValues || Array(inputFields.length).fill("");
  });

  const isClearable = useMemo(() => {
    return textValues.some((text) => text.trim() !== "");
  }, [textValues]);

  const isSubmittable = useMemo(() => {
    return textValues.every((value, index) => {
      const isNullable = inputFields[index]?.isNullable;
      if (!isNullable && value === "") return false;

      return true;
    });
  }, [textValues, inputFields]);

  useEffect(() => {
    if (defaultValues) {
      setTextValues(defaultValues);
    } else {
      setTextValues(Array(inputFields.length).fill(""));
    }
  }, [defaultValues, inputFields.length]);

  const handleTextChange = (value: string, index: number) => {
    setTextValues((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "padding" : "position"}
      >
        <View>
          {inputFields.map((input, index) => {
            return (
              <ThemedTextInput
                key={index}
                title={input.title}
                blendColor={input.blendColor}
                value={textValues[index] || ""}
                secureTextEntry={input.isSensitiveText}
                onChangeText={(value) => handleTextChange(value, index)}
              />
            );
          })}
          <View style={styles.actionButtonsContainer}>
            <ThemedPressable
              noFill
              disabled={isClearable}
              onPress={() => setTextValues(Array(inputFields.length).fill(""))}
            >
              <ThemedText>Clear</ThemedText>
            </ThemedPressable>
            <ThemedPressable
              disabled={isSubmittable}
              onPress={() => onSubmit?.(textValues)}
            >
              <ThemedText type="primaryContent">Submit</ThemedText>
            </ThemedPressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1 },
  actionButtonsContainer: {},
});

export default DynamicTextInput;
