Import('env')
from shutil import copyfile
import subprocess
import inspect, os.path
from os.path import join, realpath

filename = inspect.getframeinfo(inspect.currentframe()).filename
dir_path = os.path.dirname(os.path.abspath(filename))

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
    elif isinstance(item, tuple) and item[0] == "CONFIG_PATH":
        copyfile(env.get("PROJECT_DIR") + '\\' + item[1], '../html/js/configuration.json')


if html:
    subprocess.call(dir_path + "\\preBuildHTML.py", shell=True)
if config:
    subprocess.call(dir_path + "\\preBuildConfig.py", shell=True)
if certs:
    subprocess.call(dir_path + "\\preBuildCertificates.py", shell=True)


