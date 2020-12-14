describe('Salary: check for user sign premium and paid', () => {
    describe('Fill form data:', () => {
        salary_shared.run_test_case("case_1");

        it("Click filter button", () => {
            for_css.wait_css(".form-actions >.btn.btn-primary", globalTimeout);
            element.all(by.css(".form-actions >.btn.btn-primary")).click(); //from block filter
        });

        it("Get random employee link", () => {
            let random_link = "//tr/td[1]/a";
            let file = editJsonFile("./spec/support/user.json");
            let set_params = file.get();
            let random = element.all(by.xpath(random_link));

            for_css.wait_xpath(random_link, globalTimeout);

            random.count().then((c) => {
                let index = Math.floor(Math.random() * c);

                set_params["employee"] = {};
                set_params["employee"]["index"] = index;

                file.save();
            });

            element.all(by.xpath("//tr/td[1]/a/../../../tr")).get(helper.employee_index()).getAttribute('data-id').then((id) => {
                set_params["employee"]["id"] = id;

                file.save();
            });

            random.get(helper.employee_index()).getText().then((t) => {
                set_params["employee"]["names"] = t;

                file.save();
            });

            browser.sleep(1000);
        });

        describe("Check params in employee", () => {
            it("go to url employee", () => {

                let file = editJsonFile("./spec/support/user.json");
                let set_params = file.get();
                let random_sum = Math.round(Math.random() * 10000) + 1;

                set_params["employee"]["random_sum_premium"] = random_sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ".0";
                set_params["employee"]["salary_current_url"] = `${browser.baseUrl}/employees/salary?filters%5Bmonth%5D=08.2019&projects=3`;
                file.save();

                browser.get(`${browser.baseUrl}/employees/${helper.employee_id()}/edit`);
                for_css.wait_css('#employee_last_name', globalTimeout);
                browser.sleep(1000);
            });


            it("edit name, premium, rate and translate", () => {
                let name         = element(by.css('#employee_last_name'));
                let premium      = element(by.css('#employee_premium'));
                let zpp          = element(by.css('#employee_rate'));
                let translate    = element(by.css('#translate'));
                let purpose      = element(by.css('#employee_epay_purse'));
                let premium_text = helper.employee_random_sum_premium().replace(' ', '').toString();

                premium.clear();
                name.clear();
                zpp.clear();
                purpose.clear();

                premium.sendKeys(premium_text);
                name.sendKeys("name_test");
                zpp.sendKeys("1000");
                purpose.sendKeys("000-123456");

                translate.click();
            });

            it("set select in payers", () => {
                tag_selector.selectOption('employee_payer_pointer', 'USD');

                tag_selector.selectOption('employee_payer_cash_project_id', 'Админ');
                tag_selector.selectOption('employee_payer_epay_project_id', 'Админ');

                tag_selector.selectOption('employee_payer_cash_account_id', 'RUR');
                tag_selector.selectOption('employee_payer_epay_account_id', 'RUR');
                browser.sleep(1000)
            });

            it("click button save", () => {
                let btn = element(by.css('.btn-primary'));
                btn.click();
            });
        });

        it("After go to current_url", () => {
            browser.get(helper.employee_salary_current_url())
        });

        it("Check premium default", () => {
            let xpath = `//tr[@data-id=${helper.employee_id()}]/td[3]`;
            for_css.wait_xpath(xpath, globalTimeout);

            element(by.xpath(xpath)).getText().then((text) => {
                expect(text).toEqual(helper.employee_random_sum_premium())
            });
        });

        it("Click btn premium", () => {
            let xpath = "//*[contains(text(), 'Премия')]/a";

            for_css.wait_xpath(xpath, globalTimeout);
            element(by.xpath(xpath)).click()
        });

        it("set premium sum in credited and paid", () => {
            let file               = editJsonFile("./spec/support/user.json");
            let set_params         = file.get();
            let random_sum = Math.round( Math.random() * 100000 ) + 1;

            set_params["employee"]["random_sum"] = random_sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ".0";
            file.save();

            for_css.wait_id('employees_' + helper.employee_id() + '_credited', globalTimeout);

            element(by.id('employees_' + helper.employee_id() + '_credited')).clear();
            element(by.id('employees_' + helper.employee_id() + '_credited')).sendKeys(random_sum);

            element(by.id('employees_' + helper.employee_id() + '_paid')).clear();
            element(by.id('employees_' + helper.employee_id() + '_paid')).sendKeys(random_sum);

            console.log("ID: " + helper.employee_id());
            console.log("SUM: " + helper.employee_random_sum());
            console.log("INDEX: " + helper.employee_index());
            console.log("NAMES: " + helper.employee_names());
            console.log("FILTER url: " + helper.employee_salary_current_url());
        });

        it("Click btn in premiums modal", () => {
            for_css.wait_xpath("//button[contains(text(), \"Создать\")]", globalTimeout);
            element(by.xpath("//button[contains(text(), \"Создать\")]")).click(); //from modal
        });

        it("Click btn sign premiums", () => {
            let credited_xpath = `//tr[@data-id=${helper.employee_id()}]/td[6]/div[contains(text(), \"${helper.employee_random_sum()}\")]//../../td[6][contains(., \"Услуга:\")]/a/i[@class="icon-pencil"]`;

            for_css.wait_xpath(credited_xpath, globalTimeout + 10000);
            element(by.xpath(credited_xpath)).click();
        });

        it("Sign", () => {
            for_css.wait_xpath("//button[contains(text(), \"Подписать\")]", globalTimeout);
            element(by.xpath("//button[contains(text(), \"Подписать\")]")).click(); //from modal

        });

        it("Check Signed", () => {
            for_css.wait_xpath(`//tr[@data-id=${helper.employee_id()}]/td[6]/div[contains(text(), \"${helper.employee_random_sum()}\")]//../../td[6][contains(., \"Услуга:\")]//../../td[6]/*[contains(text(), \"Подписана\")]`, globalTimeout);
            browser.sleep(500);
        });


        it("Click btn Paid", () => {
            let paid_input_xpath = `//tr[@data-id=${helper.employee_id()}]/td[7]/div[contains(text(), \"${helper.employee_random_sum()}\")]//../../td[7]/form/div/input`;
            let paid_btn_xpath = `//tr[@data-id=${helper.employee_id()}]/td[7]/div[contains(text(), \"${helper.employee_random_sum()}\")]//../../td[7]/form/button`;

            element.all(by.xpath(paid_input_xpath)).get(0).clear();
            browser.sleep(500);
            element.all(by.xpath(paid_input_xpath)).get(0).clear();
            browser.sleep(500);
            element.all(by.xpath(paid_input_xpath)).get(0).sendKeys(helper.employee_random_sum().replace(/ /, ''));

            for_css.wait_xpath(paid_btn_xpath, globalTimeout);
            element(by.xpath(paid_btn_xpath)).click();

        });

        it("Paid", () => {
            for_css.wait_xpath("//button[contains(text(), \"Да\")]", globalTimeout);
            element(by.xpath("//button[contains(text(), \"Да\")]")).click(); //from modal
        });

        it("check Paid", () => {
            let paid_btn_xpath = `//tr[@data-id=${helper.employee_id()}]/td[7]/div[contains(text(), \"${helper.employee_random_sum()}\")]`;

            for_css.wait_xpath(paid_btn_xpath, globalTimeout);
            browser.sleep(2000);

            element.all(by.xpath(paid_btn_xpath)).count().then((size) => {
                expect(size).toEqual(2) });
        });

    });

});
