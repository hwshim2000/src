/**
 * 결재 서비스
 * @author X0114723 
 */
var ApprService = {
	apprFormId : '',
	empId : '',
	deptId : '',
	empNm : '',
	deptNm : '',
	jcCd : '',
	jwCd : '',
	
	/**
	 * 요청자 결재자 정보 표시
	 * @param {String} empId	- 구성원 아이디
	 * @param {String} empNm	- 구성원 이름
	 * @param {String} deptId	- 부서 아이디
	 * @param {String} deptNm	- 부서명
	 * @param {String} kind		- 부서 종류(요청(기안)부서:A,검토부서:C4,허가부서:D,참조부서:R)
	 * @param {String} clsType	- 결재 상태 CSS 클래스
	 * @param {String} jcCd		- 직책코드
	 * @param {String} jwCd		- 직위코드
	 * @return {String} 		- 구성원 HTML 폼
	 */
	getApprBtnHtml : function(empId, empNm, deptId, deptNm, kind, clsType, jcCd, jwCd) {
		var str = '<span class="'+clsType + '">'+ deptNm + ' ' +  empNm +'(' + empId +')</span> ';
		str += '<input type="hidden" name="apprEmpId"  value="'+empId+'">';
		str += '<input type="hidden" name="apprEmpNm"  value="'+empNm+'">';
		str += '<input type="hidden" name="apprDeptId" value="'+deptId+'">';
		str += '<input type="hidden" name="apprDeptNm" value="'+deptNm+'">';
		str += '<input type="hidden" name="apprKind"   value="'+kind+'"> ';
		str += '<input type="hidden" name="apprJcCd"   value="'+jcCd+'"> ';
		str += '<input type="hidden" name="apprJwCd"   value="'+jwCd+'"> ';	
	
		return str;
	},
	
	/**
	 * 추가 요청부서 결재자 정보 표시
	 * @param {Object} info		- 구성원 정보
	 * @param {String} kind		- 부서 종류(요청(기안)부서:A,검토부서:C4,허가부서:D,참조부서:R)
	 * @param {String} clsType	- 결재 상태 CSS 클래스
	 * @return {String} 		- 구성원 HTML 폼
	 */
	getApprAddBtnHtml : function(info, kind, clsType) {
		var empNm  = info.empNm;
		var deptNm = info.deptNm;
		
		if(LANG == "ko") {
			empNm  = info.empNmKo;
			deptNm = info.deptNmKo;
		}
		else if(LANG == "en") {
			empNm  = info.empNmEn;
			deptNm = info.deptNmEn;
		}
		
		//console.log("@@@ jcCd = " + info.jcCd);
		//console.log("@@@ jwCd = " + info.jwCd);
		
		var str = '<span class="'+clsType + '">'+ deptNm + ' ' +  empNm +'(' + info.empId +')</span> ';
		str += '<input type="hidden" name="apprEmpId"  value="'+info.empId+'">';
		str += '<input type="hidden" name="apprEmpNm"  value="'+empNm+'">';
		str += '<input type="hidden" name="apprDeptId" value="'+info.deptId+'">';
		str += '<input type="hidden" name="apprDeptNm" value="'+deptNm+'">';
		str += '<input type="hidden" name="apprKind"   value="'+kind+'"> ';
		str += '<input type="hidden" name="apprJcCd"   value="'+info.jcCd+'"> ';
		str += '<input type="hidden" name="apprJwCd"   value="'+info.jwCd+'"> ';
	
		return str;
	},
	
	/**
	 * 요청부서 결재선 지정 체크
	 * @param {Number} 	- 요청부서 지정 결재선 수 
	 */
	reqApproveCheck : function() {
		var apprKind = "";
		var reqCnt = 0;
	
		$("input[name=apprKind]").each(function(index, item){
			apprKind = $("input[name='apprKind']")[index].value;
			
			//console.log(apprKind);
			
			if(apprKind == "A") {
				reqCnt = reqCnt + 1;
			}
		});
		
		return reqCnt;
	},
	
	/**
	 * 요청부서 직위코드 결재선 포함 체크
	 * @param {String} jwCds	- 직위코드목록(,로구분된 문자열)
	 * @return {Number}			- 해당 직위코드가 포함된 결재선 수
	 */
	reqApproveJwCdCheck : function(jwCds) {
		if (!jwCds) jwCds = ApprService.formInfo.apprReqLine;
		
		var apprKind = "";
		var apprJwCd = "";
		var reqCnt = 0;
	
		$("input[name=apprKind]").each(function(index, item){
			apprKind = $("input[name='apprKind']")[index].value;
			apprJwCd = $("input[name='apprJwCd']")[index].value;
			
			if(apprKind == "A" && apprJwCd) {
				if(jwCds.indexOf(apprJwCd) > -1) {
					reqCnt = reqCnt + 1;
				}
			}
		});
		
		return reqCnt;
	},
	/**
	 * 요청부서 직위코드 결재선 지정 체크
	 * (요청부서 결재선에 해당 직위 코드가 포함되어 있는지 체크)
	 */
	fixApproveJwCdCheck : function(fixedJwCds) {
		var arrJwCds = [];
		if (!fixedJwCds) fixedJwCds = ApprService.formInfo.apprFixLine;
		if (fixedJwCds) {
			arrJwCds = fixedJwCds.split(',').map(function(item){
				return item.trim();
			});
		};
		
		//if (arrJwCds.length == 0) { return true; }
		
		var apprKind = "";
		var apprJwCd = "";
		//var reqCnt = 0;
		var isContains = true;	// 지정 결재선이 없으면 true
	
		$.each(arrJwCds, function(inx, value) {
			isContains = false;
			$("input[name=apprKind]").each(function(index, item){
				apprKind = $("input[name='apprKind']")[index].value.trim();
				apprJwCd = $("input[name='apprJwCd']")[index].value.trim();
				
				if(apprKind == "A" && apprJwCd) {
					if(value == apprJwCd) {
						isContains = true;
						//reqCnt++;
						return false;
					}
				}
			});
		});
		
		return isContains; // or arrJwCds.length == reqCnt
	},
	/**
	 * 필수입력 메세지 문자열 반환
	 * @param {String} msg		- 메시지 문자열
	 * @param {String} param	- 문자열내 변환할 Parameter
	 */
	requireInputMsg : function(msg, param) {
		return msg.replace("{0}", param);
	},
	
	/**
	 * 결재상태에 따른 css 값 return
	 * @param {String} status	- 결재 상태
	 * @return {String}			- CSS String
	 */
	getStatusCss : function(status) {
		var cssStr = "read_type";
		
		if(status == "Y") {
			cssStr = "app_type";
		}
		else if(status == "Z") {
			cssStr = "reject_type";
		}
		
		return cssStr;
	},
	
	/**
	 * 결재선 정보 표시(다국어처리를 위함)
	 * @param {Array} listAppr		- 결재선 목록
	 * @param {String} msgCrtDate	- 생성일 message
	 * @param {String} msgDueDate	- 결재일 message
	 * @param {String} msgWrite		- 작성자 message
	 * @param {String} msgReject	- 거절 message
	 * @param {String} msgAgree		- 동의 message
	 * @param {String} msgConfirm	- 확인 message
	 */
	apprLineDisplay : function(listAppr, msgCrtDate, msgDueDate, msgWrite, msgReject, msgAgree, msgConfirm) {
		/** 결재선 정보 표시 */
		var reqLine = "";
		var cnfLine = "";
		var prcLine = "";
		
		var empNm  = "";
		var deptNm = "";
		
		$("#popAppDiv").hide();
		$("#cnfLineTr").hide();
		
		for (var i=0; i<listAppr.length; i++) {
			empNm  = listAppr[i].empNm;
			deptNm = listAppr[i].deptNm;
			
			if(listAppr[i].apprDeptKnd == 'A') {
				reqLine += '<span class="' + this.getStatusCss(listAppr[i].apprStatus) + '">'+ deptNm + ' ' + empNm + '(' + listAppr[i].apprEmpId + ')</span> ';
			}
			else if(listAppr[i].apprDeptKnd == 'C4') {
				cnfLine += '<span class="' + this.getStatusCss(listAppr[i].apprStatus) + '">'+ deptNm+ ' ' + empNm + '(' + listAppr[i].apprEmpId + ')</span> ';
			}
			else if(listAppr[i].apprDeptKnd == 'D') {
				prcLine += '<span class="' + this.getStatusCss(listAppr[i].apprStatus) + '">'+ deptNm + ' ' + empNm + '(' + listAppr[i].apprEmpId + ')</span> ';
			}
			
			if(i == 0) {
				$("#popReqClass").attr("class", this.getStatusCss(listAppr[i].apprStatus) );
				$("#popReqAppr").html(msgWrite + ' : '+deptNm + ' ' + empNm + '(' + listAppr[i].apprEmpId + ') | ' + msgCrtDate + ' ' + listAppr[i].crtDate);
			}
		}
		
		for (var i=0; i<listAppr.length; i++) {
			empNm  = listAppr[i].empNm;
			deptNm = listAppr[i].deptNm;
			
			if(listAppr[i].apprStatus == "Z") {
				$("#popAppDiv").show();
				$("#popAppClass").attr("class", this.getStatusCss(listAppr[i].apprStatus) );
				$("#popAppClass").html(msgReject);
				$("#popAppAppr").html(msgConfirm +' : '+deptNm + ' ' + empNm + '(' + listAppr[i].apprEmpId + ') | ' + msgDueDate + ' ' + listAppr[i].apprDate);
				
				break;
			}
			else if((i+1) == listAppr.length) {
				if(listAppr[i].apprStatus == "Y") {
					$("#popAppDiv").show();
					$("#popAppClass").attr("class", this.getStatusCss(listAppr[i].apprStatus) );
					$("#popAppClass").html(msgAgree);
					$("#popAppAppr").html(msgConfirm + ' : '+deptNm + ' ' + empNm + '(' + listAppr[i].apprEmpId + ') | ' + msgDueDate + ' ' + listAppr[i].apprDate);
				}
			}
		}
		if (cnfLine) $("#cnfLineTr").show();
		
		$("#popReqLine").html(reqLine);
		$("#popCnfLine").html(cnfLine);
		$("#popPrcLine").html(prcLine);	
	},
	//-------------------------------------
	
	/**
	 * 결재 폼 초기화
	 */
	initApprLineFormData : function() {
		$("#reqLine").empty().append(this.getReqApprLine( "A", "read_type"));
	}, 
	/**
	 * 결재선 셋팅
	 * @param {Object} data			- 결재선에 설정할 data
	 * @param {Function} callback	- 결재선 셋팅 후, 처리할 callback 함수 
	 */
	setApprLineFormData : function(data, callback) {
		this.initApprLineFormData();
		this.getApprLineDefInfo(data, callback); // 검토및 허가부서 정보 조회
	},
	/**
	 * 결재 기안자(요청자) 결재 라인정보 반환
	 * @param {String} apprDeptKnd	- 결재부서 타입(기안부서, 검토부서, 승인부서)
	 * @param {String} 				- 결재구성원 결재라인에 포함될 HTML 문자열
	 */
	getReqApprLine : function(apprDeptKnd, cssType) {
    	/** 결재 기안자 */
    	//var empNm  = "${LOGIN_SESSION.empDispNm}";
    	//var deptNm = "${LOGIN_SESSION.deptDispNm}";
    	//var empId = this.empId;
    	//var deptId = this.deptId;
    	
    	return this.getApprBtnHtml(this.empId, this.empNm, this.deptId, this.deptNm, apprDeptKnd, cssType, this.jcCd, this.jwCd);
    },
	/**
	 *  결재선 정보 조회
	 *  @param {Object} data		- 결재선 조회 조건 정보
	 *  @param {Function} callback	- 결재선 조회 후, 처리할 Callback 함수 
	 */
    getApprLineDefInfo : function(data, callback) {
    	var formData = data || {};
		formData["apprFormId"] = this.apprFormId; // 소속변경신청폼 ID
		$("#prcLine").empty();
		
		$.ajax({
			   type: "post",
			   cache : false,
			   url: contextPath + "/approval/common/searchApprLineDefList.do",
			   data : formData,
			   success: function(json){	    					   
			   		if (json != null && json.resultCode == WebError.OK){
			   			var list = json.list;
			   			
			   			for (var i=0; i<list.length; i++) {
			   				if(list[i].apprDeptKnd == "D") { // 허가부서
			   					$("#prcLine").append(ApprService.getApprBtnHtml(list[i].apprEmpId,list[i].apprEmpNm, list[i].apprDeptId, list[i].apprDeptNm, list[i].apprDeptKnd, "read_type", list[i].apprJcCd, list[i].apprJwCd) ); // read_type(I), app_type(Y), reject_type(Z)
			   				}
			   			}
			   		}
			   },
			   complete: function() {
				   if (callback && typeof callback === "function") callback();
			   }
		 });
    }, 
	//-------------------------------------
    
    /**
     * 결재 폼 정보 조회
     * (결재폼 ID에 해당하는 정보 조회)
     * (조회 후 formInfo를 ApprService의 전역 변수로 저장)
     */
    getApprFormInfo : function() {
		var formData = {};
		formData["apprFormId"] = this.apprFormId;  
		var searchParams = {};
		var info = {};
		
		$.ajax({
			   type: "post",
			   cache : false,
			   url: contextPath + "/approval/apprline/getApprFormDetail.do",
			   data : formData,
			   success: function(json){	    					   
			   		if (json != null && json.resultCode == WebError.OK){
			   			ApprService.formInfo = json.detail;
			   		}
			   },
			   complete: function() {
				   //if (callback && typeof callback === "function") callback(info);
			   }
		 });
	},
	
	/**
	 * 요청부서 라인에 포함된 구성원 아이디 반환
	 * @return {Array} 구성원 아이디 배열
	 */
	getReqLineEmpIdList : function() {
		var empIdList = [];
		$("#reqLine > input[name=apprEmpId]").each(function(index, item) {
			empIdList.push(this.value);
		});
		return empIdList;
	},
	
	/**
	 * 요청부서 결재선 선택 팝업
	 * (해당 결재폼의 직위코드에 해당하는 사람들만 선택되도록 search parameter를 설정)
	 * (선택한 구성원을 결재폼에 추가)
	 */
	approvalRequestPopup : function() {
		/*this.getApprFormInfo(function(info) {
			var searchParams = {};
			searchParams["jwCds"] = info.apprReqLine;
			
   			popupApprovalOrderService.dialog(function(result) {
   				ApprService.initApprLineFormData();
   				
   				$.each(result, function(index, list) {
   					$("#reqLine").append(ApprService.getApprAddBtnHtml(list, "A", "read_type"));
   				});
   			}, "popupApprovalOrder", true, searchParams);
		 });*/
		
		var searchParams = {};
		searchParams["jwCds"] = ApprService.formInfo.apprReqLine;
		
		popupApprovalOrderService.dialog(function(result) {
			ApprService.initApprLineFormData();
			
			$.each(result, function(index, list) {
				$("#reqLine").append(ApprService.getApprAddBtnHtml(list, "A", "read_type"));
			});
		}, "popupApprovalOrder", true, searchParams);
	},
	
	setApprovalInfo : function(infoStr) {
		$("#approvalInfoDispId").text(infoStr);
	}
}
