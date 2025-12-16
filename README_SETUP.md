# MyPrintBot Admin Dashboard

Admin dashboard for monitoring and managing the MyPrintBot platform.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Start Development Server

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`

## 🔐 Authentication Setup

### For Development/Testing

Since the full authentication system is not yet integrated, you can use the development helper:

1. **Start the backend server** (make sure it's running on port 3000)

2. **Get an admin token** from the backend:
   - Option A: Login via the main frontend as an ADMIN user and copy the token
   - Option B: Use Postman/Thunder Client to call the auth API
   - Option C: Get a token directly from your backend logs/database

3. **Set the token in browser console**:
   ```javascript
   // Open browser DevTools (F12) and run:
   devAuth.setToken('your_jwt_token_here')
   ```

4. **Refresh the page** - The dashboard will now load data from the backend

### Check Token Status

```javascript
// In browser console:
devAuth.hasToken()  // Returns true if token exists
devAuth.getToken()  // Shows current token
devAuth.clearToken() // Remove token
```

## 📊 Dashboard Features

### Current Implementation

- ✅ **Metrics Cards** - Real-time platform statistics
  - Platform Overview (Partners, Clients, Submissions)
  - Active Jobs
  - Revenue Metrics
  - Submission Quality Metrics

- ✅ **Analytics Charts** - Visual data representation
  - User Growth Trend (30 days)
  - Job Status Distribution
  - Revenue Trend (6 months)

### API Endpoints Used

- `GET /api/stats/admin/dashboard` - Dashboard statistics
- `GET /api/stats/admin/user-growth` - User growth analytics
- `GET /api/stats/admin/revenue-trend` - Revenue trend data
- `GET /api/stats/jobs/breakdown` - Job status breakdown

## 🏗️ Project Structure

```
src/
├── api/
│   ├── axios.js                 # API client configuration
│   └── endpoints/
│       └── stats.js             # Stats API endpoints
├── components/
│   ├── dashboard/
│   │   ├── MetricsCards.jsx     # Metrics display
│   │   └── Charts.jsx           # Analytics charts
│   ├── layout/
│   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   ├── Header.jsx           # Top header
│   │   └── DashboardLayout.jsx  # Main layout wrapper
│   └── ui/                      # Reusable UI components
├── pages/
│   └── Dashboard.jsx            # Main dashboard page
├── utils/
│   └── devAuth.js               # Development auth helper
└── data/
    └── dummyData.js             # Fallback dummy data
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **Add new API endpoints** in `src/api/endpoints/`
2. **Create components** in `src/components/`
3. **Update navigation** in `src/components/layout/Sidebar.jsx`
4. **Add routes** in `src/components/PageRouter.jsx`

## 🐛 Troubleshooting

### "Failed to load dashboard statistics"

**Causes:**
- Backend server not running
- No authentication token
- Wrong API URL in .env
- User doesn't have ADMIN role

**Solutions:**
1. Check backend is running: `http://localhost:3000/api`
2. Set token using `devAuth.setToken('your_token')`
3. Verify .env file has correct API URL
4. Ensure user has ADMIN role in database

### CORS Errors

If you see CORS errors:
1. Check backend CORS configuration
2. Ensure API URL matches backend URL
3. Verify backend is running on correct port

### Charts Not Loading

1. Check browser console for errors
2. Verify all API endpoints are working
3. Check backend has required data in database

## 📝 TODO

- [ ] Implement full authentication system
- [ ] Add user management pages
- [ ] Add job management interface
- [ ] Add partner/client management
- [ ] Add system health monitoring
- [ ] Add settings configuration
- [ ] Add export functionality
- [ ] Add real-time updates (WebSocket)

## 🔗 Related Documentation

- [Backend API Documentation](../../Backend/MyPrintBot_backend/API_DOCUMENTATION.md)
- [Admin Dashboard Design Guide](../../ADMIN_DASHBOARD_DESIGN_GUIDE.md)
- [Project Analysis](../../PROJECT_ANALYSIS.md)

## 📦 Dependencies

- **React** - UI framework
- **Recharts** - Chart library
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Router** - Routing

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for new files (future enhancement)
3. Add comments for complex logic
4. Test with real backend data
5. Update documentation

## 📄 License

Part of MyPrintBot platform - Internal use only
