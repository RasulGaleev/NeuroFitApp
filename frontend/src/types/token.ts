export interface TokenType {
  username: string;
  password: string;
}

export interface RefreshTokenType {
  refresh_token: string;
  access?: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}