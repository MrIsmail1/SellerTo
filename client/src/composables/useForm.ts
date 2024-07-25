import { reactive, ref, toRefs } from "vue";
import { z, ZodSchema } from "zod";

type UseFormOptions<T> = {
  schema: ZodSchema<T>;
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
};

export function useForm<T>({
  schema,
  initialValues,
  onSubmit,
}: UseFormOptions<T>) {
  const values = reactive({ ...initialValues });
  const errors = reactive<Record<keyof T, string | null>>(
    {} as Record<keyof T, string | null>
  );
  const isSubmitting = ref(false);
  const httpError = ref<string | null>(null);

  const validate = () => {
    const result = schema.safeParse(values);

    if (result.success) {
      Object.keys(errors).forEach((key) => {
        errors[key as keyof T] = null;
      });
      return true;
    } else {
      Object.keys(errors).forEach((key) => {
        if (!result.error.errors.some((error) => error.path[0] === key)) {
          errors[key as keyof T] = null;
        }
      });
      result.error.errors.forEach((error) => {
        const path = error.path[0] as keyof T;
        errors[path] = error.message;
      });
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    isSubmitting.value = true;
    httpError.value = null;

    try {
      await onSubmit(values);
    } catch (error: any) {
      httpError.value =
        error.message ||
        "Une erreur est survenue lors de la soumission du formulaire";
    } finally {
      isSubmitting.value = false;
    }
  };

  const cancelRequest = () => {
    isSubmitting.value = false;
    httpError.value = "Requête annulée";
  };
  const setValues = (newValues: Partial<T>) => {
    Object.assign(values, newValues);
  };
  return {
    values: toRefs(values),
    errors,
    isSubmitting,
    httpError,
    handleSubmit,
    cancelRequest,
    setValues,
  };
}
