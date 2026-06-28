import { getLocalTimeZone, now, parseZonedDateTime } from '@internationalized/date';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getLocale } from './paraglide/runtime';
import type { Rule } from './schemas/rule.schema';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function formatBytes(bytes: number): string {
	const unit = 1000;
	if (bytes < unit) return `${bytes} B`;

	const units = ['KB', 'MB', 'GB', 'TB'];
	let value = bytes / unit;
	let i = 0;
	while (value >= unit && i < units.length - 1) {
		value /= unit;
		i++;
	}

	return `${value.toFixed(value < 10 ? 1 : 0)}${units[i]}`;
}

const relativeTimeFormat = new Intl.RelativeTimeFormat(getLocale(), { numeric: 'auto' });

export function formatRelativeTime(iso: string): string {
	const diff =
		parseZonedDateTime(iso).toDate().getTime() - now(getLocalTimeZone()).toDate().getTime();
	const seconds = diff / 1000;

	const ranges: [Intl.RelativeTimeFormatUnit, number][] = [
		['year', 60 * 60 * 24 * 365],
		['month', 60 * 60 * 24 * 30],
		['week', 60 * 60 * 24 * 7],
		['day', 60 * 60 * 24],
		['hour', 60 * 60],
		['minute', 60],
		['second', 1]
	];

	for (const [unit, secondsInUnit] of ranges) {
		if (Math.abs(seconds) >= secondsInUnit || unit === 'second') {
			return relativeTimeFormat.format(Math.round(seconds / secondsInUnit), unit);
		}
	}

	return relativeTimeFormat.format(0, 'second');
}

export function generateId(chunkSize: number = 6, chunkCount: number = 2): string {
	const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
	const charsLength = characters.length;
	const chunks: string[] = new Array(chunkCount);

	for (let c = 0; c < chunkCount; c++) {
		let chunk = '';
		for (let i = 0; i < chunkSize; i++) {
			chunk += characters[(Math.random() * charsLength) | 0];
		}
		chunks[c] = chunk;
	}

	return chunks.join('-');
}

export function findRule<TId extends Rule['id']>(
	rules: Rule[],
	id: TId
): Extract<Rule, { id: TId }> | undefined {
	return rules.find((r) => r.id === id && r.enabled) as Extract<Rule, { id: TId }> | undefined;
}
