# Development Log: FoodShare System

## Milestone 1: The Bento Foundation
- **Architecture:** Implemented a "Bento Grid" layout using Tailwind CSS.
- **Routing:** Set up Next.js App Router for multi-page navigation (Dashboard & Marketplace).
- **State Management:** Used `useState` to manage the "Slide-over" form visibility.
- **Data Flow:** Practiced "Lifting State Up"—sending data from the `DonationForm` (Child) to the `DonorDashboard` (Parent).

### Key Concepts Learned:
1. **Components:** Breaking the UI into reusable bricks (e.g., `DonationForm.js`).
2. **Props:** Passing functions (`onAddDonation`) as tools from parents to children.
3. **Mapping:** Using `.map()` to dynamically render a list of items from an array.

## Step 5: Database Connection
- **Tool used:** Firebase Firestore (NoSQL Database).
- **Concept:** Bridging the local frontend to a cloud backend.
- **Why:** To make data "Persistent" (stays there after refresh).
## Step 5.5: The Real-time Sync
- **The Shift:** Removed `onAddDonation` (Local Prop) and replaced it with `addDoc` (Cloud Write).
- **The Logic:** Used `useEffect` and `onSnapshot` to create a "Live Listener".
- **Concept Learned:** "Single Source of Truth." The dashboard no longer manages data; it simply observes the Firebase database.