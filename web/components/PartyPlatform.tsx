// ABOUTME: Client component for party platform with synchronized navigation and accordions
// ABOUTME: Manages accordion state and connects it to quick navigation links

'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Accordion } from './Accordion';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface Person {
  id: number;
  full_name: string;
  party_id: number;
  role: string;
  profession: string | null;
  age: number | null;
  date_of_birth: string | null;
  profile_description: string | null;
  photo_filename: string | null;
  education: string | null; // JSON string
  family_notes: string | null;
  ideology: string | null;
  nickname: string | null;
  created_at: string;
}

interface RunningMate {
  id: number;
  candidate_id: number;
  full_name: string;
  position: string;
  profile_description: string | null;
  created_at: string;
}

interface PartyPlatformProps {
  accordionItems: AccordionItem[];
  extractedText?: string | null;
  candidate?: (Person & { running_mates: RunningMate[] }) | null;
}

export function PartyPlatform({ accordionItems, extractedText, candidate }: PartyPlatformProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  // Create candidate accordion item
  const candidateAccordionItem: AccordionItem | null = candidate
    ? {
        id: 'candidatos',
        title: 'Candidatos',
        icon: (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        ),
        content: (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Candidate Photo */}
              <div className="w-24 md:w-20 aspect-square relative rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
                {candidate.photo_filename ? (
                  <Image
                    src={`/party_candidates/${candidate.photo_filename}`}
                    alt={`Foto de ${candidate.full_name}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                    <svg
                      className="w-12 h-12"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Candidate Information */}
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {candidate.full_name}
                    {candidate.nickname && (
                      <span className="text-base font-normal text-gray-600 dark:text-gray-400 ml-2">
                        "{candidate.nickname}"
                      </span>
                    )}
                  </h4>
                  {candidate.profession && (
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{candidate.profession}</p>
                  )}
                  {candidate.age && (
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{candidate.age} años</p>
                  )}
                </div>

                {candidate.profile_description && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Perfil
                    </h5>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                      {candidate.profile_description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {candidate.education && (
              <div>
                <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Educación
                </h5>
                <div className="space-y-1">
                  {(() => {
                    try {
                      const educationList = JSON.parse(candidate.education);
                      return educationList.map((edu: string) => (
                        <p key={edu} className="text-gray-700 dark:text-gray-300 text-sm">
                          • {edu}
                        </p>
                      ));
                    } catch {
                      return (
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          • {candidate.education}
                        </p>
                      );
                    }
                  })()}
                </div>
              </div>
            )}

            {candidate.family_notes && (
              <div>
                <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Información Adicional
                </h5>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{candidate.family_notes}</p>
              </div>
            )}

            {/* Running Mates */}
            {candidate.running_mates && candidate.running_mates.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Fórmula Presidencial
                </h5>
                <div className="space-y-2">
                  {candidate.running_mates.map((mate) => (
                    <div key={mate.id} className="flex items-start gap-2">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm shrink-0">
                        {mate.position === 'primer_vicepresidente' ? '1er VP:' : '2do VP:'}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {mate.full_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ),
      }
    : null;

  const handleNavClick = (id: string) => {
    // Open the accordion
    setOpenId(id);

    // Scroll to the element
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100); // Small delay to allow accordion to open first
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[250px_1fr] w-full min-w-0">
      {/* Table of Contents - Sticky (hidden on mobile) */}
      <div className="hidden lg:block lg:sticky lg:top-8 lg:self-start">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="font-semibold text-gray-900 mb-3 dark:text-white">Navegación Rápida</h3>
          <nav className="space-y-1">
            {candidateAccordionItem && (
              <button
                type="button"
                key={candidateAccordionItem.id}
                onClick={() => handleNavClick(candidateAccordionItem.id)}
                className="block w-full text-left rounded px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white break-words"
              >
                {candidateAccordionItem.title}
              </button>
            )}
            {accordionItems.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="block w-full text-left rounded px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white break-words"
              >
                {item.title}
              </button>
            ))}
            {extractedText && (
              <a
                href="#texto-completo"
                className="block rounded px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white break-words"
              >
                Texto Completo
              </a>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8 min-w-0 w-full">
        {/* Candidates Section */}
        {candidateAccordionItem && (
          <div id="candidatos" className="scroll-mt-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 dark:text-white">
              Candidatos
            </h2>
            <div className="space-y-4">
              <Accordion
                items={[candidateAccordionItem]}
                openId={openId}
                onOpenChange={setOpenId}
              />
            </div>
          </div>
        )}

        {/* Positions by Category */}
        <div id="plataforma">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 dark:text-white">
            Plataforma Política
          </h2>
          {accordionItems.length > 0 ? (
            <div className="space-y-4">
              {accordionItems.map((item) => (
                <div key={item.id} id={item.id} className="scroll-mt-8">
                  <Accordion items={[item]} openId={openId} onOpenChange={setOpenId} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <p className="text-gray-600 dark:text-gray-400">
                No hay información de plataforma disponible para este partido.
              </p>
            </div>
          )}
        </div>

        {/* Full Extracted Text */}
        {extractedText && (
          <div id="texto-completo" className="scroll-mt-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 dark:text-white">
              Texto Completo Extraído
            </h2>
            <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <p className="text-sm text-gray-600 mb-4 dark:text-gray-400">
                Este es el texto completo extraído del documento PDF oficial del partido.
              </p>
              <div className="prose max-w-none dark:prose-invert">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed dark:text-gray-300">
                  {extractedText}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
