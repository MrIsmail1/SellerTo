import { z } from "zod";

const NewsletterSchema = z.object({
    subject: z.string().min(1, "Le sujet est obligatoire."),
    message: z.string().min(1, "Le message est obligatoire."),
});

export type Newsletter = z.infer<typeof NewsletterSchema>;
export default NewsletterSchema;
