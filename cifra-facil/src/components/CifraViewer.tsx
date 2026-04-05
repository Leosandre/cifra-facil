import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';

interface CifraViewerProps {
  content: string;
}

const SPEEDS = [
  { label: '0.5x', ms: 4000 },
  { label: '1x', ms: 2500 },
  { label: '1.5x', ms: 1800 },
  { label: '2x', ms: 1200 },
];

export default function CifraViewer({ content }: CifraViewerProps) {
  const [playing, setPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(-1);
  const [speedIdx, setSpeedIdx] = useState(1); // default 1x
  const scrollRef = useRef<ScrollView>(null);
  const lineRefs = useRef<Record<number, number>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const lines = useMemo(() => content.split('\n'), [content]);

  // Limpar timer ao desmontar ou parar
  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  // Avançar linha e rolar
  useEffect(() => {
    stopTimer();
    if (!playing || currentLine < 0) return;

    timerRef.current = setInterval(() => {
      setCurrentLine((prev) => {
        const next = prev + 1;
        if (next >= lines.length) { setPlaying(false); return -1; }
        return next;
      });
    }, SPEEDS[speedIdx].ms);

    return stopTimer;
  }, [playing, speedIdx]);

  // Scroll para linha atual
  useEffect(() => {
    if (currentLine >= 0 && scrollRef.current) {
      const y = lineRefs.current[currentLine];
      if (y !== undefined) scrollRef.current.scrollTo({ y: Math.max(0, y - 100), animated: true });
    }
  }, [currentLine]);

  const handlePlay = () => {
    if (playing) { setPlaying(false); } 
    else { if (currentLine < 0) setCurrentLine(0); setPlaying(true); }
  };

  const handleStop = () => { setPlaying(false); setCurrentLine(-1); };

  const handleSpeed = () => setSpeedIdx((prev) => (prev + 1) % SPEEDS.length);

  const handleLineTap = (idx: number) => { setCurrentLine(idx); if (!playing) setPlaying(true); };

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollRef} style={styles.scroll} horizontal={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.content}>
            {lines.map((line, idx) => (
              <Text
                key={idx}
                onLayout={(e) => { lineRefs.current[idx] = e.nativeEvent.layout.y; }}
                onPress={() => handleLineTap(idx)}
                style={[
                  styles.line,
                  idx === currentLine && styles.lineActive,
                  idx < currentLine && currentLine >= 0 && styles.linePast,
                ]}
                selectable={!playing}
              >
                {line || ' '}
              </Text>
            ))}
          </View>
        </ScrollView>
      </ScrollView>

      {/* Controles karaokê */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.ctrlBtn} onPress={handleStop} accessibilityLabel="Parar">
          <Text style={styles.ctrlText}>⏹</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ctrlBtn, styles.playBtn]} onPress={handlePlay} accessibilityLabel={playing ? 'Pausar' : 'Tocar'}>
          <Text style={styles.playText}>{playing ? '⏸' : '▶'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctrlBtn} onPress={handleSpeed} accessibilityLabel="Velocidade">
          <Text style={styles.ctrlText}>{SPEEDS[speedIdx].label}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 80 },
  line: { fontFamily: 'monospace', fontSize: 14, lineHeight: 24, color: '#636e72', paddingVertical: 1, paddingHorizontal: 4, borderRadius: 4 },
  lineActive: { color: '#ffffff', backgroundColor: '#6c5ce720', fontWeight: '700' },
  linePast: { color: '#a0a0b0' },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#1a1a2e', borderTopWidth: 1, borderTopColor: '#2d2d44' },
  ctrlBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#2d2d44', justifyContent: 'center', alignItems: 'center' },
  playBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#6c5ce7' },
  ctrlText: { color: '#dfe6e9', fontSize: 14, fontWeight: '700' },
  playText: { color: '#fff', fontSize: 22 },
});
