import secrets

def generate_challenge():
    """
    Generate a random challenge integer for Schnorr login
    """
    return secrets.randbelow(1_000_000)

def verify_schnorr(Y, R, s, c, g, p):
    """
    Verify Schnorr proof: g^s == R * Y^c mod p
    Inputs: 
        Y - user's Schnorr public key
        R, s - Schnorr proof values sent by client
        c - challenge sent to client
        g, p - Schnorr group parameters
    Returns True/False
    """
    left = pow(g, s, p)
    right = (R * pow(Y, c, p)) % p
    return left == right

# generate_challenge() → used to issue ephemeral challenge during login

# verify_schnorr() → server-side verification of Schnorr proof