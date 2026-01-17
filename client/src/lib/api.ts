// API Service - Conecta com o backend
// Em desenvolvimento: http://localhost:3000/api
// Em produção: https://seu-dominio.vercel.app/api

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
  league: string;
  time: string;
  corners?: number;
  fouls?: number;
  yellowCards?: number;
  redCards?: number;
}

export interface MatchStats {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  corners: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
  possession: number;
  shots: number;
  shotsOnTarget: number;
}

export interface Prediction {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  confidence: number;
  analysis: string;
}

class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Matches
  async getLiveMatches(): Promise<Match[]> {
    return this.request<Match[]>('/matches?status=live');
  }

  async getScheduledMatches(): Promise<Match[]> {
    return this.request<Match[]>('/matches?status=scheduled');
  }

  async getFinishedMatches(limit: number = 10): Promise<Match[]> {
    return this.request<Match[]>(`/matches?status=finished&limit=${limit}`);
  }

  async getMatchesByLeague(league: string): Promise<Match[]> {
    return this.request<Match[]>(`/matches?league=${league}`);
  }

  async getMatchesByTeam(team: string): Promise<Match[]> {
    return this.request<Match[]>(`/matches?team=${team}`);
  }

  // Statistics
  async getMatchStats(matchId: number): Promise<MatchStats> {
    return this.request<MatchStats>(`/stats/${matchId}`);
  }

  async getTeamStats(team: string): Promise<any> {
    return this.request<any>(`/stats/team/${team}`);
  }

  // Predictions
  async getPredictions(): Promise<Prediction[]> {
    return this.request<Prediction[]>('/predictions');
  }

  async getPredictionForMatch(matchId: number): Promise<Prediction> {
    return this.request<Prediction>(`/predictions/${matchId}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }
}

export const apiClient = new APIClient(API_BASE_URL);
