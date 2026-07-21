export interface Contact {
  id: number;
  waId: string;
  profileName: string | null;
  lastSeenAt: string;
  humanTakeoverEnabled: boolean;
  needsHumanAttention: boolean;
}

export interface HumanRequestedAlert {
  contactId: number;
  waId: string;
  profileName: string | null;
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

export interface Project {
  id: number;
  title: string;
  shortDescription: string;
  detailsText: string;
  displayOrder: number;
}

export interface BotSettings {
  id: number;
  greetingText: string;
  aboutMeText: string;
  contactConfirmationText: string;
}

export interface TranslationResource {
  id: number;
  locale: string;
  namespace: string;
  contentJson: string;
  createdAt: string;
  updatedAt: string;
}
