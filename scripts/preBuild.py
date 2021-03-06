Import('env')
from shutil import copyfile
import subprocess
import inspect, os.path

#auto install asn1crypto if not defined
try:
    from asn1crypto.x509 import Certificate
except ImportError:
    Import('env')
    env.Execute(
        env.VerboseAction(
            '"$PYTHONEXE" -m pip install "asn1crypto" ',
            "ASN1 crypto import failed, installing.",
        )
    )
    
from preBuildHTML import preBuildHTMLFun
from preBuildConfig import preBuildConfigFun
from preBuildDash import preBuildDashFun
from preBuildCertificates import preBuildCertificatesFun

filename = inspect.getframeinfo(inspect.currentframe()).filename
dir_path = os.path.dirname(os.path.abspath(filename))

# default setting = rebuild config and do not rebuild HTML or certificates
html = False
config = False
dash = False
certs = False
openssl = None

# private library flags
domains = ''
for item in env.get("CPPDEFINES", []):
    if item == "REBUILD_HTML":
        html = True
        config = True
        dash = True
    elif item == "REBUILD_CERTS":
        certs = True
    elif item == "REBUILD_CONFIG":
        config = True
    elif item == "REBUILD_DASHBOARD":
        dash = True
    elif isinstance(item, tuple) and item[0] == "CONFIG_PATH":
        copyfile(env.get("PROJECT_DIR") + '/' + item[1], '../gui/js/configuration.json')
    elif isinstance(item, tuple) and item[0] == "DASHBOARD_PATH":
        copyfile(env.get("PROJECT_DIR") + '/' + item[1], '../gui/js/dashboard.json')
    elif isinstance(item, tuple) and item[0] == "DOMAIN_LIST":
        domains = item[1]
    elif isinstance(item, tuple) and item[0].lower() == "openssl":
        openssl = item[1]

if html:
    preBuildHTMLFun()
if config:
    preBuildConfigFun()
if dash:
    preBuildDashFun()
if certs:
    preBuildCertificatesFun(domains, openssl)


