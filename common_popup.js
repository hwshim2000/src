/**
 * 팝업 서비스
 * @author : X0114723
 */

/**
 * 팝업 공통 서비스
 * @author: X0114723
 */
var popupCommonService = {
	popupCount : 0,
	/**
	 * 팝업 초기화
	 * 		- 팝업시 하단 layer 스크롤방지
	 * 		- layer 팝업시 zIndex 처리
	 * @param {Object} pObj		- 팝업 layer ID
	 */
	init : function(pObj) {
		try {
			$("body").css("overflow", "hidden");
			/** popup의 popup일 경우에 이전 popup의 zindex보다 높은 값을 갖도록 설정한다. */
			var maskZindex = $(".af-dialog-mask", pObj).css("z-index");
			if (!maskZindex) maskZindex = 1000;
			var zindex = parseInt(maskZindex) + this.popupCount*2;
			$(".af-dialog-mask", pObj).css("z-index", zindex);
			$(".dialog", pObj).css("z-index", zindex + 1);	// mask보다 1높게 설정됨
			/** background의 스크롤을 막는다 */
			this.popupCount++;
		} finally {}
	},
	/**
	 * 팝업 마무리
	 */
	finalize : function() {
		try {
			this.popupCount--;
			/** background의 스크롤이 가능하도록 복원한다. */
			if (this.popupCount <= 0) $("body").css("overflow", "");
		} finally {}
	}
};

/**
 * 외부협력업체조회 팝업
 * @author: hwshim
 */
var popupPartnerSearchService = {
	/**
	 * 팝업 오픈
	 * @param {Object} fnCallback	- 팝업 완료 후 호출 callback 함수
	 * @param {String} popupId		- 팝업 layer Id
	 * @param {Boolean} draggable	- 팝업 Drag 가능 여부
	 * @param {Object} searchParams	- 팝업 내부 데이터 조회시 사용할 parameters
	 */	
	dialog : function(fnCallback, popupId, draggable, searchParams) {
		this.popupId = popupId?popupId:"popupPartnerSearch";
		this.pObj = $("#"+this.popupId);
		popupCommonService.init(this.pObj);
		
		if (draggable) {
			$("div[id='"+this.popupId+"']>.dialog>.dialog_header").bind("mousedown", function(){
				$(this).parent().draggable({disabled:false});
			});
			$("div[id='"+this.popupId+"']>.dialog>.dialog_header").bind("mouseup", function(){
				$(this).parent().draggable({disabled:true});
			});
		}
		
		this.fnCallback = fnCallback;
		this.pageNaviId = "PAGE_NAVI_"+this.popupId;
		this.pObj.find(".Paging").attr("id", this.pageNaviId);
		this.pObj.find(".dialog_btn").off("click").on("click", function() {
			popupPartnerSearchService.close();
		});
		
		new CommonForms().getForm("popupPartnerSearchForm").deserializeObject(searchParams);
		this.search(1);
		this.pObj.show();

		$("#popupPartnerSearchForm").on("keydown", function(event) {
        	if (event.keyCode == 13) {
        		popupPartnerSearchService.search(1);
        		return false;
        	}
        	return true;
        }); 
	},
	/**
	 * 팝업 종료시 처리 함수
	 */
	close : function() {
		popupCommonService.finalize();
		this.pObj.hide();
		this.pObj.find(".tblist_popup").html('');
		var params = {
			divId : this.pageNaviId,
			pageNo : 1,
			//pageSize : 10,		// 기본값 : 10
			totalCount : 0,
			eventName : "popupPartnerSearchService.search"
		};
		gfn_renderPaging(params);
		this.clear();
	},
	/**
	 * 팝업내부 Form Clear
	 */
	clear : function() {
		new CommonForms().getForm("popupPartnerSearchForm").clear();
	},
	/**
	 * 팝업 데이터 조회
	 */
	search : function(pageNo) {
		var formData = new CommonForms()
			.getForm("popupPartnerSearchForm")
			.setElement("pageNo", pageNo)
			.serializeObject();
		
		$.ajax({
			   type: "post",
			   cache : false,
			   url: contextPath + "/common/partner/searchPartnerList.do",
			   data : formData,
			   success: function(json){
				    var $thisObj = popupPartnerSearchService;
				    var $pObj = $thisObj.pObj;
				    var $pageNaviId = $thisObj.pageNaviId;
				    var colLength = $pObj.find(".bord_list colgroup>col").length;
				    var $tblObj = $pObj.find(".tblist_popup");
				    
				    if (json != null && json.resultCode == WebError.OK){
			   			var list = json.list ;
			   			var total = json.total;
						var rows = "";
						
						//$('#total_cnt'+$pObj.popupId).html('Total : <b>' + total + '</b>');
					
						var params = {
							divId : $pageNaviId,
							pageNo : pageNo,
							//pageSize : 10,		// 기본값 : 10
							totalCount : total,
							eventName : "popupPartnerSearchService.search"
						};
						gfn_renderPaging(params);
						
						if (total == 0) {
							$tblObj.html(
								'<tr class="board_list_row"><td class="board_list_data" colspan="'+colLength+'">' + PopupMessages['noResults'] + '</td></tr>'
  	    				    );
							return;
						}    							
						
						for (var i=0; i<list.length; i++) {
							rows += '<tr class="board_list_row">' 
				                 + 	'<td scope="row">'
				              	 +		'<a href="#" class="link" name="'+$thisObj.popupId+'" value="'+ i +'">' + list[i].partnerRegCd + '</a>'   
				                 +  '</td>'
				              	 + 	'<td scope="row">'
				              	 +		'<a href="#" class="link" name="'+$thisObj.popupId+'" value="'+ i +'">' + list[i].partnerNm + '</a>'
				              	 +  '</td>'
				              	 + 	'<td scope="row">' + Common.ifNull( list[i].partnerNmKo, '-' ) + '</td>'
				              	 + 	'<td scope="row">' + Common.ifNull( list[i].address, '-' ) + '</td>'
				              	 + 	'<td scope="row">' + Common.ifNull( list[i].telNo, '-' ) + '</td>'
				                 + 	'</tr>';
						}    							
						$tblObj.html(rows);
						
						$("a[name='"+$thisObj.popupId+"']").on("click", function(e){ //제목 
							$thisObj.fnCallback(list[$(this).attr("value")]);
							$thisObj.close();
							e.preventDefault();
						});
						
					}else{
						$pObj.find(".tblist_popup" ).html(
							'<tr class="board_list_row"><td class="board_list_data" colspan="'+colLength+'"><spring:message code="select.fail.msg" /></td></tr>'
						);
					}
			   }
		 });
	}
}; // end popupPartnerSearchService

/**
 * 협력사인력조회 팝업
 * @author: hwshim
 */
var popupPartnerVisitorSearchService = {
	/**
	 * 팝업 오픈
	 * @param {Object} fnCallback	- 팝업 완료 후 호출 callback 함수
	 * @param {String} popupId		- 팝업 layer Id
	 * @param {Boolean} draggable	- 팝업 Drag 가능 여부
	 * @param {Object} searchParams	- 팝업 내부 데이터 조회시 사용할 parameters
	 */
	dialog : function(fnCallback, popupId, draggable, searchParams) {
		this.popupId = popupId?popupId:"popupPartnerVisitorSearch";
		this.pObj = $("#"+this.popupId);
		popupCommonService.init(this.pObj);
		
		if (draggable) {
			$("div[id='"+this.popupId+"']>.dialog>.dialog_header").bind("mousedown", function(){
				$(this).parent().draggable({disabled:false});
			});
			$("div[id='"+this.popupId+"']>.dialog>.dialog_header").bind("mouseup", function(){
				$(this).parent().draggable({disabled:true});
			});
		}
		
		this.fnCallback = fnCallback;
		this.pageNaviId = "PAGE_NAVI_"+this.popupId;
		this.pObj.find(".Paging").attr("id", this.pageNaviId);
		this.pObj.find(".dialog_btn").off("click").on("click", function() {
			popupPartnerVisitorSearchService.close();
		});
		
		new CommonForms().getForm("popupPartnerVisitorSearchForm").deserializeObject(searchParams);
		this.search(1);
		this.pObj.show();

		$("#popupPartnerVisitorSearchForm").on("keydown", function(event) {
        	if (event.keyCode == 13) {
        		popupPartnerVisitorSearchService.search(1);
        		return false;
        	}
        	return true;
        }); 
	},
	/**
	 * 팝업 종료시 처리 함수
	 */
	close : function() {
		popupCommonService.finalize();
		this.pObj.hide();
		this.pObj.find(".tblist_popup").html('');
		var params = {
			divId : this.pageNaviId,
			pageNo : 1,
			//pageSize : 10,		// 기본값 : 10
			totalCount : 0,
			eventName : "popupPartnerVisitorSearchService.search"
		};
		gfn_renderPaging(params);
		this.clear();
	},
	/**
	 * 팝업내부 Form Clear
	 */
	clear : function() {
		new CommonForms().getForm("popupPartnerVisitorSearchForm").clear();
	},
	/**
	 * 팝업 데이터 조회
	 */
	search : function(pageNo) {
		var formData = new CommonForms().getForm("popupPartnerVisitorSearchForm").setElement("pageNo", pageNo).serializeObject();
		
		$.ajax({
			   type: "post",
			   cache : false,
			   url: contextPath + "/common/partner/searchPartnerVisitorList.do",
			   data : formData,
			   success: function(json){
				    var $thisObj = popupPartnerVisitorSearchService;
				    var $pObj = $thisObj.pObj;
				    var $pageNaviId = $thisObj.pageNaviId;
				    var colLength = $pObj.find(".bord_list colgroup>col").length;
				    var $tblObj = $pObj.find(".tblist_popup");
				    
				    if (json != null && json.resultCode == WebError.OK){
			   			var list = json.list ;
			   			var total = json.total;
						var rows = "";
						
						//$('#total_cnt'+$pObj.popupId).html('Total : <b>' + total + '</b>');
						var params = {
							divId : $pageNaviId,
							pageNo : pageNo,
							//pageSize : 10,		// 기본값 : 10
							totalCount : total,
							eventName : "popupPartnerVisitorSearchService.search"
						};
						gfn_renderPaging(params);
						
						if (total == 0) {
							$tblObj.html(
								'<tr class="board_list_row"><td class="board_list_data" colspan="'+colLength+'">' + PopupMessages['noResults'] + '</td></tr>'
  	    				    );
							return;
						}    							
						
						for (var i=0; i<list.length; i++) {
							rows += '<tr class="board_list_row">' 
				                 + 	'<td scope="row">' + list[i].partnerNm + '</td>'
				              	 + 	'<td scope="row">' + list[i].position + '</td>'
				              	 +  '<td scope="row"><a href="#" class="link" name="'+$thisObj.popupId+'" value="'+ i +'">' + list[i].visitorNm + '</a></td>'
				              	 + 	'<td scope="row"><a href="#" class="link" name="'+$thisObj.popupId+'" value="'+ i +'">' + list[i].visitorId + '</a></td>'
				              	 + 	'<td scope="row">' + Common.ifNull( list[i].telNo ) + '</td>'
				              	 + 	'<td scope="row">' + list[i].eduYn + '</td>'
				              	 + 	'<td scope="row">' + list[i].eduExpDt + '</td>'
				              					              	
				                 + 	'</tr>';
						}    							
						$tblObj.html(rows);
						
						$("a[name='"+$thisObj.popupId+"']").on("click", function(e){ //제목 
							$thisObj.fnCallback(list[$(this).attr("value")]);
							$thisObj.close();
							
							e.preventDefault();
						});
						
					}else{
						$pObj.find(".tblist_popup" ).html(
							'<tr class="board_list_row"><td class="board_list_data" colspan="'+colLength+'"><spring:message code="select.fail.msg" /></td></tr>'
						);
					}
			   }
		 });
	}
}; // end popupPartnerVisitorSearchService


