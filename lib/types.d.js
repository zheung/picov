/**
 * @typedef {Object} Profile
 * @property {string} name 档案名称，唯一，重要索引
 * @property {string} nick 用户昵称
 * @property {number} id 用户ID
 * @property {string} cookie 登录凭证，用于查询等操作
 * @property {string} token 操作凭证，用于关注画师等操作
 * @property {Object} block 黑名单
 * @property {number[]} block.user 用户黑名片
 * @property {Object<string, string>} dir 用户目录
 * @property {Object<string, string>} dirArchive 用户图片保存目录
 * @property {Object<string, string[]} bookmark 搜索书签 title=keyword
 */


/**
 * @callback Handle
 * @param {import('../src/lib/mare/parse-profile.mare.lib.js').HandleRaw} raw
 */


/** @param {Handle} handle */
export const defineHandle = handle => handle;
