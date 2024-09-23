import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { styled } from "nativewind";

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

interface Props {
  onPress: () => void;
  loading: boolean;
}

const SubmitButton: React.FC<Props> = ({ onPress, loading }) => {
  return (
    <StyledTouchableOpacity
      className="bg-indigo-500 p-4 rounded-lg"
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <StyledText className="text-white text-lg font-semibold text-center">
          Submit
        </StyledText>
      )}
    </StyledTouchableOpacity>
  );
};

export default SubmitButton;
