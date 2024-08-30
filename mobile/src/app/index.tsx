import {
  Button,
  Text,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  Switch,
  Clipboard,
  Share,
  Animated,
  Easing,
  TouchableNativeFeedbackComponent,
} from "react-native";
import { styled } from 'nativewind';
import React, { useState, useEffect, useRef } from "react";
import { Audio } from 'expo-av'; // Para feedback sonoro

// Componentes estilizados com nativewind
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledButton = styled(Button);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);


export default function Index() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNameValid, setIsNameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isEmailDomainValid, setIsEmailDomainValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [theme, setTheme] = useState("light");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de entrada
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
    setIsPasswordValid(text.length >= 6); // Validação simples
  };

  const handleSubmit = async () => {
    Keyboard.dismiss(); // Esconde o teclado ao submeter
    setLoading(true);
    try {
      // Reproduzir feedback sonoro
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sucess.mp3') // Adirrercione um arquivo de som de sucesso
      );
      await sound.playAsync();

      // Simulação de carregamento
      setTimeout(() => {
        setLoading(false);
        if (isNameValid && isEmailValid && isEmailDomainValid && isPasswordValid) {
          setSubmitted(true);
          Alert.alert("Success", `Name: ${name}\nEmail: ${email}`);
        } else {
          Alert.alert("Error", "Please enter valid information.");
        }
      }, 2000); // Simulação de carregamento
    } catch (error) {
      Alert.alert("Error", "Failed to play sound.");
      setLoading(false);
    }
  };


  const handleCopyToClipboard = () => {
    Clipboard.setString(`Name: ${name}\nEmail: ${email}`);
    Alert.alert("Copied to Clipboard");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Name: ${name}\nEmail: ${email}`,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share the content.");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark-black" : "light");
  };

  return (
    <StyledScrollView
      className={`flex-1 p-8 ${theme === "light" ? "bg-gradient-to-b from-blue-50 to-blue-200" : "bg-gray-900"}`}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        <StyledView className="bg-white p-6 rounded-lg shadow-lg">
          {submitted && (
            <StyledText className="text-green-500 text-lg mb-4">
              Form successfully submitted!
            </StyledText>
          )}

          <StyledText className="text-lg font-semibold text-gray-700 mb-4">
            Name:
          </StyledText>
          <StyledTextInput
            placeholder={theme === "light" ? "Enter your name" : "Your name..."}
            value={name}
            onChangeText={validateName}
            className={`border rounded-lg p-4 mb-6 text-gray-700 ${isNameValid ? 'border-gray-300' : 'border-red-500'}`}
            accessibilityLabel="Name Input"
            accessibilityHint="Enter your name here"
          />
          {!isNameValid && (
            <StyledText className="text-red-500 mb-4">Name must be at least 3 characters long.</StyledText>
          )}

          <StyledText className="text-lg font-semibold text-gray-700 mb-4">
            Email:
          </StyledText>
          <StyledTextInput
            placeholder={theme === "light" ? "Enter your email" : "Your email..."}
            value={email}
            onChangeText={validateEmail}
            className={`border rounded-lg p-4 mb-6 text-gray-700 ${isEmailValid ? 'border-gray-300' : 'border-red-500'}`}
            accessibilityLabel="Email Input"
            accessibilityHint="Enter your email here"
          />
          {!isEmailValid && (
            <StyledText className="text-red-500 mb-4">Please enter a valid email address.</StyledText>
          )}
          {!isEmailDomainValid && (
            <StyledText className="text-red-500 mb-4">Email must be from @example.com domain.</StyledText>
          )}

          <StyledText className="text-lg font-semibold text-gray-700 mb-4">
            Password:
          </StyledText>
          <StyledTextInput
            placeholder="Enter your password"
            value={password}
            onChangeText={validatePassword}
            secureTextEntry={!isPasswordVisible}
            className={`border rounded-lg p-4 mb-6 text-gray-700 ${isPasswordValid ? 'border-gray-300' : 'border-red-500'}`}
            accessibilityLabel="Password Input"
            accessibilityHint="Enter your password here"
          />
          {!isPasswordValid && (
            <StyledText className="text-red-500 mb-4">Password must be at least 6 characters long.</StyledText>
          )}
          <StyledTouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <StyledText className="text-indigo-500 mb-4">
              {isPasswordVisible ? "Hide Password" : "Show Password"}
            </StyledText>
          </StyledTouchableOpacity>

          <StyledTouchableOpacity
            className="bg-indigo-500 p-4 rounded-lg"
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <StyledText className="text-white text-center font-semibold">Submit</StyledText>
            )}
          </StyledTouchableOpacity>

          <StyledButton
            title="Reset"
            color="#6b7280"
            onPress={() => {
              setName("");
              setEmail("");
              setPassword("");
              setIsNameValid(true);
              setIsEmailValid(true);
              setIsEmailDomainValid(true);
              setIsPasswordValid(true);
              setSubmitted(false);
            }}
            className="mt-4"
          />

          <StyledTouchableOpacity onPress={handleCopyToClipboard}>
            <StyledText className="text-blue-500 text-center mt-4">
              Copy to Clipboard
            </StyledText>
          </StyledTouchableOpacity>

          <StyledTouchableOpacity onPress={handleShare}>
            <StyledText className="text-blue-500 text-center mt-4">
              Share Information
            </StyledText>
          </StyledTouchableOpacity>

          <StyledView className="flex-row justify-between items-center mt-4">
            <StyledText className="text-gray-700">Dark Mode</StyledText>
            <Switch value={theme === "dark-black"} onValueChange={toggleTheme} />
          </StyledView>
        </StyledView>
      </Animated.View>
    </StyledScrollView>
  );
}
