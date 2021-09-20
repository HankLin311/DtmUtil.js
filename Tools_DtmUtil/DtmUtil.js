class DtmUtil {
    // 私有=> 取得時間物件
    static _getDtmInfo(temp) {
        const dateRegex = /^([0-9]{4})[./]([0-1]{1}[0-9]{1})[./]{1}([0-3]{1}[0-9]{1})$/;
        const dtmRegex = /^([0-9]{4})[./]([0-1]{1}[0-9]{1})[./]{1}([0-3]{1}[0-9]{1})\s+(20|21|22|23|[0-1]\d):+([0-5]\d):+([0-5]\d)$/;
        const dtmOracleRegex = /^([0-9]{4})[./]([0-1]{1}[0-9]{1})[./]{1}([0-3]{1}[0-9]{1})+[T]+(20|21|22|23|[0-1]\d):+([0-5]\d):+([0-5]\d)$/;

        let obj = null

        if (temp.match(dateRegex) != null) {
            obj = temp.match(dateRegex);
            obj[4] = "00";
            obj[5] = "00";
            obj[6] = "00";
        } else if (temp.match(dtmRegex) != null) {
            obj = temp.match(dtmRegex);
        } else if (temp.match(dtmOracleRegex) != null) {
            obj = temp.match(dtmOracleRegex);
        }

        if (obj != null && this._isExistDate(obj[1], obj[2], obj[3])) {
            return obj;
        }

        return null;
    }

    // 私有=> 確認是否為有效日期(其餘驗證內容，在正則表達式中)
    static _isExistDate(tempYear, tempMonth, tempDay) {
        const limitInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const isLeap = new Date(tempYear, 1, 29).getDate() === 29;
        const thisMonth = parseInt(tempMonth);
        const thisDay = parseInt(tempDay);

        // 判斷是否為閏年
        if (isLeap) {
            limitInMonth[2] = 29;
        }

        // 判斷月份是否超過12月
        if (thisMonth > 12) {
            return false;
        }

        return thisDay <= limitInMonth[thisMonth];
    }

    // 私有=> 取得 Dtm 字串
    static _getDtmString(temp, format) {
        let yyyy = temp.getFullYear();
        let mm = temp.getMonth() + 1;
        mm = mm < 10 ? "0" + mm : mm;
        let dd = temp.getDate();
        dd = dd < 10 ? "0" + dd : dd;
        let hh = temp.getHours();
        hh = hh < 10 ? "0" + hh : hh;
        let mi = temp.getMinutes();
        mi = mi < 10 ? "0" + mi : mi;
        let ss = temp.getSeconds();
        ss = ss < 10 ? "0" + ss : ss;

        let result = null;
        switch (format) {
            case "dt":
                result = yyyy + "/" + mm + "/" + dd + " " + hh + ":" + mi + ":" + ss;
                break;
            case "d":
                result = yyyy + "/" + mm + "/" + dd;
                break;
            default:
                break;
        }

        return result;
    }

    // 轉日期的 Date 格式 (年月日)
    static ConvertToDate(temp) {
        let type = typeof (temp);
        let instance = temp instanceof Date;

        if (type == "string") {
            let objDate = this._getDtmInfo(temp);
            return objDate == null ? null : new Date(objDate[1] + "/" + objDate[2] + "/" + objDate[3]);
        } else if (type == "object" && instance) {
            let strDate = this._getDtmString(temp, "d") + " 00:00:00";
            return !isNaN(temp) ? new Date(strDate) : null;
        }
        return null;
    }

    // 轉日期字串 (年月日)
    static ConvertToDateString(temp) {
        let type = typeof (temp);
        let instance = temp instanceof Date;

        if (type == "string") {
            let objDate = this._getDtmInfo(temp);
            return objDate == null ? null : objDate[1] + "/" + objDate[2] + "/" + objDate[3];
        } else if (type == "object" && instance) {
            if (isNaN(temp)) {
                return null;
            }
            return this._getDtmString(temp, "d");
        }
        return null;
    }

    // 轉日期+時間的 Date 格式 (年月日時分秒)
    static ConvertToDtm(temp) {
        let type = typeof (temp);
        let instance = temp instanceof Date;

        if (type == "string") {
            let objDate = this._getDtmInfo(temp);
            return objDate == null ? null : new Date(objDate[1] + "/" + objDate[2] + "/" + objDate[3] + " " + objDate[4] + ":" + objDate[5] + ":" + objDate[6]);
        } else if (type == "object" && instance) {
            return !isNaN(temp) ? temp : null;
        }
        return null;
    }

    // 轉日期+時間字串 (年月日時分秒)
    static ConvertToDtmString(temp) {
        let type = typeof (temp);
        let instance = temp instanceof Date;

        if (type == "string") {
            let objDate = this._getDtmInfo(temp);
            return objDate == null ? null : objDate[1] + "/" + objDate[2] + "/" + objDate[3] + " " + objDate[4] + ":" + objDate[5] + ":" + objDate[6];
        } else if (type == "object" && instance) {
            if (isNaN(temp)) {
                return null;
            }
            return this._getDtmString(temp, "dt");
        }
        return null;
    }


}