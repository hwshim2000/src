/**
 * Element 입력 이벤트 필터 서비스
 * @author X0114723
 */
jQuery.fn.extend({
	/**
	 * 입력 필터
	 * @param {Object} options	- 필터 옵션
	 * options : {
	 * 		filter	- 필터명
	 * 		minLen	- 입력 최소 길이(default : 0)
	 * 		maxLen	- 입력 최대 길이(default : none)
	 * }
	 */
	valid : function(options) {
		Filters._initFilters(this, options);
		
		var thisObj = this;
		var filters = this._filters;
		if (!filters) return;
		
		// Element가 삭제될경우 valid check 아이템에서 제거하기 위해
		this.one("remove", function() {
			for (var i = 0; i < Filters._currElements.length; i++) {
				var el = Filters._currElements[i];
				if (el == thisObj) {
					el.prop("removed", true);
					Filters._currElements = $.grep(Filters._currElements, function(value) {
						return value != thisObj;
					});
					//console.log(thisObj.prop("id"), "removed.")
					break;
				}
			}
		});
		
		if (filters.options.filter === "file") {
			// filter가 file인 경우 _fileFilter를 사용한다.
			this._fileFilter(function(value, type) {
				if (type === "change") {	// 파일 선택시 발생하는 이벤트
					
					if (!thisObj.enableValueFilter()) return true;
					if (!filters.valueFilter) return true;
					if (!filters.valueFilter.test(value)) {	// 파일명에 의한 확장자 패턴 체크
						Filters._fileValidStyle(thisObj, false);
						thisObj.focus();
						alert(Filters.toLocaleMessage(Filters.file.typeError));
						
						return false;
					} else {
						if (filters.options.varType && filters.options.varType != 'file') {
							if (!Filters._fileValidate(thisObj, value)) {
								Filters._fileValidStyle(thisObj, false);
								return false;
							}
						}
					}
					
					Filters._fileValidStyle(thisObj, true);
					return true;
				}
			});
		} else {
			
//			if (filters.options.filter === 'checkbox' || filters.options.filter === 'radio' || filters.options.filter === 'select') {
//				return;
//			}
			// 이외의 모든 필터는 blur & input 필터를 사용한다.
			this._blurInputFilter(function(value, type) {
				if (type === "blur") {	// blur는 모든 입력이 끝났을때 발생
					if (!value && !filters.options.required) return true; 	// 값이 없고 필수가 아닌경우 체크하지 않는다.
					if (!thisObj.enableValueFilter()) return true;			// value filter가 disable이면 체크하지 않는다.
					if (!filters.valueFilter) return true;					// value filter가 없으면 체크하지 않는다.
					if (!filters.valueFilter.test(value)) {	// 입력값에 대한 지정 패턴 필터 체크
						thisObj.focus();
						if (filters.message) alert(filters.message);
						return false;
					} else if (filters.options.varType === 'date') {		// 날짜 필터인 경우에 실제 날짜값인지 한번 더 체크
						if (!Filters._dateValidate(thisObj, value)) return false;
					} else if (filters.options.varType === 'range') {		// 값의 범위를 체크하는 경우, 범위내 존재하는지 체크
						if (!Filters._rangeValidate(thisObj, value)) return false;
					} else if (filters.options.filter === 'person_id') {
						if (!Filters._personIdBirthValidate(thisObj, value)) return false;
					}
					
					// 불필요한 입력값을 제거하도록 숫자를 한번 더 변환 (ex: +.5 -> 0.5, 000123->123, 1. -> 1)
					if (filters.options.varType === 'number' || filters.options.varType === 'range') {
						thisObj.val(Number(value));
					}
					// checkbox, radio, select form element check
					//if (!Filters._selectOrCheckTypeValidate(thisObj, value)) return false;
					
					thisObj._convertPhoneNo(filters.options.filter);	// 전화번호 형태 변환
					
					return true;
				} else if (type === "input") {	//input은 입력길이와 숫자입력등에 사용
					if (!value) return true;						// 값이 없는 경우에는 체크하지 않는다.
					if (!thisObj.enableLengthFilter()) return true;	// length filter가 disable이면 체크하지 않는다.
				
					if (filters.lengthFilter) {						// 길이 체크 필터가 있으면 체크한다.
						if (!filters.lengthFilter.test(value)) return false;
					}
					if (filters.options.maxLen) {					// 입력길이 제한 옵션이 있으면 체크한다.
						if(value.length > filters.options.maxLen) return false;
					}
					if (filters.options.varType === 'range') {		// 범위값인 경우에 최대값 최소값 체크
						if ($.isNumeric(filters.options.minVal) && $.isNumeric(value)) {
							if (parseInt(value) < filters.options.minVal) return false;
						}
						if ($.isNumeric(filters.options.maxVal) && $.isNumeric(value)) {
							if (parseInt(value) > filters.options.maxVal) return false;
						}
					}
					return true;
				}
			});
		}
	},
	/**
	 * element의 value filter 사용여부 설정
	 * @param {Boolean} enable	- 사용여부
	 */
	enableValueFilter : function(enable) {
		if (enable === undefined) {
			var is = this.prop("isValueFilter");
			if (is == null || is === undefined) return true;
			else if (typeof is === "boolean") return is;
			else if (is === "enable" || is === "true") return true;
			else return false;
		} else {
			this.prop("isValueFilter", enable);
		}
	},
	/**
	 * element의 length filter 사용여부 설정
	 * @param {Boolean} enable	- 사용여부
	 */
	enableLengthFilter : function(enable) {
		if (enable === undefined) {
			var is = this.prop("isLengthFilter");
			if (is == null || is === undefined) return true;
			else if (typeof is === "boolean") return is;
			else if (is === "enable" || is === "true") return true;
			else return false;
		} else {
			this.prop("isLengthFilter", enable);
		}
	},
	/**
	 * 숫자만 입력 필터
	 * @param {Number} maxLen	- 숫자 입력 자리 수 
	 */
	numberFilter : function(maxLen) {
		var filter = null;
		if (maxLen) filter = new RegExp("^\\d{0,"+maxLen+"}$");
		else filter = /^\d*$/;
		this._inputFilter(function(value) {
			return filter.test(value);
			//return /^\d*$/.test(value);
		});
	},
	/**
	 * 입력 길이 제한 필터
	 * @param {Number} maxLen	- 입력 길이
	 */
	lengthFilter : function(maxLen) {
		var filter = new RegExp("^.{0,"+maxLen+"}$");
		this._inputFilter(function(value) {
			return filter.test(value);
		});
	},
	readonly : function(isReadonly, values) {
		this._readonly(this, isReadonly, values);
	},
	_readonly : function(elObj, isReadonly, values) {
//		if (typeof Filters !== "undefined") {
//			elObj = Filters._findElement(elObj.prop("uuid"));
//			Filters._resetStyle(elObj);
//		}
		
		var type = elObj.prop("type");
		if (!values) values = [];
		else if (!$.isArray(values)) values = [values];
		
		var isContains = true;
		
		elObj.each(function() {
			var el = $(this);
			
			if (typeof Filters !== "undefined") {
				Filters._resetStyle(Filters._findElement(el.prop("uuid")));
			}
			
			if (values.length == 0 || values.indexOf(el.val()) > -1) isContains = isReadonly;
			else isContains = !isReadonly;
			
			if (isContains) {
				el.prop("readonly", true);
				el.addClass("nondisable");
				el.on("click", function(e) { e.preventDefault(); el.blur();});
			} else {
				el.removeClass("nondisable");
				el.removeProp("readonly");
				el.off("click");
			}
			
			if (!type || type === "text" || type === "password" || type === 'textarea') {
				if (isContains) el.addClass("nondisable");
				else el.removeClass("nondisable");
			} else if (type === "radio") {
				if (isContains) {
					if (el.prop("checked")) el.next(".jqformRadio").addClass("readonly");
					el.next().next('label').css('color','#cccccc');
				} else {
					el.next(".jqformRadio").removeClass("readonly");
					el.next().next('label').css('color','');
				}
			} else if (type === "checkbox") {
				if (isContains) {
					if (el.prop("checked")) el.next(".jqformCheckbox").addClass("readonly");
					el.next().next('label').css('color','#cccccc');
				} else {
					el.next(".jqformCheckbox").removeClass("readonly");
					el.next().next('label').css('color','');
				}
			} else if (type.indexOf("select") == 0){
				if (isContains) {
					el.parent().addClass("nondisable");
					//$("option", el).not(":selected").prop("disabled", true);
					$("option", el).not(":selected").hide();
				} else {
					el.parent().removeClass("nondisable");
					//$("option", el).not(":selected").removeProp("disabled");
					$("option", el).not(":selected").show();
				}
			} else if (type === "file") {
				if (isContains) {
					if (el.is(":hidden")) {
						$("input[name=dispFileName]", el.closest("td")).addClass("nondisable");
						$("button", el.closest("td")).addClass("nondisable");
						$(".photo>.image", el.closest("td")).css("background", "#F2F2F2");
					} else {
						el.addClass("nondisable");
					}
				} else {
					if (el.is(":hidden")) {
						$("input[name=dispFileName]", el.closest("td")).removeClass("nondisable");
						$("button", el.closest("td")).removeClass("nondisable");
						$(".photo>.image", el.closest("td")).css("background", "#FFFFFF");
					} else {
						el.removeClass("nondisable");
					}
				}
			}
		});
	},
	/**
	 * 입력폼들을 enable 시킨다.
	 */
	enable : function() {
		this._enable(this);
	},
	enableAll : function() {
		$.each(this, function(index) {
			$(this).enable();
		});
	},
	_enable : function(elObj) {
//		if (typeof Filters !== "undefined") {
//			elObj = Filters._findElement(elObj.prop("uuid"));
//			Filters._resetStyle(elObj);
//		}
		
		var type = elObj.prop("type");
		
		elObj.each(function() {
			var el = $(this);
			
			if (typeof Filters !== "undefined") {
				Filters._resetStyle(Filters._findElement(el.prop("uuid")));
			}
		
			el.removeProp("disabled");
			
			if (!type || type === "text" || type === "password" || type === 'textarea') {
				el.removeClass("nondisable");
			} else if (type === "radio") {
				//el.prop('checked', false);
			} else if (type === "checkbox") {
				//el.prop('checked', false);
			} else if (type.indexOf("select") == 0){
				el.parent().removeClass("nondisable");
			} else if (type === "file") {
				if (el.is(":hidden")) {
					$("input[name=dispFileName]", el.closest("td")).removeClass("nondisable");
					$("button", el.closest("td")).removeClass("nondisable");
					$(".photo>.image", el.closest("td")).css("background", "#FFFFFF");
				} else {
					el.removeClass("nondisable");
				}
			}
		});
	},
	/**
	 * 입력폼을 disable 시킨다.
	 */
	disable : function() {
		this._disable(this);
	},
	disableAll : function() {
		$.each(this, function(index) {
			$(this).disable();
		});
	},
	_disable : function(elObj) {
//		if (typeof Filters !== "undefined") {
//			elObj = Filters._findElement(elObj.prop("uuid"));
//			Filters._resetStyle(elObj);
//		}
		
		var type = elObj.prop("type");
		
		elObj.each(function() {
			var el = $(this);
			
			if (typeof Filters !== "undefined") {
				Filters._resetStyle(Filters._findElement(el.prop("uuid")));
			}
		
			el.prop("disabled", true);
			
			if (!type || type === "text" || type === "password" || type === 'textarea') {
				el.val('');
				el.addClass("nondisable");
			} else if (type === "radio") {
				el.prop('checked', false);
			} else if (type === "checkbox") {
				el.prop('checked', false);
			} else if (type.indexOf("select") == 0){
				el.val('');
				el.parent().addClass("nondisable");
			} else if (type === "file") {
				if (el.is(":hidden")) {
					$("input[name=dispFileName]", el.closest("td")).addClass("nondisable");
					$("button", el.closest("td")).addClass("nondisable");
					$(".photo>.image", el.closest("td")).css("background", "#F2F2F2");
				} else {
					el.addClass("nondisable");
				}
			}
		});
	},
	/**
	 * 키 입력에 따른 필터 환경 설정
	 * (해당 element의 키 입력에 따른 필터함수를 실행)
	 * (실행 후 성공하면 해당값을 저장)
	 * @param {Function} fnFilter		- 필터 함수
	 */
	_inputFilter : function(fnFilter) {
		// drop keydown keyup mouseup 등의 이벤트는 거의 불필요함.
		//return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function(e) {
		return this.on("input", function(e) {
			//console.log(e);
			e.preventDefault();
			e.stopPropagation();
			
			if (fnFilter(this.value)) {
				this.oldValue = this.value;
				this.oldSelectionStart = this.selectionStart;
				this.oldSelectionEnd = this.selectionEnd;
			} else if (this.hasOwnProperty("oldValue")) {
				this.value = this.oldValue;
				if (this.oldSelectionStart != null && this.oldSelectionEnd != null) {
					this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
				}
			} else {
				this.value = "";
			}
		});
	},
	/**
	 * input 및 blur 필터
	 * (input 및 blur 이벤트 발생시 필터 적용) 
	 * @param {Function} fnFilter		- 필터 함수
	 */
	_blurInputFilter : function(fnFilter) {
		// focusout 은 버블링발생
		//return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function(e) {
		var thisObj = this;
		var hintType = this._filters.hintType;
		var hint = this._filters.hint;
		
		if (this._filters.options.filter === 'checkbox' || this._filters.options.filter === 'radio' || this._filters.options.filter === 'select') {
			return this.on("change", function(e) {
				e.preventDefault();
				e.stopPropagation();
				Filters._inputValidStyle(thisObj, true);
			});
		} else {
			return this.on("input blur focus", function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				// i.e인 경우 readonly라도 focus를 갖고 있는 문제(?)가 있다.
				if (e.type != "blur" && thisObj.prop("readonly")) { thisObj.blur(); return; }
				
				if (hintType === "tooltip") {
					var offset = thisObj.offset();
					if (e.type === "focus") Filters._tooltip.html(hint).css("top", offset.top).css("left", offset.left).show();
					else if (e.type ==="blur") Filters._tooltip.hide();
				} else if (hintType === "focus_only") {
					if (e.type ==="focus") $(this).prop("placeholder", hint);
					else if (e.type ==="blur") $(this).prop("placeholder", '');
				}
				
				///////////////////////////////////////////////
				
				if (!this.value) return;
				if (e.type === "focus") this.isInput = false;
				else if (e.type === "input") this.isInput = true;
				if (!this.isInput) return;
				///////////////////////////////////////////////
				
				var isValid = false;
				
				if (fnFilter(this.value, e.type)) {
					this.oldValue = this.value;
					if (this.selectionStart) this.oldSelectionStart = this.selectionStart;
					if (this.selectionEnd) this.oldSelectionEnd = this.selectionEnd;
					
					if (this.value) isValid = true;
				} else if (this.hasOwnProperty("oldValue")) {
					this.value = this.oldValue;
					if (this.oldSelectionStart != null && this.oldSelectionEnd != null) {
						this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
					}
				} else {
					this.value = "";
				}
				
				// --------------------------------
				if (e.type === "blur") {
					Filters._inputValidStyle(thisObj, isValid);
				} else {
					if (isValid) {
						Filters._showPasswordHint(thisObj, this.value);
					}
				}
				// --------------------------------
				
			});
		}
	},
	/**
	 * File upload폼에 사용할 필터
	 * (파일 선택시 이벤트 발생) 
	 * @param {Function} fnFilter		- 필터 함수
	 */
	_fileFilter : function(fnFilter) {
		var thisObj = this;
		return this.on("change", function(e) {
			if (!this.value) return;
			
			if (!fnFilter(this.value, e.type)) {
				e.preventDefault();
				e.stopPropagation();
				this.value = "";
			}
		});
	},
	/**
	 * 규칙이 없는 전화번호를 지정된 형식으로 변환
	 * @param {String} filterType	- 전화번호 필터명
	 */
	_convertPhoneNo : function(filterType) {
		if (filterType != 'mobile' && filterType != 'mobile_ko' && filterType != 'phone') return;
		var digitStr = this.val().replace(/[^0-9]/g, '');//숫자문자열 추출
		var phoneStr = null;
		
		if (filterType === 'mobile') {
			var match = digitStr.match(/^(\d{3})(\d{4})(\d{4})$/);
			if (match) {
				phoneStr = match[1] + '-' + match[2] + '-' + match[3];
			}
			/*var match = digitStr.match(/^(\d{4})(\d{7})$/);
			if (match) {
				phoneStr = match[1] + '-' + match[2];
			}*/
		} else if (filterType === 'mobile_ko') {
			var match = digitStr.match(/^(\d{3})(\d{3,4})(\d{4})$/);
			if (match) {
				phoneStr = match[1] + '-' + match[2] + '-' + match[3];
			}
		} else if (filterType === 'phone') {
			var match = digitStr.match(/^(\d{3})(\d{4})(\d{4})$/);
			if (match) {
				phoneStr = match[1] + '-' + match[2] + '-' + match[3];
			}
		}
		
		if (phoneStr) this.val(phoneStr);
	},
	/**
	 * element에 포함되어 있는 모든 이벤트 목록 조회
	 */
	showEvents : function(type) {
		$.each($._data($(this)[0], "events"), function(i, event) {
			$.each(event, function(j, h) {
				//console.log(h);
				if (!type || type === h.type) console.log(h.type + " : " + h.handler);
			});
		});
	}
});
