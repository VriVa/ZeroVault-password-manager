# in-memory DB (users + wallet)


users_db = {}   # username -> {Y, salt, vault_blob, current_challenge}
#stores Schnorr public key Y, salt, encrypted vault, and ephemeral challenge.


