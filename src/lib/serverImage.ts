import sharp from "sharp";

// Uploaded photos are normally used once. Avoid retaining libvips operations
// and spawning a thread per host CPU inside a small application container.
sharp.cache(false);
sharp.concurrency(1);
export default sharp;
