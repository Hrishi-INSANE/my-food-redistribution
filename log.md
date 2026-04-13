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