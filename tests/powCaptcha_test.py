import hashlib

def hash_string_to_int(text: str, n: int) -> int:
    """
    Hashes a string using SHA256 and returns the first n characters of the hash as an integer.
    
    Args:
        text: The string to hash
        n: Number of characters to take from the hash
        
    Returns:
        The first n characters of the SHA256 hash as an integer and the full hash string
    """
    hash_object = hashlib.sha256(text.encode())
    hash_hex = hash_object.hexdigest()
    return int(hash_hex[:n], 16), hash_hex



def solve_challenge(prefix: str, treshold: int, prefix_length: int) -> tuple:
    """
    Finds a suffix that, when appended to the prefix and hashed, results in a hash
    that starts with a number less or equal to the treshold.
    
    Args:
        prefix: The prefix string
        treshold: The maximum allowed value for the hash prefix
        prefix_length: The length of the prefix to consider from the hash
        
    Returns:
        A suffix and the corresponding hash value that meets the challenge criteria
    """
    suffix = 0
    while True:
        candidate = f"{prefix}{suffix}"
        hash_value, full_hash = hash_string_to_int(candidate, prefix_length)
        if hash_value <= treshold:
            return suffix, full_hash
        suffix += 1


# Example usage
if __name__ == "__main__":
    prefix = "test_prefix_"
    treshold = 100
    for i in range(1, 7):
        suffix, hash_value = solve_challenge(prefix, treshold, i)
        print(f"Found suffix: {suffix} with hash value: {hash_value}")