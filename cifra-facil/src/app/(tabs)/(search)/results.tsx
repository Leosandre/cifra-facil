import { View, Text, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useCifra } from '../../../contexts/CifraContext';

// Tela de resultados — redireciona para busca se acessada diretamente
// Os resultados são exibidos inline na tela de busca (melhor UX)
export default function ResultsScreen() {
  const { selectedMusic } = useCifra();

  if (selectedMusic) {
    return <Redirect href={{ pathname: '/(tabs)/(search)/cifra/[id]', params: { id: selectedMusic.id } }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Nenhuma música selecionada</Text>
      <Redirect href="/(tabs)/(search)/" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f23' },
  text: { color: '#a0a0b0', fontSize: 16 },
});
