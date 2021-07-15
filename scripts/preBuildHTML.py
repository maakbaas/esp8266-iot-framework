from subprocess import call
import os.path


def preBuildHTMLFun():
    webpackInst = os.path.isdir("../node_modules/webpack")

    if webpackInst == False:
        print("Running npm install...")
        call(["npm", "install"])
        print("Running npm audit fix...")
        call(["npm", "audit", "fix"])
        print("Running npx browserslist@latest --update-db...")
        call(["npx", "browserslist@latest", "--update-db"])

    print("Running npm run build...")
    call(["npm", "run", "build"])
