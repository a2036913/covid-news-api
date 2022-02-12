//api link: https://globalcovidnewsapi.herokuapp.com/news

const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const newspapers = [
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/article/coronavirus-3g6vmvrpt",
    base: "https://www.thetimes.co.uk",
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/world/coronavirus-outbreak",
    base: "https://www.theguardian.com",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/coronavirus/",
    base: "https://www.telegraph.co.uk",
  },
  {
    name: "bbc",
    address: "https://www.bbc.com/news/coronavirus",
    base: "https://www.bbc.com/",
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $(
      'a:contains("coronavirus"), a:contains("COVID"), a:contains("covid"), a:contains("COVID-19"), a:contains("Covid")',
      html
    ).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      if (newspaper.name === "telegraph") {
        articles.push({
          title,
          url: newspaper.base + url,
          source: newspaper.base,
        });
      } else {
        articles.push({
          title,
          url: url,
          source: newspaper.base,
        });
      }
    });
  });
});

app.get("/", (req, res) => {
  res.json("welcome to coronavirus-news api");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperId", (req, res) => {
  const newspaperId = req.params.newspaperId;

  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].address;
  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].base;

  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $(
        'a:contains("coronavirus"), a:contains("COVID"), a:contains("covid"), a:contains("COVID-19"), a:contains("Covid")',
        html
      ).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () =>
  console.log(`server is running on http://localhost:${PORT}`)
);
