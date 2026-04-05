import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBar from '../../../components/SearchBar';
import MusicCard from '../../../components/MusicCard';
import { searchCifras, type CifrasSearchResult } from '../../../services/cifras.service';
import { useCifra } from '../../../contexts/CifraContext';

const HISTORY_KEY = 'search_history';
const MAX_HISTORY = 10;

type ScreenState = 'idle' | 'loading' | 'results' | 'empty' | 'error';

export default function SearchScreen() {
  const router = useRouter();
  const { setSelectedMusic } = useCifra();
  const [results, setResults] = useState<CifrasSearchResult[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [state, setState] = useState<ScreenState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(HISTORY_KEY).then((data) => {
      if (data) setHistory(JSON.parse(data));
    });
  }, []);

  const saveToHistory = async (query: string) => {
    const updated = [query, ...history.filter((h) => h !== query)].slice(0, MAX_HISTORY);
    setHistory(updated);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  const handleSearch = useCallback(async (query: string) => {
    setState('loading');
    setErrorMsg('');
    try {
      const data = await searchCifras(query);
      if (data.length === 0) {
        setState('empty');
      } else {
        setResults(data);
        setState('results');
        await saveToHistory(query);
      }
    } catch (err: any) {
      setErrorMsg(err.name === 'AbortError' ? 'Conexão lenta. Tente novamente.' : 'Erro ao buscar. Verifique sua conexão.');
      setState('error');
    }
  }, [history]);

  const handleSelectMusic = (item: CifrasSearchResult) => {
    setSelectedMusic({
      id: item.id,
      name: item.title,
      artist: item.artist,
      artistSlug: item.artistSlug,
      songSlug: item.songSlug,
      avatar: item.avatar,
    });
    router.push({ pathname: '/(tabs)/(search)/cifra/[id]', params: { id: item.id } });
  };

  const clearHistory = async () => {
    setHistory([]);
    await AsyncStorage.removeItem(HISTORY_KEY);
  };

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} />

      {state === 'idle' && history.length > 0 && (
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Buscas recentes</Text>
            <TouchableOpacity onPress={clearHistory} style={styles.clearHistoryBtn}>
              <Text style={styles.clearHistoryText}>Limpar</Text>
            </TouchableOpacity>
          </View>
          {history.map((item) => (
            <TouchableOpacity key={item} style={styles.historyItem} onPress={() => handleSearch(item)} accessibilityLabel={`Buscar ${item}`}>
              <Text style={styles.historyIcon}>🕐</Text>
              <Text style={styles.historyText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {state === 'idle' && history.length === 0 && (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>🎸</Text>
          <Text style={styles.emptyText}>Pesquise por música ou artista</Text>
        </View>
      )}

      {state === 'loading' && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6c5ce7" />
          <Text style={styles.loadingText}>Buscando...</Text>
        </View>
      )}

      {state === 'empty' && (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>Nenhuma música encontrada</Text>
        </View>
      )}

      {state === 'error' && (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>⚠️</Text>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      {state === 'results' && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <MusicCard title={item.title} artist={item.artist} onPress={() => handleSelectMusic(item)} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  list: { paddingTop: 12, paddingBottom: 24 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#a0a0b0', fontSize: 16, textAlign: 'center' },
  errorText: { color: '#e17055', fontSize: 16, textAlign: 'center' },
  loadingText: { color: '#a0a0b0', fontSize: 14, marginTop: 12 },
  historySection: { paddingTop: 20, paddingHorizontal: 16 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  historyTitle: { color: '#a0a0b0', fontSize: 14, fontWeight: '600' },
  clearHistoryBtn: { padding: 8, minWidth: 44, minHeight: 44, justifyContent: 'center' },
  clearHistoryText: { color: '#6c5ce7', fontSize: 13 },
  historyItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  historyIcon: { fontSize: 14, marginRight: 10 },
  historyText: { color: '#dfe6e9', fontSize: 15 },
});
