/**
 * 페이징 처리
 * @author X0114723
 */

/**
 * 페이지 이동
 * @param {String||Number} value	- 페이지 이동시 호출될 파라미터(주로 pageNo)
 * @param {Object}		params		- 페이지 이동 호출 함수 포함
 */
function _movePage(value, params){
	if(typeof(params.eventName) == "function") params.eventName(value);
	else eval(params.eventName + "(value);");
}	

/**
 * 페이징 영역을 Rendering한다.
 * @params {Object} params {
 *		divId : 페이징 태그가 그려질 div
 *		pageNo : 현재 페이지 번호
 *		pageSize : 페이지당 레코드 수
 *		totalCount : 전체 조회 건수 
 *		eventName : 페이징 하단의 숫자 등의 버튼이 클릭되었을 때 호출될 함수 이름
 * }
 */
function gfn_renderPaging(params){
	//console.log(params);
	var divId = params.divId; //페이징이 그려질 div id
	
	var totalCount	= parseInt(params.totalCount); 	// 전체 조회 건수
	var currPageNo	= parseInt(params.pageNo);		// 페이지 번호
	var pageSize	= parseInt(params.pageSize);	// 페이지당 레코드 수
	var pageLength	= parseInt(params.pageLength);	// 화면에 보여지는 페이지 수

	if (!pageSize) pageSize = 10;
	if (!pageLength) pageLength = 10;
	
	var totalIndexCount = Math.ceil(totalCount / pageSize); // 전체 인덱스 수
	
	$("#"+divId).empty();
	var preStr = "";
	var postStr = "";
	var str = "";
	
	var first = (parseInt((currPageNo-1)/pageLength) * pageLength) + 1;
	var last = (parseInt(totalIndexCount/pageLength) == parseInt((currPageNo-1)/pageLength)) ? totalIndexCount%pageLength : pageLength;
	var prev = (parseInt((currPageNo-1)/pageLength)*pageLength) - (pageLength-1) > 0 ? (parseInt((currPageNo-1)/pageLength)*pageLength) - (pageLength-1) : 1; 
	var next = (parseInt((currPageNo-1)/pageLength)+1) * pageLength + 1 < totalIndexCount ? (parseInt((currPageNo-1)/pageLength)+1) * pageLength + 1 : totalIndexCount;
	
	//console.log(first, last, prev, next, totalIndexCount, currPageNo);
	var strParams = JSON.stringify(params);
	
	if(totalIndexCount > pageLength){ //전체 인덱스가 10이 넘을 경우, 맨앞, 앞 태그 작성
		var firstEvent = (1 == currPageNo)?"":"onclick='_movePage(1,"+strParams+")'";
		var prevEvent = (prev == currPageNo)?"":"onclick='_movePage("+prev+", " + strParams + ")'";
		preStr += "<a href='#' class='Link First nav_paging_btn_fst' "+firstEvent+"><span class='blind'>처음으로</span></a>"
			   +  "<a href='#' class='Link Prev nav_paging_btn_prev' "+prevEvent+"><span class='blind'>이전으로</span></a>";
	} else if(totalIndexCount <= pageLength && totalIndexCount > 1){ //전체 인덱스가 10보다 작을경우, 맨앞 태그 작성
		var firstEvent = (1 == currPageNo)?"":"onclick='_movePage(1,"+strParams+")'";
		preStr += "<a href='#' class='Link First nav_paging_btn_fst' "+firstEvent+"><span class='blind'>처음으로</span></a>";
	}
	
	if(totalIndexCount > pageLength){ //전체 인덱스가 10이 넘을 경우, 맨뒤, 뒤 태그 작성
		var nextEvent = (next == currPageNo)?"":"onclick='_movePage("+next+", " + strParams + ")'";
		var lastEvent = (totalIndexCount == currPageNo)?"":"onclick='_movePage("+totalIndexCount+", " + strParams + ")'";
		postStr += "<a href='#' class='Link Next nav_paging_btn_next' "+nextEvent+"><span class='blind'>다음으로</span></a>"
				+  "<a href='#' class='Link Last nav_paging_btn_lst' "+lastEvent+"><span class='blind'>마지막으로</span></a>";
	} else if(totalIndexCount <= pageLength && totalIndexCount > 1){ //전체 인덱스가 10보다 작을경우, 맨뒤 태그 작성
		var lastEvent = (totalIndexCount == currPageNo)?"":"onclick='_movePage("+totalIndexCount+", " + strParams + ")'";
		postStr += "<a href='#' class='Link Last nav_paging_btn_lst' " + lastEvent + "><span class='blind'>마지막으로</span></a>";
	}
	
	for(var i=first; i<(first+last); i++){
		if(i != currPageNo){
			str += "<a href='#' class='Link af-paging-number' onclick='_movePage("+i+", " + strParams + ")'>"+i+"</a>";
		} else {
			str += "<a href='#' class='Link af-paging-number af-paging-selected Selected'>"+i+"</a>";
		}
	}
	$("#"+divId).append(preStr + str + postStr);
}
