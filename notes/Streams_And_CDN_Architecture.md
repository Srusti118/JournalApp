# Streams and CDN Architecture Notes

A concise, point-to-point reference explaining data streams, the client-side cloning mechanism, and how large-scale content delivery networks (CDNs) distribute streaming media.

---

## 1. Data Streams Fundamentals

### What is a Stream?
A **stream** is data delivered in continuous, sequential chunks rather than as a single monolithic block in memory.

* **Without Streams**: The entire 4 GB file must load into RAM before processing begins (risk of memory crashes).
* **With Streams**: Data is processed chunk-by-chunk as soon as the first byte arrives (minimal, constant RAM usage).

### The Single-Consumption Rule (`ReadableStream`)
In the Fetch API standard, an HTTP response body (`response.body`) is a `ReadableStream`.
* **The Rule**: A stream can be read **only once**.
* Once read, the browser flags it as `bodyUsed = true`.
* Any second attempt to read it throws:
  ```text
  TypeError: Failed to execute 'put' on 'Cache': body stream already read
  ```

### Why `.clone()` is Required in Service Workers
In a Service Worker, two separate consumers require the same downloaded bytes:
1. **Cache Storage**: Needs to write the file to the local disk/cache (`cache.put(...)`).
2. **Browser Window**: Needs to render the asset on screen (`return networkResponse`).

```javascript
// 1. Create an identical independent twin copy
const responseToCache = networkResponse.clone()

// 2. Consume Copy A into Cache Storage
caches.open(CACHE_NAME).then((cache) => {
  cache.put(event.request, responseToCache)
})

// 3. Consume Copy B into the Browser Viewport
return networkResponse
```

> **Key Takeaway**: `.clone()` runs **100% on the client device** inside the browser. It places zero additional load on the backend server.

---

## 2. Where Streams Are Used

### Frontend (Browser)
* **AI Chat Streaming (ChatGPT / Claude / Gemini)**: Server-Sent Events (SSE) stream tokens chunk-by-chunk using `response.body.getReader()`.
* **Media Playback (Audio/Video)**: Streaming audio/video segments rather than downloading entire media files up front.
* **Large File Uploads/Downloads**: Streaming multi-gigabyte files without freezing the browser's UI thread.
* **WebRTC Live Feeds**: Streaming raw camera and microphone frames in real time.

### Backend (Node.js & Databases)
* **HTTP Lifecycle**: In Node.js, `req` is a `ReadableStream` and `res` is a `WritableStream`.
* **File System (`fs`)**: `fs.createReadStream()` reads 10 GB files in tiny 64 KB memory chunks without exhausting server RAM.
* **Compression**: `zlib.createGzip()` transforms data chunks on the fly during network transfer.
* **Database Cursors**: Querying millions of records via MongoDB or PostgreSQL cursors row-by-row.

---

## 3. Large-Scale Video Streaming (YouTube / Netflix Model)

Large video platforms do **not** stream 2-hour movies as single continuous files.

### A. Video Segmentation (HLS & DASH)
Videos are pre-sliced on the server into thousands of small, standalone chunks:
* Format: **HLS** (`.m3u8` playlists) or **DASH** (`.mpd` manifests).
* Chunk Size: Typically **2 to 4 seconds** per segment (e.g., `chunk_001.mp4`, `chunk_002.mp4`).
* As you watch, the player issues independent standard HTTP requests:
  ```http
  GET /video/1080p/chunk_001.mp4
  GET /video/1080p/chunk_002.mp4
  ```

### B. HTTP Range Requests
For direct video files, the browser requests specific byte boundaries:
```http
Range: bytes=0-1048576       (Bytes 0 to 1 MB)
Range: bytes=45000000-46000000 (Bytes 45 MB to 46 MB when skipping ahead)
```
Only the requested range is transmitted, preventing wasted bandwidth.

---

## 4. How CDNs Prevent Storage and Server Overload

### A. The 80/20 Popularity Rule (Zipf's Law)
* **Top 20% Popular Videos**: Cached in high-speed NVMe/RAM on local ISP Edge CDNs close to users.
* **Long-Tail / Obscure Videos**: Not kept in edge cache. Fetched once on-demand from cold storage data centers, streamed to the user, and evicted quickly.

### B. LRU (Least Recently Used) Eviction
CDN edge servers have finite disk space. When storage nears capacity:
* An LRU algorithm identifies chunks that have not been requested recently.
* Those inactive chunks are automatically purged to make room for active, trending media.

### C. Pure Static I/O Efficiency
* **Application Servers** (Node.js, Express): CPU-heavy (parsing JSON, hashing passwords, verifying JWTs, running database queries).
* **CDN Edge Servers**: CPU-light. They run specialized reverse proxies (Nginx/Envoy) optimized purely for fast NVMe reads directly to 100 Gbps network cards.

### D. Time To Live (TTL) Expiration
Every chunk includes cache headers:
```http
Cache-Control: public, max-age=86400
```
This instructs CDN nodes to discard stale content automatically once the TTL expires.
