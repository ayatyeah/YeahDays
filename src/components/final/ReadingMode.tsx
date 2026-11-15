'use client';
import { createContext } from 'react';
export const ReadingModeContext = createContext<{ clean: boolean; canRead: boolean; toggle: () => void } | null>(null);
