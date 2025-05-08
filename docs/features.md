# BiggMarket Features Documentation

## Core Features

### Authentication & User Management
- **Google OAuth Integration**
  - Secure user authentication using Google accounts
  - Automatic profile creation with email verification
  - Unique username generation based on email

- **User Profiles**
  - Customizable profile information
  - Profile image upload and management
  - Location settings with postcode validation
  - User rating and review system

### Item Management
- **Item Listing**
  - Create and manage item listings
  - Multiple image upload support
  - Detailed item descriptions
  - Category organization
  - Item status tracking (Available, Swapped, Hidden)

- **Item Discovery**
  - Location-based item suggestions
  - Distance-based sorting
  - Category filtering
  - Search functionality

### Swapping System
- **Match Algorithm**
  - Tinder-like swipe interface
  - Location-based matching
  - Mutual interest detection
  - Match notifications

- **Swap Management**
  - Track swap status
  - Swap history
  - Swap confirmation system
  - User feedback after swaps

### Messaging System
- **Real-time Chat**
  - Instant messaging between matched users
  - Chat history preservation
  - Message notifications
  - Chat list management

- **Chat Features**
  - Message deletion
  - Chat organization
  - Latest message preview
  - Unread message indicators

### User Interaction
- **Review System**
  - User rating after swaps
  - Written reviews
  - Average rating calculation
  - Review history

- **Profile Management**
  - Profile customization
  - Location updates
  - Username changes
  - Profile visibility settings

## Advanced Features

### Location Services
- **Postcode Integration**
  - UK postcode validation
  - Automatic coordinate conversion
  - Distance calculation between users
  - Location-based filtering
  
### User Experience
- **Responsive Design**
  - Mobile-first approach
  - Dark theme implementation
  - Smooth animations
  - Intuitive navigation

- **Loading States**
  - Skeleton loading
  - Progress indicators
  - Error handling
  - Success notifications

### Security Features
- **Authentication**
  - Protected routes
  - Session management
  - Secure API endpoints
  - Role-based access control

- **Data Protection**
  - Input validation
  - Error handling
  - Secure file uploads
  - Data sanitization

### Performance Optimizations
- **Image Handling**
  - Image optimization
  - Lazy loading
  - Responsive images
  - Upload progress tracking

- **Data Management**
  - Efficient database queries
  - Caching strategies
  - Pagination
  - Data prefetching

### Technical Features
- **Modern Stack**
  - Next.js 13+ with App Router
  - TypeScript for type safety
  - Prisma for database management
  - tRPC for type-safe API

- **Development Tools**
  - ESLint for code quality
  - Prettier for code formatting
  - Git hooks for code validation
  - Automated testing setup

## Future Enhancements
- Push notifications
- In-app video calling
- Item categories expansion
- Advanced search filters
- Social media integration
- Item recommendation system
- User verification system
- Premium features 

## Functional Requirements (F):
### F1.1 User can create an account, with their details stored in the database.
* To create their account or log in, users can use their Google account details. The user's details are then stored in the database.

  Please see:
  [Log-in Screen Capture](//docs/screenshots/Log%20in%20Screen.png)

### F1.2 Users can edit their profile and settings.
* Once the users are logged in, they can access their profiles and add or edit their profile picture.
* The user can also edit their Full Name, Username, Email, Bio, and Location. 
* The user is also able to edit their profile settings, such as signing out and deleting their profile.

  Please see:

  [User Profile Capture](//docs/screenshots/Other%20User%20Profile.png)

  [Profile Edit Capture](//docs/screenshots/Profile%20Edit%20Screen.png)

  DO[Profile Settings Capture](//docs/screenshots/Profile%20Settings%20Screen.png)

  [Signout Screen Capture](//docs/screenshots/Signout%20Screen.png)
  
  
### F2.1 Users can create Items with pictures, description, and category. 
* The users are able to create Items by accessing their profile, and selecting "Add new".
* Users can add multiple pictures, a description, and an option from a set of categories.

  Please see:

  [Item Posting Capture](//docs/screenshots/Profile%20Settings%20Screen.png)

  [Posted Item Capture](//docs/screenshots/Home%20Screen.png)

  [Categories Box Capture](//docs/screenshots/Home%20Screen.png)


### F2.2 Users must be able to view their Items and edit/delete if wanted. 
* The users can view their items on their profiles, and edit or delete them individually.

  Please see:

  [User Profiles Capture ](//docs/screenshots/Profile%20Settings%20Screen.png)

  [Profile Edit Capture](//docs/screenshots/Home%20Screen.png)
 

### F3.1 User should be able to see other user’s items and can ‘swipe’ through each other's items.
* Users can see items from other users at the Home page based on their location. By swiping left or right, users can either dismiss or like an item.
* The users can view another user's items by clicking on their profile. 

  Please see:

  [Home Screen Capture](//docs/screenshots/Home%20Screen.png)

  [Other User Profile Capture](//docs/screenshots/Home%20Screen.png)


### F3.2 Swipes for Items should be stored in database.
* Item Swipes are stored in database, and can be seen in the Swap screen.

  Please see:

  [Swipes Database View Capture](//docs/screenshots/Home%20Screen.png)

  [Swap Screen Capture](//docs/screenshots/Home%20Screen.png)

### F3.3 Users can browse Items based on filters such as location and category.
* Items are automatically filtered by location at the Home Page.
* Items are filtered by a limited set of categories, which are selected by the user. If the user chooses none, the no filters are applied.

  Please see:

  [Home Screen Capture](//docs/screenshots/Home%20Screen.png)

  [Home Screen with Category Capture](//docs/screenshots/Home%20Screen.png)

### F3.4 Users can see what items they have swiped and potentially remove their interest. 
* Users can view liked items in Swap page.
* Users can unlike items in the Your Wishlist section by clicking on the heart emoji.

  Please see:

  [Swap Screen Capture](//docs/screenshots/Home%20Screen.png)

### F4.1 The app will match users who have shown interest in each other’s items. 
* Users can see other users who liked their items in the Pending Swaps section in the Swap page.
* Users can see accepted, pending and rejected matches.

  Please see:

  [Swap Screen Capture](//docs/screenshots/Swap%20Screen.png)
  
  [Swap History Capture](//docs/screenshots/Swap%20History%20Screen.png)


### F4.3 Users can accept or reject matches.
* Users are able to accept or reject matches in the Swap page, by viewing Pending Swaps and clicking on the matches listed.

  Please see:

  [Swap Screen Capture](//docs/screenshots/Swap%20Screen.png)
  
  [Swap History Capture](//docs/screenshots/Swap%20History%20Screen.png)

  [Match Choices Capture](//docs/screenshots/Swap%20History%20Screen.png)

### F5.1 Users can message inside the app to discuss the trade.
* Users can initiate conversations in the Home page, by clicking View Details on another user's profile. The user will then be routed to a page where they can message the other user.

* Users can see their pending messages and previous conversations on the Messages page.

  Please see:

  [Home Screen Capture](//docs/screenshots/Swap%20Screen.png)

  [Initial Message Capture](//docs/screenshots/Swap%20Screen.png)

  [Messages Screen Capture](//docs/screenshots/Swap%20History%20Screen.png)


### F6 Users can report inappropriate listings or user behaviour.
* Users can report other users' items in the Home page by selecting the Report button. 
* The report will be sent to the admins, and appear in their Report Dashboard. Depending on the item and report type, the admins will then, be able to delete the reported user's item, or ban them from the platform.

  Please see:

  [Home Screen Capture](//docs/screenshots/Swap%20Screen.png)

  [Report Screen Capture](//docs/screenshots/Swap%20Screen.png)

  [Admin Dashboard Capture](//docs/screenshots/Swap%20History%20Screen.png)
  
  [Admin Report Capture](//docs/screenshots/Swap%20History%20Screen.png)

  [Admin Report Action Capture](//docs/screenshots/Swap%20History%20Screen.png)

--CHANGE--:

### F7 Users can rate and review other users after a successful trade.
* Users can leave a "1 out-of 5 star" review to users they traded with, by selecting Leave A Review in the Swap page, after a successful trade. 
* Users can also check the reviews made by  users they previously traded with.

  Please see:

  [Home Screen Capture](//docs/screenshots/Swap%20Screen.png)

  [Swap Screen Capture](//docs/screenshots/Swap%20Screen.png)

  [Leave A Review Capture](//docs/screenshots/Swap%20History%20Screen.png)
  
  [User Profile Reviews Capture](//docs/screenshots/Swap%20History%20Screen.png)



8 

Administrative accounts can ban/suspend users - not yet, can view active reports and recent users

H 

Full 

