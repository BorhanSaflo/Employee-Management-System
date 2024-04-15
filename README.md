# Employee-Management-System

An Employee Management System application built with React and Next.js to help businesses in keeping track of employee data.

## Getting Started

To get the project up and running on your local machine, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/BorhanSaflo/Employee-Management-System.git
   cd Employee-Management-System
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the necessary environment variables:

   ```plaintext
    # Prisma
    DATABASE_URL=

    # Next Auth
    NEXTAUTH_SECRET=
    NEXTAUTH_URL=

    # Next Auth Google Provider
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits.

## Scripts

Here are some of the commands you can use in this project:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production usage.
- `npm run start`: Runs the built app in production mode.
- `npm run lint`: Runs ESLint to check for lint errors.

## License

Distributed under the GPL-3.0 License. See `LICENSE` for more information.