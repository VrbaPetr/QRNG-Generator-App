### Tabs

A tabbed interface component that toggles between a question generator form and a question history view. It handles user session initialization and provides a visual way to navigate between features.

#### Props

| Name       | Type           | Required | Description                                                       |
|------------|----------------|----------|-------------------------------------------------------------------|
| `user`     | `User`         | ✅ Yes   | The currently authenticated user.                                 |
| `history`  | `RecordItem[]` | ✅ Yes   | List of previously generated records.                             |
| `programs` | `Program[]`    | ✅ Yes   | Available academic programs to populate the generator form.       |

#### Features

- **Tabbed UI**:
    - Uses `TabSwitchComponent` to toggle between "generator" and "history"
    - State managed with `activeTab`

- **Session Initialization**:
    - On first render, calls `setUser(user)` to persist session
    - Redirects to `/dashboard` after initialization

- **Child Components**:
    - `GenerateQuestionComponent`: Shown when `activeTab === "generator"`
    - `HistoryComponent`: Shown when `activeTab === "history"`

- **Sorting**:
    - History entries are sorted by `id` before rendering

#### Example

```tsx
<Tabs user={currentUser} history={generatedRecords} programs={programList} />
