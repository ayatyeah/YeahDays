// Loaded only by the local soak runner, never by the production start command.
const fs = require('node:fs');
setInterval(() => {
  fs.appendFileSync(process.env.YG_MEMORY_LOG, JSON.stringify({ time: Date.now(), ...process.memoryUsage() }) + '\n');
}, 250).unref();
