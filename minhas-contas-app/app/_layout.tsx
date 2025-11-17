import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts, Manrope_400Regular, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Previne a splash screen de esconder-se automaticamente antes das fontes carregarem.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Garante que o recarregamento navegue de volta para a tela inicial (onboarding).
  initialRouteName: 'onboarding',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Carrega as fontes customizadas
  const [fontsLoaded, fontError] = useFonts({
    'Manrope-Regular': Manrope_400Regular,
    'Manrope-Bold': Manrope_700Bold,
  });

  // Mostra a splash screen até que as fontes estejam carregadas ou ocorra um erro.
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Se as fontes não carregaram e não há erro, não renderiza nada ainda.
  // A splash screen continuará visível.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/*
          A ORDEM IMPORTA: A primeira tela na Stack é a tela inicial do app.
        */}
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        
        {/* O grupo de telas com a barra de abas */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* O modal para adicionar uma nova fatura */}
        <Stack.Screen 
          name="add-bill" 
          options={{ 
            presentation: 'modal', 
            title: 'Nova Fatura'
          }}
        />
        <Stack.Screen
          name="add-account"
          options={{
            title: 'Nova Conta'
          }}
        />
        <Stack.Screen
          name="add-transaction"
          options={{
            title: 'Nova Transação'
          }}
        />
        <Stack.Screen name="select-category" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}