// ABOUTME: Color-coded badge component for category visualization
// ABOUTME: Provides consistent visual identity for proposal categories across the UI

'use client';

import { motion } from 'framer-motion';
import { getCategoryColors } from '@/lib/category-colors';

interface CategoryBadgeProps {
  categoryKey: string;
  categoryName: string;
  variant?: 'solid' | 'light' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export default function CategoryBadge({
  categoryKey,
  categoryName,
  variant = 'solid',
  size = 'md',
  animated = false,
  className = '',
}: CategoryBadgeProps) {
  const colors = getCategoryColors(categoryKey);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const variantClasses = {
    solid: `${colors.bg} ${colors.text}`,
    light: `${colors.light} ${colors.text.replace('text-white', 'text-gray-800 dark:text-gray-200')}`,
    outline: `border-2 ${colors.border} ${colors.text.replace('text-white', 'text-gray-800 dark:text-gray-200')} bg-transparent`,
  };

  const badgeClasses = `inline-flex items-center font-medium rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (animated) {
    return (
      <motion.span
        className={badgeClasses}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {categoryName}
      </motion.span>
    );
  }

  return <span className={badgeClasses}>{categoryName}</span>;
}

/**
 * Category badge with icon (optional)
 */
export function CategoryBadgeWithIcon({
  categoryKey,
  categoryName,
  icon,
  variant = 'solid',
  size = 'md',
}: CategoryBadgeProps & { icon?: string }) {
  const colors = getCategoryColors(categoryKey);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const variantClasses = {
    solid: `${colors.bg} ${colors.text}`,
    light: `${colors.light} ${colors.text.replace('text-white', 'text-gray-800 dark:text-gray-200')}`,
    outline: `border-2 ${colors.border} ${colors.text.replace('text-white', 'text-gray-800 dark:text-gray-200')} bg-transparent`,
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {categoryName}
    </span>
  );
}

/**
 * Grid of category badges for filter selection
 */
export function CategoryBadgeGrid({
  categories,
  selectedCategories,
  onToggle,
}: {
  categories: Array<{ key: string; name: string }>;
  selectedCategories: Set<string>;
  onToggle: (key: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isSelected = selectedCategories.has(category.key);
        return (
          <motion.button
            key={category.key}
            onClick={() => onToggle(category.key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <CategoryBadge
              categoryKey={category.key}
              categoryName={category.name}
              variant={isSelected ? 'solid' : 'outline'}
              size="md"
            />
          </motion.button>
        );
      })}
    </div>
  );
}
