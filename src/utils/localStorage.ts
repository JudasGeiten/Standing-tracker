import { Tournament } from '../types';

const STORAGE_KEY = 'tournament_standings_data';

export const saveTournamentsToStorage = (tournaments: Tournament[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tournaments));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadTournamentsFromStorage = (): Tournament[] | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as Tournament[];
    }
    return null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

export const clearTournamentsFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};
