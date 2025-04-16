
response = {
  success: true,
  fromUserImage: "https://....",
  rooms: [{...}, {...}, {...}],
}

response = {
  
  success: true,
  formUserImage: "",
  rooms :[
  {
    roomType: "private",
    roomName: "....",
    roomTitle: ["user_1_userName", "user_2_userName"],
    roomPhoto: [{userID: "...", image: "..."}, {userID: "...", image: "..."}],
    roomMembers: [{
      
      "_id": "654...",
      "userName": "Alice",
      "image": "https://...",
      "isActive": true,
      "lastActive": "2025-04-14T...",
    }],
    messages: [{...}, {...}, {...}],
    lastMessage: "hello there",
    
  },
  {
    roomType: "group",
    roomName: "....",
    roomTitle: ["group_name"],
    roomPhoto: [{image: "https://..."}], // if roomTypes: "group" only
    roomMembers: [{
      
      "_id": "654...",
      "userName": "Alice",
      "image": "https://...",
      "isActive": true,
      "lastActive": "2025-04-14T...",
    
    }, {...}, {...}, {...}],
    
    messages: [
      {
        _id: "", //message id
        sender: {.../* user_details from User model */ },
        receiver: {.../* user_details from User model */ },
        message: "......"
      }
    ],
     
    lastMessage: "hello there"   

  }
 ]
}

