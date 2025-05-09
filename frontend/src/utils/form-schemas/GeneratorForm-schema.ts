import { z } from "zod";

const formSchema = z.object({
  examYear: z.string().min(1, "Prosím vyberte rok zkoušky"),
  examiner: z.string().min(1, "Jméno zkoušejícího je povinné"),
  program: z.string().min(1, "Prosím vyberte obor/třídu/skupinu"),
  student: z.string().min(1, "Jméno studenta je povinné"),
  pool_excluded: z.string(),
  pool_range: z.string().min(1, "Prosím vyberte počet otázek"),
  exam: z.string().min(1, "Prosím vyberte zkoušku"),
  result: z.string().min(1, "Prosím vyberte výsledek"),
});

export default formSchema;
