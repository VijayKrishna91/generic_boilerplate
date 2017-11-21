const date = require("date.js");

let Tools = (function () { 

    return {
        getValidationErrMsg : function(err){
            var errMsg= {};
            Object.keys(err).forEach(function(key){
                errMsg[key]=err[key]['message'];
            });
            return errMsg;
        },

        format : function(...p) {
            let s = arguments[0];
            for (let i = 0; i < arguments.length - 1; i++) {
                let reg = new RegExp("\\{" + i + "\\}", "gm");
                s = s.replace(reg, arguments[i + 1]);
            }

            return s;
        },

        getNotificationRepeatString : function (mins, hour, days) {
            let offSetTime = 5;
            let decrementHour = false;
            let decrementDay = false;

            let repeats = ["*","*","*","*","*"];
            if(mins != null){
                if (mins > offSetTime) {
                    repeats[0] = mins - offSetTime;
                } else {
                    repeats[0] = 60 - offSetTime + mins;
                    decrementHour = true;
                }
            }if(hour != null){
                if (!decrementHour){
                    repeats[1] = hour;
                } else {
                    if (hour > 1) {
                        repeats[1] = hour - 1;
                    } else {
                        repeats[1] = 23 - hour;
                        decrementDay = true;
                    }

                    decrementHour = false;
                }
            }if(days.length != 0){
                if (!decrementDay) {
                    repeats[4] = days.join(",");
                } else {
                    let editedDays = [];
                    for (let day of days) {
                        if (day > 0) {
                            editedDays.push(day - 1);
                        } else {
                            editedDays.push(7 - day);
                        }
                    }
                    repeats[4] = editedDays.join(",");
                    decrementDay = false;
                }
            }
            return repeats.join(" ");
        },
        
        getAgendaRepeatString : function (mins, hour, days) {
            let repeats = ["*","*","*","*","*"];
            if(mins != null){
                repeats[0]=mins;
            }if(hour != null){
                repeats[1]=hour;
            }if(days.length != 0){
                repeats[4]=days.join(",")
            }
            return repeats.join(" ");
        },

        getReminderTimeStrings : function (timestamp) {
            let reminderTimeStrings;
            let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

            let switchTimeStamp = timestamp;
            let swithTime = new Date(switchTimeStamp);
            let switchDay = days[swithTime.getDay()];
            let switchTimeString = `${switchDay} at ${swithTime.getHours()}:${swithTime.getMinutes()}`;

            let notificationTimeStamp = timestamp - 5*60*1000;
            let notificationTime = new Date(notificationTimeStamp);
            let notificationDay = days[notificationTime.getDay()];
            let notificationTimeString = `${notificationDay} at ${notificationTime.getHours()}:${notificationTime.getMinutes()}`;

            reminderTimeStrings = {
                switchTimeString : switchTimeString,
                notificationTimeString : notificationTimeString
            }
            return reminderTimeStrings;
        },

        getTimeWithOffset : function (hour, mins) {
            let time = hour + ":" + mins;
            time = new Date(date(time).getTime() - 5*60*1000);
            time = time.getHours()+ ":"+ time.getMinutes();

            return time;
        },
        
        extend: function(oldObj,newObj){
            console.log(typeof newObj);
            if(!newObj || typeof newObj!=='object'){
                return;
            }
            // let keys = newObj.keys;
            // let i = keys.length;
            // console.log(oldObj);
            // console.log(newObj);
            
            for(let key in newObj){
                if(newObj.hasOwnProperty(key)){
                    oldObj[key] = newObj[key];
                }
            }
        },
        simpleClone: function(obj) {
            if (null == obj || "object" != typeof obj) return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        },
        // USED FOR DECODEING TOKEN RECIEVED FROM GOOGLE OAUTH
        decodeJwt: function (token) {
            var segments = token.split('.');

            if (segments.length !== 3) {
            throw new Error('Not enough or too many segments');
            }

            // All segment should be base64
            var headerSeg = segments[0];
            var payloadSeg = segments[1];
            var signatureSeg = segments[2];

            // base64 decode and parse JSON
            var header = JSON.parse(base64urlDecode(headerSeg));
            var payload = JSON.parse(base64urlDecode(payloadSeg));

            return {
                header: header,
                payload: payload,
                signature: signatureSeg
            }

        },
        randomID: function(len) {
            var char;
            var arr = [];
            var len = len || 5;
        
            do {
                char = ~~(Math.random() * 128);
        
                if((
                    (char > 47 && char < 58) ||  // 0-9
                    (char > 64 && char < 91) || // A-Z
                    (char > 96 && char < 123)  // a-z
        
                    // || (char > 32 && char < 48) // !"#$%&,()*+'-./
                    // || (char > 59 && char < 65) // <=>?@
                    // || (char > 90 && char < 97) // [\]^_`
                    // || (char > 123 && char < 127) // {|}~
                ) 
                    //security conscious removals: " ' \ ` 
                    //&& (char != 34 && char != 39 && char != 92 && char != 96) 
        
                ) { arr.push( String.fromCharCode(char)) }
        
            } while( arr.length < len);
        
            return arr.join('')
        }
    }
})();

module.exports = Tools;

function base64urlDecode(str) {
  return new Buffer(base64urlUnescape(str), 'base64').toString();
};

function base64urlUnescape(str) {
  str += Array(5 - str.length % 4).join('=');
  return str.replace(/\-/g, '+').replace(/_/g, '/');
}
