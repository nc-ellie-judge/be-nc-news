# Northcoders News API 🗞️

## Overview

Welcome to the Northcoders News API project! 🥳

This API was built to access application data programmatically, similar to backend services used by platforms like Reddit. It allows for the interaction with a PostgreSQL database using Node.js and node-postgres.
The intention here is to mimic the building of a real world backend service (such as Reddit) which will provide information to the frontend architecture.

## Hosted Version

You can access the hosted version of this API [here](https://be-nc-news-rht5.onrender.com/).

To see a list of the different endpoints available go [here](https://be-nc-news-rht5.onrender.com/api).

## Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

Ensure you have the following versions installed:

- **Node.js**: Minimum version 12.x
- **PostgreSQL**: Minimum version 12.x

### Installation

1. **Clone the Repository and Install Dependencies**

   ```bash
   git clone https://github.com/northcoders/be-nc-news.git
   cd be-nc-news
   npm install
   ```

## Getting Started

To run this project locally, you will need to set up environment variables for connecting to the databases. These variables are stored in `.env` files, which are not included in the repository for security reasons.

### Setting Up Environment Variables

2. **Create `.env` Files**

   You need to create the following `.env` files in the root of your project:

   - `.env.development`
   - `.env.test`
   - `.env.production`

3. **Add Environment Variables**

   Each `.env` file should contain the environment variables for connecting to the databases. Below is an example for the `.env.development` file:

   ```plaintext
   DB_NAME=your_database_name
   ```

   Depending on your database setup, you may also need to add user credentials to your `.env.development` files such as:

   ```plantext
      DB_PASSWORD=your_database_password
   ```

4. **Database Setup**

Run the following scripts to set up and seed your databases:

```bash
npm run setup-dbs
npn run seed
npm run seed-prod
```

5. **To Start the App**

```bash
npm start
```

You should see "Listening on 9090... 🥳" in your CLI.

6. **To Run the Tests**

Run the following script to set up your databases:

```bash
npm test
```

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)

---
