# 18. Progressive Web Apps (PWA)

## 18.1 PWA Fundamentals

* [x] Understand what a PWA is
* [x] Understand how PWAs differ from native apps
* [x] Understand advantages and limitations of PWAs
* [x] Learn how browsers install PWAs
* [x] Learn when PWAs can work offline

---

## 18.2 Web App Manifest

* [x] Learn what `manifest.json` is
* [x] Add application name
* [x] Add short name
* [x] Add application description
* [x] Add theme color
* [x] Add background color
* [x] Add application icons
* [x] Configure standalone display mode

Practice:

* [x] Make app installable on desktop *(after service worker is set up)*
* [x] Make app installable on Android *(after service worker is set up)*

---

## 18.3 Service Worker Basics

* [x] Understand what a Service Worker is
* [x] Understand service worker lifecycle
* [x] Learn registration process
* [x] Learn install event
* [x] Learn activate event
* [x] Learn fetch event

Practice:

* [x] Register service worker successfully
* [x] Verify service worker installation

---

## 18.4 Asset Caching

* [x] Learn why caching is needed
* [x] Cache HTML files
* [x] Cache CSS files
* [x] Cache JavaScript bundles
* [x] Cache images
* [x] Learn cache versioning

Practice:

* [x] Load app after internet disconnect
* [x] Verify static assets still work

---

## 18.5 Offline Fallback

* [x] Learn offline fallback strategy
* [x] Create offline page
* [x] Detect internet loss
* [x] Show offline message

Practice:

* [x] Disconnect internet
* [x] Open app
* [x] Verify offline page appears

---

## 18.6 Cache Strategies

Learn:

* [ ] Cache First
* [ ] Network First
* [ ] Stale While Revalidate

Understand:

* [ ] When each strategy should be used
* [ ] Pros and cons of each strategy

Practice:

* [ ] Use Cache First for images
* [ ] Use Network First for API calls

---

## 18.7 App Installation Experience

* [ ] Detect install prompt
* [ ] Show install button
* [ ] Handle installation flow
* [ ] Test uninstall/reinstall

Practice:

* [ ] Install app on Android
* [ ] Install app on Desktop

---

## 18.8 PWA Auditing

* [ ] Learn Lighthouse basics
* [ ] Run Lighthouse audit
* [ ] Fix installability issues
* [ ] Fix performance warnings
* [ ] Fix accessibility warnings

---

## 18.9 Push Notifications (Optional)

* [ ] Learn Web Push basics
* [ ] Learn notification permissions
* [ ] Send local notification
* [ ] Learn push notification architecture

---

## 18.10 Offline Writes & Background Sync (Optional)

* [ ] Learn IndexedDB basics (local browser database)
* [ ] Store offline journal entries in IndexedDB
* [ ] Learn Service Worker Background Sync API
* [ ] Synchronize pending offline entries to Node.js backend when online


---

## 18.11 Storage Management (Optional)

Understanding:

* [ ] Learn storage estimate API (`navigator.storage.estimate()`)
* [ ] Understand browser quotas
* [ ] Understand Cache limits
* [ ] Understand IndexedDB limits
---

## 18.12 Native App Branding & Feel (Optional)

* [ ] Configure maskable icons in manifest (prevents browser emblem framing on Android)
* [ ] Understand WebAPK generation on Android (removes browser badge from installed app icon)
* [ ] Set theme and background colors to match OS system UI bars
* [ ] Hide browser branding in push notifications using Service Worker `badge` and `icon` properties
* [ ] Package PWA as a native app using Trusted Web Activities (TWA) and Bubblewrap CLI
* [ ] Configure Digital Asset Links (`.well-known/assetlinks.json`) to verify domain ownership and remove browser URL bar

---

## 18.13 PWA Update Strategies (Critical for Production)

* [ ] Understand the Service Worker `waiting` lifecycle state
* [ ] Detect when a new Service Worker is available in the background
* [ ] Implement a "New update available" toast/alert UI prompting user to reload
* [ ] Trigger `skipWaiting()` and update client immediately on user confirmation

---

## Final Goal

Convert your Journal App into:

* [ ] Installable application
* [ ] Home screen icon
* [ ] Standalone app experience
* [ ] Offline loading of frontend assets
* [ ] Offline fallback page
* [ ] Offline creation/editing of journal entries (via IndexedDB & Sync)
* [ ] Lighthouse PWA score above 90
