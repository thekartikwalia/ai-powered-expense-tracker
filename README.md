# AI-Powered Expense Tracker

### **Step 1: Project Setup**

- [x] Decide project structure (monolithic: frontend + backend in same repo)
- [ ] Initialize a Next.js project with TypeScript support
- [ ] Install all required dependencies (Prisma, PostgreSQL driver, zod, shadcn UI, etc.)
- [ ] Set up project folder structure: `pages/`, `components/`, `services/`, `prisma/`, `utils/`
- [ ] Configure `.env` for database, Gemini CLI path, API keys, JWT secret
- [ ] Set up TypeScript aliases and linting/formatter for clean code


## LLD Design
![UML Diagram](./UML-Diagram.png)

## Project Development Steps Overview

### **Step 1: Project Setup**
- [x] Decide project structure (monolithic: frontend + backend in same repo).
- [ ] Initialize a Next.js project with TypeScript support.
- [ ] Install all required dependencies (Prisma, PostgreSQL driver, zod, shadcn UI, etc.).
- [ ] Set up project folder structure: `pages/`, `components/`, `services/`, `prisma/`, `utils/`.
- [ ] Configure `.env` for database, Gemini CLI path, API keys, JWT secret.
- [ ] Set up TypeScript aliases and linting/formatter for clean code.

### **Step 2: Database Setup**

2.1 Install and configure PostgreSQL (locally or via Docker).
2.2 Define Prisma schema based on LLD: `User`, `Expense`, `Category`, `Report`.
2.3 Define relationships in Prisma (1-to-many, 1-to-1).
2.4 Run Prisma migrations to create tables in PostgreSQL.
2.5 Seed initial data for categories and optional demo users.
2.6 Test database connection with a simple Prisma client script.

### **Step 3: Authentication System**

3.1 Create User model in Prisma with fields from LLD.
3.2 Implement registration endpoint: validate input, hash password.
3.3 Implement login endpoint: verify password, issue JWT token.
3.4 Create authentication middleware to protect API routes.
3.5 Build frontend pages for login and signup, integrating forms with backend.
3.6 Implement logout functionality and store JWT securely (cookies or localStorage).

### **Step 4: Expense CRUD**

4.1 Create Expense model in Prisma with fields from LLD.
4.2 Implement backend CRUD API routes (create, read, update, delete).
4.3 Validate input using zod schemas.
4.4 Implement ExpenseService for business logic: calculate total, assign category.
4.5 Build frontend Add Expense form and Expense List table.
4.6 Enable editing and deleting of expenses from frontend.
4.7 Add pagination, filtering, and search functionality.

### **Step 5: Category Management**

5.1 Create Category model in Prisma and establish relation with Expense.
5.2 Seed predefined categories (Food, Travel, Rent, Utilities, Others).
5.3 Backend: implement assignCategoryAI in ExpenseService to call AIService.
5.4 Frontend: show dropdown with existing categories and optional AI suggestion.
5.5 Ensure category changes are reflected in expenses and reports.

### **Step 6: AI Integration**

6.1 Create AIService wrapper to interact with Gemini CLI.
6.2 Implement methods:

* categorizeExpense
* analyzeSpending
* generateBudgetAdvice
* detectAnomalies
* summarizeExpenses
  6.3 Integrate AIService into ExpenseService and ReportGenerator where needed.
  6.4 Test AI prompts with sample expenses and verify outputs.
  6.5 Handle errors and fallback logic if AI service fails.

### **Step 7: Report Generation**

7.1 Create Report model in Prisma with fields from LLD.
7.2 Implement ReportGenerator service: generate weekly/monthly reports.
7.3 Include AI-powered insights in reports: spending trends, anomalies, budget advice.
7.4 Implement export functionality: CSV and PDF.
7.5 Frontend: design dashboard page showing reports with charts and export buttons.
7.6 Connect report generation to backend API routes.

### **Step 8: Frontend UI**

8.1 Use Shadcn UI or Tailwind for consistent design system.
8.2 Build pages: Login, Signup, Dashboard, Add Expense, Expense List, Reports.
8.3 Connect frontend forms and components to backend API routes.
8.4 Display AI-generated insights visually: pie charts, bar charts, text summaries, alerts.
8.5 Ensure responsive design and accessibility.
8.6 Implement state management (React Context or Zustand) for user sessions and data.

### **Step 9: Testing**

9.1 Write unit tests for services: ExpenseService, AIService, ReportGenerator.
9.2 Write integration tests for API routes using Supertest or Axios.
9.3 Test AI responses with mock data to ensure reliability.
9.4 Test frontend components: forms, tables, dashboards.
9.5 Fix bugs and verify end-to-end functionality.

### **Step 10: Deployment**

10.1 Prepare production build of Next.js app.
10.2 Connect to managed PostgreSQL instance (Supabase, Railway, AWS RDS).
10.3 Configure environment variables securely for production.
10.4 Deploy app on Vercel or Render.
10.5 Optional: Set up GitHub Actions for CI/CD automation.
10.6 Test live app for correctness and performance.

### **Step 11: Documentation**

11.1 Create `/docs/` folder in project root.
11.2 Document AI prompts and expected responses.
11.3 Include architecture diagrams, Mermaid LLD diagram, and system overview.
11.4 Document API endpoints: request/response formats.
11.5 Write README with project overview, features, setup instructions, and usage.
11.6 Prepare screenshots and demo instructions for submission or presentation.

If you want, I can **also create a visual checklist table** for all these mini-steps so you can literally tick off each sub-step while building. It’ll make project execution super organized.

Do you want me to do that next?
