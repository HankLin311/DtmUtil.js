class DtmUtil {
    // 時間格式的斜線
    static #lineSlash = "/";

    // 時間格式的分號
    static #Semicolon = ":";

    // 取得時間物件
    static #GetDtm(temp) {
        const dateRegex1 = /^([0-9]{4})[./]([0-1]{1}[0-9]{1})[./]{1}([0-3]{1}[0-9]{1})$/; // 驗證: 2021/12/31
        const dateRegex2 = /^([0-9]{4})[.-]([0-1]{1}[0-9]{1})[.-]{1}([0-3]{1}[0-9]{1})$/; // 驗證: 2021-12-31

        const dtmRegex1 = /^([0-9]{4})[./]([0-1]{1}[0-9]{1})[./]{1}([0-3]{1}[0-9]{1})\s+(20|21|22|23|[0-1]\d):+([0-5]\d):+([0-5]\d)$/; // 驗證: 2021/12/31 23:59:59
        const dtmRegex2 = /^([0-9]{4})[.-]([0-1]{1}[0-9]{1})[.-]{1}([0-3]{1}[0-9]{1})\s+(20|21|22|23|[0-1]\d):+([0-5]\d):+([0-5]\d)$/; // 驗證: 2021-12-31 23:59:59

        const dtmOracleRegex1 = 
            /^([0-9]{4})[./]([0-1]{1}[0-9]{1})[./]{1}([0-3]{1}[0-9]{1})+[T]+(20|21|22|23|[0-1]\d):+([0-5]\d):+([0-5]\d)$/; // 驗證: 2021/12/31T23:59:59
        const dtmOracleRegex2 = 
            /^([0-9]{4})[.-]([0-1]{1}[0-9]{1})[.-]{1}([0-3]{1}[0-9]{1})+[T]+(20|21|22|23|[0-1]\d):+([0-5]\d):+([0-5]\d)$/; // 驗證: 2021-12-31T23:59:59

        let obj = null

        if (temp.match(dateRegex1) != null) {
            obj = temp.match(dateRegex1);
            obj[4] = "00";
            obj[5] = "00";
            obj[6] = "00";
        } else if (temp.match(dateRegex2) != null) {
            obj = temp.match(dateRegex2);
            obj[4] = "00";
            obj[5] = "00";
            obj[6] = "00";
        } else if (temp.match(dtmRegex1) != null) {
            obj = temp.match(dtmRegex1);
        } else if (temp.match(dtmRegex2) != null) {
            obj = temp.match(dtmRegex2);
        } else if (temp.match(dtmOracleRegex1) != null) {
            obj = temp.match(dtmOracleRegex1);
        } else if (temp.match(dtmOracleRegex2) != null) {
            obj = temp.match(dtmOracleRegex2);
        }

        if (obj != null && this.#IsExistDate(obj[1], obj[2], obj[3])) {
            return obj;
        }

        return null;
    }

    // 確認是否為有效日期
    static #IsExistDate(tempYear, tempMonth, tempDay) {
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

    // 取得 Dtm 字串
    static #GetDtmString(temp, format) {
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
                result = yyyy + this.#lineSlash + mm + this.#lineSlash + dd + " " + hh + this.#Semicolon + mi + this.#Semicolon + ss;
                break;
            case "d":
                result = yyyy + this.#lineSlash + mm + this.#lineSlash + dd;
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
            let objDate = this.#GetDtm(temp);
            return objDate == null ? null : new Date(objDate[1] + this.#lineSlash + objDate[2] + this.#lineSlash + objDate[3]);
        } else if (type == "object" && instance) {
            let strDate = this.#GetDtmString(temp, "d") + " 00:00:00";
            return !isNaN(temp) ? new Date(strDate) : null;
        }
        return null;
    }

    // 轉日期+時間的 Date 格式 (年月日時分秒)
    static ConvertToDtm(temp) {
        let type = typeof (temp);
        let instance = temp instanceof Date;

        if (type == "string") {
            let objDate = this.#GetDtm(temp);
            return objDate == null ? null : new Date(objDate[1] + this.#lineSlash + objDate[2] + this.#lineSlash + objDate[3] + " " + objDate[4] + this.#Semicolon + objDate[5] + this.#Semicolon + objDate[6]);
        } else if (type == "object" && instance) {
            return !isNaN(temp) ? temp : null;
        }
        return null;
    }

    // 轉日期字串 (年月日)
    static ConvertToDateString(temp) {
        let type = typeof (temp);
        let instance = temp instanceof Date;

        if (type == "string") {
            let objDate = this.#GetDtm(temp);
            return objDate == null ? null : objDate[1] + this.#lineSlash + objDate[2] + this.#lineSlash + objDate[3];
        } else if (type == "object" && instance) {
            return !isNaN(temp) ? this.#GetDtmString(temp, "d") : null;
        }
        return null;
    }

    // 轉日期+時間字串 (年月日時分秒)
    static ConvertToDtmString(temp) {
        let type = typeof (temp);
        let instance = temp instanceof Date;

        if (type == "string") {
            let objDate = this.#GetDtm(temp);
            return objDate == null ? null : objDate[1] + this.#lineSlash + objDate[2] + this.#lineSlash + objDate[3] + " " + objDate[4] + this.#Semicolon + objDate[5] + this.#Semicolon + objDate[6];
        } else if (type == "object" && instance) {
            return !isNaN(temp) ? this.#GetDtmString(temp, "dt") : null;
        }
        return null;
    }
}