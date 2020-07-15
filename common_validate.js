
/**
 * Validate function 정의
 * @author: X0114723
 */
var Validate = {
	/**
	 * 값이 비었는지 확인한다.
	 * @param {Object} element	- jQuery Element
	 * @param {String} message	- 유효하지 않은 경우 메시지
	 * @return {Boolean} 유효 여부
	 */
	isEmpty : function( element, message) {
		if ( !element.val() || element.val().trim()=='' ) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false ;
		}
	},
	
	/**
	 * 값이 비었는지 확인한다.
	 * @param {Object} element	- jQuery Element
	 * @param {String} message	- 유효하지 않은 경우 메시지
	 * @return {Boolean} 유효 여부
	 */
	isChecked : function( element, message) {
		var tagname = element.prop("tagName");
		var elObj = element;
		if (tagname != "INPUT") {
			elObj = element.find("input[name]");
		}
		
		if ( !elObj.is(":checked")) {
			alert(message) ;
			this._focus( elObj ) ;
			return true ;
		} else {
			return false ;
		}
	},
	
	/**
	 * 값이 숫자인지 확인한다.
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNumber : function( element, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		/**
		 * isNaN은 empty string값이 true이므로 배제함
		 */
		if ( $.isNumeric( element.val().trim() ) ) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else { 
			return false ;
		}
	},
	
	/**
	 * 값이 숫자가 아닌지 확인한다.
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotNumber : function ( element, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		/**
		 * isNaN은 empty string값이 true이므로 배제함
		 */
		if ( !$.isNumeric(element.val().trim()) ) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false ;
		}
	},
	/**
	 * 값의 maximum byte를 확인한다.
	 * @param {Object} element		- jQuery Element
	 * @param {Number} maxBytes		- 체크할 max bytes
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	maxBytes : function ( element, maxBytes, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		/**
		 * 2 byte 아닌 3 byte 길이 체크가 필요하지만. DB에 기록되는 경우에는 byte길이가 아닌 char길이임
		 */
		if ( element.val().getBytes() > maxBytes ) {
			alert(message.replace("#LEN#", maxBytes)) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false ;
		}
	},
	
	/**
	 * 값의 minimum byte를 확인한다.
	 * @param {Object} element		- jQuery Element
	 * @param {Number} minBytes		- 체크할 min bytes
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	minBytes : function ( element, minBytes, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		/**
		 * 2 byte 아닌 3 byte 길이 체크가 필요하지만. DB에 기록되는 경우에는 byte길이가 아닌 char길이임
		 */
		if ( element.val().getBytes() < minBytes ) {
			alert(message.replace("#LEN#", minBytes)) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false ;
		}
	},
	
	/**
	 * 값의 maximum length를 확인한다.
	 * @param {Object} element		- jQuery Element
	 * @param {Number} maxLength	- 체크할 최대 길이
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	maxLength : function ( element, maxLength, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		if ( element.val().length > maxLength ) {
			alert(message.replace("#LEN#", maxLength)) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false ;
		}
	},
	
	/**
	 * 값의 minimum length를 확인한다.
	 * @param {Object} element		- jQuery Element
	 * @param {Number} minLength	- 체크할 최소 길이
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	minLength : function ( element, minLength, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		if ( element.val().length < minLength ) {
			alert(message.replace("#LEN#", minLength)) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false ;
		}
	},
	
	/**
	 * 로그인 아이디 형식을 확인한다.
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotLoginId : function( element, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		if ( !element.val().match(/^[a-zA-Z0-9]{5,}$/) ) { // 기본 5글자 이상
		//if ( !element.val().match(/^[a-zA-Z]([a-zA-Z0-9]+$)/) ) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false ;
		}
	},
	
	/**
	 * 로그인 비밀번호 형식을 확인한다.
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotLoginPw : function( element, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		if ( !element.val().match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[A-Za-z\d!@#$%^&*?]{10,}$/) ) { // 알파벳 숫자 포함 10글자 이상, 특수문자 가능
		// if ( !element.val().match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/) ) { // 기본 8글자 이상
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false;
		}
	},
	/**
	 * WELCOME 사용자 로그인 아이디
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotWelcomId : function( element, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		if ( !element.val().match(/^[A-Z0-9]+[A-Z0-9_-]{7,19}$/) ) { // 8 ~ 20글자, 처음은 알파벳,또는 숫자로 시작
		//if ( !element.val().match(/^[A-Z]+[A-Z0-9_-]{3,18}[A-Z0-9]$/) ) { // 5 ~ 20 글자, 처음은 알파벳으로 시작, 끝은 알파벳과숫자로 끝남
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false;
		}
	},
	/**
	 * 이메일 형식을 확인한다.
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotEmail : function(element, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		if ( !element.val().match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) ) {
		//if ( !element.val().match(/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i) ) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false;
		}
	},
	
	/**
	 * 사내 4자리 번호 형식을 확인한다.
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotLocalPhone : function( element, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		if ( !element.val().match(/^[0-9]{4}$/) ) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false;
		}
	},
	
	/**
	 * 일반 전화번호 형식을 확인한다.
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotPhone : function( element, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		if ( !element.val().match(/^[0-9+]([0-9-]{2,20})$/) ) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false;
		}
	},
	
	/**
	 * 모바일 전화번호 형식을 확인한다.(중국)
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotMobile : function( element, message, isOption ) {
		// 134 ~ 139, 147, 150~152, 157~159, 181~183, 187~188
		// 130~132, 155~156, 185~186
		// 133, 153, 180, 189
		if (this._isPass(element, isOption)) return false;
		if ( !element.val().match(/^\d{3}-?\d{4}-?\d{4}$/) ) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false;
		}
	},
	
	/**
	 * 같은 값인지를 확인한다.
	 * @param {Object} element		- jQuery Element
	 * @param {Object} targetElement- 비교할 jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotEqual : function( element, targetElement, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		if ( element.val() != targetElement.val() ) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false;
		}
	},
	
	/**
	 * 해당 값보다 큰 값인지 화인한다.
	 * @param {Object} element		- jQuery Element
	 * @param {String||Number} value- 비교값
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	maxValue : function( element, value, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		if ( Number(element.val()) > value ) {
			alert( message.replace("#MAX#", value) ) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false;
		}
	},
	
	/**
	 * 해당 값보다 작은 값인지 화인한다.
	 * @param {Object} element		- jQuery Element
	 * @param {String||Number} value- 비교값
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	minValue : function( element, value, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		if ( Number(element.val()) < value ) {
			alert(message.replace("#MIN#", value)) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false;
		}
	},
	
	/**
	 * min 과 max 사이의 값인지 화인한다.
	 * @param {Object} element		- jQuery Element
	 * @param {String||Number} min	- 비교할 최소값
	 * @param {String||Number} max	- 비교할 최대값
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	rangeValue : function( element, min, max, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		var elValue = Number(element.val()) ;
		if ( elValue < min || elValue > max ) {
			alert( message.replace("#MIN#", min).replace("#MAX#", max) ) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false;
		}
	},
	
	/**
	 * 중국인 개인식별번호의 유효성을 확인한다.
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotPersonNo : function( element, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		if ( !element.val().match(/^\d{17}[X0-9]$/) ) {	// jbsun : 17자리 숫자 마지막자리 'X' or 숫자
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			if ( this._isDateStr( element.val().substr(6,8) ) )	{	// jbsun : 생년월일 체크 추가
				return false;
			} else {
				alert(message) ;
				this._focus( element ) ;
				return true ;
			}
		}
	},
	
	/**
	 * 자동차 번호의 유효성을 확인한다(중국자동차번호).
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotCarNo : function ( element, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		//if ( !element.val().match(/^[\u4e00-\u9fff]+$/) ) { // 중국어 체크
		if ( !element.val().match(/^[\u4E00-\u9FA5\uF900-\uFA2D]([A-Z0-9]{5}[A-Z0-9\u4E00-\u9FA5\uF900-\uFA2D])$/) ) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false;
		}
	},
	/**
	 * 중국어 회사명 체크(중국어+영어+숫자+특수문자)
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotChn : function ( element, message, isOption ) {
		//if ( !element.val().match(/^[\u4e00-\u9fff]+$/) ) { 	// 중국어체크 1
		//	/^[ A-Za-z\u3000\u3400-\u4DBF\u4E00-\u9FFF]+$/ 		// 중국어체크 2
		//	/^[ A-Za-z\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]$/g	// 중국어체크 3
		//  /^[ A-Za-z\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]$/u	// 중국어체크 4
		if (this._isPass(element, isOption)) return false;
		if ( !element.val().match(/^[A-Za-z0-9 !@#$&%^*()\-_=+\\\|\[\]{};:\'",.<>\/?\u4E00-\u9FA5]+$/) ) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false;
		}
	},
	/**
	 * 중국어 체크(중국어)
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isChn : function ( element, message, isOption ) {
		//if ( !element.val().match(/^[\u4e00-\u9fff]+$/) ) { 	// 중국어체크 1
		//	/^[ A-Za-z\u3000\u3400-\u4DBF\u4E00-\u9FFF]+$/ 		// 중국어체크 2
		//	/^[ A-Za-z\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]$/g	// 중국어체크 3
		//  /^[ A-Za-z\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]$/u	// 중국어체크 4
		if (this._isPass(element, isOption)) return false;
		if ( !element.val().match(/^[\u4e00-\u9fff]+$/) ) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false;
		}
	},	
	/**
	 * 중국어외 영어 회사명 체크(영어+숫자+특수문자)
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotEng : function ( element, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		if ( !element.val().match(/^[A-Za-z0-9 !@#$&%^*()\-_=+\\\|\[\]{};:\'",.<>\/?]+$/) ) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false;
		}
	},
	
	/**
	 * input 파일사이즈 체크
	 * @param {Object} element		- jQuery Element
	 * @param {Number} size			- 비교할 파일 사이즈
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	fileSize : function ( element, size, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		for (var ei=0; ei < element.length; ei++) {
			if (element[ei].files.length == 0 && !isOption) {
				alert("No file selected.");
				element[ei].focus();
				return true;
			}
			for (var i=0; i < element[ei].files.length; i++) {
				var fileName = element[ei].files[i].name;
				var fileSize = element[ei].files[i].size;
				if ( fileSize >= size ) {
					alert(message.replace("#SIZE#", Common.bytesToSize(size)).replace("#NAME#", fileName)) ;
					this._focus( element ) ;
					return true ;
				}
			}
		}
		return false;
	},
	/**
	 * 파일 사이즈 범위 체크
	 * @param {Object} element		- jQuery Element
	 * @param {Number} min			- 비교할 최소값
	 * @param {Number} max			- 비교할 최대값
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	rangeFileSize : function ( element, min, max, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		for (var ei=0; ei < element.length; ei++) {
			if (element[ei].files.length == 0 && !isOption) {
				alert("No file selected.");
				element[ei].focus();
				return true;
			}
			for (var i=0; i < element[ei].files.length; i++) {
				var fileName = element[ei].files[i].name;
				var fileSize = element[ei].files[i].size;
				if ( fileSize < min || fileSize > max ) {
					alert(message.replace("#MIN#", Common.bytesToSize(min)).replace("#MAX#", Common.bytesToSize(max))) ;
					this._focus( element ) ;
					return true ;
				}
			}
		}
		return false;
	},
	//---------------------------------------------------------
	// 사진 크기 정보
	//	A3(297 X 420)	: 0.70714,	픽셀(1123 X 1587)
	//  A4(210 X 297)	: 0.70707,	픽셀( 794 X 1123)
	//	B5(176 X 250)	: 0.704,	픽셀( 665 X 945 )
	//	B4(250 X 353)	: 0.70821,	픽셀( 945 X 1334)
	//  여권(35 X 45)		: 0.77777,	픽셀( 133 X 170 )
	//  증명(25 X 30)		: 0.83333,	픽셀(  95 X 113 )
	//  반명함(30 X 40)	: 0.75,		픽셀( 113 X 151 )
	//  명함(50 X 70) 	: 0.71428,	픽셀( 189 X 265 )
	//---------------------------------------------------------
	/**
	 * max image resolution 체크
	 * @param {Object} element		- jQuery Element
	 * @param {Number} limitW		- 비교할 가로크기
	 * @param {Number} limitH		- 비교할 세로크기
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	maxImageSize : function ( element, limitW, limitH, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		for (var ei=0; ei < element.length; ei++) {
			if (element[ei].files.length == 0 && !isOption) {
				alert("No file selected.");
				element[ei].focus();
				return true;
			}
			for (var i=0; i < element[ei].files.length; i++) {
				var width = element[ei].files[i].width;
				var height = element[ei].files[i].height;
				if (!width || !height) continue;
				if ( width > limitW || height > limitH) {
					alert(message.replace("#WIDTH#", limitW).replace("#HEIGHT#", limitH)) ;
					this._focus( element ) ;
					return true ;
				}
			}
		}
		return false;
	},
	/**
	 * max image resolution 체크
	 * @param {Object} element		- jQuery Element
	 * @param {Number} limitW		- 비교할 가로크기
	 * @param {Number} limitH		- 비교할 세로크기
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	minImageSize : function ( element, limitW, limitH, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		for (var ei=0; ei < element.length; ei++) {
			if (element[ei].files.length == 0 && !isOption) {
				alert("No file selected.");
				element[ei].focus();
				return true;
			}
			for (var i=0; i < element[0].files.length; i++) {
				var width = element[0].files[i].width;
				var height = element[0].files[i].height;
				if (!width || !height) continue;
				if ( width < limitW || height < limitH) {
					
					alert(message.replace("#WIDTH#", limitW).replace("#HEIGHT#", limitH)) ;
					this._focus( element ) ;
					return true ;
				}
			}
		}
		return false;
	},
	/**
	 * 이미지의 가로세로 비율 범위 체크
	 * @param {Object} element		- jQuery Element
	 * @param {Number} min			- 비교할 w/h 비율 최소값
	 * @param {Number} max			- 비교할 w/h 비율 최대값
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */ 
	rangeImageAspectRatio : function ( element, min, max, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		for (var ei=0; ei < element.length; ei++) {
			if (element[ei].files.length == 0 && !isOption) {
				alert("No file selected.");
				element[ei].focus();
				return true;
			}
			for (var i=0; i < element[ei].files.length; i++) {
				var width = element[ei].files[i].width;
				var height = element[ei].files[i].height;
				if (!width || !height) continue;
				var ratio = width/height;
				
				if (ratio < min || ratio > max) {
					alert(message.replace("#MIN#", min).replace("#MAX#", max)) ;
					this._focus( element ) ;
					return true ;
				}
			}
		}
		return false;
	},
	/**
	 * 업로드 파일 전체 용량 체크
	 * @param {Object} element		- jQuery Element
	 * @param {Number} size			- 비교할 전체 파일 크기
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	totalFileSize : function ( element, size, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		var totalSize = 0;
		for (var ei=0; ei < element.length; ei++) {
			if (element[ei].files.length == 0 && !isOption) {
				alert("No file selected.");
				element[ei].focus();
				return true;
			}
			for (var i=0; i < element[ei].files.length; i++) {
				totalSize += element[ei].files[i].size;
			}
		}
		if ( totalSize > size ) {
			alert(message.replace("#TOTALSIZE#", Common.bytesToSize(size))) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false;
		}
	},
	
	/**
	 * input 파일 갯수 체크
	 * @param {Object} element		- jQuery Element
	 * @param {Number} count		- 비교할 파일수
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	fileCount : function ( element, count, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		var totalCount = 0;
		
		for (var ei=0; ei < element.length; ei++) {
			if (element[ei].files.length == 0 && !isOption) {
				alert("No file selected.");
				element[ei].focus();
				return true;
			}
			totalCount += element[ei].files.length;
		}
		if ( totalCount > count ) {
			alert(message.replace("#COUNT#", count)) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false;
		}
	},
	
	/**
	 * 올바른 날짜 형식인지 체크한다. ( 1988-02-04 형식 )
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotDate : function ( element, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		// [yyyy-mm-dd] or [yyyy/mm/dd]
		//if ( !element.val().match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/) ) {
		// only [yyyy-mm-dd]
		if ( !element.val().match(/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/) || this._isDate(element.val())) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false;
		}
	},
	
	/**
	 * 올바른 날짜 형식인지 체크한다. ( 19880204 형식 )
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotDateStr : function ( element, message, isOption ) {
		if ( !this._isDateStr(element.val())) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false;
		}
	},
	
	/**
	 * 여권번호 유효성 체크
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotPassport : function( element, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		if ( !element.val().match(/^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]+$/) ) { //
		//if ( !element.val().match(/^[A-Z]{2}([a-zA-Z0-9]+$)/) ) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false ;
		}
	},
	/**
	 * 숫자,영문 조합 체크(대소문자 구분 안함)
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotAlphaNumeric : function (element, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		if ( !element.val().match(/^[a-z0-9]+$/i) ) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false ;
		}
	},
	/**
	 * 숫자,영문대문자 조합 체크
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotUppercaseNumeric : function (element, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		if ( !element.val().match(/^[A-Z0-9]+$/) ) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false ;
		}
	},
	/**
	 * 숫자,영문소문자 조합 체크
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotLowercaseNumeric : function (element, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		if ( !element.val().match(/^[a-z0-9]+$/) ) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false ;
		}
	},
	/**
	 * 영문인지 체크(대소문자 구분 안함)
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotAlpha : function (element, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		if ( !element.val().match(/^[a-z]+$/i) ) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false ;
		}
	},
	/**
	 * 영문 대문자인지 체크
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotUppercase : function (element, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		if ( !element.val().match(/^[A-Z]+$/) ) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false ;
		}
	},
	/**
	 * 영문 소문자인지 체크
	 * @param {Object} element		- jQuery Element
	 * @param {String} message		- 유효하지 않은 경우 메시지
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 유효 여부
	 */
	isNotLowercase : function (element, message, isOption ) {
		if (this._isPass(element, isOption)) return false;
		if ( !element.val().match(/^[a-z]+$/) ) {
			alert(message) ;
			this._focus( element ) ;
			return true ;
		} else {
			return false ;
		}
	},
	/**
	 * 필수 옵션이 아닌경우, 값이 없으면 통과, 값이 있는 경우는 valid check를 진행한다.
	 * @param {Object} element		- jQuery Element
	 * @param {Boolean} isOption	- 필수 여부
	 * @return {Boolean} 			- 통과 여부
	 */
	_isPass : function(element, isOption) {
		if ( !element.val() && isOption ) return true;
		return false;
	},
	
	/**
	 * 3bytes 길이 체크
	 * @param {String} str		- 체크할 문자열
	 * @return {Number}			- 유효 여부
	 */
	_getBytes : function(str) {
	     var byteLength = 0;
	     for (var i = 0; i < str.length; ++i) {
	         // 기본 한글 3바이트 처리 ( UTF-8 )
	         (str.charCodeAt(i) > 127) ? byteLength += 3 : byteLength++;
	     }
	     return byteLength;
	 },
	 
	/**
	 * 해당 element에 focus
	 * @param {Object} element		- jQuery Element
	 */
	_focus : function( element ) {
		var type = element.prop("type") ;
		var elType = element.prop("tagName") ;
		var id = element.prop("id");
		
		if (type && type === 'file') $("#"+id+"Btn").focus(); //$("#"+id+"Name").focus();
		else element.focus() ;
		//if (!type || type === "text" || elType === "TEXTAREA") element.select() ;
		//if (!type || type === "text" || elType === "TEXTAREA") element.val("") ;
	},
	
	/**
	 * jquery datepicker를 이용하여 유효한 날짜인지 체크(특히 29, 30, 31일등 월별 최대 일자)
	 * @param {Object} date		- 날짜값
	 * @return {Boolean} 		- 유효 여부
	 */
	_isDate : function ( date ) {
		try {
			$.datepicker.parseDate('yy-mm-dd', date, null);
			return false;
		} catch(error) {
			//console.log(error);
		    return true;
		}
	},
	
	/** 
	 * 유효한 날짜 문자열인지 체크한다. (format : '19951231') 
	 * @auth : jbsun
	 */
	_isDateStr : function ( dateStr ) {
		if (dateStr.length != 8) return false;
		var year = Number(dateStr.substr(0, 4));
		var month = Number(dateStr.substr(4, 2));
		var day = Number(dateStr.substr(6, 2));
		if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
		if (1900 > year) return false;
		else if (month < 1 || month > 12) return false;
		else if (day < 1 || day > (new Date(year, month, "")).getDate() ) return false;
		else return true;
	}
}
