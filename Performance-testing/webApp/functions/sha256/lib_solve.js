async function sha256(data) {
    const encoded = new TextEncoder().encode(data);

    const hash = await crypto.subtle.digest("SHA-256", encoded);

    return new Uint8Array(hash);
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
 *     SHA256(prefix + nonce)
 *
 * ma pierwsze `prefix_len` bajtów, zinterpretowane jako
 * liczba całkowita, mniejsze niż `difficulty`.
 *
 * Po znalezieniu:
 *
 *     nonce = prefix + nonce
 *
 * i challenge jest powtarzany `depth` razy.
 */
export async function sha256LibSolve(
    nonce,
    difficulty,
    prefix_len,
    depth
) {
    for (let level = 0; level < depth; level++) {

        let counter = 0;

        while (true) {
            // Niepusty prefix
            const prefix = counter.toString();

            const hash = await sha256(prefix + nonce);

            // Pierwsze prefix_len bajtów hasha
            const value = bytesToInteger(
                hash.slice(0, prefix_len)
            );

            if (value < BigInt(difficulty)) {
                nonce = prefix + nonce;
                break;
            }

            counter++;
        }
    }

    return nonce;
}