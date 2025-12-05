# Quick Start Guide

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## First Steps

### As a Citizen:
1. Click "Report Issue" button in the header
2. Fill in the report form:
   - Enter a title and description
   - Click "🤖 Get AI Suggestions" to auto-fill category and priority
   - Upload photos/videos (optional)
   - Select location on the map
3. Submit the report
4. View your report in "My Reports" or on the "Map"

### As an Admin:
1. Navigate to "Admin" in the header
2. View dashboard statistics
3. Filter reports by status or category
4. Click "Manage" on any report to:
   - Change status
   - Assign to a team
   - Add timeline notes

## Features to Try

- **AI Suggestions**: Enter a description like "Large pothole on Main Street" and click "Get AI Suggestions"
- **Map View**: See all reports plotted on an interactive map
- **Status Tracking**: Watch how reports move through: New → Triaged → In Progress → Resolved → Closed
- **Media Upload**: Add photos to your reports (compressed automatically)
- **Location Picker**: Use "📍 Use My Location" or click on the map

## Demo Data

The app comes pre-loaded with 6 sample reports to demonstrate functionality. These are visible in:
- Home page (recent reports)
- My Reports page
- Admin Dashboard
- Map View

## Troubleshooting

### MSW not working?
- Make sure you're running in development mode (`npm run dev`)
- Check browser console for MSW initialization messages

### Maps not loading?
- Ensure you have an internet connection (uses OpenStreetMap tiles)
- Check browser console for errors

### AI suggestions not working?
- By default, uses fallback deterministic logic
- Set `VITE_SIMULATE_AI=true` in `.env` to simulate AI responses
- For real AI, you'll need to set up a server-side proxy (see README)

## Next Steps

- Customize the color scheme in `src/styles/index.css`
- Add your own demo data in `src/data/demo-data.json`
- Integrate with a real backend API
- Add authentication for user accounts
- Deploy to production

