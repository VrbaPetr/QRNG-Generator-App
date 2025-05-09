### DashboardInput

A reusable form input component for dashboards, supporting both text inputs and select dropdowns. It displays a label, handles validation errors, and supports flexible value management through props.

#### Props

| Name       | Type                                                                 | Required | Description                                                                 |
|------------|----------------------------------------------------------------------|----------|-----------------------------------------------------------------------------|
| `label`    | `string`                                                             | ✅ Yes   | Text label displayed above the input or select field.                      |
| `type`     | `"text"` \| `"select"`                                               | No       | Determines whether the input is a text field or a dropdown. Defaults to `"text"`. |
| `options`  | `{ value: string; label: string; }[]`                                | No       | Array of options for the select field. Required when `type` is `"select"`. |
| `error`    | `string`                                                             | No       | Error message displayed below the input when validation fails.             |
| `value`    | `string`                                                             | No       | The current value of the input or selected option.                         |
| `onChange` | `(e: React.ChangeEvent<HTMLInputElement \| HTMLSelectElement>) => void` | No       | Callback fired when the input value changes.                              |
| `onBlur`   | `() => void`                                                         | No       | Callback fired when the input loses focus.                                |
| `name`     | `string`                                                             | No       | Input name attribute, useful for form libraries or native form submission. |

#### Example

```tsx
<DashboardInput
  label="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  error={usernameError}
/>

<DashboardInput
  label="Select role"
  type="select"
  options={[
    { value: "admin", label: "Administrator" },
    { value: "user", label: "User" },
  ]}
  value={role}
  onChange={(e) => setRole(e.target.value)}
  error={roleError}
/>
