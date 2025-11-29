# Skeleton Loaders for Buyer Components

This directory contains skeleton loader components that provide a better user experience during loading states by showing placeholder content that matches the structure of the actual content.

## Available Skeleton Components

### 1. `BuyersTableSkeleton`
A table skeleton that matches the structure of the `BuyersTable` component.

**Features:**
- Mirrors the exact table structure with 9 columns
- Animated loading placeholders using CSS animations
- Consistent with shadcn/ui table components
- 8 skeleton rows for realistic loading experience

**Usage:**
```tsx
import { BuyersTableSkeleton } from "@/components/buyers";

// Use during loading state
if (isLoading) {
  return <BuyersTableSkeleton />;
}
```

### 2. `BuyersPageSkeleton`
A complete page skeleton that includes header, table, and pagination placeholders.

**Features:**
- Full page layout with header, table, and pagination
- Consistent loading animations
- Matches the actual page structure

**Usage:**
```tsx
import { BuyersPageSkeleton } from "@/components/buyers";

// Use for complete page loading state
if (isLoading) {
  return <BuyersPageSkeleton />;
}
```

### 3. Updated `BuyerLoadingState`
The loading state component now uses the page skeleton for a better visual experience.

**Features:**
- Uses `BuyersPageSkeleton` internally
- Maintains the same API as before
- Enhanced visual feedback

**Usage:**
```tsx
import { BuyerLoadingState } from "@/components/buyers";

if (isLoading) {
  return <BuyerLoadingState />;
}
```

## Implementation Examples

### Basic Usage in a Component

```tsx
import React, { useState, useEffect } from 'react';
import { BuyersTable, BuyersTableSkeleton } from "@/components/buyers";
import type { Buyer } from "@/types/buyer";

const BuyerListComponent: React.FC = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBuyers = async () => {
      setIsLoading(true);
      
      try {
        // Your API call here
        const response = await fetch('/api/buyers');
        const data = await response.json();
        setBuyers(data);
      } catch (error) {
        console.error('Error fetching buyers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  if (isLoading) {
    return <BuyersTableSkeleton />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        {/* Your table content */}
      </Table>
    </div>
  );
};
```

### Complete Page Loading

```tsx
import React, { useState, useEffect } from 'react';
import { BuyersListLayout, BuyersPageSkeleton } from "@/components/buyers";
import type { Buyer } from "@/types/buyer";

const BuyerListPage: React.FC = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  // Fetch buyers data...
  useEffect(() => {
    // Loading logic here
  }, []);

  if (isLoading) {
    return <BuyersPageSkeleton />;
  }

  return (
    <BuyersListLayout
      buyers={buyers}
      activeActionMenu={activeActionMenu}
      currentPage={1}
      hasNext={false}
      isLoading={false}
      onToggleActionMenu={(id) => setActiveActionMenu(
        activeActionMenu === id ? null : id
      )}
      onViewBuyer={(buyer) => console.log('View:', buyer)}
      onSuspendBuyer={(buyer) => console.log('Suspend:', buyer)}
      onStrikeBuyer={(buyer) => console.log('Strike:', buyer)}
      onNextPage={() => {}}
      onPrevPage={() => {}}
    />
  );
};
```

### Transition Animation

```tsx
import React, { useState, useEffect } from 'react';
import { BuyersTable, BuyersTableSkeleton } from "@/components/buyers";

const SmoothLoadingTransition: React.FC = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setShowSkeleton(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setBuyers(mockBuyers);
      setIsLoading(false);
      
      // Smooth transition from skeleton to content
      setTimeout(() => setShowSkeleton(false), 300);
    };

    loadData();
  }, []);

  if (showSkeleton) {
    return <BuyersTableSkeleton />;
  }

  return (
    <BuyersTable
      buyers={buyers}
      activeActionMenu={null}
      onToggleActionMenu={() => {}}
      onViewBuyer={() => {}}
      onSuspendBuyer={() => {}}
      onStrikeBuyer={() => {}}
    />
  );
};
```

## CSS Animation Details

The skeleton components use CSS animations for smooth loading effects:

- **Pulse Animation**: Creates a subtle fade in/out effect
- **Duration**: Animations run indefinitely for continuous loading indication
- **Colors**: Uses neutral gray tones that don't distract from the content structure

### Custom Animation Timing

If you need to customize the animation timing, you can override the CSS classes:

```css
.custom-skeleton {
  animation: custom-pulse 2s ease-in-out infinite;
}

@keyframes custom-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

## Best Practices

1. **Use Appropriate Skeleton Level**: Use `BuyersTableSkeleton` for table-specific loading and `BuyersPageSkeleton` for full page loading.

2. **Match Loading Duration**: Adjust skeleton display time to match your actual loading times for a natural feel.

3. **Smooth Transitions**: Consider adding brief delays when transitioning from skeleton to actual content to avoid jarring switches.

4. **Error States**: Always provide error states in addition to loading states.

5. **Accessibility**: Skeleton loaders are screen-reader friendly and don't interfere with accessibility tools.

## Performance Considerations

- Skeleton components are lightweight and don't make additional API calls
- CSS animations are GPU-accelerated for smooth performance
- Components use semantic HTML for better performance and accessibility
- Minimal re-renders during skeleton display states