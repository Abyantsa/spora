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
  maps_url?: string;
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

export interface UserSchedule {
  id: string;
  user_id?: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_free_time?: boolean;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  user_name: string;
  is_host?: boolean;
  text: string;
  time: string;
}
