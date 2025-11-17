// ABOUTME: Interactive force-directed graph showing party keyword bubbles
// ABOUTME: Each party bubble displays their most distinctive keywords with size based on frequency

'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeywordScore } from '@/lib/keyword-extractor';
import { getPartyColor } from '@/lib/party-colors';

interface PartyBubbleData {
  id: string;
  name: string;
  abbreviation: string;
  keywords: KeywordScore[];
  wordCount: number;
}

interface PartyWordBubbleMapProps {
  parties: PartyBubbleData[];
  width?: number;
  height?: number;
}

interface BubbleNode {
  id: string;
  name: string;
  abbreviation: string;
  keywords: KeywordScore[];
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export default function PartyWordBubbleMap({
  parties,
  width = 1200,
  height = 800,
}: PartyWordBubbleMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<BubbleNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<BubbleNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<BubbleNode | null>(null);
  const animationRef = useRef<number | undefined>(undefined);

  // Initialize nodes
  useEffect(() => {
    const minRadius = 60;
    const maxRadius = 120;
    const wordCounts = parties.map((p) => p.wordCount);
    const minWordCount = Math.min(...wordCounts);
    const maxWordCount = Math.max(...wordCounts);

    const initialNodes: BubbleNode[] = parties.map((party, index) => {
      // Scale radius based on word count
      const normalizedSize = (party.wordCount - minWordCount) / (maxWordCount - minWordCount || 1);
      const radius = minRadius + normalizedSize * (maxRadius - minRadius);

      // Random initial position
      const angle = (index / parties.length) * 2 * Math.PI;
      const distance = Math.min(width, height) * 0.3;

      return {
        id: party.id,
        name: party.name,
        abbreviation: party.abbreviation,
        keywords: party.keywords,
        x: width / 2 + Math.cos(angle) * distance,
        y: height / 2 + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        radius,
        color: getPartyColor(party.abbreviation),
      };
    });

    setNodes(initialNodes);
  }, [parties, width, height]);

  // Physics simulation
  useEffect(() => {
    if (nodes.length === 0) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const damping = 0.95;
    const centerForce = 0.05;
    const repulsionForce = 0.5;

    const simulate = () => {
      setNodes((currentNodes) => {
        const newNodes = currentNodes.map((node) => ({ ...node }));

        // Apply forces
        for (let i = 0; i < newNodes.length; i++) {
          const node = newNodes[i];

          // Center force
          const dx = centerX - node.x;
          const dy = centerY - node.y;
          node.vx += dx * centerForce;
          node.vy += dy * centerForce;

          // Repulsion from other nodes
          for (let j = 0; j < newNodes.length; j++) {
            if (i === j) continue;
            const other = newNodes[j];
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = node.radius + other.radius + 10;

            if (distance < minDistance && distance > 0) {
              const force = ((minDistance - distance) / distance) * repulsionForce;
              node.vx += (dx / distance) * force;
              node.vy += (dy / distance) * force;
            }
          }

          // Apply velocity with damping
          node.vx *= damping;
          node.vy *= damping;
          node.x += node.vx;
          node.y += node.vy;

          // Boundary collision
          if (node.x - node.radius < 0) {
            node.x = node.radius;
            node.vx *= -0.5;
          }
          if (node.x + node.radius > width) {
            node.x = width - node.radius;
            node.vx *= -0.5;
          }
          if (node.y - node.radius < 0) {
            node.y = node.radius;
            node.vy *= -0.5;
          }
          if (node.y + node.radius > height) {
            node.y = height - node.radius;
            node.vy *= -0.5;
          }
        }

        return newNodes;
      });

      animationRef.current = requestAnimationFrame(simulate);
    };

    animationRef.current = requestAnimationFrame(simulate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes.length, width, height]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw nodes
    for (const node of nodes) {
      const isHovered = hoveredNode?.id === node.id;
      const isSelected = selectedNode?.id === node.id;

      // Draw circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
      ctx.fillStyle = node.color + (isHovered || isSelected ? 'CC' : '99');
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#000' : '#fff';
      ctx.lineWidth = isSelected ? 4 : 2;
      ctx.stroke();

      // Draw party abbreviation at top of bubble
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.abbreviation, node.x, node.y - node.radius + 20);

      // Draw keywords in a compact layout
      if (!isSelected) {
        // Show top 5 keywords when not selected
        const displayKeywords = node.keywords.slice(0, 5);
        ctx.font = '12px system-ui';
        displayKeywords.forEach((kw, i) => {
          const fontSize = 12 + Math.min(kw.frequency / 2, 6);
          ctx.font = `${fontSize}px system-ui`;
          ctx.fillText(kw.word, node.x, node.y - 10 + i * 15);
        });
      } else {
        // Show more keywords when selected
        const displayKeywords = node.keywords.slice(0, 10);
        ctx.font = '11px system-ui';
        const columns = 2;
        displayKeywords.forEach((kw, i) => {
          const col = i % columns;
          const row = Math.floor(i / columns);
          const fontSize = 11 + Math.min(kw.frequency / 3, 5);
          ctx.font = `${fontSize}px system-ui`;
          const xOffset = col === 0 ? -node.radius * 0.4 : node.radius * 0.4;
          ctx.fillText(kw.word, node.x + xOffset, node.y - 30 + row * 14);
        });
      }
    }
  }, [nodes, hoveredNode, selectedNode, width, height]);

  // Mouse interaction
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = nodes.find((node) => {
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) <= node.radius;
    });

    setSelectedNode(clickedNode || null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hoveredNode = nodes.find((node) => {
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) <= node.radius;
    });

    setHoveredNode(hoveredNode || null);
    canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
  };

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          className="w-full h-auto border border-gray-300 dark:border-gray-600 rounded"
        />
      </div>

      {selectedNode && (
        <div
          className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4"
          style={{ borderColor: selectedNode.color }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedNode.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedNode.abbreviation}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
              Palabras Clave Más Distintivas
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedNode.keywords.map((kw) => (
                <span
                  key={kw.word}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    backgroundColor: `${selectedNode.color}22`,
                    color: selectedNode.color,
                    fontSize: `${12 + Math.min(kw.frequency / 2, 8)}px`,
                  }}
                >
                  {kw.word} ({kw.frequency})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {hoveredNode && !selectedNode && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>{hoveredNode.name}</strong> - Haz clic para ver todos los términos clave
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">ℹ️ Cómo usar este mapa</h4>
        <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
          <li>
            • El <strong>tamaño de cada burbuja</strong> representa la extensión total de las
            propuestas del partido
          </li>
          <li>
            • Las <strong>palabras mostradas</strong> son los términos más distintivos de cada
            partido (usando análisis TF-IDF)
          </li>
          <li>
            • El <strong>tamaño de cada palabra</strong> indica qué tan frecuentemente el partido
            menciona ese término
          </li>
          <li>• Haz clic en una burbuja para ver la lista completa de palabras clave</li>
          <li>• Las burbujas se repelen entre sí automáticamente para mejor visualización</li>
        </ul>
      </div>
    </div>
  );
}
