import { prisma } from '../../../src/generated/prisma-client'
import { IStation } from '../interfaces'
import { alphanumeric } from '../../../src/utils/sanitizer'

export const createStation = async (data: IStation): Promise<IStation> => {
  data.station = await prisma.createStation({
    ...data.input,
    name: alphanumeric(data.input.name),
    identifier: alphanumeric(data.input.name).toLowerCase(),
  })
  return data
}
