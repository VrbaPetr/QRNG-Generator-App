### GeneratorForm

A complex form component for generating exam questions. It includes form state management using `react-hook-form` with Zod schema validation, localStorage persistence, partial and full resets, and visual feedback upon submission. Intended for internal dashboard use.

#### Props

| Name              | Type         | Required | Description                                                                 |
|-------------------|--------------|----------|-----------------------------------------------------------------------------|
| `user`            | `User`       | ✅ Yes   | The current user interacting with the form. *(Note: not used in the JSX currently)* |
| `programs`        | `Program[]`  | ✅ Yes   | Array of available study programs, used to populate the program select field. |
| `shouldClearForm` | `boolean`    | No       | If `true`, clears the form after a successful submission. Defaults to `true`. |

#### Features

- **Controlled form** with validation using `zodResolver`.
- **Persistent form state** saved in `localStorage`.
- **Dynamic select options** for the "Program" field.
- **Partial reset** (filters only) and **full reset** available.
- **Visual feedback** when a question is successfully generated.

#### Fields (inferred from Zod schema)

Although the schema isn't included, the expected fields in `FormValues` are:

- `examYear` (e.g., `"2025/26"`)
- `program`
- `student`
- `pool_excluded`
- `pool_range`
- `result` (default: `"5"`)
- `examiner` (default: `"EX0ZK"`)
- `exam` (default: `"SZZ"`)

#### Example

```tsx
<GeneratorForm user={currentUser} programs={programList} />
```
#### LocalStorage Behavior

- Stores form data under key: `"generatorFormValues"`
- On mount, loads values if present
- After successful submission (if `shouldClearForm` is `true`), clears stored values

#### UI Actions

- **Reset filtrů**: Clears filter fields only (`pool_excluded`, `pool_range`)
- **Reset všeho**: Clears all fields to defaults
- **Generovat**: Submits the form
- **(Optional)** Generovat v jiném okně: Currently commented out


