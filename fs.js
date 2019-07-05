const fs = require('fs');

module.exports ={
    setFile: async function(ctx, next){
        fs.writeFileSync(url,JSON.stringify(data));
    },
    getFile: async function(ctx, next){
        ctx.response.body = fs.readFileSync('./db/aaa');
    }
};
