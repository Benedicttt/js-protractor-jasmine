fdescribe('Salary premiums', () => {
    describe('Fill form data:', () => {
        salary_shared.run_test_case("case_1");

        it("Click filter button", () => {
            for_css.wait_css(".form-actions >.btn.btn-primary", globalTimeout);
            element.all(by.css(".form-actions >.btn.btn-primary")).click(); //from block filter
        });

        it("Get employee links", () => {
            let file       = editJsonFile("./spec/support/user.json");
            let set_params = file.get();
            let all_links  = element.all(by.xpath("//tr/td[1]/a/../../../tr"));

            set_params["employees"] = [];

            all_links.each((elem) => {
                elem.getAttribute('data-id').then((id) => {
                    if ( id !== null) {
                        let css = `[data-id="${id}"] > td:nth-child(1) > a`;

                        element(by.css(css)).getText().then((name) => {
                            set_params["employees"].push({ id: id , name: name });
                        })
                    }

                    file.save();
                });
            })
        });

        it("click button premiums", () => {
            element.all(by.css('[title="Начислить всем"]')).get(0).click();

            for_css.wait_id('modal', globalTimeout);
        });

        it("set accrued and paid all users premium 100", () => {
            let employees =  JSON.parse(fs.readFileSync('./spec/support/user.json'))['employees'];

            employees.forEach((employee) => {
                element(by.id(`employees_${employee['id']}_credited`)).clear();
                element(by.id(`employees_${employee['id']}_paid`)).clear();

                element(by.id(`employees_${employee['id']}_credited`)).sendKeys("100.00");
                element(by.id(`employees_${employee['id']}_paid`)).sendKeys("100.00");
            });
        });

        it("click button in modal", () => {
            let until = protractor.ExpectedConditions;
            let xpath = element.all(by.xpath("//td[6]/div[1][contains(text(), 'Начислено:\n100.0')]"));

            element(by.css('.btn-primary')).click();
            browser.wait(until.presenceOf(xpath), 10000, 'Element taking too long to appear in the DOM');
            browser.sleep(3000)
        });


        it("Check credited users", () => {
            let employees =  JSON.parse(fs.readFileSync('./spec/support/user.json'))['employees'];
            browser.navigate().refresh();

            employees.forEach((employee) => {
                let xpath = `//tr[@data-id=${employee['id']}]/td[6]/div[1]`;

                for_css.wait_xpath(xpath, globalTimeout);

                expect(element(by.xpath(xpath)).getText()).toEqual("Начислено: 100.0")
            });
        });

    });
});
