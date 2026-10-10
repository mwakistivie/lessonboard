# School Timetable Generator

## Overview

The School Timetable Generator is a web application designed to create and manage professional ICT schedules for educational institutions. It provides an intuitive interface for configuring school timetables with automatic break scheduling, grade management, and PDF export functionality. The application allows users to set up custom time slots, manage multiple grade levels, and generate weekly timetables with proper break intervals between lessons.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a **React-based SPA (Single Page Application)** architecture built with:
- **Vite** as the build tool for fast development and optimized production builds
- **TypeScript** for type safety across the codebase
- **Tailwind CSS** with **shadcn/ui** components following Material Design principles adapted for educational contexts
- **React Query (@tanstack/react-query)** for server state management and API caching
- **Wouter** for lightweight client-side routing

The UI follows a **component-based architecture** with reusable components organized in a clear hierarchy. The design system uses a **utility-first approach** with Tailwind CSS, implementing both light and dark themes with CSS custom properties for consistent theming.

### Backend Architecture
The backend implements a **REST API** pattern using:
- **Express.js** as the web framework
- **TypeScript** for consistent typing between frontend and backend
- **Modular route handling** with separated concerns for different API endpoints
- **In-memory storage** as the primary data layer (configurable for database integration)

The API follows **RESTful conventions** with standard HTTP methods and status codes. Error handling is centralized with consistent error response formats.

### Data Storage Solutions
The application uses **dual storage approaches**:
- **In-memory storage** for development and testing with a clean interface (`IStorage`)
- **PostgreSQL integration** ready via Drizzle ORM for production deployments
- **Structured schema definitions** using Drizzle with Zod validation for type safety

Data models include timetable configurations (time slots, breaks, grades) and generated schedules stored as JSON objects for flexibility.

### Authentication and Authorization
Currently implements a **basic user system** with:
- User registration and login capabilities
- Session-based authentication patterns ready for implementation
- Username/password authentication model
- Extensible design for adding role-based permissions

### Form Handling and Validation
The application uses **React Hook Form** with **Zod schemas** for:
- Client-side form validation
- Server-side data validation using the same schemas
- Type-safe form handling with TypeScript integration
- Consistent validation messages across the application

### State Management
Implements a **hybrid state management** approach:
- **React Query** for server state and API caching
- **React Context** for theme management and global UI state
- **Local component state** for form inputs and UI interactions
- **URL state** via Wouter for navigation and routing

### Export Functionality
Features **client-side PDF generation** using:
- **jsPDF** for PDF document creation
- **jsPDF-AutoTable** for structured table layouts
- Professional formatting with proper headers and styling
- Optimized for educational timetable printing requirements

### Development Tools
The development environment includes:
- **Hot module replacement** via Vite for fast development cycles
- **TypeScript checking** throughout the build process
- **Path aliases** for clean imports (`@/`, `@shared/`)
- **ESM module support** across frontend and backend