# API Endpoints

The application exposes the following API endpoints:

### Authentication

#### 1. Register User

*   **URL:** `/api/auth/register`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    {
        "email": "user@example.com",
        "password": "yourpassword"
    }
    ```
*   **Response (Success - 201 Created):**
    ```json
    {
        "message": "User registered successfully"
    }
    ```
*   **Response (Error - 400 Bad Request):**
    ```json
    {
        "error": "User with this email already exists"
    }
    ```
*   **Response (Error - 500 Internal Server Error):**
    ```json
    {
        "error": "Error registering user"
    }
    ```

#### 2. Login User

*   **URL:** `/api/auth/login`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    {
        "email": "user@example.com",
        "password": "yourpassword"
    }
    ```
*   **Response (Success - 200 OK):**
    ```json
    {
        "message": "Login successful",
        "user": {
            "id": "user-id",
            "email": "user@example.com"
        }
    }
    ```
    (Note: A session cookie will also be set for authentication.)
*   **Response (Error - 401 Unauthorized):**
    ```json
    {
        "error": "Invalid credentials"
    }
    ```
*   **Response (Error - 500 Internal Server Error):**
    ```json
    {
        "error": "Error logging in"
    }
    ```

#### 3. Logout User

*   **URL:** `/api/auth/logout`
*   **Method:** `POST`
*   **Request Body:** None
*   **Response (Success - 200 OK):**
    ```json
    {
        "message": "Logout successful"
    }
    ```
*   **Response (Error - 500 Internal Server Error):**
    ```json
    {
        "error": "Error logging out"
    }
    ```

### Expenses

#### 1. Get All Expenses

*   **URL:** `/api/expenses`
*   **Method:** `GET`
*   **Request Body:** None
*   **Response (Success - 200 OK):**
    ```json
    [
        {
            "id": "expense-id-1",
            "amount": 50.00,
            "category": "Food",
            "date": "2025-10-06T10:00:00.000Z",
            "userId": "user-id"
        },
        {
            "id": "expense-id-2",
            "amount": 25.50,
            "category": "Transport",
            "date": "2025-10-05T15:30:00.000Z",
            "userId": "user-id"
        }
    ]
    ```
*   **Response (Error - 401 Unauthorized):**
    ```json
    {
        "error": "Unauthorized"
    }
    ```
*   **Response (Error - 500 Internal Server Error):**
    ```json
    {
        "error": "Error fetching expenses"
    }
    ```

#### 2. Add New Expense

*   **URL:** `/api/expenses/add`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    {
        "amount": 75.20,
        "category": "Shopping",
        "date": "2025-10-06T12:00:00.000Z"
    }
    ```
*   **Response (Success - 201 Created):**
    ```json
    {
        "message": "Expense added successfully",
        "expense": {
            "id": "new-expense-id",
            "amount": 75.20,
            "category": "Shopping",
            "date": "2025-10-06T12:00:00.000Z",
            "userId": "user-id"
        }
    }
    ```
*   **Response (Error - 401 Unauthorized):**
    ```json
    {
        "error": "Unauthorized"
    }
    ```
*   **Response (Error - 500 Internal Server Error):**
    ```json
    {
        "error": "Error adding expense"
    }
    ```

#### 3. Get, Update, or Delete Specific Expense

*   **URL:** `/api/expenses/[id]` (where `[id]` is the expense ID)
*   **Methods:** `GET`, `PUT`, `DELETE`

##### GET Request

*   **Method:** `GET`
*   **Request Body:** None
*   **Response (Success - 200 OK):**
    ```json
    {
        "id": "expense-id",
        "amount": 50.00,
            "category": "Food",
        "date": "2025-10-06T10:00:00.000Z",
        "userId": "user-id"
    }
    ```
*   **Response (Error - 404 Not Found):**
    ```json
    {
        "error": "Expense not found"
    }
    ```
*   **Response (Error - 401 Unauthorized):**
    ```json
    {
        "error": "Unauthorized"
    }
    ```
*   **Response (Error - 500 Internal Server Error):**
    ```json
    {
        "error": "Error fetching expense"
    }
    ```

##### PUT Request (Update Expense)

*   **Method:** `PUT`
*   **Request Body:**
    ```json
    {
        "amount": 55.00,
        "category": "Groceries",
        "date": "2025-10-06T10:00:00.000Z"
    }
    ```
    (Provide only the fields you want to update)
*   **Response (Success - 200 OK):**
    ```json
    {
        "message": "Expense updated successfully",
        "expense": {
            "id": "expense-id",
            "amount": 55.00,
            "category": "Groceries",
            "date": "2025-10-06T10:00:00.000Z",
            "userId": "user-id"
        }
    }
    ```
*   **Response (Error - 404 Not Found):**
    ```json
    {
        "error": "Expense not found"
    }
    ```
*   **Response (Error - 401 Unauthorized):**
    ```json
    {
        "error": "Unauthorized"
    }
    ```
*   **Response (Error - 500 Internal Server Error):**
    ```json
    {
        "error": "Error updating expense"
    }
    ```

##### DELETE Request (Delete Expense)

*   **Method:** `DELETE`
*   **Request Body:** None
*   **Response (Success - 200 OK):**
    ```json
    {
        "message": "Expense deleted successfully"
    }
    ```
*   **Response (Error - 404 Not Found):**
    ```json
    {
        "error": "Expense not found"
    }
    ```
*   **Response (Error - 401 Unauthorized):**
    ```json
    {
        "error": "Unauthorized"
    }
    ```
*   **Response (Error - 500 Internal Server Error):**
    ```json
    {
        "error": "Error deleting expense"
    }
    ```