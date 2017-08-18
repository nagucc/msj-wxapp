/*
从服务器获取COS请求签名
*/

const { get, set } = require('./storage');
const jsonAuthorizationKey = 'COS:JSON:AUTHORIZATION';

/*
获取JSON API的请求签名。
参数：
- token
*/
const getJsonAuthorization = (options, callback) => {
  const authorization = get(jsonAuthorizationKey);
  if (authorization) callback(authorization);
  else {
    const expire = 29 * 24 * 3600 // 29天，默认有效期30天
    wx.request({
      url: `https://api.nagu.cc/cos/json-authorization?token=${options.token}`,
      success: function (res) {
          var result = res.data;
          if (result.ret === 0) {
            set(jsonAuthorizationKey, result.data, expire);
            callback(result.data);
          } else callback('');
      }
    });
  }
}

module.exports = {
  getJsonAuthorization,
};
