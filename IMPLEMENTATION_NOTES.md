# Implementation Notes

## Overview

This is a multi-repo hybrid mobile demo that mimics the Hong Kong Octopus app's loyalty feature. The architecture uses **native iOS and Android shells** with a 5-tab bottom navigation bar. The Loyalty tab displays a native screen with campaign banners. Tapping a banner launches a **full-screen WebView** (with tab bar hidden) that loads an Ionic React web app showing the campaign details and participating shops.

## Project Structure

```
loyalty-demo/                    # Ionic React web app (this repo)
├── src/
│   ├── pages/                  # 3 campaign pages
│   ├── bridge/                 # JavaScript bridge for native communication
│   └── data/                   # Campaign data
└── vite.config.ts              # Vite config with host: '0.0.0.0' for Android emulator

ios-native/OctopusApp/           # iOS native shell (separate location)
├── MainTabBarController.swift   # 5-tab bottom navigation
├── LoyaltyViewController.swift  # Native Loyalty screen with banners
└── WebViewViewController.swift  # Full-screen WKWebView container

~/AndroidStudioProjects/OctopusApp/  # Android native shell (separate location)
├── MainActivity.kt              # Main activity with bottom navigation
├── WebViewActivity.kt           # Full-screen WebView activity
└── fragments/
    ├── LoyaltyFragment.kt       # Native Loyalty screen with banners
    └── OtherFragments.kt        # Placeholder fragments for other tabs
```

## Tech Stack

### Ionic React Web App (loyalty-demo)
- **Ionic 8.5** - Mobile UI framework with iOS/Android-style components
- **React 19** - JavaScript framework
- **React Router 5.3** - Client-side routing for 3-level navigation
- **TypeScript 5.9** - Type safety
- **Vite 5.4** - Development server and build tool
- **Ionicons 7.4** - Icon library

**IMPORTANT**: This is **NOT** a Capacitor project. It's a pure web app loaded in native WebViews. No Capacitor dependencies exist in package.json.

### iOS Native App
- **Language**: Swift
- **UI Framework**: UIKit (no SwiftUI, no Storyboards)
- **Product Name**: OctopusApp
- **WebView**: WKWebView with WKScriptMessageHandler for JS bridge
- **Navigation**: UINavigationController with tab bar hiding via `hidesBottomBarWhenPushed`
- **Target iOS**: 13.0+

### Android Native App
- **Language**: Kotlin
- **UI Framework**: Traditional Android Views (AppCompat, no Jetpack Compose)
- **Package**: com.octopus.app
- **WebView**: Android WebView with JavascriptInterface for JS bridge
- **Navigation**: Activity-based with BottomNavigationView and Fragments
- **Min SDK**: API 24 (Android 7.0)
- **Build System**: Gradle with Kotlin DSL

## High-Level Architecture

```
┌──────────────────────────────────────────┐
│      Native Shell (iOS / Android)        │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │   Bottom Tab Bar (Always Visible)  │ │
│  │   [Manage] [Loyalty] [TopUp]       │ │
│  │         [Travel] [Message]          │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Native Loyalty Screen (Root)           │
│  ├─ Points Header: "2,450 Points"       │
│  └─ Campaign Banners (3)                │
│      • ☕ Coffee Frenzy                  │
│      • 🛒 Weekend Supermarket Cashback  │
│      • 🎬 Cinema Rewards                │
│                                          │
│  ↓ User taps banner                     │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Full-Screen WebView               │ │
│  │  (Tab bar HIDDEN)                  │ │
│  │                                    │ │
│  │  Ionic React App                   │ │
│  │  ├─ Level 1: Campaign Landing      │ │
│  │  ├─ Level 2: Participating Shops   │ │
│  │  └─ Level 3: Shop Detail           │ │
│  │                                    │ │
│  │  JS Bridge: closeWebview()         │ │
│  └────────────────────────────────────┘ │
│                                          │
└──────────────────────────────────────────┘
```

## Key Design Principles

1. **Native Root**: The Loyalty tab shows a native screen (not WebView) with points and campaign banners
2. **Full-Screen WebView**: Tapping a banner launches a separate full-screen native container with WebView inside
3. **Hidden Tab Bar**: The bottom navigation bar is hidden when WebView is active
4. **3-Level Navigation**: WebView handles inner navigation (campaign → shops → shop detail)
5. **JS Bridge**: Web app calls native functions to close and return to native Loyalty screen

## Ionic React App Structure

### Development Server Configuration

**vite.config.ts** - Critical configuration for Android emulator access:
```typescript
export default defineConfig({
  server: {
    host: '0.0.0.0',  // REQUIRED: Binds to all network interfaces
    port: 5173        // Default Vite port
  }
})
```

**Why `host: '0.0.0.0'` is required:**
- By default, Vite binds to `localhost` (127.0.0.1) only
- Android emulator uses `10.0.2.2` to access host machine's localhost
- Setting `host: '0.0.0.0'` allows connections from external sources (emulator)
- iOS Simulator can use `localhost` directly, but Android cannot

**Starting the dev server:**
```bash
cd loyalty-demo
npm run dev
# Server runs at:
# - iOS Simulator: http://localhost:5173/
# - Android Emulator: http://10.0.2.2:5173/
# - Network: http://<your-local-ip>:5173/
```

### Routes (src/App.tsx)

Three routes for the 3-level navigation:

```typescript
/promo/:campaignId                      // Level 1: Campaign Landing
/promo/:campaignId/offers               // Level 2: Participating Shops List
/promo/:campaignId/offers/:offerId      // Level 3: Shop Detail
```

Example URLs:
- `http://localhost:5173/promo/coffee-frenzy`
- `http://localhost:5173/promo/coffee-frenzy/offers`
- `http://localhost:5173/promo/coffee-frenzy/offers/star-coffee-central`

### Pages

1. **CampaignLandingPage.tsx** (Level 1)
   - Shows campaign hero image, title, description
   - Tabbed interface: Overview / Shops / Terms & Conditions
   - **Orange gradient header** with **BLACK title** and **BLACK X icon on LEFT**
   - Close button (X) calls `NativeBridge.closeWebview()`
   - "See Offers" CTA button navigates to shops list
   - URL pattern: `/promo/:campaignId` (e.g., `/promo/coffee-frenzy`)

2. **ParticipatingShopsPage.tsx** (Level 2)
   - Lists all participating shops for the campaign
   - Each shop card shows name, location, bonus details
   - **Orange gradient header** with **BLACK title** and **BLACK X icon on LEFT**
   - Back button returns to campaign landing page
   - Close button (X) exits entire WebView to native
   - Tapping shop card navigates to shop detail
   - URL pattern: `/promo/:campaignId/offers`

3. **ShopDetailPage.tsx** (Level 3)
   - Shows detailed shop information
   - Shop image, name, address, opening hours
   - Special bonus offer details
   - **Orange gradient header** with **BLACK title** and **BLACK X icon on LEFT**
   - Back button returns to offers list
   - Close button (X) exits entire WebView to native
   - URL pattern: `/promo/:campaignId/offers/:offerId`

**UI Fix Applied (Critical):**
- **Problem**: Original toolbar had white title and white X icon on orange gradient background (invisible)
- **Solution**: Changed all 3 pages to use:
  - `<IonButtons slot="start">` - X button on LEFT side
  - `<IonIcon style={{ color: 'black' }}>` - BLACK X icon
  - `<IonTitle style={{ color: 'black' }}>` - BLACK title text
- **Result**: Perfect visibility and correct UX (X on left follows iOS/Android back button convention)

### Native Bridge (src/bridge/nativeBridge.ts)

JavaScript module that communicates with native code:

```typescript
NativeBridge.closeWebview()       // Dismiss WebView, return to native
NativeBridge.enableSwipeBack()    // Enable iOS swipe gesture
NativeBridge.disableSwipeBack()   // Disable iOS swipe gesture
```

**iOS Implementation**:
- Uses `window.webkit.messageHandlers.closeWebview.postMessage(...)`
- Handled by WKScriptMessageHandler in WebViewViewController

**Android Implementation**:
- Uses `window.AndroidInterface.closeWebview()`
- Handled by @JavascriptInterface in WebViewActivity

### Campaign Data (src/data/campaigns.ts)

Hard-coded campaign data with 3 campaigns:

**1. Coffee Frenzy** (`coffee-frenzy`)
- 2x Points at participating coffee shops
- 4 shops: Star Coffee (Central, Causeway Bay), Brew Masters, The Daily Grind

**2. Weekend Supermarket Cashback** (`supermarket-weekend`)
- 5% Cashback on grocery purchases
- 3 shops: FreshMart (Mong Kok, Tsim Sha Tsui), CityMarket

**3. Cinema Rewards** (`cinema-rewards`)
- Free Popcorn with movie ticket purchase
- 3 cinemas: Grand Cinema (Causeway Bay, Tsuen Wan), Star Theatres

Each campaign includes:
- Campaign metadata (id, title, emoji, badge, description)
- Array of participating shops with details (name, location, address, hours, special bonus)

## iOS Native Structure

### Key Files (ios-native/OctopusApp/)

**AppDelegate.swift**
- Entry point of the iOS app
- Sets window root view controller to MainTabBarController

**MainTabBarController.swift**
- UITabBarController with 5 tabs
- Each tab wrapped in UINavigationController for push/pop navigation
- Tabs: Manage, Loyalty, Top Up, Travel, Message
- Tab bar tint color: Octopus orange (#FF6B00)
- First tab (Manage) selected by default on launch

**LoyaltyViewController.swift**
- **Native screen** (NOT WebView) for the Loyalty tab
- Programmatically built UI (no Storyboard):
  - White background
  - Points header: "💳 Octopus Card" with "2,450 Points" badge
  - 3 campaign banner cards (vertically stacked)
- Each banner shows: emoji, title, subtitle, badge
- Tapping banner pushes WebViewViewController:
  ```swift
  let webVC = WebViewViewController(campaignId: "coffee-frenzy")
  navigationController?.pushViewController(webVC, animated: true)
  ```
- **No close button** - this is the root screen of Loyalty tab

**WebViewViewController.swift**
- Full-screen container for WKWebView
- **CRITICAL LINE**: `hidesBottomBarWhenPushed = true` in `init()` - hides tab bar
- Hides navigation bar for true full-screen effect
- Loads URL: `http://localhost:5173/promo/{campaignId}`
- WKWebView configuration:
  - JavaScript enabled
  - Adds 3 script message handlers: `closeWebview`, `enableSwipeBack`, `disableSwipeBack`
- Implements `WKScriptMessageHandler`:
  - `closeWebview` → `navigationController?.popViewController(animated: true)`
  - `enableSwipeBack` → Enables interactive pop gesture
  - `disableSwipeBack` → Disables interactive pop gesture
- Swipe-back gesture enabled by default
- Web content can disable swipe at root level (level 1)

### Flow

1. User taps Loyalty tab → LoyaltyViewController
2. User taps "Coffee Frenzy" banner → `navigationController?.pushViewController(WebViewViewController(campaignId: "coffee-frenzy"), animated: true)`
3. WebViewViewController pushed with `hidesBottomBarWhenPushed = true` → tab bar disappears
4. WebView loads Ionic app at `/promo/coffee-frenzy`
5. User taps Close (X) → JS calls `window.webkit.messageHandlers.closeWebview.postMessage(...)`
6. Native receives message → `navigationController?.popViewController(animated: true)`
7. Returns to LoyaltyViewController → tab bar reappears

## Android Native Structure

### Key Files (~/AndroidStudioProjects/OctopusApp/)

**MainActivity.kt** (com.octopus.app)
- AppCompatActivity with BottomNavigationView (5 tabs)
- Layout: Toolbar at top + Fragment container + Bottom nav at bottom
- Tabs: Manage, Loyalty, Top Up, Travel, Message
- Each tab switches fragments in `fragment_container` FrameLayout
- Toolbar styling:
  - White background
  - Black title text
  - Title updates based on selected tab
- Bottom navigation listener:
  ```kotlin
  bottomNav.setOnItemSelectedListener { item ->
    when (item.itemId) {
      R.id.nav_loyalty -> {
        supportActionBar?.title = "Loyalty Rewards"
        loadFragment(LoyaltyFragment())
        true
      }
      // ... other tabs
    }
  }
  ```
- **No close button** on MainActivity - it's the root container

**LoyaltyFragment.kt** (com.octopus.app.fragments)
- **Native fragment** (NOT WebView) for the Loyalty tab
- Programmatically builds UI using CardView, LinearLayout, TextView, ImageView
- Shows:
  - Points header card: "💳 Octopus Card" with "2,450 Points"
  - 3 campaign banner cards (vertically stacked)
- Each banner clickable, launches WebViewActivity:
  ```kotlin
  private fun openWebView(campaignId: String) {
    val intent = Intent(requireContext(), WebViewActivity::class.java)
    intent.putExtra("url", "http://10.0.2.2:5173/promo/$campaignId")
    startActivity(intent)
  }
  ```
- Uses `10.0.2.2` for Android emulator (maps to host's localhost)

**WebViewActivity.kt** (com.octopus.app)
- **Separate Activity** (NOT part of MainActivity)
- Full-screen WebView (bottom navigation NOT visible)
- Creates WebView programmatically:
  - `javaScriptEnabled = true`
  - `domStorageEnabled = true`
  - `webViewClient = WebViewClient()`
- Adds JavaScript interface:
  ```kotlin
  webView.addJavascriptInterface(AndroidInterface(), "AndroidInterface")
  ```
- Inner class `AndroidInterface`:
  - `@JavascriptInterface fun closeWebview()` → `runOnUiThread { finish() }`
  - Placeholder methods: `enableSwipeBack()`, `disableSwipeBack()`
- Handles back button:
  - If WebView can go back → `webView.goBack()`
  - Otherwise → `finish()` (close activity)
- Gets URL from Intent extra, loads in WebView
- No toolbar, no bottom nav → true full-screen experience

**OtherFragments.kt** (com.octopus.app.fragments)
- Contains 4 placeholder fragments: ManageFragment, TopUpFragment, TravelFragment, MessageFragment
- Each displays a centered gray text: "Tab Name\n(Native Screen)"
- Simple gray background (`#f5f5f5`)

**activity_main.xml** (res/layout)
- ConstraintLayout root
- 3 main components stacked vertically:
  1. Toolbar (id: `toolbar`, height: `?attr/actionBarSize`)
  2. FrameLayout (id: `fragment_container`, weight: 1)
  3. BottomNavigationView (id: `bottom_navigation`, height: 56dp)
- Uses `app:layout_constraintTop_toBottomOf` for proper stacking
- References menu: `app:menu="@menu/bottom_navigation_menu"`

**bottom_navigation_menu.xml** (res/menu)
- Defines 5 menu items:
  - `nav_manage`: "Manage" with gear icon
  - `nav_loyalty`: "Loyalty" with star icon
  - `nav_topup`: "Top Up" with plus icon
  - `nav_travel`: "Travel" with compass icon
  - `nav_message`: "Message" with email icon
- Uses Android system icons (`@android:drawable/...`)

**ic_close.xml** (res/drawable)
- Vector drawable for close icon (X)
- 24dp x 24dp black X icon
- Currently not used (was prepared for toolbar close button)

**AndroidManifest.xml**
- Permissions:
  - `<uses-permission android:name="android.permission.INTERNET" />`
- Application:
  - `android:usesCleartextTraffic="true"` - Allows HTTP traffic (for localhost dev)
- Activities:
  - MainActivity: `android:exported="true"` with MAIN/LAUNCHER intent filter
  - WebViewActivity: `android:exported="false"` (internal only)

**build.gradle.kts** (app level)
- **NO Jetpack Compose** dependencies
- Key dependencies:
  - `androidx.core:core-ktx:1.12.0`
  - `androidx.appcompat:appcompat:1.6.1`
  - `com.google.android.material:material:1.11.0` (for BottomNavigationView)
  - `androidx.constraintlayout:constraintlayout:2.1.4`
  - `androidx.fragment:fragment-ktx:1.6.2`

### Flow

1. User taps Loyalty tab → MainActivity loads LoyaltyFragment
2. User taps "Coffee Frenzy" banner → Creates Intent with URL `http://10.0.2.2:5173/promo/coffee-frenzy`
3. Launches WebViewActivity (separate Activity, no bottom nav visible)
4. WebView loads Ionic app at the campaign URL
5. User navigates within WebView: Campaign → Shops → Shop Detail
6. User taps Close (X) at any level → JS calls `window.AndroidInterface.closeWebview()`
7. Native receives call → `finish()` on WebViewActivity
8. Returns to MainActivity with LoyaltyFragment → bottom nav reappears

**Alternative close via back button:**
- If at campaign root → Back button closes WebViewActivity
- If at shops or shop detail → Back button navigates back in WebView history first

## JavaScript Bridge Summary

| Feature | iOS | Android |
|---------|-----|---------|
| Close WebView | `window.webkit.messageHandlers.closeWebview.postMessage(true)` | `window.AndroidInterface.closeWebview()` |
| Enable Swipe | `window.webkit.messageHandlers.enableSwipeBack.postMessage(true)` | `window.AndroidInterface.enableSwipeBack()` (placeholder) |
| Disable Swipe | `window.webkit.messageHandlers.disableSwipeBack.postMessage(true)` | `window.AndroidInterface.disableSwipeBack()` (placeholder) |
| Handled By | WebViewViewController (WKScriptMessageHandler) | WebViewActivity.AndroidInterface (@JavascriptInterface) |
| Return Action | `navigationController?.popViewController()` | `finish()` on Activity |

## Common Issues & Solutions

### Android Emulator Connection Refused

**Problem**: `ERR_CONNECTION_REFUSED` when loading `http://10.0.2.2:5173`

**Root Cause**: Vite dev server binding to `localhost` (127.0.0.1) only, not accessible from emulator

**Solution**: Update `vite.config.ts` to bind to all network interfaces:
```typescript
export default defineConfig({
  server: {
    host: '0.0.0.0',  // REQUIRED for Android emulator
    port: 5173
  }
})
```

**Steps to fix**:
1. Update vite.config.ts
2. Restart dev server: `npm run dev`
3. Verify server shows "Network: http://<ip>:5173/" in console
4. Relaunch Android app

### Compose Build Errors on Android

**Problem**: "Unresolved reference 'compose'" errors in Color.kt, Theme.kt, Type.kt

**Root Cause**: Old Jetpack Compose theme files still exist after removing Compose dependencies

**Solution**: Delete the entire ui/theme directory:
```bash
rm -rf ~/AndroidStudioProjects/OctopusApp/app/src/main/java/com/octopus/app/ui
```

### White Title on White Background (Ionic Pages)

**Problem**: Title and close button invisible on orange gradient header

**Solution**: (Already fixed in all 3 pages)
```tsx
<IonToolbar style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #FFB800 100%)' }}>
  <IonButtons slot="start">  {/* LEFT side */}
    <IonButton fill="clear" onClick={handleClose}>
      <IonIcon icon={closeOutline} style={{ fontSize: '28px', color: 'black' }} />
    </IonButton>
  </IonButtons>
  <IonTitle style={{ color: 'black', fontWeight: 'bold' }}>Title</IonTitle>
</IonToolbar>
```

## Development Workflow

### Starting the Ionic Dev Server
```bash
cd ~/loyalty-demo
npm install  # First time only
npm run dev  # Starts at http://localhost:5173 (host: 0.0.0.0)
```

### Running iOS App
1. Open `ios-native/OctopusApp/OctopusApp.xcodeproj` in Xcode
2. Ensure dev server is running
3. Select iOS Simulator (iPhone 14/15)
4. Click Run (⌘R)
5. App loads, tap Loyalty tab, tap banner → WebView opens with `http://localhost:5173/promo/...`

### Running Android App
1. Open `~/AndroidStudioProjects/OctopusApp` in Android Studio
2. Ensure dev server is running with `host: '0.0.0.0'`
3. Start Android Emulator (Pixel 5/6, API 30+)
4. Click Run
5. App loads, tap Loyalty tab, tap banner → WebView opens with `http://10.0.2.2:5173/promo/...`

### Testing the Full Flow
1. Launch app → Should see 5-tab bottom nav
2. Tap Loyalty tab → Native screen with points and 3 banners
3. Tap "Coffee Frenzy" banner:
   - WebView opens full-screen (bottom tabs HIDDEN)
   - Shows orange gradient header with BLACK title and BLACK X on LEFT
4. Tap "See Offers" → Lists 4 coffee shops
5. Tap a shop → Shows shop details
6. Tap X button → Returns to native Loyalty screen (bottom tabs VISIBLE)
7. Tab bar should reappear smoothly

## Important Notes

1. **This is NOT a Capacitor project**
   - No Capacitor dependencies in package.json
   - No capacitor.config.ts file
   - Native apps manually host WebView, no Capacitor CLI involved

2. **Multi-repo architecture**
   - `loyalty-demo/` is a standalone web app
   - iOS and Android are completely separate native projects
   - They communicate only via WebView + JS bridge

3. **Tab bar visibility**
   - Tab bar only exists in native MainActivity/MainTabBarController
   - When WebView is active, tab bar is hidden (iOS: `hidesBottomBarWhenPushed`, Android: separate Activity)
   - Closing WebView returns to native → tab bar reappears

4. **URL differences**
   - iOS Simulator: `http://localhost:5173/`
   - Android Emulator: `http://10.0.2.2:5173/`
   - Both point to same Vite dev server on host machine

5. **Production considerations** (not implemented yet)
   - Bundle Ionic app as static HTML/JS/CSS
   - Host locally in native app assets or on CDN
   - Update WebView URLs to load from bundle instead of dev server

6. **No Xcode project or Android project in loyalty-demo repo**
   - iOS project lives in separate `ios-native/` folder
   - Android project lives in `~/AndroidStudioProjects/OctopusApp/`
   - This keeps web app clean and platform-agnostic
