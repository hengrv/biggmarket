# BiggMarket - Item Swapping Platform

BiggMarket is a modern web application that allows users to swap items with others in their local area. The platform features a Tinder-like interface for item discovery, real-time messaging, and location-based matching.

Repository URL: https://github.com/hengrv/biggmarket

## Group Documents

- [Planning Document](https://docs.google.com/document/d/1fKAm-ThGSWcT_wdQAW1xUyvlBsldpEAbiKgfMQTacuw/edit?tab=t.0)
- [Github Commit Conventions](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13)
- [Technical Design](https://newcastle-my.sharepoint.com/:w:/g/personal/c3005414_newcastle_ac_uk/EU-gbdc3oJ1NrAvxX6B8_cUBShfckSblFnh5h4swO6oAAQ?e=mahw2E)
- [Gantt Chart](https://newcastle-my.sharepoint.com/:x:/g/personal/c3049719_newcastle_ac_uk/EZLO5Mt3cWdJij1rsOzIcf4BRksxWHKmKAm6HBRdW9rZJg?e=Z1YbPS)

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
│   ├── server/              # Backend API and database
│   ├── components/          # Shared React components
│   └── styles/              # Global styles
│   └── trpc/                # trpc configuration
│   └── utils/               # utils functions
├── prisma/                  # Database schema and migrations
├── public/                  # Static assets
└── docs/                    # Documentation
```

## Documentation

- [API Documentation](docs/server-api-documentation.md)
- [Frontend Documentation](docs/frontend-documentation.md)
- [Database Schema](prisma/schema.prisma)

## Testing

For comprehensive testing documentation, please review our [Testing Report](docs/testing.md).

Our testing strategy encompasses multiple levels:

- **Integration Testing**: API route testing
- **Manual Testing**: User acceptance testing and exploratory testing


## Team Standards

### Code Style

[Code Style](code-standards.md) documentation

- [eslint](https://eslint.org/) code styling
- [prettier](https://prettier.io/) code formatting

### Version Control Workflow

[VERSION_CONTROL_WORKFLOW_PLACEHOLDER]

- Branch naming conventions
- Commit message format
- Pull request process
- Pre commit hooks

### Documentation Standards

- All public methods and interfaces must be documented
- Complex logic requires inline comments
- README files in each major directory

## Mapping Criteria

| **Criteria**                                 | **Where to Find It**                                   |
| -------------------------------------------- | ------------------------------------------------------ |
| **Team Standards: Cohesion**                 | [COHESION_STANDARDS_PLACEHOLDER]                       |
| **Team Standards: Documentation**            | `docs/` directory & inline code comments               |
| **Team Standards: Version Control Workflow** | See local script in `docs/hooks/pre-commits.git`       |
| **Design & Structure**                       | Project structure above, `src/` directory organization |
| **GUI: Clever and Interesting Design**       | `docs/screenshots/` directory                          |
| **Testing Documentation**                    | [TESTING_DOCUMENTATION_PLACEHOLDER]                    |
| **Functionality and Features**               | Feature list in `docs/features.md`                     |

## Screenshots

[Screenshots will be placed in the `docs/screenshots/` directory]

## Features

To see all features implemented in this project, please refer to the [features markdown](docs/features.md) file

## License

[LICENSE_INFORMATION_PLACEHOLDER]

## Team Members

- Lama Mohammed A AlMulla (230361933)
- William Forkes (230333572)
- Henry Groves (230054149)
- Robin Husbands (230458358)
- Teodora Ilic (230497195)
- Dario Labrador Alonso (23041691)
- Guoxin Zhu (23067186)
