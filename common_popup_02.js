
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
		this.autoClose = true;
		if (searchParams && searchParams.hasOwnProperty('autoClose')) this.autoClose = searchParams.autoClose;
		popupCommonService.init(this.pObj);
		
		if (draggable) {
			$("div[id='"+this.popupId+"']>.dialog>.dialog_header").off("mousedown").on("mousedown", function(){
				$(this).parent().draggable({disabled:false});
			});
			$("div[id='"+this.popupId+"']>.dialog>.dialog_header").off("mouseup").on("mouseup", function(){
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

		$("#popupPartnerVisitorSearchForm").off("keydown").on("keydown", function(event) {
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
		if (!this.pObj.is(':visible')) return;
		
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
	 * 팝업 데이터 조회 - 협력사 인력
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
  	    				          '<tr class="board_list_row"><td class="board_list_data" colspan="'+colLength+'">'+PopupMessages.noResults+'</td></tr>'
  	    				    );
							return;
						}    							
						
						for (var i=0; i<list.length; i++) {
							rows += '<tr class="board_list_row">' 
				                 + 	'<td scope="row">' +	list[i].partnerNm +  '</td>'
				              	 + 	'<td scope="row">' + list[i].partnerId + '</td>'
				              	 +  '<td scope="row">'
				              	 +     '<a href="#" class="link" name="'+$thisObj.popupId+'" value="'+ i +'">' + list[i].visitorNm + '</a>'
				              	 + '</td>'
				              	 + 	'<td scope="row">'
				              	 +     '<a href="#" class="link" name="'+$thisObj.popupId+'" value="'+ i +'">' + list[i].visitorId + '</a>'
				              	 + '</td>'
				              	 + 	'<td scope="row">'
				              	 +     '<a href="#" class="link" name="'+$thisObj.popupId+'" value="'+ i +'">' + list[i].personNo + '</a>'
				              	 + '</td>'
				              	 + 	'<td scope="row">' + list[i].telNo+ '</td>'
				                 + 	'</tr>';
						}    							
						$tblObj.html(rows);
						
						$("a[name='"+$thisObj.popupId+"']").off("click").on("click", function(e){ //제목 
							$thisObj.fnCallback(list[$(this).attr("value")]);
							if ($thisObj.autoClose) $thisObj.close();
							e.preventDefault();
						});
						
					}else{
						$pObj.find(".tblist_popup" ).html(
							'<tr class="board_list_row"><td class="board_list_data" colspan="'+colLength+'">'+PopupMessages.noResults+'</td></tr>'
						);
					}
			   }
		 });
	}
}; // end popupPartnerVisitorSearchService

/**
 * 출입 구역 조회팝업
 * @author: hwshim
 */
var popupGateSearchService = {
	/**
	 * 팝업 오픈
	 * @param {Object} fnCallback	- 팝업 완료 후 호출 callback 함수
	 * @param {String} popupId		- 팝업 layer Id
	 * @param {Boolean} draggable	- 팝업 Drag 가능 여부
	 * @param {Object} searchParams	- 팝업 내부 데이터 조회시 사용할 parameters
	 */
	dialog : function(fnCallback, popupId, draggable, searchParams) {
		this.popupId = popupId?popupId:"popupGateSearch";
		this.pObj = $("#"+this.popupId);
		this.autoClose = true;
		if (searchParams && searchParams.hasOwnProperty('autoClose')) this.autoClose = searchParams.autoClose;
		popupCommonService.init(this.pObj);
		
		if (draggable) {
			$("div[id='"+this.popupId+"']>.dialog>.dialog_header").off("mousedown").on("mousedown", function(){
				$(this).parent().draggable({disabled:false});
			});
			$("div[id='"+this.popupId+"']>.dialog>.dialog_header").off("mouseup").on("mouseup", function(){
				$(this).parent().draggable({disabled:true});
			});
		}
		
		this.fnCallback = fnCallback;
		
		this.pObj.find(".dialog_btn").off("click").on("click", function() {
			popupGateSearchService.close();
		});
		
		if (!searchParams) searchParams = { gateType:'EMP_SR' };	//SPECIAL과 RESTRICT
		if (!searchParams.hasOwnProperty("gateType")) searchParams.gateType = 'EMP_SR';
		
		new CommonForms().getForm("popupGateSearchForm").deserializeObject(searchParams);
		this.search();
		this.pObj.show();
		
		$("#popupGateSearchForm").off("keydown").on("keydown", function(event) {
        	if (event.keyCode == 13) {
        		popupGateSearchService.search();
        		return false;
        	}
        	return true;
        });
	},
	/**
	 * 팝업 종료시 처리 함수
	 */
	close : function() {
		if (!this.pObj.is(':visible')) return;
		
		popupCommonService.finalize();
		this.pObj.hide();
		this.pObj.find(".tblist_popup").html('');
		$("input[name='"+this.popupId+"']").prop("checked", false);
		this.clear();
	},
	/**
	 * 팝업내부 Form Clear
	 */
	clear : function() {
		new CommonForms().getForm("popupGateSearchForm").clear();
	},
	/**
	 * 선택한 출입구역 정보 콜백 처리 후 종료
	 */
	confirm : function() {
		var gateArr = [];
		$("input[name='"+this.popupId+"']:checked").each(function() {
			gateArr.push(popupGateSearchService.list[this.value]);
		});
		this.fnCallback(gateArr);
		if (this.autoClose) this.close();
	},
	/**
	 * 팝업 데이터 조회 - 출입 구역
	 */
	search : function() {
		var formData = new CommonForms().getForm("popupGateSearchForm").serializeObject();
		formData["useYn"] = "Y";
		
		$.ajax({
			   type: "post",
			   cache : false,
			   url: contextPath + "/system/codemgmt/gategroup/searchAllGateGroupList.do",
			   data : formData,
			   success: function(json){
				    var $thisObj = popupGateSearchService;
				    var $pObj = $thisObj.pObj;
				    var $tblObj = $pObj.find(".tblist_popup");
				    var colLength = $pObj.find(".bord_list colgroup>col").length;
				    
				    if (json != null && json.resultCode == WebError.OK){
			   			var list = json.list ;
			   			$thisObj.list = list;
			   			var total = json.list.length;
						var rows = "";
						
						if (total == 0) {
							$tblObj.html(
  	    				          '<tr class="board_list_row"><td class="board_list_data" colspan="'+colLength+'">'+PopupMessages.noResults+'</td></tr>'
  	    				    );
							return;
						}
						
						var gateType = $("#gateType", $pObj).val();
						
						for (var i=0; i<list.length; i++) {
							rows += '<tr class="board_list_row">' 
				                 + 	'<td scope="row">'
				                 +      '<span class="jqformCheckboxWrapper">'
				              	 +      '<input name="'+$thisObj.popupId+'" class="jqformHidden jqCheck" type="checkbox" value="'+i+'">'
				              	 +      '<span class="jqformCheckbox"></span>'
				              	 +  '</span>'
				                 +  '</td>'
				              	 + 	'<td scope="row" class="tl">'
				              	 +		Common.ellipsis(list[i].grpNm)
				              	 +	'</td>'
								 + 	'<td scope="row">' + Common.viewEmpIdNm(list[i].restrictEmpNm, list[i].restrictEmpId) + '</td>';
							if (gateType === 'EMP_SR') {
								rows+=  '<td scope="row">' + list[i].empSpecial + '</td>'
									+  '<td scope="row">' + list[i].empRestrict + '</td>';
							} else if (gateType === 'CS_R') {
								rows+=  '<td scope="row"></td>'
									+  '<td scope="row">' + list[i].csRestrict + '</td>';
							} else if (gateType === 'SG_G') {
								rows+=  '<td scope="row"></td>'
									+  '<td scope="row"></td>';
							} else if (gateType === 'C2F_G') {
								rows+=  '<td scope="row"></td>'
									+  '<td scope="row"></td>';
							}
						}    							
						$tblObj.html(rows);
					}else{
						$tblObj.html(
							'<tr class="board_list_row"><td class="board_list_data" colspan="'+colLength+'">'+PopupMessages.noResults+'</td></tr>'
						);
					}
			   }
		 });
	}
}; // end popupGateSearchService
/**
 * 사원 트리 조회팝업
 * @author: hwshim
 */
var popupEmpSearchService = {
	/**
	 * 팝업 오픈
	 * @param {Object} fnCallback	- 팝업 완료 후 호출 callback 함수
	 * @param {String} popupId		- 팝업 layer Id
	 * @param {Boolean} draggable	- 팝업 Drag 가능 여부
	 * @param {Object} searchParams	- 팝업 내부 데이터 조회시 사용할 parameters
	 */
	dialog : function(fnCallback, popupId, draggable, searchParams) {
		this.popupId = popupId?popupId:"popupEmpSearch";
		this.pObj = $("#"+this.popupId);
		this.searchParams = searchParams || {};
		this.deptFix = this.searchParams.deptFix?true:false;
		this.autoClose = true;
		if (searchParams && searchParams.hasOwnProperty('autoClose')) this.autoClose = searchParams.autoClose;
		
		popupCommonService.init(this.pObj);
		popupCommonService.setTreeStyle('popupDeptEmpTreeDiv');	// tree style 설정(guide line)
		
		if (draggable) {
			$("div[id='"+this.popupId+"']>.dialog>.dialog_header").off("mousedown").on("mousedown", function(){
				$(this).parent().draggable({disabled:false});
			});
			$("div[id='"+this.popupId+"']>.dialog>.dialog_header").off("mouseup").on("mouseup", function(){
				$(this).parent().draggable({disabled:true});
			});
		};
		
		this.fnCallback = fnCallback;
		this.pageNaviId = "PAGE_NAVI_"+this.popupId;
		this.pObj.find(".Paging").attr("id", this.pageNaviId);
		this.pObj.find(".dialog_btn").off("click").on("click", function() {
			popupEmpSearchService.close();
		});
		
		new CommonForms().getForm("popupEmpSearchForm").deserializeObject(this.searchParams);
		
		// 부서를 조회하고 초기 부서가 있으면 해당 부서를 확장하여 보여준다.
		if (this.searchParams.deptId) {
			this.searchDeptTree(this.searchParams.deptId);
			this.searchByTree(this.searchParams.deptId);
		} else {
			this.searchDeptTree(sessionUser.deptId);
			this.searchByTree(sessionUser.deptId);
		}
		
		this.pObj.show();
		
		$("#popupEmpSearchForm").off("keydown").on("keydown", function(event) {
        	if (event.keyCode == 13) {
        		popupEmpSearchService.searchByDefault(1);
        		return false;
        	}
        	return true;
        }); 
	},
	/**
	 * 팝업 종료시 처리 함수
	 */
	close : function() {
		if (!this.pObj.is(':visible')) return;
		
		popupCommonService.finalize();
		this.pObj.hide();
		this.pObj.find(".tblist_popup").html('');
		$("#popupDeptEmpTree").html('');
		var params = {
			divId : this.pageNaviId,
			pageNo : 1,
			//pageSize : 10,		// 기본값 : 10
			pageLength : 5,
			totalCount : 0,
			eventName : "popupEmpSearchService.search"
		};
		gfn_renderPaging(params);
		this.clear();
	},
	/**
	 * 팝업내부 Form Clear
	 */
	clear : function() {
		new CommonForms().getForm("popupEmpSearchForm").clear();
		new CommonForms().getForm("popupSelectedEmpForm").clear();
	},
	/**
	 * 선택한 사원 콜백 처리 후 종료
	 */
	confirm : function() {
		var formData = new CommonForms().getForm("popupSelectedEmpForm").serializeObject();
		if (formData.empId) {
			this.fnCallback(this.keyMap[formData.empId]);
		}
		if (this.autoClose) this.close();
	},

	/**
	 * 트리가 아닌 검색 조건을 통한 사원 조회
	 */
	searchByDefault : function() {
		var deptId = this.searchParams.deptId||'';
		$("input[name='deptId']", $("#popupEmpSearchForm")).val(deptId);
		//new CommonForms().getForm("popupEmpSearchForm").deserializeObject(this.searchParams);
		this.search(1);
	},
	/**
	 *  트리에서 부서 클릭시 해당 부서의 사원 조회
	 * @param {String} deptId	- 조회할 부서 ID
	 */
	searchByTree : function(deptId) {
		this.clear();
		$("input[name='deptId']", $("#popupEmpSearchForm")).val(deptId);
		this.search(1);
	},
	
	/**
	 * 팝업 데이터 조회 - 사원
	 */
	search : function(pageNo, defaultDeptId) {
		var formData = new CommonForms().getForm("popupEmpSearchForm").setElement("pageNo", pageNo).serializeObject();
		
		if (defaultDeptId) formData.deptId = defaultDeptId;
		
		$.ajax({
			   type: "post",
			   cache : false,
			   url: contextPath + "/system/orgmgmt/emp/searchEmpList.do",
			   data : formData,
			   success: function(json){
				    var $thisObj = popupEmpSearchService;
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
							pageLength : 5,
							//pageSize : 10,		// 기본값 : 10
							totalCount : total,
							eventName : "popupEmpSearchService.search"
						};
						gfn_renderPaging(params);
						
						if (total == 0) {
							$tblObj.html(
  	    				          '<tr class="board_list_row"><td class="board_list_data" colspan="'+colLength+'">'+PopupMessages.noResults+'</td></tr>'
  	    				    );
							return;
						}    							
						
						var keyMap = {};
						var empNm = '';
						for (var i=0; i<list.length; i++) {
							keyMap[list[i].empId] = list[i];
							
							if (list[i].empNmKo) empNm = list[i].empNm + ' / '+list[i].empNmKo;
							else empNm = list[i].empNm;
							  
							rows += '<tr class="board_list_row">' 
				                 + 	'<td scope="row">'
				              	 +     '<a href="#" class="link" name="'+$thisObj.popupId+'" value="'+ i +'">'
				              	 + 		list[i].empId
				              	 +     '</a>'
				              	 +   '</td>'
				                 +   '<td scope="row">'
				                 +     '<a href="#" class="link" name="'+$thisObj.popupId+'" value="'+ i +'"">'
				                 +		empNm
				                 +     '</a>'
				                 +	 '</td>' 
				                 + '</tr>';
						};
						
						$thisObj.keyMap = keyMap;
						$tblObj.html(rows);
						
						// 사원 선택시 해당 사원 정보 리턴하고 팝업장 닫기
						$("a[name='"+$thisObj.popupId+"']", $tblObj).off("click").on("click", function(e){ //제목
							var obj = list[$(this).attr("value")];
							if ($thisObj.expandDeptTree(obj.deptId)) {
								$thisObj.showSelectedEmptInfo(obj);
							}
							//$thisObj.showSelectedEmptInfo(obj);
							//$thisObj.expandDeptTree(obj.deptId);
							
							e.preventDefault();
						});
					}else{
						$pObj.find(".tblist_popup" ).html(
							'<tr class="board_list_row"><td class="board_list_data" colspan="'+colLength+'"><spring:message code="sample.select.message.001" /></td></tr>'
						);
					}
			   }
		 });
	},
	/**
	 * 부서 조회
	 * 전체 부서의 트리를 조회 후 선택한 부서를 트리에서 보여준다.
	 * @param {String} expandDeptId	- 선택한 부서 ID
	 */
	searchDeptTree : function(expandDeptId) {
		var formData = {};
		
		$.ajax({
			cache : false,
			url: contextPath + "/system/orgmgmt/dept/searchDeptTreeMap.do",
			data : formData,
			success: function(json){
				if (json != null && json.resultCode == WebError.OK){
					var rootMap = json.map.ROOT_MAP;
					var rootNode = rootMap["CHILDRENS"][0];
					
					// popup tree html 생성
					var treeHtml = popupEmpSearchService.makeDeptTreeNode(rootNode);
					
					// ROOT_NODE 를 보여줄지 여부에 따라 tree를 다시 그린다.
					// ROOT 노드를 제외할 경우 ROOT 노드의 SUB 노드만을 추출하여 트리 영역을 그린다.
					if (popupCommonService.showRoot) {
						$("#popupDeptEmpTree").html(treeHtml);
					} else {
						var subTreeHtml = $("ul", $(treeHtml)).html();
					 	$("#popupDeptEmpTree").html(subTreeHtml);
					}
					 
				 	// tree를 그린다.
				 	ddtreemenu.createTree("popupDeptEmpTree", true);
				 	ddtreemenu.flatten('popupDeptEmpTree', 'contact');
				 	//$(".submenu", $("#popupDeptEmpTree")).addClass("dotted");
				 	
					// 만약 초기에 입력한 deptId가 있다면 해당 부서를 확장한다.
				 	popupEmpSearchService.expandDeptTree(expandDeptId);
				}
			}
		});
	},

	/**
	 * 부서 트리 생성
	 * @param {Object} map	- 부서 트리 정보
	 */
	makeDeptTreeNode : function(map) {
		ddtreemenu.closefolder	= "/statics/images/tree_open.png"; //set image path to "closed" folder image
		ddtreemenu.openfolder	= "/statics/images/tree_close.png"; //set image path to "open" folder image
		ddtreemenu.listfolder	= "/statics/images/tree_folder.png"; //set image path to "open" folder image
		ddtreemenu.blankfolder	= "/statics/images/tree_blank.png";
		
	   	this.treeHtml = '';
		
	    this.makeTree = function(obj) {
	    	var child = obj["CHILDRENS"];
	    	var id = obj["ID"].trim();
	    	var name = obj["ITEMS"]["deptDispNm"];
	    	var sortOrder = obj["ITEMS"]["sortOrder"];
	    	
	    	if (child.length > 0) {
	    		this.treeHtml += '<li class="submenu container">';
	    		this.treeHtml += '<p>';
	    		this.treeHtml += '<img id="'+id+'_img" src="'+ddtreemenu.openfolder+'" alt="open">';
	    		this.treeHtml += ' <img src="'+ddtreemenu.listfolder+'" alt="dept">';
	    		this.treeHtml += '&nbsp;&nbsp;<span id="'+id+'_span" onclick="popupEmpSearchService.deptTreeClick(this);">'+ name +'</span>';
	    		this.treeHtml += '</p>';
	    		this.treeHtml += '<div></div>';
	    		this.treeHtml += '<ul class="tree_sub">';
	    		for (var c in child) {
					this.makeTree(child[c]);
				}
				this.treeHtml += '</ul>';
				this.treeHtml += '</li>'; 
			} else {
				this.treeHtml += '<li class="submenu">';
				this.treeHtml += '<p>';
				this.treeHtml += '<img src="'+ddtreemenu.blankfolder+'"/>';
				this.treeHtml += ' <img id="'+id+'_img" src="'+ddtreemenu.listfolder+'" alt="dept">';
				this.treeHtml += '&nbsp;&nbsp;<span id="'+id+'_span" onclick="popupEmpSearchService.deptTreeClick(this);">'+ name +'</span>';
				this.treeHtml += '</p>';
				this.treeHtml += '</li>';
			}
	    }
	    
	    this.makeTree(map);
	    return this.treeHtml;
	},
	/**
	 * 트리 부서 클릭
	 * (선택한 부서의 사원을 조회한다)
	 * @param {Object} obj	- 선택한 부서 정보
	 */
	deptTreeClick : function(obj) {
		if (popupEmpSearchService.deptFix) return;
		
 		var deptId = obj.id.replace('_span','');
 		this.setDeptMenuStyle(deptId);
		this.searchByTree(deptId);
 	},
 	/**
 	 * 트리 확장
 	 * (선택한 부서의 트리를 확장한다)
 	 * @param {String} deptId	- 선택 부서
 	 */
 	expandDeptTree : function(deptId) {
 		if (!deptId) return false;
 		// 트리여역
		var treeObj = document.getElementById("popupDeptEmpTreeDiv");
		// 트리의 부서 폴더 이미지 아이콘
		var imgObj = document.getElementById(deptId+'_img');
		
		if (imgObj) {	// 선택부서가 트리에서 존재할 경우
			var ulel = imgObj.parentNode.parentNode;
			ddtreemenu.expandSubTree("P", ulel);	// 선택부서의 트리를 확장한다.
			location.href = "#"+deptId+'_img';	// 해당부서로 링크(이동)
			if (imgObj.parentNode.style.display == 'none') {
				imgObj.parentNode.style.display = 'block';
			}
		} else {	// 해당 부서가 없는경우
			alert(popupMessages.get("no_dept") + " : " + deptId);
			/*if (LANG === 'ko') alert("존재하지 않는 부서이거나, 사용이 제한된 부서입니다. : " + deptId);
			else if (LANG === 'en') alert("A department that does not exist or is restricted in use. : " + deptId);
			else alert("不存在的部门或使用限制的部门。 : " + deptId);*/
			return false;
		}
		
		// 선택 이미지 영역의 위치를 알아낸다.
		var imgRect = imgObj.getBoundingClientRect();
		// 트리영역의 위치를 알아낸다.
		var treeRect = treeObj.getBoundingClientRect();
		//console.log(imgRect.top, imgRect.right, imgRect.bottom, imgRect.left);
		//console.log(treeRect.top, treeRect.right, treeRect.bottom, treeRect.left);
		
		// 선택된 부서아아콘과 트리와의 거리를 계산한다.
		var diffOffsetH = imgRect.top - treeRect.top;
		//console.log(treeObj.style);
		//console.log(treeObj.clientHeight);
		//console.log(treeObj.offsetHeight);
		//console.log(treeObj.scrollHeight);
		//console.log(treeObj.scrollTop);
		
		// 트리영역의 스크롤이 선택된 부서가 중앙에 오도록 설정한다.(5:line-height)
		var lineHeight = 12;
		treeObj.scrollTop = lineHeight + treeObj.scrollTop - (treeObj.clientHeight/2 - diffOffsetH);
		// 선택한 부서가 트리에서 잘 보이도록 스타일 변경
		this.setDeptMenuStyle(deptId);
		
		return true;
	},
 	/**
 	 * 클릭시 부서명 스타일 설정
 	 * @param {String} deptId	- 선택 부서
 	 */
 	setDeptMenuStyle : function(deptId) {
 		var titleDeptId = deptId + "_span";
 		var titleObj = $("#"+titleDeptId).get(0);
 		titleObj.style.fontWeight = 'bold';
 		titleObj.style.color = 'blue';
 		if (titleDeptId != this.oldClickDeptId) {
			if($("#"+this.oldClickDeptId).get(0)) {
				$("#"+this.oldClickDeptId).get(0).style.fontWeight = '';
				$("#"+this.oldClickDeptId).get(0).style.color = '#595C65';
			}
 		}
 		this.oldClickDeptId = titleDeptId;
 	},
 	/**
 	 * 선택한 구성원의 정보를 보여준다.
 	 * @param {Object} empObj	- 선택 구성원 정보
 	 */
 	showSelectedEmptInfo : function(empObj) {
 		empObj.empNmAndNmEn = empObj.empNm + '(' + empObj.empNmEn + ')';
 		new CommonForms().getForm("popupSelectedEmpForm").deserializeObject(empObj);
 	}
};// end popupEmpSearchService
/**
 * 부서 트리 조회팝업
 * @author: hwshim
 */
var popupDeptSearchService = {
	/**
	 * 팝업 오픈
	 * @param {Object} fnCallback	- 팝업 완료 후 호출 callback 함수
	 * @param {String} popupId		- 팝업 layer Id
	 * @param {Boolean} draggable	- 팝업 Drag 가능 여부
	 * @param {Object} searchParams	- 팝업 내부 데이터 조회시 사용할 parameters
	 */
	dialog : function(fnCallback, popupId, draggable, searchParams) {
		this.popupId = popupId?popupId:"popupDeptSearch";
		this.pObj = $("#"+this.popupId);
		this.autoClose = true;
		if (searchParams && searchParams.hasOwnProperty('autoClose')) this.autoClose = searchParams.autoClose;
		
		popupCommonService.init(this.pObj);
		popupCommonService.setTreeStyle('popupDeptTreeDiv');
		
		if (draggable) {
			$("div[id='"+this.popupId+"']>.dialog>.dialog_header").off("mousedown").on("mousedown", function(){
				$(this).parent().draggable({disabled:false});
			});
			$("div[id='"+this.popupId+"']>.dialog>.dialog_header").off("mouseup").on("mouseup", function(){
				$(this).parent().draggable({disabled:true});
			});
		}
		
		this.fnCallback = fnCallback;
		this.pageNaviId = "PAGE_NAVI_"+this.popupId;
		this.pObj.find(".Paging").attr("id", this.pageNaviId);
		this.pObj.find(".dialog_btn").off("click").on("click", function() {
			popupDeptSearchService.close();
		});
		
		new CommonForms().getForm("popupDeptSearchForm").deserializeObject(searchParams);
		
		this.searchDeptTree(sessionUser.deptId);
		this.search(1);
		this.pObj.show();

		$("#popupDeptSearchForm").off("keydown").on("keydown", function(event) {
        	if (event.keyCode == 13) {
        		popupDeptSearchService.search(1);
        		return false;
        	}
        	return true;
        }); 
	},
	/**
	 * 팝업 종료시 처리 함수
	 */
	close : function() {
		if (!this.pObj.is(':visible')) return;
		
		popupCommonService.finalize();
		this.pObj.hide();
		this.pObj.find(".tblist_popup").html('');
		$("#popupDeptTree").html('');
		var params = {
			divId : this.pageNaviId,
			pageSize : 1,
			pageLength : 5,
			//pageSize : 10,		// 기본값 : 10
			totalCount : 0,
			eventName : "popupDeptSearchService.search"
		};
		gfn_renderPaging(params);
		this.clear();
	},
	/**
	 * 팝업내부 Form Clear
	 */
	clear : function() {
		new CommonForms().getForm("popupDeptSearchForm").clear();
		new CommonForms().getForm("popupSelectedDeptForm").clear();
	},
	/**
	 * 선택 부서 정보 콜백 처리 후 종료
	 */
	confirm : function() {
		var formData = new CommonForms().getForm("popupSelectedDeptForm").serializeObject();
		if (formData.deptId) {
			this.fnCallback(this.keyMap[formData.deptId]);
		}
		if (this.autoClose) this.close();
	},
	/**
	 * 팝업 데이터 조회 - 부서
	 */
	search : function(pageNo) {
		var formData = new CommonForms().getForm("popupDeptSearchForm").setElement("pageNo", pageNo).serializeObject();
		
		$.ajax({
			   type: "post",
			   cache : false,
			   url: contextPath + "/system/orgmgmt/dept/searchDeptTreeList.do",
			   data : formData,
			   success: function(json){
				    var $thisObj = popupDeptSearchService;
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
							pageLength : 5,
							//pageSize : 10,		// 기본값 : 10
							totalCount : total,
							eventName : "popupDeptSearchService.search"
						};
						gfn_renderPaging(params);
						
						if (total == 0) {
							$tblObj.html(
  	    				        '<tr class="board_list_row"><td class="board_list_data" colspan="'+colLength+'"><spring:message code="inquery.none_result" /></td></tr>'
  	    				    );
							return;
						}    							
						
						for (var i=0; i<list.length; i++) {
							rows += '<tr class="board_list_row">' 
				                 //+ 	'<td scope="row">'
				              	 //+		'<a href="#" class="link" name="'+$thisObj.popupId+'" value="'+ i +'">' + list[i].deptId + '</a>'   
				                 //+  '</td>'
				              	 + 	'<td scope="row">'
				              	 +		'<a href="#" class="link" name="'+$thisObj.popupId+'" value="'+ i +'">' + list[i].deptNm + '</a>'
				              	 +  '</td>'
				              	 //+ 	'<td scope="row">'
				              	 //+		'<a href="#" class="link" name="'+$thisObj.popupId+'" value="'+ i +'">' + list[i].deptNmEn + '</a>'
				              	 //+  '</td>'
				              	 + 	'<td scope="row">'
				              	 +		'<a href="#" class="link" name="'+$thisObj.popupId+'" value="'+ i +'">' + list[i].deptNmKo + '</a>'
				              	 +  '</td>'
				                 + 	'</tr>';
						}    							
						$tblObj.html(rows);
						
						$("a[name='"+$thisObj.popupId+"']").off("click").on("click", function(e){ //제목
							var obj = list[$(this).attr("value")];
							if ($thisObj.expandDeptTree(obj.deptId)) {
								$thisObj.showSelectedDeptInfo(obj);
							};
							//$thisObj.fnCallback(list[$(this).attr("value")]);
							//$thisObj.close();
							
							e.preventDefault();
						});
						
					}else{
						$pObj.find(".tblist_popup" ).html(
							'<tr class="board_list_row"><td class="board_list_data" colspan="'+colLength+'">'+PopupMessages.noResults+'</td></tr>'
						);
					}
			   }
		 });
	},
	/**
	 * 부서 트리 조회
	 * (전체 부서 트리 조회 및 선택 부서가 있으면 트리 확장)
	 * @param {String} expandDeptId	- 선택 부서
	 */
	searchDeptTree : function(expandDeptId) {
		var formData = {};
		
		$.ajax({
			cache : false,
			url: contextPath + "/system/orgmgmt/dept/searchDeptTreeMap.do",
			data : formData,
			success: function(json){
				if (json != null && json.resultCode == WebError.OK){
					var rootMap = json.map.ROOT_MAP;
					var rootNode = rootMap["CHILDRENS"][0];
					popupDeptSearchService.keyMap = json.keyMap;
					
					// popup tree html 생성
					var treeHtml = popupDeptSearchService.makeDeptTreeNode(rootNode);
					
					// ROOT_NODE 를 보여줄지 여부에 따라 tree를 다시 그린다.
					// ROOT 노드를 제외할 경우 ROOT 노드의 SUB 노드만을 추출하여 트리 영역을 그린다.
					if (popupCommonService.showRoot) {
						$("#popupDeptTree").html(treeHtml);
					} else {
						var subTreeHtml = $("ul", $(treeHtml)).html();
					 	$("#popupDeptTree").html(subTreeHtml);
					}
				 	
				 	// tree를 그린다.
				 	ddtreemenu.createTree("popupDeptTree", true);
				 	ddtreemenu.flatten('popupDeptTree', 'contact');
				 	//$(".submenu", $("#popupDeptTree")).addClass("dotted");
				 	
					popupDeptSearchService.expandDeptTree(expandDeptId);
				}
			}
		});
	},
	/**
	 * 부서 트리 생성
	 * @param {Object} map	- 부서 트리 정보
	 */
	makeDeptTreeNode : function(map) {
		ddtreemenu.closefolder = "/statics/images/tree_open.png"; //set image path to "closed" folder image
		ddtreemenu.openfolder  = "/statics/images/tree_close.png"; //set image path to "open" folder image
		ddtreemenu.listfolder  = "/statics/images/tree_folder.png"; //set image path to "open" folder image
		ddtreemenu.blankfolder	= "/statics/images/tree_blank.png";
		
	   	this.treeHtml = '';
	    this.makeTree = function(obj) {
	    	var child = obj["CHILDRENS"];
	    	var id = obj["ID"].trim();
	    	var name = obj["ITEMS"]["deptDispNm"];
	    	var sortOrder = obj["ITEMS"]["sortOrder"];
	    	
	    	if (child.length > 0) {
	    		this.treeHtml += '<li class="submenu">';
	    		this.treeHtml += '<p>';
	    		this.treeHtml += '<img id="'+id+'_img" src="'+ddtreemenu.openfolder+'" alt="open">';
	    		this.treeHtml += ' <img src="'+ddtreemenu.listfolder+'" alt="dept">';
	    		this.treeHtml += '&nbsp;&nbsp;<span id="'+id+'_span" onclick="popupDeptSearchService.deptTreeClick(this);">'+ name +'</span>';
	    		this.treeHtml += '</p>';
	    		this.treeHtml += '<div></div>';
	    		this.treeHtml += '<ul class="tree_sub">';
				for (var c in child) {
					this.makeTree(child[c]);
				}
				this.treeHtml += '</ul>';
				this.treeHtml += '</li>';
			} else {
				this.treeHtml += '<li class="submenu">';
				this.treeHtml += '<p>';
	    		this.treeHtml += '<img src="'+ddtreemenu.blankfolder+'"/>';
				this.treeHtml += ' <img id="'+id+'_img" src="'+ddtreemenu.listfolder+'" alt="dept">';
				this.treeHtml += '&nbsp;&nbsp;<span id="'+id+'_span" onclick="popupDeptSearchService.deptTreeClick(this);">'+ name +'</span>';
				this.treeHtml += '</p>';
	    		this.treeHtml += '</li>';
			}
	    }
	    
	    this.makeTree(map);
	    return this.treeHtml;
	},
	/**
	 * 트리 부서 클릭
	 * @param {Object} obj	- 부서 정보
	 */
	deptTreeClick : function(obj) {
 		var deptId = obj.id.replace('_span','');
 		var deptObj = this.keyMap[deptId];
 		this.setDeptMenuStyle(deptId);
 		this.showSelectedDeptInfo(deptObj);
 	},
 	/**
 	 * 선택한 부서의 정보를 보여준다.
 	 * @param {Object} deptObj	- 부서 정보
 	 */
 	showSelectedDeptInfo : function(deptObj) {
 		//var resultForm = $("form[name='selectedDeptForm']", this.pObj);
 		new CommonForms().getForm("popupSelectedDeptForm").deserializeObject(deptObj);
 		
 		//$("#selectedDeptNm", resultForm).text(deptObj.deptNm);
 		//$("#selectedDeptNmKo", resultForm).text(deptObj.deptNmKo);
 		//$("#selectedDeptNmEn", resultForm).text(deptObj.deptNmEn);
 	},
 	/**
 	 * 선택한 부서의 트리를 확장한다.
 	 * @param {String} deptId	- 부서 아이디
 	 */
 	expandDeptTree : function(deptId) {
 		if (!deptId) return false;
 		// 트리여역
		var treeObj = document.getElementById("popupDeptTreeDiv");
		// 트리의 부서 폴더 이미지 아이콘
		var imgObj = document.getElementById(deptId+'_img');
		
		if (imgObj) {	// 선택부서가 트리에서 존재할 경우
			var ulel = imgObj.parentNode.parentNode;
			ddtreemenu.expandSubTree("P", ulel);	// 선택부서의 트리를 확장한다.
			location.href = "#"+deptId+'_img';	// 해당부서로 링크(이동)
			if (imgObj.parentNode.style.display == 'none') {
				imgObj.parentNode.style.display = 'block';
			}
		} else {	// 해당 부서가 없는경우
			alert(popupMessages.get("no_dept") + " : " + deptId);
			/*if (LANG === 'ko') alert("존재하지 않는 부서이거나, 사용이 제한된 부서입니다. : " + deptId);
			else if (LANG === 'en') alert("A department that does not exist or is restricted in use. : " + deptId);
			else alert("不存在的部门或使用限制的部门。 : " + deptId);*/
			return false;
		}
		
		// 선택 이미지 영역의 위치를 알아낸다.
		var imgRect = imgObj.getBoundingClientRect();
		// 트리영역의 위치를 알아낸다.
		var treeRect = treeObj.getBoundingClientRect();
		//console.log(imgRect.top, imgRect.right, imgRect.bottom, imgRect.left);
		//console.log(treeRect.top, treeRect.right, treeRect.bottom, treeRect.left);
		
		// 선택된 부서아아콘과 트리와의 거리를 계산한다.
		var diffOffsetH = imgRect.top - treeRect.top;
		//console.log(treeObj.style);
		//console.log(treeObj.clientHeight);
		//console.log(treeObj.offsetHeight);
		//console.log(treeObj.scrollHeight);
		//console.log(treeObj.scrollTop);
		
		// 트리영역의 스크롤이 선택된 부서가 중앙에 오도록 설정한다.(5:line-height)
		var lineHeight = 12;
		treeObj.scrollTop = lineHeight + treeObj.scrollTop - (treeObj.clientHeight/2 - diffOffsetH);
		// 선택한 부서가 트리에서 잘 보이도록 스타일 변경
		this.setDeptMenuStyle(deptId);
		
		return true;
	},
 	/**
 	 * 클릭시 부서명 스타일 설정
 	 * @param {String} deptId	- 부서 아이디
 	 */
 	setDeptMenuStyle : function(deptId) {
 		var titleDeptId = deptId+"_span";
 		
 		var titleObj = $("#"+titleDeptId).get(0);
 		titleObj.style.fontWeight = 'bold';
 		titleObj.style.color = 'blue';
 		if (titleDeptId != this.oldClickDeptId) {
			if($("#"+this.oldClickDeptId).get(0)) {
				$("#"+this.oldClickDeptId).get(0).style.fontWeight = '';
				$("#"+this.oldClickDeptId).get(0).style.color = '#595C65';
			}
 		}
 		this.oldClickDeptId = titleDeptId;
 	}
}; // end popupDeptSearchService

/**
 * 물품반출입 승인부서 결재선 팝업
 * @author: jbsun
 */
var popupPermissionApprovalOrderService = {
	/**
	 * 팝업 오픈
	 * @param {Object} fnCallback	- 팝업 완료 후 호출 callback 함수
	 * @param {String} popupId		- 팝업 layer Id
	 * @param {Boolean} draggable	- 팝업 Drag 가능 여부
	 * @param {Object} searchParams	- 팝업 내부 데이터 조회시 사용할 parameters
	 */
	dialog : function(fnCallback, popupId, draggable, searchParams) {
		this.popupId = popupId?popupId:"popupPermissionApprovalOrder";
		this.pObj = $("#"+this.popupId);
		this.autoClose = true;
		if (searchParams && searchParams.hasOwnProperty('autoClose')) this.autoClose = searchParams.autoClose;
		popupCommonService.init(this.pObj);
		
		if (draggable) {
			$("div[id='"+this.popupId+"']>.dialog>.dialog_header").off("mousedown").on("mousedown", function(){
				$(this).parent().draggable({disabled:false});
			});
			$("div[id='"+this.popupId+"']>.dialog>.dialog_header").off("mouseup").on("mouseup", function(){
				$(this).parent().draggable({disabled:true});
			});
		}
		
		this.fnCallback = fnCallback;
		
		this.pObj.find(".dialog_btn").off("click").on("click", function() {
			popupPermissionApprovalOrderService.close();
		});
		
		this.searchPermissionApproval();
		this.pObj.show();
	},
	/**
	 * 팝업 종료시 처리 함수
	 */
	close : function() {
		if (!this.pObj.is(':visible')) return;
		
		popupCommonService.finalize();
		this.pObj.hide();
		this.pObj.find(".tblist_popup").html('');
		this.pObj.find(".order_tblist_popup").html('');
	},
	/**
	 * 선택한 결재선 구성원 정보 콜백 처리 후 종료
	 */
	confirm : function() {
		var checkedEmpObjs = {};
		this.pObj.find(".order_tblist_popup .board_list_row").each(function(inx, item){
			var empId = $(this).attr("value");
			checkedEmpObjs[inx+1] = popupPermissionApprovalOrderService.empMap[empId];
		});
		this.fnCallback(checkedEmpObjs);
		if (this.autoClose) this.close();
	},
	/**
	 * 팝업 데이터 조회 - 결재 구성원 조회
	 * @param {Object} 	- 조회 조건
	 */
	searchPermissionApproval : function() {
	
		$.ajax({
			   type: "post",
			   cache : false,
			   url: contextPath + "/goods/goodsinout/apply/searchPermissionApprovalList.do",
			   data : {},
			   success: function(json){
				    var $thisObj = popupPermissionApprovalOrderService;
				    var $pObj = $thisObj.pObj;
				    var $tblObj = $pObj.find(".tblist_popup");
				    var colLength = $pObj.find(".bord_list colgroup>col").length;
				    
				    if (json != null && json.resultCode == WebError.OK){
			   			var list = json.list ;
			   			$thisObj.list = list;
			   			var total = json.list.length;
						var rows = "";

						if (total == 0) {
							$tblObj.html(
  	    				          '<tr class="board_list_row"><td class="board_list_data" colspan="'+colLength+'">'+PopupMessages.noResults+'</td></tr>'
  	    				    );
							return;
						}
						
						for (var i=0; i<list.length; i++) {
							rows += '<tr class="board_list_row">' 
				                 + 	'<td scope="row">' + list[i].leaveApprovalNm + ' / ' + list[i].leaveApprovalNmKo + '</td>'
				                 + 	'<td scope="row">' 
				                 +  '	<a href="#" class="link" name="'+$thisObj.popupId+'" value="'+ i +'">'
				                 + 			list[i].empNm + ' [' + list[i].deptNm + ' / ' + list[i].deptNmKo + ']' 
				                 +	'	</a>'
				                 +  '</td>'
				                ;
						}    							
						$tblObj.html(rows);

						$("a[name='"+$thisObj.popupId+"']").off("click").on("click", function(e){ //제목 
							$thisObj.fnCallback(list[$(this).attr("value")]);
							if ($thisObj.autoClose) $thisObj.close();
							e.preventDefault();
						});
						
					}else{
						$tblObj.html(
							'<tr class="board_list_row"><td class="board_list_data" colspan="'+colLength+'">'+PopupMessages.noResults+'</td></tr>'
						);
					}
			   }
		});
	}
}; // end popupPermissionApprovalOrderService


/**
 * 외부사용자 상세정보 조회 팝업
 * @author: hwshim(X0114723)
 */
var popupVisitorInfoService = {
	dialog : function(fnCallback, popupId, draggable, searchParams) {
		this.popupId = popupId?popupId:"popupOutUserDetailSearch";
		this.pObj = $("#"+this.popupId);
		this.autoClose = true;
		if (searchParams && searchParams.hasOwnProperty('autoClose')) this.autoClose = searchParams.autoClose;
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
		
		this.pObj.find(".dialog_btn").off("click").on("click", function() {
			popupVisitorInfoService.close();
		});
		this.search(searchParams);
		this.pObj.show();
	},
	close : function() {
		if (!this.pObj.is(':visible')) return;
		
		popupCommonService.finalize();
		this.pObj.hide();
		//this.pObj.find(".tblist_popup").html('');
		
		//***** Close 시 기존 조회된 결과 Clear 시킴 *****//
		new CommonForms().getForm("popupVisitorInfoForm").clearText(["filePhotoDiv", "fileJobCertiDiv"]);
	},
	search : function(searchParams) {
		var formData = searchParams;
		
		$.ajax({
			   type: "post",
			   cache : false,
			   url: contextPath + "/common/visitor/getVisitorInfo.do",
			   data : formData,
			   success: function(json){
				    var $thisObj = popupVisitorInfoService;
				    var $pObj = $thisObj.pObj;
				    var $pageNaviId = $thisObj.pageNaviId;
				    var $pageIndexId = $thisObj.pageIndexId;
				    var colLength = $pObj.find(".bord_list colgroup>col").length;
				    //var $tblObj = $pObj.find(".tblist_popup");
				    
				    if (json != null && json.resultCode == WebError.OK){
			   			var info = json.info ;

			   			info.visitorNm = info.visitorNm;
			   			if (info.visitorNmKo) info.visitorNm += '/' + info.visitorNmKo;
			   			info.lastPwChgDt = Common.changeDashDate(info.lastPwChgDt);
			   			info.partnerNm = Common.viewPartnerIdNm(info);
			   			info.birthDate = Common.changeDashDate(info.birthDate);
			   			//info.secEduDt = Common.changeDashDate(info.secEduDt);
			   			if (info.secEduYn != 'Y') info.expSecEduDtDash = '';	// 안전교육만료일자, 3개월이 지났으면, 보여주지 않는다.
			   			info.passEduDt = Common.changeDashDate(info.passEduDt);
			   			//info.visaEndDt = Common.changeDashDate(info.visaEndDt);
			   			if (info.inoutDenyYn === 'N') {
				   			info.inoutDenyStrtDt = '';
				   			info.inoutDenyEndDt = '';
			   			}
			   			
			   			if(info) {
							var form = new CommonForms().getForm("popupVisitorInfoForm");
			       	    	form.deserializeObject(info, true);    	
			       	    	
			       	    	// 이미지 표시
				   			CommonService.makeThumbImageRatio(info.filePhoto,    "filePhotoDiv", 90, 120);
				   			CommonService.makeThumbImageRatio(info.fileJobCerti, "fileJobCertiDiv", 90, 120);
				   			CommonService.makeThumbImageRatio(info.filePersonCerti, "filePersonCertiDiv", 90, 120);
				   			CommonService.makeThumbImageRatio(info.filePersonCertiBack, "filePersonCertiBackDiv", 90, 120);
				   			CommonService.makeThumbImageRatio(info.fileVisa, "fileVisaDiv", 90, 120);
				   		}
					}
			   }
		 });
	}
};// end popupVisitorInfoService 
