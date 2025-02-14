# Crown Travels

Crown Travels is a travel application designed for exploring tourist attractions, hotels, and unique locations across all 25 districts of Sri Lanka. It allows users to book transportation, view district-based tourist information, and manage bookings seamlessly.

## Features

- Display tourist places, hotels, and unique attractions in all 25 districts of Sri Lanka.
- Cards for district information with images sourced from Firebase.
- Booking feature for buses and vans for trips.
- Session-based cart management.  -- have to check
- Bill generation for confirmed bookings with cancellation options.
- Firebase integration for real-time data handling.
- Modern and intuitive UI.

## Tech Stack

- **Frontend:** React Native, Expo
- **Backend:** Firebase
- **Database:** Firestore
- **Payment Gateway:** Stripe (using `@stripe/stripe-react-native`)
- **Cloud Storage:** Firebase Storage

## Project Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/crown-travels.git

2. Navigate to the project directory:
   cd crown-travels

3. Install dependencies:
   npm install

4. Set up environment variables:
  Create a .env file in the root directory.
  Add your Firebase and Stripe credentials:
  FIREBASE_API_KEY=your_firebase_api_key
  FIREBASE_AUTH_DOMAIN=your_auth_domain
  STRIPE_PUBLIC_KEY=your_stripe_public_key

5. Start the development server:
  expo start

Usage
  Launch the app using Expo Go or by running it on an Android emulator.
  Explore tourist places, hotels, and attractions.
  Use the booking feature to plan trips.
  Manage bookings and view bills.
  Future Enhancements
  Add support for iOS devices. -- have to check
  Implement multi-language support. --have to check
  Include a review and rating system for places and hotels. --have to check

License
  This project is licensed under the MIT License.

Acknowledgments
  Sri Lankan Tourism Board for inspiration.
  Expo for an amazing React Native framework.
  Firebase for real-time database and storage solutions.
