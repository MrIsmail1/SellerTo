import { ref } from "vue";
import { useRouter } from "vue-router";
import { z, ZodSchema } from "zod";

type FieldType = "string" | "number" | "boolean" | "file";

interface FormField {
  value: string | number | boolean | File[];
  type: FieldType;
  placeholder: string;
}

interface UseFormHandlerOptions<T> {
  initialValues: Record<keyof T, FormField>;
  schema: ZodSchema<T>;
  redirectRoute?: string;
  onSubmit: (data: T) => Promise<void>;
}

export function useFormHandler<T>({
  initialValues,
  schema,
  redirectRoute,
  onSubmit,
}: UseFormHandlerOptions<T>) {
  const formValues = ref(initialValues);
  const errors = ref<Record<string, string>>({});
  const router = useRouter();

  const handleFileChange = (key: keyof T, event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      formValues.value[key].value = Array.from(target.files);
    }
  };

  const handleSubmit = async () => {
    try {
      const data = Object.fromEntries(
        Object.entries(formValues.value).map(([key, field]) => [
          key,
          field.value,
        ])
      ) as T;

      schema.parse(data);

      await onSubmit(data);

      if (redirectRoute) {
        router.push(redirectRoute);
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        errors.value = {};
        error.errors.forEach((err: any) => {
          errors.value[err.path[0] as string] = err.message;
        });
      }
    }
  };

  return {
    formValues,
    errors,
    handleFileChange,
    handleSubmit,
  };
}
