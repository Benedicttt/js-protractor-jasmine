describe('Salary add avance => credited', () => {
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

        it("Set for column avanse => credited sum 130.0", () => {
            let employee =  JSON.parse(fs.readFileSync('./spec/support/user.json'))['employees'][0];
            let xpath = `//tr[@data-id=${employee['id']}]/td[5]/form/div/input`;

            element(by.xpath(xpath)).clear();
            element(by.xpath(xpath)).sendKeys("130.0");
        });

        it("click button premiums", () => {
            element.all(by.css('[title="Оплатить"]')).get(0).click();
            for_css.wait_id('modal', globalTimeout);
        });

        it("Check sum 130.0 in modal", () => {
            let employee =  JSON.parse(fs.readFileSync('./spec/support/user.json'))['employees'][0];
            let xpath = `//*[@id="edit_employee_${employee['id']}"]/table/tbody/tr[3]`;

            expect(element(by.xpath(xpath)).getText()).toEqual("Сумма: 130.0 RUR");
        });

        it("click button in modal", () => {
            element(by.css('.btn-primary')).click();
        });

        it("Check for column avanse => paid sum 130.0", () => {
            let until = protractor.ExpectedConditions;
            let xpath = element.all(by.xpath("//td[5]/div[1][contains(text(), 'Оплачено:\n130.0')]"));

            browser.wait(until.presenceOf(xpath), 10000, 'Element taking too long to appear in the DOM');

            xpath.each((e)=> { e.getText().then((text) => { expect(text).toEqual("Оплачено: 130.0") }) })
        });
    });
});
