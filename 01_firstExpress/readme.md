# Express app

## Create a folder the application

## Create package.json for the app

```shell
npm init -y
```
or 
```shell
npm init
```
and answer questions.

The package.json can be edited later with editor.

## Install Express libraries 

```shell
npm install express
```
also following works:
```shell
npm i express
```
Installed libraries will be shown in package.json as dependencies.

Command 
```shell
npm install
```
installs all dependencies that are listed in package.json (node_modules, can be deleted from the folder and do npm install on start) 

## Checking licenses

```shell
npx license-checker
```
or 
```shell
npx license-checker --summary
```

## Scan for vulnerabilities

```shell
npm audit
```

If vulnerabilities found, you can try to fix them with
```shell
npm audit fix
```
