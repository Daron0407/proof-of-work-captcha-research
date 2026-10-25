
import { argon2id } from "@noble/hashes/argon2.js";
import { utf8ToBytes } from "@noble/hashes/utils.js";

const SALT = utf8ToBytes("captcha-challenge");

function argon2Hash(data) {
    return argon2id(
        utf8ToBytes(data),
        SALT,
        {
            t: 1,       // Liczba iteracji
            m: 1024,    // Pamięć w KiB (1 MiB)
            p: 1,       // Równoległość
            dkLen: 32   // Długość hasha w bajtach
        }
    );
}

function bytesToInteger(bytes) {
    let value = 0n;

    for (const byte of bytes) {
        value = (value << 8n) | BigInt(byte);
    }

    return value;
}

/**
 * Szuka prefixu takiego, że:
 *
 *     Argon2id(prefix + nonce)
 *
 * ma pierwsze `prefix_len` bajtów,
 * zinterpretowane jako liczba całkowita,
 * mniejsze niż `difficulty`.
 *
 * Po znalezieniu:
 *
 *     nonce = prefix + nonce
 *
 * Challenge jest powtarzany `depth` razy.
 */
export async function argon2ImplSolve(
    nonce,
    difficulty,
    prefix_len,
    depth
) {
    if (!Number.isInteger(prefix_len) ||
        prefix_len < 1 ||
        prefix_len > 32) {
        throw new RangeError("prefix_len must be between 1 and 32");
    }

    if (!Number.isInteger(depth) || depth < 0) {
        throw new RangeError("depth must be a non-negative integer");
    }

    const target = BigInt(difficulty);

    for (let level = 0; level < depth; level++) {
        let counter = 0;

        while (true) {
            const prefix = counter.toString();

            const hash = argon2Hash(prefix + nonce);

            const value = bytesToInteger(
                hash.subarray(0, prefix_len)
            );

            if (value < target) {
                nonce = prefix + nonce;
                break;
            }

            counter++;
        }
    }

    return nonce;
}
