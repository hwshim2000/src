/**
 * 팝업 유지 설정을 위한 Cookie 서비스
 * @author X0114723
 */

/**
 * Cookie & LocalStorage 서비스
 * @returns
 */
var CookieService = {
	type : 'C',				// C : Cookie 사용, L : LocalStorage 사용
	tot_count : 0,			// 팝업 수
	init_top : 0,			// 팝업 시작위치 : top
	init_left : 0,			// 팝업 시작위치 : left
	top_space : -10,		// 이전 팝업과의 top 간격(pixel)
	left_space : 10,		// 이전 팝업과의 left 간격(pixel)
	popup_interval : 1000,	// 팝업 오픈 간격(milliseconds)
	
	/**
	 * @param type			- C : Cookie 사용, L : LocalStorage 사용
	 * @params popupList	- 팝업 목록
	 * @params callback		- 팝업 호출 콜백 함수
	 * @params options		- 팝업 옵션
	 * @returns
	 */
	init : function(type, popupList, callback, options) {
		this.type = type?type:'C';
		
		if (!popupList || popupList.length == 0) return this;
		var availList  = [];
		
		for (var i in popupList) {
			if (CookieService.get(popupList[i].cookieId) != popupList[i].cookieVal) {
				popupList[i].lang = LANG;
				availList.push(popupList[i]);
			}
		}
		this.tot_count = availList.length;
		
		if (this.tot_count == 0) return this;
		if (!callback || typeof callback !== 'function') return this;
		if (options && typeof options === 'object') {
			if (options.top_space) this.top_space = options.top_space;
			if (options.left_space) this.left_space = options.left_space;
			if (options.popup_interval) this.popup_interval = options.popup_interval;
		}
		
		// 팝업 목록 중간 부분이 화면의 중간에 팝업되도록 하기 위한 설정
		// 간격값이 0 이면, 화면의 중앙에서 팝업
		// (팝업수가 홀수 일 경우, 잴 처음 뜨는 팝업은 중간에 뜨는 팝업보다 (간격*(총 팝업수/2, 소숫점제외))의 간격만큼 떨어져서 오픈.
		// ex) 팝업수 :3, 10(간격)*(3(팝업수)/2) - (10(간격)/2)*((3(팝업수)+1)%2) = 10*1-0, 즉, 첫번째는 중앙 위치보다  -10, 두번째는 중앙 0, 세번째는 + 10에 위치
		// |-----|-----|,     |-----|-----|-----|-----|
		//-10    0    10,	 -20   -10    0     10    20
		// (팝업수가 짝수 일 경우, 잴 처음 뜨는 팝업은 중간에 뜨는 팝업보다 (간격*총 팝업수/2 - 간격/2)만큼 떨어져서 오픈.
		// ex) 펍업수 :2, 10(간격)*(2(팝업수)/2) - (10(간격)/2)*((2(팝업수)+1)%2) = 10*1-5, 즉, 첫번째는 중앙 위치보다 -5, 두번째는 중앙+5에 위치
		// |-----|,		|-----|-----|-----|
		//-5  0  5,	   -15   -5  0  5     15
		this.init_top = this.top_space * parseInt(this.tot_count/2) - (this.top_space/2)*((this.tot_count+1)%2);
		this.init_left = this.left_space * parseInt(this.tot_count/2) - (this.left_space/2)*((this.tot_count+1)%2);
		
		// 팝업 interval을 주지 않을 경우, popup이 제대로 열리지 않는 경우 발생함.
		for (var i in availList) {
			availList[i].popupIndex = i;
			if (this.popup_interval && this.popup_interval > 0) setTimeout(callback, i*this.popup_interval, availList[i]);
			else callback(availList[i]);
		}
		
		return this;
	},
	/**
	 * 저장소에 데이터 저장
	 * @param type			- C : Cookie 사용, L : LocalStorage 사용
	 * @param name		- 저장키
	 * @param value		- 저장값
	 * @param expdays	- 저장소 보존 기간
	 */
	set : function(name, value, expdays) {
		if (value && expdays && expdays > 0) {
			if (this.type === 'C' || this.type === 'Cookie') Cookies.setCookie(name, value, expdays?expdays:1);
			else LocalStorage.set(name, value, expdays?expdays:1);
		}
		return this;
	},
	/**
	 * 저장된 데이터 조회
	 * @param name		- 저장키
	 */
	get : function(name) {
		if (this.type && this.type === 'C') return Cookies.getCookie(name);
		else return LocalStorage.get(name);
	},
	/**
	 * 팝업
	 * @param url		- 팝업 url
	 * @param options	- 팝업 옵션
	 * @param params	- 전송 파라미터
	 */
	popup : function(url, name, options, params) {
		if (!url) return;
		if (!params) params = {};
		if (!options) options = {};
		
		params.cookieType = this.type;// cookieType : C(Cookie), L(LocalStorage)
		
		options.space = {
			top : params.popupIndex * this.top_space - this.init_top,		// 팝업 띄울때마다 top 간격
			left : params.popupIndex * this.left_space - this.init_left	// 팝업 띄울때마다 left 간격
		};
		options.scrollbars = "yes";
		
		/*console.log('-----------------------------------------------')
		console.log("screen W,H = ", screen.width, screen.height);
		console.log("screen.avail W,H = ", screen.availWidth, screen.availHeight);
		console.log("window.screen T,L = " , window.screenTop, window.screenLeft);
		console.log("window.screen X,Y = ", window.screenX, window.screenY);
		console.log("options : ", options);
		console.log('-----------------------------------------------')*/
		
		CommonService.postPopup(url, name, options, params)
		//CommonService.popup(popUrl, name, options);
	}
}

var Cookies = {
	/**
	 * 쿠키 설정
	 * @param {String} cookieName	- 쿠키명
	 * @param {String} value		- 쿠기값
	 * @param {Number} exdays		- 쿠키 만료일(유지일수)
	 */
	setCookie : function(cookieName, value, exdays){
		var exdate = new Date();
	    exdate.setDate(exdate.getDate() + exdays);
	    var cookieValue = escape(value) + ((exdays==null) ? "" : "; path=/; expires=" + exdate.toGMTString());
	    document.cookie = cookieName + "=" + cookieValue;
	},
	/**
	 * 쿠키 삭제
	 * @param {String} cookieName	- 쿠키명
	 */
	deleteCookie : function(cookieName){
	    var expireDate = new Date();
	    expireDate.setDate(expireDate.getDate() - 1);
	    document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
	},
	/**
	 * 쿠키값 반환
	 * @param {String} cookieName	- 쿠키명
	 * @return {String}				- 쿠키값
	 */
	getCookie : function(cookieName) {
	    cookieName = cookieName + '=';
	    var cookieData = document.cookie;
	    var start = cookieData.indexOf(cookieName);
	    var cookieValue = '';
	    if(start != -1){
	        start += cookieName.length;
	        var end = cookieData.indexOf(';', start);
	        if(end == -1)end = cookieData.length;
	        cookieValue = cookieData.substring(start, end);
	    }
	    
	    return unescape(cookieValue);
	}
}

/**
 * localStorage를 활용한 Cookie 대체 서비스
 * @author X0117423
 */
var LocalStorage = {
	scope : "main_popup",	// 데이터 영역 설정
	expireType : 'yyyyMMdd',	// 만료일시 포맷
	//expireType : 'yyyyMMddHHmmss',	// 만료일시 포맷
	//expireType : 'D',	// D: Date, T:Time
	
	/**
	 * 스토리지 아이템 Key 가져오기
	 * @param {String} name	- Item 명
	 * @return {String} 	- Item Key
	 */
	getItemKey : function(name) {
		// 데이터 아이템 key 정의
		return this.scope+name;
	},
	/**
	 * 아이템명으로 local 스토리지에 데이터 저장
	 * 유효일시 = 현재일시+만료일수
	 * @param {String} name		- Item 명
	 * @param {Object} val		- 저장 데이터
	 * @param {Number} expday	- 만료일수
	 * @return {String} 		- Item Key
	 */
	set : function(name, val, expday) {
		// 신규 아이템키와  만료일시를 설정하고, localStorage에 데이터를 저장한다. 
		var itemKey = this.getItemKey(name);
		var expDate = new Date();
		expDate.setDate(expDate.getDate() + expday);
		var data = { 'val' : val, expires : expDate.getTime() };
		
		localStorage.setItem(itemKey, JSON.stringify(data));
	},
	/**
	 * LocalStorage로부터 해당명의 데이터를 가져온다.
	 * @param {String} name		- Item 명
	 * @return {String} 		- Item 값
	 */
	get : function(name) {
		// 만료일이 지나지 않았다면, 설정된 값을 가져오고, 지났거나 없는 값이면 null을 반환한다.
		var itemKey = this.getItemKey(name);
		var data = this.getItem(itemKey);
		
		// 만료일이 지나 사용되지 않는 아이템들 제거
		this.clearExpires();
		
		return this.validExpires(data);
	},
	/**
	 * 유효한 데이터인지 판단하여 데이터 반환
	 * @param {String} data		- 저장 data 
	 * @return {String} 		- Item 값
	 */
	validExpires : function(data) {
		// 만료타입에 따른 만료 유효 검증
		// 유효하면 설정된 값을 리턴, 그렇지 않은경우 null 리턴
		if (!data) return null;
		
		if (typeof data != "object") return data;
		if (!data.hasOwnProperty("expires")) return data;
		
		var expDate = new Date();
		expDate.setTime(data.expires);
		
		var expDateStr = expDate.format(this.expireType);
		var curDateStr = new Date().format(this.expireType);
		
		if (curDateStr <= expDateStr) { return data.val; }
		
		/*if (this.expireType == 'T') {
			if (new Date().getTime() <= data.expires) { return data.val; }
		} else if (this.expireType == 'D') {
			var expDate = new Date();
			expDate.setTime(data.expires);
			
			var expDateStr = expDate.format("yyyyMMdd");
			var curDateStr = new Date().format("yyyyMMdd");
			
			if (curDateStr <= expDateStr) { return data.val; }
		}*/
		return null;
	},
	/**
	 * LocalStorage로부터 해당키의 데이터를 가져온다.
	 * (저장된 데이터는 String이므로 json parse를 통해 object로 변환한다.)
	 * @param {String} itemKey	- Item Key
	 * @return {Object}			- Key/Value JSON Object
	 */
	getItem : function(itemKey) {
		// localStorage에 저장된 값 리턴하고, 값이 있는 경우 Json Parsing하여 리턴
		var item = localStorage.getItem(itemKey);
		if (item) return JSON.parse(item);
		return null;
	},
	/**
	 * LocalStorage로부터 모든 데이터를 가져온다.
	 * (저장된 데이터는 String이므로 json parse를 통해 object로 변환한다.)
	 * @return {Object}			- Key/Value JSON Object
	 */
	getAllItems : function() {
		// localStorage에 저장된 모든값 리턴
		var items = {};
		var keys = Object.keys(localStorage);
		for (var k in keys) {
			var itemKey = keys[k];
			var item = this.getItem(itemKey);
			if (item) items[itemKey] = item;
		};
		return items;
	},
	/**
	 * LocalStorage로부터 해당 이름의 데이터를 삭제한다.
	 * (내부에서는 이름에 해당하는 키를 이용한다)
	 */
	remove : function(name) {
		// 해당 아이템 삭제
		var itemKey = this.getItemKey(name);
		this.removeItem(itemKey);
	},
	/**
	 * LocalStorage로부터 해당 Key의 데이터를 삭제한다.
	 */
	removeItem : function(itemKey) {
		// localStorage의 아이템 삭제
		localStorage.removeItem(itemKey);
	},
	/**
	 * scope의 값으로 시작하는 키를 가진 아이템중에서 만료일이 지난 모든 데이터 삭제
	 * @param {String} scope	- LocalStorage 영역
	 */
	clearExpires : function(scope) {
		// scope의 값으로 시작하는 키를 가진 아이템중에서 만료일이 지난 모든 데이터 삭제
		if (!scope) scope = this.scope;
		
		// 매번 반복적으로 key를 체크하는것을 방지하기 위해
		if (this.isCurrentDateClear()) return;
		
		var values = [];
		var keys = Object.keys(localStorage);
		for (var k in keys) {
			var itemKey = keys[k];
			
			if (itemKey.indexOf(scope) == 0) {
				if (!this.validExpires(this.getItem(itemKey))) {
					this.removeItem(itemKey);
				}
			}
		}
	},
	/**
	 * 만료일시에 상관없이 해당 scope의 데이터 모두 삭제
	 * @param {String} scope	- LocalStorage 영역
	 */
	clearScope : function(scope) {
		// 만료일시에 상관없이 해당 scope의 데이터 모두 삭제
		if (!scope) scope = this.scope;
		
		var values = [];
		var keys = Object.keys(localStorage);
		for (var k in keys) {
			var itemKey = keys[k];
			
			if (itemKey.indexOf(scope) == 0) {
				this.removeItem(itemKey);
			}
		}
	},
	/**
	 * 모든 localStorage 데이터 삭제
	 */
	clear : function() {
		// 모든 localStorage 데이터 삭제
		localStorage.clear();
	},
	/**
	 * 매번 반복적으로 key를 체크하는것을 방지하기 위해 오늘날짜에 data를 clear했는지 체크
	 * @return {Boolean}	- 데이터 clear 여부
	 */
	isCurrentDateClear : function() {
		var clearKey = this.scope + "_clearDate";
		var clearDateTimes = localStorage.getItem(clearKey);
		
		if (clearDateTimes) {
			var clearDate = new Date();
			clearDate.setTime(clearDateTimes);
			
			var cleareDateStr = clearDate.format("yyyyMMdd");
			var curDateStr = new Date().format("yyyyMMdd");
			
			if (curDateStr == cleareDateStr) { return true; }
		}
		localStorage.setItem(clearKey, new Date().getTime());
		return false;
	}
}
