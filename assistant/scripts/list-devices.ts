import { PvRecorder } from "@picovoice/pvrecorder-node";

const devices = PvRecorder.getAvailableDevices();
devices.forEach((name, index) => console.log(`${index}: ${name}`));
console.log("\nУкажи нужный индекс в AUDIO_DEVICE_INDEX (assistant/.env).");
