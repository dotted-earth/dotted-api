CREATE TABLE `attractions` (
	`seoId` integer,
	`sortOrder` integer NOT NULL,
	`webURL` text,
	`pageUrlName` text,
	`primaryDestinationUrlName` text,
	`publishedDate` text,
	`attractionLatitude` real,
	`attractionLongitude` real,
	`attractionStreetAddress` text,
	`attractionCity` text,
	`attractionState` text,
	`destinationId` integer,
	`photoCount` integer,
	`primaryDestinationId` integer,
	`thumbnailHiResURL` text,
	`primaryDestinationName` text,
	`thumbnailURL` text,
	`productCount` integer,
	`rating` integer,
	`title` text
);
--> statement-breakpoint
CREATE TABLE `destinations` (
	`destinationId` integer,
	`sortNumber` integer,
	`selectable` integer,
	`destinationUrlName` text,
	`defaultCurrencyCode` text,
	`lookupId` text,
	`parentId` integer,
	`timeZone` text,
	`iataCode` text,
	`destinationName` text,
	`destinationType` text,
	`latitude` real,
	`longitude` real
);
