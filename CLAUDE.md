# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a birthday invitation system for "30 Anos do Vine" (30 Years of Vine) - a 30th birthday party project. It consists of two separate invitation pages (friends and family) with a guest management system.

## Project Structure

- `index.html` - Invitation page for friends (includes request to bring meat)
- `familia.html` - Invitation page for family (no meat request)  
- `admin.html` - Guest list management dashboard

## Key Features

### Invitation Pages
- **Countdown timer** to party date (August 16, 2025)
- **Different start times**: 19:00 for friends, 19:30 for family
- **RSVP form** collecting: name, phone, CPF, companion status
- **Google Maps integration** for party location
- **Calendar event** generation (Google Calendar)
- **Flamengo color scheme** (red, black, gold)

### Guest Management
- **Real-time statistics** (total guests, friends, family, companions)
- **Data export** (JSON and CSV formats)
- **Guest filtering** by event type
- **Local storage** based data persistence

## Party Details
- **Date**: August 16, 2025
- **Location**: ASBAC - CHURRASQUEIRA 16, Brasília, DF
- **Theme**: Churrasco (BBQ) with humor about being bald
- **Key message**: "30 anos aperfeiçoando a arte do churrasco e da calvície"

## Technical Implementation

### Data Storage
Uses `localStorage` to persist guest confirmations. Data structure:
```javascript
{
  name: string,
  phone: string, 
  cpf: string,
  companion: "sim" | "não",
  timestamp: ISO string,
  event: "amigos" | "familia"
}
```

### Responsive Design
- Mobile-first approach with CSS Grid
- Breakpoints at 768px and 600px
- Touch-friendly buttons and forms

### Form Validation
- Input masking for phone (XX) XXXXX-XXXX and CPF XXX.XXX.XXX-XX
- Required fields validation
- Real-time formatting

## Deployment

This is a static site designed for deployment on:
- GitHub Pages
- Netlify
- Any static hosting service

## Color Scheme

**Primary Colors (Flamengo theme):**
- Red: #DC143C
- Black: #000000  
- Gold: #FFD700
- Dark Red: #8B0000

## Humor Elements

The project incorporates self-deprecating humor about:
- Being bald at 30
- Churrasco (BBQ) skills
- Flamengo football team
- Jiu Jitsu practice

## Guest List Management

Access `/admin.html` to:
- View all confirmed guests
- Export guest lists for club submission
- Filter by event type (friends/family)
- Track companion counts
- Delete individual entries if needed