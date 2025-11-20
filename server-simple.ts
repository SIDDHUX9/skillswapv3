// server-simple.ts - Simple Next.js server without Socket.IO
const { createServer } = require('http');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const currentPort = 3000;
const hostname = '127.0.0.1';

// Simple Next.js server
async function startServer() {
  try {
    const nextApp = next({ 
      dev,
      dir: process.cwd(),
    });

    await nextApp.prepare();
    
    const handle = nextApp.getRequestHandler();

    // Create HTTP server
    const server = createServer(async (req, res) => {
      try {
        await handle(req, res);
      } catch (err) {
        console.error('Error handling request:', err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      }
    });

    // Start the server
    server.listen(currentPort, hostname, () => {
      console.log(`> Ready on http://${hostname}:${currentPort}`);
    });

  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
}

// Start the server
startServer();