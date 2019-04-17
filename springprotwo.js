const puppeteer = require('puppeteer');

const springProfUrl = 'https://www.springerprofessional.de/archive/journal/35147';

const scrapeIssues = async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 926});
  await page.goto(springProfUrl);
  // get issue details
  const issueData = await page.evaluate(() => {
    const issues = [];
    //get volume
    const volJson = {};
    volJson.volume = document.querySelector(
      '#main > section > div > div:nth-child(1) > h3 > span'
    ).innerText;
    //select issue element
    const issueElms = document.querySelectorAll(
      '#main > section > div > div:nth-child(1) > div > section:nth-child(1)'
    );
    // get the issue data
    issueElms.forEach(issueelement => {
      const issueJson = {};
      try {
        issueJson.issue = issueelement
          .querySelector('#main > section > div > div > div > section> h4 > a')
          .innerText.trim();
        issueJson.issueLink = issueelement.querySelector(
          '#main > section > div > div > div > section > h4 > a'
        ).href;
      } catch (exception) {}
      const issueRes = Object.assign(volJson, issueJson);
      issues.push(issueRes);
    });
    return issues;
  });
  await Promise.all([
    page.click('#main > section > div > div > div > section> h4 > a'),
    page.waitForNavigation({waitUntil: 'networkidle0'})
  ]);
  const articleData = await page.evaluate(() => {
    const articles = [];
    const articleElms = document.querySelectorAll('#main > section > article > div > section');
    articleElms.forEach(articleelement => {
      const articleJson = {};
      try {
        articleJson.article = articleelement
          .querySelector('#main > section > article > div > section > a > h3')
          .innerText.trim();
        articleJson.articleLink = articleelement.querySelector(
          '#main > section > article > div > section > a'
        ).href;
      } catch (exception) {
        console.log('error, could not get articles');
      }

      articles.push(articleJson);
    });
    return articles;
  });
  browser.close();
  const issueAll = issueData.concat(articleData);
  console.log(issueAll);
};
scrapeIssues();
