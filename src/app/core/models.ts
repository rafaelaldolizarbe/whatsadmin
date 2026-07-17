export interface Contact {
  id: number;
  waId: string;
  profileName: string | null;
  lastSeenAt: string;
}

export type MessageDirection = 0 | 1; // 0 = Inbound, 1 = Outbound (mesmo enum do backend)

export interface Message {
  id: number;
  direction: MessageDirection;
  type: string;
  body: string | null;
  status: string | null;
  timestamp: string;
}
