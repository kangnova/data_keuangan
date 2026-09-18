'use client';

import React from 'react';
import {
  Wallet,
  Building2,
  Landmark,
  Smartphone,
  TrendingUp,
  CreditCard,
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Film,
  HeartPulse,
  Briefcase,
  Award,
  BadgePercent,
  Laptop,
  Tag,
  CircleDollarSign,
  ArrowRightLeft,
  LucideProps,
} from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const iconMap: Record<string, React.ComponentType<LucideProps>> = {
    wallet: Wallet,
    'building-2': Building2,
    landmark: Landmark,
    smartphone: Smartphone,
    'trending-up': TrendingUp,
    'credit-card': CreditCard,
    utensils: Utensils,
    car: Car,
    'shopping-bag': ShoppingBag,
    receipt: Receipt,
    film: Film,
    'heart-pulse': HeartPulse,
    briefcase: Briefcase,
    award: Award,
    'badge-percent': BadgePercent,
    laptop: Laptop,
    tag: Tag,
    'circle-dollar-sign': CircleDollarSign,
    'arrow-right-left': ArrowRightLeft,
  };

  const Component = iconMap[name] || Tag;
  return <Component {...props} />;
}
