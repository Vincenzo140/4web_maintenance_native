import React from "react";
import { Text, TextInput } from "react-native";
import { styled } from "nativewind";

const StyledTextInput = styled(TextInput);
const StyledText = styled(Text);

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  isValid: boolean;
}

const NameInput: React.FC<Props> = ({ value, onChangeText, isValid }) => {
  return (
    <>
      <StyledText className="text-lg font-semibold text-gray-700 mb-4">
        Name:
      </StyledText>
      <StyledTextInput
        placeholder="Enter your name"
        value={value}
        onChangeText={onChangeText}
        className={`border rounded-lg p-4 mb-6 text-gray-700 ${isValid ? 'border-gray-300' : 'border-red-500'}`}
      />
      {!isValid && (
        <StyledText className="text-red-500 mb-4">
          Name must be at least 3 characters long.
        </StyledText>
      )}
    </>
  );
};

export default NameInput;
