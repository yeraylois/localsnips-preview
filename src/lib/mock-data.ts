/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : mock-data.ts                                   *
 *   Purpose : COHERENT MOCK DATA FOR GITHUB PAGES DEMO       *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

import { Item } from "./types";

// =============================================================================
// MOCK ITEMS - 20 REALISTIC SNIPPETS WITH COHERENT COUNTS
// =============================================================================
export const MOCK_ITEMS: Item[] = [
  // ===== FRONTEND/REACT (4 items) =====
  {
    id: "1",
    created_at: "2025-12-22T13:38:33.000Z",
    updated_at: "2025-12-22T13:38:33.000Z",
    source_type: "paste",
    original_filename: null,
    raw_content: `const Button = ({ children, onClick }: ButtonProps) => (
  <button 
    onClick={onClick}
    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
  >
    {children}
  </button>
);`,
    raw_sha256: "react1",
    kind: "snippet",
    language: "typescript",
    confidence: 0.95,
    collection: "Frontend/React",
    suggested_collection: "Frontend/React",
    technology: "react",
    suggested_technology: "react",
    tags: ["react", "typescript", "component"],
    title: "Button Component",
    summary: "Reusable React button with Tailwind styling.",
    doc_markdown: `## Overview\nA reusable button component with hover effects.\n\n## Props\n- \`children\`: Button text\n- \`onClick\`: Click handler`,
    commands: [],
    prerequisites: ["React 18+"],
    warnings: [],
    status: "done",
    no_ai: false,
    last_error: null
  },
  {
    id: "2",
    created_at: "2025-12-22T12:38:33.000Z",
    updated_at: "2025-12-22T12:38:33.000Z",
    source_type: "paste",
    original_filename: null,
    raw_content: `const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue] as const;
};`,
    raw_sha256: "react2",
    kind: "snippet",
    language: "typescript",
    confidence: 0.93,
    collection: "Frontend/React",
    suggested_collection: "Frontend/React",
    technology: "react",
    suggested_technology: "react",
    tags: ["react", "typescript", "hooks"],
    title: "useLocalStorage Hook",
    summary: "Custom React hook for persisting state in localStorage.",
    doc_markdown: `## Overview\nPersists state to localStorage with automatic sync.\n\n## Usage\n\`\`\`tsx\nconst [theme, setTheme] = useLocalStorage('theme', 'dark');\n\`\`\``,
    commands: [],
    prerequisites: ["React 18+"],
    warnings: [],
    status: "done",
    no_ai: false,
    last_error: null
  },
  {
    id: "3",
    created_at: "2025-12-22T11:38:33.000Z",
    updated_at: "2025-12-22T11:38:33.000Z",
    source_type: "paste",
    original_filename: null,
    raw_content: `const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;
  
  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-md">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
};`,
    raw_sha256: "react3",
    kind: "snippet",
    language: "typescript",
    confidence: 0.91,
    collection: "Frontend/React",
    suggested_collection: "Frontend/React",
    technology: "react",
    suggested_technology: "react",
    tags: ["react", "typescript", "component"],
    title: "Modal Component",
    summary: "Accessible modal dialog using React Portal.",
    doc_markdown: `## Overview\nModal component with backdrop and portal rendering.`,
    commands: [],
    prerequisites: ["React 18+"],
    warnings: [],
    status: "done",
    no_ai: false,
    last_error: null
  },
  {
    id: "4",
    created_at: "2025-12-22T10:38:33.000Z",
    updated_at: "2025-12-22T13:38:00.000Z",
    source_type: "paste",
    original_filename: null,
    raw_content: `const Tooltip = ({ text, children }: TooltipProps) => (
  <div className="relative group">
    {children}
    <span className="absolute opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded">
      {text}
    </span>
  </div>
);`,
    raw_sha256: "react4conflict",
    kind: "snippet",
    language: "typescript",
    confidence: 0.89,
    collection: "Frontend/React",
    suggested_collection: "Frontend/React",
    technology: "react",
    suggested_technology: "react",
    tags: ["react", "typescript", "component"],
    title: "Tooltip Component",
    summary: "CSS-only tooltip with hover trigger.",
    doc_markdown: `## Overview\nSimple tooltip using CSS group-hover.`,
    commands: [],
    prerequisites: [],
    warnings: [],
    status: "conflict_pending", // CONFLICT!
    no_ai: false,
    last_error: null
  },

  // ===== FRONTEND/VUE (2 items) =====
  {
    id: "5",
    created_at: "2025-12-21T13:38:33.000Z",
    updated_at: "2025-12-21T13:38:33.000Z",
    source_type: "paste",
    original_filename: null,
    raw_content: `<script setup lang="ts">
const count = ref(0);
const increment = () => count.value++;
</script>

<template>
  <button @click="increment">Count: {{ count }}</button>
</template>`,
    raw_sha256: "vue1",
    kind: "snippet",
    language: "vue",
    confidence: 0.92,
    collection: "Frontend/Vue",
    suggested_collection: "Frontend/Vue",
    technology: "vue",
    suggested_technology: "vue",
    tags: ["vue", "typescript"],
    title: "Vue Counter",
    summary: "Simple Vue 3 counter with Composition API.",
    doc_markdown: `## Overview\nVue 3 script setup counter component.`,
    commands: [],
    prerequisites: ["Vue 3"],
    warnings: [],
    status: "done",
    no_ai: false,
    last_error: null
  },
  {
    id: "6",
    created_at: "2025-12-20T13:38:33.000Z",
    updated_at: "2025-12-20T13:38:33.000Z",
    source_type: "paste",
    original_filename: null,
    raw_content: `<script setup>
const props = defineProps<{ items: string[] }>();
const emit = defineEmits<{ select: [item: string] }>();
</script>`,
    raw_sha256: "vue2",
    kind: "snippet",
    language: "vue",
    confidence: 0.90,
    collection: "Frontend/Vue",
    suggested_collection: "Frontend/Vue",
    technology: "vue",
    suggested_technology: "vue",
    tags: ["vue", "typescript"],
    title: "Vue Props & Emits",
    summary: "Type-safe props and emits in Vue 3.",
    doc_markdown: `## Overview\nTyped defineProps and defineEmits pattern.`,
    commands: [],
    prerequisites: ["Vue 3", "TypeScript"],
    warnings: [],
    status: "done",
    no_ai: false,
    last_error: null
  },

  // ===== BACKEND/NODE (3 items) =====
  {
    id: "7",
    created_at: "2025-12-19T13:38:33.000Z",
    updated_at: "2025-12-19T13:38:33.000Z",
    source_type: "paste",
    original_filename: null,
    raw_content: `const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(3000);`,
    raw_sha256: "node1",
    kind: "snippet",
    language: "javascript",
    confidence: 0.94,
    collection: "Backend/Node",
    suggested_collection: "Backend/Node",
    technology: "nodejs",
    suggested_technology: "express",
    tags: ["node", "express", "api"],
    title: "Express Health Check",
    summary: "Simple Express.js health endpoint.",
    doc_markdown: `## Overview\nMinimal Express server with health check endpoint.`,
    commands: ["node server.js"],
    prerequisites: ["Node.js", "Express"],
    warnings: [],
    status: "done",
    no_ai: false,
    last_error: null
  },
  {
    id: "8",
    created_at: "2025-12-18T13:38:33.000Z",
    updated_at: "2025-12-18T13:38:33.000Z",
    source_type: "paste",
    original_filename: null,
    raw_content: `const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests'
});

app.use('/api', limiter);`,
    raw_sha256: "node2",
    kind: "snippet",
    language: "javascript",
    confidence: 0.91,
    collection: "Backend/Node",
    suggested_collection: "Backend/Node",
    technology: "nodejs",
    suggested_technology: "express",
    tags: ["node", "express", "security"],
    title: "Express Rate Limiting",
    summary: "Rate limiting middleware for Express APIs.",
    doc_markdown: `## Overview\nProtect APIs from abuse with rate limiting.`,
    commands: ["npm install express-rate-limit"],
    prerequisites: ["Express"],
    warnings: ["Adjust limits based on your use case"],
    status: "done",
    no_ai: false,
    last_error: null
  },
  {
    id: "9",
    created_at: "2025-12-17T13:38:33.000Z",
    updated_at: "2025-12-22T13:39:00.000Z",
    source_type: "paste",
    original_filename: null,
    raw_content: `const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
};`,
    raw_sha256: "node3conflict",
    kind: "snippet",
    language: "javascript",
    confidence: 0.88,
    collection: "Backend/Node",
    suggested_collection: "Backend/Node",
    technology: "nodejs",
    suggested_technology: "express",
    tags: ["node", "express", "security", "jwt"],
    title: "JWT Auth Middleware",
    summary: "JWT authentication middleware for Express.",
    doc_markdown: `## Overview\nVerifies JWT tokens in Authorization header.`,
    commands: ["npm install jsonwebtoken"],
    prerequisites: ["Express", "jsonwebtoken"],
    warnings: ["Store JWT_SECRET securely"],
    status: "conflict_pending", // CONFLICT!
    no_ai: false,
    last_error: null
  },

  // ===== BACKEND/PYTHON (3 items) =====
  {
    id: "10",
    created_at: "2025-12-16T13:38:33.000Z",
    updated_at: "2025-12-16T13:38:33.000Z",
    source_type: "paste",
    original_filename: "api.py",
    raw_content: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

@app.post("/items/")
async def create_item(item: Item):
    return {"item": item}`,
    raw_sha256: "python1",
    kind: "snippet",
    language: "python",
    confidence: 0.95,
    collection: "Backend/Python",
    suggested_collection: "Backend/Python",
    technology: "python",
    suggested_technology: "fastapi",
    tags: ["python", "fastapi", "api"],
    title: "FastAPI Endpoint",
    summary: "FastAPI POST endpoint with Pydantic validation.",
    doc_markdown: `## Overview\nFastAPI endpoint with automatic validation.`,
    commands: ["uvicorn api:app --reload"],
    prerequisites: ["Python 3.9+", "FastAPI"],
    warnings: [],
    status: "done",
    no_ai: false,
    last_error: null
  },
  {
    id: "11",
    created_at: "2025-12-15T13:38:33.000Z",
    updated_at: "2025-12-15T13:38:33.000Z",
    source_type: "paste",
    original_filename: null,
    raw_content: `import pandas as pd

df = pd.read_csv('data.csv')
df_clean = df.dropna().drop_duplicates()
summary = df_clean.groupby('category').agg({'value': ['mean', 'sum', 'count']})
print(summary)`,
    raw_sha256: "python2",
    kind: "snippet",
    language: "python",
    confidence: 0.90,
    collection: "Backend/Python",
    suggested_collection: "Backend/Python",
    technology: "python",
    suggested_technology: "pandas",
    tags: ["python", "pandas", "data"],
    title: "Pandas Data Aggregation",
    summary: "Clean and aggregate CSV data with pandas.",
    doc_markdown: `## Overview\nBasic pandas workflow for data cleaning and grouping.`,
    commands: ["pip install pandas"],
    prerequisites: ["Python", "pandas"],
    warnings: [],
    status: "done",
    no_ai: false,
    last_error: null
  },
  {
    id: "12",
    created_at: "2025-12-14T13:38:33.000Z",
    updated_at: "2025-12-14T13:38:33.000Z",
    source_type: "paste",
    original_filename: null,
    raw_content: `from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(100))

engine = create_engine('sqlite:///db.sqlite')
Base.metadata.create_all(engine)`,
    raw_sha256: "python3",
    kind: "snippet",
    language: "python",
    confidence: 0.92,
    collection: "Backend/Python",
    suggested_collection: "Backend/Python",
    technology: "python",
    suggested_technology: "sqlalchemy",
    tags: ["python", "database", "orm"],
    title: "SQLAlchemy Model",
    summary: "SQLAlchemy ORM model with SQLite.",
    doc_markdown: `## Overview\nBasic SQLAlchemy model and engine setup.`,
    commands: ["pip install sqlalchemy"],
    prerequisites: ["Python", "SQLAlchemy"],
    warnings: [],
    status: "done",
    no_ai: false,
    last_error: null
  },

  // ===== DEVOPS/DOCKER (3 items) =====
  {
    id: "13",
    created_at: "2025-12-13T13:38:33.000Z",
    updated_at: "2025-12-13T13:38:33.000Z",
    source_type: "file_import",
    original_filename: "docker-compose.yml",
    raw_content: `version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:`,
    raw_sha256: "docker1",
    kind: "config",
    language: "yaml",
    confidence: 0.94,
    collection: "DevOps/Docker",
    suggested_collection: "DevOps/Docker",
    technology: "docker",
    suggested_technology: "docker",
    tags: ["docker", "devops", "postgres"],
    title: "Docker Compose Stack",
    summary: "Web app + PostgreSQL Docker Compose setup.",
    doc_markdown: `## Overview\nDocker Compose for web app with Postgres.`,
    commands: ["docker-compose up -d"],
    prerequisites: ["Docker", "Docker Compose"],
    warnings: [],
    status: "done",
    no_ai: false,
    last_error: null
  },
  {
    id: "14",
    created_at: "2025-12-12T13:38:33.000Z",
    updated_at: "2025-12-12T13:38:33.000Z",
    source_type: "file_import",
    original_filename: "Dockerfile",
    raw_content: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`,
    raw_sha256: "docker2",
    kind: "config",
    language: "dockerfile",
    confidence: 0.93,
    collection: "DevOps/Docker",
    suggested_collection: "DevOps/Docker",
    technology: "docker",
    suggested_technology: "docker",
    tags: ["docker", "devops", "node"],
    title: "Node.js Dockerfile",
    summary: "Optimized Dockerfile for Node.js apps.",
    doc_markdown: `## Overview\nProduction-ready Node.js Docker image.`,
    commands: ["docker build -t myapp ."],
    prerequisites: ["Docker"],
    warnings: [],
    status: "done",
    no_ai: false,
    last_error: null
  },
  {
    id: "15",
    created_at: "2025-12-11T13:38:33.000Z",
    updated_at: "2025-12-11T13:38:33.000Z",
    source_type: "paste",
    original_filename: null,
    raw_content: `docker system prune -af --volumes
docker builder prune -af`,
    raw_sha256: "docker3",
    kind: "snippet",
    language: "bash",
    confidence: 0.88,
    collection: "DevOps/Docker",
    suggested_collection: "DevOps/Docker",
    technology: "docker",
    suggested_technology: "docker",
    tags: ["docker", "devops", "cleanup"],
    title: "Docker Cleanup",
    summary: "Remove all unused Docker resources.",
    doc_markdown: `## Overview\nFree up disk space by removing unused Docker data.`,
    commands: [],
    prerequisites: ["Docker"],
    warnings: ["This removes ALL unused containers, images, and volumes"],
    status: "done",
    no_ai: false,
    last_error: null
  },

  // ===== DEVOPS/KUBERNETES (2 items) =====
  {
    id: "16",
    created_at: "2025-12-10T13:38:33.000Z",
    updated_at: "2025-12-10T13:38:33.000Z",
    source_type: "file_import",
    original_filename: "deployment.yaml",
    raw_content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: myapp:latest
        ports:
        - containerPort: 3000`,
    raw_sha256: "k8s1",
    kind: "config",
    language: "yaml",
    confidence: 0.95,
    collection: "DevOps/Kubernetes",
    suggested_collection: "DevOps/Kubernetes",
    technology: "kubernetes",
    suggested_technology: "kubernetes",
    tags: ["kubernetes", "devops"],
    title: "K8s Deployment",
    summary: "Kubernetes deployment with 3 replicas.",
    doc_markdown: `## Overview\nBasic K8s deployment manifest.`,
    commands: ["kubectl apply -f deployment.yaml"],
    prerequisites: ["Kubernetes cluster"],
    warnings: [],
    status: "done",
    no_ai: false,
    last_error: null
  },
  {
    id: "17",
    created_at: "2025-12-09T13:38:33.000Z",
    updated_at: "2025-12-09T13:38:33.000Z",
    source_type: "file_import",
    original_filename: "service.yaml",
    raw_content: `apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer`,
    raw_sha256: "k8s2",
    kind: "config",
    language: "yaml",
    confidence: 0.94,
    collection: "DevOps/Kubernetes",
    suggested_collection: "DevOps/Kubernetes",
    technology: "kubernetes",
    suggested_technology: "kubernetes",
    tags: ["kubernetes", "devops"],
    title: "K8s LoadBalancer Service",
    summary: "Kubernetes service with LoadBalancer type.",
    doc_markdown: `## Overview\nExpose deployment via LoadBalancer.`,
    commands: ["kubectl apply -f service.yaml"],
    prerequisites: ["Kubernetes cluster"],
    warnings: [],
    status: "done",
    no_ai: false,
    last_error: null
  },

  // ===== MOBILE/IOS (2 items) =====
  {
    id: "18",
    created_at: "2025-12-08T13:38:33.000Z",
    updated_at: "2025-12-08T13:38:33.000Z",
    source_type: "paste",
    original_filename: null,
    raw_content: `struct ContentView: View {
    @State private var count = 0
    
    var body: some View {
        VStack {
            Text("Count: \\(count)")
            Button("Increment") { count += 1 }
        }
    }
}`,
    raw_sha256: "swift1",
    kind: "snippet",
    language: "swift",
    confidence: 0.96,
    collection: "Mobile/iOS",
    suggested_collection: "Mobile/iOS",
    technology: "swift",
    suggested_technology: "swiftui",
    tags: ["swift", "swiftui", "ios"],
    title: "SwiftUI Counter",
    summary: "Simple SwiftUI state management example.",
    doc_markdown: `## Overview\n@State property wrapper for simple state.`,
    commands: [],
    prerequisites: ["Xcode 15+"],
    warnings: [],
    status: "done",
    no_ai: false,
    last_error: null
  },
  {
    id: "19",
    created_at: "2025-12-07T13:38:33.000Z",
    updated_at: "2025-12-07T13:38:33.000Z",
    source_type: "paste",
    original_filename: null,
    raw_content: `class NetworkManager {
    static let shared = NetworkManager()
    
    func fetch<T: Decodable>(_ url: URL) async throws -> T {
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode(T.self, from: data)
    }
}`,
    raw_sha256: "swift2",
    kind: "snippet",
    language: "swift",
    confidence: 0.94,
    collection: "Mobile/iOS",
    suggested_collection: "Mobile/iOS",
    technology: "swift",
    suggested_technology: "swift",
    tags: ["swift", "ios", "networking"],
    title: "Swift Network Manager",
    summary: "Generic async/await network fetcher.",
    doc_markdown: `## Overview\nSingleton network manager with generic JSON decoding.`,
    commands: [],
    prerequisites: ["iOS 15+"],
    warnings: [],
    status: "done",
    no_ai: false,
    last_error: null
  },

  // ===== INBOX (1 item - no collection) =====
  {
    id: "20",
    created_at: "2025-12-22T13:08:33.000Z",
    updated_at: "2025-12-22T13:08:33.000Z",
    source_type: "paste",
    original_filename: null,
    raw_content: `SELECT u.name, COUNT(o.id) as orders
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id
HAVING COUNT(o.id) > 5;`,
    raw_sha256: "sql1",
    kind: "snippet",
    language: "sql",
    confidence: 0.91,
    collection: null, // IN INBOX
    suggested_collection: "Backend/Database",
    technology: "postgresql",
    suggested_technology: "postgresql",
    tags: ["sql", "database"],
    title: "Users with Many Orders",
    summary: "Find users with more than 5 orders.",
    doc_markdown: `## Overview\nSQL query to find active users.`,
    commands: [],
    prerequisites: [],
    warnings: [],
    status: "done",
    no_ai: false,
    last_error: null
  }
];

// =============================================================================
// MOCK CONFLICTS - For items with status "conflict_pending"
// =============================================================================
export const MOCK_CONFLICTS = {
  "4": [ // Tooltip Component
    {
      candidate_id: "4-old",
      similarity: 0.82,
      candidate: {
        id: "4-old",
        title: "Simple Tooltip",
        raw_content: `const Tooltip = ({ label, children }) => (
  <span title={label}>{children}</span>
);`,
        collection: "Frontend/React",
        language: "typescript"
      }
    }
  ],
  "9": [ // JWT Auth Middleware
    {
      candidate_id: "9-old",
      similarity: 0.78,
      candidate: {
        id: "9-old",
        title: "Basic Auth Check",
        raw_content: `const auth = (req, res, next) => {
  if (!req.headers.authorization) return res.sendStatus(401);
  next();
};`,
        collection: "Backend/Node",
        language: "javascript"
      }
    }
  ]
};

// =============================================================================
// MOCK STATUS - Stack is running
// =============================================================================
export const MOCK_STATUS = {
  state: "running",
  queue: { active: 0, waiting: 0 },
  counts: { 
    inbox: 1,  // 1 item without collection (id: 20)
    total: 20, // Total items
    trash: 0,
    active: 0
  },
  services: {
    postgres: "up",
    redis: "up", 
    worker: "up"
  }
};

// =============================================================================
// MOCK TAGS - Computed from actual items above
// =============================================================================
export const MOCK_TAGS = [
  { text: "react", count: 4 },
  { text: "typescript", count: 5 },
  { text: "component", count: 3 },
  { text: "python", count: 3 },
  { text: "docker", count: 3 },
  { text: "devops", count: 5 },
  { text: "node", count: 3 },
  { text: "express", count: 3 },
  { text: "api", count: 2 },
  { text: "swift", count: 2 },
  { text: "kubernetes", count: 2 },
  { text: "vue", count: 2 },
  { text: "security", count: 2 },
  { text: "ios", count: 2 },
  { text: "database", count: 2 }
];

// =============================================================================
// MOCK COLLECTIONS - Computed from actual items above
// =============================================================================
export const MOCK_COLLECTIONS = [
  { 
    name: "Frontend", 
    fullPath: "Frontend", 
    count: 6, // 4 React + 2 Vue
    children: [
      { name: "React", fullPath: "Frontend/React", count: 4, children: [] },
      { name: "Vue", fullPath: "Frontend/Vue", count: 2, children: [] }
    ]
  },
  { 
    name: "Backend", 
    fullPath: "Backend", 
    count: 6, // 3 Node + 3 Python
    children: [
      { name: "Node", fullPath: "Backend/Node", count: 3, children: [] },
      { name: "Python", fullPath: "Backend/Python", count: 3, children: [] }
    ]
  },
  { 
    name: "DevOps", 
    fullPath: "DevOps", 
    count: 5, // 3 Docker + 2 K8s
    children: [
      { name: "Docker", fullPath: "DevOps/Docker", count: 3, children: [] },
      { name: "Kubernetes", fullPath: "DevOps/Kubernetes", count: 2, children: [] }
    ]
  },
  {
    name: "Mobile",
    fullPath: "Mobile",
    count: 2, // 2 iOS
    children: [
      { name: "iOS", fullPath: "Mobile/iOS", count: 2, children: [] }
    ]
  }
];

// =============================================================================
// HELPER
// =============================================================================
export const simulateDelay = (ms: number = 100) => 
  new Promise(resolve => setTimeout(resolve, ms));
