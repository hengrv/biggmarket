# BiggMarket - Item Swapping Platform

BiggMarket is a modern web application that allows users to swap items with others to promote responsible consumption and production. The platform features an engaging "swipe left-right" interface, that displays available items based on location. The application also provides a reviewing system, real-time messaging, and reporting system.

Repository URL: https://github.com/hengrv/biggmarket
Live website: https://bigg-market.vercel.app

## Contribution Matrix
- [Contribution Matrix](./docs/contribution-matrix.md)

## Table of Contents

- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Testing](#testing)
- [Team Standards](#team-standards)
- [Mapping Criteria](#mapping-criteria)

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- PostgreSQL database
- Google OAuth credentials (for authentication)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/hengrv/biggmarket.git
cd BiggMarket
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/biggmarket"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. Initialize the database:

```bash
npx prisma db push
# or
pnpm prisma db push
```

## Running the Application

### Development Mode

```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

### Production Mode

```bash
npm run build
npm start
# or
pnpm build
pnpm start
```

## Project Structure

```
BiggMarket/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── app/_components/     # Shared React components
│   ├── server/              # Backend API and database
│   └── styles/              # Global styles
│   └── trpc/                # trpc configuration
│   └── utils/               # utils functions
├── prisma/                  # Database schema and migrations
├── public/                  # Static assets
└── docs/                    # Documentation
```

Each route of the website is defined using a folder under `app/` (for example, `./src/app/home/page.tsx` would be `<url>/home`).

## Documentation

- [API Documentation](docs/server-api-documentation.md)
- [Frontend Documentation](docs/frontend-documentation.md)
- [Database Schema](prisma/schema.prisma)

## Testing

For comprehensive testing documentation, please review our [Testing Report](./docs/testing.md).

Our testing strategy encompasses multiple levels:

- **Integration Testing**: API route testing
- **Manual Testing**: User acceptance testing and exploratory testing


## Team Standards

### Code Style

[Code Style](./docs/code-standards.md) documentation

- [eslint](https://eslint.org/) code styling
- [prettier](https://prettier.io/) code formatting

### Version Control Workflow

For detailed information on our version control strategies, please refer to our [version control workflow document](./docs/version-control-workflow.md)

### Documentation Standards

- All public methods and interfaces must be documented
- Complex logic requires inline comments
- README files in each major directory

## Mapping Criteria

| **Criteria**                                 | **Where to Find It**                                   |
| -------------------------------------------- | ------------------------------------------------------ |
| **Team Standards: Cohesion, Documentation**                 | `docs/code-standards.md`                       |
| **Team Standards: Documentation**            | `docs/` directory & inline code comments               |
| **Team Standards: Version Control Workflow** | `docs/version-control-workflow.md` & See local script in `docs/hooks/pre-commits.git`       |
| **Design & Structure**                       | Project structure above, `src/` directory organization |
| **GUI: Clever and Interesting Design**       | `docs/screenshots/` directory                          |
| **Testing Documentation**                    | `docs/testing.md`                    |
| **Functionality and Features**               | Feature list in `docs/features.md`                     |
| **Server Documentation**               | Feature list in `docs/server-api-documentation.md`                     |
| **Frontend Documentation**               | Feature list in `docs/frontend-documentation.md`                     |



## Screenshots

[Screenshots will be placed in the `docs/screenshots/` directory]

## Features

To see all features implemented in this project, please refer to the [features markdown](./docs/features.md) file

## License

See LICENSE file

## Team Members

- Lama Mohammed A AlMulla (230361933)
- William Forkes (230333572)
- Henry Groves (230054149)
- Robin Husbands (230458358)
- Teodora Ilic (230497195)
- Dario Labrador Alonso (23041691)
- Guoxin Zhu (23067186)
