let global_variables =  require('./global_variable.js');
let suites           =  require('./suites.js');
let reports          =  require('./reports.js');
let disable          =  require('./disable.js');
let capabilities     =  require('./capabilities.js');

exports.config  = {
    capabilities: {
        browserName: "chrome",
        chromeOptions: {
            prefs: {'credentials_enable_service': false},
            args: ["--disable-gpu", "--window-size=1920x1080", process.env.headless]
        }
    },

    // multiCapabilities: capabilities.set,
    // maxSessions: 3,
    suites: suites,
    framework:    'jasmine',

    splitTestsBetweenCapabilities: true,
    allScriptsTimeout:             15000,
    getPageTimeout:                15000,

    jasmineNodeOpts: {
        showColors:             true,
        includeStackTrace:      true,
        defaultTimeoutInterval: 600000
    },

    baseUrl:          process.env.APP_HOST,
    directConnect:    JSON.parse(process.env.DIRECT_CONNECT),
    seleniumAddress: 'http://selenium:4444/wd/hub',
    selenium: { start_process: false },

    onPrepare: function () {
        global_variables.call();
        reports.call_settings();
        disable.animations();

        browser.driver.manage().window().setSize(1620, 1080);
        browser.manage().timeouts().implicitlyWait(5000);
    }
};
