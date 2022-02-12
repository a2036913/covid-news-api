//to call covid news api: https://globalcovidnewsapi.herokuapp.com/news

const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: 'https://www.thetimes.co.uk'
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: 'https://www.theguardian.com'
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change/',
        base: 'https://www.telegraph.co.uk'
    },
    {
        name: 'telegraph',
        address: 'https://www.bbc.com/news/science-environment-56837908',
        base: 'https://www.telegraph.co.uk'
    },
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})

app.get('/',(req, res) => {
    res.json('welcome to climate api')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', async(req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response  => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []
            
            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server is running on http://localhost:${PORT}`))