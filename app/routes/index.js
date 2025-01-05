const express = require('express');
const router = express.Router();

const fs = require('fs');

const pathRouter = `${__dirname}`;

/** remove example: index.js to index */
const removeExtension = (filename) => {
    return filename.split('.').shift();
}

fs.readdirSync(pathRouter).filter((file) => {
    const fileWithoutExtension = removeExtension(file);
    const skip = ['index'].includes(fileWithoutExtension);
    if (!skip) {
        router.use(`/${fileWithoutExtension}`, require(`./${fileWithoutExtension}`));
        console.log('Loading route ==> ', file);
    }
});

router.get('*', (req, res) => {
    res.status(404);
    res.send({
        error: 'Url not found'
    })
})

module.exports = router;