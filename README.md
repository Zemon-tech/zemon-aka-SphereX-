# SphereX - Open Source Community Platform edited 2nd time

SphereX is a modern web platform for the open source community, built with Next.js 14, Tailwind CSS, and Framer Motion. It provides a space for developers to discover projects, share news, and participate in events.

## Features

- 🏠 **Home Page**: Dynamic hero section with featured content
- 📰 **News**: Latest tech news and community updates
- 💻 **Repositories**: GitHub integration for project discovery
- 🛍️ **Web Store**: Showcase for developer tools and applications
- 🎉 **Events**: Hackathons and tech event management

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/UI
- **Animations**: Framer Motion
- **Backend**: Express.js (API routes)
- **Database**: MongoDB
- **Deployment**: Docker, Docker Compose

## Prerequisites

- Node.js 20.x or later
- Docker and Docker Compose
- MongoDB (for local development)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/spherex.git
   cd spherex
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/spherex
   GITHUB_TOKEN=your_github_token
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

- **Code Style**: The project uses ESLint and Prettier for code formatting
- **Type Checking**: TypeScript is used for type safety
- **Components**: Reusable components are in `src/components`
- **Pages**: Page components are in `src/app/(pages)`

## Docker Deployment

1. Build and run with Docker Compose:
   ```bash
   docker-compose up -d --build
   ```

2. The application will be available at [http://localhost:3000](http://localhost:3000)

3. To stop the services:
   ```bash
   docker-compose down
   ```

## Production Deployment

1. Build the production image:
   ```bash
   docker build -t spherex .
   ```

2. Push to your container registry:
   ```bash
   docker tag spherex your-registry/spherex
   docker push your-registry/spherex
   ```

3. Deploy to your VPS using Docker Compose:
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@spherex.com or join our Discord community.
