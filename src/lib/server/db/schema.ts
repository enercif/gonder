import { PACKAGE_STATUS } from '$lib/const/package-status';
import { PACKAGE_TYPES } from '$lib/const/package-types';
import type { Rule } from '$lib/schemas/rule.schema';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export * from './auth.schema';

export const packageTable = sqliteTable('packages', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	url: text('url').notNull(),
	description: text('description'),
	status: text('status', { enum: PACKAGE_STATUS }).notNull(),
	type: text('type', { enum: PACKAGE_TYPES }).notNull(),
	rules: text('rules', { mode: 'json' }).$type<Rule[]>().default([]).notNull(),
	userId: text('user_id').notNull(),
	createdAt: text('created_at').notNull()
});
