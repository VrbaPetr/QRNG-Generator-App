### LoginButton

A button component that redirects the user to an external STAG login URL with a redirect back to the app’s dashboard after login.

#### Props

| Name       | Type     | Required | Description                                                                 |
|------------|----------|----------|-----------------------------------------------------------------------------|
| `fullUrl`  | `string` | ✅ Yes   | The full host/domain used to build the STAG login redirect URL.            |

#### Behavior

- On click, the user is redirected to the STAG login endpoint:

- This login flow assumes STAG handles authentication and redirects back to the given app domain.

#### Example

```tsx
<LoginButton fullUrl="*stag_url*" />
```
