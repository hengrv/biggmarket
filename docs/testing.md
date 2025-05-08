# BiggMarket Testing Documentation

## User Testing Results

| Test Case | Expected Result | Actual Result | Evidence | Pass |
|-----------|----------------|---------------|----------|------|
| User Registration | User can create account with email and password | User successfully created account | ![Signup screen](./screenshots/Log%20in%20Screen.png) | Yes |
| User Login | User can log in with credentials | User successfully logged in | ![Login success](./screenshots/Log%20in%20Screen.png) | Yes |
| User Logout | User can log out with credentials | User successfully logged out | ![Logout Success](./screenshots/Signout%20Screen.png) | Yes |
| Profile Update | User can update their profile information | Profile information updated successfully | ![Profile Edit](./screenshots/Profile%20Edit%20Page.png) | Yes |
| Item Creation | User can create a new item listing | Item successfully created | ![Item Created](./screenshots/Item%20Details%20Screen.png) | Yes |
| Item Update | User can modify their item details | Item details updated successfully | ![Edit item](./screenshots/Single%20Item%20Post%20Screen.png) | Yes |
| Item Deletion | User can delete their items | Item successfully deleted | Screenshot of item removal | Yes |
| Item Swiping | User can swipe left/right on items | Swipe recorded successfully | Screenshot of swipe action | Yes |
| Match Creation | Match created when both users swipe right | Match created successfully | ![Match creation](./screenshots/Swap%20History%20Screen.png) | Yes |
| Location Setting | User can set their location | Location successfully set | ![Location Settings](./screenshots/Profile%20Edit%20Page.png) | Yes |
| Distance-based Items | Items shown based on user's location | Items filtered by distance correctly | ![Filtered by distance](./screenshots/Swap%20Screen.png) | Yes |
| Multi-image Item Post | User can create item with multiple images | Item created with multiple images | ![Multi-image post](./screenshots/2%20Image%20Post%20Screen.png) | Yes |
| Item Sorting | Items can be sorted by different criteria | Items sorted correctly | ![Sort items](./screenshots/Sort%20Items%20Function.png) | Yes |
| Messaging System | User can send messages about items | Message sent successfully | ![Messaging](./screenshots/Meassaging%20over%20an%20item.png) | Yes |
| Initial Message | User can send first message to another user | Initial message sent successfully | ![Initial message](./screenshots/Initial%20Message%20to%20other%20User.png) | Yes |
| Match Status Updates | User can accept/reject matches | Match status updated correctly | ![Match accepted](./screenshots/Match%20Accepted%20Screen.png) ![Match rejected](./screenshots/Match%20Rejected%20Screen.png) | Yes |
| User Following | User can follow other users | Following relationship created | ![Following](./screenshots/New%20Following%20Screen.png) | Yes |
| Profile Reviews | User can review other users | Review submitted successfully | ![Profile review](./screenshots/Profile%20Review%20Screen.png) | Yes |
| Item Reporting | User can report inappropriate items | Report submitted successfully | ![Report item](./screenshots/Report%20Screen.png) | Yes |
| Admin Dashboard | Admin can view system statistics | Dashboard displayed correctly | ![Admin dashboard](./screenshots/Admin%20Dashboard.png) | Yes |
| Admin User Management | Admin can view user details | User details displayed correctly | ![Admin user details](./screenshots/Admin%20User%20Details.png) | Yes |
| Admin Report Management | Admin can view and manage reports | Reports displayed correctly | ![Admin reports](./screenshots/Admin%20Active%20Reports.png) | Yes |
| Empty State Handling | Empty states are handled gracefully | Empty state displayed correctly | ![Empty state](./screenshots/Empty%20Post%20Screen.png) | Yes |

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