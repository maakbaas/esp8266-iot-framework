from subprocess import call
import os.path


def preBuildHTMLFun():
    webpackInst = os.path.isdir("../node_modules")

    if webpackInst == False:
        print("Running npm ci...")
        call(["npm", "ci"])
        print("Running npx browserslist@latest --update-db...")
        call(["npx", "browserslist@latest", "--update-db"])

    print("Running npm run build...")
    call(["npm", "run", "build"])
