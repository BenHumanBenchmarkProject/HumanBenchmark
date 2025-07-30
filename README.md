# Human Benchmark

A social fitness platform to track workouts, connect with friends, and level up your training.

---

## 📌 Overview
**Human Benchmark** is a full-stack fitness tracking platform that combines social networking with workout analytics.
Users can:
- Log workouts
- Compare progress with friends
- Participate in leaderboards
- Receive personalized workout recommendations powered by AI

---

## 🚀 Features
- **Connect with Friends**: Social graph with friend requests and friend recommendations.
- **Track Workouts**: Log movements, sets, reps, and weights.
- **Workout Stats**: Gain XP, level up, and track stats.
- **Build Workouts**: Create custom workout plans.
- **AI Assistant**: Generate personalized workout plans using Google Gemini AI.
- **Leaderboard**: Compare stats with friends.
- **Calendar**: Schedule events, invite friends, and manage workout sessions.

---

## 🛠 Tech Stack

```mermaid
graph TD
    A[Frontend - React] -->|API Calls| B[Backend - Node.js/Express]
    B -->|ORM| C[Prisma]
    C -->|Queries| D[(PostgreSQL Database)]
    B -->|Authentication| E[bcrypt.js]
    B -->|AI Workouts| F[Google Gemini API]
    B -->|User Location| I[Google Geolocation API]
    A -->|Routing| G[React Router]
    A -->|State Mgmt| H[Context API]

```

---

## 🗄 Database Schema

```mermaid
erDiagram
    User ||--o{ Workout : "has"
    User ||--o{ MuscleStat : "has"
    User ||--o{ BodyPartStat : "has"
    User ||--o{ Movement : "performs"
    User ||--o{ CalendarEvent : "creates"
    User ||--o{ EventLeave : "leaves"
    User ||--o{ Friendship : "initiates/receives"
    User ||--o{ FriendRecommendation : "receives/recommends"

    Workout ||--o{ Movement : "contains"
    Workout ||--|| CalendarEvent : "linked to"

    Movement ||--|| Exercise : "references"

    Exercise ||--o{ MuscleStat : "affects"

    BodyPartStat ||--o{ MuscleStat : "groups"

    CalendarEvent ||--o{ EventLeave : "logs"

    Friendship {
        Int userId
        Int friendId
        String status
    }

    FriendRecommendation {
        Int userId
        Int recommendedUserId
        Float score
    }
```

---


## 📂 Project Structure

```mermaid
graph TD
    A[Human Benchmark Project] --> B[Frontend]
    A --> C[Backend]

    %% Frontend Structure
    B --> B1[src]
    B1 --> B2[components]
    B1 --> B3[pages]
    B1 --> B4[styles]
    B1 --> B5[context]
    B1 --> B6[App.jsx]
    B1 --> B7[main.jsx]
    B --> B8[public]
    B --> B9[package.json]
    B --> B10[vite.config.js]

    %% Backend Structure
    C --> C1[api]
    C1 --> C2[workouts]
    C1 --> C3[events]
    C1 --> C4[socialGraph]
    C1 --> C5[users]

    C --> C6[prisma]
    C6 --> C7[schema.prisma]
    C6 --> C8[seed.js]

    C --> C9[utils]
    C --> C10[index.js]
    C --> C11[package.json]
    C --> C12[.env]
    C --> C13[scripts]

    %% Prisma DB
    C --> C14[Database: PostgreSQL]
```


---

## 📦 Dependencies

### Frontend
```json
"axios": "^1.10.0",
"bcryptjs": "^3.0.2",
"cors": "^2.8.5",
"react": "^19.1.0",
"react-dom": "^19.1.0",
"react-router": "^7.6.2"
```

### Backend
```json
"@google/genai": "^1.11.0",
"@google/generative-ai": "^0.24.1",
"@prisma/client": "^6.10.1",
"axios": "^1.10.0",
"bcryptjs": "^3.0.2",
"cors": "^2.8.5",
"express": "^5.1.0",
"express-session": "^1.18.1",
"helmet": "^8.1.0",
"prisma": "^6.10.1"
```

---

## 🖥 Scripts

### Frontend
```json
"dev": "vite",
"build": "vite build",
"lint": "eslint .",
"preview": "vite preview"
```

### Backend
```json
"dev": "node --env-file=.env --watch index.js",
"start": "node index.js",
"build": "npm install && npm run db:init",
"db:migrate": "prisma migrate dev",
"db:reset": "prisma migrate reset --force",
"db:seed": "node prisma/seed.js",
"db:init": "npm run db:reset && npm run db:migrate && npm run db:seed",
"psql": "psql shelterdb -U app_user"
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/human-benchmark.git
```

### 2. Install Dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the backend directory with your database connection and API keys.

### 4. Run the Application
```bash
# Start backend
npm run dev

# Start frontend
npm run dev
```

---

## 🤝 Contributing
Contributions are welcome!
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).

---

© 2025 Human Benchmark. All rights reserved.
