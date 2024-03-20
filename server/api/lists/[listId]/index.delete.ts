import { Board } from "~/server/models/Board.model"
import { Card } from "~/server/models/Card.model"
import { List } from "~/server/models/List.model"
import { UserDocument } from "~/server/models/User.model"

export default defineEventHandler(async (event) => {
  const listId = getRouterParam(event, "listId")
  const user = event.context.user as UserDocument

  const list = await List.findOneAndDelete({
    _id: listId,
    owner: user._id
  })

  if(!list){
    throw createError({
      status: 404,
      message: "未找到清单"
    })
  }

  await Board.findOneAndUpdate({
    _id:list.board,
    owner:user._id
  },{
    $pull:{
      lists:list._id
    }
  })

  await Card.deleteMany({
    list:list._id,
    owner:user._id
  })

  event.node.res.statusCode = 204

  return true
})
