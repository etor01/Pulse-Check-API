# Pulse-Check-API ("WatchDog" Sentinel)

## Overview

Pulse-Check-API is a Dead Man’s Switch backend service built to monitor remote devices operating in unreliable connectivity environments.

CritMon Servers Inc. monitors infrastructure such as solar farms and unmanned weather stations. These devices are expected to send periodic heartbeat signals. If a device stops communicating, the system must automatically detect the failure and trigger an alert.

This API provides:

- Monitor registration with configurable timeout
- Heartbeat-based timer reset
- Automatic failure detection
- Alert triggering when a device goes silent
- Pause functionality for maintenance
- Monitor status inspection

The system is implemented using **Node.js** and **Express**, with in-memory state management.

---

# Architecture Diagram

The following sequence diagram illustrates the system flow:

```mermaid
sequenceDiagram
    participant Device as Monitor Device
    participant API as WatchDog API
    participant Admin

    Admin->>API: POST /monitors (create monitor)
    API->>API: Start countdown timer

    Device->>API: POST /monitors/{id}/heartbeat
    API->>API: Reset countdown timer
# Pulse-Check-API ("WatchDog" Sentinel)

Pulse-Check-API is a Dead Man’s Switch backend service built to monitor remote devices operating in unreliable connectivity environments.

## Table of Contents

- [Overview](#overview)
- [Architecture Diagram](#architecture-diagram)
- [Setup Instructions](#setup-instructions)
- [Server URL](#server-url)
- [API Endpoints](#api-endpoints)
- [Alert Behavior](#alert-behavior)
- [Developer’s Choice: Monitor Status Endpoint](#developers-choice-monitor-status-endpoint)
- [Deployment Recommendation](#deployment-recommendation)
- [Technical Notes](#technical-notes)
- [Future Improvements](#future-improvements)

## Overview

CritMon Servers Inc. monitors infrastructure such as solar farms and unmanned weather stations. These devices are expected to send periodic heartbeat signals. If a device stops communicating, the system must automatically detect the failure and trigger an alert.

This API provides:

- Monitor registration with configurable timeout
- Heartbeat-based timer reset
- Automatic failure detection
- Alert triggering when a device goes silent
- Pause functionality for maintenance
- Monitor status inspection

The system is implemented using **Node.js** and **Express**, with in-memory state management.

---

## Architecture Diagram

The following sequence diagram illustrates the system flow:

```mermaid
sequenceDiagram
    participant Device as Monitor Device
    participant API as WatchDog API
    participant Admin

    Admin->>API: POST /monitors (create monitor)
    API->>API: Start countdown timer

    Device->>API: POST /monitors/{id}/heartbeat
    API->>API: Reset countdown timer

    Admin->>API: POST /monitors/{id}/pause
    API->>API: Stop timer (status = paused)

    Device->>API: POST /monitors/{id}/heartbeat
    API->>API: Auto-unpause + Restart timer

    Admin->>API: GET /monitors/{id}
    API-->>Admin: Return monitor status

    Note over API: Timer expires (no heartbeat)
    API->>Admin: Webhook / Critical Alert
    API->>API: status = down
```

## Setup Instructions

1. Clone Your Forked Repository

```bash
git clone https://github.com/\<your-username\>/pulse-check-api.git
cd pulse-check-api
```

2. Install Dependencies

```bash
npm install
```

3. Start the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## Server URL

By default:

http://localhost:3000

## API Endpoints

1. Register a Monitor

`POST /monitors`

Creates a new monitor and starts a countdown timer.

Request Body

```json
{
  "id": "device-123",
  "timeout": 60,
  "alert_email": "admin@critmon.com"
}
```

Response

- `201 Created` — Monitor successfully registered
- `400 Bad Request` — Missing fields or duplicate ID

2. Send Heartbeat

`POST /monitors/:id/heartbeat`

Resets the countdown timer if the monitor exists.

Behavior

- If monitor exists and is active:
  - Timer resets
  - Returns `200 OK`
- If monitor does not exist:
  - Returns `404 Not Found`
- If the monitor was paused, sending a heartbeat automatically unpauses it and restarts the timer.

3. Pause Monitoring (Bonus Feature)

`POST /monitors/:id/pause`

Stops the timer and prevents alerts from firing.

Behavior

- Sets monitor status to paused
- Clears existing timeout
- Returns `200 OK`
- Returns `404 Not Found` if monitor does not exist

4. Get Monitor Status (Developer’s Choice Feature)

`GET /monitors/:id`

Returns the current state of a monitor.

Response Example

```json
{
  "id": "device-123",
  "timeout": 60,
  "status": "up",
  "paused": false
}
```

## Alert Behavior

If no heartbeat is received before the timeout expires:

The system logs:

```json
{
  "ALERT": "Device device-123 is down!",
  "time": "2026-02-14T12:00:00.000Z"
}
```

The monitor status is updated to:

- `down`

## Developer’s Choice: Monitor Status Endpoint

### Feature Added

`GET /monitors/:id`

### Why It Was Added

While the core system automatically triggers alerts on failure, operational systems require observability and manual inspection capabilities.

This endpoint improves robustness by:

- Allowing administrators to verify device status at any time
- Supporting debugging and operational audits
- Making the system more production-ready
- Enabling future UI/dashboard integration

Without this endpoint, there would be no way to query the current state of a monitor programmatically.

## Deployment Recommendation

This application can be deployed easily using:

- Render — https://render.com

### Deployment Steps

1. Push your project to your forked GitHub repository.
2. Create a Render account.
3. Select "New Web Service".
4. Connect your GitHub repository.
5. Configure:

- Build Command: `npm install`
- Start Command: `npm start`

6. Deploy.

Render will provide a public URL for accessing your API.

## Technical Notes

- In-memory storage is implemented using a JavaScript Map.
- Timers are managed using `setTimeout`.
- The architecture is structured using:
  - Routes
  - Controllers
  - Services

Designed to demonstrate stateful backend logic and event-driven failure detection.

## Future Improvements

- Persistent database storage (Redis or PostgreSQL)
- Real webhook integration
- Authentication & role-based access control
- Retry logic for alert delivery
- Horizontal scaling using distributed timers