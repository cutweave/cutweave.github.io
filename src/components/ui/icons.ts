// SPDX-License-Identifier: GPL-3.0-or-later
// Curated Lucide icon set (ISC license). Add an icon by importing its SVG here and listing it in `icons`.
import sparkles from '../../../node_modules/lucide-static/icons/sparkles.svg?raw';
import sun from '../../../node_modules/lucide-static/icons/sun.svg?raw';
import moon from '../../../node_modules/lucide-static/icons/moon.svg?raw';
import menu from '../../../node_modules/lucide-static/icons/menu.svg?raw';
import x from '../../../node_modules/lucide-static/icons/x.svg?raw';
import circleCheck from '../../../node_modules/lucide-static/icons/circle-check.svg?raw';
import loader from '../../../node_modules/lucide-static/icons/loader.svg?raw';
import circleDashed from '../../../node_modules/lucide-static/icons/circle-dashed.svg?raw';
import clock from '../../../node_modules/lucide-static/icons/clock.svg?raw';
import arrowRight from '../../../node_modules/lucide-static/icons/arrow-right.svg?raw';
import externalLink from '../../../node_modules/lucide-static/icons/external-link.svg?raw';
import copy from '../../../node_modules/lucide-static/icons/copy.svg?raw';
import check from '../../../node_modules/lucide-static/icons/check.svg?raw';
import terminal from '../../../node_modules/lucide-static/icons/terminal.svg?raw';
import scissors from '../../../node_modules/lucide-static/icons/scissors.svg?raw';
import shieldCheck from '../../../node_modules/lucide-static/icons/shield-check.svg?raw';
import gitBranch from '../../../node_modules/lucide-static/icons/git-branch.svg?raw';
import bookOpen from '../../../node_modules/lucide-static/icons/book-open.svg?raw';
import heart from '../../../node_modules/lucide-static/icons/heart.svg?raw';

export const icons = {
  'sparkles': sparkles,
  'sun': sun,
  'moon': moon,
  'menu': menu,
  'x': x,
  'circle-check': circleCheck,
  'loader': loader,
  'circle-dashed': circleDashed,
  'clock': clock,
  'arrow-right': arrowRight,
  'external-link': externalLink,
  'copy': copy,
  'check': check,
  'terminal': terminal,
  'scissors': scissors,
  'shield-check': shieldCheck,
  'git-branch': gitBranch,
  'book-open': bookOpen,
  'heart': heart,
} as const;

export type IconName = keyof typeof icons | 'github';
