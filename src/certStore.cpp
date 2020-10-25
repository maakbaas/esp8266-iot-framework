#include "certStore.h"
#include "generated/certificates.h"
#include <memory>

namespace BearSSL {

#ifdef ESP32

// TODO: Implement ESP32 version

#elif defined(ESP8266)

void CertStore::installCertStore(br_x509_minimal_context *ctx) {
  br_x509_minimal_set_dynamic(ctx, (void*)this, findHashedTA, freeHashedTA);
}

const br_x509_trust_anchor *CertStore::findHashedTA(void *ctx, void *hashed_dn, size_t len) {
    //compare sha256 from index file with hashed_dn
    //then return certificate

    CertStore *cs = static_cast<CertStore *>(ctx);

    if (!cs || len != 32)
    {
        return nullptr;
    }

    for (int i = 0; i < numberOfCertificates; i++)
    {
        if (!memcmp_P(hashed_dn, indices[i], 32))
        { 
            Serial.println(PSTR("Certificate found!"));

            uint16_t certSize[1];
            memcpy_P(certSize, certSizes+i, 2);

            uint8_t *der = (uint8_t *)malloc(certSize[0]);            
            memcpy_P(der, certificates[i], certSize[0]);
            cs->_x509 = new X509List(der, certSize[0]);
            free(der);
            
            if (!cs->_x509)
            {
                 return nullptr;
            }

            br_x509_trust_anchor *ta = (br_x509_trust_anchor *)cs->_x509->getTrustAnchors();
            memcpy_P(ta->dn.data, indices[i], 32);
            ta->dn.len = 32;

            return ta;
        }
    }

    return nullptr;
}

void CertStore::freeHashedTA(void *ctx, const br_x509_trust_anchor *ta) {
  CertStore *cs = static_cast<CertStore*>(ctx);
  (void) ta; // Unused
  delete cs->_x509;
  cs->_x509 = nullptr;
}

#endif

}
