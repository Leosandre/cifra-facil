import { useCallback, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ALL_KEYS, getSemitonesDiff, formatSemitones, getCapoPosition } from '../utils/transposer';

interface ToneSelectorSheetProps {
  originalKey: string;
  currentKey: string;
  onSelectKey: (key: string) => void;
  onClose: () => void;
}

export default function ToneSelectorSheet({ originalKey, currentKey, onSelectKey, onClose }: ToneSelectorSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['45%'], []);

  const semitones = getSemitonesDiff(originalKey, currentKey);
  const capo = getCapoPosition(originalKey, currentKey);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) onClose();
  }, [onClose]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.indicator}
    >
      <BottomSheetView style={styles.content}>
        {/* Info do tom */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Original</Text>
            <Text style={styles.infoValue}>{originalKey || '—'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Atual</Text>
            <Text style={[styles.infoValue, styles.currentKeyText]}>{currentKey || '—'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Semitons</Text>
            <Text style={styles.infoValue}>{formatSemitones(semitones)}</Text>
          </View>
          {capo > 0 && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Capo</Text>
              <Text style={styles.infoValue}>{capo}ª casa</Text>
            </View>
          )}
        </View>

        {/* Grid de 12 tons */}
        <View style={styles.grid}>
          {ALL_KEYS.map((key) => {
            const isSelected = key === currentKey;
            const isOriginal = key === originalKey;
            return (
              <TouchableOpacity
                key={key}
                style={[styles.keyBtn, isSelected && styles.keyBtnSelected, isOriginal && !isSelected && styles.keyBtnOriginal]}
                onPress={() => onSelectKey(key)}
                accessibilityLabel={`Tom ${key}`}
                accessibilityRole="button"
              >
                <Text style={[styles.keyText, isSelected && styles.keyTextSelected]}>
                  {key}
                </Text>
                {isOriginal && <Text style={styles.originalDot}>●</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBg: { backgroundColor: '#1a1a2e' },
  indicator: { backgroundColor: '#636e72', width: 40 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20, paddingVertical: 8, backgroundColor: '#0f0f23', borderRadius: 12, paddingHorizontal: 12 },
  infoItem: { alignItems: 'center' },
  infoLabel: { color: '#636e72', fontSize: 11, marginBottom: 2 },
  infoValue: { color: '#dfe6e9', fontSize: 16, fontWeight: '700' },
  currentKeyText: { color: '#6c5ce7' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  keyBtn: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#2d2d44', justifyContent: 'center', alignItems: 'center',
  },
  keyBtnSelected: { backgroundColor: '#6c5ce7' },
  keyBtnOriginal: { borderWidth: 2, borderColor: '#636e72' },
  keyText: { color: '#dfe6e9', fontSize: 16, fontWeight: '600' },
  keyTextSelected: { color: '#ffffff' },
  originalDot: { color: '#636e72', fontSize: 6, position: 'absolute', bottom: 6 },
});
