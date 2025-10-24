import React, { useState } from 'react';
import { parseMultipleExcelFiles } from '../utils/excelParser';
import { Match } from '../types';

interface ExcelImporterProps {
  onMatchesLoaded: (matches: Match[]) => void;
}

export const ExcelImporter: React.FC<ExcelImporterProps> = ({ onMatchesLoaded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const matches = await parseMultipleExcelFiles(files);
      
      if (matches.length === 0) {
        setError('No valid match data found in the selected files.');
        return;
      }

      onMatchesLoaded(matches);
    } catch (err) {
      setError('Error parsing Excel files. Please check the file format.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="excel-importer">
      <div className="import-section">
        <label htmlFor="file-upload" className="file-label">
          Import Tournament Data
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx,.xls"
          multiple
          onChange={handleFileChange}
          disabled={isLoading}
          className="file-input"
        />
        <p className="help-text">
          Select one or more Excel files containing match data. 
          Expected format: Round number (Column A), Home team (Column E), Result (Column F, e.g., "2-1"), Away team (Column G)
        </p>
      </div>

      {isLoading && (
        <div className="status-message loading">
          Loading and processing files...
        </div>
      )}

      {error && (
        <div className="status-message error">
          {error}
        </div>
      )}
    </div>
  );
};
