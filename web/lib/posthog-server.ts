// ABOUTME: Server-side PostHog client for tracking events in API routes
// ABOUTME: Configured for Next.js serverless/edge runtime compatibility

import { PostHog } from 'posthog-node';

let posthogInstance: PostHog | null = null;

/**
 * Get or create PostHog server client instance
 * Uses singleton pattern to reuse client across requests
 */
function getPostHogClient(): PostHog | null {
  // Return null if PostHog is not configured
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || !process.env.NEXT_PUBLIC_POSTHOG_HOST) {
    console.warn('PostHog server tracking disabled: missing API key or host');
    return null;
  }

  // Create singleton instance
  if (!posthogInstance) {
    posthogInstance = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      // Critical for serverless: flush immediately, don't batch
      flushAt: 1,
      flushInterval: 0,
    });
  }

  return posthogInstance;
}

/**
 * Track a server-side event in PostHog
 * Non-blocking, fire-and-forget pattern with graceful error handling
 *
 * @param event - Event name (e.g., 'chat_question_asked')
 * @param properties - Event properties object
 * @param distinctId - User identifier (default: 'anonymous')
 */
export async function trackEvent(
  event: string,
  properties: Record<string, unknown>,
  distinctId = 'anonymous'
): Promise<void> {
  const client = getPostHogClient();

  if (!client) {
    // Silently skip tracking if PostHog is not configured
    return;
  }

  try {
    client.capture({
      distinctId,
      event,
      properties: {
        ...properties,
        // Add server-side tracking indicator
        tracked_from: 'server',
        environment: process.env.NODE_ENV || 'development',
      },
    });

    // Flush events immediately for serverless environments
    await client.shutdown();
  } catch (error) {
    // Log error but don't throw - tracking failures shouldn't break app
    console.error('PostHog server tracking error:', error);
  }
}

/**
 * Track a chat question event
 * Convenience wrapper with typed properties for chat tracking
 */
export async function trackChatQuestion(data: {
  question: string;
  partyIds: number[];
  searchResultsCount: number;
  partiesInResults: string[];
  conversationLength: number;
}): Promise<void> {
  await trackEvent('chat_question_asked', {
    question: data.question,
    question_length: data.question.length,
    party_ids: data.partyIds,
    party_count: data.partyIds.length,
    is_all_parties: data.partyIds.length === 0,
    search_results_count: data.searchResultsCount,
    parties_in_results: data.partiesInResults,
    conversation_length: data.conversationLength,
    is_first_question: data.conversationLength === 1,
    timestamp: new Date().toISOString(),
  });
}
