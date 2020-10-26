/**
 * Form element 생성
 * @author : hwshim
 */
function CommonForms(action, method) {
	this.form = null;
	this.formData = new FormData();
	
	this.action = action?action:"#";
	this.method = method?method:"GET";
	
	this.dateFormat = 'yyyy-MM-dd';
	this.isNewForm = true;
	this.enableYN = true;
	
	this.setAction = function(action) { this.action = action; return this; };
	this.setMethod = function(method) { this.method = method; return this; };
	// Yn으로 끝나는 element(특히, radio/checkbox)들의 값을 Y/N으로 설정하기 위함
	this.setEnableYN = function(enable) { this.enableYN = enable; return this; };
	
	/**
	 * 폼 생성
	 * @param {String} id	- form ID
	 */
	this.createForm = function(id) {
		if (id && $("#"+id).length > 0) $("#"+id).remove();
		
		this.form = $('<form></form>');
		if (id) this.form.attr("id", id);
		
		this.isNewForm = true;
		
		this._setPageSize();
		
		return this;
	};
	/**
	 * 폼 객체를 가져온다.
	 * @param {String} id	- form ID
	 * @return {Object}		- form Object
	 */
	this.getForm = function(id) {
		var isForm = $.find('form[id="'+id+'"]').length > 0;
		if (isForm) {
			this.form = $("#"+id);
			if (this.form) this.isNewForm = false;
			
			this._setPageSize();
			
			return this;
		} else {
			alert("The form[id="+id+"] not found.");
			return null;
		}
	};
	/**
	 * 현재 폼에 input element 리스트 추가(존재 유무와 상관없이 추가)
	 * @param {Object} objs	- Key/Value JSON Object
	 * @return {Object}		- form Object
	 */
	this.addElements = function(objs) {
		var $this = this;
		
		$.each(objs, function(k, v) {
			$this.addElement(k, (v||v==0)?v.toString():v);
		});
		return this;
	};
	/**
	 * 현재 폼에 input element 리스트 추가(이미 존재하는 element인 경우 값 변경)
	 * @param {Object} objs	- Key/Value JSON Object
	 * @return {Object}		- form Object
	 */
	this.setElements = function(objs) {
		var $this = this;
		
		$.each(objs, function(k, v) {
			$this.setElement(k, (v||v==0)?v.toString():v);
		});
		return this;
	};
	/**
	 * Element의 값을 가져온다.
	 * @param {String} name	- element 이름
	 * @return {Object}		- element 값
	 */
	this.getElement = function(name) {
		var val = $("[name='"+name+"']", this.form).val();
		if (!val) val = $("#"+name, this.form).val();
		return val;
	};
	/**
	 * Element의 배열 값을 가져온다.
	 * @param {String} name	- element 이름
	 * @return {Array}		- element 배열값
	 */
	this.getElements = function(name) {
		var vals = [];
		$("[name='"+name+"']", this.form).each(function() {
			vals.push($(this).val());
		});
		return vals;
	};
	/**
	 * 현재 폼에 input element 추가(존재 유무와 상관없이 추가)
	 * @param {String} name	- element 이름
	 * @param {String} val	- element 값
	 * @param {String} type	- element type[text|textarea|checkbox|radio|...]
	 * @return {Object}		- form Object
	 */
	this.addElement = function(name, val, type) {
		if (!type) type = "hidden";
		var el = $('<input>').attr({
		    type: type,
		    //id: name,
		    name: name,
		    value: val
		});
		el.appendTo(this.form);
		return this;
	}; 
	/**
	 * 현재 폼에 input element 추가(이미 존재하는 element인 경우 값 변경)
	 * @param {String} name	- element 이름
	 * @param {String} val	- element 값
	 * @param {String} type	- element type[text|textarea|checkbox|radio|...]
	 * @return {Object}		- form Object
	 */
	this.setElement = function(name, val, type) {
		if (this.form.find("input[name='"+name+"']").length > 0) {
			this.form.find("input[name='"+name+"']").val(val);
			return this;
		} else if (this.form.find("select[name='"+name+"']").length > 0) {
			this.form.find("select[name='"+name+"']").val(val);
			return this;
		} else {
			return this.addElement(name, val, type);
		}
	};
	/**
	 * id에 해당하는 폼 데이터를 가져와서 현재 폼에 추가
	 * @param {String} id			- Form ID
	 * @param {Boolean} isOverride	- 덮어쓰기 여부
	 * @return {Object}				- form Object
	 */
	this.appendForm = function(id, isOverride) {
		var arrs = $("#"+id).serializeArray();
		if (!arrs) return this;
		var $this = this;
		if (isOverride) {
			$.each(arrs, function() {
				$this.setElement(this.name, this.value);
			});
		} else {
			$.each(arrs, function() {
				$this.addElement(this.name, this.value);
			});
		}
		return this;
	};
	/**
	 * Top Form의 데이터를 현재 폼에 추가
	 */
	this.appendTopForm = function() {
		return this.appendForm("topform", true);
	};
	/**
	 * 폼데이터 생성 순환 함수
	 * @param {Object} data	- Key/Value JSON Object
	 * @param {String} key 	- form element key
	 */
	this._createFormData = function(data, key) {
		if ((typeof data === 'object' && data !== null ) || Array.isArray(data)) {
			var nextKey;
			for (var i in data) {
   	        	nextKey = key?key + '[' + i + ']' : i;
   	            this._createFormData(data[i], nextKey);
   	        }
   	    } else {
   	    	if (key) this.formData.append(key, data);
   	    }
    };
	/**
	 * 폼데이터 추가
	 * @param {Object} data			- Key/Value JSON Object
	 * @param {String} key 			- form element key
	 * @return {Object}				- form Object
	 */
	this.appendFormData = function(data, key) {
		if (data) this._createFormData(data, key);
		return this;
	};
	/**
	 * 폼데이터 제거
	 * @return {Object}				- form Object
	 */
	this.clearFormData = function() {
		this.formData = new FormData();
		return this;
	};
	/**
	 * 현재 폼에 적용된 데이터를 FormData 형식으로 가져온다.
	 * @return {Object}				- form data
	 */
	this.getFormData = function() {
		this.appendFormData(this.serializeObject());
		var $formData = this.formData;
		
		this.form.find("input[type='file']").each(function(){
			for (var i=0; i < this.files.length; i++) {
				$formData.append(this.name||this.id, this.files[i]);
				//$formData.append(this.id?this.id:this.name, this.files[i]);
				//$formData.append(this.name?this.name:this.id, this.files[i]);
			}
		});
		
		return this.formData;
	};
	/**
	 * 현재 적용된 폼데이터를 제외한 입력된 데이터에 대해서만 변환
	 * @param {Object}	data		- Key/Value JSON Object
	 * @param {String} key 			- form element key
	 * @return {Object}				- form data
	 */
	this.transFormData = function(data, key) {
		this.appendFormData(data, key);
		return this.formData;
	};
	
	/**
	 * 현재 입력폼을 readonly 상태로 변환
	 * @param {Array}	excepts		- 제외시킬 form element 이름
	 * @return {Object}				- form object
	 */
	this.setReadOnly = function(excepts) {
		var thisObj = this;
		this.form.find("input[id],input[name],textarea[id],textarea[name],select[id],select[name]").each(function(){
			if (!excepts || excepts.indexOf(this.name) < 0) {
				//$(this).attr("readonly", true);
				thisObj._readonly($(this), true);
			}
		});
		
		return this;
	};
	/**
	 * 폼의 데이터를 Json Object로 serialize
	 * @return {Object}	- Key/Value JSON Object 
	 */
	this.serializeObject = function() {
		if (!this.form) return null;
		var idArrs = [];
		/* name 이 없는 input form이 있는 경우를 찾아 해당 Key와 Value를 임시 저장 */
		this.form.find("input[id],textarea[id],select[id]").each(function(){
			if (!this.name) {
				if(this.type === 'checkbox' || this.type==='radio') {
					if (!$(this).is(":checked")) {idArrs.push({'name':this.id, 'value':'N'}); }
					else { idArrs.push({'name':this.id, 'value':'Y', 'type':this.type}); }
				} else {
					idArrs.push({'name':this.id, 'value':$(this).val(), 'type':this.type});
				}
			}
		});
		
		var o = {};
		var nameArrs = this.form.serializeArray();
		
		var a = nameArrs.concat(idArrs);
		
		var val = '';
		var $this = this;
		
		$.each(a, function () {
	    	val = this.value;
	    	if ($this.enableYN && this.name.lastIndexOf('Yn') > 0 && this.value === 'on') val = 'Y';
	    	
	    	if (o[this.name] !== undefined) {
	        	if (!o[this.name].push) {
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(val || '');
	        } else {
	            o[this.name] = val || '';
	        }
	    });
	    var $radio = $('input[type=radio],input[type=checkbox]',this.form);
	    val = this.enableYN?'N':''; 
	    $.each($radio,function(){
	    	if(!o.hasOwnProperty(this.name) && this.name.lastIndexOf("Yn") > 0){
	            o[this.name] = val;
	        }
	    });
	    
	    return o;
	};
	/**
	 * object를 폼에 적용
	 * @param {Object} data			- Key/Value JSON Object
	 * @param {Boolean} enableText	- 폼이 아닌 element 포함 여부[td, span]
	 */
	this.deserializeObject = function(data, enableText) {
		var thisObj = this;
		
		var k;
	    var f = this.form,
            map = {},
            find = function (selector) { return f.is("form") ? f.find(selector) : f.filter(selector); };
        //Get map of values
        /* jQuery.each(data.split("&"), function () {
            var nv = this.split("="),
                n = decodeURIComponent(nv[0]),
                v = nv.length > 1 ? decodeURIComponent(nv[1]) : null;
            if (!(n in map)) {
                map[n] = [];
            }
            map[n].push(v);
        }) */
        for (k in data) {
        	map[k] = data[k];
        };
        //Set values for all form elements in the data
        /* jQuery.each(map, function (n, v) {
            var fObj = find("[name='" + n + "']");
            fObj.val(v);
            if (n.lastIndexOf('_YN') > 0 && v == 'Y') {
            	fObj.prop("checked", true);
            	fObj.change();
            }
        }) */
        //Clear all form elements not in form data
        find("input:text,select,textarea,input:hidden,input[type=number]").each(function () {
        	var key = this.name || this.id;
        	if (!(this.name in map) && !(this.id in map)) {
        		//if (this.type == "number") $(this).val(0);
        		//else $(this).val('');
            } else {
            	$(this).val(map[key]);
            	//if (this.tagName === 'SELECT') $(this).change();
            }
        });
        find("input:radio").each(function () {
        	var key = this.name || this.id;
        	if (!(this.name in map) && !(this.id in map)) {
        		//this.checked = false;
            } else {
            	if (map[key] == this.value) {
            		$(this).prop("checked", true);
            	//	$(this).change();
            	}
            }
        });
        find("input:checkbox").each(function () {
        	var key = this.name || this.id;
        	if (!(this.name in map) && !(this.id in map)) {
            	//this.checked = false;
            } else {
            	if (map[key] == 'Y') {
            		$(this).prop("checked", true);
            		//$(this).change();
            	}
            }
        	if ($(this).prop("readonly")) {
        		thisObj._readonly($(this), true);
        	}
        });
    	if (enableText) {
    		find("td[id],span[id],p[id]").each(function () {
    			var elId = $(this).attr("id");
    			var val = data[$(this).attr("id")];
    			
    			if (elId == "modBy" && data["modByIdNm"]) {
    				val = data["modByIdNm"];
    				//val = data["modByNm"] + "(" + val + ")";
    			} else if (elId == "crtBy" && data["crtByIdNm"]) {
    				val = data["crtByIdNm"];
    				//val = data["crtByNm"] + "(" + val + ")";
    			} 
	       		
    			if (val || val == 0) {
    				var viewType = $(this).attr("viewType");
    				if (viewType) {
	    				if (viewType === "html") $(this).html(val);
	    				else if (viewType === "pre" || viewType === "pre-wrap" || viewType === "pre-line") { 
	    					$(this).html("<pre style='white-space:"+viewType+"'>"+val+"</pre>");
	    				} else $(this).text(val);
	    			} else $(this).text(val);
    				
    				/*if ($(this).attr("viewType") === "html") $(this).html(val);
    				else if ($(this).attr("viewType") === "pre") $(this).html("<pre>"+val+"</pre>");
    				else $(this).text(val);*/
    			}
	        });
        }
    	
    	if (data && data.pageSize && $("#pageSize").length > 0) $("#pageSize").val(data.pageSize);

       /*  find("input:checkbox:checked,input:radio:checked").each(function () {
        	if (!(jQuery(this).attr("name") in map)) {
            	this.checked = false;
            }
        }) */
        return this;
    };
    /**
     * 해당 id에 text 추가
     * @param {String} id		- Element ID 
     * @param {String} val		- text value
     * @param {String} defVal	- default text value
     * @return {Object}			- Form Object
     */
    this.appendText = function(id, val, defVal) {
    	var elObj = $("#"+id);
    	defVal = defVal?defVal:'';
    	if (elObj) elObj.append(val?val:defVal);
    	return this;
    };
    /**
     * 해당 id에 html 적용
     * @param {String} id		- Element ID 
     * @param {String} val		- text value
     * @param {String} defVal	- default text value
     * @return {Object}			- Form Object
     */
    this.setHtml = function(id, val, defVal) {
    	var elObj = $("#"+id);
    	defVal = defVal?defVal:'';
    	if (elObj) elObj.html(val?val:defVal);
    	return this;
    };
    /**
     * 해당 id에 text 적용
     * @param {String} id		- Element ID 
     * @param {String} val		- text value
     * @param {String} defVal	- default text value
     * @return {Object}			- Form Object
     */
    this.setText = function(id, val, defVal) {
    	var elObj = $("#"+id);
    	defVal = defVal?defVal:'';
    	if (elObj) elObj.text(val?val:defVal);
    	return this;
    };
    /**
     * 해당 id에 날짜값 text 적용
     * @param {String} id		- Element ID 
     * @param {String} val		- date string value
     * @return {Object}			- Form Object
     */
    this.setDate = function(id, val) {
    	var elObj = $("#"+id);
    	var dateStr = val?val:new Date().format(this.dateFormat);
    	if (elObj) elObj.text(dateStr);
    	return this;
    };
    /**
     * 해당 id에 값 적용
     * @param {String} id		- Element ID 
     * @param {String} val		- value
     * @param {String} defVal	- default value
     * @return {Object}			- Form Object
     */
    this.setValue = function(id, val, defVal) {
    	var elObj = $("#"+id);
    	defVal = defVal?defVal:'';
    	if (elObj) elObj.val(val?val:defVal);
    	return this;
    };
    /**
     * 해당 id에 날짜값 적용
     * @param {String} id		- Element ID 
     * @param {String} val		- date string value
     * @return {Object}			- Form Object
     */
    this.setValueDate = function(id, val) {
    	var elObj = $("#"+id);
    	var dateStr = val?val:new Date().format(this.dateFormat);
    	if (elObj) elObj.val(dateStr);
    	return this;
    };
    /**
     * 폼 reset
     */
    this.reset = function() {
    	if (this.form && this.form.length) this.form[0].reset();
    },
    /**
     * 폼의 모든 값 초기화
     */
    this.clear = function() {
    	if (!this.form) return;
    	var objs = this.serializeObject();
    	this.reset();
    	var elObj = null;
    	var elType = null;
    	for (var k in objs) {
    		elObj = $("#"+k, this.form);
    		elType = elObj.attr("type");
    		if (elType === "radio" || elType === "checkbox") elObj.prop('checked', false);//.trigger('change');
    		else elObj.val('');//.trigger('change');
    	}
    };
    /**
     * form value와는 별도로 text value를 clear
     * @param {Array} exceptIds	- 제외시킬 Element ID
     */
    this.clearText = function(exceptIds) {
    	var excepts = [];
    	if (exceptIds && !Array.isArray(exceptIds)) exceptIds = [exceptIds];
    	for (var i in exceptIds) excepts.push(exceptIds[i]);
    	 
		this.form.find("div[id],td[id],span[id],dt[id],dd[id],tbody[id]").each(function () {
			if (Common.includes(excepts, this.id)) { return true; }
			$(this).text("");
        }); 
    };
    /**
     * 입력폼의 경우에 로그인 사용자의 기본정보를 넣기 위해
     * @param {Object} data	- Key/Value JSON Object
     */
    this.setDefaultValues = function(data) {
    	if (!data) return this;
    	//var newData = Object.assign({}, data);
    	var newData = {};
    	if (data.sessUserId) newData['crtBy'] = data.sessUserId;
    	if (data.sessUserName) newData['crtByNm'] = data.sessUserName;
    	if (data.sessUserId && data.sessUserName) newData['crtByIdNm'] = data.sessUserName + '(' + data.sessUserId + ')';
    	newData['crtDtm'] = new Date().format(this.dateFormat);
    	if (data.ip) newData['crtIp'] = data.ip;
    	
    	this.deserializeObject(newData, true);
    	
    	return this;
    };
    /**
     * 폼 element 숨기기
     * @param {String} id	- Form Element ID
     * @return {Object}		- Form Object
     */
    this.hide = function(id) {
		$("#"+id).hide();
		return this;
	};
	/**
	 * 폼 element 보이기
	 * @param {String} id	- Form Element ID
     * @return {Object}		- Form Object
     */
	this.show = function(id) {
		$("#"+id).show();
		return this;
	};
	/**
	 *  textarea 폼의 최대 높이 및 자동 크기 증가 옵션등 설정
	 *  @param {String} id		- Form Element Id
	 *  @param {Object} options	- Form 적용 options : 아래 참조
	 *  @return {Object}		- Form Object
	 *  options {
	 *  	width : 가로 크기					default : 100%
	 * 		height : 세로 크기					default : 100 or minHeight
	 *  	autoHeight : 자동 크기 여부,	 	default : true
	 *  	minHeight : 최소 크기				default : 100
	 *  	maxHeight : 최대 크기(없으면 계속 증가)	default : none
	 *  	overflow : 스크롤 여부				default : auto
	 *  }
	 */
	this.adjustTextarea = function(id, options) {
		var el = $("#"+id);
		if (!el || el.length == 0) return;
		if (!options) options = {};
		
		var minHeight = options.minHeight || 100;
		var height = options.height || minHeight;
		var width = options.width || "100%";
		var overflow = options.overflow || "auto";
		var autoHeight = options.hasOwnProperty('autoHeight') ? options.autoHeight : true;
		
		el.css("min-height", minHeight);
		el.css("height", height);
		el.css("overflow", overflow);
		el.css("width", width);
		if (options.maxHeight) el.css("max-height", options.maxHeight);
		
		if (options.hasOwnProperty('resize')) {
			// resize: none, vertical, horizontal
			el.css('resize', options.resize);
		} else {
			el.css('resize','none');
		}
		
		if (autoHeight) {
			var domEl = document.getElementById(id);
			var offset = domEl.offsetHeight - domEl.clientHeight;
			
			var resizeTextarea = function(obj) {
				$(obj).css('height', 'auto').css('height', obj.scrollHeight + offset);
			};
			el.on('keyup input', function() {
				resizeTextarea(this);
			}).removeAttr('data-autoresize');
		}
		
		return this;
	};
	/**
	 * Form Element disable
	 * @param {String} id			- Form Element ID
	 * @return {Object}				- Form Object
	 */
	this.disableElement = function(id) {
		var el = $("[name='"+id+"']", this.form);
		if (!el || el.length == 0) el = $("#"+id, this.form);
		if (!el || el.length == 0) return;
		
		var type = el.prop("type");
		
		el.prop("disabled", true);
		
		if (!type || type === "text" || type === "password" || type === 'textarea') {
			//el.val('');
			el.addClass("nondisable");
		} else if (type === "radio") {
			this.disableRadio(id);
		} else if (type === "checkbox") {
			//el.prop('checked', false);
		} else if (type.indexOf("select") == 0){
			//el.val('');
			el.parent().addClass("nondisable");
		}
		
		return this;
	},
	/**
	 * Form Elements disable
	 * @param {Array} idArr			- Form Element ID 배열
	 * @return {Object}				- Form Object
	 */
	this.disableElements = function(idArr) {
		for (var i in idArr) {
			this.disableElement(idArr[i]);
		}
		return this;
	},
	/**
	 * Form Element enable
	 * @param {String} id		- Form Element ID
	 * @param {Object} data		- enable 시킬 Key/Value JSON Object
	 * @return {Object}				- Form Object
	 */
	this.enableElement = function(id, data) {
		var el = $("[name='"+id+"']", this.form);
		if (!el || el.length == 0) el = $("#"+id, this.form);
		if (!el || el.length == 0) return;
		
		var type = el.prop("type");
		
		var val = '';
		if (typeof data === 'string') val = data;
		else if (typeof data == 'object') val = data[id];
		
		el.removeAttr("disabled");
		
		if (!type || type === "text" || type === "password" || type === 'textarea') {
			el.removeClass("nondisable");
			if (val) el.val(val);
		} else if (type === "radio") {
			this.enableRadio(id, val, true);	// 해당값만 enable시킨다. 
		} else if (type === "checkbox") {
			if (val && val != 'N') el.prop("checked", true);
		} else if ( type.indexOf("select") == 0){
			el.parent().removeClass("nondisable");
			if (val) el.val(val);
		}
		return this;
	},
	/**
	 * Form Element enable
	 * @param {Array} idArr		- Form Element ID 배열
	 * @param {Object} data		- enable 시킬 Key/Value JSON Object
	 * @return {Object}				- Form Object
	 */
	this.enableElements = function(idArr, data) {
		for (var i in idArr) {
			this.enableElement(idArr[i], data);
		}
		return this;
	},
	/**
	 * Form Element disable
	 * @param {String} id			- Form Element ID
	 * @param {Object} values		- disable 시킬 Radio의 배열값
	 * @param {Boolean} isOnly		- 해당값만 disable 여부
	 * @return {Object}				- Form Object
	 */
	this.disableRadio = function(id, values, isOnly) {
		var el = $("[name='"+id+"']", this.form);
		if (!el || el.length == 0) el = $("#"+id, this.form);
		if (!el || el.length == 0) return;
		
		if (!values) { el.prop("disabled", true); return; }
		
		if (!$.isArray(values)) values = [values];
		
		el.each(function() {
			if (values.indexOf($(this).val()) > -1) {
				$(this).prop("disabled", true);
			} else if (!isOnly){
				$(this).prop("disabled", false);
			};
		});
		
		return this;
	},
	/**
	 * Form Element enable
	 * @param {String} id			- Form Element ID
	 * @param {Object} values		- disable 시킬 Radio의 배열값
	 * @param {Boolean} isOnly		- 해당값만 disable 여부
	 * @return {Object}				- Form Object
	 */
	this.enableRadio = function(id, values, isOnly) {
		var el = $("[name='"+id+"']", this.form);
		if (!el || el.length == 0) el = $("#"+id, this.form);
		if (!el || el.length == 0) return;
		
		if (!values) { el.prop("disabled", false); return; }
		
		if (!$.isArray(values)) values = [values];
		
		el.each(function() {
			if (values.indexOf($(this).val()) > -1) {
				$(this).prop("disabled", false);
			} else if (!isOnly){
				$(this).prop("disabled", true);
			};
		});
		return this;
	},
	this.readonlyElements = function(idArr, isReadonly, values, enableStyle) {
		for (var i in idArr) {
			this.readonlyElement(idArr[i], isReadonly, values, enableStyle);
		}
	},
	this.readonlyElement = function(id, isReadonly, values, enableStyle) {
		var elObj = $("[name='"+id+"']", this.form);
		if (!elObj || elObj.length == 0) elObj = $("[id='"+id+"']", this.form);
		if (!elObj || elObj.length == 0) return;
		
		this._readonly(elObj, isReadonly, values, enableStyle);
	},
	this._readonly = function(elObj, isReadonly, values, enableStyle) {
		var type = elObj.prop("type");
		
		if (!values) values = [];
		else if (!$.isArray(values)) values = [values];
		
		var isContains = true;
		
		elObj.each(function() {
			var el = $(this);
			
			if (typeof Filters !== "undefined") {
				Filters._resetStyle(Filters._findElement(el.prop("uuid")));
			}
			
			if (values.length == 0 || values.indexOf(el.val()) > -1) isContains = isReadonly;
			else isContains = !isReadonly;
			
			if (isContains) {
				el.prop("readonly", true);
				if (enableStyle) el.addClass("nondisable");
				el.on("click", function(e) { e.preventDefault(); el.blur();});
			} else {
				if (enableStyle) el.removeClass("nondisable");
				el.removeProp("readonly");
				el.off("click");
			}
			
			if (!type || type === "text" || type === "password" || type === 'textarea') {
				if (enableStyle) {
					if (isContains) el.addClass("nondisable");
					else el.removeClass("nondisable");
				}
			} else if (type === "radio") {
				if (enableStyle) {
					if (isContains) {
						if (el.prop("checked")) el.next(".jqformRadio").addClass("readonly");
						//if (el.next().next('label').css('color','#cccccc');
					} else {
						el.next(".jqformRadio").removeClass("readonly");
						//el.next().next('label').css('color','');
					}
				}
			} else if (type === "checkbox") {
				if (enableStyle) {
					if (isContains) {
						if (el.prop("checked")) el.next(".jqformCheckbox").addClass("readonly");
						//el.next().next('label').css('color','#cccccc');
					} else {
						el.next(".jqformCheckbox").removeClass("readonly");
						//el.next().next('label').css('color','');
					}
				}
			} else if (type.indexOf("select") == 0){
				if (isContains) {
					if (enableStyle) el.parent().addClass("nondisable");
					//$("option", el).not(":selected").prop("disabled", true);
					$("option", el).not(":selected").hide();
				} else {
					if (enableStyle) el.parent().removeClass("nondisable");
					//$("option", el).not(":selected").removeProp("disabled");
					$("option", el).not(":selected").show();
				}
			} else if (type === "file") {
				if (enableStyle) {
					if (isContains) {
						if (el.is(":hidden")) {
							$("input[name=dispFileName]", el.closest("td")).addClass("nondisable");
							$("button", el.closest("td")).addClass("nondisable");
							$(".photo>.image", el.closest("td")).css("background", "#F2F2F2");
						} else {
							el.addClass("nondisable");
						}
					} else {
						if (el.is(":hidden")) {
							$("input[name=dispFileName]", el.closest("td")).removeClass("nondisable");
							$("button", el.closest("td")).removeClass("nondisable");
							$(".photo>.image", el.closest("td")).css("background", "#FFFFFF");
						} else {
							el.removeClass("nondisable");
						}
					}
				}
			}
		});
	},
	/**
	 * 목록 페이지 번호 반환
	 * @param {Object} data		- 페이지번호가 포함된 data 객체
	 * @param {String} name		- 페이지번호를 가지고 있는 Key
	 * @return {Number}			- 페이지 번호
	 */
	this.getPageNo = function(data, name) {
    	var pageNo = 1;
    	if (!name) name = "pageNo";
    	
    	if (data && data.hasOwnProperty(name)) pageNo = data[name];
    	else pageNo = this.getElement(name);
    	
		return pageNo?pageNo:1;
    };
    /**
     * @param {Object} data		- 페이지 크기가 포함된 data 객체
	 * @param {String} name		- 페이지 크기를 가지고 있는 Key
	 * @return {Number}			- 페이지 크기
	 */
    this.getPageSize = function(data, name) {
    	var pageSize = 10;
    	if (!name) name = "pageSize";
    	
    	if (data && data.hasOwnProperty(name)) pageSize = data[name];
    	else pageSize = this.getElement(name);
    	
		return pageSize?pageSize:10;
    };
    /**
     * pageSize값이 현재 폼에 없는 경우, 현재 페이지의 pageSize값을 폼데이터에 설정한다.
     */
    this._setPageSize = function() {
    	if ($("#pageSize").length > 0) {
    		if (this.form.find("select[name='pageSize']").length == 0) {
    			var el = $("#pageSize").clone();
    			el.removeAttr("id");
    			el.removeAttr("onchange");
    			el.off("change");
    			el.hide();
	    		el.appendTo(this.form);
	    	} else {
	    		this.form.find("select[name='pageSize']").val( $("#pageSize").val());
	    	}
    	}
    }
    /**
     * 폼 데이터 전송
     * @param {String} method	- 폼 데이터 전송 방식
     * @param {String} target	- 폼 데이터 전송 Target
     */
    this.submit = function(method, target) {
		if (this.isNewForm) this.form.appendTo('body');
		this.form.attr('action', this.action);
		this.form.attr('method', method?method:this.method);
		if (target) this.form.attr('target', target);
		this.form.submit();
	};
}
