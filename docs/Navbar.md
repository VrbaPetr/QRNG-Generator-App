### Navbar

A responsive navigation bar component displaying the application logo, the current user's email, and a logout button. Intended for authenticated pages.

#### Props

| Name   | Type   | Required | Description                         |
|--------|--------|----------|-------------------------------------|
| `user` | `User` | ✅ Yes   | The currently authenticated user.   |

#### Features

- **Logo Display**: Uses a static logo image (`/logos/logo-signin.jpg`)
- **User Info**: Shows a user icon and the logged-in user's email
- **Logout Functionality**: On click, calls `deleteUser()` (presumably clears session/auth state), then redirects to `/sign-in`
- **Responsive Design**: Adjusts layout between mobile and desktop using Tailwind (`flex-col` on small screens, `flex-row` on larger)

#### Example

```tsx
<Navbar user={{ email: "student@example.com" }} />
```
