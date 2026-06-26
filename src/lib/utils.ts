import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

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
