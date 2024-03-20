import { Validator } from '#nuxt-server-utils';
import CardSchema from '~/schemas/Card.schema';
import { Card } from '~/server/models/Card.model';
import { UserDocument } from "~/server/models/User.model"

export default defineEventHandler(async (event) => {
  const cardId = getRouterParam(event,"cardId")
  const listId = getRouterParam(event, "listId")
  const user = event.context.user as UserDocument

  const body = await readBody(event)

  Validator.validateSchema(CardSchema.partial(), body)

  const card = await Card.findOneAndUpdate({
    _id: cardId,
    owner: user._id
  },{
    ...body, 
  })  
  
  if(!card){
    throw createError({
      status: 404,
      message: "未找到卡片"
    })
  }

  return card
})
