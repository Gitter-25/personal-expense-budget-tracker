# PesoTrack 💰

**Plan today. Build tomorrow.**

PesoTrack is a personal expense and budget tracking mobile application built with React Native and Expo. It helps users record daily expenses, manage a monthly budget, monitor spending habits, and view simple financial statistics.

This project was developed as a school project using modern mobile development technologies and Supabase as the backend.

---

## Features

### Authentication

- Email and password registration
- Secure user login
- Logout functionality
- Persistent user sessions
- User-specific data

### Expense Management

- Add expenses
- Edit existing expenses
- Delete expenses
- Categorize expenses
- Add optional descriptions
- Support for decimal/centavo amounts
- Monthly expense tracking

### Expense Categories

Default categories are automatically provided for new users:

- 🍔 Food
- 🚗 Transport
- 🛍️ Shopping
- 💡 Bills

### Budget Management

- Set a monthly budget
- Update an existing budget
- Track total monthly spending
- Calculate remaining budget
- Budget progress monitoring

### Statistics

- Monthly spending summary
- Budget progress
- Category spending breakdown
- Category percentages
- Seven-day spending overview
- Over-budget indication
- Pull-to-refresh support

### User Profile

- View account information
- Update full name
- Save profile information
- Persistent profile data

---

## Technology Stack

### Frontend

- React Native
- Expo
- Expo Router
- TypeScript
- NativeWind
- Tailwind CSS

### Backend

- Supabase
- Supabase Authentication
- PostgreSQL
- Row Level Security (RLS)

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Node.js
- npm
- Expo Go

---

## Project Structure

```text
src/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── add-expense.tsx
│   │   ├── statistics.tsx
│   │   ├── budget.tsx
│   │   └── settings.tsx
│   │
│   ├── _layout.tsx
│   ├── login.tsx
│   ├── signup.tsx
│   ├── profile.tsx
│   └── edit-expense.tsx
│
├── lib/
│   └── supabase.ts
│
└── global.css
```

---

## Main Navigation

PesoTrack uses five main tabs:

| Tab        | Purpose                                            |
| ---------- | -------------------------------------------------- |
| Add        | Add a new expense                                  |
| Statistics | View spending analytics                            |
| Home       | View monthly financial summary and recent expenses |
| Budget     | Set and update the monthly budget                  |
| Settings   | Manage account and profile                         |

---

## Database

PesoTrack uses Supabase PostgreSQL for persistent application data.

Main tables:

### `profiles`

Stores user profile information.

### `categories`

Stores expense categories associated with users.

### `expenses`

Stores user expense records including amount, category, description, and date.

### `budgets`

Stores monthly budget information for each user.

---

## Security

PesoTrack uses Supabase Authentication and PostgreSQL Row Level Security (RLS).

Application data is associated with authenticated users so that one user cannot access another user's expenses, budgets, categories, or profile information through the application.

Sensitive Supabase configuration is loaded through environment variables and the `.env` file is excluded from Git.

---

## Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Do not commit your `.env` file.

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd personal-expense-budget-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create the `.env` file and provide your Supabase project URL and publishable key.

### 4. Start the application

```bash
npx expo start
```

Open the application using Expo Go or another supported Expo development environment.

---

## Development Checks

Check TypeScript:

```bash
npx tsc --noEmit
```

Check the Expo project:

```bash
npx expo-doctor
```

Check dependency compatibility:

```bash
npx expo install --check
```

---

## Application Flow

```text
Sign Up / Login
       ↓
      Home
       ↓
 ┌─────┼──────────────┐
 ↓     ↓              ↓
Add  Statistics     Budget
 ↓                    ↓
Expense            Monthly Budget
 ↓
Home / Edit / Delete

Settings
   ↓
Profile
   ↓
Update Account Information
```

---

## Core Workflow

1. Create an account or log in.
2. Set a monthly budget.
3. Add daily expenses.
4. View expenses from the Home screen.
5. Monitor spending through Statistics.
6. Edit or delete expenses when necessary.
7. Update profile information through Settings.
8. Log out securely when finished.

---

## Project Status

The core PesoTrack application is complete and includes:

- Authentication
- User-specific data
- Expense CRUD operations
- Monthly budget management
- Spending statistics
- Seven-day spending visualization
- Profile management
- Persistent Supabase storage
- Responsive mobile interface

---

## Purpose

PesoTrack was created to provide a simple and organized way for users to monitor personal spending and manage a monthly budget.

The project also demonstrates the integration of a React Native mobile frontend with a cloud backend, authentication system, relational database, and Row Level Security.

---

## License

This project is for educational purposes.

---

**PesoTrack**

_Better habits. Brighter future._
