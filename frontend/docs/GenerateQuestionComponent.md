### GenerateQuestionComponent

A layout component for generating and displaying questions assigned to students. It renders a `GeneratorForm` on one side and the most recently generated question on the other, including a refresh button to reload the data via Next.js router.

#### Props

| Name       | Type           | Required | Description                                                |
|------------|----------------|----------|------------------------------------------------------------|
| `user`     | `User`         | ✅ Yes   | The current user interacting with the generator.           |
| `programs` | `Program[]`    | ✅ Yes   | Array of available programs to display in the form.        |
| `records`  | `RecordItem[]` | No       | List of previously generated records. The last one is shown. Defaults to `[]`. |

#### Behavior

- On mount or when `records` change, it displays the most recent record result and student name.
- The refresh button triggers `router.refresh()` from Next.js, forcing a data re-fetch.

#### Example

```tsx
<GenerateQuestionComponent
  user={currentUser}
  programs={programList}
  records={generatedRecords}
/>
