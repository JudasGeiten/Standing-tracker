import * as XLSX from 'xlsx';
import { Match } from '../types';

/**
 * Parses the result string (e.g., "2-1", "0-0") into home and away scores
 */
const parseResult = (result: string): { homeScore: number; awayScore: number } | null => {
  if (!result) return null;
  
  const resultStr = String(result).trim();
  const match = resultStr.match(/^(\d+)\s*[-:]\s*(\d+)$/);
  
  if (match) {
    return {
      homeScore: Number(match[1]),
      awayScore: Number(match[2])
    };
  }
  
  return null;
};

/**
 * Parses Excel files containing match data
 * Expected format based on user's layout:
 * Column A: Round number
 * Column B: Date
 * Column C: Day
 * Column D: Time
 * Column E: Home team
 * Column F: Result (e.g., "2-1")
 * Column G: Away team
 * Column H: Location
 * Column I: Tournament name
 * Column J: Match ID
 * Column K: Match format
 */
export const parseExcelFile = (file: File): Promise<Match[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Get all sheets
        const allMatches: Match[] = [];
        
        workbook.SheetNames.forEach((sheetName: string) => {
          const worksheet = workbook.Sheets[sheetName];
          // Read as array of arrays to get data by column position
          const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 1 });
          
          const matches = rawData
            .map((row: any[]) => {
              // Column A (index 0): Round number
              const round = Number(row[0]);
              
              // Column E (index 4): Home team
              const homeTeam = String(row[4] || '').trim();
              
              // Column F (index 5): Result
              const resultStr = String(row[5] || '').trim();
              const parsedResult = parseResult(resultStr);
              
              // Column G (index 6): Away team
              const awayTeam = String(row[6] || '').trim();
              
              // Column I (index 8): Tournament name
              const tournament = String(row[8] || '').trim();
              
              // Only include if we have all required data
              if (round && homeTeam && awayTeam && parsedResult) {
                const match: Match = {
                  round,
                  homeTeam,
                  awayTeam,
                  homeScore: parsedResult.homeScore,
                  awayScore: parsedResult.awayScore,
                };
                
                if (tournament) {
                  match.tournament = tournament;
                }
                
                return match;
              }
              
              return null;
            })
            .filter((match): match is Match => match !== null);
          
          allMatches.push(...matches);
        });
        
        // Sort by round
        allMatches.sort((a, b) => a.round - b.round);
        
        resolve(allMatches);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsBinaryString(file);
  });
};

export const parseMultipleExcelFiles = async (files: FileList): Promise<Match[]> => {
  const allMatches: Match[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const matches = await parseExcelFile(files[i]);
    allMatches.push(...matches);
  }
  
  // Sort by round and remove duplicates
  allMatches.sort((a, b) => a.round - b.round);
  
  return allMatches;
};
