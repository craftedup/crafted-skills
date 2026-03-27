---
name: API Designer
slug: api-designer
description: Designs RESTful and GraphQL APIs with consistent naming, proper status codes, pagination, and OpenAPI documentation.
author: crafted-skills
category: architecture
tags:
  - api
  - rest
  - openapi
  - design
tools:
  - claude
  - cursor
version: 1.0.0
createdAt: 2026-03-24
---

# API Designer

When asked to design or review an API, apply these principles:

## Naming Conventions
- Use plural nouns for resources: `/users`, `/orders`
- Use kebab-case for multi-word resources: `/order-items`
- Nest related resources: `/users/:id/orders`
- Use query parameters for filtering: `/users?role=admin&status=active`

## HTTP Methods
- `GET` — Read (idempotent, cacheable)
- `POST` — Create
- `PUT` — Full replace
- `PATCH` — Partial update
- `DELETE` — Remove

## Status Codes
- `200` — Success
- `201` — Created (include Location header)
- `204` — No Content (successful DELETE)
- `400` — Bad Request (validation errors)
- `401` — Unauthorized (missing/invalid auth)
- `403` — Forbidden (insufficient permissions)
- `404` — Not Found
- `409` — Conflict (duplicate resource)
- `422` — Unprocessable Entity (semantic errors)
- `429` — Too Many Requests (rate limited)
- `500` — Internal Server Error

## Pagination
Always paginate list endpoints. Use cursor-based pagination for large datasets:

```json
{
  "data": [...],
  "pagination": {
    "next_cursor": "abc123",
    "has_more": true
  }
}
```

## Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```
