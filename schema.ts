
/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Football matches table
export const matches = mysqlTable("matches", {
  id: int("id").autoincrement().primaryKey(),
  fixtureId: int("fixtureId").notNull().unique(), // API-Football fixture ID
  homeTeamId: int("homeTeamId").notNull(),
  awayTeamId: int("awayTeamId").notNull(),
  homeTeamName: varchar("homeTeamName", { length: 255 }).notNull(),
  awayTeamName: varchar("awayTeamName", { length: 255 }).notNull(),
  leagueId: int("leagueId").notNull(),
  leagueName: varchar("leagueName", { length: 255 }).notNull(),
  season: int("season").notNull(),
  matchDate: timestamp("matchDate").notNull(),
  status: varchar("status", { length: 50 }).notNull(), // 'scheduled', 'live', 'finished', 'postponed'
  homeScore: int("homeScore"),
  awayScore: int("awayScore"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;

// Match statistics table (corners and fouls)
export const matchStatistics = mysqlTable("matchStatistics", {
  id: int("id").autoincrement().primaryKey(),
  matchId: int("matchId").notNull(),
  homeCornerKicks: int("homeCornerKicks").default(0).notNull(),
  awayCornerKicks: int("awayCornerKicks").default(0).notNull(),
  homeFouls: int("homeFouls").default(0).notNull(),
  awayFouls: int("awayFouls").default(0).notNull(),
  homeYellowCards: int("homeYellowCards").default(0).notNull(),
  awayYellowCards: int("awayYellowCards").default(0).notNull(),
  homeRedCards: int("homeRedCards").default(0).notNull(),
  awayRedCards: int("awayRedCards").default(0).notNull(),
  homePossession: int("homePossession"), // percentage
  awayPossession: int("awayPossession"), // percentage
  homeShots: int("homeShots"),
  awayShots: int("awayShots"),
  homePassesAccurate: int("homePassesAccurate"),
  awayPassesAccurate: int("awayPassesAccurate"),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
});

export type MatchStatistics = typeof matchStatistics.$inferSelect;
export type InsertMatchStatistics = typeof matchStatistics.$inferInsert;

// AI predictions table
export const predictions = mysqlTable("predictions", {
  id: int("id").autoincrement().primaryKey(),
  matchId: int("matchId").notNull(),
  predictedCornerKicks: int("predictedCornerKicks"),
  predictedFouls: int("predictedFouls"),
  cornerKicksConfidence: int("cornerKicksConfidence"), // 0-100 percentage
  foulsConfidence: int("foulsConfidence"), // 0-100 percentage
  analysisText: text("analysisText"), // LLM-generated insights
  historicalPatterns: text("historicalPatterns"), // JSON with pattern analysis
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = typeof predictions.$inferInsert;

// Teams table for reference
export const teams = mysqlTable("teams", {
  id: int("id").autoincrement().primaryKey(),
  apiTeamId: int("apiTeamId").notNull().unique(), // API-Football team ID
  name: varchar("name", { length: 255 }).notNull(),
  country: varchar("country", { length: 255 }),
  founded: int("founded"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
