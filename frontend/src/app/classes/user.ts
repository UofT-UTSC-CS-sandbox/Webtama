export interface User {
  id: number;
  username: string;
  email: string;
  guest: number;
  mmr: number;
  premium: boolean;
  activeRoom: number;
  authId: string;
}
