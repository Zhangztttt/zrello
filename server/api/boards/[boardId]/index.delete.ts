import { Board } from "~/server/models/Board.model"
import { List } from "~/server/models/List.model"
import { UserDocument } from "~/server/models/User.model"

export default defineEventHandler(async (event) => {
  const boardId = getRouterParam(event,"boardId")

  const user = event.context.user as UserDocument

  const board = await Board.findOneAndDelete({
    _id: boardId,
    owner: user._id,
  })

  if(!board){
    throw createError({
      status: 404,
      message: "未找到任务板"
    })
  }



  await List.deleteMany({
    board:board._id,
    owner:user._id
  })

  event.node.res.statusCode = 204

  return true
})
