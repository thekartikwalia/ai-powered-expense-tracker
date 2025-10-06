# Expense Tracker

## Project Overview

The Expense Tracker is a full-stack application designed to help users manage their personal expenses. It provides functionalities for user authentication (login, registration, logout), adding new expenses, viewing a list of all expenses, and retrieving/updating/deleting specific expenses. The application is built with Next.js for the frontend and API routes, and Prisma as the ORM for database interactions.

## Features

*   User Authentication (Register, Login, Logout)
*   Add new expenses with details like amount, category, and date.
*   View a list of all recorded expenses.
*   Retrieve, update, and delete individual expense records.

## Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn
*   A PostgreSQL database (or other database supported by Prisma)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd expense-tracker
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your database connection string:
    ```
    DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
    ```
    Replace the placeholder with your actual database connection string.

4.  **Run Prisma Migrations:**
    Apply the database schema:
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Seed the database (Optional):**
    If you have a `seed.ts` file, you can run it to populate your database with initial data:
    ```bash
    npx prisma db seed
    ```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

Once the development server is running, you can access the application in your browser.

*   **Register:** Navigate to `/signup` to create a new account.
*   **Login:** Navigate to `/login` to log in with your credentials.
*   **Dashboard/Expenses:** After logging in, you can navigate to `/dashboard` or `/expenses` to manage your expenses.

## API Endpoints

For detailed information on API endpoints, please refer to [API Endpoints Documentation](./docs/api-endpoints.md).

## Project Development Steps Overview

For a detailed overview of the project development steps, please refer to [Development Steps Documentation](./docs/development-steps.md).## LLD Design

For the Low-Level Design (LLD) of the project, please refer to [LLD Design Documentation](./docs/lld-design.md).
