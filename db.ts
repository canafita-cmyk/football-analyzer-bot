import { eq, desc, or, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, matches, matchStatistics } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function upsertMatch(match: {
  fixtureId: number;
  homeTeamId: number;
  awayTeamId: number;
  homeTeamName: string;
  awayTeamName: string;
  leagueId: number;
  leagueName: string;
  season: number;
  matchDate: Date;
  status: string;
  homeScore?: number | null;
  awayScore?: number | null;
}) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot upsert match: database not available');
    return;
  }

  try {
    await db.insert(matches).values(match).onDuplicateKeyUpdate({
      set: {
        status: match.status,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('[Database] Failed to upsert match:', error);
    throw error;
  }
}

export async function upsertMatchStatistics(stats: {
  matchId: number;
  homeCornerKicks: number;
  awayCornerKicks: number;
  homeFouls: number;
  awayFouls: number;
  homeYellowCards: number;
  awayYellowCards: number;
  homeRedCards: number;
  awayRedCards: number;
  homePossession?: number | null;
  awayPossession?: number | null;
  homeShots?: number | null;
  awayShots?: number | null;
  homePassesAccurate?: number | null;
  awayPassesAccurate?: number | null;
}) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot upsert statistics: database not available');
    return;
  }

  try {
    await db.insert(matchStatistics).values(stats).onDuplicateKeyUpdate({
      set: {
        homeCornerKicks: stats.homeCornerKicks,
        awayCornerKicks: stats.awayCornerKicks,
        homeFouls: stats.homeFouls,
        awayFouls: stats.awayFouls,
        homeYellowCards: stats.homeYellowCards,
        awayYellowCards: stats.awayYellowCards,
        homeRedCards: stats.homeRedCards,
        awayRedCards: stats.awayRedCards,
        homePossession: stats.homePossession,
        awayPossession: stats.awayPossession,
        homeShots: stats.homeShots,
        awayShots: stats.awayShots,
        homePassesAccurate: stats.homePassesAccurate,
        awayPassesAccurate: stats.awayPassesAccurate,
        lastUpdated: new Date(),
      },
    });
  } catch (error) {
    console.error('[Database] Failed to upsert match statistics:', error);
    throw error;
  }
}

export async function getMatchWithStatistics(matchId: number) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot get match: database not available');
    return undefined;
  }

  try {
    const match = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
    if (match.length === 0) return undefined;

    const stats = await db.select().from(matchStatistics).where(eq(matchStatistics.matchId, matchId)).limit(1);

    return {
      ...match[0],
      statistics: stats[0] || null,
    };
  } catch (error) {
    console.error('[Database] Failed to get match with statistics:', error);
    throw error;
  }
}

export async function getRecentMatches(limit: number = 10) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot get matches: database not available');
    return [];
  }

  try {
    const result = await db.select().from(matches).orderBy(desc(matches.matchDate)).limit(limit);
    return result;
  } catch (error) {
    console.error('[Database] Failed to get recent matches:', error);
    throw error;
  }
}

export async function getHistoricalMatches(filters: {
  teamId?: number;
  leagueId?: number;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot get historical matches: database not available');
    return [];
  }

  try {
    let query: any = db.select().from(matches);
    const conditions: any[] = [];

    // Filter by team (home or away)
    if (filters.teamId) {
      conditions.push(
        or(
          eq(matches.homeTeamId, filters.teamId),
          eq(matches.awayTeamId, filters.teamId)
        )
      );
    }

    // Filter by league
    if (filters.leagueId) {
      conditions.push(eq(matches.leagueId, filters.leagueId));
    }

    // Filter by date range
    if (filters.startDate || filters.endDate) {
      if (filters.startDate) {
        conditions.push(gte(matches.matchDate, filters.startDate));
      }
      if (filters.endDate) {
        conditions.push(lte(matches.matchDate, filters.endDate));
      }
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Order and paginate
    query = query.orderBy(desc(matches.matchDate));
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query;
  } catch (error) {
    console.error('[Database] Failed to get historical matches:', error);
    throw error;
  }
}

export async function getMatchesWithStatistics(filters: {
  teamId?: number;
  leagueId?: number;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot get matches with statistics: database not available');
    return [];
  }

  try {
    const matchList = await getHistoricalMatches(filters);
    
    // Fetch statistics for each match
    const matchesWithStats = await Promise.all(
      matchList.map(async (match: any) => {
        const stats = await db.select().from(matchStatistics).where(eq(matchStatistics.matchId, match.id)).limit(1);
        return {
          ...match,
          statistics: stats[0] || null,
        };
      })
    );

    return matchesWithStats;
  } catch (error) {
    console.error('[Database] Failed to get matches with statistics:', error);
    throw error;
  }
}

export async function getTeamStatistics(teamId: number, filters?: {
  leagueId?: number;
  startDate?: Date;
  endDate?: Date;
}) {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot get team statistics: database not available');
    return null;
  }

  try {
    const matchList = await getHistoricalMatches({
      teamId,
      leagueId: filters?.leagueId,
      startDate: filters?.startDate,
      endDate: filters?.endDate,
    });

    if (matchList.length === 0) return null;

    // Aggregate statistics
    let totalCorners = 0;
    let totalFouls = 0;
    let totalYellowCards = 0;
    let totalRedCards = 0;
    let totalShots = 0;
    let totalPossession = 0;
    let matchCount = 0;

    for (const match of matchList) {
      const stats = await db.select().from(matchStatistics).where(eq(matchStatistics.matchId, match.id)).limit(1);
      if (stats.length > 0) {
        const stat = stats[0];
        const isHome = match.homeTeamId === teamId;

        totalCorners += isHome ? stat.homeCornerKicks : stat.awayCornerKicks;
        totalFouls += isHome ? stat.homeFouls : stat.awayFouls;
        totalYellowCards += isHome ? stat.homeYellowCards : stat.awayYellowCards;
        totalRedCards += isHome ? stat.homeRedCards : stat.awayRedCards;
        totalShots += isHome ? (stat.homeShots || 0) : (stat.awayShots || 0);
        totalPossession += isHome ? (stat.homePossession || 0) : (stat.awayPossession || 0);
        matchCount++;
      }
    }

    return {
      teamId,
      matchCount,
      averageCorners: matchCount > 0 ? totalCorners / matchCount : 0,
      averageFouls: matchCount > 0 ? totalFouls / matchCount : 0,
      averageYellowCards: matchCount > 0 ? totalYellowCards / matchCount : 0,
      averageRedCards: matchCount > 0 ? totalRedCards / matchCount : 0,
      averageShots: matchCount > 0 ? totalShots / matchCount : 0,
      averagePossession: matchCount > 0 ? totalPossession / matchCount : 0,
      totalCorners,
      totalFouls,
      totalYellowCards,
      totalRedCards,
      totalShots,
    };
  } catch (error) {
    console.error('[Database] Failed to get team statistics:', error);
    throw error;
  }
}

export async function getUniqueTeams() {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot get teams: database not available');
    return [];
  }

  try {
    // Get unique teams from matches
    const homeTeams = await db.selectDistinct({ id: matches.homeTeamId, name: matches.homeTeamName }).from(matches);
    const awayTeams = await db.selectDistinct({ id: matches.awayTeamId, name: matches.awayTeamName }).from(matches);
    
    // Combine and deduplicate
    const teamMap = new Map();
    [...homeTeams, ...awayTeams].forEach(team => {
      if (!teamMap.has(team.id)) {
        teamMap.set(team.id, team);
      }
    });

    return Array.from(teamMap.values());
  } catch (error) {
    console.error('[Database] Failed to get unique teams:', error);
    throw error;
  }
}

export async function getUniqueLeagues() {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot get leagues: database not available');
    return [];
  }

  try {
    const leagues = await db.selectDistinct({ id: matches.leagueId, name: matches.leagueName }).from(matches);
    return leagues;
  } catch (error) {
    console.error('[Database] Failed to get unique leagues:', error);
    throw error;
  }
}
