/**
 * 팝업 공통 서비스
 * @author: X0114723
 */
var popupCommonService = {
	showRoot : true,	// 최상의 ROOT 노드를 보여줄지 여부
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
	},
	/**
	 * 트리형식의 팝업 스타일 정의
	 * (해당 팝업의 트리에 사용되는 CSS 스타일)
	 * @param {String} id	- popup 영역 ID
	 */
	setTreeStyle : function(id) {
		var treeStyleId = id+"Style";
		var treeStyle = '#'+id;
		
		if ($("#"+treeStyleId).length > 0) return;
		
		var css = '<style id="' + treeStyleId + '">'
				+ treeStyle + ' ul, li { list-style: none; margin: 0; padding: 0; }'
				+ treeStyle + ' ul:first-child { border-left: 1px solid #FFF; margin:-15px 0 0 -15px; }'	// Root 폴더(부서)의 좌측 라인 제거
				+ treeStyle + ' ul:first-child>li>div { border:0; }'	// Root 폴더(부서)의 왼쪽 라인 제거
				//+ 'ul { padding-left: 1em; }'
				+ treeStyle + ' li { padding-left: 1em; border: 1px dotted black; border-width: 0 0 1px 1px; }'	// tree guide 라인 기본 스타일 정의
				+ treeStyle + ' li.container { border-bottom: 0px; }'	// tree bottom 라인 제거	
				
				// 아래 는 ROOT노드를 제외시키고 트리를 그릴때, 좌측에 가로 Guide Line(dotted line)을 제거한다.
				+ treeStyle + ' .treeview > li.submenu { border-bottom: 0px; }'	// tree bottom 라인 제거
				
				+ treeStyle + ' li.empty { font-style: italic; color: silver; border-color: silver; }'	// 현재 사용하지 않음
				+ treeStyle + ' li p { margin:0 0 0 2px; background: #FFF; position: relative; top: 1em; }'	// p태그(내용) 스타일 정의(background가 중요하며, dotted line을 덮어쓰는 용도등)
				+ treeStyle + ' li>div { border-top: 1px dotted black; width:10px; margin-left: -1em; padding: 0; }'	// 하위 디렉토리를 닫는 경우 top line이 안보이게 되므로 사이에 div태그를 넣어 폴더(부서)의 좌측 line을 추가
				+ treeStyle + ' li ul { margin-left: -1em; padding-left: 20px;}'	// 하위 부서
				+ treeStyle + ' ul > li:last-child > ul { border-left: 1px solid #FFF; margin-left: -13px; }'	// 하위 부서의 마지막 좌측 라인 제거
//				+ treeStyle + ' > ul > li:first-child > ul { border-left: 1px solid #FFF; margin-left: -13px; }'
				+ '</style>';
		
		$("body").append(css);
	}
};

var popupMessages = {
	"no_dept" : {
		"ko" : "존재하지 않는 부서이거나, 사용이 제한된 부서입니다.",
		"en" : "A department that does not exist or is restricted in use.",
		"zh" : "不存在的部门或使用限制的部门。",
	},
	
	get : function(msgCode) {
		var lang = LANG || "zh";
		var msgs = this[msgCode];
		var msg = '';
		if (msgs) msg = msgs[LANG];
		return msg;
	}
}

/**
 * 화면명 조회팝업
 * @author: hwshim
 */
var popupMenuSearchService = {
	/**
	 * 팝업 오픈
	 * @param {Object} fnCallback	- 팝업 완료 후 호출 callback 함수
	 * @param {String} popupId		- 팝업 layer Id
	 * @param {Boolean} draggable	- 팝업 Drag 가능 여부
	 * @param {Object} searchParams	- 팝업 내부 데이터 조회시 사용할 parameters
	 */	
	dialog : function(fnCallback, popupId, draggable, searchParams) {
		this.popupId = popupId?popupId:"popupMenuSearch";
		this.pObj = $("#"+this.popupId);
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
			popupMenuSearchService.close();
		});
		
		new CommonForms().getForm("popupMenuSearchForm").deserializeObject(searchParams);
		this.search(1);
		this.pObj.show();
		
		$("#popupMenuSearchForm").off("keydown").on("keydown", function(event) {
        	if (event.keyCode == 13) {
        		popupMenuSearchService.search(1);
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
			eventName : "popupMenuSearchService.search"
		};
		gfn_renderPaging(params);
		this.clear();
	},
	/**
	 * 팝업내부 Form Clear
	 */
	clear : function() {
		new CommonForms().getForm("popupMenuSearchForm").clear();
	},
	/**
	 * 팝업 데이터 조회(화면명)
	 */
	search : function(pageNo) {
		var formData = new CommonForms().getForm("popupMenuSearchForm").setElement("pageNo", pageNo).serializeObject();
		
		$.ajax({
			   type: "post",
			   cache : false,
			   url: contextPath + "/system/authmgmt/menu/searchMenuTreeList.do",
			   data : formData,
			   success: function(json){
				    var $thisObj = popupMenuSearchService;
				    var $pObj = $thisObj.pObj;
				    var $pageNaviId = $thisObj.pageNaviId;
				    var colLength = $pObj.find(".bord_list colgroup>col").length;
				    var $tblObj = $pObj.find(".tblist_popup");
				    
				    if (json != null && json.resultCode == WebError.OK){
				    	var list = json.list;
			   			var total = json.total;
						var rows = "";
						
						//$('#total_cnt'+$pObj.popupId).html('Total : <b>' + total + '</b>');
					
						var params = {
							divId : $pageNaviId,
							pageNo : pageNo,
							//pageSize : 10,		// 기본값 : 10
							totalCount : total,
							eventName : "popupMenuSearchService.search"
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
				                 + 	'<td scope="row">'
				              	 +		'<a href="#" class="link" name="'+$thisObj.popupId+'" value="'+ i +'">' + list[i].menuId + '</a>'   
				                 +  '</td>'
				              	 + 	'<td class="tl" scope="row">'
				              	 +		'<a href="#" class="link" name="'+$thisObj.popupId+'" value="'+ i +'">' + list[i].fullPathMenuDispNm.replaceAll('>', ' > ') + '</a>'
				              	 +  '</td>'
				                 + 	'</tr>';
						}    							
						$tblObj.html(rows);
						
						$("a[name='"+$thisObj.popupId+"']").off("click").on("click", function(e){ //제목 
							$thisObj.fnCallback(list[$(this).attr("value")]);
							$thisObj.close();
							
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
}; // end popupMenuSearchService

/**
 * 건물(구역) 조회팝업
 * @author: hwshim
 */
var popupBldgSearchService = {
	/**
	 * 팝업 오픈
	 * @param {Object} fnCallback	- 팝업 완료 후 호출 callback 함수
	 * @param {String} popupId		- 팝업 layer Id
	 * @param {Boolean} draggable	- 팝업 Drag 가능 여부
	 * @param {Object} searchParams	- 팝업 내부 데이터 조회시 사용할 parameters
	 */	
	dialog : function(fnCallback, popupId, draggable, searchParams) {
		this.popupId = popupId?popupId:"popupBldgSearch";
		this.pObj = $("#"+this.popupId);
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
			popupBldgSearchService.close();
		});
		
		new CommonForms().getForm("popupBldgSearchForm").deserializeObject(searchParams);
		this.search();
		this.pObj.show();
		
		$("#popupBldgSearchForm").off("keydown").on("keydown", function(event) {
        	if (event.keyCode == 13) {
        		popupBldgSearchService.search(1);
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
		$("input[name='"+this.popupId+"']").prop("checked", false);
		this.clear();
	},
	/**
	 * 팝업내부 Form Clear
	 */
	clear : function() {
		new CommonForms().getForm("popupBldgSearchForm").clear();
	},
	/**
	 * 선택한 건물(구역) 정보를 담아 콜백 처리 후 종료
	 */
	confirm : function() {
		var gateArr = [];
		$("input[name='"+this.popupId+"']:checked").each(function() {
			gateArr.push(popupBldgSearchService.list[this.value]);
		});
		this.fnCallback(gateArr);
		this.close();
	},
	/**
	 * 팝업 데이터 조회 - 건물(구역)
	 */
	search : function() {
		var formData = new CommonForms().getForm("popupBldgSearchForm").serializeObject();
		formData["useYn"] = "Y";
		
		$.ajax({
			   type: "post",
			   cache : false,
			   url: contextPath + "/system/codemgmt/building/searchAllBuildingList.do",
			   data : formData,
			   success: function(json){
				    var $thisObj = popupBldgSearchService;
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
				                 + 	'<td scope="row">'
				                 +      '<span class="jqformCheckboxWrapper">'
				              	 +      '<input name="'+$thisObj.popupId+'" class="jqformHidden jqCheck" type="checkbox" value="'+i+'">'
				              	 +      '<span class="jqformCheckbox"></span>'
				              	 +  '</span>'
				                 +  '</td>'
				              	 + 	'<td scope="row">'
				              	 +  list[i].gateNm + ' / '+list[i].gateNmKo
				              	 +  '</td>';
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
}; // end popupBldgSearchService

/**
 * 조직도 구성원 조회 팝업
 * @author: hwshim
 */
var popupOrgSearchService = {
	/**
	 * 팝업 오픈
	 * @param {Object} fnCallback	- 팝업 완료 후 호출 callback 함수
	 * @param {String} popupId		- 팝업 layer Id
	 * @param {Boolean} draggable	- 팝업 Drag 가능 여부
	 * @param {Object} searchParams	- 팝업 내부 데이터 조회시 사용할 parameters
	 */	
	dialog : function(fnCallback, popupId, draggable, searchParams) {
		this.popupId = popupId?popupId:"popupOrgSearch";
		this.pObj = $("#"+this.popupId);
		
		popupCommonService.init(this.pObj);
		popupCommonService.setTreeStyle('popupOrgTreeDiv');
		
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
			popupOrgSearchService.close();
		});
		
		//new CommonForms().getForm("현재searchForm없음").deserializeObject(searchParams);
		
		this.searchDeptTree();
		this.pObj.show();
	},
	/**
	 * 팝업 종료시 처리 함수
	 */
	close : function() {
		popupCommonService.finalize();
		this.pObj.hide();
		$("#popupOrgTree").html('');
		this.pObj.find(".tblist_popup").html('');
	},
	/**
	 * 선택한 구성원 정보 콜백 처리 후 종료
	 */
	confirm : function() {
		var checkedEmpId = this.pObj.find("input[name='CHECK_EMPID']:checked").val();
		var empObj = this.empMap[checkedEmpId];
		this.fnCallback(empObj);
		this.close();
	},
	/**
	 * 부서 클릭시 해당 부서의 구성원 조회
	 * @param {Object} obj	- 선택부서의 객체
	 */
	deptClick : function(obj) {
		var deptId = obj.id.replace('_span','');
 		this.setDeptMenuStyle(deptId);
		this.searchEmp(deptId);
 	},
 	/**
	 * 팝업 데이터 조회 - 부서
	 */
	searchDeptTree : function() {
		var formData = {};
		
		$.ajax({
			   cache : false,
			   url: contextPath + "/system/orgmgmt/dept/searchDeptTreeMap.do",
			   data : formData,
			   success: function(json){
				  if (json != null && json.resultCode == WebError.OK){
					 var rootMap = json.map.ROOT_MAP;
					 var rootNode = rootMap["CHILDRENS"][0];
				 
					 var treeHtml = popupOrgSearchService.makeDeptTreeNode(rootNode);
					 
					 // ROOT_NODE 를 보여줄지 여부에 따라 tree를 다시 그린다.
					 // ROOT 노드를 제외할 경우 ROOT 노드의 SUB 노드만을 추출하여 트리 영역을 그린다.
					 if (popupCommonService.showRoot) {
						$("#popupOrgTree").html(treeHtml);
					 } else {
						var subTreeHtml = $("ul", $(treeHtml)).html();
					 	$("#popupOrgTree").html(subTreeHtml);
					 }
					 
					 ddtreemenu.createTree("popupOrgTree", true);
					 ddtreemenu.flatten('popupOrgTree', 'contact');
					 //$(".submenu", $("#popupOrgTree")).addClass("dotted");
					 
					 // 기본적으로 자기가 속한 부서의 조직도를 보여준다.
					 popupOrgSearchService.expandDeptTree(sessionUser.deptId);
					 popupOrgSearchService.searchEmp(sessionUser.deptId);
				  }
			   }
		});
	},
	/**
 	 * 트리 확장
 	 * (선택한 부서의 트리를 확장한다)
 	 * @param {String} deptId	- 선택 부서
 	 */
 	expandDeptTree : function(deptId) {
 		if (!deptId) return;
 		// 트리여역
		var treeObj = document.getElementById("popupOrgTreeDiv");
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
			return;
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
	 * 팝업 데이터 조회 - 부서 구성원
	 */
	searchEmp : function(deptId) {
		var formData = {};
		formData["deptId"] = deptId;
		formData["popupType"] ="O";	// 조직도 타입
		
		$.ajax({
			   type: "post",
			   cache : false,
			   url: contextPath + "/system/orgmgmt/emp/searchEmpListByDeptId.do",
			   data : formData,
			   success: function(json){
				  var $thisObj = popupOrgSearchService;
				  var $pObj = $thisObj.pObj;
				  var $tblObj = $pObj.find(".tblist_popup");
				  
				  $thisObj.empMap = {};
				  
				  if (json != null && json.resultCode == WebError.OK){
					 var list = json.list ;
			   		 var total = json.list.length;
					 var rows = "";
					 
					 for(var i in json.list) {
						 var emp = json.list[i];
						 
						 $thisObj.empMap[emp.empId] = emp;
						 
						 rows	+= '<tr class="board_list_check">'
						 		+   '<td scope="row">'
						 		+     '<span class="jqformRadioWrapper">'
						 		+       '<input class="jqformHidden jqRadio" type="radio" name="CHECK_EMPID" value="'+emp.empId+'">'
						 		+       '<span class="jqformRadio"></span>'
						 		+     '</span>'
						 		+   '</td>'
						 		+   '<td scope="row">'+emp.empDispNm+'</td>'
			 					+   '<td scope="row">'+emp.jcDispNm+'</td>'
			 					+   '<td scope="row">'+emp.jwCd+'</td>'
			 					+   '<td scope="row">('+emp.telNo+')</td>'
			 					+   '<td scope="row">'+emp.jwDispNm+'</td>'
			 					+ '</tr>';
					 }
					 
					 $tblObj.html(rows);
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
	    		this.treeHtml += '&nbsp;&nbsp;<span id="'+id+'_span" onclick="popupOrgSearchService.deptClick(this);">'+ name +'</span>';
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
				this.treeHtml += '&nbsp;&nbsp;<span id="'+id+'_span" onclick="popupOrgSearchService.deptClick(this);">'+ name +'</span>';
				this.treeHtml += '</p>';
	    		this.treeHtml += '</li>';
			}
	    }
	    
	    this.makeTree(map);
	    return this.treeHtml;
	}
}; // end popupOrgSearchService

/**
 * 반출입물품목록조회
 * @author: hwshim
 */
var popupArticleSearchService = {
	articleKnd:{},
	articleGroup:{},
	/**
	 * 팝업 오픈
	 * @param {Object} fnCallback	- 팝업 완료 후 호출 callback 함수
	 * @param {String} popupId		- 팝업 layer Id
	 * @param {Boolean} draggable	- 팝업 Drag 가능 여부
	 * @param {Object} searchParams	- 팝업 내부 데이터 조회시 사용할 parameters
	 */
	dialog : function(fnCallback, popupId, draggable, searchParams) {
		this.popupId = popupId?popupId:"popupArticleSearch";
		this.pObj = $("#"+this.popupId);
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
			popupArticleSearchService.close();
		});
		
		this.$articleKndObj = $("#popupArticleSearchForm").find("[name='articleKndNo']");
		this.$articleGroupObj = $("#popupArticleSearchForm").find("[name='articleGroupId']");
		this.$articleKndObj.off("change").on("change", function(e) {
        	e.preventDefault();
        	if (!popupArticleSearchService.articleGroup || !popupArticleSearchService.articleGroup.hasOwnProperty("1")) return;
        	var kndNo = $(this).val();
        	//popupArticleSearchService.$articleGroupObj.empty().append("<option value='' selected>All</option>");
        	popupArticleSearchService.$articleGroupObj.empty();
        	if (kndNo) {
	        	$.each(popupArticleSearchService.articleGroup[kndNo], function(k, v) {
	        		var option = "" ;
	        		if ( searchParams.articleGroupId == k ) { 
	        			option = $("<option kndNo='"+kndNo+"' value='"+k+"' selected>"+v["articleGroupNm"]+"/"+v["articleGroupNmKo"]+"</option>");
	        		} else {
	        			option = $("<option kndNo='"+kndNo+"' value='"+k+"'>"+v["articleGroupNm"]+"/"+v["articleGroupNmKo"]+"</option>");
	        		}
	        		popupArticleSearchService.$articleGroupObj.append(option);
	 	    	});
        	} else {
        		$.each(popupArticleSearchService.articleGroup, function(gk, gv) {
        			$.each(gv, function(k, v) {
        				var option = "" ;
        				if ( searchParams.articleGroupId == k ) { 
        					option = $("<option kndNo='"+gk+"' value='"+k+"' selected>"+v["articleGroupNm"]+"/"+v["articleGroupNmKo"]+"</option>");
        				} else {
        					option = $("<option kndNo='"+gk+"' value='"+k+"'>"+v["articleGroupNm"]+"/"+v["articleGroupNmKo"]+"</option>");
        				}
    	        		 popupArticleSearchService.$articleGroupObj.append(option);
    	 	    	});
	 	    	});
        	}
        	//popupArticleSearchService.$articleGroupObj.trigger("change");
        });
		this.$articleGroupObj.off("change").on("change", function(e) {
        	var kndNo = $("option:selected", popupArticleSearchService.$articleGroupObj).attr("kndNo");
        	popupArticleSearchService.$articleKndObj.val(kndNo);
        });
		
		console.log(searchParams) ;	// jbsun test
		$("#popupArticleSearchForm").find("input[name=articleNm]").val(searchParams.articleNm) ;
		CommonService.loadCodeList("G100", "articleKndNo", "", searchParams.articleKndNo, function() {	// jbsun : seearchParam 추가
		//popupArticleSearchService.articleKndMap(function() {
			popupArticleSearchService.articleGroupMap(function(){
				popupArticleSearchService.search(1);		
			});
		}, "popupArticleSearchForm");
		this.pObj.show();
		
		$("#popupArticleSearchForm").off("keydown").on("keydown", function(event) {
        	if (event.keyCode == 13) {
        		popupArticleSearchService.search(1);
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
			eventName : "popupArticleSearchService.search"
		};
		gfn_renderPaging(params);
		this.clear();
	},
	/**
	 * 팝업내부 Form Clear
	 */
	clear : function() {
		new CommonForms().getForm("popupArticleSearchForm").clear();
	},
	/**
	 * 팝업 데이터 조회 - 반출입 물품 목록
	 */
	search : function(pageNo) {
		var formData = new CommonForms().getForm("popupArticleSearchForm").setElement("pageNo", pageNo).serializeObject();
		
		$.ajax({
			   type: "post",
			   cache : false,
			   url: contextPath + "/system/codemgmt/article/searchArticleList.do",
			   data : formData,
			   success: function(json){
				    var $thisObj = popupArticleSearchService;
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
							eventName : "popupArticleSearchService.search"
						};
						gfn_renderPaging(params);
						
						if (total == 0) {
							$tblObj.html(
  	    				        '<tr class="board_list_row"><td class="board_list_data" colspan="'+colLength+'">'+PopupMessages.noResults+'</td></tr>'
  	    				    );
							return;
						}    							
						
						for (var i=0; i<list.length; i++) {
							var articleNo = ''+list[i].articleKndNo;
							
							rows += '<tr class="board_list_row">' 
				                 + 	'<td scope="row">'
				              	 //+  $thisObj.articleKnd[articleNo]+'('+articleNo+')'
				                 + list[i].articleKndDispNm+'('+articleNo+')'
				                 +  '</td>'
				              	 + 	'<td scope="row">'
				              	 +	list[i].articleGroupNm
				              	 +  '</td>'
				              	 + 	'<td scope="row">'
				              	 +	    '<a href="#" class="link" name="'+$thisObj.popupId+'" value="'+ i +'">' + list[i].articleId + '</a>'   
   				                 +  '</td>'
				              	 + 	'<td scope="row">'
				              	 +		'<a href="#" class="link" name="'+$thisObj.popupId+'" value="'+ i +'">' + list[i].articleNm + '</a>' 
				              	 +  '</td>'
				                 + 	'</tr>';
						}    							
						$tblObj.html(rows);
						
						$("a[name='"+$thisObj.popupId+"']").off("click").on("click", function(e){ //제목 
							$thisObj.fnCallback(list[$(this).attr("value")]);
							$thisObj.close();
							
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
	/*articleKndMap : function(callbackFn) {
		var formData= {};
		
		$.ajax({
			   type: "post",
			   cache : false,
			   url: contextPath + "/system/codemgmt/articlegroup/getArticleKndMap.do",
			   data : formData,
			   success: function(json){
				    if (json != null && json.resultCode == WebError.OK){
			   			var articleKnd = json.map;
			   			
			   			popupArticleSearchService.$articleKndObj.empty().append("<option value='' selected>All</option>");
			   			$.each(articleKnd, function(k, v) {
			   				var option = $("<option value='"+k+"'>"+v+"("+k+")</option>");
			   				popupArticleSearchService.$articleKndObj.append(option);
			   			});
			   			
			   			popupArticleSearchService.articleKnd = articleKnd;
			   			//$("#articleKndNo").trigger("change");
			   		}
			   },
			   complete: function() {
				   if (callbackFn && typeof callbackFn === "function") callbackFn();
			   }
		 });
	},*/
	/**
	 * 물품 종류(그룹) 조회
	 */
	articleGroupMap : function(callbackFn) {
		var formData= {};
		
		var thisObj = this;
		$.ajax({
			   type: "post",
			   cache : false,
			   url: contextPath + "/system/codemgmt/articlegroup/getAllArticleGroupMap.do",
			   data : formData,
			   success: function(json){	   
					if (json != null && json.resultCode == WebError.OK){
			   			thisObj.articleGroup = json.map;
			   			popupArticleSearchService.$articleKndObj.trigger("change");
			   		}
			   },
			   complete : function() {
				   if (callbackFn && typeof callbackFn === "function") callbackFn();
			   }
		 });
	},
}; // popupArticleSearchService

/**
 * 결재선 팝업
 * @author: hwshim
 */
var popupApprovalOrderService = {
	/**
	 * 팝업 오픈
	 * @param {Object} fnCallback	- 팝업 완료 후 호출 callback 함수
	 * @param {String} popupId		- 팝업 layer Id
	 * @param {Boolean} draggable	- 팝업 Drag 가능 여부
	 * @param {Object} searchParams	- 팝업 내부 데이터 조회시 사용할 parameters
	 */
	dialog : function(fnCallback, popupId, draggable, searchParams) {
		this.popupId = popupId?popupId:"popupApprovalOrder";
		this.pObj = $("#"+this.popupId);
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
			popupApprovalOrderService.close();
		});
		
		this.searchEmp(searchParams);
		this.pObj.show();
	},
	/**
	 * 팝업 종료시 처리 함수
	 */
	close : function() {
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
			checkedEmpObjs[inx+1] = popupApprovalOrderService.empMap[empId];
		});
		this.fnCallback(checkedEmpObjs);
		this.close();
	},
	/**
	 * 팝업 데이터 조회 - 결재 구성원 조회
	 * @param {Object} searchParams	- 조회 조건
	 */
	searchEmp : function(searchParams) {
		var data = $.extend({}, searchParams);
		if (!data.hasOwnProperty("jwCds")) data["jwCds"] = "B1,B3,B5,B7,AK";
		data["htCd"] = "C";
		data["popupType"] ="A";	// 결재선타입
		
		$.ajax({
			   type: "post",
			   //processData: false,
			   //contentType: false,
			   //async: false,
			   cache : false,
			   url: contextPath + "/system/orgmgmt/emp/searchEmpListByDeptId.do",
			   data : data,
			   success: function(json){
				  var $thisObj = popupApprovalOrderService;
				  var $pObj = $thisObj.pObj;
				  var $tblObj = $pObj.find(".tblist_popup");
				  
				  var $orderTblObj = $pObj.find(".order_tblist_popup");
				  
				  $orderTblObj.html('');
				  $thisObj.empMap = {};
				  
				  if (json != null && json.resultCode == WebError.OK){
					 var list = json.list ;
			   		 var total = json.list.length;
					 var rows = "";
					 
					 for(var i in json.list) {
						 var emp = json.list[i];
						 
						 $thisObj.empMap[emp.empId] = emp;
						 rows	+= '<tr class="board_list_check">'
						 		+   '<td scope="row">'
						 		+     '<span class="jqformCheckboxWrapper"">'
						 		+       '<input class="jqformHidden jqCheck" type="checkbox" name="CHECK_EMPID" value="'+emp.empId+'">'
						 		+       '<span class="jqformCheckbox"></span>'
						 		+     '</span>'
						 		+   '</td>'
						 		+   '<td scope="row">'+emp.empDispNm+'</td>'
						 		+   '<td scope="row">'+emp.empId+'</td>'
			 					//+   '<td scope="row">'+emp.jcDispNm+'</td>'
			 					//+   '<td scope="row">'+emp.jwCd+'</td>'
			 					//+   '<td scope="row">'+emp.telNo+'</td>'
			 					//+   '<td scope="row">'+emp.jwDispNm+'</td>'
			 					+ '</tr>';
					 }
					 
					 $tblObj.html(rows); // 사원 선택 테이블 생성
					 
					 $tblObj.find("input[name='CHECK_EMPID']").off("change").on("change", function() {
						$thisObj.appendOrRemoveEmpObj($thisObj.empMap[this.value], this.checked);
					 });
					 
					 // 요청부서 결재라인에 포함되어 있는 구성원 선택
					 var empIdList = ApprService.getReqLineEmpIdList();
					 for (var i=1; i < empIdList.length; i++) {	// 첫번째(index:0)는 자기 자신이므로 제외
						 var emp = $thisObj.empMap[empIdList[i]];
						 if (!emp) continue;
						 $thisObj.appendOrRemoveEmpObj(emp, true);
						 $("input[name='CHECK_EMPID'][value='"+emp.empId+"']", $tblObj).attr("checked", true);
						/*var empId = empIdList[i];
						$("input[name='CHECK_EMPID'][value='"+empId+"']", $tblObj).click();*/
					 }
				  }
			   }
		});
	},
	appendOrRemoveEmpObj : function(emp, isAppend) {
		if (!emp) return;
		var $orderTblObj = popupApprovalOrderService.pObj.find(".order_tblist_popup");
		  
		if (isAppend) {
			var orderHtml
					= '<tr class="board_list_row" value="'+emp.empId+'">'
						+   '<td scope="row" class="emp_inx">1</td>'
						+   '<td scope="row">'+emp.empDispNm+'</td>'
						+   '<td scope="row" class="emp_up"><span onclick="popupApprovalOrderService.upEmpObj(this);" style="cursor:pointer;">▲</span></td>'
						+   '<td scope="row" class="emp_down"><span onclick="popupApprovalOrderService.downEmpObj(this);" style="cursor:pointer;">▼</span></td>'
						+   '<td scope="row">'
						+     '<div class="t_delete">'
						+       '<img src="/statics/images/icon_delete.png" alt="삭제" onclick="popupApprovalOrderService.removeEmpObj(this);">'
						+     '</div>'
						+   '</td>'
						+ '</tr>';
			
			$orderTblObj.append(orderHtml); // 사원 추가
		} else {
			$orderTblObj.find("tr.board_list_row[value='"+emp.empId+"']").remove(); // 사원 제거
		}
		
		popupApprovalOrderService.reorderEmpObj(); // 순서 재설정
	},
	/**
	 * 선택한 구성원을 앞으로 이동
	 * @param {Object} obj	- 선택 구성원 정보
	 */
	upEmpObj : function(obj) {
		var currObj = $(obj).closest(".board_list_row");
		var prevObj = currObj.prev();
		if (prevObj.length > 0) currObj.after(prevObj);
		this.reorderEmpObj();
	},
	/**
	 * 선택한 구성원을 뒤로 이동
	 * @param {Object} obj	- 선택 구성원 정보
	 */
	downEmpObj : function(obj) {
		var currObj = $(obj).closest(".board_list_row");
		var nextObj = currObj.next();
		if (nextObj.length > 0) currObj.before(nextObj);
		this.reorderEmpObj();
	},
	/**
	 * 선택한 구성원 삭제
	 * @param {Object} obj	- 선택 구성원 정보
	 */
	removeEmpObj : function(obj) {
		var currObj = $(obj).closest(".board_list_row");
		var empId = currObj.attr("value");
		currObj.remove();
		this.pObj.find(".tblist_popup input[name='CHECK_EMPID'][value='"+empId+"']").prop("checked", false);
		this.reorderEmpObj();
	},
	/**
	 * 선택한 구성원들의 순서를 재정렬
	 */
	reorderEmpObj : function() {
		var orderedEmpObjs = this.pObj.find(".order_tblist_popup").children();
		var totEmpLength = orderedEmpObjs.length;
		orderedEmpObjs.each(function(inx, item) {
			$(item).find(".emp_inx").text(inx+1);
			if (inx == 0) $(item).find(".emp_up").find("span").css("display", "none");
			else $(item).find(".emp_up").find("span").css("display", "");
			if (inx == orderedEmpObjs.length - 1) $(item).find(".emp_down").find("span").css("display", "none");
			else $(item).find(".emp_down").find("span").css("display", "");
		});
	}
}; // end popupApprovalOrderService

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
			popupPartnerSearchService.close();
		});
		
		new CommonForms().getForm("popupPartnerSearchForm").deserializeObject(searchParams);
		this.search(1);
		this.pObj.show();

		$("#popupPartnerSearchForm").off("keydown").on("keydown", function(event) {
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
	 * 팝업 데이터 조회 - 외부 협력 업체
	 */
	search : function(pageNo) {
		var formData = new CommonForms().getForm("popupPartnerSearchForm").setElement("pageNo", pageNo).serializeObject();
		
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
								'<tr class="board_list_row"><td class="board_list_data" colspan="'+colLength+'">'+PopupMessages.noResults+'</td></tr>'
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
				              	 + 	'<td scope="row">' + list[i].partnerNmKo + '</td>'
				              	 //+ 	'<td scope="row">' + list[i].address + '</td>'
				              	 //+ 	'<td scope="row">' + list[i].telNo + '</td>'
				                 + 	'</tr>';
						}    							
						$tblObj.html(rows);
						
						$("a[name='"+$thisObj.popupId+"']").off("click").on("click", function(e){ //제목 
							$thisObj.fnCallback(list[$(this).attr("value")]);
							$thisObj.close();
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
}; // end popupPartnerSearchService
