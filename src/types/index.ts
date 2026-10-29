export interface Venue {
  id: string;
  n: string;
  e: string;
  sports: string;
  dist: string;
  rate: number;
  taken: string[];
  owner: string;
  note: string;
}

export interface Session {
  id: string;
  sport: string;
  emoji: string;
  venue: string;
  day: string;
  time: string;
  price: number;
  min: number;
  joined: number;
  level: string;
  dist: string;
  free: boolean;
  host: string;
  fits: boolean;
}

export interface Booking {
  venue: string;
  emoji: string;
  day: string;
  time: string;
  end: string;
  dur: number;
  total: number;
  code: string;
}
