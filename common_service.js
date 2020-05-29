/**
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
	 */
	loadCodes : function( grpCd, targetId, options, data, callback) {
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
		
		CommonService.loadCodeList(grpCd, targetId, preOption, selectedCd, callback, targetFormId, elementType, exceptCds);
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
	 *  @return {Object} : 해당 코드그룹 정보
	 */
	loadCodeList : function( grpCd, targetId, preOption, selectedCd, callback, targetFormId, elementType, exceptCds ) {
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
	 *	@param {String} fileId	- 파일 ID
	 */
	imageView : function(fileId) {
		Common.openWindow(contextPath + "/common/image/popupImageView.do?fileid="+fileId,600,800,"yes","no");
	},
	/**  이미지 팝업을 호출하기 위한 icon 생성 html
	 *	@param {String} fileId		- 파일 ID
	 *  @param {String} targetId	- 아이콘이 위치할 target ID
	 *  @return {String} 생성되 icon html
	 */
	makeImageViewIcon : function(fileId, targetId) {
		if (!fileId) return '';
		
		var iconHtml = '<a href="#" class="btn_form sep">'
		+	'<span class="form_ico form_ico_srch" onclick="CommonService.imageView(\'' + fileId + '\');"></span>'
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
	 * 영역의 크기와 id값을 구한다.
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
			id : previewTargetId
		}
		
		return previewDivObj;
	},
	/**
	 * 이미지를 지정영역에 지정크기로 보여준다-비율유지.
	 * fileId에 해당하는 실제 파일정보를 가져온후 내부적으로 _makeThumbImageRatio 함수 호출
	 * @param {String} fileId	- 이미지 파일 ID
	 * @param {String} targetId	- 이미지가 보여질 영역의 ID
	 * @param {Number} w		- thumbnail 가로 크기
	 * @param {Number} h		- thumbnail 세로 크기
	 */
	makeThumbImageRatio : function(fileId, targetId, w, h) {
		if (!targetId) return;
		var newSize = CommonService._resizePreviewDiv(targetId, w, h);
		if (!fileId) return;
		
		CommonService.getFileInfo(fileId, function(fileInfo) {
			CommonService._makeThumbImageRatio(fileInfo, newSize.id, newSize.w, newSize.h, true);
		});
	},
	/**
	 * 이미지를 지정영역에 지정크기로 보여준다-비율유지.(내부적으로만 사용)
	 * @param {String} fileId	- 이미지 파일 ID
	 * @param {String} targetId	- 이미지가 보여질 영역의 ID
	 * @param {Number} w		- thumbnail 가로 크기
	 * @param {Number} h		- thumbnail 세로 크기
	 * @param {Boolean} popup	- 상세보기 팝업 여부
	 */
	_makeThumbImageRatio : function(fileInfo, targetId, w, h, popup) {
		var fileId = fileInfo.fileId;
		var fileNm = fileInfo.fileNm;
		var title = "Popup";
		if (fileNm) title += " [" + fileNm + "]";
		
		var ratio = w / h;
	
		if (!targetId) return;
		var targetObj = $("#"+targetId);
		//if (!targetObj || targetObj.length == 0) return;
		 
		var thumbHtml = '';
		var popupHtml = '';
		if (popup) {
			popupHtml = ' style="cursor:pointer" onclick="CommonService.imageView(\'' + fileId + '\');" alt="'+ title +'" title="'+ title +'"'; 
		};
		
		var img = new Image();
		img.onload = function() {
			var sizeObj = CommonService._calcImageRatio(w, h, this.width, this.height);
			
			thumbHtml = '<img src="'+ this.src + '" width="'+ sizeObj.w + '" height="' + sizeObj.h + '"' + popupHtml + ' />';
			targetObj.html(thumbHtml);
		}
		img.onerror = function() {
			var src = contextPath + '/images/img_nf.png';
			thumbHtml = '<img src="'+ src + '" width="'+ w + '" height="' + h + '" alt="No image" title="No image" />';
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
	 * @param {String} fileId	- 이미지 파일 ID
	 * @param {String} targetId	- 이미지가 보여질 영역의 ID
	 * @param {Number} w		- thumbnail 가로 크기
	 * @param {Number} h		- thumbnail 세로 크기
	 * @param {Boolean} popup	- 상세보기 팝업 여부
	 */
	_makeThumbImage : function(fileId, targetId, w, h, popup) {
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
			 popupHtml = ' style="cursor:pointer" onclick="CommonService.imageView(\'' + fileId + '\');"'; 
		};
		img.onload = function() {
			thumbHtml = '<img src="'+ this.src + '" width="'+ width + '" height="' + height + '"' + popupHtml + ' />';
			targetObj.html(thumbHtml);
		}
		img.onerror = function() {
			this.src = contextPath + '/images/img_nf.png';
			thumbHtml = '<img src="'+ this.src + '" width="'+ width + '" height="' + height + '"/>';
			targetObj.html(thumbHtml);
		}
		
		//return thumbHtml;
	},
	/**
	 * 파일 업로드, 다운로드, 이미지 상세보기 팝업, 삭제, 이미지 Preview등을 처리한다.
	 * @param {Object} fileInfo	- 파일정보(사이즈,경로,blob 등등)
	 * @param {Object} options	- 아래 options 내용 참조
	 * @param {Function} callback - 이미지 업로드시 호출되는 callback 함수(Validation 체크등에 활용)
	 */
	displayFileAttachInfo : function(fileInfo, options, callback) {
		// options {
		//		formId : 'imgFileId',				// (*)필수 입력정보 Form ID (DB Object Model)
		//		targetId : 'imageFileDiv',			// 정보를 보여줄 영역 ID,		default : formId+'Div'
		//		uploadFormId : 'imgFileIdUpload',	// 파일 업로드 ID, 			defulat : formId+'Upload'
		//		uploadBtnName : 'Image',			// 파일 업로드 버튼 Name,		default : 'Upload'
		//		accept : '.jpg,.gif,.png',			// 파일 선택 포맷종류,			default : *
		//		enableDownload : true,				// 다운로드 가능 여부,			default : true
		//		enableDelete : true,				// 파일 삭제 가능 여부,		default : true
		//		enableUpload : true	,				// 업로드 가능 여부,			default : true
		//		downloadMode : 'popup',				// 다운로드 모드,			default : [P|p|popup], [D|d|down) , 기타(동작안함)
		//		imageCheck : false,					// 실제 이미지 파일형식인지 체크,	default : false
		//		showUploadingFileName : true,		// 업로딩중인 파일명 표시 여부,	default : true
		//		showUploadedFileName : true,		// 업로드완료된 파일명 표시 여부, 	default : true
		//		preview : {							// 미리보기 관련 옵션 설정,		default : none
		//			enable : true,					// 미리보기 가능 여부
		//			enablePopup : true,				// 이미지 상세보기,			default : true
		//			targetId : "imgPreview",		// 미리보기 target영역 ID	
		//			width : 113,					// 미리보기 가로 사이즈
		//			height : 151					// 미리보기 세로 사이즈	
		//		}
		// }
		// callback(fileObj) : 파일업로드 완료후 실행할 callback 함수
		// fileObj { 								// 기존 파일 Object외에 추가된 항목
		//		width, 								// 가로 사이즈
		//		height,								// 세로 사이즈
		//		options,							// 파일 업로드시 설정된 options값+
		//		remove								// 업로드 파일 삭제하기(바로보기, 파일표시, 파일Object)등 삭제
		// }
		// 
		
		// ===== 옵션 설정 =====
		var formId = options.formId;
		var targetId = options.targetId || formId+'Div';
		var uploadFormId = options.uploadFormId || formId+'Upload';
		var uploadFormName = options.uploadFormName || uploadFormId;
		var fileInfoId = formId+'FileInfo';
		var accept = options.accept || '*';
		var uploadBtn = formId+'UploadBtn';
		var uploadBtnName = options.uploadBtnName || "Upload";
		var uploadFileName = formId+'UploadName';
		var deleteBtnId = formId+'DeleteBtn';
		var enableUpload = options.hasOwnProperty('enableUpload')?options.enableUpload : true;
		var enableDownload = options.hasOwnProperty('enableDownload')?options.enableDownload : true;
		var enableDelete = options.hasOwnProperty('enableDelete')?options.enableDelete : true;
		var downloadMode = options.hasOwnProperty('downloadMode')?options.downloadMode : "popup";
		var imageCheck = options.hasOwnProperty('imageCheck')?options.imageCheck : false;
		
		var showUploadingFileName = options.hasOwnProperty('showUploadingFileName')?options.showUploadingFileName : true;
		var showUploadedFileName = options.hasOwnProperty('showUploadedFileName')?options.showUploadedFileName : true;
		
		var preview = options.hasOwnProperty('preview')?options.preview : {};
		preview.enablePopup = preview.hasOwnProperty('enablePopup')?preview.enablePopup : true;
		
		options.targetId = targetId;
		options.uploadFormId = uploadFormId;
		options.uploadFormName = uploadFormName;
		options.fileInfoId = fileInfoId;
		options.accept = accept;
		options.uploadBtn = uploadBtn;
		options.uploadBtnName = uploadBtnName;
		options.uploadFileName = uploadFileName;
		options.deleteBtnId = deleteBtnId;
		options.enableUpload = enableUpload;
		options.enableDownload = enableDownload;
		options.enableDelete = enableDelete;
		options.downloadMode = downloadMode;
		options.imageCheck = imageCheck;
		options.showUploadingFileName = showUploadingFileName;
		options.showUploadedFileName = showUploadedFileName;
		options.preview = preview;
		options.acceptList = CommonService._toAcceptList(accept); 
		
		var html = '';
		
		// ===== 파일 업로드 환경 설정 =====
		if (enableUpload) {
			var fileInfoShowProp = 'readonly';
			if (!showUploadingFileName) {
				fileInfoShowProp = ' type="hidden"';
				html = '<p class="data_info" style="display:none;">';
			} else {
				html = '<p class="data_info">';
			}
			
			html += '<input accept="'+accept+'" style="display:none;" type="file" name="'+uploadFormName+'" id="'+uploadFormId+'">'
				+ '<input id="'+uploadFileName+'" class="Textinput" ' + fileInfoShowProp + '>'
				+ '</p>'
				+ ' <button class="Button01 btn_line_gray" data-type="button" data-converted="true" type="button" id="'+uploadBtn+'">'+uploadBtnName+'</button>'
				;
		}
		
		// ===== 미리보기 환경 설정 =====
		if (preview.enable) {
			var newSize = CommonService._resizePreviewDiv(targetId, preview.width, preview.height);
			preview.width	= newSize.w;
			preview.height	= newSize.h;
		}
		
		// ===== 파일 정보 보기 설정 =====
		if (fileInfo && fileInfo.fileId) {
			// -- file download 설정 -- 
			var fileDispHtml = '';
			var fileDispNm = '<span class="file">' + fileInfo.fileNm + '</span>';
			if (showUploadedFileName) fileDispHtml = fileDispNm;
			if (enableDownload) {
				downloadMode = downloadMode.toLowerCase();
				if (downloadMode === 'd' || downloadMode === 'down' || downloadMode === 'download') fileDispHtml = '<a class="link2" href="' + contextPath + '/fileDownload.do?file='+fileInfo.fileId+'" title="Download">'+fileDispNm+'</a>';
				else if (downloadMode === 'p' || downloadMode === 'pop' || downloadMode === 'popup') fileDispHtml = '<a class="link2" onclick="CommonService.imageView(\'' + fileInfo.fileId + '\');return false;" title="Popup">'+fileDispNm+'</a>';
			}
			// -- file download --
			
			// -- file delete 설정 --	
			var fileDelHtml = '';
			if (enableDelete) {
				fileDelHtml = '<span class="t_del_txt"><img src="/statics/images/icon_delete.png" title="delete" alt="delete" id="'+deleteBtnId+'"></span>';
			}
			// -- file delete --
			
			html += ' <span id="'+fileInfoId+'"> '
    			+ '<input type="hidden" id="'+formId+'" name="'+formId+'" value="'+fileInfo.fileId+'">'
    			+ fileDispHtml
				+ fileDelHtml
				+ '</span>';
			
			if (preview.enable) {
				CommonService._makeThumbImageRatio(fileInfo, preview.targetId, preview.width, preview.height, preview.enablePopup);
			}
		}
		
		// 해당 영역에 위 설정에 따른 기능 적용
		$("#"+targetId).append(html);
		
		// ===== 삭제 환경 설정 =====
		if (fileInfo && fileInfo.fileId) {
			if (enableDelete) {
				$("#"+deleteBtnId).on("click", function(e) {
					e.preventDefault();
					//$(this).closest('span').remove();
					if (preview.hasOwnProperty('targetId')) $("#"+preview.targetId).html('');
					$("#"+fileInfoId).remove();
				});
			}
		}
		
		// ===== 업로드 환경 설정 =====
		if (enableUpload) {
			$("#"+uploadFileName).on("click", function() { $("#"+uploadFormId).click(); });
			$("#"+uploadBtn).on("click", function() { $("#"+uploadFormId).click(); });
			$("#"+uploadFormId).on("change", function() {
				
				var fileObj = this.files[0];
				if (!fileObj) return;
				
				//업로드한 파일 객체 제거 함수 정의
				fileObj.remove = function() {
					$("#"+preview.targetId).html('');
		   			$("#"+uploadFormId).val('');
		   			$("#"+uploadFileName).val('');
				}
				
				$("#"+uploadFileName).val(fileObj.name);
				//// ==========================================================
				// upload할 file의 form options 정보를 저장
				// 필요이유 : file을 삭제한다거나 할때 업로드한 form 정보가 필요하다.
				fileObj.options = options;
				//// ==========================================================
				
				
				//// ==========================================================
				// 파일 확장자 체크
				if (options.acceptList && options.acceptList.length > 0) {
					if (options.acceptList.indexOf('*') < 0) {
						var re = /(?:\.([^.]+))?$/;
						var ext = re.exec(fileObj.name)[1];
						
						if (!ext) {
							// 파일 확장자가 없으면 경고
							// 경고 메지시를 DB에서 읽어들이려면 검토 필요(meta 파일에 정의 혹은 option에 정의 등)
							if (LANG === 'en') alert("File extension type not found.");
							else if (LANG === 'ko') alert("파일 확장자 타입을 찾을 수 없습니다.");
							else alert("无法找到文件扩展者类型.");
							
							fileObj.remove();
							return null;
						}
						if (options.acceptList.indexOf(ext.toLowerCase()) < 0) {
							// 파일 확장자가 accept에 포함되지 않는 경우 경고
							// 경고 메지시를 DB에서 읽어들이려면 검토 필요(meta 파일에 정의 혹은 option에 정의 등)
							if (LANG === 'en') alert('Unspecified file extension type. : ' + ext);
							else if (LANG === 'ko') alert('지정되지 않은 파일 확장자 타입입니다. : ' + ext);
							else alert("未指定文件扩展者类型. : " + ext);
							
							fileObj.remove();
							return null;
						}
					}
				}
				//// ==========================================================
				
				// 실제 이미지인지 아닌지를 체크한다.
				if (options.imageCheck && fileObj.type.indexOf("image") < 0) {
					if (LANG === 'en') alert('Not in image format. : ' + fileObj.type);
					else if (LANG === 'ko') alert('이미지 형식이 아닙니다. : ' + fileObj.type);
					else alert("不是形象形式。 : " + fileObj.type);
					//alert("[" + fileObj.name + " : " + fileObj.type + "] Not image type.");
	   	    		fileObj.remove();
	   	    		return null;
	   	    	}
				//// ==========================================================
				
				if (fileObj.type.indexOf("image") >= 0) {
					var _IMG_URL = window.URL || window.webkitURL;
					var img = new Image();
					var objectUrl = _IMG_URL.createObjectURL(fileObj);
					
					img.onload = function() {
						fileObj.width = this.width;
						fileObj.height = this.height;
						
						_IMG_URL.revokeObjectURL(objectUrl);
						
						// 이미지가 삭제되었거나, 이미지가 없는 경우도 포함
						if (preview.enable) {
							var tw = preview.width || this.width;
							var th = preview.height || this.height;
							var sizeObj = CommonService._calcImageRatio(tw, th, this.width, this.height);
							
							CommonService._previewImageUrl(fileObj, function(src) {
								var thumbHtml = '<img src="'+ src + '" width="'+ sizeObj.w + '" height="' + sizeObj.h + '" />';
								if ($("#"+options.uploadFormId)[0].files.length > 0 ) {
									$("#"+preview.targetId).html(thumbHtml);
								}
							});
						}
						
						// 이미지 업로드 완료후 callback 호출
						// 파일 Validation 체크 등등 처리
						if ( callback && typeof callback === "function" ) callback(fileObj);
					}
					img.onerror = function() {
						alert("[" + fileObj.name + " : " + fileObj.type + "] Imaging Error.");
						fileObj.remove();
					}
					img.src = objectUrl;
				} else {
					// 이미지외 파일 업로드 완료후 callback 호출
					// 파일 Validation 체크 등등 처리
					if ( callback && typeof callback === "function" ) callback(fileObj);
				}
			});
		}
	},
	/**
	 * 파일정보를 읽어서 옵션에 따른 파일 업로드/다운로드/미리보기/팝업/삭제 등의 기능을 처리한다.
	 * 서버로부터 파일정보를 읽어서 내부적으로 displayFileAttachInfo 함수 호출
	 * @param {Object} options	- 파일 처리를 위한 옵션들.
	 * 							- displayFileAttachInfo함수의 option 참조
	 * @param {Function} callback - 파일 업로드후 처리할 callback 함수
	 */
	setFileAttachInfo : function(options, callback) {
		if (!options.fileId) { this.displayFileAttachInfo({}, options, callback); return; }
		
		CommonService.getFileInfo(options.fileId, function(fileInfo) {
			CommonService.displayFileAttachInfo(fileInfo, options, callback);
		});
	},
	/**
	 * 파일아이디에 해당하는 파일 정보 반환
	 * @param {String} fileId 파일아이디
	 * @param {Function} callback 파일결과 처리 callback 함수
	 * @param {Object} options 전역처리 여부, 동기화여부 설정
	 * @return {void}
	 */
	getFileInfo : function(fileId, callback, options) {
		if (!fileId) return;
		var data = {"file" : fileId};
		
		if (!options) options = {};
		var async = options.hasOwnProperty("async")?options.async:true;
		var global = options.hasOwnProperty("global")?options.global:true;
		
		$.ajax({
			type: "post",
			cache : false,
			async : async,
			global : global,
			url: contextPath + "/fileInfo.do",
			data : data,
			success: function(json){	
				if (json != null && json.resultCode == WebError.OK){
					json.fileInfo.data = CommonService._getImgData(json.blob);
					if (callback && typeof callback === 'function') callback(json.fileInfo);
				}
			}
		});
	},
	/**
	 * 파일 blob Data로부터 browser에서 보기 가능한 이미지데이터로 변환
	 * @param {Object} blob	- 서버로부터 파일을 읽은 데이터
	 * @return {Object} browser에서 보기 가능한 이미지 데이터
	 */
	_getImgData : function(blob) {
		if (!blob) return null;
		var contents = blob.headers["Content-Type"];
		if (!contents || contents.length == 0) return null;
		var imgType = blob.headers["Content-Type"][0];
		if (imgType.indexOf("image") != 0) return null;
		var imgData = "data:"+imgType+";base64,"+blob.body; 
		return imgData;
	},
	/**
	 * 파일업로드시 설정한 accept 데이터를 분리하여 array list로 변환
	 * @param {String} accept	- 업로드 파일 종류(확장자 목록)
	 * @return {Array} 확정자 배열
	 */
	_toAcceptList : function(accept) {
		var acceptList = [];
		var re = /(?:\.([^.]+))?$/;
		
		if (accept !== '*') {
			var tmpArr = accept.replace(/[ ]/g, '').split(',');
			
			for (var i in tmpArr) {
				var ext = re.exec(tmpArr[i].toLowerCase())[1];
				if (ext) acceptList.push(ext);
			}
		}
		
		return acceptList;
	},
	/**
	 * Local 이미지 파일을 미리보기 하기 위한 처리 함수
	 * @param {Object} fileObj	- Local device로부터 읽어들인 파일 Object
	 * @param {Function} callback - 파일 읽기 완료 후, 처리 callback 함수
	 */
	_previewImageUrl : function(fileObj, callback) {
		var reader = new FileReader();
		reader.onload = function (e) {
			callback(e.target.result);
			//$("#"+target).attr('src', e.target.result);
		}
		reader.readAsDataURL(fileObj);
	},
	/**
	 * 팝업 처리 함수(GET 방식)
	 * @param {String} popupUrl	- 팝업시 호출될 주소
	 * @param {String} name		- popup browser 팝업명
	 * @param {Object} options	- 팝업 설정 옵션
	 */
	popup : function(popupUrl, name, options) {
		if (!options) options = {};
		
		var width = options.width || 500;
		var height = options.height || 700;
		var left = options.left || 300;
		var top = options.top || 200;
		var toolbar = options.toolbar || 'no';			// i.e, firefox
		var location = options.location || 'no';
		//var directories = options.directories || 'no';// no use
		var status = options.status || 'no';
		var menubar = options.menubar || 'no';
		var scrollbars = options.scrollbars || 'no';	// i.e firefox, opera
		var resizable = options.resizable || 'no';		// only i.e
		var fullscreen = options.fullscreen || 'no';	// only i.e
		var titlebar = options.titlebar || 'no';
		
		var props = 'width='+width
				+ ',height='+height
				+ ',left='+left
				+ ',top='+top
				+ ',toolbar='+toolbar
				+ ',location='+location
				//+ ',directories='+directories
				+ ',status='+status
				+ ',menubar='+menubar
				+ ',scrollbars='+scrollbars
				+ ',resizable='+resizable
				+ ',fullscreen='+fullscreen
				+ ',titlebar='+titlebar;
		
		var popupWin = window.open(popupUrl, name, props);
		popupWin.resizeTo(width, height) ;
	    
		// 팝업창의 크기가 고정이 안되는 경우 처리
	    if (resizable === "no") {
		    $(popupWin).resize(function(e) {
		    	e.stopPropagation();
		    	e.preventDefault();
		    	popupWin.resizeTo(width, height) ;
	  		});
	    }
	},
	/**
	 * 팝업 처리 함수(POST 방식)
	 * @param {String} popupUrl	- 팝업시 호출될 주소
	 * @param {String} name		- popup browser 팝업명
	 * @param {Object} options	- 팝업 설정 옵션
	 * @param {Object} params	- POST 처리시 전달할 parameter들
	 */
	postPopup : function(popupUrl, name, options, params) {
		if (!options) options = {};
		
		var width = options.width || 500;
		var height = options.height || 700;
		var left = options.left || 300;
		var top = options.top || 200;
		var toolbar = options.toolbar || 'no';			// i.e, firefox
		var location = options.location || 'no';
		//var directories = options.directories || 'no';// no use
		var status = options.status || 'no';
		var menubar = options.menubar || 'no';
		var scrollbars = options.scrollbars || 'no';	// i.e firefox, opera
		var resizable = options.resizable || 'no';		// only i.e
		var fullscreen = options.fullscreen || 'no';	// only i.e
		var titlebar = options.titlebar || 'no';
		
		var props = 'width='+width
				+ ',height='+height
				+ ',left='+left
				+ ',top='+top
				+ ',toolbar='+toolbar
				+ ',location='+location
				//+ ',directories='+directories
				+ ',status='+status
				+ ',menubar='+menubar
				+ ',scrollbars='+scrollbars
				+ ',resizable='+resizable
				+ ',fullscreen='+fullscreen
				+ ',titlebar='+titlebar;
		
		var popupWin = window.open('', name, props);
		
		new CommonForms(popupUrl)
			.createForm("_postTempForm")	// 임시 폼 생성
			.setElements(params)			// 파마미터 설정
			.submit('post', name);    		// POST 처리
		
		popupWin.resizeTo(width, height) ;
	
		// 팝업창의 크기가 고정이 안되는 경우 처리
	    if (resizable === "no") {
		    $(popupWin).resize(function(e) {
		    	e.stopPropagation();
		    	e.preventDefault();
		    	popupWin.resizeTo(width, height) ;
	  		});
	    }
	},
	
	/**
	 * Static한 파일 다운로드 (주로 양식 파일 다운로드에 사용)
	 * @param {String} docNo	- 다운로드에 사용될 문서 식별 번호
	 */
	documentDownload : function(docNo) {
		var filename = null;
		if (docNo === "WL_DOC_000_ZH")		filename = '(중국어)구성원 정보보호 서약서(법무 검토 완료 버전)_2020-05-12.docx';
		else if (docNo === "WL_DOC_000_KO")	filename = '(한국어)구성원 정보보호 서약서(법무 검토 완료 버전)_2020-05-12.docx';
		else if (docNo === "WL_DOC_001")	filename = '1.회원_가입시_방문객_보안서약서-注册会员时的访客保安誓约书-(법무 검토 완료 버전)_2020-05-19.docx';
		else if (docNo === "WL_DOC_002")	filename = '2.개인정보_수집_및_이용_동의서-个人信息收集及使用同意书-（법무 검토 완료 버전)_2020-05-19.docx';
		else if (docNo === "WL_DOC_003")	filename = '3_위치정보_수집이용에_관한_동의서-位置信息收集使用相关同意书-（법무 검토 완료 버전)_2020-05-19.docx';
		else if (docNo === "WL_DOC_004")	filename = '(Form)代表管理者保安承诺书_대표자관리자보안서약서.docx';
		else if (docNo === "WL_DOC_005")	filename = '(Form)代表管理者委任状_대표관리자위임장.docx';
		else if (docNo === "WL_DOC_006")	filename = '(Form)指纹电梯保安备忘录_지문엘리베이터보안각서.xlsx';
		else if (docNo === "WL_DOC_007")	filename = '(Form)指纹电梯使用安全标准_지문엘리베이터사용안전기준.xlsx';
		else alert('File not found.');
		
		if (filename) CommonService.download(contextPath+'/statics/docs/' + filename);
	},
	/**
	 * url에서 filename과 mimetype으로 다운로드
	 * filename이 없는 경우 url에서 파일명을 추출
	 * mimetype이 없는 경우, 기본값 : application/octet-stream
	 * @param {String} url		- 다운로드 파일의 경로
	 * @param {String} filename	- 다운로드 파일명(없으면 경로에 포함된 파일명)
	 * @param {String} mimetype	- 다운로드할 파일의 mimetype
	 */
	download : function(url, filename, mimetype) {
		if (!url) return;
		//if (!filename) filename = url.replace(/[\#\?].*$/,'');
		if (!filename) filename = url.split('/').pop().split('#')[0].split('?')[0];
		
		var x=new XMLHttpRequest();
   		x.open("GET", contextPath + url, true);
   		x.responseType = 'blob';
   		x.onload=function(e){CommonService._download(x.response, filename, mimetype); }
   		x.send();
   	},
	 /** download.js v3.0, by dandavis; 2008-2014. [CCBY2] see http://danml.com/download.html for tests/usage
	  * v1 landed a FF+Chrome compat way of downloading strings to local un-named files, upgraded to use a hidden frame and optional mime
	  * v2 added named files via a[download], msSaveBlob, IE (10+) support, and window.URL support for larger+faster saves than dataURLs
	  * v3 added dataURL and Blob Input, bind-toggle arity, and legacy dataURL fallback was improved with force-download mime and base64 support
	  *
	  * @param {Object} data		- data can be a string, Blob, File, or dataURL
	  * @param {String} strFileName	- 다운로드 파일명
	  * @param {String} strMimeType	- mimetype이 없는 경우, 기본값 : application/octet-stream
	  */ 
	_download : function(data, strFileName, strMimeType) {
	 	var self = window, // this script is only for browsers anyway...
	 		u = "application/octet-stream", // this default mime also triggers iframe downloads
	 		m = strMimeType || u, 
	 		x = data,
	 		D = document,
	 		a = D.createElement("a"),
	 		z = function(a){return String(a);},
	 		
	 		B = self.Blob || self.MozBlob || self.WebKitBlob || z,
	 		BB = self.MSBlobBuilder || self.WebKitBlobBuilder || self.BlobBuilder,
	 		fn = strFileName || "download",
	 		blob, 
	 		b,
	 		ua,
	 		fr;

	 	//if(typeof B.bind === 'function' ){ B=B.bind(self); }
	 	
	 	if(String(this)==="true"){ //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
	 		x=[x, m];
	 		m=x[0];
	 		x=x[1]; 
	 	}
	 	
	 	//go ahead and download dataURLs right away
	 	if(String(x).match(/^data\:[\w+\-]+\/[\w+\-]+[,;]/)){
	 		return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
	 			navigator.msSaveBlob(d2b(x), fn) : 
	 			saver(x) ; // everyone else can save dataURLs un-processed
	 	}//end if dataURL passed?
	 	
	 	try{
	 		blob = x instanceof B ? 
	 			x : 
	 			new B([x], {type: m}) ;
	 	}catch(y){
	 		if(BB){
	 			b = new BB();
	 			b.append([x]);
	 			blob = b.getBlob(m); // the blob
	 		}
	 	}
	 	
	 	function d2b(u) {
	 		var p= u.split(/[:;,]/),
	 		t= p[1],
	 		dec= p[2] == "base64" ? atob : decodeURIComponent,
	 		bin= dec(p.pop()),
	 		mx= bin.length,
	 		i= 0,
	 		uia= new Uint8Array(mx);

	 		for(i;i<mx;++i) uia[i]= bin.charCodeAt(i);

	 		return new B([uia], {type: t});
	 	 }
	 	  
	 	function saver(url, winMode){
	 		if ('download' in a) { //html5 A[download] 			
	 			a.href = url;
	 			a.setAttribute("download", fn);
	 			a.innerHTML = "downloading...";
	 			D.body.appendChild(a);
	 			setTimeout(function() {
	 				a.click();
	 				D.body.removeChild(a);
	 				if(winMode===true){setTimeout(function(){ self.URL.revokeObjectURL(a.href);}, 250 );}
	 			}, 66);
	 			return true;
	 		}
	 		
	 		//do iframe dataURL download (old ch+FF):
	 		var f = D.createElement("iframe");
	 		D.body.appendChild(f);
	 		if(!winMode){ // force a mime that will download:
	 			url="data:"+url.replace(/^data:([\w\/\-\+]+)/, u);
	 		}
	 	
	 		f.src = url;
	 		setTimeout(function(){ D.body.removeChild(f); }, 333);
	 		
	 	}//end saver 
	 	
	 	if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
	 		return navigator.msSaveBlob(blob, fn);
	 	} 	
	 	
	 	if(self.URL){ // simple fast and modern way using Blob and URL:
	 		saver(self.URL.createObjectURL(blob), true);
	 	}else{
	 		// handle non-Blob()+non-URL browsers:
	 		if(typeof blob === "string" || blob.constructor===z ){
	 			try{
	 				return saver( "data:" +  m   + ";base64,"  +  self.btoa(blob)  ); 
	 			}catch(y){
	 				return saver( "data:" +  m   + "," + encodeURIComponent(blob)  ); 
	 			}
	 		}
	 		
	 		// Blob but not URL:
	 		fr=new FileReader();
	 		fr.onload=function(e){
	 			saver(this.result); 
	 		};
	 		fr.readAsDataURL(blob);
	 	}	
	 	return true;
	 } /* end download() */
}
