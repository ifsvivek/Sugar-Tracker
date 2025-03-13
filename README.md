# Sugar Tracker

A modern web application to help users monitor and manage their daily sugar intake.

## Overview

Sugar Tracker is a feature-rich application built with Svelte that allows users to:

- Track daily sugar and nutrient consumption
- Set personalized nutrition goals
- Search for food items using USDA FoodData Central API
- Visualize eating habits with interactive charts
- Monitor progress with weekly and monthly trends

## Features

- **User Authentication**: Secure login and registration system
- **Food Logging**: Search and log foods with their nutritional data
- **Dashboard**: Real-time nutritional overview with insights
- **Goal Setting**: Set and track nutrition goals
- **Data Visualization**: Interactive charts showing consumption trends
- **Mobile Responsive**: Fully responsive design for all devices
- **Personalized Recommendations**: Tips based on consumption patterns
- **Weekly & Monthly Reports**: Track your progress over time
- **Multi-nutrient Tracking**: Monitor carbs, proteins, fats, and fiber alongside sugar

## Tech Stack

- **Frontend**: Svelte, TailwindCSS
- **Backend**: SvelteKit with endpoints
- **Database**: PostgreSQL
- **API Integration**: USDA FoodData Central API
- **Visualization**: Chart.js
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- USDA FoodData Central API key (obtain from [https://fdc.nal.usda.gov/api-key-signup.html](https://fdc.nal.usda.gov/api-key-signup.html))

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/sugar-tracker.git
cd sugar-tracker
```

2. Install dependencies

```bash
npm install
```

3. Create a .env file in the root directory with the following variables:

```
POSTGRES_URL=postgresql://username:password@localhost:5432/sugar_tracker
USDA_API_KEY=your_api_key_here
JWT_SECRET=your_secret_key
```

4. Set up the database

```bash
psql -U postgres -f schema.sql
```

5. Start the development server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser to see the application.

## Project Structure

```
sugar-tracker/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── dashboard/        # Dashboard-specific components
│   │   │   └── charts/       # Chart components for data visualization
│   ├── lib/                  # Library code & utilities
│   │   ├── api/              # API interaction helpers
│   │   ├── auth/             # Authentication utilities
│   │   ├── db/               # Database utilities
│   │   └── utils/            # Helper functions
│   ├── routes/               # SvelteKit routes
│   │   ├── api/              # API endpoints
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── foods/        # Food & nutrition endpoints
│   │   │   └── goals/        # Nutrition goals endpoints
│   │   ├── dashboard/        # Dashboard pages
│   │   ├── login/            # Authentication pages
│   │   └── register/         # Registration pages
│   └── app.html              # Main HTML template
├── static/                   # Static assets
├── schema.sql                # Database schema
└── package.json              # Project dependencies
```

## Development Guidelines

### Component Structure

Components follow a modular structure with clear separation of concerns:

- Presentation components focus on UI display
- Container components handle data and business logic
- Utility functions keep logic reusable and testable

### Naming Conventions

- Components: PascalCase (e.g., `FoodLogForm.svelte`)
- Functions, variables: camelCase (e.g., `calculateNutrientTotal`)
- Database tables: snake_case (e.g., `food_logs`)

### CSS Styling

Tailwind CSS is used for styling with some custom utilities defined in `app.css`.

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with default SvelteKit settings

### Database Setup

1. Create PostgreSQL database in your preferred hosting (e.g., Vercel Postgres)
2. Run schema migration using the provided `schema.sql`
3. Update the `POSTGRES_URL` environment variable

## Usage

1. Create an account or log in
2. Set your daily nutrition goals
3. Search for and log foods you consume
4. View your progress on the dashboard
5. Analyze trends and adjust your diet accordingly

## Acknowledgments

- USDA FoodData Central for providing nutrition data
- Chart.js for powerful visualization tools
- TailwindCSS for the sleek UI design
- SvelteKit for the excellent developer experience
