const yaml = require('js-yaml');
const fs = require('fs');
let file = fs.readFileSync('spec/panel/test_case/employee/test_case.yml', 'utf8');
const scenarios = yaml.safeLoad(file).salary;

module.exports = {
    run_test_case: function(name_case) {
        it(`Go to page and check title ${page.employee.salary.title}`, () => {
            user_object.authorization(helper.user_email_last());

            go(page.employee.salary.get);

            expect(browser.getTitle()).toEqual(page.employee.salary.title);
        });


        it(`click filter button `, () => {
            for_css.wait_css(".btn.btn-small", globalTimeout);
            element.all(by.css(".btn.btn-small")).click();
        });

        it(`click project checkbox name [${scenarios[`${name_case}`].filter.project}]`, () => {
            let project_xpath = `//label[contains(., "${scenarios[`${name_case}`].filter.project}")]`;

            for_css.wait_xpath(project_xpath, globalTimeout);
            element(by.xpath(project_xpath)).click();
        });


        it(`click filter button in modal`, () => {
            for_css.wait_css(".btn.btn-primary", globalTimeout);
            element(by.css(".btn.btn-primary")).click(); //from modal
        });


    }
};