# Feature Flags

This project uses PostHog for feature flag management to control feature rollouts and A/B testing.

## Setup

Feature flags are managed through PostHog. The PostHog client is initialized in `instrumentation-client.js` and feature flag utilities are available in `lib/posthog.ts`.

## Available Feature Flags

### `chat-enabled`

Controls whether the AI chat sidebar is visible to users.

- **Key**: `chat-enabled`
- **Type**: Boolean
- **Default**: `true` in development, `false` in production
- **Location**: Chat button and sidebar in ChatProvider component

**To enable in PostHog:**

1. Log in to your PostHog dashboard
2. Go to Feature Flags
3. Create a new feature flag with key: `chat-enabled`
4. Set rollout percentage (e.g., 10% for gradual rollout, 100% for full rollout)
5. Save and deploy

**Rollout Strategy:**

- Start with 10% rollout to test with early adopters
- Monitor for errors and user feedback
- Gradually increase to 25%, 50%, 75%, and finally 100%
- Can also target specific users or cohorts

## Using Feature Flags

### In React Components (Recommended)

Use the `useFeatureFlag` hook for reactive feature flag checks:

```typescript
import { FeatureFlags, useFeatureFlag } from '@/lib/posthog';

function MyComponent() {
  const isEnabled = useFeatureFlag(FeatureFlags.CHAT_ENABLED, false);

  // Optional: Show loading state while flag is being fetched
  if (isEnabled === null) {
    return <LoadingSpinner />;
  }

  return isEnabled ? <NewFeature /> : <OldFeature />;
}
```

### In Event Handlers

Use the `getFeatureFlag` function for one-time synchronous checks:

```typescript
import { FeatureFlags, getFeatureFlag } from '@/lib/posthog';

function handleClick() {
  if (getFeatureFlag(FeatureFlags.CHAT_ENABLED, false)) {
    // Feature is enabled
    openChatSidebar();
  }
}
```

## Adding New Feature Flags

1. Add the flag key to `FeatureFlags` constant in `lib/posthog.ts`:

```typescript
export const FeatureFlags = {
  CHAT_ENABLED: 'chat-enabled',
  MY_NEW_FEATURE: 'my-new-feature', // Add here
} as const;
```

2. Create the flag in PostHog dashboard with the same key

3. Use the flag in your component:

```typescript
const isMyFeatureEnabled = useFeatureFlag(FeatureFlags.MY_NEW_FEATURE, false);
```

## Environment Variables

Make sure these environment variables are set:

```env
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-project-api-key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Development

Feature flags have different default behaviors in development vs production:

- **Chat feature**: Enabled by default in development mode for easier testing
- **PostHog tracking**: Disabled in development mode (see `instrumentation-client.js`)

To test production behavior locally:
1. Set `NODE_ENV=production` when running the dev server
2. Or temporarily remove the development check in ChatProvider.tsx

## Best Practices

1. **Always provide a default value** - Feature flags should gracefully degrade if PostHog is unavailable
2. **Use descriptive flag names** - Use kebab-case and be specific (e.g., `chat-enabled`, not `feature1`)
3. **Clean up old flags** - Remove feature flags from code once features are fully rolled out
4. **Test both states** - Always test your feature with the flag enabled AND disabled
5. **Monitor performance** - Feature flags add minimal overhead but monitor initial load times

## Troubleshooting

### Feature flag not working

1. Check that PostHog is initialized: Open browser console and type `posthog.__loaded`
2. Verify environment variables are set correctly
3. Check PostHog dashboard to ensure flag exists and is active
4. Clear browser cache and cookies (feature flags are cached)

### Flag value not updating

PostHog caches feature flags. To force a refresh:

```typescript
posthog.reloadFeatureFlags();
```

Or clear local storage and reload the page.
