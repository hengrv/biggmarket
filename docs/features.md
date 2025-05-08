# BiggMarket Features Documentation

This document contains the project's Functionalities and Features, including Core Features, Advanced Features and Future Enhancements. The document also contains the Project's Functional and Non-Functional Requirements and their fulfilment.

<br>

# Contribution Matrix
The following table shows the team's contributions in terms of Functional Requirements and Non-Functional Requirements. 

| **Task** | Task Details                                                                                 | William Forkes (230333572) | Henry Groves (230054149) | Robin Husbands (230458358) | Teodora Ilic (230497195) | Dario Labrador Alonso (23041691) | Guoxin Zhu (23067186) | Lama Mohammed A AlMulla (230361933) |
| ---------- | ---------------------------------------------------------------------------------------------- | ---------------------------- | -------------------------- | ---------------------------- | -------------------------- | ---------------------------------- | ----------------------- | ------------------------------------- |
| F1.1     | User can create an account, with their details stored in the database.                       | R                          | M,R,T                    | C,M,R,T                    | R                        | C,M,R,T                          | M                     | R                                   |
| F1.2     | Users can edit their profile and settings.                                                   | R                          | R                        | R                          | M,R                      | R                                | M,R                   | M,R                                 |
| F2.1     | Users can create Items with pictures, description, and category.                             | R                          | C,M,R                    | C,R                        | M,R                      | C,M,R                            | R                     | M,R                                 |
| F2.2     | Users must be able to view their Items and edit/delete if wanted.                            | R                          | C,M,T                    | R                          | M,R                      | R                                | R                     | M,R                                 |
| F3.1     | User should be able to see other user’s items and can ‘swipe’ through each other's items. | R                          | C,M,T                    | R                          | M,R                      | R                                | R                     | M,R                                 |
| F3.2     | Swipes for Items should be stored in database.                                               | R                          | C,M,R                    | C,M,R,T                    | R                        | C,M,R,T                          | R                     | R                                   |
| F3.3     | Users can browse Items based on filters such as location and category.                       | R                          | C,M,R                    | R,T                        | R                        | R,T                              | R                     | R                                   |
| F3.4     | Users can see what items they have swiped and potentially remove their interest.             | R                          | C,M,T                    | R                          | M,R                      | R                                | R                     | M,R                                 |
| F4.1     | The app will match users who have shown interest in each other’s items.                     | R                          | C,M,T                    | R                          | R                        | R                                | R                     | R                                   |
| F4.3     | Users can accept or reject matches.                                                          | R                          | C,M,T                    | R                          | M,R                      | R,T                              | R                     | M,R                                 |
| F5.1     | Users can message inside the app to discuss the trade.                                       | R                          | M,T                      | R,M                        | M,R                      | R                                | M                     | M,R                                 |
| F6       | Users can report inappropriate listings or user behaviour.                                   | R                          | C,M,T                    | R                          | R                        | R                                | M                     | R                                   |
| F7       | Users can rate and review other users after a successful trade.                              | R                          | C,M,T                    | R                          | R                        | R                                | R                     | R                                   |
| F8       | Administrative accounts can ban/suspend users. HEN TO ADD                                    | R                          | C,M,T                    | R                          | R                        | R                                | R                     | R                                   |
| NF1.1    | User information should be stored securely.                                                  | R                          | M,T                      | C,R,M                      | R                        | C,R,M                            | R,M                   | R                                   |
| NF1.2    | Information stored should comply with regulations such as GDPR.                              | R                          | C,M,T                    | R                          | R                        | C,M,R                            | R                     | R                                   |
| NF1.3    | Application should be secure against common web vulnerabilities such as SQL Injections.      | R                          | C,M,R                    | R,C                        | R                        | C,R                              | M                     | R                                   |
| NF2.1    | App will be usable on both desktop and mobile devices – responsive design.                  | R                          | M,T                      | R                          | C,M,R                    | T                                | R                     | C,M,R                               |
| NF3.1    | User Interface will be accessible to a range of visual impairments.                          | R                          | M,T                      | R                          | C,M,R                    | T                                | R                     | C,M,R                               |
| NF4      | Users must be able to accept or reject Matches with other Users.                             | R                          | C,M,T                    | R                          | M,R                      | R                                | R                     | M,R                                 |
| NF5      | User review should be seen by other users.                                                   | R                          | C,M,T                    | R                          | M,R                      | R                                | R                     | M,R                                 |

<br>

# Core Features

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

<br>

# Advanced Features

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

<br>

# Future Enhancements
  - Push notifications
  - In-app video calling
  - Item categories expansion
  - Advanced search filters
  - Social media integration
  - Item recommendation system
  - User verification system
  - Premium features 

<br>

# Functional Requirements (F):
### F1.1 User can create an account, with their details stored in the database.
* The user can use their Google account for authentication to create or sign in to their account. Account details such as Full Name, Username and Email, are stored in a PostgreSQL database. 
* Username by default is the user email's local part.  

  Please see:
  
  - [Log-in Screen Capture](../docs/screenshots/Log%20in%20Screen.png)

### F1.2 Users can edit their profile and settings.
* Users can view their profiles and upload or edit their profile picture in the Profile page.
* The user can also edit their Full Name, Username, Email, Bio, and Location. 
* The user is also able to access profile settings, such as signing out and deleting their account.

  Please see:

  - [Profile Capture](../docs/screenshots/User%20Profile%20Screen.png)

  - [Profile Edit Capture](../docs/screenshots/Profile%20Edit%20Page.png)

  - [Profile Settings Capture](../docs/screenshots/Settings%20Page.png)

  - [Profile Settings Deletion Capture](../docs/screenshots/Settings%20Page%20Deletion%20Confirmation.png)

  - [Profile Settings Signout Capture](../docs/screenshots/Signout%20Screen.png)
  
### F2.1 Users can create Items with pictures, description, and category. 
* The users are able to create Items by viewing their profile, and selecting Add New.
* Users can add multiple pictures, a description, and an option from a set of categories and a set of conditions.

  Please see:

  - [Profile Capture](../docs/screenshots/User%20Profile%20Screen.png)

  - [Empty Item Capture](../docs/screenshots/Empty%20Post%20Screen.png)
  
  - [Item Posting Capture](../docs/screenshots/Single%20Item%20Post%20Screen.png)
  
  - [Item Posting Multiple Pictures Capture](../docs/screenshots/2%20Image%20Post%20Screen.png)

  - [Set of Categories Capture](../docs/screenshots/Post%20Items%20condition.png)
  
  - [Set of Conditions Capture](../docs/screenshots/Post%20Items%20categories.png)

### F2.2 Users must be able to view their Items and edit/delete if wanted. 
* The users can view all their items in the Profile page, and edit/delete them by clicking them individually.

  Please see:

  - [User Items Capture ](../docs/screenshots/User%20Profile%20Screen.png)

  - [Item Details Capture](../docs/screenshots/Item%20Details%20Screen.png)

  - [Item Delete Capture](../docs/screenshots/Item%20Details%20Delete.jpg)
 
### F3.1 User should be able to see other user’s items and can ‘swipe’ through each other's items.
* Users can see other user's items at the Home page based on their location. By swiping left or right, users can either dismiss or like an item.
* The users can view another user's items by clicking on their profile. 

  Please see:

  - [Home Screen Capture](../docs/screenshots/Home%20Screen.png)

  - [Other User Profile Capture](../docs/screenshots/Other%20User%Profile.png)


### F3.2 Swipes for Items should be stored in database.
* Item Swipes are stored in database, and can be seen by admins, including the Users involved, and date of occurrence. 

  Please see:

  - [Database Recent Swipes Capture](../docs/screenshots/Admin%20Recent%20Swipes.png)

  - [Database Swipe Details Capture](../docs/screenshots/Admin%20Swipe%20Details.png)

### F3.3 Users can browse Items based on filters such as location and category.
* Items are automatically filtered by location at the Home Page.
* Items are filtered by a set of categories, which are selected by the user. If the user chooses none, the no filters are applied, and items of all categories are displayed.

  Please see:

  - [Browse Category Capture](../docs/screenshots/Sort%20Items%20Function.png)

### F3.4 Users can see what items they have swiped and potentially remove their interest. 
* Users can view liked items in the Swap page.
* Users can unlike items in the Your Wishlist section by clicking on the heart emoji.

  Please see:

  - [Swap Screen Capture](../docs/screenshots/Swap%20Screen.png)

### F4.1 The app will match users who have shown interest in each other’s items. 
* Users can see other users who liked their items in the Pending Swaps section in the Swap page.
* Users can see accepted, pending and rejected matches.

  Please see:

  - [Swap Screen Capture](../docs/screenshots/Swap%20Screen.png)
  
  - [Swap History Capture](../docs/screenshots/Swap%20History%20Screen.png)

### F4.3 Users can accept or reject matches.
* Users are able to accept or reject matches in the Swap page, by viewing Pending Swaps and clicking on the matches listed.

  Please see:
  
  - [Swap History Capture](../docs/screenshots/Swap%20History%20Screen.png)

  - [Match Pending Capture](../docs/screenshots/Match%20Pending%20Screen.png)

  - [Match Rejected Capture](../docs/screenshots/Match%20Rejected%20Screen.png)

  - [Match Accepted Capture](../docs/screenshots/Match%20Accepted%20Screen.png)

  - [Match Accepted Confirmation Capture](../docs/screenshots/Match%20Accepted%20Page.png)

### F5.1 Users can message inside the app to discuss the trade.
* Users can initiate conversations in the Home page, by clicking View Details on another user's profile. The user will then be routed to a page where they can message the other user.
* Users can see their pending messages and previous conversations on the Messages page.

  Please see:

  - [Home Screen Capture](../docs/screenshots/Home%20Screen.png)

  - [Initial Message Capture](../docs/screenshots/Meassaging%20over%20an%20item.png)

  - [Messages Screen Capture](../docs/screenshots/Messages%20Screen.png)

### F6 Users can report inappropriate listings or user behaviour.
* Users can report other users' items in the Home page by clicking on Report under the user's item. 

  Please see:

  - [Home Screen Capture](../docs/screenshots/Home%20Screen.png)

  - [Report Screen Capture](../docs/screenshots/Report%20Screen.png)

### F7 Users can rate and review other users after a successful trade.
* After a successful trade, users can leave a "1 to 5 star" rating on the other user's profile.
* Users can also check the reviews made by other users on their Profile page.

  Please see:

  - [Leave A Review Capture](../docs/screenshots/Leave%20A%20Review.jpg)

  - [Review Submitted Capture](../docs/screenshots/Review%20Submitted.jpg)

### F8 Administrative accounts can ban/suspend users.
* Admins are able to ban users from the platform by accessing Account details through the Admin Dashboard.

  Please see:

  - [Admin Dashboard](../docs/screenshots/Admin%20Dashboard.png)

  - [Admin Report Screen](../docs/screenshots/Admin%20Report%20Screen.png)

  - [Admin User Details Screen](../docs/screenshots/Admin%20User%20Details.png)

  - [Admin Ban Screen](../docs/screenshots/Admin%20User%20Ban.jpg)

<br> 

## Non-Functional Requirements(NF):

### NF1.1 User information should be stored securely. 
* The application uses Prisma to store data type-safely in a PostgreSQL database.
* The application also uses parameterized queries to protect against SQL injections. 

  Please see:

  - [Prisma Database Capture](../docs/screenshots/Prisma%20Database%20Screen.jpg)

### NF1.2 Information stored should comply with regulations such as GDPR. 
* User information is stored securely in Prisma, which ensures type safety and structured data management.
* The application only collects necessary user information, such as Full Name, Username, Email, Bio, and Location, which is relevant for its functionality (e.g., matching users, location-based filtering).
* Users can edit their profile information, including Full Name, Username, Email, Bio, and Location.
* Users can also delete their profile, which likely removes their personal data from the database, complying with GDPR's "Right to Erasure".
* In addition, the application uses a Role-Based Access Control(RBAC) system to ensure only administrative personnel can manage sensitive information.

  Please see:

  - [Prisma Database Capture](../docs/screenshots/Prisma%20Database%20Screen.jpg)

  - [User Information Capture](../docs/screenshots/Profile%20Edit%20Page.png)

  - [Profile Delete Capture](../docs/screenshots/Settings%20Page%20Deletion%20Confirmation.png)

  - [RBAC Capture](../docs/screenshots/RBAC%20Screen.jpg)

### NF1.3 Application should be secure against common web vulnerabilities such as SQL Injections.  
* The application uses Prisma to automatically generate parameterized queries, which prevent SQL injections by ensuring that user inputs are treated as data and not executable SQL code.
* The application also uses zod for schema validation to ensure that user input conforms to the expected format.
* Sensitive operations such as database modifications or administrative actions, are restricted to authorized users through RBAC. This minimizes the risk of unauthorized users injecting malicious queries.

### NF2.1 App will be usable on both desktop and mobile devices – responsive design. 
* The application functions and renders correctly in desktop and mobile devices.

  Please see:

  - [Desktop Sample](../docs/screenshots/Desktop%20Screen.png)

  - [iPhone 12 Pro Sample](../docs/screenshots/iPhone12%20Screen.png)

  - [iPad Air Sample](../docs/screenshots/iPad%20Screen.png)

### NF3.1 User Interface will be accessible to a range of visual impairments.
* The GUI consists of two main colours, black and light green to allow a distinguishable contrast, even for visually impaired users
* Simulation: - [color-blindness.com](https://www.color-blindness.com/coblis-color-blindness-simulator/)

  Please see:

  - [Normal View](../docs/screenshots/Desktop%20Screen.png)

  - [Anomalous Trichromatic View: Red-Weak/Protanomaly](../docs/screenshots/Anomalous%20Trich.png)

  - [Dichromatic View: Green-Blind/Deuteranopia](../docs/screenshots/Dichromatic.png)

  - [Monochromatic View: Monochromacy/Achromatopsia](../docs/screenshots/Monochromacy.png)

### NF4 Users must be able to accept or reject Matches with other Users.
* Users have the option to whether accept or reject matches from interested users.

  Please see:

  - [Match Pending Capture](../docs/screenshots/Match%20Pending%20Screen.png)

  - [Match Rejected Capture](../docs/screenshots/Match%20Rejected%20Screen.png)

  - [Match Accepted Capture](../docs/screenshots/Match%20Accepted%20Screen.png)

### NF5 User review should be seen by other users.
* Reviews in user profiles can be seen by all users. This includes an average of all the received ratings, and review comments.

  Please see:

  - [Profile Review](../docs/screenshots/Profile%20Review%20Screen.png)