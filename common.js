/**
 * Global 로딩 서비스 수행 Listner 등록
 * @author : X0114723
 */
var GL_LoadingService = true;	// Global loading service
var GL_AjaxStopListener = null;	// 모든 ajax 호출 완료 후 처리할 작업이 있는 경우, 필요한 페이지에서 정의하여 호출
$(function() {
	var _glLoadingService = new LoadingService({isGlobal:true});
	var _reqCount = 0;
	
	/**
	 * ajax 시작시 호출
	 */
	$(document).ajaxStart(function(event){
		_glLoadingService.show();
		console.log(">>> ajaxStart");
	});
	
	/**
	 * ajax 수행시 호출(각각의 ajax send시 호출됨)
	 */
	$(document).ajaxSend(function(event, xhr, options){
		_reqCount++;
		options.reqCount = _reqCount;
		options.sendTime = new Date();
		//console.log("[{0}] ajaxSending : {1}".format(options.reqCount, options.url.substring(options.url.lastIndexOf("/")+1)));
		
		xhr.setRequestHeader("AJAX", "true") ;	// jbsun : UserAuthInterceptor에서 ajax call 인지 판단하기 위해 필요
	});

	/**
	 * ajax 수행 완료시 호출(각각의 ajax 완료시 호출됨)
	 */
	$(document).ajaxComplete(function(event, xhr, options){
		var endTime = new Date();
		console.log("  [{0}] {1} ({2}ms)".format(options.reqCount,
				options.url.substring(options.url.lastIndexOf("/")+1),
				endTime.getTime()-options.sendTime.getTime()));
		//console.log("\processTime: {0}".format(endTime.getTime()-options.sendTime.getTime()));
		//console.log("\tprocess time : {0} ~ {1} ({2}ms)".format(options.sendTime.format("HH:mm:ss.zzz")
		//														, endTime.format("HH:mm:ss.zzz")
		//														, endTime.getTime()- options.sendTime.getTime()));
	});
	
	/**
	 * 모든 ajax 수행 완료시 호출
	 */
	$(document).ajaxStop(function(event){
		_glLoadingService.hide();
		
		// 모든 ajax 호출 완료 후 아래 이름으로 정의된 Listener가 있는 경우 호출
		if (GL_AjaxStopListener && typeof GL_AjaxStopListener === 'function') {
			var result = GL_AjaxStopListener(event);
			// 실행이 완료되면, ajax stop 이벤트로 인한 listener호출을 방지하기 위해 listener를 null처리한다.
			// result가 있으면 listner를 null 처리하지 않는다.
			if (!result) GL_AjaxStopListener = null;
			console.log("<<< ajaxStop : ##### Call listener. #####");
		} else {
			console.log("<<< ajaxStop");
		}
	});
	
	/**
	 * ajax error 발생시 호출.
	 */
	$(document).ajaxError(function(event, xhr, options){
		if ( xhr.status == "401" || xhr.status == "403" ) {	// jbsun : 세션이 만료됐을 경우 Interceptor에서 내려옴(401)
			window.parent.location = contextPath + '/index.jsp' ;
			return ;
		}
		
		var text = "" ;
		text += "[" + xhr.status + "] " + xhr.statusText ;
		text += "\n" + options.type + " : " + options.url ;
		text += "\n" + options.data ;
		
		console.log( text ) ;
	});
	
	/**
	 * DB 입력 길이 재 계산
	 * (MSSQL 입력시 줄바꿈 캐릭터의 길이계산 문제로 인한 maxlength 길이 재 계산)
	 * @author : X0114723
	 * @date : 2020-09-09
	 */
	$(document).ready(function(){
		// ##########################################################################
		// ### 줄바꿈 길이 계산시, textarea의 줄바꿈(\n)의 길이는 1로 인식, DB입력시 줄바꿈(\n\r)은 2로 인식
		// ### 모든 texterea의 줄바꿈의 갯수(라인수 - 1)만큼을 더해서 maxlength와 비교를 한다.
		// ##########################################################################
		$("textarea[maxlength]").each(function(index, item) {
			var maxLength = $(this).prop("maxlength");
			
			//var nameEl = $(this).closest("td").prev("th");// form에서 이름을 찾아낸다.
			//var name = nameEl.text().replace('*','').trim();
			//$(this).off("input").on("input", function() {
			$(this).on("input", function() {
				var lines = this.value.split('\n').length;
				
				if (!lines) lines = 0;
				else lines--;	// 줄바꿈의 수는 전체 라인수 - 1
				
				//console.log(this.value.length, lines, maxLength);
				if ( this.value.length + lines > maxLength ) {
					//this.value = this.value.substring(0, maxLength-lines);	// 방법1. 현재값을 자르는 경우
					this.value = this.oldValue || '';							// 방법2. 이전값을 복구하는 경우
				} else {
					this.oldValue = this.value;							// 방법2. 현재값 저장
				}
			});
		});
		// ##########################################################################
    });
});

/**
 * 문자열 왼쪽,오른쪽 공백을 제거.
 * @return {String} 공백제거된 문자열.
 */
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}

/**
 * 문자열의 왼쪽 공백을 제거.
 * @return {String} 공백제거된 문자열.
 */
String.prototype.ltrim = function() {
	return this.replace(/^\s+/,"");
}

/**
 * 문자열의 오른쪽 공백을 제거.
 * @return {String} 공백제거된 문자열.
 */
String.prototype.rtrim = function() {
	return this.replace(/\s+$/,"");
}

/**
 * 해당문자열에 특정문자의 포함 여부 반환.
 * @param {String} findStr 찾을문자.
 * @return {Boolean} 특정문자포함여부
 */
String.prototype.contains = function(findStr){
	return this.indexOf(findStr) >= 0;
}

/**
 * 해당문자열의 특정문자(findStr)를 특정문자(newStr)로 전체치환.
 * @param {Object} findStr 찾을문자
 * @param {Object} newStr 대체문자
 * @return {String} 치환된문자열
 */
String.prototype.replaceAll = function(findStr, newStr){
    return this.replace(new RegExp(findStr, "gi"), newStr);
}

/**
 * 해당문자열의 바이트 수를 반환.
 * @return {Number} 문자열의 바이트 수
 */
String.prototype.getBytes = function() {
	var size = 0;
	for(i=0; i<this.length; i++) {
		var temp = this.charAt(i);
		if(escape(temp) == '%0D') continue;
		if(escape(temp).indexOf("%u") != -1) {
			size += 2;
		}else {
			size++;
		}
	}
	return size;
}

/**
 * 포멧문자열에 값을 치환한다.
 * 문자열의 {0} 부분을 치환
 * ex > "Hello, {0}!".format("World")  --> "Hello, World"
 */
String.prototype.format = function() {
	var a = this;
	for (k in arguments) {
		a = a.replace("{" + k + "}", arguments[k])
	}
	return a
}

/**
 * Date formatting
 * @author: hwshim
 */
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|zzz|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "zzz": return d.getMilliseconds();
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};


/**
 * Common Class
 * 공통으로 사용될 기능들을 구현한 샘플 클래스.
 * 스트링 NULL 체크 / NameSpace / Import
 * 
 * @author: 김융규
 */
var Common = {	
	/**
	 * 컨텍스트 패스.
	 */
	contextPath : "",
	
	/**
	 *  Context root uri 를 반환한다.
	 */
	getContextPath : function() {
		// var hostIndex = location.href.indexOf( location.host ) + location.host.length;
		// return location.href.substring( hostIndex, location.href.indexOf('/', hostIndex + 1) );
		return  contextPath ;
	},
	
	/**
	 * 사용자 아이디.
	 */
	memberId : "",
	
	/**
	 * JSON 호출 결과 코드
	 */	
	JSON_CALL_RESULT_CODE : {
		SUCCESS : 1,
		FAIL : 0
	},
	
	/**
	 * 다이얼로그 타이틀
	 */		
	DIALOG_TITLE : {
		NOTICE : '알림',
		ALERT : '경고',
		INFO : '정보',
		CONFIRM : '확인'
	},

	/**
	 * 메세지
	 */		
	MESSAGE : { 
		BLOCK : '<h4>잠시만 기다려 주세요.</h4>'
	},	
	
	
	/**
	 * 스트링 널 체크.
	 * @param {String} str
	 */
	isEmpty : function(str){
		if(str == null) return true;
		return !(str.replace(/(^\s*)|(\s*$)/g, ""));
	},
	
	
	/**
	 * 숫자형 체크
	 * @param {String} str
	 */
	isNumber : function(str) {
		var number = str.match(/^\d+$/ig);
		if (number == null) {
			return false;
		} else { 
			return true;
		}
	},

	/**
	 * 네임스페이스 등록.
	 * @param {String} ns 네임스페이스
	 */
	registNamespace : function(ns){
	    var nsParts = ns.split(".");
	    var root = window;
	
	    for(var i=0; i<nsParts.length; i++){
	        if (typeof root[nsParts[i]] == "undefined") {
				root[nsParts[i]] = new Object();
			}
	        root = root[nsParts[i]];
	    }
	},
	
	importJS : function(jsFile){
		$.ajax({
				type: "GET",
				cache:false,
				url: "/js/" + jsFile,			
				async : false,
				dataType: "script"
			});
	},

	/**
	 * 팝업 윈도우 화면의 중간에 위치.
	 * @param {String} targetUrl	팝업 윈도우의 내용을 구성하기 위한 호출 URL
	 * @param {String} windowName	팝업 윈도우의 이름
	 * @param {Object} properties	팝업 윈도우의 속성(넓이, 높이, x/y좌표)
	 */	
	centerPopupWindow : function(targetUrl, windowName, properties) {
		var childWidth = properties.width;
		var childHeight = properties.height;
		var childTop = (screen.height - childHeight) / 2 - 50;    // 아래가 가리는 경향이 있어서 50을 줄임
		var childLeft = (screen.width - childWidth) / 2;
		var popupProps = "width=" + childWidth + ",height=" + childHeight + ", top=" + childTop + ", left=" + childLeft;
		if (properties.scrollBars == "YES") {
			popupProps += ", scrollbars=yes";
		}

		var popupWin = window.open(targetUrl, windowName, popupProps);
		popupWin.focus();
	},

	/**
	 * 업로드 하려는 파일의 이름 사이즈 체크.
	 * @param {String} uploadFileName 파일명
	 * @param {String} limitSize
	 */	
	checkUploadFileNameSize : function(uploadFileName, limitSize){
    	if(!Common.isEmpty(uploadFileName)){
    		var index = uploadFileName.lastIndexOf("\\");
    		if(index > -1){
    			uploadFileName = uploadFileName.substring(index+1);
    		}

	    	if(uploadFileName.getBytes() > limitSize){
				Common.alertDialog("알림", "파일 명이 너무 길어요.");
				return false;
	    	}

	    	return true;
    	}else{
			return false;
    	}
	},
	
	/**
	 * toString
	 */
	toString : function(){
		return "Common Object";
	},
	
	/**
	 * X,Y 좌표의 구글 맵 화면을 띄움.
	 * @param {integer} x GPS X 위치
	 * @param {integer} y GPS Y 위치
	 * @param {String} message 내용
	 */		
	viewMap : function(context, x, y, message){
	 	Common.centerPopupWindow(context+'/bbs/locationMap.do?x='+x+"&y="+y+"&message="+encodeURIComponent(message), 'mapPopup', {width : 500, height : 300});
		return false;
	},
	
	/**
	 * 두 날자 사이의 일수를 반환
	 * @param {String} fromDate 시작일자 (yyyy-mm-dd)
	 * @param {String} toDate 종료일자 (yyyy-mm-dd)
	 * @return {integer} 두 일자 사이의 일수
	 */ 
	intervalDate : function(fromDate, toDate){
       var FORMAT = "-";

       // FORMAT을 포함한 길이 체크
       if (fromDate.length != 10 || toDate.length != 10)
           return null;

       // FORMAT이 있는지 체크
       if (fromDate.indexOf(FORMAT) < 0 || toDate.indexOf(FORMAT) < 0)
           return null;

       // 년도, 월, 일로 분리
       var start_dt = fromDate.split(FORMAT);
       var end_dt = toDate.split(FORMAT);

       // 월 - 1(자바스크립트는 월이 0부터 시작하기 때문에...)
       // Number()를 이용하여 08, 09월을 10진수로 인식하게 함.
       start_dt[1] = (Number(start_dt[1]) - 1) + "";
       end_dt[1] = (Number(end_dt[1]) - 1) + "";

       var from_dt = new Date(start_dt[0], start_dt[1], start_dt[2]);
       var to_dt = new Date(end_dt[0], end_dt[1], end_dt[2]);

       return (to_dt.getTime() - from_dt.getTime()) / 1000 / 60 / 60 / 24;
	},
	/**
	 * 현재일이 남은기간 내에 있는지 체크
	 * @param {String|Date|Number}	dstDate	비교대상 날짜
	 * @param {String|Number}		amount	남은 [일|월|년] 수, default : 1
	 * @param {String}				type	기간 타입 [D|M|Y], default : M
	 */
	isWithinRemainingPeriod : function(dstDate, amount, type) {
		var remainDate = new Date();
		if (!amount || isNaN(amount)) amount = 1;
		
		if (!type || type === 'M') remainDate.setMonth(remainDate.getMonth() + parseInt(amount));
		else if (type === 'D') remainDate.setMonth(remainDate.getDate() + parseInt(amount));
		else if (type === 'Y') remainDate.setMonth(remainDate.getYear() + parseInt(amount));
		
		var remainDateInt = parseInt(remainDate.format("yyyyMMdd"));
		
		var dstDateInt = null;
		if (dstDate instanceof Date) dstDateInt = parseInt(dstDate.format("yyyyMMdd"));
		else if (typeof dstDate === 'number') dstDateInt = dstDate;
		else if (typeof dstDate === 'string') dstDateInt = parseInt(dstDate.replaceAll('-', ''));
		else return false;
		
		if (dstDateInt <= remainDateInt) return true;
		else return false;	
	},
	/**
	 * Alert 다이얼로그 띄움.
	 * @param {String} title 타이틀
	 * @param {String} msg 내용
	 */	
	alertDialog : function(title, msg, proc){
		var dialogTag = "<div id='jQueryDialog' title=\"" + title + "\">" + msg + "</div>";
		$(dialogTag).dialog({
			modal: true,
			buttons: {
				'확인': function(){
					if (proc != null) {
						eval(proc);
					}
					$(this).dialog('destroy').remove();
				}
			}
		});	
	},
   
	/**
	 * Alert 다이얼로그 띄운 후 정해진 작업을 완료한 후 팝업창을 닫는다.
	 * @param {String} msg 내용
	 * @param {String} procArray 작업 목록 배열
	 */	
	alertProcDialog : function(msg, procArray){
		var dialogTag = "<div id='jQueryDialog' title=\""+Common.DIALOG_TITLE.NOTICE+"\">" + msg + "</div>";
		$(dialogTag).dialog({
			modal: true,
			buttons: {
				'확인': function(){
					$(this).dialog('destroy').remove();
					for(var i=0; i<procArray.length; i++){
						eval(procArray[i]);
					}
				}
			}
		});	
	},

	/**
	 * Alert 다이얼로그 띄운 후 취소, 확인 버튼을 출력 후 확인 버튼을 클릭할 경우에는 proc를 실행한다.
	 * @param {String} msg 내용
	 * @param {String} proc 작업
	 */	
	choiceDialog : function(msg, proc){
		var dialogTag = "<div id='jQueryDialog' title=\""+Common.DIALOG_TITLE.CONFIRM+"\">" + msg + "</div>";
		$(dialogTag).dialog({
			modal: true,
			buttons: {
				'확인': function(){
					eval(proc);
					$(this).dialog('destroy').remove();
				},
				'취소': function(){					
					$(this).dialog('destroy').remove();
				}
			}
		});
		return false;	
	},
	
	/**
	 * 다이얼로그 닫기
	 */
	removeDialog : function() {
		$('#jQueryDialog').dialog('destroy').remove();
	},
	
	/**
	 * 전화번호 형식으로 변환.
	 * @param {Object} object : Form Element
	 * @return {String} : 전화번호형식 문자열(-포함)
	 */	
	makeTelTxt : function(object){
		var mdn = object.val();
		var telText1 = mdn.substring(0,3);
		var telText2 = mdn.substring(3,7);
		var telText3 = mdn.substring(7,11);

		return telText1+"-"+ telText2+"-"+telText3;	
	},
	
	/**
	 * @Deprecated
	 */
	checkObj : function checkObj(o,n) {
		if (o.val().length == 0) {
			o.addClass('ui-state-error');
			Common.alertDialog(Common.DIALOG_TITLE.NOTICE, "<br/><br/> "+ n +" 입력해주세요.",o.val(''));
			return false;
		} else {
			return true;
		}
	},
	
	/**
	 * String값이 null 이 아닌 'null'이거나 undefined 인경우 Empty('') 문자로 변경
	 * @param {String} findStr 찾을문자.
	 * @return {Boolean} 특정문자포함여부
	 */
	ifNull : function( str, replaceStr ) {
		if (replaceStr == undefined) 
			replaceStr = '' ;
		return (str == undefined || str == 'null')?replaceStr:str ;
	},
	
	/**
	 * 배열 혹은 문자열에서 해당 value가 포함되어 있는지 여부.
	 * @param {String||Array} container : 배열 혹은 문자열.
	 * @param {Object} value : 찾을 값.
	 * @return {Boolean} 값 포함 여부
	 */
	includes : function(container, value) {
		var returnValue = false;
		var pos = container.indexOf(value);
		if (pos >= 0) {
			returnValue = true;
		}
		return returnValue;
	},
	/**
	 * 현재 날짜를 지정 형식으로 변환
	 * @param {String} format : 날짜 포맷.
	 * @return {String} 변환된 현재 날짜 문자열.
	 */
	currentDateStr : function(format) {
		if (!format) format = 'yyyy-MM-dd';
		return new Date().format(format);
	},
	
	/**
	 * yyyymmdd --> yyyy-mm-dd 형식으로 변환
	 * @param {String} dateStr : 날짜 문자열 'yyyymmdd'
	 * @return {String} 변환된 날짜 문자열 'yyyy-mm-dd'
	 */
	convertDateFormat : function(dateStr) {
		if (dateStr && dateStr.length==8) {
			return dateStr.substr(0, 4) + '-' + dateStr.substr(4, 2) + '-' + dateStr.substr(6, 2) ;
		} else {
			return '' ;
		}
	},
	
	/**
	 * 스트링 널 체크 결과 리턴
	 * @param {String} str
	 */
	isEmptyBool : function(str){
		 if(typeof str == "undefined" || str == null || str == "" || str == "null")
		        return true;
		    else
		        return false ;
	},	
	
	/**
	 * 스트링 널인경우 빈공백 리턴
	 * @param {String} str
	 */
	nvl : function(str){
		if(typeof str == "undefined" || str == null || str == "null")
	        str = "" ;
	    return str ;
	},
	
	/**
	 * 문자열이 yyyymmdd 형태를 yyyy-mm-dd 형태로 변경
	 * @param startDate           : yyyymmdd 문자열
	 */
	changeDashDate : function(convDate){
		if(convDate == null || convDate == "" || typeof convDate == "undefined" || convDate == "null") {
			return convDate;
		}
		var dateStr = convDate.replace(/[^0-9]/g,"");
		if (dateStr.length < 8) return convDate;

		var year = dateStr.substring(0, 4);
		var month = dateStr.substring(4, 6);
		var day = dateStr.substring(6, 8);
		
		return  year + '-' + month + '-' + day;
	},
	/**
	 * 이미지 리사이징
	 */
	Resizing : function(img, vWidth, vHeigh){ 
	    if(vWidth != ""){
	        img.width = vWidth;
	    }

	    if(vHeigh != "") {
	        img.height= vHeigh;
	    }
	},
	
	  
	/**
	 * 시, 분 SelectBox 세팅 
	 */
	
	setHourMinBox : function(hid, mid) {
		var i;
		var hour = '';
		var min = '';
		
		var selectText = "";
		var d = new Date();
		var hh = d.getHours();
		var mm = d.getMinutes();
		
		var hObj = $("[id='"+hid+"']");
		var mObj = $("[id='"+mid+"']");
		
		hObj.empty();
		mObj.empty();
		
		// 시 SelectBox 
		for(i=0; i<24; i++) {
		   selectText = "";
		   if((Math.ceil(i)) == hh ) {
			   selectText = " selected ";
		   }
		   
		  if((Math.ceil(i)) < 10 ) {
		  	hour = '0'+(Math.floor(i));
		  }else{
		   		hour = (Math.floor(i));
		  }
		  
		  hObj.append('<option value="'+ hour +'" ' + selectText + ' >' + hour + '</option>');  
		}    			  

		// 분 SelectBox
		for(i=0; i<60; i++) {
		   selectText = "";  
		   if( (Math.ceil(i)) == mm ) {
			   selectText = " selected ";
		   }
			   
		  if((Math.ceil(i)) < 10 ) {
		  	min = '0'+(Math.floor(i));
		  }else{
		   	min = (Math.floor(i));
		  }
		  
		  mObj.append('<option value="'+ min +'" ' + selectText + ' >' + min + '</option>');
		}    		
	},
	
	/**
	 * 시(0~23), 분(0,30) SelectBox 세팅 
	 */
	
	setHourMin30Box : function(hid, mid) {
		var i;
		var hour = '';
		var min = '';
		
		var selectText = "";
		var d = new Date();
		var hh = d.getHours();
		var mm = d.getMinutes();
		
		var hObj = $("[id='"+hid+"']");
		var mObj = $("[id='"+mid+"']");
		
		hObj.empty();
		mObj.empty();
		
		// 시 SelectBox   
		for(i=0; i<24; i++) {
		   selectText = "";
		   if((Math.ceil(i)) == hh ) {
			   selectText = " selected ";
		   }			
			
		  if((Math.ceil(i)) < 10 ) {
		  		hour = '0'+(Math.floor(i));
		  }else{
		   		hour = (Math.floor(i));
		  }
		  
		  hObj.append('<option value="'+ hour +'" ' + selectText + ' >' + hour + '</option>');  
		}    			  

		// 분 SelectBox
		for(i=0; i<60; i+=30) {
		   selectText = "";  
		   if( ((Math.ceil(i)) <= mm) && (mm <= (Math.ceil(i+30))) ) {
			   selectText = " selected ";
		   }
		   
		  if((Math.ceil(i)) < 10 ) {
		  	min = '0'+(Math.floor(i));
		  }else{
		   	min = (Math.floor(i));
		  }
		  
		  mObj.append('<option value="'+ min +'" ' + selectText + ' >' + min + '</option>');
		}    		
	},
	
	/**
	 * 시(0~23), 분(0,10,20,30,40,50) SelectBox 세팅 
	 */
	
	setHourMin10Box : function(hid, mid) {
		var i;
		var hour = '';
		var min = '';
		
		var selectText = "";
		var d = new Date();
		var hh = d.getHours();
		var mm = d.getMinutes();	

		var hObj = $("[id='"+hid+"']");
		var mObj = $("[id='"+mid+"']");
		
		hObj.empty();
		mObj.empty();
		
		// 시 SelectBox   
		for(i=0; i<24; i++) {
		   selectText = "";
		   if((Math.ceil(i)) == hh ) {
			   selectText = " selected ";
		   }
			
		  if((Math.ceil(i)) < 10 ) {
		  		hour = '0'+(Math.floor(i));
		  }else{
		   		hour = (Math.floor(i));
		  }
		  

		  hObj.append('<option value="'+ hour +'" ' + selectText + ' >' + hour + '</option>');  
		}    			  

		// 분 SelectBox
		for(i=0; i<60; i+=10) {
		   selectText = "";  
		   if( ((Math.ceil(i)) <= mm) && (mm <= (Math.ceil(i+10))) ) {
			   selectText = " selected ";
		   }
			   
		  if((Math.ceil(i)) < 10 ) {
		  	min = '0'+(Math.floor(i));
		  }else{
		   	min = (Math.floor(i));
		  }

		  mObj.append('<option value="'+ min +'" ' + selectText + ' >' + min + '</option>');
		}    		
	},
	/**
	 * 용량 단위별 표시
	 * @param {Number} bytes : 파일 용량.
	 * @return {String} 용량에 따라, KB, MB, GB, TB 등으로 변환(,포함)
	 */
	bytesToSize : function(bytes) {
		var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		if (bytes == 0) return '0 Byte';
		var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		var s = Math.round(bytes / Math.pow(1024, i), 2);
		var localeStr = s.toLocaleString(undefined, {maximumFractionDigitis:2});
		return localeStr + ' ' + sizes[i];
	},
	/**
	 * 국가코드가 중국계열의 나라인지 체크
	 * @param {String} nationIid	- 국가코드
	 * @return {Boolean}			- 중국계열여부
	 */
	isChineseLine : function(nationId) {
		if (nationId == "1" || nationId == "9" || nationId == "27" || nationId == "31" ) {
			return true;
		} else {
			return false;
		}
	},
	/**
	 * Url queryString을 json 객체로 반환
	 * @param {String} str	- query string
	 * @return {Object} 	- json object
	 */
	queryStringToJson : function(str) {
		if (str.indexOf('?') > -1) str = str.split('?')[1];
		return Common.propStringToJson(str, ',');
	},
	/**
	 * properties를 담고 있는 string으로부터 json 객체로 반환(EX, window popup properties)
	 * @param {String} str	- properties string
	 * @return {Object} 	- json object
	 */
	propStringToJson : function(str, delim) {
		if (!delim) delim = ',';
		var pairs = str.split(delim);
		var props = {};
		pairs.forEach(function(pair) {
			pair = pair.split('=');
			props[pair[0]] = pair[1] || '';
		});
		return props;
	},
	/**
	 * 랜덤으로 키 생성 
	 * @param {Number} length	- 생성할 키 길이
	 */
	randomKey : function(length) {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	},
	/**
	 * Brower 기본 팝업
	 * @param {String} url : 팝업 주소.
	 * @param {Number} width : 팝업 가로 크기.
	 * @param {Number} height : 팝업 세로 크기.
	 * @param {String} scrollbars : 팝업 창 스크롤 여부.
	 * @param {String} resizable : 팝업 창 사이즈 변경 여부.
	 */
	openWindow : function(url,width,height,scrollbars,resizable){
		var s_width = screen.width;
		var s_height = screen.height;
	    width = (width==null)?600:width;
	    height = (height==null)?800:height;
	    var left = (s_width - width)/2;
	    var top = (s_height - height)/2;
	    scrollbars = (scrollbars==null)?"yes":scrollbars;
	    resizable = (resizable==null)?"yes":resizable;
	    
	    ErpOpenWindow = window.open(url,'','left='+left+',top='+top+',width='+width+',height='+height+',toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars='+scrollbars+',resizable='+resizable+'');
	    ErpOpenWindow.resizeTo(width, height) ;
	    
	    if (resizable === "no") {
	    	var browserInfo = Common.detectBrowser();
	    	
	    	if (browserInfo.isChrome) {
			    $(ErpOpenWindow).resize(function(e) {
			    	e.stopPropagation();
			    	e.preventDefault();
			    	ErpOpenWindow.resizeTo(width, height) ;
		  		});
	    	}
	    }
	},
	/**
	 * 현재 브라우저 버전 체크
	 */
	detectBrowser : function() {
		// Opera 8.0+
		var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

		// Firefox 1.0+
		var isFirefox = typeof InstallTrigger !== 'undefined';

		// Safari 3.0+ "[object HTMLElementConstructor]" 
		var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

		// Internet Explorer 6-11
		var isIE = /*@cc_on!@*/false || !!document.documentMode;

		// Edge 20+
		var isEdge = !isIE && !!window.StyleMedia;

		// Chrome 1 - 79
		var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

		// Edge (based on chromium) detection
		var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

		// Blink engine detection
		var isBlink = (isChrome || isOpera) && !!window.CSS;
		
		return {
			isFirefox		: isFirefox,
			isChrome		: isChrome,
			isSafari		: isSafari,
			isOpera			: isOpera,
			isIE			: isIE,
			isEdge			: isEdge,
			isEdgeChromium	: isEdgeChromium,
			isBlink			: isBlink
		};
	},
	/**
	 * Tooltip
	 * @param {Object} obj		- element object
	 * @param {Boolean} isShow	- 툴팁 여부
	 */
	tooltip : function(obj, isShow) {
		var ttId = 'tooltipDiv';
		var ttObj = $("#"+ttId);
			
		if (!ttObj || ttObj.length == 0) {
			ttObj = $('<div id="'+ttId+'" class="tooltip"></div>');
			$("body").append(ttObj);
		}
		
		if (isShow) {
			var h = 15;
			//var ph = $(obj).parent().outerHeight();
			//var h = $(obj).height();
			//h = h + parseInt((ph-h)/2);
			
			var os = $(obj).offset();
			ttObj.text($(obj).text()).css("top", os.top+h).css("left", os.left).show();
		} else {
			ttObj.text('').hide();
		}
	},
	/**
	 * 말줄임 표시
	 * @param {String} text	- 내용
	 * @return {String}		- 말줄임 및 Tooltip 표시를 위한 html
	 */
	ellipsis : function(text) {
		return '<div class="text-ellipsis" onmouseover="Common.tooltip(this, true);" onmouseout="Common.tooltip(this, false);"><p>'+text+'</p></div>';
		//return '<div class="text-ellipsis"><p title="'+text+'">'+text+'</p></div>'; 
	},
	/**
	 * 상위부서를 포함한 부서 표시
	 * @param {Object or String} obj	- 부서 Object 또는 상위부서명
	 * @param {String} deptNm			- 부서명
	 * @return {String}					- 상위부서를 포함한 부서명
	 */
	viewDeptNmUp : function(obj, deptNm) {
		if (typeof obj === 'object') Common._nmUp(obj.upDeptDispNm, obj.deptDispNm);
		else return Common._nmUp(obj, deptNm);
	},
	/**
	 * 상위부서및 ID를 포함한 부서명 표시
	 * @param {Object or String} obj	- 부서 Object 또는 상위부서명
	 * @param {String} deptNm			- 부서명
	 * @param {String} deptId			- 부서 ID
	 * @return {String}					- 상위부서를 포함한 부서명
	 */
	viewDeptIdNmUp : function(obj, deptNm, deptId) {
		if (typeof obj === 'object') return Common._idNmUp(obj.upDeptDispNm, obj.deptDispNm, obj.deptId);
		else return Common._idNmUp(obj, deptNm, deptId);
	},
	/**
	 * 구성원 ID를 포함한 구성원명 : "empDispNm(empId)"
	 * @param {Object or String} obj	- 구성원 Object 또는 구성원명
	 * @param {String} empId			- 구성원 ID
	 * @return {String}					- 구성원 ID를 포함한 구성원명
	 */
	viewEmpIdNm : function(obj, empId) {
		if (typeof obj === 'object') return Common._idNm(obj.empDispNm, obj.empId);
		else return Common._idNm(obj, empId);
	},
	/**
	 * 부서 ID를 포함한 부서명 : "deptDispNm(deptId)"
	 * @param {Object or String} obj	- 부서 Object 또는 부서명
	 * @param {String} deptId			- 부서 ID
	 * @return {String}					- 부서 ID를 포함한 부서명
	 */
	viewDeptIdNm : function(obj, deptId) {
		if (typeof obj === 'object') return Common._idNm(obj.deptDispNm, obj.deptId);
		else return Common._idNm(obj, deptId);
	},
	/**
	 * 소속(상위)계약업체를 포함한 업체명 표시
	 * @param {Object or String} obj	- 업체 Object 또는 소속(상위)계약업체명
	 * @param {String} partnerNm		- 업체명
	 * @return {String}					- 소속(상위)계약업체를 포함한 업체명
	 */
	viewPartnerNmUp : function(obj, partnerNm) {
		if (typeof obj === 'object') return Common._nmUp(obj.upPartnerNm, obj.partnerNm);
		else return Common._nmUp(obj, partnerNm);
	},
	/**
	 * 방문객 ID를 포함한 방문객명 : "visitorNm(visitorId)"
	 * @param {Object or String} obj	- 방문객 Object 또는 방문객명
	 * @param {String} visitorId		- 방문객 ID
	 * @return {String}					- 방문객 ID를 포함한 방문객명
	 */
	viewVisitorIdNm : function(obj, visitorId) {
		if (typeof obj === 'object') return Common._idNm(obj.visitorNm, obj.visitorId);
		else return Common._idNm(obj, visitorId);
	},
	/**
	 * 업체 ID를 포함한 업체명 : "partnerNm(partnerId)"
	 * @param {Object or String} obj	- 업체 Object 또는 업체명
	 * @param {String} partnerId		- 업체 ID
	 * @return {String}					- 업체 ID를 포함한 업체명
	 */
	viewPartnerIdNm : function(obj, partnerId) {
		if (typeof obj === 'object') return Common._idNm(obj.partnerNm, obj.partnerId);
		else return Common._idNm(obj, partnerId);
	},
	/**
	 * 업체 ID 및 계약업체를 를 포함한 업체명 : "upPartnerNm partnerNm(partnerId)"
	 * @param {Object or String} obj	- 업체 Object 또는 계약업체명
	 * @param {String} partnerNm		- 업체명
	 * @param {String} partnerId		- 업체 ID
	 * @return {String}					- 업체 ID를 포함한 업체명
	 */
	viewPartnerIdNmUp : function(obj, partnerNm, partnerId) {
		if (typeof obj === 'object') return Common._idNmUp(obj.upPartnerNm, obj.partnerNm, obj.partnerId)
		else return Common._idNmUp(obj, partnerNm, partnerId)
	},
	_idNmUp : function(upNm, nm, id) {
		var sep = ' ';
		upNm = upNm ? upNm + sep : '';
		return upNm + Common._idNm(nm, id);
	},
	_idNm : function(nm, id) {
		var viewNm = '';
		nm = nm ? nm : '';
		id = id ? id : '';
		
		if (nm) viewNm = nm;
		if (id) viewNm +=  '(' + id + ')';
		
		return viewNm;
	},
	_nmUp : function(upNm, nm) {
		var sep = ' ';
		upNm = upNm ? upNm + sep : '';
		nm = nm ? nm : '';
		return upNm + nm;
	}
};

/**
 * WebError 정의
 * json response의 resultCode 값
 * @author: jbsun
 */
var WebError = {
	OK					: "1000",
	INVALID_PARAMETER	: "2000",
	NO_DATA				: "2001",
	UNAUTHORIZED		: "2002",
	DUP_CAR_NO          : "2003",
	DUP_DATA         	: "2006",
	COMMON_INTERNAL		: "3000",
	DB_OPERATION		: "3001",
	FILE_OPERATION		: "3002",
	COMMON_EXTERNAL		: "4000",
	UNKNOWN				: "9000"
}

/**
 * Ajax 호출시 로딩 진행 상황 표시 하기 위한 서비스
 * @param {Object} options : 로딩 서비스 옵션 
 * options {
 * 		isGlobal : global 서비스 사용여부,
 * 		imgSrc : 로딩 서비스 이미지 경로(loadingType=2 에서만 적용),
 * 		imgWidth : 로딩서비스 이미지 가로 크기(loadingType=2 에서만 적용),
 * 		imgHeight : 로딩서비스 이미지 세로 크기(loadingType=2 에서만 적용),
 * }
 * @author : X0114723
 */
var LoadingService = function(options) {
	this.enable = true;	// 서비스 enable 여부
	
	this.imgWidth = 50;	// loading이미지 기본 넓이
	this.imgHeight = 50;// loading이미지 기본 높이
	this.imgSrc = "http://i.stack.imgur.com/FhHRx.gif";	// loading이미지 기본 경로
	this.loadingType = 1;
	
	this.disableScroll = false;	// 로딩하는 동안 scroll을 막을 것인지 여부
	this.prevOverflowX = "";
	this.prevOverflowY = "";
	
	/**
	 * 로딩 서비스 초기화
	 * @param {Object} options : 초기화 옵션 
	 * @return
	 */
	this._init = function(options) {
		if (!options) options = {};
		if (options.hasOwnProperty('isGlobal')) { this.isGlobal = options.isGlobal; }
		else { this.isGlobal = false; GL_LoadingService = false; }
		
		 
		// 전역 로딩 서비스를 사용하지 않고 별도로 사용할 경우, 전역 로딩 서비스를 disable 시킨다.
		//if (GL_LoadingService) { GL_LoadingService.enable = false; }
		if (options.isGlobal && !GL_LoadingService) return;
		
		/*$(window).scroll(function() {
			sessionStorage.scrollTop = $(this).scrollTop();
		});*/
		// 스크롤 할 때마다 window의 scrollTop 값을 변경시킨다.(Internet Explorer에서 발생하는 문제임)
		
		if (this.loadingType == 2) {
			$(window).off('scroll').on('scroll', function (e) {
			    sessionStorage.scrollTop = $(window).scrollTop();
			});
			
		};
		// loading image의 경로, 넓이, 높이
		this.imgSrc = options.imgSrc || this.imgSrc;
		this.imgWidth = options.imgWidth || this.imgWidth;
		this.imgHeight = options.imgHeight || this.imgHeight;
	};
	/**
	 * 로딩 서비스 Show
	 */
	this.show = function() {
		if (!this.enable) return;
		if (this.isGlobal && !GL_LoadingService) return;
		
		if (this.loadingType == 1) { this._set(); }
		else if (this.loadingType == 2) { this._set2(); }
		
		if (this.disableScroll) {
			this.prevOverflowX = $("body").css("overflow-x");	// body의 이전 속성 저장
			this.prevOverflowY = $("body").css("overflow-y");	// body의 이전 속성 저장
			$("body").css("overflow-y", "hidden");				//  scroll disable
			$("body").css("overflow-x", "hidden");				//  scroll disable
		}
		
		$("#modalLoading").show();
		
	};
	/**
	 * 로딩 서비스 Hide
	 */
	this.hide = function() {
		if (!this.enable) return;
		if (this.isGlobal && !GL_LoadingService) return;
		
		$("#modalLoading").hide();
		
		if (this.disableScroll) {
			$("body").css("overflow-y", this.prevOverflowY);	// scroll 이전값으로 되돌림
			$("body").css("overflow-x", this.prevOverflowX);	// scroll 이전값으로 되돌림
		}
		//$("body").css("overflow", "");				// scroll enable
	};
	
	/**
	 * 로딩 서비스 타입 1
	 * @param {Object} options : 초기화 옵션 
	 * @return
	 */
	this._set = function() {
		var modalDiv = $("#modalLoading");
		
		if (!modalDiv || modalDiv.length == 0) {
			var	modalHtml
				= '  <div class="dialog_loading">'
				+ '    <div class="loading-container">'
				+ '      <div class="loading"></div>'
				+ '      <div class="loading-text">loading</div>'
				+ '    </div>'
				+ '  </div>'
				+ '  <div class="af-dialog-mask Dialog-mask" style="opacity: 0.5; overflow: hidden; display: block; z-index: 1999; position: fixed; left: 0px; top: 0px; width: 100%; height: 100%;"></div>';
			
			modalDiv = $('<div id="modalLoading" style="display:none;"></div>');
			modalDiv.append(modalHtml);
			modalDiv.appendTo("body");
		}
	};
	
	/**
	 * 로딩 서비스 타입2
	 */
	this._set2 = function() {
		var doc = document.documentElement;
		
		/**
		 * session storage에 저장된 값을 현재 scrollTop에 저장한다.
		 * 스크롤이 된 상태에서도 loading image를 가운데에 위치시키기 위함(Internet Explorer에서 발생하는 문제임)
		 */
		//if (sessionStorage.scrollTop != "undefined") {
	    	$(window).scrollTop(sessionStorage.scrollTop);
		//}
		
		var offsetLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
		var offsetTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
		var scrollHeight = document.documentElement.scrollHeight;	// 스크롤을 포함한 document의 높이
		var clientHeight = document.documentElement.clientHeight;	// document의 높이
		var clientWidth = document.documentElement.clientWidth;		// document의 넓이
		var imgPosTop = clientHeight/2 + offsetTop - this.imgHeight/2;	// loading image Top 위치
		var imgPosLeft = clientWidth/2 - this.imgWidth/2;
		var imgStyle = " style='width:{0}px;height:{0}px;'".format(this.imgWidth, this.imgHeight);
		
		/*
		console.log("imgPosTop: " , imgPosTop, clientHeight);
		console.log("Scroll Postion(Left/Top) : ", offsetLeft, offsetTop);
		console.log("Self PageX/YOffset : ", self.pageXOffset, self.pageYOffset);
		console.log("Window InnerW/H : ", window.innerWidth, window.innerHeight)
		console.log("Window PageX/YOffset: ", window.pageXOffset, window.pageYOffset);
		console.log("====================================================");
		console.log("Body/DocEl ScrollTop : ", document.body.scrollTop, document.documentElement.scrollTop);
		console.log("Body/DocEl ClientTop : ", document.body.clientTop, document.documentElement.clientTop);
		console.log("Body/DocEl ScrollLeft : ", document.body.scrollLeft, document.documentElement.scrollLeft);
		console.log("Body/DocEl OffsetTop : ", document.body.offsetTop, document.documentElement.offsetTop);
		console.log("Body/DocEl OffsetLeft : ", document.body.offsetLeft, document.documentElement.offsetLeft);
		console.log("Body/DocEl ScrollWidth : ", document.body.scrollWidth, document.documentElement.scrollWidth);
		console.log("Body/DocEl ScrollHeight : ", document.body.scrollHeight, document.documentElement.scrollHeight);
		console.log("Body/DocEl OffsetWidth : ", document.body.offsetWidth, document.documentElement.offsetWidth);
		console.log("Body/DocEl OffsetHeight : ", document.body.offsetHeight, document.documentElement.offsetHeight);
		console.log("Body/DocEl ClientWidth : ", document.body.clientWidth, document.documentElement.clientWidth);
		console.log("Body/DocEl ClientHeight : ", document.body.clientHeight, document.documentElement.clientHeight);
		*/
		
		var modalDiv = $("#modalLoading");
		if (!modalDiv || modalDiv.length == 0) {
			modalDiv = $("<div id='modalLoading' style='position:absolute;top:0;left:0;z-index:9999;width:100%;height:"+scrollHeight+"px;background: rgba( 255, 255, 255, .8 );display:none;text-align:center;'></div>");
			modalDiv.append("<div id='modalLoadingImg' style='position:absolute;top:"+imgPosTop+"px;left:"+imgPosLeft+"px;'><img src='"+this.imgSrc+"' "+imgStyle+"></div>");
			modalDiv.appendTo("body");
		} else {
			modalDiv.css("height", scrollHeight+"px");
			$("#modalLoadingImg").css("top", imgPosTop+"px");
		}
	};
	
	this._init(options);
}
