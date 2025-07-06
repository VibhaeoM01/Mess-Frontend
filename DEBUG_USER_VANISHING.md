# Debug Guide: User Details Vanishing Issue

## Issues Found and Fixed

### 1. Missing `updateUser` Function in AuthContext
**Problem**: The `MessIdGenerator` was trying to call `updateUser` from AuthContext, but this function didn't exist.
**Fix**: Added `updateUser` function to `AuthContext.jsx` that properly updates both localStorage and context state.

### 2. Variable Naming Conflicts
**Problem**: In `MessIdGenerator.jsx`, there were multiple variables named `user`:
- `user` from AuthContext (via `const { user } = useAuth()`)
- `user` from localStorage (via `const user = localStorage.getItem("user")`)

This caused conflicts where the localStorage variable was shadowing the context variable.

**Fix**: Renamed localStorage variables to avoid conflicts:
- Line 21: `const user = localStorage.getItem("user")` → `const storedUser = localStorage.getItem("user")`
- Line 59: `const user = localStorage.getItem("user")` → `const storedUserData = localStorage.getItem("user")`

### 3. Missing useEffect Dependencies
**Problem**: The useEffect in MessIdGenerator was missing `user` in its dependency array.
**Fix**: Added `user` to the dependency array: `[user, addToast, navigate]`

## Testing Steps

### 1. Test User Data Persistence
1. Open browser developer console (F12)
2. Log in as a mess manager
3. Go to Mess ID generation page
4. Watch console logs for:
   - `AuthContext - Verifying user:` (shows initial user load)
   - `AuthContext - Parsed user:` (shows user object)
   - `Navbar - User:` (shows user in navbar)
   - `Navbar - User messId:` (shows messId status)

### 2. Test Mess ID Generation
1. Generate a Mess ID
2. Check console for:
   - `MessIdGenerator - Starting subscription activation`
   - `MessIdGenerator - Current user:` (should show user object)
   - `MessIdGenerator - Generated mess ID:` (should show generated ID)
   - `MessIdGenerator - Updated user object:` (should show user with messId)

### 3. Test Context Updates
1. After clicking "Subscribe" button
2. Check console for:
   - `MessIdGenerator - Calling updateUser`
   - `AuthContext - Updating user data:` (should show updated user)
   - `AuthContext - User updated successfully`

### 4. Test Navbar Display
1. After subscription activation
2. Check navbar for Mess ID display
3. Refresh page and check if Mess ID persists

## Debugging Commands

Run these in browser console to check data:

```javascript
// Check localStorage
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user') || '{}'));

// Check if AuthContext is working
// (This will be shown in console automatically due to our debug logs)
```

## Common Issues and Solutions

### If Mess ID Still Disappears:
1. **Check for component re-mounts**: Look for multiple "AuthContext - Verifying user" logs
2. **Check for logout calls**: Look for any unexpected logout() calls
3. **Check for localStorage clearing**: Look for any code that might clear localStorage

### If Console Shows Errors:
1. **"updateUser function not available"**: AuthContext might not be properly connected
2. **"Cannot read property 'messId'"**: User object might be null/undefined
3. **JSON parse errors**: localStorage might contain invalid JSON

### If Changes Don't Persist After Page Refresh:
1. Check if localStorage is being properly updated
2. Check if AuthContext is reading from localStorage correctly
3. Check if there are any browser extensions clearing localStorage

## Files Modified
- `client/src/context/AuthContext.jsx` - Added updateUser function and debug logs
- `client/src/components/MessIdGenerator/MessIdGenerator.jsx` - Fixed variable naming conflicts and added debug logs
- `client/src/components/Navbar/Navbar.jsx` - Added more detailed debug logs

## Next Steps
1. Test the flow with browser console open
2. Look for any error messages or unexpected behavior
3. If issues persist, check the specific console logs to identify where the user data is being lost
