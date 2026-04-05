import { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';
import { useRouter } from 'expo-router';
import { useCifra } from '../../../../contexts/CifraContext';
import { fetchCifra } from '../../../../services/music.service';
import { transposeCifra, getSemitonesDiff, formatSemitones } from '../../../../utils/transposer';
import CifraViewer from '../../../../components/CifraViewer';
import ToneSelectorSheet from '../../../../components/ToneSelectorSheet';
import { CifraSkeleton } from '../../../../components/Skeleton';

type ScreenState = 'loading' | 'success' | 'error';

export default function CifraScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { selectedMusic, cifra, setCifra, currentKey, setCurrentKey } = useCifra();
  const [state, setState] = useState<ScreenState>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [showToneSheet, setShowToneSheet] = useState(false);

  useEffect(() => {
    if (!selectedMusic) return;
    navigation.setOptions({ title: selectedMusic.name });
    loadCifra();
  }, [selectedMusic]);

  const loadCifra = async () => {
    if (!selectedMusic) return;
    setState('loading');
    try {
      const result = await fetchCifra(selectedMusic.artistSlug, selectedMusic.songSlug);
      if (result) {
        setCifra(result);
        setCurrentKey(result.originalKey || 'C');
        setState('success');
      } else {
        setErrorMsg('Cifra não encontrada');
        setState('error');
      }
    } catch (err: any) {
      setErrorMsg(err.name === 'AbortError' ? 'Conexão lenta. Tente novamente.' : 'Erro ao carregar cifra.');
      setState('error');
    }
  };

  // Transposição em tempo real — recalcula só quando tom muda
  const transposedContent = useMemo(() => {
    if (!cifra?.content || !cifra.originalKey || !currentKey) return cifra?.content ?? '';
    return transposeCifra(cifra.content, cifra.originalKey, currentKey);
  }, [cifra?.content, cifra?.originalKey, currentKey]);

  const semitones = cifra?.originalKey ? getSemitonesDiff(cifra.originalKey, currentKey) : 0;

  if (!selectedMusic) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyIcon}>🎸</Text>
        <Text style={styles.errorText}>Nenhuma música selecionada</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(tabs)/(search)/')}>
          <Text style={styles.backBtnText}>🔍 Ir para Busca</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.artist}>{selectedMusic.artist}</Text>
        {cifra?.originalKey ? (
          <Text style={styles.keyInfo}>
            Tom: {currentKey}{semitones !== 0 ? ` (${formatSemitones(semitones)})` : ''}
          </Text>
        ) : null}
      </View>

      {/* Fallback warning */}
      {state === 'success' && cifra?.lyricsOnly && (
        <View style={styles.warning}>
          <Text style={styles.warningText}>⚠️ Acordes indisponíveis. Exibindo apenas a letra.</Text>
        </View>
      )}

      {/* Content */}
      {state === 'loading' && <CifraSkeleton />}

      {state === 'success' && <CifraViewer content={transposedContent} />}

      {state === 'error' && (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>⚠️</Text>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      {/* Botão flutuante de tom */}
      {state === 'success' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowToneSheet(true)}
          accessibilityLabel={`Tom atual: ${currentKey || 'C'}. Toque para alterar.`}
          accessibilityRole="button"
        >
          <Text style={styles.fabText}>🎵 {currentKey || 'C'}</Text>
        </TouchableOpacity>
      )}

      {/* Botão de download */}
      {state === 'success' && (
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={() => router.push('/(tabs)/(search)/download')}
          accessibilityLabel="Baixar cifra"
          accessibilityRole="button"
        >
          <Text style={styles.downloadText}>⬇ Download</Text>
        </TouchableOpacity>
      )}

      {/* BottomSheet de seleção de tom */}
      {showToneSheet && (
        <ToneSelectorSheet
          originalKey={cifra?.originalKey || currentKey || 'C'}
          currentKey={currentKey || 'C'}
          onSelectKey={(key) => setCurrentKey(key)}
          onClose={() => setShowToneSheet(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1e1e3a' },
  artist: { color: '#a0a0b0', fontSize: 14 },
  keyInfo: { color: '#6c5ce7', fontSize: 14, fontWeight: '600' },
  loadingText: { color: '#a0a0b0', fontSize: 14, marginTop: 12 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  errorText: { color: '#e17055', fontSize: 16, textAlign: 'center' },
  backBtn: { marginTop: 20, backgroundColor: '#6c5ce7', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 14, minHeight: 48 },
  backBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  warning: { backgroundColor: '#2d2d44', paddingHorizontal: 16, paddingVertical: 8 },
  warningText: { color: '#ffeaa7', fontSize: 13 },
  fab: {
    position: 'absolute', bottom: 24, right: 20,
    backgroundColor: '#6c5ce7', borderRadius: 28,
    paddingHorizontal: 20, paddingVertical: 14,
    elevation: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 4,
    minWidth: 44, minHeight: 44,
    justifyContent: 'center', alignItems: 'center',
  },
  fabText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  downloadBtn: {
    position: 'absolute', bottom: 24, left: 20,
    backgroundColor: '#00b894', borderRadius: 12,
    paddingHorizontal: 20, paddingVertical: 14,
    elevation: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 4,
    minWidth: 44, minHeight: 44,
    justifyContent: 'center', alignItems: 'center',
  },
  downloadText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});
