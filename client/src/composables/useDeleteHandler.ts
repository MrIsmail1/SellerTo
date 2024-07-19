import { ref } from "vue";
import { useRouter } from "vue-router";

export function useDeleteHandler() {
  const showDialog = ref(false);
  const dialogMessage = ref("");
  const router = useRouter();

  const handleDelete = async (deleteFunction) => {
    try {
      const response = await deleteFunction();
      if (response.status === 403) {
        dialogMessage.value =
          "Vous n'êtes pas autorisé à effectuer cette action.";
        showDialog.value = true;
      } else {
        router.push({ name: "AdminUsers" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeDialog = () => {
    showDialog.value = false;
  };

  return {
    showDialog,
    dialogMessage,
    handleDelete,
    closeDialog,
  };
}
