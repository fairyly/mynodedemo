module.exports = {
    port: 3000,
    session: {
      secret: 'tbk',
      key: 'tbk',
      maxAge: 1000*60*60*24 //一天
    },
    mongodb: 'mongodb://localhost:27017/tbk',
    version: '0',
    title:'我爱专享优惠券',
    describe :'每天百万优惠券等你来搜',
};