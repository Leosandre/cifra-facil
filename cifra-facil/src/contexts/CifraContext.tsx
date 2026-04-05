import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { CifraData } from '../services/cifras.service';

export interface MusicResult {
  id: string;
  name: string;
  artist: string;
  artistSlug: string;
  songSlug: string;
  avatar: string;
}

interface CifraContextType {
  selectedMusic: MusicResult | null;
  setSelectedMusic: (music: MusicResult | null) => void;
  cifra: CifraData | null;
  setCifra: (cifra: CifraData | null) => void;
  currentKey: string;
  setCurrentKey: (key: string) => void;
}

const CifraContext = createContext<CifraContextType | undefined>(undefined);

export function CifraProvider({ children }: { children: ReactNode }) {
  const [selectedMusic, setSelectedMusic] = useState<MusicResult | null>(null);
  const [cifra, setCifra] = useState<CifraData | null>(null);
  const [currentKey, setCurrentKey] = useState('');

  return (
    <CifraContext.Provider value={{ selectedMusic, setSelectedMusic, cifra, setCifra, currentKey, setCurrentKey }}>
      {children}
    </CifraContext.Provider>
  );
}

export function useCifra(): CifraContextType {
  const context = useContext(CifraContext);
  if (!context) throw new Error('useCifra must be used within a CifraProvider');
  return context;
}
