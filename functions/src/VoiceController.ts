export type SayData = {
  readonly to: string
  readonly message: string
}

export type DialData = {
  readonly to: string
  readonly actionUrl?: string
  readonly callScreenUrl?: string
}

export interface VoiceController {
  createSayInstruction(data: SayData): string
  createDialInstruction(data: DialData): string
  createNextInstruction(usedNumbers: string[]): string
}
