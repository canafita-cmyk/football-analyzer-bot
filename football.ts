import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import {
  getLiveFixtures,
  getFixturesByDate,
  getFixtureStatistics,
  extractCornerKicks,
  extractFouls,
  extractCards,
} from '../services/footballApi';
import { upsertMatch, upsertMatchStatistics, getRecentMatches, getMatchWithStatistics, getHistoricalMatches, getMatchesWithStatistics, getTeamStatistics, getUniqueTeams, getUniqueLeagues } from '../db';

export const footballRouter = router({
  /**
   * Get live fixtures for a specific league
   */
  getLiveMatches: publicProcedure
    .input(
      z.object({
        leagueId: z.number(),
        season: z.number(),
      })
    )
    .query(async ({ input }) => {
      try {
        const fixtures = await getLiveFixtures(input.leagueId, input.season);

        // Process and store fixtures
        for (const fixture of fixtures) {
          await upsertMatch({
            fixtureId: fixture.fixture.id,
            homeTeamId: fixture.teams.home.id,
            awayTeamId: fixture.teams.away.id,
            homeTeamName: fixture.teams.home.name,
            awayTeamName: fixture.teams.away.name,
            leagueId: fixture.league.id,
            leagueName: fixture.league.name,
            season: fixture.league.season,
            matchDate: new Date(fixture.fixture.date),
            status: fixture.fixture.status.short,
            homeScore: fixture.goals.home,
            awayScore: fixture.goals.away,
          });
        }

        return fixtures;
      } catch (error) {
        console.error('Error fetching live matches:', error);
        throw error;
      }
    }),

  /**
   * Get match statistics (corners, fouls, cards)
   */
  getMatchStats: publicProcedure
    .input(
      z.object({
        fixtureId: z.number(),
      })
    )
    .query(async ({ input }) => {
      try {
        const statistics = await getFixtureStatistics(input.fixtureId);

        if (!statistics || statistics.length === 0) {
          return null;
        }

        const corners = extractCornerKicks(statistics);
        const fouls = extractFouls(statistics);
        const cards = extractCards(statistics);

        return {
          corners,
          fouls,
          cards,
          raw: statistics,
        };
      } catch (error) {
        console.error('Error fetching match statistics:', error);
        throw error;
      }
    }),

  /**
   * Get recent matches from database
   */
  getRecentMatches: publicProcedure
    .input(
      z.object({
        limit: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      try {
        return await getRecentMatches(input.limit);
      } catch (error) {
        console.error('Error fetching recent matches:', error);
        throw error;
      }
    }),

  /**
   * Get match with statistics
   */
  getMatchWithStats: publicProcedure
    .input(
      z.object({
        matchId: z.number(),
      })
    )
    .query(async ({ input }) => {
      try {
        return await getMatchWithStatistics(input.matchId);
      } catch (error) {
        console.error('Error fetching match with statistics:', error);
        throw error;
      }
    }),

  /**
   * Get historical matches with optional filters
   */
  getHistoricalMatches: publicProcedure
    .input(
      z.object({
        teamId: z.number().optional(),
        leagueId: z.number().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const filters = {
          teamId: input.teamId,
          leagueId: input.leagueId,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          endDate: input.endDate ? new Date(input.endDate) : undefined,
          limit: input.limit,
          offset: input.offset,
        };
        return await getHistoricalMatches(filters);
      } catch (error) {
        console.error('Error fetching historical matches:', error);
        throw error;
      }
    }),

  /**
   * Get historical matches with their statistics
   */
  getHistoricalMatchesWithStats: publicProcedure
    .input(
      z.object({
        teamId: z.number().optional(),
        leagueId: z.number().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const filters = {
          teamId: input.teamId,
          leagueId: input.leagueId,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          endDate: input.endDate ? new Date(input.endDate) : undefined,
          limit: input.limit,
          offset: input.offset,
        };
        return await getMatchesWithStatistics(filters);
      } catch (error) {
        console.error('Error fetching historical matches with statistics:', error);
        throw error;
      }
    }),

  /**
   * Get aggregated statistics for a specific team
   */
  getTeamStatistics: publicProcedure
    .input(
      z.object({
        teamId: z.number(),
        leagueId: z.number().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const filters = {
          leagueId: input.leagueId,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          endDate: input.endDate ? new Date(input.endDate) : undefined,
        };
        return await getTeamStatistics(input.teamId, filters);
      } catch (error) {
        console.error('Error fetching team statistics:', error);
        throw error;
      }
    }),

  /**
   * Get list of all unique teams in database
   */
  getTeams: publicProcedure.query(async () => {
    try {
      return await getUniqueTeams();
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  }),

  /**
   * Get list of all unique leagues in database
   */
  getLeagues: publicProcedure.query(async () => {
    try {
      return await getUniqueLeagues();
    } catch (error) {
      console.error('Error fetching leagues:', error);
      throw error;
    }
  }),
});
