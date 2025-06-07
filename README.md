# Loan Management System

This is a simple web application for managing loans and recording payments against them. It consists of a Spring Boot backend API and a React frontend.

## Features

* **Loan Creation:** Add new loans with details like borrower name, principal amount, interest rate, term, and start date.
* **Loan Listing:** View all existing loans, displaying their current status (active, paid, etc.), outstanding principal, and other key details.
* **Payment Recording:** Record payments against existing loans, which automatically updates the outstanding principal and loan status.
* **Loan Details (Future/Optional):** (If you decide to re-implement the Loan Detail page, this will become active again) View comprehensive details of a single loan, including its payment history.

## Technologies Used

### Backend
* **Spring Boot:** Framework for building robust, stand-alone, production-ready Spring applications.
* **Spring Data JPA:** Simplifies data access using JPA (Java Persistence API) and Hibernate.
* **H2 Database:** An in-memory relational database used for development and testing. (You can easily switch to PostgreSQL, MySQL, etc., for production).
* **Lombok:** Reduces boilerplate code (getters, setters, constructors).
* **Jackson:** For JSON serialization/deserialization.
* **Maven:** Build automation tool.

### Frontend
* **React:** A JavaScript library for building user interfaces.
* **Vite:** A fast build tool that provides a rapid development environment for React.
* **JavaScript (ES6+)**
* **CSS**
* **Fetch API:** For making HTTP requests to the backend.

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

* **Java Development Kit (JDK) 17 or higher:** [Download from Oracle](https://www.oracle.com/java/technologies/downloads/) or your preferred distribution (e.g., OpenJDK).
* **Maven 3.6.0 or higher:** [Download Maven](https://maven.apache.org/download.cgi)
* **Node.js 18.x or higher:** [Download Node.js](https://nodejs.org/en/download/) (includes npm).
* **Git:** [Download Git](https://git-scm.com/downloads) (if cloning from a repository).

### 1. Clone the Repository (if applicable)

If your code is in a Git repository, clone it:

```bash
git clone <your-repository-url>
cd loan-managemt # Or whatever your root project folder is named
