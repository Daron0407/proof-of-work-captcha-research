
import { argon2id } from "hash-wasm";

async function argon2Hash(data) {
    return await argon2id({
        password: data,
        salt: "captcha-challenge",
        parallelism: 1,
        iterations: 1,
        memorySize: 1024, // 1 MiB
        hashLength: 32,   // 32 bajty
        outputType: "binary"
    });
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
export async function argon2LibSolve(
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

            const hash = await argon2Hash(prefix + nonce);

            const value = bytesToInteger(
                hash.slice(0, prefix_len)
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
