import { List } from "~/server/models/List.model";
import { Validator } from "#nuxt-server-utils";
import ListSchema from '~/schemas/List.schema';

export default defineEventHandler(async (event) => {
  const listId = getRouterParam(event, "listId")
  const user = event.context.user

  const body = await readBody(event)

  Validator.validateSchema(ListSchema.partial(), body)

  const updatedLists = await List.findOneAndUpdate(
    {
      _id: listId,
      userId: user.id
    },
    {
      $set: body
    },
    {
      new: true
    }
  )
  if(!updatedLists){
    throw createError({
      statusCode: 404,
      message: "清单未找到"
    })
  }

  return updatedLists
})
