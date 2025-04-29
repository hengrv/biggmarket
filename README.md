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
- npm or yarn
- PostgreSQL database
- Google OAuth credentials (for authentication)

### Setup
1. Clone the repository:
```bash
git clone [https://github.com/hengrv/biggmarket.git]
cd BiggMarket
```

2. Install dependencies:
```bash
npm install
# or
yarn install
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
```

## Running the Application

### Development Mode
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Production Mode
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Project Structure

```
BiggMarket/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── server/              # Backend API and database
│   ├── components/          # Shared React components
│   └── styles/             # Global styles
├── prisma/                  # Database schema and migrations
├── public/                  # Static assets
└── docs/                    # Documentation
```

## Documentation

- [API Documentation](docs/server-api-documentation.md)
- [Frontend Documentation](docs/frontend-documentation.md)
- [Database Schema](prisma/schema.prisma)

## Testing

[TESTING_DOCUMENTATION_PLACEHOLDER]
- Testing methodology
- Test reports
- Manual testing results
- Automated test results

## Team Standards

### Code Style
[CODE_STYLE_PLACEHOLDER]
- ESLint configuration
- Prettier configuration
- TypeScript configuration

### Version Control Workflow
[VERSION_CONTROL_WORKFLOW_PLACEHOLDER]
- Branch naming conventions
- Commit message format
- Pull request process

### Documentation Standards
- All public methods and interfaces must be documented
- Complex logic requires inline comments
- README files in each major directory

## Mapping Criteria

| **Criteria** | **Where to Find It** |
|--------------|----------------------|
| **Team Standards: Cohesion** | [COHESION_DOCUMENTATION_PLACEHOLDER] |
| **Team Standards: Documentation** | `docs/` directory, inline code comments |
| **Team Standards: Version Control Workflow** | [VERSION_CONTROL_DOCUMENTATION_PLACEHOLDER] |
| **Design & Structure** | Project structure above, `src/` directory organization |
| **GUI: Clever and Interesting Design** | `docs/screenshots/` directory |
| **Testing Documentation** | [TESTING_DOCUMENTATION_PLACEHOLDER] |
| **Functionality and Features** | Feature list in `docs/features.md` |

## Screenshots

[Screenshots will be placed in the `docs/screenshots/` directory]

## Features

### Core Features
- User authentication with Google OAuth
- Item listing and management
- Location-based item discovery
- Real-time messaging system
- User profiles and reviews
- Item swapping functionality

### Advanced Features
[ADVANCED_FEATURES_PLACEHOLDER]

## Contributing

[CONTRIBUTION_GUIDELINES_PLACEHOLDER]

## License

[LICENSE_INFORMATION_PLACEHOLDER]

## Team Members
* Lama Mohammed A AlMulla (230361933)
* William Forkes ()
* Henry Groves (230054149)
* Robin Husbands (230458358)
* Teodora Ilic (230497195)
* Dario Labrador Alonso (23041691)
* Guoxin Zhu (23067186)
