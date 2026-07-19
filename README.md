# SinodTech Sales, Inventory & CRM System

This project is a technical assessment submission for the Full-Stack Software Engineer position at SinodTech. It implements a fully functional Sales, Inventory, and CRM system using Laravel (Backend/API) and React (Frontend).

## 🚀 Completed Features

### Phase 1 & 2: Architecture & Database
- Implemented **Service Layer Pattern** for clean controllers.
- Strict **Database-First Approach** with complete migrations and Eloquent relationships.
- Added comprehensive **Database Seeders** and Faker factories to populate test data quickly.

### Phase 3: Sales & Inventory Core Logic
- Built `SalesService` using **Database Transactions (`DB::transaction`)** for robust sale processing.
- Handles race conditions gracefully using `lockForUpdate()`.
- Validates data via `StoreSaleRequest`.
- Dynamically throws custom `InsufficientStockException` on stock overflow.

### Phase 4: CRM Rules & Event-Driven Workflows
- **Lost Customer Detection:** An artisan command (`php artisan crm:detect-lost-customers`) automatically finds customers who have been inactive for 90 days and assigns them an employee.
- **Simulated Re-engagement:** Dispatches a `ReengagementMail` representation when a lost customer is found.
- **Event-Driven KPI Tracking:** Automatically fires a `SaleCompleted` event when a transaction occurs. The `UpdateEmployeeKPI` listener increments the employee's KPI by 10 points if they successfully re-engage a lost customer.

### Phase 5: API Endpoints & Frontend
- **React Frontend:** Built an interactive, single-page application dashboard using React and custom CSS (avoiding Tailwind defaults for a unique aesthetic). Features include POS functionality, Catalog Viewer, Customer Logs, and a KPI leaderboard.
- **E-Commerce REST API:** Developed secure API endpoints using Laravel API Resources (`ProductResource`) to expose clean inventory data (`/api/products`).
- **Invoice Mailer:** Automatically sends an `InvoiceMail` to the customer upon a completed sale via event listeners.

### Phase 6: Finalization & Testing
- Included **Feature Tests** validating core inventory deduction and KPI increment logic using PHPUnit.

---

## 🛠️ Step-by-Step Setup Instructions

### 1. Environment Configuration
Clone the repository and install all dependencies:
```bash
git clone <your-repository-url>
cd laravel-Sales-Inventory-CRM-System
composer install
npm install
```

Copy the `.env.example` to `.env` and set up your application key:
```bash
cp .env.example .env
php artisan key:generate
```

Configure your `.env` for SQLite (default) or MySQL. For testing out of the box, SQLite is recommended:
```env
DB_CONNECTION=sqlite
# Remove other DB_* variables
```
Make sure `database/database.sqlite` exists:
```bash
touch database/database.sqlite
```

Configure Mailtrap in your `.env` for the simulated CRM emails:
```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
```

### 2. Database Migration & Seeding
The application is designed to be fully testable immediately after seeding. Run the following command:
```bash
php artisan migrate:fresh --seed
```
This will populate the database with:
- 10 Employees
- 50 Products
- 100 Customers (approx. 30% flagged as "lost")
- Simulated historical Sales and Sale Items

### 3. Running the Project Locally
To start the backend server, run:
```bash
php artisan serve
```
To start the React frontend compilation via Vite, open a new terminal tab and run:
```bash
npm run dev
```

Visit **`http://localhost:8000/dashboard`** to interact with the POS & CRM interface.

**Admin Login Credentials:**
- **Email:** admin@sinodtech.com
- **Password:** password123

### 4. Running the Tests
To verify the core logic runs correctly, execute the test suite:
```bash
php artisan test
```

### 5. Running CRM Commands
To manually test the Lost Customer Detection command, run:
```bash
php artisan crm:detect-lost-customers
```
