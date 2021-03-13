export interface UnprocessedEvent {
  id: number,
  createdAt: Date,
  answered: boolean,
  kind: string,
  duration: number,
  status?: "UNPROCESSED" | "PROCESSED"
}

export interface ProcessedEvent extends UnprocessedEvent{
  persons: string[]
}
