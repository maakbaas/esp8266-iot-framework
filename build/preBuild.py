import subprocess

subprocess.call("preBuildHTML.py", shell=True)
subprocess.call("preBuildConfig.py", shell=True)
subprocess.call("preBuildCertificates.py", shell=True)
