import { sha256 } from "./utils/sha256.js"

export async function implementationSolveChallenge(
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

            const hash = sha256.hex(prefix + nonce);

            const hexSubstring = hash.slice(0, prefix_len * 2);
            const value = BigInt("0x" + hexSubstring);

            if (value < BigInt(difficulty)) {
                nonce = prefix + nonce;
                break;
            }

            counter++;
        }
    }

    return nonce;
}