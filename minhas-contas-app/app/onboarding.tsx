import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#fff',
  primary: '#1f1f1f',
  text: '#1f1f1f',
  textSecondary: '#a9a9a9',
};

const slides = [
  {
    key: '1',
    title: 'Assuma o controle das suas finanças',
    text: 'Simplifique a gestão do seu dinheiro e tome decisões mais inteligentes.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCj0a3EGjjvqE8xoOCO6s5wDhZljBiBpfDVfpzwgRhM4VIdfa_73jqkccWdi31qInob0gvBmJLF0Yj0CvBt0sArLth0MB5du4xjo1rNKOIbp89INWN9A9vO8VV4boERgaURucaZYZANmWwwjaqt2fXPJstyPvrGM59-eG-lBxNvYCHCfcFr8qUyIdvNRpZxCi6fWmIHUoxcKbATcJAUC1R6t9B5oAjWAlnbnKLfGQMqek1xvpbf6lei0JZNjAMHjhMNShzA3-cVr7he',
  },
  {
    key: '2',
    title: 'Visualize todos os seus gastos',
    text: 'Acompanhe para onde seu dinheiro está indo com nosso rastreamento fácil de usar.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIHDEpGCQAwWRQA8MWLOvSkJq7RwZqmWExQKCDOQYMkSKC6bde0HAUYtecZ-dwQAkMOZJrG-pz55xjgURWIW0Jd2xALsgrE6-zDNCuSE68sU1pj7ifpdfzrCZuFaMuQzXZBBazMdtP4TFSrMUikyXxdIGqn44hUfMPkFqNAABiv8GdCl_luV_Fv_HQ9L__Zal_H7QbAn_JorZf7EszgAmBBdzgh70JTdlmMVTRW6QROATmQ1RaS0I50EsmAoqRASFrladGaFN14Yut',
  },
  {
    key: '3',
    title: 'Crie metas e alcance seus sonhos',
    text: 'Defina orçamentos e objetivos financeiros para construir o futuro que você deseja.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZm7ikgiHMLvdyW-gr7ED8oUJKDhxNOh-_MOhiZaeixwXIbFvp6trr_xDCIHGNXMjDH3XURDQn1mPNzLgu0Dm13cXTHM2-aa_QBeuhvTllfCIfXlRtLAAgwYj1RAAUXVmKIPziVNXx-IruAflSq-OjTueuhZoSOSKrjb3DxGvn9-xf_JlRgI5eLGwm6LEs5fBJC-SoaLd3C9mQSLB3cf6PUH3XfTZ59fZX2LzrZICPs1LM9b_u5hq0LF81H7gOoXWxqjOuvC-GF75p',
  },
];

const Slide = ({ item }: { item: typeof slides[0] }) => {
  return (
    <View style={styles.slide}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </View>
  );
};

export default function OnboardingScreen() {
  const router = useRouter();

  // Vamos deixar a navegação para a próxima etapa (Login)
  const handleCreateAccount = () => router.push('/(tabs)'); // Por enquanto, vai para o dashboard
  const handleLogin = () => router.push('/(tabs)'); // Por enquanto, vai para o dashboard
  const handleSkip = () => router.push('/(tabs)'); // Por enquanto, vai para o dashboard

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
        <Text style={styles.skipText}>Pular</Text>
      </TouchableOpacity>

      <FlatList
        data={slides}
        renderItem={({ item }) => <Slide item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
      />

      <View style={styles.bottomContainer}>
        {/* Indicadores do carrossel (simplificado por enquanto) */}
        <View style={styles.indicatorContainer}>
          <View style={[styles.indicator, styles.indicatorActive]} />
          <View style={styles.indicator} />
          <View style={styles.indicator} />
        </View>

        <TouchableOpacity onPress={handleCreateAccount} style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Criar Conta Grátis</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.loginText}>
            Já tenho uma conta. <Text style={{ fontWeight: 'bold' }}>Entrar</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    fontFamily: 'Monteserrat-Regular',
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: 20,
  },
  skipText: {
    color: COLORS.textSecondary,
    fontFamily: 'Monteserrat-Bold',
    fontSize: 16,
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 40,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontFamily: 'Monteserrat-Bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#989898ff',
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  ctaButtonText: {
    color: '#fff', // Background escuro para contraste
    fontSize: 16,
    fontFamily: 'Monteserrat-Bold',
  },
  loginText: {
    color: COLORS.primary,
    textAlign: 'center',
    fontSize: 14,
  },
});