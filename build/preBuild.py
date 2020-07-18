Import('env')
from os.path import join, realpath
import subprocess

# default setting = rebuild config and do not rebuild HTML or certificates
html = False
config = True
certs = False

# private library flags
for item in env.get("CPPDEFINES", []):
    if item == "REBUILD_HTML":
        html = True
    elif item == "REBUILD_CONFIG":
        config = True
    elif item == "REBUILD_CERTS":
        certs = True

if html:
    subprocess.call("preBuildHTML.py", shell=True)
if config:
    subprocess.call("preBuildConfig.py", shell=True)
if certs:
    subprocess.call("preBuildCertificates.py", shell=True)


