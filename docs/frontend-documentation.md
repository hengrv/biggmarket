# Frontend Documentation

## Middleware

### `middleware.ts`
The middleware handles authentication and route protection for the application:
- Checks if the user is authenticated using NextAuth.js
- Defines public routes that don't require authentication (`/login`, `/api/auth`, `/api/uploadthing`)
- Redirects unauthenticated users to the login page when accessing protected routes
- Redirects authenticated users to the home page when accessing the login page
- Excludes certain paths from middleware processing (API routes, static files, images, favicon)

## Core Components

### `app-shell.tsx`
The main application shell component that provides the basic layout structure:
- **Props**:
  - `children`: React nodes to be rendered in the main content area
  - `activeScreen`: Currently active screen for navigation highlighting
  - `title`: Optional header title
  - `showBackButton`: Toggle for back button visibility
  - `onBack`: Callback for back button click
  - `rightContent`: Optional content to display on the right side of the header
- **Features**:
  - Responsive dark theme layout
  - App logo in header
  - Optional back button
  - Title display
  - Bottom navigation integration
  - Main content area with overflow handling

### `bottom-navigation.tsx`
The bottom navigation bar component for app navigation:
- **Props**:
  - `activeScreen`: Currently active screen for highlighting
- **Navigation Items**:
  - Home
  - Wishlist (Swap)
  - Messages
  - Profile
- **Features**:
  - Fixed position at bottom of screen
  - Active state highlighting
  - Icon and label for each navigation item
  - Smooth transitions
  - Responsive layout

### `loading-spinner.tsx`
A reusable loading spinner component:
- Simple animated loading indicator
- Used across the application for loading states

### `loading.tsx`
A full-page loading component:
- Used during page transitions and initial loads
- Provides a consistent loading experience

### `upload-button.tsx`
A specialized upload component for profile images:
- **Features**:
  - Integration with UploadThing for file uploads
  - Loading states during upload
  - Error handling and display
  - Automatic profile update after successful upload
  - Progress indication
- **Props**:
  - None (self-contained component)
- **State Management**:
  - Tracks upload progress
  - Handles upload errors
  - Manages profile update status

## Component Directories

### `_components/screens/`
Contains screen-specific components for different views of the application.

### `_components/profile/`
Contains components specific to the user profile functionality.

### `_components/item/`
Contains components related to item display and management.

## Page Structure

The application follows a Next.js 13+ app directory structure:

- `/app`: Main application directory
  - `layout.tsx`: Root layout component
  - `page.tsx`: Home page component
  - `middleware.ts`: Authentication middleware
  - `_components/`: Shared components
  - `api/`: API route handlers
  - `login/`: Authentication pages
  - `profile/`: User profile pages
  - `item/`: Item-related pages
  - `messages/`: Messaging interface
  - `swap/`: Item swapping interface
  - `search/`: Search functionality
  - `unauthorised/`: Unauthorized access pages
  - `forbidden/`: Access denied pages

## Theme and Styling

The application uses a dark theme with the following color scheme:
- Background: `#1a1a1a`
- Text: `#f3f3f3`
- Accent: `#c1ff72`
- Borders: `#242424`
- Secondary Text: `#a9a9a9`

Components use Tailwind CSS for styling with custom color configurations and responsive design patterns. 