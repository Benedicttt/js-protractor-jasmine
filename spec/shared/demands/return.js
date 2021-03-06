const yaml = require('js-yaml');
const fs = require('fs');
let file = fs.readFileSync('spec/panel/test_case/demands/test_case.yml', 'utf8');
const scenarios_return = yaml.safeLoad(file).demand.return;

let file_service = fs.readFileSync('spec/support/service.json');
let services_ids = JSON.parse(file_service).service;

const add_inventory = require("./helpers/add_inventory.js");
const func          = require("./helpers/runner_demand_attr.js");

module.exports = {
    run_test_case_return: function (name_case) {
        it(`Go to page and check title ${page.demands.title}`, () => {
            user_object.authorization(helper.user_email_last());

            go(page.demands.get);


            expect(browser.getTitle()).toEqual(page.demands.title);

            go(page.demands.new.get);
            expect(browser.getTitle()).toEqual(page.demands.new.title);
        });

        scenarios_return[`${name_case}`].selector.map(function (id) {
            let value = `${Object.values(id)[0]}`;
            let key = `${Object.keys(id)[0]}`;

            it(`{ select ${key}: ${value} }`, () => {
                browser.sleep(300);
                tag_selector.selectOption(key, value)
            })
        });

        scenarios_return[`${name_case}`].checkbox.map(function (id) {
            let value = `${Object.values(id)[0]}`;
            let key = `${Object.keys(id)[0]}`;

            if (Object.values(id)[0] === true) {
                it(`{ checkbox ${key}: ${value} }`, () => {
                    element(by.id(`${key}`)).click();
                    browser.sleep(300)
                })
            }
        });

        scenarios_return[`${name_case}`].attributes.map(function (attribute) {
            let value = `${Object.values(attribute)[0]}`;
            let key = `${Object.keys(attribute)[0]}`;

            if (key === "add_inventory" && value === 'true') {
                it(`{ input ${key}: ${value} }`, () => {
                    add_inventory.call()
                });
            }
        });

        scenarios_return[`${name_case}`].input.map(function (id) {
            let value = `${Object.values(id)[0]}`;
            let key = `${Object.keys(id)[0]}`;


            it(`{ input ${key}: ${value} }`, () => {
                element(by.id(`${key}`)).clear();

                if (value === 'us') {
                    console.log(`number service: ${helper.created_services("us")}`);

                    element(by.id(`${key}`)).sendKeys(helper.created_services("us"))

                } else if (value === 'we') {
                    console.log(`number service: ${helper.created_services("us")}`);

                    element(by.id(`${key}`)).sendKeys(services_ids.we.number)

                } else {
                    element(by.id(`${key}`)).sendKeys(`${value}`)

                }
            })
        });

        scenarios_return[`${name_case}`].attributes.map(function (attribute) {
            func.runner_demand_attr(name_case, attribute, scenarios_return)
        });

    }
}