CREATE TABLE `exercises` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`category` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessionCardioExercises` (
	`id` integer PRIMARY KEY NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()),
	`sessionId` integer NOT NULL,
	`exerciseId` integer NOT NULL,
	`time` real NOT NULL,
	`distance` real NOT NULL,
	`calories` integer,
	FOREIGN KEY (`sessionId`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exerciseId`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessionWeightExercises` (
	`id` integer PRIMARY KEY NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()),
	`sessionId` integer NOT NULL,
	`exerciseId` integer NOT NULL,
	`weight` real NOT NULL,
	`sets` integer NOT NULL,
	`reps` integer NOT NULL,
	FOREIGN KEY (`sessionId`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exerciseId`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY NOT NULL,
	`startTime` integer DEFAULT (unixepoch()),
	`endTime` integer
);
--> statement-breakpoint
CREATE INDEX `type` ON `exercises` (`type`);--> statement-breakpoint
CREATE INDEX `cardioSessionIdx` ON `sessionCardioExercises` (`sessionId`);--> statement-breakpoint
CREATE INDEX `cardioExerciseIdx` ON `sessionCardioExercises` (`exerciseId`);--> statement-breakpoint
CREATE INDEX `weightSessionIdx` ON `sessionWeightExercises` (`sessionId`);--> statement-breakpoint
CREATE INDEX `weightExerciseIdx` ON `sessionWeightExercises` (`exerciseId`);--> statement-breakpoint
CREATE INDEX `timeIdx` ON `sessions` (`startTime`,`endTime`);