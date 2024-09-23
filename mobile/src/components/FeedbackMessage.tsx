import React from "react";
import { Text } from "react-native";
import { styled } from "nativewind";

const StyledText = styled(Text);

interface Props {
  submitted: boolean;
}

const FeedbackMessage: React.FC<Props> = ({ submitted }) => {
  return (
    submitted && (
      <StyledText className="text-green-500 mb-6">
        Form submitted successfully!
      </StyledText>
    )
  );
};

export default FeedbackMessage;
