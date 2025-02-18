import bcrypt from 'bcryptjs'

export async function generateHash(data: string){

  const salt = await bcrypt.genSalt(10)

  const hashData = await bcrypt.hash(data, salt)

  return hashData
}