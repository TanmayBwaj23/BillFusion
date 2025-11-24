# Loading Components Documentation

This document describes the loading state components available in the BillFusion frontend application.

## Components Overview

### 1. Spinner Components

#### `Spinner`
Basic spinner component for loading states.

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `variant`: 'primary' | 'white' | 'gray' (default: 'primary')
- `className`: Additional CSS classes

**Usage:**
```jsx
import { Spinner } from '../ui/Spinner';

<Spinner size="md" variant="primary" />
```

#### `SpinnerWithText`
Spinner with accompanying text label.

**Props:**
- `text`: Loading text (default: 'Loading...')
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `variant`: 'primary' | 'white' | 'gray' (default: 'primary')
- `className`: Additional CSS classes

**Usage:**
```jsx
import { SpinnerWithText } from '../ui/Spinner';

<SpinnerWithText text="Loading data..." size="md" />
```

#### `SpinnerCentered`
Centered spinner for full-page or container loading.

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'lg')
- `variant`: 'primary' | 'white' | 'gray' (default: 'primary')
- `className`: Additional CSS classes

**Usage:**
```jsx
import { SpinnerCentered } from '../ui/Spinner';

<SpinnerCentered size="lg" />
```

### 2. Skeleton Loaders

#### `Skeleton`
Basic skeleton loader for content placeholders.

**Props:**
- `variant`: 'text' | 'circular' | 'rectangular' (default: 'rectangular')
- `className`: Additional CSS classes

**Usage:**
```jsx
import { Skeleton } from '../ui/Skeleton';

<Skeleton className="h-10 w-full" />
<Skeleton variant="circular" className="h-12 w-12" />
```

#### `SkeletonText`
Skeleton for multiple text lines.

**Props:**
- `lines`: Number of lines (default: 3)
- `className`: Additional CSS classes

**Usage:**
```jsx
import { SkeletonText } from '../ui/Skeleton';

<SkeletonText lines={5} />
```

#### `SkeletonCard`
Skeleton for card layout with header and content.

**Props:**
- `className`: Additional CSS classes

**Usage:**
```jsx
import { SkeletonCard } from '../ui/Skeleton';

<SkeletonCard />
```

#### `SkeletonTableRow`
Skeleton for table rows.

**Props:**
- `columns`: Number of columns (default: 4)
- `className`: Additional CSS classes

**Usage:**
```jsx
import { SkeletonTableRow } from '../ui/Skeleton';

<SkeletonTableRow columns={5} />
```

#### `SkeletonAvatar`
Skeleton for user avatar with optional text.

**Props:**
- `withText`: Show text skeleton (default: true)
- `className`: Additional CSS classes

**Usage:**
```jsx
import { SkeletonAvatar } from '../ui/Skeleton';

<SkeletonAvatar withText={true} />
```

#### `SkeletonInput`
Skeleton for form inputs.

**Props:**
- `label`: Show label skeleton (default: true)
- `className`: Additional CSS classes

**Usage:**
```jsx
import { SkeletonInput } from '../ui/Skeleton';

<SkeletonInput label={true} />
```

### 3. Loading Overlays

#### `LoadingOverlay`
Loading overlay that covers its container.

**Props:**
- `isLoading`: Whether to show the overlay
- `text`: Optional loading text
- `className`: Additional CSS classes
- `children`: Content to show when not loading

**Usage:**
```jsx
import { LoadingOverlay } from '../ui/LoadingOverlay';

<LoadingOverlay isLoading={isLoading} text="Saving...">
  <YourContent />
</LoadingOverlay>
```

#### `LoadingPage`
Full page loading overlay.

**Props:**
- `text`: Loading text (default: 'Loading...')

**Usage:**
```jsx
import { LoadingPage } from '../ui/LoadingOverlay';

if (isLoading) {
  return <LoadingPage text="Loading application..." />;
}
```

#### `ButtonLoading`
Inline loading state for buttons.

**Props:**
- `text`: Loading text (default: 'Loading...')
- `variant`: 'white' | 'primary' | 'gray' (default: 'white')

**Usage:**
```jsx
import { ButtonLoading } from '../ui/LoadingOverlay';

<Button disabled={isLoading}>
  {isLoading ? <ButtonLoading text="Saving..." /> : 'Save'}
</Button>
```

## Usage Examples

### Form Submission with Button Loading

```jsx
import { Button } from '../ui/Button';
import { ButtonLoading } from '../ui/LoadingOverlay';

function MyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitData();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <ButtonLoading text="Submitting..." /> : 'Submit'}
      </Button>
    </form>
  );
}
```

### Data Fetching with Skeleton Loaders

```jsx
import { SkeletonCard, SkeletonText } from '../ui/Skeleton';

function DataDisplay() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData().then(result => {
      setData(result);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return <div>{/* render data */}</div>;
}
```

### Protected Route with Loading Page

```jsx
import { LoadingPage } from '../ui/LoadingOverlay';

function ProtectedRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuth().then(() => setIsChecking(false));
  }, []);

  if (isChecking) {
    return <LoadingPage text="Verifying authentication..." />;
  }

  return children;
}
```

### Container with Loading Overlay

```jsx
import { LoadingOverlay } from '../ui/LoadingOverlay';

function DataContainer() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  return (
    <LoadingOverlay isLoading={isRefreshing} text="Refreshing data...">
      <div className="p-4">
        <button onClick={handleRefresh}>Refresh</button>
        {/* content */}
      </div>
    </LoadingOverlay>
  );
}
```

## Best Practices

1. **Use appropriate loading indicators:**
   - Use `ButtonLoading` for button actions
   - Use `Skeleton` components for data fetching
   - Use `LoadingPage` for full-page authentication checks
   - Use `LoadingOverlay` for container-level operations

2. **Provide meaningful loading text:**
   - Be specific: "Saving profile..." instead of "Loading..."
   - Keep it concise and action-oriented

3. **Disable interactive elements during loading:**
   - Always disable buttons when showing loading state
   - Prevent form submission during async operations

4. **Match skeleton structure to actual content:**
   - Use skeleton loaders that closely match the final content layout
   - This provides better visual continuity

5. **Consider accessibility:**
   - All loading components include proper ARIA labels
   - Screen readers will announce "Loading" status

## Styling

All loading components use Tailwind CSS and follow the application's design system:
- Primary color: Blue (#3B82F6)
- Gray shades for neutral states
- Smooth animations with `animate-spin` and `animate-pulse`
- Consistent spacing and sizing

## Performance

- Skeleton loaders are lightweight and render quickly
- Spinners use CSS animations (no JavaScript)
- Loading overlays use backdrop-blur for modern browsers
- All components are optimized for React rendering
