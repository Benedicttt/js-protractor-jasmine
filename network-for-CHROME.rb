
logs = @driver.manage.logs.get('performance')
logs.map do |logEntry|
  logMessage = (logEntry.as_json["message"]).as_json
  
  # ищется запись в логе для отправленного post-запроса
  if logMessage.include?("\"method\":\"Network.requestWillBeSent\"")
    if logMessage.include?("postData")
      @logger.info("я нашел postData")
      # в отправляемых данных ищется responseCodeSAS и мобильный телефон
      @foundedResponseCodeSAS = logMessage.scan(/\\"responseCodeSAS\\":(\d+)/)[0][0].to_s
      # мобильный телефон без первой 7-ки
      str = logMessage.scan(/\\"mobilePhone\\":\\"(\d+)\\"/)[0][0].to_s
      @foundedPhone = str.slice!(1..str.length)
      begin
        # в отправляемых данных ищется campaignCode
        @foundedCampaignCode = logMessage.scan(/campaignCode\\":\\"(\w+)\\"/)[0][0].to_s
        @logger.info("найденный в запросе campaignCode: #{@foundedCampaignCode}")
      rescue => exception
        @logger.error("В логе для запроса на отказ не найден campaignCode")
      end
      begin
        # в отправляемых данных ищется variantNumber
        @foundedVariantNumber = logMessage.scan(/variantNumber\\":(\d+)/)[0][0].to_s
        @logger.info("найденный в запросе variantNumber: #{@foundedVariantNumber}")
      rescue => exception
        @logger.error("В логе для запроса на отказ не найден variantNumber")
      end
    end
  end
  
  # ищется запись в логе с результатом отправленного предыдущего post-запроса
  if logMessage.include?("\"method\":\"Network.responseReceived\"")
    if logMessage.include?("POST") && logMessage.include?("consent?")
      @logger.info("я нашел пост запрос с consent")
      # ищется результат выполнения
      @statusCode = logMessage.scan(/\"status\":(\d+),/)[0][0].to_s
    end
  end
end



  # Регистрация Chrome Driver
Capybara.register_driver :chrome do |app|
    capabilities = Selenium::WebDriver::Remote::Capabilities.chrome
    capabilities['loggingPrefs'] = {'performance': 'ALL'} #<-----см
  ​
    options = Selenium::WebDriver::Chrome::Options.new
    options.add_argument("--window-size=1366,1080")
  ​
    # Selenium::WebDriver::Chrome.driver_path="C:/Tools/chromedriver.exe"
    Capybara::Selenium::Driver.new(
      app,
      browser: :chrome,
      options: options,
      # :proxy => @proxy.selenium_proxy,
      desired_capabilities: capabilities,
      listener: TestListener.new(Logger.new(STDOUT))#@proxy_listener
    )
end