"use strict";
const findMembers = function (instance, { prefix, specifiedType, filter }) {
  // 递归函数
  function _find(instance) {
    // 基线条件（跳出递归）
    // eslint-disable-next-line no-proto
    if (instance.__proto__ === null) return [];

    let names = Reflect.ownKeys(instance);
    names = names.filter(name => {
      // 过滤掉不满足条件的属性或方法名
      return _shouldKeep(name);
    });

    // eslint-disable-next-line no-proto
    return [...names, ..._find(instance.__proto__)];
  }

  function _shouldKeep(value) {
    if (filter) {
      if (filter(value)) {
        return true;
      }
    }
    if (prefix) if (value.startsWith(prefix)) return true;
    if (specifiedType) {
      if (instance[value] instanceof specifiedType) return true;
    }
  }

  return _find(instance);
};

const validator = {
  // 校验手机号码
  isPhone: val => /^1[3456789]\d{9}$/.test(val),
  // 校验固定电话
  isTel: val => /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(val),
  // 校验电子邮箱
  isEmail: val =>
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      val
    ),
  // 校验中国大陆身份证
  isCertid: val =>
    /^[1-9]\d{5}(?:18|19|20)\d{2}(?:(?:0[1-9])|(?:1[0-2]))(?:(?:[0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
      val
    ),
  // 校验港澳居民来往内地通行证 “H”字头签发给香港居民，“M”字头签发给澳门居民；第2位至第11位为数字，前8位数字为通行证持有人的终身号，后2位数字表示换证次数，首次发证为00
  isHKCard: val => /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/.test(val),
  // 校验台湾居民来往大陆通行证
  isTWCard: val => /^\d{8}$|^[a-zA-Z0-9]{10}$|^\d{18}$/.test(val),
  // 校验时间格式 2019-10-10 2019/10/10
  isDate: val =>
    /^\d{4}[/.-]\d{1,2}[/.-]\d{1,2}(?:\s\d{1,2}:\d{1,2}:\d{1,2})?$/.test(val),
  // 校验中文
  isChinese: val => /^[\u4e00-\u9fa5]+$/.test(val),
  // 校验为整数
  isInteger: val => /^-?[1-9]\d*$/.test(val),
  // 校验正整数和零
  isPositiveInteger: val => /^[0-9]\d*$/.test(val),
  isPositiveIntegerV2: val => /^[1-9]+0*\d*$/.test(val),
  // 校验固定电话
  isTelephone: val => /^\d*\-*\d+$/.test(val),
  // 校验浮点数、负数
  isFloat: val => /^-?(\d+\.\d+|[1-9]d*|0)$/.test(val),
  isUrl: val =>
    /^(?:(?:(?:[a-z]+:)?\/\/)|www\.)(?:\S+(?::\S*)?@)?(?:localhost|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3})|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#][^\s"]*)?$/.test(
      val
    ),
  ipV4: val =>
    /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/.test(
      val
    ),
  ipV6: val =>
    /^((?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(:[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(:[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(:[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(:[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(:[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(:[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(:[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(:[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(:[a-fA-F\d]{1,4}){1,6}|:)|(?::((?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(%[0-9a-zA-Z]{1,})?$/.test(
      val
    ),
  isEnglishName: val => /^([A-Za-z]+\s?)*[A-Za-z]+$/.test(val),
  isEnglishNumber: val => /^\d*[A-Z]*[a-z]*\d*$/.test(val),
  isUnifiedCredit: val => /^(\d|[A-Z]){18,18}$/.test(val)
}

module.exports = {
  findMembers,
  validator
};
