export { generateUUID }

interface CryptoNew extends Crypto {
    randomUUID?(): string
}

/**
 * Returns an empty string if Crypto API or randomUUID is not supported by browser.
 */
function generateUUID(): string {
    let cryptoRef: CryptoNew;
    let r: string | undefined = "";

    if (typeof self.crypto !== "undefined") {
        cryptoRef = self.crypto;
        r = cryptoRef.randomUUID?.();
    }

    return r ? r : "";
}
