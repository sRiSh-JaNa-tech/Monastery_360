-- CreateTable
CREATE TABLE `Festival` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `date` VARCHAR(50) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `image` VARCHAR(255) NOT NULL DEFAULT '/placeholder.svg',
    `month` VARCHAR(20) NOT NULL,
    `details` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hotel` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NOT NULL DEFAULT '/placeholder.svg',
    `description` TEXT NULL,
    `location` VARCHAR(255) NOT NULL DEFAULT '',
    `rating` DOUBLE NOT NULL DEFAULT 0.0,
    `price` INTEGER NOT NULL DEFAULT 0,
    `lat` DOUBLE NOT NULL DEFAULT 0.0,
    `lng` DOUBLE NOT NULL DEFAULT 0.0,
    `access` VARCHAR(50) NOT NULL DEFAULT 'full',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `package` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `duration` VARCHAR(50) NOT NULL DEFAULT 'N/A',
    `price` INTEGER NOT NULL DEFAULT 0,
    `tags` JSON NOT NULL,
    `image` VARCHAR(255) NOT NULL DEFAULT '/placeholder.svg',
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Place` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NULL,
    `images` JSON NOT NULL,
    `video` VARCHAR(255) NULL DEFAULT '',
    `description` TEXT NULL,
    `lat` DOUBLE NOT NULL DEFAULT 0.0,
    `lng` DOUBLE NOT NULL DEFAULT 0.0,
    `access` VARCHAR(50) NOT NULL DEFAULT 'full',
    `isTopVisited` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Taxi` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL DEFAULT '',
    `priceLabel` VARCHAR(50) NOT NULL DEFAULT 'N/A',
    `rating` DOUBLE NOT NULL DEFAULT 0.0,
    `image` VARCHAR(255) NOT NULL DEFAULT '/placeholder.svg',
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Restaurant` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL DEFAULT '',
    `priceLabel` VARCHAR(50) NOT NULL DEFAULT 'N/A',
    `rating` DOUBLE NOT NULL DEFAULT 0.0,
    `image` VARCHAR(255) NOT NULL DEFAULT '/placeholder.svg',
    `description` TEXT NULL,
    `lat` DOUBLE NOT NULL DEFAULT 0.0,
    `lng` DOUBLE NOT NULL DEFAULT 0.0,
    `access` VARCHAR(50) NOT NULL DEFAULT 'full',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
