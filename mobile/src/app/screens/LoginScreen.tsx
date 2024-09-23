import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  Keyboard,
  Animated,
  Easing,
  Alert,
} from "react-native";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Audio } from "expo-av";
import { styled } from "nativewind";
import NameInput from "../../components/NameInput";
import EmailInput from "../../components/EmailInput";
import PasswordInput from "../../components/PasswordInput";
import SubmitButton from "../../components/SubmitButton";
import ThemeSwitch from "../../components/ThemeSwitch";
import FeedbackMessage from "../../components/FeedbackMessage";

const StyledScrollView = styled(ScrollView);

type RootStackParamList = {
  Dashboard: undefined;
  Login: undefined;
};

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNameValid, setIsNameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isEmailDomainValid, setIsEmailDomainValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [theme, setTheme] = useState("light");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateName = (text: string) => {
    setName(text);
    setIsNameValid(text.length >= 3);
  };

  const validateEmail = (text: string) => {
    setEmail(text);
    setIsEmailValid(/\S+@\S+\.\S+/.test(text));
    setIsEmailDomainValid(text.endsWith("@example.com"));
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    setIsPasswordValid(text.length >= 6);
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/sucess.mp3')
      );
      await sound.playAsync();

      setTimeout(() => {
        setLoading(false);
        if (isNameValid && isEmailValid && isEmailDomainValid && isPasswordValid) {
          setSubmitted(true);
          Alert.alert("Success", `Name: ${name}\nEmail: ${email}`);
          navigation.navigate('Dashboard');
        } else {
          Alert.alert("Error", "Please enter valid information.");
        }
      }, 2000);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to play sound.");
      setLoading(false);
    }
  };

  return (
    <StyledScrollView
      className={`flex-1 p-8 ${theme === "light" ? "bg-gradient-to-b from-blue-50 to-blue-200" : "bg-gray-900"}`}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        <FeedbackMessage submitted={submitted} />
        <NameInput value={name} onChangeText={validateName} isValid={isNameValid} />
        <EmailInput
          value={email}
          onChangeText={validateEmail}
          isValid={isEmailValid}
          isDomainValid={isEmailDomainValid}
        />
        <PasswordInput
          value={password}
          onChangeText={validatePassword}
          isValid={isPasswordValid}
        />
        <SubmitButton onPress={handleSubmit} loading={loading} />
        <ThemeSwitch 
          theme={theme} 
          toggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
        />
      </Animated.View>
    </StyledScrollView>
  );
}
