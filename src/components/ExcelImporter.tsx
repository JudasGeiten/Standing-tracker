import React, { useState } from 'react';
import { parseMultipleExcelFiles } from '../utils/excelParser';
import { Tournament } from '../types';

interface ExcelImporterProps {
  onTournamentsLoaded: (tournaments: Tournament[]) => void;
}

export const ExcelImporter: React.FC<ExcelImporterProps> = ({ onTournamentsLoaded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const tournaments = await parseMultipleExcelFiles(files);
      
      if (tournaments.length === 0) {
        setError('No valid tournament data found in the selected files.');
        return;
      }

      onTournamentsLoaded(tournaments);
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
          Select one or more Excel files - each file will be imported as a separate tournament. 
          Expected format: Round number (Column A), Home team (Column E), Result (Column F, e.g., "2-1"), Away team (Column G), Tournament name (Column I)
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
