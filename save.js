const fs = require('fs')
module.exports.run = async (data, local) => {
    fs.writeFileSync(local,
        data, err => {
            if (err) {
                console.log(err)
            }
        }
    )
}