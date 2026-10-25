
import { sha256LibSolve } from "./functions/sha256/lib_solve.js";
import { sha256ImplSolve } from "./functions/sha256/impl_solve.js";
import init, { sha256RustLib } from "./pkg/rust_wasm_benchmark.js";
import { argon2LibSolve } from "./functions/argon2/lib_solve.js";
import { argon2ImplSolve } from "./functions/argon2/impl_solve.js";

const wasmReady = init();

export const benchmarks = [
  {
    id: "challenge-library-js-sha256",
    name: "Challenge — SHA-256 biblioteczne",
    description: "Rozwiązywanie wyzwania implementacją SHA-256 z bilbioteki Crypto.",
    run: ({ nonce, difficulty, prefixLen, depth }) =>
      sha256LibSolve(nonce, difficulty, prefixLen, depth),
  },
  {
    id: "challenge-implementation-js-sha256",
    name: "Challenge — SHA-256 implementacja lokalna",
    description: "Rozwiązywanie wyzwania lokalną implementacją SHA-256.",
    run: ({ nonce, difficulty, prefixLen, depth }) =>
      sha256ImplSolve(nonce, difficulty, prefixLen, depth),
  },
  {
    id: "challenge-library-wasm-sha256",
    name: "Challenge — WebAssembly",
    description: "Rozwiązywanie wyzwania za pomocą WebAssembly przy użyciu biblioteki sha2.",
    run: async ({ nonce, difficulty, prefixLen, depth }) => {
      await wasmReady;

      return sha256RustLib(
        nonce,
        BigInt(difficulty),
        prefixLen,
        depth
      );
    },
  },
  {
    id: "challenge-library-wasm-argon2id",
    name: "Challenge — Argon2id biblioteczne",
    description: "Rozwiązywanie wyzwania implementacją Argon2id z bilbioteki hash-wasm.",
    run: ({ nonce, difficulty, prefixLen, depth }) =>
      argon2LibSolve(nonce, difficulty, prefixLen, depth),
  },
  {
    id: "challenge-implementation-js-argon2id",
    name: "Challenge — Argon2id biblioteczne",
    description: "Rozwiązywanie wyzwania implementacją Argon2id z bilbioteki hash-wasm.",
    run: ({ nonce, difficulty, prefixLen, depth }) =>
      argon2ImplSolve(nonce, difficulty, prefixLen, depth),
  },
];
