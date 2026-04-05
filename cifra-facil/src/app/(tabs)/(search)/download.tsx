import { useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCifra } from '../../../contexts/CifraContext';
import { transposeCifra } from '../../../utils/transposer';
import { generatePdf } from '../../../utils/pdfGenerator';
import { savePdf } from '../../../utils/fileSystem';
import { buildPdfFilename } from '../../../utils/sanitize';
import StepTom from '../../../components/DownloadModal/StepTom';
import StepPasta from '../../../components/DownloadModal/StepPasta';
import StepConfirmacao from '../../../components/DownloadModal/StepConfirmacao';

type Step = 'tom' | 'pasta' | 'saving' | 'done' | 'error';

export default function DownloadScreen() {
  const router = useRouter();
  const { selectedMusic, cifra, currentKey, setCurrentKey } = useCifra();
  const [step, setStep] = useState<Step>('tom');
  const [selectedKey, setSelectedKey] = useState(currentKey);
  const [savedPath, setSavedPath] = useState('');
  const [savedFilename, setSavedFilename] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!selectedMusic || !cifra) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Nenhuma cifra carregada</Text>
      </View>
    );
  }

  const handleConfirmTom = () => {
    setCurrentKey(selectedKey);
    setStep('pasta');
  };

  const handleConfirmPasta = async (keepBoth: boolean) => {
    setStep('saving');
    try {
      const transposed = transposeCifra(cifra.content, cifra.originalKey, selectedKey);
      const tempUri = await generatePdf({
        artist: selectedMusic.artist,
        song: selectedMusic.name,
        content: transposed,
        originalKey: cifra.originalKey,
        currentKey: selectedKey,
      });
      const path = await savePdf(tempUri, selectedMusic.artist, selectedMusic.name, selectedKey, keepBoth);
      const filename = buildPdfFilename(selectedMusic.artist, selectedMusic.name, selectedKey);
      setSavedPath(path);
      setSavedFilename(filename);
      setStep('done');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao salvar PDF');
      setStep('error');
    }
  };

  const handleOpen = () => {
    router.replace({ pathname: '/(tabs)/(search)/viewer', params: { path: savedPath } });
  };

  const handleBack = () => {
    router.navigate('/(tabs)/(search)/');
  };

  return (
    <View style={styles.container}>
      {step === 'tom' && (
        <StepTom currentKey={selectedKey} onSelectKey={setSelectedKey} onConfirm={handleConfirmTom} />
      )}
      {step === 'pasta' && (
        <StepPasta artist={selectedMusic.artist} song={selectedMusic.name} selectedKey={selectedKey} onConfirm={handleConfirmPasta} />
      )}
      {step === 'saving' && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6c5ce7" />
          <Text style={styles.savingText}>Gerando PDF...</Text>
        </View>
      )}
      {step === 'done' && (
        <StepConfirmacao filename={savedFilename} onOpen={handleOpen} onBack={handleBack} />
      )}
      {step === 'error' && (
        <View style={styles.centered}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  savingText: { color: '#a0a0b0', fontSize: 14, marginTop: 12 },
  errorIcon: { fontSize: 48, marginBottom: 12 },
  errorText: { color: '#e17055', fontSize: 16, textAlign: 'center' },
});
