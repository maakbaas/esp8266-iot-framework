from __future__ import print_function
import csv
import os
import re
import string
import sys
from asn1crypto.x509 import Certificate
import hashlib

from subprocess import Popen, PIPE, call, check_output
try:
    from urllib.request import urlopen
except:
    from urllib2 import urlopen
try:
    from StringIO import StringIO
except:
    from io import StringIO

import inspect, os.path

import socket
from ssl import wrap_socket, CERT_NONE, PROTOCOL_SSLv23
from ssl import SSLContext  # Modern SSL?
from ssl import HAS_SNI  # Has SNI?

def preBuildCertificatesFun(domains, openssl):

    print('Start building certificate store', flush=True)

    allDomains = True

    if len(domains) > 0:
        print('Only for domains: ' + domains, flush=True) 
        domains = domains.split(',')
        allDomains = False

    if allDomains:
        domains = []
        print('For all domains', flush=True)

    filename = inspect.getframeinfo(inspect.currentframe()).filename
    dir_path = os.path.dirname(os.path.abspath(filename))

    #path to openssl
    if openssl is None:
        openssl = "C:/Program Files/Git/usr/bin/openssl.exe"

    # below script content is adapted from:
    # https://github.com/esp8266/Arduino/blob/master/libraries/ESP8266WiFi/examples/BearSSL_CertStore/certs-from-mozilla.py

    f = open(dir_path + "/../src/generated/certificates.h", "w", encoding="utf8")

    f.write("#ifndef CERT_H" + "\n")
    f.write("#define CERT_H" + "\n\n")
    f.write("#include <Arduino.h>" + "\n\n")

    # Mozilla's URL for the CSV file with included PEM certs
    mozurl = "https://ccadb-public.secure.force.com/mozilla/IncludedCACertificateReportPEMCSV"

    # Load the manes[] and pems[] array from the URL
    names = []
    pems = []
    dates = []
    response = urlopen(mozurl)
    csvData = response.read()
    if sys.version_info[0] > 2:
        csvData = csvData.decode('utf-8')
    csvFile = StringIO(csvData)
    csvReader = csv.reader(csvFile)
    for row in csvReader:
        names.append(row[0]+":"+row[1]+":"+row[2])
        pems.append(row[32])
        dates.append(row[8])
    del names[0] # Remove headers
    del pems[0] # Remove headers
    del dates[0] # Remove headers

    certFiles = []
    totalbytes = 0
    idx = 0
    addflag = False

    # Process the text PEM using openssl into DER files
    sizes=[]
    for i in range(0, len(pems)):
        certName = "ca_%03d" % (idx);
        thisPem = pems[i].replace("'", "")    
            
        pemfile = open(certName + '.pem', "w", encoding="utf8")
        pemfile.write(thisPem)
        pemfile.close()

        if allDomains:
            print('Added: ' + re.sub(f'[^{re.escape(string.printable)}]', '', names[i]), flush=True)         
        else:
            for j in range(0, len(domains)):      
            
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.connect((domains[j], 443))

                context = SSLContext(2)
                context.verify_mode = 2
                context.load_verify_locations(certName + '.pem')
                try:
                    if HAS_SNI:  # Platform-specific: OpenSSL with enabled SNI
                        context.wrap_socket(s, server_hostname=domains[j])
                    else:
                        context.wrap_socket(s)
                    print('Added: ' + re.sub(f'[^{re.escape(string.printable)}]', '', names[i]), flush=True)            
                    addFlag = True
                    break
                except:
                    print('Skipped: ' + re.sub(f'[^{re.escape(string.printable)}]', '', names[i]), flush=True)
                    addFlag = False
                
                s.close()    

        if allDomains or addFlag:

            f.write(("//" + dates[i] + " " + re.sub(f'[^{re.escape(string.printable)}]', '', names[i]) + "\n"))

            ssl = Popen([openssl,'x509','-inform','PEM','-outform','DER','-out', certName + '.der'], shell = False, stdin = PIPE)
            pipe = ssl.stdin
            pipe.write(thisPem.encode('utf-8'))
            pipe.close()
            ssl.wait()
            
            if os.path.exists(certName + '.der'):
                certFiles.append(certName)            
                
                der = open(certName + '.der','rb')

                bytestr = der.read();
                sizes.append(len(bytestr))
                cert = Certificate.load(bytestr) 
                idxHash = hashlib.sha256(cert.issuer.dump()).digest()

                f.write("const uint8_t cert_" + str(idx) + "[] PROGMEM = {")
                for j in range(0, len(bytestr)):
                    totalbytes+=1
                    f.write(hex(bytestr[j]))
                    if j<len(bytestr)-1:
                        f.write(", ")
                f.write("};\n")

                f.write("const uint8_t idx_" + str(idx) + "[] PROGMEM = {")
                for j in range(0, len(idxHash)):
                    totalbytes+=1
                    f.write(hex(idxHash[j]))
                    if j<len(idxHash)-1:
                        f.write(", ")
                f.write("};\n\n")

                der.close()
                idx = idx + 1

                os.unlink(certName + '.der')        
        
        os.unlink(certName + '.pem')

    f.write("//global variables for certificates using " + str(totalbytes) + " bytes\n")
    f.write("const uint16_t numberOfCertificates PROGMEM = " + str(idx) + ";\n\n")

    f.write("const uint16_t certSizes[] PROGMEM = {")
    for i in range(0, idx):
        f.write(str(sizes[i]))
        if i<idx-1:
            f.write(", ")
    f.write("};\n\n")

    f.write("const uint8_t* const certificates[] PROGMEM = {")
    for i in range(0, idx):
        f.write("cert_" + str(i))
        if i<idx-1:
            f.write(", ")
    f.write("};\n\n")

    f.write("const uint8_t* const indices[] PROGMEM = {")
    for i in range(0, idx):
        f.write("idx_" + str(i))
        if i<idx-1:
            f.write(", ")
    f.write("};\n\n#endif" + "\n")

    f.close()
