export interface CoachGenerateType {
  messages: Array<MessageType>;
}

export interface MessageType {
  role: string;
  content: string;
  formattedContent?: string;
}