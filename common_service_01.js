* Element 이벤트 핸들러 서비스
 * @author X0114723
 */
jQuery.fn.extend({
	// 순서 : keydown -> change -> keyup
	// 순서 : change -> keypress
	// 순서 : mousedown -> mouseup -> click
	/**
	 * enter키 누를 경우 수행할 서비스함수 등록
	 * @param {Function} fn : 이벤트 발생시 수행할 함수
	 * @param {Object} params : 수행함수 호출시 전달할 파라미터
	 */
	enterHandler : function(fn, params) {
		$(this).on("keydown", function(e) {
			if (e.keyCode == 13) {
				e.preventDefault();
				e.stopPropagation();
				if (fn && typeof fn === "function") fn(params);
			}
		});
	},
	/**
	 * enter키 누를 경우 또는 입력폼의 값이 변경될 경우 수행할 서비스함수 등록
	 * @param {Function} fn : 이벤트 발생시 수행할 함수
	 * @param {Object} params : 수행함수 호출시 전달할 파라미터
	 */
	changeOrEnterHandler : function(fn, params) {
		var entered = false;
		$(this).on("change", function(e) {
			if (entered) { entered = false; return; }
			if (fn && typeof fn === "function") fn(params);
			e.preventDefault();
			e.stopPropagation();
		});
		$(this).on("keydown", function(e) {
			if (e.keyCode == 13) {
				e.preventDefault();
				e.stopPropagation();
				entered = true;
				if (fn && typeof fn === "function") fn(params);
			} else entered = false;
		});
	},
	/**
	 * escape키 이벤트 호출시 사용할 함수 등록
	 * @param {Function} fn : 이벤트 발생시 수행할 함수
	 * @param {Object} params : 수행함수 호출시 전달할 파라미터
	 */
	escHandler : function(fn, params) {
		$(this).on("keydown", function(e) {
			if (e.keyCode == 27) {
				e.preventDefault();
				e.stopPropagation();
				if (fn && typeof fn === "function") fn(params);
			}
		});
	},
	/**
	 * 기타 이벤트 호출시 사용할 함수 등록
	 * @param {Function} fn : 이벤트 발생시 수행할 함수
	 * @param {Object} params : 수행함수 호출시 전달할 파라미터
	 */
	eventHandler : function(event, fn, params) {
		$(this).on(event, function(e) {
			e.preventDefault();
			e.stopPropagation();
			if (fn && typeof fn === "function") fn(params);
		});
	},
	/**
	 * F5(새로고침) 이벤트 차단 혹은 사용할 함수 등록
	 * @param {Function} fn : 이벤트 발생시 수행할 함수
	 * @param {Object} params : 수행함수 호출시 전달할 파라미터
	 */
	blockRefresh : function(fn, params) {
		$(this).on("keydown", function(e) {
			e = e || window.event;
			if (e.keyCode == 116) {
				e.preventDefault();
				e.stopPropagation();
				if (fn && typeof fn === "function") fn(params);
			}
		});
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
	/**
	 * 키 입력에 따른 필터 환경 설정
	 * (해당 element의 키 입력에 따른 필터함수를 실행)
	 * (실행 후 성공하면 해당값을 저장)
	 * @param {Function} filter		- 필터 함수
	 */
	_inputFilter : function(filter) {
		// drop keydown keyup mouseup 등의 이벤트는 거의 불필요함.
		//return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function(e) {
		return this.on("input", function(e) {
			//console.log(e);
			
			if (filter(this.value)) {
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
	 *  @param {Function} filter		- 필터 함수
	 */
	_blurInputFilter : function(filter) {
		// focusout 은 버블링발생
		//return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function(e) {
		return this.on("input blur", function(e) {
			if (filter(this.value, e.type)) {
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
	}
});

/**
 * 공통 서비스
 * @author X0114723
 */
var CommonService = {
	/**
	 *  Select box의 Option 리스트 또는 radio button 목록을 만들어 삽입한다.
	 *  N_CO_CODE_D 테이블의 GRP_CD를 조건 값으로 갖는다.
	 *  최종적으로 loadCodeList 함수를 호출한다.
	 *  
	 *	@param {String} grpCd			- Common Group Code 값
	 *  @param {String} targetId		- target element (Select테그)의 id 값
	 * 	@param {Object} options {
	 * 					preOption		- 선택, 전체 등 선행되는 option 값을 선택한다.
	 * 					selectedCd		- option 리스트중 선택될 value 값
	 * 					targetFormId	- 해당 target이 포함되어 있는 form id
	 *  				elementType		- Select box 또는 radio
	 *  				exceptCds		- 제외할 코드 리스트
	 *  				}
	 *  @param {Object} data			- selectedCd보다 우선하여 기본값 적용
	 *  @param {Function} callback		- callback 함수
	 *  @param {Function} fnFilter		- 코드값외에 기타 조건(return값이 true이면 pass, false이면 코드를 적용하지 않는다.)
	 */
	loadCodes : function( grpCd, targetId, options, data, callback, fnFilter) {
		if (!options) options = {};
		
		var selectedCd = options.selectedCd;
		var elementType = options.elementType || "select";
		var preOption = options.preOption;
		var targetFormId = options.targetFormId;
		var exceptCds = options.exceptCds;
		
		// 선택된 code보다 값 우선 적용
		if (data != null && typeof data != "undefined") {
			if (typeof data === 'object') {
				if(data.hasOwnProperty(targetId)) selectedCd = data[targetId];
			} else {
				selectedCd = data;
			}
		}
		if (!selectedCd) selectedCd = '';
		
		CommonService.loadCodeList(grpCd, targetId, preOption, selectedCd, callback, targetFormId, elementType, exceptCds, fnFilter);
	},
	/**
	 *  Select box의 Option 리스트 또는 radio button 목록을 만들어 삽입한다.
	 *	N_CO_CODE_D 테이블의 GRP_CD를 조건 값으로 갖는다.
	 *	@param {String} grpCd			- Common Group Code 값
	 *  @param {String} targetId		- target element (Select테그)의 id 값
	 * 	@param {String} preOption		- 선택, 전체 등 선행되는 option 값을 선택한다.
	 * 	@param {String} selectedCd		- option 리스트중 선택될 value 값
	 * 	@param {Function} callback		- callback 함수
	 * 	@param {String} targetFormId	- 해당 target이 포함되어 있는 form id
	 *  @param {String} elementType		- Select box 또는 radio
	 *  @param {Array} exceptCds		- 제외할 코드 리스트
	 *  @param {Function} fnFilter		- 코드값외에 기타 조건(return값이 true이면 pass, false이면 코드를 적용하지 않는다.)
	 *  @return {Object} : 해당 코드그룹 정보
	 */
	loadCodeList : function( grpCd, targetId, preOption, selectedCd, callback, targetFormId, elementType, exceptCds, fnFilter ) {
		var element = '';
		var excepts = [];
		var targetForm = $("#"+targetFormId);
		if (!targetForm || targetForm.length == 0) targetForm = null;
		
		if (exceptCds && !Array.isArray(exceptCds)) exceptCds = [exceptCds];
		for (var i in exceptCds) excepts.push(exceptCds[i].toString());
		
		var targetObj = null;
		targetObj = $("[id='"+targetId+"']", targetForm);
		if (!targetObj || targetObj.length == 0) targetObj = $("[name='"+targetId+"']", targetForm);
		if (!elementType) elementType = "select";
		
		$.ajax({
			type: "POST",
			cache:false,
			url: "/common/code/searchDetailCodeList.do",
			data: { grpCd : grpCd, lang : LANG },
			dataType: "json",
			success: function(data) {
				if (data.resultCode == WebError.OK) {
					var result = data.list;
					
					if (elementType === "radio") {
						if (preOption) result.unshift({"detlCd":"", "detlDispNm":preOption});
						// value1 : 화면에 보여줄지 여부
						for ( var i in result ) {
							if (Common.includes(excepts, result[i].detlCd.toString())) continue;
							if (fnFilter && typeof fnFilter === 'function') {
								if (!fnFilter(result[i])) { continue; }
							}
							
							var name = targetId;
							//var id = targetId+result[i].detlCd;
							var id = targetId+i;
							var value = result[i].detlCd;
							var checked = '';
							
							if ( selectedCd != null && result[i].detlCd == selectedCd ) checked = ' checked';
							element += '<span class="jqformRadioWrapper">' 
									+ '<input class="jqformHidden jqRadio" type="radio" id="'+id+'" name="'+name+'" value="'+value+'"'+checked+'>'
									+ '<span class="jqformRadio"></span>'
									+ '<label for="'+id+'">'+result[i].detlDispNm+'</label>'
									+ '</span>';
						} 
					} else {
						if (preOption) element = "<option value=''>" + preOption + "</option>";
						// value1 : 화면에 보여줄지 여부
						for( var i in result) {
							if (Common.includes(excepts, result[i].detlCd.toString())) continue;
							if (fnFilter && typeof fnFilter === 'function') {
								if (!fnFilter(result[i])) { continue; }
							}
							
							element += '<option value="' + result[i].detlCd + '"';
							if ( (selectedCd) && result[i].detlCd == selectedCd )
							element += ' selected' ;
							element += '>'  + result[i].detlDispNm + '</option>';
						}
					}
					
					targetObj.empty();
					targetObj.append(element);
					
					//$('#'+targetId).empty();
					//$('#'+targetId).append(element);
					
					if ( callback && typeof callback === "function" ) callback(result) ;
				}
			}
		});
	},
	/**
	 * 코드 목록을 상세코드를 키로하는 Map데이터로 변환
	 * @param {Array} codes	- code 목록
	 * @return {Object} 	- code map(json object)
	 */
	toCodeMap : function(codes) {
		var codeMap = {};
		for (var i in codes) {
			var code = codes[i];
			if (!codeMap.hasOwnProperty(code.detlCd)) codeMap[code.detlCd] = code;
		}
		return codeMap;
	},
	/**
	 *  국가코드 Select box의 Option 리스트 목록을 만들어 삽입한다.
	 *	(N_CO_NATION)
	 *  @param : targetId		- target element (Select테그)의 id 값
	 * 	@param : preOption		- 선택, 전체 등 선행되는 option 값을 선택한다.
	 * 	@param : selectedCd		- [O]option 리스트중 선택될 value 값
	 * 	@param : callback		- [O] callback 함수
	 * 	@param : targetFormId	- 해당 target이 포함되어 있는 form id
	 *  @param : exceptCds		- 제외할 코드 리스트
	 */
	loadNationCodeList : function( targetId, preOption, selectedCd, callback, targetFormId, exceptCds ) {
		var element = '';
		var excepts = [];
		var targetForm = $("#"+targetFormId);
		if (!targetForm || targetForm.length == 0) targetForm = null;
		
		if (exceptCds && !Array.isArray(exceptCds)) exceptCds = [exceptCds];
		for (var i in exceptCds) excepts.push(exceptCds[i].toString());
		
		var targetObj = $("[id='"+targetId+"']", targetForm);
		if (!targetObj || targetObj.length == 0) targetObj = $("[name='"+targetId+"']", targetForm);
		
		$.ajax({
			type: "POST",
			cache:false,
			url: "/common/code/searchNationCodeList.do",
			data: { lang : LANG },
			dataType: "json",
			success: function(data) {
				if (data.resultCode == WebError.OK) {
					var result = data.list;
					
					if (preOption) element = "<option value=''>" + preOption + "</option>";
					// value1 : 화면에 보여줄지 여부
					for( var i in result) {
						if (Common.includes(excepts, result[i].nationId.toString())) continue;
						element += '<option value="' + result[i].nationId + '"';
						if ( (selectedCd) && result[i].nationId == selectedCd )
						element += ' selected' ;
						element += '>'  + result[i].nationDispNm + '</option>';
					}
					targetObj.empty();
					targetObj.append(element);
					
					if ( callback && typeof callback === "function" ) callback(result) ;
				}
			}
		});
	},
	/**
	 *  방문목적 코드 Select box의 Option 리스트 목록을 만들어 삽입한다.
	 *	(N_VISITOR_REASON)
	 *	@param : reasonKnd		- Reason Knd 값
	 *  @param : targetId		- target element (Select테그)의 id 값
	 * 	@param : preOption		- 선택, 전체 등 선행되는 option 값을 선택한다.
	 * 	@param : selectedCd		- [O]option 리스트중 선택될 value 값
	 * 	@param : callback		- [O] callback 함수
	 * 	@param : targetFormId	- 해당 target이 포함되어 있는 form id
	 *  @param : exceptCds		- 제외할 코드 리스트
	 */
	loadReasonCodeList : function( reasonKnd, targetId, preOption, selectedCd, callback, targetFormId, exceptCds ) {
		var element = '';
		var excepts = [];
		var targetForm = $("#"+targetFormId);
		if (!targetForm || targetForm.length == 0) targetForm = null;
		
		if (exceptCds && !Array.isArray(exceptCds)) exceptCds = [exceptCds];
		for (var i in exceptCds) excepts.push(exceptCds[i].toString());
		
		var targetObj = $("[id='"+targetId+"']", targetForm);
		if (!targetObj || targetObj.length == 0) targetObj = $("[name='"+targetId+"']", targetForm);
		
		$.ajax({
			type: "POST",
			cache:false,
			url: "/common/code/searchReasonCodeList.do",
			data: { visitReasonKnd : reasonKnd,  lang : LANG },
			dataType: "json",
			success: function(data) {
				if (data.resultCode == WebError.OK) {
					var result = data.list;
					
					if (preOption) element = "<option value=''>" + preOption + "</option>";
					// value1 : 화면에 보여줄지 여부
					for( var i in result) {
						if (Common.includes(excepts, result[i].visitReasonId.toString())) continue;
						element += '<option value="' + result[i].visitReasonId + '"';
						if ( (selectedCd) && result[i].visitReasonId == selectedCd )
						element += ' selected' ;
						element += '>'  + result[i].visitReasonNm + '</option>';
					}
					targetObj.empty();
					targetObj.append(element);
					
					if ( callback && typeof callback === "function" ) callback(result) ;
				}
			}
		});
	},	
	/**
	 *  출입구역게이트 코드 Select box의 Option 리스트 목록을 만들어 삽입한다.
	 *	(N_CO_BLDG)
	 *	@param : codeGb			- 게이트 구분값( {vipYn:'Y', eduYn:'Y'} 
	 *  @param : targetId		- target element (Select테그)의 id 값
	 * 	@param : preOption		- 선택, 전체 등 선행되는 option 값을 선택한다.
	 * 	@param : selectedCd		- [O]option 리스트중 선택될 value 값
	 * 	@param : callback		- [O] callback 함수
	 * 	@param : targetFormId	- 해당 target이 포함되어 있는 form id
	 *  @param : exceptCds		- 제외할 코드 리스트
	 */
	loadBldgCodeList : function( codeGb, targetId, preOption, selectedCd, callback, targetFormId, exceptCds ) {
		var element = '';
		var excepts = [];
		var targetForm = $("#"+targetFormId);
		if (!targetForm || targetForm.length == 0) targetForm = null;
		
		if (exceptCds && !Array.isArray(exceptCds)) exceptCds = [exceptCds];
		for (var i in exceptCds) excepts.push(exceptCds[i].toString());
		
		var targetObj = $("[id='"+targetId+"']", targetForm);
		if (!targetObj || targetObj.length == 0) targetObj = $("[name='"+targetId+"']", targetForm);
		
		$.ajax({  
			type: "POST",
			cache:false,
			url: "/common/code/searchBldgCodeList.do",
			data: codeGb,       
			dataType: "json",
			success: function(data) {
				if (data.resultCode == WebError.OK) {
					var result = data.list;  
					
					if (preOption) element = "<option value=''>" + preOption + "</option>";
					// value1 : 화면에 보여줄지 여부
					for( var i in result) {
						if (Common.includes(excepts, result[i].gateId.toString())) continue;
						element += '<option value="' + result[i].gateId + '"';
						if ( (selectedCd) && result[i].gateId == selectedCd )
						element += ' selected' ;
						element += '>'  + result[i].gateDispNm + '</option>';
					}
					targetObj.empty();
					targetObj.append(element);
					
					if ( callback && typeof callback === "function" ) callback(result) ;
				}
			}
		});
	},
	/**  fileID에 해당하는 파일 이미지 데이터를 팝업으로 호출
	 *	@param {String} fileId			- 파일 ID
	 *  @param {String} popupProps		- 팝업윈도우 festures properties
	 */
	imageView : function(fileId, popupProps) {
		var props = '';
		if (popupProps) {
			popupProps = popupProps.replace(/\s/g, '');
			props = Common.propStringToJson(popupProps, ',');
		}
		/*var pairs = popupProps.split(',');
		var props = {};
		pairs.forEach(function(pair) {
			pair = pair.split('=');
			props[pair[0]] = pair[1] || '';
		});*/
		
		//Common.openWindow(contextPath + "/common/image/popupImageView.do?fileid="+fileId,600,800,"yes","no");
		CommonService.postPopup(contextPath + "/common/image/popupImageView.do?fileid="+fileId, fileId, props);
	},
	/**  이미지 팝업을 호출하기 위한 icon 생성 html
	 *	@param {String} fileId			- 파일 ID
	 *  @param {String} targetId		- 아이콘이 위치할 target ID
	 *  @param {String} popupProps		- 팝업윈도우 festures properties
	 *  @return {String} 				- 생성되 icon html
	 */
	makeImageViewIcon : function(fileId, targetId, popupProps) {
		if (!fileId) return '';
		
		var iconHtml = '<a href="#" class="btn_form sep">'
		+	'<span class="form_ico form_ico_srch" onclick="CommonService.imageView(\'' + fileId + '\', \'' + popupProps + '\');"></span>'
		+ '</a>';
		
		if (!targetId) return;
		var targetObj = $("#"+targetId);
		if (targetObj && targetObj.length > 0) targetObj.html(iconHtml);
		
		return iconHtml;
	},
	/** 원본 이미지의 가로세로 사이즈를 지정된 사이즈로 변환(내부적으로만 사용)
	 *  만약 원본보다 지정사이즈가 크면 원본사이즈로, 작은 사이즈면 비율을 유지하면서 지정 사이즈로 변환
	 *	@param {Number} tw	- 변경 가로 사이즈
	 *  @param {Number} th	- 변경 세로 사이즈
	 *  @param {Number} sw	- 원본 가로 사이즈
	 *  @param {Number} sh	- 원본 세로 사이즈
	 *  @return {Object} 새로 계산된 이미지 가로 세로 사이즈
	 */
	_calcImageRatio : function(tw, th, sw, sh) {
		var _w = tw;
		var _h = th;
		var ratio = tw / th;
		var _ratio = sw / sh;
		
		if (ratio > _ratio) {
			if (th > sh) _h = sh;
			_w = _h * _ratio;
		} else {
			if (tw > sw) _w = sw;
			_h = _w / _ratio;
		}
		return {w:_w, h:_h};
	},
	/**
	 * 이미지 preview에서 targetId에 포함되는 영역에서 image가 실제로 보여질
	 * 영역의 크기와 id(image영역의 id)값을 구한다.
	 * @param {String} targetId	- 이미지 preview 영역
	 * @param {Number} w		- preview 가로 크기
	 * @param {Number} h		- preview 세로 크기
	 * @return {Object} 이미지 영역 id, 새로구해진 이미지 영역(wXh)
	 */
	_resizePreviewDiv : function(targetId, w, h) {
		var tgtObj = $("#"+targetId);
		
		if (w) {
			if (typeof w === 'string') w = parseInt(w.replace('px',''));
			// preview 영역의 border값때문에 영역의 크기기는 이미지 사이즈보다 2픽셀 크게
			$(".image", tgtObj).css("width", (w+2)+"px");
		} else {
			// preview 영역의 border값때문에 이미지 사이즈는 2픽셀 작게
			w = parseInt($(".image", tgtObj).css("width").replace('px', '')) - 2;
		}
		if (h) {
			if (typeof h === 'string') h = parseInt(h.replace('px',''));
			// preview 영역의 border값때문에 이미지 사이즈보다 2픽셀 크게
			$(".image", tgtObj).css("height", (h+2)+"px");
		} else {
			// preview 영역의 border값때문에 이미지 사이즈는 2픽셀 작게
			h = parseInt($(".image", tgtObj).css("height").replace('px', '')) - 2;
		}
		
		var previewTargetId = $(".image", tgtObj).attr("id");
		if (!previewTargetId) previewTargetId = targetId;
		var previewDivObj = {
			w : w,
			h : h,
			imageDivId : previewTargetId
		}
		
		return previewDivObj;
	},
	/** 
	 * 이미지 미리보기 영역의 사이즈를 Image의 사이즈에 맞게 변경
	 * (단, 이미지 미리보기 영역의 class로 'image'가 포함되어야 한다.)
	 * @param {String} imgDivId	- 이미지 미리보기 영역(div) 영역의 ID
	 * @param {Number} w		- 이미지 미리보기 영역의 가로 크기
	 * @param {Number} h		- 이미지 미리보기 영역의 세로 크기
	 */
	_fitImageDiv : function(imgDivId, w, h) {
		if (!w || !h) return;
		var imgDivObj = $("#"+imgDivId);
		// preview 영역의 border값때문에 영역의 크기기는 이미지 사이즈보다 2픽셀 크게
		imgDivObj.css("width", (w+2)+"px");
		// preview 영역의 border값때문에 이미지 사이즈보다 2픽셀 크게
		imgDivObj.css("height", (h+2)+"px");
		
		/*
		if (imgDivObj.hasClass("image")) {
			// preview 영역의 border값때문에 영역의 크기기는 이미지 사이즈보다 2픽셀 크게
			imgDivObj.css("width", (w+2)+"px");
			// preview 영역의 border값때문에 이미지 사이즈보다 2픽셀 크게
			imgDivObj.css("height", (h+2)+"px");
		} else {
			// preview 영역의 border값때문에 영역의 크기기는 이미지 사이즈보다 2픽셀 크게
			$(".image", imgDivObj).css("width", (w+2)+"px");
			
			// preview 영역의 border값때문에 이미지 사이즈보다 2픽셀 크게
			$(".image", imgDivObj).css("height", (h+2)+"px");

		}
		*/
	},
	/**
	 * 이미지를 지정영역에 지정크기로 보여준다-비율유지.
	 * fileId에 해당하는 실제 파일정보를 가져온후 내부적으로 _makeThumbImageRatio 함수 호출
	 * @param {String} fileId		- 이미지 파일 ID
	 * @param {String} targetId		- 이미지가 보여질 영역의 ID
	 * @param {Number} w			- thumbnail 가로 크기
	 * @param {Number} h			- thumbnail 세로 크기
	 * @param {String} popupProps	- 팝업윈도우 festures properties
	 */
	makeThumbImageRatio : function(fileId, targetId, w, h, popupProps) {
		if (!targetId) return;
		var pDivObj = CommonService._resizePreviewDiv(targetId, w, h);
		if (pDivObj && pDivObj.imageDivId) {
			$("#"+pDivObj.imageDivId).text('');
		}
		if (!fileId) return;
		
		CommonService.getFileInfo(fileId, function(fileInfo) {
			CommonService._makeThumbImageRatio(fileInfo, pDivObj.imageDivId, pDivObj.w, pDivObj.h, true, popupProps, true);
		});
	},
	/**
	 * 이미지를 지정영역에 지정크기로 보여준다-비율유지.(내부적으로만 사용)
	 * @param {String} fileId	- 이미지 파일 ID
	 * @param {String} targetId		- 이미지가 보여질 영역의 ID
	 * @param {Number} w			- thumbnail 가로 크기
	 * @param {Number} h			- thumbnail 세로 크기
	 * @param {Boolean} popup		- 상세보기 팝업 여부
	 * @param {String} popupProps	- 팝업윈도우 festures properties
	 * @param {Boolean} isErrImg	- 에러 이미지를 보여줄지 여부
	 */
	_makeThumbImageRatio : function(fileInfo, targetId, w, h, popup, popupProps, isErrImg) {
		if (!targetId) return;
		var targetObj = $("#"+targetId);
		targetObj.text('');
		
		if (!fileInfo) {
			return;
		}
		var fileId = fileInfo.fileId;
		var fileNm = fileInfo.fileNm;
		var title = "Popup";
		if (fileNm) title += " [" + fileNm + "]";
		
		var ratio = w / h;
	
		
		//if (!targetObj || targetObj.length == 0) return;
		
		var thumbHtml = '';
		var popupHtml = '';
		if (popup) {
			popupHtml = ' style="cursor:pointer" onclick="CommonService.imageView(\'' + fileId + '\', \'' + popupProps + '\');" alt="'+ title +'" title="'+ title +'"'; 
		};
		
		
		var img = new Image();
		img.onload = function() {
			var sizeObj = CommonService._calcImageRatio(w, h, this.width, this.height);
			// 이미지 미리보기 영역의 크기를 이미지 사이즈에 맞출것인지 여부
			CommonService._fitImageDiv(targetId, sizeObj.w, sizeObj.h);
			
			thumbHtml = '<img src="'+ this.src + '" width="'+ sizeObj.w + '" height="' + sizeObj.h + '"' + popupHtml + ' />';
			targetObj.html(thumbHtml);
		}
		img.onerror = function() {
			if (!isErrImg) return;
			var imgObj = CommonService.getErrImgObj(targetId, w, h);
			
			CommonService._fitImageDiv(targetId, imgObj.divW, imgObj.divH);
			thumbHtml = '<img src="'+ imgObj.src + '" width="'+ imgObj.w + '" height="' + imgObj.h + '" alt="No image" title="No image" '+imgObj.style+' />';
			
			targetObj.html(thumbHtml);
		}
		
		if (fileInfo.data) img.src = fileInfo.data;
		else img.src = contextPath + '/common/image/display.do?fileid=' + fileId;
	},
	/**
	 * 이미지를 지정영역에 지정크기로 보여준다-비율유지안함
	 * @param {String} fileId	- 이미지 파일 ID
	 * @param {String} targetId	- 이미지가 보여질 영역의 ID
	 * @param {Number} w		- thumbnail 가로 크기
	 * @param {Number} h		- thumbnail 세로 크기
	 */
	makeThumbImage : function(fileId, targetId, w, h) {
		CommonService._makeThumbImage(fileId, targetId, w, h, true);
	},
	/**
	 * 이미지를 지정영역에 지정크기로 보여준다-비율유지안함
	 * @param {String} fileId		- 이미지 파일 ID
	 * @param {String} targetId		- 이미지가 보여질 영역의 ID
	 * @param {Number} w			- thumbnail 가로 크기
	 * @param {Number} h			- thumbnail 세로 크기
	 * @param {String} popupProps	- 팝업윈도우 festures properties
	 * @param {Boolean} popup		- 상세보기 팝업 여부
	 */
	_makeThumbImage : function(fileId, targetId, w, h, popup, popupProps) {
		if (!fileId) return '';
		
		var width = 80;
		var height = 80;
		
		if(w) width = w;
		if(h) height = h;

		if (!targetId) return;
		var targetObj = $("#"+targetId);
		//if (!targetObj || targetObj.length == 0) return;
		 
		var thumbHtml = '';
		var img = new Image();
		img.src = contextPath + '/common/image/display.do?fileid=' + fileId;
		
		var popupHtml = '';
		if (popup) {
			 popupHtml = ' style="cursor:pointer" onclick="CommonService.imageView(\'' + fileId + '\', \'' + popupProps + '\');"'; 
		};
		img.onload = function() {
			thumbHtml = '<img src="'+ this.src + '" width="'+ width + '" height="' + height + '"' + popupHtml + ' />';
			targetObj.html(thumbHtml);
		}
		img.onerror = function() {
			var imgObj = CommonService.getErrImgObj(targetId, w, h);
			
			thumbHtml = '<img src="'+ imgObj.src + '" width="'+ imgObj.w + '" height="' + imgObj.h + '" '+imbObj.style+' />';
			targetObj.html(thumbHtml);
		}
		
		//return thumbHtml;
	},
	/**
	 * 파일 다운로드 HTML Link 생성
	 * @param {String} fileId	- File ID
	 * @param {String} fileNm	- File Name
	 * @return {String}			- File Download link url
	 */
	makeFileDownloadUrl : function(fileId, fileNm) {
		return '<a class="link2" href="' + contextPath + '/fileDownload.do?file='+fileId+'" title="Download">'+fileNm+'</a>';
	},
	/**
	 * 이미지 팝업 HTML Link 생성
	 * @param {String} fileId		- File ID
	 * @param {String} fileNm		- File Name
	 * @param {String} popupProps	- 팝업 윈도우 properties
	 * @return {String}				- File Download link url
	 */
	makeImagePopupUrl : function(fileId, fileNm, popupProps) {
		return '<a class="link2" onclick="CommonService.imageView(\'' + fileId + '\', \'' + popupProps + '\');return false;" title="Popup">'+fileNm+'</a>';
	},
	/**
	 * 이미지 View URL
	 * @param {String} fileId	- Image File ID
	 * @param {String} targetId	- Image가 보여질 영역 ID
	 * @param {Integer} w		- 이미지 최대 가로 크기
	 * @param {Integer} h		- 이미지 최대 세로 크기
	 * @param {Boolean} isErrImg - 에러이미지 보여주기 여부
	 */
	viewBoardImage : function(fileId, targetId, w, h, isErrImg) {
		if (!fileId) return;
		if (!w) w = 600;
		if (!h) h = 900;
		
		if(typeof isErrImg === "undefined") isErrImg = true;
		
		CommonService.getFileInfo(fileId, function(fileInfo) {
			CommonService._makeThumbImageRatio(fileInfo, targetId, w, h, false, null, isErrImg);
		});
	},
