const puppeteer = require('puppeteer');

const springProfUrl = 'https://www.springerprofessional.de/archive/journal/11986';

const scrapeIssues = async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 926});
  await page.goto(springProfUrl);
  // get issue details
  const issueData = await page.evaluate(() => {
    const issues = [];
    // get the issue elements
    const issueElms = document.querySelectorAll('#main > section > div > div> div > section');
    // get the issue data
    issueElms.forEach(issueelement => {
      const issueJson = {};
      try {
        issueJson.issue = issueelement
          .querySelector('#main > section > div > div > div > section> h4 > a')
          .innerText.trim();
        issueJson.issueLink = issueelement
          .querySelector('#main > section > div > div > div > section > h4 > a')
          .getAttribute('href');
      } catch (exception) {}
      issues.push(issueJson);
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
        articleJson.articleLink = articleelement
          .querySelector('#main > section > article > div > section > a')
          .getAttribute('href');
      } catch (exception) {}
      articles.push(articleJson);
    });

    return articles;
  });

  browser.close();
  console.log(issueData, articleData);
};

scrapeIssues();
