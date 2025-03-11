# Sugar Tracker

A web application for tracking sugar and nutrient intake, built with SvelteKit and Neon Database.

## Features

- **Comprehensive Nutrient Tracking**: Monitor sugar, carbohydrates, proteins, fats, vitamins, and minerals
- **User-Friendly Food Logging**: Quickly search and log foods from the extensive USDA database
- **Personalized Dashboard**: View your nutrition trends with intuitive charts and visualizations
- **Goal Setting**: Set and track custom nutrition goals
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Svelte and TailwindCSS
- **Database**: [Neon Database](https://neon.tech/) (Serverless PostgreSQL)
- **API**: [USDA FoodData Central API](https://fdc.nal.usda.gov/api-guide.html)
- **Authentication**: JWT-based authentication

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- USDA API Key (get it from [FoodData Central](https://fdc.nal.usda.gov/api-key-signup.html))
- Neon Database account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/sugar-tracker.git
   cd sugar-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with the following:

   ```
   USDA_API_KEY=your_usda_api_key
   DATABASE_URL=your_neon_database_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser

### Database Setup

The application uses Neon Database for serverless PostgreSQL:

1. Create an account at [Neon](https://neon.tech/)
2. Create a new project and get your connection string
3. Add the connection string to your `.env` file
4. Run the database initialization script:
   ```bash
   npm run setup-db
   ```

## Database Connection

This application uses the `@neondatabase/serverless` package with connection pooling to optimize database performance.

### Benefits of Connection Pooling:

1. **Improved Performance**: Reuses connections instead of creating new ones for each query
2. **Resource Efficiency**: Reduces the overhead of establishing connections
3. **Scalability**: Handles multiple concurrent requests better
4. **Connection Management**: Automatically manages connections lifecycle

### Implementation:

The database connection is established in `src/lib/db.js` using a connection pool. Each database operation:

1. Acquires a client from the pool
2. Executes the query
3. Releases the client back to the pool

### Environment Variables:

Create a `.env` file with the following variables:

```
DATABASE_URL=postgres://username:password@your-neon-db-url/database
JWT_SECRET=your-secret-key-here
```

## Project Structure

```
sugar-tracker/
├── src/
│   ├── components/      # Reusable Svelte components
│   ├── routes/          # Application pages/routes
│   ├── lib/             # Utility functions and shared code
│   ├── stores/          # Svelte stores for state management
│   └── services/        # API and database service interfaces
├── static/              # Static assets
├── tests/               # Test files
├── .env                 # Environment variables (not committed)
└── ...config files
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in HTTP-only cookies for security.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- USDA FoodData Central for providing the comprehensive food database
- Neon Database for serverless PostgreSQL hosting
- Svelte and TailwindCSS communities for the excellent tools and documentation
