import { Lesson } from '../types';

import { astronomyLessons } from './astronomy';
import { physicsLessons } from './physics';
import { pythonLessons } from './python';

export type { Lesson };

export const allLessons = {
  astronomy: astronomyLessons,
  physics: physicsLessons,
  python: pythonLessons,
};

export const subjectMetadata = {
  astronomy: {
    title: 'Astronomy',
    icon: '🪐',
    color: '#00ffea',
    levels: [
      { name: 'Cosmic Cadet', range: [1, 50] },
      { name: 'Stellar Navigator', range: [51, 100] },
      { name: 'Galactic Commander', range: [101, 150] },
      { name: 'Master of the Multiverse', range: [151, 200] }
    ]
  },
  physics: {
    title: 'Physics',
    icon: '⚛️',
    color: '#0088ff',
    levels: [
      { name: 'Physics Apprentice', range: [1, 50] },
      { name: 'Energy Mechanist', range: [51, 100] },
      { name: 'Advanced Architect', range: [101, 150] },
      { name: 'Entropy Specialist', range: [151, 200] }
    ]
  },
  python: {
    title: 'Python Coding',
    icon: '💻',
    color: '#ffff00',
    levels: [
      { name: 'Code Initiate', range: [1, 50] },
      { name: 'Scripting Voyager', range: [51, 100] },
      { name: 'System Integrator', range: [101, 150] },
      { name: 'Algorithmic Master', range: [151, 200] }
    ]
  }
};
