import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  getHistoricalMatches,
  getMatchesWithStatistics,
  getTeamStatistics,
  getUniqueTeams,
  getUniqueLeagues,
} from '../db';

describe('Historical Data Functions', () => {
  describe('getHistoricalMatches', () => {
    it('should return matches without filters', async () => {
      const matches = await getHistoricalMatches({});
      expect(Array.isArray(matches)).toBe(true);
    });

    it('should filter matches by team ID', async () => {
      const matches = await getHistoricalMatches({ teamId: 1, limit: 10 });
      expect(Array.isArray(matches)).toBe(true);
      // All matches should have the team as home or away
      matches.forEach((match: any) => {
        expect(
          match.homeTeamId === 1 || match.awayTeamId === 1
        ).toBe(true);
      });
    });

    it('should filter matches by league ID', async () => {
      const matches = await getHistoricalMatches({ leagueId: 39, limit: 10 });
      expect(Array.isArray(matches)).toBe(true);
      matches.forEach((match: any) => {
        expect(match.leagueId).toBe(39);
      });
    });

    it('should respect limit parameter', async () => {
      const limit = 5;
      const matches = await getHistoricalMatches({ limit });
      expect(matches.length).toBeLessThanOrEqual(limit);
    });

    it('should apply offset for pagination', async () => {
      const page1 = await getHistoricalMatches({ limit: 5, offset: 0 });
      const page2 = await getHistoricalMatches({ limit: 5, offset: 5 });
      
      // Pages should be different
      if (page1.length > 0 && page2.length > 0) {
        expect(page1[0].id).not.toBe(page2[0].id);
      }
    });
  });

  describe('getMatchesWithStatistics', () => {
    it('should return matches with their statistics', async () => {
      const matches = await getMatchesWithStatistics({ limit: 5 });
      expect(Array.isArray(matches)).toBe(true);
      
      matches.forEach((match: any) => {
        expect(match).toHaveProperty('id');
        expect(match).toHaveProperty('homeTeamName');
        expect(match).toHaveProperty('awayTeamName');
        // Statistics may be null if not available
        if (match.statistics) {
          expect(match.statistics).toHaveProperty('homeCornerKicks');
          expect(match.statistics).toHaveProperty('homeFouls');
        }
      });
    });

    it('should filter by team and include statistics', async () => {
      const matches = await getMatchesWithStatistics({ teamId: 1, limit: 5 });
      expect(Array.isArray(matches)).toBe(true);
      
      matches.forEach((match: any) => {
        expect(
          match.homeTeamId === 1 || match.awayTeamId === 1
        ).toBe(true);
      });
    });
  });

  describe('getTeamStatistics', () => {
    it('should return aggregated team statistics', async () => {
      const stats = await getTeamStatistics(1);
      
      if (stats) {
        expect(stats).toHaveProperty('teamId', 1);
        expect(stats).toHaveProperty('matchCount');
        expect(stats).toHaveProperty('averageCorners');
        expect(stats).toHaveProperty('averageFouls');
        expect(stats).toHaveProperty('totalCorners');
        expect(stats).toHaveProperty('totalFouls');
        
        // Averages should be calculated correctly
        expect(stats.averageCorners).toBeLessThanOrEqual(stats.totalCorners);
        expect(stats.averageFouls).toBeLessThanOrEqual(stats.totalFouls);
      }
    });

    it('should return null for non-existent team', async () => {
      const stats = await getTeamStatistics(999999);
      expect(stats).toBeNull();
    });

    it('should filter statistics by league', async () => {
      const stats = await getTeamStatistics(1, { leagueId: 39 });
      // Should return stats or null, but not throw
      expect(stats === null || typeof stats === 'object').toBe(true);
    });

    it('should filter statistics by date range', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      
      const stats = await getTeamStatistics(1, { startDate, endDate });
      // Should return stats or null, but not throw
      expect(stats === null || typeof stats === 'object').toBe(true);
    });
  });

  describe('getUniqueTeams', () => {
    it('should return list of unique teams', async () => {
      const teams = await getUniqueTeams();
      expect(Array.isArray(teams)).toBe(true);
      
      teams.forEach((team: any) => {
        expect(team).toHaveProperty('id');
        expect(team).toHaveProperty('name');
      });
    });

    it('should not have duplicate teams', async () => {
      const teams = await getUniqueTeams();
      const ids = teams.map((t: any) => t.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe('getUniqueLeagues', () => {
    it('should return list of unique leagues', async () => {
      const leagues = await getUniqueLeagues();
      expect(Array.isArray(leagues)).toBe(true);
      
      leagues.forEach((league: any) => {
        expect(league).toHaveProperty('id');
        expect(league).toHaveProperty('name');
      });
    });

    it('should not have duplicate leagues', async () => {
      const leagues = await getUniqueLeagues();
      const ids = leagues.map((l: any) => l.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });
});
