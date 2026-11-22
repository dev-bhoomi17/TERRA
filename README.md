
# TERRA — Energy Intelligence Dashboard

A modern, responsive renewable energy analytics dashboard built using HTML, CSS, and JavaScript.

TERRA transforms fictional solar energy data into an engaging visual experience through custom charts, animated indicators, interactive tooltips, and color-coded performance cards.

## Overview

TERRA is a single-page dashboard concept designed to demonstrate how interactive visual cues can make complex information easier to understand.

The dashboard presents a fictional renewable energy network, allowing users to explore energy generation, storage, consumption, station performance, and environmental impact.

## Features

### 1. Interactive Energy Overview
- Animated daily energy generation counter.
- Circular SVG progress gauge.
- Daily generation target and performance indicator.
- Solar conditions visualization.

### 2. Performance Metrics
- Energy storage statistics.
- Estimated CO₂ emissions prevented.
- Active solar station count.
- Color-coded progress indicators.
- Contextual hover tooltips.

### 3. Dynamic Energy Production Chart
- Custom SVG-based area chart.
- Interactive data points.
- Hover-based value tooltips.
- Smooth chart transitions.
- 24-hour, 7-day, and 30-day views.

### 4. Station Performance
- Individual solar station statistics.
- Color-coded generation bars.
- Station status indicators.
- Interactive station cards.

### 5. Energy Distribution
Visualizes how generated energy is distributed across:
- Battery storage.
- Energy consumption.
- Grid export.

### 6. Responsive Design
- Desktop layout with sidebar navigation.
- Tablet-friendly grid layouts.
- Mobile-friendly navigation and stacked cards.
- Responsive charts and visual components.

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Dashboard structure |
| CSS3 | Styling, responsive layouts, animations |
| JavaScript | Interactions and dynamic data |
| SVG | Custom charts and energy gauge |
| Google Fonts | DM Sans and Manrope typography |

## Project Structure

```text
TERRA/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## Getting Started

### Run locally

1. Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/TERRA.git
```

2. Navigate to the project directory:

```bash
cd TERRA
```

3. Open `index.html` in your browser.

No backend, database, or build tools are required.

## Interactive Controls

| Control | Function |
|---|---|
| 24H | Displays hourly energy generation |
| 7D | Displays weekly energy generation |
| 30D | Displays monthly energy generation |
| Chart points | Reveal additional data through tooltips |
| Refresh | Replays dashboard animations |
| Explore all stations | Navigates to the station section |
| Sidebar navigation | Moves between dashboard sections |

## Demo Dataset

TERRA uses fictional demonstration data.

Example metrics:

- Daily energy generation: 842 kWh
- Daily generation target: 1,100 kWh
- Energy stored: 3,420 kWh
- CO₂ emissions prevented: 1.28 tons
- Active stations: 12 out of 14

The chart and dashboard figures are illustrative and are not connected to real solar stations or live monitoring services.

## Design Approach

TERRA uses an editorial-inspired visual language to create a distinctive analytics experience.

**Color palette**
- Forest Green — Primary interface and important data.
- Electric Lime — Highlights and positive indicators.
- Warm Ivory — Main background.
- Soft Blue — Secondary data indicators.
- Muted Orange — Supporting performance cues.

The interface combines generous spacing, rounded surfaces, subtle shadows, and animated visual elements to improve readability and engagement.

## Learning Outcomes

This project demonstrates:

- Creating an interactive single-page dashboard.
- Implementing dynamic SVG data visualizations.
- Using JavaScript to manage UI interactions.
- Applying CSS animations and hover effects.
- Designing responsive layouts.
- Presenting complex data using custom visual cues.

---

**TERRA — Small steps. Big impact.**
