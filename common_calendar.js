/**
 * Datepicker readonly 설정
 * @param {Boolean} makeReadonly	- readonly 여부
 */
$.fn.readonlyDatepicker = function (makeReadonly) {
    $(this).each(function(){
    	var thisObj = $(this);
    	//find corresponding hidden field
        var name = $(this).attr('name');
        var $hidden = thisObj.next();
        var hiddenName = $hidden.prop('name');
        //var $hidden = $('input[name="' + name + '"][type="hidden"]');

        //if it doesn't exist, create it
        if (!hiddenName || hiddenName != name){
            $hidden = $('<input type="hidden" name="' + name + '"/>');
            $hidden.insertAfter(thisObj);
        }

        if (makeReadonly){
        	$hidden.val(thisObj.val());
        	thisObj.unbind('change.readonly');
        	thisObj.attr('disabled', true);
        	thisObj.css("background", "#f2f2f2");
        	thisObj.css("cursor", "default");
        }
        else{
        	//thisObj.bind('change.readonly', function(){
        	//	$hidden.val($(this).val());
            //});
        	$hidden.remove();
            thisObj.attr('disabled', false);
            thisObj.css("background", "");
            thisObj.css("cursor", "");
        }
    });
};

/**
 * CommonCalendar 서비스 정의
 * (jQuery datepicker활용)
 * @author: X0114723
 */
var CommonCalendar = {
	/**
	 * Calendar 초기화
	 * @param {Object} options	- 초기화 옵션(자세한 옵션은 아래 initOptions 참조)
	 */
	init : function(options) {
		var lang = LANG;	// from global const variable
		if (!options) options = {};
		if (options.hasOwnProperty("lang")) lang = options["lang"];
		/** 초기 옵션 값 */
		var initOptions = {
    		dateFormat: 'yy-mm-dd' //Input Display Format 변경
			,showOtherMonths: true //빈 공간에 현재월의 앞뒤월의 날짜를 표시
			,showMonthAfterYear:true //년도 먼저 나오고, 뒤에 월 표시
			,changeYear: true //콤보박스에서 년 선택 가능
			,changeMonth: true //콤보박스에서 월 선택 가능
			,showButtonPanel: true // 하단 버튼 표시
			//,showWeek : true		// 주 표시 여부
			//,weekHeader : "W"		// 주 표시명
			,firstDay: 1	// 0:Sunday, 1:Monday
			
			//,showOn: "both" //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시  
			//,buttonImage: "http://jqueryui.com/resources/demos/datepicker/images/calendar.gif" //버튼 이미지 경로
			//,buttonImage: "/statics/images/form.png" //버튼 이미지 경로
			//,buttonImageOnly: true //기본 버튼의 회색 부분을 없애고, 이미지만 보이게 함
			//,buttonText: "선택" //버튼에 마우스 갖다 댔을 때 표시되는 텍스트                
			//,yearSuffix: "년" //달력의 년도 부분 뒤에 붙는 텍스트
			//,monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'] //달력의 월 부분 텍스트
			//,monthNames: ['1월','2월','-3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 Tooltip 텍스트
			//,dayNamesMin: ['일','월','화','수','목','금','토'] //달력의 요일 부분 텍스트
			//,dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'] //달력의 요일 부분 Tooltip 텍스트
			//,minDate: "-1M" //최소 선택일자(-1D:하루전, -1M:한달전, -1Y:일년전)
			//,maxDate: "+1M" //최대 선택일자(+1D:하루후, -1M:한달후, -1Y:일년후)
		};
		var regionOptions = {};	// i18n에 의한 설정값
		var lastOptions = {};	// 사용자 정의 옵션과 Merge된 최종 옵션값
		
		/** 해당 언어별 i18n 파일 참조 */
		if (lang === 'ko') regionOptions = $.datepicker.regional[ 'ko' ];
		else if (lang === 'en') regionOptions = $.datepicker.regional[ '' ];
		else if (lang === 'zh') regionOptions = $.datepicker.regional[ 'zh-CN' ];
		else regionOptions = $.datepicker.regional[ 'zh-CN' ];
		
		// 우선순위 options > initOptions > regionOptions
		$.extend(lastOptions, regionOptions, initOptions, options);
		$.datepicker.setDefaults(lastOptions);
		
		this.inited = true;
	},
	/**
	 * 날짜 범위 DatePicker
	 * @param {String} from				- 시작 Form Element Id
	 * @param {String} to				- 종료 Form Element Id
	 * @param {Date||String} fromDate	- 시작일
	 * @param {Date||String} toDate		- 종료일
	 * @param {Object} options			- datepicker 옵션(initOptions 참조)
	 * @param {Number} limitDays		- 종료일은 시작일+limitDays을 초과할 수 없다
	 */
	rangePicker : function(from, to, fromDate, toDate, options, limitDays) {
		if (!this.inited) this.init();
		var fromPicker = $("#"+from);
		var toPicker = $("#"+to);
		
		var fromOptions = {
			//numberOfMonths: 2,
			onSelect : function(selected) {
				toPicker.datepicker("option", "minDate", selected);
				
				if (limitDays && $.isNumeric(limitDays)) {
					var limitDate = new Date(selected);
					limitDate.setDate(limitDate.getDate()+limitDays);
					if (limitDays) toPicker.datepicker("option", "maxDate", limitDate);
				}
				if (Common.detectBrowser().isChrome) fromPicker.focus();	// 날짜 선택후 focus를 유지하고 있어야지만, enter키를 누를 경우 검색이 가능하다.
			}
		};
		var toOptions = {
        	//numberOfMonths: 2,
        	onSelect: function(selected) {
        		// 시작날짜를 고정할 경우
        		if (options && !options.fixFrom) fromPicker.datepicker("option", "maxDate", selected);
        		
        		/*
        		if (limitDay && jquery.isNumeric(limitDays)) {
					var limitDate = new Date(selected);
					limitDate.setDate(limitDate.getDate()-limitDays);
					if (limitDay) toPicker.datepicker("option", "min", limitDate);
				}
				*/
        		if (Common.detectBrowser().isChrome) toPicker.focus();	// 날짜 선택후 focus를 유지하고 있어야지만, enter키를 누를 경우 검색이 가능하다.
        	}
        };
		
		if (options) {
			$.extend(fromOptions, options);
			$.extend(toOptions, options);
		};
		
		// 최초 datepicker 설정
		fromPicker.datepicker(fromOptions);
		toPicker.datepicker(toOptions);
		// 최초 datepicker 설정외에 같은 calendar를 재 호출할 경우에는 기존 설정값을 reset
		CommonCalendar._resetDate(fromPicker, options);
		CommonCalendar._resetDate(toPicker, options);
		
		if (fromDate) fromPicker.datepicker("setDate", fromDate);
		if (toDate) toPicker.datepicker("setDate", toDate);
		//if (options.hasOwnProperty('maxDate')) fromPicker.datepicker("option", "maxDate", null);
		
		// 종료일의 최소값은 시작일로 설정
		var _frDate = fromPicker.datepicker("getDate");
		//var _toDate = to.datepicker("getDate");
		
		// 최대 maxDate값 설정
		if (limitDays && $.isNumeric(limitDays)) {
			var limitDate = new Date(_frDate);
			limitDate.setDate(limitDate.getDate()+limitDays);
			if (limitDays) toPicker.datepicker("option", "maxDate", limitDate);
		} 
		
		// 시작날짜를 고정하는 경우
		if (options && options.fixFrom) {
			var nFromDate = CommonCalendar._calDate(_frDate, options.fixFromAmount);
			var nToDate = CommonCalendar._calDate(_frDate, options.fixToAmount);
			fromPicker.datepicker("option", "showOn", null);	// 달력 클릭 방지(disable)
			//fromPicker.datepicker("option", "minDate", nFromDate);
			//fromPicker.datepicker("option", "maxDate", nFromDate);
			fromPicker.datepicker("setDate", nFromDate);
			toPicker.datepicker("setDate", nToDate);
			toPicker.datepicker("option", "minDate", nFromDate);
		} else {
			fromPicker.datepicker("option", "showOn", "focus");	// focus/button/both, default: focus,
			toPicker.datepicker("option", "minDate", _frDate);
		}
		
		this.setButtonEvent(fromPicker);
		this.setButtonEvent(toPicker);
	},
	/**
	 * 해당 datepicker reset
	 * @param {Object} picker	- datepicker
	 * @param {Object} options	- 초기화에 사용될 options
	 */
	_resetDate : function(picker, options) {
		if (options && Object.keys(options).length > 0) picker.datepicker( "option", options);
	},
	/**
	 * 날짜 계산
	 * (지정날짜로부터 지정일수 만큼 가감)
	 * @param {Object} date		- 지정 날짜
	 * @param {Number} amount	- 가감할 일수
	 * @return {Object}			- 계산된 날짜
	 */
	_calDate : function(date, amount) {
		amount = amount || 0;
		
		var nDate = new Date(date);
		nDate.setDate(date.getDate() + amount);
		return nDate;
	},
	/**
	 * 기본 DatePicker
	 * @param {String} id				- Form Element Id
	 * @param {Date||String} date		- 지정일
	 * @param {Object} options			- datepicker 옵션(initOptions 참조)
	 */
	picker : function(id, date, options) {
		if (!this.inited) this.init();
		var picker = $("#"+id);
		// ------ bug : 옵션을 지정한후, datepicker를 한번더 호출해야된다.
		options.onSelect = function(dateText, inst) {
			if (Common.detectBrowser().isChrome) picker.focus();
		}
		picker.datepicker(options);
		
		/*picker.datepicker({
			showWeek: true,
	        onSelect: function(dateText, inst) {
	           	console.log(dateText);
		       	console.log($.datepicker.iso8601Week(new Date(dateText)))
		       	$(this).val("'Week Number '" + $.datepicker.iso8601Week(new Date(dateText)));
		       	picker.focus();
	        }
		});*/
		
		if (date) picker.datepicker("setDate", date);
		else picker.datepicker();
		this.setButtonEvent(picker);
	},
	/**
	 * 분기별 선택 DatePicker (monthPicker를 활용)
	 * @param {String} id				- Form Element Id
	 * @param {Date||String} date		- 지정일
	 * @param {Object} options			- datepicker 옵션(initOptions 참조)
	 */
	quarterPicker : function(id, date, options) {
		var lastOptions = {};
		lastOptions = $.extend(lastOptions, options, {monthNames: ['1/4', '2/4', '3/4', '4/4']} )
		this.monthPicker(id, date, lastOptions)
	},
	/**
	 * 월별 선택 DatePicker
	 * @param {String} id				- Form Element Id
	 * @param {Date||String} date		- 지정일
	 * @param {Object} options			- datepicker 옵션(initOptions 참조)
	 */
	monthPicker : function(id, date, options) {
		if (!this.inited) this.init();
		var picker = $("#"+id);
		
		var year = null;
		var month = null;
		if (date) {
			var dArr = date.split("-");
			if (dArr.length == 2) {
				year = dArr[0];
				month = dArr[1];
			} else if (dArr.length == 1) {
				year = dArr[0];
			}
		}
		
		var lastOptions = {
			// month/year format
			pattern: 'yyyy-mm',
			selectedMonth: month,
			//selectedMonthName: '',
			selectedYear: year,
			//startYear: year - 10,
			//finalYear: year + 10,

			// localization
			//monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			//monthNames: ['1/4', '2/4', '3/4', '4/4'],
			//id: id,

			// display the month/year picker when focused
			//openOnFocus: true,

			// an array of disabled months
			//disabledMonths: []
		};
		//var year = 2020;
		
		$.extend(lastOptions, options);
		
		//picker.datepicker();
		picker.monthpicker(lastOptions);
		if (date) picker.datepicker("setDate", date);
		
		this.setButtonEvent(picker);
	},
	/**
	 * 월별 선택 DatePicker 타입2
	 * @param {String} id				- Form Element Id
	 * @param {Date||String} date		- 지정일
	 * @param {Object} options			- datepicker 옵션(initOptions 참조)
	 */
	monthPicker2 : function(id, date, options) {
		if (!this.inited) this.init();
		var picker = $("#"+id);
		
		var lastOptions = {};
		$.extend(lastOptions, options, {
			dateFormat : "yy-mm",
			changeMonth: true,
			changeYear:true,
			//beforeShow: function(input, inst) {},
			afterShow : function(dateText, inst) {
				if (options.isQuarter) {
					var keepMonths = [];
					for (i = -1; i < 12; i += 3) {
						keepMonths.push(i);
						//console.log(i);
					}
					$(".ui-datepicker-month option").each(function() {
						if ($.inArray(parseInt(this.value), keepMonths) < 0) {
							$(this).remove();
						}
					});
				}
				$(".ui-datepicker-calendar").css("display", "none");
			},
			/*onClose: function(dateText, inst) {
	        	console.log(dateText);
	        	$(this).val("" + $.datepicker.iso8601Week(new Date(dateText)));
	        },*/
	        onChangeMonthYear: function(y, m) {
	        	$(this).val(y+"-"+(m>9?m:"0"+m));
	        	//var q = parseInt((m-1)/3) + 1;
	        	//$(this).val(y+"-"+q);
	        }
		});
		
		//picker.datepicker();
		picker.datepicker(lastOptions);
		if (date) picker.datepicker("setDate", date);

		this._updatePicker();
		this.setButtonEvent(picker);
	},
	/**
	 * 주 선택 DatePicker
	 * @param {String} id				- Form Element Id
	 * @param {Date||String} date		- 지정일
	 * @param {Object} options			- datepicker 옵션(initOptions 참조)
	 */
	weekPicker : function(id, date, options) {
		if (!this.inited) this.init();
		var picker = $("#"+id);
		
		var lastOptions = {
			// set start day of the week
			  firstDay: 1,	// 0:Sunday, 1:Monday

			  // custom date format
			  dateFormat: "yy-mm-dd",

			  // shows other months
			  showOtherMonths: true,

			  // allows to select other months
			  selectOtherMonths: true,

			  // shows the current week number
			  showWeek: true,

			  // supported keywords:
			  //  w  = week number, eg. 3
			  //  ww = zero-padded week number, e.g. 03
			  //  o  = short (week) year number, e.g. 18
			  //  oo = long (week) year number, e.g. 2018
			  weekFormat: "oo-ww",
			  selectWeekBackground : "#00afff"	// 추가한 옵션 : 마우스오버시 배경 색상, 없으면 datepicker의 기본 background색상이 지정됨
		};
		$.extend(lastOptions, options);
		picker.weekpicker(lastOptions);
		var dispPicker = $("#"+picker.attr("id")+"_weekpicker");
		if (date) picker.datepicker("setDate", date);
		dispPicker.attr("placeholder", picker.attr("placeholder"));
		this.setButtonEvent($("#"+picker.attr("id")+"_weekpicker"));
	},
	/**
	 * 월별 선택 DatePicker 타입2에서 해당 picker맞게 구성하기 위해 picker 업데이트 필요
	 */
	_updatePicker : function() {
		$.datepicker._updateDatepicker_original = $.datepicker._updateDatepicker;
		$.datepicker._updateDatepicker = function(inst) {
			$.datepicker._updateDatepicker_original(inst);
			var afterShow = this._get(inst, 'afterShow');
			if (afterShow) {
				afterShow.apply((inst.input ? inst.input[0] : null)); // trigger custom callback
				//console.log(inst.input[0]);
			}
		}
	},
	/**
	 * 선택된 달력의 날짜 갑을 가져온다.
	 * @param {String} id	- Form Element Id
	 * @return {Object} 	- 해당 picker에 설정된 날짜값
	 */
	getDate : function(id) {
		var picker = $("#"+id);
		return picker.datepicker("getDate");
	},
	/**
	 * 선택된 달력의 날짜 갑을 주어진 포맷형태의 string 값으로 가져온다.
	 * @param {String} id		- Form Element Id
	 * @param {String} format	- 날짜 포맷
	 * @return {String} 		- 해당 picker에 설정된 날짜값
	 */
	getDateString : function(id, format) {
		var date = this.getDate(id);
		if (!date) return null;
		if (!format) format = "yy-mm-dd";
		return $.datepicker.formatDate(format, date);
	},
	/**
	 * 주어진 날짜(datepicker 타입)타입을 Date 형식의 날짜로 반환 (ex : +1D --> 하루추가된 날짜를 반환 등)
	 * @param {Object} date	- datepicker 형식의 날짜
	 * @return {Object} 	- Date의 형식의 날짜
	 */
	toDate : function(date) {
		var id = "_DUMMY_DATE_";
		var picker = $("#"+id);
		if (picker.length == 0) picker = $("<input id='"+id+"' type='hidden'>");
		picker.datepicker();
		if (!date) date = new Date();
		picker.datepicker("setDate", date);
		return picker.datepicker('getDate')
	},
	/**
	 * 현재 날짜에 지정한 일만큼 더한 날짜를 반환
	 * @param {Number} amount	- 가감할 일 수
	 */
	addDay : function(amount) {
		var d = new Date();
	    var year = d.getFullYear();
	    var month = d.getMonth();
	    var day = d.getDate();
	    
	    return new Date(year, month, day + amount); 
	},
	/**
	 * 현재 날짜에 지정한 월만큼 더한 날짜를 반환
	 * @param {Number} amount			- 가감할 월 수
	 * @param {Boolean} todayInclude	- 현재일을 포함할것인지 말것인지 여부
	 */
	addMonth : function(amount, todayInclude) {
		var d = new Date();
	    var year = d.getFullYear();
	    var month = d.getMonth();
	    var day = d.getDate();
	    
	    var term = -1;
	    if (!todayInclude) term = 0; 
	    return new Date(year, month + amount, day + term); 
	},
	/**
	 * 현재 날짜에 지정한 년만큼 더한 날짜를 반환
	 * @param {Number} amount			- 가감할 년 수
	 * @param {Boolean} todayInclude	- 현재일을 포함할것인지 말것인지 여부
	 */
	addYear : function(amount, todayInclude) {
		var d = new Date();
	    var year = d.getFullYear();
	    var month = d.getMonth();
	    var day = d.getDate();
	    
	    var term = -1;
	    if (!todayInclude) term = 0; 
	    return new Date(year + amount, month, day + term); 
	},
	/**
	 * datepicker 형식의 날짜를 주어진 날짜 포맷으로 반환
	 * @param {Object} date		- datepicker 형식의 날짜
	 * @param {String} format	- 날짜 포맷
	 * @return {String} 		- 지정포맷으로 변환된 날짜
	 */
	toDateString : function(date, format) {
		var dObj = this.toDate(date);
		if (!format) format = "yy-mm-dd";
		return $.datepicker.formatDate(format, dObj);
	},
	/**
	 * !!! 중요
	 * 우측 버튼을 클릭했을 경우 달력이 오픈되어지도록 설정
	 * 디자인이 변경되었을 경우
	 * @param {Object} picker	- 달력Icon을 활성화시킬 datepicker  
	 */
	setButtonEvent : function(picker) {
		picker.parent().find(".Calendar").bind("click", function() {
			picker.focus();
		});
//		$(".Calendar").unbind("click");
//		$(".Calendar").bind("click", function() {
//			$(this).parent().find("input")[0].focus();
//			//$(this).parent().find("input")[0].trigger("click");
//		});
	}
}
