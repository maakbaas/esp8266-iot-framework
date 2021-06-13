#include "certStore.h"
#include "generated/certificates.h"
#include <memory>

namespace BearSSL {

void CertStoreP::installCertStore(br_x509_minimal_context *ctx) {
  br_x509_minimal_set_dynamic(ctx, (void*)this, findHashedTA, freeHashedTA);
}

const br_x509_trust_anchor *CertStoreP::findHashedTA(void *ctx, void *hashed_dn, size_t len) {
    //compare sha256 from index file with hashed_dn
    //then return certificate

    CertStoreP *cs = static_cast<CertStoreP *>(ctx);

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

void CertStoreP::freeHashedTA(void *ctx, const br_x509_trust_anchor *ta) {
  CertStoreP *cs = static_cast<CertStoreP*>(ctx);
  (void) ta; // Unused
  delete cs->_x509;
  cs->_x509 = nullptr;
}

}
