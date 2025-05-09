import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Uživatelské jméno je povinné"),
  password: z.string().min(1, "Heslo je povinné"),
  rememberMe: z.boolean().optional().default(false),
  clearPermissions: z.boolean().optional().default(false),
});

export default loginSchema;
