# Northcoders News API

## Getting Started

To run this project locally, you will need to set up environment variables for connecting to the databases. These variables are stored in `.env` files, which are not included in the repository for security reasons.

### Setting Up Environment Variables

1. **Create `.env` Files**

   You need to create the following `.env` files in the root of your project:

   - `.env.development`
   - `.env.test`

2. **Add Environment Variables**

   Each `.env` file should contain the environment variables for connecting to the databases. Below is an example for the `.env.development` file:

   ````plaintext
   DB_NAME=your_database_name

   Depending on your database setup, you may also need to add user credentials to your `.env.development` files such as:

   ```plantext
      DB_PASSWORD=your_database_password
   ````

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
