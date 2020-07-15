var Filters = {
	/** 기본 hint가 보여질 타입 */
	defHintType : "placeholder",// placeholder,focus_only,tooltip,left,right,top,bottom,title,etc(element id)
	/** 필수여부 표시 HTML */
	defEssential: '<span class="essential"> *</span>',
	defHint		: '<span style="color:rgba(255,0,0,0.5); font-style:oblique;">(#HINT#)</span>',
	defTooltip	: '<div style="margin-top:-25px;border:2px solid #00AFFF;position:absolute;display:none;z-index:1000;background-color:#AED6F1;border-radius:5px;padding:3px;"></div>',
	inputStyle	: 'rgba(255,0,0,0.1)',
	validStyle	: 'rgba(50,100,255,0.1)',
	previewHintStyle : '<textarea readonly style="background:rgba(255,255,255, 0);border:0;width:100%;height:100%;overflow:none;resize:none;" placeholder="#HINT#"></textarea>',
	//validStyle	: "rgb(232,240,254)",
	
	/** 값이 비어있는지 체크 */
	empty		: {
		vfilter : "^.{#MINLEN#,#MAXLEN#}$",
		messages: {
			ko : '올바른 입력값이 필요합니다.(#MINLEN#~#MAXLEN#자)',
			zh : '需要正确的输入费用。(#MINLEN#~#MAXLEN#字)',
			en : 'A valid input value is required.(#MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 값이 비어있는지 체크 */
	text		: {
		vfilter : "^.{#MINLEN#,}$",
		lfilter : "^.{0,#MAXLEN#}$",
		minLen	: 0,
		messages: {
			ko : '올바른 입력값이 필요합니다.(#MINLEN#~#MAXLEN#자)',
			zh : '需要正确的输入费用。(#MINLEN#~#MAXLEN#字)',
			en : 'A valid input value is required.(#MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 줄바꿈이 있는 폼 체크 */
	textarea	: {
		vfilter	: "^(?:[\\r\\n]?[\\s\\S]){#MINLEN#,#MAXLEN#}$",	// 개행문자 제외
		lfilter	: "^(?:[\\r\\n]?[\\s\\S]){0,#MAXLEN#}$",		// 개행문자 제외
		//vfilter	: "^[\\s\\S]{#MINLEN#,#MAXLEN#}$",	// 개행문자포함할 경우
		//lfilter	: "^[\\s\\S]{0,#MAXLEN#}$",			// 개행문자포함할 경우
		messages: {
			ko : '올바른 입력값이 필요합니다.(#MINLEN#~#MAXLEN#자)',
			zh : '需要正确的输入费用。(#MINLEN#~#MAXLEN#字)',
			en : 'A valid input value is required.(#MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 숫자 체크(양의정수) */
	numeric	: {
		vfilter : "^\\d{#MINLEN#,}$",
		lfilter : "^\\d{0,#MAXLEN#}$",
		maxLen	: 10,
		varType	: "number",
		messages: {
			ko : '숫자를 입력하세요.([양수], #MINLEN#~#MAXLEN#자리)',
			zh : '请输入数字。([正数], #MINLEN#~#MAXLEN#位数)',
			en : 'Please enter a number.([positive], #MINLEN#-#MAXLEN# digits)'
		}
	},
	/** 숫자 체크(정수) */
	integer	: {
		vfilter : "^[-]?\\d{1,}$",
		lfilter : "^[-]?\\d*$",
		minLen : 0,
		maxLen	: 10,
		varType	: "number",
		messages: {
			ko : '숫자값을 입력하세요.([정수], #MINLEN#~#MAXLEN#자리)',
			zh : '请输入数字值。([全数], #MINLEN#~#MAXLEN#位数)',
			en : 'Please enter a integer value.([whole], #MINLEN#-#MAXLEN# digits)'
		}
	},
	/** 숫자 체크(실수) */
	float		: {
		//vfilter	: "^[-]?\\d{1,}(\\.?\\d*)$",
		//lfilter	: "^[-]?\\d*(\\.?\\d*)$",
		vfilter : "^[-]?(\\.?\\d{1,}|\\d{1,}(\\.?\\d*))$",
		lfilter	: "^[-]?(\\.?\\d*|\\d*(\\.?\\d*))$",
		maxLen	: 10,
		varType	: "number",
		messages: {
			ko : '숫자값을 입력하세요.([실수], #MINLEN#~#MAXLEN#자리)',
			zh : '请输入数字值。([浮点数], #MINLEN#~#MAXLEN#位数)',
			en : 'Please enter a float value.([float], #MINLEN#-#MAXLEN# digits)'
		}
	},
	/** 범위(양의 숫자) 체크 */
	range		: {
		vfilter : "^\\d*$",
		lfilter : "^\\d*$",
		minVal	: 0,
		varType	: "range",
		messages: {
			ko : '범위내의 값을 입력하세요.([양수], #MINVAL#~#MAXVAL#)',
			zh : '请输入范围内的值。([正数], #MINVAL#~#MAXVAL#)',
			en : 'Please enter a value within the range.([positive], #MINVAL#-#MAXVAL#)'
		}
	},
	/** 범위(정수) 체크 */
	range_integer: {
		vfilter	: "^[-]?\\d{1,}$",
		lfilter : "^[-]?\\d*$",
		minVal	: 0,
		varType	: "range",
		messages: {
			ko : '범위내의 값을 입력하세요.([정수], #MINVAL#~#MAXVAL#)',
			zh : '请输入范围内的值。([全数], #MINVAL#~#MAXVAL#)',
			en : 'Please enter a integer value within the range.([whole], #MINVAL#-#MAXVAL#)'
		}
	},
	/** 범위(실수) 체크 */
	range_float	: {
		//vfilter : "^\\d*$",
		//lfilter : "^\\d{0,}$",
		//vfilter	: "^[+-]?\\d*(\\.?\\d*)$",
		vfilter : "^[-]?(\\.?\\d{1,}|\\d{1,}(\\.?\\d*))$",
		lfilter	: "^[-]?(\\.?\\d*|\\d*(\\.?\\d*))$",
		minVal	: 0,
		varType	: "range",
		messages: {
			ko : '범위내의 값을 입력하세요.([실수], #MINVAL#~#MAXVAL#)',
			zh : '请输入范围内的值。([浮点数], #MINVAL#~#MAXVAL#)',
			en : 'Please enter a float value within the range.([float], #MINVAL#-#MAXVAL#)'
		}
	},
	/** 파일 체크 */
	file		: {
		vfilter	: "^.{1,250}\.#ACCEPT#$",
		maxLen	: 255,
		minSize	: 0,
		varType	: "default",	// [fileSize|imageSize|imageRate]
		messages: {
			ko : '첨부파일을 선택하세요.',
			zh : '请选择附件。',
			en : 'Please select an attachment.',
			fileSize : {
				ko : '허용 용량 내의 파일을 선택하십시오.(Size: #MINSIZE#~#MAXSIZE#)',
				zh : '请选择允许容量内的文件。(Size: #MINSIZE#~#MAXSIZE#)',
				en : 'Please select a file within your allowance.(Size: #MINSIZE#-#MAXSIZE#)',
			},
			imageSize : {
				ko : '해상도 범위 내의 파일을 선택하십시오.(해상도: [#MINH#, #MINW#]~[#MAXW#, #MAXH#])',
				zh : '请选择分辨率范围内的文件。(分辨率:[#MINH#, #MINW#]~[#MAXW#, #MAXH#])',
				en : 'Select a file within the resolution range.(Resolution: [#MINH#, #MINW#]~[#MAXW#, #MAXH#])',
			},
			imageRate : {
				ko : '가로세로 비율 범위내의 이미지를 선택하십시오.(W/H Rate: #MINRATE#~#MAXRATE#)',
				zh : '请选择横竖比例范围内的形象。(W/H Rate : #MINRATE#~#MAXRATE#)',
				en : 'Select images within the aspect ratio.(W/H Rate, #MINRATE#~#MAXRATE#)',
			}
		},
		typeError : {
			ko : '파일이 없거나, 형식 오류입니다.',
			zh : '无文件或形式错误。',
			en : 'The file does not exist or is malformed.'
		}
	},
	/** Web url 체크(간단하게만 체크) */
	url		: {
		//vfilter : "^(((http(s?))\\:\\/\\/)?)([0-9a-zA-Z\\-]+\\.)+[a-zA-Z]{2,6}(\\:[0-9]+)?(\\/\\S*)?",
		vfilter : "^(?!.*:[\\/]{3,})(https?:\\/\\/|\\/)([0-9a-zA-Z\\-]+\\.)*[a-zA-Z]{2,6}(\\:[0-9]+)?(\\/\\S*)?",
		maxLen	: 255,
		messages: {
			ko : '올바른 URL을 입력하세요.(#MINLEN#~#MAXLEN#자)',
			zh : '请输入正确的URL。(#MINLEN#~MAXLEN#字)',
			en : 'Please enter a valid URL.(#MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 산업보안 로그인 아이디 체크 */
	sec_id		: {
		vfilter : "^[a-zA-Z0-9]{#MINLEN#,}$",
		lfilter : "^[a-zA-Z0-9]{0,#MAXLEN#}$",
		minLen	: 8,
		maxLen 	: 20,
		messages: {
			ko : '올바른 아이디를 입력하세요.([영문|숫자], #MINLEN#~#MAXLEN#자)',
			zh : '请输入正确的用户名([英语|数字], #MINLEN#~#MAXLEN#字)。',
			en : 'Please enter a valid ID ([alphabet|digits], #MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 웰컴 로그인 아이디 체크 */
	wel_id		: {
		vfilter : "^(?=.*[a-zA-Z])[a-zA-Z0-9]{#MINLEN#,}$",	// 시작과 관계없이 반드시 영문포함
		lfilter : "^[a-zA-Z0-9]{0,#MAXLEN#}$",// 시작과 관계없이 반드시 영문포함
		//vfilter : "^(?=[a-zA-Z])[a-zA-Z0-9]{#MINLEN#,}$",	// 영문으로 시작
		//lfilter : "^(?=[a-zA-Z])[a-zA-Z0-9]{0,#MAXLEN#}$",// 영문으로 시작
		minLen	: 8,
		maxLen 	: 20,
		messages: {
			ko : '올바른 아이디를 입력하세요.([영문+숫자], #MINLEN#~#MAXLEN#자)',
			zh : '请输入正确的用户名([英语+数字], #MINLEN#~#MAXLEN#字)。',
			en : 'Please enter a valid ID ([alphabet|digits], #MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 비밀번호 체크 */
	passwd		: {
		vfilter : "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*\?])[A-Za-z\\d!@#$%^&*\?]{#MINLEN#,}$",
		lfilter : "^[A-Za-z\\d!@#$%^&*\?]{0,#MAXLEN#}$",
		minLen	: 10,
		maxLen 	: 20,
		messages: {
			ko : '올바른 비밀번호를 입력하세요.([대문자+소문자+숫자+특수문자], #MINLEN#~#MAXLEN#자)',
			zh : '请输入ID([大写+小写+数字+特殊文字], #MINLEN#~#MAXLEN#字)。',
			en : 'Please enter a valid password ([capital+small+digits+special], #MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 이메일 체크 */
	email		: {
		//vfilter : "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$",
		vfilter : "^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*(.[a-zA-Z]{2,3})+$",
		lfilter : "^[0-9a-zA-Z.@_-]*$",
		minLen	: 8,
		maxLen 	: 50,
		messages: {
			ko : '올바른 이메일을 입력하세요.(#MINLEN#~#MAXLEN#자)',
			zh : '请输入正确的电子邮件。(#MINLEN#~#MAXLEN#字)',
			en : 'Please enter a valid email.(#MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 핸드폰 체크(중국) */
	mobile	: {
		//vfilter : "^\\d{4}[ -]?\\d{7}$",
		vfilter : "^\\d{3}[ -]?\\d{4}[ -]?\\d{4}$",
		lfilter : "^\\d{0,3}[ -]?\\d{0,4}[ -]?\\d{0,4}$",
		minLen	: 11,
		maxLen 	: 13,
		messages: {
			ko : '올바른 전화번호를 입력하세요.([숫자|-|space], #MINLEN#~#MAXLEN#자)',
			zh : '请输入正确的电话号码。([数字|-|space], #MINLEN#~#MAXLEN#字)',
			en : 'Please enter a valid phone number.([digits|-|space], #MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 핸드폰 체크(한국) */
	mobile_ko	: {
		vfilter : "^\\d{3}[ -]?\\d{3,4}[ -]?\\d{4}$",
		lfilter : "^\\d{0,3}[ -]?\\d{0,4}[ -]?\\d{0,4}$",
		minLen	: 10,
		maxLen 	: 13,
		messages: {
			ko : '올바른 전화번호를 입력하세요.([숫자|-|space], #MINLEN#~#MAXLEN#자)',
			zh : '请输入正确的电话号码。([数字|-|space], 数字#MINLEN#~#MAXLEN#字)',
			en : 'Please enter a valid phone number.([digits|-|space], #MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 일반 전화 체크 */
	phone		: {
		//vfilter : "^\\d{2,3}[ -]\\d{3,4}[ -]\\d{3,4}$",
		vfilter	: "(?:[- ]?[0-9]){#MINLEN#,#MAXLEN#}$",
		lfilter : "^\\d{0,3}[ -]?\\d{0,4}[ -]?\\d{0,4}$",
		minLen	: 11,
		maxLen 	: 13,
		messages: {
			ko : '올바른 전화번호를 입력하세요.([숫자|-|space], #MINLEN#~#MAXLEN#자)',
			zh : '请输入正确的电话号码。([数字|-|space], #MINLEN#~#MAXLEN#字)',
			en : 'Please enter a valid phone number.([digits|-|space], #MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 국제 전화번호 체크 */
	global_phone: {
		//vfilter	: "\\+(?:[-])?(9[976]\\d|8[987530]\\d|6[987]\\d|5[90]\\d|42\\d|3[875]\\d|2[98654321]\\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\\d{#MINLEN#,#MAXLEN#}$",
		vfilter: "^\\+[0-9](?:[- ]?[0-9]){9,14}$",
		lfilter : "^(?!\\+\\-)(?!.*[ -]{2,})\\+?[\\d- ]*\\d*$",
		//lfilter : "^[+]?\\d*([ -]?\\d*)?\\d*",
		minLen	: 13,
		maxLen 	: 18,
		//correct : -1,
		messages: {
			ko : '올바른 국제전화번호를 입력하세요.([+|숫자|-|space], #MINLEN#~#MAXLEN#자)',
			zh : '请输入正确的国际电话号码。([+|数字|-|space], #MINLEN#~#MAXLEN#字)',
			en : 'Please enter a valid international phone number.([+|digits|-|space], #MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 사내(구내) 전화번호 체크 */
	local_phone: {
		vfilter:"^\\d{#MAXLEN#}$",
		lfilter:"^\\d{0,#MAXLEN#}$",
		maxLen 	: 4,
		messages: {
			ko : '올바른 사내전화번호를 입력하세요.([숫자], #MAXLEN#자)',
			zh : '请输入正确的公司内部电话号码。([数字], #MAXLEN#字)',
			en : 'Please enter a valid work phone number.([digits], #MAXLEN# digits)'
		}
	},
	/** 개인 식별 번호 체크 */
	person_id	: {
		vfilter	: "^\\d{17}[X0-9]$",
		lfilter	: "^\\d{0,17}[X0-9]?$",
		maxLen 	: 18,
		messages: {
			ko : '올바른 개인식별번호를 입력하십시오.([Digits, 마지막X포함], #MAXLEN#자)',
			zh : '请输入正确的个人识别号码([数字, 包括最后的X], #MAXLEN#字)。',
			en : 'Please enter a valid personal identification number. ([digits, Include Last X], #MAXLEN# chars)'
		}
	},
	/** 자동차 번호 체크 */
	car			: {
		vfilter : "^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]([A-Z0-9]{5}[A-Z0-9\\u4E00-\\u9FA5\\uF900-\\uFA2D])$",
		lfilter : "^(?=[\\u4E00-\\u9FA5\\uF900-\\uFA2D])[\\u4E00-\\u9FA5\\uF900-\\uFA2D]?([A-Z0-9]{0,5}[A-Z0-9\\u4E00-\\u9FA5\\uF900-\\uFA2D]?)$",
		maxLen 	: 7,
		messages: {
			ko : '올바른 자동차번호를 입력하세요.([중문|대문자|숫자], #MAXLEN#자)',
			zh : '请输入正确的车牌号。([汉语|大写|数字], #MAXLEN#字)',
			en : 'Please enter a valid car number.([chinese|capital|digits], chars)'
		}
	},
	/** 중국어 체크 */
	chinese	: {
		vfilter : "^[0-9!@#$%^&*\?()\\-_=+\\\\\|\\[\\]{};:\\'\",.<>\\/? \\u4e00-\\u9fff]{#MINLEN#,}$",
		lfilter : "^[0-9!@#$%^&*\?()\\-_=+\\\\\|\\[\\]{};:\\'\",.<>\\/? \\u4e00-\\u9fff]{0,#MAXLEN#}$",
		minLen	: 1,
		maxLen 	: 50,
		messages: {
			ko : '중국어를 입력하세요, (#MINLEN#~#MAXLEN#자)',
			zh : '请输入中文。 (#MINLEN#~#MAXLEN#字)',
			en : 'Please enter Chinese(#MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 한국어 체크 */
	korean	: {
		vfilter : "^[0-9!@#$%^&*\?()\\-_=+\\\\\|\\[\\]{};:\\'\",.<>\\/? 가-힣]{#MINLEN#,}$",
		lfilter : "^[0-9!@#$%^&*\?()\\-_=+\\\\\|\\[\\]{};:\\'\",.<>\\/? ㄱ-ㅎㅏ-ㅣ가-힣]{0,#MAXLEN#}$",
		minLen	: 1,
		maxLen 	: 50,
		messages: {
			ko : '한글을 입력하세요. (#MINLEN#~#MAXLEN#자)',
			zh : '请输入韩文。(#MINLEN#~#MAXLEN#字)',
			en : 'Please enter Korean(#MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 영어 체크 */
	english	: {
		vfilter : "^[0-9!@#$%^&*\?()\\-_=+\\\\\|\\[\\]{};:\\'\",.<>\\/? a-zA-Z]{#MINLEN#,}$",
		lfilter : "^[0-9!@#$%^&*\?()\\-_=+\\\\\|\\[\\]{};:\\'\",.<>\\/? a-zA-Z]{0,#MAXLEN#}$",
		minLen	: 1,
		maxLen 	: 50,
		messages: {
			ko : '영어를 입력하세요. (#MINLEN#~#MAXLEN#자)',
			zh : '请输入英语。 (#MINLEN#~#MAXLEN#字)',
			en : 'Please enter English(#MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 중국어이름 체크 */
	chn_name	: {
		vfilter : "^[\\u4e00-\\u9fff]{#MINLEN#,}$",
		lfilter : "^[\\u4e00-\\u9fff]{0,#MAXLEN#}$",
		minLen	: 1,
		maxLen 	: 50,
		messages: {
			ko : '중국어를 입력하세요, (#MINLEN#~#MAXLEN#자)',
			zh : '请输入中文。 (#MINLEN#~#MAXLEN#字)',
			en : 'Please enter Chinese(#MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 한글이름 체크 */
	kor_name	: {
		vfilter : "^[가-힣]{#MINLEN#,}$",
		lfilter : "^[ㄱ-ㅎㅏ-ㅣ가-힣]{0,#MAXLEN#}$",
		minLen	: 1,
		maxLen 	: 50,
		messages: {
			ko : '한글을 입력하세요. (#MINLEN#~#MAXLEN#자)',
			zh : '请输入韩文。(#MINLEN#~#MAXLEN#字)',
			en : 'Please enter Korean(#MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 영어이름 체크 */
	eng_name	: {
		vfilter : "^(?=[A-Z])(?!.*[ ,]$)[a-zA-Z ,.]{#MINLEN#,}$",
		lfilter : "^(?=[A-Z])[a-zA-Z ,.]{0,#MAXLEN#}$",
		minLen	: 1,
		maxLen 	: 50,
		messages: {
			ko : '영어를 입력하세요. (#MINLEN#~#MAXLEN#자)',
			zh : '请输入英语。 (#MINLEN#~#MAXLEN#字)',
			en : 'Please enter English(#MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 회사명 체크 */
	company		: {
		vfilter : "^[A-Za-z0-9 !@#$%^&*\?()\\-_=+\\\\\|\\[\\]{};:\\'\",.<>\\/?\\u4E00-\\u9FA5]{#MINLEN#,}$",
		lfilter : "^[A-Za-z0-9 !@#$%^&*\?()\\-_=+\\\\\|\\[\\]{};:\\'\",.<>\\/?\\u4E00-\\u9FA5]{0,#MAXLEN#}$",
		minLen	: 1,
		maxLen 	: 50,
		messages: {
			ko : '올바른 회사명을 입력하세요.([중문|영문|숫자|특수문자], #MINLEN#~#MAXLEN#자)',
			zh : '请填写正确的公司名称。([汉语|英语|数字|特殊文字], #MINLEN#~#MAXLEN#字)',
			en : 'Enter the correct company name.([chinese|alphabet|digits|special], #MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 회사명(영어) 체크 */
	company_en	: {
		vfilter : "^[A-Za-z0-9 !@#$%^&*\?()\\-_=+\\\\\|\\[\\]{};:\\'\",.<>\\/?]{#MINLEN#,}$",
		lfilter : "^[A-Za-z0-9 !@#$%^&*\?()\\-_=+\\\\\|\\[\\]{};:\\'\",.<>\\/?]{0,#MAXLEN#}$",
		minLen	: 1,
		maxLen 	: 50,
		messages: {
			ko : '올바른 회사명을 입력하세요.([영문|숫자|특수문자], #MINLEN#~#MAXLEN#자)',
			zh : '请填写正确的公司名称。([英语|数字|特殊文字], #MINLEN#~#MAXLEN#字)',
			en : 'Enter the correct company name.([alphabet|digits|special], #MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 여권 번호 체크 */
	passport	: {
		vfilter : "^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]{#MINLEN#,}$",
		lfilter : "^[A-Z0-9]{0,#MAXLEN#}$",
		minLen	: 5,
		maxLen 	: 50,
		messages: {
			ko : '올바른 여권번호를 입력하세요.([대문자+숫자], #MINLEN#~#MAXLEN#자)',
			zh : '请输入正确的护照号码。([大写+數字], #MINLEN#~#MAXLEN#字)',
			en : 'Please enter a valid passport number.([capital|digits], #MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 날짜 형식 체크 */
	date		: {
		vfilter : "^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])",
		lfilter : "^(?=\\d{1,4})(?!.*-{2,})\\d[\\d-]*\\d*$",
		maxLen 	: 8,
		varType	: "date",
		messages: {
			ko : '올바른 날짜값이 필요합니다.(년[4자리]-월[2자리]-일[2자리])',
			zh : '需要正确的日期费。(年[4位]-月[2位]-日[2位])',
			en : 'A valid date value is required.(year[4 digits]-month[2 digits]-day[2 digits])'
		}
	},
	/** 영문 체크 */
	alpha		: {
		vfilter : "^[a-zA-Z]{#MINLEN#,}$",
		lfilter : "^[a-zA-Z]{0,#MAXLEN#}$",
		messages: {
			ko : '영문자를 입력하세요.([영문], #MINLEN# ~ #MAXLEN#자)',
			zh : '请输入英文字母。([英语], #MINLEN# ~ #MAXLEN#字)',
			en : 'Please enter an alphabetic character.([alphabet], #MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 영문+숫자 체크 */
	alphanumeric: {
		vfilter : "^[a-zA-Z0-9]{#MINLEN#,}$",
		lfilter : "^[a-zA-Z0-9]{0,#MAXLEN#}$",
		messages: {
			ko : '영문자 및 숫자를 입력하세요.([영문+숫자], #MINLEN# ~ #MAXLEN#자)',
			zh : '请输入英文字母及数字。([英语+数字], #MINLEN# ~ #MAXLEN#字)',
			en : 'Please enter alphabetic characters and numbers.([alphabet|digits], #MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 대문자 체크 */
	uppercase	: {
		vfilter : "^[A-Z]{#MINLEN#,}$",
		lfilter : "^[A-Z]{0,#MAXLEN#}$",
		messages: {
			ko : '대문자를 입력하세요.([대문자], #MINLEN#~#MAXLEN#자)',
			zh : '请输入大写字母。([大写], #MINLEN#~#MAXLEN#字)',
			en : 'Please enter a capital letter.([capital], #MINLEN#-#MAXLEN# chars)'
		}
	},
	/** 소문자 체크 */
	lowercase	: {
		vfilter : "^[a-z]{#MINLEN#,}$",
		lfilter : "^[a-z]{0,#MAXLEN#}$",
		messages: {
			ko : '소문자를 입력하세요.([소문자], #MINLEN#~#MAXLEN#자)',
			zh : '请输入小写字母。([小写], #MINLEN#~#MAXLEN#字)',
			en : 'Please enter small letters.([small], #MINLEN#-#MAXLEN# chars)'
		}
	},
	checkbox	: {
		messages: {
			ko : '항목을 체크하십시오.',
			zh : '请检查一下项目。',
			en : 'Please check the item.'
		}
	},
	radio		: {
		messages: {
			ko : '항목을 체크하십시오.',
			zh : '请检查一下项目。',
			en : 'Please check the item.'
		}
	},
	select		: {
		messages: {
			ko : '항목을 선택하십시오.',
			zh : '请选择项目。',
			en : 'Please select an item.'
		}
	},
	
	/** 현재 등록된 필터를 적용할 Element */
	_currElements : [],
	/**
	 * 정렬
	 * @returns {Array} - 정렬 결과
	 */
	_sort : function() {
		var map = {};
		var result = [];
		for (var i in Filters._currElements) {
			var el = Filters._currElements[i];
			
			// 같은 row에서 element 간의 미세한 높이 차이가 발생하므로 1의 자리를 모두 같게 해주기 위해
			// (단, row의 pixel 높이가 10보다 크다는 전제가 필요함, 거의 대부분 10보다 크다)
			
			/*
			var os = el.offset();
			// Hidden인경우 top과 left 가 0이므로 visible한 element를 찾아서 정렬 시켜야한다. 
			var key = Filters._pad(parseInt(os.top/10)*10, 4) + Filters._pad(parseInt(os.left), 4);
			*/
			// 위방식이 아닌 상위 태그인 td태그의 위치값을 기준으로 정렬(hidden element가 포함된경우에는 이걸 사용하는것이 더 좋을듯)
			var os = el.closest("td").offset();
			var key = Filters._pad(parseInt(os.top), 4) + Filters._pad(parseInt(os.left), 4);
			
			if (el.prop("removed")) continue;	// 삭제되었되었으면 제외
			///////if (el.is(":hidden")) continue;	// hidden인 경우 제외, 일부러 hidden시킨경우일수도 있으므로 사용X
			map[key] = el;
		}
		
		var sortedArray = [];
		for (var i in map) {
			sortedArray.push([i, map[i]]);
		}
		sortedArray.sort();
		for (var i in sortedArray) {
			result.push(sortedArray[i][1]);
		}
		return result;
	},
	/**
	 * zero padding
	 */
	_pad : function(str, max) {
		  str = str.toString();
		  return str.length < max ? Filters._pad("0" + str, max) : str;
	},
	/** 등록된 필터의 validation 체크 */
	validate : function(exceptIds) {
		var required;
		var value;
		var message;
		var filters;
		
		if (!exceptIds) exceptIds = [];
		
		// 중요!!! -----------------------------------------
		// 필터목록에 포함된 element의 순서를 top left의 순으로 정렬하기 위해
		var sortedFilter = Filters._sort();
		
		for (var i in sortedFilter) {
			var el = sortedFilter[i];
			var id = el.prop("id");
			//var name = el.prop("name");
			
			filters = el._filters;
			
			if (!el.enableValueFilter()) continue;	// value filter enable하지 않으면 validation check를 하지 않는다.
			if (exceptIds.indexOf(id) >= 0 || !filters) continue;	// 예외 element인 경우validation check 하지 않는다
			
			required = filters.options.required;
			value = el.val();
			
			// 옵션이 필수가 아니고, 값도 없으면 패스한다.
			if (!required && !value) continue;
			
			// checkbox, radio, select form element check
			if (!Filters._selectOrCheckTypeValidate(el, value)) return false;
			
			// 현재 필터에서 값의 validation필터가 있으면 체크
			if (filters.valueFilter) {
				// validation을 체크
				if (!filters.valueFilter.test(value)) {
					Filters._setFileStyle(el, false);
					el.focus();
					alert(filters.message);
					return false;
				}
				// --------------------------------------------
				// 기본적인 필터를 통과한후 각 필터타입에 맞는 validation 체크
				// --------------------------------------------
				// [입력값이 날짜인지 체크]
				else if (filters.options.varType === 'date') {
					if (!Filters._dateValidate(el, value)) return false;
				}
				// [입력값이 지정 범위내에 있는지 체크]
				else if (filters.options.varType === 'range') {
					if (!Filters._rangeValidate(el, value)) return false;
				}
				// [입력폼이 file인 경우 file size 범위 체크]
				else if (filters.options.filter === 'file') {
					if (!Filters._fileValidate(el, value)) {
						Filters._setFileStyle(el, false);
						return false;
					}
				}
				// [입력폼이 persion_id(중국인 개인 식별번호 인경우) 추가 
				else if (filters.options.filter === 'person_id') {
					if (!Filters._personIdBirthValidate(el, value)) {
						return false;
					}
				}
			}
		}
		
		return true;
	},
	/** escape스트링으로 변환 */
	toRegExpString : function(regexp) {
		return regexp.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
	},
	/**
	 * 국가별 메시지에서 현재 언어에 해당하는 메시지를 리턴
	 * @param {Object} messages	- 언어별 message json object
	 */
	toLocaleMessage : function(messages) {
		return messages[LANG];
	},
	/**
	 * 용량 단위별 표시
	 * @param {Number} bytes : 파일 용량.
	 * @return {String} 용량에 따라, KB, MB, GB, TB 등으로 변환(,포함)
	 */
	bytesToSize : function(bytes) {
		var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		if (bytes == 0) return '0 Byte';
		var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		var s = Math.round(bytes / Math.pow(1024, i), 2);
		var localeStr = s.toLocaleString(undefined, {maximumFractionDigitis:2});
		return localeStr + ' ' + sizes[i];
	},
	/**
	 * 입력타입이 없는 checkbox/radio/select 타입 체크
	 * @param {Object} el	- Element Object
	 * @param {String} value - Element의 value
	 */
	_selectOrCheckTypeValidate : function(el, value) {
		var filters = el._filters;
		var filter = filters.options.filter;
		var required = filters.options.required;
		
		if (filter === 'radio' || filter === 'checkbox') {
			if (!required) return true;
			var isChecked = false;
			el.each(function() {
				if (this.checked) isChecked = true;
			});
			if (!isChecked) {
				el.focus();
				alert(filters.message);
				return false;
			}
		} else if (filter === 'select') {
			if (!required) return true;
			if (!value) {
				el.focus();
				alert(filters.message);
				return false;
			}
		}
		return true;
	},
	/**
	 * 날짜값 검증
	 * @param {Object} el	- Element Object
	 * @param {Date} value	- 입력 날짜
	 */
	_dateValidate : function(el, value) {
		var d = new Date(value);
		var dnum = d.getTime();
		
		var newVal = '';
		
		if (d && dnum) newVal = d.toISOString().slice(0,10);
		
		if ((!dnum && dnum !== 0) || newVal != value) {
			el.focus();
			alert(el._filters.message);
			return false;
		}
		
		//el.val(newVal); 만약 newValue로 변경할려면 newVal != value 부분을 없앤다.(2020-02-30일은 없는 날짜이나 오류가 아니기 때문이다)
		return true;
	},
	/**
	 * 범위값 검증
	 * @param {Object} el		- Element Object
	 * @param {Number} value	- 입력 값
	 */
	_rangeValidate : function(el, value) {
		if (el._filters.options.minVal > parseInt(value)
				|| (el._filters.options.maxVal && el._filters.options.maxVal < parseInt(value))) {
			el.focus();
			alert(el._filters.message);
			return false;
		}
		
		return true;
	},
	/**
	 * 개인식별번호(중국) 6번째부터 8자리가 생년월일을 나타냄
	 * @param {Object} el		- Element Object
	 * @param {Number} value	- 입력 값
	 */
	_personIdBirthValidate : function(el, value) {
		var dateStr = value.substr(6, 8);
		var year = dateStr.substr(0, 4);
		var month = dateStr.substr(4, 2);
		var day = dateStr.substr(6, 2);
		
		var birth = year+'-'+month+'-'+day;
		
		return Filters._dateValidate(el, birth);
	},
	/**
	 * 파일의 타입 및 용량 검증
	 * @param {Object} el		-Element Object
	 * @param {Number} value	- 파일 사이즈
	 */
	_fileValidate : function(el, value) {
		var varType = el._filters.options.varType;
		var options = el._filters.options;
		
		if (!varType || varType === 'default') {
			// 일반 파일 타입일 경우에는 파일의 사이즈나 이미지의 해상도 같은것은 체크하지 않도록 한다.
			// (즉, common_service.js 파일의 setFileAttachInfo를 사용하는 경우, size체크나 해상도 체크는 해당 함수에 맡기고
			// Filter에서는 단지 파일의 업로드 여부만 체크하도록 한다)
			if (!el.val()) {
				el.focus();
				alert(el._filters.message);
				return false;
			}
		} else if (varType === 'fileSize') {
			//for (var i = 0; i < el[0].files.length; i++) {
				var file = el[0].files[0];
				if (file.size < options.minSize
						|| options.maxSize && file.size > options.maxSize) {
					//message = message.replace("#FILENAME#", '[' + file.name + '] ');
					el.focus();
					alert(el._filters.message);
					return false;
				}
			//}
		} else if (varType === 'imageSize' || varType === 'imageRate') {
			var fileObj = el[0].files[0];
			if (fileObj.type.indexOf("image") < 0) {
				if (LANG === 'en') alert('Not in image format. : ' + fileObj.type);
				else if (LANG === 'ko') alert('이미지 형식이 아닙니다. : ' + fileObj.type);
				else alert("不是形象形式。 : " + fileObj.type);
				//alert("[" + fileObj.name + " : " + fileObj.type + "] Not image type.");
				el.focus();
				alert(el._filters.message);
   	    		return false;
   	    	}
			//// ==========================================================
			
			if (fileObj.type.indexOf("image") >= 0) {
				var _IMG_URL = window.URL || window.webkitURL;
				var img = new Image();
				var objectUrl = _IMG_URL.createObjectURL(fileObj);
				
				img.onload = function() {
					_IMG_URL.revokeObjectURL(objectUrl);
					var isValidImage = true;
					
					if (varType === 'imageSize') {
						if (options.minH > this.height) { isValidImage = false; }
						else if (options.minW > this.width) { isValidImage = false; }
						else if (options.maxH && options.maxH < this.height) { isValidImage = false; }
						else if (options.maxW && options.maxW < this.width) { isValidImage = false; }
					} else {
						var rate = this.width/this.height;
						if (options.minRate > rate) { isValidImage = false; }
						else if (options.maxRate && options.maxRate < rate) { isValidImage = false; }
					}
					
					if (!isValidImage) {
						alert(el._filters.message);
						Filters._setFileStyle(el, false);
					};
				}
				img.onerror = function() {
					alert("[" + fileObj.name + " : " + fileObj.type + "] image loading error.");
				}
				img.src = objectUrl;
			}
		}
		return true;
	},
	/**
	 * 입력 배경 스타일과 입력 후 Validation결과에 따른 배경 스타일 적용
	 * @param {Object}	el		- Element Object
	 * @param {Boolean} isInput	- 입력(focus, input, change ...)인지 아닌지(blur) 여부
	 */
	_setInputAndValidStyle : function(el, isInput) {
		if (!Filters.inputStyle && !Filters.validStyle) return;
		
		var inputStyle = Filters.inputStyle || '';
		var validStyle = Filters.validStyle || '';
		//var validStyle = "rgba(0,0,255,0.1)"; // rgb(232,240,254);
		
		var style = "";
		
		if (isInput) style = inputStyle;
		else if (el.prop("isValid")) style = validStyle;
		
		var filter = el._filters.options.filter;
		if (filter === 'radio') {
			el.closest("td").find(".jqformRadioWrapper").css("background", style); //.css("padding", "2px");
		} else if (filter === 'checkbox') {
			el.closest("td").find(".jqformCheckboxWrapper").css("background", style); //.css("padding", "2px");
		} else if (filter === 'file') {
			el.css("background", style);	
		} else el.css("background", style);
		
		/*if (filter === 'radio' || filter === 'checkbox' || filter === 'file') {
			el.closest("td").css("background", style);	
		} else  el.css("background", style); */
	},
	/**
	 * 입력 배경 스타일과 입력 후 Validation결과에 따른 파일 element의 스타일 적용
	 * @param {Object}	el		- File Element Object
	 * @param {Boolean} isValid	- valid 여부
	 */
	_setFileStyle : function(el, isValid) {
		if (typeof isValid === "undefined") isValid = el.prop("isValid");
		el.prop("isValid", isValid);
		if (!Filters.inputStyle && !Filters.validStyle) return;
		
		var inputStyle = Filters.inputStyle || '';
		var validStyle = Filters.validStyle || '';
		
		var style = isValid?validStyle:inputStyle;
		var filter = el._filters.options.filter;
		var varType = el._filters.options.varType;
		
		if (el.is(":hidden")) {
			$("input[name=dispFileName]", el.closest("td")).css("background", style);
			if (varType === 'imageSize' || varType === 'imageRate') {
				$(".photo > .image", el.closest("td")).css("background", style);
			}
		} else {
			el.css("background", style);
		}
		if (!isValid) {
			el.val('');
			$("input[name=dispFileName]", el.closest("td")).val('');
			if (varType === 'imageSize' || varType === 'imageRate') {
				$(".photo > .image", el.closest("td")).html(Filters.previewHintStyle.replace("#HINT#", el._filters.hint));
			}
		}
	},
	/**
	 * Element의 스타일을 초기화
	 * @param {Object} el	: element
	 */
	_resetStyle : function(el) {
		var type = el.prop("type");
		var varType = el._filters.options.varType;
		if (type === 'radio') {
			el.closest("td").find(".jqformRadioWrapper").css("background", "");
		} else if (type === 'checkbox') {
			el.closest("td").find(".jqformCheckboxWrapper").css("background", "");
		} else if (type === 'file') {
			if (el.is(":hidden")) {
				$("input[name=dispFileName]", el.closest("td")).css("background", "");
				if (varType === 'imageSize' || varType === 'imageRate') {
					$(".photo > .image", el.closest("td")).css("background", "");
				}
			} else {
				el.css("background", "");
			}
		} else el.css("background", "");
	},
	/**
	 * 옵션에 맞는 필터를 등록하고, 메시지 포맷 설정
	 * @param {Object} el		- form element
	 * @param {Object} options {
	 * 		filter	: 폼에 사용할 필터명,		default : empty(최대 길이에 대한 입력 필터만 적용)
	 * 		name	: 경고시 사용할 폼 이름,	default : 입력폼 영역에 정의된 이름.(ex, 상위 td를 찾은뒤, th에 포함된 text)  
	 * 		minLen	: 입력폼의 최소 길이,		default : 0 (filter가 정의되어 있으면 blur시 체크한다.)
	 * 		maxLen	: 입력폼의 최대 길이,		default : null (input폼에 적용되며 최대길이 이상 입력이 제한된다.)
	 * 		minVal	: 입력폼의 최소값,		default : 0 (range필터에 적용)
	 * 		maxVal	: 입력폼의 최대값,		default : null (range필터에 적용)
	 * 		minSize	: 파일업로드 최소용량,	default : 0 (file폼에 적용)
	 * 		maxSize : 파일업로드 최대용량,	default : null (file폼에 적용)
	 * 		message	: 경고시 사용할 메시지,	default : 내부 정의 메시지
	 * 		hintType: 힌트 방식 혹은 대상,	default : placeholder, (placeholder/tooltip/title/focus_only/left/right/top/bottom/etc)
	 * 		hint	: 힌트내용,			default : options의 message항목에서 괄호안의 내용을 추출하여 보여준다.
	 * 		required: 입력폼 필수 여부,		default : name이 있는 영역의 * 표시로 판단한다.
	 * 		varType	: 입력폼의 타입 및 특성	default : string
	 * 					date(날짜), range(범위), number(숫자), file(파일등록체크), fileSize(파일용량체크)
	 * } 
	 */
	_initFilters	: function(el, options) {
		if (!options) options = {};
		if (!options.filter) options.filter = "empty";				// 정의된 필터가 없으면 empty validation을 위한 필터 설정
		var elType = el.prop("type");
		var elTagName = el.prop("tagName");
		
		if (elType === "file") options.filter = "file"; 	// 파일폼이면 무조건 file 필터로 변경
		else if (elType === "checkbox") { options.filter = "checkbox"; options.hintType = 'title'; }
		else if (elType === "radio") { options.filter = "radio"; options.hintType = 'title'; }
		else if (elTagName === "SELECT") { options.filter = "select"; options.hintType = 'title'; }
		else if (elTagName === "TEXTAREA") options.filter = "textarea";	// textarea 영역은 무조건 textarea필터를 사용
		
		var fObj = Filters[options.filter];	// 필터에 사용할 Regular Expression
		var vf = fObj.vfilter || '';
		var lf = fObj.lfilter || '';
		//var lf = fObj.lfilter || "^.{0,#MAXLEN#}$";	// default length필터
		var msg = fObj.messages[LANG];	// 해당언어 메시지
		
		// --------------------------------------------------------------
		// 옵션 및 메시지 기본 환경 정의
		// --------------------------------------------------------------
		
		options.minLen = parseInt(options.minLen) || parseInt(fObj.minLen) || 0;	// 입력 최소 길이(default : 0)
		options.maxLen = parseInt(options.maxLen) || parseInt(fObj.maxLen) || null;	// 입력 최대 길이
		options.correct = parseInt(fObj.correct)  || 0;					// correct : 최소, 최대길이 계산 보정값
		options.minVal = parseInt(options.minVal) || 0;					// 입력 최소값(숫자) 
		options.maxVal = parseInt(options.maxVal) || null;				// 입력 최대값(숫자)
		options.minSize = parseInt(options.minSize) || 0;				// 파일 최소사이즈(숫자)
		options.maxSize = parseInt(options.maxSize) || null;			// 파일 최대사이즈(숫자)
		options.varType = options.varType || fObj.varType || "string";
		
		if (options.maxLen && options.maxLen < options.minLen) options.maxLen = options.minLen;
		if (options.maxVal && options.maxVal < options.minVal) options.maxVal = options.minVal;
		if (options.maxSize && options.maxSize < options.minSize) options.maxSize = options.minSize;
		// --------------------------------------------------------------
		
		// --------------------------------------------------------------
		// 필터 및 메시지 설정
		// --------------------------------------------------------------
		var msg = '';
		if (options.msg) msg = options.message; // 옵션의 메시지가 우선하며 없으면 내부에 정의된 메시지 사용
		else if (options.varType && fObj.messages[options.varType]) {
			msg = fObj.messages[options.varType][LANG] || fObj.messages[LANG]; 
		} else msg = fObj.messages[LANG];
		//msg = options.message || msg;	
		
		vf = vf.replace("#MINLEN#", (options.minLen + options.correct));	// 패턴 필터에 입력길이 설정
		msg = msg.replace("#MINLEN#", options.minLen);						// 메시지에 최소 입력길이 표시
		
		if (options.maxLen) {
			vf = vf.replace("#MAXLEN#", (options.maxLen + options.correct));// 최대길이값+보정값으로 입력길이 제한
			if (lf) lf = lf.replace("#MAXLEN#", options.maxLen);			// 최대길이값+보정값으로 입력길이 제한
			msg = msg.replace("#MAXLEN#", options.maxLen);					// 메시지에 최대입력길이 표시
		} else {
			vf = vf.replace("#MAXLEN#", '');								// 최대길이가 없으면 표시 제거
			if (lf) lf = lf.replace("#MAXLEN#", '');						// 최대길이가 없으면 표시 제거
			msg = msg.replace("#MAXLEN#", '');								// 최대길이가 없으면 표시 제거
		}
		
		// 범위값일 경우 최대값과 최소값에 대한 메시지 표시 설정
		if (options.varType === 'range') {
			options.minLen = 0;
			options.maxLen = null;
			msg = msg.replace("#MINVAL#", options.minVal);
			if (options.maxVal != null) msg = msg.replace("#MAXVAL#", options.maxVal);
			else msg = msg.replace("#MAXVAL#", '');
		}
		// 파일일 경우 최대/최소 사이즈 및 파일명에 대한 표시 설정
		if (options.filter === 'file') {
			//msg = '#FILENAME#'+msg;
			if (options.varType === 'fileSize') {
				msg = msg.replace("#MINSIZE#", Filters.bytesToSize(options.minSize));
				if (options.maxSize != null) msg = msg.replace("#MAXSIZE#", Filters.bytesToSize(options.maxSize));
				else msg = msg.replace("#MAXSIZE#", '');
			}
			else if (options.varType === 'imageSize') {
				options.minH = !isNaN(options.minH)?Number(options.minH):0;
				options.minW = !isNaN(options.minW)?Number(options.minW):0;
				options.maxH = !isNaN(options.maxH)?Number(options.maxH):null;
				options.maxW = !isNaN(options.maxW)?Number(options.maxW):null;
				msg = msg.replace("#MINH#", options.minH);
				msg = msg.replace("#MINW#", options.minW);
				msg = msg.replace("#MAXH#", options.maxH?options.maxH:'*');
				msg = msg.replace("#MAXW#", options.maxW?options.maxW:'*');
			}
			else if (options.varType === 'imageRate') {
				options.minRate = !isNaN(options.minRate)?Number(options.minRate):0;
				options.maxRate = !isNaN(options.maxRate)?Number(options.maxRate):null;
				msg = msg.replace("#MINRATE#", options.minRate);
				if (options.maxRate) msg = msg.replace("#MAXRATE#", options.maxRate);
				else msg = msg.replace("#MAXRATE#", '');
			}
			
			// 만약 필터가 있다면, 파일폼의 accept를 참조하여, 해당 필터에 파일확장자 패턴을 추가한다.
			if (vf) {
				var accept = options.accept || $(el).attr("accept");	// 옵션설정값이 없으면 파일폼의 accept를 사용
				
				if (!accept) accept = '*';
				
				if (!accept || accept === "*" || accept === "*.*") {	// 모든 파일 확장자인경우
					vf = vf.replace("#ACCEPT#", "[A-Za-z0-9]{1,4}");		// 알파벳+숫자 확장자 1~3글자 허용
				} else {
					accept = accept.replace(/[\.* ]/g, '').replace(/,/g, '|');	// accept에서 공백,.,*를 제거한후 ,를 |로 모두 변경
					//accept = accept.slit(",").join('|');
					vf = vf.replace("#ACCEPT#", '('+accept+')');	// 패턴에 accept에 등록된 파일 확장자 모두 추가
				}
				
				var accepts = accept.split('|');
				for (var i = 0; i < accepts.length; i++) accepts[i] = "."+accepts[i];
				el.attr("accept", accepts.join(','));
				//console.log(f);
				options.accept = accept;
			}
		}
		// --------------------------------------------------------------
		//if (!vf && !options.maxLen) return null;
		
		// --------------------------------------------------------------
		// 필수 여부 설정 및 필수 조건에 따른 필수 표시
		// - 메시지에 표시할 입력폼의 명칭 조회(입력 폼이 속한 td의 header인 th의 text)
		// - 필수표시가 있으면 이름뒤에 표시
		// --------------------------------------------------------------
		var nameEl = el.closest("td").prev("th");// form에서 이름을 찾아낸다.
		var name = nameEl.text();
		var required = false;						// 필수 옵션 여부
		if (name.indexOf("*") > 0) required = true;	// 필수 설정  
		name = name.replace('*','').trim();			// name에서 * 표시 제거
		// 필수여부 설정이 없으면, 내부적으로 판단한 필수여부 설정
		if (!options.hasOwnProperty('required')) options.required = required;
		// 폼 이름 설정이 없으면, 내부적으로 판단한 이름 설정
		if (!options.hasOwnProperty('name')) options.name = name;
		// 필수이면서도 essential표시가 없는경우를 대비하여 자동적으로 essential표시를 붙인다.
		if (options.required) nameEl.html(name + Filters.defEssential);
		// --------------------------------------------------------------
		
		// --------------------------------------------------------------
		// 힌트 정의
		// --------------------------------------------------------------
		var hintType = options.hintType || fObj.hintType || Filters.defHintType || "placeholer";
		var hint = options.hint || fObj.hint;
		if (hint) {
			hint = hint.replace("#MINLEN#", options.minLen).replace("#MINVAL#", options.minVal).replace("#MINSIZE#", options.minSize);
			if (options.maxLen) hint = hint.replace("#MAXLEN#", options.maxLen);
			else hint = hint.replace("#MAXLEN#", '');
			if (options.maxVal) hint = hint.replace("#MAXVAL#", options.maxVal);
			else  hint = hint.replace("#MAXVAL#", '');
			if (options.maxSize) hint = hint.replace("#MAXSIZE#", options.maxSize);
			else hint = hint.replace("#MAXSIZE#", '');
		}
		
		if (hintType && hintType != 'none') {
			if (!hint) {
				var match = msg.match(/\((.*?)\)$/);
				if (match) hint = match[1];
				else hint = msg;
			}
			if (hintType !== "focus_only" && hintType !== "tooltip") {
				if (hintType === "placeholder" || hintType === "title") {
					el.prop(hintType, hint);
				} else if (hintType === "right") {
					el.after(" "+Filters.defHint.replace("#HINT#", hint));
				} else if (hintType === "left") {
					el.before(Filters.defHint.replace("#HINT#", hint)+" ");
				} else if (hintType === "top") {
					el.before(Filters.defHint.replace("#HINT#", hint)+"<br>");
				} else if (hintType === "bottom") {
					el.after("<br>"+Filters.defHint.replace("#HINT#", hint));
				} else {
					// hint영역을 만들어 붙일수도 있고, 이미 있는 영역에 hint를 표시
					$("#"+hintType).text(hint);
				}
			}
			if (hintType === "tooltip" && !Filters._tooltip) {
				Filters._tooltip = $(Filters.defTooltip);
				Filters._tooltip.appendTo("body");
			}
			if (options.filter === 'file') {
				$("input[name=dispFileName]", el.closest("td")).prop("placeholder", hint);
				if (options.varType === 'imageRate' || options.varType === 'imageSize') {
					$(".photo > .image", el.closest("td")).html(Filters.previewHintStyle.replace("#HINT#", hint));
				}
			}
		}
		// --------------------------------------------------------------
		// 필터 설정(value 필터, length 필터, 메시지)
		// --------------------------------------------------------------
		var filters = {};
		filters.valueFilter = new RegExp(vf);			// 입력값 필터를 위한 정규 표현식 패턴
		if (lf) filters.lengthFilter = new RegExp(lf);	// 입력길이 필터를 위한 정규 표현식 패턴
		filters.message = options.name + " : " + msg;	// 최종 Filter 메시지
		filters.hintType = hintType;
		filters.hint = hint;
		filters.options = options;
		
		el._filters = filters;
		el.prop("uuid", Filters._create_UUID()); 
		
		// 필터에 적용할 최종 설정 등록
		Filters._currElements.push(el);
		// --------------------------------------------------------------
	},
	_create_UUID : function(){
	    var dt = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (dt + Math.random()*16)%16 | 0;
	        dt = Math.floor(dt/16);
	        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
	    });
	    return uuid;
	},
	_findElement : function(uuid) {
		var el;
		for (var i in Filters._currElements) {
			el = Filters._currElements[i];
			if (el.prop("uuid") === uuid) break;
		}
		return el;
	}
}
