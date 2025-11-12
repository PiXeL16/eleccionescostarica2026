// ABOUTME: PostHog client-side instrumentation for web analytics tracking
// ABOUTME: Initializes PostHog early in the page lifecycle for optimal tracking performance

import posthog from 'posthog-js';

// Initialize PostHog only if API key and host are provided
const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (apiKey && host) {
  posthog.init(apiKey, {
    api_host: host,
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
    // Disable in development mode
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        posthog.opt_out_capturing();
      }
    },
  });
}
