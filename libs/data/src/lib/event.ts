export interface UnprocessedEvent {
  eventName: string,
  id: number,
  createdAt: Date,
  answered: boolean,
  kind: string,
  duration: number,
  status: "UNPROCESSED" | "PROCESSED",
  videoFileName: string,

}

export interface ProcessedEvent extends UnprocessedEvent{
  persons: string[]
}

export interface DownloadFromRingResponse{
  eventCount:number
}

export interface ProcessEventResponse{
  videoFile:string
  recognisedPersons: string [],
  unknownPersons: string []
}
