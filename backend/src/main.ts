const fs = require('fs');
const path = require('path');

// Try to load .env file if it exists
try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = require('dotenv').parse(fs.readFileSync(envPath));
        for (const k in envConfig) {
            process.env[k] = envConfig[k];
        }
    } else {
        // In production/containerized envs, variables are often injected directly, so this is expected.
        if (process.env.NODE_ENV !== 'production') {
            console.log('⚠️ No .env file found. relying on system environment variables.');
        }
    }
} catch (e) {
    console.error('Failed to load .env file', e);
}

// Global crash handlers
process.on('uncaughtException', (err) => {
    console.error('🔥 UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('🔥 UNHANDLED REJECTION:', reason);
});

import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import { SocketHandler } from './gateway/socket.handler';

import { Redis } from 'ioredis';
import { CacheService } from './common/services/cache.service';
import { IdempotencyService } from './common/middleware/idempotency.service';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3002', 10);

console.log('🚀 Starting SchemaFlow Backend...');
console.log(`📍 Environment: ${dev ? 'development' : 'production'}`);
console.log(`📍 Port: ${port}`);

// Upstash configuration
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Initialize Redis/Cache (Logic kept same, just cleaned up vars)
if (UPSTASH_URL && UPSTASH_TOKEN) {
    console.log('⏳ Connecting to Upstash Redis (HTTP)...');
    try {
        const { Redis: UpstashRedis } = require('@upstash/redis');
        const redis = new UpstashRedis({
            url: UPSTASH_URL,
            token: UPSTASH_TOKEN,
        });
        console.log('✅ Upstash Redis (HTTP) configured');

        CacheService.initialize(redis);
        IdempotencyService.initialize(redis);
    } catch (e) {
        console.error('❌ Failed to initialize Upstash Redis:', e);
        CacheService.initialize(); // Fallback
        IdempotencyService.initialize();
    }
} else if (process.env.REDIS_URL) {
    console.log('⏳ Connecting to Redis (TCP)...');
    const redis = new Redis(process.env.REDIS_URL, {
        family: 4,
        tls: process.env.REDIS_TLS === 'true' ? { rejectUnauthorized: false } : undefined
    });

    redis.on('connect', () => console.log('✅ Redis connected'));
    redis.on('error', (err) => console.error('❌ Redis Connection Error:', err));

    CacheService.initialize(redis);
    IdempotencyService.initialize(redis);
} else {
    console.warn('⚠️ No REDIS_URL found. Using In-Memory stores.');
    CacheService.initialize();
    IdempotencyService.initialize();
}


// Init Next.js
console.log('⏳ Initializing Next.js...');
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    console.log('✅ Next.js ready');
    console.log('⏳ Creating HTTP server...');

    const server = createServer(async (req, res) => {
        // Logging for debug
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.headers.origin || 'unknown'}`);

        // CORS Configuration
        const origin = req.headers.origin;
        const allowedOrigins = [
            'https://schemaflow.pages.dev',
            'http://localhost:3000',
            'https://schemaflow-backend.onrender.com'
        ];

        // Allow dynamic origin for credentials support if matched
        if (origin) {
            if (allowedOrigins.includes(origin) || origin.endsWith('.pages.dev')) {
                res.setHeader('Access-Control-Allow-Origin', origin);
            } else {
                console.log(`⚠️ Blocked CORS origin: ${origin}`);
            }
        } else {
            // For testing tools like Postman that might not send origin, just allow * if needed or ignore
            // res.setHeader('Access-Control-Allow-Origin', '*'); 
        }

        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            res.end();
            return;
        }

        try {
            const parsedUrl = parse(req.url!, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    });

    console.log('⏳ Initializing Socket.IO...');
    // Initialize Socket.io on the same HTTP server
    const io = new Server(server, {
        path: '/api/socket/io',
        addTrailingSlash: false,
        cors: {
            origin: (requestOrigin, callback) => {
                // Allow all origins for connectivity debugging
                callback(null, true);
            },
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Initialize our Socket Handler
    new SocketHandler(io);
    console.log('✅ Socket.IO ready');

    server.listen(port, '0.0.0.0', () => {
        console.log('');
        console.log('🎉 ================================');
        console.log(`✅ Server ready on http://0.0.0.0:${port}`);
        console.log(`✅ Socket.IO ready on /api/socket/io`);
        console.log('🎉 ================================');
        console.log('');
    });
}).catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
});
