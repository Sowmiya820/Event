# Event Management System

A full-stack event management platform built with Next.js 15, React, TypeScript, Tailwind CSS, ShadCN-style UI components, Node.js, Express, MongoDB, Mongoose, JWT authentication, and Stripe test payments.

## Features

- JWT registration and login
- Public event listing, details, categories, search, and filters
- Organizer/admin event creation, editing, and deletion
- Ticket booking with Stripe test-mode PaymentIntents
- Booking confirmation records in MongoDB after successful payment verification
- User dashboard for booked events
- Admin dashboard for event and user management
- Responsive Tailwind UI with reusable components
- React Hook Form + Zod validation

## Project Structure

```text
backend/   Express API, MongoDB schemas, controllers, routes, middleware
frontend/  Next.js app router UI, pages, reusable components, API client
```

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB local instance or MongoDB Atlas database
- Stripe test account (or keep the dummy placeholders for local API shape testing)

## Environment Setup

Create `backend/.env` from `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

Create `frontend/.env.local` from `frontend/.env.example`:

```bash
cp frontend/.env.example frontend/.env.local
```

For Stripe test mode, use keys from your Stripe dashboard. Dummy placeholders are included only for development scaffolding.

## Install and Run

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:3000` and backend runs at `http://localhost:5000`.

## Useful Scripts

```bash
npm run build
npm run typecheck
npm run lint
```

## Default Roles

Users register as `user` by default. To create organizers/admins, update the `role` field in MongoDB to `organizer` or `admin`.
