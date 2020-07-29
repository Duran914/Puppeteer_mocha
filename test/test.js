const puppeteer = require("puppeteer");
const expect = require('chai').expect;

let browser;
let page;
const url = "https://upsellitshoes.com/password"

describe("USIshoes TT 24824", () => {

  before(async () => {
    browser = await puppeteer.launch({headless: true, defaultViewport: {width:1920, height:1080}, slowMo: 100});
    page = await browser.newPage();
  });

  it(`Navigating to ${url}`, async () => {
    await page.goto(url, { waitUntil: "networkidle0" });
  });

  it("CLick Enter Using Password button", async () => {
    await page.click('.password-login a')
  })

  it("Type Password in field", async () => {
    await page.waitForSelector('#Password')
    await page.type("#Password", "upsellit123")
  })

  it("Click Enter button", async () => {
    await page.click("button.btn--narrow");
  })

  it("Select first product on home page", async () => {
    await page.waitForSelector(".collection-grid .product-item:first-child a")
    await page.click(".collection-grid .product-item:first-child a");
  })

  it("Launch TT", async () => {
    await page.evaluate(function(){
      // usi_js.display(); <= what we would normally use to launch on cleint site
      setTimeout(()=> {
        usi_commons.load_view("xL9dfetVSiu5uatfhe6l2fv", "24824", usi_cookies.get("gender"));
      }, 5000);
    });
  })

  it("Close USI sidebar", async () => {
    await page.waitForSelector("#usi_status")
    await page.click("#usi_status");
  })

  it("Click CTA", async () => {
    await page.waitForSelector(".usi_submitbutton")
    await page.click(".usi_submitbutton");
  })

  it('Check Boostbar', async() => {
    let boostBar = await page.waitForSelector("#usi_boost_container");
    let boost_bar_text =  await page.evaluate(boostBar => boostBar.innerText, boostBar);
    expect(boost_bar_text).to.equal('X\nCoupon 10OFF will be automatically applied at checkout');
   });

  it("Add to cart", async () => {
    await page.waitForSelector("#AddToCart-product-template")
    await page.click("#AddToCart-product-template");
  })

  it("Click checkout button", async () => {
    await page.waitForSelector('.cart__checkout')
    await page.click(".cart__checkout")
  })

  it("Coupon validation - Code: 10OFF", async () => {
    // Change focus to newly opened tab
    let checkoutPage = (await browser.pages())[2];

    // Gives 10 seconds to open new tab
    let tries = 0;
      while (tries != 5) {
        if (!checkoutPage) {
          await page.waitFor(2000);
          checkoutPage = (await browser.pages())[2];
          tries++;
        }
        else{
          break
        }
      }

    const coupon_field = await checkoutPage.waitForSelector(".tag__wrapper .reduction-code span");

    // Get innerText of couon_field
    const scraped_coupon_text = await checkoutPage.evaluate(coupon_field => coupon_field.innerText, coupon_field);

    // Coupon code text matching validation 
    expect(scraped_coupon_text).to.equal('10OFF');

  })

  after(async () => {
    await browser.close();
  });
});

