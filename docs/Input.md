### Input

A reusable, styled input component with label support and inline validation messaging. It uses `forwardRef` for compatibility with form libraries (e.g., `react-hook-form`).

#### Props

This component extends all native `<input>` attributes via `React.InputHTMLAttributes<HTMLInputElement>` and adds the following:

| Name       | Type     | Required | Description                                                      |
|------------|----------|----------|------------------------------------------------------------------|
| `label`    | `string` | ✅ Yes   | The label text displayed above the input field.                 |
| `error`    | `string` | No       | An error message shown below the input when validation fails.   |
| `className`| `string` | No       | Additional CSS classes to customize the input’s appearance.     |

#### Features

- Applies red border and error text when `error` is passed
- Supports full native input props (`type`, `value`, `onChange`, etc.)
- Uses `forwardRef` for seamless integration with form libraries

#### Example

```tsx
<Input
  label="Email"
  type="email"
  name="email"
  id="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
/>
```
