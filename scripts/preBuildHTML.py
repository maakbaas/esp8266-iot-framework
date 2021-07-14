import os

def preBuildHTMLFun():
    os.system("npm install")
    os.system("npm audit fix")
    os.system("npx browserslist@latest --update-db")
    os.system("npm run build")
    