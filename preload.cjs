// preload.cjs — intercepts stdout before ES module imports run
const originalWrite = process.stdout.write.bind(process.stdout);

process.stdout.write = function(chunk, encoding, callback) {
  const str = typeof chunk === 'string' ? chunk : chunk.toString();
  const trimmed = str.trim();

  // Only allow valid JSON-RPC messages through stdout
  if (trimmed === '' || trimmed === '\n' || trimmed.startsWith('{')) {
    return originalWrite(chunk, encoding, callback);
  }

  // Redirect everything else (◇ injected, etc.) to stderr
  process.stderr.write(chunk);
  if (typeof encoding === 'function') encoding();
  else if (typeof callback === 'function') callback();
  return true;
};