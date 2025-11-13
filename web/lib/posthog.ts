// ABOUTME: PostHog feature flag utilities and hooks
// ABOUTME: Provides type-safe feature flag access with React hooks

'use client';

import posthog from 'posthog-js';
import { useEffect, useState } from 'react';

/**
 * Feature flag keys used in the application
 * Add new feature flags here to maintain type safety
 */
export const FeatureFlags = {
  CHAT_ENABLED: 'chat-enabled',
} as const;

export type FeatureFlagKey = (typeof FeatureFlags)[keyof typeof FeatureFlags];

/**
 * Hook to check if a feature flag is enabled
 * Returns null while loading, then the boolean value
 *
 * @param flagKey - The feature flag key to check
 * @param defaultValue - Default value to return if PostHog is not initialized (default: false)
 * @returns boolean | null - Feature flag value or null while loading
 *
 * @example
 * const isChatEnabled = useFeatureFlag(FeatureFlags.CHAT_ENABLED);
 * if (isChatEnabled === null) return <Loading />;
 * return isChatEnabled ? <ChatButton /> : null;
 */
export function useFeatureFlag(
  flagKey: FeatureFlagKey,
  defaultValue: boolean = false
): boolean | null {
  const [flagValue, setFlagValue] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if PostHog is initialized
    if (!posthog.__loaded) {
      // If PostHog is not loaded, use default value
      setFlagValue(defaultValue);
      return;
    }

    // Get initial flag value
    const initialValue = posthog.isFeatureEnabled(flagKey);
    setFlagValue(initialValue ?? defaultValue);

    // Listen for flag changes
    const onFeatureFlagsChange = () => {
      const newValue = posthog.isFeatureEnabled(flagKey);
      setFlagValue(newValue ?? defaultValue);
    };

    posthog.onFeatureFlags(onFeatureFlagsChange);

    // Cleanup listener on unmount
    return () => {
      // PostHog doesn't have an off method, so we just let it clean up naturally
    };
  }, [flagKey, defaultValue]);

  return flagValue;
}

/**
 * Get feature flag value synchronously (non-reactive)
 * Use this in event handlers or one-time checks
 *
 * @param flagKey - The feature flag key to check
 * @param defaultValue - Default value if flag is not found
 * @returns boolean - Feature flag value
 */
export function getFeatureFlag(flagKey: FeatureFlagKey, defaultValue: boolean = false): boolean {
  if (!posthog.__loaded) {
    return defaultValue;
  }

  return posthog.isFeatureEnabled(flagKey) ?? defaultValue;
}

/**
 * Check if PostHog is initialized and ready
 * @returns boolean
 */
export function isPostHogReady(): boolean {
  return posthog.__loaded;
}
