# EUNOIA Cyber & AI Technologies Website

A stunning, responsive website for EUNOIA Technologies built with Flask and modern web technologies.

## Features

- **Responsive Design**: Fully responsive across all devices (mobile, tablet, desktop)
- **Top-Grade Animations**: 
  - GSAP animations with ScrollTrigger
  - Three.js 3D background effects
  - Custom particle system
  - Magnetic buttons
  - Text scramble effects
  - Glitch effects
  - Parallax scrolling
- **Modern UI/UX**:
  - Cyberpunk-inspired design
  - Neon glow effects
  - Custom cursor
  - Smooth scrolling
  - Loading screen
  - Progress indicator
- **Interactive Elements**:
  - Hover effects
  - Course cards with 3D tilt
  - Contact form
  - Mobile navigation
  - Toast notifications

## Tech Stack

- **Backend**: Python, Flask
- **Frontend**: HTML5, Tailwind CSS, JavaScript
- **Animations**: GSAP, Three.js, Custom CSS
- **Icons**: Lucide Icons
- **Fonts**: Orbitron, Rajdhani, Inter

## Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the application:
   ```bash
   python app.py
   ```
4. Open your browser and navigate to `http://localhost:5000`

## Project Structure

```
eunoia/
├── app.py                 # Main Flask application (Optimized)
├── requirements.txt       # Python dependencies
├── instance/              # SQLite Database storage
├── static/
│   ├── images/           # Optimized WebP assets
│   ├── js/
│   │   └── main.js       # Main JavaScript file (Optimized)
│   └── vendor/           # Localized JS libraries
└── templates/
    └── index.html        # Main HTML template (Optimized)
```

## Optimizations

- **Image Optimization**: All images converted to WebP for 90%+ size reduction.
- **Database Persistence**: Integrated SQLAlchemy for robust data handling.
- **Local Assets**: All vendor libraries served locally for speed and reliability.
- **Code Cleanup**: Removed unused variables, optimized imports, and refined CSS structure.

## Customization

- **Courses**: Edit the `COURSES` dictionary in `app.py` to modify course content
- **Colors**: Update Tailwind config in the HTML `<script>` tag
- **Animations**: Modify `static/js/main.js`
- **Content**: Update the HTML template directly

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance Notes

- 3D effects are automatically disabled on mobile devices for better performance
- Particle count is reduced on smaller screens
- Animations respect `prefers-reduced-motion` settings

## License

© 2024 EUNOIA Technologies. All rights reserved.
