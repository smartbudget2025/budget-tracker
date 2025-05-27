# App Assets

This directory contains all the app assets required for App Store submission.

## Required Assets

### iOS
- `icon.png` (1024x1024) - App Store icon
- `splash.png` (2048x2048) - Splash screen image
- `adaptive-icon-foreground.png` (1024x1024) - iOS app icon

### Android
- `adaptive-icon.png` (1024x1024) - Android adaptive icon
- `adaptive-icon-background.png` (1024x1024) - Android adaptive icon background
- `notification-icon.png` (96x96) - Android notification icon

## Marketing Assets
- `feature-graphic.png` (1024x500) - Play Store feature graphic
- `screenshots/` - Directory containing app screenshots
  - iOS: 6.5" (1284x2778), 5.5" (1242x2208)
  - Android: Phone (1080x1920), Tablet (2048x2732)

## Asset Guidelines
1. All icons should be in PNG format
2. Use transparency where appropriate
3. Follow platform-specific guidelines for safe areas
4. Maintain consistent branding across all assets
5. Test assets on different screen sizes and devices

## Generating Assets
Use the following command to generate all required assets:
```bash
npx expo-optimize
```

This will create optimized versions of all assets in the correct sizes and formats. 