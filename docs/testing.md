# BiggMarket Testing Documentation

## User Testing Results

| Test Case | Data Input | Expected Result | Actual Result | Evidence | Pass |
|-----------|------------|----------------|---------------|----------|------|
| User Registration | `{Email: test@example.com, Password: Test123!}` | User can create account with email and password | User successfully created account | Screenshot of successful registration | Yes |
| User Login | Email: test@example.com, Password: Test123! | User can log in with credentials | User successfully logged in | Screenshot of successful login | Yes |
| Profile Update | Name: "Test User", Bio: "Test bio", Image: test.jpg | User can update their profile information | Profile information updated successfully | Screenshot of updated profile | Yes |
| Item Creation | Title: "Test Item", Image: item.jpg, Category: "Electronics" | User can create a new item listing | Item successfully created | Screenshot of created item | Yes |
| Item Update | Title: "Updated Item", Description: "New description" | User can modify their item details | Item details updated successfully | Screenshot of updated item | Yes |
| Item Deletion | Item ID: "item123" | User can delete their items | Item successfully deleted | Screenshot of item removal | Yes |
| Item Swiping | Item ID: "item456", Direction: "RIGHT" | User can swipe left/right on items | Swipe recorded successfully | Screenshot of swipe action | Yes |
| Match Creation | User A swipes right on User B's item, User B swipes right on User A's item | Match created when both users swipe right | Match created successfully | Screenshot of match notification | Yes |
| Location Setting | Postcode: "NE1 4ST", Latitude: 54.9783, Longitude: -1.6178 | User can set their location | Location successfully set | Screenshot of location settings | Yes |
| Distance-based Items | User Location: Newcastle, Radius: 10km | Items shown based on user's location | Items filtered by distance correctly | Screenshot of nearby items | Yes |

## tRPC API Endpoints

### User Router
| Endpoint | Method | Description | Authentication Required |
|----------|--------|-------------|------------------------|
| `user.getProfile` | Query | Get user profile information | Yes |
| `user.updateProfile` | Mutation | Update user profile details | Yes |
| `user.checkIfFollowing` | Query | Check if user follows another user | Yes |
| `user.getFollowerCount` | Query | Get number of followers | No |
| `user.getFollowingCount` | Query | Get number of following | No |

### Item Router
| Endpoint | Method | Description | Authentication Required |
|----------|--------|-------------|------------------------|
| `item.createItem` | Mutation | Create a new item listing | Yes |
| `item.updateItem` | Mutation | Update item details | Yes |
| `item.deleteItem` | Mutation | Delete an item | Yes |
| `item.getUserItems` | Query | Get user's items | Yes |
| `item.getItemById` | Query | Get specific item details | Yes |
| `item.toggleItemVisibility` | Mutation | Toggle item visibility | Yes |
| `item.swipeItem` | Mutation | Record a swipe on an item | Yes |
| `item.getMatches` | Query | Get user's matches | Yes |
| `item.updateMatchStatus` | Mutation | Update match status | Yes |
| `item.getSwipeStats` | Query | Get user's swipe statistics | Yes |

### Algorithm Router
| Endpoint | Method | Description | Authentication Required |
|----------|--------|-------------|------------------------|
| `algorithm.getItemsByDistance` | Query | Get items sorted by distance | Yes |

## Notes
- All protected endpoints require user authentication
- Location-based features require user to have set their location
- Item status can be: AVAILABLE, SWAPPED, or HIDDEN
- Match status can be: PENDING, ACCEPTED, or REJECTED 