// SPDX-License-Identifier: GPL-3.0-or-later
// Extra Lucide icons (ISC license) for the demo components. src/components/ui/icons.ts is a shared file
// and lacks transport and clip-type glyphs, so the demo keeps its own curated set.
import sparkles from '../../../node_modules/lucide-static/icons/sparkles.svg?raw';
import play from '../../../node_modules/lucide-static/icons/play.svg?raw';
import pause from '../../../node_modules/lucide-static/icons/pause.svg?raw';
import stepBack from '../../../node_modules/lucide-static/icons/step-back.svg?raw';
import stepForward from '../../../node_modules/lucide-static/icons/step-forward.svg?raw';
import skipBack from '../../../node_modules/lucide-static/icons/skip-back.svg?raw';
import skipForward from '../../../node_modules/lucide-static/icons/skip-forward.svg?raw';
import rotateCcw from '../../../node_modules/lucide-static/icons/rotate-ccw.svg?raw';
import film from '../../../node_modules/lucide-static/icons/film.svg?raw';
import music from '../../../node_modules/lucide-static/icons/music.svg?raw';
import type from '../../../node_modules/lucide-static/icons/type.svg?raw';
import captions from '../../../node_modules/lucide-static/icons/captions.svg?raw';
import blend from '../../../node_modules/lucide-static/icons/blend.svg?raw';
import scissors from '../../../node_modules/lucide-static/icons/scissors.svg?raw';
import undo2 from '../../../node_modules/lucide-static/icons/undo-2.svg?raw';
import redo2 from '../../../node_modules/lucide-static/icons/redo-2.svg?raw';
import history from '../../../node_modules/lucide-static/icons/history.svg?raw';
import audioWaveform from '../../../node_modules/lucide-static/icons/audio-waveform.svg?raw';
import image from '../../../node_modules/lucide-static/icons/image.svg?raw';
import folder from '../../../node_modules/lucide-static/icons/folder.svg?raw';
import layers from '../../../node_modules/lucide-static/icons/layers.svg?raw';
import eye from '../../../node_modules/lucide-static/icons/eye.svg?raw';
import lock from '../../../node_modules/lucide-static/icons/lock.svg?raw';
import volume2 from '../../../node_modules/lucide-static/icons/volume-2.svg?raw';
import settings2 from '../../../node_modules/lucide-static/icons/settings-2.svg?raw';
import slidersHorizontal from '../../../node_modules/lucide-static/icons/sliders-horizontal.svg?raw';
import check from '../../../node_modules/lucide-static/icons/check.svg?raw';
import x from '../../../node_modules/lucide-static/icons/x.svg?raw';
import circleCheck from '../../../node_modules/lucide-static/icons/circle-check.svg?raw';
import clock from '../../../node_modules/lucide-static/icons/clock.svg?raw';
import terminal from '../../../node_modules/lucide-static/icons/terminal.svg?raw';
import chevronRight from '../../../node_modules/lucide-static/icons/chevron-right.svg?raw';
import chevronDown from '../../../node_modules/lucide-static/icons/chevron-down.svg?raw';
import magnet from '../../../node_modules/lucide-static/icons/magnet.svg?raw';
import zoomIn from '../../../node_modules/lucide-static/icons/zoom-in.svg?raw';
import mousePointer2 from '../../../node_modules/lucide-static/icons/mouse-pointer-2.svg?raw';
import bot from '../../../node_modules/lucide-static/icons/bot.svg?raw';
import library from '../../../node_modules/lucide-static/icons/library.svg?raw';
import panelRight from '../../../node_modules/lucide-static/icons/panel-right.svg?raw';

export const demoIcons = {
  'sparkles': sparkles,
  'play': play,
  'pause': pause,
  'step-back': stepBack,
  'step-forward': stepForward,
  'skip-back': skipBack,
  'skip-forward': skipForward,
  'rotate-ccw': rotateCcw,
  'film': film,
  'music': music,
  'type': type,
  'captions': captions,
  'blend': blend,
  'scissors': scissors,
  'undo-2': undo2,
  'redo-2': redo2,
  'history': history,
  'audio-waveform': audioWaveform,
  'image': image,
  'folder': folder,
  'layers': layers,
  'eye': eye,
  'lock': lock,
  'volume-2': volume2,
  'settings-2': settings2,
  'sliders-horizontal': slidersHorizontal,
  'check': check,
  'x': x,
  'circle-check': circleCheck,
  'clock': clock,
  'terminal': terminal,
  'chevron-right': chevronRight,
  'chevron-down': chevronDown,
  'magnet': magnet,
  'zoom-in': zoomIn,
  'mouse-pointer-2': mousePointer2,
  'bot': bot,
  'library': library,
  'panel-right': panelRight,
} as const;

export type DemoIconName = keyof typeof demoIcons;
