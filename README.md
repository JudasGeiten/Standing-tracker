# 🏆 Tournament Standings Tracker

A frontend web application for visualizing team positions throughout a tournament season. Upload Excel files with match data and see how each team's position changes round by round.

## Features

- **📊 Excel Import**: Import multiple Excel files containing tournament match data
- **📈 Interactive Charts**: Visualize each team's position progression with line charts
- **🔄 Team Navigation**: Switch between teams using intuitive tab navigation
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **⚡ Fast & Lightweight**: Built with Vite for optimal performance

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist` folder.

To preview the production build:

```bash
npm run preview
```

## Excel File Format

Your Excel files should have the following structure:

| Column | Description | Example |
|--------|-------------|---------|
| A | Round number | 1, 2, 3... |
| B | Date | 2025-01-15 |
| C | Day | Monday |
| D | Time | 19:00 |
| E | Home team | "Team A" |
| F | Result | "2-1" or "0-0" |
| G | Away team | "Team B" |
| H | Location | "Stadium Name" |
| I | Tournament name | "Premier League" |
| J | Match ID | "12345" |
| K | Match format | "Regular" |

**Note**: Only columns A (Round), E (Home team), F (Result), and G (Away team) are required. Other columns are optional and will be ignored.

### Result Format

The Result column (Column F) should contain scores in the format:
- `2-1` (Home team scored 2, Away team scored 1)
- `0-0` (Draw)
- `3-2` (Home team scored 3, Away team scored 2)

The app supports both hyphen (`-`) and colon (`:`) separators, e.g., `2-1` or `2:1`.

### Example Data

```
A    | B          | C       | D     | E      | F   | G      | H            | I          | J     | K
-----|------------|---------|-------|--------|-----|--------|--------------|------------|-------|--------
1    | 2025-01-15 | Monday  | 19:00 | Team A | 2-1 | Team B | Stadium A    | League     | 101   | Regular
1    | 2025-01-15 | Monday  | 20:00 | Team C | 0-0 | Team D | Stadium B    | League     | 102   | Regular
2    | 2025-01-22 | Monday  | 19:00 | Team B | 3-2 | Team C | Stadium C    | League     | 103   | Regular
2    | 2025-01-22 | Monday  | 20:00 | Team D | 1-1 | Team A | Stadium D    | League     | 104   | Regular
```

## How It Works

1. **Import Data**: Upload one or more Excel files containing match results
2. **Automatic Calculation**: The app calculates standings after each round based on:
   - Points (3 for win, 1 for draw, 0 for loss)
   - Goal difference
   - Goals scored
   - Alphabetical order (as tiebreaker)
3. **Visualization**: View each team's position changes throughout the season
4. **Navigation**: Switch between teams using the tab interface

## Technologies Used

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Recharts** - Chart visualization
- **xlsx** - Excel file parsing

## Project Structure

```
tournament-standings-app/
├── src/
│   ├── components/
│   │   ├── ExcelImporter.tsx    # File upload component
│   │   ├── TeamTabs.tsx         # Team selection tabs
│   │   └── TeamChart.tsx        # Position chart display
│   ├── utils/
│   │   ├── excelParser.ts       # Excel file parsing logic
│   │   └── standingsCalculator.ts # Standings calculation
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Features Explained

### Position Tracking
- Tracks each team's league position after every round
- Shows current position, best position, and worst position
- Displays position changes with an inverted Y-axis (position 1 at top)

### Multi-File Support
- Import multiple Excel files at once
- Combines data from different sheets
- Automatically sorts matches by round

### Responsive Charts
- Interactive line charts with hover tooltips
- Shows round number on X-axis
- Shows position on Y-axis (inverted, so 1st place is at top)
- Includes legend and data points

## Tips

- You can upload multiple files at once by selecting them together
- The app will combine all sheets from all files into one dataset
- Make sure your Excel files follow the expected format for best results
- The first team in alphabetical order is selected by default

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
