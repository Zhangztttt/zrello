import type { CardDocument } from "~/server/models/Card.model";

export const useCard = () => {

  async function update(cardId:string,listId:string,data:Partial<CardDocument>){
    try {
      await useFetch(`/api/lists/${listId}/cards/${cardId}`, {
        method: "PUT",
        body:data,
        watch:false
      });
    } catch (error:any) {
      useToast().add({
        title:"错误",
        description: error.message || "未知错误"
      })
    }
  }

  async function destroy(listId:string,cardId:string){
    try {
      await useFetch(`/api/lists/${listId}/cards/${cardId}`, {
        method: "DELETE"
      });

      useToast().add({
        title:"已删除"
      })
    } catch (error:any) {
      useToast().add({
        title:"错误",
        description: error.message || "未知错误"
      })
    }
  }


  return {
    update,
    destroy
  }
}
