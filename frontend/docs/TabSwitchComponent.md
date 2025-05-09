### TabSwitchComponent

A simple tab selector UI that allows users to toggle between different views (e.g., "Generátor otázek" and "Historie"). Designed to be used in combination with conditional rendering logic.

#### Props

| Name           | Type                        | Required | Description                                           |
|----------------|-----------------------------|----------|-------------------------------------------------------|
| `activeTab`    | `string`                    | ✅ Yes   | The currently selected tab key.                      |
| `setActiveTab` | `(tab: string) => void`     | ✅ Yes   | Function to change the currently active tab.         |

#### Features

- Highlights the active tab with a red underline and bold text
- Tab options:
    - `"generator"` → Generátor otázek
    - `"history"` → Historie
- Minimal styling using Tailwind, focused on clarity and responsiveness

#### Example

```tsx
<TabSwitchComponent activeTab={activeTab} setActiveTab={setActiveTab} />
```
