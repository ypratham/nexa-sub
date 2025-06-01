# Nexa Subscription Manager

A modern web application for managing and tracking your subscriptions with an interactive calendar view and detailed analytics.

## 🚀 Demo

[Live Demo](deployment-url-here)

## ✨ Features

- 📅 Interactive calendar view for subscription renewals
- 💰 Track monthly, quarterly, and yearly subscriptions
- 📊 Detailed cost analytics and spending insights
- 🔍 Advanced filtering and sorting capabilities
- 🔐 Secure authentication with NextAuth
- 💳 Multiple currency support

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: NextAuth.js
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Type Safety**: TypeScript

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nexa-sub.git
```

2. Install dependencies:
```bash
cd nexa-sub
npm install
```

3. Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

## 🔧 Configuration

1. Set up MongoDB database
2. Configure Google OAuth credentials
3. Update environment variables

## 📱 Usage

1. Sign in with Google or create an account
2. Add your subscriptions
3. View them in the calendar or list view
4. Track spending and get insights
5. Manage renewal dates and costs

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [MongoDB](https://www.mongodb.com/)
- [NextAuth.js](https://next-auth.js.org/)