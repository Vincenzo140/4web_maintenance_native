import React from "react";
import { Switch, Text, View } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

interface Props {
  theme: string;
  toggleTheme: () => void;
}

const ThemeSwitch: React.FC<Props> = ({ theme, toggleTheme }) => {
  return (
    <StyledView className="flex-row items-center mt-6">
      <StyledText className="mr-4">
        {theme === "light" ? "Light Mode" : "Dark Mode"}
      </StyledText>
      <Switch value={theme === "dark-black"} onValueChange={toggleTheme} />
    </StyledView>
  );
};

export default ThemeSwitch;
