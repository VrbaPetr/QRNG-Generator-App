### HistoryComponent

A responsive component that displays the history of generated questions. It supports both table layout for larger screens and card-based layout for mobile. When no data is present, it shows an informative empty state.

#### Props

| Name      | Type            | Required | Description                                      |
|-----------|-----------------|----------|--------------------------------------------------|
| `history` | `RecordItem[]`  | ✅ Yes   | An array of previously generated question records. |

#### Features

- **Responsive layout**:
    - On desktop/tablet (sm and up): tabular view with columns for ID, student, question count, skipped questions, result, and timestamp.
    - On mobile: condensed card layout with grouped metadata.

- **Empty state**: When no records exist, an icon and message explain that the history will appear after generating questions.

- **Data formatting**: Dates are formatted using Czech locale (`cs-CZ`), showing both date and time.

#### Example

```tsx
<HistoryComponent history={generatedRecords} />
```
