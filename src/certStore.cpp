/*
  CertStoreBearSSL.cpp - Library for Arduino ESP8266
  Copyright (c) 2018 Earle F. Philhower, III

  This library is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation; either
  version 2.1 of the License, or (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public
  License along with this library; if not, write to the Free Software
  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

#include "certStore.h"
#include "certificates.h"
#include <memory>

namespace BearSSL {

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
            Serial.println(FPSTR("Certificate found!"));

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

}
