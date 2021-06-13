//Since findHashedTA in BearSSL::CertStore is a non-virtual member
//the class is completely overwritten by using the same preprocessor
//include guard

#ifndef _CERTSTORE_H
#define _CERTSTORE_H

#include <Arduino.h>
#include <BearSSLHelpers.h>
#include <bearssl/bearssl.h>
#include <CertStoreBearSSL.h>

namespace BearSSL {

class CertStoreP: public CertStoreBase {
  public:
    CertStoreP() { };   

    // Installs the cert store into the X509 decoder (normally via static function callbacks)
    void installCertStore(br_x509_minimal_context *ctx);

  protected:
    X509List *_x509 = nullptr;

    // These need to be static as they are callbacks from BearSSL C code
    static const br_x509_trust_anchor *findHashedTA(void *ctx, void *hashed_dn, size_t len);
    static void freeHashedTA(void *ctx, const br_x509_trust_anchor *ta);
};

};

#endif

