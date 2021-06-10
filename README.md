
# Mazadk 

> Mazadk is aplatform combines some of companies or merchants who sell their product on auction.


## Features

- [x] Login
- [x] Register (User-Merchant)
- [x] Forget Password
- [x] Reset Password
- [x] Email Confirmation
- [x] Upload Image
- [x] Display Auctions
- [x] Display Users
- [x] Create/Edit/Delete Mazad
- [x] Bidding
- [x] Make Interested Auction List
- [x] Display Platform Statistics
- [x] Display User (winning - subscribed - Interested )
- [x] Display User (winning - subscribed - Interested ) List
- [x] Approve Or Reject Merchant Request
- [x] Display Platform Statistics


## Upcoming Features
- [ ] Socket  Using 
- [ ] Payment System 
- [ ] Premium (Users - Merchants) 



## Env Variables

Create  .env file in config folder and add the following vars

```
NODE_ENV=development
PORT=5000

MONGO_URI=''
FILE_UPLOAD_PATH= ./public/uploads

JWT_COOKIE_EXPIRE =30d
JWT_SECRET=''
JWT_EXPIRE=30d

SEND_GRID_USERNAME=
SEND_GRID_PASSWORD=

FROM_NAME='MazadK'
FROM_EMAIL=''

```

## Install Dependencies

```
npm install
```

## APIs doc
[Click here](https://documenter.getpostman.com/view/8810063/TzJx8w1w)

## Run

```

# Run Program
npm run server

```
## Life API
https://mmazadk.herokuapp.com




