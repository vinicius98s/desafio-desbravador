const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'src')));

app.set('views', path.join(__dirname, 'src'));
app.set('view engine', 'ejs');

const baseURL = 'https://api.github.com'

app.get('/', (req, res) => {
    res.render('index', { data: null });
})

app.get('/users', async (req, res) => {
    const user = req.query.name;

    const repos = req.query.sort ?
        await axios.get(`https://api.github.com/users/${user}/repos`, {
            params: {
                sort: req.query.sort
            }
        })
            .then(result => result.data)
            .catch(err => res.render('index', { data: err.response }))
        :
        await axios.get(`${baseURL}/users/${user}/repos`)
            .then(result => result.data)
            .catch(err => res.render('index', { data: err.response }))

    await axios.get(`${baseURL}/users/${user}`)
        .then(result => res.render('index', { data: result.data, repositories: repos }))
        .catch(err => {
            console.log('Status: ', err.response.status)
            return res.render('index', { data: err.response })
        })
})

app.get('/repos', async (req, res) => {
    const repoName = req.query.repo;

    await axios.get(`${baseURL}/repos/${repoName}`)
        .then(result => {
            return res.render('repositories', { data: result.data });
        })
        .catch(err => {
            console.log('Status: ', err.response.status)
            return res.render('index', { data: err.response })
        })

})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`We are running on port ${PORT}`);
})