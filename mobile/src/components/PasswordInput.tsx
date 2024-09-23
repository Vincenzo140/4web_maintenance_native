import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { styled } from "nativewind";

const StyledTextInput = styled(TextInput);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  isValid: boolean;
}

const PasswordInput: React.FC<Props> = ({ value, onChangeText, isValid }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <>
      <StyledText className="text-lg font-semibold text-gray-700 mb-4">
        Password:
      </StyledText>
      <StyledTextInput
        placeholder="Enter your password"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!isPasswordVisible}
        className={`border rounded-lg p-4 mb-6 text-gray-700 ${isValid ? 'border-gray-300' : 'border-red-500'}`}
      />
      {!isValid && (
        <StyledText className="text-red-500 mb-4">
          Password must be at least 6 characters long.
        </StyledText>
      )}
      <StyledTouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
        <StyledText className="text-indigo-500 mb-4">
          {isPasswordVisible ? "Hide Password" : "Show Password"}
        </StyledText>
      </StyledTouchableOpacity>
    </>
  );
};

export default PasswordInput;
