# BiggMarket Testing Documentation

## User Testing Results

| Test Case | Data Input | Expected Result | Actual Result | Evidence | Pass |
|-----------|------------|----------------|---------------|----------|------|
| User Registration | `<Google Account Authentication>` | User can create account with email and password | User successfully created account | ![Signup screen](./screenshots/Log%20in%20Screen.png) | Yes |
| User Login | `<Google Account Authentication>` | User can log in with credentials | User successfully logged in | ![Login success](./screenshots/Log%20in%20Screen.png) | Yes |
| User Logout | `<Google Account Authentication>` | User can log out with credentials | User successfully logged out | ![Logout Success](./screenshots/Signout%20Screen.png) | Yes |
| Profile Update | `{ name: "Test User", bio: "Test bio", image: <base64 encoded image data>, location: { postcode: "NE1 4ST", latitude: 54.9783, longitude: -1.6178 } }` | User can update their profile information | Profile information updated successfully | ![Profile Edit](./screenshots/Profile%20Edit%20Page.png) | Yes |
| Item Creation | `{ title: "Test Item", image: <base64 encoded image data>, description: "Test description", category: "Electronics" }` | User can create a new item listing | Item successfully created | ![Item Created](./screenshots/Item%20Details%20Screen.png) | Yes |
| Item Update | `{ id: "item123", data: { title: "Updated Item", description: "New description" } }` | User can modify their item details | Item details updated successfully | ![Edit item](./screenshots/Single%20Item%20Post%20Screen.png) | Yes |
| Item Deletion | `{ id: "item123" }` | User can delete their items | Item successfully deleted | Screenshot of item removal | Yes |
| Item Swiping | `{ itemId: "item456", direction: "RIGHT" }` | User can swipe left/right on items | Swipe recorded successfully | Screenshot of swipe action | Yes |
| Match Creation | `{ itemId: "item789", direction: "RIGHT" }` (when both users swipe right) | Match created when both users swipe right | Match created successfully | ![Match creation](./screenshots/Swap%20History%20Screen.png) | Yes |
| Location Setting | `{ postcode: "NE1 4ST", latitude: 54.9783, longitude: -1.6178 }` | User can set their location | Location successfully set | ![Location Settings](./screenshots/Profile%20Edit%20Page.png) | Yes |
| Distance-based Items | `{ latitude: 54.9783, longitude: -1.6178 }` | Items shown based on user's location | Items filtered by distance correctly | ![Filtered by distance](./screenshots/Swap%20Screen.png) | Yes |

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