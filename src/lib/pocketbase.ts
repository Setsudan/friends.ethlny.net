// src/lib/pocketbase.ts
import PocketBase from 'pocketbase';

// Create a new instance
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

// Enable auto cancellation of pending requests
pb.autoCancellation(false);

export { pb };