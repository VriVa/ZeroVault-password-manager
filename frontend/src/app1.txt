import React from "react"
import { Button } from "@/components/ui/button"
import Wallet from "@/components/Wallet"
import {
  computePublicY,
  createSchnorrProof,
  finalizeSchnorrSignature,
  bigIntToHex,
} from "@/lib/crypto"
import { deriveAesKeyFromPassword, encryptData, decryptData } from "@/lib/aes"

export default function App() {
  const [status, setStatus] = React.useState("")
  const [storedPubY, setStoredPubY] = React.useState(() => localStorage.getItem("zkp_pubY"))
  const [vaultEnc, setVaultEnc] = React.useState(() => localStorage.getItem("vault_enc"))

  async function handleRegister() {
    const pw = document.getElementById("pw")?.value || ""
    if (!pw) return setStatus("Enter a password to register")
    const salt = crypto.getRandomValues(new Uint8Array(12))
    const { x, Y } = await computePublicY(pw, salt)
    // store salt & public Y locally (send Y to server in real flow)
    localStorage.setItem("zkp_salt", Array.from(salt).join(","))
    localStorage.setItem("zkp_pubY", bigIntToHex(Y))
    setStoredPubY(bigIntToHex(Y))
    setStatus("Registered (pubY derived and stored locally).")
  }

  async function handleLoginDemo() {
    const pw = document.getElementById("pw")?.value || ""
    if (!pw) return setStatus("Enter password to login")
    const saltRaw = localStorage.getItem("zkp_salt")
    if (!saltRaw) return setStatus("No registration salt found; register first")
    const salt = new Uint8Array(saltRaw.split(",").map((n) => Number(n)))
    const { x } = await computePublicY(pw, salt)
    // create Schnorr proof
    const { r, R } = createSchnorrProof()
    // In a real flow you'd send R to server and receive challenge c
    const demoC = 42n // placeholder challenge for demo
    const s = finalizeSchnorrSignature(r, x, demoC)
    setStatus(`Proof generated (demo). R=${bigIntToHex(R)} s=${bigIntToHex(s)}`)
  }

  async function encryptVault() {
    const pw = document.getElementById("pw")?.value || ""
    if (!pw) return setStatus("Enter password to encrypt vault")
    const aes = await deriveAesKeyFromPassword(pw, "vault-salt")
    const sample = JSON.stringify({ notes: ["top secret"], ts: Date.now() })
    const enc = await encryptData(aes, sample)
    localStorage.setItem("vault_enc", JSON.stringify(enc))
    setVaultEnc(JSON.stringify(enc))
    setStatus("Vault encrypted and stored locally.")
  }

  async function decryptVault() {
    const pw = document.getElementById("pw")?.value || ""
    if (!pw) return setStatus("Enter password to decrypt vault")
    const raw = localStorage.getItem("vault_enc")
    if (!raw) return setStatus("No vault found")
    const enc = JSON.parse(raw)
    try {
      const aes = await deriveAesKeyFromPassword(pw, "vault-salt")
      const dec = await decryptData(aes, enc.data, enc.iv)
      setStatus("Vault decrypted: " + dec)
    } catch (e) {
      setStatus("Failed to decrypt vault (wrong password?)")
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 gap-4">
      <div className="w-full max-w-2xl border rounded p-4">
        <h2 className="text-xl font-semibold mb-2">ZKP + Local Vault (Frontend)</h2>

        <div className="flex gap-2 items-center mb-3">
          <input id="pw" placeholder="password" type="password" className="border p-2 rounded flex-1" />
          <Button onClick={handleRegister}>Register</Button>
          <Button onClick={handleLoginDemo}>Login (demo Schnorr)</Button>
        </div>

        <div className="flex gap-2 items-center mb-3">
          <Button onClick={encryptVault}>Encrypt Vault</Button>
          <Button onClick={decryptVault}>Decrypt Vault</Button>
        </div>

        <div className="text-sm">Status: {status}</div>
        <div className="text-xs mt-2">Stored pubY: <pre className="break-words">{storedPubY}</pre></div>
        <div className="text-xs mt-2">Vault (enc): <pre className="break-words">{vaultEnc}</pre></div>
      </div>

      <Wallet />
    </div>
  )
}