describe('Salary add avance => credited', () => {
    describe('Fill form data:', () => {
        salary_shared.run_test_case("case_1");

        it("Click filter button", () => {
            for_css.wait_css(".form-actions >.btn.btn-primary", globalTimeout);
            element(by.css(".form-actions >.btn.btn-primary")).click(); //from block filter
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

        it("Set for column avanse => credited sum 120.0", () => {
            let employees =  JSON.parse(fs.readFileSync('./spec/support/user.json'))['employees'];

            employees.forEach((employee) => {
                let xpath = `//tr[@data-id=${employee['id']}]/td[4]/form/div/input`;
                element(by.xpath(xpath)).clear();
                element(by.xpath(xpath)).sendKeys("120.0");
            });

        });

        it("click button premiums", () => {
            browser.executeScript("window.scrollTo(100000, 10)");

            element.all(by.css('[title="Начислить всем"]')).get(1).click();
            for_css.wait_id('modal', globalTimeout);
        });

        it("Check sum 120.0 in modal", () => {
            let employees =  JSON.parse(fs.readFileSync('./spec/support/user.json'))['employees'];

            employees.forEach((employee) => {
                let xpath = `//*[@name=\"payments[${employee['id']}]\"]/../../td[2]`;

                expect(element(by.xpath(xpath)).getText()).toEqual("120.0");
            });

        });

        it("click button in modal", () => {

            element(by.css('.btn-primary')).click();
        });

        it("Check for column avanse => credited sum 120.0", () => {
            let until = protractor.ExpectedConditions;
            let xpath = element.all(by.xpath("//td[4]/div[1][contains(text(), 'Начислено:\n120.0')]"));

            browser.wait(until.presenceOf(xpath), 10000, 'Element taking too long to appear in the DOM');

            xpath.each((e)=> { e.getText().then((text) => { expect(text).toEqual("Начислено: 120.0") }) })
        });

    });
});
