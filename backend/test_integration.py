try:
    import requests
except Exception:
    requests = None

import random
import time
import json
import urllib.request
import urllib.error

BASE = 'http://localhost:5000'
USERNAME = f'integ_user_{int(time.time())%10000}'
PUBLICY = '123'  # demo small value accepted by server

def pretty(r):
    if requests:
        try:
            return r.status_code, r.json()
        except:
            return r.status_code, r.text
    else:
        return getattr(r, 'code', None), r.read().decode() if hasattr(r, 'read') else str(r)

print('Registering user:', USERNAME)
payload = json.dumps({
    'username': USERNAME,
    'publicY': PUBLICY,
    'salt_kdf': 'AA==',
    'kdf_params': {'alg': 'argon2id', 'mem_kib': 65536, 'iter': 2, 'par': 1},
    'vault_blob': None
}).encode()
if requests:
    reg = requests.post(f'{BASE}/auth/register', json=json.loads(payload))
else:
    req = urllib.request.Request(f'{BASE}/auth/register', data=payload, headers={'Content-Type':'application/json'})
    try:
        reg = urllib.request.urlopen(req)
    except urllib.error.HTTPError as e:
        reg = e
print('register ->', pretty(reg))

print('\nRequest challenge')
if requests:
    ch = requests.post(f'{BASE}/auth/challenge', json={'username': USERNAME})
    print('challenge ->', pretty(ch))
    chj = ch.json()
else:
    payload = json.dumps({'username': USERNAME}).encode()
    req = urllib.request.Request(f'{BASE}/auth/challenge', data=payload, headers={'Content-Type':'application/json'})
    try:
        ch = urllib.request.urlopen(req)
        body = ch.read().decode()
        print('challenge ->', (getattr(ch, 'code', None), body))
        chj = json.loads(body)
    except urllib.error.HTTPError as e:
        print('challenge ->', pretty(e))
        raise
challenge_id = chj.get('challenge_id')
c = chj.get('c')
print('challenge id, c =', challenge_id, c)

# Forge a proof that will satisfy the server's demo check:
# server checks (s % p) == (R + c * Y) % p, with p=1000003
p = 1000003
Y = int(PUBLICY)
R = random.randint(1000, 999999)
s = (R + c * Y) % p

print('\nSubmitting verify (forged)')
if requests:
    ver = requests.post(f'{BASE}/auth/verify', json={
        'username': USERNAME,
        'challenge_id': challenge_id,
        'R': str(R),
        's': str(s)
    })
    print('verify ->', pretty(ver))
    verj = ver.json()
else:
    payload = json.dumps({'username': USERNAME, 'challenge_id': challenge_id, 'R': str(R), 's': str(s)}).encode()
    req = urllib.request.Request(f'{BASE}/auth/verify', data=payload, headers={'Content-Type':'application/json'})
    try:
        ver = urllib.request.urlopen(req)
        body = ver.read().decode()
        print('verify ->', (getattr(ver, 'code', None), body))
        verj = json.loads(body)
    except urllib.error.HTTPError as e:
        print('verify ->', pretty(e))
        raise
if verj.get('status') != 'success':
    raise SystemExit('Login failed during integration test')

token = verj.get('session_token')
print('session token:', token)

print('\nGET /vault (should be null or None)')
if requests:
    getv = requests.get(f'{BASE}/vault', headers={'Authorization': f'Bearer {token}'})
    print('get vault ->', pretty(getv))
else:
    req = urllib.request.Request(f'{BASE}/vault', headers={'Authorization': f'Bearer {token}'})
    try:
        getv = urllib.request.urlopen(req)
        body = getv.read().decode()
        print('get vault ->', (getattr(getv, 'code', None), body))
        getv_json = json.loads(body)
    except urllib.error.HTTPError as e:
        print('get vault ->', pretty(e))
        raise

print('\nPOST /vault update with dummy blob')
dummy_blob = {'iv':'AA==','ciphertext':'BB==','tag':'CC==','version':'1.0'}
if requests:
    up = requests.post(f'{BASE}/vault', json={'vault_blob': dummy_blob}, headers={'Authorization': f'Bearer {token}'})
    print('update ->', pretty(up))
else:
    payload = json.dumps({'vault_blob': dummy_blob}).encode()
    req = urllib.request.Request(f'{BASE}/vault', data=payload, headers={'Authorization': f'Bearer {token}', 'Content-Type':'application/json'})
    try:
        up = urllib.request.urlopen(req)
        body = up.read().decode()
        print('update ->', (getattr(up, 'code', None), body))
    except urllib.error.HTTPError as e:
        print('update ->', pretty(e))
        raise

print('\nGET /vault after update')
if requests:
    getv2 = requests.get(f'{BASE}/vault', headers={'Authorization': f'Bearer {token}'})
    print('get vault after ->', pretty(getv2))
else:
    req = urllib.request.Request(f'{BASE}/vault', headers={'Authorization': f'Bearer {token}'})
    try:
        getv2 = urllib.request.urlopen(req)
        body = getv2.read().decode()
        print('get vault after ->', (getattr(getv2, 'code', None), body))
    except urllib.error.HTTPError as e:
        print('get vault after ->', pretty(e))
        raise

print('\nIntegration test completed')
