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
		//		popupProps :						// popup window features 
		//		preview : {							// 미리보기 관련 옵션 설정,		default : none
		//			enable : true,					// 미리보기 가능 여부
		//			enablePopup : true,				// 이미지 상세보기,			default : true
		//			targetId : "imgPreview",		// 미리보기 target영역 ID	
		//			width : 113,					// 미리보기 가로 사이즈
		//			height : 151					// 미리보기 세로 사이즈	
		//		},
		//		--------------------------------------------------------------------------------------
		//		--- 아래 두 항목은 Filters를 사용할 경우 적용되는 항목임
		//		--- 참조 : common_filters.js
		//		filterOption : 						// 필터를 사용할 경우의 옵션
		//		--------------------------------------------------------------------------------------
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
		
		var popupProps = options.hasOwnProperty('popupProps')?options.popupProps: '';
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
		options.popupProps = popupProps;
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
				+ '<input id="'+uploadFileName+'" name="dispFileName" class="Textinput" ' + fileInfoShowProp + ' onfocus="this.blur()">'
				+ '</p>'
				+ ' <button class="Button01 btn_line_gray" data-type="button" data-converted="true" type="button" id="'+uploadBtn+'">'+uploadBtnName+'</button>'
				;
		}
		
		// ===== 미리보기 환경 설정 =====
		if (preview.enable) {
			var pDivObj = CommonService._resizePreviewDiv(targetId, preview.width, preview.height);
			preview.width		= pDivObj.w;
			preview.height		= pDivObj.h;
			preview.targetId	= pDivObj.imageDivId;
		}
		
		// ===== 파일 정보 보기 설정 =====
		if (fileInfo && fileInfo.fileId) {
			// -- file download 설정 -- 
			var fileDispHtml = '';
			var fileDispNm = '<span class="file">' + fileInfo.fileNm + '</span>';
			if (showUploadedFileName) fileDispHtml = fileDispNm;
			if (enableDownload) {
				downloadMode = downloadMode.toLowerCase();
				if (downloadMode === 'd' || downloadMode === 'down' || downloadMode === 'download') fileDispHtml = CommonService.makeFileDownloadUrl(fileInfo.fileId, fileDispNm);
				else if (downloadMode === 'p' || downloadMode === 'pop' || downloadMode === 'popup') fileDispHtml = CommonService.makeImagePopupUrl(fileInfo.fileId, fileDispNm, popupProps);
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
				CommonService._makeThumbImageRatio(fileInfo, preview.targetId, preview.width, preview.height, preview.enablePopup, popupProps, true);
			}
		}
		
		// 해당 영역에 위 설정에 따른 기능 적용
		$("#"+targetId).append(html);
		
		// validation 방식을 필터를 사용할지 여부
		// 만약, 필터를 사용하면 현재 element를 필터에서 사용할 수 있도록 등록한다.
		if (!$.isEmptyObject(options.filterOption)) {
			var filterObj = $("#"+targetId).find("input[name='"+uploadFormName+"']");
			if (typeof filterObj.valid === 'function') filterObj.valid(options.filterOption);
		}
		
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
				if (!fileObj) {
					$("#"+uploadFileName, $("#"+targetId)).val('');
					if (preview.enable) $(".image", $("#"+targetId)).html('');
					
					return;
				}
				
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
							
							// ------------------------------------------------------------
							// 이미지 미리보기 영역의 크기를 이미지 사이즈에 맞출것인지 여부 
							CommonService._previewImageUrl(fileObj, function(src) {
								if ($("#"+options.uploadFormId)[0].files.length > 0 ) {
									CommonService._fitImageDiv(preview.targetId, sizeObj.w, sizeObj.h);
									var thumbHtml = '<img src="'+ src + '" width="'+ sizeObj.w + '" height="' + sizeObj.h + '" />';
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
				} else {
					if (callback && typeof callback === 'function') callback(null);
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
	 * 			width		=	창 가로 크기
	 *			height		=	창 세로 크기
	 *			top			=	창 TOP 위치
	 *			left		=	창 LEFT 위치
	 *			toolbar		=	toolbar 여부 (IE, firefox)
	 *			location	=	웹경로표시 (오페라에서만작동)
	 *			directories	=	현재 사용되지 않음
	 *			status		=	상태바 여부	
	 *			menubar		=	메뉴바 여부	
	 *			resizable	=	창크기변경 여부 (IE에서만작동)
	 *			scrollbars	=	스크롤바사용여부 (IE,Firefox,Opera)
	 *			titlebars	=	타이블바 여부 (대부분 표시됨), HTML응용프로그램은 거의대부분 'yes'
	 *			fullscreen	=	전체화면모드 (IE)
	 */
	popup : function(popupUrl, name, options) {
		if (!options) options = {};

		//-------------------------------------------------------------------------------------------
		// 듀얼 모니터를 고려하여 계산
		var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
	    var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
	    var dw = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
	    var dh = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.availHeight;
	    //-------------------------------------------------------------------------------------------
	    
	    var width = parseInt(options.width || 600);
		var height = parseInt(options.height || 800);
		if (width > screen.width) width = screen.width;		// 만일, 설정값의 팝업윈도우 넓이가 모니터의 크기보다 큰경우
		if (height > screen.availHeight) height = screen.availHeight;	// 만일, 설정값의 팝업윈도우 높이가 모니터의 크기보다 큰경우
		//if (height > screen.height) height = screen.height;	// 만일, 설정값의 팝업윈도우 높이가 모니터의 크기보다 큰경우
		
		//----------계산방법 1-----------
		var left = options.left || (dw - width) / 2 + dualScreenLeft;	// 모니터 배율 설정값이 100%가 아닌경우 위치가 정확히 계산안된다.
		var top = options.top || (screen.availHeight - height)/2 + window.screenY; // 높이가 상황에 따라서 -가 나오는경우때문에( 듀얼 모니터 위치때문)
		//var top = options.top || (dh - height) / 2; // + dualScreenTop;	// 높이가 상황에 따라서 -가 나오는경우때문에( 듀얼 모니터 위치때문)
		//----------계산방법 2-----------
		//var left = options.left || window.screenX + (screen.width / 2) - (width / 2);
		//var top =  options.right || (screen.height / 2) - (height / 2);
 	  	//----------계산방법 3-----------
		//var left = options.left || (screen.width - width)/2;
		//var top = options.top || (screen.height - height)/2;
		
		// 팝업이 동시에 여러개 오픈되는 경우,(특히, 공지 팝업에서 주로 사용)
		if (options.space) {
			if (!this.first_left) this.first_left = left;	// 최초 left위치 기억
			if (!this.first_top) this.first_top = top;		// 최초 top위치 기억
			
			// 간격을 띄우기 위한 정보가 있다면, 최초 설정위치에서, 설정된 간격 만큼 popup 위치 변경 
			if (options.space.left) left = this.first_left + options.space.left;
			if (options.space.top) top = this.first_top + options.space.top;
			//if (options.space.left) left = left + options.space.left;
			//if (options.space.top) top = top + options.space.top;
		}
		
		var toolbar = options.toolbar || 'no';			// i.e, firefox
		var location = options.location || 'no';
		var directories = options.directories || 'no';// no use
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
				+ ',directories='+directories
				+ ',status='+status
				+ ',menubar='+menubar
				+ ',scrollbars='+scrollbars
				+ ',resizable='+resizable
				+ ',fullscreen='+fullscreen
				+ ',titlebar='+titlebar;
		
		// 팝업창 이름이 없는 경우
		if (!name) name = ''; 
		
		// popup창의 resizable 설정
		if (popupUrl.indexOf('?') < 0) popupUrl += '?resizable='+resizable;
		else popupUrl += '&resizable='+resizable;
		
		var popupWin = window.open(popupUrl, name, props);
		popupWin.resizeTo(width, height) ;
	    
		// 팝업창의 크기가 고정이 안되는 경우 처리
	    if (resizable.toLowerCase() === "no" || resizable === "0") {
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
	 * @param {String} winName	- popup browser 팝업명(윈도우 이름)
	 * @param {Object} options	- 팝업 설정 옵션
	 * @param {Object} params	- POST 처리시 전달할 parameter들
	 */
	postPopup : function(popupUrl, winName, options, params) {
		if (!options) options = {};

		//-------------------------------------------------------------------------------------------
		// 듀얼 모니터를 고려하여 계산
		var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
	    var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
	    var dw = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
	    var dh = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.availHeight;
	    //-------------------------------------------------------------------------------------------
	    
	    var width = parseInt(options.width || 600);
		var height = parseInt(options.height || 800);
		if (width > screen.width) width = screen.width;		// 만일, 설정값의 팝업윈도우 넓이가 모니터의 크기보다 큰경우
		if (height > screen.availHeight) height = screen.availHeight;	// 만일, 설정값의 팝업윈도우 높이가 모니터의 크기보다 큰경우
		//if (height > screen.height) height = screen.height;	// 만일, 설정값의 팝업윈도우 높이가 모니터의 크기보다 큰경우
		
		//----------계산방법 1-----------
		var left = options.left || (dw - width) / 2 + dualScreenLeft;	// 모니터 배율 설정값이 100%가 아닌경우 위치가 정확히 계산안된다.
		var top = options.top || (screen.availHeight - height)/2 + window.screenY; // 높이가 상황에 따라서 -가 나오는경우때문에( 듀얼 모니터 위치때문)
		//var top = options.top || (dh - height) / 2; // + dualScreenTop;	// 높이가 상황에 따라서 -가 나오는경우때문에( 듀얼 모니터 위치때문)
		//----------계산방법 2-----------
		//var left = options.left || window.screenX + (screen.width / 2) - (width / 2);
		//var top =  options.right || (screen.height / 2) - (height / 2);
 	  	//----------계산방법 3-----------
		//var left = options.left || (screen.width - width)/2;
		//var top = options.top || (screen.height - height)/2;
		
		// 팝업이 동시에 여러개 오픈되는 경우,(특히, 공지 팝업에서 주로 사용)
		if (options.space) {
			if (!this.first_left) this.first_left = left;	// 최초 left위치 기억
			if (!this.first_top) this.first_top = top;		// 최초 top위치 기억
			
			// 간격을 띄우기 위한 정보가 있다면, 최초 설정위치에서, 설정된 간격 만큼 popup 위치 변경 
			if (options.space.left) left = this.first_left + options.space.left;
			if (options.space.top) top = this.first_top + options.space.top;
			//if (options.space.left) left = left + options.space.left;
			//if (options.space.top) top = top + options.space.top;
		}
		
		var toolbar = options.toolbar || 'no';			// i.e, firefox
		var location = options.location || 'no';
		var directories = options.directories || 'no';// no use
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
				+ ',directories='+directories
				+ ',status='+status
				+ ',menubar='+menubar
				+ ',scrollbars='+scrollbars
				+ ',resizable='+resizable
				+ ',fullscreen='+fullscreen
				+ ',titlebar='+titlebar;
		
		// 윈도우 이름이 없으면 랜덤하게 생성
		if (!winName) winName = Common.randomKey(32);
		// 임시 폼에 사용할 이름
		var randomFormName = Common.randomKey(16);
		
		// 윈도우에서 popup url에 붙어 있는 query string을 json으로 변환
		var urlParams = Common.queryStringToJson(popupUrl);
		// url에서 query string 제거
		if (popupUrl.indexOf('?') > -1){
			popupUrl = popupUrl.split('?')[0];
		}
		// url에서 추출한 param과, 인수로 넘겨진 param 합치기
		var allParams = $.extend({}, params, urlParams);
		// 합친 param에 resizable 옵션 추가
		// (이렇게 하는 이유는, popup window에서 새로고침할 경우, resizable = no 의 설정이 풀려버림(특히, chrome에서)
		allParams["resizable"] = resizable;
		
		// 윈도우 생성
		var popupWin = window.open('', winName, props);
		// post 방식으로  생성된 윈도우에 url 호출
		new CommonForms(popupUrl)
			.createForm(randomFormName)	// 임시 폼 생성
			.setElements(allParams)			// 파마미터 설정
			.submit('post', winName);    		// POST 처리
		
		popupWin.resizeTo(width, height) ;
	
		// 팝업창의 크기가 고정이 안되는 경우 처리
		if (resizable.toLowerCase() === "no" || resizable === "0") {
		    $(popupWin).resize(function(e) {
		    	e.stopPropagation();
		    	e.preventDefault();
		    	popupWin.resizeTo(width, height) ;
	  		});
	    }
	},
	
	/**
	 * Static한 파일 다운로드 (주로 양식 파일 다운로드에 사용)
	 * @param {String} docNo				- 다운로드에 사용될 문서 식별 번호
	 * @param {Boolean} saveOnly(i.e10+)	- 파일 다운로드 또는 열기 옵션 여부 
	 */
	documentDownload : function(docNo, saveOnly) {
		var filename = null;
		
		if (docNo === "WL_DOC_001")	filename = '';
		else if (docNo === "WL_DOC_002")	filename = '';
		else if (docNo === "WL_DOC_003")	filename = '(Form)__임시__계약업체변경관련서약서.docx';
		else if (docNo === "WL_DOC_004")	filename = '(Form)代表管理者保安承诺书_대표자관리자보안서약서.docx';
		else if (docNo === "WL_DOC_005")	filename = '(Form)代表管理者委任状_대표관리자위임장.docx';
		else if (docNo === "WL_DOC_006")	filename = '(Form)指纹电梯保安备忘录_지문엘리베이터보안각서.xlsx';
		else if (docNo === "WL_DOC_007")	filename = '(Form)指纹电梯使用安全标准_지문엘리베이터사용안전기준.xlsx';
		else if (docNo === "WL_DOC_008")	filename = '(Form)VIP访问申请书填写样式_VIP방문신청서양식.xlsx';
		else if (docNo === "WL_DOC_009")	filename = '(Form)施工出入申请书_시공출입신청서.xlsx';
		else if (docNo === "WL_DOC_010")	filename = '(Form)已搬入物品搬入申报_기반입 물품 반입 신고.xlsx';
		else if (docNo === "WL_DOC_011")	filename = '(Form)内部网OPEN申请样式_내부망 오픈 신청 양식.xlsx'; 
		else alert('File not found.');
		
		if (filename) CommonService.download(contextPath+'/statics/docs/' + docNo, filename, saveOnly);
	},
	/**
	 * url에서 filename과 mimetype으로 다운로드
	 * filename이 없는 경우 url에서 파일명을 추출
	 * mimetype이 없는 경우, 기본값 : application/octet-stream
	 * @param {String} url		- 다운로드 파일의 경로
	 * @param {String} filename	- 다운로드 파일명(없으면 경로에 포함된 파일명)
	 * @param {String} mimetype	- 다운로드할 파일의 mimetype
	 */
	download : function(url, filename, mimetype, saveOnly) {
		if (!url) return;
		//if (!filename) filename = url.replace(/[\#\?].*$/,'');
		if (!filename) filename = url.split('/').pop().split('#')[0].split('?')[0];
		
		var x=new XMLHttpRequest();
   		x.open("GET", contextPath + url, true);
   		x.responseType = 'blob';
   		x.onload=function(e){
   			if (x.status == 200) CommonService._download(x.response, filename, mimetype, saveOnly);
   			else if (x.status == 404) alert("File Not found.");
   			else alert("File download error.");
   		}
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
	_download : function(data, strFileName, strMimeType, saveOnly) {
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
	 		if (saveOnly) {
		 		return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
		 			navigator.msSaveBlob(d2b(x), fn) :
		 			saver(x) ; // everyone else can save dataURLs un-processed
	 		} else {
	 			return navigator.msSaveOrOpenBlob ?  // IE10 can't do a[download], only Blobs:
			 			navigator.msSaveOrOpenBlob(d2b(x), fn) :
			 			saver(x) ; // everyone else can save dataURLs un-processed
	 		}
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
	 	
	 	if (saveOnly) {
		 	if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
		 		return navigator.msSaveBlob(blob, fn);
		 	}
	 	} else {
	 		if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
		 		return navigator.msSaveOrOpenBlob(blob, fn);
		 	}
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
	}, /* end download() */
	/**
	 * eHR 시스템의 증명사진 보기
	 * @param {String} targetId	- 이미지(증명사진)가 보여질 영역
	 * @param {String} empId	- 구성원 아이디
	 * @param {Object} options	- 이미지 보기 옵션
	 */
	eHRPhotoView : function(targetId, empId, options) {
		if (!targetId) return;
		
		if (!options) options = {};
		var w = options.width || 90;
		var h = options.height || 120;
		
		var img = new Image();
		img.onload = function() {
			var sizeObj = CommonService._calcImageRatio(w, h, this.width, this.height);
			var pDivObj = CommonService._resizePreviewDiv(targetId, sizeObj.w, sizeObj.h);
			
			var targetObj = $("#"+pDivObj.imageDivId);
			
			//var downloadHtml = ' onclick="CommonService.eHRPhotoDownload(\'' + empId + '\');" title="download" style="cursor:pointer"';
			//var thumbHtml = '<img src="'+ this.src + '" width="'+ sizeObj.w + '" height="' + sizeObj.h + '" ' + downloadHtml + ' />';
			var thumbHtml = '<a href="http://skynet.skhynix.com.cn/plusware/main/popup/DownProfileImg.aspx?empNum=' + empId + '" title="* Click download">'
						+	'<img src="'+ this.src + '" width="'+ sizeObj.w + '" height="' + sizeObj.h + '" />'
						+	'</a>';
			targetObj.html(thumbHtml);
		}
		img.onerror = function() {
			var pDivObj = CommonService._resizePreviewDiv(targetId, w, h);
			var imgObj = CommonService.getErrImgObj(pDivObj.imageDivId, w, h);
			var targetObj = $("#"+pDivObj.imageDivId);
			
			var thumbHtml = '<img src="'+ imgObj.src + '" width="'+ imgObj.w + '" height="' + imgObj.h + '" alt="No image" title="No image" '+imgObj.style+' />';
			targetObj.html(thumbHtml);
		}
		//img.src = contextPath + "/common/image/display.do?fileid=4EB8D3A8-5CAF-426D-B408-6BE320D35C2D";
		img.src = 'http://skynet.skhynix.com.cn/plusware/main/popup/GetDataService.aspx?type=ORGUSERPROFILEIMG&empNum='+empId; 
	},
	/**
	 * 에러이미지 객체
	 * @param {String}	- 에러 이미지가 보여질 영역
	 * @param {Integer}	- 에러 이미지 가로 크기
	 * @param {Integer}	- 에러 이미지 세로 크기
	 * @param {Object}	- 에러 이미지 객체
	 * 		: w		- 가로 크기
	 * 		: h		- 세로 크기
	 * 		: src	- 이미지 경로
	 * 		: style	- 이미지를 가운데로 위치시기기 위한 스타일 정보
	 * 		: divW	- 이미지를 감싸고 있는 영역의 가로 크기
	 * 		: divH	- 이미지를 감싸고 있는 영역의 세로 크기
	 */
	getErrImgObj : function(targetId, w, h) {
		var src = contextPath + '/images/img_nf.png';
		var style = '';
		
		var margin = 4;
		var divW = 90;	// 이미지를 담고 있는 영역의 가로크기
		var divH = 90;	// 이미지를 담고 있는 영역의 세로크기
		// 만일, 대부분의 결재페이지등에서 사용할 영역이 image class를 가지고 있다면 가로크기와 세로 크기를 90X120으로 설정 
		if ($("#"+targetId).attr("class") == "image") { divW = 90, divH = 120; }
		
		var sizeObj = CommonService._calcImageRatio(w, h, divW, divW);
		var w = sizeObj.w - margin;	// 영역의 크기에 맞게 재 계산된 가로 크기
		var h = sizeObj.h - margin;	// 영역의 크기에 맞게 재 계산된 세로 크기
		
		// 이미지의 중앙에 맞추기
		if (divH > divW) style= 'style="margin-top:'+((divH-h)/2)+'px;"';
		else style= 'style="margin-left:'+((divW-w)/2)+'px;"';
		
		return {w:w, h:h, src:src, style:style, divW:divW, divH:divH};
	},
	/**
	 * eHR 시스템의 증명사진 다운로드
	 * @param {String} empId	- 구성원 아이디
	 * @param {String} fileName	- 다운로드 파일명
	 */
	eHRPhotoDownload : function(empId, fileName) {
		var link = document.createElement("a");
		//if (fileName) fileName = empId + ".png";
		//link.download = fileName;
		link.href = "http://skynet.skhynix.com.cn/plusware/main/popup/DownProfileImg.aspx?empNum="+empId;
		link.click(); 
	}
	
	
	// OLD Version
	/*eHRPhotoDownload : function(empId, fileName) {
		var img = new Image();
		var browserInfo = Common.detectBrowser();
		
		var mimeType = "image/png";
		if (!fileName) {
			fileName = empId+".png";
		} else {
			var re = /(?:\.([^.]+))?$/;
			var ext = re.exec(fileName)[1];
			if (!ext) ext = "png";
				
			mimeType = "image/"+ext;
		}
		
		img.onload = function() {
			var canvas = document.createElement("canvas");
			canvas.width = this.width;
			canvas.height = this.height;
			var ctx = canvas.getContext('2d');
			ctx.drawImage(this, 0, 0, this.width, this.height);
			
			if (browserInfo.isIE || browserInfo.isEdge || browserInfo.isEdgeChromium) {
				var blobImg = canvas.msToBlob();
				window.navigator.msSaveBlob(new Blob([blobImg], {type:mimeType}), fileName);
			} else {
				var link = document.createElement("a");
				link.download = fileName;
				link.href = canvas.toDataURL(mimeType);
				link.click(); 
			}
			
			canvas.remove();
		}
		img.onerror = function() {
			console.log("img error")
		}
		//img.src = contextPath + "/common/image/display.do?fileid=4FB8BDDA-F69C-41F6-A25C-CCF64488074C";
		//img.src = contextPath + "/common/image/display.do?fileid=48A4446F-71D3-495C-AE3F-2E2D060A5192";
		img.src = 'http://skynet.skhynix.com.cn/plusware/main/popup/GetDataService.aspx?type=ORGUSERPROFILEIMG&empNum='+empId
	},*/
}
