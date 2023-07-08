<!-- Write an ER diagram using mermaid.js -->

## ER Diagram

```mermaid
erDiagram
    Users ||--o{ Accounts : Own
    Accounts ||--o{ Transactions : "Are the object of"
    Accounts ||--o{ Transfers : "Are the object of"
    Accounts ||--o{ Budgets : "Have"
    Users ||--o{ Categories : Create
    Categories ||--o{ Subcategories : Have
    Categories ||--o{ CategoryBudgets : Have
    Transactions }o--|| Subcategories : "Belong to"

    Users {
        cognito_id VARCHAR PK
    }

    Accounts {
        user_id INT PK
        name VARCHAR
        currency VARCHAR
    }

    Transactions {
        id INT PK
        account_id INT FK
        subcategory_id INT FK
        amount DECIMAL
        timestamp DATETIME
    }

    Transfers {
        id INT PK
        source_account_id INT FK
        destination_account_id INT FK
        amount DECIMAL
        timestamp DATETIME
    }

    Budgets {
        account_id INT FK
        amount DECIMAL
    }

    Categories {
        user INT FK
        name VARCHAR
    }

    Subcategories {
        category INT FK
        name VARCHAR
    }


    CategoryBudgets {
        category INT FK
        amount DECIMAL
    }

```
