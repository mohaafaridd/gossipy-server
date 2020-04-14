import { Station } from '@prisma/client'

interface IStationInput {
  name: string
  identifier?: string
  description: string
  public: boolean
}

export interface IStation {
  input: IStationInput
  station?: Station
}
