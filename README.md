# Neurolabs Frontend Test - Image Recognition Application

A modern React application built with TypeScript, TanStack Router, and TanStack Query for image recognition task management and processing.

## 🚀 Features

### Phase 1: Core Application ✅

- **Catalog Management**: Browse and paginate through catalog items
- **IR Tasks Management**: View and manage image recognition tasks
- **Modern UI**: Built with Shadcn UI components and Tailwind CSS

### Phase 2: Image Upload & Processing ✅

- **Task Selection**: Choose specific IR tasks for image processing
- **Drag & Drop Upload**: Intuitive file upload with `react-dropzone`
- **Real-time Processing**: Live status updates and progress tracking
- **Results Display**: Comprehensive results with confidence scores and detection data
- **Smart Polling**: Optimized API polling for efficient resource usage

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Routing**: TanStack Router with file-based routing
- **State Management**: TanStack Query for server state
- **UI Components**: Shadcn UI + Tailwind CSS
- **Build Tool**: Vite with React plugin
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier

## 📋 Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher

> there is an `.nvmrc` in the project root directory, so any node version manager should properly resolve any issues.
> This project was developed using node v22.18.0 and npm 10.9.3

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone git@github.com:AMBacelar/flying-squirrel.git
cd flying-squirrel
npm install
```

This repository was scaffolded with vite.

### 2. Environment Setup

Copy the `.env.example` file to `.env` and update the API key:

```bash
cp .env.example .env
```

Then edit the `.env` file and replace `your_api_key_here` with your actual Neurolabs API key:

```env
VITE_NEUROLABS_API_KEY=your_actual_api_key_here
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

then serve the build with

```bash
npm run serve
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 📱 Application Structure

### Pages

- **Home** (`/`): Overview and navigation
- **Catalog** (`/catalog`): Browse catalog items with pagination
- **IR Tasks** (`/ir-tasks`): Manage image recognition tasks

### API Integration

- **RESTful API**: Integration with Neurolabs API endpoints
- **Real-time Updates**: Smart polling for processing status
- **Error Handling**: Comprehensive error handling and user feedback
- **Data Validation**: Zod schemas for runtime type safety

## 🔧 Configuration

### API Endpoints

The application is configured to work with:

- **Base URL**: `https://staging.api.neurolabs.ai`
- **Image Upload**: `POST /v2/image-recognition/tasks/{task_uuid}/images`
- **Status Check**: `GET /v2/image-recognition/tasks/{task_uuid}/results/`
- **Task Management**: `GET /v2/image-recognition/tasks/`

### Development Proxy

Vite is configured with a proxy for development:

```typescript
server: {
  proxy: {
    '/v2': {
      target: 'https://staging.api.neurolabs.ai',
      changeOrigin: true,
    },
  },
}
```

## 🔍 Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Ensure `.env` file is in the root directory
   - Verify the API key is correct
   - Check browser console for authentication errors

2. **File Upload Issues**
   - Supported formats: JPG, PNG, WebP, GIF, BMP
   - Maximum file size: 10MB per file
   - Ensure files are valid image formats

## 🤔 What I Would Do Differently

Of course, this is supposed to be a simple take-home test, and with time considerations, not every decision will be perfect, and not every item on the checklist will be accomplished. Here are a few things that I am looking at that I would do differently or get done:

- **Move away from "load more" pagination**, and instead use traditional pagination, so that it's easier to go back to the previous state, and it becomes a LOT more shareable
- **Add date filtering to task results**, so that user can filter to tasks done today/this week/this month/this year
- **Fetch all results** (in case there is more than one page worth) before showing them and poll on the incomplete ones (did not do this since the results seem static so that's not needed)
- **Assumed that duration is in milliseconds**, but since the API just returns 0 for everything, I can't confirm that
- **I haven't seen any successful results**, so I'm unable to see what the test results look like, I used cursor to generate that component based on the types, I'm sure that the gradient will look good XD
- **Proper skeleton loading state for task results**, would have been an excuse to use Suspense
