const jose = require("jose");

async function encrypt(publicKey) {
    const payload = {
        "data": "xyz"
    }
    const encoder = new TextEncoder("utf-8")
    const jwe = await new jose.CompactEncrypt(encoder.encode(JSON.stringify(payload)))
        .setProtectedHeader({
            alg: 'RSA-OAEP-256',
            enc: 'A256GCM'
        })
        .encrypt(publicKey)

    return jwe
}

async function decrypt(jwe, privateKey) {
    console.log("Should be PrivateKeyObject")
    const decoder = new TextDecoder()
    const {
        plaintext,
        protectedHeader
    } = await jose.compactDecrypt(jwe, privateKey)
    const content = decoder.decode(plaintext)

    return content
}

async function main() {
    const {
        privateKey,
        publicKey
    } = await jose.generateKeyPair('RSA-OAEP-256')

    const jwe = await encrypt(publicKey)
    const content = await decrypt(jwe, privateKey)

    console.log("jwe = " + jwe)
    console.log("content = " + content)
}

main();
