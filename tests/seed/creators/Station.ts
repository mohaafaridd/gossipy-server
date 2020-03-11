import { prisma } from '../../../src/generated/prisma-client'
import { IStation } from '../interfaces'

export const createStation = async (data: IStation): Promise<IStation> => {
  data.station = await prisma.createStation(data.input)
  return data
}
