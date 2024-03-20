export const useBoard = () => {
  
  async function destroy(boardId:string){
    try {
      await useFetch(`/api/boards/${boardId}`, {
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
    destroy
  };
}
