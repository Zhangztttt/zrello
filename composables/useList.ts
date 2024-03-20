import type { ListDocument } from "~/server/models/List.model";

export const useList = (boardId: string) => {
  
  async function handleSort(e: any , lists: ListDocument[]) {
    await useFetch(`/api/boards/${boardId}`, {
      method: "PUT",
      body: {
        lists: lists.flatMap((item) => item._id),
      },
      watch: false,
    });
  }

  async function destroy(listId:string){
    try {
      await useFetch(`/api/lists/${listId}`, {
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

  async function update(listId:string,data:Partial<ListDocument>){
    try {
      await useFetch(`/api/lists/${listId}`, {
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

  return {
    handleSort,
    destroy,
    update
  };
}
