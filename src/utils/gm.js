import axios from 'axios'

export default {
    getServerList(c) {
        axios
        .get('/gm/serverlist')
        .then(res => {
            const { data, code, msg } = res.data;
            // console.log(data,code,message)
            if (+code === 0) {
                c.serverList = [{"id":0, "name": "全服"}]
                c.serverList = c.serverList.concat(data);  
                return data;
            } else {
                this.$message.error(msg);
            }
        })
    },

    async getGMTable(tb){
    
      let r = await axios.get('/utils/dict?table=' + tb)
      return r.data.data
    },

    async getCurrentGameId() {
      let r = await axios.get('/index/user')
      return r.data.data.gameId
    },    

    getTimeZone() {
      let user = localStorage.getItem("user")
      
      if (user) {
        user = JSON.parse(user)
        return user.currentGameTimeZone
      }else{
        return undefined
      }
    },

    // 传入参数：毫秒
    // 返回的单位为：秒
    // 东八区转其他时区时间戳
    timeByZone(time, timezone) {
        timezone = timezone || this.getTimeZone()
        console.log("timeByZone",timezone)
        time = time ? time : 0;
        if(time == 0) {
            return 0;
        }
        //time 为东八区八点

        // 0时区 的八点
        time = time / 1000  + 60*60*8;
        time = time - timezone * 60 * 60;
        return time;
    },

    // 传入参数：秒
    // 返回的单位为：毫秒    
    timeToUTC8(time, timezone) {
      console.log("timeToUTC8",timezone)

        timezone = timezone || this.getTimeZone()
        time = time ? time : 0;
        if(time == 0) {
            return 0;
        }

        time = time  - 60*60*8;
        time = time + timezone * 60 * 60;
        return time * 1000;
    },

    countryList: [
        {
          "code": "ad",
          "name": "安道尔"
        },
        {
          "code": "ae",
          "name": "阿联酋"
        },
        {
          "code": "af",
          "name": "阿富汗"
        },
        {
          "code": "ag",
          "name": "安提瓜和巴布达"
        },
        {
          "code": "ai",
          "name": "安圭拉"
        },
        {
          "code": "al",
          "name": "阿尔巴尼亚"
        },
        {
          "code": "am",
          "name": "亚美尼亚"
        },
        {
          "code": "ao",
          "name": "安哥拉"
        },
        {
          "code": "aq",
          "name": "南极洲"
        },
        {
          "code": "ar",
          "name": "阿根廷"
        },
        {
          "code": "as",
          "name": "美属萨摩亚"
        },
        {
          "code": "at",
          "name": "奥地利"
        },
        {
          "code": "au",
          "name": "澳大利亚"
        },
        {
          "code": "aw",
          "name": "阿鲁巴"
        },
        {
          "code": "ax",
          "name": "奥兰群岛"
        },
        {
          "code": "az",
          "name": "阿塞拜疆"
        },
        {
          "code": "ba",
          "name": "波黑"
        },
        {
          "code": "bb",
          "name": "巴巴多斯"
        },
        {
          "code": "bd",
          "name": "孟加拉"
        },
        {
          "code": "be",
          "name": "比利时"
        },
        {
          "code": "bf",
          "name": "布基纳法索"
        },
        {
          "code": "bg",
          "name": "保加利亚"
        },
        {
          "code": "bh",
          "name": "巴林"
        },
        {
          "code": "bi",
          "name": "布隆迪"
        },
        {
          "code": "bj",
          "name": "贝宁"
        },
        {
          "code": "bl",
          "name": "圣巴泰勒米岛"
        },
        {
          "code": "bm",
          "name": "百慕大"
        },
        {
          "code": "bn",
          "name": "文莱"
        },
        {
          "code": "bo",
          "name": "玻利维亚"
        },
        {
          "code": "bq",
          "name": "荷兰加勒比区"
        },
        {
          "code": "br",
          "name": "巴西"
        },
        {
          "code": "bs",
          "name": "巴哈马"
        },
        {
          "code": "bt",
          "name": "不丹"
        },
        {
          "code": "bv",
          "name": "布韦岛"
        },
        {
          "code": "bw",
          "name": "博茨瓦纳"
        },
        {
          "code": "by",
          "name": "白俄罗斯"
        },
        {
          "code": "bz",
          "name": "伯利兹"
        },
        {
          "code": "ca",
          "name": "加拿大"
        },
        {
          "code": "cc",
          "name": "科科斯群岛"
        },
        {
          "code": "cf",
          "name": "中非"
        },
        {
          "code": "ch",
          "name": "瑞士"
        },
        {
          "code": "cl",
          "name": "智利"
        },
        {
          "code": "cm",
          "name": "喀麦隆"
        },
        {
          "code": "co",
          "name": "哥伦比亚"
        },
        {
          "code": "cr",
          "name": "哥斯达黎加"
        },
        {
          "code": "cu",
          "name": "古巴"
        },
        {
          "code": "cv",
          "name": "佛得角"
        },
        {
          "code": "cx",
          "name": "圣诞岛"
        },
        {
          "code": "cy",
          "name": "塞浦路斯"
        },
        {
          "code": "cz",
          "name": "捷克"
        },
        {
          "code": "de",
          "name": "德国"
        },
        {
          "code": "dj",
          "name": "吉布提"
        },
        {
          "code": "dk",
          "name": "丹麦"
        },
        {
          "code": "dm",
          "name": "多米尼克"
        },
        {
          "code": "do",
          "name": "多米尼加"
        },
        {
          "code": "dz",
          "name": "阿尔及利亚"
        },
        {
          "code": "ec",
          "name": "厄瓜多尔"
        },
        {
          "code": "ee",
          "name": "爱沙尼亚"
        },
        {
          "code": "eg",
          "name": "埃及"
        },
        {
          "code": "eh",
          "name": "西撒哈拉"
        },
        {
          "code": "er",
          "name": "厄立特里亚"
        },
        {
          "code": "es",
          "name": "西班牙"
        },
        {
          "code": "fi",
          "name": "芬兰"
        },
        {
          "code": "fj",
          "name": "斐济群岛"
        },
        {
          "code": "fk",
          "name": "马尔维纳斯群岛"
        },
        {
          "code": "fm",
          "name": "密克罗尼西亚联邦"
        },
        {
          "code": "fo",
          "name": "法罗群岛"
        },
        {
          "code": "fr",
          "name": "法国"
        },
        {
          "code": "ga",
          "name": "加蓬"
        },
        {
          "code": "gd",
          "name": "格林纳达"
        },
        {
          "code": "ge",
          "name": "格鲁吉亚"
        },
        {
          "code": "gf",
          "name": "法属圭亚那"
        },
        {
          "code": "gh",
          "name": "加纳"
        },
        {
          "code": "gi",
          "name": "直布罗陀"
        },
        {
          "code": "gl",
          "name": "格陵兰"
        },
        {
          "code": "gn",
          "name": "几内亚"
        },
        {
          "code": "gp",
          "name": "瓜德罗普"
        },
        {
          "code": "gq",
          "name": "赤道几内亚"
        },
        {
          "code": "gr",
          "name": "希腊"
        },
        {
          "code": "gs",
          "name": "南乔治亚岛和南桑威奇群岛"
        },
        {
          "code": "gt",
          "name": "危地马拉"
        },
        {
          "code": "gu",
          "name": "关岛"
        },
        {
          "code": "gw",
          "name": "几内亚比绍"
        },
        {
          "code": "gy",
          "name": "圭亚那"
        },
        {
          "code": "hk",
          "name": "中国(香港)"
        },
        {
          "code": "hm",
          "name": "赫德岛和麦克唐纳群岛"
        },
        {
          "code": "hn",
          "name": "洪都拉斯"
        },
        {
          "code": "hr",
          "name": "克罗地亚"
        },
        {
          "code": "ht",
          "name": "海地"
        },
        {
          "code": "hu",
          "name": "匈牙利"
        },
        {
          "code": "id",
          "name": "印尼"
        },
        {
          "code": "ie",
          "name": "爱尔兰"
        },
        {
          "code": "il",
          "name": "以色列"
        },
        {
          "code": "im",
          "name": "马恩岛"
        },
        {
          "code": "in",
          "name": "印度"
        },
        {
          "code": "io",
          "name": "英属印度洋领地"
        },
        {
          "code": "iq",
          "name": "伊拉克"
        },
        {
          "code": "ir",
          "name": "伊朗"
        },
        {
          "code": "is",
          "name": "冰岛"
        },
        {
          "code": "it",
          "name": "意大利"
        },
        {
          "code": "je",
          "name": "泽西岛"
        },
        {
          "code": "jm",
          "name": "牙买加"
        },
        {
          "code": "jo",
          "name": "约旦"
        },
        {
          "code": "jp",
          "name": "日本"
        },
        {
          "code": "kh",
          "name": "柬埔寨"
        },
        {
          "code": "ki",
          "name": "基里巴斯"
        },
        {
          "code": "km",
          "name": "科摩罗"
        },
        {
          "code": "kw",
          "name": "科威特"
        },
        {
          "code": "ky",
          "name": "开曼群岛"
        },
        {
          "code": "lb",
          "name": "黎巴嫩"
        },
        {
          "code": "li",
          "name": "列支敦士登"
        },
        {
          "code": "lk",
          "name": "斯里兰卡"
        },
        {
          "code": "lr",
          "name": "利比里亚"
        },
        {
          "code": "ls",
          "name": "莱索托"
        },
        {
          "code": "lt",
          "name": "立陶宛"
        },
        {
          "code": "lu",
          "name": "卢森堡"
        },
        {
          "code": "lv",
          "name": "拉脱维亚"
        },
        {
          "code": "ly",
          "name": "利比亚"
        },
        {
          "code": "ma",
          "name": "摩洛哥"
        },
        {
          "code": "mc",
          "name": "摩纳哥"
        },
        {
          "code": "md",
          "name": "摩尔多瓦"
        },
        {
          "code": "me",
          "name": "黑山"
        },
        {
          "code": "mf",
          "name": "法属圣马丁"
        },
        {
          "code": "mg",
          "name": "马达加斯加"
        },
        {
          "code": "mh",
          "name": "马绍尔群岛"
        },
        {
          "code": "mk",
          "name": "马其顿"
        },
        {
          "code": "ml",
          "name": "马里"
        },
        {
          "code": "mm",
          "name": "缅甸"
        },
        {
          "code": "mo",
          "name": "澳门"
        },
        {
          "code": "mq",
          "name": "马提尼克"
        },
        {
          "code": "mr",
          "name": "毛里塔尼亚"
        },
        {
          "code": "ms",
          "name": "蒙塞拉特岛"
        },
        {
          "code": "mt",
          "name": "马耳他"
        },
        {
          "code": "mv",
          "name": "马尔代夫"
        },
        {
          "code": "mw",
          "name": "马拉维"
        },
        {
          "code": "mx",
          "name": "墨西哥"
        },
        {
          "code": "my",
          "name": "马来西亚"
        },
        {
          "code": "na",
          "name": "纳米比亚"
        },
        {
          "code": "ne",
          "name": "尼日尔"
        },
        {
          "code": "nf",
          "name": "诺福克岛"
        },
        {
          "code": "ng",
          "name": "尼日利亚"
        },
        {
          "code": "ni",
          "name": "尼加拉瓜"
        },
        {
          "code": "nl",
          "name": "荷兰"
        },
        {
          "code": "no",
          "name": "挪威"
        },
        {
          "code": "np",
          "name": "尼泊尔"
        },
        {
          "code": "nr",
          "name": "瑙鲁"
        },
        {
          "code": "om",
          "name": "阿曼"
        },
        {
          "code": "pa",
          "name": "巴拿马"
        },
        {
          "code": "pe",
          "name": "秘鲁"
        },
        {
          "code": "pf",
          "name": "法属波利尼西亚"
        },
        {
          "code": "pg",
          "name": "巴布亚新几内亚"
        },
        {
          "code": "ph",
          "name": "菲律宾"
        },
        {
          "code": "pk",
          "name": "巴基斯坦"
        },
        {
          "code": "pl",
          "name": "波兰"
        },
        {
          "code": "pn",
          "name": "皮特凯恩群岛"
        },
        {
          "code": "pr",
          "name": "波多黎各"
        },
        {
          "code": "ps",
          "name": "巴勒斯坦"
        },
        {
          "code": "pw",
          "name": "帕劳"
        },
        {
          "code": "py",
          "name": "巴拉圭"
        },
        {
          "code": "qa",
          "name": "卡塔尔"
        },
        {
          "code": "re",
          "name": "留尼汪"
        },
        {
          "code": "ro",
          "name": "罗马尼亚"
        },
        {
          "code": "rs",
          "name": "塞尔维亚"
        },
        {
          "code": "ru",
          "name": "俄罗斯"
        },
        {
          "code": "rw",
          "name": "卢旺达"
        },
        {
          "code": "sb",
          "name": "所罗门群岛"
        },
        {
          "code": "sc",
          "name": "塞舌尔"
        },
        {
          "code": "sd",
          "name": "苏丹"
        },
        {
          "code": "se",
          "name": "瑞典"
        },
        {
          "code": "sg",
          "name": "新加坡"
        },
        {
          "code": "si",
          "name": "斯洛文尼亚"
        },
        {
          "code": "sj",
          "name": "斯瓦尔巴群岛和"
        },
        {
          "code": "sk",
          "name": "斯洛伐克"
        },
        {
          "code": "sl",
          "name": "塞拉利昂"
        },
        {
          "code": "sm",
          "name": "圣马力诺"
        },
        {
          "code": "sn",
          "name": "塞内加尔"
        },
        {
          "code": "so",
          "name": "索马里"
        },
        {
          "code": "sr",
          "name": "苏里南"
        },
        {
          "code": "ss",
          "name": "南苏丹"
        },
        {
          "code": "st",
          "name": "圣多美和普林西比"
        },
        {
          "code": "sv",
          "name": "萨尔瓦多"
        },
        {
          "code": "sy",
          "name": "叙利亚"
        },
        {
          "code": "sz",
          "name": "斯威士兰"
        },
        {
          "code": "tc",
          "name": "特克斯和凯科斯群岛"
        },
        {
          "code": "td",
          "name": "乍得"
        },
        {
          "code": "tg",
          "name": "多哥"
        },
        {
          "code": "th",
          "name": "泰国"
        },
        {
          "code": "tk",
          "name": "托克劳"
        },
        {
          "code": "tl",
          "name": "东帝汶"
        },
        {
          "code": "tn",
          "name": "突尼斯"
        },
        {
          "code": "to",
          "name": "汤加"
        },
        {
          "code": "tr",
          "name": "土耳其"
        },
        {
          "code": "tv",
          "name": "图瓦卢"
        },
        {
          "code": "tz",
          "name": "坦桑尼亚"
        },
        {
          "code": "ua",
          "name": "乌克兰"
        },
        {
          "code": "ug",
          "name": "乌干达"
        },
        {
          "code": "us",
          "name": "美国"
        },
        {
          "code": "uy",
          "name": "乌拉圭"
        },
        {
          "code": "va",
          "name": "梵蒂冈"
        },
        {
          "code": "ve",
          "name": "委内瑞拉"
        },
        {
          "code": "vg",
          "name": "英属维尔京群岛"
        },
        {
          "code": "vi",
          "name": "美属维尔京群岛"
        },
        {
          "code": "vn",
          "name": "越南"
        },
        {
          "code": "wf",
          "name": "瓦利斯和富图纳"
        },
        {
          "code": "ws",
          "name": "萨摩亚"
        },
        {
          "code": "ye",
          "name": "也门"
        },
        {
          "code": "yt",
          "name": "马约特"
        },
        {
          "code": "za",
          "name": "南非"
        },
        {
          "code": "zm",
          "name": "赞比亚"
        },
        {
          "code": "zw",
          "name": "津巴布韦"
        },
        {
          "code": "cn",
          "name": "中国"
        },
        {
          "code": "cg",
          "name": "刚果"
        },
        {
          "code": "mz",
          "name": "莫桑比克"
        },
        {
          "code": "gg",
          "name": "根西岛"
        },
        {
          "code": "gm",
          "name": "冈比亚"
        },
        {
          "code": "mp",
          "name": "北马里亚纳群岛"
        },
        {
          "code": "et",
          "name": "埃塞俄比亚"
        },
        {
          "code": "nc",
          "name": "新喀里多尼亚"
        },
        {
          "code": "vu",
          "name": "瓦努阿图"
        },
        {
          "code": "tf",
          "name": "法属南部领地"
        },
        {
          "code": "nu",
          "name": "纽埃"
        },
        {
          "code": "um",
          "name": "美国本土外小岛屿"
        },
        {
          "code": "ck",
          "name": "库克群岛"
        },
        {
          "code": "gb",
          "name": "英国"
        },
        {
          "code": "tt",
          "name": "特立尼达和多巴哥"
        },
        {
          "code": "vc",
          "name": "圣文森特和格林纳丁斯"
        },
        {
          "code": "tw",
          "name": "中国(台湾)"
        },
        {
          "code": "nz",
          "name": "新西兰"
        },
        {
          "code": "sa",
          "name": "沙特阿拉伯"
        },
        {
          "code": "la",
          "name": "老挝"
        },
        {
          "code": "kp",
          "name": "朝鲜"
        },
        {
          "code": "kr",
          "name": "韩国"
        },
        {
          "code": "pt",
          "name": "葡萄牙"
        },
        {
          "code": "kg",
          "name": "吉尔吉斯斯坦"
        },
        {
          "code": "kz",
          "name": "哈萨克斯坦"
        },
        {
          "code": "tj",
          "name": "塔吉克斯坦"
        },
        {
          "code": "tm",
          "name": "土库曼斯坦"
        },
        {
          "code": "uz",
          "name": "乌兹别克斯坦"
        },
        {
          "code": "kn",
          "name": "圣基茨和尼维斯"
        },
        {
          "code": "pm",
          "name": "圣皮埃尔和密克隆"
        },
        {
          "code": "sh",
          "name": "圣赫勒拿"
        },
        {
          "code": "lc",
          "name": "圣卢西亚"
        },
        {
          "code": "mu",
          "name": "毛里求斯"
        },
        {
          "code": "ci",
          "name": "科特迪瓦"
        },
        {
          "code": "ke",
          "name": "肯尼亚"
        },
        {
          "code": "mn",
          "name": "蒙古国"
        }
    ],    
}
