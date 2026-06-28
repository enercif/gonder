import { ACTIVITY_TYPES } from '$lib/const/activity-types';
import { PACKAGE_STATUS } from '$lib/const/package-status';
import { PACKAGE_TYPES } from '$lib/const/package-types';
import type { Rule } from '$lib/schemas/rule.schema';
import { relations } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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

export const fileTable = sqliteTable(
	'files',
	{
		id: text('id').primaryKey(),
		packageId: text('package_id')
			.notNull()
			.references(() => packageTable.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		size: integer('size').notNull(),
		mimeType: text('mime_type'),
		createdAt: text('created_at').notNull()
	},
	(table) => [index('files_package_id_idx').on(table.packageId)]
);

export const activityTable = sqliteTable(
	'activities',
	{
		id: text('id').primaryKey(),
		packageId: text('package_id')
			.notNull()
			.references(() => packageTable.id, { onDelete: 'cascade' }),
		type: text('type', { enum: ACTIVITY_TYPES }).notNull(),
		detail: text('detail'),
		createdAt: text('created_at').notNull()
	},
	(table) => [index('activities_package_id_idx').on(table.packageId)]
);

export const packageRelations = relations(packageTable, ({ many }) => ({
	files: many(fileTable),
	activities: many(activityTable)
}));

export const fileRelations = relations(fileTable, ({ one }) => ({
	package: one(packageTable, {
		fields: [fileTable.packageId],
		references: [packageTable.id]
	})
}));

export const activityRelations = relations(activityTable, ({ one }) => ({
	package: one(packageTable, {
		fields: [activityTable.packageId],
		references: [packageTable.id]
	})
}));
