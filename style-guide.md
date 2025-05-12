# Color Palette Configuration

## Main Theme (Pastel Purple Based)
- Primary: `#B19CD9` (Soft Lavender)
- Secondary: `#E6E6FA` (Lavender Mist)
- Accent: `#D8BFD8` (Thistle)
- Background: `#F5F0FF` (Very Light Purple)
- Text: `#4B3B6B` (Deep Purple)
- Success: `#98FB98` (Pale Green)
- Error: `#FFB6C1` (Light Pink)
- Warning: `#FFE4B5` (Moccasin)

## Common UI Elements
- Primary Button: `#B19CD9` (Soft Lavender)
- Secondary Button: `#E6E6FA` (Lavender Mist)
- Cancel Button: `#FFB6C1` (Light Pink)
- Success Button: `#98FB98` (Pale Green)
- Disabled Button: `#D3D3D3` (Light Gray)
- Border: `#D8BFD8` (Thistle)
- Shadow: `rgba(177, 156, 217, 0.2)` (Soft Lavender with opacity)

## Typography
- Primary Font: `"Fredoka", sans-serif` (Google Font)
- Regular Weight: `400`
- Medium Weight: `500`
- Bold Weight: `700`
- Default font settings:
  ```css
  font-family: "Fredoka", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400; /* Adjust based on context */
  font-style: normal;
  font-variation-settings: "wdth" 100;
  ```
- Use Regular (400) for body text
- Use Medium (500) for section headers, buttons, and UI elements
- Use Bold (700) for main headers and important text

## Game-Specific Themes

### Addition Game (Ocean Theme)
- Primary: `#7FB3D5` (Sky Blue)
- Secondary: `#AED6F1` (Light Blue)
- Accent: `#85C1E9` (Steel Blue)
- Background: `#EBF5FB` (Alice Blue)

### Subtraction Game (Forest Theme)
- Primary: `#82E0AA` (Light Green)
- Secondary: `#ABEBC6` (Mint)
- Accent: `#7DCEA0` (Medium Sea Green)
- Background: `#E8F8F5` (Mint Cream)

### Number Recognition Game (Sunset Theme)
- Primary: `#F5B041` (Golden)
- Secondary: `#F9E79F` (Light Yellow)
- Accent: `#F1C40F` (Sunflower)
- Background: `#FEF9E7` (Light Yellow Background)

## Accessibility Considerations
- All color combinations maintain a minimum contrast ratio of 4.5:1 for normal text
- Interactive elements have distinct hover and active states
- Error and success states are distinguishable for color-blind users
- Text remains readable on all background colors
- Font size should be at least 16px for body text to ensure readability
- Use relative units (rem) for font sizes to maintain accessibility

## Usage Guidelines
1. Main theme colors should be used for the application shell and navigation
2. Game-specific themes should be used within their respective game interfaces
3. Common UI elements should maintain consistent colors across all games
4. Use shadows and borders to create depth and hierarchy
5. Maintain sufficient contrast for text readability
6. Use opacity variations for hover and active states
7. Ensure consistent typography by using the Fredoka font throughout the application
8. Apply appropriate font weights to create visual hierarchy

## CSS Variables
```css
:root {
    /* Main Theme */
    --primary-color: #B19CD9;
    --secondary-color: #E6E6FA;
    --accent-color: #D8BFD8;
    --background-color: #F5F0FF;
    --text-color: #4B3B6B;
    --success-color: #98FB98;
    --error-color: #FFB6C1;
    --warning-color: #FFE4B5;

    /* Common UI */
    --button-primary: #B19CD9;
    --button-secondary: #E6E6FA;
    --button-cancel: #FFB6C1;
    --button-success: #98FB98;
    --button-disabled: #D3D3D3;
    --border-color: #D8BFD8;
    --shadow-color: rgba(177, 156, 217, 0.2);
    
    /* Typography */
    --font-family: "Fredoka", sans-serif;
    --font-weight-regular: 400;
    --font-weight-medium: 500;
    --font-weight-bold: 700;
}
```

## Implementation Notes
1. Use CSS variables for consistent color application
2. Implement color schemes using CSS classes
3. Consider dark mode variations for future implementation
4. Test color combinations for accessibility
5. Use opacity for hover and active states instead of new colors
6. Maintain consistent shadows and borders across themes
7. Include the Google Font link in the head of HTML documents:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;700&display=swap" rel="stylesheet">
   ```
8. Always specify font-family and weight in CSS to maintain consistent typography 