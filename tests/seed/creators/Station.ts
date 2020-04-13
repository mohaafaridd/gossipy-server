import { PrismaClient } from '@prisma/client'
import { IStation } from '../interfaces'
import { alphanumeric } from '../../../src/utils/sanitizer'

export const createStation = async (
  data: IStation,
  prisma: PrismaClient
): Promise<IStation> => {
  data.station = await prisma.station.create({
    data: {
      ...data.input,
      name: alphanumeric(data.input.name),
      identifier: alphanumeric(data.input.name).toLowerCase(),
    },
  })
  return data
}
