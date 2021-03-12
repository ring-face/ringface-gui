export interface UnprocessedEvent {
  id: number,
  createdAt: Date,
  answered: boolean,
  kind: string,
  duration: number
}

export interface ProcessedEvent extends UnprocessedEvent{
  persons: string[]
}
