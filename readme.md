## Land Verification System

<img width="1329" alt="Screenshot 2023-04-12 at 22 33 15" src="https://user-images.githubusercontent.com/7990807/231591861-5120fc9e-75fa-4c06-843f-529ce5ab79da.png">

### Architecture Overview
<p align="center">
    <img width="357" alt="image" src="https://github.com/olaysco/verifiland/assets/7990807/d6b7d0ff-63bb-46dc-a6b4-5f7f794f41e7">
</p>


### The application flow

#### Asset registration Flow

    - User signs up on the application.
    - User registers assets on the blockchain.
    - Asset status is set to `awaiting approval`.
    - Admin logins in verifies the user documents.
    - Admin approves or declines the land registration claim.

#### Asset transfer flow

    - Owner initiates transfer request.
    - Admin confirms transfer request.
    - asset is transferred to the new owner.

#### Asset verification process

    - User navigates to `/verify`.
    - Enter the asset's unique ID.
    - Owner Information is displayed to the user with personal information hidden.
    - User can see the provenance of the asset. i.e. previous owner to the current owner.
