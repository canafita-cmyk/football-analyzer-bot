# Phase 5: Historical Data & Filtering - Documentation

## Overview

Phase 5 implements comprehensive historical data visualization and filtering capabilities for the Football Analyzer Bot. Users can now browse historical match data, filter by team, date range, and competition, and compare statistics between teams.

## Features Implemented

### 1. Backend Database Functions

#### New Functions in `server/db.ts`:

- **`getHistoricalMatches(filters)`** - Retrieves matches with optional filtering
  - Parameters:
    - `teamId?: number` - Filter by team (home or away)
    - `leagueId?: number` - Filter by competition
    - `startDate?: Date` - Filter matches after this date
    - `endDate?: Date` - Filter matches before this date
    - `limit?: number` - Maximum number of results (default: 50)
    - `offset?: number` - Pagination offset (default: 0)
  - Returns: Array of Match objects

- **`getMatchesWithStatistics(filters)`** - Retrieves matches with their associated statistics
  - Same parameters as `getHistoricalMatches`
  - Returns: Array of Match objects with nested statistics

- **`getTeamStatistics(teamId, filters?)`** - Aggregates statistics for a specific team
  - Parameters:
    - `teamId: number` - Required team ID
    - `filters?: { leagueId?, startDate?, endDate? }` - Optional filters
  - Returns: Object with aggregated stats (averages and totals)
    - `matchCount` - Number of matches analyzed
    - `averageCorners` - Average corner kicks per match
    - `averageFouls` - Average fouls per match
    - `averageYellowCards` - Average yellow cards per match
    - `averageRedCards` - Average red cards per match
    - `averageShots` - Average shots per match
    - `averagePossession` - Average ball possession percentage
    - `totalCorners` - Total corner kicks
    - `totalFouls` - Total fouls
    - `totalYellowCards` - Total yellow cards
    - `totalRedCards` - Total red cards
    - `totalShots` - Total shots

- **`getUniqueTeams()`** - Returns list of all unique teams in database
  - Returns: Array of `{ id, name }`

- **`getUniqueLeagues()`** - Returns list of all unique leagues in database
  - Returns: Array of `{ id, name }`

### 2. Backend API Routes

#### New Routes in `server/routers/football.ts`:

- **`football.getHistoricalMatches`** - Query historical matches with filters
  - Input: Same as database function
  - Output: Array of matches

- **`football.getHistoricalMatchesWithStats`** - Query historical matches with statistics
  - Input: Same as database function
  - Output: Array of matches with statistics

- **`football.getTeamStatistics`** - Get aggregated team statistics
  - Input: `{ teamId, leagueId?, startDate?, endDate? }`
  - Output: Team statistics object

- **`football.getTeams`** - Get list of all teams
  - Input: None
  - Output: Array of teams

- **`football.getLeagues`** - Get list of all leagues
  - Input: None
  - Output: Array of leagues

### 3. Frontend Pages

#### New Page: `client/src/pages/History.tsx`

Features:
- **Filter Panel**: Filter matches by:
  - Team (dropdown with all available teams)
  - Competition/League (dropdown with all available leagues)
  - Date range (start and end date pickers)
- **Match List**: Displays filtered matches with:
  - League and match status
  - Match date and time
  - Team names and scores
  - Statistics preview (corners, fouls, yellow cards, red cards)
- **Pagination**: Navigate through results with previous/next buttons
- **Responsive Design**: Works on mobile, tablet, and desktop

#### New Page: `client/src/pages/Comparison.tsx`

Features:
- **Team Selection**: Select two teams to compare
- **Filter Options**: Filter comparison by league and date range
- **Summary Cards**: Display key statistics for each team
- **Comparison Charts**:
  - Average statistics bar chart
  - Total statistics bar chart
- **Responsive Design**: Works on all screen sizes

#### New Component: `client/src/components/Navigation.tsx`

Features:
- **Desktop Navigation**: Horizontal menu with all pages
- **Mobile Navigation**: Hamburger menu that toggles on mobile
- **Navigation Links**:
  - Home
  - Dashboard
  - History (new)
  - Comparison (new)
  - Insights
- **Responsive**: Automatically adapts to screen size

### 4. Updated Files

#### `client/src/App.tsx`
- Added import for History page
- Added import for Comparison page
- Added import for Navigation component
- Added routes for `/history` and `/comparison`
- Added Navigation component to layout

## API Usage Examples

### Get Historical Matches for a Specific Team

```typescript
const matches = await trpc.football.getHistoricalMatches.query({
  teamId: 1,
  limit: 20,
  offset: 0
});
```

### Get Matches with Statistics in a Date Range

```typescript
const matches = await trpc.football.getHistoricalMatchesWithStats.query({
  startDate: new Date('2024-01-01').toISOString(),
  endDate: new Date('2024-12-31').toISOString(),
  limit: 50
});
```

### Get Team Statistics

```typescript
const stats = await trpc.football.getTeamStatistics.query({
  teamId: 1,
  leagueId: 39
});

// Returns:
// {
//   teamId: 1,
//   matchCount: 25,
//   averageCorners: 5.2,
//   averageFouls: 12.4,
//   averageYellowCards: 1.8,
//   averageRedCards: 0.1,
//   averageShots: 14.3,
//   averagePossession: 52.5,
//   totalCorners: 130,
//   totalFouls: 310,
//   totalYellowCards: 45,
//   totalRedCards: 2,
//   totalShots: 357
// }
```

### Get All Teams

```typescript
const teams = await trpc.football.getTeams.query();

// Returns:
// [
//   { id: 1, name: 'Manchester United' },
//   { id: 2, name: 'Liverpool' },
//   ...
// ]
```

## Database Schema

The implementation uses existing tables:
- **matches** - Core match data
- **matchStatistics** - Match-level statistics

No new tables were added. All filtering is done through existing columns:
- `matches.homeTeamId` / `matches.awayTeamId` - Team filtering
- `matches.leagueId` - League filtering
- `matches.matchDate` - Date range filtering

## Performance Considerations

1. **Pagination**: Always use `limit` and `offset` to avoid loading too much data
2. **Filtering**: Combine multiple filters to reduce result set
3. **Indexing**: Ensure database has indexes on:
   - `matches.homeTeamId`
   - `matches.awayTeamId`
   - `matches.leagueId`
   - `matches.matchDate`

## Testing

Unit tests are provided in `server/routers/history.test.ts`:

```bash
npm run test
```

Tests cover:
- Filtering by team ID
- Filtering by league ID
- Filtering by date range
- Pagination with limit and offset
- Statistics aggregation
- Unique team and league retrieval

## Future Enhancements

1. **Export Functionality**: Export filtered data to CSV/PDF
2. **Advanced Analytics**: Trend analysis, win/loss patterns
3. **Caching**: Cache frequently accessed statistics
4. **Real-time Updates**: WebSocket integration for live historical updates
5. **Custom Reports**: User-defined report generation
6. **Predictive Analytics**: ML-based predictions based on historical data

## Navigation Structure

```
/                    - Home page
/dashboard           - Live matches dashboard
/history             - Historical data with filters
/comparison          - Team comparison tool
/insights            - AI-powered insights
```

## File Structure

```
server/
  ├── db.ts (updated)
  └── routers/
      ├── football.ts (updated)
      └── history.test.ts (new)

client/
  ├── src/
  │   ├── App.tsx (updated)
  │   ├── pages/
  │   │   ├── History.tsx (new)
  │   │   └── Comparison.tsx (new)
  │   └── components/
  │       └── Navigation.tsx (new)
```

## Notes

- All dates are handled in ISO 8601 format for consistency
- Filtering is case-sensitive for team and league names
- Statistics are calculated in real-time from the database
- The system supports pagination for large datasets
- All new routes are public (no authentication required)

## Troubleshooting

### No matches found
- Verify team ID exists in database
- Check date range is correct
- Ensure league ID matches available data

### Statistics showing zero
- Verify matchStatistics records exist for the matches
- Check that statistics were properly populated during data collection

### Slow queries
- Use pagination with smaller limit values
- Add database indexes on filter columns
- Consider caching frequently accessed results
