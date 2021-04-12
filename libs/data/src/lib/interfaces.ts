export interface RingEvent {
  eventName: string,
  ringId: string,
  id: number,
  createdAt: Date,
  date:string
  answered: boolean,
  kind: string,
  duration: number,
  status: "UNPROCESSED" | "PROCESSED",
  videoFileName: string,
  processingResult?:ProcessingResult,
  processingTriggered?:boolean
}

export interface ProcessingResult{
  videoFile: string,
  eventName: string,
  recognisedPersons: string[]
  unknownPersons: UnknownPerson[]
}

export interface UnknownPerson{
  buttonDisabled: boolean;
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

export interface FittingResult{
  persons: PersonImages[],
  fittedClassifierFile: string
}

export interface TagPersonRequest{
  eventName: string,
  unknownPerson: UnknownPerson,
  newName:string
}

export interface TagPersonResponse{
  message: string
}

export interface PersonImages{
  personName:string,
  imagePaths: string[]
}

export interface FitClassifierRequest{
  persons: PersonImages[]
}

export interface DownloadAndProcessProgress{
  processingResult?: ProcessingResult[];
  events?: RingEvent[];
  processedDay?: string;
  startTime: Date,
}

export interface IftttEvent{
  createdAt: string,
  doorbellName: string
}
