# Server API Documentation

## Database Configuration

### `db.ts`
The database configuration file sets up the Prisma client with appropriate logging levels based on the environment. It uses a singleton pattern to ensure only one instance of the Prisma client is created.

## Authentication

### `auth/config.ts`
The authentication configuration file sets up NextAuth.js with:
- Google OAuth provider
- Prisma adapter for database integration
- Custom session handling
- Username generation for new users

## API Routers

### User Router (`user.ts`)

#### `getCurrentlyAuthenticatedUser`
- **Description**: Returns the ID of the currently authenticated user
- **Access**: Protected
- **Returns**: User ID string

#### `getProfile`
- **Description**: Retrieves a user's profile information
- **Access**: Protected
- **Parameters**: 
  - `userId` (optional): User ID to fetch
  - `username` (optional): Username to fetch
- **Returns**: User profile with location information

#### `updateProfile`
- **Description**: Updates the current user's profile information
- **Access**: Protected
- **Parameters**: 
  - `image`: Profile image URL
  - `email`: Email address
  - `name`: Display name
  - `username`: Username
  - `location`: Location object with postcode and coordinates
- **Returns**: Updated user profile

#### `addProfileReview`
- **Description**: Adds a review for a user
- **Access**: Protected
- **Parameters**:
  - `userId`: ID of user being reviewed
  - `review`: Review text
  - `rating`: Rating value
- **Returns**: Created review object

#### `getProfileReviews`
- **Description**: Retrieves all reviews for a user
- **Access**: Protected
- **Parameters**:
  - `userId` (optional): User ID to fetch reviews for
- **Returns**: Array of reviews with reviewer information

#### `getAverageRating`
- **Description**: Calculates average rating for a user
- **Access**: Protected
- **Parameters**:
  - `userId` (optional): User ID to calculate rating for
- **Returns**: Object with average rating and review count

#### `postcodeToLongLat`
- **Description**: Converts UK postcode to latitude and longitude coordinates
- **Access**: Protected
- **Parameters**:
  - `postcode`: UK postcode string
- **Returns**: Object with latitude and longitude

### Item Router (`item.ts`)

#### `createItem`
- **Description**: Creates a new item listing
- **Access**: Protected
- **Parameters**:
  - `title`: Item title
  - `images`: Array of image URLs
  - `description`: Item description
  - `category`: Item category
  - `status`: Item status (optional)
- **Returns**: Created item with user information

#### `updateItem`
- **Description**: Updates an existing item
- **Access**: Protected
- **Parameters**:
  - `id`: Item ID
  - `data`: Partial item data to update
- **Returns**: Updated item

#### `deleteItem`
- **Description**: Deletes an item
- **Access**: Protected
- **Parameters**:
  - `id`: Item ID
- **Returns**: Success status

#### `getUserItems`
- **Description**: Retrieves items belonging to a user
- **Access**: Protected
- **Parameters**:
  - `userId` (optional): User ID to fetch items for
  - `status` (optional): Filter by item status
- **Returns**: Array of items with user and count information

#### `getItemById`
- **Description**: Retrieves a specific item by ID
- **Access**: Protected
- **Parameters**:
  - `id`: Item ID
- **Returns**: Item with user and count information

#### `toggleItemVisibility`
- **Description**: Toggles an item's visibility status
- **Access**: Protected
- **Parameters**:
  - `id`: Item ID
- **Returns**: Updated item

### Message Router (`message.ts`)

#### `sendMessage`
- **Description**: Sends a message between users
- **Access**: Protected
- **Parameters**:
  - `senderId`: Sender's user ID
  - `receiverId`: Receiver's user ID
  - `message`: Message content
- **Returns**: Created message

#### `getChatMessages`
- **Description**: Retrieves messages for a specific chat
- **Access**: Protected
- **Parameters**:
  - `chatId`: Chat ID
- **Returns**: Array of messages

#### `getUserChats`
- **Description**: Retrieves all chats for a user
- **Access**: Protected
- **Parameters**:
  - `userId`: User ID
- **Returns**: Array of chats with latest message

#### `deleteMessage`
- **Description**: Deletes a specific message
- **Access**: Protected
- **Parameters**:
  - `messageId`: Message ID
- **Returns**: Success status

### Algorithm Router (`algorithm.ts`)

#### `getItemsByDistance`
- **Description**: Retrieves items sorted by distance from user's location
- **Access**: Protected
- **Parameters**:
  - `latitude`: User's latitude
  - `longitude`: User's longitude
- **Returns**: Array of items with distance information

### Transaction Router (`transaction.ts`)

#### `ping`
- **Description**: Simple health check endpoint
- **Access**: Public
- **Returns**: "Pong" message 