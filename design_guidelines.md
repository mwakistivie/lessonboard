# School Timetable Generator - Design Guidelines

## Design Approach
**System-Based Approach**: Using Material Design principles adapted for educational contexts. This utility-focused application prioritizes efficiency and usability over visual flair, with clear information hierarchy and intuitive workflows.

## Core Design Elements

### Color Palette
**Light Mode:**
- Primary: 219 91% 60% (Modern blue for educational trust)
- Secondary: 219 14% 71% (Neutral gray for supporting elements)
- Success: 142 76% 36% (Green for confirmations)
- Background: 0 0% 100% (Pure white)
- Surface: 220 14% 96% (Light gray cards/panels)

**Dark Mode:**
- Primary: 219 91% 70% (Lighter blue for contrast)
- Secondary: 219 14% 50% (Mid-tone gray)
- Success: 142 69% 58% (Lighter green)
- Background: 222 84% 5% (Deep dark blue-gray)
- Surface: 217 33% 17% (Dark surface panels)

### Typography
- **Primary Font**: Inter (Google Fonts) - Clean, readable for data-heavy interfaces
- **Headers**: 600 weight, sizes from text-xl to text-3xl
- **Body**: 400 weight, text-sm to text-base
- **Data/Time**: 500 weight, monospace for time slots

### Layout System
**Spacing Units**: Tailwind units of 2, 4, 6, and 8 for consistent rhythm
- Micro spacing: p-2, m-2 (8px)
- Standard spacing: p-4, m-4 (16px)
- Section spacing: p-6, m-6 (24px)
- Major spacing: p-8, m-8 (32px)

### Component Library

**Navigation**: 
- Clean header with logo and minimal navigation
- Breadcrumb navigation for multi-step workflows

**Forms**:
- Grouped form sections with clear labels
- Input validation with inline feedback
- Time picker components for schedule slots
- Dropdown selectors for grades/subjects

**Data Display**:
- Clean table layout for timetable preview
- Card-based layouts for configuration panels
- Progress indicators for multi-step processes

**Overlays**:
- Modal dialogs for confirmations and detailed editing
- Toast notifications for success/error states
- Loading states with subtle progress indicators

### Key Design Principles
1. **Information Hierarchy**: Clear visual distinction between time slots, subjects, and breaks
2. **Efficiency Focus**: Minimal clicks to create and modify timetables
3. **Educational Context**: Professional appearance suitable for school administrators
4. **Data Clarity**: Easy scanning of schedule information with proper spacing and typography
5. **Responsive Design**: Works effectively on desktop and tablet devices

### Images
No hero images required. This is a utility-focused application where function takes precedence over visual marketing elements. Consider small educational icons (calendar, clock, school building) as subtle accent elements in headers or empty states, sourced from Heroicons.

**Visual Tone**: Clean, professional, and trustworthy - reflecting the serious nature of educational scheduling while remaining approachable and user-friendly.