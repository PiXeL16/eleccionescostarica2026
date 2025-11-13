// ABOUTME: Floating chat button that opens the chat sidebar
// ABOUTME: Uses lucide-react for the message icon

'use client';

import { MessageCircle, X } from 'lucide-react';

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function ChatButton({ onClick, isOpen }: ChatButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Pulse Animation Ring (only when closed) */}
      {!isOpen && (
        <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-75" />
      )}

      {/* Main Button */}
      <button
        type="button"
        onClick={onClick}
        className="relative rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600"
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
      >
        {isOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-6 w-6 animate-bounce" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
