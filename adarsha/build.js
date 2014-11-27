;(function(){
'use strict';

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    throwError()
    return
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  function throwError () {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.exts = [
    '',
    '.js',
    '.json',
    '/index.js',
    '/index.json'
 ];

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  for (var i = 0; i < 5; i++) {
    var fullPath = path + require.exts[i];
    if (require.modules.hasOwnProperty(fullPath)) return fullPath;
    if (require.aliases.hasOwnProperty(fullPath)) return require.aliases[fullPath];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {

  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' === path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }
  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throwError()
    return
  }
  require.aliases[to] = from;

  function throwError () {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' === c) return path.slice(1);
    if ('.' === c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = segs.length;
    while (i--) {
      if (segs[i] === 'deps') {
        break;
      }
    }
    path = segs.slice(0, i + 2).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("ksanaforge-boot/index.js", function(exports, require, module){
var ksana={"platform":"remote"};

if (typeof process !="undefined") {
	if (process.versions["node-webkit"]) {
  		if (typeof nodeRequire!="undefined") ksana.require=nodeRequire;
  		ksana.platform="node-webkit";
			window.ksanagap=require("./ksanagap"); //compatible layer with mobile
			window.kfs=require("./kfs");
  	}
} else if (typeof chrome!="undefined"){//} && chrome.fileSystem){
	window.ksanagap=require("./ksanagap"); //compatible layer with mobile
	window.ksanagap.platform="chrome";
	window.kfs=require("./kfs_html5");
	ksana.platform="chrome";
} else {
	if (typeof ksanagap!="undefined" ) {
		ksana.platform=ksanagap.platform;
		if (typeof ksanagap.android !="undefined") {
			ksana.platform="android";
		}
	}
}

//if (typeof React=="undefined") window.React=require('../react');

//require("../cortex");
var Require=function(arg){return require("../"+arg)};
var boot=function(appId,main,maindiv) {
	main=main||"main";
	maindiv=maindiv||"main";
	ksana.appId=appId;
	ksana.mainComponent=React.render(Require(main)(),document.getElementById(maindiv));
}
window.ksana=ksana;
window.Require=Require;
module.exports=boot;
});
require.register("ksanaforge-boot/ksanagap.js", function(exports, require, module){
var switchApp=function(path) {
	var fs=nodeRequire("fs");
	path="../"+path;
	document.location.href= path+"/index.html"; 
	process.chdir(path);
}
var downloader={};
var rootPath="";
if (typeof process!="undefined") {
	downloader=require("./downloader");
	rootPath=process.cwd();
	rootPath=nodeRequire("path").resolve(rootPath,"..").replace(/\\/g,"/")+'/';
}
var deleteApp=function(app) {
	console.error("not allow on PC, do it in File Explorer/ Finder");
}
var username=function() {
	return "";
}
var useremail=function() {
	return ""
}
var runtime_version=function() {
	return "1.2";
}
var ksanagap={
	platform:"node-webkit",
	startDownload:downloader.startDownload,
	downloadedByte:downloader.downloadedByte,
	downloadingFile:downloader.downloadingFile,
	cancelDownload:downloader.cancelDownload,
	doneDownload:downloader.doneDownload,
	switchApp:switchApp,
	rootPath:rootPath,
	deleteApp: deleteApp,
	username:username, //not support on PC
	useremail:username,
	runtime_version:runtime_version
}


module.exports=ksanagap;
});
require.register("ksanaforge-boot/downloader.js", function(exports, require, module){
if (typeof nodeRequire!="undefined"){
	var http   = nodeRequire("http");
	var fs     = nodeRequire("fs");
	var path   = nodeRequire("path");
	var mkdirp = require("./mkdirp");	
}
var userCancel=false;
var files=[];
var totalDownloadByte=0;
var targetPath="";
var tempPath="";
var nfile=0;
var baseurl="";
var result="";
var downloading=false;
var startDownload=function(dbid,_baseurl,_files) { //return download id
	files=_files.split("\uffff");
	if (downloading) return false; //only one session
	userCancel=false;
	totalDownloadByte=0;
	nextFile();
	downloading=true;
	baseurl=_baseurl;
	if (baseurl[baseurl.length-1]!='/')baseurl+='/';
	targetPath=ksanagap.rootPath+dbid+'/';
	tempPath=ksanagap.rootPath+".tmp/";
	result="";
	return true;
}

var nextFile=function() {
	setTimeout(function(){
		if (nfile==files.length) {
			nfile++;
			endDownload();
		} else {
			downloadFile(nfile++);	
		}
	},100);
}

var downloadFile=function(nfile) {
	var url=baseurl+files[nfile];
	var tmpfilename=tempPath+files[nfile];

	mkdirp.sync(path.dirname(tmpfilename));
	var writeStream = fs.createWriteStream(tmpfilename);
	var datalength=0;
	var request = http.get(url, function(response) {
		response.on('data',function(chunk){
			writeStream.write(chunk);
			totalDownloadByte+=chunk.length;
			if (userCancel) {
				writeStream.end();
				setTimeout(function(){nextFile();},100);
			}
		});
		response.on("end",function() {
			writeStream.end();
			setTimeout(function(){nextFile();},100);
		});
	});
}

var cancelDownload=function() {
	userCancel=true;
	endDownload();
}
var verify=function() {
	return true;
}
var endDownload=function() {
	nfile=files.length+1;//stop
	result="cancelled";
	downloading=false;
	if (userCancel) return;

	for (var i=0;i<files.length;i++) {
		var targetfilename=targetPath+files[i];
		var tmpfilename   =tempPath+files[i];
		mkdirp.sync(path.dirname(targetfilename));
		fs.renameSync(tmpfilename,targetfilename);
	}
	if (verify()) {
		result="success";
	} else {
		result="error";
	}
}

var downloadedByte=function() {
	return totalDownloadByte;
}
var doneDownload=function() {
	if (nfile>files.length) return result;
	else return "";
}
var downloadingFile=function() {
	return nfile-1;
}

var downloader={startDownload:startDownload, downloadedByte:downloadedByte,
	downloadingFile:downloadingFile, cancelDownload:cancelDownload,doneDownload:doneDownload};
module.exports=downloader;
});
require.register("ksanaforge-boot/kfs.js", function(exports, require, module){
//Simulate feature in ksanagap
/* 
  runs on node-webkit only
*/

var readDir=function(path) { //simulate Ksanagap function
	var fs=nodeRequire("fs");
	path=path||"..";
	var dirs=[];
	if (path[0]==".") {
		if (path==".") dirs=fs.readdirSync(".");
		else {
			dirs=fs.readdirSync("..");
		}
	} else {
		dirs=fs.readdirSync(path);
	}

	return dirs.join("\uffff");
}
var listApps=function() {
	var fs=nodeRequire("fs");
	var ksanajsfile=function(d) {return "../"+d+"/ksana.js"};
	var dirs=fs.readdirSync("..").filter(function(d){
				return fs.statSync("../"+d).isDirectory() && d[0]!="."
				   && fs.existsSync(ksanajsfile(d));
	});
	
	var out=dirs.map(function(d){
		var content=fs.readFileSync(ksanajsfile(d),"utf8");
  	content=content.replace("})","}");
  	content=content.replace("jsonp_handler(","");
		var obj= JSON.parse(content);
		obj.dbid=d;
		obj.path=d;
		return obj;
	})
	return JSON.stringify(out);
}



var kfs={readDir:readDir,listApps:listApps};

module.exports=kfs;
});
require.register("ksanaforge-boot/kfs_html5.js", function(exports, require, module){
var readDir=function(){
	return [];
}
var listApps=function(){
	return [];
}
module.exports={readDir:readDir,listApps:listApps};
});
require.register("ksanaforge-boot/mkdirp.js", function(exports, require, module){
function mkdirP (p, mode, f, made) {
     var path = nodeRequire('path');
     var fs = nodeRequire('fs');
	
    if (typeof mode === 'function' || mode === undefined) {
        f = mode;
        mode = 0x1FF & (~process.umask());
    }
    if (!made) made = null;

    var cb = f || function () {};
    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);

    fs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                mkdirP(path.dirname(p), mode, function (er, made) {
                    if (er) cb(er, made);
                    else mkdirP(p, mode, cb, made);
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                fs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er, made)
                    else cb(null, made);
                });
                break;
        }
    });
}

mkdirP.sync = function sync (p, mode, made) {
    var path = nodeRequire('path');
    var fs = nodeRequire('fs');
    if (mode === undefined) {
        mode = 0x1FF & (~process.umask());
    }
    if (!made) made = null;

    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);

    try {
        fs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = sync(path.dirname(p), mode, made);
                sync(p, mode, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = fs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};

module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

});
require.register("brighthas-bootstrap/dist/js/bootstrap.js", function(exports, require, module){
/*!
* Bootstrap v3.0.0 by @fat and @mdo
* Copyright 2013 Twitter, Inc.
* Licensed under http://www.apache.org/licenses/LICENSE-2.0
*
* Designed and built with all the love in the world by @mdo and @fat.
*/

// if (!jQuery) { throw new Error("Bootstrap requires jQuery") }

/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */
//if (typeof jQuery=="undefined") var jQuery =  require("jquery");

+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
        .prop('checked', !this.$element.hasClass('active'))
        .trigger('change')
      if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
    }

    this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#carousel
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#collapse
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#dropdowns
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    var $el = $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('dropdown')

      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#modals
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#popovers
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#scrollspy
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tabs
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#affix
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(jQuery);
});
require.register("ksana-document/index.js", function(exports, require, module){
﻿var API={document:require('./document')
	,xml:require('./xml')
	,api:require('./api')
	,tokenizers:require('./tokenizers')
	,typeset:require('./typeset')
	,crypto:require('./sha1')
	,customfunc:require('./customfunc')
	,configs:require('./configs')
	,languages:require('./languages')
	,kde:require("./kde") //database engine
	,kse:require('./kse') // search engine
	,kdb:require("./kdb")
	,html5fs:require("./html5fs")
	,plist:require("./plist")
	,bsearch:require("./bsearch")
	,persistentmarkup:require("./persistentmarkup_pouchdb")
	,underlines:require("./underlines")
}
if (typeof process!="undefined") {
	if (typeof process.versions!="undefined" 
		  && typeof process.versions["node-webkit"]=="undefined") {
		API.persistent=require('./persistent');
		API.indexer_kd=require('./indexer_kd');
		API.indexer=require('./indexer');
		API.projects=require('./projects');
		//API.kdb=require('./kdb');  // file format
		API.kdbw=require('./kdbw');  // create ydb
		API.xml4kdb=require('./xml4kdb');  
		API.build=require("./buildfromxml");
		API.tei=require("./tei");
		API.regex=require("./regex");
		API.setPath=function(path) {
			console.log("API set path ",path)
			API.kde.setPath(path);
		}		
	}
}
module.exports=API;
});
require.register("ksana-document/document.js", function(exports, require, module){
/*
  Multiversion text with external durable markups
  define a "fail to migrate markup" by setting length to -1
*/
(function(){"use strict";})();
var createMarkup=function(textlen,start,len,payload) {
	if (textlen==-1) textlen=1024*1024*1024; //max string size 1GB
	//the only function create a new markup instance, be friendly to V8 Hidden Class

	if (len<0) len=textlen;
	if (start<0) start=0;
	if (start>textlen) start=textlen;
	if (start+len>textlen) {
		len-=start+len-textlen;
		if (len<0) len=0;
	}

	return {start:start,len:len,payload:payload};
};
var cloneMarkup=function(m) {
	if (typeof m=='undefined') return null;
	return createMarkup(-1,m.start,m.len,JSON.parse(JSON.stringify(m.payload)));
};
/*
TODO , handle migration of fission page
*/
var migrateMarkup=function(markup, rev) {
	var end=markup.start+markup.len;
	var text=rev.payload.text||"";
	var newlen=(text.length-rev.len);
	var revend=rev.start+rev.len;
	var m=cloneMarkup(markup); //return a new copy

	if (end<=rev.start) return m;
	else if (revend<=markup.start) {
		m.start+=newlen;
		return m;
	} else { //overlap
		//  markup    x    xx      xx    xyz      xyyyz        xyz  
		//  delete   ---   ---    ---     ---      ---        ---     
		//  dout     |     |      |		   x        xz          z            
		//  insert   +++   +++    +++     +++      +++        +++
		//  iout     +++x  +++xx  +++xx  x+++yz   x+++yyyz    +++ xyz
		if (rev.start>markup.start) {
			var adv=rev.start-markup.start;  //markup in advance of rev
			var remain=( markup.len -adv) + newlen ; // remaining character after 
			if (remain<0) remain=0;
			m.len = adv + remain ;
		} else {
			m.start=rev.start;
			var behind=markup.start-rev.start;
			m.len=markup.len - (rev.len-behind);
		}
		if (m.len<0) m.len=0;
		return m;
	}
};
var applyChanges=function(sourcetext ,revisions) {
	revisions.sort(function(r1,r2){return r2.start-r1.start;});
	var text2=sourcetext;
	revisions.map(function(r){
		text2=text2.substring(0,r.start)+r.payload.text+text2.substring(r.start+r.len);
	});
	return text2;
};
var addMarkup=function(start,len,payload) {
	this.__markups__().push(createMarkup(this.inscription.length,start, len, payload ));
	this.doc.markDirty();
};
var addRevision=function(start,len,str) {
	var valid=this.__revisions__().every(function(r) {
		return (r.start+r.len<=start || r.start>=start+len);
	});
	var newrevision=createMarkup(this.inscription.length,start,len,{text:str});
	if (valid) this.__revisions__().push(newrevision);
	this.doc.markDirty();
	return valid;
};

var diff2revision=function(diff) {
	var out=[],offset=0,i=0;
	while (i<diff.length) {
		var d=diff[i];
		if (0==d[0]) {
			offset+=d[1].length;
		} else  if (d[0]<0) { //delete
			if (i<diff.length-1 && diff[i+1][0]==1) { //combine to modify
				out.push({start:offset,len:d[1].length,payload:{text:diff[i+1][1]}});
				i++;
			} else {
				out.push({start:offset,len:d[1].length,payload:{text:""}});
			}
			offset+=d[1].length;
		} else { //insert
			out.push({start:offset,len:0,payload:{text:d[1]}});
			//offset-=d[1].length;
		}
		i++;
	}
	return out;
}


var addRevisionsFromDiff=function(diff,opts) { //Google Diff format
	var revisions=diff2revision(diff);
	this.addRevisions(revisions,opts);
	return revisions.length;
}

var addMarkups=function(newmarkups,opts) {
	if (!newmarkups) return;
	if (!newmarkups.length) return;
	if (opts &&opts.clear) this.clearMarkups();
	var maxlength=this.inscription.length;
	var markups=this.__markups__();
	for (var i=0;i<newmarkups.length;i++) {
		var m=newmarkups[i];
		var newmarkup=createMarkup(maxlength, m.start, m.len, m.payload);
		markups.push(newmarkup);
	}
};
var addRevisions=function(newrevisions,opts) {
	if (!(newrevisions instanceof Array)) return;
	if (!newrevisions.length) return;
	if (opts &&opts.clear) this.clearRevisions();
	var revisions=this.__revisions__();
	var maxlength=this.inscription.length;
	for (var i=0;i<newrevisions.length;i++) {
		var m=newrevisions[i];
		var newrevision=createMarkup(maxlength, m.start, m.len, m.payload );
		revisions.push(newrevision);	
	}
};
var downgradeMarkups=function(markups) {
	var downgraded=[];

	for (var i in markups) {
		var m=markups[i];
		for (var j=0;j<this.revert.length;j++) {
			m=migrateMarkup(m,this.revert[j]);
		}
		downgraded.push(m);
	}
	return downgraded;
};
var upgradeMarkups=function(markups,revs) {
	var migratedmarkups=[];
	markups.map(function(m){
		var s=m.start, l=m.len, delta=0, deleted=false;
		revs.map(function(rev){
			if (rev.start<=s) { //this will affect the offset
				delta+= (rev.payload.text.length-rev.len);
			}
			if (rev.start<=s && rev.start+rev.len>=s+l) {
				deleted=true;
			}
		});
		var m2=cloneMarkup(m);
		m2.start+=delta;
		if (deleted) m2.len=0;
		migratedmarkups.push(m2);
	});
	return migratedmarkups;
};
var upgradeMarkupsTo=function(M,targetPage) {
	var pg=targetPage, lineage=[], doc=this.doc;
	while (true) {
			var pid=pg.parentId;
			if (!pid) break; // root	
			if (pid==pg.id)break;
			lineage.unshift(pg);
			pg=doc.getPage(pid);
	}
	lineage.map(function(pg){
		var parentPage=doc.getPage(pg.parentId);
		var rev=revertRevision(pg.revert,parentPage.inscription);
		M=parentPage.upgradeMarkups(M,rev);
	});
	return M;
};

var downgradeMarkupsTo=function(M,targetPage) {
	var pg=this,doc=this.doc;
	var ancestorId=targetPage.id;
	while (true) {
			var pid=pg.parentId;
			if (!pid) break; // root	
			M=pg.downgradeMarkups(M);
			if (pid==ancestorId)break;
			pg=doc.getPage(pid);
	}
	return M;
};
var offsprings=function() {
	var out=[];
	var page=this;
	while (page.__mutant__().length) {
		var mu=page.__mutant__();
		page=mu[mu.length-1];
		out.push(page);
	}
	return out;
}
var version=function() {  //return version number of this page
	var v=0, page=this, doc=this.doc;
	while (page.parentId) {
		v++;
		page=doc.getPage(page.parentId);
	}
	return v;
}

var hasAncestor=function(ancestor) {
	var ancestorId=ancestor.id;
	var pg=this,doc=this.doc;
	
	while (true) {
		if (!pg.parentId) return false; // root	
		if (pg.parentId==ancestorId) return true;
		pg=doc.getPage(pg.parentId);
	}
	return false;
};
var getAncestors=function() {
	var pg=this,ancestor=[], doc=this.doc;
	while (true) {
			var pid=pg.parentId;
			if (!pid) break; // root	
			pg=doc.getPage(pid);
			ancestor.unshift(pg);
	}
	return ancestor;
};

var clear=function(M,start,len,author) { //return number of item removed
	var count=0;
	if (typeof start=='undefined') {
		count=M.length;
	  M.splice(0, M.length);
	  return count;
	}
	if (len<0) len=this.inscription.length;
	var end=start+len;
	for (var i=M.length-1;i>=0;--i) {
		if (M[i].start>=start && M[i].start+M[i].len<=end) {
			if (author && author!=M[i].payload.author) continue;
			M.splice(i,1);
			count++;
		}
	}
	this.doc.markDirty();
	return count;
};
var clearRevisions=function(start,len,author) {
	clear.apply(this,[this.__revisions__(),start,len,author]);
	this.doc.markDirty();
};
var clearMarkups=function(start,len,author) {
	clear.apply(this,[this.__markups__(),start,len,author]);
	this.doc.markDirty();
};
var getOrigin=function() {
	var pg=this;
	while (pg && pg.parentId) {
		pg=this.doc.getPage(pg.parentId);
	}
	return pg;
}
var isLeafPage=function() {
	return (this.__mutant__().length===0);
};
//convert revert and revision back and forth
var revertRevision=function(revs,parentinscription) {
	var revert=[], offset=0;
	revs.sort(function(m1,m2){return m1.start-m2.start;});
	revs.map(function(r){
		var newinscription="";
		var	m=cloneMarkup(r);
		var newtext=parentinscription.substr(r.start,r.len);
		m.start+=offset;
		var text=m.payload.text||"";
		m.len=text.length;
		m.payload.text=newtext;
		offset+=m.len-newtext.length;
		revert.push(m);
	});
	revert.sort(function(a,b){return b.start-a.start;});
	return revert;
};
var markupAt=function(pos,markups) {
	var markups=markups||this.__markups__();
	return markups.filter(function(m){
		var len=m.len;if (!m.len) len=1;
		return (pos>=m.start && pos<m.start+len);
	});
};
var revisionAt=function(pos) {
	return this.__revisions__().filter(function(m){
		return (pos>=m.start && pos<=m.start+m.len);
	});
};

var compressRevert=function(R) {
	var out=[];
	for (var i in R) {
		if (R[i].payload.text==="") {
			out.push([R[i].start,R[i].len]);
		} else out.push([R[i].start,R[i].len,R[i].payload.text]);
	}
	return out;
};
var decompressRevert=function(R) {
	var out=[];
	for (var i=0;i<R.length;i++) {
		if (R[i].length) { //array format
			out.push({start:R[i][0],len:R[i][1], payload:{text:R[i][2]||""}})
		} else {
			out.push({start:R[i].s,len:R[i].l, payload:{text:R[i].t||""}});	
		}
	}
	return out;
};

var toJSONString=function(opts) {
	var obj={};
	opts=opts||{};
	if (this.name) obj.n=this.name;
	if (opts.withtext) obj.t=this.inscription;
	if (this.parentId) obj.p=this.parentId;
	if (this.revert) obj.r=compressRevert(this.revert);
	var meta=this.__meta__();
	/*
	if (meta.daugtherStart) {
		obj.ds=meta.daugtherStart;
		obj.dc=meta.daugtherCount;
	}
	*/
	return JSON.stringify(obj);
};
var compressedRevert=function() {
	return compressRevert(this.revert);
}
var filterMarkup=function(cb) {
	return this.__markups__().filter(function(m){
		return cb(m);
	});
}
var findMarkup=function(query) { //same like jquery
	var name=query.name;
	var output=[];
	this.__markups__().map(function(M){
		if (M.payload.name==name) {
			output.push(M);
		}
	});
	return output;
};
/*
var fission=function(breakpoints,opts){
	var meta=this.__meta__();
	var movetags=function(newpage,start,end) {
		var M=this.__markups__();
		M.map(function(m){
			if (m.start>=start && m.start<end) {
				newpage.addMarkup(m.start-start,m.len, m.payload);
			}
		});
	};
	meta.daugtherStart=this.doc.version;
	meta.daugtherCount=breakpoints.length+1;
	// create page ,add transclude from
	var start=0, t="";
	for (var i=0;i<=breakpoints.length;i++) {
		var end=breakpoints[i]||this.inscription.length;
		t=this.inscription.substring(start,end);
		var transclude={id:this.id, start:start };//
		var newpage=this.doc.createPage({text:t, transclude:transclude});
		newpage.__setParentId__(this.id);
		movetags.apply(this,[newpage,start,end]);
		start=end;
	}

	//when convert to json, remove the inscription in origin text
	//and retrived from fission mutant
};
*/
var toggleMarkup=function(start,len,payload) {
	var M=this.__markups__();
	for (var i=0;i<M.length;i++){
		if (start===M[i].start && len==M[i].len && payload.type==M[i].payload.type) {
			M.splice(i, 1);
			return;
		} 
	}
	this.addMarkup(start,len,payload);
};

var mergeMarkup = function(markups,offsets,type) {
	markups=markups||this.__markups__();
	var M=require("./markup");
	M.addTokenOffset(markups,offsets);
	var res= M.merge(markups, type||"suggest");
	return M.applyTokenOffset(res,offsets);
}

var strikeout=function(start,length,user,type) {
	this.clearMarkups(start,length,user);
	var markups=this.__markups__();
	var M=require("./markup");
	type=type||"suggest";
	return M.strikeout(markups,start,length,user,type);
}

var preview=function(opts) { 
	//suggestion is from UI , with insert in payload
	var revisions=require("./markup").suggestion2revision(opts.suggestions);
	return this.doc.evolvePage(this,{preview:true,revisions:revisions,markups:[]});
}

/*
  change to prototype
*/
var newPage = function(opts) {
	var PG={};
	var inscription="";
	var hasInscription=false;
	var markups=[];
	var revisions=[];
	var mutant=[];

	opts=opts||{};
	opts.id=opts.id || 0; //root id==0
	var parentId=0 ,name="";
	if (typeof opts.parent==='object') {
		inscription=opts.parent.inscription;
		name=opts.parent.name;
		hasInscription=true;
		parentId=opts.parent.id;
	}
	var doc=opts.doc;
	var meta= {name:name,id:opts.id, parentId:parentId, revert:null };

	//these are the only 2 function changing inscription,use by Doc only
	var checkLength=function(ins) {
		if (ins.length>doc.maxInscriptionLength) {
			console.error("exceed size",ins.length, ins.substring(0,100));
			ins=ins.substring(0,doc.maxInscriptionLength);
		}
		return ins;
	};
	PG.__selfEvolve__  =function(revs,M) { 
		//TODO ;make sure inscription is loaded
		var newinscription=applyChanges(inscription, revs);
		var migratedmarkups=[];
		meta.revert=revertRevision(revs,inscription);
		inscription=checkLength(newinscription);
		hasInscription=true;
		markups=upgradeMarkups(M,revs);
	};
	Object.defineProperty(PG,'inscription',{
		get : function() {
			if (meta.id===0) return ""; //root page
			if (hasInscription) return inscription;
			/*
			if (meta.daugtherStart) {
				inscription="";
				for (var i=0;i<meta.daugtherCount;i++) {//combine from daugther
					var pg=this.doc.getPage(meta.daugtherStart+i);
					inscription+=pg.inscription;
				}
			} else {
			*/
				var mu=this.getMutant(0); //revert from Mutant
				if (mu) {
					inscription=checkLength(applyChanges(mu.inscription,mu.revert));					
				} else {
					inscription="";
				}
				
			//}
			hasInscription=true;
			return inscription;
	}});
	//protected functions

	PG.__markups__     = function() { return markups;} ; 
	PG.__revisions__   = function() { return revisions;} ;
	PG.hasRevision     = function() { return revisions.length>0;} ;
	Object.defineProperty(PG,'id',{value:meta.id});
	Object.defineProperty(PG,'doc',{value:doc});
	Object.defineProperty(PG,'parentId',{get:function() {return meta.parentId;}});
	PG.__setParentId__ = function(i) { meta.parentId=i;	};
	PG.getMarkup       = function(i){ return cloneMarkup(markups[i]);} ;//protect from modification
	Object.defineProperty(PG,'markupCount',{get:function(){return markups.length;}});

	Object.defineProperty(PG,'revert',{get:function(){return meta.revert;}});
	PG.__setRevert__   = function(r) { meta.revert=decompressRevert(r);};
	//PG.__setDaugther__ = function(s,c) { meta.daugtherStart=s;meta.daugtherCount=c;};
	PG.getRevision     = function(i) { return cloneMarkup(revisions[i]);};
	PG.getMutant       = function(i) { return mutant[i]; };
	PG.__mutant__      = function()  { return mutant;};
	PG.__setmutant__   = function(c)  { mutant=c;};
	Object.defineProperty(PG,'revisionCount',{get:function(){return revisions.length;}});
		
	PG.setName           = function(n){ meta.name=n; return this;};
	Object.defineProperty(PG,'name',{get:function(){return meta.name;}});
	PG.__meta__        = function() {return meta;};
	Object.defineProperty(PG,'version',{get:version});
	//Object.defineProperty(PG,'daugtherStart',{get:function(){return meta.daugtherStart;}});
	//Object.defineProperty(PG,'daugtherCount',{get:function(){return meta.daugtherCount;}});
	PG.clearRevisions    = clearRevisions;
	PG.clearMarkups      = clearMarkups;
	PG.addMarkup         = addMarkup;
	PG.toggleMarkup      = toggleMarkup;
	PG.addMarkups        = addMarkups;
	PG.addRevision       = addRevision;
	PG.addRevisions      = addRevisions;
	PG.addRevisionsFromDiff=addRevisionsFromDiff;
	PG.hasAncestor       = hasAncestor;
	PG.upgradeMarkups    = upgradeMarkups;
	PG.downgradeMarkups  = downgradeMarkups;
	PG.upgradeMarkupsTo  = upgradeMarkupsTo;
	PG.downgradeMarkupsTo=downgradeMarkupsTo;
	PG.getAncestors      = getAncestors;
	PG.isLeafPage        = isLeafPage;
	PG.markupAt          = markupAt;
	PG.revisionAt        = revisionAt;
//	PG.getmutant          = getmutant;
	PG.toJSONString      = toJSONString;
	PG.findMarkup				 = findMarkup;
	PG.filterMarkup			 = filterMarkup;
//	PG.fission           = fission;
	PG.mergeMarkup       = mergeMarkup;
	PG.strikeout         = strikeout;
	PG.preview           = preview;
	PG.getOrigin       = getOrigin;
	PG.revertRevision = revertRevision;
	PG.offsprings       = offsprings;
	PG.compressedRevert=compressedRevert;
	Object.freeze(PG);
	return PG;
};
var createDocument = function(docjson,markupjson) {
	var DOC={};
	var pages=[];
	var names={};
	var meta={doctype:"dg1.0",filename:""};
	var dirty=0;
	var tags={};
	var sep="_.id";


	var createFromJSON=function(json) {
			rootPage.clearRevisions();
			var t=json.text||json.t ,page;
			if (t) {
				rootPage.addRevision(0,0,json.text || json.t);
				page=evolvePage(rootPage);				
			} else {
				page=createPage();
			}
			var name=json.n||json.name||"";
			if (!names[name]) {
				names[name]=pages.length-1;
			} else if (!json.p) {
				console.warn("repeat name "+name);
			}
			page.setName(name);
			if (json.p) page.__setParentId__(json.p);
			if (json.r) page.__setRevert__(json.r);
			/*
			if (json.ds) {
				page.__setDaugther__(json.ds,json.dc);
			}
			*/
			page.addMarkups(json.markups,true);
			page.addRevisions(json.revisions,true);
			return page;
	};
	var endCreatePages=function(opts) {
		//build mutant array
		if (opts&&opts.clear) pages.map(function(P){
			var mu=P.__mutant__();
			mu=[];
		});
		pages.map(function(P,idx,pages){
			if (P.parentId) pages[P.parentId].__mutant__().push(P);
		});		
	}
	var addMarkups=function(markups) {
		if (markups) for (var i=0;i<markups.length;i++){
			var m=markups[i];
			var pageid=m.i;
			pages[pageid].addMarkup(m.start,m.len,m.payload);
		}		
	}
	var createPages=function(json,markups) {
		var count=0,i;
		for (i=0;i<json.length;i++) {
			if (i==0 && !json[i].t) continue; //might be header
			createPage(json[i]);
		}

		endCreatePages({clear:true});
		addMarkups(markups);
		return this;
	};
	var createPage=function(input) {
		var id=pages.length,page;
		if (typeof input=='undefined' || typeof input.getMarkup=='function') {
			//root page
			var parent=input||0;
			page=newPage({id:id,parent:parent,doc:DOC});
			pages.push(page) ;
		} else if (typeof input=='string') { 
			page=createFromJSON({text:input});
		} else {
			page=createFromJSON(input);
		}
		return page;
	};
	var evolvePage=function(pg,opts) {//apply revisions and upgrate markup
		var nextgen;
		opts=opts||{};
		if (opts.preview) { 
			nextgen=newPage({parent:pg,doc:DOC,id:-1});  //id cannot null
		} else {
			nextgen=createPage(pg);	
		}
		if (pg.id) pg.__mutant__().push(nextgen);
		var revisions=opts.revisions||pg.__revisions__();
		var markups=opts.markups||pg.__markups__();
		nextgen.__selfEvolve__( revisions ,markups );

		return nextgen;
	};

	var findMRCA=function(pg1,pg2) {
		var ancestors1=pg1.getAncestors();
		var ancestors2=pg2.getAncestors();
		var common=0; //rootPage id
		while (ancestors1.length && ancestors2.length &&
		   ancestors1[0].id==ancestors2[0].id) {
			common=ancestors1[0];
			ancestors1.shift();ancestors2.shift();
		}
		return common;
	};

	var migrate=function(from,to) { //migrate markups of A to B
		if (typeof from=='number') from=this.getPage(from);
		var M=from.__markups__();
		var out=null;
		if (typeof to=='undefined') {
			out=from.downgradeMarkups(M);
		} else {
			if (typeof to=='number') to=this.getPage(to);
			if (from.id===to.id) {
				return M;
			} else if (to.hasAncestor(from)) {
				out=from.upgradeMarkupsTo(M,to);
			} else if (from.hasAncestor(to)){
				out=from.downgradeMarkupsTo(M,to);
			} else {
				var ancestor=findMRCA(from,to);
				out=from.downgradeMarkupsTo(M,ancestor);
				out=ancestor.upgradeMarkupsTo(out,to);
			}
		}
		return out;
	};
	var findPage=function(name) {
		for (var i=0;i<this.pageCount;i++) {
			if (name===pages[i].name) return pages[i];
		}
		return null;
	};
	var getLeafPages=function() {
		var arr=[],i=0;
		for (i=0;i<this.pageCount;i++) {arr[i]=true;}
		for (i=0;i<this.pageCount;i++) {
			var pid=pages[i].parentId;
			arr[pid]=false;
		}
		var leafpages=[];
		arr.map(function(p,i){ if (p) leafpages.push(i); });
		return {leafPages:leafpages, isLeafPages:arr};
	};
	/*
		convert revert to a string.
		starting with ascii 1
	*/
	var toJSONString=function() {
		var out=["["+JSON.stringify(meta)], s=",";
		var isLeafPages=this.getLeafPages().isLeafPages;
		for (var i=0;i<pages.length;i++) {
			if (i===0) continue;
			s+=pages[i].toJSONString({"withtext":isLeafPages[i]});
			out.push(s);
			s=",";
		}
		out[out.length-1]+="]";
		//make line number save as version number
		return out.join('\n');
	};

	//get a page , if version is not specified, return lastest
	//version ==0 first version, version==1 second ..
	var pageByName=function(name,version) {
		var parr=names[name];
		if (!parr) {
			return null; //pagename not found
		}
		if (typeof version=="undefined") {
			version=-1; //lastest
		}
		var pg=pages[parr];
		if (version==0) return pg; //the first version
		while (pg.__mutant__().length) {
			var mu=pg.__mutant__();
			pg=mu[mu.length-1];
			version--; 
			if  (version==0) break;
		}
		return pg;
	};

	var map=function(context,callback) {
		var cb=callback,ctx=context;
		if (typeof context=="function") {
			cb=context;
			ctx=this;
		}
		for (var i=1;i<this.pageCount;i++) {
			var pg=pages[i];
			if (pg.parentId!=0)  continue; //not a root page, 
			while (pg.__mutant__().length) {
				var mu=pg.__mutant__();
				pg=mu[mu.length-1];
			}
			cb.apply(ctx,[pg,i-1]);
		}
	}
	var pageNames=function() {
		var out=[];
		for (var i=1;i<this.pageCount;i++) {
			var pg=pages[i];
			if (pg.parentId!=0)  continue; //not a root page, 
			out.push(pg.name);
		}
		return out;
	}

	var rootPage=createPage();

	DOC.getPage=function(id) {return pages[id];};
	DOC.markDirty=function() {dirty++;};
	DOC.markClean=function() {dirty=0;};
	DOC.setTags=function(T)  {tags=T;};
	DOC.setSep=function(s)  {sep=s;};
	/*
		external markups must be saved with version number.
	*/


	Object.defineProperty(DOC,'meta',{value:meta});
	Object.defineProperty(DOC,'maxInscriptionLength',{value:8192});
	Object.defineProperty(DOC,'version',{get:function(){return pages.length;}});
	Object.defineProperty(DOC,'pageCount',{get:function(){return pages.length;}});
	Object.defineProperty(DOC,'dirty',{get:function() {return dirty>0; }});
	Object.defineProperty(DOC,'ags',{get:function() {return tags;}});
	Object.defineProperty(DOC,'sep',{get:function() {return sep;}});

	
	DOC.createPage=createPage;
	DOC.createPages=createPages;
	DOC.addMarkups=addMarkups;
	DOC.evolvePage=evolvePage;
	DOC.findMRCA=findMRCA;
	DOC.migrate=migrate; 
	DOC.downgrade=migrate; //downgrade to parent
	DOC.migrateMarkup=migrateMarkup; //for testing
	DOC.getLeafPages=getLeafPages;
	DOC.findPage=findPage;
	DOC.pageByName=pageByName;
	DOC.toJSONString=toJSONString;

	DOC.map=map;
	DOC.pageNames=pageNames;
	DOC.endCreatePages=endCreatePages;

	if (docjson) DOC.createPages(docjson,markupjson);
	dirty=0;
	
	Object.freeze(DOC);
	return DOC;
};
/*
	TODO move user markups to tags
*/
/*
var splitInscriptions=function(doc,starts) {
	var combined="",j=0;
	var inscriptions=[],oldunitoffsets=[0];
	for (var i=1;i<doc.pageCount;i++) {
		var page=doc.getPage(i);
		var pageStart=doc.maxInscriptionLength*i;
 		combined+=page.inscription;
		oldunitoffsets.push(combined.length);
	}
	var last=0,newunitoffsets=[0];
	starts.map(function(S){
		var till=oldunitoffsets[ S[0] ]+ S[1];
		newunitoffsets.push(till);
		inscriptions.push( combined.substring(last,till));
		last=till;
	})
	inscriptions.push( combined.substring(last));
	newunitoffsets.push(combined.length);
	return {inscriptions:inscriptions,oldunitoffsets:oldunitoffsets , newunitoffsets:newunitoffsets};
}

var sortedIndex = function (array, tofind) {
  var low = 0, high = array.length;
  while (low < high) {
    var mid = (low + high) >> 1;
    array[mid] < tofind ? low = mid + 1 : high = mid;
  }
  return low;
};

var addOldUnit=function() {
// convert old unit into tags 
}

var reunitTags=function(tags,R,newtagname) {
	var out=[];
	tags.map(function(T){
		if (T.name===newtagname) return;
		var tag=JSON.parse(JSON.stringify(T));
		var pos=R.oldunitoffsets[T.sunit]+T.soff;
		var p=sortedIndex(R.newunitoffsets,pos+1)-1;
		if (p==-1) p=0;
		tag.sunit=p;tag.soff=pos-R.newunitoffsets[p];

		eunit=T.eunit||T.sunit;eoff=T.eoff||T.soff;
		if (eunit!=T.sunit || eoff!=T.soff) {
			pos=R.oldunitoffsets[eunit]+eoff;
			p=sortedIndex(R.newunitoffsets,pos)-1;
			if (p==-1) p=0;
			if (eunit!=T.sunit) tag.eunit=p;
			if (eoff!=T.soff)   tag.eoff=pos-R.newunitoffsets[p];
		}
		out.push(tag);
	});
	return out;
}
var reunit=function(doc,tagname,opts) {
	var unitstarts=[];
	doc.tags.map(function(T){
		if (T.name===tagname)	unitstarts.push([T.sunit,T.soff]);
	});

	var R=splitInscriptions(doc,unitstarts);
	var newdoc=createDocument();
	R.inscriptions.map(function(text){newdoc.createPage(text)});

	newdoc.tags=reunitTags(doc.tags,R,tagname);
	return newdoc;
}
*/
// reunit is too complicated, change to fission
// a big chunk of text divide into smaller unit
//
module.exports={ createDocument: createDocument};
});
require.register("ksana-document/api.js", function(exports, require, module){
if (typeof nodeRequire=='undefined') var nodeRequire=(typeof ksana=="undefined")?require:ksana.require;
var appPath=""; //for servermode
var getProjectPath=function(p) {
  var path=nodeRequire('path');
  return path.resolve(p.filename);
};


var enumProject=function() { 
  return nodeRequire("ksana-document").projects.names();
};
var enumKdb=function(paths) {
  if (typeof paths=="string") {
    paths=[paths];
  }
  if (appPath) {
	  for (var i in paths) {
	  	  paths[i]=require('path').resolve(appPath,paths[i]);
	  }
  }
  var db=nodeRequire("ksana-document").projects.getFiles(paths,function(p){
    return p.substring(p.length-4)==".kdb";
  });
  return db.map(function(d){
    return d.shortname.substring(0,d.shortname.length-4)
  });
}
var loadDocumentJSON=function(opts) {
  var persistent=nodeRequire('ksana-document').persistent;
  var ppath=getProjectPath(opts.project);
  var path=nodeRequire('path');
  //if empty file, create a empty
  var docjson=persistent.loadLocal(  path.resolve(ppath,opts.file));
  return docjson;
};
var findProjectPath=function(dbid) {
  var fs=nodeRequire("fs");
  var path=nodeRequire('path');
  var tries=[ //TODO , allow any depth
               "./ksana_databases/"+dbid
               ,"../ksana_databases/"+dbid
               ,"../../ksana_databases/"+dbid
               ,"../../../ksana_databases/"+dbid
               ];
    for (var i=0;i<tries.length;i++){
      if (fs.existsSync(tries[i])) {
        return path.resolve(tries[i]);
      }
    }
    return null;
}
var saveMarkup=function(opts) {
  var path=nodeRequire('path');
  var persistent=nodeRequire('ksana-document').persistent;
  var filename=opts.filename;
  if (opts.dbid) {
    var projectpath=findProjectPath(opts.dbid);
    if (projectpath) filename=path.resolve(projectpath,filename);
  } 
  return persistent.saveMarkup(opts.markups, filename,opts.pageid||opts.i);
};
var saveDocument=function(opts) {
  var persistent=nodeRequire('ksana-document').persistent;
  return persistent.saveDocument(opts.doc , opts.filename);
};
var getUserSettings=function(user) {
  var fs=nodeRequire('fs');
  var defsettingfilename='./settings.json';
  if (typeof user=="undefined") {
    if (fs.existsSync(defsettingfilename)) {
      return JSON.parse(fs.readFileSync(defsettingfilename,'utf8'));  
    }
  }
  return {};
}
var buildIndex=function(projname) {
  nodeRequire('ksana-document').indexer_kd.start(projname);
}
var buildStatus=function(session) {
  return nodeRequire("ksana-document").indexer_kd.status(session);
}
var stopIndex=function(session) {
  return nodeRequire("ksana-document").indexer_kd.stop(session);
} 
var getProjectFolders=function(p) {
  return nodeRequire("ksana-document").projects.folders(p.filename);
}
var getProjectFiles=function(p) {
  return nodeRequire("ksana-document").projects.files(p.filename);
}

var search=function(opts,cb) {
  var Kde=nodeRequire("ksana-document").kde;
  Kde.createLocalEngine(opts.dbid,function(engine){
    nodeRequire("./kse").search(engine,opts.q,opts,cb);
  });
};
search.async=true;
var get=function(opts,cb) {
  require("./kde").openLocal(opts.db,function(engine){
      if (!engine) {
        throw "database not found "+opts.db;
      }
      engine.get(opts.key,opts.recursive,function(data){cb(0,data)});
  });
}
var setPath=function(path) {
  appPath=path;
  nodeRequire("ksana-document").setPath(path);
}
get.async=true;

var markup=require('./markup.js');
var users=require('./users');
var installservice=function(services) {
	var API={ 
        enumProject:enumProject
        ,enumKdb:enumKdb
        ,getProjectFolders:getProjectFolders
        ,getProjectFiles:getProjectFiles
        ,loadDocumentJSON:loadDocumentJSON
        ,saveMarkup:saveMarkup
        ,saveDocument:saveDocument
        ,login:users.login
        ,getUserSettings:getUserSettings
        ,buildIndex:buildIndex
        ,buildStatus:buildStatus
        ,stopIndex:stopIndex
        ,search:search
        ,get:get
        ,setPath:setPath
	  ,version: function() { return require('./package.json').version; }
	};
	if (services) {
		services.document=API;
	}
	return API;
};

module.exports=installservice;
});
require.register("ksana-document/xml.js", function(exports, require, module){
var D=require('./document');
var template_accelon=require('./template_accelon');
var formatJSON = function(json,meta) {
		var out=["["],s="";
		if (meta) {
			out[0]+=JSON.stringify(meta);
			s=",";
		}
		json.map(function(obj) {
			if (obj.toJSONString) s+=obj.toJSONString();
			else s+=JSON.stringify(obj);
			out.push(s);
			s=",";
		});
		out[out.length-1]+="]";
		return out.join('\n');
};
var importXML=function(lines,opts) {
	opts=opts||{};
	if (opts.template=='accelon') {
		return template_accelon(lines,opts);
	}
	return null;
};
var exportXML=function() {
	
};
module.exports={importXML:importXML,exportXML:exportXML,
	formatJSON:formatJSON};
});
require.register("ksana-document/template_accelon.js", function(exports, require, module){
var D=require('./document');
var unitsep=/<pb n="([^"]*?)"\/>/g  ;
/*
	inline tag
*/
var tags=[];
var tagstack=[];
var parseXMLTag=function(s) {
	var name="",i=0;
	if (s[0]=='/') {
		return {name:s.substring(1),type:'end'};
	}

	while (s[i] && (s.charCodeAt(i)>0x30)) {name+=s[i];i++;}

	var type="start";
	if (s[s.length-1]=='/') { type="emtpy"; }
	var attr={},count=0;
	s=s.substring(name.length+1);
	s.replace(/(.*?)="([^"]*?)"/g,function(m,m1,m2) {
		attr[m1]=m2;
		count++;
	});
	if (!count) attr=undefined;
	return {name:name,type:type,attr:attr};
};
var parseUnit=function(unitseq,unittext,doc) {
	// name,sunit, soff, eunit, eoff , attributes
	var totaltaglength=0;
	var parsed=unittext.replace(/<(.*?)>/g,function(m,m1,off){
		var tag=parseXMLTag(m1);
		tag.seq=unitseq;
		var offset=off-totaltaglength;
		totaltaglength+=m.length;
		if (tag.type=='end') {
			tag=tagstack.pop();
			if (tag.name!=m1.substring(1)) {
				throw 'unbalanced tag at unit  '+unittext;
			}
			if (tag.sunit!=unitseq) tag.eunit=unitseq;
			if (tag.soff!=offset) tag.eoff=offset;
		} else {
			tag.sunit=unitseq;tag.soff=offset;
			if (tag.type=='start') tagstack.push(tag);
			tags.push(tag);
		}
		return ""; //remove the tag from inscription
	});
	return {inscription:parsed, tags:tags};
};
var splitUnit=function(buf,sep) {
	var units=[], unit="", last=0 ,name="";
	buf.replace(sep,function(m,m1,offset){
		units.push([name,buf.substring(last,offset)]);
		name=m1;
		last=offset+m.length; 
	});
	units.push([name,buf.substring(last)]);
	return units;
};
var addMarkups=function(tags,page){
	tags.map(function(T){
		var start=T.soff;
		var len=0;
		if (T.eoff>T.soff) len=T.eoff-T.soff;
		var payload={name:T.name};
		if (T.attr) payload.attr=T.attr;
		page.addMarkup(start,len,payload);
	});
};
var importxml=function(buf,opts) {
	var doc=D.createDocument();
	if (opts.whole) {
		var name=opts.name||"";
		var out=parseUnit(0,buf,doc);
		if (opts.trim) out.inscription=out.inscription.trim();
		var page=doc.createPage({name:name,text:out.inscription});
		addMarkups(out.tags,page);
	} else {
		var units=splitUnit(buf,opts.sep || unitsep);
		units.map(function(U,i){
			var out=parseUnit(i,U[1],doc);
			if (opts.trim) out.inscription=out.inscription.trim();
			doc.createPage({text:out.inscription,name:U[0]});
		});		
	}

	if (tagstack.length) {
		throw 'tagstack not null'+JSON.stringify(tagstack);
	}
	doc.setTags(tags);
	return doc;
};
module.exports=importxml;
});
require.register("ksana-document/persistent.js", function(exports, require, module){
if (typeof nodeRequire=='undefined') var nodeRequire=(typeof ksana=="undefined")?require:ksana.require;

var maxFileSize=512*1024;//for github
var D=require("./document");
var fs=nodeRequire("fs"); 
/*
var open=function(fn,mfn) {
	var kd,kdm="";
	var kd=fs.readFileSync(fn,'utf8');
	if (!mfn) mfn=fn+"m";
	if (fs.existsSync(mfn)) {
		kdm=fs.readFileSync(mfn,'utf8');	
	}

	return {kd:kd,kdm:kdm}
}
*/
var loadLocal=function(fn,mfn) {
//if (!fs.existsSync(fn)) throw "persistent.js::open file not found ";
	if (fs.existsSync(fn)){
		var content=fs.readFileSync(fn,'utf8');
		var kd=null,kdm=null;
		try {
			kd=JSON.parse(content);
		} catch (e) {
			kd=[{"create":new Date()}];
		}		
	}
		
	if (!mfn) mfn=fn.substr(0,fn.lastIndexOf("."))+".kdm";
	if (fs.existsSync(mfn)) {
		kdm=JSON.parse(fs.readFileSync(mfn,'utf8'));	
	}
	return {kd:kd,kdm:kdm};
}
/* load json and create document */
var createLocal=function(fn,mfn) {
	var json=loadLocal(fn,mfn);
	var doc=D.createDocument(json.kd,json.kdm);
	doc.meta.filename=fn;
	return doc;
};
var serializeDocument=function(doc) {
	var out=[];
	for (var i=1;i<doc.pageCount;i++) {
		var P=doc.getPage(i);
		var obj={n:P.name, t:P.inscription};
		if (P.parentId) obj.p=P.parentId;
		out.push(JSON.stringify(obj));
	}
	return 	"[\n"+out.join("\n,")+"\n]";
};
var serializeXMLTag=function(doc) {
	if (!doc.tags)return;
	var out=[];
	for (var i=0;i<doc.tags.length;i++) {
		out.push(JSON.stringify(doc.tags[i]));
	}
	return 	"[\n"+out.join("\n,")+"\n]";
};
var serializeMarkup=function(doc) {
	var out=[];
	var sortfunc=function(a,b) {
		return a.start-b.start;
	};
	for (var i=0;i<doc.pageCount;i++) {
		var M=doc.getPage(i).__markups__();

		var markups=JSON.parse(JSON.stringify(M)).sort(sortfunc);

		for (var j=0;j<markups.length;j++) {
			var m=markups[j];
			m.i=i;
			out.push(JSON.stringify(m));
		}
	}
	return 	"[\n"+out.join("\n,")+"\n]";
};


var saveMarkup=function(markups,filename,pageid) { //same author
	if (!markups || !markups.length) return null;
	var author=markups[0].payload.author, others=[];
	var mfn=filename+'m';
	var json=loadLocal(filename,mfn);
	if (!json.kdm || !json.kdm.length) {
		others=[];
	} else {
		others=json.kdm.filter(function(m){return m.i!=pageid || m.payload.author != author});	
	}
	for (var i=0;i<markups.length;i++) {
		markups[i].i=pageid;
	}
	others=others.concat(markups);
	var sortfunc=function(a,b) {
		//each page less than 64K
		return (a.i*65536 +a.start) - (b.i*65536 +b.start);
	}
	others.sort(sortfunc);
	var out=[];
	for (var i=0;i<others.length;i++) {
		out.push(JSON.stringify(others[i]));
	}
	return fs.writeFile(mfn,"[\n"+out.join("\n,")+"\n]",'utf8',function(err){
		//		
	});
}
var saveMarkupLocal=function(doc,mfn) {
	if (!doc.meta.filename && !mfn) throw "missing filename";
	if (!doc.dirty) return;
	if (typeof mfn=="undefined") {
		mfn=doc.meta.filename+"m";
	}
	var out=serializeMarkup(doc);
	return fs.writeFile(mfn,out,'utf8',function(err){
		if (!err) doc.markClean();
	});
};

var saveDocument=function(doc,fn) {
	if (!fn) fn=doc.meta.filename;
	var out=serializeDocument(doc);
	if (out.length>maxFileSize) {
		console.error('file size too big ',out.length);
	}
	return fs.writeFileSync(fn,out,'utf8');
};

var saveDocumentTags=function(doc,fn) {
	if (!fn) fn=doc.meta.filename;
	var out=serializeXMLTag(doc);
	return fs.writeFileSync(fn,out,'utf8');
};

module.exports={
	loadLocal:loadLocal,
	createLocal:createLocal,
	saveDocument:saveDocument,
	saveDocumentTags:saveDocumentTags,
	saveMarkup:saveMarkup,
	serializeDocument:serializeDocument,
	serializeMarkup:serializeMarkup,
	serializeXMLTag:serializeXMLTag
};
});
require.register("ksana-document/tokenizers.js", function(exports, require, module){
var tibetan =function(s) {
	//continuous tsheg grouped into same token
	//shad and space grouped into same token
	var offset=0;
	var tokens=[],offsets=[];
	s=s.replace(/\r\n/g,'\n').replace(/\r/g,'\n');
	var arr=s.split('\n');

	for (var i=0;i<arr.length;i++) {
		var last=0;
		var str=arr[i];
		str.replace(/[།་ ]+/g,function(m,m1){
			tokens.push(str.substring(last,m1)+m);
			offsets.push(offset+last);
			last=m1+m.length;
		});
		if (last<str.length) {
			tokens.push(str.substring(last));
			offsets.push(last);
		}
		if (i===arr.length-1) break;
		tokens.push('\n');
		offsets.push(offset+last);
		offset+=str.length+1;
	}

	return {tokens:tokens,offsets:offsets};
};
var isSpace=function(c) {
	return (c==" ") || (c==",") || (c==".");
}
var isCJK =function(c) {return ((c>=0x3000 && c<=0x9FFF) 
|| (c>=0xD800 && c<0xDC00) || (c>=0xFF00) ) ;}
var simple1=function(s) {
	var offset=0;
	var tokens=[],offsets=[];
	s=s.replace(/\r\n/g,'\n').replace(/\r/g,'\n');
	arr=s.split('\n');

	var pushtoken=function(t,off) {
		var i=0;
		if (t.charCodeAt(0)>255) {
			while (i<t.length) {
				var c=t.charCodeAt(i);
				offsets.push(off+i);
				tokens.push(t[i]);
				if (c>=0xD800 && c<=0xDFFF) {
					tokens[tokens.length-1]+=t[i]; //extension B,C,D
				}
				i++;
			}
		} else {
			tokens.push(t);
			offsets.push(off);	
		}
	}
	for (var i=0;i<arr.length;i++) {
		var last=0,sp="";
		str=arr[i];
		str.replace(/[_0-9A-Za-z]+/g,function(m,m1){
			while (isSpace(sp=str[last]) && last<str.length) {
				tokens[tokens.length-1]+=sp;
				last++;
			}
			pushtoken(str.substring(last,m1)+m , offset+last);
			offsets.push(offset+last);
			last=m1+m.length;
		});

		if (last<str.length) {
			while (isSpace(sp=str[last]) && last<str.length) {
				tokens[tokens.length-1]+=sp;
				last++;
			}
			pushtoken(str.substring(last), offset+last);
			
		}		
		offsets.push(offset+last);
		offset+=str.length+1;
		if (i===arr.length-1) break;
		tokens.push('\n');
	}

	return {tokens:tokens,offsets:offsets};

};

var simple=function(s) {
	var token='';
	var tokens=[], offsets=[] ;
	var i=0; 
	var lastspace=false;
	var addtoken=function() {
		if (!token) return;
		tokens.push(token);
		offsets.push(i);
		token='';
	}
	while (i<s.length) {
		var c=s.charAt(i);
		var code=s.charCodeAt(i);
		if (isCJK(code)) {
			addtoken();
			token=c;
			if (code>=0xD800 && code<0xDC00) { //high sorragate
				token+=s.charAt(i+1);i++;
			}
			addtoken();
		} else {
			if (c=='&' || c=='<' || c=='?'
			|| c=='|' || c=='~' || c=='`' || c==';' 
			|| c=='>' || c==':' || c=='{' || c=='}'
			|| c=='=' || c=='@' || c=='[' || c==']' || c=='(' || c==')' || c=="-"
			|| code==0xf0b || code==0xf0d // tibetan space
			|| (code>=0x2000 && code<=0x206f)) {
				addtoken();
				if (c=='&' || c=='<') {
					var endchar='>';
					if (c=='&') endchar=';'
					while (i<s.length && s.charAt(i)!=endchar) {
						token+=s.charAt(i);
						i++;
					}
					token+=endchar;
					addtoken();
				} else {
					token=c;
					addtoken();
				}
				token='';
			} else {
				if (isSpace(c)) {
					token+=c;
					lastspace=true;
				} else {
					if (lastspace) addtoken();
					lastspace=false;
					token+=c;
				}
			}
		}
		i++;
	}
	addtoken();
	return {tokens:tokens,offsets:offsets};
}
module.exports={simple:simple,tibetan:tibetan};
});
require.register("ksana-document/markup.js", function(exports, require, module){
/*
	merge needs token offset, not char offset
*/
var splitDelete=function(m) {
	var out=[];
	for (i=0;i<m.l;i++) {
		var m2=JSON.parse(JSON.stringify(m));
		m2.s=m.s+i;
		m2.l=1;
		out.push(m2);
	}
	return out;
}
var quantize=function(markup) {
	var out=[],i=0,m=JSON.parse(JSON.stringify(markup));
	if (m.payload.insert) {
			m.s=m.s+m.l-1;
			m.l=1;
			out.push(m)
	} else {
		if (m.payload.text=="") { //delete
			out=splitDelete(m);
		} else { //replace
			if (m.l>1) {//split to delete and replace
				var m2=JSON.parse(JSON.stringify(m));
				m.payload.text="";
				m.l--;
				out=splitDelete(m);
				m2.s=m2.s+m2.l-1;
				m2.l=1;
				out.push(m2);
			} else {
				out.push(m);
			}
		}
	}
	return out;
}
var plural={
	"suggest":"suggests"
}
var combinable=function(p1,p2) {
	var t="";
	for (var i=0;i<p1.choices.length;i++) t+=p1.choices[i].text;
	for (var i=0;i<p2.choices.length;i++) t+=p2.choices[i].text;
	return (t==="");
}
var combine=function(markups) {
	var out=[],i=1,at=0;

	while (i<markups.length) {
		if (combinable(markups[at].payload,markups[i].payload)) {
			markups[at].l++;
		} else {
			out.push(markups[at]);
			at=i;
		}
		i++;
	}
	out.push(markups[at]);
	return out;
}
var merge=function(markups,type){
	var out=[],i=0;
	for (i=0;i<markups.length;i++) {
		if (markups[i].payload.type===type)	out=out.concat(quantize(markups[i]));
	}
	var type=plural[type];
	if (typeof type=="undefined") throw "cannot merge "+type;
	if (!out.length) return [];
	out.sort(function(a,b){return a.s-b.s;});
	var out2=[{s:out[0].s, l:1, payload:{type:type,choices:[out[0].payload]}}];
	for (i=1;i<out.length;i++) {
		if (out[i].s===out2[out2.length-1].s ) {
			out2[out2.length-1].payload.choices.push(out[i].payload);
		} else {
			out2.push({s:out[i].s,l:1,payload:{type:type,choices:[out[i].payload]}});
		}
	}
	return combine(out2);
}
var addTokenOffset=function(markups,offsets) {
	for (var i=0;i<markups.length;i++) {
		var m=markups[i],at,at2;
		at=offsets.indexOf(m.start); //need optimized
		if (m.len) at2=offsets.indexOf(m.start+m.len);
		if (at==-1 || at2==-1) {
			console.trace("markup position not at token boundary");
			break;
		}

		m.s=at;
		if (m.len) m.l=at2-at;
	}
	return markups;
}

var applyTokenOffset=function(markups,offsets) {
	for (var i=0;i<markups.length;i++) {
		var m=markups[i];
		m.start=offsets[m.s];
		m.len=offsets[m.s+m.l] - offsets[m.s];
		delete m.s;
		delete m.l;
	}
	return markups;
}

var suggestion2revision=function(markups) {
	var out=[];
	for (var i=0;i<markups.length;i++) {
		var m=markups[i];
		var payload=m.payload;
		if (payload.insert) {
			out.push({start:m.start+m.len,len:0,payload:payload});
		} else {
			out.push({start:m.start,len:m.len,payload:payload});
		}
	}
	return out;
}

var strikeout=function(markups,start,len,user,type) {
	var payload={type:type,author:user,text:""};
	markups.push({start:start,len:len,payload:payload});
}
module.exports={merge:merge,quantize:quantize,
	addTokenOffset:addTokenOffset,applyTokenOffset:applyTokenOffset,
	strikeout:strikeout, suggestion2revision : suggestion2revision
}
});
require.register("ksana-document/typeset.js", function(exports, require, module){
/*
		if (=="※") {
			arr[i]=React.DOM.br();
		}
*/

var classical=function(arr) {
	var i=0,inwh=false,inwarichu=false,start=0;
	var out=[];

	var newwarichu=function(now) {
		var warichu=arr.slice(start,now);
		var height=Math.round( (warichu.length)/2);
		var w1=warichu.slice(0,height);
		var w2=warichu.slice(height);

		var w=[React.DOM.span({className:"warichu-right"},w1),
		       React.DOM.span({className:"warichu-left"},w2)];
		out.push(React.DOM.span({"className":"warichu"},w));
		start=now;
	}

	var linebreak=function(now) {
		if (inwarichu) {
			newwarichu(now,true);
			start++;
		}
		out.push(React.DOM.br());
	}
	while (i<arr.length) {
		var ch=arr[i].props.ch;
		if (ch=='※') {
			linebreak(i);
		}	else if (ch=='【') { //for shuowen
			start=i+1;
			inwh=true;
		}	else if (ch=='】') {
			var wh=arr.slice(start,i);
			out.push(React.DOM.span({"className":"wh"},wh));
			inwh=false;
		} else if (ch=='﹝') {

			start=i+1;
			inwarichu=true;
		} else if (ch=='﹞') {
			if (!inwarichu) { //in previous page
				out=[];
				inwarichu=true;
				start=0; //reset
				i=0;
				continue;
			}
			newwarichu(i);
			inwarichu=false;
		} else{
			if (!inwh && !inwarichu && ch!='↩') out.push(arr[i]);
		}
		i++;
	}
	if (inwarichu) newwarichu(arr.length-1);

	return React.DOM.span({"className":"vertical"},out);
}
module.exports={classical:classical}
});
require.register("ksana-document/sha1.js", function(exports, require, module){
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(e,m){var p={},j=p.lib={},l=function(){},f=j.Base={extend:function(a){l.prototype=this;var c=new l;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
n=j.WordArray=f.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=m?c:4*a.length},toString:function(a){return(a||h).stringify(this)},concat:function(a){var c=this.words,q=a.words,d=this.sigBytes;a=a.sigBytes;this.clamp();if(d%4)for(var b=0;b<a;b++)c[d+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((d+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[d+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=e.ceil(c/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*e.random()|0);return new n.init(c,a)}}),b=p.enc={},h=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++){var f=c[d>>>2]>>>24-8*(d%4)&255;b.push((f>>>4).toString(16));b.push((f&15).toString(16))}return b.join("")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d+=2)b[d>>>3]|=parseInt(a.substr(d,
2),16)<<24-4*(d%8);return new n.init(b,c/2)}},g=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++)b.push(String.fromCharCode(c[d>>>2]>>>24-8*(d%4)&255));return b.join("")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d++)b[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return new n.init(b,c)}},r=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(g.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return g.parse(unescape(encodeURIComponent(a)))}},
k=j.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new n.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=r.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,d=c.sigBytes,f=this.blockSize,h=d/(4*f),h=a?e.ceil(h):e.max((h|0)-this._minBufferSize,0);a=h*f;d=e.min(4*a,d);if(a){for(var g=0;g<a;g+=f)this._doProcessBlock(b,g);g=b.splice(0,a);c.sigBytes-=d}return new n.init(g,d)},clone:function(){var a=f.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});j.Hasher=k.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){k.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,b){return(new a.init(b)).finalize(c)}},_createHmacHelper:function(a){return function(b,f){return(new s.HMAC.init(a,
f)).finalize(b)}}});var s=p.algo={};return p}(Math);
(function(){var e=CryptoJS,m=e.lib,p=m.WordArray,j=m.Hasher,l=[],m=e.algo.SHA1=j.extend({_doReset:function(){this._hash=new p.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(f,n){for(var b=this._hash.words,h=b[0],g=b[1],e=b[2],k=b[3],j=b[4],a=0;80>a;a++){if(16>a)l[a]=f[n+a]|0;else{var c=l[a-3]^l[a-8]^l[a-14]^l[a-16];l[a]=c<<1|c>>>31}c=(h<<5|h>>>27)+j+l[a];c=20>a?c+((g&e|~g&k)+1518500249):40>a?c+((g^e^k)+1859775393):60>a?c+((g&e|g&k|e&k)-1894007588):c+((g^e^
k)-899497514);j=k;k=e;e=g<<30|g>>>2;g=h;h=c}b[0]=b[0]+h|0;b[1]=b[1]+g|0;b[2]=b[2]+e|0;b[3]=b[3]+k|0;b[4]=b[4]+j|0},_doFinalize:function(){var f=this._data,e=f.words,b=8*this._nDataBytes,h=8*f.sigBytes;e[h>>>5]|=128<<24-h%32;e[(h+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(h+64>>>9<<4)+15]=b;f.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=j.clone.call(this);e._hash=this._hash.clone();return e}});e.SHA1=j._createHelper(m);e.HmacSHA1=j._createHmacHelper(m)})();
module.exports=CryptoJS;
});
require.register("ksana-document/users.js", function(exports, require, module){
if (typeof nodeRequire=='undefined') var nodeRequire=(typeof ksana=="undefined")?require:ksana.require;

var passwords=[];

var loadpasswd=function(){
	var defpasswdfilename='./passwd.json';
	var fs=nodeRequire('fs');
    if (fs.existsSync(defpasswdfilename)) {
    	passwords=JSON.parse(fs.readFileSync(defpasswdfilename,'utf8'));  
    }
}
var login=function(opts) {
	opts=opts||{};
	var password=opts.password||opts.pw;
	var out={name:opts.name,error:"user not found"};
	if (!passwords.length) loadpasswd();
	for (var i=0;i<passwords.length;i++) {
		var u=passwords[i];
		if (u.name==opts.name) {
			if (u.pw!=password) {
				out.error="wrong password";
			} else {
				out=JSON.parse(JSON.stringify(u));
				delete out.pw;
				out.error="";
				return out;
			}
		}
	}
	return out;
}
module.exports={login:login}
});
require.register("ksana-document/customfunc.js", function(exports, require, module){
/* 
  custom func for building and searching ydb

  keep all version
  
  getAPI(version); //return hash of functions , if ver is omit , return lastest
	
  postings2Tree      // if version is not supply, get lastest
  tokenize(text,api) // convert a string into tokens(depends on other api)
  normalizeToken     // stemming and etc
  isSpaceChar        // not a searchable token
  isSkipChar         // 0 vpos

  for client and server side
  
*/
var configs=require("./configs");
var config_simple="simple1";
var optimize=function(json,config) {
	config=config||config_simple;
	return json;
}

var getAPI=function(config) {
	config=config||config_simple;
	var func=configs[config].func;
	func.optimize=optimize;
	if (config=="simple1") {
		//add common custom function here
	} else if (config=="tibetan1") {

	} else throw "config "+config +"not supported";

	return func;
}

module.exports={getAPI:getAPI};
});
require.register("ksana-document/configs.js", function(exports, require, module){
var tokenizers=require('./tokenizers');

var normalize1=function(token) {
	return token.replace(/[ \.,]/g,'').trim();
}
var isSkip1=function(token) {
	var t=token.trim();
	return (t=="" || t=="　" || t=="※" || t=="\n");
}
var normalize_tibetan=function(token) {
	return token.replace(/[།་ ]/g,'').trim();
}

var isSkip_tibetan=function(token) {
	var t=token.trim();
	return (t=="" || t=="　" ||  t=="\n");	
}
var simple1={
	func:{
		tokenize:tokenizers.simple
		,normalize: normalize1
		,isSkip:	isSkip1
	}
	
}
var tibetan1={
	func:{
		tokenize:tokenizers.tibetan
		,normalize:normalize_tibetan
		,isSkip:isSkip_tibetan
	}
}
module.exports={"simple1":simple1,"tibetan1":tibetan1}
});
require.register("ksana-document/projects.js", function(exports, require, module){
/*
  given a project id, find all folders and files
  projects be should under ksana_databases, like node_modules
*/
if (typeof nodeRequire=='undefined')nodeRequire=require;
function getFiles(dirs,filtercb){	
  var fs=nodeRequire('fs');
  var path=nodeRequire('path');
  var out=[];
  var shortnames={}; //shortname must be unique
  if (typeof dirs=='string')dirs=[dirs];

  for (var j=0;j<dirs.length;j++ ) {
    var dir=dirs[j];
    if (!fs.existsSync(dir))continue;
    var files = fs.readdirSync(dir);
    for(var i in files){
      if (!files.hasOwnProperty(i)) continue;
      if (files[i][0]==".") continue;//skip hidden file
      var name = dir+'/'+files[i],config=null;
      if (filtercb(name)) {
          var json=name+'/ksana.json';
          if (fs.existsSync(json)) {          
            config=JSON.parse(fs.readFileSync(name+'/ksana.json','utf8'));
            var stat=fs.statSync(json);
            config.lastModified=stat.mtime;
            config.shortname=files[i];
            config.filename=name;
          } else {
            config={name:name,filename:name,shortname:files[i]};
          }
          var pathat=config.filename.lastIndexOf('/');
          config.withfoldername=config.filename.substring(1+config.filename.lastIndexOf('/',pathat-1));

          if (!shortnames[files[i]]) out.push(config);
          shortnames[files[i]]=true;
      }
    }
  }
  return out;
}

var listFolders=function(path) {
  var fs=nodeRequire('fs');
  var folders= getFiles( path ,function(name){
      return fs.statSync(name).isDirectory();
  });
  if (!folders.length)return folders;
  if (parseInt(folders[0].shortname)) {
    folders.sort(function(a,b) {
      return parseInt(a.shortname)-parseInt(b.shortname);
    });
  } else {
    folders.sort(function(a,b) {
      if (a.shortname==b.shortname) return 0; 
      else if (a.shortname>b.shortname) return 1; else return -1;
    });
  }
  return folders;
};
var listFiles=function(path) {
  var fs=nodeRequire('fs');
  var files= getFiles( path,function(name){
      return name.indexOf(".kd")===name.length-3;
  });
  if (!files.length)return files;
  if (parseInt(files[0].shortname)) {
    files.sort(function(a,b) {
      return parseInt(a.shortname)-parseInt(b.shortname);
    });
  } else {
    files.sort(function(a,b) {
      if (a.shortname==b.shortname) return 0; 
      else if (a.shortname>b.shortname) return 1; else return -1;
    });
  }
  return files;
};

var listProject=function() {
  var fs=nodeRequire('fs');
	//search for local 
	var folders= getFiles(['./ksana_databases','../ksana_databases','../../ksana_databases'],function(name){
      if (fs.statSync(name).isDirectory()){
        return fs.existsSync(name+'/ksana.json');
      }
  });

	return folders;
}

var fullInfo=function(projname) {
  var fs=nodeRequire('fs');
  if (fs.existsSync(projname+'/ksana.json')) {//user provide a folder
    var normalized=require('path').resolve(projname);
    normalized=normalized.substring(normalized.lastIndexOf(require('path').sep)+1);
    var projectpath=projname;
    var name=normalized;
  } else { //try id
    var proj=listProject().filter(function(f){ return f.shortname==projname});
    if (!proj.length) return null;
    var projectpath=proj[0].filename;
    var name=proj[0].shortname;
  }

  var files=[];  
  var ksana=JSON.parse(fs.readFileSync(projectpath+'/ksana.json','utf8'));    

  listFolders(projectpath).map(function(f){
    var ff=listFiles(f.filename);
    files=files.concat(ff);
  })
  return {name:name,filename:projectpath,ksana:ksana,files: files.map(function(f){return f.filename})};
}

module.exports={getFiles:getFiles,names:listProject,folders:listFolders,files:listFiles,fullInfo:fullInfo};
});
require.register("ksana-document/indexer.js", function(exports, require, module){
if (typeof nodeRequire=='undefined')nodeRequire=require;

var indexing=false; //only allow one indexing task
var status={pageCount:0,progress:0,done:false}; //progress ==1 completed
var session={};
var api=null;
var xml4kdb=null;
var isSkip=null;
var normalize=null;
var tokenize=null;

var putPosting=function(tk) {
	var	postingid=session.json.tokens[tk];
	var out=session.json, posting=null;
	if (!postingid) {
		out.postingCount++;
		posting=out.postings[out.postingCount]=[];
		session.json.tokens[tk]=out.postingCount;
	} else {
		posting=out.postings[postingid];
	}
	posting.push(session.vpos);
}
var putPage=function(inscription) {
	var tokenized=tokenize(inscription);
	var tokenOffset=0, tovpos=[];
	for (var i=0;i<tokenized.tokens.length;i++) {
		var t=tokenized.tokens[i];
		tovpos[tokenOffset]=session.vpos;
		tokenOffset+=t.length;
		if (isSkip(t)) {
			 session.vpos--;
		} else {
			var normalized=normalize(t);
			if (normalized) 	putPosting(normalized);
 		}
 		session.vpos++;
	}
	tovpos[tokenOffset]=session.vpos;
	session.indexedTextLength+= inscription.length;
	return tovpos;
}
var upgradeDocument=function(d,dnew) {
	var Diff=nodeRequire("./diff");	
	dnew.map(function(pg){
		var oldpage=d.pageByName(pg.name);
		var ninscription=dnew.inscription;
		if (oldpage) {
			var diff=new Diff();
			var oinscription=oldpage.inscription;
			var df=diff.diff_main(oinscription, pg.inscription);

			var revisioncount=oldpage.addRevisionsFromDiff(df);
			if (revisioncount) d.evolvePage(oldpage);
		} else {
			d.createPage({n:pgname,t:ninscription});
		}
	});	
}
var shortFilename=function(fn) {
	var arr=fn.split('/');
	while (arr.length>2) arr.shift();
	return arr.join('/');
}

var putFileInfo=function(fileContent) {
	var shortfn=shortFilename(status.filename);
	//session.json.files.push(fileInfo);
	//empty or first line empty
	session.json.fileContents.push(fileContent);
	session.json.fileNames.push(shortfn);
	session.json.fileOffsets.push(session.vpos);
	//fileInfo.pageOffset.push(session.vpos);
}
var putPages_new=function(parsed,cb) { //25% faster than create a new document
	//var fileInfo={pageNames:[],pageOffset:[]};
	var fileContent=[];
	parsed.tovpos=[];

	putFileInfo(fileContent);
	for (var i=0;i<parsed.texts.length;i++) {
		var t=parsed.texts[i];
		fileContent.push(t.t);
		var tovpos=putPage(t.t);
		parsed.tovpos[i]=tovpos;
		session.json.pageNames.push(t.n);
		session.json.pageOffsets.push(session.vpos);
	}
	var lastfilecount=0;
	if (session.json.filePageCount.length) lastfilecount=session.json.filePageCount[session.json.filePageCount.length-1];
	session.json.filePageCount.push(lastfilecount+parsed.texts.length); //accurate page count

	if (fileContent.length==0 || (fileContent.length==1&&!fileContent[0])) {
		console.log("no content in"+status.filename);
		fileContent[0]=" "; //work around to avoid empty string array throw in kdbw
	}

	cb(parsed);//finish
}

var putPages=function(doc,parsed,cb) {
	var fileInfo={parentId:[],reverts:[]};
	var fileContent=[];	
	var hasParentId=false, hasRevert=false;
	parsed.tovpos=[];

	putFileInfo(fileContent);
	if (!session.files) session.files=[];
	session.json.files.push(fileInfo);
	
	for (var i=1;i<doc.pageCount;i++) {
		var pg=doc.getPage(i);
		if (pg.isLeafPage()) {
			fileContent.push(pg.inscription);
			var tovpos=putPage(pg.inscription);
			parsed.tovpos[i-1]=tovpos;
		} else {
			fileContent.push("");
		}
		sesison.json.pageNames.push(pg.name);
		session.json.pageOffsets.push(session.vpos);

		fileInfo.parentId.push(pg.parentId);
		if (pg.parentId) hasParentId=true;
		var revertstr="";
		if (pg.parentId) revertstr=JSON.stringify(pg.compressedRevert());
		if (revertstr) hasRevert=true;
		fileInfo.reverts.push( revertstr );
	}
	if (!hasParentId) delete fileInfo["parentId"];
	if (!hasRevert) delete fileInfo["reverts"];
	cb(parsed);//finish
}
var putDocument=function(parsed,cb) {
	if (session.kdb) { //update an existing kdb
		var D=nodeRequire("./document");
		var dnew=D.createDocument(parsed.texts);
		session.kdb.getDocument(status.filename,function(d){
			if (d) {
				upgradeDocument(d,dnew);
				putPages(d,parsed,cb);
				status.pageCount+=d.pageCount-1;
			} else { //no such page in old kdb
				putPages(dnew,parsed,cb);
				status.pageCount+=dnew.pageCount-1;
			}
		});
	} else {
		putPages_new(parsed,cb);
		status.pageCount+=parsed.texts.length;//dnew.pageCount;
	}
}

var parseBody=function(body,sep,cb) {
	var res=xml4kdb.parseXML(body, {sep:sep,trim:!!session.config.trim});
	putDocument(res,cb);
}

var pat=/([a-zA-Z:]+)="([^"]+?)"/g;
var parseAttributesString=function(s) {
	var out={};
	//work-around for repeated attribute,
	//take the first one
	s.replace(pat,function(m,m1,m2){if (!out[m1]) out[m1]=m2});
	return out;
}
var storeFields=function(fields,json) {
	if (!json.fields) json.fields={};
	var root=json.fields;
	if (!(fields instanceof Array) ) fields=[fields];
	var storeField=function(field) {
		var path=field.path;
		storepoint=root;
		if (!(path instanceof Array)) path=[path];
		for (var i=0;i<path.length;i++) {
			if (!storepoint[path[i]]) {
				if (i<path.length-1) storepoint[path[i]]={};
				else storepoint[path[i]]=[];
			}
			storepoint=storepoint[path[i]];
		}
		if (typeof field.value=="undefined") {
			throw "empty field value of "+path;
		} 
		storepoint.push(field.value);
	}
	fields.map(storeField);
}
/*
	maintain a tag stack for known tag
*/
var tagStack=[];
var processTags=function(captureTags,tags,texts) {

	var getTextBetween=function(from,to,startoffset,endoffset) {
		if (from==to) return texts[from].t.substring(startoffset,endoffset);
		var first=texts[from].t.substr(startoffset-1);
		var middle="";
		for (var i=from+1;i<to;i++) {
			middle+=texts[i].t;
		}
		var last=texts[to].t.substr(0,endoffset-1);
		return first+middle+last;
	}
	for (var i=0;i<tags.length;i++) {
		for (var j=0;j<tags[i].length;j++) {
			var T=tags[i][j],tagname=T[1],tagoffset=T[0],attributes=T[2],tagvpos=T[3];
			var lastchar=attributes[attributes.length-1];
			var nulltag=false;
			if (typeof lastchar!="undefined") {
				if (lastchar=="/") {
					nulltag=true;
				} else {
					var lastcc=lastchar.charCodeAt(0);
					if (!(lastchar=='"' ||lastchar=='-'|| (lastcc>0x40 && lastcc<0x7b))) {
						console.error("error lastchar of tag ("+lastchar+")");
						console.error("in <"+tagname,attributes+"> of",status.filename)	;
						throw 'last char of should be / " or ascii ';
					}
				}
			}

			if (captureTags[tagname]) {

				var attr=parseAttributesString(attributes);
				if (!nulltag) {
					tagStack.push([tagname,tagoffset,attr,i]);
				}
			}
			var handler=null;
			if (tagname[0]=="/") handler=captureTags[tagname.substr(1)];
			else if (nulltag) handler=captureTags[tagname];

			if (handler) {
				var prev=tagStack[tagStack.length-1];
				var text="";
				if (!nulltag) {
					if (typeof prev=="undefined" || tagname.substr(1)!=prev[0]) {
						console.error("tag unbalance",tagname,prev,status.filename);						
						throw "tag unbalance";
					} else {
						tagStack.pop();

						text=getTextBetween(prev[3],i,prev[1],tagoffset);
						//console.log(text,prev[1],tagoffset)
					}
				}
				
				status.vpos=tagvpos; 
				status.tagStack=tagStack;
				var fields=handler(text, tagname, attr, status);
				
				if (fields) storeFields(fields,session.json);
			}
		}	
	}
}
var resolveTagsVpos=function(parsed) {
	var bsearch=nodeRequire("ksana-document").bsearch;
	for (var i=0;i<parsed.tags.length;i++) {
		for (var j=0;j<parsed.tags[i].length;j++) {
			var t=parsed.tags[i][j];
			var pos=t[0];
			t[3]=parsed.tovpos[i][pos];
			while (pos && typeof t[3]=="undefined") t[3]=parsed.tovpos[i][--pos];
		}
	}
}
var putFile=function(fn,cb) {
	var fs=nodeRequire("fs");
	if (!fs.existsSync(fn)){
		console.warn("file ",fn,"doens't exist");
		cb();
		return;
	}
	var texts=fs.readFileSync(fn,session.config.inputEncoding).replace(/\r\n/g,"\n");
	if (texts.charCodeAt(0)==0xfeff) {
		texts=texts.substring(1);
	}
	var bodyend=session.config.bodyend;
	var bodystart=session.config.bodystart;
	var captureTags=session.config.captureTags;
	var callbacks=session.config.callbacks||{};
	var started=false,stopped=false;

	if (callbacks.onFile) callbacks.onFile.apply(session,[fn,status]);
	var start=bodystart ? texts.indexOf(bodystart) : 0 ;
	var end=bodyend? texts.indexOf(bodyend): texts.length;
	if (!bodyend) bodyendlen=0;
	else bodyendlen=bodyend.length;
	//assert.equal(end>start,true);

	// split source xml into 3 parts, before <body> , inside <body></body> , and after </body>
	var body=texts.substring(start,end+bodyendlen);
	status.json=session.json;
	status.storeFields=storeFields;
	
	status.bodytext=body;
	status.starttext=texts.substring(0,start);
	status.fileStartVpos=session.vpos;

	if (callbacks.beforebodystart) callbacks.beforebodystart.apply(session,[texts.substring(0,start),status]);
	parseBody(body,session.config.pageSeparator,function(parsed){
		status.parsed=parsed;
		if (callbacks.afterbodyend) {
			resolveTagsVpos(parsed);
			if (captureTags) {
				processTags(captureTags, parsed.tags, parsed.texts);
			}
			var ending="";
			if (bodyend) ending=texts.substring(end+bodyend.length);
			if (ending) callbacks.afterbodyend.apply(session,[ending,status]);
			status.parsed=null;
			status.bodytext=null;
			status.starttext=null;
			status.json=null;
		}
		cb(); //parse body finished
	});	
}
var initSession=function(config) {
	var json={
		postings:[[0]] //first one is always empty, because tokenid cannot be 0
		,postingCount:0
		,fileContents:[]
		,fileNames:[]
		,fileOffsets:[]
		,filePageCount:[] //2014/11/26
		,pageNames:[]
		,pageOffsets:[]
		,tokens:{}
	};
	config.inputEncoding=config.inputEncoding||"utf8";
	var session={vpos:1, json:json , kdb:null, filenow:0,done:false
		           ,indexedTextLength:0,config:config,files:config.files,pagecount:0};
	return session;
}

var initIndexer=function(mkdbconfig) {
	var Kde=nodeRequire("./kde");

	session=initSession(mkdbconfig);
	api=nodeRequire("ksana-document").customfunc.getAPI(mkdbconfig.meta.config);
	xml4kdb=nodeRequire("ksana-document").xml4kdb;

	//mkdbconfig has a chance to overwrite API

	normalize=api["normalize"];
	isSkip=api["isSkip"];
	tokenize=api["tokenize"];

	var folder=session.config.outdir||".";
	session.kdbfn=nodeRequire("path").resolve(folder, session.config.name+'.kdb');

	if (!session.config.reset && nodeRequire("fs").existsSync(session.kdbfn)) {
		//if old kdb exists and not reset 
		Kde.openLocal(session.kdbfn,function(db){
			session.kdb=db;
			setTimeout(indexstep,1);
		});
	} else {
		setTimeout(indexstep,1);
	}
}

var start=function(mkdbconfig) {
	if (indexing) return null;
	indexing=true;
	if (!mkdbconfig.files.length) return null;//nothing to index

	initIndexer(mkdbconfig);
  return status;
}

var indexstep=function() {
	if (session.filenow<session.files.length) {
		status.filename=session.files[session.filenow];
		status.progress=session.filenow/session.files.length;
		status.filenow=session.filenow;
		putFile(status.filename,function(){
			session.filenow++;
			setTimeout(indexstep,1); //rest for 1 ms to response status			
		});
	} else {
		finalize(function() {
			status.done=true;
			indexing=false;
			if (session.config.finalized) {
				session.config.finalized(session,status);
			}
		});	
	}
}

var getstatus=function() {
  return status;
}
var stop=function() {
  status.done=true;
  status.message="User Abort";
  indexing=false;
  return status;
}
var backupFilename=function(ydbfn) {
	//user has a chance to recover from previous ydb
	return ydbfn+"k"; //todo add date in the middle
}

var backup=function(ydbfn) {
	var fs=nodeRequire("fs");
	var fs=nodeRequire('fs');
	if (fs.existsSync(ydbfn)) {
		var bkfn=ydbfn+'k';
		try {
			if (fs.existsSync(bkfn)) fs.unlinkSync(bkfn);
			fs.renameSync(ydbfn,bkfn);
		} catch (e) {
			console.log(e);
		}
	}
}
var createMeta=function() {
	var meta={};
	if (session.config.meta) for (var i in session.config.meta) {
		meta[i]=session.config.meta[i];
	}
	meta.name=session.config.name;
	meta.vsize=session.vpos;
	meta.pagecount=status.pageCount;
	meta.version=0x20141126;
	return meta;
}
var guessSize=function() {
	var size=session.vpos * 5;
	if (size<1024*1024) size=1024*1024;
	return  size;
}
var buildpostingslen=function(tokens,postings) {
	var out=[];
	for (var i=0;i<tokens.length;i++) {
		out[i]=postings[i].length;
	}
	return out;
}
var optimize4kdb=function(json) {
	var keys=[];
	for (var key in json.tokens) {
		keys[keys.length]=[key,json.tokens[key]];
	}
	keys.sort(function(a,b){return a[1]-b[1]});//sort by token id
	var newtokens=keys.map(function(k){return k[0]});
	json.tokens=newtokens;
	for (var i=0;i<json.postings.length;i++) json.postings[i].sorted=true; //use delta format to save space
	json.postingslen=buildpostingslen(json.tokens,json.postings);
	json.fileOffsets.sorted=true;
	json.pageOffsets.sorted=true;
	return json;
}

var finalize=function(cb) {	
	var Kde=nodeRequire("./kde");

	if (session.kdb) Kde.closeLocal(session.kdbfn);

	session.json.fileOffsets.push(session.vpos); //serve as terminator
	session.json.pageOffsets.push(session.vpos); //serve as terminator
	session.json.meta=createMeta();
	
	if (!session.config.nobackup) backup(session.kdbfn);
	status.message='writing '+session.kdbfn;
	//output=api("optimize")(session.json,session.ydbmeta.config);
	var opts={size:session.config.estimatesize};
	if (!opts.size) opts.size=guessSize();
	var kdbw =nodeRequire("ksana-document").kdbw(session.kdbfn,opts);
	//console.log(JSON.stringify(session.json,""," "));
	if (session.config.finalizeField) {
		console.log("finalizing fields");
		session.config.finalizeField(session.fields);
	}
	console.log("optimizing");
	var json=optimize4kdb(session.json);

	if (session.config.extra) {
		json.extra=session.config.extra;
	}
	
	console.log("output to",session.kdbfn);
	kdbw.save(json,null,{autodelete:true});
	
	kdbw.writeFile(session.kdbfn,function(total,written) {
		status.progress=written/total;
		status.outputfn=session.kdbfn;
		if (total==written) cb();
	});
}
module.exports={start:start,stop:stop,status:getstatus};
});
require.register("ksana-document/indexer_kd.js", function(exports, require, module){
if (typeof nodeRequire=='undefined')nodeRequire=require;

/*
  text:       [ [page_text][page_text] ]
  pagenames:  []
  tokentree:  []
  
  search engine API: 
  getToken        //return raw posting
  getText(vpos)   //return raw page text
    getPageText   
  vpos2pgoff      //virtual posting to page offset
  groupBy         //convert raw posting to group (with optional converted offset) 
  findMarkupInRange
*/


var indexing=false; //only allow one indexing task
var projinfo=null;
var status={progress:0,done:false}; //progress ==1 completed
var session={};
var api=null;
var isSkip=null;
var normalize=null;
var tokenize=null;

var putPosting=function(tk) {
	var	postingid=session.json.tokens[tk];
	var out=session.json;

	if (!postingid) {
		out.postingCount++;
		posting=out.postings[out.postingCount]=[];
		session.json.tokens[tk]=out.postingCount;
	} else {
		posting=out.postings[postingid];
	}
	posting.push(session.vpos);
}
var putExtra=function(arr_of_key_vpos_payload) {
	//which markup to be added in the index
	//is depended on application requirement...
	//convert markup start position to vpos
	// application  key-values  pairs
	//    ydb provide search for key , return array of vpos
	//        and given range of vpos, return all key in the range
  // structure
  // key , 
}

var putPage=function(docPage) {
	var tokenized=tokenize(docPage.inscription);

	for (var i=0;i<tokenized.tokens.length;i++) {
		var t=tokenized.tokens[i];

		if (isSkip(t)) {
			 session.vpos--;
		} else {
			var normalized=normalize(t);
			if (normalized) 	putPosting(normalized);
 		}
 		session.vpos++;
	}

	session.indexedTextLength+= docPage.inscription.length;
}
var shortFilename=function(fn) {
	var arr=fn.split('/');
	while (arr.length>2) arr.shift();
	return arr.join('/');
}
var putFile=function(fn) {
	var persistent=nodeRequire("ksana-document").persistent;
	var doc=persistent.createLocal(fn);
	var shortfn=shortFilename(fn);

	var fileInfo={pageNames:[],pageOffset:[]};
	var fileContent=[];
	session.json.files.push(fileInfo);
	session.json.fileContents.push(fileContent);
	session.json.fileNames.push(shortfn);
	session.json.fileOffsets.push(session.vpos);
	status.message="indexing "+fn;

	for (var i=1;i<doc.pageCount;i++) {
		var pg=doc.getPage(i);
		fileContent.push(pg.inscription);
		fileInfo.pageNames.push(pg.name);
		fileInfo.pageOffset.push(session.vpos);
		putPage(pg);
	}
	fileInfo.pageOffset.push(session.vpos); //ending terminator
}
var initSession=function() {
	var json={
		files:[]
		,fileContents:[]
		,fileNames:[]
		,fileOffsets:[]
		,postings:[[0]] //first one is always empty, because tokenid cannot be 0
		,tokens:{}
		,postingCount:0
	};
	var session={vpos:1, json:json ,
		           indexedTextLength:0,
		           options: projinfo.ksana.ydbmeta };
	return session;
}
var initIndexer=function() {
	session=initSession();
	session.filenow=0;
	session.files=projinfo.files;
	status.done=false;
	api=nodeRequire("ksana-document").customfunc.getAPI(session.options.config);
	
	normalize=api["normalize"];
	isSkip=api["isSkip"];
	tokenize=api["tokenize"];
	setTimeout(indexstep,1);
}

var getMeta=function() {
	var meta={};
	meta.config=session.options.config;
	meta.name=projinfo.name;
	meta.vsize=session.vpos;
	return meta;
}

var backupFilename=function(ydbfn) {
	//user has a chance to recover from previous ydb
	return ydbfn+"k"; //todo add date in the middle
}

var backup=function(ydbfn) {
	var fs=nodeRequire('fs');
	if (fs.existsSync(ydbfn)) {
		var bkfn=ydbfn+'k';
		if (fs.existsSync(bkfn)) fs.unlinkSync(bkfn);
		fs.renameSync(ydbfn,bkfn);
	}
}
var finalize=function(cb) {
	var opt=session.options;
	var kdbfn=projinfo.name+'.kdb';

	session.json.fileOffsets.push(session.vpos); //serve as terminator
	session.json.meta=getMeta();
	
	backup(kdbfn);
	status.message='writing '+kdbfn;
	//output=api("optimize")(session.json,session.ydbmeta.config);

	var kdbw =nodeRequire("ksana-document").kdbw(kdbfn);
	
	kdbw.save(session.json,null,{autodelete:true});
	
	kdbw.writeFile(kdbfn,function(total,written) {
		status.progress=written/total;
		status.outputfn=kdbfn;
		if (total==written) cb();
	});
}

var indexstep=function() {
	
	if (session.filenow<session.files.length) {
		status.filename=session.files[session.filenow];
		status.progress=session.filenow/session.files.length;
		putFile(status.filename);
		session.filenow++;
		setTimeout(indexstep,1); //rest for 1 ms to response status
	} else {
		finalize(function() {
			status.done=true;
			indexing=false;
		});	
	}
}

var status=function() {
  return status;
}
var start=function(projname) {
	if (indexing) return null;
	indexing=true;

	projinfo=nodeRequire("ksana-document").projects.fullInfo(projname);

	if (!projinfo.files.length) return null;//nothing to index

	initIndexer();
 	status.projectname=projname;
  	return status;
}

var stop=function() {
  status.done=true;
  status.message="User Abort";
  indexing=false;
  return status;
}
module.exports={start:start,stop:stop,status:status};
});
require.register("ksana-document/kdb.js", function(exports, require, module){
/*
	KDB version 3.0 GPL
	yapcheahshen@gmail.com
	2013/12/28
	asyncronize version of yadb

  remove dependency of Q, thanks to
  http://stackoverflow.com/questions/4234619/how-to-avoid-long-nesting-of-asynchronous-functions-in-node-js

  
*/
var Kfs=null;

if (typeof ksanagap=="undefined") {
	if (typeof process=="undefined") {
		Kfs=require('./kdbfs');			
	} else {
		Kfs=require('./kdbfs');			
	}
} else {
	if (ksanagap.platform=="ios") {
		Kfs=require("./kdbfs_ios");
	} else if (ksanagap.platform=="node-webkit") {
		Kfs=require("./kdbfs");
	} else if (ksanagap.platform=="chrome") {
		Kfs=require("./kdbfs");
	} else {
		Kfs=require("./kdbfs_android");
	}
		
}


var DT={
	uint8:'1', //unsigned 1 byte integer
	int32:'4', // signed 4 bytes integer
	utf8:'8',  
	ucs2:'2',
	bool:'^', 
	blob:'&',
	utf8arr:'*', //shift of 8
	ucs2arr:'@', //shift of 2
	uint8arr:'!', //shift of 1
	int32arr:'$', //shift of 4
	vint:'`',
	pint:'~',	

	array:'\u001b',
	object:'\u001a' 
	//ydb start with object signature,
	//type a ydb in command prompt shows nothing
}
var verbose=0, readLog=function(){};
var _readLog=function(readtype,bytes) {
	console.log(readtype,bytes,"bytes");
}
if (verbose) readLog=_readLog;
var strsep="\uffff";
var Create=function(path,opts,cb) {
	/* loadxxx functions move file pointer */
	// load variable length int
	if (typeof opts=="function") {
		cb=opts;
		opts={};
	}

	
	var loadVInt =function(opts,blocksize,count,cb) {
		//if (count==0) return [];
		var that=this;

		this.fs.readBuf_packedint(opts.cur,blocksize,count,true,function(o){
			//console.log("vint");
			opts.cur+=o.adv;
			cb.apply(that,[o.data]);
		});
	}
	var loadVInt1=function(opts,cb) {
		var that=this;
		loadVInt.apply(this,[opts,6,1,function(data){
			//console.log("vint1");
			cb.apply(that,[data[0]]);
		}])
	}
	//for postings
	var loadPInt =function(opts,blocksize,count,cb) {
		var that=this;
		this.fs.readBuf_packedint(opts.cur,blocksize,count,false,function(o){
			//console.log("pint");
			opts.cur+=o.adv;
			cb.apply(that,[o.data]);
		});
	}
	// item can be any type (variable length)
	// maximum size of array is 1TB 2^40
	// structure:
	// signature,5 bytes offset, payload, itemlengths
	var getArrayLength=function(opts,cb) {
		var that=this;
		var dataoffset=0;

		this.fs.readUI8(opts.cur,function(len){
			var lengthoffset=len*4294967296;
			opts.cur++;
			that.fs.readUI32(opts.cur,function(len){
				opts.cur+=4;
				dataoffset=opts.cur; //keep this
				lengthoffset+=len;
				opts.cur+=lengthoffset;

				loadVInt1.apply(that,[opts,function(count){
					loadVInt.apply(that,[opts,count*6,count,function(sz){						
						cb({count:count,sz:sz,offset:dataoffset});
					}]);
				}]);
				
			});
		});
	}

	var loadArray = function(opts,blocksize,cb) {
		var that=this;
		getArrayLength.apply(this,[opts,function(L){
				var o=[];
				var endcur=opts.cur;
				opts.cur=L.offset;

				if (opts.lazy) { 
						var offset=L.offset;
						L.sz.map(function(sz){
							o[o.length]=strsep+offset.toString(16)
								   +strsep+sz.toString(16);
							offset+=sz;
						})
				} else {
					var taskqueue=[];
					for (var i=0;i<L.count;i++) {
						taskqueue.push(
							(function(sz){
								return (
									function(data){
										if (typeof data=='object' && data.__empty) {
											 //not pushing the first call
										}	else o.push(data);
										opts.blocksize=sz;
										load.apply(that,[opts, taskqueue.shift()]);
									}
								);
							})(L.sz[i])
						);
					}
					//last call to child load
					taskqueue.push(function(data){
						o.push(data);
						opts.cur=endcur;
						cb.apply(that,[o]);
					});
				}

				if (opts.lazy) cb.apply(that,[o]);
				else {
					taskqueue.shift()({__empty:true});
				}
			}
		])
	}		
	// item can be any type (variable length)
	// support lazy load
	// structure:
	// signature,5 bytes offset, payload, itemlengths, 
	//                    stringarray_signature, keys
	var loadObject = function(opts,blocksize,cb) {
		var that=this;
		var start=opts.cur;
		getArrayLength.apply(this,[opts,function(L) {
			opts.blocksize=blocksize-opts.cur+start;
			load.apply(that,[opts,function(keys){ //load the keys
				if (opts.keys) { //caller ask for keys
					keys.map(function(k) { opts.keys.push(k)});
				}

				var o={};
				var endcur=opts.cur;
				opts.cur=L.offset;
				if (opts.lazy) { 
					var offset=L.offset;
					for (var i=0;i<L.sz.length;i++) {
						//prefix with a \0, impossible for normal string
						o[keys[i]]=strsep+offset.toString(16)
							   +strsep+L.sz[i].toString(16);
						offset+=L.sz[i];
					}
				} else {
					var taskqueue=[];
					for (var i=0;i<L.count;i++) {
						taskqueue.push(
							(function(sz,key){
								return (
									function(data){
										if (typeof data=='object' && data.__empty) {
											//not saving the first call;
										} else {
											o[key]=data; 
										}
										opts.blocksize=sz;
										if (verbose) readLog("key",key);
										load.apply(that,[opts, taskqueue.shift()]);
									}
								);
							})(L.sz[i],keys[i-1])

						);
					}
					//last call to child load
					taskqueue.push(function(data){
						o[keys[keys.length-1]]=data;
						opts.cur=endcur;
						cb.apply(that,[o]);
					});
				}
				if (opts.lazy) cb.apply(that,[o]);
				else {
					taskqueue.shift()({__empty:true});
				}
			}]);
		}]);
	}

	//item is same known type
	var loadStringArray=function(opts,blocksize,encoding,cb) {
		var that=this;
		this.fs.readStringArray(opts.cur,blocksize,encoding,function(o){
			opts.cur+=blocksize;
			cb.apply(that,[o]);
		});
	}
	var loadIntegerArray=function(opts,blocksize,unitsize,cb) {
		var that=this;
		loadVInt1.apply(this,[opts,function(count){
			var o=that.fs.readFixedArray(opts.cur,count,unitsize,function(o){
				opts.cur+=count*unitsize;
				cb.apply(that,[o]);
			});
		}]);
	}
	var loadBlob=function(blocksize,cb) {
		var o=this.fs.readBuf(this.cur,blocksize);
		this.cur+=blocksize;
		return o;
	}	
	var loadbysignature=function(opts,signature,cb) {
		  var blocksize=opts.blocksize||this.fs.size; 
			opts.cur+=this.fs.signature_size;
			var datasize=blocksize-this.fs.signature_size;
			//basic types
			if (signature===DT.int32) {
				opts.cur+=4;
				this.fs.readI32(opts.cur-4,cb);
			} else if (signature===DT.uint8) {
				opts.cur++;
				this.fs.readUI8(opts.cur-1,cb);
			} else if (signature===DT.utf8) {
				var c=opts.cur;opts.cur+=datasize;
				this.fs.readString(c,datasize,'utf8',cb);
			} else if (signature===DT.ucs2) {
				var c=opts.cur;opts.cur+=datasize;
				this.fs.readString(c,datasize,'ucs2',cb);	
			} else if (signature===DT.bool) {
				opts.cur++;
				this.fs.readUI8(opts.cur-1,function(data){cb(!!data)});
			} else if (signature===DT.blob) {
				loadBlob(datasize,cb);
			}
			//variable length integers
			else if (signature===DT.vint) {
				loadVInt.apply(this,[opts,datasize,datasize,cb]);
			}
			else if (signature===DT.pint) {
				loadPInt.apply(this,[opts,datasize,datasize,cb]);
			}
			//simple array
			else if (signature===DT.utf8arr) {
				loadStringArray.apply(this,[opts,datasize,'utf8',cb]);
			}
			else if (signature===DT.ucs2arr) {
				loadStringArray.apply(this,[opts,datasize,'ucs2',cb]);
			}
			else if (signature===DT.uint8arr) {
				loadIntegerArray.apply(this,[opts,datasize,1,cb]);
			}
			else if (signature===DT.int32arr) {
				loadIntegerArray.apply(this,[opts,datasize,4,cb]);
			}
			//nested structure
			else if (signature===DT.array) {
				loadArray.apply(this,[opts,datasize,cb]);
			}
			else if (signature===DT.object) {
				loadObject.apply(this,[opts,datasize,cb]);
			}
			else {
				console.error('unsupported type',signature,opts)
				cb.apply(this,[null]);//make sure it return
				//throw 'unsupported type '+signature;
			}
	}

	var load=function(opts,cb) {
		opts=opts||{}; // this will served as context for entire load procedure
		opts.cur=opts.cur||0;
		var that=this;
		this.fs.readSignature(opts.cur, function(signature){
			loadbysignature.apply(that,[opts,signature,cb])
		});
		return this;
	}
	var CACHE=null;
	var KEY={};
	var ADDRESS={};
	var reset=function(cb) {
		if (!CACHE) {
			load.apply(this,[{cur:0,lazy:true},function(data){
				CACHE=data;
				cb.call(this);
			}]);	
		} else {
			cb.call(this);
		}
	}

	var exists=function(path,cb) {
		if (path.length==0) return true;
		var key=path.pop();
		var that=this;
		get.apply(this,[path,false,function(data){
			if (!path.join(strsep)) return (!!KEY[key]);
			var keys=KEY[path.join(strsep)];
			path.push(key);//put it back
			if (keys) cb.apply(that,[keys.indexOf(key)>-1]);
			else cb.apply(that,[false]);
		}]);
	}

	var getSync=function(path) {
		if (!CACHE) return undefined;	
		var o=CACHE;
		for (var i=0;i<path.length;i++) {
			var r=o[path[i]];
			if (typeof r=="undefined") return null;
			o=r;
		}
		return o;
	}
	var get=function(path,opts,cb) {
		if (typeof path=='undefined') path=[];
		if (typeof path=="string") path=[path];
		//opts.recursive=!!opts.recursive;
		var that=this;
		if (typeof cb!='function') return getSync(path);

		reset.apply(this,[function(){
			var o=CACHE;
			if (path.length==0) {
				if (opts.address) {
					cb([0,that.fs.size]);
				} else {
					cb(Object.keys(CACHE));	
				}
				return;
			} 
			
			var pathnow="",taskqueue=[],newopts={},r=null;
			var lastkey="";

			for (var i=0;i<path.length;i++) {
				var task=(function(key,k){

					return (function(data){
						if (!(typeof data=='object' && data.__empty)) {
							if (typeof o[lastkey]=='string' && o[lastkey][0]==strsep) o[lastkey]={};
							o[lastkey]=data; 
							o=o[lastkey];
							r=data[key];
							KEY[pathnow]=opts.keys;								
						} else {
							data=o[key];
							r=data;
						}

						if (r===undefined) {
							taskqueue=null;
							cb.apply(that,[r]); //return empty value
						} else {							
							if (parseInt(k)) pathnow+=strsep;
							pathnow+=key;
							if (typeof r=='string' && r[0]==strsep) { //offset of data to be loaded
								var p=r.substring(1).split(strsep).map(function(item){return parseInt(item,16)});
								var cur=p[0],sz=p[1];
								newopts.lazy=!opts.recursive || (k<path.length-1) ;
								newopts.blocksize=sz;newopts.cur=cur,newopts.keys=[];
								lastkey=key; //load is sync in android
								if (opts.address && taskqueue.length==1) {
									ADDRESS[pathnow]=[cur,sz];
									taskqueue.shift()(null,ADDRESS[pathnow]);
								} else {
									load.apply(that,[newopts, taskqueue.shift()]);
								}
							} else {
								if (opts.address && taskqueue.length==1) {
									taskqueue.shift()(null,ADDRESS[pathnow]);
								} else {
									taskqueue.shift().apply(that,[r]);
								}
							}
						}
					})
				})
				(path[i],i);
				
				taskqueue.push(task);
			}

			if (taskqueue.length==0) {
				cb.apply(that,[o]);
			} else {
				//last call to child load
				taskqueue.push(function(data,cursz){
					if (opts.address) {
						cb.apply(that,[cursz]);
					} else{
						var key=path[path.length-1];
						o[key]=data; KEY[pathnow]=opts.keys;
						cb.apply(that,[data]);
					}
				});
				taskqueue.shift()({__empty:true});			
			}

		}]); //reset
	}
	// get all keys in given path
	var getkeys=function(path,cb) {
		if (!path) path=[]
		var that=this;
		get.apply(this,[path,false,function(){
			if (path && path.length) {
				cb.apply(that,[KEY[path.join(strsep)]]);
			} else {
				cb.apply(that,[Object.keys(CACHE)]); 
				//top level, normally it is very small
			}
		}]);
	}

	var setupapi=function() {
		this.load=load;
//		this.cur=0;
		this.cache=function() {return CACHE};
		this.key=function() {return KEY};
		this.free=function() {
			CACHE=null;
			KEY=null;
			this.fs.free();
		}
		this.setCache=function(c) {CACHE=c};
		this.keys=getkeys;
		this.get=get;   // get a field, load if needed
		this.exists=exists;
		this.DT=DT;
		
		//install the sync version for node
		if (typeof process!="undefined") require("./kdb_sync")(this);
		//if (cb) setTimeout(cb.bind(this),0);
		if (cb) cb(this);
	}
	var that=this;
	var kfs=new Kfs(path,opts,function(){
		that.size=this.size;
		setupapi.call(that);
	});
	this.fs=kfs;
	return this;
}

Create.datatypes=DT;

if (module) module.exports=Create;
//return Create;

});
require.register("ksana-document/kdbfs.js", function(exports, require, module){
/* OS dependent file operation */

if (typeof process=="undefined") {
	var fs=require('./html5fs');
	var Buffer=function(){ return ""};
	var html5fs=true; 
} else {
	if (typeof nodeRequire=="undefined") {
		if (typeof ksana!="undefined") nodeRequire=ksana.require;
		else nodeRequire=require;
	} 
	var fs=nodeRequire('fs');
	var Buffer=nodeRequire("buffer").Buffer;
}

var signature_size=1;
var verbose=0, readLog=function(){};
var _readLog=function(readtype,bytes) {
	console.log(readtype,bytes,"bytes");
}
if (verbose) readLog=_readLog;

var unpack_int = function (ar, count , reset) {
   count=count||ar.length;
   /*
	if (typeof ijs_unpack_int == 'function') {
		var R = ijs_unpack_int(ar, count, reset)
		return R
	};
	*/
  var r = [], i = 0, v = 0;
  do {
	var shift = 0;
	do {
	  v += ((ar[i] & 0x7F) << shift);
	  shift += 7;	  
	} while (ar[++i] & 0x80);
	r.push(v); if (reset) v=0;
	count--;
  } while (i<ar.length && count);
  return {data:r, adv:i };
}
var Open=function(path,opts,cb) {
	opts=opts||{};

	var readSignature=function(pos,cb) {
		var buf=new Buffer(signature_size);
		var that=this;
		fs.read(this.handle,buf,0,signature_size,pos,function(err,len,buffer){
			if (html5fs) var signature=String.fromCharCode((new Uint8Array(buffer))[0])
			else var signature=buffer.toString('utf8',0,signature_size);
			cb.apply(that,[signature]);
		});
	}

	//this is quite slow
	//wait for StringView +ArrayBuffer to solve the problem
	//https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/ylgiNY_ZSV0
	//if the string is always ucs2
	//can use Uint16 to read it.
	//http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
  var decodeutf8 = function (utftext) {
        var string = "";
        var i = 0;
        var c=0,c1 = 0, c2 = 0 , c3=0;
 				for (var i=0;i<utftext.length;i++) {
 					if (utftext.charCodeAt(i)>127) break;
 				}
 				if (i>=utftext.length) return utftext;

        while ( i < utftext.length ) {
 
            c = utftext.charCodeAt(i);
 
            if (c < 128) {
                string += utftext[i];
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
 
        }
 
        return string;
  }

	var readString= function(pos,blocksize,encoding,cb) {
		encoding=encoding||'utf8';
		var buffer=new Buffer(blocksize);
		var that=this;
		fs.read(this.handle,buffer,0,blocksize,pos,function(err,len,buffer){
			readLog("string",len);
			if (html5fs) {
				if (encoding=='utf8') {
					var str=decodeutf8(String.fromCharCode.apply(null, new Uint8Array(buffer)))
				} else { //ucs2 is 3 times faster
					var str=String.fromCharCode.apply(null, new Uint16Array(buffer))	
				}
				
				cb.apply(that,[str]);
			} 
			else cb.apply(that,[buffer.toString(encoding)]);	
		});
	}

	//work around for chrome fromCharCode cannot accept huge array
	//https://code.google.com/p/chromium/issues/detail?id=56588
	var buf2stringarr=function(buf,enc) {
		if (enc=="utf8") 	var arr=new Uint8Array(buf);
		else var arr=new Uint16Array(buf);
		var i=0,codes=[],out=[],s="";
		while (i<arr.length) {
			if (arr[i]) {
				codes[codes.length]=arr[i];
			} else {
				s=String.fromCharCode.apply(null,codes);
				if (enc=="utf8") out[out.length]=decodeutf8(s);
				else out[out.length]=s;
				codes=[];				
			}
			i++;
		}
		
		s=String.fromCharCode.apply(null,codes);
		if (enc=="utf8") out[out.length]=decodeutf8(s);
		else out[out.length]=s;

		return out;
	}
	var readStringArray = function(pos,blocksize,encoding,cb) {
		var that=this,out=null;
		if (blocksize==0) return [];
		encoding=encoding||'utf8';
		var buffer=new Buffer(blocksize);
		fs.read(this.handle,buffer,0,blocksize,pos,function(err,len,buffer){
		  
		  if (html5fs) {
	  		readLog("stringArray",buffer.byteLength);

				if (encoding=='utf8') {
					out=buf2stringarr(buffer,"utf8");
				} else { //ucs2 is 3 times faster
					out=buf2stringarr(buffer,"ucs2");
				}
		  } else {
			readLog("stringArray",buffer.length);
			out=buffer.toString(encoding).split('\0');
		  } 	
		  cb.apply(that,[out]);
		});
	}
	var readUI32=function(pos,cb) {
		var buffer=new Buffer(4);
		var that=this;
		fs.read(this.handle,buffer,0,4,pos,function(err,len,buffer){
			readLog("ui32",len);
			if (html5fs){
				//v=(new Uint32Array(buffer))[0];
				var v=new DataView(buffer).getUint32(0, false)
				cb(v);
			}
			else cb.apply(that,[buffer.readInt32BE(0)]);	
		});
		
	}

	var readI32=function(pos,cb) {
		var buffer=new Buffer(4);
		var that=this;
		fs.read(this.handle,buffer,0,4,pos,function(err,len,buffer){
			readLog("i32",len);
			if (html5fs){
				var v=new DataView(buffer).getInt32(0, false)
				cb(v);
			}
			else  	cb.apply(that,[buffer.readInt32BE(0)]);	
		});
	}
	var readUI8=function(pos,cb) {
		var buffer=new Buffer(1);
		var that=this;

		fs.read(this.handle,buffer,0,1,pos,function(err,len,buffer){
			readLog("ui8",len);
			if (html5fs)cb( (new Uint8Array(buffer))[0]) ;
			else  			cb.apply(that,[buffer.readUInt8(0)]);	
			
		});
	}
	var readBuf=function(pos,blocksize,cb) {
		var that=this;
		var buf=new Buffer(blocksize);
		fs.read(this.handle,buf,0,blocksize,pos,function(err,len,buffer){

			readLog("buf",len);
			/*
			var buff=[];
			for (var i=0;i<len;i++) {
				buff[i]=buffer.charCodeAt(i);
			}
			*/
			var buff=new Uint8Array(buffer)
			cb.apply(that,[buff]);
		});
	}
	var readBuf_packedint=function(pos,blocksize,count,reset,cb) {
		var that=this;
		readBuf.apply(this,[pos,blocksize,function(buffer){
			cb.apply(that,[unpack_int(buffer,count,reset)]);	
		}]);
		
	}
	var readFixedArray_html5fs=function(pos,count,unitsize,cb) {
		var func=null;
		/*
		var buf2UI32BE=function(buf,p) {
			return buf.charCodeAt(p)*256*256*256
					+buf.charCodeAt(p+1)*256*256
					+buf.charCodeAt(p+2)*256+buf.charCodeAt(p+3);
		}
		var buf2UI16BE=function(buf,p) {
			return buf.charCodeAt(p)*256
					+buf.charCodeAt(p+1);
		}
		var buf2UI8=function(buf,p) {
			return buf.charCodeAt(p);
		}
		*/
		if (unitsize===1) {
			func='getUint8';//Uint8Array;
		} else if (unitsize===2) {
			func='getUint16';//Uint16Array;
		} else if (unitsize===4) {
			func='getUint32';//Uint32Array;
		} else throw 'unsupported integer size';

		fs.read(this.handle,null,0,unitsize*count,pos,function(err,len,buffer){
			readLog("fix array",len);
			var out=[];
			if (unitsize==1) {
				out=new Uint8Array(buffer);
			} else {
				for (var i = 0; i < len / unitsize; i++) { //endian problem
				//	out.push( func(buffer,i*unitsize));
					out.push( v=new DataView(buffer)[func](i,false) );
				}
			}

			cb.apply(that,[out]);
		});
	}
	// signature, itemcount, payload
	var readFixedArray = function(pos ,count, unitsize,cb) {
		var func=null;
		var that=this;
		
		if (unitsize* count>this.size && this.size)  {
			console.log("array size exceed file size",this.size)
			return;
		}
		
		if (html5fs) return readFixedArray_html5fs.apply(this,[pos,count,unitsize,cb]);

		var items=new Buffer( unitsize* count);
		if (unitsize===1) {
			func=items.readUInt8;
		} else if (unitsize===2) {
			func=items.readUInt16BE;
		} else if (unitsize===4) {
			func=items.readUInt32BE;
		} else throw 'unsupported integer size';
		//console.log('itemcount',itemcount,'buffer',buffer);

		fs.read(this.handle,items,0,unitsize*count,pos,function(err,len,buffer){
			readLog("fix array",len);
			var out=[];
			for (var i = 0; i < items.length / unitsize; i++) {
				out.push( func.apply(items,[i*unitsize]));
			}
			cb.apply(that,[out]);
		});
	}

	var free=function() {
		//console.log('closing ',handle);
		fs.closeSync(this.handle);
	}
	var setupapi=function() {
		var that=this;
		this.readSignature=readSignature;
		this.readI32=readI32;
		this.readUI32=readUI32;
		this.readUI8=readUI8;
		this.readBuf=readBuf;
		this.readBuf_packedint=readBuf_packedint;
		this.readFixedArray=readFixedArray;
		this.readString=readString;
		this.readStringArray=readStringArray;
		this.signature_size=signature_size;
		this.free=free;
		if (html5fs) {
		    var fn=path;
		    if (path.indexOf("filesystem:")==0) fn=path.substr(path.lastIndexOf("/"));
		    fs.fs.root.getFile(fn,{},function(entry){
		      entry.getMetadata(function(metadata) { 
		        that.size=metadata.size;
		        if (cb) setTimeout(cb.bind(that),0);
		        });
		    });
		} else {
			var stat=fs.fstatSync(this.handle);
			this.stat=stat;
			this.size=stat.size;		
			if (cb)	setTimeout(cb.bind(this),0);	
		}
	}
	
	//handle=fs.openSync(path,'r');
	//console.log('watching '+path);
	var that=this;
	if (html5fs) {
		fs.open(path,function(h){
			that.handle=h;
			that.html5fs=true;
			setupapi.call(that);
			that.opened=true;
		})
	} else {
		this.handle=fs.openSync(path,'r');//,function(err,handle){
		this.opened=true;
		setupapi.call(this);
	}
	//console.log('file size',path,this.size);	
	return this;
}
module.exports=Open;

});
require.register("ksana-document/kdbw.js", function(exports, require, module){
/*
  convert any json into a binary buffer
  the buffer can be saved with a single line of fs.writeFile
*/

var DT={
	uint8:'1', //unsigned 1 byte integer
	int32:'4', // signed 4 bytes integer
	utf8:'8',  
	ucs2:'2',
	bool:'^', 
	blob:'&',
	utf8arr:'*', //shift of 8
	ucs2arr:'@', //shift of 2
	uint8arr:'!', //shift of 1
	int32arr:'$', //shift of 4
	vint:'`',
	pint:'~',	

	array:'\u001b',
	object:'\u001a' 
	//ydb start with object signature,
	//type a ydb in command prompt shows nothing
}
var key_writing="";//for debugging
var pack_int = function (ar, savedelta) { // pack ar into
  if (!ar || ar.length === 0) return []; // empty array
  var r = [],
  i = 0,
  j = 0,
  delta = 0,
  prev = 0;
  
  do {
	delta = ar[i];
	if (savedelta) {
		delta -= prev;
	}
	if (delta < 0) {
	  console.trace('negative',prev,ar[i])
	  throw 'negetive';
	  break;
	}
	
	r[j++] = delta & 0x7f;
	delta >>= 7;
	while (delta > 0) {
	  r[j++] = (delta & 0x7f) | 0x80;
	  delta >>= 7;
	}
	prev = ar[i];
	i++;
  } while (i < ar.length);
  return r;
}
var Kfs=function(path,opts) {
	
	var handle=null;
	opts=opts||{};
	opts.size=opts.size||65536*2048; 
	console.log('kdb estimate size:',opts.size);
	var dbuf=new Buffer(opts.size);
	var cur=0;//dbuf cursor
	
	var writeSignature=function(value,pos) {
		dbuf.write(value,pos,value.length,'utf8');
		if (pos+value.length>cur) cur=pos+value.length;
		return value.length;
	}
	var writeOffset=function(value,pos) {
		dbuf.writeUInt8(Math.floor(value / (65536*65536)),pos);
		dbuf.writeUInt32BE( value & 0xFFFFFFFF,pos+1);
		if (pos+5>cur) cur=pos+5;
		return 5;
	}
	var writeString= function(value,pos,encoding) {
		encoding=encoding||'ucs2';
		if (value=="") throw "cannot write null string";
		if (encoding==='utf8')dbuf.write(DT.utf8,pos,1,'utf8');
		else if (encoding==='ucs2')dbuf.write(DT.ucs2,pos,1,'utf8');
		else throw 'unsupported encoding '+encoding;
			
		var len=Buffer.byteLength(value, encoding);
		dbuf.write(value,pos+1,len,encoding);
		
		if (pos+len+1>cur) cur=pos+len+1;
		return len+1; // signature
	}
	var writeStringArray = function(value,pos,encoding) {
		encoding=encoding||'ucs2';
		if (encoding==='utf8') dbuf.write(DT.utf8arr,pos,1,'utf8');
		else if (encoding==='ucs2')dbuf.write(DT.ucs2arr,pos,1,'utf8');
		else throw 'unsupported encoding '+encoding;
		
		var v=value.join('\0');
		var len=Buffer.byteLength(v, encoding);
		if (0===len) {
			throw "empty string array " + key_writing;
		}
		dbuf.write(v,pos+1,len,encoding);
		if (pos+len+1>cur) cur=pos+len+1;
		return len+1;
	}
	var writeI32=function(value,pos) {
		dbuf.write(DT.int32,pos,1,'utf8');
		dbuf.writeInt32BE(value,pos+1);
		if (pos+5>cur) cur=pos+5;
		return 5;
	}
	var writeUI8=function(value,pos) {
		dbuf.write(DT.uint8,pos,1,'utf8');
		dbuf.writeUInt8(value,pos+1);
		if (pos+2>cur) cur=pos+2;
		return 2;
	}
	var writeBool=function(value,pos) {
		dbuf.write(DT.bool,pos,1,'utf8');
		dbuf.writeUInt8(Number(value),pos+1);
		if (pos+2>cur) cur=pos+2;
		return 2;
	}		
	var writeBlob=function(value,pos) {
		dbuf.write(DT.blob,pos,1,'utf8');
		value.copy(dbuf, pos+1);
		var written=value.length+1;
		if (pos+written>cur) cur=pos+written;
		return written;
	}		
	/* no signature */
	var writeFixedArray = function(value,pos,unitsize) {
		//console.log('v.len',value.length,items.length,unitsize);
		if (unitsize===1) var func=dbuf.writeUInt8;
		else if (unitsize===4)var func=dbuf.writeInt32BE;
		else throw 'unsupported integer size';
		if (!value.length) {
			throw "empty fixed array "+key_writing;
		}
		for (var i = 0; i < value.length ; i++) {
			func.apply(dbuf,[value[i],i*unitsize+pos])
		}
		var len=unitsize*value.length;
		if (pos+len>cur) cur=pos+len;
		return len;
	}

	this.writeI32=writeI32;
	this.writeBool=writeBool;
	this.writeBlob=writeBlob;
	this.writeUI8=writeUI8;
	this.writeString=writeString;
	this.writeSignature=writeSignature;
	this.writeOffset=writeOffset; //5 bytes offset
	this.writeStringArray=writeStringArray;
	this.writeFixedArray=writeFixedArray;
	Object.defineProperty(this, "buf", {get : function(){ return dbuf; }});
	
	return this;
}

var Create=function(path,opts) {
	opts=opts||{};
	var kfs=new Kfs(path,opts);
	var cur=0;

	var handle={};
	
	//no signature
	var writeVInt =function(arr) {
		var o=pack_int(arr,false);
		kfs.writeFixedArray(o,cur,1);
		cur+=o.length;
	}
	var writeVInt1=function(value) {
		writeVInt([value]);
	}
	//for postings
	var writePInt =function(arr) {
		var o=pack_int(arr,true);
		kfs.writeFixedArray(o,cur,1);
		cur+=o.length;
	}
	
	var saveVInt = function(arr,key) {
		var start=cur;
		key_writing=key;
		cur+=kfs.writeSignature(DT.vint,cur);
		writeVInt(arr);
		var written = cur-start;
		pushitem(key,written);
		return written;		
	}
	var savePInt = function(arr,key) {
		var start=cur;
		key_writing=key;
		cur+=kfs.writeSignature(DT.pint,cur);
		writePInt(arr);
		var written = cur-start;
		pushitem(key,written);
		return written;	
	}

	
	var saveUI8 = function(value,key) {
		var written=kfs.writeUI8(value,cur);
		cur+=written;
		pushitem(key,written);
		return written;
	}
	var saveBool=function(value,key) {
		var written=kfs.writeBool(value,cur);
		cur+=written;
		pushitem(key,written);
		return written;
	}
	var saveI32 = function(value,key) {
		var written=kfs.writeI32(value,cur);
		cur+=written;
		pushitem(key,written);
		return written;
	}	
	var saveString = function(value,key,encoding) {
		encoding=encoding||stringencoding;
		key_writing=key;
		var written=kfs.writeString(value,cur,encoding);
		cur+=written;
		pushitem(key,written);
		return written;
	}
	var saveStringArray = function(arr,key,encoding) {
		encoding=encoding||stringencoding;
		key_writing=key;
		try {
			var written=kfs.writeStringArray(arr,cur,encoding);
		} catch(e) {
			throw e;
		}
		cur+=written;
		pushitem(key,written);
		return written;
	}
	
	var saveBlob = function(value,key) {
		key_writing=key;
		var written=kfs.writeBlob(value,cur);
		cur+=written;
		pushitem(key,written);
		return written;
	}

	var folders=[];
	var pushitem=function(key,written) {
		var folder=folders[folders.length-1];	
		if (!folder) return ;
		folder.itemslength.push(written);
		if (key) {
			if (!folder.keys) throw 'cannot have key in array';
			folder.keys.push(key);
		}
	}	
	var open = function(opt) {
		var start=cur;
		var key=opt.key || null;
		var type=opt.type||DT.array;
		cur+=kfs.writeSignature(type,cur);
		cur+=kfs.writeOffset(0x0,cur); // pre-alloc space for offset
		var folder={
			type:type, key:key,
			start:start,datastart:cur,
			itemslength:[] };
		if (type===DT.object) folder.keys=[];
		folders.push(folder);
	}
	var openObject = function(key) {
		open({type:DT.object,key:key});
	}
	var openArray = function(key) {
		open({type:DT.array,key:key});
	}
	var saveInts=function(arr,key,func) {
		func.apply(handle,[arr,key]);
	}
	var close = function(opt) {
		if (!folders.length) throw 'empty stack';
		var folder=folders.pop();
		//jump to lengths and keys
		kfs.writeOffset( cur-folder.datastart, folder.datastart-5);
		var itemcount=folder.itemslength.length;
		//save lengths
		writeVInt1(itemcount);
		writeVInt(folder.itemslength);
		
		if (folder.type===DT.object) {
			//use utf8 for keys
			cur+=kfs.writeStringArray(folder.keys,cur,'utf8');
		}
		written=cur-folder.start;
		pushitem(folder.key,written);
		return written;
	}
	
	
	var stringencoding='ucs2';
	var stringEncoding=function(newencoding) {
		if (newencoding) stringencoding=newencoding;
		else return stringencoding;
	}
	
	var allnumber_fast=function(arr) {
		if (arr.length<5) return allnumber(arr);
		if (typeof arr[0]=='number'
		    && Math.round(arr[0])==arr[0] && arr[0]>=0)
			return true;
		return false;
	}
	var allstring_fast=function(arr) {
		if (arr.length<5) return allstring(arr);
		if (typeof arr[0]=='string') return true;
		return false;
	}	
	var allnumber=function(arr) {
		for (var i=0;i<arr.length;i++) {
			if (typeof arr[i]!=='number') return false;
		}
		return true;
	}
	var allstring=function(arr) {
		for (var i=0;i<arr.length;i++) {
			if (typeof arr[i]!=='string') return false;
		}
		return true;
	}
	var getEncoding=function(key,encs) {
		var enc=encs[key];
		if (!enc) return null;
		if (enc=='delta' || enc=='posting') {
			return savePInt;
		} else if (enc=="variable") {
			return saveVInt;
		}
		return null;
	}
	var save=function(J,key,opts) {
		opts=opts||{};
		
		if (typeof J=="null" || typeof J=="undefined") {
			throw 'cannot save null value of ['+key+'] folders'+JSON.stringify(folders);
			return;
		}
		var type=J.constructor.name;
		if (type==='Object') {
			openObject(key);
			for (var i in J) {
				save(J[i],i,opts);
				if (opts.autodelete) delete J[i];
			}
			close();
		} else if (type==='Array') {
			if (allnumber_fast(J)) {
				if (J.sorted) { //number array is sorted
					saveInts(J,key,savePInt);	//posting delta format
				} else {
					saveInts(J,key,saveVInt);	
				}
			} else if (allstring_fast(J)) {
				saveStringArray(J,key);
			} else {
				openArray(key);
				for (var i=0;i<J.length;i++) {
					save(J[i],null,opts);
					if (opts.autodelete) delete J[i];
				}
				close();
			}
		} else if (type==='String') {
			saveString(J,key);
		} else if (type==='Number') {
			if (J>=0&&J<256) saveUI8(J,key);
			else saveI32(J,key);
		} else if (type==='Boolean') {
			saveBool(J,key);
		} else if (type==='Buffer') {
			saveBlob(J,key);
		} else {
			throw 'unsupported type '+type;
		}
	}
	
	var free=function() {
		while (folders.length) close();
		kfs.free();
	}
	var currentsize=function() {
		return cur;
	}

	Object.defineProperty(handle, "size", {get : function(){ return cur; }});

	var writeFile=function(fn,opts,cb) {
		var fs=require('fs');
		var totalbyte=handle.currentsize();
		var written=0,batch=0;
		
		if (typeof cb=="undefined" || typeof opts=="function") { //do not have
			cb=opts;
		}
		opts=opts||{};
		batchsize=opts.batchsize||1024*1024*16; //16 MB

		if (fs.existsSync(fn)) fs.unlinkSync(fn);

		var writeCb=function(total,written,cb,next) {
			return function(err) {
				if (err) throw "write error"+err;
				cb(total,written);
				batch++;
				next();
			}
		}

		var next=function() {
			if (batch<batches) {
				var bufstart=batchsize*batch;
				var bufend=bufstart+batchsize;
				if (bufend>totalbyte) bufend=totalbyte;
				var sliced=kfs.buf.slice(bufstart,bufend);
				written+=sliced.length;
				fs.appendFile(fn,sliced,writeCb(totalbyte,written, cb,next));
			}
		}
		var batches=1+Math.floor(handle.size/batchsize);
		next();
	}
	handle.free=free;
	handle.saveI32=saveI32;
	handle.saveUI8=saveUI8;
	handle.saveBool=saveBool;
	handle.saveString=saveString;
	handle.saveVInt=saveVInt;
	handle.savePInt=savePInt;
	handle.saveInts=saveInts;
	handle.saveBlob=saveBlob;
	handle.save=save;
	handle.openArray=openArray;
	handle.openObject=openObject;
	handle.stringEncoding=stringEncoding;
	//this.integerEncoding=integerEncoding;
	handle.close=close;
	handle.writeFile=writeFile;
	handle.currentsize=currentsize;
	return handle;
}

module.exports=Create;
});
require.register("ksana-document/kdb_sync.js", function(exports, require, module){
/*
  syncronize version of kdb, taken from yadb
*/
var Kfs=require('./kdbfs_sync');

var Sync=function(kdb) {
	var DT=kdb.DT;
	var kfs=Kfs(kdb.fs);
	var cur=0;
	/* loadxxx functions move file pointer */
	// load variable length int
	var loadVInt =function(blocksize,count) {
		if (count==0) return [];
		var o=kfs.readBuf_packedintSync(cur,blocksize,count,true);
		cur+=o.adv;
		return o.data;
	}
	var loadVInt1=function() {
		return loadVInt(6,1)[0];
	}
	//for postings
	var loadPInt =function(blocksize,count) {
		var o=kfs.readBuf_packedintSync(cur,blocksize,count,false);
		cur+=o.adv;
		return o.data;
	}
	// item can be any type (variable length)
	// maximum size of array is 1TB 2^40
	// structure:
	// signature,5 bytes offset, payload, itemlengths
	var loadArray = function(blocksize,lazy) {
		var lengthoffset=kfs.readUI8Sync(cur)*4294967296;
		lengthoffset+=kfs.readUI32Sync(cur+1);
		cur+=5;
		var dataoffset=cur;
		cur+=lengthoffset;
		var count=loadVInt1();
		var sz=loadVInt(count*6,count);
		var o=[];
		var endcur=cur;
		cur=dataoffset; 
		for (var i=0;i<count;i++) {
			if (lazy) { 
				//store the offset instead of loading from disk
				var offset=dataoffset;
				for (var i=0;i<sz.length;i++) {
				//prefix with a \0, impossible for normal string
					o[o.length]="\0"+offset.toString(16)
						   +"\0"+sz[i].toString(16);
					offset+=sz[i];
				}
			} else {			
				o[o.length]=load({blocksize:sz[i]});
			}
		}
		cur=endcur;
		return o;
	}		
	// item can be any type (variable length)
	// support lazy load
	// structure:
	// signature,5 bytes offset, payload, itemlengths, 
	//                    stringarray_signature, keys
	var loadObject = function(blocksize,lazy, keys) {
		var start=cur;
		var lengthoffset=kfs.readUI8Sync(cur)*4294967296;
		lengthoffset+=kfs.readUI32Sync(cur+1);cur+=5;
		var dataoffset=cur;
		cur+=lengthoffset;
		var count=loadVInt1();
		var lengths=loadVInt(count*6,count);
		var keyssize=blocksize-cur+start;	
		var K=load({blocksize:keyssize});
		var o={};
		var endcur=cur;
		
		if (lazy) { 
			//store the offset instead of loading from disk
			var offset=dataoffset;
			for (var i=0;i<lengths.length;i++) {
				//prefix with a \0, impossible for normal string
				o[K[i]]="\0"+offset.toString(16)
					   +"\0"+lengths[i].toString(16);
				offset+=lengths[i];
			}
		} else {
			cur=dataoffset; 
			for (var i=0;i<count;i++) {
				o[K[i]]=(load({blocksize:lengths[i]}));
			}
		}
		if (keys) K.map(function(r) { keys.push(r)});
		cur=endcur;
		return o;
	}		
	//item is same known type
	var loadStringArray=function(blocksize,encoding) {
		var o=kfs.readStringArraySync(cur,blocksize,encoding);
		cur+=blocksize;
		return o;
	}
	var loadIntegerArray=function(blocksize,unitsize) {
		var count=loadVInt1();
		var o=kfs.readFixedArraySync(cur,count,unitsize);
		cur+=count*unitsize;
		return o;
	}
	var loadBlob=function(blocksize) {
		var o=kfs.readBufSync(cur,blocksize);
		cur+=blocksize;
		return o;
	}	
	
	var load=function(opts) {
		opts=opts||{};
		var blocksize=opts.blocksize||kfs.size; 
		var signature=kfs.readSignatureSync(cur);
		cur+=kfs.signature_size;
		var datasize=blocksize-kfs.signature_size;
		//basic types
		if (signature===DT.int32) {
			cur+=4;
			return kfs.readI32Sync(cur-4);
		} else if (signature===DT.uint8) {
			cur++;
			return kfs.readUI8Sync(cur-1);
		} else if (signature===DT.utf8) {
			var c=cur;cur+=datasize;
			return kfs.readStringSync(c,datasize,'utf8');	
		} else if (signature===DT.ucs2) {
			var c=cur;cur+=datasize;
			return kfs.readStringSync(c,datasize,'ucs2');	
		} else if (signature===DT.bool) {
			cur++;
			return !!(kfs.readUI8Sync(cur-1));
		} else if (signature===DT.blob) {
			return loadBlob(datasize);
		}
		//variable length integers
		else if (signature===DT.vint) return loadVInt(datasize);
		else if (signature===DT.pint) return loadPInt(datasize);
		//simple array
		else if (signature===DT.utf8arr) return loadStringArray(datasize,'utf8');
		else if (signature===DT.ucs2arr) return loadStringArray(datasize,'ucs2');
		else if (signature===DT.uint8arr) return loadIntegerArray(datasize,1);
		else if (signature===DT.int32arr) return loadIntegerArray(datasize,4);
		//nested structure
		else if (signature===DT.array) return loadArray(datasize,opts.lazy);
		else if (signature===DT.object) {
			return loadObject(datasize,opts.lazy,opts.keys);
		}
		else throw 'unsupported type '+signature;
	}
	var reset=function() {
		cur=0;
		kdb.setCache(load({lazy:true}));
	}
	var getall=function() {
		var output={};
		var keys=getkeys();
		for (var i in keys) {
			output[keys[i]]= get([keys[i]],true);
		}
		return output;
		
	}
	var exists=function(path) {
		if (path.length==0) return true;
		var key=path.pop();
		get(path);
		if (!path.join('\0')) return (!!kdb.key()[key]);
		var keys=kdb.key()[path.join('\0')];
		path.push(key);//put it back
		if (keys) return (keys.indexOf(key)>-1);
		else return false;
	}
	var get=function(path,recursive) {
		recursive=recursive||false;
		if (!kdb.cache()) reset();

		if (typeof path=="string") path=[path];
		var o=kdb.cache();
		if (path.length==0 &&recursive) return getall();
		var pathnow="";
		for (var i=0;i<path.length;i++) {
			var r=o[path[i]] ;

			if (r===undefined) return undefined;
			if (parseInt(i)) pathnow+="\0";
			pathnow+=path[i];
			if (typeof r=='string' && r[0]=="\0") { //offset of data to be loaded
				var keys=[];
				var p=r.substring(1).split("\0").map(
					function(item){return parseInt(item,16)});
				cur=p[0];
				var lazy=!recursive || (i<path.length-1) ;
				o[path[i]]=load({lazy:lazy,blocksize:p[1],keys:keys});
				kdb.key()[pathnow]=keys;
				o=o[path[i]];
			} else {
				o=r; //already in cache
			}
		}
		return o;
	}
	// get all keys in given path
	var getkeys=function(path) {
		if (!path) path=[]
		get(path); // make sure it is loaded
		if (path && path.length) {
			return kdb.key()[path.join("\0")];
		} else {
			return Object.keys(kdb.cache()); 
			//top level, normally it is very small
		}
		
	}

	kdb.loadSync=load;
	kdb.keysSync=getkeys;
	kdb.getSync=get;   // get a field, load if needed
	kdb.existsSync=exists;
	return kdb;
}

if (module) module.exports=Sync;

});
require.register("ksana-document/kdbfs_sync.js", function(exports, require, module){
/* OS dependent file operation */
if (typeof nodeRequire=='undefined') var nodeRequire=(typeof ksana=="undefined")?require:ksana.require;

var fs=nodeRequire('fs');
var signature_size=1;

var unpack_int = function (ar, count , reset) {
   count=count||ar.length;
   /*
	if (typeof ijs_unpack_int == 'function') {
		var R = ijs_unpack_int(ar, count, reset)
		return R
	};
	*/
  var r = [], i = 0, v = 0;
  do {
	var shift = 0;
	do {
	  v += ((ar[i] & 0x7F) << shift);
	  shift += 7;	  
	} while (ar[++i] & 0x80);
	r.push(v); if (reset) v=0;
	count--;
  } while (i<ar.length && count);
  return {data:r, adv:i };
}
var Sync=function(kfs) {
	var handle=kfs.handle;

	var readSignature=function(pos) {
		var buf=new Buffer(signature_size);
		fs.readSync(handle,buf,0,signature_size,pos);
		var signature=buf.toString('utf8',0,signature_size);
		return signature;
	}
	var readString= function(pos,blocksize,encoding) {
		encoding=encoding||'utf8';
		var buffer=new Buffer(blocksize);
		fs.readSync(handle,buffer,0,blocksize,pos);
		return buffer.toString(encoding);
	}

	var readStringArray = function(pos,blocksize,encoding) {
		if (blocksize==0) return [];
		encoding=encoding||'utf8';
		var buffer=new Buffer(blocksize);
		fs.readSync(handle,buffer,0,blocksize,pos);
		var out=buffer.toString(encoding).split('\0');
		return out;
	}
	var readUI32=function(pos) {
		var buffer=new Buffer(4);
		fs.readSync(handle,buffer,0,4,pos);
		return buffer.readUInt32BE(0);
	}
	var readI32=function(pos) {
		var buffer=new Buffer(4);
		fs.readSync(handle,buffer,0,4,pos);
		return buffer.readInt32BE(0);
	}
	var readUI8=function(pos) {
		var buffer=new Buffer(1);
		fs.readSync(handle,buffer,0,1,pos);
		return buffer.readUInt8(0);
	}
	var readBuf=function(pos,blocksize) {
		var buf=new Buffer(blocksize);
		fs.readSync(handle,buf,0,blocksize,pos);
	
		return buf;
	}
	var readBuf_packedint=function(pos,blocksize,count,reset) {
		var buf=readBuf(pos,blocksize);
		return unpack_int(buf,count,reset);
	}
	// signature, itemcount, payload
	var readFixedArray = function(pos ,count, unitsize) {
		var func;
		
		if (unitsize* count>this.size && this.size)  {
			throw "array size exceed file size"
			return;
		}
		
		var items=new Buffer( unitsize* count);
		if (unitsize===1) {
			func=items.readUInt8;
		} else if (unitsize===2) {
			func=items.readUInt16BE;
		} else if (unitsize===4) {
			func=items.readUInt32BE;
		} else throw 'unsupported integer size';
		//console.log('itemcount',itemcount,'buffer',buffer);
		fs.readSync(handle,items,0,unitsize*count,pos);
		var out=[];
		for (var i = 0; i < items.length / unitsize; i++) {
			out.push( func.apply(items,[i*unitsize]) );
		}
		return out;
	}
	
	kfs.readSignatureSync=readSignature;
	kfs.readI32Sync=readI32;
	kfs.readUI32Sync=readUI32;
	kfs.readUI8Sync=readUI8;
	kfs.readBufSync=readBuf;
	kfs.readBuf_packedintSync=readBuf_packedint;
	kfs.readFixedArraySync=readFixedArray;
	kfs.readStringSync=readString;
	kfs.readStringArraySync=readStringArray;
	kfs.signature_sizeSync=signature_size;
	
	return kfs;
}
module.exports=Sync;

});
require.register("ksana-document/html5fs.js", function(exports, require, module){
/*
http://stackoverflow.com/questions/3146483/html5-file-api-read-as-text-and-binary

automatic open file without user interaction
http://stackoverflow.com/questions/18251432/read-a-local-file-using-javascript-html5-file-api-offline-website

extension id
 chrome.runtime.getURL("vrimul.ydb")
"chrome-extension://nfdipggoinlpfldmfibcjdobcpckfgpn/vrimul.ydb"
 tell user to switch to the directory

 getPackageDirectoryEntry
*/

var read=function(handle,buffer,offset,length,position,cb) {	 //buffer and offset is not used
  var xhr = new XMLHttpRequest();
  xhr.open('GET', handle.url , true);
  var range=[position,length+position-1];
  xhr.setRequestHeader('Range', 'bytes='+range[0]+'-'+range[1]);
  xhr.responseType = 'arraybuffer';
  xhr.send();

  xhr.onload = function(e) {
    var that=this;
    setTimeout(function(){
      cb(0,that.response.byteLength,that.response);
    },0);
  }; 
}

var close=function(handle) {
	//nop
}
var fstatSync=function(handle) {
  throw "not implement yet";
}
var fstat=function(handle,cb) {
  throw "not implement yet";
}
var _open=function(fn_url,cb) {
    var handle={};
    if (fn_url.indexOf("filesystem:")==0){
      handle.url=fn_url;
      handle.fn=fn_url.substr( fn_url.lastIndexOf("/")+1);
    } else {
      handle.fn=fn_url;
      var url=API.files.filter(function(f){ return (f[0]==fn_url)});
      if (url.length) handle.url=url[0][1];
    }
    cb(handle);//url as handle
}
var open=function(fn_url,cb) {
    if (!API.initialized) {init(1024*1024,function(){
      _open.apply(this,[fn_url,cb]);
    },this)} else _open.apply(this,[fn_url,cb]);
}
var load=function(filename,mode,cb) {
  open(filename,mode,cb,true);
}
var get_date=function(url,callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, true); // Notice "HEAD" instead of "GET", //  to get only the header
    xhr.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
          callback(xhr.getResponseHeader("Last-Modified"));
        } else {
          if (this.status!==200&&this.status!==206) {
            callback("");
          }
        }
    };
    xhr.send();
}
var  getDownloadSize=function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, true); // Notice "HEAD" instead of "GET", //  to get only the header
    xhr.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
          callback(parseInt(xhr.getResponseHeader("Content-Length")));
        } else {
          if (this.status!==200&&this.status!==206) {
            callback(0);//no such file     
          }
        }
    };
    xhr.send();
};
var checkUpdate=function(url,fn,cb) {
    if (!url) {
      cb(false);
      return;
    }
    get_date(url,function(d){
      API.fs.root.getFile(fn, {create: false, exclusive: false}, function(fileEntry) {
          fileEntry.getMetadata(function(metadata){
            var localDate=Date.parse(metadata.modificationTime);
            var urlDate=Date.parse(d);
            cb(urlDate>localDate);
          });
    },function(){//error
      cb(false); //missing local file
    });
  });
}
var download=function(url,fn,cb,statuscb,context) {
   var totalsize=0,batches=null,written=0;
   var fileEntry=0, fileWriter=0;
   var createBatches=function(size) {
      var bytes=1024*1024, out=[];
      var b=Math.floor(size / bytes);
      var last=size %bytes;
      for (var i=0;i<=b;i++) {
        out.push(i*bytes);
      }
      out.push(b*bytes+last);
      return out;
   }
   var finish=function() { //remove old file and rename temp.kdb 
         rm(fn,function(){
            fileEntry.moveTo(fileEntry.filesystem.root, fn,function(){
              setTimeout( cb.bind(context,false) , 0) ; 
            },function(e){
              console.log("faile",e)
            });
         },this); 
   }
    var tempfn="temp.kdb";
    var batch=function(b) {
       var abort=false;
       var xhr = new XMLHttpRequest();
       var requesturl=url+"?"+Math.random();
       xhr.open('get', requesturl, true);
       xhr.setRequestHeader('Range', 'bytes='+batches[b]+'-'+(batches[b+1]-1));
       xhr.responseType = 'blob';    
       xhr.addEventListener('load', function() {
         var blob=this.response;
		 fileEntry.createWriter(function(fileWriter) {
         fileWriter.seek(fileWriter.length);
         fileWriter.write(blob);
         written+=blob.size;
         fileWriter.onwriteend = function(e) {
           if (statuscb) {
              abort=statuscb.apply(context,[ fileWriter.length / totalsize,totalsize ]);
              if (abort) setTimeout( cb.bind(context,false) , 0) ;
           }
           b++;
           if (!abort) {
              if (b<batches.length-1) setTimeout(batch.bind(context,b),0);
              else                    finish();
           }
         };
        }, console.error);
       },false);
       xhr.send();
    }

     getDownloadSize(url,function(size){
       totalsize=size;
       if (!size) {
          if (cb) cb.apply(context,[false]);
       } else {//ready to download
        rm(tempfn,function(){
           batches=createBatches(size);
           if (statuscb) statuscb.apply(context,[ 0, totalsize ]);
           
       	   API.fs.root.getFile(tempfn, {create: 1, exclusive: false}, function(_fileEntry) {
       	   	   	fileEntry=_fileEntry;
           		batch(0);
       	   });
        },this);
      }
     });
}

var readFile=function(filename,cb,context) {
  API.fs.root.getFile(filename, function(fileEntry) {
      var reader = new FileReader();
      reader.onloadend = function(e) {
          if (cb) cb.apply(cb,[this.result]);
        };            
    }, console.error);
}
var writeFile=function(filename,buf,cb,context){
   API.fs.root.getFile(filename, {create: true, exclusive: true}, function(fileEntry) {
      fileEntry.createWriter(function(fileWriter) {
        fileWriter.write(buf);
        fileWriter.onwriteend = function(e) {
          if (cb) cb.apply(cb,[buf.byteLength]);
        };            
      }, console.error);
    }, console.error);
}

var readdir=function(cb,context) {
   var dirReader = API.fs.root.createReader();
   var out=[],that=this;
    // Need to recursively read directories until there are no more results.
    dirReader.readEntries(function(entries) {
      if (entries.length) {
          for (var i = 0, entry; entry = entries[i]; ++i) {
            if (entry.isFile) {
              out.push([entry.name,entry.toURL ? entry.toURL() : entry.toURI()]);
            }
          }
      }
      API.files=out;
      if (cb) cb.apply(context,[out]);
    }, function(){
      if (cb) cb.apply(context,[null]);
    });
}
var getFileURL=function(filename) {
  if (!API.files ) return null;
  var file= API.files.filter(function(f){return f[0]==filename});
  if (file.length) return file[0][1];
}
var rm=function(filename,cb,context) {
   var url=getFileURL(filename);
   if (url) rmURL(url,cb,context);
   else if (cb) cb.apply(context,[false]);
}

var rmURL=function(filename,cb,context) {
    webkitResolveLocalFileSystemURL(filename, function(fileEntry) {
      fileEntry.remove(function() {
        if (cb) cb.apply(context,[true]);
      }, console.error);
    },  function(e){
      if (cb) cb.apply(context,[false]);//no such file
    });
}
function errorHandler(e) {
  console.error('Error: ' +e.name+ " "+e.message);
}
var initfs=function(grantedBytes,cb,context) {
  webkitRequestFileSystem(PERSISTENT, grantedBytes,  function(fs) {
    API.fs=fs;
    API.quota=grantedBytes;
    readdir(function(){
      API.initialized=true;
      cb.apply(context,[grantedBytes,fs]);
    },context);
  }, errorHandler);
}
var init=function(quota,cb,context) {
  navigator.webkitPersistentStorage.requestQuota(quota, 
      function(grantedBytes) {

        initfs(grantedBytes,cb,context);
    }, console.error 
  );
}
var queryQuota=function(cb,context) {
    var that=this;
    navigator.webkitPersistentStorage.queryUsageAndQuota( 
     function(usage,quota){
        initfs(quota,function(){
          cb.apply(context,[usage,quota]);
        },context);
    });
}
//if (typeof navigator!="undefined" && navigator.webkitPersistentStorage) init(1024*1024);
var API={
  load:load
  ,open:open
  ,read:read
  ,fstatSync:fstatSync
  ,fstat:fstat,close:close
  ,init:init
  ,readdir:readdir
  ,checkUpdate:checkUpdate
  ,rm:rm
  ,rmURL:rmURL
  ,getFileURL:getFileURL
  ,getDownloadSize:getDownloadSize
  ,writeFile:writeFile
  ,readFile:readFile
  ,download:download
  ,queryQuota:queryQuota}

  module.exports=API;
});
require.register("ksana-document/kdbfs_android.js", function(exports, require, module){
/*
  JAVA can only return Number and String
	array and buffer return in string format
	need JSON.parse
*/
var verbose=0;

var readSignature=function(pos,cb) {
	if (verbose) console.debug("read signature");
	var signature=kfs.readUTF8String(this.handle,pos,1);
	if (verbose) console.debug(signature,signature.charCodeAt(0));
	cb.apply(this,[signature]);
}
var readI32=function(pos,cb) {
	if (verbose) console.debug("read i32 at "+pos);
	var i32=kfs.readInt32(this.handle,pos);
	if (verbose) console.debug(i32);
	cb.apply(this,[i32]);	
}
var readUI32=function(pos,cb) {
	if (verbose) console.debug("read ui32 at "+pos);
	var ui32=kfs.readUInt32(this.handle,pos);
	if (verbose) console.debug(ui32);
	cb.apply(this,[ui32]);
}
var readUI8=function(pos,cb) {
	if (verbose) console.debug("read ui8 at "+pos); 
	var ui8=kfs.readUInt8(this.handle,pos);
	if (verbose) console.debug(ui8);
	cb.apply(this,[ui8]);
}
var readBuf=function(pos,blocksize,cb) {
	if (verbose) console.debug("read buffer at "+pos+ " blocksize "+blocksize);
	var buf=kfs.readBuf(this.handle,pos,blocksize);
	var buff=JSON.parse(buf);
	if (verbose) console.debug("buffer length"+buff.length);
	cb.apply(this,[buff]);	
}
var readBuf_packedint=function(pos,blocksize,count,reset,cb) {
	if (verbose) console.debug("read packed int at "+pos+" blocksize "+blocksize+" count "+count);
	var buf=kfs.readBuf_packedint(this.handle,pos,blocksize,count,reset);
	var adv=parseInt(buf);
	var buff=JSON.parse(buf.substr(buf.indexOf("[")));
	if (verbose) console.debug("packedInt length "+buff.length+" first item="+buff[0]);
	cb.apply(this,[{data:buff,adv:adv}]);	
}


var readString= function(pos,blocksize,encoding,cb) {
	if (verbose) console.debug("readstring at "+pos+" blocksize " +blocksize+" enc:"+encoding);
	if (encoding=="ucs2") {
		var str=kfs.readULE16String(this.handle,pos,blocksize);
	} else {
		var str=kfs.readUTF8String(this.handle,pos,blocksize);	
	}	 
	if (verbose) console.debug(str);
	cb.apply(this,[str]);	
}

var readFixedArray = function(pos ,count, unitsize,cb) {
	if (verbose) console.debug("read fixed array at "+pos+" count "+count+" unitsize "+unitsize); 
	var buf=kfs.readFixedArray(this.handle,pos,count,unitsize);
	var buff=JSON.parse(buf);
	if (verbose) console.debug("array length"+buff.length);
	cb.apply(this,[buff]);	
}
var readStringArray = function(pos,blocksize,encoding,cb) {
	if (verbose) console.log("read String array at "+pos+" blocksize "+blocksize +" enc "+encoding); 
	encoding = encoding||"utf8";
	var buf=kfs.readStringArray(this.handle,pos,blocksize,encoding);
	//var buff=JSON.parse(buf);
	if (verbose) console.debug("read string array");
	var buff=buf.split("\uffff"); //cannot return string with 0
	if (verbose) console.debug("array length"+buff.length);
	cb.apply(this,[buff]);	
}
var mergePostings=function(positions,cb) {
	var buf=kfs.mergePostings(this.handle,JSON.stringify(positions));
	if (!buf || buf.length==0) return [];
	else return JSON.parse(buf);
}

var free=function() {
	//console.log('closing ',handle);
	kfs.close(this.handle);
}
var Open=function(path,opts,cb) {
	opts=opts||{};
	var signature_size=1;
	var setupapi=function() { 
		this.readSignature=readSignature;
		this.readI32=readI32;
		this.readUI32=readUI32;
		this.readUI8=readUI8;
		this.readBuf=readBuf;
		this.readBuf_packedint=readBuf_packedint;
		this.readFixedArray=readFixedArray;
		this.readString=readString;
		this.readStringArray=readStringArray;
		this.signature_size=signature_size;
		this.mergePostings=mergePostings;
		this.free=free;
		this.size=kfs.getFileSize(this.handle);
		if (verbose) console.log("filesize  "+this.size);
		if (cb)	cb.call(this);
	}

	this.handle=kfs.open(path);
	this.opened=true;
	setupapi.call(this);
	return this;
}

module.exports=Open;
});
require.register("ksana-document/kdbfs_ios.js", function(exports, require, module){
/*
  JSContext can return all Javascript types.
*/
var verbose=1;

var readSignature=function(pos,cb) {
	if (verbose)  ksanagap.log("read signature at "+pos);
	var signature=kfs.readUTF8String(this.handle,pos,1);
	if (verbose)  ksanagap.log(signature+" "+signature.charCodeAt(0));
	cb.apply(this,[signature]);
}
var readI32=function(pos,cb) {
	if (verbose)  ksanagap.log("read i32 at "+pos);
	var i32=kfs.readInt32(this.handle,pos);
	if (verbose)  ksanagap.log(i32);
	cb.apply(this,[i32]);	
}
var readUI32=function(pos,cb) {
	if (verbose)  ksanagap.log("read ui32 at "+pos);
	var ui32=kfs.readUInt32(this.handle,pos);
	if (verbose)  ksanagap.log(ui32);
	cb.apply(this,[ui32]);
}
var readUI8=function(pos,cb) {
	if (verbose)  ksanagap.log("read ui8 at "+pos); 
	var ui8=kfs.readUInt8(this.handle,pos);
	if (verbose)  ksanagap.log(ui8);
	cb.apply(this,[ui8]);
}
var readBuf=function(pos,blocksize,cb) {
	if (verbose)  ksanagap.log("read buffer at "+pos);
	var buf=kfs.readBuf(this.handle,pos,blocksize);
	if (verbose)  ksanagap.log("buffer length"+buf.length);
	cb.apply(this,[buf]);	
}
var readBuf_packedint=function(pos,blocksize,count,reset,cb) {
	if (verbose)  ksanagap.log("read packed int fast, blocksize "+blocksize+" at "+pos);var t=new Date();
	var buf=kfs.readBuf_packedint(this.handle,pos,blocksize,count,reset);
	if (verbose)  ksanagap.log("return from packedint, time" + (new Date()-t));
	if (typeof buf.data=="string") {
		buf.data=eval("["+buf.data.substr(0,buf.data.length-1)+"]");
	}
	if (verbose)  ksanagap.log("unpacked length"+buf.data.length+" time" + (new Date()-t) );
	cb.apply(this,[buf]);
}


var readString= function(pos,blocksize,encoding,cb) {

	if (verbose)  ksanagap.log("readstring at "+pos+" blocksize "+blocksize+" "+encoding);var t=new Date();
	if (encoding=="ucs2") {
		var str=kfs.readULE16String(this.handle,pos,blocksize);
	} else {
		var str=kfs.readUTF8String(this.handle,pos,blocksize);	
	}
	if (verbose)  ksanagap.log(str+" time"+(new Date()-t));
	cb.apply(this,[str]);	
}

var readFixedArray = function(pos ,count, unitsize,cb) {
	if (verbose)  ksanagap.log("read fixed array at "+pos); var t=new Date();
	var buf=kfs.readFixedArray(this.handle,pos,count,unitsize);
	if (verbose)  ksanagap.log("array length "+buf.length+" time"+(new Date()-t));
	cb.apply(this,[buf]);	
}
var readStringArray = function(pos,blocksize,encoding,cb) {
	//if (verbose)  ksanagap.log("read String array "+blocksize +" "+encoding); 
	encoding = encoding||"utf8";
	if (verbose)  ksanagap.log("read string array at "+pos);var t=new Date();
	var buf=kfs.readStringArray(this.handle,pos,blocksize,encoding);
	if (typeof buf=="string") buf=buf.split("\0");
	//var buff=JSON.parse(buf);
	//var buff=buf.split("\uffff"); //cannot return string with 0
	if (verbose)  ksanagap.log("string array length"+buf.length+" time"+(new Date()-t));
	cb.apply(this,[buf]);
}

var mergePostings=function(positions) {
	var buf=kfs.mergePostings(this.handle,positions);
	if (typeof buf=="string") {
		buf=eval("["+buf.substr(0,buf.length-1)+"]");
	}
	return buf;
}
var free=function() {
	////if (verbose)  ksanagap.log('closing ',handle);
	kfs.close(this.handle);
}
var Open=function(path,opts,cb) {
	opts=opts||{};
	var signature_size=1;
	var setupapi=function() { 
		this.readSignature=readSignature;
		this.readI32=readI32;
		this.readUI32=readUI32;
		this.readUI8=readUI8;
		this.readBuf=readBuf;
		this.readBuf_packedint=readBuf_packedint;
		this.readFixedArray=readFixedArray;
		this.readString=readString;
		this.readStringArray=readStringArray;
		this.signature_size=signature_size;
		this.mergePostings=mergePostings;
		this.free=free;
		this.size=kfs.getFileSize(this.handle);
		if (verbose)  ksanagap.log("filesize  "+this.size);
		if (cb)	cb.call(this);
	}

	this.handle=kfs.open(path);
	this.opened=true;
	setupapi.call(this);
	return this;
}

module.exports=Open;
});
require.register("ksana-document/kse.js", function(exports, require, module){
/*
  Ksana Search Engine.

  need a KDE instance to be functional
  
*/
var bsearch=require("./bsearch");

var _search=function(engine,q,opts,cb) {
	if (typeof engine=="string") {//browser only
		//search on remote server
		var kde=Require("ksana-document").kde;
		var $kse=Require("ksanaforge-kse").$yase; 
		opts.dbid=engine;
		opts.q=q;
		$kse.search(opts,cb);
	} else {//nw or brower
		var dosearch=require("./search");
		return dosearch(engine,q,opts,cb);		
	}
}

var _highlightPage=function(engine,fileid,pageid,opts,cb){
	if (opts.q) {
		_search(engine,opts.q,opts,function(Q){
			api.excerpt.highlightPage(Q,fileid,pageid,opts,cb);
		});
	} else {
		api.excerpt.getPage(engine,fileid,pageid,cb);
	}
}
var _highlightRange=function(engine,start,end,opts,cb){
	if (opts.q) {
		_search(engine,opts.q,opts,function(Q){
			api.excerpt.highlightRange(Q,start,end,opts,cb);
		});
	} else {
		api.excerpt.getRange(engine,start,end,cb);
	}
}
var _highlightFile=function(engine,fileid,opts,cb){
	if (opts.q) {
		_search(engine,opts.q,opts,function(Q){
			api.excerpt.highlightFile(Q,fileid,opts,cb);
		});
	} else {
		api.excerpt.getFile(engine,fileid,function(data) {
			cb.apply(engine.context,[data]);
		});
	}
}

var vpos2filepage=function(engine,vpos) {
    var pageOffsets=engine.get("pageOffsets");
    var fileOffsets=engine.get(["fileOffsets"]);
    var pageNames=engine.get("pageNames");
    var fileid=bsearch(fileOffsets,vpos+1,true);
    fileid--;
    var pageid=bsearch(pageOffsets,vpos+1,true);
    
/*
    pageid--;
    while (pageid&&pageid<pageOffsets.length-1&&
    	pageOffsets[pageid-1]==pageOffsets[pageid]) {
    	pageid++;
    }
*/
    var fileOffset=fileOffsets[fileid];
    var pageOffset=bsearch(pageOffsets,fileOffset+2,true); //quick fix for jiangkangyur
    pageOffset--;
    pageid-=pageOffset;
    return {file:fileid,page:pageid};
}
var api={
	search:_search
	,concordance:require("./concordance")
	,regex:require("./regex")
	,highlightPage:_highlightPage
	,highlightFile:_highlightFile
//	,highlightRange:_highlightRange
	,excerpt:require("./excerpt")
	,vpos2filepage:vpos2filepage
}
module.exports=api;
});
require.register("ksana-document/kde.js", function(exports, require, module){
/* Ksana Database Engine
   middleware for client and server.
   each ydb has one engine instance.
   all data from server will be cache at client side to save network roundtrip.
*/
if (typeof nodeRequire=='undefined') var nodeRequire=(typeof ksana=="undefined")?require:ksana.require;
var pool={},localPool={};
var apppath="";
var bsearch=require("./bsearch");
var strsep="\uffff";
var _getSync=function(paths,opts) {
	var out=[];
	for (var i in paths) {
		out.push(this.getSync(paths[i],opts));	
	}
	return out;
}
var _gets=function(paths,opts,cb) { //get many data with one call
	if (!paths) return ;
	if (typeof paths=='string') {
		paths=[paths];
	}
	var engine=this, output=[];

	var makecb=function(path){
		return function(data){
				if (!(data && typeof data =='object' && data.__empty)) output.push(data);
				engine.get(path,opts,taskqueue.shift());
		};
	};

	var taskqueue=[];
	for (var i=0;i<paths.length;i++) {
		if (typeof paths[i]=="null") { //this is only a place holder for key data already in client cache
			output.push(null);
		} else {
			taskqueue.push(makecb(paths[i]));
		}
	};

	taskqueue.push(function(data){
		output.push(data);
		cb.apply(engine.context||engine,[output,paths]); //return to caller
	});

	taskqueue.shift()({__empty:true}); //run the task
}

var toDoc=function(pagenames,texts,others) {
	if (typeof Require!="undefined") {
		var D=Require("ksana-document").document;
	} else {
		var D=nodeRequire("./document");	
	}
	var d=D.createDocument() ,revert=null;
	for (var i=0;i<texts.length;i++) {
		if (others.reverts && others.reverts[i].trim()) revert=JSON.parse(others.reverts[i]);
		else revert=null;
		var p=null;
		if (others.parents) p=others.parents[i];
		d.createPage({n:pagenames[i],t:texts[i],p:p,r:revert});
	}
	if (others.markups) d.addMarkups(others.markups);
	d.endCreatePages();
	return d;
}
var getFileRange=function(i) {
	var engine=this;

	var filePageCount=engine.get(["filePageCount"]);
	if (filePageCount) {
		if (i==0) {
			return {start:0,end:filePageCount[0]-1};
		} else {
			return {start:filePageCount[i-1],end:filePageCount[i]-1};
		}
	}

	//old buggy code
	var fileNames=engine.get(["fileNames"]);
	var fileOffsets=engine.get(["fileOffsets"]);
	var pageOffsets=engine.get(["pageOffsets"]);
	var pageNames=engine.get(["pageNames"]);
	var fileStart=fileOffsets[i], fileEnd=fileOffsets[i+1]-1;

	
	var start=bsearch(pageOffsets,fileStart,true);	
	//if (pageOffsets[start]==fileStart) start--;
	
	//work around for jiangkangyur
	while (pageNames[start+1]=="_") start++;

  //if (i==0) start=0; //work around for first file
	var end=bsearch(pageOffsets,fileEnd,true);


	//in case of items with same value
	//return the last one
	

	//while (pageOffsets[end+1]==pageOffsets[end]) end--;
	/*
	if (i==0) {
		var files="", offsets=""
		for (var i=0;i<33;i++) offsets+=i+"."+fileOffsets[i]+"="+fileNames[i]+"\n";
		console.log(files);
		
		for (var i=0;i<700;i++) offsets+=i+"."+pageOffsets[i]+"="+pageNames[i]+"\n";
		console.log(offsets);
	}
	*/
	return {start:start,end:end};
}

var getfp=function(absolutepage) {
	var fileOffsets=this.get(["fileOffsets"]);
	var pageOffsets=this.get(["pageOffsets"]);
	var pageoffset=pageOffsets[absolutepage];
	var file=bsearch(fileOffsets,pageoffset,true)-1;

	var fileStart=fileOffsets[file];
	var start=bsearch(pageOffsets,fileStart,true);	

	var page=absolutepage-start-1;
	return {file:file,page:page};
}
//return array of object of nfile npage given pagename
var findPage=function(pagename) {
	var pagenames=this.get("pageNames");
	var out=[];
	for (var i=0;i<pagenames.length;i++) {
		if (pagenames[i]==pagename) {
			var fp=getfp.apply(this,[i]);
			out.push({file:fp.file,page:fp.page,abspage:i});
		}
	}

	return out;
}
var getFilePageOffsets=function(i) {
	var pageOffsets=this.get("pageOffsets");
	var range=getFileRange.apply(this,[i]);
	return pageOffsets.slice(range.start,range.end+1);
}

var getFilePageNames=function(i) {
	var range=getFileRange.apply(this,[i]);
	var pageNames=this.get("pageNames");
	return pageNames.slice(range.start,range.end+1);
}
var getDocument=function(filename,markups,cb){
	var engine=this;
	var filenames=engine.get("fileNames");

	if (typeof markups=="function")  { //no markups
		cb=markups;
		markups=null;
	}

	var i=filenames.indexOf(filename);
	if (i==-1) {
		cb(null);
	} else {
		var pagenames=getFilePageNames.apply(engine,[i]);
		var files=engine.get(["files",i],true,function(file){
			var parentId=null,reverts=null;
			if (file) {
				parentId=file.parentId;
				reverts=file.reverts;
			}
			engine.get(["fileContents",i],true,function(data){
				cb(toDoc(pagenames,data,{parents:parentId,reverts:reverts,markups:markups}));
			});			
		});
	}
}
var createLocalEngine=function(kdb,cb,context) {
	var engine={kdb:kdb, queryCache:{}, postingCache:{}, cache:{}};
	if ((kdb.fs && kdb.fs.html5fs) || typeof ksanagap!="undefined") {
		var customfunc=Require("ksana-document").customfunc;
	} else {
		var customfunc=nodeRequire("ksana-document").customfunc;		
	}	

	if (typeof context=="object") engine.context=context;
	engine.get=function(path,opts,cb) {
		if (typeof opts=="function") {
			cb=opts;
			opts={recursive:false};
		}
		if (!path) {
			if (cb) cb(null);
			return null;
		}
		if (typeof cb!="function") {
			return engine.kdb.get(path,opts);
		}

		if (typeof path=="string") {
			return engine.kdb.get([path],opts,cb);
		} else if (typeof path[0] =="string") {
			return engine.kdb.get(path,opts,cb);
		} else if (typeof path[0] =="object") {
			return _gets.apply(engine,[path,opts,cb]);
		} else {
			cb(null);	
		}
	};	

	engine.fileOffset=fileOffset;
	engine.folderOffset=folderOffset;
	engine.pageOffset=pageOffset;
	engine.getDocument=getDocument;
	engine.getFilePageNames=getFilePageNames;
	engine.getFilePageOffsets=getFilePageOffsets;
	engine.findPage=findPage;
	//only local engine allow getSync
	if (kdb.fs.getSync) engine.getSync=engine.kdb.getSync;
	
	//speedy native functions
	if (kdb.fs.mergePostings) {
		engine.mergePostings=kdb.fs.mergePostings.bind(kdb.fs);
	}
	
	var preload=[["meta"],["fileNames"],["fileOffsets"],
	["tokens"],["postingslen"],["pageNames"],["pageOffsets"],["filePageCount"]];

	var setPreload=function(res) {
		engine.dbname=res[0].name;
		engine.customfunc=customfunc.getAPI(res[0].config);
		engine.ready=true;
	}
	var opts={recursive:true};
	if (typeof cb=="function") {
		_gets.apply(engine,[  preload, opts,function(res){
			setPreload(res);
			cb.apply(engine.context,[engine]);
		}]);
	} else {
		setPreload(_getSync.apply(engine,[preload,opts]));
	}
	return engine;
}

var getRemote=function(path,opts,cb) {
	var $kse=Require("ksanaforge-kse").$ksana; 
	var engine=this;
	if (!engine.ready) {
		console.error("remote connection not established yet");
		return;
	} 
	if (typeof opts=="function") {
		cb=opts;
		opts={recursive:false};
	}
	opts.recursive=opts.recursive||false;
	if (typeof path=="string") path=[path];

	if (path[0] instanceof Array) { //multiple paths
		var paths=[],output=[];
		for (var i=0;i<path.length;i++) {
			var cachepath=path[i].join(strsep);
			var data=engine.cache[cachepath];
			if (typeof data!="undefined") {
				paths.push(null);//  place holder for LINE 28
				output.push(data); //put cached data into output
			} else{
				engine.fetched++;
				paths.push(path[i]); //need to ask server
				output.push(null); //data is unknown yet
			}
		}
		//now ask server for unknown datum
		engine.traffic++;
		var newopts={recursive:!!opts.recursive, address:opts.address,
			key:paths,db:engine.kdbid};
		$kse("get",newopts).done(function(datum){
			//merge the server result with cached 
			for (var i=0;i<output.length;i++) {
				if (datum[i] && paths[i]) {
					var cachekey=paths[i].join(strsep);
					engine.cache[cachepath]=datum[i];
					output[i]=datum[i];
				}
			}
			cb.apply(engine.context,[output]);	
		});
	} else { //single path
		var cachepath=path.join(strsep);
		var data=engine.cache[cachepath];
		if (typeof data!="undefined") {
			if (cb) cb.apply(engine.context,[data]);
			return data;//in cache , return immediately
		} else {
			engine.traffic++;
			engine.fetched++;
			var opts={key:path,recursive:recursive,db:engine.kdbid};
			$kse("get",opts).done(function(data){
				engine.cache[cachepath]=data;
				if (cb) cb.apply(engine.context,[data]);	
			});
		}
	}
}
var pageOffset=function(pagename) {
	var engine=this;
	if (arguments.length>1) throw "argument : pagename ";

	var pageNames=engine.get("pageNames");
	var pageOffsets=engine.get("pageOffsets");

	var i=pageNames.indexOf(pagename);
	return (i>-1)?pageOffsets[i]:0;
}
var fileOffset=function(fn) {
	var engine=this;
	var filenames=engine.get("fileNames");
	var offsets=engine.get("fileOffsets");
	var i=filenames.indexOf(fn);
	if (i==-1) return null;
	return {start: offsets[i], end:offsets[i+1]};
}

var folderOffset=function(folder) {
	var engine=this;
	var start=0,end=0;
	var filenames=engine.get("fileNames");
	var offsets=engine.get("fileOffsets");
	for (var i=0;i<filenames.length;i++) {
		if (filenames[i].substring(0,folder.length)==folder) {
			if (!start) start=offsets[i];
			end=offsets[i];
		} else if (start) break;
	}
	return {start:start,end:end};
}

var createEngine=function(kdbid,context,cb) {
	if (typeof context=="function"){
		cb=context;
	}
	//var link=Require("./link");
	var customfunc=Require("ksana-document").customfunc;
	var $kse=Require("ksanaforge-kse").$ksana; 
	var engine={kdbid:kdbid, cache:{} , 
	postingCache:{}, queryCache:{}, traffic:0,fetched:0};
	engine.setContext=function(ctx) {this.context=ctx};
	engine.get=getRemote;
	engine.fileOffset=fileOffset;
	engine.folderOffset=folderOffset;
	engine.pageOffset=pageOffset;
	engine.getDocument=getDocument;
	engine.getFilePageNames=getFilePageNames;
	engine.getFilePageOffsets=getFilePageOffsets;
	engine.findPage=findPage;

	if (typeof context=="object") engine.context=context;

	//engine.findLinkBy=link.findLinkBy;
	$kse("get",{key:[["meta"],["fileNames"],["fileOffsets"],
		["tokens"],["postingslen"],,["pageNames"],["pageOffsets"],["filePageCount"]], 
		recursive:true,db:kdbid}).done(function(res){
		engine.dbname=res[0].name;

		engine.cache["fileNames"]=res[1];
		engine.cache["fileOffsets"]=res[2];
		engine.cache["tokens"]=res[3];
		engine.cache["postingslen"]=res[4];
		engine.cache["pageNames"]=res[5];
		engine.cache["pageOffsets"]=res[6];
		engine.cache["filePageCount"]=res[7];

//		engine.cache["tokenId"]=res[4];
//		engine.cache["files"]=res[2];

		engine.customfunc=customfunc.getAPI(res[0].config);
		engine.cache["meta"]=res[0]; //put into cache manually

		engine.ready=true;
		//console.log("remote kde connection ["+kdbid+"] established.");
		if (cb) cb.apply(context,[engine]);
	})


	return engine;
}
 //TODO delete directly from kdb instance
 //kdb.free();
var closeLocal=function(kdbid) {
	var engine=localPool[kdbid];
	if (engine) {
		engine.kdb.free();
		delete localPool[kdbid];
	}
}
var close=function(kdbid) {
	var engine=pool[kdbid];
	if (engine) {
		engine.kdb.free();
		delete pool[kdbid];
	}
}
var open=function(kdbid,cb,context) {
	if (typeof io=="undefined") { //for offline mode
		return openLocal(kdbid,cb,context);
	}

	var engine=pool[kdbid];
	if (engine) {
		if (cb) cb.apply(context||engine.context,[engine]);
		return engine;
	}
	engine=createEngine(kdbid,context,cb);

	pool[kdbid]=engine;
	return engine;
}
var getLocalTries=function(kdbfn) {
	return ["./"+kdbfn  //TODO , allow any depth
	           ,apppath+"/"+kdbfn,
	           ,apppath+"/ksana_databases/"+kdbfn
	           ,apppath+"/"+kdbfn,
	           ,"./ksana_databases/"+kdbfn
	           ,"../"+kdbfn
	           ,"../ksana_databases/"+kdbfn
	           ,"../../"+kdbfn
	           ,"../../ksana_databases/"+kdbfn
	           ,"../../../"+kdbfn
	           ,"../../../ksana_databases/"+kdbfn
	           ];
}
var openLocalKsanagap=function(kdbid,cb,context) {
	var engine=localPool[kdbid];
	if (engine) {
		if (cb) cb.apply(context||engine.context,[engine]);
		return engine;
	}

	var Kdb=Require('ksana-document').kdb;
	var kdbfn=kdbid;
	if (kdbfn.indexOf(".kdb")==-1) kdbfn+=".kdb";

	var tries=getLocalTries(kdbfn);

	for (var i=0;i<tries.length;i++) {
		if (fs.existsSync(tries[i])) {
			//console.log("kdb path: "+nodeRequire('path').resolve(tries[i]));
			var kdb=new Kdb(tries[i]);
			createLocalEngine(kdb,function(engine){
				localPool[kdbid]=engine;
				cb.apply(context||engine.context,[engine]);
			},context);
			return null;
		}
	}
	if (cb) cb(null);
	return null;

}
var openLocalNode=function(kdbid,cb,context) {
	var fs=nodeRequire('fs');
	var engine=localPool[kdbid];
	if (engine) {
		if (cb) cb.apply(context||engine.context,[engine]);
		return engine;
	}

	var Kdb=nodeRequire('ksana-document').kdb;
	var kdbfn=kdbid;
	if (kdbfn.indexOf(".kdb")==-1) kdbfn+=".kdb";

	var tries=getLocalTries(kdbfn);

	for (var i=0;i<tries.length;i++) {
		if (fs.existsSync(tries[i])) {
			//console.log("kdb path: "+nodeRequire('path').resolve(tries[i]));
			new Kdb(tries[i],function(kdb){
				createLocalEngine(kdb,function(engine){
						localPool[kdbid]=engine;
						cb.apply(context||engine.context,[engine]);
				},context);
			});
			return engine;
		}
	}
	if (cb) cb.apply(context,[null]);
	return null;
}
var openLocalNodeWebkit=function(kdbid,cb,context) {
	var fs=nodeRequire('fs');
	var engine=localPool[kdbid];
	if (engine) {
		if (cb) cb.apply(context||engine.context,[engine]);
		return engine;
	}

	var Kdb=Require('ksana-document').kdb;
	var kdbfn=kdbid;
	if (kdbfn.indexOf(".kdb")==-1) kdbfn+=".kdb";

	var tries=getLocalTries(kdbfn);

	for (var i=0;i<tries.length;i++) {
		if (fs.existsSync(tries[i])) {
			//console.log("kdb path: "+nodeRequire('path').resolve(tries[i]));
			new Kdb(tries[i],function(kdb){
				createLocalEngine(kdb,function(engine){
						localPool[kdbid]=engine;
						cb.apply(context||engine.context,[engine]);
				},context);
			});
			return engine;
		}
	}
	if (cb) cb.apply(context,[null]);
	return null;
}

var openLocalHtml5=function(kdbid,cb,context) {
	var Kdb=Require('ksana-document').kdb;
	
	var engine=localPool[kdbid];
	if (engine) {
		if (cb) cb.apply(context||engine.context,[engine]);
		return engine;
	}
	var Kdb=Require('ksana-document').kdb;
	var kdbfn=kdbid;
	if (kdbfn.indexOf(".kdb")==-1) kdbfn+=".kdb";
	new Kdb(kdbfn,function(handle){
		createLocalEngine(handle,function(engine){
			localPool[kdbid]=engine;
			cb.apply(context||engine.context,[engine]);
		},context);		
	});
}
//omit cb for syncronize open
var openLocal=function(kdbid,cb,context)  {
	if (typeof ksanagap=="undefined") {
		if (kdbid.indexOf("filesystem:")>-1 || typeof process=="undefined") {
			openLocalHtml5(kdbid,cb,context);
		} else {
			openLocalNode(kdbid,cb,context);
		}		
	} else {
		if (ksanagap.platform=="node-webkit") {
			openLocalNodeWebkit(kdbid,cb,context);
		} else if (ksanagap.platform=="chrome") {
			openLocalHtml5(kdbid,cb,context);
		} else {
			openLocalKsanagap(kdbid,cb,context);	
		}
		
	}
}
var setPath=function(path) {
	apppath=path;
	console.log("set path",path)
}

var enumKdb=function(cb,context){
	Require("ksana-document").html5fs.readdir(function(out){
		cb.apply(this,[out]);
	},context||this);
}

module.exports={openLocal:openLocal, open:open, close:close, 
	setPath:setPath, closeLocal:closeLocal, enumKdb:enumKdb};
});
require.register("ksana-document/boolsearch.js", function(exports, require, module){
/*
  TODO
  and not

*/

// http://jsfiddle.net/neoswf/aXzWw/
var plist=require('./plist');
function intersect(I, J) {
  var i = j = 0;
  var result = [];

  while( i < I.length && j < J.length ){
     if      (I[i] < J[j]) i++; 
     else if (I[i] > J[j]) j++; 
     else {
       result[result.length]=l[i];
       i++;j++;
     }
  }
  return result;
}

/* return all items in I but not in J */
function subtract(I, J) {
  var i = j = 0;
  var result = [];

  while( i < I.length && j < J.length ){
    if (I[i]==J[j]) {
      i++;j++;
    } else if (I[i]<J[j]) {
      while (I[i]<J[j]) result[result.length]= I[i++];
    } else {
      while(J[j]<I[i]) j++;
    }
  }

  if (j==J.length) {
    while (i<I.length) result[result.length]=I[i++];
  }

  return result;
}

var union=function(a,b) {
	if (!a || !a.length) return b;
	if (!b || !b.length) return a;
    var result = [];
    var ai = 0;
    var bi = 0;
    while (true) {
        if ( ai < a.length && bi < b.length) {
            if (a[ai] < b[bi]) {
                result[result.length]=a[ai];
                ai++;
            } else if (a[ai] > b[bi]) {
                result[result.length]=b[bi];
                bi++;
            } else {
                result[result.length]=a[ai];
                result[result.length]=b[bi];
                ai++;
                bi++;
            }
        } else if (ai < a.length) {
            result.push.apply(result, a.slice(ai, a.length));
            break;
        } else if (bi < b.length) {
            result.push.apply(result, b.slice(bi, b.length));
            break;
        } else {
            break;
        }
    }
    return result;
}
var OPERATION={'include':intersect, 'union':union, 'exclude':subtract};

var boolSearch=function(opts) {
  opts=opts||{};
  ops=opts.op||this.opts.op;
  this.docs=[];
	if (!this.phrases.length) return;
	var r=this.phrases[0].docs;
  /* ignore operator of first phrase */
	for (var i=1;i<this.phrases.length;i++) {
		var op= ops[i] || 'union';
		r=OPERATION[op](r,this.phrases[i].docs);
	}
	this.docs=plist.unique(r);
	return this;
}
module.exports={search:boolSearch}
});
require.register("ksana-document/search.js", function(exports, require, module){
var plist=require("./plist");
var boolsearch=require("./boolsearch");
var excerpt=require("./excerpt");
var parseTerm = function(engine,raw,opts) {
	if (!raw) return;
	var res={raw:raw,variants:[],term:'',op:''};
	var term=raw, op=0;
	var firstchar=term[0];
	var termregex="";
	if (firstchar=='-') {
		term=term.substring(1);
		firstchar=term[0];
		res.exclude=true; //exclude
	}
	term=term.trim();
	var lastchar=term[term.length-1];
	term=engine.customfunc.normalize(term);
	
	if (term.indexOf("%")>-1) {
		var termregex="^"+term.replace(/%+/g,".*")+"$";
		if (firstchar=="%") 	termregex=".*"+termregex.substr(1);
		if (lastchar=="%") 	termregex=termregex.substr(0,termregex.length-1)+".*";
	}

	if (termregex) {
		res.variants=expandTerm(engine,termregex);
	}

	res.key=term;
	return res;
}
var expandTerm=function(engine,regex) {
	var r=new RegExp(regex);
	var tokens=engine.get("tokens");
	var postingslen=engine.get("postingslen");
	var out=[];
	for (var i=0;i<tokens.length;i++) {
		var m=tokens[i].match(r);
		if (m) {
			out.push([m[0],postingslen[i]]);
		}
	}
	out.sort(function(a,b){return b[1]-a[1]});
	return out;
}
var isWildcard=function(raw) {
	return !!raw.match(/[\*\?]/);
}

var isOrTerm=function(term) {
	term=term.trim();
	return (term[term.length-1]===',');
}
var orterm=function(engine,term,key) {
		var t={text:key};
		if (engine.customfunc.simplifiedToken) {
			t.simplified=engine.customfunc.simplifiedToken(key);
		}
		term.variants.push(t);
}
var orTerms=function(engine,tokens,now) {
	var raw=tokens[now];
	var term=parseTerm(engine,raw);
	if (!term) return;
	orterm(engine,term,term.key);
	while (isOrTerm(raw))  {
		raw=tokens[++now];
		var term2=parseTerm(engine,raw);
		orterm(engine,term,term2.key);
		for (var i in term2.variants){
			term.variants[i]=term2.variants[i];
		}
		term.key+=','+term2.key;
	}
	return term;
}

var getOperator=function(raw) {
	var op='';
	if (raw[0]=='+') op='include';
	if (raw[0]=='-') op='exclude';
	return op;
}
var parsePhrase=function(q) {
	var match=q.match(/(".+?"|'.+?'|\S+)/g)
	match=match.map(function(str){
		var n=str.length, h=str.charAt(0), t=str.charAt(n-1)
		if (h===t&&(h==='"'|h==="'")) str=str.substr(1,n-2)
		return str;
	})
	return match;
}
var parseWildcard=function(raw) {
	var n=parseInt(raw,10) || 1;
	var qcount=raw.split('?').length-1;
	var scount=raw.split('*').length-1;
	var type='';
	if (qcount) type='?';
	else if (scount) type='*';
	return {wildcard:type, width: n , op:'wildcard'};
}

var newPhrase=function() {
	return {termid:[],posting:[],raw:''};
} 
var parseQuery=function(q) {
	var match=q.match(/(".+?"|'.+?'|\S+)/g)
	match=match.map(function(str){
		var n=str.length, h=str.charAt(0), t=str.charAt(n-1)
		if (h===t&&(h==='"'|h==="'")) str=str.substr(1,n-2)
		return str
	})
	//console.log(input,'==>',match)
	return match;
}
var loadPhrase=function(phrase) {
	/* remove leading and ending wildcard */
	var Q=this;
	var cache=Q.engine.postingCache;
	if (cache[phrase.key]) {
		phrase.posting=cache[phrase.key];
		return Q;
	}
	if (phrase.termid.length==1) {
		cache[phrase.key]=phrase.posting=Q.terms[phrase.termid[0]].posting;
		return Q;
	}

	var i=0, r=[],dis=0;
	while(i<phrase.termid.length) {
	  var T=Q.terms[phrase.termid[i]];
		if (0 === i) {
			r = T.posting;
		} else {
		    if (T.op=='wildcard') {
		    	T=Q.terms[phrase.termid[i++]];
		    	var width=T.width;
		    	var wildcard=T.wildcard;
		    	T=Q.terms[phrase.termid[i]];
		    	var mindis=dis;
		    	if (wildcard=='?') mindis=dis+width;
		    	if (T.exclude) r = plist.plnotfollow2(r, T.posting, mindis, dis+width);
		    	else r = plist.plfollow2(r, T.posting, mindis, dis+width);		    	
		    	dis+=(width-1);
		    }else {
		    	if (T.posting) {
		    		if (T.exclude) r = plist.plnotfollow(r, T.posting, dis);
		    		else r = plist.plfollow(r, T.posting, dis);
		    	}
		    }
		}
		dis++;	i++;
		if (!r) return Q;
  }
  phrase.posting=r;
  cache[phrase.key]=r;
  return Q;
}
var trimSpace=function(engine,query) {
	var i=0;
	var isSkip=engine.customfunc.isSkip;
	while (isSkip(query[i]) && i<query.length) i++;
	return query.substring(i);
}
var getPageWithHit=function(fileid,offsets) {
	var Q=this,engine=Q.engine;
	var pagewithhit=plist.groupbyposting2(Q.byFile[fileid ], offsets);
	pagewithhit.shift(); //the first item is not used (0~Q.byFile[0] )
	var out=[];
	pagewithhit.map(function(p,idx){if (p.length) out.push(idx)});
	return out;
}
var pageWithHit=function(fileid) {
	var Q=this,engine=Q.engine;
	var offsets=engine.getFilePageOffsets(fileid);
	return getPageWithHit.apply(this,[fileid,offsets]);
}
var isSimplePhrase=function(phrase) {
	var m=phrase.match(/[\?%^]/);
	return !m;
}
/* host has fast native function */
var fastPhrase=function(engine,phrase) {
	var phrase_term=newPhrase();
	var tokens=engine.customfunc.tokenize(phrase).tokens;
	var paths=postingPathFromTokens(engine,tokens);
	phrase_term.width=tokens.length; //for excerpt.js to getPhraseWidth
	engine.get(paths,{address:true},function(postingAddress){ //this is sync
		phrase_term.key=phrase;
		engine.postingCache[phrase]=engine.mergePostings(postingAddress);
	});
	return phrase_term;
	// put posting into cache[phrase.key]
}
var slowPhrase=function(engine,terms,phrase) {
	  var j=0,tokens=engine.customfunc.tokenize(phrase).tokens;
	  var phrase_term=newPhrase();

		while (j<tokens.length) {
			var raw=tokens[j];
			if (isWildcard(raw)) {
				if (phrase_term.termid.length==0)  { //skip leading wild card
					j++
					continue;
				}
				terms.push(parseWildcard(raw));
			} else if (isOrTerm(raw)){
				var term=orTerms.apply(this,[tokens,j]);
				terms.push(term);
				j+=term.key.split(',').length-1;
			} else {
				var term=parseTerm(engine,raw);
				var termidx=terms.map(function(a){return a.key}).indexOf(term.key);
				if (termidx==-1) terms.push(term);
			}
			phrase_term.termid.push(terms.length-1);
			j++;
		}
		phrase_term.key=phrase;
		//remove ending wildcard
		var P=phrase_term , T=null;
		do {
			T=terms[P.termid[P.termid.length-1]];
			if (!T) break;
			if (T.wildcard) P.termid.pop(); else break;
		} while(T);		
		return phrase_term;
}
var newQuery =function(engine,query,opts) {
	if (!query) return;
	opts=opts||{};
	query=trimSpace(engine,query);

	var phrases=query;
	if (typeof query=='string') {
		phrases=parseQuery(query);
	}
	
	var phrase_terms=[], terms=[],variants=[],operators=[];
	var pc=0;//phrase count
	for  (var i=0;i<phrases.length;i++) {
		var op=getOperator(phrases[pc]);
		if (op) phrases[pc]=phrases[pc].substring(1);

		/* auto add + for natural order ?*/
		//if (!opts.rank && op!='exclude' &&i) op='include';
		operators.push(op);

		if (isSimplePhrase(phrases[pc]) && engine.mergePostings ) {
			var phrase_term=fastPhrase(engine,phrases[pc]);
		} else {
			var phrase_term=slowPhrase(engine,terms,phrases[pc]);
		}
		phrase_terms.push(phrase_term);

		if (!engine.mergePostings && phrase_terms[pc].termid.length==0) {
			phrase_terms.pop();
		} else pc++;
	}
	opts.op=operators;

	var Q={dbname:engine.dbname,engine:engine,opts:opts,query:query,
		phrases:phrase_terms,terms:terms
	};
	Q.tokenize=function() {return engine.customfunc.tokenize.apply(engine,arguments);}
	Q.isSkip=function() {return engine.customfunc.isSkip.apply(engine,arguments);}
	Q.normalize=function() {return engine.customfunc.normalize.apply(engine,arguments);}
	Q.pageWithHit=pageWithHit;

	//Q.getRange=function() {return that.getRange.apply(that,arguments)};
	//API.queryid='Q'+(Math.floor(Math.random()*10000000)).toString(16);
	return Q;
}
var postingPathFromTokens=function(engine,tokens) {
	var alltokens=engine.get("tokens");
	   //var tokenIds=terms.map(function(t){return tokens[t.key]});
	var tokenIds=tokens.map(function(t){ return 1+alltokens.indexOf(t)});
	var postingid=[];
	for (var i=0;i<tokenIds.length;i++) {
		postingid.push( tokenIds[i]); // tokenId==0 , empty token
	}
	return postingid.map(function(t){return ["postings",t]});
}
var loadPostings=function(engine,tokens,cb) {
	tokens=tokens.filter(function(t){
		return !engine.postingCache[t.key]; //already in cache
	});
	if (tokens.length==0) {
		cb();
		return;
	}
	var postingPaths=postingPathFromTokens(engine,tokens.map(function(t){return t.key}));

	engine.get(postingPaths,function(postings){
		postings.map(function(p,i) { tokens[i].posting=p });
		if (cb) cb();
	});
}
var groupBy=function(Q,posting) {
	phrases.forEach(function(P){
		var key=P.key;
		var docfreq=docfreqcache[key];
		if (!docfreq) docfreq=docfreqcache[key]={};
		if (!docfreq[that.groupunit]) {
			docfreq[that.groupunit]={doclist:null,freq:null};
		}		
		if (P.posting) {
			var res=matchPosting(engine,P.posting);
			P.freq=res.freq;
			P.docs=res.docs;
		} else {
			P.docs=[];
			P.freq=[];
		}
		docfreq[that.groupunit]={doclist:P.docs,freq:P.freq};
	});
	return this;
}
var groupByFolder=function(engine,filehits) {
	var files=engine.get("fileNames");
	var prevfolder="",hits=0,out=[];
	for (var i=0;i<filehits.length;i++) {
		var fn=files[i];
		var folder=fn.substring(0,fn.indexOf('/'));
		if (prevfolder && prevfolder!=folder) {
			out.push(hits);
			hits=0;
		}
		hits+=filehits[i].length;
		prevfolder=folder;
	}
	out.push(hits);
	return out;
}
var phrase_intersect=function(engine,Q) {
	var intersected=null;
	var fileOffsets=Q.engine.get("fileOffsets");
	var empty=[],emptycount=0,hashit=0;
	for (var i=0;i<Q.phrases.length;i++) {
		var byfile=plist.groupbyposting2(Q.phrases[i].posting,fileOffsets);
		byfile.shift();byfile.pop();
		if (intersected==null) {
			intersected=byfile;
		} else {
			for (var j=0;j<byfile.length;j++) {
				if (!(byfile[j].length && intersected[j].length)) {
					intersected[j]=empty; //reuse empty array
					emptycount++;
				} else hashit++;
			}
		}
	}

	Q.byFile=intersected;
	Q.byFolder=groupByFolder(engine,Q.byFile);
	var out=[];
	//calculate new rawposting
	for (var i=0;i<Q.byFile.length;i++) {
		if (Q.byFile[i].length) out=out.concat(Q.byFile[i]);
	}
	Q.rawresult=out;
	countFolderFile(Q);
	//console.log(emptycount,hashit);
}
var countFolderFile=function(Q) {
	Q.fileWithHitCount=0;
	Q.byFile.map(function(f){if (f.length) Q.fileWithHitCount++});
			
	Q.folderWithHitCount=0;
	Q.byFolder.map(function(f){if (f) Q.folderWithHitCount++});
}
var main=function(engine,q,opts,cb){
	if (typeof opts=="function") cb=opts;
	opts=opts||{};
	var Q=engine.queryCache[q];
	if (!Q) Q=newQuery(engine,q,opts);
	if (!Q) {
		if (engine.context) cb.apply(engine.context,[{rawresult:[]}]);
		else cb({rawresult:[]});
		return;
	};
	engine.queryCache[q]=Q;
	loadPostings(engine,Q.terms,function(){
		if (!Q.phrases[0].posting) {
			cb.apply(engine.context,[{rawresult:[]}]);
			return;			
		}
		
		if (!Q.phrases[0].posting.length) { //
			Q.phrases.forEach(loadPhrase.bind(Q));
		}
		if (Q.phrases.length==1) {
			Q.rawresult=Q.phrases[0].posting;
		} else {
			phrase_intersect(engine,Q);
		}
		var fileOffsets=Q.engine.get("fileOffsets");
		//console.log("search opts "+JSON.stringify(opts));

		if (!Q.byFile && Q.rawresult && !opts.nogroup) {
			Q.byFile=plist.groupbyposting2(Q.rawresult, fileOffsets);
			Q.byFile.shift();Q.byFile.pop();
			Q.byFolder=groupByFolder(engine,Q.byFile);

			countFolderFile(Q);
		}

		if (opts.range) {
			excerpt.resultlist(engine,Q,opts,function(data) { 
				//console.log("excerpt ok");
				Q.excerpt=data;
				cb.apply(engine.context,[Q]);
			});
		} else {
			cb.apply(engine.context,[Q]);
		}		
	});
}

module.exports=main;
});
require.register("ksana-document/plist.js", function(exports, require, module){

var unpack = function (ar) { // unpack variable length integer list
  var r = [],
  i = 0,
  v = 0;
  do {
	var shift = 0;
	do {
	  v += ((ar[i] & 0x7F) << shift);
	  shift += 7;
	} while (ar[++i] & 0x80);
	r[r.length]=v;
  } while (i < ar.length);
  return r;
}

/*
   arr:  [1,1,1,1,1,1,1,1,1]
   levels: [0,1,1,2,2,0,1,2]
   output: [5,1,3,1,1,3,1,1]
*/

var groupsum=function(arr,levels) {
  if (arr.length!=levels.length+1) return null;
  var stack=[];
  var output=new Array(levels.length);
  for (var i=0;i<levels.length;i++) output[i]=0;
  for (var i=1;i<arr.length;i++) { //first one out of toc scope, ignored
    if (stack.length>levels[i-1]) {
      while (stack.length>levels[i-1]) stack.pop();
    }
    stack.push(i-1);
    for (var j=0;j<stack.length;j++) {
      output[stack[j]]+=arr[i];
    }
  }
  return output;
}
/* arr= 1 , 2 , 3 ,4 ,5,6,7 //token posting
  posting= 3 , 5  //tag posting
  out = 3 , 2, 2
*/
var countbyposting = function (arr, posting) {
  if (!posting.length) return [arr.length];
  var out=[];
  for (var i=0;i<posting.length;i++) out[i]=0;
  out[posting.length]=0;
  var p=0,i=0,lasti=0;
  while (i<arr.length && p<posting.length) {
    if (arr[i]<=posting[p]) {
      while (p<posting.length && i<arr.length && arr[i]<=posting[p]) {
        out[p]++;
        i++;
      }      
    } 
    p++;
  }
  out[posting.length] = arr.length-i; //remaining
  return out;
}

var groupbyposting=function(arr,gposting) { //relative vpos
  if (!gposting.length) return [arr.length];
  var out=[];
  for (var i=0;i<=gposting.length;i++) out[i]=[];
  
  var p=0,i=0,lasti=0;
  while (i<arr.length && p<gposting.length) {
    if (arr[i]<gposting[p]) {
      while (p<gposting.length && i<arr.length && arr[i]<gposting[p]) {
        var start=0;
        if (p>0) start=gposting[p-1];
        out[p].push(arr[i++]-start);  // relative
      }      
    } 
    p++;
  }
  //remaining
  while(i<arr.length) out[out.length-1].push(arr[i++]-gposting[gposting.length-1]);
  return out;
}
var groupbyposting2=function(arr,gposting) { //absolute vpos
  if (!gposting.length) return [arr.length];
  var out=[];
  for (var i=0;i<=gposting.length;i++) out[i]=[];
  
  var p=0,i=0,lasti=0;
  while (i<arr.length && p<gposting.length) {
    if (arr[i]<gposting[p]) {
      while (p<gposting.length && i<arr.length && arr[i]<gposting[p]) {
        var start=0;
        if (p>0) start=gposting[p-1]; //absolute
        out[p].push(arr[i++]);
      }      
    } 
    p++;
  }
  //remaining
  while(i<arr.length) out[out.length-1].push(arr[i++]-gposting[gposting.length-1]);
  return out;
}
var groupbyblock2 = function(ar, ntoken,slotshift,opts) {
  if (!ar.length) return [{},{}];
  
  slotshift = slotshift || 16;
  var g = Math.pow(2,slotshift);
  var i = 0;
  var r = {}, ntokens={};
  var groupcount=0;
  do {
    var group = Math.floor(ar[i] / g) ;
    if (!r[group]) {
      r[group] = [];
      ntokens[group]=[];
      groupcount++;
    }
    r[group].push(ar[i] % g);
    ntokens[group].push(ntoken[i]);
    i++;
  } while (i < ar.length);
  if (opts) opts.groupcount=groupcount;
  return [r,ntokens];
}
var groupbyslot = function (ar, slotshift, opts) {
  if (!ar.length)
	return {};
  
  slotshift = slotshift || 16;
  var g = Math.pow(2,slotshift);
  var i = 0;
  var r = {};
  var groupcount=0;
  do {
	var group = Math.floor(ar[i] / g) ;
	if (!r[group]) {
	  r[group] = [];
	  groupcount++;
	}
	r[group].push(ar[i] % g);
	i++;
  } while (i < ar.length);
  if (opts) opts.groupcount=groupcount;
  return r;
}
/*
var identity = function (value) {
  return value;
};
var sortedIndex = function (array, obj, iterator) { //taken from underscore
  iterator || (iterator = identity);
  var low = 0,
  high = array.length;
  while (low < high) {
	var mid = (low + high) >> 1;
	iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
  }
  return low;
};*/

var indexOfSorted = function (array, obj) { 
  var low = 0,
  high = array.length-1;
  while (low < high) {
    var mid = (low + high) >> 1;
    array[mid] < obj ? low = mid + 1 : high = mid;
  }
  return low;
};
var plhead=function(pl, pltag, opts) {
  opts=opts||{};
  opts.max=opts.max||1;
  var out=[];
  if (pltag.length<pl.length) {
    for (var i=0;i<pltag.length;i++) {
       k = indexOfSorted(pl, pltag[i]);
       if (k>-1 && k<pl.length) {
        if (pl[k]==pltag[i]) {
          out[out.length]=pltag[i];
          if (out.length>=opts.max) break;
        }
      }
    }
  } else {
    for (var i=0;i<pl.length;i++) {
       k = indexOfSorted(pltag, pl[i]);
       if (k>-1 && k<pltag.length) {
        if (pltag[k]==pl[i]) {
          out[out.length]=pltag[k];
          if (out.length>=opts.max) break;
        }
      }
    }
  }
  return out;
}
/*
 pl2 occur after pl1, 
 pl2>=pl1+mindis
 pl2<=pl1+maxdis
*/
var plfollow2 = function (pl1, pl2, mindis, maxdis) {
  var r = [],i=0;
  var swap = 0;
  
  while (i<pl1.length){
    var k = indexOfSorted(pl2, pl1[i] + mindis);
    var t = (pl2[k] >= (pl1[i] +mindis) && pl2[k]<=(pl1[i]+maxdis)) ? k : -1;
    if (t > -1) {
      r[r.length]=pl1[i];
      i++;
    } else {
      if (k>=pl2.length) break;
      var k2=indexOfSorted (pl1,pl2[k]-maxdis);
      if (k2>i) {
        var t = (pl2[k] >= (pl1[i] +mindis) && pl2[k]<=(pl1[i]+maxdis)) ? k : -1;
        if (t>-1) r[r.length]=pl1[k2];
        i=k2;
      } else break;
    }
  }
  return r;
}

var plnotfollow2 = function (pl1, pl2, mindis, maxdis) {
  var r = [],i=0;
  
  while (i<pl1.length){
    var k = indexOfSorted(pl2, pl1[i] + mindis);
    var t = (pl2[k] >= (pl1[i] +mindis) && pl2[k]<=(pl1[i]+maxdis)) ? k : -1;
    if (t > -1) {
      i++;
    } else {
      if (k>=pl2.length) {
        r=r.concat(pl1.slice(i));
        break;
      } else {
        var k2=indexOfSorted (pl1,pl2[k]-maxdis);
        if (k2>i) {
          r=r.concat(pl1.slice(i,k2));
          i=k2;
        } else break;
      }
    }
  }
  return r;
}
/* this is incorrect */
var plfollow = function (pl1, pl2, distance) {
  var r = [],i=0;

  while (i<pl1.length){
    var k = indexOfSorted(pl2, pl1[i] + distance);
    var t = (pl2[k] === (pl1[i] + distance)) ? k : -1;
    if (t > -1) {
      r.push(pl1[i]);
      i++;
    } else {
      if (k>=pl2.length) break;
      var k2=indexOfSorted (pl1,pl2[k]-distance);
      if (k2>i) {
        t = (pl2[k] === (pl1[k2] + distance)) ? k : -1;
        if (t>-1) {
           r.push(pl1[k2]);
           k2++;
        }
        i=k2;
      } else break;
    }
  }
  return r;
}
var plnotfollow = function (pl1, pl2, distance) {
  var r = [];
  var r = [],i=0;
  var swap = 0;
  
  while (i<pl1.length){
    var k = indexOfSorted(pl2, pl1[i] + distance);
    var t = (pl2[k] === (pl1[i] + distance)) ? k : -1;
    if (t > -1) { 
      i++;
    } else {
      if (k>=pl2.length) {
        r=r.concat(pl1.slice(i));
        break;
      } else {
        var k2=indexOfSorted (pl1,pl2[k]-distance);
        if (k2>i) {
          r=r.concat(pl1.slice(i,k2));
          i=k2;
        } else break;
      }
    }
  }
  return r;
}
var pland = function (pl1, pl2, distance) {
  var r = [];
  var swap = 0;
  
  if (pl1.length > pl2.length) { //swap for faster compare
    var t = pl2;
    pl2 = pl1;
    pl1 = t;
    swap = distance;
    distance = -distance;
  }
  for (var i = 0; i < pl1.length; i++) {
    var k = indexOfSorted(pl2, pl1[i] + distance);
    var t = (pl2[k] === (pl1[i] + distance)) ? k : -1;
    if (t > -1) {
      r.push(pl1[i] - swap);
    }
  }
  return r;
}
var combine=function (postings) {
  var out=[];
  for (var i in postings) {
    out=out.concat(postings[i]);
  }
  out.sort(function(a,b){return a-b});
  return out;
}

var unique = function(ar){
   if (!ar || !ar.length) return [];
   var u = {}, a = [];
   for(var i = 0, l = ar.length; i < l; ++i){
    if(u.hasOwnProperty(ar[i])) continue;
    a.push(ar[i]);
    u[ar[i]] = 1;
   }
   return a;
}



var plphrase = function (postings,ops) {
  var r = [];
  for (var i=0;i<postings.length;i++) {
  	if (!postings[i])  return [];
  	if (0 === i) {
  	  r = postings[0];
  	} else {
      if (ops[i]=='andnot') {
        r = plnotfollow(r, postings[i], i);  
      }else {
        r = pland(r, postings[i], i);  
      }
  	}
  }
  
  return r;
}
//return an array of group having any of pl item
var matchPosting=function(pl,gupl,start,end) {
  start=start||0;
  end=end||-1;
  if (end==-1) end=Math.pow(2, 53); // max integer value

  var count=0, i = j= 0,  result = [] ,v=0;
  var docs=[], freq=[];
  if (!pl) return {docs:[],freq:[]};
  while( i < pl.length && j < gupl.length ){
     if (pl[i] < gupl[j] ){ 
       count++;
       v=pl[i];
       i++; 
     } else {
       if (count) {
        if (v>=start && v<end) {
          docs.push(j);
          freq.push(count);          
        }
       }
       j++;
       count=0;
     }
  }
  if (count && j<gupl.length && v>=start && v<end) {
    docs.push(j);
    freq.push(count);
    count=0;
  }
  else {
    while (j==gupl.length && i<pl.length && pl[i] >= gupl[gupl.length-1]) {
      i++;
      count++;
    }
    if (v>=start && v<end) {
      docs.push(j);
      freq.push(count);      
    }
  } 
  return {docs:docs,freq:freq};
}

var trim=function(arr,start,end) {
  var s=indexOfSorted(arr,start);
  var e=indexOfSorted(arr,end);
  return arr.slice(s,e+1);
}
var plist={};
plist.unpack=unpack;
plist.plphrase=plphrase;
plist.plhead=plhead;
plist.plfollow2=plfollow2;
plist.plnotfollow2=plnotfollow2;
plist.plfollow=plfollow;
plist.plnotfollow=plnotfollow;
plist.unique=unique;
plist.indexOfSorted=indexOfSorted;
plist.matchPosting=matchPosting;
plist.trim=trim;

plist.groupbyslot=groupbyslot;
plist.groupbyblock2=groupbyblock2;
plist.countbyposting=countbyposting;
plist.groupbyposting=groupbyposting;
plist.groupbyposting2=groupbyposting2;
plist.groupsum=groupsum;
plist.combine=combine;
module.exports=plist;
return plist;
});
require.register("ksana-document/excerpt.js", function(exports, require, module){
var plist=require("./plist");

var getPhraseWidths=function (Q,phraseid,voffs) {
	var res=[];
	for (var i in voffs) {
		res.push(getPhraseWidth(Q,phraseid,voffs[i]));
	}
	return res;
}
var getPhraseWidth=function (Q,phraseid,voff) {
	var P=Q.phrases[phraseid];
	var width=0,varwidth=false;
	if (P.width) return P.width; // no wildcard
	if (P.termid.length<2) return P.termid.length;
	var lasttermposting=Q.terms[P.termid[P.termid.length-1]].posting;

	for (var i in P.termid) {
		var T=Q.terms[P.termid[i]];
		if (T.op=='wildcard') {
			width+=T.width;
			if (T.wildcard=='*') varwidth=true;
		} else {
			width++;
		}
	}
	if (varwidth) { //width might be smaller due to * wildcard
		var at=plist.indexOfSorted(lasttermposting,voff);
		var endpos=lasttermposting[at];
		if (endpos-voff<width) width=endpos-voff+1;
	}

	return width;
}
/* return [voff, phraseid, phrasewidth, optional_tagname] by slot range*/
var hitInRange=function(Q,startvoff,endvoff) {
	var res=[];
	if (!Q || !Q.rawresult.length) return res;
	for (var i=0;i<Q.phrases.length;i++) {
		var P=Q.phrases[i];
		if (!P.posting) continue;
		var s=plist.indexOfSorted(P.posting,startvoff);
		var e=plist.indexOfSorted(P.posting,endvoff);
		var r=P.posting.slice(s,e);
		var width=getPhraseWidths(Q,i,r);

		res=res.concat(r.map(function(voff,idx){ return [voff,i,width[idx]] }));
	}
	// order by voff, if voff is the same, larger width come first.
	// so the output will be
	// <tag1><tag2>one</tag2>two</tag1>
	//TODO, might cause overlap if same voff and same width
	//need to check tag name
	res.sort(function(a,b){return a[0]==b[0]? b[2]-a[2] :a[0]-b[0]});

	return res;
}

/*
given a vpos range start, file, convert to filestart, fileend
   filestart : starting file
   start   : vpos start
   showfile: how many files to display
   showpage: how many pages to display

output:
   array of fileid with hits
*/
var getFileWithHits=function(engine,Q,range) {
	var fileOffsets=engine.get("fileOffsets");
	var out=[],filecount=100;
	if (range.start) {
		var first=range.start , start=0 , end;
		for (var i=0;i<fileOffsets.length;i++) {
			if (fileOffsets[i]>first) break;
			start=i;
		}		
	} else {
		start=range.filestart || 0;
		if (range.maxfile) {
			filecount=range.maxfile;
		} else if (range.showpage) {
			throw "not implement yet"
		}
	}

	var fileWithHits=[],totalhit=0;
	range.maxhit=range.maxhit||1000;

	for (var i=start;i<Q.byFile.length;i++) {
		if(Q.byFile[i].length>0) {
			totalhit+=Q.byFile[i].length;
			fileWithHits.push(i);
			range.nextFileStart=i;
			if (fileWithHits.length>=filecount) break;
			if (totalhit>range.maxhit) break;
		}
	}
	if (i>=Q.byFile.length) { //no more file
		Q.excerptStop=true;
	}
	return fileWithHits;
}
var resultlist=function(engine,Q,opts,cb) {
	var output=[];
	if (!Q.rawresult || !Q.rawresult.length) {
		cb(output);
		return;
	} 
	if (opts.range) {
		if (opts.range.maxhit && !opts.range.maxfile) {
			opts.range.maxfile=opts.range.maxhit;
		}
	}
	var fileWithHits=getFileWithHits(engine,Q,opts.range);
	if (!fileWithHits.length) {
		cb(output);
		return;
	}

	var output=[],files=[];//temporary holder for pagenames
	for (var i=0;i<fileWithHits.length;i++) {
		var nfile=fileWithHits[i];
		var pageOffsets=engine.getFilePageOffsets(nfile);
		var pageNames=engine.getFilePageNames(nfile);
		files[nfile]={pageOffsets:pageOffsets};
		var pagewithhit=plist.groupbyposting2(Q.byFile[ nfile ],  pageOffsets);
		//if (pageOffsets[0]==1)
		//pagewithhit.shift(); //the first item is not used (0~Q.byFile[0] )

		for (var j=0; j<pagewithhit.length;j++) {
			if (!pagewithhit[j].length) continue;
			//var offsets=pagewithhit[j].map(function(p){return p- fileOffsets[i]});
			output.push(  {file: nfile, page:j,  pagename:pageNames[j]});
		}
	}

	var pagepaths=output.map(function(p){
		return ["fileContents",p.file,p.page];
	});
	//prepare the text
	engine.get(pagepaths,function(pages){
		var seq=0;
		if (pages) for (var i=0;i<pages.length;i++) {
			var startvpos=files[output[i].file].pageOffsets[output[i].page-1];
			var endvpos=files[output[i].file].pageOffsets[output[i].page];
			var hl={};

			if (opts.range && opts.range.start && startvpos<opts.range.start ) {
				startvpos=opts.range.start;
			}
			
			if (opts.nohighlight) {
				hl.text=pages[i];
				hl.hits=hitInRange(Q,startvpos,endvpos);
			} else {
				var o={text:pages[i],startvpos:startvpos, endvpos: endvpos, Q:Q,fulltext:opts.fulltext};
				hl=highlight(Q,o);
			}
			if (hl.text) {
				output[i].text=hl.text;
				output[i].hits=hl.hits;
				output[i].seq=seq;
				seq+=hl.hits.length;

				output[i].start=startvpos;				
			} else {
				output[i]=null; //remove item vpos less than opts.range.start
			}
		} 
		output=output.filter(function(o){return o!=null});
		cb(output);
	});
}
var injectTag=function(Q,opts){
	var hits=opts.hits;
	var tag=opts.tag||'hl';
	var output='',O=[],j=0;;
	var surround=opts.surround||5;

	var tokens=Q.tokenize(opts.text).tokens;
	var voff=opts.voff;
	var i=0,previnrange=!!opts.fulltext ,inrange=!!opts.fulltext;
	while (i<tokens.length) {
		inrange=opts.fulltext || (j<hits.length && voff+surround>=hits[j][0] ||
				(j>0 && j<=hits.length &&  hits[j-1][0]+surround*2>=voff));	

		if (previnrange!=inrange) {
			output+=opts.abridge||"...";
		}
		previnrange=inrange;

		if (Q.isSkip(tokens[i])) {
			if (inrange) output+=tokens[i];
			i++;
			continue;
		}
		if (i<tokens.length && j<hits.length && voff==hits[j][0]) {
			var nphrase=hits[j][1] % 10, width=hits[j][2];
			var tag=hits[j][3] || tag;
			if (width) {
				output+= '<'+tag+' n="'+nphrase+'">';
				while (width && i<tokens.length) {
					output+=tokens[i];
					if (!Q.isSkip(tokens[i])) {voff++;width--;}
					i++;
				}
				output+='</'+tag+'>';
			} else {
				output+= '<'+tag+' n="'+nphrase+'"/>';
			}
			while (j<hits.length && voff>hits[j][0]) j++;
		} else {
			if (inrange && i<tokens.length) output+=tokens[i];
			i++;
			voff++;
		}
		
	}
	var remain=10;
	while (i<tokens.length) {
		if (inrange) output+= tokens[i];
		i++;
		remain--;
		if (remain<=0) break;
	}
	O.push(output);
	output="";

	return O.join("");
}
var highlight=function(Q,opts) {
	if (!opts.text) return {text:"",hits:[]};
	var opt={text:opts.text,
		hits:null,tag:'hl',abridge:opts.abridge,voff:opts.startvpos,
		fulltext:opts.fulltext
	};

	opt.hits=hitInRange(opts.Q,opts.startvpos,opts.endvpos);
	return {text:injectTag(Q,opt),hits:opt.hits};
}

var getPage=function(engine,fileid,pageid,cb) {
	var fileOffsets=engine.get("fileOffsets");
	var pagepaths=["fileContents",fileid,pageid];
	var pagenames=engine.getFilePageNames(fileid);

	engine.get(pagepaths,function(text){
		cb.apply(engine.context,[{text:text,file:fileid,page:pageid,pagename:pagenames[pageid]}]);
	});
}

var getPageSync=function(engine,fileid,pageid) {
	var fileOffsets=engine.get("fileOffsets");
	var pagepaths=["fileContents",fileid,pageid];
	var pagenames=engine.getFilePageNames(fileid);

	var text=engine.get(pagepaths);
	return {text:text,file:fileid,page:pageid,pagename:pagenames[pageid]};
}

var getRange=function(engine,start,end,cb) {
	var fileOffsets=engine.get("fileOffsets");
	//var pagepaths=["fileContents",];
	//find first page and last page
	//create get paths

}

var getFile=function(engine,fileid,cb) {
	var filename=engine.get("fileNames")[fileid];
	var pagenames=engine.getFilePageNames(fileid);
	var filestart=engine.get("fileOffsets")[fileid];
	var offsets=engine.getFilePageOffsets(fileid);
	var pc=0;
	engine.get(["fileContents",fileid],true,function(data){
		var text=data.map(function(t,idx) {
			if (idx==0) return ""; 
			var pb='<pb n="'+pagenames[idx]+'"></pb>';
			return pb+t;
		});
		cb({texts:data,text:text.join(""),pagenames:pagenames,filestart:filestart,offsets:offsets,file:fileid,filename:filename}); //force different token
	});
}

var highlightRange=function(Q,startvpos,endvpos,opts,cb){
	//not implement yet
}

var highlightFile=function(Q,fileid,opts,cb) {
	console.log("higlight")
	if (typeof opts=="function") {
		cb=opts;
	}

	if (!Q || !Q.engine) return cb(null);

	var pageOffsets=Q.engine.getFilePageOffsets(fileid);
	var output=[];	
	//console.log(startvpos,endvpos)
	Q.engine.get(["fileContents",fileid],true,function(data){
		if (!data) {
			console.error("wrong file id",fileid);
		} else {
			for (var i=0;i<data.length-1;i++ ){
				var startvpos=pageOffsets[i];
				var endvpos=pageOffsets[i+1];
				var pagenames=Q.engine.getFilePageNames(fileid);
				var page=getPageSync(Q.engine, fileid,i+1);
					var opt={text:page.text,hits:null,tag:'hl',voff:startvpos,fulltext:true};
				var pagename=pagenames[i+1];
				opt.hits=hitInRange(Q,startvpos,endvpos);
				var pb='<pb n="'+pagename+'"></pb>';
				output.push(pb+injectTag(Q,opt));
			}			
		}

		cb.apply(Q.engine.context,[{text:output.join(""),file:fileid}]);
	})
}
var highlightPage=function(Q,fileid,pageid,opts,cb) {
	if (typeof opts=="function") {
		cb=opts;
	}

	if (!Q || !Q.engine) return cb(null);
	var pageOffsets=Q.engine.getFilePageOffsets(fileid);
	var startvpos=pageOffsets[pageid];
	var endvpos=pageOffsets[pageid+1];
	var pagenames=Q.engine.getFilePageNames(fileid);

	this.getPage(Q.engine, fileid,pageid+1,function(res){
		var opt={text:res.text,hits:null,tag:'hl',voff:startvpos,fulltext:true};
		opt.hits=hitInRange(Q,startvpos,endvpos);
		var pagename=pagenames[pageid];
		cb.apply(Q.engine.context,[{text:injectTag(Q,opt),page:pageid,file:fileid,hits:opt.hits,pagename:pagename}]);
	});
}
module.exports={resultlist:resultlist, 
	hitInRange:hitInRange, 
	highlightPage:highlightPage,
	getPage:getPage,
	highlightFile:highlightFile,
	getFile:getFile
	//highlightRange:highlightRange,
  //getRange:getRange,
};
});
require.register("ksana-document/link.js", function(exports, require, module){
var findLinkBy=function(page,start,len,cb) {
	if (!page) {
		cb([]);
		return;
	}
	var markups=page.markupAt(start);
	markups=markups.filter(function(m){
		return m.payload.type=="linkby";
	})
	cb(markups);
}
module.exports={findLinkBy:findLinkBy};

});
require.register("ksana-document/tibetan/wylie.js", function(exports, require, module){
var opt = { check:false, check_strict:false, print_warnings:false, fix_spacing:false }

function setopt(arg_opt) {
	for (i in arg_opt) opt[i] = arg_opt[i]
	if (opt.check_strict && !opt.check) { 
		throw 'check_strict requires check.'
	}
}

function newHashSet() {
	var x = []
	x.add = function (K) {
		if (this.indexOf(K) < 0) this.push(K)
	}
	x.contains = function (K) {
		return this.indexOf(K) >= 0
	}
	return x
}

function newHashMap() {
	var x = {}
	x.k = [], x.v = []
	x.put = function (K, V) {
		var i = this.k.indexOf(K)
		if (i < 0) this.k.push(K), this.v.push(V); else this.v[i] = V
	}
	x.containsKey = function (K) {
		return this.k.indexOf(K) >= 0
	}
	x.get = function (K) {
		var i = this.k.indexOf(K)
		if (i >= 0) return this.v[i]
	}
	return x
}
var tmpSet;
// mappings are ported from Java code
// *** Wylie to Unicode mappings ***
// list of wylie consonant => unicode
var m_consonant = new newHashMap();
m_consonant.put("k", 	"\u0f40");
m_consonant.put("kh", 	"\u0f41");
m_consonant.put("g", 	"\u0f42");
m_consonant.put("gh", 	"\u0f42\u0fb7");
m_consonant.put("g+h", 	"\u0f42\u0fb7");
m_consonant.put("ng", 	"\u0f44");
m_consonant.put("c", 	"\u0f45");
m_consonant.put("ch", 	"\u0f46");
m_consonant.put("j", 	"\u0f47");
m_consonant.put("ny", 	"\u0f49");
m_consonant.put("T", 	"\u0f4a");
m_consonant.put("-t", 	"\u0f4a");
m_consonant.put("Th", 	"\u0f4b");
m_consonant.put("-th", 	"\u0f4b");
m_consonant.put("D", 	"\u0f4c");
m_consonant.put("-d", 	"\u0f4c");
m_consonant.put("Dh", 	"\u0f4c\u0fb7");
m_consonant.put("D+h", 	"\u0f4c\u0fb7");
m_consonant.put("-dh", 	"\u0f4c\u0fb7");
m_consonant.put("-d+h", "\u0f4c\u0fb7");
m_consonant.put("N", 	"\u0f4e");
m_consonant.put("-n", 	"\u0f4e");
m_consonant.put("t", 	"\u0f4f");
m_consonant.put("th", 	"\u0f50");
m_consonant.put("d", 	"\u0f51");
m_consonant.put("dh", 	"\u0f51\u0fb7");
m_consonant.put("d+h", 	"\u0f51\u0fb7");
m_consonant.put("n", 	"\u0f53");
m_consonant.put("p", 	"\u0f54");
m_consonant.put("ph", 	"\u0f55");
m_consonant.put("b", 	"\u0f56");
m_consonant.put("bh", 	"\u0f56\u0fb7");
m_consonant.put("b+h", 	"\u0f56\u0fb7");
m_consonant.put("m", 	"\u0f58");
m_consonant.put("ts", 	"\u0f59");
m_consonant.put("tsh", 	"\u0f5a");
m_consonant.put("dz", 	"\u0f5b");
m_consonant.put("dzh", 	"\u0f5b\u0fb7");
m_consonant.put("dz+h", "\u0f5b\u0fb7");
m_consonant.put("w", 	"\u0f5d");
m_consonant.put("zh", 	"\u0f5e");
m_consonant.put("z", 	"\u0f5f");
m_consonant.put("'", 	"\u0f60");
m_consonant.put("\u2018", 	"\u0f60");	// typographic quotes
m_consonant.put("\u2019", 	"\u0f60");
m_consonant.put("y", 	"\u0f61");
m_consonant.put("r", 	"\u0f62");
m_consonant.put("l", 	"\u0f63");
m_consonant.put("sh", 	"\u0f64");
m_consonant.put("Sh", 	"\u0f65");
m_consonant.put("-sh", 	"\u0f65");
m_consonant.put("s", 	"\u0f66");
m_consonant.put("h", 	"\u0f67");
m_consonant.put("W", 	"\u0f5d");
m_consonant.put("Y", 	"\u0f61");
m_consonant.put("R", 	"\u0f6a");
m_consonant.put("f", 	"\u0f55\u0f39");
m_consonant.put("v", 	"\u0f56\u0f39");

// subjoined letters
var m_subjoined = new newHashMap();
m_subjoined.put("k", 	"\u0f90");
m_subjoined.put("kh", 	"\u0f91");
m_subjoined.put("g", 	"\u0f92");
m_subjoined.put("gh", 	"\u0f92\u0fb7");
m_subjoined.put("g+h", 	"\u0f92\u0fb7");
m_subjoined.put("ng", 	"\u0f94");
m_subjoined.put("c", 	"\u0f95");
m_subjoined.put("ch", 	"\u0f96");
m_subjoined.put("j", 	"\u0f97");
m_subjoined.put("ny", 	"\u0f99");
m_subjoined.put("T", 	"\u0f9a");
m_subjoined.put("-t", 	"\u0f9a");
m_subjoined.put("Th", 	"\u0f9b");
m_subjoined.put("-th", 	"\u0f9b");
m_subjoined.put("D", 	"\u0f9c");
m_subjoined.put("-d", 	"\u0f9c");
m_subjoined.put("Dh", 	"\u0f9c\u0fb7");
m_subjoined.put("D+h", 	"\u0f9c\u0fb7");
m_subjoined.put("-dh", 	"\u0f9c\u0fb7");
m_subjoined.put("-d+h",	"\u0f9c\u0fb7");
m_subjoined.put("N", 	"\u0f9e");
m_subjoined.put("-n", 	"\u0f9e");
m_subjoined.put("t", 	"\u0f9f");
m_subjoined.put("th", 	"\u0fa0");
m_subjoined.put("d", 	"\u0fa1");
m_subjoined.put("dh", 	"\u0fa1\u0fb7");
m_subjoined.put("d+h", 	"\u0fa1\u0fb7");
m_subjoined.put("n", 	"\u0fa3");
m_subjoined.put("p", 	"\u0fa4");
m_subjoined.put("ph", 	"\u0fa5");
m_subjoined.put("b", 	"\u0fa6");
m_subjoined.put("bh", 	"\u0fa6\u0fb7");
m_subjoined.put("b+h", 	"\u0fa6\u0fb7");
m_subjoined.put("m", 	"\u0fa8");
m_subjoined.put("ts", 	"\u0fa9");
m_subjoined.put("tsh", 	"\u0faa");
m_subjoined.put("dz", 	"\u0fab");
m_subjoined.put("dzh", 	"\u0fab\u0fb7");
m_subjoined.put("dz+h",	"\u0fab\u0fb7");
m_subjoined.put("w", 	"\u0fad");
m_subjoined.put("zh", 	"\u0fae");
m_subjoined.put("z", 	"\u0faf");
m_subjoined.put("'", 	"\u0fb0");
m_subjoined.put("\u2018", 	"\u0fb0");	// typographic quotes
m_subjoined.put("\u2019", 	"\u0fb0");
m_subjoined.put("y", 	"\u0fb1");
m_subjoined.put("r", 	"\u0fb2");
m_subjoined.put("l", 	"\u0fb3");
m_subjoined.put("sh", 	"\u0fb4");
m_subjoined.put("Sh", 	"\u0fb5");
m_subjoined.put("-sh", 	"\u0fb5");
m_subjoined.put("s", 	"\u0fb6");
m_subjoined.put("h", 	"\u0fb7");
m_subjoined.put("a", 	"\u0fb8");
m_subjoined.put("W", 	"\u0fba");
m_subjoined.put("Y", 	"\u0fbb");
m_subjoined.put("R", 	"\u0fbc");

// vowels
var m_vowel = new newHashMap();
m_vowel.put("a", 	"\u0f68");
m_vowel.put("A", 	"\u0f71");
m_vowel.put("i", 	"\u0f72");
m_vowel.put("I", 	"\u0f71\u0f72");
m_vowel.put("u", 	"\u0f74");
m_vowel.put("U", 	"\u0f71\u0f74");
m_vowel.put("e", 	"\u0f7a");
m_vowel.put("ai", 	"\u0f7b");
m_vowel.put("o", 	"\u0f7c");
m_vowel.put("au", 	"\u0f7d");
m_vowel.put("-i", 	"\u0f80");
m_vowel.put("-I", 	"\u0f71\u0f80");

// final symbols to unicode
var m_final_uni = new newHashMap();
m_final_uni.put("M", 	"\u0f7e");
m_final_uni.put("~M`", 	"\u0f82");
m_final_uni.put("~M", 	"\u0f83");
m_final_uni.put("X", 	"\u0f37");
m_final_uni.put("~X", 	"\u0f35");
m_final_uni.put("H", 	"\u0f7f");
m_final_uni.put("?", 	"\u0f84");
m_final_uni.put("^", 	"\u0f39");

// final symbols organized by class
var m_final_class = new newHashMap();
m_final_class.put("M", 	"M");
m_final_class.put("~M`", "M");
m_final_class.put("~M",  "M");
m_final_class.put("X", 	"X");
m_final_class.put("~X", "X");
m_final_class.put("H", 	"H");
m_final_class.put("?", 	"?");
m_final_class.put("^", 	"^");

// other stand-alone symbols
var m_other = new newHashMap();
m_other.put("0", 	"\u0f20");
m_other.put("1", 	"\u0f21");
m_other.put("2", 	"\u0f22");
m_other.put("3", 	"\u0f23");
m_other.put("4", 	"\u0f24");
m_other.put("5", 	"\u0f25");
m_other.put("6", 	"\u0f26");
m_other.put("7", 	"\u0f27");
m_other.put("8", 	"\u0f28");
m_other.put("9", 	"\u0f29");
m_other.put(" ", 	"\u0f0b");
m_other.put("*", 	"\u0f0c");
m_other.put("/", 	"\u0f0d");
m_other.put("//", 	"\u0f0e");
m_other.put(";", 	"\u0f0f");
m_other.put("|", 	"\u0f11");
m_other.put("!", 	"\u0f08");
m_other.put(":", 	"\u0f14");
m_other.put("_", 	" ");
m_other.put("=", 	"\u0f34");
m_other.put("<", 	"\u0f3a");
m_other.put(">", 	"\u0f3b");
m_other.put("(", 	"\u0f3c");
m_other.put(")", 	"\u0f3d");
m_other.put("@", 	"\u0f04");
m_other.put("#", 	"\u0f05");
m_other.put("$", 	"\u0f06");
m_other.put("%", 	"\u0f07");

// special characters: flag those if they occur out of context
var m_special = new newHashSet();
m_special.add(".");
m_special.add("+");
m_special.add("-");
m_special.add("~");
m_special.add("^");
m_special.add("?");
m_special.add("`");
m_special.add("]");

// superscripts: hashmap of superscript => set of letters or stacks below
var m_superscripts = new newHashMap();
tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("j");
tmpSet.add("ny");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("ts");
tmpSet.add("dz");
tmpSet.add("k+y");
tmpSet.add("g+y");
tmpSet.add("m+y");
tmpSet.add("b+w");
tmpSet.add("ts+w");
tmpSet.add("g+w");
m_superscripts.put("r", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("c");
tmpSet.add("j");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("p");
tmpSet.add("b");
tmpSet.add("h");
m_superscripts.put("l", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("ny");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("p");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("ts");
tmpSet.add("k+y");
tmpSet.add("g+y");
tmpSet.add("p+y");
tmpSet.add("b+y");
tmpSet.add("m+y");
tmpSet.add("k+r");
tmpSet.add("g+r");
tmpSet.add("p+r");
tmpSet.add("b+r");
tmpSet.add("m+r");
tmpSet.add("n+r");
m_superscripts.put("s", tmpSet);

// subscripts => set of letters above
var m_subscripts = new newHashMap();
tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("p");
tmpSet.add("ph");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("r+k");
tmpSet.add("r+g");
tmpSet.add("r+m");
tmpSet.add("s+k");
tmpSet.add("s+g");
tmpSet.add("s+p");
tmpSet.add("s+b");
tmpSet.add("s+m");
m_subscripts.put("y", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("t");
tmpSet.add("th");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("p");
tmpSet.add("ph");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("sh");
tmpSet.add("s");
tmpSet.add("h");
tmpSet.add("dz");
tmpSet.add("s+k");
tmpSet.add("s+g");
tmpSet.add("s+p");
tmpSet.add("s+b");
tmpSet.add("s+m");
tmpSet.add("s+n");
m_subscripts.put("r", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("b");
tmpSet.add("r");
tmpSet.add("s");
tmpSet.add("z");
m_subscripts.put("l", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("c");
tmpSet.add("ny");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("ts");
tmpSet.add("tsh");
tmpSet.add("zh");
tmpSet.add("z");
tmpSet.add("r");
tmpSet.add("l");
tmpSet.add("sh");
tmpSet.add("s");
tmpSet.add("h");
tmpSet.add("g+r");
tmpSet.add("d+r");
tmpSet.add("ph+y");
tmpSet.add("r+g");
tmpSet.add("r+ts");
m_subscripts.put("w", tmpSet);

// prefixes => set of consonants or stacks after
var m_prefixes = new newHashMap();
tmpSet = new newHashSet();
tmpSet.add("c");
tmpSet.add("ny");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("ts");
tmpSet.add("zh");
tmpSet.add("z");
tmpSet.add("y");
tmpSet.add("sh");
tmpSet.add("s");
m_prefixes.put("g", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("p");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("k+y");
tmpSet.add("g+y");
tmpSet.add("p+y");
tmpSet.add("b+y");
tmpSet.add("m+y");
tmpSet.add("k+r");
tmpSet.add("g+r");
tmpSet.add("p+r");
tmpSet.add("b+r");
m_prefixes.put("d", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("c");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("ts");
tmpSet.add("zh");
tmpSet.add("z");
tmpSet.add("sh");
tmpSet.add("s");
tmpSet.add("r");
tmpSet.add("l");
tmpSet.add("k+y");
tmpSet.add("g+y");
tmpSet.add("k+r");
tmpSet.add("g+r");
tmpSet.add("r+l");
tmpSet.add("s+l");
tmpSet.add("r+k");
tmpSet.add("r+g");
tmpSet.add("r+ng");
tmpSet.add("r+j");
tmpSet.add("r+ny");
tmpSet.add("r+t");
tmpSet.add("r+d");
tmpSet.add("r+n");
tmpSet.add("r+ts");
tmpSet.add("r+dz");
tmpSet.add("s+k");
tmpSet.add("s+g");
tmpSet.add("s+ng");
tmpSet.add("s+ny");
tmpSet.add("s+t");
tmpSet.add("s+d");
tmpSet.add("s+n");
tmpSet.add("s+ts");
tmpSet.add("r+k+y");
tmpSet.add("r+g+y");
tmpSet.add("s+k+y");
tmpSet.add("s+g+y");
tmpSet.add("s+k+r");
tmpSet.add("s+g+r");
tmpSet.add("l+d");
tmpSet.add("l+t");
tmpSet.add("k+l");
tmpSet.add("s+r");
tmpSet.add("z+l");
tmpSet.add("s+w");
m_prefixes.put("b", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("ch");
tmpSet.add("j");
tmpSet.add("ny");
tmpSet.add("th");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("tsh");
tmpSet.add("dz");
tmpSet.add("kh+y");
tmpSet.add("g+y");
tmpSet.add("kh+r");
tmpSet.add("g+r");
m_prefixes.put("m", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("ch");
tmpSet.add("j");
tmpSet.add("th");
tmpSet.add("d");
tmpSet.add("ph");
tmpSet.add("b");
tmpSet.add("tsh");
tmpSet.add("dz");
tmpSet.add("kh+y");
tmpSet.add("g+y");
tmpSet.add("ph+y");
tmpSet.add("b+y");
tmpSet.add("kh+r");
tmpSet.add("g+r");
tmpSet.add("d+r");
tmpSet.add("ph+r");
tmpSet.add("b+r");
m_prefixes.put("'", tmpSet);
m_prefixes.put("\u2018", tmpSet);
m_prefixes.put("\u2019", tmpSet);

// set of suffix letters
// also included are some Skt letters b/c they occur often in suffix position in Skt words
var m_suffixes = new newHashSet();
m_suffixes.add("'");
m_suffixes.add("\u2018");
m_suffixes.add("\u2019");
m_suffixes.add("g");
m_suffixes.add("ng");
m_suffixes.add("d");
m_suffixes.add("n");
m_suffixes.add("b");
m_suffixes.add("m");
m_suffixes.add("r");
m_suffixes.add("l");
m_suffixes.add("s");
m_suffixes.add("N");
m_suffixes.add("T");
m_suffixes.add("-n");
m_suffixes.add("-t");

// suffix2 => set of letters before
var m_suff2 = new newHashMap();
tmpSet = new newHashSet();
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("b");
tmpSet.add("m");
m_suff2.put("s", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("n");
tmpSet.add("r");
tmpSet.add("l");
m_suff2.put("d", tmpSet);

// root letter index for very ambiguous three-stack syllables
var m_ambiguous_key = new newHashMap();
m_ambiguous_key.put("dgs", 	1);
m_ambiguous_key.put("dms", 	1);
m_ambiguous_key.put("'gs", 	1);
m_ambiguous_key.put("mngs", 	0);
m_ambiguous_key.put("bgs", 	0);
m_ambiguous_key.put("dbs", 	1);

var m_ambiguous_wylie = new newHashMap();
m_ambiguous_wylie.put("dgs", 	"dgas");
m_ambiguous_wylie.put("dms", 	"dmas");
m_ambiguous_wylie.put("'gs", 	"'gas");
m_ambiguous_wylie.put("mngs", 	"mangs");
m_ambiguous_wylie.put("bgs", 	"bags");
m_ambiguous_wylie.put("dbs", 	"dbas");

// *** Unicode to Wylie mappings ***

// top letters
var m_tib_top = new newHashMap();
m_tib_top.put('\u0f40', 	"k");
m_tib_top.put('\u0f41', 	"kh");
m_tib_top.put('\u0f42', 	"g");
m_tib_top.put('\u0f43', 	"g+h");
m_tib_top.put('\u0f44', 	"ng");
m_tib_top.put('\u0f45', 	"c");
m_tib_top.put('\u0f46', 	"ch");
m_tib_top.put('\u0f47', 	"j");
m_tib_top.put('\u0f49', 	"ny");
m_tib_top.put('\u0f4a', 	"T");
m_tib_top.put('\u0f4b', 	"Th");
m_tib_top.put('\u0f4c', 	"D");
m_tib_top.put('\u0f4d', 	"D+h");
m_tib_top.put('\u0f4e', 	"N");
m_tib_top.put('\u0f4f', 	"t");
m_tib_top.put('\u0f50', 	"th");
m_tib_top.put('\u0f51', 	"d");
m_tib_top.put('\u0f52', 	"d+h");
m_tib_top.put('\u0f53', 	"n");
m_tib_top.put('\u0f54', 	"p");
m_tib_top.put('\u0f55', 	"ph");
m_tib_top.put('\u0f56', 	"b");
m_tib_top.put('\u0f57', 	"b+h");
m_tib_top.put('\u0f58', 	"m");
m_tib_top.put('\u0f59', 	"ts");
m_tib_top.put('\u0f5a', 	"tsh");
m_tib_top.put('\u0f5b', 	"dz");
m_tib_top.put('\u0f5c', 	"dz+h");
m_tib_top.put('\u0f5d', 	"w");
m_tib_top.put('\u0f5e', 	"zh");
m_tib_top.put('\u0f5f', 	"z");
m_tib_top.put('\u0f60', 	"'");
m_tib_top.put('\u0f61', 	"y");
m_tib_top.put('\u0f62', 	"r");
m_tib_top.put('\u0f63', 	"l");
m_tib_top.put('\u0f64', 	"sh");
m_tib_top.put('\u0f65', 	"Sh");
m_tib_top.put('\u0f66', 	"s");
m_tib_top.put('\u0f67', 	"h");
m_tib_top.put('\u0f68', 	"a");
m_tib_top.put('\u0f69', 	"k+Sh");
m_tib_top.put('\u0f6a', 	"R");

// subjoined letters
var m_tib_subjoined = new newHashMap();
m_tib_subjoined.put('\u0f90', 	"k");
m_tib_subjoined.put('\u0f91', 	"kh");
m_tib_subjoined.put('\u0f92', 	"g");
m_tib_subjoined.put('\u0f93', 	"g+h");
m_tib_subjoined.put('\u0f94', 	"ng");
m_tib_subjoined.put('\u0f95', 	"c");
m_tib_subjoined.put('\u0f96', 	"ch");
m_tib_subjoined.put('\u0f97', 	"j");
m_tib_subjoined.put('\u0f99', 	"ny");
m_tib_subjoined.put('\u0f9a', 	"T");
m_tib_subjoined.put('\u0f9b', 	"Th");
m_tib_subjoined.put('\u0f9c', 	"D");
m_tib_subjoined.put('\u0f9d', 	"D+h");
m_tib_subjoined.put('\u0f9e', 	"N");
m_tib_subjoined.put('\u0f9f', 	"t");
m_tib_subjoined.put('\u0fa0', 	"th");
m_tib_subjoined.put('\u0fa1', 	"d");
m_tib_subjoined.put('\u0fa2', 	"d+h");
m_tib_subjoined.put('\u0fa3', 	"n");
m_tib_subjoined.put('\u0fa4', 	"p");
m_tib_subjoined.put('\u0fa5', 	"ph");
m_tib_subjoined.put('\u0fa6', 	"b");
m_tib_subjoined.put('\u0fa7', 	"b+h");
m_tib_subjoined.put('\u0fa8', 	"m");
m_tib_subjoined.put('\u0fa9', 	"ts");
m_tib_subjoined.put('\u0faa', 	"tsh");
m_tib_subjoined.put('\u0fab', 	"dz");
m_tib_subjoined.put('\u0fac', 	"dz+h");
m_tib_subjoined.put('\u0fad', 	"w");
m_tib_subjoined.put('\u0fae', 	"zh");
m_tib_subjoined.put('\u0faf', 	"z");
m_tib_subjoined.put('\u0fb0', 	"'");
m_tib_subjoined.put('\u0fb1', 	"y");
m_tib_subjoined.put('\u0fb2', 	"r");
m_tib_subjoined.put('\u0fb3', 	"l");
m_tib_subjoined.put('\u0fb4', 	"sh");
m_tib_subjoined.put('\u0fb5', 	"Sh");
m_tib_subjoined.put('\u0fb6', 	"s");
m_tib_subjoined.put('\u0fb7', 	"h");
m_tib_subjoined.put('\u0fb8', 	"a");
m_tib_subjoined.put('\u0fb9', 	"k+Sh");
m_tib_subjoined.put('\u0fba', 	"W");
m_tib_subjoined.put('\u0fbb', 	"Y");
m_tib_subjoined.put('\u0fbc', 	"R");

// vowel signs:
// a-chen is not here because that's a top character, not a vowel sign.
// pre-composed "I" and "U" are dealt here; other pre-composed Skt vowels are more
// easily handled by a global replace in toWylie(), b/c they turn into subjoined "r"/"l".

var m_tib_vowel = new newHashMap();
m_tib_vowel.put('\u0f71', 	"A");
m_tib_vowel.put('\u0f72', 	"i");
m_tib_vowel.put('\u0f73', 	"I");
m_tib_vowel.put('\u0f74', 	"u");
m_tib_vowel.put('\u0f75', 	"U");
m_tib_vowel.put('\u0f7a', 	"e");
m_tib_vowel.put('\u0f7b', 	"ai");
m_tib_vowel.put('\u0f7c', 	"o");
m_tib_vowel.put('\u0f7d', 	"au");
m_tib_vowel.put('\u0f80', 	"-i");

// long (Skt) vowels
var m_tib_vowel_long = new newHashMap();
m_tib_vowel_long.put("i", 	"I");
m_tib_vowel_long.put("u", 	"U");
m_tib_vowel_long.put("-i", 	"-I");

// final symbols => wylie
var m_tib_final_wylie = new newHashMap();
m_tib_final_wylie.put('\u0f7e', 	"M");
m_tib_final_wylie.put('\u0f82', 	"~M`");
m_tib_final_wylie.put('\u0f83', 	"~M");
m_tib_final_wylie.put('\u0f37', 	"X");
m_tib_final_wylie.put('\u0f35', 	"~X");
m_tib_final_wylie.put('\u0f39', 	"^");
m_tib_final_wylie.put('\u0f7f', 	"H");
m_tib_final_wylie.put('\u0f84', 	"?");

// final symbols by class
var m_tib_final_class = new newHashMap();
m_tib_final_class.put('\u0f7e', 	"M");
m_tib_final_class.put('\u0f82', 	"M");
m_tib_final_class.put('\u0f83', 	"M");
m_tib_final_class.put('\u0f37', 	"X");
m_tib_final_class.put('\u0f35', 	"X");
m_tib_final_class.put('\u0f39', 	"^");
m_tib_final_class.put('\u0f7f', 	"H");
m_tib_final_class.put('\u0f84', 	"?");

// special characters introduced by ^
var m_tib_caret = new newHashMap();
m_tib_caret.put("ph", 	"f");
m_tib_caret.put("b", 	"v");

// other stand-alone characters
var m_tib_other = new newHashMap();
m_tib_other.put(' ', 		"_");
m_tib_other.put('\u0f04', 	"@");
m_tib_other.put('\u0f05', 	"#");
m_tib_other.put('\u0f06', 	"$");
m_tib_other.put('\u0f07', 	"%");
m_tib_other.put('\u0f08', 	"!");
m_tib_other.put('\u0f0b', 	" ");
m_tib_other.put('\u0f0c', 	"*");
m_tib_other.put('\u0f0d', 	"/");
m_tib_other.put('\u0f0e', 	"//");
m_tib_other.put('\u0f0f', 	";");
m_tib_other.put('\u0f11', 	"|");
m_tib_other.put('\u0f14', 	":");
m_tib_other.put('\u0f20', 	"0");
m_tib_other.put('\u0f21', 	"1");
m_tib_other.put('\u0f22', 	"2");
m_tib_other.put('\u0f23', 	"3");
m_tib_other.put('\u0f24', 	"4");
m_tib_other.put('\u0f25', 	"5");
m_tib_other.put('\u0f26', 	"6");
m_tib_other.put('\u0f27', 	"7");
m_tib_other.put('\u0f28', 	"8");
m_tib_other.put('\u0f29', 	"9");
m_tib_other.put('\u0f34', 	"=");
m_tib_other.put('\u0f3a', 	"<");
m_tib_other.put('\u0f3b', 	">");
m_tib_other.put('\u0f3c', 	"(");
m_tib_other.put('\u0f3d', 	")");

// all these stacked consonant combinations don't need "+"s in them
var m_tib_stacks = new newHashSet();
m_tib_stacks.add("b+l");
m_tib_stacks.add("b+r");
m_tib_stacks.add("b+y");
m_tib_stacks.add("c+w");
m_tib_stacks.add("d+r");
m_tib_stacks.add("d+r+w");
m_tib_stacks.add("d+w");
m_tib_stacks.add("dz+r");
m_tib_stacks.add("g+l");
m_tib_stacks.add("g+r");
m_tib_stacks.add("g+r+w");
m_tib_stacks.add("g+w");
m_tib_stacks.add("g+y");
m_tib_stacks.add("h+r");
m_tib_stacks.add("h+w");
m_tib_stacks.add("k+l");
m_tib_stacks.add("k+r");
m_tib_stacks.add("k+w");
m_tib_stacks.add("k+y");
m_tib_stacks.add("kh+r");
m_tib_stacks.add("kh+w");
m_tib_stacks.add("kh+y");
m_tib_stacks.add("l+b");
m_tib_stacks.add("l+c");
m_tib_stacks.add("l+d");
m_tib_stacks.add("l+g");
m_tib_stacks.add("l+h");
m_tib_stacks.add("l+j");
m_tib_stacks.add("l+k");
m_tib_stacks.add("l+ng");
m_tib_stacks.add("l+p");
m_tib_stacks.add("l+t");
m_tib_stacks.add("l+w");
m_tib_stacks.add("m+r");
m_tib_stacks.add("m+y");
m_tib_stacks.add("n+r");
m_tib_stacks.add("ny+w");
m_tib_stacks.add("p+r");
m_tib_stacks.add("p+y");
m_tib_stacks.add("ph+r");
m_tib_stacks.add("ph+y");
m_tib_stacks.add("ph+y+w");
m_tib_stacks.add("r+b");
m_tib_stacks.add("r+d");
m_tib_stacks.add("r+dz");
m_tib_stacks.add("r+g");
m_tib_stacks.add("r+g+w");
m_tib_stacks.add("r+g+y");
m_tib_stacks.add("r+j");
m_tib_stacks.add("r+k");
m_tib_stacks.add("r+k+y");
m_tib_stacks.add("r+l");
m_tib_stacks.add("r+m");
m_tib_stacks.add("r+m+y");
m_tib_stacks.add("r+n");
m_tib_stacks.add("r+ng");
m_tib_stacks.add("r+ny");
m_tib_stacks.add("r+t");
m_tib_stacks.add("r+ts");
m_tib_stacks.add("r+ts+w");
m_tib_stacks.add("r+w");
m_tib_stacks.add("s+b");
m_tib_stacks.add("s+b+r");
m_tib_stacks.add("s+b+y");
m_tib_stacks.add("s+d");
m_tib_stacks.add("s+g");
m_tib_stacks.add("s+g+r");
m_tib_stacks.add("s+g+y");
m_tib_stacks.add("s+k");
m_tib_stacks.add("s+k+r");
m_tib_stacks.add("s+k+y");
m_tib_stacks.add("s+l");
m_tib_stacks.add("s+m");
m_tib_stacks.add("s+m+r");
m_tib_stacks.add("s+m+y");
m_tib_stacks.add("s+n");
m_tib_stacks.add("s+n+r");
m_tib_stacks.add("s+ng");
m_tib_stacks.add("s+ny");
m_tib_stacks.add("s+p");
m_tib_stacks.add("s+p+r");
m_tib_stacks.add("s+p+y");
m_tib_stacks.add("s+r");
m_tib_stacks.add("s+t");
m_tib_stacks.add("s+ts");
m_tib_stacks.add("s+w");
m_tib_stacks.add("sh+r");
m_tib_stacks.add("sh+w");
m_tib_stacks.add("t+r");
m_tib_stacks.add("t+w");
m_tib_stacks.add("th+r");
m_tib_stacks.add("ts+w");
m_tib_stacks.add("tsh+w");
m_tib_stacks.add("z+l");
m_tib_stacks.add("z+w");
m_tib_stacks.add("zh+w");

// a map used to split the input string into tokens for fromWylie().
// all letters which start tokens longer than one letter are mapped to the max length of
// tokens starting with that letter.  
var m_tokens_start = new newHashMap();
m_tokens_start.put('S', 2);
m_tokens_start.put('/', 2);
m_tokens_start.put('d', 4);
m_tokens_start.put('g', 3);
m_tokens_start.put('b', 3);
m_tokens_start.put('D', 3);
m_tokens_start.put('z', 2);
m_tokens_start.put('~', 3);
m_tokens_start.put('-', 4);
m_tokens_start.put('T', 2);
m_tokens_start.put('a', 2);
m_tokens_start.put('k', 2);
m_tokens_start.put('t', 3);
m_tokens_start.put('s', 2);
m_tokens_start.put('c', 2);
m_tokens_start.put('n', 2);
m_tokens_start.put('p', 2);
m_tokens_start.put('\r', 2);

// also for tokenization - a set of tokens longer than one letter
var m_tokens = new newHashSet();
m_tokens.add("-d+h");
m_tokens.add("dz+h");
m_tokens.add("-dh");
m_tokens.add("-sh");
m_tokens.add("-th");
m_tokens.add("D+h");
m_tokens.add("b+h");
m_tokens.add("d+h");
m_tokens.add("dzh");
m_tokens.add("g+h");
m_tokens.add("tsh");
m_tokens.add("~M`");
m_tokens.add("-I");
m_tokens.add("-d");
m_tokens.add("-i");
m_tokens.add("-n");
m_tokens.add("-t");
m_tokens.add("//");
m_tokens.add("Dh");
m_tokens.add("Sh");
m_tokens.add("Th");
m_tokens.add("ai");
m_tokens.add("au");
m_tokens.add("bh");
m_tokens.add("ch");
m_tokens.add("dh");
m_tokens.add("dz");
m_tokens.add("gh");
m_tokens.add("kh");
m_tokens.add("ng");
m_tokens.add("ny");
m_tokens.add("ph");
m_tokens.add("sh");
m_tokens.add("th");
m_tokens.add("ts");
m_tokens.add("zh");
m_tokens.add("~M");
m_tokens.add("~X");
m_tokens.add("\r\n");

// A class to encapsulate the return value of fromWylieOneStack.
var WylieStack = function() {
	this.uni_string = ''
	this.tokens_used = 0
	this.single_consonant = ''
	this.single_cons_a = ''
	this.warns = []
	this.visarga = false
	return this
}

// Looking from i onwards within tokens, returns as many consonants as it finds,
// up to and not including the next vowel or punctuation.  Skips the caret "^".
// Returns: a string of consonants joined by "+" signs.
function consonantString(tokens, i) { // strings, int
	var out = [];
	var t = '';
	while (tokens[i] != null) {
		t = tokens[i++];
		if (t == '+' || t == '^') continue;
		if (consonant(t) == null) break;
		out.push(t);
	}
	return out.join("+");
}

// Looking from i backwards within tokens, at most up to orig_i, returns as 
// many consonants as it finds, up to and not including the next vowel or
// punctuation.  Skips the caret "^".
// Returns: a string of consonants (in forward order) joined by "+" signs.
function consonantStringBackwards(tokens, i, orig_i) {
	var out = [];
	var t = '';
	while (i >= orig_i && tokens[i] != null) {
		t = tokens[i--];
		if (t == '+' || t == '^') continue;
		if (consonant(t) == null) break;
		out.unshift(t);
	}
	return out.join("+");
}

// A class to encapsulate the return value of fromWylieOneTsekbar.
var WylieTsekbar = function() {
	this.uni_string = ''
	this.tokens_used = 0
	this.warns = []
	return this
}
// A class to encapsulate an analyzed tibetan stack, while converting Unicode to Wylie.
var ToWylieStack = function() {
	this.top = ''
	this.stack = []
	this.caret = false
	this.vowels = []
	this.finals = []
	this.finals_found = newHashMap()
	this.visarga = false
	this.cons_str = ''
	this.single_cons = ''
	this.prefix = false
	this.suffix = false
	this.suff2 = false
	this.dot = false
	this.tokens_used = 0
	this.warns = []
	return this
}

// A class to encapsulate the return value of toWylieOneTsekbar.
var ToWylieTsekbar = function() {
	this.wylie = ''
	this.tokens_used = 0
	this.warns = []
	return this
}

// Converts successive stacks of Wylie into unicode, starting at the given index
// within the array of tokens. 
// 
// Assumes that the first available token is valid, and is either a vowel or a consonant.
// Returns a WylieTsekbar object
// HELPER CLASSES AND STRUCTURES
var State = { PREFIX: 0, MAIN: 1, SUFF1: 2, SUFF2: 3, NONE: 4 }
	// split a string into Wylie tokens; 
	// make sure there is room for at least one null element at the end of the array
var splitIntoTokens = function(str) {
	var tokens = [] // size = str.length + 2
	var i = 0;
	var maxlen = str.length;
	TOKEN:
	while (i < maxlen) {
		var c = str.charAt(i);
		var mlo = m_tokens_start.get(c);
		// if there are multi-char tokens starting with this char, try them
		if (mlo != null) {
			for (var len = mlo; len > 1; len--) {
				if (i <= maxlen - len) {
					var tr = str.substring(i, i + len);
					if (m_tokens.contains(tr)) {
						tokens.push(tr);
						i += len;
						continue TOKEN;
					}
				}
			}
		}
		// things starting with backslash are special
		if (c == '\\' && i <= maxlen - 2) {
			if (str.charAt(i + 1) == 'u' && i <= maxlen - 6) {
				tokens.push(str.substring(i, i + 6));		// \\uxxxx
				i += 6;
			} else if (str.charAt(i + 1) == 'U' && i <= maxlen - 10) {
				tokens.push(str.substring(i, i + 10));		// \\Uxxxxxxxx
				i += 10;
			} else {
				tokens.push(str.substring(i, i + 2));		// \\x
				i += 2;
			}
			continue TOKEN;
		}
		// otherwise just take one char
		tokens.push(c.toString());
		i += 1;
	}
	return tokens;
}

// helper functions to access the various hash tables
var consonant = function(s) { return m_consonant.get(s) }
var subjoined = function(s) { return m_subjoined.get(s) }
var vowel = function(s) { return m_vowel.get(s) }
var final_uni = function(s) { return m_final_uni.get(s) }
var final_class = function(s) { return m_final_class.get(s) }
var other = function(s) { return m_other.get(s) }
var isSpecial = function(s) { return m_special.contains(s) }
var isSuperscript = function(s) { return m_superscripts.containsKey(s) }
var superscript = function(sup, below) {
	var tmpSet = m_superscripts.get(sup);
	if (tmpSet == null) return false;
	return tmpSet.contains(below);
}
var isSubscript = function(s) { return m_subscripts.containsKey(s) }
var subscript = function(sub, above) {
	var tmpSet = m_subscripts.get(sub);
	if (tmpSet == null) return false;
	return tmpSet.contains(above);
}
var isPrefix = function(s) { return m_prefixes.containsKey(s) }
var prefix = function(pref, after) {
	var tmpSet = m_prefixes.get(pref);
	if (tmpSet == null) return false;
	return tmpSet.contains(after);
}
var isSuffix = function(s) { return m_suffixes.contains(s) }
var isSuff2 = function(s) { return m_suff2.containsKey(s) }
var suff2 = function(suff, before) {
	var tmpSet = m_suff2.get(suff);
	if (tmpSet == null) return false;
	return tmpSet.contains(before);
}
var ambiguous_key = function(syll) { return m_ambiguous_key.get(syll) }
var ambiguous_wylie = function(syll) { return m_ambiguous_wylie.get(syll) }
var tib_top = function(c) { return m_tib_top.get(c) }
var tib_subjoined = function(c) { return m_tib_subjoined.get(c) }
var tib_vowel = function(c) { return m_tib_vowel.get(c) }
var tib_vowel_long = function(s) { return m_tib_vowel_long.get(s) }
var tib_final_wylie = function(c) { return m_tib_final_wylie.get(c) }
var tib_final_class = function(c) { return m_tib_final_class.get(c) }
var tib_caret = function(s) { return m_tib_caret.get(s) }
var tib_other = function(c) { return m_tib_other.get(c) }
var tib_stack = function(s) { return m_tib_stacks.contains(s) }

// does this string consist of only hexadecimal digits?
function validHex(t) {
	for (var i = 0; i < t.length; i++) {
		var c = t.charAt(i);
		if (!((c >= 'a' && c <= 'f') || (c >= '0' && c <= '9'))) return false;
	}
	return true;
}

// generate a warning if we are keeping them; prints it out if we were asked to
// handle a Wylie unicode escape, \\uxxxx or \\Uxxxxxxxx
function unicodeEscape (warns, line, t) { // [], int, str
	var hex = t.substring(2);
	if (hex == '') return null;
	if (!validHex(hex)) {
		warnl(warns, line, "\"" + t + "\": invalid hex code.");
		return "";
	}
	return String.fromCharCode(parseInt(hex, 16))
}

function warn(warns, str) {
	if (warns != null) warns.push(str);
	if (opt.print_warnings) console.log(str);
}

// warn with line number
function warnl(warns, line, str) {
	warn(warns, "line " + line + ": " + str);
}

function fromWylieOneTsekbar(tokens, i) { // (str, int)
	var orig_i = i
	var t = tokens[i]
	// variables for tracking the state within the syllable as we parse it
	var stack = null
	var prev_cons = ''
	var visarga = false
	// variables for checking the root letter, after parsing a whole tsekbar made of only single
	// consonants and one consonant with "a" vowel
	var check_root = true
	var consonants = [] // strings
	var root_idx = -1
	var out = ''
	var warns = []
	// the type of token that we are expecting next in the input stream
	//   - PREFIX : expect a prefix consonant, or a main stack
	//   - MAIN   : expect only a main stack
	//   - SUFF1  : expect a 1st suffix 
	//   - SUFF2  : expect a 2nd suffix
	//   - NONE   : expect nothing (after a 2nd suffix)
	//
	// the state machine is actually more lenient than this, in that a "main stack" is allowed
	// to come at any moment, even after suffixes.  this is because such syllables are sometimes
	// found in abbreviations or other places.  basically what we check is that prefixes and 
	// suffixes go with what they are attached to.
	//
	// valid tsek-bars end in one of these states: SUFF1, SUFF2, NONE
	var state = State.PREFIX;

	// iterate over the stacks of a tsek-bar
	STACK:
	while (t != null && (vowel(t) != null || consonant(t) != null) && !visarga) {
		// translate a stack
		if (stack != null) prev_cons = stack.single_consonant;
		stack = fromWylieOneStack(tokens, i);
		i += stack.tokens_used;
		t = tokens[i];
		out += stack.uni_string;
		warns = warns.concat(stack.warns);
		visarga = stack.visarga;
		if (!opt.check) continue;
		// check for syllable structure consistency by iterating a simple state machine
		// - prefix consonant
		if (state == State.PREFIX && stack.single_consonant != null) {
			consonants.push(stack.single_consonant);
			if (isPrefix(stack.single_consonant)) {
			var next = t;
			if (opt.check_strict) next = consonantString(tokens, i);
			if (next != null && !prefix(stack.single_consonant, next)) {
				next = next.replace(/\+/g, "");
				warns.push("Prefix \"" + stack.single_consonant + "\" does not occur before \"" + next + "\".");
			}
		} else {
			warns.push("Invalid prefix consonant: \"" + stack.single_consonant + "\".");
		}
		state = State.MAIN;
		// - main stack with vowel or multiple consonants
		} else if (stack.single_consonant == null) {
		state = State.SUFF1;
		// keep track of the root consonant if it was a single cons with an "a" vowel
		if (root_idx >= 0) {
			check_root = false;
		} else if (stack.single_cons_a != null) {
			consonants.push(stack.single_cons_a);
			root_idx = consonants.length - 1;
		}
		// - unexpected single consonant after prefix
		} else if (state == State.MAIN) {
			warns.push("Expected vowel after \"" + stack.single_consonant + "\".");
			// - 1st suffix
		} else if (state == State.SUFF1) {
			consonants.push(stack.single_consonant);
			// check this one only in strict mode b/c it trips on lots of Skt stuff
			if (opt.check_strict) {
				if (!isSuffix(stack.single_consonant)) {
					warns.push("Invalid suffix consonant: \"" + stack.single_consonant + "\".");
				}
			}
			state = State.SUFF2;
			// - 2nd suffix
		} else if (state == State.SUFF2) {
			consonants.push(stack.single_consonant);
			if (isSuff2(stack.single_consonant)) {
				if (!suff2(stack.single_consonant, prev_cons)) {
					warns.push("Second suffix \"" + stack.single_consonant 
					+ "\" does not occur after \"" + prev_cons + "\".");
				}
			} else {
				warns.push("Invalid 2nd suffix consonant: \"" + stack.single_consonant  + "\".");
			}
			state = State.NONE;
			// - more crap after a 2nd suffix
		} else if (state == State.NONE) {
			warns.push("Cannot have another consonant \"" + stack.single_consonant + "\" after 2nd suffix.");
		}
	}

	if (state == State.MAIN && stack.single_consonant != null && isPrefix(stack.single_consonant)) {
	warns.push("Vowel expected after \"" + stack.single_consonant + "\".");
	}

	// check root consonant placement only if there were no warnings so far, and the syllable 
	// looks ambiguous.  not many checks are needed here because the previous state machine 
	// already takes care of most illegal combinations.
	if (opt.check && warns.length == 0 && check_root && root_idx >= 0) {
		// 2 letters where each could be prefix/suffix: root is 1st
		if (consonants.length == 2 && root_idx != 0 
		&& prefix(consonants[0], consonants[1]) && isSuffix(consonants[1]))
		{
			warns.push("Syllable should probably be \"" + consonants[0] + "a" + consonants[1] + "\".");

			// 3 letters where 1st can be prefix, 2nd can be postfix before "s" and last is "s":
			// use a lookup table as this is completely ambiguous.
		} else if (consonants.length == 3 && isPrefix(consonants[0]) &&
			suff2("s", consonants[1]) && consonants[2] == "s")
		{
			var cc = consonants.join("");
			cc = cc.replace(/\u2018/g, '\'');
			cc = cc.replace(/\u2019/g, '\'');	// typographical quotes
			var expect_key = ambiguous_key(cc);
	//		console.log('typeof expect_key', typeof expect_key)
			if (expect_key != null && expect_key != root_idx) {
				warns.push("Syllable should probably be \"" + ambiguous_wylie(cc) + "\".");
			}
		}
	}
	// return the stuff as a WylieTsekbar struct
	var ret = new WylieTsekbar();
	ret.uni_string = out;
	ret.tokens_used = i - orig_i;
	ret.warns = warns;
	return ret;
}

    // Converts one stack's worth of Wylie into unicode, starting at the given index
    // within the array of tokens.
    // Assumes that the first available token is valid, and is either a vowel or a consonant.
    // Returns a WylieStack object.
function fromWylieOneStack(tokens, i) {
	var orig_i = i
	var t = '', t2 = '', o = ''
	var out = ''
	var warns = []
	var consonants = 0		// how many consonants found
	var vowel_found = null; // any vowels (including a-chen)
	var vowel_sign = null; // any vowel signs (that go under or above the main stack)
	var single_consonant = null; // did we find just a single consonant?
	var plus = false;		// any explicit subjoining via '+'?
	var caret = 0;			// find any '^'?
	var final_found = new newHashMap(); // keep track of finals (H, M, etc) by class

	// do we have a superscript?
	t = tokens[i]
	t2 = tokens[i + 1]
	if (t2 != null && isSuperscript(t) && superscript(t, t2)) {
		if (opt.check_strict) {
			var next = consonantString(tokens, i + 1);
			if (!superscript(t, next)) {
				next = next.replace(/\+/g, '')
				warns.push("Superscript \"" + t + "\" does not occur above combination \"" + next + "\".");
			}
		}
		out += consonant(t);
		consonants++;
		i++;
		while (tokens[i] != null && tokens[i] == ("^")) { caret++; i++; }
	}
	// main consonant + stuff underneath.
	// this is usually executed just once, but the "+" subjoining operator makes it come back here
	MAIN: 
	while (true) {
		// main consonant (or a "a" after a "+")
		t = tokens[i];
		if (consonant(t) != null || (out.length > 0 && subjoined(t) != null)) {
			if (out.length > 0) {
				out += (subjoined(t));
			} else {
				out += (consonant(t));
			}
			i++;

			if (t == "a") {
				vowel_found = "a";
			} else {
				consonants++;
				single_consonant = t;
			}

			while (tokens[i] != null && tokens[i] == "^") {
				caret++;
				i++;
			}
			// subjoined: rata, yata, lata, wazur.  there can be up two subjoined letters in a stack.
			for (var z = 0; z < 2; z++) {
				t2 = tokens[i];
				if (t2 != null && isSubscript(t2)) {
					// lata does not occur below multiple consonants 
					// (otherwise we mess up "brla" = "b.r+la")
					if (t2 == "l" && consonants > 1) break;
					// full stack checking (disabled by "+")
					if (opt.check_strict && !plus) {
						var prev = consonantStringBackwards(tokens, i-1, orig_i);
						if (!subscript(t2, prev)) {
							prev = prev.replace(/\+/g, "");
							warns.push("Subjoined \"" + t2 + "\" not expected after \"" + prev + "\".");
						}
						// simple check only
					} else if (opt.check) {
						if (!subscript(t2, t) && !(z == 1 && t2 == ("w") && t == ("y"))) {
							warns.push("Subjoined \"" + t2 + "\"not expected after \"" + t + "\".");
						}
					}
					out += subjoined(t2);
					i++;
					consonants++;
					while (tokens[i] != null && tokens[i] == ("^")) { caret++; i++; }
					t = t2;
				} else {
					break;
				}
			}
		}

		// caret (^) can come anywhere in Wylie but in Unicode we generate it at the end of 
		// the stack but before vowels if it came there (seems to be what OpenOffice expects),
		// or at the very end of the stack if that's how it was in the Wylie.
		if (caret > 0) {
			if (caret > 1) {
				warns.push("Cannot have more than one \"^\" applied to the same stack.");
			}
			final_found.put(final_class("^"), "^");
			out += (final_uni("^"));
			caret = 0;
		}
		// vowel(s)
		t = tokens[i];
		if (t != null && vowel(t) != null) {
			if (out.length == 0) out += (vowel("a"));
			if (t != "a") out += (vowel(t));
			i++;
			vowel_found = t;
			if (t != "a") vowel_sign = t;
		}
		// plus sign: forces more subjoining
		t = tokens[i];
		if (t != null && t == ("+")) {
			i++;
			plus = true;
			// sanity check: next token must be vowel or subjoinable consonant.  
			t = tokens[i];
			if (t == null || (vowel(t) == null && subjoined(t) == null)) {
				if (opt.check) warns.push("Expected vowel or consonant after \"+\".");
				break MAIN;
			}
			// consonants after vowels doesn't make much sense but process it anyway
			if (opt.check) {
				if (vowel(t) == null && vowel_sign != null) {
					warns.push("Cannot subjoin consonant (" + t + ") after vowel (" + vowel_sign + ") in same stack.");
				} else if (t == ("a") && vowel_sign != null) {
					warns.push("Cannot subjoin a-chen (a) after vowel (" + vowel_sign + ") in same stack.");
				}
			}
			continue MAIN;
		}
		break MAIN;
	}
	// final tokens
	t = tokens[i];
	while (t != null && final_class(t) != null) {
		var uni = final_uni(t);
		var klass = final_class(t);
		// check for duplicates
		if (final_found.containsKey(klass)) {
			if (final_found.get(klass) == t) {
				warns.push("Cannot have two \"" + t + "\" applied to the same stack.");
			} else {
				warns.push("Cannot have \"" + t + "\" and \"" + final_found.get(klass)
					+ "\" applied to the same stack.");
			}
		} else {
			final_found.put(klass, t);
			out += (uni);
		}
		i++;
		single_consonant = null;
		t = tokens[i];
	}
	// if next is a dot "." (stack separator), skip it.
	if (tokens[i] != null && tokens[i] == (".")) i++;
	// if we had more than a consonant and no vowel, and no explicit "+" joining, backtrack and 
	// return the 1st consonant alone
	if (consonants > 1 && vowel_found == null) {
		if (plus) {
			if (opt.check) warns.push("Stack with multiple consonants should end with vowel.");
		} else {
			i = orig_i + 1;
			consonants = 1;
			single_consonant = tokens[orig_i];
			out = '';
			out += (consonant(single_consonant));
		}
	}
	// calculate "single consonant"
	if (consonants != 1 || plus) {
		single_consonant = null;
	}
	// return the stuff as a WylieStack struct
	var ret = new WylieStack();
	ret.uni_string = out;
	ret.tokens_used = i - orig_i;
	if (vowel_found != null) {
		ret.single_consonant = null;
	} else {
		ret.single_consonant = single_consonant;
	}

	if (vowel_found != null && vowel_found == ("a")) {
		ret.single_cons_a = single_consonant;
	} else {
		ret.single_cons_a = null;
	}
	ret.warns = warns;
	ret.visarga = final_found.containsKey("H");
	return ret;
}

	// Converts a Wylie (EWTS) string to unicode.  If 'warns' is not 'null', puts warnings into it.
function fromWylie(str, warns) {
		var out = '', line = 1, units = 0, i = 0
		if (opt.fix_spacing) { str = str.replace(/^\s+/, '') }
		var tokens = splitIntoTokens(str);
		ITER:while (tokens[i] != null) {
			var t = tokens[i], o = null
			// [non-tibetan text] : pass through, nesting brackets
			if (t == "[") {
				var nesting = 1;
				i++;
					ESC:while (tokens[i] != null) {
					t = tokens[i++];
					if (t == "[") nesting++;
					if (t == "]") nesting--;
					if (nesting == 0) continue ITER;
					// handle unicode escapes and \1-char escapes within [comments]...
					if (t.charAt(0) == '\\' && (t.charAt(1) == 'u' || t.charAt(1) == 'U')) {
						o = unicodeEscape(warns, line, t);
						if (o != null) {
							out += o;
							continue ESC;
						}
					}
					if (t.charAt(0) == '\\') {
						o = t.substring(1);
					} else {
						o = t;
					}
					out += o;
				}
				warnl(warns, line, "Unfinished [non-Wylie stuff].");
				break ITER;
			}
			// punctuation, numbers, etc
			o = other(t);
			if (o != null) {
				out += o;
				i++;
				units++;
				// collapse multiple spaces?
				if (t == " " && opt.fix_spacing) {
					while (tokens[i] != null && tokens[i] == " ") i++;
				}
				continue ITER;
			}
			// vowels & consonants: process tibetan script up to a tsek, punctuation or line noise
			if (vowel(t) != null || consonant(t) != null) {
				var tb = fromWylieOneTsekbar(tokens, i);
				var word = '';
				for (var j = 0; j < tb.tokens_used; j++) {
					word += (tokens[i+j]);
				}
				out += tb.uni_string;
				i += tb.tokens_used;
				units++;
				for (var w = 0; w < tb.warns.length; w++) {
					warnl(warns, line, "\"" + word + "\": " + tb.warns[w]);
				}
				continue ITER;
			}
			// *** misc unicode and line handling stuff ***
			// ignore BOM and zero-width space
			if (t == "\ufeff" || t == "\u200b") {
				i++;
				continue ITER;
			}
			// \\u, \\U unicode characters
			if (t.charAt(0) == '\\' && (t.charAt(1) == 'u' || t.charAt(1) == 'U')) {
				o = unicodeEscape(warns, line, t);
				if (o != null) {
					i++;
					out += o;
					continue ITER;
				}
			}
			// backslashed characters
			if (t.charAt(0) == '\\') {
				out += t.substring(1);
				i++;
				continue ITER;
			}
			// count lines
			if (t == "\r\n" || t == "\n" || t == "\r") {
				line++;
				out += t;
				i++;
				// also eat spaces after newlines (optional)
				if (opt.fix_spacing) {
					while (tokens[i] != null && tokens[i] == " ") i++;
				}
				continue ITER;
			}
			// stuff that shouldn't occur out of context: special chars and remaining [a-zA-Z]
			var c = t.charAt(0);
			if (isSpecial(t) || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
				warnl(warns, line, "Unexpected character \"" + t + "\".");
			}
			// anything else: pass through
			out += t;
			i++;
		}
		if (units == 0) warn(warns, "No Tibetan characters found!");
		return out
	}
	
	// given a character, return a string like "\\uxxxx", with its code in hex
function formatHex(t) { //char
		// not compatible with GWT...
		// return String.format("\\u%04x", (int)t);
		var sb = '';
		sb += '\\u';
		var s = t.charCodeAt(0).toString(16);
		for (var i = s.length; i < 4; i++) sb += '0';
		sb += s;
		return sb;
	}

	// handles spaces (if any) in the input stream, turning them into '_'.
	// this is abstracted out because in non-escaping mode, we only want to turn spaces into _
	// when they come in the middle of Tibetan script.
function handleSpaces(str, i, out) { //return int
	var found = 0;
	var orig_i = i;
	while (i < str.length && str.charAt(i) == ' ') {
		i++;
		found++;
	}
	if (found == 0 || i == str.length) return 0;
	var t = str.charAt(i);
	if (tib_top(t) == null && tib_other(t) == null) return 0;
	// found 'found' spaces between two tibetan bits; generate the same number of '_'s
	for (i = 0; i < found; i++) out += '_';
	return found;
}

// for space-handling in escaping mode: is the next thing coming (after a number of spaces)
// some non-tibetan bit, within the same line?
function followedByNonTibetan(str, i) {
	var len = str.length;
	while (i < len && str.charAt(i) == ' ') i++;
	if (i == len) return false;
	var t = str.charAt(i);
	return tib_top(t) == null && tib_other(t) == null && t != '\r' && t != '\n';
}

// Convert Unicode to Wylie: one tsekbar
function toWylieOneTsekbar(str, len, i) {
	var orig_i = i;
	var warns = [];
	var stacks = [];// ArrayList<ToWylieStack>;
	ITER: 
	while (true) {
		var st = toWylieOneStack(str, len, i);
		stacks.push(st);
		warns = warns.concat(st.warns);
		i += st.tokens_used;
		if (st.visarga) break ITER;
		if (i >= len || tib_top(str.charAt(i)) == null) break ITER;
	}
	// figure out if some of these stacks can be prefixes or suffixes (in which case
	// they don't need their "a" vowels)
	var last = stacks.length - 1;
	if (stacks.length > 1 && stacks[0].single_cons != null) {
		// we don't count the wazur in the root stack, for prefix checking
		var cs = stacks[1].cons_str.replace(/\+w/g, "")
		if (prefix(stacks[0].single_cons, cs)) stacks[0].prefix = true;
	}
	if (stacks.length > 1 && stacks[last].single_cons != null 
	&& isSuffix(stacks[last].single_cons)) {
		stacks[last].suffix = true;
	}
	if (stacks.length > 2 && stacks[last].single_cons != null 
	&& stacks[last - 1].single_cons != null
	&& isSuffix(stacks[last - 1].single_cons)
	&& suff2(stacks[last].single_cons, stacks[last - 1].single_cons)) {
		stacks[last].suff2 = true;
		stacks[last - 1].suffix = true;
	}
	// if there are two stacks and both can be prefix-suffix, then 1st is root
	if (stacks.length == 2 && stacks[0].prefix && stacks[1].suffix) {
	    stacks[0].prefix = false;
	}
	// if there are three stacks and they can be prefix, suffix and suff2, then check w/ a table
	if (stacks.length == 3 && stacks[0].prefix && stacks[1].suffix && stacks[2].suff2) {
		var strb = []
		for (var si = 0; si < stacks.length; si++) strb.push(stacks[si].single_cons)
		var ztr = strb.join('')
		var root = ambiguous_key(ztr)
		if (root == null) {
			warns.push("Ambiguous syllable found: root consonant not known for \"" + ztr + "\".")
			// make it up...  (ex. "mgas" for ma, ga, sa)
			root = 1
		}
		stacks[root].prefix = stacks[root].suffix = false
		stacks[root + 1].suff2 = false
	}
	// if the prefix together with the main stack could be mistaken for a single stack, add a "."
	if (stacks[0].prefix && tib_stack(stacks[0].single_cons + "+" + stacks[1].cons_str)) 
		stacks[0].dot = true;
	// put it all together
	var out = ''
	for (var si = 0; si < stacks.length; si++) out += putStackTogether(stacks[si])
	var ret = new ToWylieTsekbar();
	ret.wylie = out;
	ret.tokens_used = i - orig_i;
	ret.warns = warns;
	return ret;
}
	 
// Unicode to Wylie: one stack at a time
function toWylieOneStack(str, len, i) {
	var orig_i = i;
	var ffinal = null, vowel = null, klass = null;
	// split the stack into a ToWylieStack object:
	//   - top symbol
	//   - stacked signs (first is the top symbol again, then subscribed main characters...)
	//   - caret (did we find a stray tsa-phru or not?)
	//   - vowel signs (including small subscribed a-chung, "-i" Skt signs, etc)
	//   - final stuff (including anusvara, visarga, halanta...)
	//   - and some more variables to keep track of what has been found
	var st = new ToWylieStack();
	// assume: tib_top(t) exists
	var t = str.charAt(i++);
	st.top = tib_top(t);
	st.stack.push(tib_top(t));
	// grab everything else below the top sign and classify in various categories
	while (i < len) {
		t = str.charAt(i);
		var o;
		if ((o = tib_subjoined(t)) != null) {
			i++;
			st.stack.push(o);
			// check for bad ordering
			if (st.finals.length > 0) {
				st.warns.push("Subjoined sign \"" + o + "\" found after final sign \"" + ffinal + "\".");
			} else if (st.vowels.length > 0) {
				st.warns.push("Subjoined sign \"" + o + "\" found after vowel sign \"" + vowel + "\".");
			}
		} else if ((o = tib_vowel(t)) != null) {
			i++;
			st.vowels.push(o);
			if (vowel == null) vowel = o;
			// check for bad ordering
			if (st.finals.length > 0) {
				st.warns.push("Vowel sign \"" + o + "\" found after final sign \"" + ffinal + "\".");
			}
		} else if ((o = tib_final_wylie(t)) != null) {
			i++;
			klass = tib_final_class(t);
			if (o == "^") {
				st.caret = true;
			} else {
				if (o == "H") st.visarga = true;
				st.finals.push(o);
				if (ffinal == null) ffinal = o;
				// check for invalid combinations
				if (st.finals_found.containsKey(klass)) {
					st.warns.push("Final sign \"" + o 
					+ "\" should not combine with found after final sign \"" + ffinal + "\".");
				} else {
					st.finals_found.put(klass, o);
				}
			}
		} else break;
	}
	// now analyze the stack according to various rules
	// a-chen with vowel signs: remove the "a" and keep the vowel signs
	if (st.top == "a" && st.stack.length == 1 && st.vowels.length > 0) st.stack.shift();
	// handle long vowels: A+i becomes I, etc.
	if (st.vowels.length > 1 && st.vowels[0] == "A" && tib_vowel_long(st.vowels[1]) != null) {
		var l = tib_vowel_long(st.vowels[1]);
		st.vowels.shift();
		st.vowels.shift();
		st.vowels.unshift(l);
	}
	// special cases: "ph^" becomes "f", "b^" becomes "v"
	if (st.caret && st.stack.length == 1 && tib_caret(st.top) != null) {
		var l = tib_caret(st.top);
		st.top = l;
		st.stack.shift();
		st.stack.unshift(l);
		st.caret = false;
	}
	st.cons_str = st.stack.join("+");
	// if this is a single consonant, keep track of it (useful for prefix/suffix analysis)
	if (st.stack.length == 1 && st.stack[0] != ("a") && !st.caret 
	&& st.vowels.length == 0 && st.finals.length == 0) {
		st.single_cons = st.cons_str;
	}
	// return the analyzed stack
	st.tokens_used = i - orig_i;
	return st;
}

// Puts an analyzed stack together into Wylie output, adding an implicit "a" if needed.
function putStackTogether(st) {
	var out = '';
	// put the main elements together... stacked with "+" unless it's a regular stack
	if (tib_stack(st.cons_str)) {
	    out += st.stack.join("");
	} else out += (st.cons_str);
	// caret (tsa-phru) goes here as per some (halfway broken) Unicode specs...
	if (st.caret) out += ("^");
	// vowels...
	if (st.vowels.length > 0) {
		out += st.vowels.join("+");
	} else if (!st.prefix && !st.suffix && !st.suff2
	&& (st.cons_str.length == 0 || st.cons_str.charAt(st.cons_str.length - 1) != 'a')) {
		out += "a"
	}
	// final stuff
	out += st.finals.join("");
	if (st.dot) out += ".";
	return out;
}

	// Converts from Unicode strings to Wylie (EWTS) transliteration.
	//
	// Arguments are:
	//    str   : the unicode string to be converted
	//    escape: whether to escape non-tibetan characters according to Wylie encoding.
	//            if escape == false, anything that is not tibetan will be just passed through.
	//
	// Returns: the transliterated string.
	//
	// To get the warnings, call getWarnings() afterwards.

function toWylie(str, warns, escape) {
	if (escape == undefined) escape = true
	var out = ''
	var line = 1
	var units = 0
	// globally search and replace some deprecated pre-composed Sanskrit vowels
	str = str.replace(/\u0f76/g, "\u0fb2\u0f80")
	str = str.replace(/\u0f77/g, "\u0fb2\u0f71\u0f80")
	str = str.replace(/\u0f78/g, "\u0fb3\u0f80")
	str = str.replace(/\u0f79/g, "\u0fb3\u0f71\u0f80")
	str = str.replace(/\u0f81/g, "\u0f71\u0f80")
	var i = 0
	var len = str.length
	// iterate over the string, codepoint by codepoint
	ITER:
	while (i < len) {
		var t = str.charAt(i);
		// found tibetan script - handle one tsekbar
		if (tib_top(t) != null) {
			var tb = toWylieOneTsekbar(str, len, i);
			out += tb.wylie;
			i += tb.tokens_used;
			units++;
			for (var w = 0; w < tb.warns.length; w++) warnl(warns, line, tb.warns[w]);
			if (!escape) i += handleSpaces(str, i, out);
			continue ITER;
		}
		// punctuation and special stuff. spaces are tricky:
		// - in non-escaping mode: spaces are not turned to '_' here (handled by handleSpaces)
		// - in escaping mode: don't do spaces if there is non-tibetan coming, so they become part
		//   of the [escaped block].
		var o = tib_other(t);
		if (o != null && (t != ' ' || (escape && !followedByNonTibetan(str, i)))) {
			out += o;
			i++;
			units++;
			if (!escape) i += handleSpaces(str, i, out);
			continue ITER;
		}
		// newlines, count lines.  "\r\n" together count as one newline.
		if (t == '\r' || t == '\n') {
			line++;
			i++;
			out += t;
			if (t == '\r' && i < len && str.charAt(i) == '\n') {
				i++;
				out += ('\n');
			}
			continue ITER;
		}
		// ignore BOM and zero-width space
		if (t == '\ufeff' || t == '\u200b') {
			i++;
			continue ITER;
		}
		// anything else - pass along?
		if (!escape) {
			out += (t);
			i++;
			continue ITER;
		}
		// other characters in the tibetan plane, escape with \\u0fxx
		if (t >= '\u0f00' && t <= '\u0fff') {
			var c = formatHex(t);
			out += c;
			i++;
			// warn for tibetan codepoints that should appear only after a tib_top
			if (tib_subjoined(t) != null || tib_vowel(t) != null || tib_final_wylie(t) != null) {
				warnl(warns, line, "Tibetan sign " + c + " needs a top symbol to attach to.");
			}
			continue ITER;
		}
		// ... or escape according to Wylie:
		// put it in [comments], escaping [] sequences and closing at line ends
		out += "[";
		while (tib_top(t) == null && (tib_other(t) == null || t == ' ') && t != '\r' && t != '\n') {
			// \escape [opening and closing] brackets
			if (t == '[' || t == ']') {
				out += "\\";
				out += t;
			// unicode-escape anything in the tibetan plane (i.e characters not handled by Wylie)
			} else if (t >= '\u0f00' && t <= '\u0fff') {
				out += formatHex(t);
				// and just pass through anything else!
			} else {
				out += t;
			}
			if (++i >= len) break;
			t = str.charAt(i);
		}
		 out += "]";
	}
	return out;
}
module.exports= {
		fromWylie: fromWylie,
		toWylie: toWylie,
		setopt: setopt,
		getopt: function() { return opt },
		five: function() {
			return 555;
		}
}



});
require.register("ksana-document/languages.js", function(exports, require, module){
var tibetan={
	romanize:require("./tibetan/wylie")
}
var chinese={};
var languages={
	tibetan:tibetan
	,chinese:chinese
}

module.exports=languages;
});
require.register("ksana-document/diff.js", function(exports, require, module){
/**
 * Diff Match and Patch
 *
 * Copyright 2006 Google Inc.
 * http://code.google.com/p/google-diff-match-patch/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Computes the difference between two texts to create a patch.
 * Applies the patch onto another text, allowing for errors.
 * @author fraser@google.com (Neil Fraser)
 */

/**
 * Class containing the diff, match and patch methods.
 * @constructor
 */
function diff_match_patch() {

  // Defaults.
  // Redefine these in your program to override the defaults.

  // Number of seconds to map a diff before giving up (0 for infinity).
  this.Diff_Timeout = 1.0;
  // Cost of an empty edit operation in terms of edit characters.
  this.Diff_EditCost = 4;
  // At what point is no match declared (0.0 = perfection, 1.0 = very loose).
  this.Match_Threshold = 0.5;
  // How far to search for a match (0 = exact location, 1000+ = broad match).
  // A match this many characters away from the expected location will add
  // 1.0 to the score (0.0 is a perfect match).
  this.Match_Distance = 1000;
  // When deleting a large block of text (over ~64 characters), how close do
  // the contents have to be to match the expected contents. (0.0 = perfection,
  // 1.0 = very loose).  Note that Match_Threshold controls how closely the
  // end points of a delete need to match.
  this.Patch_DeleteThreshold = 0.5;
  // Chunk size for context length.
  this.Patch_Margin = 4;

  // The number of bits in an int.
  this.Match_MaxBits = 32;
}


//  DIFF FUNCTIONS


/**
 * The data structure representing a diff is an array of tuples:
 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
 */
var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0;

/** @typedef {{0: number, 1: string}} */
diff_match_patch.Diff;


/**
 * Find the differences between two texts.  Simplifies the problem by stripping
 * any common prefix or suffix off the texts before diffing.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {boolean=} opt_checklines Optional speedup flag. If present and false,
 *     then don't run a line-level diff first to identify the changed areas.
 *     Defaults to true, which does a faster, slightly less optimal diff.
 * @param {number} opt_deadline Optional time when the diff should be complete
 *     by.  Used internally for recursive calls.  Users should set DiffTimeout
 *     instead.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 */
diff_match_patch.prototype.diff_main = function(text1, text2, opt_checklines,
    opt_deadline) {
  // Set a deadline by which time the diff must be complete.
  if (typeof opt_deadline == 'undefined') {
    if (this.Diff_Timeout <= 0) {
      opt_deadline = Number.MAX_VALUE;
    } else {
      opt_deadline = (new Date).getTime() + this.Diff_Timeout * 1000;
    }
  }
  var deadline = opt_deadline;

  // Check for null inputs.
  if (text1 == null || text2 == null) {
    throw new Error('Null input. (diff_main)');
  }

  // Check for equality (speedup).
  if (text1 == text2) {
    if (text1) {
      return [[DIFF_EQUAL, text1]];
    }
    return [];
  }

  if (typeof opt_checklines == 'undefined') {
    opt_checklines = true;
  }
  var checklines = opt_checklines;

  // Trim off common prefix (speedup).
  var commonlength = this.diff_commonPrefix(text1, text2);
  var commonprefix = text1.substring(0, commonlength);
  text1 = text1.substring(commonlength);
  text2 = text2.substring(commonlength);

  // Trim off common suffix (speedup).
  commonlength = this.diff_commonSuffix(text1, text2);
  var commonsuffix = text1.substring(text1.length - commonlength);
  text1 = text1.substring(0, text1.length - commonlength);
  text2 = text2.substring(0, text2.length - commonlength);

  // Compute the diff on the middle block.
  var diffs = this.diff_compute_(text1, text2, checklines, deadline);

  // Restore the prefix and suffix.
  if (commonprefix) {
    diffs.unshift([DIFF_EQUAL, commonprefix]);
  }
  if (commonsuffix) {
    diffs.push([DIFF_EQUAL, commonsuffix]);
  }
  this.diff_cleanupMerge(diffs);
  return diffs;
};


/**
 * Find the differences between two texts.  Assumes that the texts do not
 * have any common prefix or suffix.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {boolean} checklines Speedup flag.  If false, then don't run a
 *     line-level diff first to identify the changed areas.
 *     If true, then run a faster, slightly less optimal diff.
 * @param {number} deadline Time when the diff should be complete by.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_compute_ = function(text1, text2, checklines,
    deadline) {
  var diffs;

  if (!text1) {
    // Just add some text (speedup).
    return [[DIFF_INSERT, text2]];
  }

  if (!text2) {
    // Just delete some text (speedup).
    return [[DIFF_DELETE, text1]];
  }

  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  var i = longtext.indexOf(shorttext);
  if (i != -1) {
    // Shorter text is inside the longer text (speedup).
    diffs = [[DIFF_INSERT, longtext.substring(0, i)],
             [DIFF_EQUAL, shorttext],
             [DIFF_INSERT, longtext.substring(i + shorttext.length)]];
    // Swap insertions for deletions if diff is reversed.
    if (text1.length > text2.length) {
      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
    }
    return diffs;
  }

  if (shorttext.length == 1) {
    // Single character string.
    // After the previous speedup, the character can't be an equality.
    return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
  }

  // Check to see if the problem can be split in two.
  var hm = this.diff_halfMatch_(text1, text2);
  if (hm) {
    // A half-match was found, sort out the return data.
    var text1_a = hm[0];
    var text1_b = hm[1];
    var text2_a = hm[2];
    var text2_b = hm[3];
    var mid_common = hm[4];
    // Send both pairs off for separate processing.
    var diffs_a = this.diff_main(text1_a, text2_a, checklines, deadline);
    var diffs_b = this.diff_main(text1_b, text2_b, checklines, deadline);
    // Merge the results.
    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
  }

  if (checklines && text1.length > 100 && text2.length > 100) {
    return this.diff_lineMode_(text1, text2, deadline);
  }

  return this.diff_bisect_(text1, text2, deadline);
};


/**
 * Do a quick line-level diff on both strings, then rediff the parts for
 * greater accuracy.
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} deadline Time when the diff should be complete by.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_lineMode_ = function(text1, text2, deadline) {
  // Scan the text on a line-by-line basis first.
  var a = this.diff_linesToChars_(text1, text2);
  text1 = a.chars1;
  text2 = a.chars2;
  var linearray = a.lineArray;

  var diffs = this.diff_main(text1, text2, false, deadline);

  // Convert the diff back to original text.
  this.diff_charsToLines_(diffs, linearray);
  // Eliminate freak matches (e.g. blank lines)
  this.diff_cleanupSemantic(diffs);

  // Rediff any replacement blocks, this time character-by-character.
  // Add a dummy entry at the end.
  diffs.push([DIFF_EQUAL, '']);
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  while (pointer < diffs.length) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        break;
      case DIFF_EQUAL:
        // Upon reaching an equality, check for prior redundancies.
        if (count_delete >= 1 && count_insert >= 1) {
          // Delete the offending records and add the merged ones.
          diffs.splice(pointer - count_delete - count_insert,
                       count_delete + count_insert);
          pointer = pointer - count_delete - count_insert;
          var a = this.diff_main(text_delete, text_insert, false, deadline);
          for (var j = a.length - 1; j >= 0; j--) {
            diffs.splice(pointer, 0, a[j]);
          }
          pointer = pointer + a.length;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
        break;
    }
    pointer++;
  }
  diffs.pop();  // Remove the dummy entry at the end.

  return diffs;
};


/**
 * Find the 'middle snake' of a diff, split the problem in two
 * and return the recursively constructed diff.
 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} deadline Time at which to bail if not yet complete.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_bisect_ = function(text1, text2, deadline) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  var max_d = Math.ceil((text1_length + text2_length) / 2);
  var v_offset = max_d;
  var v_length = 2 * max_d;
  var v1 = new Array(v_length);
  var v2 = new Array(v_length);
  // Setting all elements to -1 is faster in Chrome & Firefox than mixing
  // integers and undefined.
  for (var x = 0; x < v_length; x++) {
    v1[x] = -1;
    v2[x] = -1;
  }
  v1[v_offset + 1] = 0;
  v2[v_offset + 1] = 0;
  var delta = text1_length - text2_length;
  // If the total number of characters is odd, then the front path will collide
  // with the reverse path.
  var front = (delta % 2 != 0);
  // Offsets for start and end of k loop.
  // Prevents mapping of space beyond the grid.
  var k1start = 0;
  var k1end = 0;
  var k2start = 0;
  var k2end = 0;
  for (var d = 0; d < max_d; d++) {
    // Bail out if deadline is reached.
    if ((new Date()).getTime() > deadline) {
      break;
    }

    // Walk the front path one step.
    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
      var k1_offset = v_offset + k1;
      var x1;
      if (k1 == -d || (k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
        x1 = v1[k1_offset + 1];
      } else {
        x1 = v1[k1_offset - 1] + 1;
      }
      var y1 = x1 - k1;
      while (x1 < text1_length && y1 < text2_length &&
             text1.charAt(x1) == text2.charAt(y1)) {
        x1++;
        y1++;
      }
      v1[k1_offset] = x1;
      if (x1 > text1_length) {
        // Ran off the right of the graph.
        k1end += 2;
      } else if (y1 > text2_length) {
        // Ran off the bottom of the graph.
        k1start += 2;
      } else if (front) {
        var k2_offset = v_offset + delta - k1;
        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
          // Mirror x2 onto top-left coordinate system.
          var x2 = text1_length - v2[k2_offset];
          if (x1 >= x2) {
            // Overlap detected.
            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
          }
        }
      }
    }

    // Walk the reverse path one step.
    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
      var k2_offset = v_offset + k2;
      var x2;
      if (k2 == -d || (k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
        x2 = v2[k2_offset + 1];
      } else {
        x2 = v2[k2_offset - 1] + 1;
      }
      var y2 = x2 - k2;
      while (x2 < text1_length && y2 < text2_length &&
             text1.charAt(text1_length - x2 - 1) ==
             text2.charAt(text2_length - y2 - 1)) {
        x2++;
        y2++;
      }
      v2[k2_offset] = x2;
      if (x2 > text1_length) {
        // Ran off the left of the graph.
        k2end += 2;
      } else if (y2 > text2_length) {
        // Ran off the top of the graph.
        k2start += 2;
      } else if (!front) {
        var k1_offset = v_offset + delta - k2;
        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
          var x1 = v1[k1_offset];
          var y1 = v_offset + x1 - k1_offset;
          // Mirror x2 onto top-left coordinate system.
          x2 = text1_length - x2;
          if (x1 >= x2) {
            // Overlap detected.
            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
          }
        }
      }
    }
  }
  // Diff took too long and hit the deadline or
  // number of diffs equals number of characters, no commonality at all.
  return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
};


/**
 * Given the location of the 'middle snake', split the diff in two parts
 * and recurse.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} x Index of split point in text1.
 * @param {number} y Index of split point in text2.
 * @param {number} deadline Time at which to bail if not yet complete.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_bisectSplit_ = function(text1, text2, x, y,
    deadline) {
  var text1a = text1.substring(0, x);
  var text2a = text2.substring(0, y);
  var text1b = text1.substring(x);
  var text2b = text2.substring(y);

  // Compute both diffs serially.
  var diffs = this.diff_main(text1a, text2a, false, deadline);
  var diffsb = this.diff_main(text1b, text2b, false, deadline);

  return diffs.concat(diffsb);
};


/**
 * Split two texts into an array of strings.  Reduce the texts to a string of
 * hashes where each Unicode character represents one line.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {{chars1: string, chars2: string, lineArray: !Array.<string>}}
 *     An object containing the encoded text1, the encoded text2 and
 *     the array of unique strings.
 *     The zeroth element of the array of unique strings is intentionally blank.
 * @private
 */
diff_match_patch.prototype.diff_linesToChars_ = function(text1, text2) {
  var lineArray = [];  // e.g. lineArray[4] == 'Hello\n'
  var lineHash = {};   // e.g. lineHash['Hello\n'] == 4

  // '\x00' is a valid character, but various debuggers don't like it.
  // So we'll insert a junk entry to avoid generating a null character.
  lineArray[0] = '';

  /**
   * Split a text into an array of strings.  Reduce the texts to a string of
   * hashes where each Unicode character represents one line.
   * Modifies linearray and linehash through being a closure.
   * @param {string} text String to encode.
   * @return {string} Encoded string.
   * @private
   */
  function diff_linesToCharsMunge_(text) {
    var chars = '';
    // Walk the text, pulling out a substring for each line.
    // text.split('\n') would would temporarily double our memory footprint.
    // Modifying text would create many large strings to garbage collect.
    var lineStart = 0;
    var lineEnd = -1;
    // Keeping our own length variable is faster than looking it up.
    var lineArrayLength = lineArray.length;
    while (lineEnd < text.length - 1) {
      lineEnd = text.indexOf('\n', lineStart);
      if (lineEnd == -1) {
        lineEnd = text.length - 1;
      }
      var line = text.substring(lineStart, lineEnd + 1);
      lineStart = lineEnd + 1;

      if (lineHash.hasOwnProperty ? lineHash.hasOwnProperty(line) :
          (lineHash[line] !== undefined)) {
        chars += String.fromCharCode(lineHash[line]);
      } else {
        chars += String.fromCharCode(lineArrayLength);
        lineHash[line] = lineArrayLength;
        lineArray[lineArrayLength++] = line;
      }
    }
    return chars;
  }

  var chars1 = diff_linesToCharsMunge_(text1);
  var chars2 = diff_linesToCharsMunge_(text2);
  return {chars1: chars1, chars2: chars2, lineArray: lineArray};
};


/**
 * Rehydrate the text in a diff from a string of line hashes to real lines of
 * text.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @param {!Array.<string>} lineArray Array of unique strings.
 * @private
 */
diff_match_patch.prototype.diff_charsToLines_ = function(diffs, lineArray) {
  for (var x = 0; x < diffs.length; x++) {
    var chars = diffs[x][1];
    var text = [];
    for (var y = 0; y < chars.length; y++) {
      text[y] = lineArray[chars.charCodeAt(y)];
    }
    diffs[x][1] = text.join('');
  }
};


/**
 * Determine the common prefix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the start of each
 *     string.
 */
diff_match_patch.prototype.diff_commonPrefix = function(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerstart = 0;
  while (pointermin < pointermid) {
    if (text1.substring(pointerstart, pointermid) ==
        text2.substring(pointerstart, pointermid)) {
      pointermin = pointermid;
      pointerstart = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};


/**
 * Determine the common suffix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of each string.
 */
diff_match_patch.prototype.diff_commonSuffix = function(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 ||
      text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerend = 0;
  while (pointermin < pointermid) {
    if (text1.substring(text1.length - pointermid, text1.length - pointerend) ==
        text2.substring(text2.length - pointermid, text2.length - pointerend)) {
      pointermin = pointermid;
      pointerend = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};


/**
 * Determine if the suffix of one string is the prefix of another.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of the first
 *     string and the start of the second string.
 * @private
 */
diff_match_patch.prototype.diff_commonOverlap_ = function(text1, text2) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  // Eliminate the null case.
  if (text1_length == 0 || text2_length == 0) {
    return 0;
  }
  // Truncate the longer string.
  if (text1_length > text2_length) {
    text1 = text1.substring(text1_length - text2_length);
  } else if (text1_length < text2_length) {
    text2 = text2.substring(0, text1_length);
  }
  var text_length = Math.min(text1_length, text2_length);
  // Quick check for the worst case.
  if (text1 == text2) {
    return text_length;
  }

  // Start by looking for a single character match
  // and increase length until no match is found.
  // Performance analysis: http://neil.fraser.name/news/2010/11/04/
  var best = 0;
  var length = 1;
  while (true) {
    var pattern = text1.substring(text_length - length);
    var found = text2.indexOf(pattern);
    if (found == -1) {
      return best;
    }
    length += found;
    if (found == 0 || text1.substring(text_length - length) ==
        text2.substring(0, length)) {
      best = length;
      length++;
    }
  }
};


/**
 * Do the two texts share a substring which is at least half the length of the
 * longer text?
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {Array.<string>} Five element Array, containing the prefix of
 *     text1, the suffix of text1, the prefix of text2, the suffix of
 *     text2 and the common middle.  Or null if there was no match.
 * @private
 */
diff_match_patch.prototype.diff_halfMatch_ = function(text1, text2) {
  if (this.Diff_Timeout <= 0) {
    // Don't risk returning a non-optimal diff if we have unlimited time.
    return null;
  }
  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
    return null;  // Pointless.
  }
  var dmp = this;  // 'this' becomes 'window' in a closure.

  /**
   * Does a substring of shorttext exist within longtext such that the substring
   * is at least half the length of longtext?
   * Closure, but does not reference any external variables.
   * @param {string} longtext Longer string.
   * @param {string} shorttext Shorter string.
   * @param {number} i Start index of quarter length substring within longtext.
   * @return {Array.<string>} Five element Array, containing the prefix of
   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
   *     of shorttext and the common middle.  Or null if there was no match.
   * @private
   */
  function diff_halfMatchI_(longtext, shorttext, i) {
    // Start with a 1/4 length substring at position i as a seed.
    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
    var j = -1;
    var best_common = '';
    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
    while ((j = shorttext.indexOf(seed, j + 1)) != -1) {
      var prefixLength = dmp.diff_commonPrefix(longtext.substring(i),
                                               shorttext.substring(j));
      var suffixLength = dmp.diff_commonSuffix(longtext.substring(0, i),
                                               shorttext.substring(0, j));
      if (best_common.length < suffixLength + prefixLength) {
        best_common = shorttext.substring(j - suffixLength, j) +
            shorttext.substring(j, j + prefixLength);
        best_longtext_a = longtext.substring(0, i - suffixLength);
        best_longtext_b = longtext.substring(i + prefixLength);
        best_shorttext_a = shorttext.substring(0, j - suffixLength);
        best_shorttext_b = shorttext.substring(j + prefixLength);
      }
    }
    if (best_common.length * 2 >= longtext.length) {
      return [best_longtext_a, best_longtext_b,
              best_shorttext_a, best_shorttext_b, best_common];
    } else {
      return null;
    }
  }

  // First check if the second quarter is the seed for a half-match.
  var hm1 = diff_halfMatchI_(longtext, shorttext,
                             Math.ceil(longtext.length / 4));
  // Check again based on the third quarter.
  var hm2 = diff_halfMatchI_(longtext, shorttext,
                             Math.ceil(longtext.length / 2));
  var hm;
  if (!hm1 && !hm2) {
    return null;
  } else if (!hm2) {
    hm = hm1;
  } else if (!hm1) {
    hm = hm2;
  } else {
    // Both matched.  Select the longest.
    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
  }

  // A half-match was found, sort out the return data.
  var text1_a, text1_b, text2_a, text2_b;
  if (text1.length > text2.length) {
    text1_a = hm[0];
    text1_b = hm[1];
    text2_a = hm[2];
    text2_b = hm[3];
  } else {
    text2_a = hm[0];
    text2_b = hm[1];
    text1_a = hm[2];
    text1_b = hm[3];
  }
  var mid_common = hm[4];
  return [text1_a, text1_b, text2_a, text2_b, mid_common];
};


/**
 * Reduce the number of edits by eliminating semantically trivial equalities.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupSemantic = function(diffs) {
  var changes = false;
  var equalities = [];  // Stack of indices where equalities are found.
  var equalitiesLength = 0;  // Keeping our own length var is faster in JS.
  /** @type {?string} */
  var lastequality = null;
  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
  var pointer = 0;  // Index of current position.
  // Number of characters that changed prior to the equality.
  var length_insertions1 = 0;
  var length_deletions1 = 0;
  // Number of characters that changed after the equality.
  var length_insertions2 = 0;
  var length_deletions2 = 0;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {  // Equality found.
      equalities[equalitiesLength++] = pointer;
      length_insertions1 = length_insertions2;
      length_deletions1 = length_deletions2;
      length_insertions2 = 0;
      length_deletions2 = 0;
      lastequality = diffs[pointer][1];
    } else {  // An insertion or deletion.
      if (diffs[pointer][0] == DIFF_INSERT) {
        length_insertions2 += diffs[pointer][1].length;
      } else {
        length_deletions2 += diffs[pointer][1].length;
      }
      // Eliminate an equality that is smaller or equal to the edits on both
      // sides of it.
      if (lastequality && (lastequality.length <=
          Math.max(length_insertions1, length_deletions1)) &&
          (lastequality.length <= Math.max(length_insertions2,
                                           length_deletions2))) {
        // Duplicate record.
        diffs.splice(equalities[equalitiesLength - 1], 0,
                     [DIFF_DELETE, lastequality]);
        // Change second copy to insert.
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        // Throw away the equality we just deleted.
        equalitiesLength--;
        // Throw away the previous equality (it needs to be reevaluated).
        equalitiesLength--;
        pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
        length_insertions1 = 0;  // Reset the counters.
        length_deletions1 = 0;
        length_insertions2 = 0;
        length_deletions2 = 0;
        lastequality = null;
        changes = true;
      }
    }
    pointer++;
  }

  // Normalize the diff.
  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
  this.diff_cleanupSemanticLossless(diffs);

  // Find any overlaps between deletions and insertions.
  // e.g: <del>abcxxx</del><ins>xxxdef</ins>
  //   -> <del>abc</del>xxx<ins>def</ins>
  // e.g: <del>xxxabc</del><ins>defxxx</ins>
  //   -> <ins>def</ins>xxx<del>abc</del>
  // Only extract an overlap if it is as big as the edit ahead or behind it.
  pointer = 1;
  while (pointer < diffs.length) {
    if (diffs[pointer - 1][0] == DIFF_DELETE &&
        diffs[pointer][0] == DIFF_INSERT) {
      var deletion = diffs[pointer - 1][1];
      var insertion = diffs[pointer][1];
      var overlap_length1 = this.diff_commonOverlap_(deletion, insertion);
      var overlap_length2 = this.diff_commonOverlap_(insertion, deletion);
      if (overlap_length1 >= overlap_length2) {
        if (overlap_length1 >= deletion.length / 2 ||
            overlap_length1 >= insertion.length / 2) {
          // Overlap found.  Insert an equality and trim the surrounding edits.
          diffs.splice(pointer, 0,
              [DIFF_EQUAL, insertion.substring(0, overlap_length1)]);
          diffs[pointer - 1][1] =
              deletion.substring(0, deletion.length - overlap_length1);
          diffs[pointer + 1][1] = insertion.substring(overlap_length1);
          pointer++;
        }
      } else {
        if (overlap_length2 >= deletion.length / 2 ||
            overlap_length2 >= insertion.length / 2) {
          // Reverse overlap found.
          // Insert an equality and swap and trim the surrounding edits.
          diffs.splice(pointer, 0,
              [DIFF_EQUAL, deletion.substring(0, overlap_length2)]);
          diffs[pointer - 1][0] = DIFF_INSERT;
          diffs[pointer - 1][1] =
              insertion.substring(0, insertion.length - overlap_length2);
          diffs[pointer + 1][0] = DIFF_DELETE;
          diffs[pointer + 1][1] =
              deletion.substring(overlap_length2);
          pointer++;
        }
      }
      pointer++;
    }
    pointer++;
  }
};


/**
 * Look for single edits surrounded on both sides by equalities
 * which can be shifted sideways to align the edit to a word boundary.
 * e.g: The c<ins>at c</ins>ame. -> The <ins>cat </ins>came.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupSemanticLossless = function(diffs) {
  /**
   * Given two strings, compute a score representing whether the internal
   * boundary falls on logical boundaries.
   * Scores range from 6 (best) to 0 (worst).
   * Closure, but does not reference any external variables.
   * @param {string} one First string.
   * @param {string} two Second string.
   * @return {number} The score.
   * @private
   */
  function diff_cleanupSemanticScore_(one, two) {
    if (!one || !two) {
      // Edges are the best.
      return 6;
    }

    // Each port of this function behaves slightly differently due to
    // subtle differences in each language's definition of things like
    // 'whitespace'.  Since this function's purpose is largely cosmetic,
    // the choice has been made to use each language's native features
    // rather than force total conformity.
    var char1 = one.charAt(one.length - 1);
    var char2 = two.charAt(0);
    var nonAlphaNumeric1 = char1.match(diff_match_patch.nonAlphaNumericRegex_);
    var nonAlphaNumeric2 = char2.match(diff_match_patch.nonAlphaNumericRegex_);
    var whitespace1 = nonAlphaNumeric1 &&
        char1.match(diff_match_patch.whitespaceRegex_);
    var whitespace2 = nonAlphaNumeric2 &&
        char2.match(diff_match_patch.whitespaceRegex_);
    var lineBreak1 = whitespace1 &&
        char1.match(diff_match_patch.linebreakRegex_);
    var lineBreak2 = whitespace2 &&
        char2.match(diff_match_patch.linebreakRegex_);
    var blankLine1 = lineBreak1 &&
        one.match(diff_match_patch.blanklineEndRegex_);
    var blankLine2 = lineBreak2 &&
        two.match(diff_match_patch.blanklineStartRegex_);

    if (blankLine1 || blankLine2) {
      // Five points for blank lines.
      return 5;
    } else if (lineBreak1 || lineBreak2) {
      // Four points for line breaks.
      return 4;
    } else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
      // Three points for end of sentences.
      return 3;
    } else if (whitespace1 || whitespace2) {
      // Two points for whitespace.
      return 2;
    } else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
      // One point for non-alphanumeric.
      return 1;
    }
    return 0;
  }

  var pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
        diffs[pointer + 1][0] == DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      var equality1 = diffs[pointer - 1][1];
      var edit = diffs[pointer][1];
      var equality2 = diffs[pointer + 1][1];

      // First, shift the edit as far left as possible.
      var commonOffset = this.diff_commonSuffix(equality1, edit);
      if (commonOffset) {
        var commonString = edit.substring(edit.length - commonOffset);
        equality1 = equality1.substring(0, equality1.length - commonOffset);
        edit = commonString + edit.substring(0, edit.length - commonOffset);
        equality2 = commonString + equality2;
      }

      // Second, step character by character right, looking for the best fit.
      var bestEquality1 = equality1;
      var bestEdit = edit;
      var bestEquality2 = equality2;
      var bestScore = diff_cleanupSemanticScore_(equality1, edit) +
          diff_cleanupSemanticScore_(edit, equality2);
      while (edit.charAt(0) === equality2.charAt(0)) {
        equality1 += edit.charAt(0);
        edit = edit.substring(1) + equality2.charAt(0);
        equality2 = equality2.substring(1);
        var score = diff_cleanupSemanticScore_(equality1, edit) +
            diff_cleanupSemanticScore_(edit, equality2);
        // The >= encourages trailing rather than leading whitespace on edits.
        if (score >= bestScore) {
          bestScore = score;
          bestEquality1 = equality1;
          bestEdit = edit;
          bestEquality2 = equality2;
        }
      }

      if (diffs[pointer - 1][1] != bestEquality1) {
        // We have an improvement, save it back to the diff.
        if (bestEquality1) {
          diffs[pointer - 1][1] = bestEquality1;
        } else {
          diffs.splice(pointer - 1, 1);
          pointer--;
        }
        diffs[pointer][1] = bestEdit;
        if (bestEquality2) {
          diffs[pointer + 1][1] = bestEquality2;
        } else {
          diffs.splice(pointer + 1, 1);
          pointer--;
        }
      }
    }
    pointer++;
  }
};

// Define some regex patterns for matching boundaries.
diff_match_patch.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
diff_match_patch.whitespaceRegex_ = /\s/;
diff_match_patch.linebreakRegex_ = /[\r\n]/;
diff_match_patch.blanklineEndRegex_ = /\n\r?\n$/;
diff_match_patch.blanklineStartRegex_ = /^\r?\n\r?\n/;

/**
 * Reduce the number of edits by eliminating operationally trivial equalities.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupEfficiency = function(diffs) {
  var changes = false;
  var equalities = [];  // Stack of indices where equalities are found.
  var equalitiesLength = 0;  // Keeping our own length var is faster in JS.
  /** @type {?string} */
  var lastequality = null;
  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
  var pointer = 0;  // Index of current position.
  // Is there an insertion operation before the last equality.
  var pre_ins = false;
  // Is there a deletion operation before the last equality.
  var pre_del = false;
  // Is there an insertion operation after the last equality.
  var post_ins = false;
  // Is there a deletion operation after the last equality.
  var post_del = false;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {  // Equality found.
      if (diffs[pointer][1].length < this.Diff_EditCost &&
          (post_ins || post_del)) {
        // Candidate found.
        equalities[equalitiesLength++] = pointer;
        pre_ins = post_ins;
        pre_del = post_del;
        lastequality = diffs[pointer][1];
      } else {
        // Not a candidate, and can never become one.
        equalitiesLength = 0;
        lastequality = null;
      }
      post_ins = post_del = false;
    } else {  // An insertion or deletion.
      if (diffs[pointer][0] == DIFF_DELETE) {
        post_del = true;
      } else {
        post_ins = true;
      }
      /*
       * Five types to be split:
       * <ins>A</ins><del>B</del>XY<ins>C</ins><del>D</del>
       * <ins>A</ins>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<ins>C</ins>
       * <ins>A</del>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<del>C</del>
       */
      if (lastequality && ((pre_ins && pre_del && post_ins && post_del) ||
                           ((lastequality.length < this.Diff_EditCost / 2) &&
                            (pre_ins + pre_del + post_ins + post_del) == 3))) {
        // Duplicate record.
        diffs.splice(equalities[equalitiesLength - 1], 0,
                     [DIFF_DELETE, lastequality]);
        // Change second copy to insert.
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        equalitiesLength--;  // Throw away the equality we just deleted;
        lastequality = null;
        if (pre_ins && pre_del) {
          // No changes made which could affect previous entry, keep going.
          post_ins = post_del = true;
          equalitiesLength = 0;
        } else {
          equalitiesLength--;  // Throw away the previous equality.
          pointer = equalitiesLength > 0 ?
              equalities[equalitiesLength - 1] : -1;
          post_ins = post_del = false;
        }
        changes = true;
      }
    }
    pointer++;
  }

  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
};


/**
 * Reorder and merge like edit sections.  Merge equalities.
 * Any edit section can move as long as it doesn't cross an equality.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupMerge = function(diffs) {
  diffs.push([DIFF_EQUAL, '']);  // Add a dummy entry at the end.
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  var commonlength;
  while (pointer < diffs.length) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_EQUAL:
        // Upon reaching an equality, check for prior redundancies.
        if (count_delete + count_insert > 1) {
          if (count_delete !== 0 && count_insert !== 0) {
            // Factor out any common prefixies.
            commonlength = this.diff_commonPrefix(text_insert, text_delete);
            if (commonlength !== 0) {
              if ((pointer - count_delete - count_insert) > 0 &&
                  diffs[pointer - count_delete - count_insert - 1][0] ==
                  DIFF_EQUAL) {
                diffs[pointer - count_delete - count_insert - 1][1] +=
                    text_insert.substring(0, commonlength);
              } else {
                diffs.splice(0, 0, [DIFF_EQUAL,
                                    text_insert.substring(0, commonlength)]);
                pointer++;
              }
              text_insert = text_insert.substring(commonlength);
              text_delete = text_delete.substring(commonlength);
            }
            // Factor out any common suffixies.
            commonlength = this.diff_commonSuffix(text_insert, text_delete);
            if (commonlength !== 0) {
              diffs[pointer][1] = text_insert.substring(text_insert.length -
                  commonlength) + diffs[pointer][1];
              text_insert = text_insert.substring(0, text_insert.length -
                  commonlength);
              text_delete = text_delete.substring(0, text_delete.length -
                  commonlength);
            }
          }
          // Delete the offending records and add the merged ones.
          if (count_delete === 0) {
            diffs.splice(pointer - count_insert,
                count_delete + count_insert, [DIFF_INSERT, text_insert]);
          } else if (count_insert === 0) {
            diffs.splice(pointer - count_delete,
                count_delete + count_insert, [DIFF_DELETE, text_delete]);
          } else {
            diffs.splice(pointer - count_delete - count_insert,
                count_delete + count_insert, [DIFF_DELETE, text_delete],
                [DIFF_INSERT, text_insert]);
          }
          pointer = pointer - count_delete - count_insert +
                    (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
        } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
          // Merge this equality with the previous one.
          diffs[pointer - 1][1] += diffs[pointer][1];
          diffs.splice(pointer, 1);
        } else {
          pointer++;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
        break;
    }
  }
  if (diffs[diffs.length - 1][1] === '') {
    diffs.pop();  // Remove the dummy entry at the end.
  }

  // Second pass: look for single edits surrounded on both sides by equalities
  // which can be shifted sideways to eliminate an equality.
  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
  var changes = false;
  pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
        diffs[pointer + 1][0] == DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      if (diffs[pointer][1].substring(diffs[pointer][1].length -
          diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
        // Shift the edit over the previous equality.
        diffs[pointer][1] = diffs[pointer - 1][1] +
            diffs[pointer][1].substring(0, diffs[pointer][1].length -
                                        diffs[pointer - 1][1].length);
        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
        diffs.splice(pointer - 1, 1);
        changes = true;
      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) ==
          diffs[pointer + 1][1]) {
        // Shift the edit over the next equality.
        diffs[pointer - 1][1] += diffs[pointer + 1][1];
        diffs[pointer][1] =
            diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
            diffs[pointer + 1][1];
        diffs.splice(pointer + 1, 1);
        changes = true;
      }
    }
    pointer++;
  }
  // If shifts were made, the diff needs reordering and another shift sweep.
  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
};


/**
 * loc is a location in text1, compute and return the equivalent location in
 * text2.
 * e.g. 'The cat' vs 'The big cat', 1->1, 5->8
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @param {number} loc Location within text1.
 * @return {number} Location within text2.
 */
diff_match_patch.prototype.diff_xIndex = function(diffs, loc) {
  var chars1 = 0;
  var chars2 = 0;
  var last_chars1 = 0;
  var last_chars2 = 0;
  var x;
  for (x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_INSERT) {  // Equality or deletion.
      chars1 += diffs[x][1].length;
    }
    if (diffs[x][0] !== DIFF_DELETE) {  // Equality or insertion.
      chars2 += diffs[x][1].length;
    }
    if (chars1 > loc) {  // Overshot the location.
      break;
    }
    last_chars1 = chars1;
    last_chars2 = chars2;
  }
  // Was the location was deleted?
  if (diffs.length != x && diffs[x][0] === DIFF_DELETE) {
    return last_chars2;
  }
  // Add the remaining character length.
  return last_chars2 + (loc - last_chars1);
};


/**
 * Convert a diff array into a pretty HTML report.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} HTML representation.
 */
diff_match_patch.prototype.diff_prettyHtml = function(diffs) {
  var html = [];
  var pattern_amp = /&/g;
  var pattern_lt = /</g;
  var pattern_gt = />/g;
  var pattern_para = /\n/g;
  for (var x = 0; x < diffs.length; x++) {
    var op = diffs[x][0];    // Operation (insert, delete, equal)
    var data = diffs[x][1];  // Text of change.
    var text = data.replace(pattern_amp, '&amp;').replace(pattern_lt, '&lt;')
        .replace(pattern_gt, '&gt;').replace(pattern_para, '&para;<br>');
    switch (op) {
      case DIFF_INSERT:
        html[x] = '<ins style="background:#e6ffe6;">' + text + '</ins>';
        break;
      case DIFF_DELETE:
        html[x] = '<del style="background:#ffe6e6;">' + text + '</del>';
        break;
      case DIFF_EQUAL:
        html[x] = '<span>' + text + '</span>';
        break;
    }
  }
  return html.join('');
};


/**
 * Compute and return the source text (all equalities and deletions).
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Source text.
 */
diff_match_patch.prototype.diff_text1 = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_INSERT) {
      text[x] = diffs[x][1];
    }
  }
  return text.join('');
};


/**
 * Compute and return the destination text (all equalities and insertions).
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Destination text.
 */
diff_match_patch.prototype.diff_text2 = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_DELETE) {
      text[x] = diffs[x][1];
    }
  }
  return text.join('');
};


/**
 * Compute the Levenshtein distance; the number of inserted, deleted or
 * substituted characters.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {number} Number of changes.
 */
diff_match_patch.prototype.diff_levenshtein = function(diffs) {
  var levenshtein = 0;
  var insertions = 0;
  var deletions = 0;
  for (var x = 0; x < diffs.length; x++) {
    var op = diffs[x][0];
    var data = diffs[x][1];
    switch (op) {
      case DIFF_INSERT:
        insertions += data.length;
        break;
      case DIFF_DELETE:
        deletions += data.length;
        break;
      case DIFF_EQUAL:
        // A deletion and an insertion is one substitution.
        levenshtein += Math.max(insertions, deletions);
        insertions = 0;
        deletions = 0;
        break;
    }
  }
  levenshtein += Math.max(insertions, deletions);
  return levenshtein;
};


/**
 * Crush the diff into an encoded string which describes the operations
 * required to transform text1 into text2.
 * E.g. =3\t-2\t+ing  -> Keep 3 chars, delete 2 chars, insert 'ing'.
 * Operations are tab-separated.  Inserted text is escaped using %xx notation.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Delta text.
 */
diff_match_patch.prototype.diff_toDelta = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    switch (diffs[x][0]) {
      case DIFF_INSERT:
        text[x] = '+' + encodeURI(diffs[x][1]);
        break;
      case DIFF_DELETE:
        text[x] = '-' + diffs[x][1].length;
        break;
      case DIFF_EQUAL:
        text[x] = '=' + diffs[x][1].length;
        break;
    }
  }
  return text.join('\t').replace(/%20/g, ' ');
};


/**
 * Given the original text1, and an encoded string which describes the
 * operations required to transform text1 into text2, compute the full diff.
 * @param {string} text1 Source string for the diff.
 * @param {string} delta Delta text.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @throws {!Error} If invalid input.
 */
diff_match_patch.prototype.diff_fromDelta = function(text1, delta) {
  var diffs = [];
  var diffsLength = 0;  // Keeping our own length var is faster in JS.
  var pointer = 0;  // Cursor in text1
  var tokens = delta.split(/\t/g);
  for (var x = 0; x < tokens.length; x++) {
    // Each token begins with a one character parameter which specifies the
    // operation of this token (delete, insert, equality).
    var param = tokens[x].substring(1);
    switch (tokens[x].charAt(0)) {
      case '+':
        try {
          diffs[diffsLength++] = [DIFF_INSERT, decodeURI(param)];
        } catch (ex) {
          // Malformed URI sequence.
          throw new Error('Illegal escape in diff_fromDelta: ' + param);
        }
        break;
      case '-':
        // Fall through.
      case '=':
        var n = parseInt(param, 10);
        if (isNaN(n) || n < 0) {
          throw new Error('Invalid number in diff_fromDelta: ' + param);
        }
        var text = text1.substring(pointer, pointer += n);
        if (tokens[x].charAt(0) == '=') {
          diffs[diffsLength++] = [DIFF_EQUAL, text];
        } else {
          diffs[diffsLength++] = [DIFF_DELETE, text];
        }
        break;
      default:
        // Blank tokens are ok (from a trailing \t).
        // Anything else is an error.
        if (tokens[x]) {
          throw new Error('Invalid diff operation in diff_fromDelta: ' +
                          tokens[x]);
        }
    }
  }
  if (pointer != text1.length) {
    throw new Error('Delta length (' + pointer +
        ') does not equal source text length (' + text1.length + ').');
  }
  return diffs;
};


//  MATCH FUNCTIONS


/**
 * Locate the best instance of 'pattern' in 'text' near 'loc'.
 * @param {string} text The text to search.
 * @param {string} pattern The pattern to search for.
 * @param {number} loc The location to search around.
 * @return {number} Best match index or -1.
 */
diff_match_patch.prototype.match_main = function(text, pattern, loc) {
  // Check for null inputs.
  if (text == null || pattern == null || loc == null) {
    throw new Error('Null input. (match_main)');
  }

  loc = Math.max(0, Math.min(loc, text.length));
  if (text == pattern) {
    // Shortcut (potentially not guaranteed by the algorithm)
    return 0;
  } else if (!text.length) {
    // Nothing to match.
    return -1;
  } else if (text.substring(loc, loc + pattern.length) == pattern) {
    // Perfect match at the perfect spot!  (Includes case of null pattern)
    return loc;
  } else {
    // Do a fuzzy compare.
    return this.match_bitap_(text, pattern, loc);
  }
};


/**
 * Locate the best instance of 'pattern' in 'text' near 'loc' using the
 * Bitap algorithm.
 * @param {string} text The text to search.
 * @param {string} pattern The pattern to search for.
 * @param {number} loc The location to search around.
 * @return {number} Best match index or -1.
 * @private
 */
diff_match_patch.prototype.match_bitap_ = function(text, pattern, loc) {
  if (pattern.length > this.Match_MaxBits) {
    throw new Error('Pattern too long for this browser.');
  }

  // Initialise the alphabet.
  var s = this.match_alphabet_(pattern);

  var dmp = this;  // 'this' becomes 'window' in a closure.

  /**
   * Compute and return the score for a match with e errors and x location.
   * Accesses loc and pattern through being a closure.
   * @param {number} e Number of errors in match.
   * @param {number} x Location of match.
   * @return {number} Overall score for match (0.0 = good, 1.0 = bad).
   * @private
   */
  function match_bitapScore_(e, x) {
    var accuracy = e / pattern.length;
    var proximity = Math.abs(loc - x);
    if (!dmp.Match_Distance) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy;
    }
    return accuracy + (proximity / dmp.Match_Distance);
  }

  // Highest score beyond which we give up.
  var score_threshold = this.Match_Threshold;
  // Is there a nearby exact match? (speedup)
  var best_loc = text.indexOf(pattern, loc);
  if (best_loc != -1) {
    score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
    // What about in the other direction? (speedup)
    best_loc = text.lastIndexOf(pattern, loc + pattern.length);
    if (best_loc != -1) {
      score_threshold =
          Math.min(match_bitapScore_(0, best_loc), score_threshold);
    }
  }

  // Initialise the bit arrays.
  var matchmask = 1 << (pattern.length - 1);
  best_loc = -1;

  var bin_min, bin_mid;
  var bin_max = pattern.length + text.length;
  var last_rd;
  for (var d = 0; d < pattern.length; d++) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from 'loc' we can stray at this
    // error level.
    bin_min = 0;
    bin_mid = bin_max;
    while (bin_min < bin_mid) {
      if (match_bitapScore_(d, loc + bin_mid) <= score_threshold) {
        bin_min = bin_mid;
      } else {
        bin_max = bin_mid;
      }
      bin_mid = Math.floor((bin_max - bin_min) / 2 + bin_min);
    }
    // Use the result from this iteration as the maximum for the next.
    bin_max = bin_mid;
    var start = Math.max(1, loc - bin_mid + 1);
    var finish = Math.min(loc + bin_mid, text.length) + pattern.length;

    var rd = Array(finish + 2);
    rd[finish + 1] = (1 << d) - 1;
    for (var j = finish; j >= start; j--) {
      // The alphabet (s) is a sparse hash, so the following line generates
      // warnings.
      var charMatch = s[text.charAt(j - 1)];
      if (d === 0) {  // First pass: exact match.
        rd[j] = ((rd[j + 1] << 1) | 1) & charMatch;
      } else {  // Subsequent passes: fuzzy match.
        rd[j] = (((rd[j + 1] << 1) | 1) & charMatch) |
                (((last_rd[j + 1] | last_rd[j]) << 1) | 1) |
                last_rd[j + 1];
      }
      if (rd[j] & matchmask) {
        var score = match_bitapScore_(d, j - 1);
        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (score <= score_threshold) {
          // Told you so.
          score_threshold = score;
          best_loc = j - 1;
          if (best_loc > loc) {
            // When passing loc, don't exceed our current distance from loc.
            start = Math.max(1, 2 * loc - best_loc);
          } else {
            // Already passed loc, downhill from here on in.
            break;
          }
        }
      }
    }
    // No hope for a (better) match at greater error levels.
    if (match_bitapScore_(d + 1, loc) > score_threshold) {
      break;
    }
    last_rd = rd;
  }
  return best_loc;
};


/**
 * Initialise the alphabet for the Bitap algorithm.
 * @param {string} pattern The text to encode.
 * @return {!Object} Hash of character locations.
 * @private
 */
diff_match_patch.prototype.match_alphabet_ = function(pattern) {
  var s = {};
  for (var i = 0; i < pattern.length; i++) {
    s[pattern.charAt(i)] = 0;
  }
  for (var i = 0; i < pattern.length; i++) {
    s[pattern.charAt(i)] |= 1 << (pattern.length - i - 1);
  }
  return s;
};


//  PATCH FUNCTIONS


/**
 * Increase the context until it is unique,
 * but don't let the pattern expand beyond Match_MaxBits.
 * @param {!diff_match_patch.patch_obj} patch The patch to grow.
 * @param {string} text Source text.
 * @private
 */
diff_match_patch.prototype.patch_addContext_ = function(patch, text) {
  if (text.length == 0) {
    return;
  }
  var pattern = text.substring(patch.start2, patch.start2 + patch.length1);
  var padding = 0;

  // Look for the first and last matches of pattern in text.  If two different
  // matches are found, increase the pattern length.
  while (text.indexOf(pattern) != text.lastIndexOf(pattern) &&
         pattern.length < this.Match_MaxBits - this.Patch_Margin -
         this.Patch_Margin) {
    padding += this.Patch_Margin;
    pattern = text.substring(patch.start2 - padding,
                             patch.start2 + patch.length1 + padding);
  }
  // Add one chunk for good luck.
  padding += this.Patch_Margin;

  // Add the prefix.
  var prefix = text.substring(patch.start2 - padding, patch.start2);
  if (prefix) {
    patch.diffs.unshift([DIFF_EQUAL, prefix]);
  }
  // Add the suffix.
  var suffix = text.substring(patch.start2 + patch.length1,
                              patch.start2 + patch.length1 + padding);
  if (suffix) {
    patch.diffs.push([DIFF_EQUAL, suffix]);
  }

  // Roll back the start points.
  patch.start1 -= prefix.length;
  patch.start2 -= prefix.length;
  // Extend the lengths.
  patch.length1 += prefix.length + suffix.length;
  patch.length2 += prefix.length + suffix.length;
};


/**
 * Compute a list of patches to turn text1 into text2.
 * Use diffs if provided, otherwise compute it ourselves.
 * There are four ways to call this function, depending on what data is
 * available to the caller:
 * Method 1:
 * a = text1, b = text2
 * Method 2:
 * a = diffs
 * Method 3 (optimal):
 * a = text1, b = diffs
 * Method 4 (deprecated, use method 3):
 * a = text1, b = text2, c = diffs
 *
 * @param {string|!Array.<!diff_match_patch.Diff>} a text1 (methods 1,3,4) or
 * Array of diff tuples for text1 to text2 (method 2).
 * @param {string|!Array.<!diff_match_patch.Diff>} opt_b text2 (methods 1,4) or
 * Array of diff tuples for text1 to text2 (method 3) or undefined (method 2).
 * @param {string|!Array.<!diff_match_patch.Diff>} opt_c Array of diff tuples
 * for text1 to text2 (method 4) or undefined (methods 1,2,3).
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 */
diff_match_patch.prototype.patch_make = function(a, opt_b, opt_c) {
  var text1, diffs;
  if (typeof a == 'string' && typeof opt_b == 'string' &&
      typeof opt_c == 'undefined') {
    // Method 1: text1, text2
    // Compute diffs from text1 and text2.
    text1 = /** @type {string} */(a);
    diffs = this.diff_main(text1, /** @type {string} */(opt_b), true);
    if (diffs.length > 2) {
      this.diff_cleanupSemantic(diffs);
      this.diff_cleanupEfficiency(diffs);
    }
  } else if (a && typeof a == 'object' && typeof opt_b == 'undefined' &&
      typeof opt_c == 'undefined') {
    // Method 2: diffs
    // Compute text1 from diffs.
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(a);
    text1 = this.diff_text1(diffs);
  } else if (typeof a == 'string' && opt_b && typeof opt_b == 'object' &&
      typeof opt_c == 'undefined') {
    // Method 3: text1, diffs
    text1 = /** @type {string} */(a);
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(opt_b);
  } else if (typeof a == 'string' && typeof opt_b == 'string' &&
      opt_c && typeof opt_c == 'object') {
    // Method 4: text1, text2, diffs
    // text2 is not used.
    text1 = /** @type {string} */(a);
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(opt_c);
  } else {
    throw new Error('Unknown call format to patch_make.');
  }

  if (diffs.length === 0) {
    return [];  // Get rid of the null case.
  }
  var patches = [];
  var patch = new diff_match_patch.patch_obj();
  var patchDiffLength = 0;  // Keeping our own length var is faster in JS.
  var char_count1 = 0;  // Number of characters into the text1 string.
  var char_count2 = 0;  // Number of characters into the text2 string.
  // Start with text1 (prepatch_text) and apply the diffs until we arrive at
  // text2 (postpatch_text).  We recreate the patches one by one to determine
  // context info.
  var prepatch_text = text1;
  var postpatch_text = text1;
  for (var x = 0; x < diffs.length; x++) {
    var diff_type = diffs[x][0];
    var diff_text = diffs[x][1];

    if (!patchDiffLength && diff_type !== DIFF_EQUAL) {
      // A new patch starts here.
      patch.start1 = char_count1;
      patch.start2 = char_count2;
    }

    switch (diff_type) {
      case DIFF_INSERT:
        patch.diffs[patchDiffLength++] = diffs[x];
        patch.length2 += diff_text.length;
        postpatch_text = postpatch_text.substring(0, char_count2) + diff_text +
                         postpatch_text.substring(char_count2);
        break;
      case DIFF_DELETE:
        patch.length1 += diff_text.length;
        patch.diffs[patchDiffLength++] = diffs[x];
        postpatch_text = postpatch_text.substring(0, char_count2) +
                         postpatch_text.substring(char_count2 +
                             diff_text.length);
        break;
      case DIFF_EQUAL:
        if (diff_text.length <= 2 * this.Patch_Margin &&
            patchDiffLength && diffs.length != x + 1) {
          // Small equality inside a patch.
          patch.diffs[patchDiffLength++] = diffs[x];
          patch.length1 += diff_text.length;
          patch.length2 += diff_text.length;
        } else if (diff_text.length >= 2 * this.Patch_Margin) {
          // Time for a new patch.
          if (patchDiffLength) {
            this.patch_addContext_(patch, prepatch_text);
            patches.push(patch);
            patch = new diff_match_patch.patch_obj();
            patchDiffLength = 0;
            // Unlike Unidiff, our patch lists have a rolling context.
            // http://code.google.com/p/google-diff-match-patch/wiki/Unidiff
            // Update prepatch text & pos to reflect the application of the
            // just completed patch.
            prepatch_text = postpatch_text;
            char_count1 = char_count2;
          }
        }
        break;
    }

    // Update the current character count.
    if (diff_type !== DIFF_INSERT) {
      char_count1 += diff_text.length;
    }
    if (diff_type !== DIFF_DELETE) {
      char_count2 += diff_text.length;
    }
  }
  // Pick up the leftover patch if not empty.
  if (patchDiffLength) {
    this.patch_addContext_(patch, prepatch_text);
    patches.push(patch);
  }

  return patches;
};


/**
 * Given an array of patches, return another array that is identical.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 */
diff_match_patch.prototype.patch_deepCopy = function(patches) {
  // Making deep copies is hard in JavaScript.
  var patchesCopy = [];
  for (var x = 0; x < patches.length; x++) {
    var patch = patches[x];
    var patchCopy = new diff_match_patch.patch_obj();
    patchCopy.diffs = [];
    for (var y = 0; y < patch.diffs.length; y++) {
      patchCopy.diffs[y] = patch.diffs[y].slice();
    }
    patchCopy.start1 = patch.start1;
    patchCopy.start2 = patch.start2;
    patchCopy.length1 = patch.length1;
    patchCopy.length2 = patch.length2;
    patchesCopy[x] = patchCopy;
  }
  return patchesCopy;
};


/**
 * Merge a set of patches onto the text.  Return a patched text, as well
 * as a list of true/false values indicating which patches were applied.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @param {string} text Old text.
 * @return {!Array.<string|!Array.<boolean>>} Two element Array, containing the
 *      new text and an array of boolean values.
 */
diff_match_patch.prototype.patch_apply = function(patches, text) {
  if (patches.length == 0) {
    return [text, []];
  }

  // Deep copy the patches so that no changes are made to originals.
  patches = this.patch_deepCopy(patches);

  var nullPadding = this.patch_addPadding(patches);
  text = nullPadding + text + nullPadding;

  this.patch_splitMax(patches);
  // delta keeps track of the offset between the expected and actual location
  // of the previous patch.  If there are patches expected at positions 10 and
  // 20, but the first patch was found at 12, delta is 2 and the second patch
  // has an effective expected position of 22.
  var delta = 0;
  var results = [];
  for (var x = 0; x < patches.length; x++) {
    var expected_loc = patches[x].start2 + delta;
    var text1 = this.diff_text1(patches[x].diffs);
    var start_loc;
    var end_loc = -1;
    if (text1.length > this.Match_MaxBits) {
      // patch_splitMax will only provide an oversized pattern in the case of
      // a monster delete.
      start_loc = this.match_main(text, text1.substring(0, this.Match_MaxBits),
                                  expected_loc);
      if (start_loc != -1) {
        end_loc = this.match_main(text,
            text1.substring(text1.length - this.Match_MaxBits),
            expected_loc + text1.length - this.Match_MaxBits);
        if (end_loc == -1 || start_loc >= end_loc) {
          // Can't find valid trailing context.  Drop this patch.
          start_loc = -1;
        }
      }
    } else {
      start_loc = this.match_main(text, text1, expected_loc);
    }
    if (start_loc == -1) {
      // No match found.  :(
      results[x] = false;
      // Subtract the delta for this failed patch from subsequent patches.
      delta -= patches[x].length2 - patches[x].length1;
    } else {
      // Found a match.  :)
      results[x] = true;
      delta = start_loc - expected_loc;
      var text2;
      if (end_loc == -1) {
        text2 = text.substring(start_loc, start_loc + text1.length);
      } else {
        text2 = text.substring(start_loc, end_loc + this.Match_MaxBits);
      }
      if (text1 == text2) {
        // Perfect match, just shove the replacement text in.
        text = text.substring(0, start_loc) +
               this.diff_text2(patches[x].diffs) +
               text.substring(start_loc + text1.length);
      } else {
        // Imperfect match.  Run a diff to get a framework of equivalent
        // indices.
        var diffs = this.diff_main(text1, text2, false);
        if (text1.length > this.Match_MaxBits &&
            this.diff_levenshtein(diffs) / text1.length >
            this.Patch_DeleteThreshold) {
          // The end points match, but the content is unacceptably bad.
          results[x] = false;
        } else {
          this.diff_cleanupSemanticLossless(diffs);
          var index1 = 0;
          var index2;
          for (var y = 0; y < patches[x].diffs.length; y++) {
            var mod = patches[x].diffs[y];
            if (mod[0] !== DIFF_EQUAL) {
              index2 = this.diff_xIndex(diffs, index1);
            }
            if (mod[0] === DIFF_INSERT) {  // Insertion
              text = text.substring(0, start_loc + index2) + mod[1] +
                     text.substring(start_loc + index2);
            } else if (mod[0] === DIFF_DELETE) {  // Deletion
              text = text.substring(0, start_loc + index2) +
                     text.substring(start_loc + this.diff_xIndex(diffs,
                         index1 + mod[1].length));
            }
            if (mod[0] !== DIFF_DELETE) {
              index1 += mod[1].length;
            }
          }
        }
      }
    }
  }
  // Strip the padding off.
  text = text.substring(nullPadding.length, text.length - nullPadding.length);
  return [text, results];
};


/**
 * Add some padding on text start and end so that edges can match something.
 * Intended to be called only from within patch_apply.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {string} The padding string added to each side.
 */
diff_match_patch.prototype.patch_addPadding = function(patches) {
  var paddingLength = this.Patch_Margin;
  var nullPadding = '';
  for (var x = 1; x <= paddingLength; x++) {
    nullPadding += String.fromCharCode(x);
  }

  // Bump all the patches forward.
  for (var x = 0; x < patches.length; x++) {
    patches[x].start1 += paddingLength;
    patches[x].start2 += paddingLength;
  }

  // Add some padding on start of first diff.
  var patch = patches[0];
  var diffs = patch.diffs;
  if (diffs.length == 0 || diffs[0][0] != DIFF_EQUAL) {
    // Add nullPadding equality.
    diffs.unshift([DIFF_EQUAL, nullPadding]);
    patch.start1 -= paddingLength;  // Should be 0.
    patch.start2 -= paddingLength;  // Should be 0.
    patch.length1 += paddingLength;
    patch.length2 += paddingLength;
  } else if (paddingLength > diffs[0][1].length) {
    // Grow first equality.
    var extraLength = paddingLength - diffs[0][1].length;
    diffs[0][1] = nullPadding.substring(diffs[0][1].length) + diffs[0][1];
    patch.start1 -= extraLength;
    patch.start2 -= extraLength;
    patch.length1 += extraLength;
    patch.length2 += extraLength;
  }

  // Add some padding on end of last diff.
  patch = patches[patches.length - 1];
  diffs = patch.diffs;
  if (diffs.length == 0 || diffs[diffs.length - 1][0] != DIFF_EQUAL) {
    // Add nullPadding equality.
    diffs.push([DIFF_EQUAL, nullPadding]);
    patch.length1 += paddingLength;
    patch.length2 += paddingLength;
  } else if (paddingLength > diffs[diffs.length - 1][1].length) {
    // Grow last equality.
    var extraLength = paddingLength - diffs[diffs.length - 1][1].length;
    diffs[diffs.length - 1][1] += nullPadding.substring(0, extraLength);
    patch.length1 += extraLength;
    patch.length2 += extraLength;
  }

  return nullPadding;
};


/**
 * Look through the patches and break up any which are longer than the maximum
 * limit of the match algorithm.
 * Intended to be called only from within patch_apply.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 */
diff_match_patch.prototype.patch_splitMax = function(patches) {
  var patch_size = this.Match_MaxBits;
  for (var x = 0; x < patches.length; x++) {
    if (patches[x].length1 <= patch_size) {
      continue;
    }
    var bigpatch = patches[x];
    // Remove the big old patch.
    patches.splice(x--, 1);
    var start1 = bigpatch.start1;
    var start2 = bigpatch.start2;
    var precontext = '';
    while (bigpatch.diffs.length !== 0) {
      // Create one of several smaller patches.
      var patch = new diff_match_patch.patch_obj();
      var empty = true;
      patch.start1 = start1 - precontext.length;
      patch.start2 = start2 - precontext.length;
      if (precontext !== '') {
        patch.length1 = patch.length2 = precontext.length;
        patch.diffs.push([DIFF_EQUAL, precontext]);
      }
      while (bigpatch.diffs.length !== 0 &&
             patch.length1 < patch_size - this.Patch_Margin) {
        var diff_type = bigpatch.diffs[0][0];
        var diff_text = bigpatch.diffs[0][1];
        if (diff_type === DIFF_INSERT) {
          // Insertions are harmless.
          patch.length2 += diff_text.length;
          start2 += diff_text.length;
          patch.diffs.push(bigpatch.diffs.shift());
          empty = false;
        } else if (diff_type === DIFF_DELETE && patch.diffs.length == 1 &&
                   patch.diffs[0][0] == DIFF_EQUAL &&
                   diff_text.length > 2 * patch_size) {
          // This is a large deletion.  Let it pass in one chunk.
          patch.length1 += diff_text.length;
          start1 += diff_text.length;
          empty = false;
          patch.diffs.push([diff_type, diff_text]);
          bigpatch.diffs.shift();
        } else {
          // Deletion or equality.  Only take as much as we can stomach.
          diff_text = diff_text.substring(0,
              patch_size - patch.length1 - this.Patch_Margin);
          patch.length1 += diff_text.length;
          start1 += diff_text.length;
          if (diff_type === DIFF_EQUAL) {
            patch.length2 += diff_text.length;
            start2 += diff_text.length;
          } else {
            empty = false;
          }
          patch.diffs.push([diff_type, diff_text]);
          if (diff_text == bigpatch.diffs[0][1]) {
            bigpatch.diffs.shift();
          } else {
            bigpatch.diffs[0][1] =
                bigpatch.diffs[0][1].substring(diff_text.length);
          }
        }
      }
      // Compute the head context for the next patch.
      precontext = this.diff_text2(patch.diffs);
      precontext =
          precontext.substring(precontext.length - this.Patch_Margin);
      // Append the end context for this patch.
      var postcontext = this.diff_text1(bigpatch.diffs)
                            .substring(0, this.Patch_Margin);
      if (postcontext !== '') {
        patch.length1 += postcontext.length;
        patch.length2 += postcontext.length;
        if (patch.diffs.length !== 0 &&
            patch.diffs[patch.diffs.length - 1][0] === DIFF_EQUAL) {
          patch.diffs[patch.diffs.length - 1][1] += postcontext;
        } else {
          patch.diffs.push([DIFF_EQUAL, postcontext]);
        }
      }
      if (!empty) {
        patches.splice(++x, 0, patch);
      }
    }
  }
};


/**
 * Take a list of patches and return a textual representation.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {string} Text representation of patches.
 */
diff_match_patch.prototype.patch_toText = function(patches) {
  var text = [];
  for (var x = 0; x < patches.length; x++) {
    text[x] = patches[x];
  }
  return text.join('');
};


/**
 * Parse a textual representation of patches and return a list of Patch objects.
 * @param {string} textline Text representation of patches.
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 * @throws {!Error} If invalid input.
 */
diff_match_patch.prototype.patch_fromText = function(textline) {
  var patches = [];
  if (!textline) {
    return patches;
  }
  var text = textline.split('\n');
  var textPointer = 0;
  var patchHeader = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;
  while (textPointer < text.length) {
    var m = text[textPointer].match(patchHeader);
    if (!m) {
      throw new Error('Invalid patch string: ' + text[textPointer]);
    }
    var patch = new diff_match_patch.patch_obj();
    patches.push(patch);
    patch.start1 = parseInt(m[1], 10);
    if (m[2] === '') {
      patch.start1--;
      patch.length1 = 1;
    } else if (m[2] == '0') {
      patch.length1 = 0;
    } else {
      patch.start1--;
      patch.length1 = parseInt(m[2], 10);
    }

    patch.start2 = parseInt(m[3], 10);
    if (m[4] === '') {
      patch.start2--;
      patch.length2 = 1;
    } else if (m[4] == '0') {
      patch.length2 = 0;
    } else {
      patch.start2--;
      patch.length2 = parseInt(m[4], 10);
    }
    textPointer++;

    while (textPointer < text.length) {
      var sign = text[textPointer].charAt(0);
      try {
        var line = decodeURI(text[textPointer].substring(1));
      } catch (ex) {
        // Malformed URI sequence.
        throw new Error('Illegal escape in patch_fromText: ' + line);
      }
      if (sign == '-') {
        // Deletion.
        patch.diffs.push([DIFF_DELETE, line]);
      } else if (sign == '+') {
        // Insertion.
        patch.diffs.push([DIFF_INSERT, line]);
      } else if (sign == ' ') {
        // Minor equality.
        patch.diffs.push([DIFF_EQUAL, line]);
      } else if (sign == '@') {
        // Start of next patch.
        break;
      } else if (sign === '') {
        // Blank line?  Whatever.
      } else {
        // WTF?
        throw new Error('Invalid patch mode "' + sign + '" in: ' + line);
      }
      textPointer++;
    }
  }
  return patches;
};


/**
 * Class representing one patch operation.
 * @constructor
 */
diff_match_patch.patch_obj = function() {
  /** @type {!Array.<!diff_match_patch.Diff>} */
  this.diffs = [];
  /** @type {?number} */
  this.start1 = null;
  /** @type {?number} */
  this.start2 = null;
  /** @type {number} */
  this.length1 = 0;
  /** @type {number} */
  this.length2 = 0;
};


/**
 * Emmulate GNU diff's format.
 * Header: @@ -382,8 +481,9 @@
 * Indicies are printed as 1-based, not 0-based.
 * @return {string} The GNU diff string.
 */
diff_match_patch.patch_obj.prototype.toString = function() {
  var coords1, coords2;
  if (this.length1 === 0) {
    coords1 = this.start1 + ',0';
  } else if (this.length1 == 1) {
    coords1 = this.start1 + 1;
  } else {
    coords1 = (this.start1 + 1) + ',' + this.length1;
  }
  if (this.length2 === 0) {
    coords2 = this.start2 + ',0';
  } else if (this.length2 == 1) {
    coords2 = this.start2 + 1;
  } else {
    coords2 = (this.start2 + 1) + ',' + this.length2;
  }
  var text = ['@@ -' + coords1 + ' +' + coords2 + ' @@\n'];
  var op;
  // Escape the body of the patch with %xx notation.
  for (var x = 0; x < this.diffs.length; x++) {
    switch (this.diffs[x][0]) {
      case DIFF_INSERT:
        op = '+';
        break;
      case DIFF_DELETE:
        op = '-';
        break;
      case DIFF_EQUAL:
        op = ' ';
        break;
    }
    text[x + 1] = op + encodeURI(this.diffs[x][1]) + '\n';
  }
  return text.join('').replace(/%20/g, ' ');
};


// Export these global variables so that they survive Google's JS compiler.
// In a browser, 'this' will be 'window'.
// Users of node.js should 'require' the uncompressed version since Google's
// JS compiler may break the following exports for non-browser environments.
/*
this['diff_match_patch'] = diff_match_patch;
this['DIFF_DELETE'] = DIFF_DELETE;
this['DIFF_INSERT'] = DIFF_INSERT;
this['DIFF_EQUAL'] = DIFF_EQUAL;
*/

module.exports=diff_match_patch;

});
require.register("ksana-document/xml4kdb.js", function(exports, require, module){
if (typeof nodeRequire=='undefined')nodeRequire=require;

var tags=[];
var tagstack=[];
var parseXMLTag=function(s) {
	var name="",i=0;
	if (s[0]=='/') {
		return {name:s.substring(1),type:'end'};
	}
	while (s[i] && (s.charCodeAt(i)>0x30)) {name+=s[i];i++;}
	var type="start";
	if (s[s.length-1]=='/') { type="emtpy"; }
	var attr={},count=0;
	s=s.substring(name.length+1);
	s.replace(/(.*?)="([^"]*?)"/g,function(m,m1,m2) {
		attr[m1]=m2;
		count++;
	});
	if (!count) attr=undefined;
	return {name:name,type:type,attr:attr};
};
var parseUnit=function(unittext) {
	// name,sunit, soff, eunit, eoff , attributes
	var totaltaglength=0,tags=[],tagoffset=0;
	var parsed=unittext.replace(/<(.*?)>/g,function(m,m1,off){
		var i=m1.indexOf(" "),tag=m1,attributes="";
		if (i>-1) {
			tag=m1.substr(0,i);
			attributes=m1.substr(i+1);
		}
		tagoffset=off-totaltaglength;
		tags.push([tagoffset , tag,attributes, 0 ]); //vpos to be resolved
		totaltaglength+=m.length;
		return ""; //remove the tag from inscription
	});
	return {inscription:parsed, tags:tags};
};
var splitUnit=function(buf,sep) {
	var units=[], unit="", last=0 ,name="";
	buf.replace(sep,function(m,m1,offset){
		units.push([name,buf.substring(last,offset),last]);
		name=m1;
		last=offset;//+m.length;   //keep the separator
	});
	units.push([name,buf.substring(last),last]);
	return units;
};
var defaultsep="_.id";
var emptypagename="_";
var parseXML=function(buf, opts){
	opts=opts||{};
	var sep=opts.sep||defaultsep;
	var unitsep=new RegExp('<'+sep.replace(".",".*? ")+'="([^"]*?)"' , 'g')  ;
	var units=splitUnit(buf, unitsep);
	var texts=[], tags=[];
	units.map(function(U,i){
		var out=parseUnit(U[1]);
		if (opts.trim) out.inscription=out.inscription.trim();
		texts.push({n:U[0]||emptypagename,t:out.inscription});
		tags.push(out.tags);
	});
	return {texts:texts,tags:tags,sep:sep};
};
var D=nodeRequire("ksana-document").document;

var importJson=function(json) {
	d=D.createDocument();
	for (var i=0;i<json.texts.length;i++) {
		var markups=json.tags[i];
		d.createPage(json.texts[i]);
	}
	//d.setRawXMLTags(json.tags);
	d.setSep(json.sep);
	return d;
}
/*
    doc.tags hold raw xml tags, offset will be adjusted by evolvePage.
    should not add or delete page, otherwise the export XML is not valid.
*/
/*
		var o=pg.getOrigin();
		if (o.id && this.tags[o.id-1] && this.tags[o.id-1].length) {
			this.tags[o.id-1]=pg.upgradeXMLTags(this.tags[o.id-1], pg.__revisions__());	
		}
*/
var upgradeXMLTags=function(tags,revs) {
	var migratedtags=[],i=0, delta=0;
	for (var j=0;j<tags.length;j++) {
		var t=tags[j];
		var s=t[0], l=t[1].length, deleted=false;
		while (i<revs.length && revs[i].start<=s) {
			var rev=revs[i];
			if (rev.start<=s && rev.start+rev.len>=s+l) {
				deleted=true;
			}
			delta+= (rev.payload.text.length-rev.len);
			i++;
		}
		var m2=[t[0]+delta,t[1]];
		migratedtags.push(m2);
	};
	return migratedtags;
}

var migrateRawTags=function(doc,tags) {
	var out=[];
	for (var i=0;i<tags.length;i++) {
		var T=tags[i];

		var pg=doc.getPage(i+1);
		var offsprings=pg.offsprings();
		for (var j=0;j<offsprings.length;j++) {
			var o=offsprings[j];
			var rev=pg.revertRevision(o.revert,pg.inscription);
			T=upgradeXMLTags(T,rev);
			pg=o;
		}		
		out.push(T);
	}
	return out;
}
var exportXML=function(doc,originalrawtags){
	var out=[],tags=null;
	rawtags=migrateRawTags(doc,originalrawtags);
	doc.map(function(pg,i){
		var tags=rawtags[i];  //get the xml tags
		var tagnow=0,text="";
		var t=pg.inscription;
		for (var j=0;j<t.length;j++) {
			if (tagnow<tags.length) {
				if (tags[tagnow][0]==j) {
					text+="<"+tags[tagnow][1]+">";
					tagnow++;
				}
			}
			text+=t[j];
		}
		if (tagnow<tags.length && j==tags[tagnow][0]) text+="<"+tags[tagnow][1]+">";
		out.push(text);
	})

	return out.join("");
};
module.exports={parseXML:parseXML, importJson:importJson, exportXML:exportXML}
});
require.register("ksana-document/buildfromxml.js", function(exports, require, module){
var outback = function (s) {
    while (s.length < 70) s += ' ';
    var l = s.length; 
    for (var i = 0; i < l; i++) s += String.fromCharCode(8);
    process.stdout.write(s);
}
var movefile=function(sourcefn,targetfolder) {
	var fs = require("fs");
	var source = fs.createReadStream(sourcefn);
	var path=require("path");
	var targetfn=path.resolve(process.cwd(),"..")+path.sep+path.basename(sourcefn);
	var destination = fs.createWriteStream(targetfn);
	console.log(targetfn);
	source.pipe(destination, { end: false });
	source.on("end", function(){
	    fs.unlinkSync(sourcefn);
	});
	return targetfn;
}
var mkdbjs="mkdb.js";
var starttime=0;
var startindexer=function(mkdbconfig) {
  var indexer=require("ksana-document").indexer;
  var session=indexer.start(mkdbconfig);
  if (!session) {
      console.log("No file to index");
      return;
  }
  var getstatus=function() {
    var status=indexer.status();
    console.log((Math.floor(status.progress*1000)/10)+'%');
    if (status.done) {
      var endtime=new Date();
      console.log("END",endtime, "elapse",(endtime-starttime) /1000,"seconds") ;
      //status.outputfn=movefile(status.outputfn,"..");
      clearInterval(timer);
    }
  }  
  timer=setInterval( getstatus, 1000);

}

var build=function(path,mkdbjs){
  var fs=require("fs");
  mkdbjs=mkdbjs||"mkdb.js";

  if (!fs.existsSync(mkdbjs)) {
      throw "no "+mkdbjs  ;
  }
  starttime=new Date();
  console.log("START",starttime);
  if (!path) path=".";
  
  var glob = require("glob");
  
  var timer=null;
  var fn=require("path").resolve(path,mkdbjs);  
  var mkdbconfig=require(fn);
  
  if (typeof mkdbconfig.glob=="string") {
    glob(mkdbconfig.glob, function (err, files) {
      if (err) throw err;
      mkdbconfig.files=files.sort();
      startindexer(mkdbconfig);
    });    
  } else {
    mkdbconfig.files=mkdbconfig.glob;
    startindexer(mkdbconfig);
  }



}

module.exports=build;
});
require.register("ksana-document/tei.js", function(exports, require, module){

var anchors=[];
var parser=null,filename="";
var context=null, config={};
var tagmodules=[];

var warning=function(err) {
	if (config.warning) {
		config.warning(err,filename);
	} else {
		console.log(err,filename);	
	}	
}
var ontext=function(e) {
	//if (context.handler) 
	context.text+=e;
}
var onopentag=function(e) {
	if (context.parents.length) {
		context.paths.push(e.name);
	}
	context.parents.push(e);
	context.now=e;	
	context.path=context.paths.join("/");
	if (!context.handler) {
		var handler=context.handlers[context.path];
		if (handler) {
			context.handler=handler;
			context.rootpath=context.path;
		}
		var close_handler=context.close_handlers[context.path];
		if (close_handler) 	context.close_handler=close_handler;
	}

	if (context.handler) {
		var root=context.path==context.rootpath;
		context.handler(root);
	} 
}

var onclosetag=function(e) {
	context.now=context.parents[context.parents.length-1];
	var handler=context.close_handlers[context.path];
	if (handler) {
		var res=null;
		var root=context.path==context.rootpath;
		if (context.close_handler) res=context.close_handler(root);
		context.handler=null;//stop handling
		context.rootpath=null;
		context.close_handler=null;//stop handling
		context.text="";
		if (res && context.status.storeFields) {
			context.status.storeFields(res, context.status.json);
		}
	} else if (context.close_handler) {
		var root=context.path==context.rootpath;
		context.close_handler(root);
	}
	
	context.paths.pop();
	context.parents.pop();
	context.path=context.paths.join("/");		
}
var addHandler=function(path,_tagmodule) {
	var tagmodule=_tagmodule;
	if (typeof tagmodule=="function") {
		tagmodule={close_handler:_tagmodule};
	}
	if (tagmodule.handler) context.handlers[path]=tagmodule.handler;
	if (tagmodule.close_handler) context.close_handlers[path]=tagmodule.close_handler;
	if (tagmodule.reset) tagmodule.reset();
	tagmodule.warning=warning;
	tagmodules.push(tagmodule);
}
var closeAnchor=function(pg,T,anchors,id,texts) {
	var beg="beg"+id.substr(3);
	for (var j=anchors.length-1;j>=0;j--) {
		if (anchors[j][3]!=beg) continue;
		var anchor=anchors[j];
		
		if (pg==anchor[0]) { //same page
			anchor[2]=T[0]-anchor[1]; // length
		} else { //assume end anchor in just next page// ref. pT01p0003b2901
			var pagelen=texts[anchor[0]].t.length;
			anchors[j][2]= (pagelen-anchor[1])  + T[0];
		}
		return;
	}
	warning("cannot find beg pointer for anchor:"+id);
}
// [pg, start, len, id]
var createAnchors=function(parsed) {
	var anchors=[];
	var tags=parsed.tags;
	for (var pg=0;pg<tags.length;pg++){
		var pgtags=tags[pg];
		for (var i=0;i<pgtags.length;i++) {
				var T=pgtags[i];
				if (T[1].indexOf("anchor xml:id=")!=0) continue;
				var id=T[1].substr(15);
				id=id.substr(0,id.indexOf('"'));
				if (id.substr(0,3)=="end") {
					closeAnchor(pg,T,anchors,id,parsed.texts);
				} else {
					anchors.push([pg,T[0],0,id]);	
				}
			}
	}
	return anchors;	
}
var resolveAnchors=function(anchors,texts) {
	tagmodules.map(function(m){
		if (m.resolve) m.resolve(anchors,texts);
	})
}
var  createMarkups=function(parsed) {
	anchors=createAnchors(parsed);
	resolveAnchors(anchors,parsed.text);

	for (var i=0;i<anchors.length;i++) {
		if (anchors[i][4] && !anchors[i][4].length) {
			config.warning("unresolve anchor"+anchors[i][3]);
		}
	}
	return anchors;
}
var handlersResult=function() {
	var out={};
	tagmodules.map(function(m){
		if (m.result) out[m.name]=m.result();
	})
}

var parseP5=function(xml,parsed,fn,_config,_status) {
	parser=require("sax").parser(true);
	filename=fn;
	context={ paths:[] , parents:[], handlers:{}, close_handlers:{}, text:"" ,now:null,status:_status};
	parser.onopentag=onopentag;
	parser.onclosetag=onclosetag;
	parser.ontext=ontext;
	config=_config;
	tagmodules=[];
	context.addHandler=addHandler;
	if (_config.setupHandlers) config.setupHandlers.apply(context);
	if (config.callbacks && config.callbacks.beforeParseTag) {
		xml=config.callbacks.beforeParseTag(xml);
	}
	parser.write(xml);
	context=null;
	parser=null;
	if (parsed) return createMarkups(parsed);
	else return handlersResult();
}
module.exports=parseP5;
});
require.register("ksana-document/concordance.js", function(exports, require, module){
/*
  concordance without suffix array.

  法 takes 25 seconds.

  improvement:
	less page scan.        
*/
var search=require("./search");
var Kde=require("./kde");
var excerpt=excerpt=require("./excerpt");
var status={progress:0}, forcestop=false;
var texts=[],starts=[],ends=[];
var config=null,engine=null;
var nest=0;
var verbose=false;

var scanpage=function(obj,npage,pat,backward) {
	var page=texts[npage];
	page.replace(pat,function(m,m1){
			if (!obj[m1]) obj[m1]=[];
			var o=obj[m1];
			if (o[o.length-1]!=npage) o.push(npage);
	});
}
var trimunfrequent=function(out,total,config) {
	for (var i=0;i<out.length;i++) {
		var hit=out[i][1].length;
		if ( (hit / total) < config.threshold || hit < config.threshold_count) {
			out.length=i;
			break;
		}
	}
}
var findNeighbors=function(filter,q,backward) {
	var cjkbmp="([\\u4E00-\\u9FFF])";
	if (verbose) console.log("findn",q,filter.length,backward)
	var p=q+cjkbmp;
	nest++;
	if (backward) terms=starts;
	else terms=ends;

	if (backward) p=cjkbmp+q ;  //starts

	var pat=new RegExp(p,"g");
	var obj={},out=[];
	for (var i=0;i<filter.length;i++) {
		var npage=i;
		if (typeof filter[i]=="number") npage=filter[i];
		scanpage(obj,npage,pat,backward);
	}
	for (var i in obj) out.push([i,obj[i]]);
	out.sort(function(a,b){return b[1].length-a[1].length});

	var total=0;
	for (var i=0;i<out.length;i++) total+=out[i][1].length;

	trimunfrequent(out,total,config);
	var newterms=[];
	if (nest<5) for (var i=0;i<out.length;i++) {
		var term=q+out[i][0];
		var termhit=out[i][1].length;
		if (backward) term=out[i][0]+q;
		var childterms=findNeighbors(out[i][1],term,backward);

		terms.push([term,termhit,q]);

		if (childterms.length==1 && childterms[0][1]/config.mid_threshold > termhit) {
			terms[terms.length-1][3]=childterms[0][0];
		}
		newterms.push([term,termhit,q]);
	}
	nest--;
	return newterms;
}

var finalize=function() {
	if (verbose) console.timeEnd("fetchtext");
	if (verbose) console.time("neighbor");
	findNeighbors(texts,config.q,false); //forward
	findNeighbors(texts,config.q,true); //backward	
	starts.sort(function(a,b){return b[1]-a[1]});
	ends.sort(function(a,b){return b[1]-a[1]});
	status.output={
		totalpagecount:engine.get("meta").pagecount,
		pagecount:texts.length,starts:starts,ends:ends};
	if (verbose) console.timeEnd("neighbor");
	status.done=true;
}
var opts={nohighlight:true};

var worker=function() {
	var Q=this;
	var pages=Q.pageWithHit(this.now);
	status.progress=this.now/Q.byFile.length;
	for (var j=0;j<pages.length;j++) {
		texts.push( engine.getSync(["fileContents",this.now,pages[j]]));	
	}
	this.now++
	if (this.now<Q.byFile.length) {
		setImmediate( worker.bind(this)) ;
		if (forcestop || Q.excerptStop) 	finalize();
	} else finalize();
}

var start=function(_config) {
	if (verbose) console.time("search");
	config=_config;
	config.threshold=config.threshold||0.005;
	config.threshold_count=config.threshold_count||20;
	config.mid_threshold=config.mid_threshold || 0.9 ; //if child has 80% hit, remove parent
	config.termlimit=config.termlimit||500;
	config.nestlevel=config.nestlevel||5;
	var open=Kde.open;
	if (typeof Require=="undefined") open=Kde.openLocal;

	open(config.db,function(_engine){
		engine=_engine;
		search(engine,config.q,opts,function(Q){
			Q.now=0;
			if (verbose) console.timeEnd("search");
			if (verbose) console.time("fetchtext");
			worker.call(Q);
		});
	});
}
var stop=function() {
	forcestop=true;
}

var getstatus=function() {
	return status;
}

module.exports={start:start,stop:stop,status:getstatus};

//module.exports=concordance;
});
require.register("ksana-document/regex.js", function(exports, require, module){
/*
   regex search.
   scan only possible pages

   remove regular expression operator  ^ $  [  ]  {  }  (  )  . \d \t \n

   $,^  begin and end not supported 
   support [^] exclusion later

   report match term with hit
*/
var search=require("./search");
var Kde=require("./kde");
var status={progress:0}, forcestop=false;
var texts=[],terms=[];
var config=null,engine=null;

var opts={nohighlight:true, range:{filestart:0, maxfile:100}};

var worker=function() {
	search(engine,config.q_unregex,opts,function(Q){
		var excerpts=Q.excerpt.map(function(q){return q.text.replace(/\n/g,"")});
		texts=texts.concat(excerpts);
		opts.range.filestart=opts.range.nextFileStart;
		status.progress=opts.range.nextFileStart/Q.byFile.length;
		if (forcestop || Q.excerptStop) {
			finalize();
		} else setTimeout(worker,0);
	});
}

var filter=function() {
	var pat=new RegExp(config.q,"g");
	var matches={};
	
	for (var i=0;i<texts.length;i++) {
		var m=texts[i].match(pat);
		if (m) {
			for (var j=0;j<m.length;j++) {
				if (!matches[m[j]]) matches[m[j]]=0;
				matches[m[j]]++;
			}
		}
	}

	terms=[];
	for (var i in matches) {
		if (matches[i]>=config.threshold) terms.push( [i,matches[i]]);	
	} 
	terms.sort(function(a,b){return b[1]-a[1]});
	return terms;
}
var finalize=function() {
	filter();
	status.output={
		totalpagecount:engine.get("meta").pagecount,
		pagecount:texts.length,
		terms:terms
	};
	status.done=true;
}
var unregex=function(q) {
	var out=q.replace(/\.+/g," ");
	out=out.replace(/\\./g," "); //remove \d \n \t
	return out;
}
var start=function(_config){
	config=_config;
	var open=Kde.open;
	config.threshold=config.threshold||5;
	if (typeof Require=="undefined") open=Kde.openLocal;
	config.q_unregex=unregex(config.q);
	open(config.db,function(_engine){
		engine=_engine;
		setTimeout(worker,0);
	});
}
var stop=function() {
	forcestop=true;
}

var getstatus=function() {
	return status;
}
module.exports={start:start,stop:stop,status:getstatus};
});
require.register("ksana-document/bsearch.js", function(exports, require, module){
var indexOfSorted = function (array, obj, near) { 
  var low = 0,
  high = array.length;
  while (low < high) {
    var mid = (low + high) >> 1;
    if (array[mid]==obj) return mid;
    array[mid] < obj ? low = mid + 1 : high = mid;
  }
  if (near) return low;
  else if (array[low]==obj) return low;else return -1;
};
var indexOfSorted_str = function (array, obj, near) { 
  var low = 0,
  high = array.length;
  while (low < high) {
    var mid = (low + high) >> 1;
    if (array[mid]==obj) return mid;
    (array[mid].localeCompare(obj)<0) ? low = mid + 1 : high = mid;
  }
  if (near) return low;
  else if (array[low]==obj) return low;else return -1;
};


var bsearch=function(array,value,near) {
	var func=indexOfSorted;
	if (typeof array[0]=="string") func=indexOfSorted_str;
	return func(array,value,near);
}
var bsearchNear=function(array,value) {
	return bsearch(array,value,true);
}

module.exports=bsearch;//{bsearchNear:bsearchNear,bsearch:bsearch};
});
require.register("ksana-document/persistentmarkup_pouchdb.js", function(exports, require, module){
/*
markup format:
{"start":start_offset,"len":length_in_byte,"payload":{"type":"markup_type",author":"p1","text":""},"i":page_id}
*/
//saveMarkup({dbid:dbid,markups:markups,filename:filename,i:this.state.pageid } ,function(data){

var combineMarkups=function(db,markups,fn,pageid,cb) {

	var key="M!"+pageid+"!"+fn;
	db.get(key,function(err,res){
		var existing=[] ;
		if (res && res.M) existing=res.M ;
		if (!markups || !markups.length) {
			if (err.error) cb([]);
			else cb(existing);
			return;
		}

		var author=markups[0].payload.author, others=[];
		if (existing) {
			others=existing.filter(function(m){return m.i!=pageid || m.payload.author != author});		
		}
		for (var i=0;i<markups.length;i++) {
			markups[i].i=pageid;
		}
		others=others.concat(markups);
		var sortfunc=function(a,b) {
			//each page less than 64K
			return (a.i*65536 +a.start) - (b.i*65536 +b.start);
		}
		others.sort(sortfunc);
		cb(others,res._rev);
	});
}

var saveMarkup=function(opts,cb){
	combineMarkups(opts.db,opts.markups,opts.filename,opts.i,function(markups,rev){
		for (var i=0;i<markups.length;i++) {
			markups[i].i=opts.i;
		}
		var key="M!"+opts.i+"!"+opts.filename;
		if (markups.length) {
			opts.db.put({M:markups,_rev:rev,_id:key},function(err,response){
				cb();
			});
		} else {
			cb();
		}
	});
}
var __loadMarkups=function(db,fn,pagecount,cb) {
	var out=[],keys=[];
	for (var i=1;i<pagecount;i++) {
		keys.push("M!"+i+"!"+fn);
	}
	db.allDocs({include_docs:true,keys:keys},function(err,res){
			res.rows.map(function(r){
				if (r.error) return;
				out=out.concat(r.doc.M);
			})
			cb(out);
	});
}
var loadMarkup=function(db,fn,pageid,cb) {
	if (pageid<0) {
		__loadMarkups(db,fn,-pageid,cb);
		return;
	}
	var key="M!"+pageid+"!"+fn;
	db.get(key,function(err,res){
		cb(res.M);
	});
}
module.exports={
	saveMarkup:saveMarkup,
	loadMarkup:loadMarkup
}
});
require.register("ksana-document/underlines.js", function(exports, require, module){
/*
  input : markups start and len
  output:
     each token has an array of 
			[markup idx , start_middle_end , level ]

			markup idx is the nth markup in markup array
			start=1, middle=0, end=2, both=3

 for converting to css style

 base on http://codepen.io/anon/pen/fHben by exebook@gmail.com
*/
var getTextLen=function(markups) {
	var textlen=0;
	markups.map(function(m){
		if (m[0]+m[1]>textlen) textlen=m[0]+m[1];
	});
	return textlen;
}

var calculateLevels=function(M) {
	//M = M.sort(function(a, b) { return b.len - a.len } ); // sort longest first
	var textlen=getTextLen(M);
	var levels=[],out=[];
	for (var i = 0; i < textlen; i++) levels[i] = [];

	for (var i = 0; i < M.length; i++) {
		var max = -1, pos = M[i][0], count = M[i][1];
		// find how many taken levels are here
		for (var x = pos; x < pos + count; x++) {
			if (levels[x].length > max) max = levels[x].length;
		}
		// check if there is an empty level
		var level = max;
		for (var l = 0; l < max; l++) {
			var ok = true ;
			for (var m = pos; m < pos + count; m++) {
				if (levels[m][l] != undefined) { ok = false; break }
			}
			if (ok) { level = l; break }
		}
		out.push([i,level]);
		// fill the level
		for (var x = pos; x < pos + count; x++)	levels[x][level] = i;
	}
	return out;
}

var TAG_START=0, TAG_END=1;
var fixOverlaps=function(S) {
	// insert extra tags because we cannot have overlaps in html
	var out = [], stack = [] ,lstack=[];
	for (var i = S.length - 1; i >= 0; i--) {
		var id=S[i][0], pos=S[i][1],tagtype=S[i][2], level=S[i][3];
		if (tagtype == TAG_START) { 
			stack.push(id);
			lstack.push(level);
			out.unshift(S[i]);
		}	else if (tagtype == TAG_END) {
			if (id == stack[stack.length - 1]) {
				stack.pop();
				lstack.pop();
				out.unshift(S[i]);
			} else {
				var z = stack.length - 1;
				while (z > 0 && stack[z] != id) {
					out.unshift([stack[z], pos, TAG_END, lstack[z]]);
					z--;
				}
				out.unshift([stack[z], pos, TAG_END, lstack[z]]);
				stack.splice(z, 1);
				lstack.splice(z, 1);
				while (z < stack.length) {
					out.unshift([stack[z], pos, TAG_START,  lstack[z]]);
					z++;
				}
			} 
		}
	}
	return out
}
var levelMarkups=function(M) {
	var P=calculateLevels(M), S = [];
	var backward=function(a, b){ 
		if (b[1] == a[1]) {
				if (b[2] == TAG_START && a[2] == TAG_END) return 1;
				if (a[2] == TAG_START && b[2] == TAG_END) return -1;
			}
			return b[1] - a[1];
	};
	var forward=function(a, b){ 
				if (b[1] == a[1]) {
					if (b[2] == TAG_START && a[2] == TAG_END) return -1;
					if (a[2] == TAG_START && b[2] == TAG_END) return 1;
				}
				return a[1] - b[1];
	};

	for (var p = 0; p < P.length; p++) {
		S.push([p,M[p][0],TAG_START,P[p][1]]); // id, pos, tagtype, level
		S.push([p,M[p][0]+M[p][1],TAG_END,P[p][1]]);
	}
	S = S.sort(backward);
			
	/* s[0] == markup id , s[1]==pos , s[2]==tagtype  */
	S = fixOverlaps(S);
	//if (!inverse) S = S.sort(forward);		
	return S;
}
var renderXML=function(tokens, M) {
	var S=levelMarkups(M,true);

	var idx=0,out="";
	for (var i=tokens.length;i>0;i--) {
		while (idx<S.length && S[idx][1]==i) {
			var id=S[idx][0], tagtype=S[idx][2] ;
			var tag = M[id][2] , level=S[idx][3] ; //level=P[id][1];
			if (tagtype==TAG_START) out= '<'+tag+' lv="'+level+'">' +out;
			if (tagtype==TAG_END) out= '</'+tag+'>' +out;
			idx++;
		}
		out=tokens[i-1]+out;
	}
	return out;//return text
}
module.exports={calculateLevels:calculateLevels, 
	levelMarkups:levelMarkups,renderXML:renderXML,
  TAG_START:TAG_START,TAG_END:TAG_END};

/*
var indexOfSorted = function (array, obj) {  //taken from ksana-document/bsearch.js
  var low = 0,
  high = array.length;
  while (low < high) {
    var mid = (low + high) >> 1;
    if (array[mid]==obj) return mid;
    array[mid] < obj ? low = mid + 1 : high = mid;
  }
	if (array[low]==obj) return low;else return -1;
};

var getTextLen=function(markups) {
	var textlen=0;
	markups.map(function(m){
		if (m[0]+m[1]>textlen) textlen=m[0]+m[1];
	});
	return textlen;
}

var calculateLevel=function(markups,textlen) {
	textlen=textlen||getTextLen(markups);
	var startarr=markups.map(function(m,idx){return [m[0],idx]})
	              .sort(function(a,b){return a[0]-b[0]});

	var startat =startarr.map(function(m){return m[0]});
	var startidx=startarr.map(function(m){return m[1]});

	var endarr  =markups.map(function(m,idx){return [m[0]+m[1]-1,idx]})
	              .sort(function(a,b){return a[0]-b[0]});

	var endat =endarr.map(function(m){return m[0]}); // sort by token offset
	var endidx=endarr.map(function(m){return m[1]}); //markup index
	
	var levels=[],level=0;
	var out=[];
	for (var i=0;i<textlen;i++) {
		var tokenout=[]; 
		var starts=[],ends=[];
		var mstart=indexOfSorted(startat,i); //don't need , because one pass
		while (startat[mstart]==i) {  //find out all markups start at this token
			starts.push(startidx[mstart]);
			mstart++;
		}

		var mend=indexOfSorted(endat,i);
		while (endat[mend]==i) {  // find out all markups end at this token
			ends.push(endidx[mend]); //push the idx in markups
			mend++;
		}

		//insert new markup
		starts.map(function(s,idx){
			var j=0;
			while (typeof levels[j]!=="undefined") j++;
			levels[j]=[s,1];
		});
		
		//marked the ended
		ends.map(function(e,idx){
			for (var j=0;j<levels.length;j++) {
				var lv=levels[j];
				if (!lv) continue;
				if (lv[0]==e) lv[1]+=2;//mark end
			}
		});

		levels.map(function(lv,idx,L){
			if (!lv) return ;
			tokenout.push([lv[0],lv[1],idx]);
			if(lv[1]==1) lv[1]=0;
			else if (lv[1]>=2) L[idx]=undefined; //remove the ended markup
		});
		
		out[i]=tokenout;
	}
	//levels.length , max level 

	return out;
}

var renderXML=function(tokens,markups,levels) {
	var out=[];
	for (var i=0;i<tokens.length;i++) {
		var s=tokens[i];
		if (levels[i]) {
			for (var j=0;j<levels[i].length;j++) {
				var lv=levels[i][j];
				var tag=markups[lv[0]][2];
				if ((lv[1]&1)==1) {
					s="<"+tag+">"+s;
				} else if ((lv[1]&2)==2) {
					s=s+"</"+tag+">";
				}
			}
		}
		//out+=s;
	}
	return out;
}
*/
});
require.register("ksanaforge-fileinstaller/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* todo , optional kdb */

var HtmlFS=Require("htmlfs");    
var CheckBrowser=Require("checkbrowser");  
  
var html5fs=Require("ksana-document").html5fs;
var FileList = React.createClass({displayName: 'FileList',
	getInitialState:function() {
		return {downloading:false,progress:0};
	},
	updatable:function(f) {
        	var classes="btn btn-warning";
        	if (this.state.downloading) classes+=" disabled";
		if (f.hasUpdate) return React.createElement("button", {className: classes, 
			'data-filename': f.filename, 'data-url': f.url, 
	            onClick: this.download
	       }, "Update")
		else return null;
	},
	showLocal:function(f) {
        var classes="btn btn-danger";
        if (this.state.downloading) classes+=" disabled";
	  return React.createElement("tr", null, React.createElement("td", null, f.filename), 
	      React.createElement("td", null), 
	      React.createElement("td", {className: "pull-right"}, 
	      this.updatable(f), React.createElement("button", {className: classes, 
	               onClick: this.deleteFile, 'data-filename': f.filename}, "Delete")
	        
	      )
	  )
	},  
	showRemote:function(f) { 
	  var classes="btn btn-warning";
	  if (this.state.downloading) classes+=" disabled";
	  return (React.createElement("tr", {'data-id': f.filename}, React.createElement("td", null, 
	      f.filename), 
	      React.createElement("td", null, f.desc), 
	      React.createElement("td", null, 
	      React.createElement("span", {'data-filename': f.filename, 'data-url': f.url, 
	            className: classes, 
	            onClick: this.download}, "Download")
	      )
	  ));
	},
	showFile:function(f) {
	//	return <span data-id={f.filename}>{f.url}</span>
		return (f.ready)?this.showLocal(f):this.showRemote(f);
	},
	reloadDir:function() {
		this.props.action("reload");
	},
	download:function(e) {
		var url=e.target.dataset["url"];
		var filename=e.target.dataset["filename"];
		this.setState({downloading:true,progress:0,url:url});
		this.userbreak=false;
		html5fs.download(url,filename,function(){
			this.reloadDir();
			this.setState({downloading:false,progress:1});
			},function(progress,total){
				if (progress==0) {
					this.setState({message:"total "+total})
			 	}
			 	this.setState({progress:progress});
			 	//if user press abort return true
			 	return this.userbreak;
			}
		,this);
	},
	deleteFile:function( e) {
		var filename=e.target.attributes["data-filename"].value;
		this.props.action("delete",filename);
	},
	allFilesReady:function(e) {
		return this.props.files.every(function(f){ return f.ready});
	},
	dismiss:function() {
		$(this.refs.dialog1.getDOMNode()).modal('hide');
		this.props.action("dismiss");
	},
	abortdownload:function() {
		this.userbreak=true;
	},
	showProgress:function() {
	     if (this.state.downloading) {
	      var progress=Math.round(this.state.progress*100);
	      return (
	      	React.createElement("div", null, 
	      	"Downloading from ", this.state.url, 
	      React.createElement("div", {key: "progress", className: "progress col-md-8"}, 
	          React.createElement("div", {className: "progress-bar", role: "progressbar", 
	              'aria-valuenow': progress, 'aria-valuemin': "0", 
	              'aria-valuemax': "100", style: {width: progress+"%"}}, 
	            progress, "%"
	          )
	        ), 
	        React.createElement("button", {onClick: this.abortdownload, 
	        	className: "btn btn-danger col-md-4"}, "Abort")
	        )
	        );
	      } else {
	      		if ( this.allFilesReady() ) {
	      			return React.createElement("button", {onClick: this.dismiss, className: "btn btn-success"}, "Ok")
	      		} else return null;
	      		
	      }
	},
	showUsage:function() {
		var percent=this.props.remainPercent;
           return (React.createElement("div", null, React.createElement("span", {className: "pull-left"}, "Usage:"), React.createElement("div", {className: "progress"}, 
		  React.createElement("div", {className: "progress-bar progress-bar-success progress-bar-striped", role: "progressbar", style: {width: percent+"%"}}, 
		    	percent+"%"
		  )
		)));
	},
	render:function() {
	  	return (
		React.createElement("div", {ref: "dialog1", className: "modal fade", 'data-backdrop': "static"}, 
		    React.createElement("div", {className: "modal-dialog"}, 
		      React.createElement("div", {className: "modal-content"}, 
		        React.createElement("div", {className: "modal-header"}, 
		          React.createElement("h4", {className: "modal-title"}, "File Installer")
		        ), 
		        React.createElement("div", {className: "modal-body"}, 
		        	React.createElement("table", {className: "table"}, 
		        	React.createElement("tbody", null, 
		          	this.props.files.map(this.showFile)
		          	)
		          )
		        ), 
		        React.createElement("div", {className: "modal-footer"}, 
		        	this.showUsage(), 
		           this.showProgress()
		        )
		      )
		    )
		  )
		);
	},	
	componentDidMount:function() {
		$(this.refs.dialog1.getDOMNode()).modal('show');
	}
});
/*TODO kdb check version*/
var Filemanager = React.createClass({displayName: 'Filemanager',
	getInitialState:function() {
		var quota=this.getQuota();
		return {browserReady:false,noupdate:true,	requestQuota:quota,remain:0};
	},
	getQuota:function() {
		var q=this.props.quota||"128M";
		var unit=q[q.length-1];
		var times=1;
		if (unit=="M") times=1024*1024;
		else if (unit="K") times=1024;
		return parseInt(q) * times;
	},
	missingKdb:function() {
		if (ksanagap.platform!="chrome") return [];
		var missing=this.props.needed.filter(function(kdb){
			for (var i in html5fs.files) {
				if (html5fs.files[i][0]==kdb.filename) return false;
			}
			return true;
		},this);
		return missing;
	},
	getRemoteUrl:function(fn) {
		var f=this.props.needed.filter(function(f){return f.filename==fn});
		if (f.length ) return f[0].url;
	},
	genFileList:function(existing,missing){
		var out=[];
		for (var i in existing) {
			var url=this.getRemoteUrl(existing[i][0]);
			out.push({filename:existing[i][0], url :url, ready:true });
		}
		for (var i in missing) {
			out.push(missing[i]);
		}
		return out;
	},
	reload:function() {
		html5fs.readdir(function(files){
  			this.setState({files:this.genFileList(files,this.missingKdb())});
  		},this);
	 },
	deleteFile:function(fn) {
	  html5fs.rm(fn,function(){
	  	this.reload();
	  },this);
	},
	onQuoteOk:function(quota,usage) {
		if (ksanagap.platform!="chrome") {
			//console.log("onquoteok");
			this.setState({noupdate:true,missing:[],files:[],autoclose:true
				,quota:quota,remain:quota-usage,usage:usage});
			return;
		}
		//console.log("quote ok");
		var files=this.genFileList(html5fs.files,this.missingKdb());
		var that=this;
		that.checkIfUpdate(files,function(hasupdate) {
			var missing=this.missingKdb();
			var autoclose=this.props.autoclose;
			if (missing.length) autoclose=false;
			that.setState({autoclose:autoclose,
				quota:quota,usage:usage,files:files,
				missing:missing,
				noupdate:!hasupdate,
				remain:quota-usage});
		});
	},  
	onBrowserOk:function() {
	  this.totalDownloadSize();
	}, 
	dismiss:function() {
		this.props.onReady(this.state.usage,this.state.quota);
		setTimeout(function(){
			var modalin=$(".modal.in");
			if (modalin.modal) modalin.modal('hide');
		},500);
	}, 
	totalDownloadSize:function() {
		var files=this.missingKdb();
		var taskqueue=[],totalsize=0;
		for (var i=0;i<files.length;i++) {
			taskqueue.push(
				(function(idx){
					return (function(data){
						if (!(typeof data=='object' && data.__empty)) totalsize+=data;
						html5fs.getDownloadSize(files[idx].url,taskqueue.shift());
					});
				})(i)
			);
		}
		var that=this;
		taskqueue.push(function(data){	
			totalsize+=data;
			setTimeout(function(){that.setState({requireSpace:totalsize,browserReady:true})},0);
		});
		taskqueue.shift()({__empty:true});
	},
	checkIfUpdate:function(files,cb) {
		var taskqueue=[];
		for (var i=0;i<files.length;i++) {
			taskqueue.push(
				(function(idx){
					return (function(data){
						if (!(typeof data=='object' && data.__empty)) files[idx-1].hasUpdate=data;
						html5fs.checkUpdate(files[idx].url,files[idx].filename,taskqueue.shift());
					});
				})(i)
			);
		}
		var that=this;
		taskqueue.push(function(data){	
			files[files.length-1].hasUpdate=data;
			var hasupdate=files.some(function(f){return f.hasUpdate});
			if (cb) cb.apply(that,[hasupdate]);
		});
		taskqueue.shift()({__empty:true});
	},
	render:function(){
    		if (!this.state.browserReady) {   
      			return React.createElement(CheckBrowser, {feature: "fs", onReady: this.onBrowserOk})
    		} if (!this.state.quota || this.state.remain<this.state.requireSpace) {  
    			var quota=this.state.requestQuota;
    			if (this.state.usage+this.state.requireSpace>quota) {
    				quota=(this.state.usage+this.state.requireSpace)*1.5;
    			}
      			return React.createElement(HtmlFS, {quota: quota, autoclose: "true", onReady: this.onQuoteOk})
      		} else {
			if (!this.state.noupdate || this.missingKdb().length || !this.state.autoclose) {
				var remain=Math.round((this.state.usage/this.state.quota)*100);				
				return React.createElement(FileList, {action: this.action, files: this.state.files, remainPercent: remain})
			} else {
				setTimeout( this.dismiss ,0);
				return React.createElement("span", null, "Success");
			}
      		}
	},
	action:function() {
	  var args = Array.prototype.slice.call(arguments);
	  var type=args.shift();
	  var res=null, that=this;
	  if (type=="delete") {
	    this.deleteFile(args[0]);
	  }  else if (type=="reload") {
	  	this.reload();
	  } else if (type=="dismiss") {
	  	this.dismiss();
	  }
	}
});

module.exports=Filemanager;
});
require.register("ksanaforge-checkbrowser/index.js", function(exports, require, module){
/** @jsx React.DOM */

var hasksanagap=(typeof ksanagap!="undefined");
if (hasksanagap && (typeof console=="undefined" || typeof console.log=="undefined")) {
		window.console={log:ksanagap.log,error:ksanagap.error,debug:ksanagap.debug,warn:ksanagap.warn};
		console.log("install console output funciton");
}

var checkfs=function() {
	return (navigator && navigator.webkitPersistentStorage) || hasksanagap;
}
var featurechecks={
	"fs":checkfs
}
var checkbrowser = React.createClass({displayName: 'checkbrowser',
	getInitialState:function() {

		var missingFeatures=this.getMissingFeatures();
		return {ready:false, missing:missingFeatures};
	},
	getMissingFeatures:function() {
		var feature=this.props.feature.split(",");
		var status=[];
		feature.map(function(f){
			var checker=featurechecks[f];
			if (checker) checker=checker();
			status.push([f,checker]);
		});
		return status.filter(function(f){return !f[1]});
	},
	downloadbrowser:function() {
		window.location="https://www.google.com/chrome/"
	},
	renderMissing:function() {
		var showMissing=function(m) {
			return React.createElement("div", null, m);
		}
		return (
		 React.createElement("div", {ref: "dialog1", className: "modal fade", 'data-backdrop': "static"}, 
		    React.createElement("div", {className: "modal-dialog"}, 
		      React.createElement("div", {className: "modal-content"}, 
		        React.createElement("div", {className: "modal-header"}, 
		          React.createElement("button", {type: "button", className: "close", 'data-dismiss': "modal", 'aria-hidden': "true"}, "×"), 
		          React.createElement("h4", {className: "modal-title"}, "Browser Check")
		        ), 
		        React.createElement("div", {className: "modal-body"}, 
		          React.createElement("p", null, "Sorry but the following feature is missing"), 
		          this.state.missing.map(showMissing)
		        ), 
		        React.createElement("div", {className: "modal-footer"}, 
		          React.createElement("button", {onClick: this.downloadbrowser, type: "button", className: "btn btn-primary"}, "Download Google Chrome")
		        )
		      )
		    )
		  )
		 );
	},
	renderReady:function() {
		return React.createElement("span", null, "browser ok")
	},
	render:function(){
		return  (this.state.missing.length)?this.renderMissing():this.renderReady();
	},
	componentDidMount:function() {
		if (!this.state.missing.length) {
			this.props.onReady();
		} else {
			$(this.refs.dialog1.getDOMNode()).modal('show');
		}
	}
});

module.exports=checkbrowser;
});
require.register("ksanaforge-htmlfs/index.js", function(exports, require, module){
/** @jsx React.DOM */
var html5fs=Require("ksana-document").html5fs;
var htmlfs = React.createClass({displayName: 'htmlfs',
	getInitialState:function() { 
		return {ready:false, quota:0,usage:0,Initialized:false,autoclose:this.props.autoclose};
	},
	initFilesystem:function() {
		var quota=this.props.quota||1024*1024*128; // default 128MB
		quota=parseInt(quota);
		html5fs.init(quota,function(q){
			this.dialog=false;
			$(this.refs.dialog1.getDOMNode()).modal('hide');
			this.setState({quota:q,autoclose:true});
		},this);
	},
	welcome:function() {
		return (
		React.createElement("div", {ref: "dialog1", className: "modal fade", id: "myModal", 'data-backdrop': "static"}, 
		    React.createElement("div", {className: "modal-dialog"}, 
		      React.createElement("div", {className: "modal-content"}, 
		        React.createElement("div", {className: "modal-header"}, 
		          React.createElement("h4", {className: "modal-title"}, "Welcome")
		        ), 
		        React.createElement("div", {className: "modal-body"}, 
		          "Browser will ask for your confirmation."
		        ), 
		        React.createElement("div", {className: "modal-footer"}, 
		          React.createElement("button", {onClick: this.initFilesystem, type: "button", 
		            className: "btn btn-primary"}, "Initialize File System")
		        )
		      )
		    )
		  )
		 );
	},
	renderDefault:function(){
		var used=Math.floor(this.state.usage/this.state.quota *100);
		var more=function() {
			if (used>50) return React.createElement("button", {type: "button", className: "btn btn-primary"}, "Allocate More");
			else null;
		}
		return (
		React.createElement("div", {ref: "dialog1", className: "modal fade", id: "myModal", 'data-backdrop': "static"}, 
		    React.createElement("div", {className: "modal-dialog"}, 
		      React.createElement("div", {className: "modal-content"}, 
		        React.createElement("div", {className: "modal-header"}, 
		          React.createElement("h4", {className: "modal-title"}, "Sandbox File System")
		        ), 
		        React.createElement("div", {className: "modal-body"}, 
		          React.createElement("div", {className: "progress"}, 
		            React.createElement("div", {className: "progress-bar", role: "progressbar", style: {width: used+"%"}}, 
		               used, "%"
		            )
		          ), 
		          React.createElement("span", null, this.state.quota, " total , ", this.state.usage, " in used")
		        ), 
		        React.createElement("div", {className: "modal-footer"}, 
		          React.createElement("button", {onClick: this.dismiss, type: "button", className: "btn btn-default", 'data-dismiss': "modal"}, "Close"), 
		          more()
		        )
		      )
		    )
		  )
		  );
	},
	dismiss:function() {
		var that=this;
		setTimeout(function(){
			that.props.onReady(that.state.quota,that.state.usage);	
		},0);
	},
	queryQuota:function() {
		if (ksanagap.platform=="chrome") {
			html5fs.queryQuota(function(usage,quota){
				this.setState({usage:usage,quota:quota,initialized:true});
			},this);			
		} else {
			this.setState({usage:333,quota:1000*1000*1024,initialized:true,autoclose:true});
		}
	},
	render:function() {
		var that=this;
		if (!this.state.quota || this.state.quota<this.props.quota) {
			if (this.state.initialized) {
				this.dialog=true;
				return this.welcome();	
			} else {
				return React.createElement("span", null, "checking quota")
			}			
		} else {
			if (!this.state.autoclose) {
				this.dialog=true;
				return this.renderDefault(); 
			}
			this.dismiss();
			this.dialog=false;
			return React.createElement("span", null)
		}
	},
	componentDidMount:function() {
		if (!this.state.quota) {
			this.queryQuota();

		};
	},
	componentDidUpdate:function() {
		if (this.dialog) $(this.refs.dialog1.getDOMNode()).modal('show');
	}
});

module.exports=htmlfs;
});
require.register("adarsha-main/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component,
 change name of ./component.js and  "dependencies" section of ../../component.js */
var require_kdb=[{ 
  filename:"jiangkangyur.kdb"  , 
  url:"http://ya.ksana.tw/kdb/jiangkangyur.kdb" , desc:"jiangkangyur"
}];
//var othercomponent=Require("other");
var bootstrap=Require("bootstrap");  
var Resultlist=Require("resultlist");
var Fileinstaller=Require("fileinstaller");
var kde=Require('ksana-document').kde;  // Ksana Database Engine
var kse=Require('ksana-document').kse; // Ksana Search Engine (run at client side)
var api=Require("api");
var Stacktoc=Require("stacktoc");  //載入目錄顯示元件
var Showtext=Require("showtext");
var tibetan=Require("ksana-document").languages.tibetan; 
var page2catalog=Require("page2catalog");
var Namelist=Require("namelist");
var version="v0.1.25"
var main = React.createClass({displayName: 'main',
  componentDidMount:function() {
    var that=this;
    //window.onhashchange = function () {that.goHashTag();}   
  }, 
  getInitialState: function() {
    document.title=version+"-adarsha";
    return {dialog:null,res:{},res_toc:[],bodytext:{file:0,page:0},db:null,toc_result:[],page:0,field:"sutra",scrollto:0,hide:false, wylie:false};
  },
  componentDidUpdate:function()  {
    var ch=document.documentElement.clientHeight;
    var banner=100;
    this.refs["text-content"].getDOMNode().style.height=ch-banner+"px";
    this.refs["tab-content"].getDOMNode().style.height=(ch-banner-40)+"px";
  },  
  encodeHashTag:function(file,p) { //file/page to hash tag
    var f=parseInt(file)+1;
    return "#"+f+"."+p;
  },
  decodeHashTag:function(s) {
    var fp=s.match(/#(\d+)\.(.*)/);
    var p=parseInt(fp[2]);
    var file=parseInt(fp[1])-1;
    var pagename=this.state.db.getFilePageNames(file)[p]; 
    this.setPage(pagename,file);
  },
  goHashTag:function() {
    this.decodeHashTag(window.location.hash || "#1.1");
  },
  searchtypechange:function(e) {
    var field=e.target.parentElement.dataset.type;
    var w=this.refs.tofind.getDOMNode().value;
    var tofind=tibetan.romanize.fromWylie(w);
    if (w!=tofind && !this.state.hide) {
      this.setState({tofind_wylie:tofind});
    } else this.setState({tofind_wylie:null});
    this.dosearch(null,null,0,field,tofind);
    if(field) this.setState({field:field});
  },
  dosearch: function(e,reactid,start,field,tofind){
    field=field || this.state.field;
    if(field == "fulltext"){
      kse.search(this.state.db,tofind,{range:{start:start,maxhit:100}},function(data){ //call search engine          
        this.setState({res:data, tofind:tofind, res_toc:[]});  
      });
    }
    if(field == "kacha"){
      var res_kacha=api.search_api.searchKacha(tofind,this.state.toc);
      if(tofind != "") this.setState({res_toc:res_kacha, tofind:tofind, res:[]});
      else this.setState({res_toc:[], tofind:tofind, res:[]});
    }
    if(field == "sutra"){
      var res_sutra=api.search_api.searchSutra(tofind,this.state.toc);
      if(tofind != "") this.setState({res_toc:res_sutra, tofind:tofind, res:[]});
      else this.setState({res_toc:[], tofind:tofind, res:[]});
    }
    
  },
  renderinputs:function(searcharea) {  // input interface for search // onInput={this.searchtypechange}
    if (this.state.db) {
      return (    
        React.createElement("div", null, 
        React.createElement("input", {className: "form-control input-small", ref: "tofind", onInput: this.searchtypechange, defaultValue: "byang chub"})
        )
        )          
    } else {
      return React.createElement("span", null, "loading database....")
    }
  },   
  genToc:function(texts,depths,voffs){
    var out=[{depth:0,text:"འཇང་བཀའ་འགྱུར།"}];
    for(var i=0; i<texts.length; i++){
      out.push({text:texts[i],depth:depths[i],voff:voffs[i]});
    }
    return out; 
  },// 轉換為stacktoc 目錄格式
  onReady:function(usage,quota) {
    if (!this.state.db) kde.open("jiangkangyur",function(db){
        this.setState({db:db});
        db.get([["fields","head"],["fields","head_depth"],["fields","head_voff"]],function(){
          var heads=db.get(["fields","head"]);
          var depths=db.get(["fields","head_depth"]);
          var voffs=db.get(["fields","head_voff"]);
          var toc=this.genToc(heads,depths,voffs);
          this.setState({toc:toc});
          this.goHashTag();
        }); //載入目錄
    },this);    
      
    this.setState({dialog:false,quota:quota,usage:usage});
    
  },
  openFileinstaller:function(autoclose) {
    if (window.location.origin.indexOf("http://127.0.0.1")==0) {
      require_kdb[0].url=window.location.origin+window.location.pathname+"jiangkangyur.kdb";
    }
    return React.createElement(Fileinstaller, {quota: "512M", autoclose: autoclose, needed: require_kdb, 
                     onReady: this.onReady})
  },
  showExcerpt:function(n) {
    var voff=this.state.toc[n].voff;
    this.dosearch(null,null,voff);
  },
  gotofile:function(vpos){
    var res=kse.vpos2filepage(this.state.db,vpos);
    this.showPage(res.file,res.page,false);
  },
  showPage:function(f,p,hideResultlist) {  
    window.location.hash = this.encodeHashTag(f,p);
    var that=this;
    var pagename=this.state.db.getFilePageNames(f)[p];
    this.setState({scrollto:pagename});

    kse.highlightFile(this.state.db,f,{q:this.state.tofind},function(data){
      that.setState({bodytext:data,page:p});
      if (hideResultlist) that.setState({res:[]});     
    });
  }, 
  showText:function(n) {
    var res=kse.vpos2filepage(this.state.db,this.state.toc[n].voff);
    if(res.file != -1) this.showPage(res.file,res.page,true);    
  },
  nextfile:function() {
    var file=this.state.bodytext.file+1;
    var page=this.state.bodytext.page || 1;
    this.showPage(file,page,false);
    this.setState({scrollto:null});
  },
  prevfile:function() {
    var file=this.state.bodytext.file-1;
    var page=this.state.bodytext.page || 1;
    if (file<0) file=0;
    this.showPage(file,page,false);
    this.setState({scrollto:null});
  },
  setPage:function(newpagename,file) {
    var fp=this.state.db.findPage(newpagename);
    if (fp.length){
      this.showPage(fp[0].file,fp[0].page);
    }
    console.log(newpagename);
  },
  setwylie: function() {
    this.setState({wylie:!this.state.wylie});
    this.setState({scrollto:null});
  },
  textConverter:function(t) {
    if(this.state.wylie == true) return tibetan.romanize.toWylie(t,null,false); 
    return t; 
  },
  render: function() {
    if (!this.state.quota) { // install required db
        return this.openFileinstaller(true);
    } else { 
      var text="",pagename="";
      if (this.state.bodytext) {
        text=this.state.bodytext.text;
        pagename=this.state.bodytext.pagename;
    }
    return (
  React.createElement("div", {className: "row"}, 
    React.createElement("div", {className: "col-md-12"}, 
      React.createElement("div", {className: "header"}, 
        React.createElement("img", {width: "100%", src: "./banner/banner.png"})
      ), 

      React.createElement("div", {className: "row"}, 
        React.createElement("div", {className: "col-md-3"}, 
          React.createElement("div", {className: "borderright"}, 
            React.createElement("ul", {className: "nav nav-tabs", role: "tablist"}, 
              React.createElement("li", {className: "active"}, React.createElement("a", {href: "#Search", role: "tab", 'data-toggle': "tab"}, React.createElement("img", {height: "30px", src: "./banner/search.png"}))), 
              React.createElement("li", null, React.createElement("a", {href: "#Catalog", role: "tab", 'data-toggle': "tab"}, React.createElement("img", {height: "30px", src: "./banner/icon-read.png"}))), 
              React.createElement("li", null, React.createElement("a", {href: "#about", role: "tab", 'data-toggle': "tab"}, React.createElement("img", {height: "30px", src: "./banner/icon-info.png"})))
            ), 

            React.createElement("div", {className: "tab-content", ref: "tab-content"}, 
              React.createElement("div", {className: "tab-pane fade", id: "Catalog"}, 
                React.createElement(Stacktoc, {textConverter: this.textConverter, showText: this.showText, showExcerpt: this.showExcerpt, hits: this.state.res.rawresult, data: this.state.toc, goVoff: this.state.goVoff})
              ), 

              React.createElement("div", {className: "tab-pane fade", id: "about"}, 
                React.createElement("div", {className: "center"}, 
                  React.createElement("br", null), React.createElement("img", {width: "100", src: "./banner/treasure_logo.png"})
                )
              ), 

              React.createElement("div", {className: "tab-pane fade in active", id: "Search"}, 
                React.createElement("div", {className: "slight"}, React.createElement("br", null)), 
                this.renderinputs("title"), 
                React.createElement("div", {className: "center"}, 
                  React.createElement("div", {className: "btn-group", 'data-toggle': "buttons", ref: "searchtype", onClick: this.searchtypechange}, 
                    React.createElement("label", {'data-type': "sutra", className: "btn btn-default btn-xs searchmode", Checked: true}, 
                    React.createElement("input", {type: "radio", name: "field", autocomplete: "off"}, React.createElement("img", {title: "མདོ་ཡི་མཚན་འཚོལ་བ། Sutra Search", width: "25", src: "./banner/icon-sutra.png"}))
                    ), 
                    React.createElement("label", {'data-type': "kacha", className: "btn btn-default btn-xs searchmode"}, 
                    React.createElement("input", {type: "radio", name: "field", autocomplete: "off"}, React.createElement("img", {title: "དཀར་ཆགས་འཚོལ་བ། Karchak Search", width: "25", src: "./banner/icon-kacha.png"}))
                    ), 
                    React.createElement("label", {'data-type': "fulltext", className: "btn btn-default btn-xs searchmode"}, 
                    React.createElement("input", {type: "radio", name: "field", autocomplete: "off"}, React.createElement("img", {title: "ནང་དོན་འཚོལ་བ།  Full Text search", width: "25", src: "./banner/icon-fulltext.png"}))
                    )
                  )
                  
              
                                    
                ), 
                React.createElement(Namelist, {wylie: this.state.wylie, res_toc: this.state.res_toc, tofind: this.state.tofind, gotofile: this.gotofile}), 
                React.createElement(Resultlist, {wylie: this.state.wylie, res: this.state.res, tofind: this.state.tofind, gotofile: this.gotofile})
              )
            )
          )
        ), 

        React.createElement("div", {className: "col-md-9"}, 
          
          React.createElement("div", {className: "text text-content", ref: "text-content"}, 
          React.createElement(Showtext, {setwylie: this.setwylie, wylie: this.state.wylie, page: this.state.page, bodytext: this.state.bodytext, text: text, nextfile: this.nextfile, prevfile: this.prevfile, setpage: this.setPage, db: this.state.db, toc: this.state.toc, scrollto: this.state.scrollto})
          )
        )
      )
    )
  )
      );
    }
  }
});

module.exports=main;
});
require.register("adarsha-comp1/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var comp1 = React.createClass({displayName: 'comp1',
  getInitialState: function() {
    return {bar: "world"};
  },
  render: function() {
    return (
      React.createElement("div", null, 
        "Hello,", this.state.bar
      )
    );
  }
});
module.exports=comp1;
});
require.register("adarsha-resultlist/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var tibetan=Require("ksana-document").languages.tibetan; 
var resultlist=React.createClass({displayName: 'resultlist',  //should search result
  show:function() {
    if(this.props.wylie == false) var tofind=this.props.tofind;
    if(this.props.wylie == true ) var tofind=tibetan.romanize.toWylie(this.props.tofind,null,false);
    
    return this.props.res.excerpt.map(function(r,i){ // excerpt is an array 
      var t = new RegExp(tofind,"g"); 
      var context="";
      if(this.props.wylie == false) context=r.text.replace(t,function(tofind){return "<hl>"+tofind+"</hl>"});
      if(this.props.wylie == true) context=tibetan.romanize.toWylie(r.text,null,false).replace(t,function(tofind){return "<hl>"+tofind+"</hl>"});
      return React.createElement("div", {'data-vpos': r.hits[0][0]}, 
      React.createElement("a", {onClick: this.gotopage, className: "pagename"}, r.pagename), 
        React.createElement("div", {className: "resultitem", dangerouslySetInnerHTML: {__html:context}})
      )
    },this);
  }, 
  gotopage:function(e) {
    var vpos=parseInt(e.target.parentNode.dataset['vpos']);
    this.props.gotofile(vpos);
  },
  render:function() {
    if (this.props.res) {
      if (this.props.res.excerpt&&this.props.res.excerpt.length) {
          return React.createElement("div", {className: "results"}, this.show())
          debugger;
      } else {
        return React.createElement("div", null)
      }
    }
    else {
      return React.createElement("div", null, "type keyword to search")
    } 
  }
});
module.exports=resultlist; 
});
require.register("adarsha-api/index.js", function(exports, require, module){
//var othercomponent=Require("other"); 
//new module filename must be added to scripts section of ./component.js and export here
var api = {
 search_api: require("./search_api"),
 corres_api: require("./corres_api")
}

module.exports=api;
});
require.register("adarsha-api/search_api.js", function(exports, require, module){
var searchSutra=function(tofind,toc){
	var out=[];
	toc.map(function(item){
		if(item.depth==3 && item.text.indexOf(tofind)>-1){
			out.push(item);
		}
	});
	return out;
}

var searchKacha=function(tofind,toc){
	var out=[];
	toc.map(function(item){
		if(item.depth!=3 && item.depth!=0 && item.text.indexOf(tofind)>-1){
			out.push(item);
		}
	});
	return out;
}

var search_api={searchSutra:searchSutra,searchKacha:searchKacha}
module.exports=search_api;
});
require.register("adarsha-api/corres_api.js", function(exports, require, module){
var dosearch=function(volpage,from,to) {
  var tmp=fromVolpage(volpage,from,to);
    //corresFromVolpage= [經號],[範圍],[對照經號],[對照範圍],[對照行],[K經號]
  var parse_tmp=parseVolPage(tmp);
  var corresPage=snap2realpage(parse_tmp);
  return corresPage.vol+"."+corresPage.page+corresPage.side;
}

var fromVolpage=function(volpage,from,to){
  //var volpage=document.getElementById("input").value;
  var out=[];
  var range=findRange(volpage,from);//range=[J經號,J範圍,K經號]
  var corres_range=findCorresRange(range[2],to);//corres_range=[D經號,D範圍,下一項D經號,下一項D範圍]
  //算J和D的範圍
  if(corres_range.length != 0){
    var vRange=countRange(range[1],range[3],range[0],range[2]);
    //vRange input為D範圍, 下一項D範圍, D經, 下一項D經 //output為[vStart,vEnd-vStart]
    var corres_vRange=countRange(corres_range[0][1],corres_range[corres_range.length-1][1]);//[vStart,vEnd-vStart]
    var corresLine=countCorresLine(volpage,vRange[1],corres_vRange[1],vRange[0],corres_vRange[0]);

    //out.push([range[0]],[range[1]],[corres_range[0][0]],[corres_range[0][1]],[corresLine],[range[2]]);
          // [經號],[範圍],[對照經號],[對照範圍],[對照行],[K經號]
    return corresLine;
  }
}

var countCorresLine=function(volpage,range,corres_range,start,corres_start){//volpage=使用者輸入的volpage
	var Vline=volpb2vl(volpage);
	var corres_vLine=(range*corres_start+corres_range*(Vline-start))/range;//對照的虛擬行
	corres_vLine=Math.floor(corres_vLine);
	var corresLine=vl2volpb(corres_vLine);//對照的虛擬行轉回volpage
	return corresLine;
}

var countRange=function(Range){//range=034@020a1-103b7
	var m=Range.split("-");
	var start=m[0];
	var vStart=volpb2vl(start);
	if (m[1].match("@")) var end=m[1];
	else {
		var end=start.substr(0,start.indexOf("@")+1)+m[1];
	}
	var vEnd=volpb2vl(end);
	var vRange=[vStart,vEnd-vStart];
	
	return vRange;
}

var findCorresRange=function(KJing,to){
	var out=[];
	for(var i=0; i<to.length; i++){
		if(KJing == to[i][2]){
			out.push([to[i][0],to[i][1]]);
		}
	}
	return out;
}

var findRange=function(volpage,from){
	var out=[];
	var Pedurma=startline2vline(from);
	//將輸入轉為vline，找出此行所在的範圍
	//for(var i=0; i<input.length; i++){}
	var input_vline=volpb2vl(volpage);
	for(var k=0; k<Pedurma.length; k++){
		if(input_vline < Pedurma[k][1]){
			out=from[k-1];//此行所在的範圍的[J經錄,J範圍,K經錄]
			break;
		}
	}
	return out;
}

//Pedurma的起始行轉vline
var startline2vline=function(from){
	var out=[];
	for(var j=0; j<from.length; j++){
		var p=from[j][1].split("-");
		var start=p[0];
		var start_vline=volpb2vl(start);
		out.push([from[j][0],start_vline]);//[經號,起始行的vline]
	}
	return out;
}

var rvp2Vline=function(){
	var out=[];
	var pageRange=rvp2rvp();
	for(var i=0;i<pageRange.length; i++){
		var s=parseVolPage(pageRange[i][1]);
		out.push(s);
	}
	return out;
}

var parseVolPage=function(str){
	var s=str.match(/(\d+)[@.](\d+)([abcd]*)(\d*)/);
	//var s=str.match(/(\d+)[@.](\d+)([abcd])(\d*)-*(\d*)([abcd]*)(\d*)/);
	if(!s){
		console.log("error!",str);
		return null;
	}
	return {vol:parseInt(s[1]),page:parseInt(s[2]),side:s[3] || "x",line:parseInt(s[4]||"1")};
	//return {vol:parseInt(s[1]),page:parseInt(s[2]),side:s[3],line:parseInt(s[4]||"1"),page2:parseInt(s[5]),side2:s[6],line2:parseInt(s[7]||"1")};
}

var parseVolPageRange=function(str){
	var s=str.match(/(\d+)[@.](\d+)([abcd]*)(\d*)-(\d+)([abcd]*)(\d*)/);
	//var s=str.match(/(\d+)[@.](\d+)([abcd])(\d*)-*(\d*)([abcd]*)(\d*)/);
	if(!s){
		console.log("error!",str);
		return null;
	}
	return {vol:parseInt(s[1]),page:parseInt(s[2]),side:s[3] || "x",line:parseInt(s[4]||"1"),page2:parseInt(s[5]),side2:s[6] || "x",line2:parseInt(s[7]||"1")};	
}

var volpb2vl=function(str){
	var out=[];
	var volpage=parseVolPage(str);
	if(! volpage){console.log(str); return 0;}
	if(volpage["side"]=="a"){var side=1;}
	else if(volpage["side"]=="b"){side=2;}
	else if(volpage["side"]=="c"){side=3;}
	else if(volpage["side"]=="d"){side=4;}
	else {side=0;}
	
	var vline=volpage["vol"]*500*4*10+volpage["page"]*4*10+side*10+volpage["line"];
	
	return vline;
}

var vl2volpb=function(vline){
	var vol=Math.floor(vline/(500*4*10));
	var page_p=vline%(500*4*10);
	var page=Math.floor(page_p/(4*10));
	var side_p=page_p%(4*10);
	var side=Math.floor(side_p/10);
	var line=side_p%10;
	if(side==0){side="a";}
	else if(side==1){side="b";}
	else if(side==2){side="c";}
	else if(side==3){side="d";}
	var volpb=vol+"."+page+side+line;

	return volpb;
}

var searchNameCh=function(KJing,from,to){
	//判斷輸入是J版本還是D版本再依其版本取得K
	//在pedurma_taisho從K值轉換成中文經號
	var result=[];
	for(var i=0;i<pedurma_taisho.length;i++){
		if(KJing==pedurma_taisho[i][0]){
			var taisho=pedurma_taisho[i][1].split(",");  ////對照到中有多個經時

			for(var j=0;j<taisho.length;j++){
				//回去taishonames找到該項，得到中文經名
				var taishoNumName=taisho2taishoName(taisho[j]);//[T01n0001,經名]
				//將中文經名加上超連結
				result.push(addLink(taishoNumName[0],taishoNumName[1]));
			}
			document.getElementById("nameCh").innerHTML=result.join("、");
			break;
		}
	}
}



var taisho2taishoName=function(taisho){ //把pedurma_taisho裡的taisho號碼轉換為經名
	for(var i=0;i<taishonames.length;i++){
		var taishoNum=parseInt(taishonames[i][0].substr(4,4));//taishonames[i][0].length-4
		if(parseInt(taisho) == taishoNum){
			return taishonames[i];//[T01n0001,經名]
		}
	}
}

var addLink=function(link,name){
	if(link.match(/T0.n0220/)){
		link=link.substr(0,link.length-1);
	}
	return '<a target=_new href="http://tripitaka.cbeta.org/'+link+'">'+name+"</a>";
}

var showImage=function(corresline,to){//corresline:對照行(分開成物件的對照行)
	//去掉行數 把vol page side 湊成檔名
	var filename=id2imageFileName(corresline);//[函號(用來進入該函資料夾),檔名]
	//var Line="volpage:"+corresline.vol+", page:"+corresline.page+", side:"+corresline.side+", line:"+corresline.line;
	//return '<a target=_new href="http://dharma-treasure.org/kangyur_images/'+longnames[to.rcode].toLowerCase()+'/'+filename[0]+'/'+filename[1]+'">'+Line+"</a>";
	return '<img src="http://dharma-treasure.org/kangyur_images/'+longnames[to.rcode].toLowerCase()+'/'+filename[0]+'/'+filename[1]+'"></a>';
}

var id2imageFileName=function(id){
	//var id=parseVolPage(corresline);
	var realpage=snap2realpage(id);
	var p="00"+realpage.vol;
	var nameVol=p.substr(p.length-3);
	var q="00"+realpage.page;
	var namePageSide=q.substr(q.length-3)+realpage.side;
	var filename=[nameVol,nameVol+"-"+namePageSide+".jpg"];

	return filename;
}

var snap2realpage=function(id){
	if(id.side == "c"){
		id.side=id.side.replace("c","b");
	}
	else if(id.side == "d"){
		id.page=id.page+1;
		id.side="a";
	}

	return id;
}




var corres_api={dosearch:dosearch}
module.exports=corres_api;
});
require.register("ksanaforge-stacktoc/index.js", function(exports, require, module){
/** @jsx React.DOM */
  
var trimHit=function(hit) {
  if (hit>999) { 
    return (Math.floor(hit/1000)).toString()+"K+";
  } else return hit.toString();
}
var Ancestors=React.createClass({displayName: 'Ancestors',
  goback:function(e) {
    var n=e.target.dataset["n"];  
    if (typeof n=="undefined") n=e.target.parentNode.dataset["n"];
    this.props.setCurrent(n); 
  },
  showExcerpt:function(e) {
    var n=parseInt(e.target.parentNode.dataset["n"]);
    e.stopPropagation();
    e.preventDefault();
    this.props.showExcerpt(n);
  }, 
  showHit:function(hit) {
    if (hit)  return React.createElement("a", {href: "#", onClick: this.showExcerpt, className: "pull-right badge hitbadge"}, trimHit(hit))
    else return React.createElement("span", null);
  },
  renderAncestor:function(n,idx) {
    var hit=this.props.toc[n].hit;
    var text=this.props.toc[n].text.trim();
    if (this.props.textConverter) text=this.props.textConverter(text);
    return React.createElement("div", {key: "a"+n, className: "node parent", 'data-n': n}, idx+1, ".", React.createElement("a", {className: "text", href: "#", onClick: this.goback}, text), this.showHit(hit))
  },
  render:function() {
    if (!this.props.data || !this.props.data.length) return React.createElement("div", null);
    return React.createElement("div", null, this.props.data.map(this.renderAncestor))
  } 
}); 
var Children=React.createClass({displayName: 'Children',
  getInitialState:function() {
    return {selected:0};
  },
  shouldComponentUpdate:function(nextProps,nextState) {
    if (nextProps.data.join()!=this.props.data.join() ) {
      nextState.selected=parseInt(nextProps.data[0]);
    }
    return true;
  },
  open:function(e) {
    var n=e.target.parentNode.dataset["n"];
    if (typeof n!=="undefined") this.props.setCurrent(parseInt(n));
  }, 
  showHit:function(hit) {
    if (hit)  return React.createElement("a", {href: "#", onClick: this.showExcerpt, className: "pull-right badge hitbadge"}, trimHit(hit))
    else return React.createElement("span", null);
  },
  showExcerpt:function(e) {
    var n=parseInt(e.target.parentNode.dataset["n"]);
    e.stopPropagation();
    e.preventDefault();
    this.props.hitClick(n);
  }, 
  nodeClicked:function(e) {
    var target=e.target;
    while (target && typeof target.dataset.n=="undefined")target=target.parentNode;
    if (!target) return;
    var n=parseInt(target.dataset.n);
    var child=this.props.toc[n];
    if (this.props.showTextOnLeafNodeOnly) {
      if (child.hasChild) {
        this.open(e);
      } else {
        this.showText(e);
      }
    } else {
      if (n!=this.state.selected) {
        this.showText(e);
      } else {
        this.open(e);
      }
    }
    this.setState({selected:n});
  },
  renderChild:function(n) {
    var child=this.props.toc[n];
    var hit=this.props.toc[n].hit;
    var classes="node child",haschild=false;  
    //if (child.extra) extra="<extra>"+child.extra+"</extra>";
    if (!child.hasChild) classes+=" nochild";
    else haschild=true;
    var selected=this.state.selected;
    if (this.props.showTextOnLeafNodeOnly) {
      selected=n;
    }

    var classes="btn btn-link";
    if (n==selected && haschild) classes="btn btn-default";
    var text=this.props.toc[n].text.trim();
    if (this.props.textConverter) text=this.props.textConverter(text);
    return React.createElement("div", {'data-n': n}, React.createElement("a", {'data-n': n, className: classes +" tocitem text", onClick: this.nodeClicked}, text), this.showHit(hit))
  },
  showText:function(e) { 
    var target=e.target;
    var n=e.target.dataset.n;
    while (target && typeof target.dataset.n=="undefined") {
      target=target.parentNode;
    }
    if (target && target.dataset.n && this.props.showText) {
      this.props.showText(parseInt(target.dataset.n));
    }
  },
  render:function() {
    if (!this.props.data || !this.props.data.length) return React.createElement("div", null);
    return React.createElement("div", null, this.props.data.map(this.renderChild))
  }
}); 
var stacktoc = React.createClass({displayName: 'stacktoc',
  getInitialState: function() {
    return {bar: "world",tocReady:false,cur:0};//403
  },
  buildtoc: function() {
      var toc=this.props.data;
      if (!toc || !toc.length) return;      var depths=[];
      var prev=0;
      for (var i=0;i<toc.length;i++) {
        var depth=toc[i].depth;
        if (prev>depth) { //link to prev sibling
          if (depths[depth]) toc[depths[depth]].next = i;
          for (var j=depth;j<prev;j++) depths[j]=0;
        }
        if (i<toc.length-1 && toc[i+1].depth>depth) {
          toc[i].hasChild=true;
        }
        depths[depth]=i;
        prev=depth;
      } 
  }, 
  enumAncestors:function() {
    var toc=this.props.data;
    if (!toc || !toc.length) return;
    var cur=this.state.cur;
    if (cur==0) return [];
    var n=cur-1;
    var depth=toc[cur].depth - 1;
    var parents=[];
    while (n>=0 && depth>0) {
      if (toc[n].depth==depth) {
        parents.unshift(n);
        depth--;
      }
      n--;
    }
    parents.unshift(0); //first ancestor is root node
    return parents;
  },
  enumChildren : function() {
    var cur=this.state.cur;
    var toc=this.props.data;
    var children=[];
    if (!toc || !toc.length) return children;
    if (toc[cur+1].depth!= 1+toc[cur].depth) return children;  // no children node
    var n=cur+1;
    var child=toc[n];
    while (child) {
      children.push(n);
      var next=toc[n+1];
      if (!next) break;
      if (next.depth==child.depth) {
        n++;
      } else if (next.depth>child.depth) {
        n=child.next;
      } else break;
      if (n) child=toc[n];else break;
    }

    return children;
  },
  rebuildToc:function() {
    if (!this.state.tocReady && this.props.data) {
      this.buildtoc();
      this.setState({tocReady:true});
    }
  },
  componentDidMount:function() {
    this.rebuildToc();
  },
  componentDidUpdate:function() {
    this.rebuildToc();
  },   
  setCurrent:function(n) {
    n=parseInt(n);
    this.setState({cur:n});
    var child=this.props.data[n];
    if (!(child.hasChild && this.props.showTextOnLeafNodeOnly)) {
      this.props.showText(n);
    }
  },
  findByVoff:function(voff) {
    for (var i=0;i<this.props.data.length;i++) {
      var t=this.props.data[i];
      if (t.voff>voff) return i-1;
    }
    return 0; //return root node
  },
  shouldComponentUpdate:function(nextProps,nextState) {
    if (nextProps.goVoff&&nextProps.goVoff !=this.props.goVoff) {
      nextState.cur=this.findByVoff(nextProps.goVoff);
    }
    return true;
  },
  fillHit:function(nodeIds) {
    if (typeof nodeIds=="undefined") return;
    if (typeof nodeIds=="number") nodeIds=[nodeIds];
    var toc=this.props.data;
    var hits=this.props.hits;
    var getRange=function(n) {
      if (n+1>=toc.length) {
        console.error("exceed toc length",n);
        return;
      }
      var depth=toc[n].depth , nextdepth=toc[n+1].depth;
      if (n==toc.length-1 || n==0) {
          toc[n].end=Math.pow(2, 48);
          return;
      } else  if (nextdepth>depth){
        if (toc[n].next) {
          toc[n].end= toc[toc[n].next].voff;  
        } else { //last sibling
          var next=n+1;
          while (next<toc.length && toc[next].depth>depth) next++;
          if (next==toc.length) toc[n].end=Math.pow(2,48);
          else toc[n].end=toc[next].voff;
        }
      } else { //same level or end of sibling
        toc[n].end=toc[n+1].voff;
      }
    }
    var getHit=function(n) {
      var start=toc[n].voff;
      var end=toc[n].end;
      if (n==0) {
        toc[0].hit=hits.length;
      } else {
        var hit=0;
        for (var i=0;i<hits.length;i++) {
          if (hits[i]>=start && hits[i]<end) hit++;
        }
        toc[n].hit=hit;
      }
    }
    nodeIds.forEach(function(n){getRange(n)});
    nodeIds.forEach(function(n){getHit(n)});
  },
  fillHits:function(ancestors,children) {
      this.fillHit(ancestors);
      this.fillHit(children);
      this.fillHit(this.state.cur);
  },
  hitClick:function(n) {
    if (this.props.showExcerpt)  this.props.showExcerpt(n);
  },
  onHitClick:function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.hitClick(this.state.cur);
  },
  showHit:function(hit) {
    if (hit)  return React.createElement("a", {href: "#", onClick: this.onHitClick, className: "pull-right badge hitbadge"}, trimHit(hit))
    else return React.createElement("span", null);
  },
  showText:function(e) {
    var target=e.target;
    var n=e.target.dataset.n;
    while (target && typeof target.dataset.n=="undefined") {
      target=target.parentNode;
    }
    if (target && target.dataset.n && this.props.showText) {
      this.props.showText(parseInt(target.dataset.n));
    }
  },

  render: function() {
    if (!this.props.data || !this.props.data.length) return React.createElement("div", null)
    var depth=this.props.data[this.state.cur].depth+1;
    var ancestors=this.enumAncestors();
    var children=this.enumChildren();
    var current=this.props.data[this.state.cur];
    if (this.props.hits && this.props.hits.length) this.fillHits(ancestors,children);

    var text=current.text.trim();
    if (this.props.textConverter) text=this.props.textConverter(text);

    return ( 
      React.createElement("div", {className: "stacktoc"}, 
        React.createElement(Ancestors, {textConverter: this.props.textConverter, showExcerpt: this.hitClick, setCurrent: this.setCurrent, toc: this.props.data, data: ancestors}), 
        React.createElement("div", {className: "node current"}, React.createElement("a", {href: "#", onClick: this.showText, 'data-n': this.state.cur}, React.createElement("span", null, depth, "."), React.createElement("span", {className: "text"}, text)), this.showHit(current.hit)), 
        React.createElement(Children, {textConverter: this.props.textConverter, showTextOnLeafNodeOnly: this.props.showTextOnLeafNodeOnly, 
                  showText: this.props.showText, hitClick: this.hitClick, setCurrent: this.setCurrent, toc: this.props.data, data: children})
      )
    ); 
  }
});
module.exports=stacktoc;
});
require.register("adarsha-showtext/index.js", function(exports, require, module){
/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var api=Require("api");
var dataset=Require("dataset");
var tibetan=Require("ksana-document").languages.tibetan; 
var mappings={"J":dataset.jPedurma,"D":dataset.dPedurma};
var Controlsfile = React.createClass({displayName: 'Controlsfile',
  getInitialState: function() {
    return {address:0};
  },
  filepage2vpos:function(file,page) {
    var out=[];
    if(!this.props.db) return 0;
    var offsets=this.props.db.getFilePageOffsets(file);
    var voff=offsets[page];
    var n=this.findByVoff(voff);//toc裡的第幾項
    var parents=this.enumAncestors(n) || 1;
    for(var i=0; i<parents.length; i++){
      out.push(this.props.toc[parents[i]].text);
    }
    return out.join("  >  ");
  },
  findByVoff: function(voff) {
    if(!this.props.toc) return 0;
    for (var i=0;i<this.props.toc.length;i++) {
      var t=this.props.toc[i];
      if (t.voff>=voff) return i;
    }
    return 0; //return root node
  },

  enumAncestors: function(cur) {
    var toc=this.props.toc;
    if (!toc || !toc.length) return;
    //var cur=this.state.cur;
    if (cur==0) return [];
    var n=cur-1;
    var depth=toc[cur].depth - 1;
    var parents=[];
    while (n>=0 && depth>0) {
      if (toc[n].depth==depth) {
        parents.unshift(n);
        depth--;
      }
      n--;
    }
    parents.unshift(0); //first ancestor is root node
    return parents;
  },
  getAddress: function() {
    var file=this.props.bodytext.file;
    var page=this.props.page;
    var res=this.filepage2vpos(file,page);
   // this.setState({address:res});
   if(this.props.wylie == false) return res;
   if(this.props.wylie == true) return tibetan.romanize.toWylie(res,null,false);
    
  },

  render: function() {   
   return React.createElement("div", {className: "cursor"}, 
           
            React.createElement("button", {className: "btn btn-default", onClick: this.props.prev}, React.createElement("img", {width: "20", src: "./banner/prev.png"})), 
            React.createElement("button", {className: "btn btn-default", onClick: this.props.next}, React.createElement("img", {width: "20", src: "./banner/next.png"})), 
            
            React.createElement("button", {className: "btn btn-default transfer", onClick: this.props.setwylie}, React.createElement("img", {width: "20", src: "./banner/icon-towylie.png"})), 

            React.createElement("br", null), React.createElement("span", {id: "address"}, this.getAddress())

          )
  }  
});

var showtext = React.createClass({displayName: 'showtext',
  getInitialState: function() {
    return {bar: "world", pageImg:""};
  },
  componentDidUpdate:function()  {
    if(this.props.scrollto && this.props.scrollto.match(/[abc]/)){
      var p=this.props.scrollto.match(/\d+.(\d+)[abc]/);
      $(".text-content").scrollTop( 0 );
      if(p[1]!=1){      
        var pb=$("a[data-pb='"+this.props.scrollto+"']");
        if(pb.length) $(".text-content").scrollTop( pb.position().top-20 );
      }          
    }  

  },
  hitClick: function(n){
    if(this.props.showExcerpt) this.props.showExcerpt(n);
  },
  renderPageImg: function(e) {
    var pb=e.target.dataset.pb;
    if (pb || e.target.nodeName == "IMG") {
      this.setState({clickedpb:pb});  
      this.setState({scrollto:null});
    }
    var img=e.target.dataset.img;
    if (img) {
      this.setState({clickedpb:null});  
       
    }
    
  },

  getImgName: function(volpage) {
    var p=volpage.split(".");
    var v="000"+p[0];
    var vol=v.substr(v.length-3,v.length);
    var pa="000"+p[1].substr(0,p[1].length-1);
    var page=pa.substr(pa.length-3,pa.length);
    var side=p[1].substr(p[1].length-1);

    return vol+"/"+vol+"-"+page+side;
  },

  getCorresPage: function(fromPage) {
    var corresPage=api.corres_api.dosearch(fromPage,mappings["J"],mappings["D"]);
    return corresPage;
  },

  renderpb: function(s){
    var that=this;
    if(typeof s == "undefined") return "";
    s= s.replace(/<pb n="(.*?)"><\/pb>/g,function(m,m1){
      var p=m1.match(/\d+.(\d+[ab])/) || ["",""];
      if(p[1] != "1a") var link='<br></br><a href="#" data-pb="'+m1+'">'+m1+'<img width="25" data-pb="'+m1+'" src="banner/imageicon.png"/></a>';
      else var link='<a href="#" data-pb="'+m1+'">'+m1+'<img width="25" data-pb="'+m1+'" src="banner/imageicon.png"/></a>';
      if(m1 == that.state.clickedpb){
        var imgName=that.getImgName(m1);
        var corresPage=that.getCorresPage(m1);
        link='<br></br>'+m1+'&nbsp;(Derge:'+corresPage+')<img data-img="'+m1+'" width="100%" src="../adarsha_img/lijiang/'+imgName+'.jpg"/><br></br>';
      }
      return link;
    });
    
    return s;
  },
  render: function() {
    if(this.props.wylie == false) {
      var c=this.renderpb(this.props.text);
      var content = c.replace(/[^།]\n/,"");
    }
    if(this.props.wylie == true && this.props.text) var content=this.renderpb(tibetan.romanize.toWylie(this.props.text,null,false));
    return (
      React.createElement("div", {className: "cursor"}, 
        React.createElement(Controlsfile, {setwylie: this.props.setwylie, wylie: this.props.wylie, page: this.props.page, bodytext: this.props.bodytext, next: this.props.nextfile, prev: this.props.prevfile, setpage: this.props.setpage, db: this.props.db, toc: this.props.toc}), 
        React.createElement("br", null), 
        React.createElement("div", {onClick: this.renderPageImg, className: "pagetext", dangerouslySetInnerHTML: {__html: content}})
      )
    );
  }
});
module.exports=showtext;
});
require.register("adarsha-renderitem/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var renderItem = React.createClass({displayName: 'renderItem',
  getInitialState: function() {
    return {bar: "world"};
  },
  onItemClick:function(e) {
    var voff=parseInt(e.target.dataset.voff);
    React.createElement("span", null, e.target.innerHTML)
    this.props.gotopage(voff);
  },
  renderItem: function(item) {
    var tofind=this.props.tofind_toc;
    var c=""
    c=item.text.replace(tofind,function(t){
      return '<hl>'+t+"</hl>";
    });
    return (
      React.createElement("div", null, 
        React.createElement("li", null, React.createElement("a", {herf: "#", className: "item", 'data-voff': item.voff, onClick: this.onItemClick, dangerouslySetInnerHTML: {__html:c}}))
      ) 
      )
  },
  render: function() {
    return (
      React.createElement("div", null, 
        this.props.data.map(this.renderItem)
      )
    );
  }
});

module.exports=renderItem;
});
require.register("adarsha-renderinputs/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var renderinputs = React.createClass({displayName: 'renderinputs',
  getInitialState: function() {
    return {bar: "world"};
  },
  clear:function() {
    var tofind=this.refs.tofind.getDOMNode();
    tofind.value="";
    tofind.focus();
  },  
  updateValue:function(e){
    var newpagename=this.refs.pagename.getDOMNode().value;
    var n=newpagename.substr(newpagename.length-1);
    if(!n.match(/[ab]/)){
      newpagename = newpagename+"a";
    }
    this.props.setpage(newpagename);
  },    
  render: function() {
    if (this.props.db) {
      if(this.props.searcharea == "text"){
        return (    
          React.createElement("div", null, React.createElement("input", {className: "form-control", onInput: this.props.dosearch, ref: "tofind", defaultValue: "byang chub m"}), 
          React.createElement("button", {onClick: this.clear, title: "clear input box", className: "btn btn-danger"}, "xl"), React.createElement("span", {className: "wylie"}, this.state.wylie)
          )
          )    
      }
      if(this.props.searcharea == "title"){
        return (    
          React.createElement("div", null, React.createElement("input", {className: "form-control", onInput: this.props.dosearch_toc, ref: "tofind_toc", defaultValue: "byang chub"}), 
          React.createElement("span", {className: "wylie"}, this.state.wylie_toc)
          )
          ) 
      }
    } else {
      return React.createElement("span", null, "loading database....")
    }
  }
});
module.exports=renderinputs;
});
require.register("adarsha-page2catalog/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var page2catalog = React.createClass({displayName: 'page2catalog',
  getInitialState: function() {
    return {bar: "world"};
  },
  render: function() {
    return (
      React.createElement("div", null, 
        "Hello,", this.state.bar
      )
    );
  }
});
module.exports=page2catalog;
});
require.register("adarsha-namelist/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var tibetan=Require("ksana-document").languages.tibetan; 
var namelist = React.createClass({displayName: 'namelist',
  getInitialState: function() {
    return {};
  },
  onItemClick:function(e) {
    if (e.target.nodeName == "HL") var voff=parseInt(e.target.parentElement.dataset.voff);
    else voff=parseInt(e.target.dataset.voff);
    React.createElement("span", null, e.target.innerHTML)
    this.props.gotofile(voff);
  },
  renderNameItem: function(item) {
    var context="";
    if(this.props.wylie == false){
      var tofind=this.props.tofind;
      context=item.text.replace(tofind,function(t){return '<hl>'+t+"</hl>";});
    }
    if(this.props.wylie == true){
      var tofind=tibetan.romanize.toWylie(this.props.tofind,null,false);
      context=tibetan.romanize.toWylie(item.text,null,false).replace(tofind,function(t){return '<hl>'+t+"</hl>";});
    }
      
    return (
      React.createElement("div", null, 
        React.createElement("li", null, React.createElement("a", {herf: "#", className: "item", 'data-voff': item.voff, onClick: this.onItemClick, dangerouslySetInnerHTML: {__html:context}}))
      ) 
      )
  },
  render: function() {
    
    return (
      React.createElement("div", null, 
        this.props.res_toc.map(this.renderNameItem)
      )
    );
  }
});
module.exports=namelist;
});
require.register("adarsha-searchbar/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var searchbar = React.createClass({displayName: 'searchbar',
  getInitialState: function() {
    return {find:[],field:[]};
  },
  gettofind: function() {
    var find=this.refs.tofind.getDOMNode().value;
    this.setState({find:find});
  },
  getfield: function(e) {
    var field=e.target.dataset.type;
    this.setState({field:field});   
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("input", {className: "form-control", onInput: this.gettofind, ref: "tofind", defaultValue: "byang chub"}), 
        React.createElement("div", {className: "btn-group", 'data-toggle': "buttons", ref: "searchtype", onClick: this.getfield}, 
          React.createElement("label", {'data-type': "sutra", className: "btn btn-success"}, 
          React.createElement("input", {type: "radio", name: "field", autocomplete: "off"}, "Sutra")
          ), 
          React.createElement("label", {'data-type': "kacha", className: "btn btn-success"}, 
          React.createElement("input", {type: "radio", name: "field", autocomplete: "off"}, "Kacha")
          ), 
          React.createElement("label", {'data-type': "fulltext", className: "btn btn-success"}, 
          React.createElement("input", {type: "radio", name: "field", autocomplete: "off"}, "Text")
          )
        ), 
        this.props.dosearch(null,null,0,this.state.field,this.state.tofind)
      )
    );
  }
});
module.exports=searchbar;
});
require.register("adarsha-dataset/index.js", function(exports, require, module){
//var othercomponent=Require("other"); 
//new module filename must be added to scripts section of ./component.js and export here
var dataset = {
 jPedurma: require("./jPedurma"),
 dPedurma: require("./dPedurma")
}

module.exports=dataset;
});
require.register("adarsha-dataset/jPedurma.js", function(exports, require, module){
var jPedurma=[ [ '1_1', '001@001b1-001@017b8', '1_1' ],
  [ '1_2', '001@017b8-001@027b4', '1_2' ],
  [ '1_3', '001@027b4-001@037b3', '1_3' ],
  [ '1_4', '001@037b3-001@047a2', '1_4' ],
  [ '1_5', '001@047a2-001@067a8', '1_5' ],
  [ '1_6', '001@067a8-001@079a1', '1_6' ],
  [ '1_7', '001@079a1-001@090b6', '1_7' ],
  [ '1_8', '001@090b6-001@102b5', '1_8' ],
  [ '1_9', '001@102b5-001@115a2', '1_9' ],
  [ '1_10', '001@115a2-001@128a3', '1_10' ],
  [ '1_11', '001@128a3-001@140b6', '1_11' ],
  [ '1_12', '001@140b6-001@155b2', '1_12' ],
  [ '1_13', '001@155b2-001@168a2', '1_13' ],
  [ '1_14', '001@168a2-001@181b8', '1_14' ],
  [ '1_15', '001@181b8-001@197a7', '1_15' ],
  [ '1_16', '001@197a7-001@212a5', '1_16' ],
  [ '1_17', '001@212a5-001@224b1', '1_17' ],
  [ '1_18', '001@224b1-001@238a8', '1_18' ],
  [ '1_19', '001@238a8-001@251a8', '1_19' ],
  [ '1_20', '001@251a8-001@264a5', '1_20' ],
  [ '1_21', '001@264a5-001@278a1', '1_21' ],
  [ '1_22', '001@278a1-001@290a1', '1_22' ],
  [ '1_23', '001@290a1-001@302b2', '1_23' ],
  [ '1_24', '001@302b2-002@001b1', '1_24' ],
  [ '1_25', '002@001b1-002@013b5', '1_25' ],
  [ '1_26', '002@013b5-002@026a8', '1_26' ],
  [ '1_27', '002@026a8-002@039a1', '1_27' ],
  [ '1_28', '002@039a1-002@049a6', '1_28' ],
  [ '1_29', '002@049a6-002@059b4', '1_29' ],
  [ '1_30', '002@059b4-002@069b5', '1_30' ],
  [ '1_31', '002@069b5-002@078b6', '1_31' ],
  [ '1_32', '002@078b6-002@088b3', '1_32' ],
  [ '1_33', '002@088b3-002@099a8', '1_33' ],
  [ '1_34', '002@099a8-002@109b2', '1_34' ],
  [ '1_35', '002@109b2-002@119b5', '1_35' ],
  [ '1_36', '002@119b5-002@130b6', '1_36' ],
  [ '1_37', '002@130b6-002@141b1', '1_37' ],
  [ '1_38', '002@141b1-002@153a1', '1_38' ],
  [ '1_39', '002@153a1-002@163a7', '1_39' ],
  [ '1_40', '002@163a7-002@172b6', '1_40' ],
  [ '1_41', '002@172b6-002@182a7', '1_41' ],
  [ '1_42', '002@182a7-002@192a8', '1_42' ],
  [ '1_43', '002@192a8-002@201a1', '1_43' ],
  [ '1_44', '002@201a1-002@210b3', '1_44' ],
  [ '1_45', '002@210b3-002@221a3', '1_45' ],
  [ '1_46', '002@221a3-002@231b4', '1_46' ],
  [ '1_47', '002@231b4-002@242b1', '1_47' ],
  [ '1_48', '002@242b1-002@252b5', '1_48' ],
  [ '1_49', '002@252b5-002@264b7', '1_49' ],
  [ '1_50', '002@264b7-002@276b2', '1_50' ],
  [ '1_51', '002@276b2-002@286b4', '1_51' ],
  [ '1_52', '002@286b4-002@299a1', '1_52' ],
  [ '1_53', '002@299a1-002@309b6', '1_53' ],
  [ '1_54', '002@309b6-003@001b1', '1_54' ],
  [ '1_55', '003@001b1-003@011a3', '1_55' ],
  [ '1_56', '003@011a3-003@021a2', '1_56' ],
  [ '1_57', '003@021a2-003@031b5', '1_57' ],
  [ '1_58', '003@031b5-003@041a6', '1_58' ],
  [ '1_59', '003@041a6-003@051a7', '1_59' ],
  [ '1_60', '003@051a7-003@062a4', '1_60' ],
  [ '1_61', '003@062a4-003@072b3', '1_61' ],
  [ '1_62', '003@072b3-003@084a8', '1_62' ],
  [ '1_63', '003@084a8-003@095b2', '1_63' ],
  [ '1_64', '003@095b2-003@103b3', '1_64' ],
  [ '1_65', '003@103b3-003@112b4', '1_65' ],
  [ '1_66', '003@112b4-003@121b5', '1_66' ],
  [ '1_67', '003@121b5-003@131a1', '1_67' ],
  [ '1_68', '003@131a1-003@143a4', '1_68' ],
  [ '1_69', '003@143a4-003@154b2', '1_69' ],
  [ '1_70', '003@154b2-003@167b7', '1_70' ],
  [ '1_71', '003@167b7-003@183b1', '1_71' ],
  [ '1_72', '003@183b1-003@195a2', '1_72' ],
  [ '1_73', '003@195a2-003@205b3', '1_73' ],
  [ '1_74', '003@205b3-003@216a4', '1_74' ],
  [ '1_75', '003@216a4-003@228a2', '1_75' ],
  [ '1_76', '003@228a2-003@239a2', '1_76' ],
  [ '1_77', '003@239a2-003@251b3', '1_77' ],
  [ '1_78', '003@251b3-003@264b1', '1_78' ],
  [ '1_79', '003@264b1-003@277b3', '1_79' ],
  [ '1_80', '003@277b3-003@291a2', '1_80' ],
  [ '1_81', '003@291a2-003@302b4', '1_81' ],
  [ '1_82', '003@302b4-004@001b1', '1_82' ],
  [ '1_83', '004@001b1-004@015a5', '1_83' ],
  [ '1_84', '004@015a5-004@027b2', '1_84' ],
  [ '1_85', '004@027b2-004@039a2', '1_85' ],
  [ '1_86', '004@039a2-004@050a3', '1_86' ],
  [ '1_87', '004@050a3-004@063a1', '1_87' ],
  [ '1_88', '004@063a1-004@075b7', '1_88' ],
  [ '1_89', '004@075b7-004@089a3', '1_89' ],
  [ '1_90', '004@089a3-004@101a7', '1_90' ],
  [ '1_91', '004@101a7-004@112b3', '1_91' ],
  [ '1_92', '004@112b3-004@125a7', '1_92' ],
  [ '1_93', '004@125a7-004@137a2', '1_93' ],
  [ '1_94', '004@137a2-004@148a8', '1_94' ],
  [ '1_95', '004@148a8-004@159b1', '1_95' ],
  [ '1_96', '004@159b1-004@170b8', '1_96' ],
  [ '1_97', '004@170b8-004@182a2', '1_97' ],
  [ '1_98', '004@182a2-004@192a1', '1_98' ],
  [ '1_99', '004@192a1-004@203a4', '1_99' ],
  [ '1_100', '004@203a4-004@214b2', '1_100' ],
  [ '1_101', '004@214b2-004@225a2', '1_101' ],
  [ '1_102', '004@225a2-004@234b4', '1_102' ],
  [ '1_103', '004@234b4-004@245b1', '1_103' ],
  [ '1_104', '004@245b1-004@255b2', '1_104' ],
  [ '1_105', '004@255b2-004@265b7', '1_105' ],
  [ '1_106', '004@265b7-004@276b6', '1_106' ],
  [ '1_107', '004@276b6-004@287b7', '1_107' ],
  [ '1_108', '004@287b7-004@297b2', '1_108' ],
  [ '1_109', '004@297b2-004@306a6', '1_109' ],
  [ '2_1', '005@001b1-005@011b6', '2_1' ],
  [ '2_2', '005@011b6-005@021b4', '2_2' ],
  [ '3_1', '005@021b4-005@036a4', '3_1' ],
  [ '3_2', '005@036a4-005@049a6', '3_2' ],
  [ '3_3', '005@049a6-005@063a3', '3_3' ],
  [ '3_4', '005@063a3-005@077b1', '3_4' ],
  [ '3_5', '005@077b1-005@090b3', '3_5' ],
  [ '3_6', '005@090b3-005@103b4', '3_6' ],
  [ '3_7', '005@103b4-005@115a6', '3_7' ],
  [ '3_8', '005@115a6-005@127b5', '3_8' ],
  [ '3_9', '005@127b5-005@140b4', '3_9' ],
  [ '3_10', '005@140b4-005@154b5', '3_10' ],
  [ '3_11', '005@154b5-005@165b7', '3_11' ],
  [ '3_12', '005@165b7-005@178b4', '3_12' ],
  [ '3_13', '005@178b4-005@191a2', '3_13' ],
  [ '3_14', '005@191a2-005@203b3', '3_14' ],
  [ '3_15', '005@203b3-005@217a4', '3_15' ],
  [ '3_16', '005@217a4-005@230a1', '3_16' ],
  [ '3_17', '005@230a1-005@242b7', '3_17' ],
  [ '3_18', '005@242b7-005@256b7', '3_18' ],
  [ '3_19', '005@256b7-005@272a1', '3_19' ],
  [ '3_20', '005@272a1-005@285b5', '3_20' ],
  [ '3_21', '005@285b5-006@001b1', '3_21' ],
  [ '3_22', '006@001b1-006@016a2', '3_22' ],
  [ '3_23', '006@016a2-006@028a5', '3_23' ],
  [ '3_24', '006@028a5-006@041a7', '3_24' ],
  [ '3_25', '006@041a7-006@054a6', '3_25' ],
  [ '3_26', '006@054a6-006@066a7', '3_26' ],
  [ '3_27', '006@066a7-006@079b8', '3_27' ],
  [ '3_28', '006@079b8-006@093a1', '3_28' ],
  [ '3_29', '006@093a1-006@105b2', '3_29' ],
  [ '3_30', '006@105b2-006@119b1', '3_30' ],
  [ '3_31', '006@119b1-006@134b6', '3_31' ],
  [ '3_32', '006@134b6-006@148b8', '3_32' ],
  [ '3_33', '006@148b8-006@163a3', '3_33' ],
  [ '3_34', '006@163a3-006@177b8', '3_34' ],
  [ '3_35', '006@177b8-006@194a5', '3_35' ],
  [ '3_36', '006@194a5-006@208b2', '3_36' ],
  [ '3_37', '006@208b2-006@221b1', '3_37' ],
  [ '3_38', '006@221b1-006@235a8', '3_38' ],
  [ '3_39', '006@235a8-006@246b6', '3_39' ],
  [ '3_40', '006@246b6-006@258b6', '3_40' ],
  [ '3_41', '006@258b6-006@271a8', '3_41' ],
  [ '3_42', '006@271a8-007@001b1', '3_42' ],
  [ '3_43', '007@001b1-007@016a1', '3_43' ],
  [ '3_44', '007@016a1-007@031b5', '3_44' ],
  [ '3_45', '007@031b5-007@046b8', '3_45' ],
  [ '3_46', '007@046b8-007@063b3', '3_46' ],
  [ '3_47', '007@063b3-007@079a8', '3_47' ],
  [ '3_48', '007@079a8-007@093a5', '3_48' ],
  [ '3_49', '007@093a5-007@108a8', '3_49' ],
  [ '3_50', '007@108a8-007@122b2', '3_50' ],
  [ '3_51', '007@122b2-007@135b8', '3_51' ],
  [ '3_52', '007@135b8-007@148b4', '3_52' ],
  [ '3_53', '007@148b4-007@162a7', '3_53' ],
  [ '3_54', '007@162a7-007@174b7', '3_54' ],
  [ '3_55', '007@174b7-007@190a3', '3_55' ],
  [ '3_56', '007@190a3-007@205a4', '3_56' ],
  [ '3_57', '007@205a4-007@220a1', '3_57' ],
  [ '3_58', '007@220a1-007@233b8', '3_58' ],
  [ '3_59', '007@233b8-007@250a1', '3_59' ],
  [ '3_60', '007@250a1-007@265b5', '3_60' ],
  [ '3_61', '007@265b5-007@280b6', '3_61' ],
  [ '3_62', '007@280b6-008@001b1', '3_62' ],
  [ '3_63', '008@001b1-008@015b1', '3_63' ],
  [ '3_64', '008@015b1-008@027a2', '3_64' ],
  [ '3_65', '008@027a2-008@041a5', '3_65' ],
  [ '3_66', '008@041a5-008@057a3', '3_66' ],
  [ '3_67', '008@057a3-008@072b4', '3_67' ],
  [ '3_68', '008@072b4-008@087b8', '3_68' ],
  [ '3_69', '008@087b8-008@099b7', '3_69' ],
  [ '3_70', '008@099b7-008@111b4', '3_70' ],
  [ '3_71', '008@111b4-008@123b3', '3_71' ],
  [ '3_72', '008@123b3-008@136a1', '3_72' ],
  [ '3_73', '008@136a1-008@148a4', '3_73' ],
  [ '3_74', '008@148a4-008@159a2', '3_74' ],
  [ '3_75', '008@159a2-008@169a7', '3_75' ],
  [ '3_76', '008@169a7-008@179a7', '3_76' ],
  [ '3_77', '008@179a7-008@189b8', '3_77' ],
  [ '3_78', '008@189b8-008@199a6', '3_78' ],
  [ '3_79', '008@199a6-008@210b8', '3_79' ],
  [ '3_80', '008@210b8-008@223a6', '3_80' ],
  [ '3_81', '008@223a6-008@234b3', '3_81' ],
  [ '3_82', '008@234b3-008@248b4', '3_82' ],
  [ '3_83', '008@248b4-008@264a6', '3_83' ],
  [ '4_1', '009@001b1-009@012b4', '4_1' ],
  [ '4_2', '009@012b4-009@024a8', '4_2' ],
  [ '5_1', '009@025b1-009@036a8', '5_1' ],
  [ '5_2', '009@036a8-009@046a6', '5_2' ],
  [ '5_3', '009@046a6-009@057a5', '5_3' ],
  [ '5_4', '009@057a5-009@067b1', '5_4' ],
  [ '5_5', '009@067b1-009@079a7', '5_5' ],
  [ '5_6', '009@079a7-009@091a2', '5_6' ],
  [ '5_7', '009@091a2-009@102a4', '5_7' ],
  [ '5_8', '009@102a4-009@113b2', '5_8' ],
  [ '5_9', '009@113b2-009@124b1', '5_9' ],
  [ '5_10', '009@124b1-009@136b6', '5_10' ],
  [ '5_11', '009@136b6-009@148b6', '5_11' ],
  [ '5_12', '009@148b6-009@159b8', '5_12' ],
  [ '5_13', '009@159b8-009@170b4', '5_13' ],
  [ '5_14', '009@170b4-009@181a5', '5_14' ],
  [ '5_15', '009@181a5-009@192a2', '5_15' ],
  [ '5_16', '009@192a2-009@203b1', '5_16' ],
  [ '5_17', '009@203b1-009@212b8', '5_17' ],
  [ '5_18', '009@212b8-009@222a5', '5_18' ],
  [ '5_19', '009@222a5-009@231a1', '5_19' ],
  [ '5_20', '009@231a1-009@241b2', '5_20' ],
  [ '5_21', '009@241b2-009@250b7', '5_21' ],
  [ '5_22', '009@250b7-009@260b4', '5_22' ],
  [ '5_23', '009@260b4-009@270a8', '5_23' ],
  [ '5_24', '009@270a8-009@280b1', '5_24' ],
  [ '5_25', '009@280b1-009@290b3', '5_25' ],
  [ '5_26', '009@290b3-009@301a3', '5_26' ],
  [ '5_27', '009@301a3-009@311a7', '5_27' ],
  [ '5_28', '009@311a7-009@326a7', '5_28' ],
  [ '6_1', '010@001b2-010@014a5', '6_1' ],
  [ '6_2', '010@014a5-010@028a7', '6_2' ],
  [ '6_3', '010@028a7-010@044b5', '6_3' ],
  [ '6_4', '010@044b5-010@055b8', '6_4' ],
  [ '6_5', '010@055b8-010@068b6', '6_5' ],
  [ '6_6', '010@068b6-010@081a6', '6_6' ],
  [ '6_7', '010@081a6-010@093b8', '6_7' ],
  [ '6_8', '010@093b8-010@106b1', '6_8' ],
  [ '6_9', '010@106b1-010@118a7', '6_9' ],
  [ '6_10', '010@118a7-010@132b3', '6_10' ],
  [ '6_11', '010@132b3-010@145a5', '6_11' ],
  [ '6_12', '010@145a5-010@157b7', '6_12' ],
  [ '6_13', '010@157b7-010@170a3', '6_13' ],
  [ '6_14', '010@170a3-010@181b7', '6_14' ],
  [ '6_15', '010@181b7-010@194a1', '6_15' ],
  [ '6_16', '010@194a1-010@207b1', '6_16' ],
  [ '6_17', '010@207b1-010@220a2', '6_17' ],
  [ '6_18', '010@220a2-010@233a4', '6_18' ],
  [ '6_19', '010@233a4-010@244b8', '6_19' ],
  [ '6_20', '010@244b8-010@258a1', '6_20' ],
  [ '6_21', '010@258a1-010@269a1', '6_21' ],
  [ '6_22', '010@269a1-010@279a8', '6_22' ],
  [ '6_23', '010@279a8-010@291b1', '6_23' ],
  [ '6_24', '010@291b1-010@300a8', '6_24' ],
  [ '6_25', '010@300a8-010@309b3', '6_25' ],
  [ '6_26', '010@309b3-010@319b1', '6_26' ],
  [ '6_27', '010@319b1-011@001b1', '6_27' ],
  [ '6_28', '011@001b1-011@012b6', '6_28' ],
  [ '6_29', '011@012b6-011@022b7', '6_29' ],
  [ '6_30', '011@022b7-011@034b4', '6_30' ],
  [ '6_31', '011@034b4-011@047b3', '6_31' ],
  [ '6_32', '011@047b3-011@057b5', '6_32' ],
  [ '6_33', '011@057b5-011@067b2', '6_33' ],
  [ '6_34', '011@067b2-011@085b7', '6_34' ],
  [ '6_35', '011@085b7-011@098a7', '6_35' ],
  [ '6_36', '011@098a7-011@111a1', '6_36' ],
  [ '6_37', '011@111a1-011@120a6', '6_37' ],
  [ '6_38', '011@120a6-011@132b4', '6_38' ],
  [ '6_39', '011@132b4-011@142b1', '6_39' ],
  [ '6_40', '011@142b1-011@149a7', '6_40' ],
  [ '6_41', '011@149a7-011@157b6', '6_41' ],
  [ '6_42', '011@157b6-011@169b4', '6_42' ],
  [ '6_43', '011@169b4-011@181b8', '6_43' ],
  [ '6_44', '011@181b8-011@191a3', '6_44' ],
  [ '6_45', '011@191a3-011@200a6', '6_45' ],
  [ '6_46', '011@200a6-011@208a3', '6_46' ],
  [ '6_47', '011@208a3-011@217a2', '6_47' ],
  [ '6_48', '011@217a2-011@226a7', '6_48' ],
  [ '6_49', '011@226a7-011@236b8', '6_49' ],
  [ '6_50', '011@236b8-011@246a4', '6_50' ],
  [ '6_51', '011@246a4-011@256a6', '6_51' ],
  [ '6_52', '011@256a6-011@266b3', '6_52' ],
  [ '6_53', '011@266b3-011@274b8', '6_53' ],
  [ '6_54', '011@274b8-011@283b7', '6_54' ],
  [ '6_55', '011@283b7-011@293a5', '6_55' ],
  [ '6_56', '011@293a5-011@302b6', '6_56' ],
  [ '6_57', '011@302b6-011@313a2', '6_57' ],
  [ '6_58', '011@313a2-011@323b7', '6_58' ],
  [ '6_59', '011@323b7-011@332a4', '6_59' ],
  [ '7_1', '012@001b1-012@011b6', '7_1' ],
  [ '7_2', '012@011b6-012@020b7', '7_2' ],
  [ '7_3', '012@020b7-012@028b3', '7_3' ],
  [ '7_4', '012@028b3-012@038b2', '7_4' ],
  [ '7_5', '012@038b2-012@047b3', '7_5' ],
  [ '7_6', '012@047b3-012@055b1', '7_6' ],
  [ '7_7', '012@055b1-012@062b4', '7_7' ],
  [ '7_8', '012@062b4-012@069b5', '7_8' ],
  [ '7_9', '012@069b5-012@077a6', '7_9' ],
  [ '7_10', '012@077a6-012@084a4', '7_10' ],
  [ '7_11', '012@084a4-012@092b1', '7_11' ],
  [ '7_12', '012@092b1-012@093b8', '7_12' ],
  [ '8_1', '012@094a1-013@347a5', '19_1' ],
  [ '8a', '012@094a1-297a7', '8' ],
  [ '8_2', '012@106a5-012@115a6', '19_2' ],
  [ '8_3', '012@115a6-012@128b2', '19_3' ],
  [ '8_4', '012@128b2-012@138b4', '19_4' ],
  [ '8_5', '012@138b4-012@149a2', '19_5' ],
  [ '8_6', '012@149a2-012@159b5', '19_6' ],
  [ '8_7', '012@159b5-012@167b8', '19_7' ],
  [ '8_8', '012@167b8-012@175a6', '19_8' ],
  [ '8_9', '012@175a6-012@182a6', '19_9' ],
  [ '8_10', '012@182a6-012@190b6', '19_10' ],
  [ '8_11', '012@190b6-012@200a3', '19_11' ],
  [ '8_12', '012@200a3-012@209b6', '19_12' ],
  [ '8_13', '012@209b6-012@218b3', '19_13' ],
  [ '8_14', '012@218b3-012@227a8', '19_14' ],
  [ '8_15', '012@227a8-012@236a5', '19_15' ],
  [ '8_16', '012@236a5-012@245b7', '19_16' ],
  [ '8_17', '012@245b7-012@255a1', '19_17' ],
  [ '8_18', '012@255a1-012@264a5', '19_18' ],
  [ '8_19', '012@264a5-012@271b1', '19_19' ],
  [ '8_20', '012@271b1-012@279a4', '19_20' ],
  [ '8_21', '012@279a4-012@287b5', '19_21' ],
  [ '8_22', '012@287b5-013@347a5', '19_22' ],
  [ '8a', '013@001b1-321a6', '8' ],
  [ '8_30', '013@066b1-013@073b6', '19_30' ],
  [ '8_31', '013@073b6-013@083a7', '19_31' ],
  [ '8_32', '013@083a7-013@092b5', '19_32' ],
  [ '8_33', '013@092b5-013@101a3', '19_33' ],
  [ '8_34', '013@101a3-013@110a7', '19_34' ],
  [ '8_35', '013@110a7-013@121a5', '19_35' ],
  [ '8_36', '013@121a5-013@132b4', '19_36' ],
  [ '8_37', '013@132b4-013@143a8', '19_37' ],
  [ '8_38', '013@143a8-013@153b6', '19_38' ],
  [ '8_39', '013@153b6-013@164a3', '19_39' ],
  [ '8_40', '013@164a3-013@175a1', '19_40' ],
  [ '8_41', '013@175a1-013@183b2', '19_41' ],
  [ '8_42', '013@183b2-013@193b5', '19_42' ],
  [ '8_43', '013@193b5-013@203a3', '19_43' ],
  [ '8_44', '013@203a3-013@213a7', '19_44' ],
  [ '8_45', '013@213a7-013@224a4', '19_45' ],
  [ '8_46', '013@224a4-013@235b8', '19_46' ],
  [ '8_47', '013@235b8-013@247b3', '19_47' ],
  [ '8_48', '013@247b3-013@259b8', '19_48' ],
  [ '8_49', '013@259b8-013@272b5', '19_49' ],
  [ '8_50', '013@272b5-013@284a2', '19_50' ],
  [ '8_51', '013@284a2-013@298a2', '19_51' ],
  [ '8_52', '013@298a2-013@309b1', '19_52' ],
  [ '8_53', '013@309b1-013@347a5', '19_53' ],
  [ '8b', '013@321a6-324b7', '9' ],
  [ '8c', '013@324b8-326a4', '10' ],
  [ '8d', '013@326a4-327b1', '11' ],
  [ '8e', '013@327b1-329b2', '12' ],
  [ '8f', '013@329b2-334b5', '13' ],
  [ '8g', '013@334b5-336a6', '14' ],
  [ '8h', '013@336a7-336b5', '15' ],
  [ '8i', '013@336b5-337b4', '16' ],
  [ '8j', '013@337b4-339a8', '17' ],
  [ '8k', '013@339b1-340a1', '18' ],
  [ '8m', '013@342a2-342a8', '20' ],
  [ '8n', '013@342a8-343a1', '21a' ],
  [ '8o', '013@343a1-343b3', '21b' ],
  [ '8p', '013@343b3-344a6', '21c' ],
  [ '8q', '013@344a6-345a4', '22' ],
  [ '8r', '013@345a4-345b6', '23' ],
  [ '8s', '013@345b6-347a5', '24' ],
  [ '9_1', '014@002a3-014@019a3', '25_1' ],
  [ '9_2', '014@019a3-014@035a5', '25_2' ],
  [ '9_3', '014@035a5-014@054b8', '25_3' ],
  [ '9_4', '014@054b8-014@070a2', '25_4' ],
  [ '9_5', '014@070a2-014@084b8', '25_5' ],
  [ '9_6', '014@084b8-014@103a7', '25_6' ],
  [ '9_7', '014@103a7-014@115b3', '25_7' ],
  [ '9_8', '014@115b3-014@131b3', '25_8' ],
  [ '9_9', '014@131b3-014@149a1', '25_9' ],
  [ '9_10', '014@149a1-014@166b1', '25_10' ],
  [ '9_11', '014@166b1-014@182a4', '25_11' ],
  [ '9_12', '014@182a4-014@202b3', '25_12' ],
  [ '9_13', '014@202b3-014@217b4', '25_13' ],
  [ '9_14', '014@217b4-014@231a2', '25_14' ],
  [ '9_15', '014@231a2-014@244b3', '25_15' ],
  [ '9_16', '014@244b3-014@261a8', '25_16' ],
  [ '9_17', '014@261a8-015@001b1', '25_17' ],
  [ '9_18', '015@001b1-015@017a4', '25_18' ],
  [ '9_19', '015@017a4-015@039a7', '25_19' ],
  [ '9_20', '015@039a7-015@061b7', '25_20' ],
  [ '9_21', '015@061b7-015@075a5', '25_21' ],
  [ '9_22', '015@075a5-015@092a8', '25_22' ],
  [ '9_23', '015@092a8-015@106b7', '25_23' ],
  [ '9_24', '015@106b7-015@122a2', '25_24' ],
  [ '9_25', '015@122a2-015@139b4', '25_25' ],
  [ '9_26', '015@139b4-015@155b7', '25_26' ],
  [ '9_27', '015@155b7-015@170a3', '25_27' ],
  [ '9_28', '015@170a3-015@183a4', '25_28' ],
  [ '9_29', '015@183a4-015@195a6', '25_29' ],
  [ '9_30', '015@195a6-015@208a6', '25_30' ],
  [ '9_31', '015@208a6-015@223b4', '25_31' ],
  [ '9_32', '015@223b4-015@235b3', '25_32' ],
  [ '9_33', '015@235b3-015@245a3', '25_33' ],
  [ '9_34', '015@245a3-015@258a7', '25_34' ],
  [ '9_35', '015@258a7-016@001b1', '25_35' ],
  [ '9_36', '016@001b1-016@013a6', '25_36' ],
  [ '9_37', '016@013a6-016@027a5', '25_37' ],
  [ '9_38', '016@027a5-016@043a2', '25_38' ],
  [ '9_39', '016@043a2-016@059a5', '25_39' ],
  [ '9_40', '016@059a5-016@075a2', '25_40' ],
  [ '9_41', '016@075a2-016@090a1', '25_41' ],
  [ '9_42', '016@090a1-016@105a6', '25_42' ],
  [ '9_43', '016@105a6-016@118a2', '25_43' ],
  [ '9_44', '016@118a2-016@129b6', '25_44' ],
  [ '9_45', '016@129b6-016@149b2', '25_45' ],
  [ '9_46', '016@149b2-016@165b1', '25_46' ],
  [ '9_47', '016@165b1-016@181a8', '25_47' ],
  [ '9_48', '016@181a8-016@195a8', '25_48' ],
  [ '9_49', '016@195a8-016@208b5', '25_49' ],
  [ '9_50', '016@208b5-016@222b3', '25_50' ],
  [ '9_51', '016@222b3-016@238b4', '25_51' ],
  [ '9_52', '016@238b4-016@252b8', '25_52' ],
  [ '9_53', '016@252b8-016@265b4', '25_53' ],
  [ '9_54', '016@265b4-017@001b1', '25_54' ],
  [ '9_55', '017@001b1-017@015a7', '25_55' ],
  [ '9_56', '017@015a7-017@029a1', '25_56' ],
  [ '9_57', '017@029a1-017@041b4', '25_57' ],
  [ '9_58', '017@041b4-017@059a2', '25_58' ],
  [ '9_59', '017@059a2-017@078a3', '25_59' ],
  [ '9_60', '017@078a3-017@097b3', '25_60' ],
  [ '9_61', '017@097b3-017@109b1', '25_61' ],
  [ '9_62', '017@109b1-017@122a1', '25_62' ],
  [ '9_63', '017@122a1-017@135a1', '25_63' ],
  [ '9_64', '017@135a1-017@150b5', '25_64' ],
  [ '9_65', '017@150b5-017@164a2', '25_65' ],
  [ '9_66', '017@164a2-017@176b8', '25_66' ],
  [ '9_67', '017@176b8-017@190a5', '25_67' ],
  [ '9_68', '017@190a5-017@205a1', '25_68' ],
  [ '9_69', '017@205a1-017@218a6', '25_69' ],
  [ '9_70', '017@218a6-017@231a5', '25_70' ],
  [ '9_71', '017@231a5-017@246b8', '25_71' ],
  [ '9_72', '017@246b8-017@264a4', '25_72' ],
  [ '9_73', '017@264a4-018@001b1', '25_73' ],
  [ '9_74', '018@001b1-018@015b8', '25_74' ],
  [ '9_75', '018@015b8-018@032b4', '25_75' ],
  [ '9_76', '018@032b4-018@049a8', '25_76' ],
  [ '9_77', '018@049a8-018@062b2', '25_77' ],
  [ '9_78', '018@062b2-018@084b1', '25_78' ],
  [ '9_79', '018@084b1-018@100a8', '25_79' ],
  [ '9_80', '018@100a8-018@119a2', '25_80' ],
  [ '9_81', '018@119a2-018@138b6', '25_81' ],
  [ '9_82', '018@138b6-018@157a6', '25_82' ],
  [ '9_83', '018@157a6-018@177a5', '25_83' ],
  [ '9_84', '018@177a5-018@194b4', '25_84' ],
  [ '9_85', '018@194b4-018@211b8', '25_85' ],
  [ '9_86', '018@211b8-018@229b8', '25_86' ],
  [ '9_87', '018@229b8-018@244b7', '25_87' ],
  [ '9_88', '018@244b7-018@266a5', '25_88' ],
  [ '9_89', '018@266a5-018@281a1', '25_89' ],
  [ '9_90', '018@281a1-018@297b1', '25_90' ],
  [ '9_91', '018@297b1-019@001b1', '25_91' ],
  [ '9_92', '019@001b1-019@014b7', '25_92' ],
  [ '9_93', '019@014b7-019@030a1', '25_93' ],
  [ '9_94', '019@030a1-019@044a7', '25_94' ],
  [ '9_95', '019@044a7-019@060a1', '25_95' ],
  [ '9_96', '019@060a1-019@073b3', '25_96' ],
  [ '9_97', '019@073b3-019@085b6', '25_97' ],
  [ '9_98', '019@085b6-019@102b3', '25_98' ],
  [ '9_99', '019@102b3-019@116a6', '25_99' ],
  [ '9_100', '019@116a6-019@132a6', '25_100' ],
  [ '9_101', '019@132a6-019@143b7', '25_101' ],
  [ '9_102', '019@143b7-019@162b7', '25_102' ],
  [ '9_103', '019@162b7-019@179b5', '25_103' ],
  [ '9_104', '019@179b5-019@193b4', '25_104' ],
  [ '9_105', '019@193b4-019@206a3', '25_105' ],
  [ '9_106', '019@206a3-019@217b7', '25_106' ],
  [ '9_107', '019@217b7-019@233a3', '25_107' ],
  [ '9_108', '019@233a3-019@249b4', '25_108' ],
  [ '9_109', '019@249b4-019@265b2', '25_109' ],
  [ '9_110', '019@265b2-019@282a2', '25_110' ],
  [ '9_111', '019@282a2-020@001b1', '25_111' ],
  [ '9_112', '020@001b1-020@016a8', '25_112' ],
  [ '9_113', '020@016a8-020@026b8', '25_113' ],
  [ '9_114', '020@026b8-020@042a3', '25_114' ],
  [ '9_115', '020@042a3-020@058a2', '25_115' ],
  [ '9_116', '020@058a2-020@069a1', '25_116' ],
  [ '9_117', '020@069a1-020@082b8', '25_117' ],
  [ '9_118', '020@082b8-020@096b8', '25_118' ],
  [ '9_119', '020@096b8-020@112a5', '25_119' ],
  [ '9_120', '020@112a5-020@125a3', '25_120' ],
  [ '9_121', '020@125a3-020@140b6', '25_121' ],
  [ '9_122', '020@140b6-020@155a6', '25_122' ],
  [ '9_123', '020@155a6-020@173a2', '25_123' ],
  [ '9_124', '020@173a2-020@187b5', '25_124' ],
  [ '9_125', '020@187b5-020@203b5', '25_125' ],
  [ '9_126', '020@203b5-020@220b4', '25_126' ],
  [ '9_127', '020@220b4-020@238a7', '25_127' ],
  [ '9_128', '020@238a7-020@251b6', '25_128' ],
  [ '9_129', '020@251b6-020@264b4', '25_129' ],
  [ '9_130', '020@264b4-021@001b1', '25_130' ],
  [ '9_132', '021@001b1-021@018b5', '25_132' ],
  [ '9_133', '021@018b5-021@033a2', '25_133' ],
  [ '9_134', '021@033a2-021@047b4', '25_134' ],
  [ '9_135', '021@047b4-021@063a1', '25_135' ],
  [ '9_136', '021@063a1-021@079b2', '25_136' ],
  [ '9_137', '021@079b2-021@094a1', '25_137' ],
  [ '9_138', '021@094a1-021@109a2', '25_138' ],
  [ '9_139', '021@109a2-021@122a7', '25_139' ],
  [ '9_140', '021@122a7-021@135b6', '25_140' ],
  [ '9_141', '021@135b6-021@150a4', '25_141' ],
  [ '9_142', '021@150a4-021@165a3', '25_142' ],
  [ '9_143', '021@165a3-021@180a5', '25_143' ],
  [ '9_144', '021@180a5-021@195b5', '25_144' ],
  [ '9_145', '021@195b5-021@209b3', '25_145' ],
  [ '9_146', '021@209b3-021@228b6', '25_146' ],
  [ '9_147', '021@228b6-021@246a1', '25_147' ],
  [ '9_148', '021@246a1-021@261b3', '25_148' ],
  [ '9_149', '021@261b3-021@277a3', '25_149' ],
  [ '9_150', '021@277a3-022@001b1', '25_150' ],
  [ '9_151', '022@001b1-022@025a6', '25_151' ],
  [ '9_152', '022@025a6-022@044a8', '25_152' ],
  [ '9_153', '022@044a8-022@070a1', '25_153' ],
  [ '9_154', '022@070a1-022@094b6', '25_154' ],
  [ '9_155', '022@094b6-022@118b6', '25_155' ],
  [ '9_156', '022@118b6-022@140b6', '25_156' ],
  [ '9_157', '022@140b6-022@157a2', '25_157' ],
  [ '9_158', '022@157a2-022@174b7', '25_158' ],
  [ '9_159', '022@174b7-022@193b1', '25_159' ],
  [ '9_160', '022@193b1-022@212a4', '25_160' ],
  [ '9_161', '022@212a4-022@232a5', '25_161' ],
  [ '9_162', '022@232a5-022@251a6', '25_162' ],
  [ '9_163', '022@251a6-022@269b7', '25_163' ],
  [ '9_164', '022@269b7-022@288b4', '25_164' ],
  [ '9_165', '022@288b4-022@307a5', '25_165' ],
  [ '9_166', '022@307a5-023@001b1', '25_166' ],
  [ '9_167', '023@001b1-023@020a2', '25_167' ],
  [ '9_168', '023@020a2-023@034a5', '25_168' ],
  [ '9_169', '023@034a5-023@050b6', '25_169' ],
  [ '9_170', '023@050b6-023@066a4', '25_170' ],
  [ '9_171', '023@066a4-023@082a1', '25_171' ],
  [ '9_172', '023@082a1-023@098b4', '25_172' ],
  [ '9_173', '023@098b4-023@115a5', '25_173' ],
  [ '9_174', '023@115a5-023@130b6', '25_174' ],
  [ '9_175', '023@130b6-023@147a4', '25_175' ],
  [ '9_176', '023@147a4-023@163a5', '25_176' ],
  [ '9_177', '023@163a5-023@176b5', '25_177' ],
  [ '9_178', '023@176b5-023@190a6', '25_178' ],
  [ '9_179', '023@190a6-023@206a2', '25_179' ],
  [ '9_180', '023@206a2-023@218a7', '25_180' ],
  [ '9_181', '023@218a7-023@235b8', '25_181' ],
  [ '9_182', '023@235b8-023@248b3', '25_182' ],
  [ '9_183', '023@248b3-023@262b5', '25_183' ],
  [ '9_184', '023@262b5-023@276b1', '25_184' ],
  [ '9_185', '023@276b1-024@001b1', '25_185' ],
  [ '9_186', '024@001b1-024@018a7', '25_186' ],
  [ '9_187', '024@018a7-024@035b1', '25_187' ],
  [ '9_188', '024@035b1-024@052a4', '25_188' ],
  [ '9_189', '024@052a4-024@063b1', '25_189' ],
  [ '9_190', '024@063b1-024@077b7', '25_190' ],
  [ '9_191', '024@077b7-024@115a1', '25_191' ],
  [ '9_193', '024@115a1-024@134a7', '25_193' ],
  [ '9_194', '024@134a7-024@150b5', '25_194' ],
  [ '9_195', '024@150b5-024@165b4', '25_195' ],
  [ '9_196', '024@165b4-024@180a4', '25_196' ],
  [ '9_197', '024@180a4-024@197b5', '25_197' ],
  [ '9_198', '024@197b5-024@212a7', '25_198' ],
  [ '9_199', '024@212a7-024@225a2', '25_199' ],
  [ '9_200', '024@225a2-024@242a4', '25_200' ],
  [ '9_201', '024@242a4-024@258b5', '25_201' ],
  [ '9_202', '024@258b5-024@277a7', '25_202' ],
  [ '9_203', '024@277a7-024@291a2', '25_203' ],
  [ '9_204', '024@291a2-024@94a18', '25_204' ],
  [ '9_192', '024@94a18-025@001b1', '25_192' ],
  [ '9_205', '025@001b1-025@020a3', '25_205' ],
  [ '9_206', '025@020a3-025@033b1', '25_206' ],
  [ '9_207', '025@033b1-025@053a1', '25_207' ],
  [ '9_208', '025@053a1-025@069a7', '25_208' ],
  [ '9_209', '025@069a7-025@084b1', '25_209' ],
  [ '9_210', '025@084b1-025@099b2', '25_210' ],
  [ '9_211', '025@099b2-025@117b4', '25_211' ],
  [ '9_212', '025@117b4-025@133b3', '25_212' ],
  [ '9_213', '025@133b3-025@150a8', '25_213' ],
  [ '9_214', '025@150a8-025@167a5', '25_214' ],
  [ '9_215', '025@167a5-025@182a1', '25_215' ],
  [ '9_216', '025@182a1-025@194b4', '25_216' ],
  [ '9_217', '025@194b4-025@208a3', '25_217' ],
  [ '9_218', '025@208a3-025@222b7', '25_218' ],
  [ '9_219', '025@222b7-025@237a6', '25_219' ],
  [ '9_220', '025@237a6-025@253a5', '25_220' ],
  [ '9_221', '025@253a5-025@267a4', '25_221' ],
  [ '9_222', '025@267a4-025@282a6', '25_222' ],
  [ '9_223', '025@282a6-025@298b8', '25_223' ],
  [ '9_224', '025@298b8-026@001b1', '25_224' ],
  [ '9_225', '026@001b1-026@016b3', '25_225' ],
  [ '9_226', '026@016b3-026@031b5', '25_226' ],
  [ '9_227', '026@031b5-026@047b6', '25_227' ],
  [ '9_228', '026@047b6-026@062a1', '25_228' ],
  [ '9_229', '026@062a1-026@076b2', '25_229' ],
  [ '9_230', '026@076b2-026@096a5', '25_230' ],
  [ '9_231', '026@096a5-026@112a1', '25_231' ],
  [ '9_232', '026@112a1-026@124b4', '25_232' ],
  [ '9_233', '026@124b4-026@141a4', '25_233' ],
  [ '9_234', '026@141a4-026@159a1', '25_234' ],
  [ '9_235', '026@159a1-026@175b8', '25_235' ],
  [ '9_236', '026@175b8-026@189a3', '25_236' ],
  [ '9_237', '026@189a3-026@205b1', '25_237' ],
  [ '9_238', '026@205b1-026@226b8', '25_238' ],
  [ '9_239', '026@226b8-026@243a2', '25_239' ],
  [ '9_240', '026@243a2-026@260a5', '25_240' ],
  [ '9_241', '026@260a5-026@272a8', '25_241' ],
  [ '9_242', '026@272a8-026@284b8', '25_242' ],
  [ '9_243', '026@284b8-026@300a8', '25_243' ],
  [ '9_244', '026@300a8-027@001b1', '25_244' ],
  [ '9_245', '027@001b1-027@020b5', '25_245' ],
  [ '9_246', '027@020b5-027@035b2', '25_246' ],
  [ '9_247', '027@035b2-027@051a6', '25_247' ],
  [ '9_248', '027@051a6-027@065b8', '25_248' ],
  [ '9_249', '027@065b8-027@077b7', '25_249' ],
  [ '9_250', '027@077b7-027@089a8', '25_250' ],
  [ '9_251', '027@089a8-027@106a1', '25_251' ],
  [ '9_252', '027@106a1-027@121a7', '25_252' ],
  [ '9_253', '027@121a7-027@137a5', '25_253' ],
  [ '9_254', '027@137a5-027@153a6', '25_254' ],
  [ '9_255', '027@153a6-027@167b1', '25_255' ],
  [ '9_256', '027@167b1-027@184a2', '25_256' ],
  [ '9_257', '027@184a2-027@198a6', '25_257' ],
  [ '9_258', '027@198a6-027@214b5', '25_258' ],
  [ '9_259', '027@214b5-027@232b1', '25_259' ],
  [ '9_260', '027@232b1-027@255b3', '25_260' ],
  [ '9_261', '027@255b3-027@270b2', '25_261' ],
  [ '9_262', '027@270b2-027@289a2', '25_262' ],
  [ '9_263', '027@289a2-028@001b1', '25_263' ],
  [ '9_264', '028@001b1-028@020b1', '25_264' ],
  [ '9_265', '028@020b1-028@041b1', '25_265' ],
  [ '9_266', '028@041b1-028@062b5', '25_266' ],
  [ '9_267', '028@062b5-028@075a3', '25_267' ],
  [ '9_268', '028@075a3-028@096b8', '25_268' ],
  [ '9_269', '028@096b8-028@118b4', '25_269' ],
  [ '9_270', '028@118b4-028@138b2', '25_270' ],
  [ '9_271', '028@138b2-028@156b1', '25_271' ],
  [ '9_272', '028@156b1-028@171b4', '25_272' ],
  [ '9_273', '028@171b4-028@187a6', '25_273' ],
  [ '9_274', '028@187a6-028@203b3', '25_274' ],
  [ '9_275', '028@203b3-028@218a4', '25_275' ],
  [ '9_276', '028@218a4-028@235a5', '25_276' ],
  [ '9_277', '028@235a5-028@246a1', '25_277' ],
  [ '9_278', '028@246a1-028@255b4', '25_278' ],
  [ '9_279', '028@255b4-028@273a3', '25_279' ],
  [ '9_280', '028@273a3-028@290a4', '25_280' ],
  [ '9_281', '028@290a4-029@001b1', '25_281' ],
  [ '9_282', '029@001b1-029@018a1', '25_282' ],
  [ '9_283', '029@018a1-029@040b1', '25_283' ],
  [ '9_284', '029@040b1-029@062b5', '25_284' ],
  [ '9_285', '029@062b5-029@083b6', '25_285' ],
  [ '9_286', '029@083b6-029@101b8', '25_286' ],
  [ '9_287', '029@101b8-029@124a1', '25_287' ],
  [ '9_288', '029@124a1-029@139b8', '25_288' ],
  [ '9_289', '029@139b8-029@153a8', '25_289' ],
  [ '9_290', '029@153a8-029@166a5', '25_290' ],
  [ '9_291', '029@166a5-029@178a2', '25_291' ],
  [ '9_292', '029@178a2-029@190b3', '25_292' ],
  [ '9_293', '029@190b3-029@203a3', '25_293' ],
  [ '9_294', '029@203a3-029@216a7', '25_294' ],
  [ '9_295', '029@216a7-029@232b3', '25_295' ],
  [ '9_296', '029@232b3-029@247b4', '25_296' ],
  [ '9_297', '029@247b4-029@266b2', '25_297' ],
  [ '9_298', '029@266b2-029@280a3', '25_298' ],
  [ '9_299', '029@280a3-029@296a2', '25_299' ],
  [ '9_300', '029@296a2-029@311a3', '25_300' ],
  [ '10_1', '030@001b2-030@015b5', '26_1' ],
  [ '10_2', '030@015b5-030@029b2', '26_2' ],
  [ '10_3', '030@029b2-030@044b6', '26_3' ],
  [ '10_4', '030@044b6-030@059b4', '26_4' ],
  [ '10_5', '030@059b4-030@074a6', '26_5' ],
  [ '10_6', '030@074a6-030@089a2', '26_6' ],
  [ '10_7', '030@089a2-030@105a7', '26_7' ],
  [ '10_8', '030@105a7-030@119b3', '26_8' ],
  [ '10_9', '030@119b3-030@132b8', '26_9' ],
  [ '10_10', '030@132b8-030@147a3', '26_10' ],
  [ '10_11', '030@147a3-030@162a6', '26_11' ],
  [ '10_12', '030@162a6-030@177a4', '26_12' ],
  [ '10_13', '030@177a4-030@193b6', '26_13' ],
  [ '10_14', '030@193b6-030@210a4', '26_14' ],
  [ '10_15', '030@210a4-030@223b8', '26_15' ],
  [ '10_16', '030@223b8-030@237a4', '26_16' ],
  [ '10_17', '030@237a4-030@251b1', '26_17' ],
  [ '10_18', '030@251b1-030@267a2', '26_18' ],
  [ '10_19', '030@267a2-030@280b5', '26_19' ],
  [ '10_20', '030@280b5-031@001b1', '26_20' ],
  [ '10_21', '031@001b1-031@017a8', '26_21' ],
  [ '10_22', '031@017a8-031@032b8', '26_22' ],
  [ '10_23', '031@032b8-031@047b7', '26_23' ],
  [ '10_24', '031@047b7-031@061b7', '26_24' ],
  [ '10_25', '031@061b7-031@077a8', '26_25' ],
  [ '10_26', '031@077a8-031@092a1', '26_26' ],
  [ '10_27', '031@092a1-031@105a8', '26_27' ],
  [ '10_28', '031@105a8-031@119b8', '26_28' ],
  [ '10_29', '031@119b8-031@137a6', '26_29' ],
  [ '10_30', '031@137a6-031@157a3', '26_30' ],
  [ '10_31', '031@157a3-031@171a1', '26_31' ],
  [ '10_32', '031@171a1-031@186a6', '26_32' ],
  [ '10_33', '031@186a6-031@200a7', '26_33' ],
  [ '10_34', '031@200a7-031@215a6', '26_34' ],
  [ '10_35', '031@215a6-031@230b5', '26_35' ],
  [ '10_36', '031@230b5-031@246b2', '26_36' ],
  [ '10_37', '031@246b2-031@263a3', '26_37' ],
  [ '10_38', '031@263a3-031@280b2', '26_38' ],
  [ '10_39', '031@280b2-031@296b5', '26_39' ],
  [ '10_40', '031@296b5-032@001b1', '26_40' ],
  [ '10_41', '032@001b1-032@015b2', '26_41' ],
  [ '10_42', '032@015b2-032@030a1', '26_42' ],
  [ '10_43', '032@030a1-032@043a2', '26_43' ],
  [ '10_44', '032@043a2-032@054b7', '26_44' ],
  [ '10_45', '032@054b7-032@069a6', '26_45' ],
  [ '10_46', '032@069a6-032@081a8', '26_46' ],
  [ '10_47', '032@081a8-032@094b7', '26_47' ],
  [ '10_48', '032@094b7-032@111a2', '26_48' ],
  [ '10_49', '032@111a2-032@128a2', '26_49' ],
  [ '10_50', '032@128a2-032@146a6', '26_50' ],
  [ '10_51', '032@146a6-032@162b7', '26_51' ],
  [ '10_52', '032@162b7-032@179a5', '26_52' ],
  [ '10_53', '032@179a5-032@195b7', '26_53' ],
  [ '10_54', '032@195b7-032@216a1', '26_54' ],
  [ '10_55', '032@216a1-032@231b8', '26_55' ],
  [ '10_56', '032@231b8-032@249b4', '26_56' ],
  [ '10_57', '032@249b4-032@264b5', '26_57' ],
  [ '10_58', '032@264b5-032@280a6', '26_58' ],
  [ '10_59', '032@280a6-033@001b1', '26_59' ],
  [ '10_60', '033@001b1-033@015b6', '26_60' ],
  [ '10_61', '033@015b6-033@031b7', '26_61' ],
  [ '10_62', '033@031b7-033@046b3', '26_62' ],
  [ '10_63', '033@046b3-033@063a1', '26_63' ],
  [ '10_64', '033@063a1-033@078b3', '26_64' ],
  [ '10_65', '033@078b3-033@095b4', '26_65' ],
  [ '10_66', '033@095b4-033@111b3', '26_66' ],
  [ '10_67', '033@111b3-033@124a8', '26_67' ],
  [ '10_68', '033@124a8-033@138a2', '26_68' ],
  [ '10_69', '033@138a2-033@151a6', '26_69' ],
  [ '10_70', '033@151a6-033@165b8', '26_70' ],
  [ '10_71', '033@165b8-033@179a1', '26_71' ],
  [ '10_72', '033@179a1-033@192b6', '26_72' ],
  [ '10_73', '033@192b6-033@206a7', '26_73' ],
  [ '10_74', '033@206a7-033@220a6', '26_74' ],
  [ '10_75', '033@220a6-033@233a1', '26_75' ],
  [ '10_76', '033@233a1-033@244a2', '26_76' ],
  [ '10_77', '033@244a2-033@256b7', '26_77' ],
  [ '10_78', '033@256b7-033@271a9', '26_78' ],
  [ '11_1', '034@001b3-034@015a6', '27_1' ],
  [ '11_2', '034@015a6-034@030a4', '27_2' ],
  [ '11_3', '034@030a4-034@044a3', '27_3' ],
  [ '11_4', '034@044a3-034@057b6', '27_4' ],
  [ '11_5', '034@057b6-034@072b2', '27_5' ],
  [ '11_6', '034@072b2-034@087a3', '27_6' ],
  [ '11_7', '034@087a3-034@102a5', '27_7' ],
  [ '11_8', '034@102a5-034@117b8', '27_8' ],
  [ '11_9', '034@117b8-034@136b6', '27_9' ],
  [ '11_10', '034@136b6-034@148b6', '27_10' ],
  [ '11_11', '034@148b6-034@161a6', '27_11' ],
  [ '11_12', '034@161a6-034@175b8', '27_12' ],
  [ '11_13', '034@175b8-034@192b5', '27_13' ],
  [ '11_14', '034@192b5-034@206b4', '27_14' ],
  [ '11_15', '034@206b4-034@219a5', '27_15' ],
  [ '11_16', '034@219a5-034@234a4', '27_16' ],
  [ '11_17', '034@234a4-034@248a8', '27_17' ],
  [ '11_18', '034@248a8-034@262b7', '27_18' ],
  [ '11_19', '034@262b7-034@274b5', '27_19' ],
  [ '11_20', '034@274b5-034@286b1', '27_20' ],
  [ '11_21', '034@286b1-034@299b5', '27_21' ],
  [ '11_22', '034@299b5-035@001b1', '27_22' ],
  [ '11_23', '035@001b1-035@014b4', '27_23' ],
  [ '11_24', '035@014b4-035@028b3', '27_24' ],
  [ '11_25', '035@028b3-035@041a5', '27_25' ],
  [ '11_26', '035@041a5-035@056a1', '27_26' ],
  [ '11_27', '035@056a1-035@069b3', '27_27' ],
  [ '11_28', '035@069b3-035@082b8', '27_28' ],
  [ '11_29', '035@082b8-035@096b2', '27_29' ],
  [ '11_30', '035@096b2-035@110a8', '27_30' ],
  [ '11_31', '035@110a8-035@122a7', '27_31' ],
  [ '11_32', '035@122a7-035@137b4', '27_32' ],
  [ '11_33', '035@137b4-035@151a8', '27_33' ],
  [ '11_34', '035@151a8-035@166a4', '27_34' ],
  [ '11_35', '035@166a4-035@178a2', '27_35' ],
  [ '11_36', '035@178a2-035@194a2', '27_36' ],
  [ '11_37', '035@194a2-035@210a4', '27_37' ],
  [ '11_38', '035@210a4-035@225a3', '27_38' ],
  [ '11_39', '035@225a3-035@240a4', '27_39' ],
  [ '11_40', '035@240a4-035@255a4', '27_40' ],
  [ '11_41', '035@255a4-035@275a4', '27_41' ],
  [ '11_42', '035@275a4-035@290b3', '27_42' ],
  [ '11_43', '035@290b3-035@306a3', '27_43' ],
  [ '11_44', '035@306a3-036@001b1', '27_44' ],
  [ '11_45', '036@001b1-036@014a4', '27_45' ],
  [ '11_46', '036@014a4-036@026b5', '27_46' ],
  [ '11_47', '036@026b5-036@040b3', '27_47' ],
  [ '11_48', '036@040b3-036@054a1', '27_48' ],
  [ '11_49', '036@054a1-036@064b6', '27_49' ],
  [ '11_50', '036@064b6-036@078b6', '27_50' ],
  [ '11_51', '036@078b6-036@090b5', '27_51' ],
  [ '11_52', '036@090b5-036@105b3', '27_52' ],
  [ '11_53', '036@105b3-036@120a6', '27_53' ],
  [ '11_54', '036@120a6-036@133a3', '27_54' ],
  [ '11_55', '036@133a3-036@146b3', '27_55' ],
  [ '11_56', '036@146b3-036@158a5', '27_56' ],
  [ '11_57', '036@158a5-036@169a5', '27_57' ],
  [ '11_58', '036@169a5-036@187a6', '27_58' ],
  [ '11_59', '036@187a6-036@199a4', '27_59' ],
  [ '11_60', '036@199a4-035@320a7', '27_60' ],
  [ '', '037@001a1-251a3', '305' ],
  [ '12_1', '037@001b1-037@012b2', '28_1' ],
  [ '12_2', '037@012b2-037@024b2', '28_2' ],
  [ '12_3', '037@024b2-037@034b7', '28_3' ],
  [ '12_4', '037@034b7-037@046b8', '28_4' ],
  [ '12_5', '037@046b8-037@057b8', '28_5' ],
  [ '12_6', '037@057b8-037@069a1', '28_6' ],
  [ '12_7', '037@069a1-037@080a8', '28_7' ],
  [ '12_8', '037@080a8-037@093b1', '28_8' ],
  [ '12_9', '037@093b1-037@105a3', '28_9' ],
  [ '12_10', '037@105a3-037@116a2', '28_10' ],
  [ '12_11', '037@116a2-037@127a5', '28_11' ],
  [ '12_12', '037@127a5-037@139b6', '28_12' ],
  [ '12_13', '037@139b6-037@151a2', '28_13' ],
  [ '12_14', '037@151a2-037@162a7', '28_14' ],
  [ '12_15', '037@162a7-037@175a5', '28_15' ],
  [ '12_16', '037@175a5-037@186a6', '28_16' ],
  [ '12_17', '037@186a6-037@198b7', '28_17' ],
  [ '12_18', '037@198b7-037@210b8', '28_18' ],
  [ '12_19', '037@210b8-037@222b5', '28_19' ],
  [ '12_20', '037@222b5-037@232b6', '28_20' ],
  [ '12_21', '037@232b6-037@242b6', '28_21' ],
  [ '12_22', '037@242b6-037@257a2', '28_22' ],
  [ '12_23', '037@257a2-037@270a6', '28_23' ],
  [ '12_24', '037@270a6-037@282b8', '28_24' ],
  [ '12_25', '037@282b8-037@295a1', '28_25' ],
  [ '12_26', '037@295a1-037@306b4', '28_26' ],
  [ '12_27', '037@306b4-037@318b6', '28_27' ],
  [ '12_28', '037@318b6-037@330b5', '28_28' ],
  [ '12_29', '037@330b5-037@343a3', '28_29' ],
  [ '12_30', '037@343a3-037@354b1', '28_30' ],
  [ '12_31', '037@354b1-037@364b1', '28_31' ],
  [ '12_32', '037@364b1-037@375a8', '28_32' ],
  [ '12_33', '037@375a8-037@387b8', '28_33' ],
  [ '12_34', '037@387b8-036@092a8', '28_34' ],
  [ '13_1', '038@001b2-038@016b6', '29_1' ],
  [ '13_2', '038@016b6-038@028b8', '29_2' ],
  [ '13_3', '038@028b8-038@044b5', '29_3' ],
  [ '13_4', '038@044b5-038@057b8', '29_4' ],
  [ '13_5', '038@057b8-038@072a3', '29_5' ],
  [ '13_6', '038@072a3-038@084a6', '29_6' ],
  [ '13_7', '038@084a6-038@097b8', '29_7' ],
  [ '13_8', '038@097b8-038@111b4', '29_8' ],
  [ '13_9', '038@111b4-038@125a1', '29_9' ],
  [ '13_10', '038@125a1-038@138a3', '29_10' ],
  [ '13_11', '038@138a3-038@149a2', '29_11' ],
  [ '13_12', '038@149a2-038@159b3', '29_12' ],
  [ '13_13', '038@159b3-038@170b8', '29_13' ],
  [ '13_14', '038@170b8-038@181a2', '29_14' ],
  [ '13_15', '038@181a2-038@194a4', '29_15' ],
  [ '13_16', '038@194a4-038@206b5', '29_16' ],
  [ '13_17', '038@206b5-038@219a2', '29_17' ],
  [ '13_18', '038@219a2-038@231b1', '29_18' ],
  [ '13_19', '038@231b1-038@242a7', '29_19' ],
  [ '13_20', '038@242a7-038@251b5', '29_20' ],
  [ '13_21', '038@251b5-038@264b4', '29_21' ],
  [ '13_22', '038@264b4-038@279b4', '29_22' ],
  [ '13_23', '038@279b4-038@291a5', '29_23' ],
  [ '13_24', '038@291a5-038@305a2', '29_24' ],
  [ '14', '039@001b1-020a8', '30' ],
  [ '15_1', '039@020b2-039@033b2', '31_1' ],
  [ '15_2', '039@033b2-039@048a6', '31_2' ],
  [ '15_3', '039@048a6-039@064b7', '31_3' ],
  [ '15_4', '039@064b7-039@077b1', '31_4' ],
  [ '15_5', '039@077b1-039@091a1', '31_5' ],
  [ '15_6', '039@091a1-039@105b8', '31_6' ],
  [ '16_1', '039@106a1-039@120b5', '41_1' ],
  [ '16_2', '039@120b5-039@133b7', '41_2' ],
  [ '17', '039@133b7-151b8', '32' ],
  [ '18', '039@151b8-164b8', '33' ],
  [ '19', '039@164b8-167a6', '35' ],
  [ '20', '039@167a6-167b4', '40' ],
  [ '21', '039@167b4-169a2', '43' ],
  [ '22', '039@169a2-170a4', '44' ],
  [ '23', '039@170a4-170b5', '45' ],
  [ '24', '039@170b5-171a6', '46' ],
  [ '25', '039@171a6-172a1', '47' ],
  [ '26', '039@172a1-174b8', '48' ],
  [ '27', '039@175a1-248b7', '49' ],
  [ '28', '039@248b7-258b7', '50' ],
  [ '29', '039@258b7-262b4', '51' ],
  [ '30', '039@262b4-269b6', '52' ],
  [ '31', '039@269b6-270b5', '53' ],
  [ '32', '039@270b5-276b2', '54' ],
  [ '33', '039@276b2-279b2', '55' ],
  [ '34', '039@279b2-282a2', '56' ],
  [ '35', '039@282a2-283a1', '57' ],
  [ '36', '039@283a2-283b2', '58' ],
  [ '37', '039@283b2-284a2', '59' ],
  [ '38', '039@284a3-285a6', '60' ],
  [ '39_1', '040@001b2-040@014b2', '111_1' ],
  [ '39_2', '040@014b2-040@026b1', '111_2' ],
  [ '39_3', '040@026b1-040@038a6', '111_3' ],
  [ '39_4', '040@038a6-040@049b7', '111_4' ],
  [ '39_5', '040@049b7-040@061a4', '111_5' ],
  [ '39_6', '040@061a4-040@073a4', '111_6' ],
  [ '39_7', '040@073a4-040@086b7', '111_7' ],
  [ '39_8', '040@086b7-040@098b8', '111_8' ],
  [ '39_9', '040@098b8-040@113a2', '111_9' ],
  [ '39_10', '040@113a2-040@127a1', '111_10' ],
  [ '39_11', '040@127a1-040@142a8', '111_11' ],
  [ '39_12', '040@142a8-040@157a7', '111_12' ],
  [ '39_13', '040@157a7-040@172a1', '111_13' ],
  [ '39_14', '040@172a1-040@185b8', '111_14' ],
  [ '39_15', '040@185b8-040@199a1', '111_15' ],
  [ '39_16', '040@199a1-040@212a7', '111_16' ],
  [ '39_17', '040@212a7-040@226a6', '111_17' ],
  [ '39_18', '040@226a6-040@238b8', '111_18' ],
  [ '39_19', '040@238b8-040@252b8', '111_19' ],
  [ '39_20', '040@252b8-040@266b8', '111_20' ],
  [ '39_21', '040@266b8-040@279b7', '111_21' ],
  [ '39_22', '040@279b7-040@295a5', '111_22' ],
  [ '39_23', '040@295a5-040@310b5', '111_23' ],
  [ '39_24', '040@310b5-040@326b1', '111_24' ],
  [ '39_25', '040@326b1-040@342a2', '111_25' ],
  [ '39_26', '040@342a2-040@308a6', '111_26' ],
  [ '40_1', '041@001b2-041@014a2', '112_1' ],
  [ '40_2', '041@014a2-041@028a3', '112_2' ],
  [ '40_3', '041@028a3-041@041b7', '112_3' ],
  [ '40_4', '041@041b7-041@055a5', '112_4' ],
  [ '40_5', '041@055a5-041@069a7', '112_5' ],
  [ '40_6', '041@069a7-041@081b5', '112_6' ],
  [ '40_7', '041@081b5-041@093b2', '112_7' ],
  [ '40_8', '041@093b2-041@104b6', '112_8' ],
  [ '40_9', '041@104b6-041@117a8', '112_9' ],
  [ '40_10', '041@117a8-041@133a7', '112_10' ],
  [ '40_11', '041@133a7-041@147a6', '112_11' ],
  [ '40_12', '041@147a6-041@162a6', '112_12' ],
  [ '40_13', '041@162a6-041@177b7', '112_13' ],
  [ '40_14', '041@177b7-041@192b4', '112_14' ],
  [ '40_15', '041@192b4-041@206a4', '112_15' ],
  [ '40_16', '041@206a4-041@219b5', '112_16' ],
  [ '40_17', '041@219b5-041@231a8', '112_17' ],
  [ '40_18', '041@231a8-041@246b6', '112_18' ],
  [ '41_1', '041@247a1-041@259b4', '113_1' ],
  [ '41_2', '041@259b4-041@273b8', '113_2' ],
  [ '42', '041@274a1-290b8', '114' ],
  [ '43', '041@291a1-311a8', '115' ],
  [ '44_1', '042@001b4-042@014b1', '117_1' ],
  [ '44_2', '042@014b1-042@026a1', '117_2' ],
  [ '44_3', '042@026a1-042@037b5', '117_3' ],
  [ '44_4', '042@037b5-042@049b8', '117_4' ],
  [ '44_5', '042@049b8-042@060b6', '117_5' ],
  [ '44_6', '042@060b6-042@072a5', '117_6' ],
  [ '44_7', '042@072a5-042@083b3', '117_7' ],
  [ '44_8', '042@083b3-042@093b5', '117_8' ],
  [ '44_9', '042@093b5-042@104a2', '117_9' ],
  [ '44_10', '042@104a2-042@114a7', '117_10' ],
  [ '44_11', '042@114a7-042@125b5', '117_11' ],
  [ '44_12', '042@125b5-042@138b5', '117_12' ],
  [ '44_13', '042@138b5-042@151b5', '117_13' ],
  [ '44_14', '042@151b5-042@164a5', '117_14' ],
  [ '44_15', '042@164a5-042@175b3', '117_15' ],
  [ '44_16', '042@175b3-042@187b4', '117_16' ],
  [ '44_17', '042@187b4-042@199a2', '117_17' ],
  [ '44_18', '042@199a2-042@211a7', '117_18' ],
  [ '44_19', '042@211a7-042@222a5', '117_19' ],
  [ '44_20', '042@222a5-042@233b2', '117_20' ],
  [ '44_21', '042@233b2-042@245b7', '117_21' ],
  [ '44_22', '042@245b7-042@257a7', '117_22' ],
  [ '44_23', '042@257a7-042@269a6', '117_23' ],
  [ '44_24', '042@269a6-042@281b7', '117_24' ],
  [ '44_25', '042@281b7-042@290a8', '117_25' ],
  [ '45_1', '042@290b1-042@302a3', '118_1' ],
  [ '45_2', '042@302a3-042@312b2', '118_2' ],
  [ '45_3', '042@312b2-042@323a8', '118_3' ],
  [ '46_1', '043@001b2-043@016a6', '119_1' ],
  [ '46_2', '043@016a6-043@031a3', '119_2' ],
  [ '46_3', '043@031a3-043@046a1', '119_3' ],
  [ '46_4', '043@046a1-043@060b3', '119_4' ],
  [ '46_5', '043@060b3-043@074a5', '119_5' ],
  [ '46_6', '043@074a5-043@087a7', '119_6' ],
  [ '46_7', '043@087a7-043@099b3', '119_7' ],
  [ '46_8', '043@099b3-043@113b8', '119_8' ],
  [ '46_9', '043@113b8-043@126b2', '119_9' ],
  [ '46_10', '043@126b2-043@138b8', '119_10' ],
  [ '46_11', '043@138b8-043@153a7', '119_11' ],
  [ '46_12', '043@153a7-043@166b6', '119_12' ],
  [ '46_13', '043@166b6-043@180b2', '119_13' ],
  [ '46_14', '043@180b2-043@194b5', '119_14' ],
  [ '46_15', '043@194b5-043@207b4', '119_15' ],
  [ '46_16', '043@207b4-043@220a5', '119_16' ],
  [ '46_17', '043@220a5-043@232a4', '119_17' ],
  [ '46_18', '043@232a4-043@239b8', '119_18' ],
  [ '47_1', '043@240a1-043@254a5', '120_1' ],
  [ '47_2', '043@254a5-043@267a1', '120_2' ],
  [ '47_3', '043@267a1-043@278a6', '120_3' ],
  [ '47_4', '043@278a6-043@289b7', '120_4' ],
  [ '48', '043@290a1-300b8', '121' ],
  [ '49', '043@301a1-302a7', '122' ],
  [ '50', '043@302a8-304a8', '123' ],
  [ '51_1', '044@001b1-044@020a1', '124_1' ],
  [ '51_2', '044@020a1-044@040a1', '124_2' ],
  [ '51_3', '044@040a1-044@059b8', '124_3' ],
  [ '52_1', '044@060a1-044@074b1', '125_1' ],
  [ '52_2', '044@074b1-044@089a8', '125_2' ],
  [ '52_3', '044@089a8-044@105b7', '125_3' ],
  [ '52_4', '044@105b7-044@121a1', '125_4' ],
  [ '52_5', '044@121a1-044@138b7', '125_5' ],
  [ '52_6', '044@138b7-044@156a8', '125_6' ],
  [ '52_7', '044@156a8-044@171b5', '125_7' ],
  [ '52_8', '044@171b5-044@186b8', '125_8' ],
  [ '52_9', '044@186b8-0', '125_9' ],
  [ '53_1', '044@207b2-044@220a7', '126_1' ],
  [ '53_2', '044@220a7-044@233b2', '126_2' ],
  [ '53_3', '044@233b2-044@245b6', '126_3' ],
  [ '53_4', '044@245b6-044@260a2', '126_4' ],
  [ '53_5', '044@260a2-044@270b7', '126_5' ],
  [ '53_6', '044@270b7-044@281a1', '126_6' ],
  [ '53_7', '044@281a1-044@293a5', '126_7' ],
  [ '53_8', '044@293a5-044@306b1', '126_8' ],
  [ '54', '044@306b1-313a8', '127' ],
  [ '55_1', '045@001b2-045@022a1', '128_1' ],
  [ '55_2', '045@022a1-045@035a8', '128_2' ],
  [ '55_3', '045@035a8-045@049b5', '128_3' ],
  [ '55_4', '045@049b5-045@061a1', '128_4' ],
  [ '56_1', '045@061a2-045@071b2', '129_1' ],
  [ '56_2', '045@071b2-045@084a1', '129_2' ],
  [ '56_3', '045@084a1-045@097b1', '129_3' ],
  [ '56_4', '045@097b1-045@112a1', '129_4' ],
  [ '56_5', '045@112a1-045@126a2', '129_5' ],
  [ '56_6', '045@126a2-045@141a2', '129_6' ],
  [ '57_1', '045@141a2-045@151a7', '130_1' ],
  [ '57_2', '045@151a7-045@162a3', '130_2' ],
  [ '57_3', '045@162a3-045@174b2', '130_3' ],
  [ '57_4', '045@174b2-045@185b3', '130_4' ],
  [ '57_5', '045@185b3-045@197b5', '130_5' ],
  [ '57_6', '045@197b5-045@209a4', '130_6' ],
  [ '57_7', '045@209a4-045@220a4', '130_7' ],
  [ '57_8', '045@220a4-045@232b3', '130_8' ],
  [ '57_9', '045@232b3-045@242b4', '130_9' ],
  [ '57_10', '045@242b4-045@254a2', '130_10' ],
  [ '57_11', '045@254a2-045@265a1', '130_11' ],
  [ '57_12', '045@265a1-045@278a4', '130_12' ],
  [ '57_13', '045@278a4-045@289a8', '130_13' ],
  [ '57_14', '045@289a8-045@303a2', '130_14' ],
  [ '57_15', '045@303a2-045@313a8', '130_15' ],
  [ '58_1', '046@001b2-046@014a1', '131_1' ],
  [ '58_2', '046@014a1-046@027b3', '131_2' ],
  [ '58_3', '046@027b3-046@044a7', '131_3' ],
  [ '58_4', '046@044a7-046@056b6', '131_4' ],
  [ '58_5', '046@056b6-046@068b7', '131_5' ],
  [ '58_6', '046@068b7-046@083b8', '131_6' ],
  [ '58_7', '046@083b8-046@098b8', '131_7' ],
  [ '58_8', '046@098b8-046@113b5', '131_8' ],
  [ '58_9', '046@113b5-046@129b8', '131_9' ],
  [ '58_10', '046@129b8-046@145b4', '131_10' ],
  [ '58_11', '046@145b4-046@161a1', '131_11' ],
  [ '58_12', '046@161a1-046@180b1', '131_12' ],
  [ '58_13', '046@180b1-046@198a2', '131_13' ],
  [ '59', '046@198a2-212b3', '132' ],
  [ '60', '046@212b3-217a1', '133' ],
  [ '61_1', '046@217a2-046@228a4', '134_1' ],
  [ '61_2', '046@228a4-046@239a5', '134_2' ],
  [ '61_3', '046@239a5-046@251b2', '134_3' ],
  [ '61_4', '046@251b2-046@265a6', '134_4' ],
  [ '62_1', '046@265a7-046@275a5', '135_1' ],
  [ '62_2', '046@275a5-046@285a7', '135_2' ],
  [ '62_3', '046@285a7-046@295b8', '135_3' ],
  [ '62_4', '046@295b8-046@307b8', '135_4' ],
  [ '63', '046@308a1-316a8', '136' ],
  [ '64_1', '047@001b1-047@015a1', '137_1' ],
  [ '64_2', '047@015a1-047@027a1', '137_2' ],
  [ '64_3', '047@027a1-047@040a5', '137_3' ],
  [ '64_4', '047@040a5-047@053a8', '137_4' ],
  [ '64_5', '047@053a8-047@065b7', '137_5' ],
  [ '64_6', '047@065b7-047@077b5', '137_6' ],
  [ '64_7', '047@077b5-047@091a7', '137_7' ],
  [ '64_8', '047@091a7-047@105b1', '137_8' ],
  [ '64_9', '047@105b1-047@120a8', '137_9' ],
  [ '64_10', '047@120a8-047@131b4', '137_10' ],
  [ '64_11', '047@131b4-047@145a1', '137_11' ],
  [ '64_12', '047@145a1-047@159a2', '137_12' ],
  [ '64_13', '047@159a2-047@172a1', '137_13' ],
  [ '64_14', '047@172a1-047@185a6', '137_14' ],
  [ '64_15', '047@185a6-047@196a7', '137_15' ],
  [ '64_16', '047@196a7-047@208b2', '137_16' ],
  [ '64_17', '047@208b2-047@220b8', '137_17' ],
  [ '64_18', '047@220b8-047@232b8', '137_18' ],
  [ '64_19', '047@232b8-047@245a3', '137_19' ],
  [ '64_20', '047@245a3-047@259a4', '137_20' ],
  [ '64_21', '047@259a4-047@270b4', '137_21' ],
  [ '64_22', '047@270b4-047@282a3', '137_22' ],
  [ '64_23', '047@282a3-047@292a8', '137_23' ],
  [ '64_24', '047@292a8-047@303b7', '137_24' ],
  [ '64_25', '047@303b7-047@315b8', '137_25' ],
  [ '64_26', '047@315b8-047@328a8', '137_26' ],
  [ '64_27', '047@328a8-047@343b1', '137_27' ],
  [ '64_28', '047@343b1-048@001b1', '137_28' ],
  [ '64_29', '048@001b1-048@013a7', '137_29' ],
  [ '64_30', '048@013a7-048@025a3', '137_30' ],
  [ '64_31', '048@025a3-048@036b4', '137_31' ],
  [ '64_32', '048@036b4-048@049a5', '137_32' ],
  [ '64_33', '048@049a5-048@062a2', '137_33' ],
  [ '64_34', '048@062a2-048@074b4', '137_34' ],
  [ '64_35', '048@074b4-048@086a2', '137_35' ],
  [ '64_36', '048@086a2-048@097b4', '137_36' ],
  [ '64_37', '048@097b4-048@109a8', '137_37' ],
  [ '64_38', '048@109a8-048@122a1', '137_38' ],
  [ '64_39', '048@122a1-048@135b6', '137_39' ],
  [ '64_40', '048@135b6-048@148b7', '137_40' ],
  [ '64_41', '048@148b7-048@162a7', '137_41' ],
  [ '64_42', '048@162a7-048@172b4', '137_42' ],
  [ '64_43', '048@172b4-048@183b4', '137_43' ],
  [ '64_44', '048@183b4-048@195a3', '137_44' ],
  [ '64_45', '048@195a3-048@206b2', '137_45' ],
  [ '64_46', '048@206b2-048@218a8', '137_46' ],
  [ '64_47', '048@218a8-048@229b1', '137_47' ],
  [ '64_48', '048@229b1-048@241b3', '137_48' ],
  [ '64_49', '048@241b3-048@253b2', '137_49' ],
  [ '64_50', '048@253b2-048@264a4', '137_50' ],
  [ '64_51', '048@264a4-048@274a6', '137_51' ],
  [ '64_52', '048@274a6-048@287a1', '137_52' ],
  [ '64_53', '048@287a1-048@299b8', '137_53' ],
  [ '64_54', '048@299b8-048@311a7', '137_54' ],
  [ '64_55', '048@311a7-048@323a3', '137_55' ],
  [ '64_56', '048@323a3-048@332a7', '137_56' ],
  [ '65_1', '049@001b3-049@014b3', '138_1' ],
  [ '65_2', '049@014b3-049@026b2', '138_2' ],
  [ '65_3', '049@026b2-049@040a7', '138_3' ],
  [ '65_4', '049@040a7-049@050b6', '138_4' ],
  [ '65_5', '049@050b6-049@062b2', '138_5' ],
  [ '65_6', '049@062b2-049@073a6', '138_6' ],
  [ '65_7', '049@073a6-049@084a2', '138_7' ],
  [ '65_8', '049@084a2-049@095a3', '138_8' ],
  [ '65_9', '049@095a3-049@106a6', '138_9' ],
  [ '65_10', '049@106a6-049@116b1', '138_10' ],
  [ '65_11', '049@116b1-049@127a1', '138_11' ],
  [ '65_12', '049@127a1-049@137a2', '138_12' ],
  [ '65_13', '049@137a2-0', '138_13' ],
  [ '66', '049@147b7-148b5', '139' ],
  [ '67', '049@148b5-149a6', '140' ],
  [ '68_1', '049@149a5-049@163a6', '141_1' ],
  [ '68_2', '049@163a6-049@175b2', '141_2' ],
  [ '68_3', '049@175b2-049@189a7', '141_3' ],
  [ '68_4', '049@189a7-049@204a2', '141_4' ],
  [ '69_1', '049@204a2-049@214b7', '142_1' ],
  [ '69_2', '049@214b7-049@225b7', '142_2' ],
  [ '69_3', '049@225b7-049@237a6', '142_3' ],
  [ '69_4', '049@237a6-049@247a6', '142_4' ],
  [ '69_5', '049@247a6-049@256b6', '142_5' ],
  [ '69_6', '049@256b6-049@267a1', '142_6' ],
  [ '69_7', '049@267a1-049@278a8', '142_7' ],
  [ '70', '049@278a8-279a8', '143' ],
  [ '71', '049@279a8-282a8', '144' ],
  [ '72_1', '050@001b3-050@013a8', '145_1' ],
  [ '72_2', '050@013a8-050@026b7', '145_2' ],
  [ '72_3', '050@026b7-050@038a7', '145_3' ],
  [ '72_4', '050@038a7-050@050b1', '145_4' ],
  [ '72_5', '050@050b1-050@062a8', '145_5' ],
  [ '72_6', '050@062a8-050@076b1', '145_6' ],
  [ '72_7', '050@076b1-050@089a3', '145_7' ],
  [ '72_8', '050@089a3-050@099b1', '145_8' ],
  [ '72_9', '050@099b1-050@110a7', '145_9' ],
  [ '72_10', '050@110a7-050@122b4', '145_10' ],
  [ '72_11', '050@122b4-050@133b6', '145_11' ],
  [ '72_12', '050@133b6-050@145b2', '145_12' ],
  [ '72_13', '050@145b2-050@159b1', '145_13' ],
  [ '72_14', '050@159b1-050@170a3', '145_14' ],
  [ '72_15', '050@170a3-050@180a4', '145_15' ],
  [ '73', '050@180b1-184a2', '146' ],
  [ '74_1', '050@184a3-050@195b4', '147_1' ],
  [ '74_2', '050@195b4-050@206a5', '147_2' ],
  [ '74_3', '050@206a5-050@218b4', '147_3' ],
  [ '75', '050@218b5-239b6', '148' ],
  [ '76_1', '050@240a1-050@253a4', '149_1' ],
  [ '76_2', '050@253a4-050@265a7', '149_2' ],
  [ '77_1', '050@265a8-050@278a4', '150_1' ],
  [ '77_2', '050@278a4-050@292b5', '150_2' ],
  [ '77_3', '050@292b5-050@305a4', '150_3' ],
  [ '77_4', '050@305a4-050@317a8', '150_4' ],
  [ '77_5', '050@317a8-050@331a7', '150_5' ],
  [ '78_1', '051@001b3-051@012b4', '151_1' ],
  [ '78_2', '051@012b4-051@023a2', '151_2' ],
  [ '78_3', '051@023a2-051@034b4', '151_3' ],
  [ '78_4', '051@034b4-051@045a1', '151_4' ],
  [ '78_5', '051@045a1-051@055a1', '151_5' ],
  [ '78_6', '051@055a1-051@065b6', '151_6' ],
  [ '78_7', '051@065b6-051@076b8', '151_7' ],
  [ '79_1', '051@077a1-051@089a7', '152_1' ],
  [ '79_2', '051@089a7-051@104a1', '152_2' ],
  [ '79_3', '051@104a1-051@116b4', '152_3' ],
  [ '79_4', '051@116b4-051@131a6', '152_4' ],
  [ '80_1', '051@131a7-051@144b7', '153_1' ],
  [ '80_2', '051@144b7-051@156a7', '153_2' ],
  [ '81_1', '051@156a8-051@169b1', '154_1' ],
  [ '81_2', '051@169b1-051@183a1', '154_2' ],
  [ '81_3', '051@183a1-051@196a2', '154_3' ],
  [ '82', '051@196a2-204b8', '155' ],
  [ '83_1', '051@205a1-051@214a2', '156_1' ],
  [ '83_2', '051@214a2-051@225a1', '156_2' ],
  [ '83_3', '051@225a1-051@234b4', '156_3' ],
  [ '83_4', '051@234b4-051@245a6', '156_4' ],
  [ '83_5', '051@245a6-051@255b3', '156_5' ],
  [ '83_6', '051@255b3-051@269a8', '156_6' ],
  [ '83_7', '051@269a8-051@279a7', '156_7' ],
  [ '83_8', '051@279a7-051@299b7', '156_8' ],
  [ '84', '051@299b7-311a6', '157' ],
  [ '85', '051@311a7-320b4', '158' ],
  [ '86', '051@320b4-321a8', '159' ],
  [ '87', '052@001b1-006a4', '160' ],
  [ '88', '052@006a5-006b4', '161' ],
  [ '89_1', '052@006b5-052@018b6', '162_1' ],
  [ '89_2', '052@018b6-052@033b4', '162_2' ],
  [ '90', '052@033b4-093a6', '164' ],
  [ '91_1', '052@093a7-052@105b8', '165_1' ],
  [ '91_2', '052@105b8-052@119a6', '165_2' ],
  [ '91_3', '052@119a6-052@136b1', '165_3' ],
  [ '91_4', '052@136b1-052@151a4', '165_4' ],
  [ '91_5', '052@151a4-052@164b1', '165_5' ],
  [ '91_6', '052@164b1-052@178a4', '165_6' ],
  [ '91_7', '052@178a4-0', '165_7' ],
  [ '92_1', '052@189b7-052@201b5', '166_1' ],
  [ '92_2', '052@201b5-052@215b3', '166_2' ],
  [ '92_3', '052@215b3-052@226b2', '166_3' ],
  [ '92_4', '052@226b2-052@238a5', '166_4' ],
  [ '92_5', '052@238a5-052@248a2', '166_5' ],
  [ '92_6', '052@248a2-052@257a2', '166_6' ],
  [ '92_7', '052@257a2-052@268b4', '166_7' ],
  [ '92_8', '052@268b4-052@277b5', '166_8' ],
  [ '93', '052@277b5-278a7', '167' ],
  [ '94', '052@278a8-279a2', '168' ],
  [ '95', '052@279a2-292a7', '169' ],
  [ '96_1', '053@001b3-053@015a2', '170_1' ],
  [ '96_2', '053@015a2-053@029a1', '170_2' ],
  [ '96_3', '053@029a1-053@042b1', '170_3' ],
  [ '96_4', '053@042b1-053@054b7', '170_4' ],
  [ '96_5', '053@054b7-053@066a3', '170_5' ],
  [ '96_6', '053@066a3-053@078b1', '170_6' ],
  [ '96_7', '053@078b1-053@092b1', '170_7' ],
  [ '96_8', '053@092b1-053@104b2', '170_8' ],
  [ '96_9', '053@104b2-053@118a8', '170_9' ],
  [ '96_10', '053@118a8-053@130b6', '170_10' ],
  [ '97_1', '053@130b7-053@145b5', '171_1' ],
  [ '97_2', '053@145b5-053@159a8', '171_2' ],
  [ '97_3', '053@159a8-053@173b8', '171_3' ],
  [ '97_4', '053@173b8-053@187a4', '171_4' ],
  [ '97_5', '053@187a4-053@199a8', '171_5' ],
  [ '97_6', '053@199a8-053@209a4', '171_6' ],
  [ '97_7', '053@209a4-053@222a1', '171_7' ],
  [ '98', '053@222a1-230b3', '172' ],
  [ '99', '053@230b3-231a5', '173' ],
  [ '100', '053@231a5-285a1', '174' ],
  [ '101_1', '053@285a2-053@298a4', '175_1' ],
  [ '101_2', '053@298a4-053@310b7', '175_2' ],
  [ '101_3', '053@310b7-053@326a8', '175_3' ],
  [ '101_4', '053@326a8-053@343a4', '175_4' ],
  [ '101_5', '053@343a4-053@359a8', '175_5' ],
  [ '102', '054@001b1-010b3', '176' ],
  [ '103', '054@010b3-023a4', '177' ],
  [ '104_1', '054@023a5-054@037b4', '178_1' ],
  [ '104_2', '054@037b4-054@051b8', '178_2' ],
  [ '104_3', '054@051b8-054@065b6', '178_3' ],
  [ '104_4', '054@065b6-054@078b5', '178_4' ],
  [ '104_5', '054@078b5-054@091b3', '178_5' ],
  [ '104_6', '054@091b3-059@100b7', '178_6' ],
  [ '105_1', '054@106a3-054@118b7', '179_1' ],
  [ '105_2', '054@118b7-054@130b8', '179_2' ],
  [ '105_3', '054@130b8-054@144a7', '179_3' ],
  [ '106', '054@144a7-148b2', '180' ],
  [ '107', '054@148b2-163b8', '181' ],
  [ '108', '054@164a1-171a6', '182' ],
  [ '109', '054@171a6-175a6', '183' ],
  [ '110', '054@175a6-178b4', '184' ],
  [ '111_1', '054@178b5-054@188b1', '185_1' ],
  [ '111_2', '054@188b1-054@200b1', '185_2' ],
  [ '111_3', '054@200b1-054@213b5', '185_3' ],
  [ '112_1', '054@213b1-054@225b2', '186_1' ],
  [ '112_2', '054@225b2-054@236b2', '186_2' ],
  [ '112_3', '054@236b2-054@247b1', '186_3' ],
  [ '112_4', '054@247b1-054@260a5', '186_4' ],
  [ '113_1', '054@260a6-054@272a7', '187_1' ],
  [ '113_2', '054@272a7-054@283a8', '187_2' ],
  [ '113_3', '054@283a8-054@295a8', '187_3' ],
  [ '113_4', '054@295a8-054@305a1', '187_4' ],
  [ '114', '054@305a1-307b7', '188' ],
  [ '115', '054@307b8-312a3', '189' ],
  [ '116', '055@001b1-005b2', '190' ],
  [ '117', '055@005b3-007b5', '191' ],
  [ '118_1', '055@007b6-055@026a8', '192_1' ],
  [ '118_2', '055@026a8-055@046a7', '192_2' ],
  [ '118_3', '055@046a7-055@064a6', '192_3' ],
  [ '118_4', '055@064a6-055@080b5', '192_4' ],
  [ '119_1', '055@080b6-055@094a6', '193_1' ],
  [ '119_2', '055@094a6-055@107b6', '193_2' ],
  [ '119_3', '055@107b6-055@122b4', '193_3' ],
  [ '119_4', '055@122b4-055@138a8', '193_4' ],
  [ '119_5', '055@138a8-055@154b3', '193_5' ],
  [ '119_6', '055@154b3-055@170a7', '193_6' ],
  [ '119_7', '055@170a7-055@184a7', '193_7' ],
  [ '120_1', '055@184a8-055@195a7', '194_1' ],
  [ '120_2', '055@195a7-055@211a4', '194_2' ],
  [ '120_3', '055@211a4-055@229b3', '194_3' ],
  [ '120_4', '055@229b3-055@249b3', '194_4' ],
  [ '120_5', '055@249b3-055@260a3', '194_5' ],
  [ '121', '055@260a3-261a1', '195' ],
  [ '122', '055@261a1-265a6', '196' ],
  [ '123_1', '055@265a8-055@278a4', '197_1' ],
  [ '123_2', '055@278a4-055@291a3', '197_2' ],
  [ '124_1', '055@291a4-055@302a5', '198_1' ],
  [ '124_2', '055@302a5-055@314b6', '198_2' ],
  [ '124_3', '055@314b6-055@325a7', '198_3' ],
  [ '125_1', '056@001b3-056@090b1', '199_1' ],
  [ '127', '056@011a4-112b2', '201' ],
  [ '125_2', '056@019a4-056@037b2', '199_2' ],
  [ '125_3', '056@037b2-056@051b4', '199_3' ],
  [ '125_4', '056@051b4-056@064b1', '199_4' ],
  [ '125_5', '056@064b1-056@076b5', '199_5' ],
  [ '125_6', '056@076b5-056@090b1', '199_6' ],
  [ '126', '056@090b1-111a4', '200' ],
  [ '128', '056@112b2-122b1', '202' ],
  [ '129_1', '056@122b2-056@137a5', '203_1' ],
  [ '129_2', '056@137a5-056@150a1', '203_2' ],
  [ '129_3', '056@150a1-056@164a8', '203_3' ],
  [ '130', '056@164b1-180a8', '204' ],
  [ '131_1', '056@180b1-056@192a4', '205_1' ],
  [ '131_2', '056@192a4-056@206b1', '205_2' ],
  [ '131_3', '056@206b1-056@217b8', '205_3' ],
  [ '132', '056@217b8-227a6', '206' ],
  [ '133', '056@227a7-229a1', '207' ],
  [ '134_1', '056@229a2-056@242a7', '208_1' ],
  [ '134_2', '056@242a7-056@254b8', '208_2' ],
  [ '135', '056@255a1-275a4', '209' ],
  [ '136', '056@275a5-277b6', '210' ],
  [ '137', '056@277b7-282a3', '211' ],
  [ '138', '056@282a3-282b5', '212' ],
  [ '139', '056@282b5-298b3', '213' ],
  [ '140', '056@298b3-304a3', '214' ],
  [ '141', '056@304a3-307b3', '215' ],
  [ '142_1', '056@307b4-056@319b3', '216_1' ],
  [ '142_2', '056@319b3-056@331a3', '216_2' ],
  [ '143', '056@331a4-336a8', '218' ],
  [ '144_1', '057@001b2-057@014a6', '219_1' ],
  [ '144_2', '057@014a6-057@026b8', '219_2' ],
  [ '144_3', '057@026b8-057@039b8', '219_3' ],
  [ '144_4', '057@039b8-057@056b2', '219_4' ],
  [ '144_5', '057@056b2-057@072b8', '219_5' ],
  [ '145', '057@072b8-089a3', '220' ],
  [ '146', '057@089a4-092b6', '221' ],
  [ '147', '057@092b6-104b1', '222' ],
  [ '148', '057@104b1-106a7', '223' ],
  [ '150_1', '057@106a7-057@124a7', '225_1' ],
  [ '149', '057@106a7-108a2', '224' ],
  [ '151', '057@124a7-127a6', '226' ],
  [ '152', '057@127a6-131b7', '227' ],
  [ '153', '057@131b7-140a8', '228' ],
  [ '154', '057@140a8-142a7', '229' ],
  [ '155', '057@142a7-143b8', '230' ],
  [ '156_1', '057@144a1-057@160a2', '231_1' ],
  [ '156_2', '057@160a2-057@169a8', '231_2' ],
  [ '156_3', '057@169a8-057@181b6', '231_3' ],
  [ '156_4', '057@181b6-057@193b4', '231_4' ],
  [ '156_5', '057@193b4-057@206a6', '231_5' ],
  [ '156_6', '057@206a6-0', '231_6' ],
  [ '155_7', '057@218a3-057@143b8', '230_7' ],
  [ '157', '057@229b4-233a3', '232' ],
  [ '158', '057@233a3-234b2', '233' ],
  [ '159_1', '057@234b3-057@245b7', '234_1' ],
  [ '159_2', '057@245b7-057@257a7', '234_2' ],
  [ '159_3', '057@257a7-057@269b2', '234_3' ],
  [ '159_4', '057@269b2-057@281a5', '234_4' ],
  [ '159_5', '057@281a5-0', '234_5' ],
  [ '160', '057@295a7-311b4', '235' ],
  [ '161', '057@311b4-327b4', '236' ],
  [ '163_1', '057@327b4-058@086b8', '238_1' ],
  [ '162', '057@327b4-339a8', '237' ],
  [ '163_1', '058@001b2-058@013a6', '238_1' ],
  [ '163_2', '058@013a6-058@024b6', '238_2' ],
  [ '163_3', '058@024b6-058@037a5', '238_3' ],
  [ '163_4', '058@037a5-058@050a2', '238_4' ],
  [ '163_5', '058@050a2-058@061b8', '238_5' ],
  [ '163_6', '058@061b8-058@074a3', '238_6' ],
  [ '163_7', '058@074a3-058@086b8', '238_7' ],
  [ '164', '058@087a1-093b8', '239' ],
  [ '165_1', '058@094a1-058@104b8', '240_1' ],
  [ '165_2', '058@104b8-058@115a1', '240_2' ],
  [ '165_3', '058@115a1-058@124b5', '240_3' ],
  [ '165_4', '058@124b5-058@134a4', '240_4' ],
  [ '165_5', '058@134a4-058@142a1', '240_5' ],
  [ '166_1', '058@142a2-058@155b7', '241_1' ],
  [ '166_2', '058@155b7-058@169b7', '241_2' ],
  [ '166_3', '058@169b7-058@184b3', '241_3' ],
  [ '167', '058@184b4-195b1', '242' ],
  [ '168', '058@195b1-196b8', '243' ],
  [ '169', '058@197a1-198b8', '244' ],
  [ '170', '058@199a1-211b7', '245' ],
  [ '171_1', '058@211b8-058@225b2', '246_1' ],
  [ '171_2', '058@225b2-058@239a7', '246_2' ],
  [ '171_3', '058@239a7-058@252a3', '246_3' ],
  [ '172_1', '058@252a3-058@267a5', '247_1' ],
  [ '172_2', '058@267a5-058@282b5', '247_2' ],
  [ '172_3', '058@282b5-058@295b2', '247_3' ],
  [ '173_1', '058@295b3-058@307b3', '248_1' ],
  [ '173_2', '058@307b3-058@319b7', '248_2' ],
  [ '173_3', '058@319b7-058@331a6', '248_3' ],
  [ '174', '059@001b1-134b7', '249' ],
  [ '175', '059@134b8-257b4', '250' ],
  [ '176_1', '059@257b4-059@300b1', '_1' ],
  [ '176a', '059@257b4-295a3', '251' ],
  [ '176b', '059@295a4-300b1', '252' ],
  [ '177', '059@300b1-315a6', '253' ],
  [ '178', '059@315a6-342a1', '254' ],
  [ '179', '059@342a1-355a7', '255' ],
  [ '180', '060@001b1-108a8', '256' ],
  [ '181', '060@108b1-262a3', '257' ],
  [ '182', '060@262a3-330b4', '258' ],
  [ '183', '060@330b5-332b2', '259' ],
  [ '184', '060@332b2-336a8', '260' ],
  [ '185', '061@001b1-016a7', '261' ],
  [ '186', '061@016a8-029b8', '262' ],
  [ '187', '061@030a1-035b6', '263' ],
  [ '188', '061@035b7-043b5', '264' ],
  [ '189', '061@043b6-047b3', '265' ],
  [ '190', '061@047b4-061a2', '266' ],
  [ '191', '061@061a2-061b4', '267' ],
  [ '192', '061@061b4-062a5', '268' ],
  [ '193', '061@062a5-062b7', '269' ],
  [ '194', '061@062b8-072a2', '270' ],
  [ '195', '061@072a3-073a6', '271' ],
  [ '196', '061@073a6-073b5', '272' ],
  [ '197', '061@073b6-077a2', '273' ],
  [ '198', '061@077a2-095b8', '274' ],
  [ '199', '061@096a1-261b3', '275' ],
  [ '200', '061@261b4-276b6', '276' ],
  [ '201', '061@276b7-281b4', '277' ],
  [ '202a', '061@281b5-302a6', '278' ],
  [ '203_1', '061@302a7-062@091a3', '280_1' ],
  [ '202b', '061@302a7-331a7', '279' ],
  [ '204', '062@091a3-222a6', '281' ],
  [ '205', '062@222a6-279a2', '282' ],
  [ '206', '062@279a2-305a2', '283' ],
  [ '207', '062@305a2-340a7', '284' ],
  [ '208', '063@001b1-005a4', '285' ],
  [ '209', '063@005a4-006b3', '286' ],
  [ '210', '063@006b3-013a4', '287' ],
  [ '211', '063@013a4-017a6', '288' ],
  [ '212', '063@017a6-021a3', '289' ],
  [ '213', '063@021a3-025b8', '290' ],
  [ '214', '063@026a1-029a8', '291' ],
  [ '215', '063@029a8-035b2', '292' ],
  [ '216', '063@035b2-044b1', '293' ],
  [ '217', '063@044b1-049b6', '294' ],
  [ '218', '063@049b7-052b6', '295' ],
  [ '219', '063@052b6-054b6', '296' ],
  [ '220', '063@054b6-055a8', '297' ],
  [ '221', '063@055a8-055b3', '298' ],
  [ '223_1', '063@055b3-063@056a3', '300_1' ],
  [ '222', '063@055b3-055b6', '299' ],
  [ '224', '063@056a4-057a2', '301' ],
  [ '225', '063@057a2-076b8', '302' ],
  [ '226', '063@077a1-079b5', '303' ],
  [ '227', '063@079b5-081b7', '304' ],
  [ '228_1', '063@082a1-063@094a6', '305_1' ],
  [ '228_2', '063@094a6-063@107a3', '305_2' ],
  [ '228_3', '063@107a3-063@118b4', '305_3' ],
  [ '228_4', '063@118b4-063@130a2', '305_4' ],
  [ '228_5', '063@130a2-063@142b6', '305_5' ],
  [ '228_6', '063@142b6-063@155a3', '305_6' ],
  [ '228_7', '063@155a3-063@167b2', '305_7' ],
  [ '228_8', '063@167b2-063@180a3', '305_8' ],
  [ '228_9', '063@180a3-063@193a5', '305_9' ],
  [ '228_10', '063@193a5-063@206b6', '305_10' ],
  [ '228_11', '063@206b6-063@219b4', '305_11' ],
  [ '228_12', '063@219b4-063@232a7', '305_12' ],
  [ '228_13', '063@232a7-063@244a3', '305_13' ],
  [ '228_14', '063@244a3-063@256a4', '305_14' ],
  [ '228_15', '063@256a4-063@268b7', '305_15' ],
  [ '228_16', '063@268b7-063@280b7', '305_16' ],
  [ '228_17', '063@280b7-063@293a5', '305_17' ],
  [ '228_18', '063@293a5-063@305b5', '305_18' ],
  [ '228_19', '063@305b5-063@317a8', '305_19' ],
  [ '228_20', '063@317a8-064@001b1', '305_20' ],
  [ '228_21', '064@001b1-064@013b1', '305_21' ],
  [ '228_22', '064@013b1-064@025b4', '305_22' ],
  [ '228_23', '064@025b4-064@037a1', '305_23' ],
  [ '228_24', '064@037a1-064@049b2', '305_24' ],
  [ '228_25', '064@049b2-064@061b7', '305_25' ],
  [ '228_26', '064@061b7-064@074b1', '305_26' ],
  [ '228_27', '064@074b1-064@087a2', '305_27' ],
  [ '228_28', '064@087a2-064@099b7', '305_28' ],
  [ '228_29', '064@099b7-064@119a1', '305_29' ],
  [ '228_30', '064@119a1-064@132a2', '305_30' ],
  [ '228_31', '064@132a2-064@145a3', '305_31' ],
  [ '228_32', '064@145a3-064@157b1', '305_32' ],
  [ '228_33', '064@157b1-064@169a4', '305_33' ],
  [ '228_34', '064@169a4-064@182a2', '305_34' ],
  [ '228_35', '064@182a2-064@195b5', '305_35' ],
  [ '228_36', '064@195b5-064@208b4', '305_36' ],
  [ '228_37', '064@208b4-064@225a5', '305_37' ],
  [ '228_38', '064@225a5-064@238b3', '305_38' ],
  [ '228_39', '064@238b3-064@251a4', '305_39' ],
  [ '228_40', '064@251a4-064@262b4', '305_40' ],
  [ '228_41', '064@262b4-064@274b8', '305_41' ],
  [ '228_42', '064@274b8-064@287a4', '305_42' ],
  [ '228_43', '064@287a4-064@299b8', '305_43' ],
  [ '228_44', '064@299b8-064@311a3', '305_44' ],
  [ '228_45', '064@311a3-065@001b1', '305_45' ],
  [ '228_46', '065@001b1-065@023b4', '305_46' ],
  [ '228_47', '065@023b4-065@047b2', '305_47' ],
  [ '228_48', '065@047b2-065@108b1', '305_48' ],
  [ '228_49', '065@108b1-065@139b8', '305_49' ],
  [ '228_50', '065@139b8-065@149a2', '305_50' ],
  [ '228_51', '065@149a2-065@167b6', '305_51' ],
  [ '228_52', '065@167b6-065@208b1', '305_52' ],
  [ '228_53', '065@208b1-065@210b2', '305_53' ],
  [ '228_54', '065@210b2-065@238a6', '305_54' ],
  [ '228_55', '065@238a6-066@001a1', '305_55' ],
  [ '228_56', '066@001a1-066@020a7', '305_56' ],
  [ '228_57', '066@020a7-066@086a5', '305_57' ],
  [ '228_58', '066@086a5-066@111b2', '305_58' ],
  [ '228_59', '066@111b2-066@251b1', '305_59' ],
  [ '229', '066@251b2-267b8', '306' ],
  [ '230', '066@268a1-275a1', '307' ],
  [ '231', '066@275a1-278b7', '308' ],
  [ '232', '066@278b8-288a2', '309' ],
  [ '233', '066@288a3-292a1', '310' ],
  [ '234', '066@292a1-293b8', '311' ],
  [ '235', '066@294a1-303b1', '312' ],
  [ '236', '066@303b1-326a1', '313' ],
  [ '237', '066@326a1-327b3', '314' ],
  [ '238a', '066@327b3-332b3', '315' ],
  [ '238_1', '066@327b4-066@335a5', '_1' ],
  [ '238b', '066@332b3-335a5', '316' ],
  [ '239', '066@335a5-336a6', '317' ],
  [ '240', '066@336a7-337a7', '318' ],
  [ '241_1', '067@001b2-067@021a1', '319_1' ],
  [ '241_2', '067@021a1-067@041a1', '319_2' ],
  [ '241_3', '067@041a1-067@061a1', '319_3' ],
  [ '241_4', '067@061a1-067@081a1', '319_4' ],
  [ '241_5', '067@081a1-067@101a1', '319_5' ],
  [ '241_6', '067@101a1-067@121a1', '319_6' ],
  [ '241_7', '067@121a1-067@134a5', '319_7' ],
  [ '242', '067@134a6-135b7', '320' ],
  [ '243', '067@135b7-136b5', '321' ],
  [ '244', '067@136b6-139b2', '322' ],
  [ '245', '067@139b3-140a7', '323' ],
  [ '246', '067@140a7-152b8', '324' ],
  [ '247', '067@152b8-159b5', '325' ],
  [ '248', '067@159b6-169a4', '326' ],
  [ '249', '067@169a5-169b8', '327' ],
  [ '250', '067@169b8-171a6', '328' ],
  [ '251', '067@171a6-171b4', '329' ],
  [ '252', '067@171b5-175b3', '330' ],
  [ '253', '067@175b4-178a2', '331' ],
  [ '254', '067@178a2-183b5', '332' ],
  [ '255', '067@183b6-184b1', '333' ],
  [ '256', '067@184b1-185a5', '334' ],
  [ '257', '067@185a5-202b1', '335' ],
  [ '258', '067@202b2-208a2', '336' ],
  [ '259', '067@208a2-211a5', '337' ],
  [ '260', '067@211a5-213a3', '338' ],
  [ '261', '067@213a3-215b2', '339' ],
  [ '262', '067@215b2-218a7', '340' ],
  [ '263', '067@218a7-218b1', '341' ],
  [ '265_1', '067@218b2-067@223a3', '343_1' ],
  [ '264', '067@218b2-218b5', '342' ],
  [ '266', '067@223a3-270a2', '344' ],
  [ '267', '067@270a3-271a7', '345' ],
  [ '268', '067@271a7-274a5', '346' ],
  [ '269', '067@274a5-275b6', '347' ],
  [ '270', '067@275b7-276b3', '348' ],
  [ '271', '067@276b3-277a5', '349' ],
  [ '272', '067@277a5-281a1', '350' ],
  [ '273', '067@281a1-285b1', '351' ],
  [ '274', '067@285b1-288b2', '352' ],
  [ '275', '067@288b2-291b7', '353' ],
  [ '276', '067@291b7-292b5', '354' ],
  [ '277', '067@292b5-294b2', '355' ],
  [ '278', '067@294b3-316b1', '357' ],
  [ '279', '067@316b1-328a8', '358' ],
  [ '280_1', '068@001b1-068@018a5', '360_1' ],
  [ '280_2', '068@018a5-068@034b1', '360_2' ],
  [ '280_3', '068@034b1-068@046a1', '360_3' ],
  [ '280_4', '068@046a1-068@057a2', '360_4' ],
  [ '280_5', '068@057a2-068@070a7', '360_5' ],
  [ '280_6', '068@070a7-068@082a7', '360_6' ],
  [ '280_7', '068@082a7-068@097b1', '360_7' ],
  [ '280_8', '068@097b1-068@111a8', '360_8' ],
  [ '280_9', '068@111a8-068@126b6', '360_9' ],
  [ '280_10', '068@126b6-068@140a6', '360_10' ],
  [ '280_11', '068@140a6-068@150b3', '360_11' ],
  [ '280_12', '068@150b3-068@161a6', '360_12' ],
  [ '280_13', '068@161a6-068@171b8', '360_13' ],
  [ '280_14', '068@171b8-068@184b1', '360_14' ],
  [ '280_15', '068@184b1-068@198a3', '360_15' ],
  [ '280_16', '068@198a3-068@210a7', '360_16' ],
  [ '280_17', '068@210a7-068@220b5', '360_17' ],
  [ '280_18', '068@220b5-068@233a8', '360_18' ],
  [ '280_19', '068@233a8-068@245a5', '360_19' ],
  [ '280_20', '068@245a5-068@256a4', '360_20' ],
  [ '280_21', '068@256a4-068@269b7', '360_21' ],
  [ '280_22', '068@269b7-068@283a1', '360_22' ],
  [ '280_23', '068@283a1-068@293b2', '360_23' ],
  [ '280_24', '068@293b2-068@307b5', '360_24' ],
  [ '280_25', '068@307b5-068@319a5', '360_25' ],
  [ '280_26', '068@319a5-069@001b1', '360_26' ],
  [ '280_27', '069@001b1-069@014b4', '360_27' ],
  [ '280_28', '069@014b4-069@025b1', '360_28' ],
  [ '280_29', '069@025b1-069@038b2', '360_29' ],
  [ '280_30', '069@038b2-069@052b8', '360_30' ],
  [ '280_31', '069@052b8-069@067b6', '360_31' ],
  [ '280_32', '069@067b6-069@082a8', '360_32' ],
  [ '280_33', '069@082a8-069@095b6', '360_33' ],
  [ '280_34', '069@095b6-069@111a2', '360_34' ],
  [ '280_35', '069@111a2-069@122b4', '360_35' ],
  [ '280_36', '069@122b4-069@133b7', '360_36' ],
  [ '280_37', '069@133b7-069@147b6', '360_37' ],
  [ '281_1', '069@148b1-069@165a4', '361_1' ],
  [ '281_2', '069@165a4-069@177a6', '361_2' ],
  [ '281_3', '069@177a6-069@194a2', '361_3' ],
  [ '281_4', '069@194a2-069@208a2', '361_4' ],
  [ '281_5', '069@208a2-069@225b3', '361_5' ],
  [ '281_6', '069@225b3-069@240b3', '361_6' ],
  [ '281_7', '069@240b3-069@253b2', '361_7' ],
  [ '281_8', '069@253b2-069@267b7', '361_8' ],
  [ '281_9', '069@267b7-069@281a3', '361_9' ],
  [ '281_10', '069@281a3-069@300a2', '361_10' ],
  [ '281_11', '069@300a2-069@315b5', '361_11' ],
  [ '281_12', '069@315b5-069@333a5', '361_12' ],
  [ '282_1', '070@001b2-070@013b4', '363_1' ],
  [ '282_2', '070@013b4-070@029a5', '363_2' ],
  [ '282_3', '070@029a5-070@041b3', '363_3' ],
  [ '282_4', '070@041b3-070@053b7', '363_4' ],
  [ '282_5', '070@053b7-070@068b2', '363_5' ],
  [ '282_6', '070@068b2-070@080b6', '363_6' ],
  [ '282_7', '070@080b6-070@094b3', '363_7' ],
  [ '282_8', '070@094b3-070@105b4', '363_8' ],
  [ '282_9', '070@105b4-070@120b7', '363_9' ],
  [ '282_10', '070@120b7-070@132a5', '363_10' ],
  [ '282_11', '070@132a5-070@144b7', '363_11' ],
  [ '282_12', '070@144b7-070@158a1', '363_12' ],
  [ '282_13', '070@158a1-070@170b5', '363_13' ],
  [ '282_14', '070@170b5-070@183b5', '363_14' ],
  [ '282_15', '070@183b5-070@197b6', '363_15' ],
  [ '282_16', '070@197b6-070@212a8', '363_16' ],
  [ '282_17', '070@212a8-070@226a8', '363_17' ],
  [ '282_18', '070@226a8-070@243b4', '363_18' ],
  [ '282_19', '070@243b4-070@258a5', '363_19' ],
  [ '282_20', '070@258a5-070@274a3', '363_20' ],
  [ '282_21', '070@274a3-070@290a3', '363_21' ],
  [ '282_22', '070@290a3-070@309b7', '363_22' ],
  [ '283', '070@309b7-313b5', '364' ],
  [ '284', '070@313b6-315b5', '365' ],
  [ '285', '070@315b6-323a8', '366' ],
  [ '286', '071@001b1-022b3', '367' ],
  [ '287', '071@022b4-032a8', '368' ],
  [ '288', '071@032b1-052b6', '369' ],
  [ '289', '071@052b7-058b4', '370' ],
  [ '290', '071@058b4-074b4', '371' ],
  [ '291', '071@074b4-091b5', '372' ],
  [ '292_1', '071@091b6-071@107b5', '373_1' ],
  [ '292_2', '071@107b5-071@123b3', '373_2' ],
  [ '292_3', '071@123b3-071@138b2', '373_3' ],
  [ '292_4', '071@138b2-071@153b6', '373_4' ],
  [ '292_5', '071@153b6-071@168b1', '373_5' ],
  [ '292_6', '071@168b1-071@189b7', '373_6' ],
  [ '292_7', '071@189b7-071@203b8', '373_7' ],
  [ '293', '071@204a1-215b8', '374' ],
  [ '294', '071@215b8-224a1', '375' ],
  [ '295', '071@224a1-229a2', '376' ],
  [ '296', '071@229a2-242a2', '377' ],
  [ '297', '071@242a2-289b8', '378' ],
  [ '298', '071@289b8-294a7', '380' ],
  [ '299', '072@001b1-274a6', '61' ],
  [ '299', '073@001b1-285a5', '61' ],
  [ '299', '074@001b1-302a7', '61' ],
  [ '299', '075@001b1-257b3', '61' ],
  [ '299', '076@001b1-296a3', '61' ],
  [ '299', '077@001b1-281a6', '61' ],
  [ '300', '078@001b1-051a3', '62' ],
  [ '301', '078@051a3-112b6', '63' ],
  [ '302', '078@112b6-235b6', '64' ],
  [ '303', '078@235b6-276a2', '65' ],
  [ '304', '078@276a3-316a8', '66' ],
  [ '305', '079@001b1-077b3', '67' ],
  [ '306', '079@077b4-161b8', '68' ],
  [ '307', '079@161b8-189b8', '69' ],
  [ '308', '079@189b8-213b1', '70' ],
  [ '309', '079@213b1-225b7', '71' ],
  [ '310', '079@225b8-295a2', '72' ],
  [ '311', '079@295a2-340a3', '73' ],
  [ '311', '080@001b1-252a6', '73' ],
  [ '312', '080@252a6-288b6', '74' ],
  [ '313', '080@288b6-302a5', '75' ],
  [ '314', '080@302a6-357a2', '76' ],
  [ '315', '081@001b1-188a4', '77' ],
  [ '316', '081@188a4-257a5', '78' ],
  [ '317', '081@257a5-291b2', '79' ],
  [ '318', '081@291b3-327a8', '80' ],
  [ '319', '082@001b1-019b3', '81' ],
  [ '320', '082@019b4-038b8', '82' ],
  [ '321', '082@039a1-077a7', '83' ],
  [ '322', '082@077a7-128b7', '84' ],
  [ '323', '082@128b8-147b3', '85' ],
  [ '324', '082@147b3-172a4', '86' ],
  [ '325', '082@172a4-203b1', '87' ],
  [ '326', '082@203b1-218a7', '88' ],
  [ '327', '082@218a7-229a8', '89' ],
  [ '328', '082@229a8-241b5', '90' ],
  [ '329', '082@241b5-248b8', '91' ],
  [ '330', '082@249a1-253a5', '92' ],
  [ '331', '082@253a6-272a1', '93' ],
  [ '332', '082@272a2-295b5', '94' ],
  [ '333', '082@295b5-300b7', '95' ],
  [ '334', '082@300b7-322b7', '96' ],
  [ '335', '082@322b7-351a8', '97' ],
  [ '335', '083@001b1-027a3', '97' ],
  [ '336', '083@027a3-029b8', '98' ],
  [ '337', '083@030a1-074b6', '99' ],
  [ '338', '083@074b6-102b7', '100' ],
  [ '339', '083@102b7-113a1', '101' ],
  [ '340', '083@113a1-125b4', '102' ],
  [ '341', '083@125b5-128b5', '103' ],
  [ '342', '083@128b5-164b6', '104' ],
  [ '343', '083@164b6-189b5', '105' ],
  [ '344', '083@189b5-197a3', '106' ],
  [ '345', '083@197a3-226a8', '107' ],
  [ '346', '083@226a8-277a1', '108' ],
  [ '347', '083@277a1-303a4', '109' ],
  [ '348', '083@303a4-327a7', '110' ],
  [ '349', '084@001b1-014a4', '385' ],
  [ '350', '084@015a1-024a2', '386' ],
  [ '351', '084@025a1-144a5', '387' ],
  [ '352a', '084@145a1-161b5', '388' ],
  [ '352b', '084@161b6-164a1', '389' ],
  [ '353', '084@164a1-168a5', '390' ],
  [ '354a', '084@168a5-213a2', '391' ],
  [ '354b', '084@213a2-234b7', '392' ],
  [ '355a', '084@235a1-248a8', '440a' ],
  [ '355b', '084@248a8-266a4', '440b' ],
  [ '356', '084@266a4-304b6', '441' ],
  [ '357', '084@304b6-334a3', '442' ],
  [ '358', '085@001b1-007b1', '443' ],
  [ '359', '085@007b2-048a5', '444' ],
  [ '360', '085@048a5-054b7', '445' ],
  [ '361', '085@055a1-090b8', '393' ],
  [ '362', '085@091a1-221b8', '394' ],
  [ '363', '085@222a1-348b8', '395' ],
  [ '364', '085@349a1-362a2', '396' ],
  [ '365', '086@001b1-145b8', '397' ],
  [ '366', '086@146a1-197b8', '398' ],
  [ '367', '086@198a1-232b2', '399' ],
  [ '368a', '086@232b2-240b8', '402' ],
  [ '368b', '086@241a1-252a7', '400' ],
  [ '369', '086@252a8-261a7', '401' ],
  [ '370', '086@261a7-262a1', '404' ],
  [ '371a', '086@262a1-358a3', '405a' ],
  [ '371b', '086@358a3-386a8', '405b' ],
  [ '372', '087@001b1-004a2', '406' ],
  [ '373', '087@004a2-012a2', '407' ],
  [ '374', '087@012a2-015b1', '408' ],
  [ '375', '087@015b1-018a3', '409' ],
  [ '376', '087@018a3-019b2', '410' ],
  [ '377', '087@019b2-024b8', '411' ],
  [ '378', '087@024b8-030a7', '412' ],
  [ '379', '087@030a7-033a5', '413' ],
  [ '380', '087@033a6-036b1', '414' ],
  [ '381', '087@036b1-038a1', '415' ],
  [ '382', '087@038a1-039b2', '416' ],
  [ '383', '087@039b2-041a4', '417' ],
  [ '384', '087@041a4-042b3', '418' ],
  [ '385', '087@042b3-045b7', '419' ],
  [ '386', '087@045b7-047b1', '420' ],
  [ '387', '087@047b1-048b3', '421' ],
  [ '388', '087@048b4-050a8', '422' ],
  [ '389', '087@050b1-052a6', '423' ],
  [ '390', '087@052a6-054b3', '424' ],
  [ '391', '087@054b3-056b7', '425' ],
  [ '392', '087@056b8-058b6', '426' ],
  [ '393', '087@058b6-060a1', '427' ],
  [ '394', '087@060a1-063b2', '428' ],
  [ '395', '087@063b3-065a6', '429' ],
  [ '396', '087@065a6-066b5', '431' ],
  [ '397', '087@066b5-067b3', '432' ],
  [ '398', '087@067b3-069a1', '430' ],
  [ '399', '087@069a2-070b8', '434' ],
  [ '400', '087@071a1-072b8', '433' ],
  [ '401', '087@072b8-077b8', '436' ],
  [ '402', '087@078a1-080a3', '437' ],
  [ '403', '087@080a3-082a4', '438' ],
  [ '404', '087@082a4-093a7', '403a' ],
  [ '405', '087@093a7-095a4', '403b' ],
  [ '406', '087@095a4-126a5', '439' ],
  [ '407', '087@126a6-152a3', '446' ],
  [ '408a', '087@152a3-155b5', '447' ],
  [ '408b', '087@155b5-160b5', '448' ],
  [ '409', '087@160b5-165b5', '449' ],
  [ '410', '087@165b5-216b3', '450' ],
  [ '411', '087@216b3-243a7', '451' ],
  [ '412', '087@243a7-285b7', '452' ],
  [ '413', '087@285b7-327a8', '453' ],
  [ '414a', '088@001b1-013a8', '454' ],
  [ '414b', '088@013b1-015b8', '456' ],
  [ '414c', '088@016a1-018a7', '455' ],
  [ '415', '088@018b1-030a2', '457' ],
  [ '416', '088@030a2-032a8', '458' ],
  [ '417', '088@032b1-046b4', '459' ],
  [ '418', '088@046b5-048a3', '460' ],
  [ '419', '088@048a4-050a6', '461' ],
  [ '420', '088@050a8-093b8', '462' ],
  [ '421', '088@094a1-097b8', '463' ],
  [ '422', '088@098a1-165b7', '464' ],
  [ '423', '088@165b7-177a4', '466' ],
  [ '424', '088@177a5-252a6', '468' ],
  [ '425', '088@252b1-306a6', '467' ],
  [ '426', '088@306a7-310b4', '470' ],
  [ '427', '088@310b4-315a1', '469' ],
  [ '428', '088@315a1-337a6', '474' ],
  [ '429', '088@337b1-371a6', '473' ],
  [ '430', '089@001b1-044a6', '475' ],
  [ '431', '089@044b1-283a8', '476' ],
  [ '432', '089@283b1-285a5', '477' ],
  [ '433', '089@285a5-290a2', '478' ],
  [ '434', '089@290a3-294a8', '479' ],
  [ '435', '089@294b1-297b2', '480' ],
  [ '436', '089@297b3-314a8', '481' ],
  [ '437', '089@314b1-320a5', '482' ],
  [ '438a', '089@320a5-323a7', '483' ],
  [ '438b', '089@323a7-323a8', '484' ],
  [ '439', '090@001b1-028b8', '485' ],
  [ '440', '090@029a1-030b8', '487' ],
  [ '441', '090@031a1-053a8', '488' ],
  [ '442', '090@054a1-056a1', '486' ],
  [ '443', '090@056a1-058b8', '489' ],
  [ '444', '090@059a1-102a8', '490' ],
  [ '445', '090@102b1-119b3', '491' ],
  [ '446', '090@119b3-131a4', '497' ],
  [ '447', '090@131a5-144a1', '492' ],
  [ '448', '090@144a1-150b6', '494' ],
  [ '449', '090@151a1-154b2', '493' ],
  [ '450', '090@154b2-155a1', '495' ],
  [ '451', '090@155a1-186b8', '498' ],
  [ '452', '090@187a1-190b8', '501' ],
  [ '453', '090@191a1-250a8', '502' ],
  [ '454a', '091@001b1-159b7', '504' ],
  [ '454b', '091@159b8-297a8', '505' ],
  [ '454c', '091@297b1-306a8', '506' ],
  [ '455', '092@001b1-053b1', '507' ],
  [ '456a', '092@053b1-095b1', '508' ],
  [ '456b', '092@095b1-095b8', '509' ],
  [ '457', '092@095b8-151a8', '510' ],
  [ '458', '092@151b1-155b8', '511' ],
  [ '459', '092@156a1-181a5', '512' ],
  [ '460', '092@181a5-285b5', '513' ],
  [ '461', '092@285b5-293b7', '514' ],
  [ '462', '092@293b8-333a5', '517' ],
  [ '463', '093@001b1-081b8', '515' ],
  [ '464', '093@082a1-082b7', '516' ],
  [ '465', '093@083a1-117a8', '518' ],
  [ '466', '093@117b1-229b8', '519' ],
  [ '467', '093@230a1-293b2', '520' ],
  [ '468', '093@293b2-303b6', '523' ],
  [ '469', '093@303b6-309b8', '524' ],
  [ '470', '094@001b1-163b7', '521' ],
  [ '471', '094@163b7-168b4', '525' ],
  [ '472', '094@168b4-169b8', '779' ],
  [ '473', '094@170a1-174b2', '526' ],
  [ '474', '094@174b3-245b8', '527' ],
  [ '475', '094@246a1-271b8', '528' ],
  [ '476', '094@272a1-280b6', '529' ],
  [ '477', '094@280b7-283b2', '530' ],
  [ '478', '094@283b2-303a7', '532' ],
  [ '479a', '095@001b1-002b2', '535' ],
  [ '479b', '095@002b2-003a3', '630' ],
  [ '480a', '095@003a3-009b1', '533' ],
  [ '480b', '095@009b1-013b1', '656' ],
  [ '481', '095@013b1-013b2', '559' ],
  [ '482', '095@013b3-013b7', '560' ],
  [ '483', '095@013b8-014a4', '680' ],
  [ '485a', '095@015a5-015a8', '711' ],
  [ '485b', '095@015a8-017a3', '541' ],
  [ '486', '095@017a3-019b4', '540' ],
  [ '487', '095@019b4-021a6', '539' ],
  [ '488', '095@021a6-025a1', '537' ],
  [ '489', '095@025a1-029a4', '538' ],
  [ '490a', '095@029a4-029b2', '708' ],
  [ '490b', '095@029b2-029b5', '709' ],
  [ '491', '095@029b5-029b8', '561' ],
  [ '492', '095@029b8-030a1', '562' ],
  [ '493', '095@030a2-030a3', '563' ],
  [ '494', '095@030a3-033b4', '543' ],
  [ '495', '095@033b4-036b3', '570' ],
  [ '496', '095@036b3-037b4', '672' ],
  [ '497', '095@037b4-039b1', '556' ],
  [ '498', '095@039b1-040b7', '557' ],
  [ '499', '095@040b7-045a4', '558' ],
  [ '500', '095@045a5-305a8', '571' ],
  [ '501', '096@001b1-014a5', '572' ],
  [ '502', '096@014a5-014b8', '579' ],
  [ '503', '096@014b8-015a8', '580' ],
  [ '504', '096@015b1-015b8', '573' ],
  [ '505', '096@015b8-016b1', '574' ],
  [ '506', '096@016b2-016b5', '575' ],
  [ '507', '096@016b6-016b7', '576' ],
  [ '508', '096@017a1-017a5', '577' ],
  [ '509', '096@017a5-017a8', '578' ],
  [ '510', '096@018a1-019b3', '581' ],
  [ '511', '096@019b3-020b8', '582' ],
  [ '512', '096@021a1-167b8', '583' ],
  [ '513', '096@168a1-302a8', '584' ],
  [ '514', '097@001b1-067a7', '585' ],
  [ '515', '097@068a1-094a8', '586' ],
  [ '516', '097@095a1-125b7', '587' ],
  [ '517', '097@125b7-147b6', '589' ],
  [ '518', '097@147b6-159b3', '590' ],
  [ '519', '097@159b3-166a8', '591' ],
  [ '520', '097@167a1-168b5', '592' ],
  [ '521a', '097@168b5-176a4', '593' ],
  [ '521b', '097@176a4-196b1', '594' ],
  [ '521c', '097@196b1-197b1', '766' ],
  [ '522', '097@197b1-198a4', '767' ],
  [ '523', '097@198a4-206a8', '789' ],
  [ '524', '097@206a8-207a3', '641' ],
  [ '525', '097@207a4-207b8', '599' ],
  [ '526', '097@208a1-209b4', '598' ],
  [ '527', '097@209b4-210a5', '763' ],
  [ '528', '097@210a6-215b8', '595' ],
  [ '529', '097@216a1-219b6', '596' ],
  [ '530', '097@219b6-220a5', '588' ],
  [ '531', '097@220a6-225b1', '554' ],
  [ '532', '097@225b1-226b8', '522' ],
  [ '533', '097@227a1-231b7', '623' ],
  [ '534a', '097@231b7-236b8', '625' ],
  [ '534b', '097@237a1-244b8', '622' ],
  [ '535', '097@244b8-247a4', '626' ],
  [ '536', '097@247a4-248a7', '624' ],
  [ '537', '097@248a7-257a3', '618' ],
  [ '538a', '097@257a4-263a7', '619' ],
  [ '538b', '097@263a7-268a6', '620' ],
  [ '538c', '097@268a6-274a3', '621' ],
  [ '539', '097@274a3-282b6', '627' ],
  [ '540a', '097@282b7-283a7', '650' ],
  [ '540b', '097@283a8-283b1', '651' ],
  [ '541', '097@283b1-284a2', '653' ],
  [ '542', '097@284a3-284a4', '652' ],
  [ '543', '097@284a4-284b2', '648' ],
  [ '544', '097@284b2-284b3', '654' ],
  [ '545', '097@284b3-285b2', '649' ],
  [ '546', '097@285b3-286a5', '657' ],
  [ '547', '097@286a5-286b6', '643' ],
  [ '548a', '097@286b6-287a5', '741' ],
  [ '548b', '097@287a5-288b3', '548' ],
  [ '548c', '097@288b3-299a7', '536' ],
  [ '549', '097@299a7-306a3', '629' ],
  [ '550', '097@306a4-308b3', '545' ],
  [ '551', '097@308b3-309b2', '546' ],
  [ '552', '097@309b2-309b5', '547' ],
  [ '553', '097@309b6-309b7', '804' ],
  [ '554', '097@309b7-310a2', '628' ],
  [ '555', '097@310a2-310a3', '531' ],
  [ '556a', '097@310a3-310a5', '805' ],
  [ '556b', '097@310a5-310b1', '806' ],
  [ '556c', '097@310b1-310b7', '807' ],
  [ '557', '097@310b7-311a1', '808' ],
  [ '558', '097@311a1-311a3', '679' ],
  [ '559', '097@311a3-311a6', '751' ],
  [ '560', '097@311a6-311b5', '749' ],
  [ '561a', '097@311b6-311b8', '750' ],
  [ '561b', '097@312a1-312a4', '678' ],
  [ '562a', '097@312a4-312a6', '742' ],
  [ '562b', '097@312a7-312b1', '743' ],
  [ '562c', '097@312b1-312b4', '744' ],
  [ '562d', '097@312b4-312b7', '745' ],
  [ '563', '097@312b7-313a2', '746' ],
  [ '564', '097@313a3-313a6', '747' ],
  [ '565', '097@313a6-313a8', '748' ],
  [ '566', '097@313a8-313b3', '809' ],
  [ '567', '097@313b3-313b5', '810' ],
  [ '568', '097@313b5-313b6', '811' ],
  [ '569', '097@313b7-314a5', '567' ],
  [ '570', '097@314a5-314a8', '812' ],
  [ '571', '097@314b1-314b2', '813' ],
  [ '572', '097@314b2-314b4', '814' ],
  [ '573', '097@314b4-314b6', '815' ],
  [ '574', '097@314b6-315a1', '816' ],
  [ '575', '097@315a1-315a2', '817' ],
  [ '576', '097@315a2-315a3', '818' ],
  [ '577', '097@315a4-315a7', '819' ],
  [ '578', '097@315a7-315a8', '820' ],
  [ '579', '097@315a8-315b3', '821' ],
  [ '580', '097@315b3-315b5', '822' ],
  [ '581', '097@315b5-315b8', '823' ],
  [ '582', '097@315b8-316a4', '824' ],
  [ '583', '097@316a4-316a7', '825' ],
  [ '584', '097@316a7-316a8', '826' ],
  [ '585', '097@316a8-316b2', '827' ],
  [ '586', '097@316b3-316b5', '828' ],
  [ '587', '097@316b5-316b6', '829' ],
  [ '588', '097@316b6-316b8', '830' ],
  [ '589', '097@316b8-317a2', '831' ],
  [ '590', '097@317a2-317a3', '832' ],
  [ '591', '097@317a4-317a6', '833' ],
  [ '594', '097@317b2-317b6', '773' ],
  [ '595', '097@317b6-317b8', '604' ],
  [ '596', '097@317b8-318a4', '605' ],
  [ '597', '097@318a4-318a6', '606' ],
  [ '598', '097@318a6-318b1', '607' ],
  [ '599', '097@318b1-319a1', '608' ],
  [ '600', '097@319a1-319a2', '609' ],
  [ '601', '097@319a2-319a5', '610' ],
  [ '602', '097@319a5-319a8', '611' ],
  [ '603', '097@319a8-319b1', '612' ],
  [ '604', '097@319b1-319b4', '613' ],
  [ '605', '097@319b4-319b5', '614' ],
  [ '606', '097@319b6-319b6', '615' ],
  [ '607', '097@319b6-319b8', '616' ],
  [ '608', '097@319b8-320a7', '617' ],
  [ '609b', '098@001b1-8@1b1', '565' ],
  [ '609a', '098@001b1-8@1b1', '564' ],
  [ '610', '098@001b1-8@1b1', '710' ],
  [ '611', '098@002a4-002b2', '601' ],
  [ '612', '098@002b3-003a4', '768' ],
  [ '613a', '098@003a4-003a6', '655' ],
  [ '613b', '098@003a6-004a2', '803' ],
  [ '614a', '098@004a3-056b8', '632' ],
  [ '614b', '098@056b8-058b3', '602' ],
  [ '614c', '098@058b3-060a5', '544' ],
  [ '614d', '098@060a5-061b1', '765' ],
  [ '615', '098@061b1-062a3', '646' ],
  [ '616', '098@062a3-063a6', '635' ],
  [ '617a', '098@063a6-064b2', '739' ],
  [ '617b', '098@064b2-064b7', '550' ],
  [ '617c', '098@064b7-065a2', '740' ],
  [ '618', '098@065a2-066a6', '637' ],
  [ '619', '098@066a6-067b4', '597' ],
  [ '620', '098@067b5-069a5', '647' ],
  [ '621', '098@069a5-070a6', '636' ],
  [ '622', '098@070a6-070b6', '658' ],
  [ '623', '098@070b6-072a5', '638' ],
  [ '624', '098@072a6-073b5', '640' ],
  [ '625', '098@073b6-075a6', '549' ],
  [ '626', '098@075a7-077b2', '634' ],
  [ '627', '098@077b2-082b2', '642' ],
  [ '628', '098@082b2-085b4', '683' ],
  [ '629', '098@085b4-086a1', '639' ],
  [ '630', '098@086a1-086b5', '552' ],
  [ '631', '098@086b5-087b1', '603' ],
  [ '632', '098@087b1-089b3', '661' ],
  [ '633', '098@089b4-091b2', '631' ],
  [ '634', '098@091b2-093b4', '542' ],
  [ '635', '098@093b4-096a2', '555' ],
  [ '636', '098@096a2-110b3', '659' ],
  [ '637', '098@110b3-134a7', '660' ],
  [ '638', '098@134a8-137a3', '662' ],
  [ '639', '098@137a3-139a4', '663' ],
  [ '640', '098@139a4-142a1', '664' ],
  [ '641', '098@142a1-145b5', '665' ],
  [ '642', '098@145b5-148a5', '666' ],
  [ '643', '098@148a5-151b1', '667' ],
  [ '644', '098@151b1-153b7', '668' ],
  [ '645', '098@153b7-155b8', '669' ],
  [ '646', '098@155b8-157b5', '737' ],
  [ '647', '098@157b6-159a1', '670' ],
  [ '648', '098@159a2-159b2', '671' ],
  [ '649', '098@159b2-161a8', '801' ],
  [ '650', '098@161a8-170a5', '682' ],
  [ '651', '098@170a5-184b4', '685' ],
  [ '652', '098@184b4-198b3', '686' ],
  [ '653', '098@198b3-203b3', '687' ],
  [ '654', '098@203b3-204a4', '688' ],
  [ '655', '098@204a4-210a7', '696' ],
  [ '656', '098@210a8-211a4', '695' ],
  [ '657', '098@211a5-214b4', '689' ],
  [ '658', '098@214b4-217b4', '690' ],
  [ '659a', '098@217b4-222a3', '692' ],
  [ '659b', '098@222a3-223a5', '693' ],
  [ '660', '098@223a5-225a5', '694' ],
  [ '661', '098@225a5-228a1', '697' ],
  [ '662', '098@228a1-228a8', '698' ],
  [ '663', '098@228b1-228b7', '700' ],
  [ '664', '098@228b7-229a4', '699' ],
  [ '665', '098@229a4-236a2', '701' ],
  [ '666a', '098@236a2-237b4', '702' ],
  [ '666b', '098@237b4-237b6', '703' ],
  [ '667', '098@237b6-241a8', '644' ],
  [ '668', '098@241b1-241b6', '568' ],
  [ '669', '098@241b7-242a3', '677' ],
  [ '670', '098@242a3-243a1', '673' ],
  [ '671', '098@243a1-244b4', '675' ],
  [ '672', '098@244b5-247a6', '674' ],
  [ '673', '098@247a6-249b2', '676' ],
  [ '674a', '098@249b3-249b6', '834' ],
  [ '675a', '098@250a3-250a4', '704' ],
  [ '675b', '098@250a4-255b1', '705' ],
  [ '675c', '098@255b1-259b7', '706' ],
  [ '676', '098@259b7-261b6', '707' ],
  [ '677', '098@261b7-317a8', '712' ],
  [ '678', '099@001b1-273a7', '717' ],
  [ '679', '099@273b1-280b7', '713' ],
  [ '680', '099@285a1-286b8', '718' ],
  [ '682', '099@295a1-332a8', '722' ],
  [ '684', '100@001a8-011b7', '727' ],
  [ '685', '100@001b7-012a2', '726' ],
  [ '683b', '100@002a1-011a7', '723' ],
  [ '686', '100@012a2-014a5', '724' ],
  [ '687', '100@014a6-023a3', '725' ],
  [ '688', '100@023a4-030b5', '732' ],
  [ '689', '100@030b5-036a3', '731' ],
  [ '690', '100@036a3-038b1', '730' ],
  [ '691', '100@038b1-039b6', '728' ],
  [ '692', '100@039b6-040b3', '764' ],
  [ '693', '100@040b3-043b8', '754' ],
  [ '694', '100@044a1-045b4', '736' ],
  [ '695', '100@045b5-046a5', '799' ],
  [ '696', '100@046a5-047a3', '600' ],
  [ '697', '100@047a4-048b5', '738' ],
  [ '698', '100@048b5-049b8', '733' ],
  [ '699', '100@050a1-055b7', '734' ],
  [ '700', '100@055b7-056a3', '735' ],
  [ '701', '100@056a3-056b8', '729' ],
  [ '702', '100@056b8-058a8', '756' ],
  [ '703', '100@058b1-074b1', '757' ],
  [ '704', '100@074b1-076b5', '758' ],
  [ '705a', '100@076b6-079b7', '759' ],
  [ '705b', '100@079b7-080a1', '760' ],
  [ '706', '100@080a1-080b3', '761' ],
  [ '707', '100@080b3-082a4', '762' ],
  [ '708', '100@082a5-082b7', '569' ],
  [ '709', '100@082b7-083b3', '769' ],
  [ '710', '100@083b4-087b8', '770' ],
  [ '711a', '100@087b8-088b3', '771' ],
  [ '711b', '100@088b3-089a6', '772' ],
  [ '712', '100@089a7-090a6', '774' ],
  [ '713', '100@090a6-331a8', '777' ],
  [ '714', '101@001b1-034b8', '775' ],
  [ '715', '101@035a1-063a8', '778' ],
  [ '716', '101@063b1-064b5', '780' ],
  [ '717', '101@064b6-066a5', '781' ],
  [ '718', '101@066a5-096a4', '782' ],
  [ '719', '101@096a4-099b1', '783' ],
  [ '720', '101@099b1-100a6', '784' ],
  [ '721', '101@100a6-101a6', '785' ],
  [ '722', '101@101a6-126a1', '790' ],
  [ '723a', '101@126a1-128a3', '791' ],
  [ '723b', '101@128a3-129b2', '792' ],
  [ '723c', '101@129b3-130b1', '793' ],
  [ '723d', '101@130b2-132b2', '794' ],
  [ '724', '101@132b3-144b6', '788' ],
  [ '726', '101@145a2-146a4', '633' ],
  [ '727', '101@146a5-147b6', '786' ],
  [ '728', '101@147b6-148b3', '787' ],
  [ '729', '101@148b3-149a2', '684' ],
  [ '730', '101@149a2-149b5', '795' ],
  [ '731', '101@149b5-163b3', '796' ],
  [ '733', '101@171b6-172b5', '798' ],
  [ '734', '101@172b5-186b7', '800' ],
  [ '735', '101@186b7-193a2', '802' ],
  [ '736', '101@193a2-218b5', '835' ],
  [ '737', '101@218b6-246a3', '836' ],
  [ '738', '101@246a3-249a3', '838' ],
  [ '739', '101@249a3-303a1', '837' ],
  [ '740a', '101@303a2-306a1', '839' ],
  [ '740b', '101@306a2-327a4', '840' ],
  [ '740c', '101@327a4-327b5', '841' ],
  [ '741', '101@327b5-329b2', '842' ],
  [ '742', '101@329b3-330b6', '843' ],
  [ '743', '101@330b6-331a4', '844' ],
  [ '744a', '101@331a5-333a1', '845' ],
  [ '744b', '101@333a1-333b8', '846' ],
  [ '745a', '101@333b8-335b4', '847' ],
  [ '745b', '101@335b4-336a6', '848' ],
  [ '745c', '101@336a6-337a3', '849' ],
  [ '745d', '101@337a3-337b6', '850' ],
  [ '745e', '101@337b7-338a8', '851' ],
  [ '745f', '101@338b1-338b8', '852' ],
  [ '745g', '101@338b8-339a4', '853' ],
  [ '745h', '101@339a4-339b1', '854' ],
  [ '745i', '101@339b1-339b5', '855' ],
  [ '745', '101@339b5-341a5', '856' ],
  [ '745k', '101@341a5-341b3', '857' ],
  [ '746', '102@001b1-084a8', '1118' ],
  [ '747', '102@084b1-280b5', '1119' ],
  [ '748', '102@280b5-347a8', '1120' ],
  [ '749', '103@001b1-106a8', '1121' ],
  [ '750', '103@106b1-128a4', '1122' ],
  [ '751', '103@128a5-194b6', '1123' ],
  [ '752', '103@194b7-294b6', '1124' ],
  [ '753', '103@294b6-307a8', '1125' ],
  [ '754', '104@001b1-030b8', '1126' ],
  [ '755', '104@030b8-055b3', '1127' ],
  [ '756', '104@055b3-071b7', '1128' ],
  [ '757', '104@071b7-120a7', '1129' ],
  [ '758', '104@120a7-187a5', '1130' ],
  [ '759a', '104@187a5-188a5', '1131' ],
  [ '759b', '104@188a5-192a4', '1132' ],
  [ '759c', '104@192a4-193a4', '1133' ],
  [ '759d', '104@193a4-196a3', '1134' ],
  [ '759e', '104@196a3-197a6', '1135' ],
  [ '759f', '104@197a6-199a7', '1136' ],
  [ '759g', '104@199a7-202b1', '1137' ],
  [ '759h', '104@202b1-205b3', '1138' ],
  [ '760', '104@205b3-231a1', '1139' ],
  [ '761', '104@231a2-246a5', '1140' ],
  [ '762', '104@247a1-266a8', '1141' ],
  [ '763', '105@001b1-304a6', '1142' ],
  [ '764', '106@001b1-003b6', '858' ],
  [ '765', '106@003b6-053b6', '163' ],
  [ '765', '106@003b6-053b6', '859' ],
  [ '766', '106@053b6-055a6', '860' ],
  [ '767', '106@055a6-061a1', '861' ],
  [ '768', '106@061a1-062b8', '862' ],
  [ '769', '106@062b8-063a5', '863' ],
  [ '770', '106@063a6-067a8', '864' ],
  [ '771', '106@067a8-070b8', '865' ],
  [ '772', '106@070b8-073a5', '866' ],
  [ '773', '106@073a5-074b7', '867' ],
  [ '774', '106@074b7-076b1', '868' ],
  [ '775', '106@076b1-078a7', '869' ],
  [ '776', '106@078a8-083b6', '870' ],
  [ '777', '106@083b7-085a7', '871' ],
  [ '778', '106@085a7-085b1', '872' ],
  [ '779', '106@085b1-085b5', '873' ],
  [ '780', '106@085b5-085b6', '874' ],
  [ '781', '106@085b7-086a3', '875' ],
  [ '782', '106@086a3-086b1', '876' ],
  [ '783', '106@086b1-086b4', '877' ],
  [ '784', '106@086b4-087a3', '878' ],
  [ '785', '106@087a3-087a5', '879' ],
  [ '786', '106@087a5-087a8', '880' ],
  [ '787', '106@087a8-087b1', '881' ],
  [ '789', '106@087b1-087b3', '882' ],
  [ '790', '106@087b3-091a8', '883' ],
  [ '791', '106@091a8-094b1', '884' ],
  [ '792', '106@094b1-098b7', '885' ],
  [ '793', '106@098b7-101a5', '886' ],
  [ '794', '106@101a5-103a2', '887' ],
  [ '795', '106@103a2-106a2', '888' ],
  [ '796', '106@106a2-109b6', '889' ],
  [ '797a', '106@109b6-112b1', '890' ],
  [ '797b', '106@112b1-115b8', '891' ],
  [ '798', '106@115b8-118b1', '892' ],
  [ '799', '106@118b1-120b5', '893' ],
  [ '800', '106@120b5-121b4', '894' ],
  [ '801', '106@121b4-127b5', '895' ],
  [ '802', '106@127b5-134b1', '896' ],
  [ '803', '106@134b1-159b2', '897' ],
  [ '804', '106@159b2-161b6', '898' ],
  [ '805', '106@161b6-163a6', '899' ],
  [ '806', '106@163a6-165b5', '900' ],
  [ '807', '106@165b5-165b8', '901' ],
  [ '808', '106@165b8-166b1', '902' ],
  [ '809', '106@166b1-166b8', '903' ],
  [ '810', '106@167a1-167a7', '904' ],
  [ '811', '106@167a7-167b8', '905' ],
  [ '812', '106@168a1-168a2', '906' ],
  [ '813', '106@168a2-168a8', '907' ],
  [ '814', '106@168a8-168b5', '908' ],
  [ '815', '106@168b5-205b7', '909' ],
  [ '816', '106@205b7-213b3', '910' ],
  [ '817', '106@213b3-215b3', '911' ],
  [ '818', '106@215b3-217b2', '912' ],
  [ '819', '106@217b2-223a6', '913' ],
  [ '820', '106@223a6-225b8', '914' ],
  [ '821', '106@226a1-227b6', '915' ],
  [ '822', '106@227b6-230a2', '916' ],
  [ '823', '106@230a2-231a7', '917' ],
  [ '824', '106@231a7-232a4', '918' ],
  [ '825', '106@232a4-237a5', '919' ],
  [ '826', '106@237a5-238a1', '920' ],
  [ '827a', '106@238a1-239b1', '921' ],
  [ '827b', '106@239b1-239b7', '922' ],
  [ '828', '106@239b7-240a2', '923' ],
  [ '829', '106@240a2-240a6', '924' ],
  [ '830', '106@240a6-242a5', '925' ],
  [ '831', '106@242a5-251a5', '926' ],
  [ '832', '106@251a5-256a3', '927' ],
  [ '833', '106@256a4-256b7', '928' ],
  [ '834', '106@256b7-257b2', '929' ],
  [ '835', '106@257b3-257b8', '930' ],
  [ '836', '106@257b8-259a8', '931' ],
  [ '837', '106@259a8-260a5', '932' ],
  [ '838', '106@260a5-260b4', '933' ],
  [ '839', '106@260b4-262b1', '934' ],
  [ '840', '106@262b1-263b6', '935' ],
  [ '841', '106@263b6-265b7', '936' ],
  [ '842', '106@265b7-267a3', '937' ],
  [ '843', '106@267a3-268a2', '938' ],
  [ '844', '106@268a2-270a3', '939' ],
  [ '845', '106@270a3-271b2', '940' ],
  [ '846', '106@271b2-273a1', '941' ],
  [ '847', '106@273a1-273a8', '942' ],
  [ '848', '106@273a8-274a2', '943' ],
  [ '849', '106@274a2-274a4', '944' ],
  [ '850', '106@274a5-274a8', '945' ],
  [ '851', '106@274a8-274b2', '946' ],
  [ '852', '106@274b2-274b5', '947' ],
  [ '853', '106@274b5-275a3', '948' ],
  [ '854', '106@275a3-275a4', '949' ],
  [ '855', '106@275a4-275a7', '950' ],
  [ '856', '106@275a7-275b1', '951' ],
  [ '857', '106@275b1-275b3', '952' ],
  [ '858', '106@275b3-275b5', '953' ],
  [ '859', '106@275b5-275b6', '954' ],
  [ '860', '106@275b6-275b7', '955' ],
  [ '861', '106@275b7-276a1', '956' ],
  [ '862', '106@276a1-276a8', '957' ],
  [ '863', '107@001b1-027b1', '958' ],
  [ '864', '107@027b1-037b4', '959' ],
  [ '865', '107@037b4-038b5', '960' ],
  [ '866', '107@038b5-040a2', '961' ],
  [ '867', '107@040a2-041a4', '962' ],
  [ '868', '107@041a5-042a2', '963' ],
  [ '869', '107@042a3-042a4', '964' ],
  [ '870', '107@042a4-043a2', '965' ],
  [ '871', '107@043a2-046a1', '966' ],
  [ '872', '107@046a1-046b4', '967' ],
  [ '873', '107@046b4-047b4', '968' ],
  [ '874', '107@047b4-049a2', '969' ],
  [ '875', '107@049a3-051a2', '970' ],
  [ '876', '107@051a2-051a8', '971' ],
  [ '877', '107@051b1-052a1', '972' ],
  [ '878', '107@052a1-052b2', '973' ],
  [ '879', '107@052b3-052b5', '974' ],
  [ '880', '107@052b5-053b3', '975' ],
  [ '881', '107@053b3-073b7', '976' ],
  [ '882', '107@073b7-075b1', '977' ],
  [ '883', '107@075b1-077a3', '978' ],
  [ '884', '107@077a3-077b5', '979' ],
  [ '885', '107@077b5-079a2', '980' ],
  [ '886', '107@079a2-079b3', '981' ],
  [ '887', '107@079b3-080a3', '982' ],
  [ '888', '107@080a3-080b1', '983' ],
  [ '889', '107@080b2-082a3', '984' ],
  [ '890', '107@082a3-082b8', '985' ],
  [ '891', '107@082b8-085a2', '986' ],
  [ '892', '107@085a2-087b7', '987' ],
  [ '893', '107@087b7-088a7', '988' ],
  [ '894', '107@088a7-088b5', '989' ],
  [ '895', '107@088b5-088b8', '990' ],
  [ '896', '107@088b8-091a3', '991' ],
  [ '897a', '107@091a3-091b7', '992' ],
  [ '897b', '107@091b7-092a2', '993' ],
  [ '898', '107@092a2-101b5', '994' ],
  [ '899', '107@101b5-110a4', '995' ],
  [ '900', '107@110a4-114b3', '996' ],
  [ '901', '107@114b3-122a3', '997' ],
  [ '902', '107@122a3-126a8', '998' ],
  [ '903', '107@126b1-129a8', '999' ],
  [ '904', '107@129b1-130b1', '1000' ],
  [ '905', '107@130b1-131a3', '1001' ],
  [ '906', '107@131a3-131b8', '1002' ],
  [ '907', '107@131b8-133b1', '1003' ],
  [ '908', '107@133b2-134a2', '1004' ],
  [ '909', '107@134a2-134b7', '1005' ],
  [ '910', '107@134b7-135b6', '1006' ],
  [ '911', '107@135b6-136a6', '1007' ],
  [ '912', '107@136a6-136b3', '1008' ],
  [ '913', '107@136b3-139a7', '1009' ],
  [ '914', '107@139a7-141b4', '1010' ],
  [ '915', '107@141b5-143a1', '1011' ],
  [ '916a', '107@143a2-145a3', '1012' ],
  [ '916b', '107@145a4-145a5', '1013' ],
  [ '917', '107@145a5-145b3', '1014' ],
  [ '918a', '107@145b3-151a6', '1015' ],
  [ '918b', '107@151a6-154b8', '1016' ],
  [ '919', '107@154b8-155b3', '1017' ],
  [ '920', '107@155b3-156a4', '1018' ],
  [ '921', '107@156a4-160a1', '1019' ],
  [ '922', '107@160a2-161a7', '1020' ],
  [ '923', '107@161a8-162a7', '1021' ],
  [ '924', '107@162a8-162b6', '1022' ],
  [ '925a', '107@162b6-163a3', '1023a' ],
  [ '925b', '107@163a3-163a5', '1023b' ],
  [ '926', '107@163a5-163a8', '1024' ],
  [ '927a', '107@163a8-163b8', '1025' ],
  [ '927b', '107@163b8-164a2', '1026' ],
  [ '928', '107@164a2-164b3', '1027' ],
  [ '929', '107@164b3-164b5', '1028' ],
  [ '930a', '107@164b5-165a2', '1029' ],
  [ '930b', '107@165a3-165a4', '1030' ],
  [ '931', '107@165a4-166a3', '1031' ],
  [ '932', '107@166a4-166a5', '1032' ],
  [ '933', '107@166a5-166a7', '1033' ],
  [ '934', '107@166a7-166b1', '1034' ],
  [ '935', '107@166b2-167a2', '1035' ],
  [ '936', '107@167a2-167a4', '1036' ],
  [ '937', '107@167a4-167a5', '1037' ],
  [ '938', '107@167a5-167a8', '1038' ],
  [ '939a', '107@167a8-167b1', '1039' ],
  [ '939b', '107@167b1-167b3', '1040' ],
  [ '939c', '107@167b3-167b8', '1041' ],
  [ '940a', '107@167b8-168a1', '1042' ],
  [ '940b', '107@168a1-168a2', '1043' ],
  [ '941a', '107@168a2-168a4', '1044' ],
  [ '941b', '107@168a4-168a6', '1045' ],
  [ '942', '107@168a6-168a7', '1046' ],
  [ '943', '107@168a7-168b4', '1047' ],
  [ '944', '107@168b4-169a4', '1048' ],
  [ '945a', '107@169a4-169a7', '1049' ],
  [ '945b', '107@169a7-169b2', '1050' ],
  [ '946a', '107@169b2-169b4', '1051' ],
  [ '946b', '107@169b4-169b7', '1052' ],
  [ '947a', '107@169b7-170a2', '1053' ],
  [ '947b', '107@170a2-170a4', '1054' ],
  [ '948a', '107@170a5-170a7', '1055' ],
  [ '948b', '107@170a8-170b3', '1056' ],
  [ '948c', '107@170b3-170b6', '1057' ],
  [ '949a', '107@170b6-171a1', '1058' ],
  [ '949b', '107@171a1-171a3', '1059' ],
  [ '950a', '107@171a3-171a5', '1060' ],
  [ '950b', '107@171a5-171a7', '1061' ],
  [ '951a', '107@171a8-171b2', '1062' ],
  [ '951b', '107@171b2-171b4', '1063' ],
  [ '952', '107@171b4-171b6', '1064' ],
  [ '953', '107@171b6-171b8', '1065' ],
  [ '954', '107@171b8-172a1', '1066' ],
  [ '955', '107@172a1-172a2', '1067' ],
  [ '956', '107@172a2-172a4', '1068' ],
  [ '957', '107@172a4-172a5', '1069' ],
  [ '958', '107@172a5-172a7', '1070' ],
  [ '959a', '107@172a7-172a8', '1071' ],
  [ '959b', '107@172a8-172b2', '1072' ],
  [ '960', '107@172b2-185b5', '1073' ],
  [ '961', '107@185b5-194a3', '1074' ],
  [ '962', '107@194a4-206b2', '1075' ],
  [ '963', '107@206b2-211a2', '1076' ],
  [ '964', '107@211a2-211b3', '1077' ],
  [ '965', '107@211b3-212a5', '1078' ],
  [ '966', '107@212a5-215a4', '1079' ],
  [ '967', '107@215a4-215b3', '1080a' ],
  [ '968', '107@215b3-215b4', '1080b' ],
  [ '969', '107@215b4-215b4', '1080c' ],
  [ '970', '107@215b4-215b5', '1080d' ],
  [ '971', '107@215b5-215b5', '1080e' ],
  [ '972', '107@215b5-215b6', '1080f' ],
  [ '973', '107@215b6-215b7', '1081' ],
  [ '974', '107@215b7-216a1', '1082' ],
  [ '975', '107@216a1-216a4', '1083' ],
  [ '976', '107@216a4-216a8', '1084' ],
  [ '977a', '107@216b1-216b6', '1085' ],
  [ '977b', '107@216b6-218a7', '1086' ],
  [ '978', '107@218a8-220b4', '1087' ],
  [ '979', '107@220b4-222b5', '1088' ],
  [ '980', '107@222b6-222b8', '1089' ],
  [ '981', '107@223a1-226a6', '1090' ],
  [ '982', '107@226a7-227a2', '1091' ],
  [ '983a', '107@227a2-227b1', '1092' ],
  [ '983b', '107@227b1-227b6', '1093' ],
  [ '984', '107@227b6-228a4', '1094' ],
  [ '985', '107@228a5-229b5', '1095' ],
  [ '986', '107@229b6-229b7', '1096' ],
  [ '987', '107@229b8-230b3', '1097' ],
  [ '988', '107@230b3-230b7', '1098' ],
  [ '989', '107@230b8-231b6', '1099' ],
  [ '990', '107@231b7-235b2', '1100' ],
  [ '991', '107@235b2-237a4', '1101' ],
  [ '992', '107@237a4-240a2', '1102' ],
  [ '993', '107@240a3-241a2', '1103' ],
  [ '994', '107@241a2-242a3', '1104' ],
  [ '995', '107@242a3-243a5', '1105' ],
  [ '996', '107@243a5-243b2', '1106' ],
  [ '997', '107@243b2-244a5', '1107' ],
  [ '998', '107@244a5-245b4', '1108' ],
  [ '999', '107@245b4-246a3', '1109' ],
  [ '1000', '107@246a4-247a5', '1110' ],
  [ '1001', '107@247a5-247b6', '1111' ],
  [ '1002', '107@247b6-248a3', '1112' ],
  [ '1003', '107@248a3-248a6', '1113' ],
  [ '1004', '107@248a6-249b8', '1114' ],
  [ '1005', '107@250a1-250a6', '1115' ],
  [ '1006', '108@001b1-102b5', '1116' ],
  [ '1007', '109@001a1-021b7', '1146' ] ];
jPedurma.rcode="J";
module.exports=jPedurma;
});
require.register("adarsha-dataset/dPedurma.js", function(exports, require, module){
var dPedurma=[ [ '1_1', '001@001b1-001@015a7', '1_1' ],
  [ '1_2', '001@015a7-001@025a2', '1_2' ],
  [ '1_3', '001@025a2-001@034b7', '1_3' ],
  [ '1_4', '001@034b7-001@045b6', '1_4' ],
  [ '1_5', '001@045b6-001@064a1', '1_5' ],
  [ '1_6', '001@064a1-001@075b1', '1_6' ],
  [ '1_7', '001@075b1-001@087a6', '1_7' ],
  [ '1_8', '001@087a6-001@099a2', '1_8' ],
  [ '1_9', '001@099a2-001@111a4', '1_9' ],
  [ '1_10', '001@111a4-001@124a2', '1_10' ],
  [ '1_11', '001@124a2-001@137b3', '1_11' ],
  [ '1_12', '001@137b3-001@152a1', '1_12' ],
  [ '1_13', '001@152a1-001@164b4', '1_13' ],
  [ '1_14', '001@164b4-001@176b4', '1_14' ],
  [ '1_15', '001@176b4-001@191b5', '1_15' ],
  [ '1_16', '001@191b5-001@206a4', '1_16' ],
  [ '1_17', '001@206a4-001@218b1', '1_17' ],
  [ '1_18', '001@218b1-001@232a5', '1_18' ],
  [ '1_19', '001@232a5-001@245a6', '1_19' ],
  [ '1_20', '001@245a6-001@258b3', '1_20' ],
  [ '1_21', '001@258b3-001@272b6', '1_21' ],
  [ '1_22', '001@272b6-001@285a5', '1_22' ],
  [ '1_23', '001@285a5-001@298a6', '1_23' ],
  [ '1_24', '001@298a6-002@001b1', '1_24' ],
  [ '1_25', '002@001b1-002@014a5', '1_25' ],
  [ '1_26', '002@014a5-002@027a2', '1_26' ],
  [ '1_27', '002@027a2-002@039b6', '1_27' ],
  [ '1_28', '002@039b6-002@050a6', '1_28' ],
  [ '1_29', '002@050a6-002@060b7', '1_29' ],
  [ '1_30', '002@060b7-002@070b6', '1_30' ],
  [ '1_31', '002@070b6-002@080a5', '1_31' ],
  [ '1_32', '002@080a5-002@090a5', '1_32' ],
  [ '1_33', '002@090a5-002@101a4', '1_33' ],
  [ '1_34', '002@101a4-002@111a6', '1_34' ],
  [ '1_35', '002@111a6-002@121b1', '1_35' ],
  [ '1_36', '002@121b1-002@132b3', '1_36' ],
  [ '1_37', '002@132b3-002@143a3', '1_37' ],
  [ '1_38', '002@143a3-002@154a5', '1_38' ],
  [ '1_39', '002@154a5-002@164a5', '1_39' ],
  [ '1_40', '002@164a5-002@173a1', '1_40' ],
  [ '1_41', '002@173a1-002@182a6', '1_41' ],
  [ '1_42', '002@182a6-002@191b5', '1_42' ],
  [ '1_43', '002@191b5-002@200a4', '1_43' ],
  [ '1_44', '002@200a4-002@209b5', '1_44' ],
  [ '1_45', '002@209b5-002@220a3', '1_45' ],
  [ '1_46', '002@220a3-002@230b6', '1_46' ],
  [ '1_47', '002@230b6-002@241a7', '1_47' ],
  [ '1_48', '002@241a7-002@252a6', '1_48' ],
  [ '1_49', '002@252a6-002@265a3', '1_49' ],
  [ '1_50', '002@265a3-002@275a7', '1_50' ],
  [ '1_51', '002@275a7-002@286a6', '1_51' ],
  [ '1_52', '002@286a6-002@297b6', '1_52' ],
  [ '1_53', '002@297b6-002@308a4', '1_53' ],
  [ '1_54', '002@308a4-003@001b1', '1_54' ],
  [ '1_55', '003@001b1-003@011b7', '1_55' ],
  [ '1_56', '003@011b7-003@021b2', '1_56' ],
  [ '1_57', '003@021b2-003@031b1', '1_57' ],
  [ '1_58', '003@031b1-003@040a4', '1_58' ],
  [ '1_59', '003@040a4-003@049a7', '1_59' ],
  [ '1_60', '003@049a7-003@058b7', '1_60' ],
  [ '1_61', '003@058b7-003@068a7', '1_61' ],
  [ '1_62', '003@068a7-003@079a5', '1_62' ],
  [ '1_63', '003@079a5-003@089b3', '1_63' ],
  [ '1_64', '003@089b3-003@098a3', '1_64' ],
  [ '1_65', '003@098a3-003@107a7', '1_65' ],
  [ '1_66', '003@107a7-003@116a5', '1_66' ],
  [ '1_67', '003@116a5-003@124a7', '1_67' ],
  [ '1_68', '003@124a7-003@134b3', '1_68' ],
  [ '1_69', '003@134b3-003@143b7', '1_69' ],
  [ '1_70', '003@143b7-003@154b4', '1_70' ],
  [ '1_71', '003@154b4-003@167a4', '1_71' ],
  [ '1_72', '003@167a4-003@177a6', '1_72' ],
  [ '1_73', '003@177a6-003@187a1', '1_73' ],
  [ '1_74', '003@187a1-003@197a2', '1_74' ],
  [ '1_75', '003@197a2-003@208a7', '1_75' ],
  [ '1_76', '003@208a7-003@219a3', '1_76' ],
  [ '1_77', '003@219a3-003@231b1', '1_77' ],
  [ '1_78', '003@231b1-003@243a6', '1_78' ],
  [ '1_79', '003@243a6-003@255b1', '1_79' ],
  [ '1_80', '003@255b1-003@268b4', '1_80' ],
  [ '1_81', '003@268b4-003@280b2', '1_81' ],
  [ '1_82', '003@280b2-004@001b2', '1_82' ],
  [ '1_83', '004@001b2-004@013b7', '1_83' ],
  [ '1_84', '004@013b7-004@025b6', '1_84' ],
  [ '1_85', '004@025b6-004@036b3', '1_85' ],
  [ '1_86', '004@036b3-004@047a2', '1_86' ],
  [ '1_87', '004@047a2-004@059a1', '1_87' ],
  [ '1_88', '004@059a1-004@070b6', '1_88' ],
  [ '1_89', '004@070b6-004@083a2', '1_89' ],
  [ '1_90', '004@083a2-004@094b7', '1_90' ],
  [ '1_91', '004@094b7-004@106a6', '1_91' ],
  [ '1_92', '004@106a6-004@119a1', '1_92' ],
  [ '1_93', '004@119a1-004@130a3', '1_93' ],
  [ '1_94', '004@130a3-004@141a1', '1_94' ],
  [ '1_95', '004@141a1-004@151b2', '1_95' ],
  [ '1_96', '004@151b2-004@162b5', '1_96' ],
  [ '1_97', '004@162b5-004@174a4', '1_97' ],
  [ '1_98', '004@174a4-004@185a1', '1_98' ],
  [ '1_99', '004@185a1-004@196b4', '1_99' ],
  [ '1_100', '004@196b4-004@208b1', '1_100' ],
  [ '1_101', '004@208b1-004@219b1', '1_101' ],
  [ '1_102', '004@219b1-004@229a7', '1_102' ],
  [ '1_103', '004@229a7-004@240a6', '1_103' ],
  [ '1_104', '004@240a6-004@250a7', '1_104' ],
  [ '1_105', '004@250a7-004@261a1', '1_105' ],
  [ '1_106', '004@261a1-004@271b4', '1_106' ],
  [ '1_107', '004@271b4-004@282b1', '1_107' ],
  [ '1_108', '004@282b1-004@292b1', '1_108' ],
  [ '1_109', '004@292b1-004@302a5', '1_109' ],
  [ '2_1', '005@001b1-005@011b1', '2_1' ],
  [ '2_2', '005@011b1-005@020b7', '2_2' ],
  [ '3_1', '005@021a1-005@035b5', '3_1' ],
  [ '3_2', '005@035b5-005@048b1', '3_2' ],
  [ '3_3', '005@048b1-005@061b6', '3_3' ],
  [ '3_4', '005@061b6-005@075b5', '3_4' ],
  [ '3_5', '005@075b5-005@088b2', '3_5' ],
  [ '3_6', '005@088b2-005@101a7', '3_6' ],
  [ '3_7', '005@101a7-005@113a6', '3_7' ],
  [ '3_8', '005@113a6-005@126b6', '3_8' ],
  [ '3_9', '005@126b6-005@139b5', '3_9' ],
  [ '3_10', '005@139b5-005@153b1', '3_10' ],
  [ '3_11', '005@153b1-005@164b3', '3_11' ],
  [ '3_12', '005@164b3-005@177a7', '3_12' ],
  [ '3_13', '005@177a7-005@189b2', '3_13' ],
  [ '3_14', '005@189b2-005@201b3', '3_14' ],
  [ '3_15', '005@201b3-005@215a2', '3_15' ],
  [ '3_16', '005@215a2-005@227a2', '3_16' ],
  [ '3_18', '005@227a2-005@239a1', '3_18' ],
  [ '3_17', '005@239a1-005@252a3', '3_17' ],
  [ '3_19', '005@252a3-005@265b7', '3_19' ],
  [ '3_20', '005@265b7-005@279a4', '3_20' ],
  [ '3_21', '005@279a4-006@001b1', '3_21' ],
  [ '3_22', '006@001b1-006@016a7', '3_22' ],
  [ '3_23', '006@016a7-006@029a4', '3_23' ],
  [ '3_24', '006@029a4-006@042a4', '3_24' ],
  [ '3_25', '006@042a4-006@054b3', '3_25' ],
  [ '3_26', '006@054b3-006@066b3', '3_26' ],
  [ '3_27', '006@066b3-006@080a5', '3_27' ],
  [ '3_28', '006@080a5-006@093a3', '3_28' ],
  [ '3_29', '006@093a3-006@105b3', '3_29' ],
  [ '3_30', '006@105b3-006@119a3', '3_30' ],
  [ '3_31', '006@119a3-006@134a1', '3_31' ],
  [ '3_32', '006@134a1-006@148b1', '3_32' ],
  [ '3_33', '006@148b1-006@162b2', '3_33' ],
  [ '3_34', '006@162b2-006@176b6', '3_34' ],
  [ '3_35', '006@176b6-006@193b6', '3_35' ],
  [ '3_36', '006@193b6-006@208b6', '3_36' ],
  [ '3_37', '006@208b6-006@222b3', '3_37' ],
  [ '3_38', '006@222b3-006@236a6', '3_38' ],
  [ '3_39', '006@236a6-006@248a4', '3_39' ],
  [ '3_40', '006@248a4-006@261a6', '3_40' ],
  [ '3_41', '006@261a6-006@274b2', '3_41' ],
  [ '3_42', '006@274b2-007@001b1', '3_42' ],
  [ '3_43', '007@001b1-007@016a7', '3_43' ],
  [ '3_44', '007@016a7-007@032a1', '3_44' ],
  [ '3_45', '007@032a1-007@046b5', '3_45' ],
  [ '3_46', '007@046b5-007@063b3', '3_46' ],
  [ '3_47', '007@063b3-007@079b3', '3_47' ],
  [ '3_48', '007@079b3-007@093a4', '3_48' ],
  [ '3_49', '007@093a4-007@108a2', '3_49' ],
  [ '3_50', '007@108a2-007@122b1', '3_50' ],
  [ '3_51', '007@122b1-007@136b1', '3_51' ],
  [ '3_52', '007@136b1-007@148a7', '3_52' ],
  [ '3_53', '007@148a7-007@161a4', '3_53' ],
  [ '3_54', '007@161a4-007@173a2', '3_54' ],
  [ '3_55', '007@173a2-007@187a4', '3_55' ],
  [ '3_56', '007@187a4-007@201a4', '3_56' ],
  [ '3_57', '007@201a4-007@214a3', '3_57' ],
  [ '3_58', '007@214a3-007@227b3', '3_58' ],
  [ '3_59', '007@227b3-007@242b2', '3_59' ],
  [ '3_60', '007@242b2-007@258a2', '3_60' ],
  [ '3_61', '007@258a2-007@272a6', '3_61' ],
  [ '3_62', '007@272a6-008@001b1', '3_62' ],
  [ '3_63', '008@001b1-008@015a7', '3_63' ],
  [ '3_64', '008@015a7-008@026b2', '3_64' ],
  [ '3_65', '008@026b2-008@040b7', '3_65' ],
  [ '3_66', '008@040b7-008@057a2', '3_66' ],
  [ '3_67', '008@057a2-008@073a1', '3_67' ],
  [ '3_68', '008@073a1-008@087b6', '3_68' ],
  [ '3_69', '008@087b6-008@100a3', '3_69' ],
  [ '3_70', '008@100a3-008@112a7', '3_70' ],
  [ '3_71', '008@112a7-008@125a1', '3_71' ],
  [ '3_72', '008@125a1-008@137b5', '3_72' ],
  [ '3_73', '008@137b5-008@150b4', '3_73' ],
  [ '3_74', '008@150b4-008@162a6', '3_74' ],
  [ '3_75', '008@162a6-008@173a5', '3_75' ],
  [ '3_76', '008@173a5-008@183b7', '3_76' ],
  [ '3_77', '008@183b7-008@194b6', '3_77' ],
  [ '3_78', '008@194b6-008@204a8', '3_78' ],
  [ '3_79', '008@204a8-008@216a2', '3_79' ],
  [ '3_80', '008@216a2-008@228b5', '3_80' ],
  [ '3_81', '008@228b5-008@240a4', '3_81' ],
  [ '3_82', '008@240a4-008@254a4', '3_82' ],
  [ '3_83', '008@254a4-008@269a6', '3_83' ],
  [ '4_1', '009@001b1-009@013a7', '4_1' ],
  [ '4_2', '009@013a7-009@025a7', '4_2' ],
  [ '5_1', '009@025b1-009@036b7', '5_1' ],
  [ '5_2', '009@036b7-009@047a7', '5_2' ],
  [ '5_3', '009@047a7-009@059a2', '5_3' ],
  [ '5_4', '009@059a2-009@069b6', '5_4' ],
  [ '5_5', '009@069b6-009@082a5', '5_5' ],
  [ '5_6', '009@082a5-009@095a2', '5_6' ],
  [ '5_7', '009@095a2-009@107a3', '5_7' ],
  [ '5_8', '009@107a3-009@119a4', '5_8' ],
  [ '5_9', '009@119a4-009@131a1', '5_9' ],
  [ '5_10', '009@131a1-009@144a4', '5_10' ],
  [ '5_11', '009@144a4-009@156b2', '5_11' ],
  [ '5_12', '009@156b2-009@168a1', '5_12' ],
  [ '5_13', '009@168a1-009@179a1', '5_13' ],
  [ '5_14', '009@179a1-009@189a6', '5_14' ],
  [ '5_15', '009@189a6-009@201b3', '5_15' ],
  [ '5_16', '009@201b3-009@212a4', '5_16' ],
  [ '5_17', '009@212a4-009@221b5', '5_17' ],
  [ '5_18', '009@221b5-009@231a4', '5_18' ],
  [ '5_19', '009@231a4-009@240a4', '5_19' ],
  [ '5_20', '009@240a4-009@251a3', '5_20' ],
  [ '5_21', '009@251a3-009@261a1', '5_21' ],
  [ '5_22', '009@261a1-009@271a7', '5_22' ],
  [ '5_23', '009@271a7-009@280a5', '5_23' ],
  [ '5_24', '009@280a5-009@289b3', '5_24' ],
  [ '5_25', '009@289b3-009@299a2', '5_25' ],
  [ '5_26', '009@299a2-009@309a2', '5_26' ],
  [ '5_27', '009@309a2-009@318a7', '5_27' ],
  [ '5_28', '009@318a7-009@328a6', '5_28' ],
  [ '6_1', '010@001b1-010@013a7', '6_1' ],
  [ '6_2', '010@013a7-010@027a5', '6_2' ],
  [ '6_3', '010@027a5-010@041b3', '6_3' ],
  [ '6_4', '010@041b3-010@051b2', '6_4' ],
  [ '6_5', '010@051b2-010@063a2', '6_5' ],
  [ '6_6', '010@063a2-010@074a5', '6_6' ],
  [ '6_7', '010@074a5-010@085b3', '6_7' ],
  [ '6_8', '010@085b3-010@097a3', '6_8' ],
  [ '6_9', '010@097a3-010@108a3', '6_9' ],
  [ '6_10', '010@108a3-010@121a3', '6_10' ],
  [ '6_11', '010@121a3-010@133a5', '6_11' ],
  [ '6_12', '010@133a5-010@144b7', '6_12' ],
  [ '6_13', '010@144b7-010@156b6', '6_13' ],
  [ '6_14', '010@156b6-010@168a2', '6_14' ],
  [ '6_15', '010@168a2-010@178b4', '6_15' ],
  [ '6_16', '010@178b4-010@192a2', '6_16' ],
  [ '6_17', '010@192a2-010@205a3', '6_17' ],
  [ '6_18', '010@205a3-010@217b6', '6_18' ],
  [ '6_19', '010@217b6-010@229a1', '6_19' ],
  [ '6_20', '010@229a1-010@237a5', '6_20' ],
  [ '6_21', '010@237a5-010@252a1', '6_21' ],
  [ '6_22', '010@252a1-010@261b7', '6_22' ],
  [ '6_23', '010@261b7-010@273a3', '6_23' ],
  [ '6_24', '010@273a3-010@281a2', '6_24' ],
  [ '6_25', '010@281a2-010@289b3', '6_25' ],
  [ '6_26', '010@289b3-010@299a6', '6_26' ],
  [ '6_27', '010@299a6-011@001b1', '6_27' ],
  [ '6_28', '011@001b1-011@013a4', '6_28' ],
  [ '6_29', '011@013a4-011@024a6', '6_29' ],
  [ '6_30', '011@024a6-011@037a2', '6_30' ],
  [ '6_31', '011@037a2-011@050b2', '6_31' ],
  [ '6_32', '011@050b2-011@060b7', '6_32' ],
  [ '6_33', '011@060b7-011@070a7', '6_33' ],
  [ '6_34', '011@070a7-011@088a1', '6_34' ],
  [ '6_35', '011@088a1-011@099b2', '6_35' ],
  [ '6_36', '011@099b2-011@112b1', '6_36' ],
  [ '6_37', '011@112b1-011@122a4', '6_37' ],
  [ '6_38', '011@122a4-011@134b1', '6_38' ],
  [ '6_39', '011@134b1-011@144a2', '6_39' ],
  [ '6_40', '011@144a2-011@151a2', '6_40' ],
  [ '6_41', '011@151a2-011@159a3', '6_41' ],
  [ '6_42', '011@159a3-011@170a6', '6_42' ],
  [ '6_43', '011@170a6-011@182b3', '6_43' ],
  [ '6_44', '011@182b3-011@192a6', '6_44' ],
  [ '6_45', '011@192a6-011@202a1', '6_45' ],
  [ '6_46', '011@202a1-011@209b4', '6_46' ],
  [ '6_47', '011@209b4-011@218a7', '6_47' ],
  [ '6_48', '011@218a7-011@227a6', '6_48' ],
  [ '6_49', '011@227a6-011@237b6', '6_49' ],
  [ '6_50', '011@237b6-011@247b2', '6_50' ],
  [ '6_51', '011@247b2-011@258a2', '6_51' ],
  [ '6_52', '011@258a2-011@268b4', '6_52' ],
  [ '6_53', '011@268b4-011@277a1', '6_53' ],
  [ '6_54', '011@277a1-011@285b5', '6_54' ],
  [ '6_55', '011@285b5-011@294b7', '6_55' ],
  [ '6_56', '011@294b7-011@304b6', '6_56' ],
  [ '6_57', '011@304b6-011@315a7', '6_57' ],
  [ '6_58', '011@315a7-011@325b2', '6_58' ],
  [ '6_59', '011@325b2-011@333a7', '6_59' ],
  [ '7a_1', '012@001b1-012@011b1', '7_1' ],
  [ '7a_2', '012@011b1-012@020a1', '7_2' ],
  [ '7a_3', '012@020a1-012@028a7', '7_3' ],
  [ '7a_4', '012@028a7-012@037b1', '7_4' ],
  [ '7a_5', '012@037b1-012@046a7', '7_5' ],
  [ '7a_6', '012@046a7-012@054a4', '7_6' ],
  [ '7a_7', '012@054a4-012@061a8', '7_7' ],
  [ '7a_8', '012@061a8-012@068b3', '7_8' ],
  [ '7a_9', '012@068b3-012@076a4', '7_9' ],
  [ '7a_10', '012@076a4-012@083a3', '7_10' ],
  [ '7a_11', '012@083a3-012@091a3', '7_11' ],
  [ '7a_12', '012@091a3-013@313a5', '7_12' ],
  [ '7b', '012@092b1-302a7', '8' ],
  [ '_1', '012@092b2-012@104b5', '19_1' ],
  [ '_2', '012@104b5-012@113b8', '19_2' ],
  [ '_3', '012@113b8-012@128a2', '19_3' ],
  [ '_4', '012@128a2-012@138a6', '19_4' ],
  [ '_5', '012@138a6-012@149a6', '19_5' ],
  [ '_6', '012@149a6-012@160b5', '19_6' ],
  [ '_7', '012@160b5-012@168b3', '19_7' ],
  [ '_8', '012@168b3-012@175b7', '19_8' ],
  [ '_9', '012@175b7-012@183a7', '19_9' ],
  [ '_10', '012@183a7-012@192a2', '19_10' ],
  [ '_11', '012@192a2-012@201a8', '19_11' ],
  [ '_12', '012@201a8-012@211b5', '19_12' ],
  [ '_13', '012@211b5-012@221a5', '19_13' ],
  [ '_14', '012@221a5-012@230a8', '19_14' ],
  [ '_15', '012@230a8-012@239a4', '19_15' ],
  [ '_16', '012@239a4-012@248b7', '19_16' ],
  [ '_17', '012@248b7-012@258a7', '19_17' ],
  [ '_18', '012@258a7-012@268a3', '19_18' ],
  [ '_19', '012@268a3-012@275b6', '19_19' ],
  [ '_20', '012@275b6-012@283a8', '19_20' ],
  [ '_21', '012@283a8-012@292a5', '19_21' ],
  [ '_22', '012@292a5-0', '19_22' ],
  [ '7b', '013@001b1-313a5', '8' ],
  [ '_30', '013@066b8-013@074b3', '19_30' ],
  [ '_31', '013@074b3-013@084b4', '19_31' ],
  [ '_32', '013@084b4-013@094a4', '19_32' ],
  [ '_33', '013@094a4-013@102b5', '19_33' ],
  [ '_34', '013@102b5-013@112a5', '19_34' ],
  [ '_35', '013@112a5-013@123a5', '19_35' ],
  [ '_36', '013@123a5-013@134a2', '19_36' ],
  [ '_37', '013@134a2-013@144a8', '19_37' ],
  [ '_38', '013@144a8-013@154b7', '19_38' ],
  [ '_39', '013@154b7-013@165a3', '19_39' ],
  [ '_40', '013@165a3-013@175a8', '19_40' ],
  [ '_41', '013@175a8-013@183b6', '19_41' ],
  [ '_42', '013@183b6-013@193a8', '19_42' ],
  [ '_43', '013@193a8-013@201b8', '19_43' ],
  [ '_44', '013@201b8-013@211b3', '19_44' ],
  [ '_45', '013@211b3-013@221b6', '19_45' ],
  [ '_46', '013@221b6-013@232a8', '19_46' ],
  [ '_47', '013@232a8-013@243a8', '19_47' ],
  [ '_48', '013@243a8-013@255a3', '19_48' ],
  [ '_49', '013@255a3-013@267a5', '19_49' ],
  [ '_50', '013@267a5-013@277b8', '19_50' ],
  [ '_51', '013@277b8-013@291b2', '19_51' ],
  [ '_52', '013@291b2-013@302a8', '19_52' ],
  [ '_53', '013@302a8-0', '19_53' ],
  [ '8_1', '014@001b1-014@019a5', '25_1' ],
  [ '8_2', '014@019a5-014@035a5', '25_2' ],
  [ '8_3', '014@035a5-014@056b5', '25_3' ],
  [ '8_4', '014@056b5-014@072a6', '25_4' ],
  [ '8_5', '014@072a6-014@087a7', '25_5' ],
  [ '8_6', '014@087a7-014@104a4', '25_6' ],
  [ '8_7', '014@104a4-014@116b5', '25_7' ],
  [ '8_8', '014@116b5-014@132a6', '25_8' ],
  [ '8_9', '014@132a6-014@148a4', '25_9' ],
  [ '8_10', '014@148a4-014@163a7', '25_10' ],
  [ '8_11', '014@163a7-014@179b4', '25_11' ],
  [ '8_12', '014@179b4-014@198b2', '25_12' ],
  [ '8_13', '014@198b2-014@212b3', '25_13' ],
  [ '8_14', '014@212b3-014@225b6', '25_14' ],
  [ '8_15', '014@225b6-014@239a5', '25_15' ],
  [ '8_16', '014@239a5-014@254a5', '25_16' ],
  [ '8_17', '014@254a5-014@270a4', '25_17' ],
  [ '8_18', '014@270a4-014@286b1', '25_18' ],
  [ '8_19', '014@286b1-014@310b5', '25_19' ],
  [ '8_20', '014@310b5-014@332b7', '25_20' ],
  [ '8_21', '014@332b7-014@346b5', '25_21' ],
  [ '8_22', '014@346b5-014@363b6', '25_22' ],
  [ '8_23', '014@363b6-014@378b4', '25_23' ],
  [ '8_24', '014@378b4-015@001b1', '25_24' ],
  [ '8_25', '015@001b1-015@018b4', '25_25' ],
  [ '8_26', '015@018b4-015@034a6', '25_26' ],
  [ '8_27', '015@034a6-015@049a5', '25_27' ],
  [ '8_28', '015@049a5-015@062b1', '25_28' ],
  [ '8_29', '015@062b1-015@074b1', '25_29' ],
  [ '8_30', '015@074b1-015@087a2', '25_30' ],
  [ '8_31', '015@087a2-015@101a8', '25_31' ],
  [ '8_32', '015@101a8-015@113b3', '25_32' ],
  [ '8_33', '015@113b3-015@123b1', '25_33' ],
  [ '8_34', '015@123b1-015@137b1', '25_34' ],
  [ '8_35', '015@137b1-015@154a1', '25_35' ],
  [ '8_36', '015@154a1-015@165b7', '25_36' ],
  [ '8_37', '015@165b7-015@181a3', '25_37' ],
  [ '8_38', '015@181a3-015@198b3', '25_38' ],
  [ '8_39', '015@198b3-015@215b7', '25_39' ],
  [ '8_40', '015@215b7-015@231b7', '25_40' ],
  [ '8_41', '015@231b7-015@246b5', '25_41' ],
  [ '8_42', '015@246b5-015@262b3', '25_42' ],
  [ '8_43', '015@262b3-015@275b5', '25_43' ],
  [ '8_44', '015@275b5-015@292a4', '25_44' ],
  [ '8_45', '015@292a4-015@312a4', '25_45' ],
  [ '8_46', '015@312a4-015@328b2', '25_46' ],
  [ '8_47', '015@328b2-015@344a7', '25_47' ],
  [ '8_48', '015@344a7-015@358b3', '25_48' ],
  [ '8_49', '015@358b3-015@371b5', '25_49' ],
  [ '8_50', '015@371b5-015@386a1', '25_50' ],
  [ '8_51', '015@386a1-016@001b1', '25_51' ],
  [ '8_52', '016@001b1-016@015b2', '25_52' ],
  [ '8_53', '016@015b2-016@028a3', '25_53' ],
  [ '8_54', '016@028a3-016@041b2', '25_54' ],
  [ '8_55', '016@041b2-016@055b2', '25_55' ],
  [ '8_56', '016@055b2-016@069b7', '25_56' ],
  [ '8_57', '016@069b7-016@082b2', '25_57' ],
  [ '8_58', '016@082b2-016@099b1', '25_58' ],
  [ '8_59', '016@099b1-016@119a6', '25_59' ],
  [ '8_60', '016@119a6-016@139a5', '25_60' ],
  [ '8_61', '016@139a5-016@151b2', '25_61' ],
  [ '8_62', '016@151b2-016@164b4', '25_62' ],
  [ '8_63', '016@164b4-016@180b7', '25_63' ],
  [ '8_64', '016@180b7-016@196a5', '25_64' ],
  [ '8_65', '016@196a5-016@210a3', '25_65' ],
  [ '8_66', '016@210a3-016@223a1', '25_66' ],
  [ '8_67', '016@223a1-016@234b7', '25_67' ],
  [ '8_68', '016@234b7-016@249b1', '25_68' ],
  [ '8_69', '016@249b1-016@264b4', '25_69' ],
  [ '8_70', '016@264b4-016@280b6', '25_70' ],
  [ '8_71', '016@280b6-016@298a1', '25_71' ],
  [ '8_72', '016@298a1-016@316a7', '25_72' ],
  [ '8_73', '016@316a7-016@331a4', '25_73' ],
  [ '8_74', '016@331a4-016@346a4', '25_74' ],
  [ '8_75', '016@346a4-016@364a1', '25_75' ],
  [ '8_76', '016@364a1-016@380b6', '25_76' ],
  [ '8_77', '016@380b6-017@001b1', '25_77' ],
  [ '8_78', '017@001b1-017@024b1', '25_78' ],
  [ '8_79', '017@024b1-017@039a1', '25_79' ],
  [ '8_80', '017@039a1-017@059a7', '25_80' ],
  [ '8_81', '017@059a7-017@076b7', '25_81' ],
  [ '8_82', '017@076b7-017@093b5', '25_82' ],
  [ '8_83', '017@093b5-017@110b1', '25_83' ],
  [ '8_84', '017@110b1-017@125a6', '25_84' ],
  [ '8_85', '017@125a6-017@141a6', '25_85' ],
  [ '8_86', '017@141a6-017@156b6', '25_86' ],
  [ '8_87', '017@156b6-017@169b4', '25_87' ],
  [ '8_88', '017@169b4-017@188b1', '25_88' ],
  [ '8_89', '017@188b1-017@200b3', '25_89' ],
  [ '8_90', '017@200b3-017@214a2', '25_90' ],
  [ '8_91', '017@214a2-017@228a1', '25_91' ],
  [ '8_92', '017@228a1-017@240a3', '25_92' ],
  [ '8_93', '017@240a3-017@254b1', '25_93' ],
  [ '8_94', '017@254b1-017@268b3', '25_94' ],
  [ '8_95', '017@268b3-017@282b7', '25_95' ],
  [ '8_96', '017@282b7-017@295b1', '25_96' ],
  [ '8_97', '017@295b1-017@309b2', '25_97' ],
  [ '8_98', '017@309b2-017@325a3', '25_98' ],
  [ '8_99', '017@325a3-017@337b6', '25_99' ],
  [ '8_100', '017@337b6-017@352b3', '25_100' ],
  [ '8_101', '017@352b3-017@363a6', '25_101' ],
  [ '8_102', '017@363a6-018@001a1', '25_102' ],
  [ '8_103', '018@001a1-018@018a2', '25_103' ],
  [ '8_104', '018@018a2-018@031a3', '25_104' ],
  [ '8_105', '018@031a3-018@043a6', '25_105' ],
  [ '8_106', '018@043a6-018@055a1', '25_106' ],
  [ '8_107', '018@055a1-018@069a7', '25_107' ],
  [ '8_108', '018@069a7-018@084a1', '25_108' ],
  [ '8_109', '018@084a1-018@098a5', '25_109' ],
  [ '8_110', '018@098a5-018@113b2', '25_110' ],
  [ '8_111', '018@113b2-018@129a2', '25_111' ],
  [ '8_112', '018@129a2-018@143a5', '25_112' ],
  [ '8_113', '018@143a5-018@153a1', '25_113' ],
  [ '8_114', '018@153a1-018@167a6', '25_114' ],
  [ '8_115', '018@167a6-018@182a5', '25_115' ],
  [ '8_116', '018@182a5-018@193b2', '25_116' ],
  [ '8_117', '018@193b2-018@225a7', '25_117' ],
  [ '8_118', '018@225a7-018@238b5', '25_118' ],
  [ '8_119', '018@238b5-018@253a3', '25_119' ],
  [ '8_120', '018@253a3-018@266b3', '25_120' ],
  [ '8_121', '018@266b3-018@282b2', '25_121' ],
  [ '8_122', '018@282b2-018@297a2', '25_122' ],
  [ '8_123', '018@297a2-018@313a7', '25_123' ],
  [ '8_124', '018@313a7-018@328b1', '25_124' ],
  [ '8_125', '018@328b1-018@344a5', '25_125' ],
  [ '8_126', '018@344a5-018@363a2', '25_126' ],
  [ '8_127', '018@363a2-018@380b4', '25_127' ],
  [ '8_128', '018@380b4-019@001b1', '25_128' ],
  [ '8_129', '019@001b1-019@015b6', '25_129' ],
  [ '8_130', '019@015b6-019@046a3', '25_130' ],
  [ '8_132', '019@046a3-019@061b7', '25_132' ],
  [ '8_133', '019@061b7-019@074b3', '25_133' ],
  [ '8_134', '019@074b3-019@087b7', '25_134' ],
  [ '8_135', '019@087b7-019@101b5', '25_135' ],
  [ '8_136', '019@101b5-019@117a7', '25_136' ],
  [ '8_137', '019@117a7-019@131a6', '25_137' ],
  [ '8_138', '019@131a6-019@145b5', '25_138' ],
  [ '8_139', '019@145b5-019@158a3', '25_139' ],
  [ '8_140', '019@158a3-019@170a6', '25_140' ],
  [ '8_141', '019@170a6-019@182a7', '25_141' ],
  [ '8_142', '019@182a7-019@195b6', '25_142' ],
  [ '8_143', '019@195b6-019@209a1', '25_143' ],
  [ '8_144', '019@209a1-019@222a3', '25_144' ],
  [ '8_145', '019@222a3-019@234b4', '25_145' ],
  [ '8_146', '019@234b4-019@252a5', '25_146' ],
  [ '8_147', '019@252a5-019@268b6', '25_147' ],
  [ '8_148', '019@268b6-019@284a3', '25_148' ],
  [ '8_149', '019@284a3-019@299b6', '25_149' ],
  [ '8_150', '019@299b6-019@316a2', '25_150' ],
  [ '8_151', '019@316a2-019@338a3', '25_151' ],
  [ '8_152', '019@338a3-019@356b3', '25_152' ],
  [ '8_153', '019@356b3-020@001b1', '25_153' ],
  [ '8_154', '020@001b1-020@024a7', '25_154' ],
  [ '8_155', '020@024a7-020@046a7', '25_155' ],
  [ '8_156', '020@046a7-020@067a1', '25_156' ],
  [ '8_157', '020@067a1-020@082b2', '25_157' ],
  [ '8_158', '020@082b2-020@098a4', '25_158' ],
  [ '8_159', '020@098a4-020@116b1', '25_159' ],
  [ '8_160', '020@116b1-020@134a6', '25_160' ],
  [ '8_161', '020@134a6-020@152b3', '25_161' ],
  [ '8_162', '020@152b3-020@171a4', '25_162' ],
  [ '8_163', '020@171a4-020@189b1', '25_163' ],
  [ '8_164', '020@189b1-020@208a7', '25_164' ],
  [ '8_165', '020@208a7-020@226b4', '25_165' ],
  [ '8_166', '020@226b4-020@246a5', '25_166' ],
  [ '8_167', '020@246a5-020@265a3', '25_167' ],
  [ '8_168', '020@265a3-020@280a6', '25_168' ],
  [ '8_169', '020@280a6-020@297b4', '25_169' ],
  [ '8_170', '020@297b4-020@314a1', '25_170' ],
  [ '8_171', '020@314a1-020@330b5', '25_171' ],
  [ '8_172', '020@330b5-020@348a1', '25_172' ],
  [ '8_173', '020@348a1-020@365a3', '25_173' ],
  [ '8_174', '020@365a3-020@382a4', '25_174' ],
  [ '8_175', '020@382a4-021@001b1', '25_175' ],
  [ '8_176', '021@001b1-021@017b1', '25_176' ],
  [ '8_177', '021@017b1-021@029b3', '25_177' ],
  [ '8_178', '021@029b3-021@042a2', '25_178' ],
  [ '8_179', '021@042a2-021@057b5', '25_179' ],
  [ '8_180', '021@057b5-021@069b1', '25_180' ],
  [ '8_181', '021@069b1-021@085b3', '25_181' ],
  [ '8_182', '021@085b3-021@097a7', '25_182' ],
  [ '8_183', '021@097a7-021@109b4', '25_183' ],
  [ '8_184', '021@109b4-021@121b4', '25_184' ],
  [ '8_185', '021@121b4-021@136a3', '25_185' ],
  [ '8_186', '021@136a3-021@151b5', '25_186' ],
  [ '8_187', '021@151b5-021@166b4', '25_187' ],
  [ '8_188', '021@166b4-021@181a3', '25_188' ],
  [ '8_189', '021@181a3-021@192a2', '25_189' ],
  [ '8_190', '021@192a2-021@205a5', '25_190' ],
  [ '8_191', '021@205a5-021@220b1', '25_191' ],
  [ '8_192', '021@220b1-021@241b5', '25_192' ],
  [ '8_193', '021@241b5-021@268b1', '25_193' ],
  [ '8_194', '021@268b1-021@291b4', '25_194' ],
  [ '8_195', '021@291b4-021@307a6', '25_195' ],
  [ '8_196', '021@307a6-021@321a8', '25_196' ],
  [ '8_197', '021@321a8-021@338a6', '25_197' ],
  [ '8_198', '021@338a6-021@353a5', '25_198' ],
  [ '8_199', '021@353a5-021@366a4', '25_199' ],
  [ '8_200', '021@366a4-021@383a4', '25_200' ],
  [ '8_201', '021@383a4-022@001b1', '25_201' ],
  [ '8_202', '022@001b1-022@020b2', '25_202' ],
  [ '8_203', '022@020b2-022@034a1', '25_203' ],
  [ '8_204', '022@034a1-022@049a6', '25_204' ],
  [ '8_205', '022@049a6-022@065a6', '25_205' ],
  [ '8_206', '022@065a6-022@077b4', '25_206' ],
  [ '8_207', '022@077b4-022@095b7', '25_207' ],
  [ '8_208', '022@095b7-022@111b7', '25_208' ],
  [ '8_209', '022@111b7-022@126a3', '25_209' ],
  [ '8_210', '022@126a3-022@140b3', '25_210' ],
  [ '8_211', '022@140b3-022@158b1', '25_211' ],
  [ '8_212', '022@158b1-022@174a2', '25_212' ],
  [ '8_213', '022@174a2-022@190b2', '25_213' ],
  [ '8_214', '022@190b2-022@206a7', '25_214' ],
  [ '8_215', '022@206a7-022@220b2', '25_215' ],
  [ '8_216', '022@220b2-022@233b3', '25_216' ],
  [ '8_217', '022@233b3-022@246b7', '25_217' ],
  [ '8_218', '022@246b7-022@262a2', '25_218' ],
  [ '8_219', '022@262a2-022@275b4', '25_219' ],
  [ '8_220', '022@275b4-022@291a2', '25_220' ],
  [ '8_221', '022@291a2-022@304b7', '25_221' ],
  [ '8_222', '022@304b7-022@320a3', '25_222' ],
  [ '8_223', '022@320a3-022@339b1', '25_223' ],
  [ '8_224', '022@339b1-022@356b2', '25_224' ],
  [ '8_225', '022@356b2-022@370a4', '25_225' ],
  [ '8_226', '022@370a4-023@001b1', '25_226' ],
  [ '8_227', '023@001b1-023@017a4', '25_227' ],
  [ '8_228', '023@017a4-023@030b6', '25_228' ],
  [ '8_229', '023@030b6-023@044a3', '25_229' ],
  [ '8_230', '023@044a3-023@061b4', '25_230' ],
  [ '8_231', '023@061b4-023@075b3', '25_231' ],
  [ '8_232', '023@075b3-023@087a4', '25_232' ],
  [ '8_233', '023@087a4-023@102a2', '25_233' ],
  [ '8_234', '023@102a2-023@117a7', '25_234' ],
  [ '8_235', '023@117a7-023@132b1', '25_235' ],
  [ '8_236', '023@132b1-023@144a6', '25_236' ],
  [ '8_237', '023@144a6-023@160b5', '25_237' ],
  [ '8_238', '023@160b5-023@181b6', '25_238' ],
  [ '8_239', '023@181b6-023@196a7', '25_239' ],
  [ '8_240', '023@196a7-023@212a5', '25_240' ],
  [ '8_241', '023@212a5-023@223a7', '25_241' ],
  [ '8_242', '023@223a7-023@234b2', '25_242' ],
  [ '8_243', '023@234b2-023@249a6', '25_243' ],
  [ '8_244', '023@249a6-023@263a5', '25_244' ],
  [ '8_245', '023@263a5-023@281a3', '25_245' ],
  [ '8_246', '023@281a3-023@295b3', '25_246' ],
  [ '8_247', '023@295b3-023@311b7', '25_247' ],
  [ '8_248', '023@311b7-023@327b5', '25_248' ],
  [ '8_249', '023@327b5-023@341a6', '25_249' ],
  [ '8_250', '023@341a6-023@353b4', '25_250' ],
  [ '8_251', '023@353b4-023@371b7', '25_251' ],
  [ '8_252', '023@371b7-024@001b1', '25_252' ],
  [ '8_253', '024@001b1-024@017b5', '25_253' ],
  [ '8_254', '024@017b5-024@033a5', '25_254' ],
  [ '8_255', '024@033a5-024@047b6', '25_255' ],
  [ '8_256', '024@047b6-024@063a2', '25_256' ],
  [ '8_257', '024@063a2-024@076a3', '25_257' ],
  [ '8_258', '024@076a3-024@090a3', '25_258' ],
  [ '8_259', '024@090a3-024@107a2', '25_259' ],
  [ '8_260', '024@107a2-024@128b2', '25_260' ],
  [ '8_261', '024@128b2-024@146a1', '25_261' ],
  [ '8_262', '024@146a1-024@165b6', '25_262' ],
  [ '8_263', '024@165b6-024@183a2', '25_263' ],
  [ '8_264', '024@183a2-024@200b4', '25_264' ],
  [ '8_265', '024@200b4-024@221a1', '25_265' ],
  [ '8_266', '024@221a1-024@241b4', '25_266' ],
  [ '8_267', '024@241b4-024@255a1', '25_267' ],
  [ '8_268', '024@255a1-024@279a4', '25_268' ],
  [ '8_269', '024@279a4-024@303b3', '25_269' ],
  [ '8_270', '024@303b3-024@325b5', '25_270' ],
  [ '8_271', '024@325b5-024@345a4', '25_271' ],
  [ '8_272', '024@345a4-024@361a7', '25_272' ],
  [ '8_273', '024@361a7-024@377b3', '25_273' ],
  [ '8_274', '024@377b3-024@396a2', '25_274' ],
  [ '8_275', '024@396a2-025@001b1', '25_275' ],
  [ '8_276', '025@001b1-025@018b1', '25_276' ],
  [ '8_277', '025@018b1-025@029a6', '25_277' ],
  [ '8_278', '025@029a6-025@038b6', '25_278' ],
  [ '8_279', '025@038b6-025@055a5', '25_279' ],
  [ '8_280', '025@055a5-025@071a7', '25_280' ],
  [ '8_281', '025@071a7-025@088b3', '25_281' ],
  [ '8_282', '025@088b3-025@103a7', '25_282' ],
  [ '8_283', '025@103a7-025@123a7', '25_283' ],
  [ '8_284', '025@123a7-025@142b6', '25_284' ],
  [ '8_285', '025@142b6-025@162a7', '25_285' ],
  [ '8_286', '025@162a7-025@180a2', '25_286' ],
  [ '8_287', '025@180a2-025@201a1', '25_287' ],
  [ '8_288', '025@201a1-025@217a5', '25_288' ],
  [ '8_289', '025@217a5-025@230b5', '25_289' ],
  [ '8_290', '025@230b5-025@244a1', '25_290' ],
  [ '8_291', '025@244a1-025@256a2', '25_291' ],
  [ '8_292', '025@256a2-025@269a6', '25_292' ],
  [ '8_293', '025@269a6-025@282b2', '25_293' ],
  [ '8_294', '025@282b2-025@296b1', '25_294' ],
  [ '8_295', '025@296b1-025@312b2', '25_295' ],
  [ '8_296', '025@312b2-025@327b2', '25_296' ],
  [ '8_297', '025@327b2-025@347a3', '25_297' ],
  [ '8_298', '025@347a3-025@362a1', '25_298' ],
  [ '8_299', '025@362a1-025@379b5', '25_299' ],
  [ '8_300', '025@379b5-025@395a6', '25_300' ],
  [ '9_1', '026@001b1-026@016b1', '26_1' ],
  [ '9_2', '026@016b1-026@031a1', '26_2' ],
  [ '9_3', '026@031a1-026@046b6', '26_3' ],
  [ '9_4', '026@046b6-026@062a3', '26_4' ],
  [ '9_5', '026@062a3-026@076b4', '26_5' ],
  [ '9_6', '026@076b4-026@091b6', '26_6' ],
  [ '9_7', '026@091b6-026@108b5', '26_7' ],
  [ '9_8', '026@108b5-026@123b4', '26_8' ],
  [ '9_9', '026@123b4-026@137a7', '26_9' ],
  [ '9_10', '026@137a7-026@151b2', '26_10' ],
  [ '9_11', '026@151b2-026@165b6', '26_11' ],
  [ '9_12', '026@165b6-026@180a3', '26_12' ],
  [ '9_13', '026@180a3-026@195a3', '26_13' ],
  [ '9_14', '026@195a3-026@210a6', '26_14' ],
  [ '9_15', '026@210a6-026@223b2', '26_15' ],
  [ '9_16', '026@223b2-026@236b6', '26_16' ],
  [ '9_17', '026@236b6-026@251a4', '26_17' ],
  [ '9_18', '026@251a4-026@266b6', '26_18' ],
  [ '9_19', '026@266b6-026@280a2', '26_19' ],
  [ '9_20', '026@280a2-026@293b1', '26_20' ],
  [ '9_21', '026@293b1-026@308a7', '26_21' ],
  [ '9_22', '026@308a7-026@323b4', '26_22' ],
  [ '9_23', '026@323b4-026@337b7', '26_23' ],
  [ '9_24', '026@337b7-026@352a6', '26_24' ],
  [ '9_25', '026@352a6-026@367b6', '26_25' ],
  [ '9_26', '026@367b6-027@001b1', '26_26' ],
  [ '9_27', '027@001b1-027@015b1', '26_27' ],
  [ '9_28', '027@015b1-027@028b5', '26_28' ],
  [ '9_29', '027@028b5-027@044a2', '26_29' ],
  [ '9_30', '027@044a2-027@062a3', '26_30' ],
  [ '9_31', '027@062a3-027@076a6', '26_31' ],
  [ '9_32', '027@076a6-027@092a7', '26_32' ],
  [ '9_33', '027@092a7-027@107a4', '26_33' ],
  [ '9_34', '027@107a4-027@124a2', '26_34' ],
  [ '9_35', '027@124a2-027@139a3', '26_35' ],
  [ '9_36', '027@139a3-027@154b3', '26_36' ],
  [ '9_37', '027@154b3-027@171a3', '26_37' ],
  [ '9_38', '027@171a3-027@186a7', '26_38' ],
  [ '9_39', '027@186a7-027@201a3', '26_39' ],
  [ '9_40', '027@201a3-027@215b1', '26_40' ],
  [ '9_41', '027@215b1-027@229b3', '26_41' ],
  [ '9_42', '027@229b3-027@243b5', '26_42' ],
  [ '9_43', '027@243b5-027@257a1', '26_43' ],
  [ '9_44', '027@257a1-027@268b4', '26_44' ],
  [ '9_45', '027@268b4-027@282b4', '26_45' ],
  [ '9_46', '027@282b4-027@295a3', '26_46' ],
  [ '9_47', '027@295a3-027@308a6', '26_47' ],
  [ '9_48', '027@308a6-027@324b5', '26_48' ],
  [ '9_49', '027@324b5-027@341b7', '26_49' ],
  [ '9_50', '027@341b7-027@359b6', '26_50' ],
  [ '9_51', '027@359b6-027@376a6', '26_51' ],
  [ '9_52', '027@376a6-028@001b1', '26_52' ],
  [ '9_53', '028@001b1-028@017b7', '26_53' ],
  [ '9_54', '028@017b7-028@037a3', '26_54' ],
  [ '9_55', '028@037a3-028@053a2', '26_55' ],
  [ '9_56', '028@053a2-028@070a6', '26_56' ],
  [ '9_57', '028@070a6-028@085b5', '26_57' ],
  [ '9_58', '028@085b5-028@101b5', '26_58' ],
  [ '9_59', '028@101b5-028@117a1', '26_59' ],
  [ '9_60', '028@117a1-028@129b7', '26_60' ],
  [ '9_61', '028@129b7-028@145a4', '26_61' ],
  [ '9_62', '028@145a4-028@159a5', '26_62' ],
  [ '9_63', '028@159a5-028@174b7', '26_63' ],
  [ '9_64', '028@174b7-028@189b6', '26_64' ],
  [ '9_65', '028@189b6-028@206a5', '26_65' ],
  [ '9_66', '028@206a5-028@221b2', '26_66' ],
  [ '9_67', '028@221b2-028@234b1', '26_67' ],
  [ '9_68', '028@234b1-028@247b3', '26_68' ],
  [ '9_69', '028@247b3-028@259b6', '26_69' ],
  [ '9_70', '028@259b6-028@274a2', '26_70' ],
  [ '9_71', '028@274a2-028@286b6', '26_71' ],
  [ '9_72', '028@286b6-028@300a4', '26_72' ],
  [ '9_73', '028@300a4-028@314b2', '26_73' ],
  [ '9_74', '028@314b2-028@329b1', '26_74' ],
  [ '9_75', '028@329b1-028@342b5', '26_75' ],
  [ '9_76', '028@342b5-028@353b1', '26_76' ],
  [ '9_77', '028@353b1-028@366a4', '26_77' ],
  [ '9_78', '028@366a4-028@381a5', '26_78' ],
  [ '10_1', '029@001b2-029@015b7', '27_1' ],
  [ '10_2', '029@015b7-029@030a7', '27_2' ],
  [ '10_3', '029@030a7-029@043a4', '27_3' ],
  [ '10_4', '029@043a4-029@056a3', '27_4' ],
  [ '10_5', '029@056a3-029@070b6', '27_5' ],
  [ '10_6', '029@070b6-029@085a1', '27_6' ],
  [ '10_7', '029@085a1-029@099b2', '27_7' ],
  [ '10_8', '029@099b2-029@114a4', '27_8' ],
  [ '10_9', '029@114a4-029@132a1', '27_9' ],
  [ '10_10', '029@132a1-029@143b1', '27_10' ],
  [ '10_11', '029@143b1-029@155a4', '27_11' ],
  [ '10_12', '029@155a4-029@168a2', '27_12' ],
  [ '10_13', '029@168a2-029@183b7', '27_13' ],
  [ '10_14', '029@183b7-029@197a7', '27_14' ],
  [ '10_15', '029@197a7-029@209b1', '27_15' ],
  [ '10_16', '029@209b1-029@223b5', '27_16' ],
  [ '10_17', '029@223b5-029@238a7', '27_17' ],
  [ '10_18', '029@238a7-029@252b1', '27_18' ],
  [ '10_19', '029@252b1-029@264a1', '27_19' ],
  [ '10_20', '029@264a1-029@275a3', '27_20' ],
  [ '10_21', '029@275a3-029@287b6', '27_21' ],
  [ '10_22', '029@287b6-030@001b1', '27_22' ],
  [ '10_23', '030@001b1-030@014a4', '27_23' ],
  [ '10_24', '030@014a4-030@026b5', '27_24' ],
  [ '10_25', '030@026b5-030@038b2', '27_25' ],
  [ '10_26', '030@038b2-030@052a4', '27_26' ],
  [ '10_27', '030@052a4-030@064b2', '27_27' ],
  [ '10_28', '030@064b2-030@076b6', '27_28' ],
  [ '10_29', '030@076b6-030@088b4', '27_29' ],
  [ '10_30', '030@088b4-030@101b5', '27_30' ],
  [ '10_31', '030@101b5-030@113a4', '27_31' ],
  [ '10_32', '030@113a4-030@128a7', '27_32' ],
  [ '10_33', '030@128a7-030@141a3', '27_33' ],
  [ '10_34', '030@141a3-030@155a2', '27_34' ],
  [ '10_35', '030@155a2-030@166b4', '27_35' ],
  [ '10_36', '030@166b4-030@182a2', '27_36' ],
  [ '10_37', '030@182a2-030@196b1', '27_37' ],
  [ '10_38', '030@196b1-030@210b7', '27_38' ],
  [ '10_39', '030@210b7-030@225a2', '27_39' ],
  [ '10_40', '030@225a2-030@239b1', '27_40' ],
  [ '10_41', '030@239b1-030@258a2', '27_41' ],
  [ '10_42', '030@258a2-030@273b1', '27_42' ],
  [ '10_43', '030@273b1-030@289b3', '27_43' ],
  [ '10_44', '030@289b3-031@001b1', '27_44' ],
  [ '10_45', '031@001b1-031@014a2', '27_45' ],
  [ '10_46', '031@014a2-031@026a3', '27_46' ],
  [ '10_47', '031@026a3-031@039a2', '27_47' ],
  [ '10_48', '031@039a2-031@051a4', '27_48' ],
  [ '10_49', '031@051a4-031@061b1', '27_49' ],
  [ '10_50', '031@061b1-031@074b2', '27_50' ],
  [ '10_51', '031@074b2-031@085b2', '27_51' ],
  [ '10_52', '031@085b2-031@099b3', '27_52' ],
  [ '10_53', '031@099b3-031@114b6', '27_53' ],
  [ '10_54', '031@114b6-031@128a4', '27_54' ],
  [ '10_55', '031@128a4-031@141a3', '27_55' ],
  [ '10_56', '031@141a3-031@152a7', '27_56' ],
  [ '10_57', '031@152a7-031@163a5', '27_57' ],
  [ '10_58', '031@163a5-031@181a7', '27_58' ],
  [ '10_59', '031@181a7-031@193b2', '27_59' ],
  [ '10_60', '031@193b2-031@206a7', '27_60' ],
  [ '11_1', '031@207b1-031@217b7', '28_1' ],
  [ '11_2', '031@217b7-031@229b3', '28_2' ],
  [ '11_3', '031@229b3-031@239b4', '28_3' ],
  [ '11_4', '031@239b4-031@251b2', '28_4' ],
  [ '11_5', '031@251b2-031@262b5', '28_5' ],
  [ '11_6', '031@262b5-031@274a1', '28_6' ],
  [ '11_7', '031@274a1-031@285a7', '28_7' ],
  [ '11_8', '031@285a7-032@001a1', '28_8' ],
  [ '11_9', '032@001a1-032@012b4', '28_9' ],
  [ '11_10', '032@012b4-032@023b4', '28_10' ],
  [ '11_11', '032@023b4-032@034a4', '28_11' ],
  [ '11_12', '032@034a4-032@046a5', '28_12' ],
  [ '11_13', '032@046a5-032@057a5', '28_13' ],
  [ '11_14', '032@057a5-032@068a2', '28_14' ],
  [ '11_15', '032@068a2-032@080a6', '28_15' ],
  [ '11_16', '032@080a6-032@090b6', '28_16' ],
  [ '11_17', '032@090b6-032@103a1', '28_17' ],
  [ '11_18', '032@103a1-032@114b2', '28_18' ],
  [ '11_19', '032@114b2-032@126b2', '28_19' ],
  [ '11_20', '032@126b2-032@136b3', '28_20' ],
  [ '11_21', '032@136b3-032@146b2', '28_21' ],
  [ '11_22', '032@146b2-032@161b3', '28_22' ],
  [ '11_23', '032@161b3-032@175a6', '28_23' ],
  [ '11_24', '032@175a6-032@187b7', '28_24' ],
  [ '11_25', '032@187b7-032@200a1', '28_25' ],
  [ '11_26', '032@200a1-032@211a4', '28_26' ],
  [ '11_27', '032@211a4-032@223a1', '28_27' ],
  [ '11_28', '032@223a1-032@235a2', '28_28' ],
  [ '11_29', '032@235a2-032@247b5', '28_29' ],
  [ '11_30', '032@247b5-032@259a1', '28_30' ],
  [ '11_31', '032@259a1-032@268b5', '28_31' ],
  [ '11_32', '032@268b5-032@280a1', '28_32' ],
  [ '11_33', '032@280a1-032@293b2', '28_33' ],
  [ '11_34', '032@293b2-032@397a7', '28_34' ],
  [ '12_1', '033@001b1-033@016a6', '29_1' ],
  [ '12_2', '033@016a6-033@028a2', '29_2' ],
  [ '12_3', '033@028a2-033@042b5', '29_3' ],
  [ '12_4', '033@042b5-033@054b3', '29_4' ],
  [ '12_5', '033@054b3-033@067a7', '29_5' ],
  [ '12_6', '033@067a7-033@078b4', '29_6' ],
  [ '12_7', '033@078b4-033@091a5', '29_7' ],
  [ '12_8', '033@091a5-033@104a4', '29_8' ],
  [ '12_9', '033@104a4-033@116a2', '29_9' ],
  [ '12_10', '033@116a2-033@128a5', '29_10' ],
  [ '12_11', '033@128a5-033@138b6', '29_11' ],
  [ '12_12', '033@138b6-033@149a3', '29_12' ],
  [ '12_13', '033@149a3-033@160a2', '29_13' ],
  [ '12_14', '033@160a2-033@169b7', '29_14' ],
  [ '12_15', '033@169b7-033@182a4', '29_15' ],
  [ '12_16', '033@182a4-033@193b3', '29_16' ],
  [ '12_17', '033@193b3-033@205a1', '29_17' ],
  [ '12_18', '033@205a1-033@216a6', '29_18' ],
  [ '12_19', '033@216a6-033@226a5', '29_19' ],
  [ '12_20', '033@226a5-033@234b7', '29_20' ],
  [ '12_21', '033@234b7-033@246b7', '29_21' ],
  [ '12_22', '033@246b7-033@261a3', '29_22' ],
  [ '12_23', '033@261a3-033@273a2', '29_23' ],
  [ '12_24', '033@273a2-033@286a6', '29_24' ],
  [ '13', '034@001b1-019b7', '30' ],
  [ '14_1', '034@020a1-034@032b7', '31_1' ],
  [ '14_2', '034@032b7-034@047b4', '31_2' ],
  [ '14_3', '034@047b4-034@063b6', '31_3' ],
  [ '14_4', '034@063b6-034@076a2', '31_4' ],
  [ '14_5', '034@076a2-034@089a7', '31_5' ],
  [ '14_6', '034@089a7-034@103b7', '31_6' ],
  [ '15', '034@104a1-120b7', '32' ],
  [ '16', '034@121a1-132b7', '33' ],
  [ '17', '034@133a1-139b6', '34' ],
  [ '18', '034@139b6-142a4', '35' ],
  [ '19', '034@142a4-143b5', '36' ],
  [ '20', '034@143b5-144b6', '37' ],
  [ '21', '034@144b6-146a3', '38' ],
  [ '22', '034@146a3-147b3', '39' ],
  [ '23', '034@147b3-147b7', '40' ],
  [ '24_1', '034@148a1-034@161b5', '41_1' ],
  [ '24_2', '034@161b5-034@174a2', '41_2' ],
  [ '25', '034@174a2-175b3', '42' ],
  [ '26', '034@175b3-176b6', '43' ],
  [ '27', '034@176b6-177b6', '44' ],
  [ '28', '034@177b6-178a6', '45' ],
  [ '29', '034@178a6-178b6', '46' ],
  [ '30', '034@178b6-179a7', '47' ],
  [ '31', '034@180a1-183a7', '48' ],
  [ '32', '034@183a7-250a5', '49' ],
  [ '33', '034@250a5-259b4', '50' ],
  [ '34', '034@259b4-263a4', '51' ],
  [ '35', '034@263a4-270a1', '52' ],
  [ '36', '034@270a1-270b7', '53' ],
  [ '37', '034@271a1-276a5', '54' ],
  [ '38', '034@276a5-279a2', '55' ],
  [ '39', '034@279a2-281b1', '56' ],
  [ '40', '034@281b1-282a6', '57' ],
  [ '41', '034@282a6-282b6', '58' ],
  [ '42', '034@282b6-283a5', '59' ],
  [ '43', '034@283a5-284a7', '60' ],
  [ '44', '035@001b1-393a5', '61' ],
  [ '44', '036@001b1-396a6', '61' ],
  [ '44', '037@001b1-396a7', '61' ],
  [ '44', '038@001b1-363a6', '61' ],
  [ '45', '039@001b1-045a7', '62' ],
  [ '46', '039@045b1-099b7', '63' ],
  [ '47', '039@100a1-203a7', '64' ],
  [ '48', '039@203b1-237a7', '65' ],
  [ '49', '039@237b1-270a5', '66' ],
  [ '50', '040@001b1-070a7', '67' ],
  [ '51', '040@070b1-140a7', '68' ],
  [ '52', '040@140b1-164a5', '69' ],
  [ '53', '040@164a6-184b6', '70' ],
  [ '54', '040@184b6-195a7', '71' ],
  [ '55', '040@195b1-255b1', '72' ],
  [ '56', '040@255b1-294a7', '73' ],
  [ '56', '041@001b1-205b1', '73' ],
  [ '57', '041@205b1-236b7', '74' ],
  [ '58', '041@237a1-248a7', '75' ],
  [ '59', '041@248b1-297a3', '76' ],
  [ '60', '042@001b1-168a7', '77' ],
  [ '61', '042@168b1-227a6', '78' ],
  [ '62', '042@227a7-257a7', '79' ],
  [ '63', '042@257a7-288a4', '80' ],
  [ '64', '043@001b1-017b4', '81' ],
  [ '65', '043@017b4-036a1', '82' ],
  [ '66', '043@036a1-067b7', '83' ],
  [ '67', '043@068a1-114b7', '84' ],
  [ '68', '043@115a1-131a7', '85' ],
  [ '69', '043@131a7-153b7', '86' ],
  [ '70', '043@154a1-180b7', '87' ],
  [ '71', '043@181a1-193b7', '88' ],
  [ '72', '043@194a1-204b1', '89' ],
  [ '73', '043@204b1-215b7', '90' ],
  [ '74', '043@216a1-222a3', '91' ],
  [ '75', '043@222a3-225b3', '92' ],
  [ '76', '043@225b3-240b7', '93' ],
  [ '77', '043@241a1-261b6', '94' ],
  [ '78', '043@261b6-266b6', '95' ],
  [ '79', '043@266b6-284b7', '96' ],
  [ '80', '043@285a1-309a7', '97' ],
  [ '80', '044@001b1-027a4', '97' ],
  [ '81', '044@027a4-029b7', '98' ],
  [ '82', '044@030a1-070b7', '99' ],
  [ '83', '044@071a1-094b7', '100' ],
  [ '84', '044@095a1-104b1', '101' ],
  [ '85', '044@104b1-116b2', '102' ],
  [ '86', '044@116b2-119a7', '103' ],
  [ '87', '044@119b1-151b7', '104' ],
  [ '88', '044@152a1-175b2', '105' ],
  [ '89', '044@175b2-182b6', '106' ],
  [ '90', '044@182b6-209b7', '107' ],
  [ '91', '044@210a1-254b7', '108' ],
  [ '92', '044@255a1-277b7', '109' ],
  [ '93', '044@278a1-299a7', '110' ],
  [ '94_1', '045@001b1-045@014a6', '111_1' ],
  [ '94_2', '045@014a6-045@026a7', '111_2' ],
  [ '94_3', '045@026a7-045@038a4', '111_3' ],
  [ '94_4', '045@038a4-045@049b4', '111_4' ],
  [ '94_5', '045@049b4-045@060b4', '111_5' ],
  [ '94_6', '045@060b4-045@072a5', '111_6' ],
  [ '94_7', '045@072a5-045@084b7', '111_7' ],
  [ '94_8', '045@084b7-045@096b1', '111_8' ],
  [ '94_9', '045@096b1-045@110a3', '111_9' ],
  [ '94_10', '045@110a3-045@123a4', '111_10' ],
  [ '94_11', '045@123a4-045@137b1', '111_11' ],
  [ '94_12', '045@137b1-045@151a5', '111_12' ],
  [ '94_13', '045@151a5-045@165a2', '111_13' ],
  [ '94_14', '045@165a2-045@179a2', '111_14' ],
  [ '94_15', '045@179a2-045@191b4', '111_15' ],
  [ '94_16', '045@191b4-045@204b5', '111_16' ],
  [ '94_17', '045@204b5-045@218a7', '111_17' ],
  [ '94_18', '045@218a7-045@230a4', '111_18' ],
  [ '94_19', '045@230a4-045@243b1', '111_19' ],
  [ '94_20', '045@243b1-045@256a6', '111_20' ],
  [ '94_21', '045@256a6-045@268a2', '111_21' ],
  [ '94_22', '045@268a2-045@282a2', '111_22' ],
  [ '94_23', '045@282a2-045@296a2', '111_23' ],
  [ '94_24', '045@296a2-045@310b5', '111_24' ],
  [ '94_25', '045@310b5-045@325a6', '111_25' ],
  [ '94_26', '045@325a6-045@340a5', '111_26' ],
  [ '95_1', '046@001b1-046@013a7', '112_1' ],
  [ '95_2', '046@013a7-046@025b1', '112_2' ],
  [ '95_3', '046@025b1-046@037a2', '112_3' ],
  [ '95_4', '046@037a2-046@048a6', '112_4' ],
  [ '95_5', '046@048a6-046@060b2', '112_5' ],
  [ '95_6', '046@060b2-046@071a4', '112_6' ],
  [ '95_7', '046@071a4-046@082a1', '112_7' ],
  [ '95_8', '046@082a1-046@091b3', '112_8' ],
  [ '95_9', '046@091b3-046@102b7', '112_9' ],
  [ '95_10', '046@102b7-046@117a2', '112_10' ],
  [ '95_11', '046@117a2-046@129b5', '112_11' ],
  [ '95_12', '046@129b5-046@143a2', '112_12' ],
  [ '95_13', '046@143a2-046@156a5', '112_13' ],
  [ '95_14', '046@156a5-046@169a6', '112_14' ],
  [ '95_15', '046@169a6-046@180b1', '112_15' ],
  [ '95_16', '046@180b1-046@192b7', '112_16' ],
  [ '95_17', '046@192b7-046@203a7', '112_17' ],
  [ '95_18', '046@203a7-046@216b7', '112_18' ],
  [ '96_1', '046@217a1-046@228a4', '113_1' ],
  [ '96_2', '046@228a4-046@241b7', '113_2' ],
  [ '97', '046@242a1-257b7', '114' ],
  [ '98', '046@258a1-278a4', '115' ],
  [ '99_1', '047@001b2-047@013a1', '117_1' ],
  [ '99_2', '047@013a1-047@024a4', '117_2' ],
  [ '99_3', '047@024a4-047@035b3', '117_3' ],
  [ '99_4', '047@035b3-047@047a3', '117_4' ],
  [ '99_5', '047@047a3-047@057a2', '117_5' ],
  [ '99_6', '047@057a2-047@067b7', '117_6' ],
  [ '99_7', '047@067b7-047@078b2', '117_7' ],
  [ '99_8', '047@078b2-047@088b2', '117_8' ],
  [ '99_9', '047@088b2-047@099a4', '117_9' ],
  [ '99_10', '047@099a4-047@109b1', '117_10' ],
  [ '99_11', '047@109b1-047@120b7', '117_11' ],
  [ '99_12', '047@120b7-047@133b5', '117_12' ],
  [ '99_13', '047@133b5-047@146b4', '117_13' ],
  [ '99_14', '047@146b4-047@158b1', '117_14' ],
  [ '99_15', '047@158b1-047@169b3', '117_15' ],
  [ '99_16', '047@169b3-047@181b1', '117_16' ],
  [ '99_17', '047@181b1-047@192a7', '117_17' ],
  [ '99_18', '047@192a7-047@204a2', '117_18' ],
  [ '99_19', '047@204a2-047@214b5', '117_19' ],
  [ '99_20', '047@214b5-047@225a7', '117_20' ],
  [ '99_21', '047@225a7-047@236b3', '117_21' ],
  [ '99_22', '047@236b3-047@246b6', '117_22' ],
  [ '99_23', '047@246b6-047@257a7', '117_23' ],
  [ '99_24', '047@257a7-047@268b3', '117_24' ],
  [ '99_25', '047@268b3-047@275b7', '117_25' ],
  [ '100_1', '047@276a1-047@286a7', '118_1' ],
  [ '100_2', '047@286a7-047@295b4', '118_2' ],
  [ '100_3', '047@295b4-047@305a7', '118_3' ],
  [ '101_1', '048@001b2-048@016a3', '119_1' ],
  [ '101_2', '048@016a3-048@030b3', '119_2' ],
  [ '101_3', '048@030b3-048@043b3', '119_3' ],
  [ '101_4', '048@043b3-048@057a5', '119_4' ],
  [ '101_5', '048@057a5-048@070a2', '119_5' ],
  [ '101_6', '048@070a2-048@082b1', '119_6' ],
  [ '101_7', '048@082b1-048@093b3', '119_7' ],
  [ '101_8', '048@093b3-048@106b4', '119_8' ],
  [ '101_9', '048@106b4-048@119b6', '119_9' ],
  [ '101_10', '048@119b6-048@132b6', '119_10' ],
  [ '101_11', '048@132b6-048@145b5', '119_11' ],
  [ '101_12', '048@145b5-048@159a5', '119_12' ],
  [ '101_13', '048@159a5-048@173a1', '119_13' ],
  [ '101_14', '048@173a1-048@185b2', '119_14' ],
  [ '101_15', '048@185b2-048@197b2', '119_15' ],
  [ '101_16', '048@197b2-048@209b4', '119_16' ],
  [ '101_17', '048@209b4-048@220a6', '119_17' ],
  [ '101_18', '048@220a6-048@227b7', '119_18' ],
  [ '102_1', '048@227a1-048@239b7', '120_1' ],
  [ '102_2', '048@239b7-048@251b7', '120_2' ],
  [ '102_3', '048@251b7-048@262b3', '120_3' ],
  [ '102_4', '048@262b3-048@274b7', '120_4' ],
  [ '103', '048@275a1-285b4', '121' ],
  [ '104', '048@285b4-286b7', '122' ],
  [ '105', '048@286b7-288a7', '123' ],
  [ '106_1', '049@001b1-049@019a6', '124_1' ],
  [ '106_2', '049@019a6-049@037b6', '124_2' ],
  [ '106_3', '049@037b6-049@055b7', '124_3' ],
  [ '107_1', '049@056a1-049@069a5', '125_1' ],
  [ '107_2', '049@069a5-049@082b6', '125_2' ],
  [ '107_3', '049@082b6-049@097b3', '125_3' ],
  [ '107_4', '049@097b3-049@111a4', '125_4' ],
  [ '107_5', '049@111a4-049@127b4', '125_5' ],
  [ '107_6', '049@127b4-049@144a6', '125_6' ],
  [ '107_7', '049@144a6-049@159a1', '125_7' ],
  [ '107_8', '049@159a1-049@173a1', '125_8' ],
  [ '107_9', '049@173a1-049@191b7', '125_9' ],
  [ '108_1', '049@192a1-049@204a5', '126_1' ],
  [ '108_2', '049@204a5-049@216a5', '126_2' ],
  [ '108_3', '049@216a5-049@227a1', '126_3' ],
  [ '108_4', '049@227a1-049@240a1', '126_4' ],
  [ '108_5', '049@240a1-049@250b7', '126_5' ],
  [ '108_6', '049@250b7-049@260b6', '126_6' ],
  [ '108_7', '049@260b6-049@272a5', '126_7' ],
  [ '108_8', '049@272a5-049@284b7', '126_8' ],
  [ '109', '049@285a1-292a7', '127' ],
  [ '110_1', '050@001b1-050@020a3', '128_1' ],
  [ '110_2', '050@020a3-050@032b4', '128_2' ],
  [ '110_3', '050@032b4-050@046a1', '128_3' ],
  [ '110_4', '050@046a1-050@055b7', '128_4' ],
  [ '111_1', '050@056a1-050@066a1', '129_1' ],
  [ '111_2', '050@066a1-050@077b2', '129_2' ],
  [ '111_3', '050@077b2-050@089a5', '129_3' ],
  [ '111_4', '050@089a5-050@102a7', '129_4' ],
  [ '111_5', '050@102a7-050@115b5', '129_5' ],
  [ '111_6', '050@115b5-050@128b7', '129_6' ],
  [ '112_1', '050@129a1-050@138b7', '130_1' ],
  [ '112_2', '050@138b7-050@149a3', '130_2' ],
  [ '112_3', '050@149a3-050@160b3', '130_3' ],
  [ '112_4', '050@160b3-050@171a2', '130_4' ],
  [ '112_5', '050@171a2-050@183a1', '130_5' ],
  [ '112_6', '050@183a1-050@194a1', '130_6' ],
  [ '112_7', '050@194a1-050@204a7', '130_7' ],
  [ '112_8', '050@204a7-050@216a7', '130_8' ],
  [ '112_9', '050@216a7-050@226a3', '130_9' ],
  [ '112_10', '050@226a3-050@236b5', '130_10' ],
  [ '112_11', '050@236b5-050@247a3', '130_11' ],
  [ '112_12', '050@247a3-050@259b7', '130_12' ],
  [ '112_13', '050@259b7-050@271a3', '130_13' ],
  [ '112_14', '050@271a3-050@285a2', '130_14' ],
  [ '112_15', '050@285a2-050@297a7', '130_15' ],
  [ '113_1', '051@001b1-051@012b4', '131_1' ],
  [ '113_2', '051@012b4-051@024b5', '131_2' ],
  [ '113_3', '051@024b5-051@039a4', '131_3' ],
  [ '113_4', '051@039a4-051@050b5', '131_4' ],
  [ '113_5', '051@050b5-051@061b6', '131_5' ],
  [ '113_6', '051@061b6-051@075a6', '131_6' ],
  [ '113_7', '051@075a6-051@088b6', '131_7' ],
  [ '113_8', '051@088b6-051@103b3', '131_8' ],
  [ '113_9', '051@103b3-051@118a1', '131_9' ],
  [ '113_10', '051@118a1-051@132a5', '131_10' ],
  [ '113_11', '051@132a5-051@146b7', '131_11' ],
  [ '113_12', '051@146b7-051@164a6', '131_12' ],
  [ '113_13', '051@164a6-051@180b7', '131_13' ],
  [ '114', '051@181a1-195b4', '132' ],
  [ '115', '051@195b4-200a2', '133' ],
  [ '116_1', '051@200a3-051@212b7', '134_1' ],
  [ '116_2', '051@212b7-051@222b3', '134_2' ],
  [ '116_3', '051@222b3-051@234a7', '134_3' ],
  [ '116_4', '051@234a7-051@247b7', '134_4' ],
  [ '117_1', '051@248a1-051@258a1', '135_1' ],
  [ '117_2', '051@258a1-051@268b1', '135_2' ],
  [ '117_3', '051@268b1-051@279a7', '135_3' ],
  [ '117_4', '051@279a7-051@290a7', '135_4' ],
  [ '118', '051@290b1-298a7', '136' ],
  [ '119_1', '052@001b1-052@013a5', '137_1' ],
  [ '119_2', '052@013a5-052@024b5', '137_2' ],
  [ '119_3', '052@024b5-052@038a7', '137_3' ],
  [ '119_4', '052@038a7-052@051a6', '137_4' ],
  [ '119_5', '052@051a6-052@062b2', '137_5' ],
  [ '119_6', '052@062b2-052@073a1', '137_6' ],
  [ '119_7', '052@073a1-052@085a6', '137_7' ],
  [ '119_8', '052@085a6-052@098b2', '137_8' ],
  [ '119_9', '052@098b2-052@112b4', '137_9' ],
  [ '119_10', '052@112b4-052@123b3', '137_10' ],
  [ '119_11', '052@123b3-052@136a7', '137_11' ],
  [ '119_12', '052@136a7-052@149b3', '137_12' ],
  [ '119_13', '052@149b3-052@161a6', '137_13' ],
  [ '119_14', '052@161a6-052@174a1', '137_14' ],
  [ '119_15', '052@174a1-052@185a1', '137_15' ],
  [ '119_16', '052@185a1-052@197a1', '137_16' ],
  [ '119_17', '052@197a1-052@209a2', '137_17' ],
  [ '119_18', '052@209a2-052@221a3', '137_18' ],
  [ '119_19', '052@221a3-052@232b3', '137_19' ],
  [ '119_20', '052@232b3-052@246a1', '137_20' ],
  [ '119_21', '052@246a1-052@257a7', '137_21' ],
  [ '119_22', '052@257a7-052@269a1', '137_22' ],
  [ '119_23', '052@269a1-052@279a4', '137_23' ],
  [ '119_24', '052@279a4-052@290a5', '137_24' ],
  [ '119_25', '052@290a5-052@301b1', '137_25' ],
  [ '119_26', '052@301b1-052@313b3', '137_26' ],
  [ '119_27', '052@313b3-052@326b7', '137_27' ],
  [ '119_28', '052@326b7-053@001b1', '137_28' ],
  [ '119_29', '053@001b1-053@013a1', '137_29' ],
  [ '119_30', '053@013a1-053@024a6', '137_30' ],
  [ '119_31', '053@024a6-053@035b7', '137_31' ],
  [ '119_32', '053@035b7-053@048a6', '137_32' ],
  [ '119_33', '053@048a6-053@060b5', '137_33' ],
  [ '119_34', '053@060b5-053@073a4', '137_34' ],
  [ '119_35', '053@073a4-053@086a1', '137_35' ],
  [ '119_36', '053@086a1-053@098b3', '137_36' ],
  [ '119_37', '053@098b3-053@111a2', '137_37' ],
  [ '119_38', '053@111a2-053@124a1', '137_38' ],
  [ '119_39', '053@124a1-053@138b5', '137_39' ],
  [ '119_40', '053@138b5-053@152a1', '137_40' ],
  [ '119_41', '053@152a1-053@165b6', '137_41' ],
  [ '119_42', '053@165b6-053@177a4', '137_42' ],
  [ '119_43', '053@177a4-053@189a3', '137_43' ],
  [ '119_44', '053@189a3-053@201a2', '137_44' ],
  [ '119_45', '053@201a2-053@212b4', '137_45' ],
  [ '119_46', '053@212b4-053@225a1', '137_46' ],
  [ '119_47', '053@225a1-053@236b5', '137_47' ],
  [ '119_48', '053@236b5-053@248b6', '137_48' ],
  [ '119_49', '053@248b6-053@260b4', '137_49' ],
  [ '119_50', '053@260b4-053@272a1', '137_50' ],
  [ '119_51', '053@272a1-053@281b6', '137_51' ],
  [ '119_52', '053@281b6-053@294a5', '137_52' ],
  [ '119_53', '053@294a5-053@307a1', '137_53' ],
  [ '119_54', '053@307a1-053@318a1', '137_54' ],
  [ '119_55', '053@318a1-053@329b4', '137_55' ],
  [ '119_56', '053@329b4-053@339a7', '137_56' ],
  [ '120_1', '054@001b1-054@014b7', '138_1' ],
  [ '120_2', '054@014b7-054@028a1', '138_2' ],
  [ '120_3', '054@028a1-054@043a4', '138_3' ],
  [ '120_4', '054@043a4-054@054a4', '138_4' ],
  [ '120_5', '054@054a4-054@066b1', '138_5' ],
  [ '120_6', '054@066b1-054@077b4', '138_6' ],
  [ '120_7', '054@077b4-054@088b2', '138_7' ],
  [ '120_8', '054@088b2-054@100a1', '138_8' ],
  [ '120_9', '054@100a1-054@111a4', '138_9' ],
  [ '120_10', '054@111a4-054@122b2', '138_10' ],
  [ '120_11', '054@122b2-054@133a1', '138_11' ],
  [ '120_12', '054@133a1-054@142a3', '138_12' ],
  [ '120_13', '054@142a3-054@151a4', '138_13' ],
  [ '121', '054@151a4-152b7', '139' ],
  [ '122', '054@153a1-153b1', '140' ],
  [ '123_1', '054@153b1-054@169a3', '141_1' ],
  [ '123_2', '054@169a3-054@182a6', '141_2' ],
  [ '123_3', '054@182a6-054@197a1', '141_3' ],
  [ '123_4', '054@197a1-054@212b7', '141_4' ],
  [ '124_1', '054@212b7-054@213a1', '142_1' ],
  [ '124_2', '054@213a1-054@224b4', '142_2' ],
  [ '124_3', '054@224b4-054@236a7', '142_3' ],
  [ '124_4', '054@236a7-054@248b5', '142_4' ],
  [ '124_5', '054@248b5-054@259a4', '142_5' ],
  [ '124_6', '054@259a4-054@269a6', '142_6' ],
  [ '124_7', '054@269a6-054@292b7', '142_7' ],
  [ '125', '054@293a1-293a7', '143' ],
  [ '126', '054@293a7-296a7', '144' ],
  [ '127_1', '055@001b2-055@012a7', '145_1' ],
  [ '127_2', '055@012a7-055@024a7', '145_2' ],
  [ '127_3', '055@024a7-055@034b6', '145_3' ],
  [ '127_4', '055@034b6-055@046a7', '145_4' ],
  [ '127_5', '055@046a7-055@058a1', '145_5' ],
  [ '127_6', '055@058a1-055@071b1', '145_6' ],
  [ '127_7', '055@071b1-055@083b3', '145_7' ],
  [ '127_8', '055@083b3-055@093b2', '145_8' ],
  [ '127_9', '055@093b2-055@103b7', '145_9' ],
  [ '127_10', '055@103b7-055@116a2', '145_10' ],
  [ '127_11', '055@116a2-055@126b2', '145_11' ],
  [ '127_12', '055@126b2-055@137b4', '145_12' ],
  [ '127_13', '055@137b4-055@150b7', '145_13' ],
  [ '127_14', '055@150b7-055@161b3', '145_14' ],
  [ '127_15', '055@161b3-055@170b7', '145_15' ],
  [ '128', '055@171a1-174b4', '146' ],
  [ '129_1', '055@174b5-055@186b5', '147_1' ],
  [ '129_2', '055@186b5-055@197b6', '147_2' ],
  [ '129_3', '055@197b6-055@210b3', '147_3' ],
  [ '130', '055@210b3-230b4', '148' ],
  [ '131_1', '055@230b5-055@242b5', '149_1' ],
  [ '131_2', '055@242b5-055@253b5', '149_2' ],
  [ '132_1', '055@253b5-055@265b1', '150_1' ],
  [ '132_2', '055@265b1-055@279a4', '150_2' ],
  [ '132_3', '055@279a4-055@291a6', '150_3' ],
  [ '132_4', '055@291a6-055@303a2', '150_4' ],
  [ '132_5', '055@303a2-055@316b6', '150_5' ],
  [ '133_1', '056@001b2-056@012a4', '151_1' ],
  [ '133_2', '056@012a4-056@021b1', '151_2' ],
  [ '133_3', '056@021b1-056@032a1', '151_3' ],
  [ '133_4', '056@032a1-056@041b2', '151_4' ],
  [ '133_5', '056@041b2-056@050b4', '151_5' ],
  [ '133_6', '056@050b4-056@060b4', '151_6' ],
  [ '133_7', '056@060b4-056@070b2', '151_7' ],
  [ '134_1', '056@070b2-056@081b2', '152_1' ],
  [ '134_2', '056@081b2-056@094b7', '152_2' ],
  [ '134_3', '056@094b7-056@107a5', '152_3' ],
  [ '134_4', '056@107a5-056@121b7', '152_4' ],
  [ '135_1', '056@122a1-056@134a3', '153_1' ],
  [ '135_2', '056@134a3-056@144b2', '153_2' ],
  [ '136_1', '056@144b2-056@156a1', '154_1' ],
  [ '136_2', '056@156a1-056@167b2', '154_2' ],
  [ '136_3', '056@167b2-056@179a4', '154_3' ],
  [ '137', '056@179a4-187b2', '155' ],
  [ '138_1', '056@187b3-056@196b4', '156_1' ],
  [ '138_2', '056@196b4-056@207b3', '156_2' ],
  [ '138_3', '056@207b3-056@217a2', '156_3' ],
  [ '138_4', '056@217a2-056@226b6', '156_4' ],
  [ '138_5', '056@226b6-056@236b5', '156_5' ],
  [ '138_6', '056@236b5-056@249b7', '156_6' ],
  [ '138_7', '056@249b7-056@259b3', '156_7' ],
  [ '138_8', '056@259b3-056@277b7', '156_8' ],
  [ '139', '056@278a1-289b4', '157' ],
  [ '140', '056@289b4-299a5', '158' ],
  [ '141', '056@299a5-300a3', '159' ],
  [ '142', '057@001b1-006b1', '160' ],
  [ '143', '057@006b1-006b6', '161' ],
  [ '144_1', '057@006b6-057@034a3', '162_1' ],
  [ '145', '057@034a4-082a3', '163' ],
  [ '144_2', '057@046a5-057@034a3', '162_2' ],
  [ '146', '057@082a3-141b7', '164' ],
  [ '147_1', '057@142a1-057@153b6', '165_1' ],
  [ '147_2', '057@153b6-057@167b1', '165_2' ],
  [ '147_3', '057@167b1-057@185a6', '165_3' ],
  [ '147_4', '057@185a6-057@200b5', '165_4' ],
  [ '147_5', '057@200b5-057@215a3', '165_5' ],
  [ '147_6', '057@215a3-057@230a1', '165_6' ],
  [ '147_7', '057@230a1-057@242b7', '165_7' ],
  [ '148_1', '057@243a1-057@256a3', '166_1' ],
  [ '148_2', '057@256a3-057@270b3', '166_2' ],
  [ '148_3', '057@270b3-057@281b4', '166_3' ],
  [ '148_4', '057@281b4-057@292b7', '166_4' ],
  [ '148_5', '057@292b7-057@302a6', '166_5' ],
  [ '148_6', '057@302a6-057@310b2', '166_6' ],
  [ '148_7', '057@310b2-057@321b4', '166_7' ],
  [ '148_8', '057@321b4-057@330a7', '166_8' ],
  [ '149', '057@330b1-331a2', '167' ],
  [ '150', '057@331a2-331b5', '168' ],
  [ '151', '057@331b5-344a4', '169' ],
  [ '152_1', '058@001b1-058@013b5', '170_1' ],
  [ '152_2', '058@013b5-058@026a1', '170_2' ],
  [ '152_3', '058@026a1-058@037b4', '170_3' ],
  [ '152_4', '058@037b4-058@048a7', '170_4' ],
  [ '152_5', '058@048a7-058@058b3', '170_5' ],
  [ '152_6', '058@058b3-058@069b2', '170_6' ],
  [ '152_7', '058@069b2-058@081b5', '170_7' ],
  [ '152_8', '058@081b5-058@092a6', '170_8' ],
  [ '152_9', '058@092a6-058@104b2', '170_9' ],
  [ '152_10', '058@104b2-058@115b7', '170_10' ],
  [ '153_1', '058@116a1-058@129a7', '171_1' ],
  [ '153_2', '058@129a7-058@141b6', '171_2' ],
  [ '153_3', '058@141b6-058@154a7', '171_3' ],
  [ '153_4', '058@154a7-058@165b1', '171_4' ],
  [ '153_5', '058@165b1-058@178a2', '171_5' ],
  [ '153_6', '058@178a2-058@187b1', '171_6' ],
  [ '153_7', '058@187b1-058@198a3', '171_7' ],
  [ '154', '058@198a3-205a6', '172' ],
  [ '155', '058@205a6-205b7', '173' ],
  [ '156', '058@206a1-253b7', '174' ],
  [ '157_1', '058@254a1-058@265b4', '175_1' ],
  [ '157_2', '058@265b4-058@276b3', '175_2' ],
  [ '157_3', '058@276b3-058@290b2', '175_3' ],
  [ '157_4', '058@290b2-058@305a1', '175_4' ],
  [ '157_5', '058@305a1-058@319a7', '175_5' ],
  [ '158', '059@001b1-010b4', '176' ],
  [ '159', '059@010b4-022b7', '177' ],
  [ '160_1', '059@023a1-059@036a7', '178_1' ],
  [ '160_2', '059@036a7-059@049a5', '178_2' ],
  [ '160_3', '059@049a5-059@062b4', '178_3' ],
  [ '160_4', '059@062b4-059@075a1', '178_4' ],
  [ '160_5', '059@075a1-059@087a2', '178_5' ],
  [ '160_6', '059@087a2-059@100b7', '178_6' ],
  [ '161_1', '059@101a1-059@114a2', '179_1' ],
  [ '161_2', '059@114a2-059@125b7', '179_2' ],
  [ '161_3', '059@125b7-059@139b4', '179_3' ],
  [ '162', '059@139b5-143b7', '180' ],
  [ '163', '059@144a1-159b7', '181' ],
  [ '164', '059@160a1-167b2', '182' ],
  [ '165', '059@167b2-171b3', '183' ],
  [ '166', '059@171b3-175a7', '184' ],
  [ '167_1', '059@175b1-059@185b6', '185_1' ],
  [ '167_2', '059@185b6-059@198a1', '185_2' ],
  [ '167_3', '059@198a1-059@210b7', '185_3' ],
  [ '168_1', '059@211a1-059@222b6', '186_1' ],
  [ '168_2', '059@222b6-059@234a2', '186_2' ],
  [ '168_3', '059@234a2-059@245b2', '186_3' ],
  [ '168_4', '059@245b2-059@259b7', '186_4' ],
  [ '169_1', '059@260a1-059@272b6', '187_1' ],
  [ '169_2', '059@272b6-059@284b4', '187_2' ],
  [ '169_3', '059@284b4-059@297a2', '187_3' ],
  [ '169_4', '059@297a2-059@307a7', '187_4' ],
  [ '170', '059@307b1-310b3', '188' ],
  [ '171', '059@310b4-314a7', '189' ],
  [ '172', '060@001b1-005a7', '190' ],
  [ '173', '060@005b1-007b4', '191' ],
  [ '174_1', '060@007b5-060@025b3', '192_1' ],
  [ '174_2', '060@025b3-060@045a4', '192_2' ],
  [ '174_3', '060@045a4-060@062b6', '192_3' ],
  [ '174_4', '060@062b6-060@078b7', '192_4' ],
  [ '175_1', '060@079a1-060@092b5', '193_1' ],
  [ '175_2', '060@092b5-060@106b2', '193_2' ],
  [ '175_3', '060@106b2-060@120a1', '193_3' ],
  [ '175_4', '060@120a1-060@133b5', '193_4' ],
  [ '175_5', '060@133b5-060@148a5', '193_5' ],
  [ '175_6', '060@148a5-060@162a7', '193_6' ],
  [ '175_7', '060@162a7-060@174b7', '193_7' ],
  [ '176_1', '060@175a1-060@184a3', '194_1' ],
  [ '176_2', '060@184a3-060@197b7', '194_2' ],
  [ '176_3', '060@197b7-060@214a1', '194_3' ],
  [ '176_4', '060@214a1-060@231a3', '194_4' ],
  [ '176_5', '060@231a3-060@239b7', '194_5' ],
  [ '177', '060@240a1-240b5', '195' ],
  [ '178', '060@240b5-244b4', '196' ],
  [ '179_1', '060@244b4-060@256a1', '197_1' ],
  [ '179_2', '060@256a1-060@266b7', '197_2' ],
  [ '180_1', '060@267a1-060@276b2', '198_1' ],
  [ '180_2', '060@276b2-060@287b2', '198_2' ],
  [ '180_3', '060@287b2-060@296a6', '198_3' ],
  [ '181_1', '061@001b1-061@016a1', '199_1' ],
  [ '181_2', '061@016a1-061@031b2', '199_2' ],
  [ '181_3', '061@031b2-061@043a5', '199_3' ],
  [ '181_4', '061@043a5-061@054a2', '199_4' ],
  [ '181_5', '061@054a2-061@065a1', '199_5' ],
  [ '181_6', '061@065a1-061@076b7', '199_6' ],
  [ '182', '061@077a1-095b1', '200' ],
  [ '183', '061@095b2-096b6', '201' ],
  [ '184', '061@096b6-105b7', '202' ],
  [ '185_1', '061@106a1-061@119a5', '203_1' ],
  [ '185_2', '061@119a5-061@130b6', '203_2' ],
  [ '185_3', '061@130b6-061@143b4', '203_3' ],
  [ '186', '061@143b4-158a4', '204' ],
  [ '187_1', '061@158a4-061@168b5', '205_1' ],
  [ '187_2', '061@168b5-061@181a5', '205_2' ],
  [ '187_3', '061@181a5-061@191a7', '205_3' ],
  [ '188', '061@191b1-199b5', '206' ],
  [ '189', '061@199b6-201a6', '207' ],
  [ '190_1', '061@201a6-061@224b5', '208_1' ],
  [ '190_2', '061@224b5-061@224b5', '208_2' ],
  [ '191', '061@224b5-243b5', '209' ],
  [ '192', '061@243b6-246a7', '210' ],
  [ '193', '061@246a7-250b3', '211' ],
  [ '194', '061@250b3-251a5', '212' ],
  [ '195', '061@251a6-266a7', '213' ],
  [ '196', '061@266b1-271b2', '214' ],
  [ '197', '061@271b2-274b5', '215' ],
  [ '198_1', '061@274b6-061@286a1', '216_1' ],
  [ '198_2', '061@286a1-061@296a7', '216_2' ],
  [ '199', '061@296b1-303a5', '217' ],
  [ '200', '061@303a6-308a7', '218' ],
  [ '201_1', '062@001b1-062@063a5', '219_1' ],
  [ '209', '062@011b7-115b7', '227' ],
  [ '201_2', '062@012b6-062@023b4', '219_2' ],
  [ '201_3', '062@023b4-062@034b6', '219_3' ],
  [ '201_4', '062@034b6-062@049a5', '219_4' ],
  [ '201_5', '062@049a5-062@063a5', '219_5' ],
  [ '202', '062@063a5-078a4', '220' ],
  [ '203', '062@078a4-081b2', '221' ],
  [ '204', '062@081b2-092a5', '222' ],
  [ '205', '062@092a5-093b7', '223' ],
  [ '207_1', '062@094a1-062@109a5', '225_1' ],
  [ '206', '062@094a1-095a7', '224' ],
  [ '208', '062@109a6-111b7', '226' ],
  [ '210', '062@116a1-123b1', '228' ],
  [ '211', '062@123b1-125a3', '229' ],
  [ '212', '062@125a3-125b7', '230' ],
  [ '213_1', '062@126a1-062@141a6', '231_1' ],
  [ '213_2', '062@141a6-062@150b3', '231_2' ],
  [ '213_3', '062@150b3-062@162a5', '231_3' ],
  [ '213_4', '062@162a5-062@173b1', '231_4' ],
  [ '213_5', '062@173b1-062@185a1', '231_5' ],
  [ '213_6', '062@185a1-062@206b7', '231_6' ],
  [ '212_7', '062@196a3-062@125b7', '230_7' ],
  [ '214', '062@207a1-210a3', '232' ],
  [ '215', '062@210a3-211b2', '233' ],
  [ '216_1', '062@211b2-062@222a7', '234_1' ],
  [ '216_2', '062@222a7-062@233a2', '234_2' ],
  [ '216_3', '062@233a2-062@244b2', '234_3' ],
  [ '216_4', '062@244b2-062@255b6', '234_4' ],
  [ '216_5', '062@255b6-0', '234_5' ],
  [ '217', '062@269a1-284a2', '235' ],
  [ '218', '062@284a3-297b5', '236' ],
  [ '220_1', '062@297b5-063@077b7', '238_1' ],
  [ '219', '062@297b5-307a6', '237' ],
  [ '220_1', '063@001b1-063@012b1', '238_1' ],
  [ '220_2', '063@012b1-063@022b2', '238_2' ],
  [ '220_3', '063@022b2-063@033b5', '238_3' ],
  [ '220_4', '063@033b5-063@045b1', '238_4' ],
  [ '220_5', '063@045b1-063@056a5', '238_5' ],
  [ '220_6', '063@056a5-063@067a3', '238_6' ],
  [ '220_7', '063@067a3-063@077b7', '238_7' ],
  [ '221', '063@078a1-084b4', '239' ],
  [ '222_1', '063@084b5-063@094a4', '240_1' ],
  [ '222_2', '063@094a4-063@104a1', '240_2' ],
  [ '222_3', '063@104a1-063@112a5', '240_3' ],
  [ '222_4', '063@112a5-063@120a5', '240_4' ],
  [ '222_5', '063@120a5-063@126b7', '240_5' ],
  [ '223_1', '063@127a1-063@139a4', '241_1' ],
  [ '223_2', '063@139a4-063@151a5', '241_2' ],
  [ '223_3', '063@151a5-063@164a2', '241_3' ],
  [ '224', '063@164a2-173b7', '242' ],
  [ '225', '063@174a1-175a5', '243' ],
  [ '226', '063@175a6-177a3', '244' ],
  [ '227', '063@177a3-188b7', '245' ],
  [ '228_1', '063@189a1-063@201b7', '246_1' ],
  [ '228_2', '063@201b7-063@214b5', '246_2' ],
  [ '228_3', '063@214b5-063@226a7', '246_3' ],
  [ '229_1', '063@226b1-063@240a3', '247_1' ],
  [ '229_2', '063@240a3-063@253b6', '247_2' ],
  [ '229_3', '063@253b6-063@265b7', '247_3' ],
  [ '230_1', '063@266a1-063@276b7', '248_1' ],
  [ '230_2', '063@276b7-063@287b7', '248_2' ],
  [ '230_3', '063@287b7-063@297a7', '248_3' ],
  [ '231', '064@001b1-112b7', '249' ],
  [ '232', '064@113a1-214b7', '250' ],
  [ '233', '064@215a1-245b7', '251' ],
  [ '_1', '064@215a6-0', '_1' ],
  [ '234', '064@246a1-250b2', '252' ],
  [ '235', '064@250b2-263a7', '253' ],
  [ '236', '064@263a7-287a4', '254' ],
  [ '237', '064@287a4-299a4', '255' ],
  [ '238', '065@001b1-099b7', '256' ],
  [ '239', '065@100a1-241b4', '257' ],
  [ '240', '065@241b4-301b7', '258' ],
  [ '241', '065@302a1-303a7', '259' ],
  [ '242', '065@303a7-306a7', '260' ],
  [ '243', '066@001b1-015b1', '261' ],
  [ '244', '066@015b2-027b4', '262' ],
  [ '245', '066@027b5-033a1', '263' ],
  [ '246', '066@033a1-042b5', '264' ],
  [ '247', '066@042b5-046a7', '265' ],
  [ '248', '066@046b1-059a5', '266' ],
  [ '249', '066@059a5-059b7', '267' ],
  [ '250', '066@059b7-060a7', '268' ],
  [ '251', '066@060b1-061a2', '269' ],
  [ '252', '066@061a2-069b2', '270' ],
  [ '253', '066@069b2-070b3', '271' ],
  [ '254', '066@070b3-071a2', '272' ],
  [ '255', '066@071a3-074a3', '273' ],
  [ '256', '066@074a4-091a7', '274' ],
  [ '257', '066@091b1-245b1', '275' ],
  [ '258', '066@245b2-259b4', '276' ],
  [ '259', '066@259b5-264a4', '277' ],
  [ '260', '066@264a4-283b2', '278' ],
  [ '262_1', '066@283b2-067@089b7', '280_1' ],
  [ '261', '066@283b2-310a7', '279' ],
  [ '263', '067@090a1-209b7', '281' ],
  [ '264', '067@210a1-264a1', '282' ],
  [ '265', '067@264a1-287b7', '283' ],
  [ '266', '067@288a1-319a6', '284' ],
  [ '267', '068@001b1-005b2', '285' ],
  [ '268', '068@005b3-007a2', '286' ],
  [ '269', '068@007a2-013a7', '287' ],
  [ '270', '068@013b1-017b3', '288' ],
  [ '271', '068@017b3-021a7', '289' ],
  [ '272', '068@021b1-026a5', '290' ],
  [ '273', '068@026a5-029b6', '291' ],
  [ '274', '068@029b6-035b7', '292' ],
  [ '275', '068@036a1-044b2', '293' ],
  [ '276', '068@044b3-049b6', '294' ],
  [ '277', '068@049b6-052b6', '295' ],
  [ '278', '068@052b6-054b6', '296' ],
  [ '279', '068@054b6-055a7', '297' ],
  [ '280', '068@055a7-055b4', '298' ],
  [ '282_1', '068@055b4-068@056a4', '300_1' ],
  [ '281', '068@055b4-055b6', '299' ],
  [ '283', '068@056a5-057a3', '301' ],
  [ '284', '068@057a3-077a3', '302' ],
  [ '285', '068@077a3-079b7', '303' ],
  [ '286', '068@079b7-081b7', '304' ],
  [ '287_1', '068@082a1-068@095b1', '305_1' ],
  [ '287_2', '068@095b1-068@109a2', '305_2' ],
  [ '287_3', '068@109a2-068@121a5', '305_3' ],
  [ '287_4', '068@121a5-068@132a6', '305_4' ],
  [ '287_5', '068@132a6-068@144a6', '305_5' ],
  [ '287_6', '068@144a6-068@155b1', '305_6' ],
  [ '287_7', '068@155b1-068@167b2', '305_7' ],
  [ '287_8', '068@167b2-068@179a7', '305_8' ],
  [ '287_9', '068@179a7-068@191b7', '305_9' ],
  [ '287_10', '068@191b7-068@204a6', '305_10' ],
  [ '287_11', '068@204a6-068@215b6', '305_11' ],
  [ '287_12', '068@215b6-068@226b6', '305_12' ],
  [ '287_13', '068@226b6-068@237b3', '305_13' ],
  [ '287_14', '068@237b3-068@248b7', '305_14' ],
  [ '287_15', '068@248b7-068@260b7', '305_15' ],
  [ '287_16', '068@260b7-068@272a3', '305_16' ],
  [ '287_17', '068@272a3-068@283a7', '305_17' ],
  [ '287_18', '068@283a7-068@294b6', '305_18' ],
  [ '287_19', '068@294b6-068@305a2', '305_19' ],
  [ '287_20', '068@305a2-069@001b1', '305_20' ],
  [ '287_21', '069@001b1-069@013b5', '305_21' ],
  [ '287_22', '069@013b5-069@026a1', '305_22' ],
  [ '287_23', '069@026a1-069@038a1', '305_23' ],
  [ '287_24', '069@038a1-069@050b1', '305_24' ],
  [ '287_25', '069@050b1-069@062a6', '305_25' ],
  [ '287_26', '069@062a6-069@074a3', '305_26' ],
  [ '287_27', '069@074a3-069@085b6', '305_27' ],
  [ '287_28', '069@085b6-069@097b7', '305_28' ],
  [ '287_29', '069@097b7-069@109b3', '305_29' ],
  [ '287_30', '069@109b3-069@122a1', '305_30' ],
  [ '287_31', '069@122a1-069@135a7', '305_31' ],
  [ '287_32', '069@135a7-069@148a1', '305_32' ],
  [ '287_33', '069@148a1-069@159b4', '305_33' ],
  [ '287_34', '069@159b4-069@171a2', '305_34' ],
  [ '287_35', '069@171a2-069@182b3', '305_35' ],
  [ '287_36', '069@182b3-069@193b7', '305_36' ],
  [ '287_37', '069@193b7-069@205a2', '305_37' ],
  [ '287_38', '069@205a2-069@217b1', '305_38' ],
  [ '287_39', '069@217b1-069@229a6', '305_39' ],
  [ '287_40', '069@229a6-069@240b4', '305_40' ],
  [ '287_41', '069@240b4-069@252b1', '305_41' ],
  [ '287_42', '069@252b1-069@263b5', '305_42' ],
  [ '287_43', '069@263b5-069@275a1', '305_43' ],
  [ '287_44', '069@275a1-069@285a1', '305_44' ],
  [ '287_45', '069@285a1-070@001b1', '305_45' ],
  [ '287_46', '070@001b1-070@022b1', '305_46' ],
  [ '287_47', '070@022b1-070@044a5', '305_47' ],
  [ '287_48', '070@044a5-070@101a1', '305_48' ],
  [ '287_49', '070@101a1-070@129b2', '305_49' ],
  [ '287_50', '070@129b2-070@137b5', '305_50' ],
  [ '287_51', '070@137b5-070@154a3', '305_51' ],
  [ '287_52', '070@154a3-070@190b2', '305_52' ],
  [ '287_53', '070@190b2-070@192a7', '305_53' ],
  [ '287_54', '070@192a7-070@216a2', '305_54' ],
  [ '287_55', '070@216a2-071@001b1', '305_55' ],
  [ '287_56', '071@001b1-071@018b1', '305_56' ],
  [ '287_57', '071@018b1-071@081b2', '305_57' ],
  [ '287_58', '071@081b2-071@103b6', '305_58' ],
  [ '287_59', '071@103b6-071@229b7', '305_59' ],
  [ '288', '071@230a1-244a7', '306' ],
  [ '289', '071@244b1-249b7', '307' ],
  [ '290', '071@250a1-253b2', '308' ],
  [ '291', '071@253b2-261b7', '309' ],
  [ '292', '071@262a1-265b4', '310' ],
  [ '293', '071@265b4-267a7', '311' ],
  [ '294', '071@267b1-275b7', '312' ],
  [ '295', '071@276a1-295b1', '313' ],
  [ '296', '071@295b2-297a2', '314' ],
  [ '_1', '071@297a2-0', '_1' ],
  [ '297', '071@297a2-301b2', '315' ],
  [ '298', '071@301b2-303b4', '316' ],
  [ '299', '071@303b4-304b3', '317' ],
  [ '300', '071@304b3-305a7', '318' ],
  [ '301_1', '072@001b1-072@019a7', '319_1' ],
  [ '301_2', '072@019a7-072@037b6', '319_2' ],
  [ '301_3', '072@037b6-072@057a4', '319_3' ],
  [ '301_4', '072@057a4-072@075a4', '319_4' ],
  [ '301_5', '072@075a4-072@093a3', '319_5' ],
  [ '301_6', '072@093a3-072@112a5', '319_6' ],
  [ '301_7', '072@112a5-072@125a7', '319_7' ],
  [ '302', '072@125a7-127a2', '320' ],
  [ '303', '072@127a2-127b7', '321' ],
  [ '304', '072@128a1-130b4', '322' ],
  [ '305', '072@130b4-131b1', '323' ],
  [ '306', '072@131b1-139a4', '324' ],
  [ '307', '072@139a4-145b3', '325' ],
  [ '308', '072@145b4-155a1', '326' ],
  [ '309', '072@155a2-155b4', '327' ],
  [ '310', '072@155b5-157a5', '328' ],
  [ '311', '072@157a6-157b4', '329' ],
  [ '312', '072@157b4-161b1', '330' ],
  [ '313', '072@161b1-163b5', '331' ],
  [ '314', '072@163b6-169a4', '332' ],
  [ '315', '072@169a4-169b7', '333' ],
  [ '316', '072@170a1-170b4', '334' ],
  [ '317', '072@170b4-188a7', '335' ],
  [ '318', '072@188a7-193b7', '336' ],
  [ '319', '072@194a1-196b7', '337' ],
  [ '320', '072@197a1-198b4', '338' ],
  [ '321', '072@198b5-201a5', '339' ],
  [ '322', '072@201a6-204a4', '340' ],
  [ '323', '072@204a4-204a6', '341' ],
  [ '325_1', '072@204a6-072@208b7', '343_1' ],
  [ '324', '072@204a6-204b3', '342' ],
  [ '326', '072@209a1-253a7', '344' ],
  [ '327', '072@253b1-254b3', '345' ],
  [ '328', '072@254b3-257a6', '346' ],
  [ '329', '072@257a7-258b6', '347' ],
  [ '330', '072@258b7-259b3', '348' ],
  [ '331', '072@259b3-260a4', '349' ],
  [ '332', '072@260a5-263b5', '350' ],
  [ '333', '072@263b6-268a4', '351' ],
  [ '334', '072@268a5-271a5', '352' ],
  [ '335', '072@271a5-274a7', '353' ],
  [ '336', '072@274a7-275a6', '354' ],
  [ '337', '072@275a6-277a4', '355' ],
  [ '338', '072@277a4-298b7', '357' ],
  [ '339', '072@298b7-310a7', '358' ],
  [ '340_1', '073@001b1-073@017b6', '360_1' ],
  [ '340_2', '073@017b6-073@032b4', '360_2' ],
  [ '340_3', '073@032b4-073@042b4', '360_3' ],
  [ '340_4', '073@042b4-073@052a7', '360_4' ],
  [ '340_5', '073@052a7-073@064b4', '360_5' ],
  [ '340_6', '073@064b4-073@076a4', '360_6' ],
  [ '340_7', '073@076a4-073@091a1', '360_7' ],
  [ '340_8', '073@091a1-073@104b1', '360_8' ],
  [ '340_9', '073@104b1-073@119b3', '360_9' ],
  [ '340_10', '073@119b3-073@132b4', '360_10' ],
  [ '340_11', '073@132b4-073@142a6', '360_11' ],
  [ '340_12', '073@142a6-073@152b3', '360_12' ],
  [ '340_13', '073@152b3-073@162b7', '360_13' ],
  [ '340_14', '073@162b7-073@174a7', '360_14' ],
  [ '340_15', '073@174a7-073@187a5', '360_15' ],
  [ '340_16', '073@187a5-073@199a1', '360_16' ],
  [ '340_17', '073@199a1-073@208b3', '360_17' ],
  [ '340_18', '073@208b3-073@220b7', '360_18' ],
  [ '340_19', '073@220b7-073@232a6', '360_19' ],
  [ '340_20', '073@232a6-073@242a5', '360_20' ],
  [ '340_21', '073@242a5-073@254b5', '360_21' ],
  [ '340_22', '073@254b5-073@265b7', '360_22' ],
  [ '340_23', '073@265b7-073@276a4', '360_23' ],
  [ '340_24', '073@276a4-073@288b1', '360_24' ],
  [ '340_25', '073@288b1-073@298b3', '360_25' ],
  [ '340_26', '073@298b3-074@001b1', '360_26' ],
  [ '340_27', '074@001b1-074@013a1', '360_27' ],
  [ '340_28', '074@013a1-074@022b4', '360_28' ],
  [ '340_29', '074@022b4-074@034a2', '360_29' ],
  [ '340_30', '074@034a2-074@045b1', '360_30' ],
  [ '340_31', '074@045b1-074@058a6', '360_31' ],
  [ '340_32', '074@058a6-074@070a7', '360_32' ],
  [ '340_33', '074@070a7-074@081a7', '360_33' ],
  [ '340_34', '074@081a7-074@094b6', '360_34' ],
  [ '340_35', '074@094b6-074@105b4', '360_35' ],
  [ '340_36', '074@105b4-074@116a1', '360_36' ],
  [ '340_37', '074@116a1-074@128b7', '360_37' ],
  [ '341_1', '074@129b1-074@145b1', '361_1' ],
  [ '341_2', '074@145b1-074@156b3', '361_2' ],
  [ '341_3', '074@156b3-074@170b6', '361_3' ],
  [ '341_4', '074@170b6-074@182b1', '361_4' ],
  [ '341_5', '074@182b1-074@197a4', '361_5' ],
  [ '341_6', '074@197a4-074@211b7', '361_6' ],
  [ '341_7', '074@211b7-074@223a3', '361_7' ],
  [ '341_8', '074@223a3-074@236a2', '361_8' ],
  [ '341_9', '074@236a2-074@248b3', '361_9' ],
  [ '341_10', '074@248b3-074@265b5', '361_10' ],
  [ '341_11', '074@265b5-074@281a7', '361_11' ],
  [ '341_12', '074@281a7-074@298a7', '361_12' ],
  [ '342', '074@298b1-300a4', '362' ],
  [ '343_1', '075@001b1-075@012b7', '363_1' ],
  [ '343_2', '075@012b7-075@026b6', '363_2' ],
  [ '343_3', '075@026b6-075@037b7', '363_3' ],
  [ '343_4', '075@037b7-075@049a6', '363_4' ],
  [ '343_5', '075@049a6-075@067a1', '363_5' ],
  [ '343_6', '075@067a1-075@075a3', '363_6' ],
  [ '343_7', '075@075a3-075@087a1', '363_7' ],
  [ '343_8', '075@087a1-075@097a3', '363_8' ],
  [ '343_9', '075@097a3-075@111a2', '363_9' ],
  [ '343_10', '075@111a2-075@122a2', '363_10' ],
  [ '343_11', '075@122a2-075@134a1', '363_11' ],
  [ '343_12', '075@134a1-075@146a6', '363_12' ],
  [ '343_13', '075@146a6-075@159a2', '363_13' ],
  [ '343_14', '075@159a2-075@171b4', '363_14' ],
  [ '343_15', '075@171b4-075@184a7', '363_15' ],
  [ '343_16', '075@184a7-075@197b1', '363_16' ],
  [ '343_17', '075@197b1-075@210a5', '363_17' ],
  [ '343_18', '075@210a5-075@225b1', '363_18' ],
  [ '343_19', '075@225b1-075@239a2', '363_19' ],
  [ '343_20', '075@239a2-075@254a6', '363_20' ],
  [ '343_21', '075@254a6-075@269a4', '363_21' ],
  [ '343_22', '075@269a4-075@286b7', '363_22' ],
  [ '344', '075@287a1-289b2', '364' ],
  [ '345', '075@289b2-291a7', '365' ],
  [ '346', '075@291b1-298a6', '366' ],
  [ '347', '076@001b1-022a4', '367' ],
  [ '348', '076@022a4-031b3', '368' ],
  [ '349', '076@031b3-050a5', '369' ],
  [ '350', '076@050a5-055b7', '370' ],
  [ '351', '076@055b7-070b1', '371' ],
  [ '352', '076@070b2-086a2', '372' ],
  [ '353_1', '076@086a2-076@102b3', '373_1' ],
  [ '353_2', '076@102b3-076@118a5', '373_2' ],
  [ '353_3', '076@118a5-076@133b2', '373_3' ],
  [ '353_4', '076@133b2-076@149a2', '373_4' ],
  [ '353_5', '076@149a2-076@162b1', '373_5' ],
  [ '353_6', '076@162b1-076@183a4', '373_6' ],
  [ '353_7', '076@183a4-076@198b7', '373_7' ],
  [ '354', '076@199a1-208b7', '374' ],
  [ '355', '076@209a1-216a4', '375' ],
  [ '356', '076@216a5-220b5', '376' ],
  [ '357', '076@220b6-232a7', '377' ],
  [ '358', '076@232b1-277b5', '378' ],
  [ '359a', '076@27756-281a7', '380' ],
  [ '359b', '076@281b1-289a3', '381' ],
  [ '360', '077@001b1-013b7', '385' ],
  [ '361', '077@014a1-021a6', '386' ],
  [ '362', '077@022a1-128b7', '387' ],
  [ '363', '077@129a1-144a7', '388' ],
  [ '364', '077@144b1-146a7', '389' ],
  [ '365', '077@146a7-150a7', '390' ],
  [ '366', '077@151a1-193a6', '391' ],
  [ '367', '077@193a6-212a7', '392' ],
  [ '368', '077@213a1-246b7', '393' ],
  [ '369', '077@247a1-370a7', '394' ],
  [ '370', '078@001b1-125a7', '395' ],
  [ '371', '078@125b1-136b7', '396' ],
  [ '372', '078@137a1-264b7', '397' ],
  [ '373', '078@265a1-311a6', '398' ],
  [ '374', '079@001b1-033b7', '399' ],
  [ '375', '079@034a1-044b5', '400' ],
  [ '376', '079@044b6-052b5', '401' ],
  [ '377', '079@052b5-060a7', '402' ],
  [ '378', '079@060b1-071a3', '403a' ],
  [ '379', '079@071a3-072b7', '403b' ],
  [ '380', '079@072b7-073a7', '404' ],
  [ '381', '079@073b1-158b7', '405a' ],
  [ '382', '079@158b7-184a7', '405b' ],
  [ '383', '079@184b1-187a1', '406' ],
  [ '384', '079@187a2-195b7', '407' ],
  [ '385', '079@196a1-199a7', '408' ],
  [ '386', '079@199a7-202a1', '409' ],
  [ '387', '079@202a2-203b1', '410' ],
  [ '388', '079@203b1-208b2', '411' ],
  [ '389', '079@208b2-213b4', '412' ],
  [ '390', '079@213b4-216a3', '413' ],
  [ '391', '079@216a3-219a2', '414' ],
  [ '392', '079@219a2-220a7', '415' ],
  [ '393', '079@220b1-221b7', '416' ],
  [ '394', '079@222a1-223a7', '417' ],
  [ '395', '079@223a7-224b4', '418' ],
  [ '396', '079@224b4-227b2', '419' ],
  [ '397', '079@227b3-229a2', '420' ],
  [ '398', '079@229a2-230a2', '421' ],
  [ '399', '079@230a2-231b3', '422' ],
  [ '400', '079@231b4-233a5', '423' ],
  [ '401', '079@233a5-235a5', '424' ],
  [ '402', '079@235a5-237a5', '425' ],
  [ '403', '079@237a5-238b7', '426' ],
  [ '404', '079@239a1-239b7', '427' ],
  [ '405', '079@240a1-242b7', '428' ],
  [ '406', '079@242b7-244a7', '429' ],
  [ '407', '079@244b1-245b6', '430' ],
  [ '408', '079@245b6-247a4', '431' ],
  [ '409', '079@247a4-248a1', '432' ],
  [ '410', '079@248a1-249b6', '433' ],
  [ '411', '079@249b6-251b3', '434' ],
  [ '412', '079@251b3-254b4', '435' ],
  [ '413', '079@254b5-259b3', '436' ],
  [ '414', '079@259b3-261b3', '437' ],
  [ '415', '079@261b3-263a7', '438' ],
  [ '416', '079@263b1-292a6', '439' ],
  [ '417', '080@001b1-013b5', '440a' ],
  [ '418', '080@013b5-030a3', '440b' ],
  [ '419', '080@030a4-065b7', '441' ],
  [ '420', '080@066a1-090b7', '442' ],
  [ '421', '080@091a1-096b6', '443' ],
  [ '422', '080@096b6-136b4', '444' ],
  [ '423', '080@136b5-142b7', '445' ],
  [ '424', '080@143a1-167a5', '446' ],
  [ '425', '080@167a6-171a1', '447' ],
  [ '426', '080@171a2-176a2', '448' ],
  [ '427', '080@176a2-180b7', '449' ],
  [ '428', '080@181a1-231b5', '450' ],
  [ '429', '080@231b6-260a2', '451' ],
  [ '430', '080@260a3-304a7', '452' ],
  [ '431', '080@304b1-343a1', '453' ],
  [ '432', '081@001b1-012a7', '454' ],
  [ '433', '081@012b1-014b4', '455' ],
  [ '434', '081@014b4-016b5', '456' ],
  [ '435', '081@016b5-027a6', '457' ],
  [ '436', '081@027a6-029b1', '458' ],
  [ '437', '081@029b1-042b3', '459' ],
  [ '438', '081@042b3-043b6', '460' ],
  [ '439', '081@043b7-045b6', '461' ],
  [ '440', '081@045b6-086a7', '462' ],
  [ '441', '081@086b1-089b7', '463' ],
  [ '442', '081@090a1-148a6', '464' ],
  [ '443', '081@148a6-157b7', '466' ],
  [ '444', '081@158a1-207b7', '467' ],
  [ '445', '081@208a1-277b3', '468' ],
  [ '446', '081@277b3-281b7', '469' ],
  [ '447', '081@282a1-286a6', '470' ],
  [ '448', '081@286b1-295a3', '471' ],
  [ '449', '081@295a4-309a6', '472' ],
  [ '450', '082@001b1-035b7', '473' ],
  [ '451', '082@036a1-058b3', '474' ],
  [ '452', '082@058b3-103a3', '475' ],
  [ '453', '082@103a3-331a5', '476' ],
  [ '454', '083@001b1-003b2', '477' ],
  [ '455', '083@003b2-008a4', '478' ],
  [ '456', '083@008a4-012a5', '479' ],
  [ '457', '083@012a6-015a4', '480' ],
  [ '458', '083@015a5-030a7', '481' ],
  [ '459', '083@030b1-036b3', '482' ],
  [ '460a', '083@036b4-039b6', '483' ],
  [ '460b', '083@039b6-039b7', '484' ],
  [ '461', '083@040a1-065b6', '485' ],
  [ '462', '083@065b6-068a1', '486' ],
  [ '463', '083@068a1-069a7', '487' ],
  [ '464', '083@069a7-090b4', '488' ],
  [ '465', '083@090b4-093b7', '489' ],
  [ '466', '083@094a1-134a7', '490' ],
  [ '467', '083@134b1-151b4', '491' ],
  [ '468', '083@151b4-164a1', '492' ],
  [ '469', '083@164a1-167b5', '493' ],
  [ '470', '083@167b5-173b3', '494' ],
  [ '471', '083@173b3-174a2', '495' ],
  [ '472', '083@174a2-174b7', '496' ],
  [ '473', '083@175a1-185b7', '497' ],
  [ '474', '083@186a1-214b7', '498' ],
  [ '475', '083@215a1-244b7', '500' ],
  [ '476', '083@245a1-247b4', '501' ],
  [ '477', '083@247b4-303a7', '502' ],
  [ '478', '083@303b1-336a3', '503' ],
  [ '479', '084@001b1-142a7', '504' ],
  [ '480', '084@142b1-274a5', '505' ],
  [ '481', '085@001b1-010a1', '506' ],
  [ '482', '085@010a1-058a7', '507' ],
  [ '483', '085@058b1-096a3', '508' ],
  [ '484', '085@096a3-096a7', '509' ],
  [ '485', '085@096b1-146a7', '510' ],
  [ '486', '085@146b1-150a7', '511' ],
  [ '487', '085@150b1-173a4', '512' ],
  [ '488', '085@173a4-265b7', '513' ],
  [ '489', '085@266a1-272a7', '514' ],
  [ '490', '086@001b1-082a7', '515' ],
  [ '491', '086@082b1-083a7', '516' ],
  [ '492', '086@083b1-119b5', '517' ],
  [ '493', '086@119b5-151b1', '518' ],
  [ '494', '086@151b2-260a7', '519' ],
  [ '495', '086@261a1-322a7', '520' ],
  [ '496', '087@001b1-156b7', '521' ],
  [ '497', '087@157a1-158a6', '522' ],
  [ '498', '087@158a6-167a3', '523' ],
  [ '499', '087@167a3-172a7', '524' ],
  [ '500', '087@172b1-176b7', '525' ],
  [ '501', '087@177a1-181a2', '526' ],
  [ '502', '087@181a2-247a7', '527' ],
  [ '503', '087@248a1-273b7', '528' ],
  [ '504', '087@274a1-283b7', '529' ],
  [ '505a', '087@284a1-286a6', '530' ],
  [ '505b', '087@286a6-286a7', '531' ],
  [ '506', '087@286b1-309a6', '532' ],
  [ '507', '088@001b1-007b3', '533' ],
  [ '508', '088@007b3-024b6', '534' ],
  [ '509', '088@024b6-025b1', '535' ],
  [ '510', '088@025b1-035b3', '536' ],
  [ '511', '088@035b4-039a1', '537' ],
  [ '512', '088@039a1-042b7', '538' ],
  [ '513', '088@043a1-044b1', '539' ],
  [ '514', '088@044b2-046b6', '540' ],
  [ '515', '088@046b6-048a6', '541' ],
  [ '516', '088@048a6-050b2', '542' ],
  [ '517', '088@050b2-054a5', '543' ],
  [ '518', '088@054a5-056a2', '544' ],
  [ '519', '088@056a2-058a6', '545' ],
  [ '520', '088@058a7-059a4', '546' ],
  [ '521', '088@059a4-059a7', '547' ],
  [ '522', '088@059a7-060b4', '548' ],
  [ '523', '088@060b4-062a1', '549' ],
  [ '524', '088@062a1-062a6', '550' ],
  [ '525', '088@062a6-071a1', '551' ],
  [ '526', '088@071a1-071b4', '552' ],
  [ '527', '088@071b4-085a7', '553' ],
  [ '528', '088@085b1-090b3', '554' ],
  [ '529', '088@090b3-092b6', '555' ],
  [ '530', '088@092b6-094a7', '556' ],
  [ '531', '088@094b1-095b3', '557' ],
  [ '532', '088@095b4-099b3', '558' ],
  [ '533', '088@099b3-099b4', '559' ],
  [ '534', '088@099b4-099b7', '560' ],
  [ '535', '088@099b7-100a2', '561' ],
  [ '536', '088@100a2-100a3', '562' ],
  [ '537', '088@100a3-100a5', '563' ],
  [ '538', '088@100a5-100b3', '564' ],
  [ '539a', '088@100b3-100b6', '565' ],
  [ '539b', '088@100b6-100b7', '566' ],
  [ '539c', '088@100b7-101a5', '567' ],
  [ '540', '088@101a5-101b3', '568' ],
  [ '541', '088@101b3-102a3', '569' ],
  [ '542', '088@102a3-104b7', '570' ],
  [ '543', '088@105a1-351a6', '571' ],
  [ '544', '089@001b1-013a6', '572' ],
  [ '545', '089@013a6-013b4', '573' ],
  [ '546', '089@013b5-014a5', '574' ],
  [ '547', '089@014a5-014b1', '575' ],
  [ '548', '089@014b1-014b2', '576' ],
  [ '549', '089@014b3-014b7', '577' ],
  [ '550', '089@014b7-015a4', '578' ],
  [ '551', '089@015a4-015b6', '579' ],
  [ '552', '089@015b6-016a4', '580' ],
  [ '553', '089@016a4-017b4', '581' ],
  [ '554', '089@017b4-018b7', '582' ],
  [ '555', '089@019a1-151a7', '583' ],
  [ '556', '089@151b1-273a7', '584' ],
  [ '557', '090@001b1-062a7', '585' ],
  [ '558', '090@063a1-087b1', '586' ],
  [ '559', '090@087b1-117a5', '587' ],
  [ '560', '090@117a5-117b4', '588' ],
  [ '561', '090@117b4-138b5', '589' ],
  [ '562', '090@138b6-150b1', '590' ],
  [ '563', '090@150b2-156a7', '591' ],
  [ '564', '090@157a1-158b1', '592' ],
  [ '565', '090@158b2-165b5', '593' ],
  [ '566', '090@165b5-186a3', '594' ],
  [ '567', '090@186a3-191b3', '595' ],
  [ '568', '090@191b4-195a5', '596' ],
  [ '569', '090@195a6-196b4', '597' ],
  [ '570', '090@196b4-198a6', '598' ],
  [ '571', '090@198a6-199a3', '599' ],
  [ '572', '090@199a4-200a2', '600' ],
  [ '573', '090@200a2-200a7', '601' ],
  [ '574', '090@200a7-202a2', '602' ],
  [ '575', '090@202a3-202b5', '603' ],
  [ '576', '090@202b5-203a1', '604' ],
  [ '577', '090@203a1-203a3', '605' ],
  [ '578', '090@203a3-203a5', '606' ],
  [ '579', '090@203a5-203b1', '607' ],
  [ '580', '090@203b1-203b5', '608' ],
  [ '581', '090@203b5-203b6', '609' ],
  [ '582', '090@203b6-204a1', '610' ],
  [ '583', '090@204a1-204a3', '611' ],
  [ '584', '090@204a3-204a4', '612' ],
  [ '585', '090@204a5-204a6', '613' ],
  [ '586', '090@204a6-204b1', '614' ],
  [ '588', '090@204b1-204b3', '616' ],
  [ '589', '090@204b3-204b7', '617' ],
  [ '590', '090@205a1-212b6', '618' ],
  [ '591', '090@212b7-219a7', '619' ],
  [ '592', '090@219a7-224b2', '620' ],
  [ '593', '090@224b2-229b7', '621' ],
  [ '594', '090@230a1-237b4', '622' ],
  [ '595', '090@237b4-242a6', '623' ],
  [ '596', '090@242a6-243b1', '624' ],
  [ '597', '090@243b1-248a3', '625' ],
  [ '598', '090@248a3-250a5', '626' ],
  [ '599', '090@250a5-259b7', '627' ],
  [ '600', '090@260a1-260a3', '628' ],
  [ '601', '090@260a3-266b4', '629' ],
  [ '602', '090@266b4-267a3', '630' ],
  [ '603', '090@267a3-269a3', '631' ],
  [ '604', '090@269a3-287a7', '632' ],
  [ '604', '091@001b1-035b7', '632' ],
  [ '605', '091@036a1-037a2', '633' ],
  [ '606', '091@037a2-039a4', '634' ],
  [ '607', '091@039a5-040b6', '635' ],
  [ '608', '091@040b7-041b5', '636' ],
  [ '609', '091@041b6-043a2', '637' ],
  [ '610', '091@043a3-045a2', '638' ],
  [ '611', '091@045a3-045a7', '639' ],
  [ '612', '091@045b1-046b4', '640' ],
  [ '613', '091@046b5-047a7', '641' ],
  [ '614', '091@047b1-052a5', '642' ],
  [ '615', '091@052a5-052b5', '643' ],
  [ '616', '091@052b6-056a7', '644' ],
  [ '617', '091@056a7-058b3', '645' ],
  [ '618', '091@058b3-059a6', '646' ],
  [ '619', '091@059a6-060b4', '647' ],
  [ '620', '091@060b4-061a1', '648' ],
  [ '621', '091@061a2-061b7', '649' ],
  [ '622', '091@062a1-062a7', '650' ],
  [ '623', '091@062b1-062b2', '651' ],
  [ '624', '091@062b2-062b3', '652' ],
  [ '625', '091@062b3-063a3', '653' ],
  [ '626', '091@063a4-063a4', '654' ],
  [ '627', '091@063a4-063a6', '655' ],
  [ '628', '091@063a6-067a2', '656' ],
  [ '629', '091@067a2-067b3', '657' ],
  [ '630', '091@067b4-068a2', '658' ],
  [ '631', '091@068a3-080b7', '659' ],
  [ '632', '091@081a1-102b7', '660' ],
  [ '633', '091@103a1-105a2', '661' ],
  [ '634', '091@105a3-107a7', '662' ],
  [ '635', '091@107b1-109a5', '663' ],
  [ '636', '091@109a5-112a4', '664' ],
  [ '637', '091@112a4-116a2', '665' ],
  [ '638', '091@116a2-118b5', '666' ],
  [ '639', '091@118b5-122a1', '667' ],
  [ '640', '091@122a2-124a4', '668' ],
  [ '641', '091@124a5-126a5', '669' ],
  [ '642', '091@126a6-127b2', '670' ],
  [ '643', '091@127b2-128a3', '671' ],
  [ '644', '091@128a3-129a2', '672' ],
  [ '645', '091@129a3-129b7', '673' ],
  [ '646', '091@130a1-132b2', '674' ],
  [ '647', '091@132b2-134a5', '675' ],
  [ '648', '091@134a6-136a7', '676' ],
  [ '649', '091@136a7-136b4', '677' ],
  [ '650', '091@136b4-136b7', '678' ],
  [ '651', '091@136b7-137a2', '679' ],
  [ '652', '091@137a2-137a5', '680' ],
  [ '653', '091@137a5-146a1', '682' ],
  [ '654', '091@146a1-149a2', '683' ],
  [ '655', '091@149a2-149b1', '684' ],
  [ '656', '091@149b2-162b7', '685' ],
  [ '657', '091@163a1-175b2', '686' ],
  [ '658', '091@175b3-180a4', '687' ],
  [ '659', '091@180a4-180b4', '688' ],
  [ '660', '091@180b5-183b4', '689' ],
  [ '661', '091@183b5-186a5', '690' ],
  [ '662', '091@186a5-190a3', '692' ],
  [ '663', '091@190a3-191a2', '693' ],
  [ '664', '091@191a2-192b4', '694' ],
  [ '665', '091@192b4-193a6', '695' ],
  [ '666', '091@193a7-199a5', '696' ],
  [ '667', '091@199a6-201b3', '697' ],
  [ '668', '091@201b3-202a3', '698' ],
  [ '669', '091@202a3-202a7', '699' ],
  [ '670', '091@202b1-202b6', '700' ],
  [ '671', '091@202b6-209b5', '701' ],
  [ '672', '091@209b5-211a6', '702' ],
  [ '673a', '091@211a6-211b1', '703' ],
  [ '673b', '091@211b1-211b2', '704' ],
  [ '674', '091@211b2-216a7', '705' ],
  [ '675', '091@216a7-220b5', '706' ],
  [ '676', '091@220b5-222b1', '707' ],
  [ '677', '091@222b1-222b6', '708' ],
  [ '678', '091@222b6-223a1', '709' ],
  [ '679', '091@223a1-223a5', '710' ],
  [ '680', '091@223a5-223a7', '711' ],
  [ '681', '091@224a1-278a7', '712' ],
  [ '682', '091@278b1-284a7', '713' ],
  [ '683', '091@284b1-287a5', '714' ],
  [ '684', '091@287b1-290a5', '715' ],
  [ '685', '091@290a5-291a2', '716' ],
  [ '686', '092@001b1-316a6', '717' ],
  [ '686', '093@001b1-057b7', '717' ],
  [ '687', '093@058a1-059b3', '718' ],
  [ '688', '093@059b3-062a3', '719' ],
  [ '689', '093@062a3-066a1', '720' ],
  [ '690', '093@066a1-094a7', '721' ],
  [ '691', '093@094b1-129b6', '722' ],
  [ '692', '093@129b7-137a7', '723' ],
  [ '693', '093@137b1-139b1', '724' ],
  [ '694', '093@139b1-147b3', '725' ],
  [ '695', '093@147b3-147b3', '726' ],
  [ '696', '093@147b3-148a2', '727' ],
  [ '697', '093@148a3-149a7', '728' ],
  [ '698', '093@149b1-150a5', '729' ],
  [ '699', '093@150a5-151b1', '730' ],
  [ '700', '093@151b1-157b2', '731' ],
  [ '701', '093@157b2-164b3', '732' ],
  [ '702', '093@164b4-165b5', '733' ],
  [ '703', '093@165b5-171a5', '734' ],
  [ '704', '093@171a5-171b1', '735' ],
  [ '705', '093@171b1-173a5', '736' ],
  [ '706', '093@173a6-175a1', '737' ],
  [ '707', '093@175a1-176b1', '738' ],
  [ '708', '093@176b1-177b6', '739' ],
  [ '709', '093@177b6-178a1', '740' ],
  [ '710', '093@178a1-178a7', '741' ],
  [ '711', '093@178a7-178b2', '742' ],
  [ '712', '093@178b2-178b4', '743' ],
  [ '713', '093@178b4-178b6', '744' ],
  [ '714', '093@178b6-179a2', '745' ],
  [ '715', '093@179a2-179a5', '746' ],
  [ '716', '093@179a5-179a7', '747' ],
  [ '717', '093@179b1-179b2', '748' ],
  [ '718', '093@179b2-180a1', '749' ],
  [ '719', '093@180a2-180a4', '750' ],
  [ '720', '093@180a4-180a7', '751' ],
  [ '721', '093@180b1-199b7', '752' ],
  [ '722', '093@200a1-201b3', '753' ],
  [ '723', '093@201b3-204a7', '754' ],
  [ '724', '093@205a1-311a7', '755' ],
  [ '724', '094@001b1-200a7', '755' ],
  [ '725', '094@200b1-202a1', '756' ],
  [ '726', '094@202a1-217a2', '757' ],
  [ '727', '094@217a2-219a6', '758' ],
  [ '728', '094@219a6-222a6', '759' ],
  [ '729', '094@222a6-222a7', '760' ],
  [ '730', '094@222a7-222b5', '761' ],
  [ '731', '094@222b5-224b1', '762' ],
  [ '732', '094@224b1-225a3', '763' ],
  [ '733', '094@225a3-225b6', '764' ],
  [ '734', '094@225b7-227a7', '765' ],
  [ '735', '094@227a7-228a7', '766' ],
  [ '736', '094@228b1-229a3', '767' ],
  [ '737', '094@229a4-229b4', '768' ],
  [ '738', '094@229b4-230a7', '769' ],
  [ '739', '094@230a7-234b2', '770' ],
  [ '740', '094@234b2-235a3', '771' ],
  [ '741', '094@235a4-235b5', '772' ],
  [ '742', '094@235b5-236a3', '773' ],
  [ '743', '094@236a3-236b7', '774' ],
  [ '744', '094@237a1-266a7', '775' ],
  [ '745', '094@266b1-268a7', '776' ],
  [ '746', '095@001b1-237b7', '777' ],
  [ '747', '095@238a1-263a7', '778' ],
  [ '748', '095@263b1-264b1', '779' ],
  [ '749', '095@264b1-265b3', '780' ],
  [ '750', '095@265b3-266b7', '781' ],
  [ '751', '095@267a1-295a7', '782' ],
  [ '752', '096@001b1-004b4', '783' ],
  [ '753', '096@004b4-005a7', '784' ],
  [ '754', '096@005a7-006a5', '785' ],
  [ '755', '096@006a6-007b4', '786' ],
  [ '756', '096@007b4-008a7', '787' ],
  [ '757', '096@008a7-019a5', '788' ],
  [ '758', '096@019a5-027b4', '789' ],
  [ '759', '096@027b4-050a3', '790' ],
  [ '760', '096@050a4-052a1', '791' ],
  [ '761', '096@052a2-053a6', '792' ],
  [ '762', '096@053a6-054a3', '793' ],
  [ '763', '096@054a3-055b7', '794' ],
  [ '764', '096@056a1-056b2', '795' ],
  [ '765', '096@056b2-069a6', '796' ],
  [ '766', '096@069a7-081b7', '797a' ],
  [ '767', '096@081b7-088b7', '797b' ],
  [ '768', '096@089a1-089b6', '798' ],
  [ '769', '096@089b7-090a6', '799' ],
  [ '770', '096@090a6-104a3', '800' ],
  [ '771', '096@104a3-105b7', '801' ],
  [ '772', '096@105b7-111b7', '802' ],
  [ '773', '096@112a1-112b4', '803' ],
  [ '774', '096@112b4-112b5', '804' ],
  [ '775', '096@112b5-112b7', '805' ],
  [ '776', '096@112b7-113a3', '806' ],
  [ '777', '096@113a3-113b1', '807' ],
  [ '778', '096@113b1-113b3', '808' ],
  [ '779', '096@113b3-113b5', '809' ],
  [ '780', '096@113b5-113b7', '810' ],
  [ '781', '096@114a1-114a1', '811' ],
  [ '782', '096@114a2-114a5', '812' ],
  [ '783', '096@114a5-114a6', '813' ],
  [ '784', '096@114a7-114b1', '814' ],
  [ '785', '096@114b1-114b3', '815' ],
  [ '786', '096@114b3-114b5', '816' ],
  [ '787', '096@114b5-114b7', '817' ],
  [ '788', '096@114b7-115a1', '818' ],
  [ '789', '096@115a1-115a4', '819' ],
  [ '790', '096@115a4-115a5', '820' ],
  [ '791', '096@115a5-115a7', '821' ],
  [ '792', '096@115b1-115b2', '822' ],
  [ '793', '096@115b3-115b5', '823' ],
  [ '794', '096@115b5-116a2', '824' ],
  [ '795', '096@116a2-116a4', '825' ],
  [ '796', '096@116a5-116a6', '826' ],
  [ '797', '096@116a6-116b1', '827' ],
  [ '798', '096@116b1-116b3', '828' ],
  [ '799', '096@116b3-116b4', '829' ],
  [ '800', '096@116b4-116b5', '830' ],
  [ '801', '096@116b6-116b7', '831' ],
  [ '802', '096@116b7-117a1', '832' ],
  [ '803', '096@117a2-117a4', '833' ],
  [ '804', '096@117a4-117a7', '834' ],
  [ '805', '096@118a1-140b7', '835' ],
  [ '806', '096@141a1-167b7', '836' ],
  [ '807', '096@168a1-222b7', '837' ],
  [ '808', '096@223a1-225b7', '838' ],
  [ '809', '096@226a1-229a3', '839' ],
  [ '810', '096@229a3-250b3', '840' ],
  [ '811', '096@250b4-251a5', '841' ],
  [ '812', '096@251a5-253a2', '842' ],
  [ '813', '096@253a2-254a6', '843' ],
  [ '814', '096@254a6-254b4', '844' ],
  [ '815', '096@254b4-256a6', '845' ],
  [ '816', '096@256a7-257a5', '846' ],
  [ '817', '096@257a5-258b7', '847' ],
  [ '818', '096@258b7-259b1', '848' ],
  [ '819', '096@259b1-260a5', '849' ],
  [ '820', '096@260a5-260b7', '850' ],
  [ '821', '096@261a1-261b1', '851' ],
  [ '822', '096@261b1-261b7', '852' ],
  [ '823', '096@261b7-262a3', '853' ],
  [ '824', '096@262a3-262a7', '854' ],
  [ '825', '096@262a7-262b3', '855' ],
  [ '826', '096@262b3-263b6', '856' ],
  [ '827', '096@263b7-264a6', '857' ],
  [ '828', '097@001b1-086a7', '1118' ],
  [ '829', '097@086b1-290a7', '1119' ],
  [ '830', '097@290b1-358a7', '1120' ],
  [ '831', '098@001b1-110a7', '1121' ],
  [ '832', '098@110b1-132a7', '1122' ],
  [ '833', '098@132b1-198a7', '1123' ],
  [ '834', '098@198b1-298b7', '1124' ],
  [ '835', '098@299a1-311a7', '1125' ],
  [ '836', '099@001b1-034b3', '1126' ],
  [ '837', '099@034b3-060a4', '1127' ],
  [ '838', '099@060a5-077a5', '1128' ],
  [ '839', '099@077a6-129b7', '1129' ],
  [ '840', '099@130a1-202a3', '1130' ],
  [ '841a', '099@202a3-203a5', '1131' ],
  [ '841b', '099@203a5-207b6', '1132' ],
  [ '841c', '099@207b6-208b7', '1133' ],
  [ '841d', '099@209a1-212a6', '1134' ],
  [ '841e', '099@212a7-213b5', '1135' ],
  [ '841f', '099@213b5-216a4', '1136' ],
  [ '841g', '099@216a4-220a3', '1137' ],
  [ '841h', '099@220a3-223b6', '1138' ],
  [ '842', '099@223b6-253a5', '1139' ],
  [ '843', '099@253a5-267b7', '1140' ],
  [ '844', '099@268a1-287a7', '1141' ],
  [ '845', '100@001b1-469a7', '1116' ],
  [ '846', '101@001b1-003b6', '858' ],
  [ '847', '101@003b6-054b7', '859' ],
  [ '878', '101@011a6-114a2', '890' ],
  [ '848', '101@055a1-057a7', '860' ],
  [ '849', '101@057b1-062a6', '861' ],
  [ '850', '101@062a6-064a2', '862' ],
  [ '851', '101@064a3-064a7', '863' ],
  [ '852', '101@065a1-068b7', '864' ],
  [ '853', '101@069a1-072b1', '865' ],
  [ '854', '101@072b1-074b5', '866' ],
  [ '855', '101@074b6-076a5', '867' ],
  [ '856', '101@076a6-077b7', '868' ],
  [ '857', '101@077b7-079b5', '869' ],
  [ '858', '101@079b5-085a7', '870' ],
  [ '859', '101@085b1-087a1', '871' ],
  [ '860', '101@087a1-087a2', '872' ],
  [ '861', '101@087a2-087a6', '873' ],
  [ '862', '101@087a6-087a7', '874' ],
  [ '863', '101@087b1-087b4', '875' ],
  [ '864', '101@087b4-088a2', '876' ],
  [ '865', '101@088a2-088a5', '877' ],
  [ '866', '101@088a5-088b4', '878' ],
  [ '867', '101@088b4-088b6', '879' ],
  [ '868', '101@088b6-089a2', '880' ],
  [ '869', '101@089a2-089a3', '881' ],
  [ '870', '101@089a3-089a4', '882' ],
  [ '871', '101@089a4-092b7', '883' ],
  [ '872', '101@092b7-095b7', '884' ],
  [ '873', '101@096a1-100b5', '885' ],
  [ '874', '101@100b5-103a2', '886' ],
  [ '875', '101@103a2-104b5', '887' ],
  [ '876', '101@104b6-107b3', '888' ],
  [ '877', '101@107b3-111a6', '889' ],
  [ '879', '101@114a3-117b1', '891' ],
  [ '880', '101@117b2-119b6', '892' ],
  [ '881', '101@119b7-122a2', '893' ],
  [ '882', '101@122a2-123a2', '894' ],
  [ '883', '101@123a2-129a3', '895' ],
  [ '884', '101@129a3-135b3', '896' ],
  [ '885', '101@135b3-159b1', '897' ],
  [ '886', '101@159b1-161b3', '898' ],
  [ '887', '101@161b3-163a2', '899' ],
  [ '888', '101@163a2-165b1', '900' ],
  [ '890', '101@165b1-165b4', '902' ],
  [ '889', '101@165b4-166a4', '901' ],
  [ '891', '101@166a5-166b4', '903' ],
  [ '892', '101@166b4-167a2', '904' ],
  [ '893', '101@167a3-167b3', '905' ],
  [ '894', '101@167b3-167b4', '906' ],
  [ '895', '101@167b5-168a2', '907' ],
  [ '896', '101@168a2-168a6', '908' ],
  [ '897', '101@168a6-205a5', '909' ],
  [ '898', '101@205a5-213a6', '910' ],
  [ '899', '101@213a6-215b1', '911' ],
  [ '900', '101@215b1-217b2', '912' ],
  [ '901', '101@217b2-223b7', '913' ],
  [ '902', '101@223b7-226b3', '914' ],
  [ '903', '101@226b4-228b3', '915' ],
  [ '904', '101@228b3-230b7', '916' ],
  [ '905', '101@231a1-232a7', '917' ],
  [ '906', '101@232a7-233a5', '918' ],
  [ '907', '101@233a5-239a3', '919' ],
  [ '908', '101@239a3-240a1', '920' ],
  [ '909', '101@240a2-241b4', '921' ],
  [ '910', '101@241b4-242a4', '922' ],
  [ '911', '101@242a4-242a7', '923' ],
  [ '912', '101@242a7-242b3', '924' ],
  [ '913', '101@242b3-244b5', '925' ],
  [ '914', '101@244b6-254b7', '926' ],
  [ '915', '101@255a1-260b1', '927' ],
  [ '916', '101@260b1-261a4', '928' ],
  [ '917', '101@261a5-262a2', '929' ],
  [ '918', '101@262a2-262a7', '930' ],
  [ '919', '101@262b1-264a3', '931' ],
  [ '920', '101@264a3-264b7', '932' ],
  [ '921', '101@265a1-265a7', '933' ],
  [ '922', '101@265b1-267a7', '934' ],
  [ '923', '101@267a7-268b6', '935' ],
  [ '924', '101@268b7-271a4', '936' ],
  [ '925', '101@271a5-272b4', '937' ],
  [ '926', '101@272b4-273b4', '938' ],
  [ '927', '101@273b4-276a1', '939' ],
  [ '928', '101@276a1-277b4', '940' ],
  [ '929', '101@277b4-279a7', '941' ],
  [ '930', '101@279a7-279b7', '942' ],
  [ '931', '101@279b7-280b2', '943' ],
  [ '932', '101@280b2-280b5', '944' ],
  [ '933', '101@280b6-281a2', '945' ],
  [ '934', '101@281a2-281a4', '946' ],
  [ '935', '101@281a4-281a7', '947' ],
  [ '936', '101@281a7-281b6', '948' ],
  [ '937', '101@281b6-281b7', '949' ],
  [ '938', '101@282a1-282a4', '950' ],
  [ '939', '101@282a4-282a6', '951' ],
  [ '940', '101@282a6-282a7', '952' ],
  [ '941', '101@282a7-282b2', '953' ],
  [ '942', '101@282b2-282b3', '954' ],
  [ '943', '101@282b4-282b4', '955' ],
  [ '944', '101@282b5-282b6', '956' ],
  [ '945', '101@282b6-283a5', '957' ],
  [ '946', '102@001b1-030b5', '958' ],
  [ '947', '102@030b5-041a7', '959' ],
  [ '948', '102@041b1-042b1', '960' ],
  [ '949', '102@042b1-043b6', '961' ],
  [ '950', '102@043b6-045a1', '962' ],
  [ '951', '102@045a2-045b7', '963' ],
  [ '952', '102@045b7-046a1', '964' ],
  [ '953', '102@046a1-046b6', '965' ],
  [ '954', '102@046b7-049b7', '966' ],
  [ '955', '102@050a1-050b3', '967' ],
  [ '956', '102@050b3-051b4', '968' ],
  [ '957', '102@051b4-053a6', '969' ],
  [ '958', '102@053a6-055b5', '970' ],
  [ '959', '102@055b5-056a5', '971' ],
  [ '960', '102@056a5-056b5', '972' ],
  [ '961', '102@056b5-057a7', '973' ],
  [ '962', '102@057a7-057b2', '974' ],
  [ '963', '102@057b2-058a7', '975' ],
  [ '964', '102@058b1-079b7', '976' ],
  [ '965', '102@080a1-081b5', '977' ],
  [ '966', '102@081b5-083b1', '978' ],
  [ '967', '102@083b2-084a4', '979' ],
  [ '968', '102@084a4-085b3', '980' ],
  [ '969', '102@085b3-086a6', '981' ],
  [ '970', '102@086a6-086b7', '982' ],
  [ '971', '102@087a1-087a7', '983' ],
  [ '972', '102@087a7-089a4', '984' ],
  [ '973', '102@089a4-090a3', '985' ],
  [ '974', '102@090a3-092a7', '986' ],
  [ '975', '102@092a7-095a7', '987' ],
  [ '976', '102@095a7-096a1', '988' ],
  [ '977', '102@096a1-096a7', '989' ],
  [ '978', '102@096a7-096b3', '990' ],
  [ '979', '102@096b3-099a2', '991' ],
  [ '980', '102@099a2-099b7', '992' ],
  [ '981', '102@099b7-100a3', '993' ],
  [ '982', '102@100a3-110b6', '994' ],
  [ '983', '102@110b7-119b7', '995' ],
  [ '984', '102@120a1-124b7', '996' ],
  [ '985', '102@124b7-133b2', '997' ],
  [ '986', '102@133b3-138b2', '998' ],
  [ '987', '102@138b2-141b7', '999' ],
  [ '988', '102@142a1-143a2', '1000' ],
  [ '989', '102@143a3-143b6', '1001' ],
  [ '990', '102@143b6-144b4', '1002' ],
  [ '991', '102@144b4-146b2', '1003' ],
  [ '992', '102@146b2-147a4', '1004' ],
  [ '993', '102@147a4-148a3', '1005' ],
  [ '994', '102@148a3-149a4', '1006' ],
  [ '995', '102@149a4-149b5', '1007' ],
  [ '996', '102@149b6-150a4', '1008' ],
  [ '997', '102@150a4-153a7', '1009' ],
  [ '998', '102@153b1-156a2', '1010' ],
  [ '999', '102@156a3-157b3', '1011' ],
  [ '1000', '102@157b3-160a2', '1012' ],
  [ '1001', '102@160a2-160a4', '1013' ],
  [ '1002', '102@160a4-160b2', '1014' ],
  [ '1003', '102@160b3-167a2', '1015' ],
  [ '1004', '102@167a2-171a6', '1016' ],
  [ '1005', '102@171a7-172a2', '1017' ],
  [ '1006', '102@172a2-172b4', '1018' ],
  [ '1007', '102@172b4-176b1', '1019' ],
  [ '1008', '102@176b1-177b7', '1020' ],
  [ '1009', '102@178a1-179a1', '1021' ],
  [ '1010', '102@179a1-179a6', '1022' ],
  [ '1011', '102@179a7-179b3', '1023a' ],
  [ '1012', '102@179b4-179b5', '1023b' ],
  [ '1013', '102@179b5-179b7', '1024' ],
  [ '1014', '102@180a1-180b2', '1025' ],
  [ '1015', '102@180b2-180b3', '1026' ],
  [ '1016', '102@180b4-181a5', '1027' ],
  [ '1017', '102@181a5-181a7', '1028' ],
  [ '1018', '102@181a7-181b5', '1029' ],
  [ '1019', '102@181b5-181b6', '1030' ],
  [ '1020', '102@181b7-183a1', '1031' ],
  [ '1021', '102@183a1-183a2', '1032' ],
  [ '1022', '102@183a3-183a4', '1033' ],
  [ '1023', '102@183a5-183a6', '1034' ],
  [ '1024', '102@183a7-183b7', '1035' ],
  [ '1025', '102@184a1-184a2', '1036' ],
  [ '1026', '102@184a2-184a3', '1037' ],
  [ '1027', '102@184a3-184a6', '1038' ],
  [ '1028', '102@184a6-184b1', '1039' ],
  [ '1029', '102@184b1-184b3', '1040' ],
  [ '1030', '102@184b3-184b7', '1041' ],
  [ '1031', '102@185a1-185a3', '1042' ],
  [ '1032', '102@185a3-185a4', '1043' ],
  [ '1033', '102@185a4-185a6', '1044' ],
  [ '1034', '102@185a6-185b1', '1045' ],
  [ '1035', '102@185b1-185b2', '1046' ],
  [ '1036', '102@185b2-185b7', '1047' ],
  [ '1037', '102@185b7-186a7', '1048' ],
  [ '1038', '102@186a7-186b2', '1049' ],
  [ '1039', '102@186b3-186b6', '1050' ],
  [ '1040', '102@186b6-187a1', '1051' ],
  [ '1041', '102@187a1-187a3', '1052' ],
  [ '1042', '102@187a4-187a6', '1053' ],
  [ '1043', '102@187a6-187b1', '1054' ],
  [ '1044', '102@187b2-187b4', '1055' ],
  [ '1045', '102@187b4-187b7', '1056' ],
  [ '1046', '102@187b7-188a3', '1057' ],
  [ '1047', '102@188a4-188a6', '1058' ],
  [ '1048', '102@188a7-188b1', '1059' ],
  [ '1049', '102@188b1-188b4', '1060' ],
  [ '1050', '102@188b4-188b6', '1061' ],
  [ '1051', '102@188b7-189a2', '1062' ],
  [ '1052', '102@189a2-189a4', '1063' ],
  [ '1053', '102@189a4-189a6', '1064' ],
  [ '1054', '102@189a6-189a7', '1065' ],
  [ '1055', '102@189b1-189b2', '1066' ],
  [ '1056', '102@189b2-189b3', '1067' ],
  [ '1057', '102@189b3-189b5', '1068' ],
  [ '1058', '102@189b5-189b6', '1069' ],
  [ '1059', '102@189b6-190a1', '1070' ],
  [ '1060a', '102@190a1-190a2', '1071' ],
  [ '1060b', '102@190a3-190a4', '1072' ],
  [ '1061', '102@190a4-205b4', '1073' ],
  [ '1062', '102@205b5-215b7', '1074' ],
  [ '1063', '102@216a1-229b2', '1075' ],
  [ '1064', '102@229b3-234b1', '1076' ],
  [ '1065', '102@234b1-235a1', '1077' ],
  [ '1066', '102@235a2-235b4', '1078' ],
  [ '1067', '102@235b4-239a1', '1079' ],
  [ '1068', '102@239a1-239b1', '1080a' ],
  [ '1069', '102@239b1-239b1', '1080b' ],
  [ '1070', '102@239b1-239b2', '1080c' ],
  [ '1071', '102@239b2-239b2', '1080d' ],
  [ '1072', '102@239b2-239b3', '1080e' ],
  [ '1073', '102@239b3-239b4', '1080f' ],
  [ '1074', '102@239b4-239b5', '1081' ],
  [ '1075', '102@239b5-239b6', '1082' ],
  [ '1076', '102@239b6-240a3', '1083' ],
  [ '1077', '102@240a3-240a7', '1084' ],
  [ '1078', '102@240b1-240b5', '1085' ],
  [ '1079', '102@240b5-242b2', '1086' ],
  [ '1080', '102@242b3-245a4', '1087' ],
  [ '1081', '102@245a4-247a7', '1088' ],
  [ '1082', '102@247a7-247b3', '1089' ],
  [ '1083', '102@247b3-251a6', '1090' ],
  [ '1084', '102@251a7-252a3', '1091' ],
  [ '1085', '102@252a3-252b3', '1092' ],
  [ '1086', '102@252b3-252b7', '1093' ],
  [ '1087', '102@253a1-253a6', '1094' ],
  [ '1088', '102@253a6-254b7', '1095' ],
  [ '1089', '102@254b7-255a2', '1096' ],
  [ '1090', '102@255a2-255b5', '1097' ],
  [ '1091', '102@255b6-256a2', '1098' ],
  [ '1092', '102@256a3-256b7', '1099' ],
  [ '1093', '102@256b7-260b7', '1100' ],
  [ '1094', '102@261a1-262b5', '1101' ],
  [ '1095', '102@262b5-266a3', '1102' ],
  [ '1096', '102@266a4-267a5', '1103' ],
  [ '1097', '102@267a5-268b1', '1104' ],
  [ '1098', '102@268b1-269b5', '1105' ],
  [ '1099', '102@269b5-270a3', '1106' ],
  [ '1100', '102@270a4-270b7', '1107' ],
  [ '1101', '102@271a1-272b3', '1108' ],
  [ '1102', '102@272b4-273a5', '1109' ],
  [ '1103', '102@273a5-274b3', '1110' ],
  [ '1104', '102@274b3-275a4', '1111' ],
  [ '1105', '102@275a5-275b3', '1112' ],
  [ '1106', '102@275b4-275b7', '1113' ],
  [ '1107', '102@275b7-278a2', '1114' ],
  [ '1108', '102@278a2-278a7', '1115' ],
  [ '4568', '103@001b1-171a4', '1143' ] ];
dPedurma.rcode="D";
module.exports=dPedurma;

});
require.register("adarsha/index.js", function(exports, require, module){
var boot=require("boot");
boot("adarsha","main","main");
});




































require.alias("ksanaforge-boot/index.js", "adarsha/deps/boot/index.js");
require.alias("ksanaforge-boot/ksanagap.js", "adarsha/deps/boot/ksanagap.js");
require.alias("ksanaforge-boot/downloader.js", "adarsha/deps/boot/downloader.js");
require.alias("ksanaforge-boot/kfs.js", "adarsha/deps/boot/kfs.js");
require.alias("ksanaforge-boot/kfs_html5.js", "adarsha/deps/boot/kfs_html5.js");
require.alias("ksanaforge-boot/mkdirp.js", "adarsha/deps/boot/mkdirp.js");
require.alias("ksanaforge-boot/index.js", "adarsha/deps/boot/index.js");
require.alias("ksanaforge-boot/index.js", "boot/index.js");
require.alias("ksanaforge-boot/index.js", "ksanaforge-boot/index.js");
require.alias("brighthas-bootstrap/dist/js/bootstrap.js", "adarsha/deps/bootstrap/dist/js/bootstrap.js");
require.alias("brighthas-bootstrap/dist/js/bootstrap.js", "adarsha/deps/bootstrap/index.js");
require.alias("brighthas-bootstrap/dist/js/bootstrap.js", "bootstrap/index.js");
require.alias("brighthas-bootstrap/dist/js/bootstrap.js", "brighthas-bootstrap/index.js");
require.alias("ksana-document/index.js", "adarsha/deps/ksana-document/index.js");
require.alias("ksana-document/document.js", "adarsha/deps/ksana-document/document.js");
require.alias("ksana-document/api.js", "adarsha/deps/ksana-document/api.js");
require.alias("ksana-document/xml.js", "adarsha/deps/ksana-document/xml.js");
require.alias("ksana-document/template_accelon.js", "adarsha/deps/ksana-document/template_accelon.js");
require.alias("ksana-document/persistent.js", "adarsha/deps/ksana-document/persistent.js");
require.alias("ksana-document/tokenizers.js", "adarsha/deps/ksana-document/tokenizers.js");
require.alias("ksana-document/markup.js", "adarsha/deps/ksana-document/markup.js");
require.alias("ksana-document/typeset.js", "adarsha/deps/ksana-document/typeset.js");
require.alias("ksana-document/sha1.js", "adarsha/deps/ksana-document/sha1.js");
require.alias("ksana-document/users.js", "adarsha/deps/ksana-document/users.js");
require.alias("ksana-document/customfunc.js", "adarsha/deps/ksana-document/customfunc.js");
require.alias("ksana-document/configs.js", "adarsha/deps/ksana-document/configs.js");
require.alias("ksana-document/projects.js", "adarsha/deps/ksana-document/projects.js");
require.alias("ksana-document/indexer.js", "adarsha/deps/ksana-document/indexer.js");
require.alias("ksana-document/indexer_kd.js", "adarsha/deps/ksana-document/indexer_kd.js");
require.alias("ksana-document/kdb.js", "adarsha/deps/ksana-document/kdb.js");
require.alias("ksana-document/kdbfs.js", "adarsha/deps/ksana-document/kdbfs.js");
require.alias("ksana-document/kdbw.js", "adarsha/deps/ksana-document/kdbw.js");
require.alias("ksana-document/kdb_sync.js", "adarsha/deps/ksana-document/kdb_sync.js");
require.alias("ksana-document/kdbfs_sync.js", "adarsha/deps/ksana-document/kdbfs_sync.js");
require.alias("ksana-document/html5fs.js", "adarsha/deps/ksana-document/html5fs.js");
require.alias("ksana-document/kdbfs_android.js", "adarsha/deps/ksana-document/kdbfs_android.js");
require.alias("ksana-document/kdbfs_ios.js", "adarsha/deps/ksana-document/kdbfs_ios.js");
require.alias("ksana-document/kse.js", "adarsha/deps/ksana-document/kse.js");
require.alias("ksana-document/kde.js", "adarsha/deps/ksana-document/kde.js");
require.alias("ksana-document/boolsearch.js", "adarsha/deps/ksana-document/boolsearch.js");
require.alias("ksana-document/search.js", "adarsha/deps/ksana-document/search.js");
require.alias("ksana-document/plist.js", "adarsha/deps/ksana-document/plist.js");
require.alias("ksana-document/excerpt.js", "adarsha/deps/ksana-document/excerpt.js");
require.alias("ksana-document/link.js", "adarsha/deps/ksana-document/link.js");
require.alias("ksana-document/tibetan/wylie.js", "adarsha/deps/ksana-document/tibetan/wylie.js");
require.alias("ksana-document/languages.js", "adarsha/deps/ksana-document/languages.js");
require.alias("ksana-document/diff.js", "adarsha/deps/ksana-document/diff.js");
require.alias("ksana-document/xml4kdb.js", "adarsha/deps/ksana-document/xml4kdb.js");
require.alias("ksana-document/buildfromxml.js", "adarsha/deps/ksana-document/buildfromxml.js");
require.alias("ksana-document/tei.js", "adarsha/deps/ksana-document/tei.js");
require.alias("ksana-document/concordance.js", "adarsha/deps/ksana-document/concordance.js");
require.alias("ksana-document/regex.js", "adarsha/deps/ksana-document/regex.js");
require.alias("ksana-document/bsearch.js", "adarsha/deps/ksana-document/bsearch.js");
require.alias("ksana-document/persistentmarkup_pouchdb.js", "adarsha/deps/ksana-document/persistentmarkup_pouchdb.js");
require.alias("ksana-document/underlines.js", "adarsha/deps/ksana-document/underlines.js");
require.alias("ksana-document/index.js", "adarsha/deps/ksana-document/index.js");
require.alias("ksana-document/index.js", "ksana-document/index.js");
require.alias("ksana-document/index.js", "ksana-document/index.js");
require.alias("ksanaforge-fileinstaller/index.js", "adarsha/deps/fileinstaller/index.js");
require.alias("ksanaforge-fileinstaller/index.js", "adarsha/deps/fileinstaller/index.js");
require.alias("ksanaforge-fileinstaller/index.js", "fileinstaller/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ksanaforge-fileinstaller/deps/checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ksanaforge-fileinstaller/deps/checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ksanaforge-checkbrowser/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ksanaforge-fileinstaller/deps/htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ksanaforge-fileinstaller/deps/htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ksanaforge-htmlfs/index.js");
require.alias("ksanaforge-fileinstaller/index.js", "ksanaforge-fileinstaller/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "adarsha/deps/checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "adarsha/deps/checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ksanaforge-checkbrowser/index.js");
require.alias("ksanaforge-htmlfs/index.js", "adarsha/deps/htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "adarsha/deps/htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ksanaforge-htmlfs/index.js");
require.alias("adarsha-main/index.js", "adarsha/deps/main/index.js");
require.alias("adarsha-main/index.js", "adarsha/deps/main/index.js");
require.alias("adarsha-main/index.js", "main/index.js");
require.alias("adarsha-main/index.js", "adarsha-main/index.js");
require.alias("adarsha-comp1/index.js", "adarsha/deps/comp1/index.js");
require.alias("adarsha-comp1/index.js", "adarsha/deps/comp1/index.js");
require.alias("adarsha-comp1/index.js", "comp1/index.js");
require.alias("adarsha-comp1/index.js", "adarsha-comp1/index.js");
require.alias("adarsha-resultlist/index.js", "adarsha/deps/resultlist/index.js");
require.alias("adarsha-resultlist/index.js", "adarsha/deps/resultlist/index.js");
require.alias("adarsha-resultlist/index.js", "resultlist/index.js");
require.alias("adarsha-resultlist/index.js", "adarsha-resultlist/index.js");
require.alias("adarsha-api/index.js", "adarsha/deps/api/index.js");
require.alias("adarsha-api/search_api.js", "adarsha/deps/api/search_api.js");
require.alias("adarsha-api/corres_api.js", "adarsha/deps/api/corres_api.js");
require.alias("adarsha-api/index.js", "adarsha/deps/api/index.js");
require.alias("adarsha-api/index.js", "api/index.js");
require.alias("adarsha-api/index.js", "adarsha-api/index.js");
require.alias("ksanaforge-stacktoc/index.js", "adarsha/deps/stacktoc/index.js");
require.alias("ksanaforge-stacktoc/index.js", "adarsha/deps/stacktoc/index.js");
require.alias("ksanaforge-stacktoc/index.js", "stacktoc/index.js");
require.alias("ksanaforge-stacktoc/index.js", "ksanaforge-stacktoc/index.js");
require.alias("adarsha-showtext/index.js", "adarsha/deps/showtext/index.js");
require.alias("adarsha-showtext/index.js", "adarsha/deps/showtext/index.js");
require.alias("adarsha-showtext/index.js", "showtext/index.js");
require.alias("adarsha-showtext/index.js", "adarsha-showtext/index.js");
require.alias("adarsha-renderitem/index.js", "adarsha/deps/renderItem/index.js");
require.alias("adarsha-renderitem/index.js", "adarsha/deps/renderItem/index.js");
require.alias("adarsha-renderitem/index.js", "renderItem/index.js");
require.alias("adarsha-renderitem/index.js", "adarsha-renderitem/index.js");
require.alias("adarsha-renderinputs/index.js", "adarsha/deps/renderinputs/index.js");
require.alias("adarsha-renderinputs/index.js", "adarsha/deps/renderinputs/index.js");
require.alias("adarsha-renderinputs/index.js", "renderinputs/index.js");
require.alias("adarsha-renderinputs/index.js", "adarsha-renderinputs/index.js");
require.alias("adarsha-page2catalog/index.js", "adarsha/deps/page2catalog/index.js");
require.alias("adarsha-page2catalog/index.js", "adarsha/deps/page2catalog/index.js");
require.alias("adarsha-page2catalog/index.js", "page2catalog/index.js");
require.alias("adarsha-page2catalog/index.js", "adarsha-page2catalog/index.js");
require.alias("adarsha-namelist/index.js", "adarsha/deps/namelist/index.js");
require.alias("adarsha-namelist/index.js", "adarsha/deps/namelist/index.js");
require.alias("adarsha-namelist/index.js", "namelist/index.js");
require.alias("adarsha-namelist/index.js", "adarsha-namelist/index.js");
require.alias("adarsha-searchbar/index.js", "adarsha/deps/searchbar/index.js");
require.alias("adarsha-searchbar/index.js", "adarsha/deps/searchbar/index.js");
require.alias("adarsha-searchbar/index.js", "searchbar/index.js");
require.alias("adarsha-searchbar/index.js", "adarsha-searchbar/index.js");
require.alias("adarsha-dataset/index.js", "adarsha/deps/dataset/index.js");
require.alias("adarsha-dataset/jPedurma.js", "adarsha/deps/dataset/jPedurma.js");
require.alias("adarsha-dataset/dPedurma.js", "adarsha/deps/dataset/dPedurma.js");
require.alias("adarsha-dataset/index.js", "adarsha/deps/dataset/index.js");
require.alias("adarsha-dataset/index.js", "dataset/index.js");
require.alias("adarsha-dataset/index.js", "adarsha-dataset/index.js");
require.alias("adarsha/index.js", "adarsha/index.js");
if (typeof exports == 'object') {
  module.exports = require('adarsha');
} else if (typeof define == 'function' && define.amd) {
  define(function(){ return require('adarsha'); });
} else {
  window['adarsha'] = require('adarsha');
}})();