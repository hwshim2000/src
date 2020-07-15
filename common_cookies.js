/**
 * 팝업 유지 설정을 위한 Cookie 서비스
 * @author X0114723
 */
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
	    var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
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
