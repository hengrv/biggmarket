# BiggMarket Testing Documentation

## User Testing Results

| Test Case | Expected Result | Actual Result | Pass |
|-----------|----------------|---------------|------|
| User Registration | User can create account with email and password | User successfully created account | Yes |
| User Login | User can log in with credentials | User successfully logged in | Yes |
| Profile Update | User can update their profile information | Profile information updated successfully | Yes |
| Item Creation | User can create a new item listing | Item successfully created | Yes |
| Item Update | User can modify their item details | Item details updated successfully | Yes |
| Item Deletion | User can delete their items | Item successfully deleted | Yes |
| Item Swiping | User can swipe left/right on items | Swipe recorded successfully | Yes |
| Match Creation | Match created when both users swipe right | Match created successfully | Yes |
| Location Setting | User can set their location | Location successfully set | Yes |
| Distance-based Items | Items shown based on user's location | Items filtered by distance correctly | Yes |

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