# Event Manager — Frontend Client

React and Redux Toolkit client for viewing, creating, and updating **timezone-aware events**.

### Prerequisites

* Node.js **v18+**
* Running Backend API — defaults to `http://localhost:5000`

### Installation & Run

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The application will start at `http://localhost:3000`.

## Main Tech Stack

* **React 18** — Component-based UI
* **Redux Toolkit** — Global state management for users, session, and events
* **Day.js** — Local and UTC timezone conversion using `utc` and `timezone` plugins
* **CSS** — Component styling

## Key Features

* **Timezone Conversion:** Automatically converts event UTC timestamps into the active user's local timezone.
* **Multi-Profile Assignment:** Assign multiple user profiles to an event using custom dropdowns.
* **Audit Log Viewer:** View the complete history of changes made to an event.
* **Date Guards:** Client-side validation ensures event end times occur after start times.
