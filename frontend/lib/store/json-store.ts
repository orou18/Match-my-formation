import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const STORE_DIR = join(tmpdir(), 'match-my-formation-store');

export async function writeJsonStore<T>(filename: string, data: T): Promise<void> {
  try {
    // S'assurer que le répertoire existe
    if (!existsSync(STORE_DIR)) {
      require('fs').mkdirSync(STORE_DIR, { recursive: true });
    }
    
    const filePath = join(STORE_DIR, filename);
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Erreur lors de l'écriture du store ${filename}:`, error);
    throw error;
  }
}

export async function readJsonStore<T>(filename: string): Promise<T | null> {
  try {
    const filePath = join(STORE_DIR, filename);
    
    if (!existsSync(filePath)) {
      return null;
    }
    
    const content = readFileSync(filePath, 'utf8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Erreur lors de la lecture du store ${filename}:`, error);
    return null;
  }
}
