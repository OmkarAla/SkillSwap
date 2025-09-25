# SkillSwap - Peer-to-Peer Skill Exchange Platform

A modern, full-stack web application that connects people to exchange skills and knowledge in a completely free, community-driven environment.

## 🌟 Features

### Core Functionality
- **User Authentication** - Secure registration and login with JWT tokens
- **Profile Management** - Complete user profiles with skills, preferences, and bio
- **Smart Matching** - AI-powered matching based on skill compatibility
- **Session Scheduling** - Easy scheduling and management of skill exchange sessions
- **Real-time Messaging** - Built-in chat system for communication
- **Rating System** - Trust-building through user ratings and reviews
- **Search & Filter** - Advanced search and filtering capabilities

### Technical Features
- **Responsive Design** - Mobile-first approach with modern UI/UX
- **3D Animations** - Engaging visual effects and smooth transitions
- **Real-time Updates** - Live data synchronization
- **Secure API** - RESTful API with authentication and validation
- **Database Optimization** - MongoDB with proper indexing and relationships

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **React Router DOM** - Client-side routing
- **Custom CSS** - Modern styling with CSS Grid and Flexbox
- **Context API** - State management for authentication
- **Fetch API** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Git** - Version control
- **npm** - Package management
- **MongoDB Atlas** - Cloud database (optional)

## 📁 Project Structure

```
skill-swap/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.js & Home.css
│   │   │   ├── Login.js & Login.css
│   │   │   ├── Register.js & Register.css
│   │   │   ├── Dashboard.js & Dashboard.css
│   │   │   ├── Profile.js & Profile.css
│   │   │   ├── Matches.js & Matches.css
│   │   │   ├── Sessions.js & Sessions.css
│   │   │   ├── Messages.js & Messages.css
│   │   │   └── ProtectedRoute.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── components.css
│   │   ├── App.js & App.css
│   │   └── index.js & index.css
│   └── package.json
├── backend/
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── matches.js
│   │   ├── sessions.js
│   │   └── messages.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── env.example
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp env.example .env
   ```

4. **Configure environment variables**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/skillswap
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start the server**
   ```bash
   npm start
   # or for development with auto-restart
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/skills` - Update user skills
- `GET /api/users/:userId` - Get user by ID
- `GET /api/users/stats/:userId` - Get user statistics
- `POST /api/users/rate` - Rate a user

### Matches
- `GET /api/matches` - Get potential matches
- `GET /api/matches/suggested` - Get suggested matches
- `GET /api/matches/:matchId` - Get match details
- `GET /api/matches/categories/list` - Get skill categories

### Sessions
- `GET /api/sessions` - Get user sessions
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:sessionId` - Update session
- `DELETE /api/sessions/:sessionId` - Delete session
- `GET /api/sessions/stats/overview` - Get session statistics
- `GET /api/sessions/upcoming` - Get upcoming sessions

### Messages
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/conversation/:userId` - Get messages with user
- `POST /api/messages/send` - Send message
- `PUT /api/messages/read/:messageId` - Mark message as read
- `GET /api/messages/unread/count` - Get unread count
- `DELETE /api/messages/:messageId` - Delete message
- `GET /api/messages/search` - Search messages

## 🎨 UI Components

### Pages
- **Home** - Landing page with hero section, features, and testimonials
- **Login/Register** - Authentication forms with validation
- **Dashboard** - User overview with stats and quick actions
- **Profile** - User profile management and skills setup
- **Matches** - Browse and search for skill exchange partners
- **Sessions** - Manage scheduled skill exchange sessions
- **Messages** - Real-time chat with other users

### Design Features
- **3D Animations** - Smooth hover effects and transitions
- **Glassmorphism** - Modern glass-like UI elements
- **Responsive Design** - Mobile-first approach
- **Dark/Light Themes** - Automatic theme detection
- **Loading States** - User-friendly loading indicators
- **Error Handling** - Comprehensive error messages

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for password security
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Configured for specific origins
- **Rate Limiting** - Protection against abuse
- **SQL Injection Prevention** - MongoDB with proper sanitization

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use a cloud MongoDB service
2. Configure environment variables for production
3. Deploy to platforms like Heroku, DigitalOcean, or AWS
4. Set up SSL certificates for HTTPS

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or AWS S3
3. Configure environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the flexible database
- Express.js for the robust backend framework
- All open-source contributors

## 📞 Support

For support, email support@skillswap.com or create an issue in the repository.

---

**SkillSwap** - Where knowledge flows freely! 🌟
