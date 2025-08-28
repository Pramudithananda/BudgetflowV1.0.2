# Firebase to SQLite Migration

## Overview
This BudgetFlow app has been successfully migrated from Firebase Firestore to SQLite for local data storage.

## Changes Made

### 1. Dependencies
- **Removed**: `firebase` (^11.6.1)
- **Added**: `expo-sqlite` (^14.0.6)

### 2. Database Structure
The SQLite database (`budgetflow.db`) contains the following tables:

#### Categories
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `name` (TEXT NOT NULL)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

#### Expenses
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `title` (TEXT NOT NULL)
- `amount` (REAL NOT NULL DEFAULT 0)
- `status` (TEXT NOT NULL DEFAULT 'Outstanding')
- `category_id` (INTEGER, FOREIGN KEY)
- `funder_id` (INTEGER, FOREIGN KEY)
- `assigned_to` (TEXT)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

#### Budget
- `id` (INTEGER PRIMARY KEY DEFAULT 1)
- `total_budget` (REAL DEFAULT 0)
- `received_fund` (REAL DEFAULT 0)
- `people_over_fund` (REAL DEFAULT 0)
- `remaining_fund` (REAL DEFAULT 0)
- `updated_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

#### Helpers
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `name` (TEXT NOT NULL)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

#### Funders
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `name` (TEXT NOT NULL)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

### 3. Service Layer
- **Removed**: `services/firebaseService.js`
- **Added**: `services/sqliteService.js`

The SQLite service provides:
- All CRUD operations for categories, expenses, budget, helpers, and funders
- Pseudo real-time listeners that notify components of data changes
- Automatic database initialization with proper schema and indexes

### 4. Authentication
- **Updated**: `context/auth.js` - Replaced Firebase Auth with local AsyncStorage-based authentication
- Simple email/password validation
- User data stored locally in AsyncStorage

### 5. Configuration
- **Removed**: `firebase/config.js` - No longer needed
- **Removed**: Firebase configuration and API keys

## Key Differences from Firebase

### Real-time Updates
- **Firebase**: Had real-time listeners that automatically pushed updates
- **SQLite**: Uses a listener pattern that notifies components when data changes occur through CRUD operations

### Data Format
- **Firebase**: Used Firestore Timestamps
- **SQLite**: Uses ISO string timestamps for consistency

### Authentication
- **Firebase**: Full authentication service with secure backend
- **SQLite**: Simple local authentication (suitable for demo/development)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. The SQLite database will be automatically initialized on first app launch.

## Usage

The app functionality remains the same:
- Create and manage expense categories
- Add and track expenses with different statuses
- Manage funders
- View dashboard with expense summaries
- Generate PDF reports

## Benefits of SQLite Migration

1. **Offline-first**: All data is stored locally, no internet required
2. **Privacy**: No data sent to external servers
3. **Performance**: Fast local queries
4. **Cost**: No Firebase hosting costs
5. **Simplicity**: No external service dependencies

## Limitations

1. **No real-time sync**: Changes don't sync across devices
2. **Local storage only**: Data is device-specific
3. **Backup**: Users need to manually backup/export data
4. **Authentication**: Simple local auth vs. secure Firebase Auth

## Future Enhancements

Consider implementing:
- Data export/import functionality
- Local backup mechanisms
- More robust local authentication
- Data encryption for sensitive information