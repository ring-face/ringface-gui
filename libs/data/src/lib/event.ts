export interface UnprocessedEvent {
  eventName: string,
  id: number,
  createdAt: Date,
  answered: boolean,
  kind: string,
  duration: number,
  status: "UNPROCESSED" | "PROCESSED",
  videoFileName: string,
  processingResult?:ProcessingResult
}

export interface ProcessingResult{
  videoFile: string,
  recognisedPersons: string[]
  unknownPersons: UnknownPerson[]
}

export interface UnknownPerson{
  name:string,
  images: number,
  imagePaths: string[]
}

export interface DownloadFromRingResponse{
  eventCount:number
}

export interface ProcessEventResponse{
  videoFile:string
  recognisedPersons: string [],
  unknownPersons: string []
}
