### SecondWindowForm

A standalone full-page form that verifies a user-entered access code and displays a randomly generated question number. It handles both verification and question record insertion logic.

#### Purpose

- Used in a **secondary browser window** or isolated page.
- Validates a user-supplied code via `getCode`.
- If valid, allows generation of a random question number.
- Saves the generated question to the backend using `insertRecord`.

#### State Variables

| Variable           | Type       | Purpose                                                                 |
|--------------------|------------|-------------------------------------------------------------------------|
| `generate`         | `boolean`  | Tracks whether the user has successfully submitted a valid code.       |
| `questionNumber`   | `string`   | Stores the generated question number.                                  |
| `isLoading`        | `boolean`  | Indicates if the form is submitting.                                   |
| `error`            | `string`   | Displays form validation or server-side errors.                        |
| `isGenerating`     | `boolean`  | Indicates if the question generation process is running.               |
| `generationError`  | `string`   | Displays an error if number generation fails.                          |
| `lockBtn`          | `boolean`  | Temporarily disables the generate button for 60 seconds.               |

#### Behavior

- **Form submission**:
    - Validates input code
    - If valid and active, reveals the question generation interface
- **Question generation**:
    - Generates a random number between 1 and 100
    - Saves record to the backend via `insertRecord`
    - Displays number even if DB call fails (fallback)
    - Disables generate button for 60 seconds after use

#### UI Layout

- Step 1: Input form asking user to enter a **kód**
- Step 2: If verified, shows a generated number with a **Generovat** button

#### Example Usage

This component is meant to be rendered as a standalone route or popup:

```tsx
<SecondWindowForm />
