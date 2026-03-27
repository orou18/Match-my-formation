import fs from "fs";
import path from "path";

const BASE_DIR =
  path.basename(process.cwd()) === "frontend"
    ? process.cwd()
    : path.join(process.cwd(), "frontend");

const DATA_DIR = path.join(BASE_DIR, ".data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readJsonStore<T>(filename: string, fallback: T): T {
  ensureDir();
  const filePath = path.join(DATA_DIR, filename);

  if (!fs.existsSync(filePath)) {
    writeJsonStore(filename, fallback);
    return fallback;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    writeJsonStore(filename, fallback);
    return fallback;
  }
}

export function writeJsonStore<T>(filename: string, data: T): T {
  ensureDir();
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return data;
}
