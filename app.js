const express = require("express");
const app = express();
const puppeteer = require("puppeteer");
const cors = require("cors");

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());
app.use(cors());
app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    next();
});

app.post("/", async (req, res) => {
    try {
        console.log(req.body)
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const [page] = await browser.pages();
        console.log(req.body.url);
        await page.goto(req.body.url, { waitUntil: 'domcontentloaded' });
        const data = await page.evaluate(() => document.querySelector('*').outerHTML);

        await browser.close();
        res.send(data);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
})
app.listen(3000, () => console.log("Server has been started"));