const fs = require(`fs`)
module.exports.fileManager = () => {
    const localData = `./rankings.json`
    if (!fs.existsSync(localData)) {
        fs.writeFileSync(localData,
            JSON.stringify({
                cargo: '',
                ranks: []
            }, null, 4), err => {
                if (err) {
                    console.log(err)
                }
            })
    }
}