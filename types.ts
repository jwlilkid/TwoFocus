export enum RankingCriteria {
  PRIORITY = 'PRIORITY',
  BOTHERED = 'BOTHERED',
  DIFFICULTY = 'DIFFICULTY',
  CATEGORY = 'CATEGORY',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: number; // 0-10
  botheredLevel: number; // 0-10
  difficultyLevel: number; // 0-10
  category: string;
  tagColor: string;
  deadline?: string; // ISO string
  createdAt: number;
  completedAt?: number;
}

export interface TagOption {
  color: string;
  label?: string; // Optional label for predefined colors
}

export const DEFAULT_COLORS = [
  '#ff90e8', // Pink
  '#ffc900', // Yellow
  '#23a6d5', // Blue
  '#90e0ef', // Mint
  '#b185db', // Purple
  '#ff6b6b', // Red
  '#feca57', // Orange
  '#48dbfb', // Cyan
  '#ff9ff3', // Rose
  '#54a0ff', // Light Blue
  '#5f27cd', // Dark Purple
  '#1dd1a1', // Green
];