**Need NodeJS and NPM**\
  `brew install nodejs`
  `brew install npm`

After, git clone project
In folder project execute command:  
 `npm install -g`  
  `npm install ntl`

Execute command::  `ntl` 

Execute command in ntl: `webdriver-update`

Run tests local from cmd, type headless chrome:  
_DIRECT_CONNECT=true APP_HOST=https://test.info FailFast=2 headless=--headless protractor config/conf.js --browser chrome_

Run tests local from cmd, type visible chrome:  
_DIRECT_CONNECT=true APP_HOST=https://test.info FailFast=2  protractor config/conf.js --browser chrome_


**FailFast=2 - _option after two failed test, proccess tests will killed_   
protractor - _framework for test selenium chrome_  
config/conf.js - _option what configuration to connect_  
 --browser chrome - _option which browser to connect tests_**
 
 _all scripts - ./package.json_
 
**General files config:** ./config/conf.js and conf-ci.js  
./config/conf.js - for local  
./config/conf-ci.js - for GitLabCI  
 