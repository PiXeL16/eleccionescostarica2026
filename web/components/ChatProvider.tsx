// ABOUTME: Chat provider that wraps the entire app with chat functionality
// ABOUTME: Manages chat state, party selection, and displays chat button/sidebar globally

'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FeatureFlags, useFeatureFlag } from '@/lib/posthog';
import { ChatButton } from './ChatButton';
import { ChatSidebar } from './ChatSidebar';

interface Party {
  id: number;
  name: string;
  abbreviation: string;
}

interface ChatProviderProps {
  children: React.ReactNode;
  parties: Party[];
  initialPartyId?: number;
}

export function ChatProvider({ children, parties, initialPartyId }: ChatProviderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPartyIds, setSelectedPartyIds] = useState<number[]>(
    initialPartyId ? [initialPartyId] : []
  );

  // Check if chat feature is enabled via PostHog feature flag
  // Enable by default in development, disabled in production (requires flag)
  const defaultEnabled = process.env.NODE_ENV === 'development';
  const isChatEnabled = useFeatureFlag(FeatureFlags.CHAT_ENABLED, defaultEnabled);

  // Auto-select party based on current page URL
  useEffect(() => {
    // Check if we're on a party detail page (/partido/[slug])
    const partyPageMatch = pathname.match(/^\/partido\/([^/]+)/);

    if (partyPageMatch) {
      const slug = partyPageMatch[1].toUpperCase();
      const party = parties.find((p) => p.abbreviation.toUpperCase() === slug);

      if (party) {
        setSelectedPartyIds([party.id]);
      }
    }
  }, [pathname, parties]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      {/* Main content with responsive margin for sidebar (only if chat is enabled and open) */}
      <div
        className={`transition-all duration-300 ${
          isChatEnabled && isOpen ? 'mr-0 sm:mr-[500px]' : 'mr-0'
        }`}
      >
        {children}
      </div>

      {/* Chat UI (button and sidebar) - only render if feature flag is enabled */}
      {isChatEnabled && (
        <>
          {/* Chat button */}
          <ChatButton onClick={handleToggle} isOpen={isOpen} />

          {/* Sidebar */}
          <ChatSidebar
            isOpen={isOpen}
            onClose={handleClose}
            parties={parties}
            selectedPartyIds={selectedPartyIds}
            onPartyIdsChange={setSelectedPartyIds}
          />
        </>
      )}
    </>
  );
}
