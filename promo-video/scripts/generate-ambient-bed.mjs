import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const sampleRate = 48000;
const duration = 30;
const totalSamples = sampleRate * duration;
const outputPath = resolve("assets/symposium-ambient-bed.wav");

const left = new Float32Array(totalSamples);
const right = new Float32Array(totalSamples);

const chords = [
  { start: 0, length: 7.5, freqs: [146.83, 220, 293.66, 369.99] },
  { start: 7.5, length: 7.5, freqs: [123.47, 185, 246.94, 293.66] },
  { start: 15, length: 7.5, freqs: [98, 146.83, 196, 246.94] },
  { start: 22.5, length: 7.5, freqs: [110, 164.81, 220, 277.18] }
];

const bellNotes = [739.99, 659.25, 554.37, 659.25, 739.99, 880, 659.25, 554.37];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function segmentEnvelope(localTime, length) {
  return clamp(Math.min(localTime / 1.2, (length - localTime) / 1.2), 0, 1);
}

function overallEnvelope(t) {
  return clamp(Math.min(t / 1.8, (duration - t) / 2.4), 0, 1);
}

function bellEnvelope(age) {
  if (age < 0 || age > 1.35) return 0;
  return clamp(age / 0.03, 0, 1) * Math.exp(-3.15 * age);
}

function addEcho(bufferA, bufferB, delaySeconds, amount) {
  const delay = Math.round(delaySeconds * sampleRate);
  for (let i = delay; i < bufferA.length; i += 1) {
    const echoed = bufferB[i - delay] * amount;
    bufferA[i] += echoed;
  }
}

for (let i = 0; i < totalSamples; i += 1) {
  const t = i / sampleRate;
  const chord = chords[Math.min(chords.length - 1, Math.floor(t / 7.5))];
  const local = t - chord.start;
  const padEnv = segmentEnvelope(local, chord.length) * overallEnvelope(t);

  let padL = 0;
  let padR = 0;
  chord.freqs.forEach((freq, index) => {
    const amp = [0.046, 0.032, 0.026, 0.018][index];
    const phase = 2 * Math.PI * freq * t;
    const slowMotion = 1 + 0.055 * Math.sin(2 * Math.PI * (0.045 + index * 0.01) * t);
    padL += Math.sin(phase + index * 0.27) * amp * slowMotion;
    padR += Math.sin(phase + index * 0.27 + 0.18) * amp * (2 - slowMotion);
  });

  const bellStart = 0.9;
  const bellStep = 2;
  const bellIndex = Math.floor((t - bellStart) / bellStep);
  const bellAge = t - bellStart - bellIndex * bellStep;
  let bellL = 0;
  let bellR = 0;
  if (bellIndex >= 0) {
    const note = bellNotes[bellIndex % bellNotes.length];
    const env = bellEnvelope(bellAge) * overallEnvelope(t) * 0.62;
    const partial = Math.sin(2 * Math.PI * note * t) + 0.46 * Math.sin(2 * Math.PI * note * 2 * t);
    const shimmer = 0.22 * Math.sin(2 * Math.PI * note * 3 * t);
    bellL = (partial + shimmer) * env * 0.08;
    bellR = (partial - shimmer * 0.4) * env * 0.075;
  }

  left[i] = padL * padEnv + bellL;
  right[i] = padR * padEnv + bellR;
}

addEcho(left, right, 0.32, 0.18);
addEcho(right, left, 0.48, 0.16);
addEcho(left, right, 0.86, 0.09);
addEcho(right, left, 1.08, 0.08);

let peak = 0;
for (let i = 0; i < totalSamples; i += 1) {
  peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
}

const scale = peak > 0 ? 0.55 / peak : 1;
const dataBytes = totalSamples * 2 * 2;
const wav = Buffer.alloc(44 + dataBytes);

wav.write("RIFF", 0);
wav.writeUInt32LE(36 + dataBytes, 4);
wav.write("WAVE", 8);
wav.write("fmt ", 12);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(2, 22);
wav.writeUInt32LE(sampleRate, 24);
wav.writeUInt32LE(sampleRate * 2 * 2, 28);
wav.writeUInt16LE(4, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(dataBytes, 40);

let offset = 44;
for (let i = 0; i < totalSamples; i += 1) {
  const l = Math.round(clamp(left[i] * scale, -0.98, 0.98) * 32767);
  const r = Math.round(clamp(right[i] * scale, -0.98, 0.98) * 32767);
  wav.writeInt16LE(l, offset);
  wav.writeInt16LE(r, offset + 2);
  offset += 4;
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, wav);
console.log(`Wrote ${outputPath}`);
