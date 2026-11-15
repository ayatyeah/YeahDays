import type { StudyEvent, Text } from '../types';
import researchMethods from './research-methods.json';
import projectManagement from './project-management.json';
import computerVision from './computer-vision.json';
import computerNetworks from './computer-networks.json';
import cloudComputing from './cloud-computing.json';
import philosophy from './philosophy.json';

export type FinalNotebook = {
  event: StudyEvent;
  guide: Text;
  coverage: Text;
  sources: { id: string; title: string; url: string; lectureId: string; pages: string; sha256?: string }[];
  practiceId: string | null;
  reviewedAt: string;
};

/** Server-only registry. Send only the requested notebook to the reading client. */
export const FINAL_NOTEBOOKS: FinalNotebook[] = [researchMethods, cloudComputing, computerNetworks, computerVision, projectManagement, philosophy];
export const RETIRED_NOTEBOOK_ROUTES: Record<string, string> = {
  'research-methods-endterm': 'research-methods-final',
  'cloud-computing-endterm': 'cloud-computing-final',
  'computer-networks-endterm': 'computer-networks-final',
};
export function findFinalEvent(id: string): FinalNotebook | undefined {
  return FINAL_NOTEBOOKS.find(book => book.event.id === (RETIRED_NOTEBOOK_ROUTES[id] ?? id));
}
