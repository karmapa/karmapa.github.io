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
  	ksana.platform="node-webkit"
  	if (typeof nodeRequire!="undefined") ksana.require=nodeRequire;
  }
} else if (typeof chrome!="undefined" && chrome.fileSystem){
	ksana.platform="chrome";
}

//if (typeof React=="undefined") window.React=require('../react');

//require("../cortex");
var Require=function(arg){return require("../"+arg)};
var boot=function(appId,main,maindiv) {
	main=main||"main";
	maindiv=maindiv||"main";
	ksana.appId=appId;
	ksana.mainComponent=React.renderComponent(Require(main)(),document.getElementById(maindiv));
}
window.ksana=ksana;
window.Require=Require;
module.exports=boot;
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
if (typeof nodeRequire=='undefined')var nodeRequire=require;
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
if (typeof nodeRequire!="function") nodeRequire=require; 
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
if (typeof nodeRequire=='undefined')var nodeRequire=require;

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
	debugger;
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
		if (from==to) return texts[from].t.substring(startoffset-1,endoffset-1);
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
			var nulltag=attributes[attributes.length-1]=='/';
			if (captureTags[tagname]) {
				var attr=parseAttributesString(attributes);
				if (!nulltag) tagStack.push([tagname,tagoffset,attr,i]);
			}
			var handler=null;
			if (tagname[0]=="/") handler=captureTags[tagname.substr(1)];
			else if (nulltag) handler=captureTags[tagname];

			if (handler) {
				var prev=tagStack[tagStack.length-1];
				if (!nulltag) {				
					if (tagname.substr(1)!=prev[0]) {
						console.error("tag unbalance",tagname,prev[0],T);
					} else {
						tagStack.pop();
					}
					var text=getTextBetween(prev[3],i,prev[1],tagoffset);
				} else {
					var text="";
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
	var bsearch=require("ksana-document").bsearch;
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
	var texts=fs.readFileSync(fn,session.config.inputEncoding).replace(/\r\n/g,"\n");
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
	session.kdbfn=require("path").resolve(folder, session.config.name+'.kdb');

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
var Kfs=require('./kdbfs');	

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
			opts.cur+=o.adv;
			cb.apply(that,[o.data]);
		});
	}
	var loadVInt1=function(opts,cb) {
		var that=this;
		loadVInt.apply(this,[opts,6,1,function(data){
			cb.apply(that,[data[0]]);
		}])
	}
	//for postings
	var loadPInt =function(opts,blocksize,count,cb) {
		var that=this;
		this.fs.readBuf_packedint(opts.cur,blocksize,count,false,function(o){
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
							o[o.length]="\0"+offset.toString(16)
								   +"\0"+sz.toString(16);
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
						o[keys[i]]="\0"+offset.toString(16)
							   +"\0"+L.sz[i].toString(16);
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
			if (!path.join('\0')) return (!!KEY[key]);
			var keys=KEY[path.join('\0')];
			path.push(key);//put it back
			if (keys) cb.apply(that,[keys.indexOf(key)>-1]);
			else cb.apply(that,[false]);
		}]);
	}

	var getSync=function(path) {
		if (!CACHE) return undefined;	
		var o=CACHE;
		for (var i=0;i<path.length;i++) {
			var r=o[path[i]] ;
			if (r===undefined) return undefined;
			o=r;
		}
		return o;
	}
	var get=function(path,recursive,cb) {
		if (typeof path=='undefined') path=[];
		if (typeof path=="string") path=[path];
		if (typeof recursive=='function') {
			cb=recursive;
			recursive=false;
		}
		recursive=recursive||false;
		var that=this;
		if (typeof cb!='function') return getSync(path);

		reset.apply(this,[function(){

			var o=CACHE;

			if (path.length==0) {
				cb(Object.keys(CACHE));
				return;
			} 
			
			var pathnow="",taskqueue=[],opts={},r=null;
			var lastkey="";


			for (var i=0;i<path.length;i++) {
				var task=(function(key,k){

					return (function(data){
						if (!(typeof data=='object' && data.__empty)) {
							if (typeof o[lastkey]=='string' && o[lastkey][0]=="\0") o[lastkey]={};
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
							if (parseInt(k)) pathnow+="\0";
							pathnow+=key;
							if (typeof r=='string' && r[0]=="\0") { //offset of data to be loaded
								var p=r.substring(1).split("\0").map(function(item){return parseInt(item,16)});
								var cur=p[0],sz=p[1];
								opts.lazy=!recursive || (k<path.length-1) ;
								opts.blocksize=sz;opts.cur=cur,opts.keys=[];
								load.apply(that,[opts, taskqueue.shift()]);
								lastkey=key;
							} else {
								var next=taskqueue.shift();
								next.apply(that,[r]);
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
				taskqueue.push(function(data){
					var key=path[path.length-1];
					o[key]=data; KEY[pathnow]=opts.keys;
					cb.apply(that,[data]);
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
				cb.apply(that,[KEY[path.join("\0")]]);
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
		if (typeof ksana!="undefined") var nodeRequire=ksana.require;
		else var nodeRequire=require;
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
		var i=0,codes=[],out=[];
		while (i<arr.length) {
			if (arr[i]) {
				codes[codes.length]=arr[i];
			} else {
				var s=String.fromCharCode.apply(null,codes);
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
	DT=kdb.DT;
	kfs=Kfs(kdb.fs);
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

var fs=require('fs');
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
   var finish=function(srcEntry) { //remove old file and rename temp.kdb 
         rm(fn,function(){
            srcEntry.moveTo(srcEntry.filesystem.root, fn,function(){
              setTimeout( cb.bind(context,false) , 0) ; 
            },function(e){
              console.log("faile",e)
            });
         },this); 
   }
   var tempfn="temp.kdb";
    var batch=function(b) {
       var xhr = new XMLHttpRequest();
       var requesturl=url+"?"+Math.random();
       xhr.open('get', requesturl, true);
       xhr.setRequestHeader('Range', 'bytes='+batches[b]+'-'+(batches[b+1]-1));
       xhr.responseType = 'blob';    
       var create=(b==0);
       xhr.addEventListener('load', function() {
         var blob=this.response;
         API.fs.root.getFile(tempfn, {create: create, exclusive: false}, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {
              fileWriter.seek(fileWriter.length);
              fileWriter.write(blob);
              written+=blob.size;
              fileWriter.onwriteend = function(e) {
                var abort=false;
                if (statuscb) {
                  abort=statuscb.apply(context,[ fileWriter.length / totalsize,totalsize ]);
                  if (abort) {
                      setTimeout( cb.bind(context,false) , 0) ;                     
                  }
                }
                b++;
                if (!abort) {
                  if (b<batches.length-1) {
                     setTimeout(batch.bind(this,b),0);
                  } else {
                      finish(fileEntry);
                  }                  
                }
              };
            }, console.error);
          }, console.error);
       },false);
       xhr.send();
    }
     //main
     getDownloadSize(url,function(size){
       totalsize=size;
       if (!size) {
          if (cb) cb.apply(context,[false]);
       } else {//ready to download
        rm(tempfn,function(){
           batches=createBatches(size);
           if (statuscb) statuscb.apply(context,[ 0, totalsize ]);
           batch(0);          
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
var initfs=function(grantedBytes,cb,context) {
      webkitRequestFileSystem(PERSISTENT, grantedBytes,  function(fs) {
      API.fs=fs;
      API.quota=grantedBytes;
      readdir(function(){
        API.initialized=true;
        cb.apply(context,[grantedBytes,fs]);
      },context);
    }, console.error);
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
		return require("./search")(engine,q,opts,cb);		
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

var vpos2filepage=function(engine,vpos) {
    var pageOffsets=engine.get("pageOffsets");
    var fileOffsets=engine.get(["fileOffsets"]);
    var pageNames=engine.get("pageNames");
    var fileid=bsearch(fileOffsets,vpos+1,true);
    fileid--;
    var pageid=bsearch(pageOffsets,vpos+1,true);
    pageid--;

    var fileOffset=fileOffsets[fileid];
    var pageOffset=bsearch(pageOffsets,fileOffset+1,true);
    pageOffset--;
    pageid-=pageOffset;
    return {file:fileid,page:pageid};
}
var api={
	search:_search
	,concordance:require("./concordance")
	,regex:require("./regex")
	,highlightPage:_highlightPage
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
if (typeof nodeRequire=='undefined')var nodeRequire=require;
var pool={},localPool={};
var apppath="";
var bsearch=require("./bsearch");
var _getSync=function(keys,recursive) {
	var out=[];
	for (var i in keys) {
		out.push(this.getSync(keys[i],recursive));	
	}
	return out;
}
var _gets=function(keys,recursive,cb) { //get many data with one call
	if (!keys) return ;
	if (typeof keys=='string') {
		keys=[keys];
	}
	var engine=this, output=[];

	var makecb=function(key){
		return function(data){
				if (!(data && typeof data =='object' && data.__empty)) output.push(data);
				engine.get(key,recursive,taskqueue.shift());
		};
	};

	var taskqueue=[];
	for (var i=0;i<keys.length;i++) {
		if (typeof keys[i]=="null") { //this is only a place holder for key data already in client cache
			output.push(null);
		} else {
			taskqueue.push(makecb(keys[i]));
		}
	};

	taskqueue.push(function(data){
		output.push(data);
		cb.apply(engine.context||engine,[output,keys]); //return to caller
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
	var engine={lastAccess:new Date(), kdb:kdb, queryCache:{}, postingCache:{}, cache:{}};

	if (kdb.fs.html5fs) {
		var customfunc=Require("ksana-document").customfunc;
	} else {
		var customfunc=nodeRequire("ksana-document").customfunc;	
	}	
	if (typeof context=="object") engine.context=context;
	engine.get=function(key,recursive,cb) {

		if (typeof recursive=="function") {
			cb=recursive;
			recursive=false;
		}
		if (!key) {
			if (cb) cb(null);
			return null;
		}

		if (typeof cb!="function") {
			if (kdb.fs.html5fs) {
				return engine.kdb.get(key,recursive,cb);
			} else {
				return engine.kdb.getSync(key,recursive);
			}
		}

		if (typeof key=="string") {
			return engine.kdb.get([key],recursive,cb);
		} else if (typeof key[0] =="string") {
			return engine.kdb.get(key,recursive,cb);
		} else if (typeof key[0] =="object") {
			return _gets.apply(engine,[key,recursive,cb]);
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
	//only local engine allow getSync
	if (!kdb.fs.html5fs)	engine.getSync=engine.kdb.getSync;
	var preload=[["meta"],["fileNames"],["fileOffsets"],
	["tokens"],["postingslen"],["pageNames"],["pageOffsets"]];

	var setPreload=function(res) {
		engine.dbname=res[0].name;
		engine.customfunc=customfunc.getAPI(res[0].config);
		engine.ready=true;
	}
	if (typeof cb=="function") {
		_gets.apply(engine,[  preload, true,function(res){
			setPreload(res);
			cb.apply(engine.context,[engine]);
		}]);
	} else {
		setPreload(_getSync.apply(engine,[preload,true]));
	}
	return engine;
}

var getRemote=function(key,recursive,cb) {
	var $kse=Require("ksanaforge-kse").$ksana; 
	var engine=this;
	if (!engine.ready) {
		console.error("remote connection not established yet");
		return;
	} 
	if (typeof recursive=="function") {
		cb=recursive;
		recursive=false;
	}
	recursive=recursive||false;
	if (typeof key=="string") key=[key];

	if (key[0] instanceof Array) { //multiple keys
		var keys=[],output=[];
		for (var i=0;i<key.length;i++) {
			var cachekey=key[i].join("\0");
			var data=engine.cache[cachekey];
			if (typeof data!="undefined") {
				keys.push(null);//  place holder for LINE 28
				output.push(data); //put cached data into output
			} else{
				engine.fetched++;
				keys.push(key[i]); //need to ask server
				output.push(null); //data is unknown yet
			}
		}
		//now ask server for unknown datum
		engine.traffic++;
		var opts={key:keys,recursive:recursive,db:engine.kdbid};
		$kse("get",opts).done(function(datum){
			//merge the server result with cached 
			for (var i=0;i<output.length;i++) {
				if (datum[i] && keys[i]) {
					var cachekey=keys[i].join("\0");
					engine.cache[cachekey]=datum[i];
					output[i]=datum[i];
				}
			}
			cb.apply(engine.context,[output]);	
		});
	} else { //single key
		var cachekey=key.join("\0");
		var data=engine.cache[cachekey];
		if (typeof data!="undefined") {
			if (cb) cb.apply(engine.context,[data]);
			return data;//in cache , return immediately
		} else {
			engine.traffic++;
			engine.fetched++;
			var opts={key:key,recursive:recursive,db:engine.kdbid};
			$kse("get",opts).done(function(data){
				engine.cache[cachekey]=data;
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
	var engine={lastAccess:new Date(), kdbid:kdbid, cache:{} , 
	postingCache:{}, queryCache:{}, traffic:0,fetched:0};
	engine.setContext=function(ctx) {this.context=ctx};
	engine.get=getRemote;
	engine.fileOffset=fileOffset;
	engine.folderOffset=folderOffset;
	engine.pageOffset=pageOffset;
	engine.getDocument=getDocument;
	engine.getFilePageNames=getFilePageNames;
	engine.getFilePageOffsets=getFilePageOffsets;

	if (typeof context=="object") engine.context=context;

	//engine.findLinkBy=link.findLinkBy;
	$kse("get",{key:[["meta"],["fileNames"],["fileOffsets"],["tokens"],["postingslen"],,["pageNames"],["pageOffsets"]], 
		recursive:true,db:kdbid}).done(function(res){
		engine.dbname=res[0].name;

		engine.cache["fileNames"]=res[1];
		engine.cache["fileOffsets"]=res[2];
		engine.cache["tokens"]=res[3];
		engine.cache["postingslen"]=res[4];
		engine.cache["pageNames"]=res[5];
		engine.cache["pageOffsets"]=res[6];

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
var openLocalNode=function(kdbid,cb,context) {
	var fs=nodeRequire('fs');
	var Kdb=nodeRequire('ksana-document').kdb;
	var engine=localPool[kdbid];
	if (engine) {
		if (cb) cb(engine);
		return engine;
	}

	var kdbfn=kdbid;
	if (kdbfn.indexOf(".kdb")==-1) kdbfn+=".kdb";

	var tries=["./"+kdbfn  //TODO , allow any depth
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
	if (cb) cb(null);
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
	if (kdbid.indexOf("filesystem:")>-1 || typeof process=="undefined") {
		openLocalHtml5(kdbid,cb,context);
	} else {
		openLocalNode(kdbid,cb,context);
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

var newQuery =function(engine,query,opts) {
	if (!query) return;
	opts=opts||{};
	query=trimSpace(engine,query);

	var phrases=query;
	if (typeof query=='string') {
		phrases=parseQuery(query);
	}
	
	var phrase_terms=[], terms=[],variants=[],termcount=0,operators=[];
	var pc=0,termid=0;//phrase count
	for  (var i=0;i<phrases.length;i++) {
		var op=getOperator(phrases[pc]);
		if (op) phrases[pc]=phrases[pc].substring(1);

		/* auto add + for natural order ?*/
		//if (!opts.rank && op!='exclude' &&i) op='include';
		operators.push(op);
		
		var j=0,tokens=engine.customfunc.tokenize(phrases[pc]).tokens;
		phrase_terms.push(newPhrase());
		while (j<tokens.length) {
			var raw=tokens[j];
			if (isWildcard(raw)) {
				if (phrase_terms[pc].termid.length==0)  { //skip leading wild card
					j++
					continue;
				}
				terms.push(parseWildcard(raw));
				termid=termcount++;
			} else if (isOrTerm(raw)){
				var term=orTerms.apply(this,[tokens,j]);
				terms.push(term);
				j+=term.key.split(',').length-1;
				termid=termcount++;
			} else {
				var term=parseTerm(engine,raw);
				termid=terms.map(function(a){return a.key}).indexOf(term.key);
				if (termid==-1) {
					terms.push(term);
					termid=termcount++;
				};
			}
			phrase_terms[pc].termid.push(termid);
			j++;
		}
		phrase_terms[pc].key=phrases[pc];

		//remove ending wildcard
		var P=phrase_terms[pc] , T=null;
		do {
			T=terms[P.termid[P.termid.length-1]];
			if (!T) break;
			if (T.wildcard) P.termid.pop(); else break;
		} while(T);
		
		if (P.termid.length==0) {
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
var loadPostings=function(engine,terms,cb) {
	//
	var tokens=engine.get("tokens");
	   //var tokenIds=terms.map(function(t){return tokens[t.key]});

	var tokenIds=terms.map(function(t){ return 1+tokens.indexOf(t.key)});
	var postingid=[];
	for (var i=0;i<tokenIds.length;i++) {
		postingid.push( tokenIds[i]); // tokenId==0 , empty token
	}
	var postingkeys=postingid.map(function(t){return ["postings",t]});
	engine.get(postingkeys,function(postings){
		postings.map(function(p,i) { terms[i].posting=p });
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
	console.log(emptycount,hashit);
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
		
		if (!Q.byFile && Q.rawresult && !opts.nogroup) {
			Q.byFile=plist.groupbyposting2(Q.rawresult, fileOffsets);
			Q.byFile.shift();Q.byFile.pop();
			Q.byFolder=groupByFolder(engine,Q.byFile);

			countFolderFile(Q);
		}
		if (opts.range) {
			excerpt.resultlist(engine,Q,opts,function(data) {
				Q.excerpt=data;
				if (engine.context) cb.apply(engine.context,[Q]);
				else cb(Q);
			});
		} else {
			if (engine.context) cb.apply(engine.context,[Q]);
			else cb(Q);
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
  high = array.length;
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
	if (!postings[i])
	  return [];
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
		pagewithhit.shift(); //the first item is not used (0~Q.byFile[0] )
		for (var j=0; j<pagewithhit.length;j++) {
			if (!pagewithhit[j].length) continue;
			//var offsets=pagewithhit[j].map(function(p){return p- fileOffsets[i]});
			output.push(  {file: nfile, page:j,  pagename:pageNames[j]});
		}
	}

	var pagekeys=output.map(function(p){
		return ["fileContents",p.file,p.page+1];
	});
	//prepare the text
	engine.get(pagekeys,function(pages){
		var seq=0;
		if (pages) for (var i=0;i<pages.length;i++) {
			var startvpos=files[output[i].file].pageOffsets[output[i].page];
			var endvpos=files[output[i].file].pageOffsets[output[i].page+1];
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
	var pagekeys=["fileContents",fileid,pageid];
	var pagenames=engine.getFilePageNames(fileid);

	engine.get(pagekeys,function(text){
		cb.apply(engine.context,[{text:text,file:fileid,page:pageid,pagename:pagenames[pageid]}]);
	});
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
	})
}
module.exports={resultlist:resultlist, 
	hitInRange:hitInRange, 
	highlightPage:highlightPage,
	getPage:getPage};
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
var build=function(path){
  var fs=require("fs");

  if (!fs.existsSync(mkdbjs)) {
      throw "no "+mkdbjs  ;
  }
  var starttime=new Date();
  console.log("START",starttime);
  if (!path) path=".";
  var fn=require("path").resolve(path,mkdbjs);
  var mkdbconfig=require(fn);
  var glob = require("glob");
  var indexer=require("ksana-document").indexer;
  var timer=null;

  glob(mkdbconfig.glob, function (err, files) {
    if (err) {
      throw err;
    }
    mkdbconfig.files=files.sort();
    var session=indexer.start(mkdbconfig);
    if (!session) {
      console.log("No file to index");
      return;
    }
    timer=setInterval( getstatus, 1000);
  });
  var getstatus=function() {
    var status=indexer.status();
    outback((Math.floor(status.progress*1000)/10)+'%'+status.message);
    if (status.done) {
    	var endtime=new Date();
    	console.log("END",endtime, "elapse",(endtime-starttime) /1000,"seconds") ;
      //status.outputfn=movefile(status.outputfn,"..");
      clearInterval(timer);
    }
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
	context.paths.push(e.name);
	context.parents.push(e);
	context.now=e;	
	context.path=context.paths.join("/");
	if (!context.handler) {
		var handler=context.handlers[context.path];
		if (handler) 	context.handler=handler;
		var close_handler=context.close_handlers[context.path];
		if (close_handler) 	context.close_handler=close_handler;
	}

	if (context.handler)  context.handler(true);
}

var onclosetag=function(e) {
	context.now=context.parents[context.parents.length-1];

	var handler=context.close_handlers[context.path];
	if (handler) {
		var res=null;
		if (context.close_handler) res=context.close_handler(true);
		context.handler=null;//stop handling
		context.close_handler=null;//stop handling
		context.text="";
		if (res && context.status.storeFields) {
			context.status.storeFields(res, context.status.json);
		}
	} else if (context.close_handler) {
		context.close_handler();
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

var htmlfs=Require("htmlfs");    
var checkbrowser=Require("checkbrowser");  
  
var html5fs=Require("ksana-document").html5fs;
var filelist = React.createClass({displayName: 'filelist',
	getInitialState:function() {
		return {downloading:false,progress:0};
	},
	updatable:function(f) {
        	var classes="btn btn-warning";
        	if (this.state.downloading) classes+=" disabled";
		if (f.hasUpdate) return React.DOM.button({className: classes, 
			'data-filename': f.filename, 'data-url': f.url, 
	            onClick: this.download
	       }, "Update")
		else return null;
	},
	showLocal:function(f) {
        var classes="btn btn-danger";
        if (this.state.downloading) classes+=" disabled";
	  return React.DOM.tr(null, React.DOM.td(null, f.filename), 
	      React.DOM.td(null), 
	      React.DOM.td({className: "pull-right"}, 
	      this.updatable(f), React.DOM.button({className: classes, 
	               onClick: this.deleteFile, 'data-filename': f.filename}, "Delete")
	        
	      )
	  )
	},  
	showRemote:function(f) { 
	  var classes="btn btn-warning";
	  if (this.state.downloading) classes+=" disabled";
	  return (React.DOM.tr({'data-id': f.filename}, React.DOM.td(null, 
	      f.filename), 
	      React.DOM.td(null, f.desc), 
	      React.DOM.td(null, 
	      React.DOM.span({'data-filename': f.filename, 'data-url': f.url, 
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
	      	React.DOM.div(null, 
	      	"Downloading from ", this.state.url, 
	      React.DOM.div({key: "progress", className: "progress col-md-8"}, 
	          React.DOM.div({className: "progress-bar", role: "progressbar", 
	              'aria-valuenow': progress, 'aria-valuemin': "0", 
	              'aria-valuemax': "100", style: {width: progress+"%"}}, 
	            progress, "%"
	          )
	        ), 
	        React.DOM.button({onClick: this.abortdownload, 
	        	className: "btn btn-danger col-md-4"}, "Abort")
	        )
	        );
	      } else {
	      		if ( this.allFilesReady() ) {
	      			return React.DOM.button({onClick: this.dismiss, className: "btn btn-success"}, "Ok")
	      		} else return null;
	      		
	      }
	},
	showUsage:function() {
		var percent=this.props.remainPercent;
           return (React.DOM.div(null, React.DOM.span({className: "pull-left"}, "Usage:"), React.DOM.div({className: "progress"}, 
		  React.DOM.div({className: "progress-bar progress-bar-success progress-bar-striped", role: "progressbar", style: {width: percent+"%"}}, 
		    	percent+"%"
		  )
		)));
	},
	render:function() {
	  	return (
		React.DOM.div({ref: "dialog1", className: "modal fade", 'data-backdrop': "static"}, 
		    React.DOM.div({className: "modal-dialog"}, 
		      React.DOM.div({className: "modal-content"}, 
		        React.DOM.div({className: "modal-header"}, 
		          React.DOM.h4({className: "modal-title"}, "File Installer")
		        ), 
		        React.DOM.div({className: "modal-body"}, 
		        	React.DOM.table({className: "table"}, 
		        	React.DOM.tbody(null, 
		          	this.props.files.map(this.showFile)
		          	)
		          )
		        ), 
		        React.DOM.div({className: "modal-footer"}, 
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
var filemanager = React.createClass({displayName: 'filemanager',
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
		if (typeof ksanagap!="undefined") return [];
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
		if (typeof ksanagap!="undefined") {
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
			$(".modal.in").modal('hide');
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
      			return checkbrowser({feature: "fs", onReady: this.onBrowserOk})
    		} if (!this.state.quota || this.state.remain<this.state.requireSpace) {  
    			var quota=this.state.requestQuota;
    			if (this.state.usage+this.state.requireSpace>quota) {
    				quota=(this.state.usage+this.state.requireSpace)*1.5;
    			}
      			return htmlfs({quota: quota, autoclose: "true", onReady: this.onQuoteOk})
      		} else {
			if (!this.state.noupdate || this.missingKdb().length || !this.state.autoclose) {
				var remain=Math.round((this.state.usage/this.state.quota)*100);				
				return filelist({action: this.action, files: this.state.files, remainPercent: remain})
			} else {
				setTimeout( this.dismiss ,0);
				return React.DOM.span(null, "Success");
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

module.exports=filemanager;
});
require.register("ksanaforge-checkbrowser/index.js", function(exports, require, module){
/** @jsx React.DOM */

var checkfs=function() {
	return (navigator && navigator.webkitPersistentStorage) || 
	(typeof ksanagap!="undefined");
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
			return React.DOM.div(null, m);
		}
		return (
		 React.DOM.div({ref: "dialog1", className: "modal fade", 'data-backdrop': "static"}, 
		    React.DOM.div({className: "modal-dialog"}, 
		      React.DOM.div({className: "modal-content"}, 
		        React.DOM.div({className: "modal-header"}, 
		          React.DOM.button({type: "button", className: "close", 'data-dismiss': "modal", 'aria-hidden': "true"}, "×"), 
		          React.DOM.h4({className: "modal-title"}, "Browser Check")
		        ), 
		        React.DOM.div({className: "modal-body"}, 
		          React.DOM.p(null, "Sorry but the following feature is missing"), 
		          this.state.missing.map(showMissing)
		        ), 
		        React.DOM.div({className: "modal-footer"}, 
		          React.DOM.button({onClick: this.downloadbrowser, type: "button", className: "btn btn-primary"}, "Download Google Chrome")
		        )
		      )
		    )
		  )
		 );
	},
	renderReady:function() {
		return React.DOM.span(null, "browser ok")
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
		React.DOM.div({ref: "dialog1", className: "modal fade", id: "myModal", 'data-backdrop': "static"}, 
		    React.DOM.div({className: "modal-dialog"}, 
		      React.DOM.div({className: "modal-content"}, 
		        React.DOM.div({className: "modal-header"}, 
		          React.DOM.h4({className: "modal-title"}, "Welcome")
		        ), 
		        React.DOM.div({className: "modal-body"}, 
		          "Browser will ask for your confirmation."
		        ), 
		        React.DOM.div({className: "modal-footer"}, 
		          React.DOM.button({onClick: this.initFilesystem, type: "button", 
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
			if (used>50) return React.DOM.button({type: "button", className: "btn btn-primary"}, "Allocate More");
			else null;
		}
		return (
		React.DOM.div({ref: "dialog1", className: "modal fade", id: "myModal", 'data-backdrop': "static"}, 
		    React.DOM.div({className: "modal-dialog"}, 
		      React.DOM.div({className: "modal-content"}, 
		        React.DOM.div({className: "modal-header"}, 
		          React.DOM.h4({className: "modal-title"}, "Sandbox File System")
		        ), 
		        React.DOM.div({className: "modal-body"}, 
		          React.DOM.div({className: "progress"}, 
		            React.DOM.div({className: "progress-bar", role: "progressbar", style: {width: used+"%"}}, 
		               used, "%"
		            )
		          ), 
		          React.DOM.span(null, this.state.quota, " total , ", this.state.usage, " in used")
		        ), 
		        React.DOM.div({className: "modal-footer"}, 
		          React.DOM.button({onClick: this.dismiss, type: "button", className: "btn btn-default", 'data-dismiss': "modal"}, "Close"), 
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
		if (typeof ksanagap=="undefined") {
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
				return React.DOM.span(null, "checking quota")
			}			
		} else {
			if (!this.state.autoclose) {
				this.dialog=true;
				return this.renderDefault(); 
			}
			this.dismiss();
			this.dialog=false;
			return React.DOM.span(null)
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
require.register("pedurmacat-main/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */
var searchbar=Require("searchbar"); 
var fromsutra=Require("fromsutra"); 
var corressutras=Require("corressutras"); 
var dataset=Require("dataset"); //{dataset.hPedurma};
var api=Require("dataset").api;
var sutraimage=Require("sutraimage");
var longnames={"J":"Lijiang","D":"Derge","C":"Cone","K":"Pedurma","N":"Narthang","H":"Lhasa","U":"Urga"};
var mappings={"J":dataset.jPedurma,"D":dataset.dPedurma,"C":dataset.cPedurma,"K":dataset.kPedurma,"N":dataset.nPedurma,"H":dataset.hPedurma,"U":dataset.uPedurma};

var main = React.createClass({displayName: 'main',
  getInitialState: function() {
    return {corres:[],res:[]};
  },
  search: function(volpage,from){
    var out=[];
    for(var to in mappings){
      if(mappings[from].rcode != mappings[to].rcode){
        var res = api.dosearch(volpage,mappings[from],mappings[to]);
        //res = [版本縮寫,[[經號],[範圍],[對照經號],[對照範圍],[對照行],[K經號]]]
        out.push({
          toRecen:longnames[to],
          toJing:res[1][0][0],
          corresLine:res[1][4][0]
        });
      }     
    }
    this.setState({volpage:volpage, fromRecen:longnames[from], KJing:res[1][5][0], fromJing:res[1][0][0], corres:out });   
  },
  parseVolPage: function(str){
    str=str || "";
    var s=str.match(/(\d+)[@.](\d+)([abcd]*)(\d*)/);
    //var s=str.match(/(\d+)[@.](\d+)([abcd])(\d*)-*(\d*)([abcd]*)(\d*)/);
    if(!s){
      console.log("error!",str);
      return null;
    }
    return {vol:parseInt(s[1]),page:parseInt(s[2]),side:s[3] || "x",line:parseInt(s[4]||"1")};
    //return {vol:parseInt(s[1]),page:parseInt(s[2]),side:s[3],line:parseInt(s[4]||"1"),page2:parseInt(s[5]),side2:s[6],line2:parseInt(s[7]||"1")};
  },
  render: function() {
    return (
      React.DOM.div(null, 
        searchbar({search: this.search}), 
        fromsutra({volpage: this.state.volpage, fromRecen: this.state.fromRecen, KJing: this.state.KJing, parseVolPage: this.parseVolPage, fromJing: this.state.fromJing}), 
        corressutras({corres: this.state.corres, parseVolPage: this.parseVolPage})
      )
    );
  }
});
module.exports=main;
});
require.register("pedurmacat-comp1/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var comp1 = React.createClass({displayName: 'comp1',
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      React.DOM.div(null, 
        "Rendering comp1"
      )
    );
  }
});
module.exports=comp1;
});
require.register("pedurmacat-fromsutra/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var sutraimage=Require("sutraimage");
var sutranames=Require("dataset").sutranames; 
var taishonames=Require("dataset").taishonames;
var pedurma_taisho=Require("dataset").pedurma_taisho;
var fromBar = React.createClass({displayName: 'fromBar',
  searchSutraName:function(KJing){
    for(var i=0; i<sutranames.length; i++){
      if(KJing == sutranames[i][0]) return sutranames[i][1];
      //else return "";
    } 
  },
  searchNameCh: function(KJing){
    //判斷輸入是J版本還是D版本再依其版本取得K
    //在pedurma_taisho從K值轉換成中文經號
    var result=[];
    for(var i=0;i<pedurma_taisho.length;i++){
      if(KJing==pedurma_taisho[i][0]){
        var taisho=pedurma_taisho[i][1].split(",");  ////對照到中有多個經時

        for(var j=0;j<taisho.length;j++){
          //回去taishonames找到該項，得到中文經名
          var taishoNumName=this.taisho2taishoName(taisho[j]);//[T01n0001,經名]
          //將中文經名加上超連結
          result.push(this.addLink(taishoNumName[0],taishoNumName[1]));
        }
        return result;
      }
    }
  },

  taisho2taishoName: function(taisho){ //把pedurma_taisho裡的taisho號碼轉換為經名
    for(var i=0;i<taishonames.length;i++){
      var taishoNum=parseInt(taishonames[i][0].substr(4,4));//taishonames[i][0].length-4
      if(parseInt(taisho) == taishoNum){
        return taishonames[i];//[T01n0001,經名]
      }
    }
  },
  addLink: function(link,name){
    if(link.match(/T0.n0220/)){
      link=link.substr(0,link.length-1);
    }
    return React.DOM.span(null, React.DOM.a({target: "_new", href: "http://tripitaka.cbeta.org/"+link}, name), "、")

  },
  render: function(){
    return  (
      React.DOM.div(null, 
        React.DOM.span({className: "recen"}, this.props.fromRecen), 
        "      Sutra: ", this.props.fromJing, 
        "      Sutra Name: ", this.searchSutraName(this.props.KJing), 
        "      Taisho Name: ", this.searchNameCh(this.props.KJing)
      )
    );
  }
});

var fromsutra = React.createClass({displayName: 'fromsutra',
  getInitialState: function() {
    return {recen:""};
  }, 
  render: function() {
    var volpage=this.props.parseVolPage(this.props.volpage);
    return (
      React.DOM.div(null, 
        fromBar({KJing: this.props.KJing, fromRecen: this.props.fromRecen, fromJing: this.props.fromJing}), 
        sutraimage({volpage: volpage, recen: this.props.fromRecen})
      )
    );
  }
});
module.exports=fromsutra;
});
require.register("pedurmacat-searchbar/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var searchbar = React.createClass({displayName: 'searchbar',
  getInitialState: function() {
    return {recen:"D"};
  },
  search: function() {
    var volpage=this.refs.volpage.getDOMNode().value;
    {this.props.search(volpage,this.state.recen)};
  },
  getRecen: function(e) {
    var recen=e.target.value;
    this.setState({recen:recen});
  },
  render: function() {
    return(
      React.DOM.div({className: "row col-lg-offset-4"}, 
        React.DOM.div({className: "col-lg-2"}, 
          React.DOM.select({onChange: this.getRecen, className: "form-control"}, 
            React.DOM.option({value: "D"}, "Derge"), 
            React.DOM.option({value: "J"}, "Lijiang"), 
            React.DOM.option({value: "C"}, "Cone"), 
            React.DOM.option({value: "N"}, "Narthang"), 
            React.DOM.option({value: "H"}, "Lhasa"), 
            React.DOM.option({value: "U"}, "Urga")
          )
        ), 
        React.DOM.div({className: "col-lg-3"}, 
          React.DOM.input({className: "form-control", type: "text", ref: "volpage", defaultValue: "4.12a2"})
        ), 
        React.DOM.button({className: "btn btn-success", onClick: this.search}, "Search")
      )
    ); 
  }
});
module.exports=searchbar;
});
require.register("pedurmacat-corressutras/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var sutraimage=Require("sutraimage");
var corressutras = React.createClass({displayName: 'corressutras',
  getInitialState: function() {
    return {recen:""};
  },
  snap2realpage: function(id){
    if(id.side == "c"){
      id.side=id.side.replace("c","b");
    }
    else if(id.side == "d"){
      id.page=id.page+1;
      id.side="a";
    }
    return id;
  },
  renderItem: function(item) {
    var c=this.props.parseVolPage(item.corresLine);
    var corresLine=this.snap2realpage(c);
    return(
      React.DOM.div(null, 
        React.DOM.span({className: "recen"}, item.toRecen), 
        "      Sutra: ", item.toJing, 
        "      Volume: ", corresLine.vol, 
        "      Page: ", corresLine.page, 
        "      Side: ", corresLine.side, 
        "      Line: ", corresLine.line, 
        sutraimage({volpage: corresLine, recen: item.toRecen, parseVolPage: this.props.parseVolPage})
      )
    );
  },
  render: function() {

    return (
      React.DOM.div(null, 
        this.props.corres.map(this.renderItem)
      )
    );
  }
});
module.exports=corressutras;
});
require.register("pedurmacat-dataset/index.js", function(exports, require, module){
//var othercomponent=Require("other"); 
//new module filename must be added to scripts section of ./component.js and export here
var dataset = {
 jPedurma: require("./jPedurma"),
 cPedurma: require("./cPedurma"),
 dPedurma: require("./dPedurma"),
 hPedurma: require("./hPedurma"),
 kPedurma: require("./kPedurma"),
 uPedurma: require("./uPedurma"),
 nPedurma: require("./nPedurma"),
 sutranames: require("./sutranames"),
 taishonames: require("./taishonames"),
 pedurma_taisho: require("./pedurma_taisho"),
 api:require("./api")
}

module.exports=dataset;
});
require.register("pedurmacat-dataset/dPedurma.js", function(exports, require, module){
var dPedurma=[["1","001@001b1-311a6","1"],
["1","002@001b1-317a7","1"],
["1","003@001b1-293a6","1"],
["1","004@001b1-302a5","1"],
["2","005@001b1-020b7","2"],
["3","005@021a1-292a7","3"],
["3","006@001b1-287a7","3"],
["3","007@001b1-287a7","3"],
["3","008@001b1-269a6","3"],
["4","009@001b1-025a7","4"],
["5","009@025b1-328a6","5"],
["6","010@001b1-310a7","6"],
["6","011@001b1-333a7","6"],
["7a","012@001b1-092a7","7"],
["7b","012@092b1-302a7","8"],
["7b","013@001b1-313a5","8"],
["8","014@001b1-394a7","25"],
["8","015@001b1-402a7","25"],
["8","016@001b1-394a4","25"],
["8","017@001b1-381a7","25"],
["8","018@001b1-395a5","25"],
["8","019@001b1-382a7","25"],
["8","020@001b1-398a7","25"],
["8","021@001b1-399a7","25"],
["8","022@001b1-384a7","25"],
["8","023@001b1-387a7","25"],
["8","024@001b1-411a7","25"],
["8","025@001b1-395a6","25"],
["9","026@001b1-382a4","26"],
["9","027@001b1-393a6","26"],
["9","028@001b1-381a5","26"],
["10","029@001b1-300a7","27"],
["10","030@001b1-304a7","27"],
["10","031@001b1-206a7","27"],
["11","031@207b1-297a6","28"],
["11","032@001b1-397a7","28"],
["12","033@001b1-286a6","29"],
["13","034@001b1-019b7","30"],
["14","034@020a1-103b7","31"],
["15","034@104a1-120b7","32"],
["16","034@121a1-132b7","33"],
["17","034@133a1-139b6","34"],
["18","034@139b6-142a4","35"],
["19","034@142a4-143b5","36"],
["20","034@143b5-144b6","37"],
["21","034@144b6-146a3","38"],
["22","034@146a3-147b3","39"],
["23","034@147b3-147b7","40"],
["24","034@148a1-174a2","41"],
["25","034@174a2-175b3","42"],
["26","034@175b3-176b6","43"],
["27","034@176b6-177b6","44"],
["28","034@177b6-178a6","45"],
["29","034@178a6-178b6","46"],
["30","034@178b6-179a7","47"],
["31","034@180a1-183a7","48"],
["32","034@183a7-250a5","49"],
["33","034@250a5-259b4","50"],
["34","034@259b4-263a4","51"],
["35","034@263a4-270a1","52"],
["36","034@270a1-270b7","53"],
["37","034@271a1-276a5","54"],
["38","034@276a5-279a2","55"],
["39","034@279a2-281b1","56"],
["40","034@281b1-282a6","57"],
["41","034@282a6-282b6","58"],
["42","034@282b6-283a5","59"],
["43","034@283a5-284a7","60"],
["44","035@001b1-393a5","61"],
["44","036@001b1-396a6","61"],
["44","037@001b1-396a7","61"],
["44","038@001b1-363a6","61"],
["45","039@001b1-045a7","62"],
["46","039@045b1-099b7","63"],
["47","039@100a1-203a7","64"],
["48","039@203b1-237a7","65"],
["49","039@237b1-270a5","66"],
["50","040@001b1-070a7","67"],
["51","040@070b1-140a7","68"],
["52","040@140b1-164a5","69"],
["53","040@164a6-184b6","70"],
["54","040@184b6-195a7","71"],
["55","040@195b1-255b1","72"],
["56","040@255b1-294a7","73"],
["56","041@001b1-205b1","73"],
["57","041@205b1-236b7","74"],
["58","041@237a1-248a7","75"],
["59","041@248b1-297a3","76"],
["60","042@001b1-168a7","77"],
["61","042@168b1-227a6","78"],
["62","042@227a7-257a7","79"],
["63","042@257a7-288a4","80"],
["64","043@001b1-017b4","81"],
["65","043@017b4-036a1","82"],
["66","043@036a1-067b7","83"],
["67","043@068a1-114b7","84"],
["68","043@115a1-131a7","85"],
["69","043@131a7-153b7","86"],
["70","043@154a1-180b7","87"],
["71","043@181a1-193b7","88"],
["72","043@194a1-204b1","89"],
["73","043@204b1-215b7","90"],
["74","043@216a1-222a3","91"],
["75","043@222a3-225b3","92"],
["76","043@225b3-240b7","93"],
["77","043@241a1-261b6","94"],
["78","043@261b6-266b6","95"],
["79","043@266b6-284b7","96"],
["80","043@285a1-309a7","97"],
["80","044@001b1-027a4","97"],
["81","044@027a4-029b7","98"],
["82","044@030a1-070b7","99"],
["83","044@071a1-094b7","100"],
["84","044@095a1-104b1","101"],
["85","044@104b1-116b2","102"],
["86","044@116b2-119a7","103"],
["87","044@119b1-151b7","104"],
["88","044@152a1-175b2","105"],
["89","044@175b2-182b6","106"],
["90","044@182b6-209b7","107"],
["91","044@210a1-254b7","108"],
["92","044@255a1-277b7","109"],
["93","044@278a1-299a7","110"],
["94","045@001b1-340a5","111"],
["95","046@001b1-216b7","112"],
["96","046@217a1-241b7","113"],
["97","046@242a1-257b7","114"],
["98","046@258a1-278a4","115"],
["99","047@001b1-275b7","117"],
["100","047@276a1-305a7","118"],
["101","048@001b1-227b7","119"],
["102","048@228a1-274b7","120"],
["103","048@275a1-285b4","121"],
["104","048@285b4-286b7","122"],
["105","048@286b7-288a7","123"],
["106","049@001b1-055b7","124"],
["107","049@056a1-191b7","125"],
["108","049@192a1-284b7","126"],
["109","049@285a1-292a7","127"],
["110","050@001b1-055b7","128"],
["111","050@056a1-128b7","129"],
["112","050@129a1-297a7","130"],
["113","051@001b1-180b7","131"],
["114","051@181a1-195b4","132"],
["115","051@195b4-200a2","133"],
["116","051@200a3-247b7","134"],
["117","051@248a1-290a7","135"],
["118","051@290b1-298a7","136"],
["119","052@001b1-343a6","137"],
["119","053@001b1-339a7","137"],
["120","054@001b1-151a4","138"],
["121","054@151a4-152b7","139"],
["122","054@153a1-153b1","140"],
["123","054@153b1-212b7","141"],
["124","054@213a1-292b7","142"],
["125","054@293a1-293a7","143"],
["126","054@293a7-296a7","144"],
["127","055@001b1-170b7","145"],
["128","055@171a1-174b4","146"],
["129","055@174b4-210b3","147"],
["130","055@210b3-230b4","148"],
["131","055@230b4-253b5","149"],
["132","055@253b5-316b6","150"],
["133","056@001b1-070b2","151"],
["134","056@070b2-121b7","152"],
["135","056@122a1-144b2","153"],
["136","056@144b2-179a4","154"],
["137","056@179a4-187b2","155"],
["138","056@187b3-277b7","156"],
["139","056@278a1-289b4","157"],
["140","056@289b4-299a5","158"],
["141","056@299a5-300a3","159"],
["142","057@001b1-006b1","160"],
["143","057@006b1-006b6","161"],
["144","057@006b6-034a3","162"],
["145","057@034a4-082a3","163"],
["146","057@082a3-141b7","164"],
["147","057@142a1-242b7","165"],
["148","057@243a1-330a7","166"],
["149","057@330b1-331a2","167"],
["150","057@331a2-331b5","168"],
["151","057@331b5-344a4","169"],
["152","058@001b1-115b7","170"],
["153","058@116a1-198a3","171"],
["154","058@198a3-205a6","172"],
["155","058@205a6-205b7","173"],
["156","058@206a1-253b7","174"],
["157","058@254a1-319a7","175"],
["158","059@001b1-010b4","176"],
["159","059@010b4-022b7","177"],
["160","059@023a1-100b7","178"],
["161","059@101a1-139b4","179"],
["162","059@139b5-143b7","180"],
["163","059@144a1-159b7","181"],
["164","059@160a1-167b2","182"],
["165","059@167b2-171b3","183"],
["166","059@171b3-175a7","184"],
["167","059@175b1-210b7","185"],
["168","059@211a1-259b7","186"],
["169","059@260a1-307a7","187"],
["170","059@307b1-310b3","188"],
["171","059@310b4-314a7","189"],
["172","060@001b1-005a7","190"],
["173","060@005b1-007b4","191"],
["174","060@007b4-078b7","192"],
["175","060@079a1-174b7","193"],
["176","060@175a1-239b7","194"],
["177","060@240a1-240b5","195"],
["178","060@240b5-244b4","196"],
["179","060@244b4-266b7","197"],
["180","060@267a1-296a6","198"],
["181","061@001b1-076b7","199"],
["182","061@077a1-095b1","200"],
["183","061@095b2-096b6","201"],
["184","061@096b6-105b7","202"],
["185","061@106a1-143b4","203"],
["186","061@143b4-158a4","204"],
["187","061@158a4-191a7","205"],
["188","061@191b1-199b5","206"],
["189","061@199b6-201a6","207"],
["190","061@201a6-224b5","208"],
["191","061@224b5-243b5","209"],
["192","061@243b6-246a7","210"],
["193","061@246a7-250b3","211"],
["194","061@250b3-251a5","212"],
["195","061@251a6-266a7","213"],
["196","061@266b1-271b2","214"],
["197","061@271b2-274b5","215"],
["198","061@274b6-296a7","216"],
["199","061@296b1-303a5","217"],
["200","061@303a6-308a7","218"],
["201","062@001b1-063a5","219"],
["209","062@011b7-115b7","227"],
["202","062@063a5-078a4","220"],
["203","062@078a4-081b2","221"],
["204","062@081b2-092a5","222"],
["205","062@092a5-093b7","223"],
["206","062@094a1-095a7","224"],
["207","062@095a7-109a5","225"],
["208","062@109a6-111b7","226"],
["211","062@123b1-125a3","229"],
["212","062@125a3-125b7","230"],
["213","062@126a1-206b7","231"],
["217","062@269a1-284a2","235"],
["218","062@284a3-297b5","236"],
["219","062@297b5-307a6","237"],
["220","063@001b1-077b7","238"],
["221","063@078a1-084b4","239"],
["222","063@084b5-126b7","240"],
["223","063@127a1-164a2","241"],
["224","063@164a2-173b7","242"],
["225","063@174a1-175a5","243"],
["226","063@175a6-177a3","244"],
["227","063@177a3-188b7","245"],
["228","063@189a1-226a7","246"],
["229","063@226b1-265b7","247"],
["230","063@266a1-297a7","248"],
["231","064@001b1-112b7","249"],
["232","064@113a1-214b7","250"],
["233","064@215a1-245b7","251"],
["234","064@246a1-250b2","252"],
["235","064@250b2-263a7","253"],
["236","064@263a7-287a4","254"],
["237","064@287a4-299a4","255"],
["238","065@001b1-099b7","256"],
["239","065@100a1-241b4","257"],
["240","065@241b4-301b7","258"],
["241","065@302a1-303a7","259"],
["242","065@303a7-306a7","260"],
["243","066@001b1-015b1","261"],
["244","066@015b2-027b4","262"],
["245","066@027b5-033a1","263"],
["246","066@033a1-042b5","264"],
["247","066@042b5-046a7","265"],
["248","066@046b1-059a5","266"],
["249","066@059a5-059b7","267"],
["250","066@059b7-060a7","268"],
["251","066@060b1-061a2","269"],
["252","066@061a2-069b2","270"],
["253","066@069b2-070b3","271"],
["254","066@070b3-071a2","272"],
["255","066@071a3-074a3","273"],
["256","066@074a4-091a7","274"],
["257","066@091b1-245b1","275"],
["258","066@245b2-259b4","276"],
["259","066@259b5-264a4","277"],
["260","066@264a4-283b2","278"],
["261","066@283b2-310a7","279"],
["262","067@001b1-089b7","280"],
["263","067@090a1-209b7","281"],
["264","067@210a1-264a1","282"],
["265","067@264a1-287b7","283"],
["266","067@288a1-319a6","284"],
["267","068@001b1-005b2","285"],
["268","068@005b3-007a2","286"],
["269","068@007a2-013a7","287"],
["270","068@013b1-017b3","288"],
["271","068@017b3-021a7","289"],
["272","068@021b1-026a5","290"],
["273","068@026a5-029b6","291"],
["274","068@029b6-035b7","292"],
["275","068@036a1-044b2","293"],
["276","068@044b3-049b6","294"],
["277","068@049b6-052b6","295"],
["278","068@052b6-054b6","296"],
["279","068@054b6-055a7","297"],
["280","068@055a7-055b4","298"],
["281","068@055b4-055b6","299"],
["282","068@055b6-056a4","300"],
["283","068@056a5-057a3","301"],
["284","068@057a3-077a3","302"],
["285","068@077a3-079b7","303"],
["286","068@079b7-081b7","304"],
["287","068@082a1-318a7","305"],
["287","069@001b1-307a5","305"],
["287","070@001b1-312a6","305"],
["287","071@001b1-229b7","305"],
["288","071@230a1-244a7","306"],
["289","071@244b1-249b7","307"],
["290","071@250a1-253b2","308"],
["291","071@253b2-261b7","309"],
["292","071@262a1-265b4","310"],
["293","071@265b4-267a7","311"],
["294","071@267b1-275b7","312"],
["295","071@276a1-295b1","313"],
["296","071@295b2-297a2","314"],
["297","071@297a2-301b2","315"],
["298","071@301b2-303b4","316"],
["299","071@303b4-304b3","317"],
["300","071@304b3-305a7","318"],
["301","072@001b1-125a7","319"],
["302","072@125a7-127a2","320"],
["303","072@127a2-127b7","321"],
["304","072@128a1-130b4","322"],
["305","072@130b4-131b1","323"],
["306","072@131b1-139a4","324"],
["307","072@139a4-145b3","325"],
["308","072@145b4-155a1","326"],
["309","072@155a2-155b4","327"],
["310","072@155b5-157a5","328"],
["311","072@157a6-157b4","329"],
["312","072@157b4-161b1","330"],
["313","072@161b1-163b5","331"],
["314","072@163b6-169a4","332"],
["315","072@169a4-169b7","333"],
["316","072@170a1-170b4","334"],
["317","072@170b4-188a7","335"],
["318","072@188a7-193b7","336"],
["319","072@194a1-196b7","337"],
["320","072@197a1-198b4","338"],
["321","072@198b5-201a5","339"],
["322","072@201a6-204a4","340"],
["323","072@204a4-204a6","341"],
["324","072@204a6-204b3","342"],
["325","072@204b3-208b7","343"],
["326","072@209a1-253a7","344"],
["329","072@257a7-258b6","347"],
["330","072@258b7-259b3","348"],
["331","072@259b3-260a4","349"],
["332","072@260a5-263b5","350"],
["333","072@263b6-268a4","351"],
["334","072@268a5-271a5","352"],
["335","072@271a5-274a7","353"],
["336","072@274a7-275a6","354"],
["337","072@275a6-277a4","355"],
["338","072@277a4-298b7","357"],
["339","072@298b7-310a7","358"],
["340","073@001b1-309a7","360"],
["340","074@001b1-128b7","360"],
["341","074@129a1-298a7","361"],
["342","074@298b1-300a4","362"],
["343","075@001b1-286b7","363"],
["344","075@287a1-289b2","364"],
["345","075@289b2-291a7","365"],
["346","075@291b1-298a6","366"],
["347","076@001b1-022a4","367"],
["348","076@022a4-031b3","368"],
["349","076@031b3-050a5","369"],
["350","076@050a5-055b7","370"],
["351","076@055b7-070b1","371"],
["352","076@070b2-086a2","372"],
["353","076@086a2-198b7","373"],
["354","076@199a1-208b7","374"],
["355","076@209a1-216a4","375"],
["356","076@216a5-220b5","376"],
["357","076@220b6-232a7","377"],
["358","076@232b1-277b5","378"],
["359b","076@281b1-289a3","381"],
["360","077@001b1-013b7","385"],
["361","077@014a1-021a6","386"],
["362","077@022a1-128b7","387"],
["363","077@129a1-144a7","388"],
["364","077@144b1-146a7","389"],
["365","077@146a7-150a7","390"],
["366","077@151a1-193a6","391"],
["367","077@193a6-212a7","392"],
["368","077@213a1-246b7","393"],
["369","077@247a1-370a7","394"],
["370","078@001b1-125a7","395"],
["371","078@125b1-136b7","396"],
["372","078@137a1-264b7","397"],
["373","078@265a1-311a6","398"],
["374","079@001b1-033b7","399"],
["375","079@034a1-044b5","400"],
["376","079@044b6-052b5","401"],
["377","079@052b5-060a7","402"],
["378","079@060b1-071a3","403a"],
["379","079@071a3-072b7","403b"],
["380","079@072b7-073a7","404"],
["381","079@073b1-158b7","405a"],
["382","079@158b7-184a7","405b"],
["383","079@184b1-187a1","406"],
["384","079@187a2-195b7","407"],
["385","079@196a1-199a7","408"],
["386","079@199a7-202a1","409"],
["387","079@202a2-203b1","410"],
["389","079@208b2-213b4","412"],
["390","079@213b4-216a3","413"],
["391","079@216a3-219a2","414"],
["392","079@219a2-220a7","415"],
["393","079@220b1-221b7","416"],
["394","079@222a1-223a7","417"],
["395","079@223a7-224b4","418"],
["396","079@224b4-227b2","419"],
["397","079@227b3-229a2","420"],
["398","079@229a2-230a2","421"],
["399","079@230a2-231b3","422"],
["400","079@231b4-233a5","423"],
["401","079@233a5-235a5","424"],
["402","079@235a5-237a5","425"],
["403","079@237a5-238b7","426"],
["404","079@239a1-239b7","427"],
["405","079@240a1-242b7","428"],
["406","079@242b7-244a7","429"],
["407","079@244b1-245b6","430"],
["408","079@245b6-247a4","431"],
["409","079@247a4-248a1","432"],
["410","079@248a1-249b6","433"],
["411","079@249b6-251b3","434"],
["412","079@251b3-254b4","435"],
["413","079@254b5-259b3","436"],
["414","079@259b3-261b3","437"],
["415","079@261b3-263a7","438"],
["416","079@263b1-292a6","439"],
["417","080@001b1-013b5","440a"],
["418","080@013b5-030a3","440b"],
["419","080@030a4-065b7","441"],
["421","080@091a1-096b6","443"],
["422","080@096b6-136b4","444"],
["423","080@136b5-142b7","445"],
["424","080@143a1-167a5","446"],
["425","080@167a6-171a1","447"],
["426","080@171a2-176a2","448"],
["427","080@176a2-180b7","449"],
["428","080@181a1-231b5","450"],
["429","080@231b6-260a2","451"],
["430","080@260a3-304a7","452"],
["432","081@001b1-012a7","454"],
["433","081@012b1-014b4","455"],
["434","081@014b4-016b5","456"],
["435","081@016b5-027a6","457"],
["436","081@027a6-029b1","458"],
["437","081@029b1-042b3","459"],
["438","081@042b3-043b6","460"],
["439","081@043b7-045b6","461"],
["440","081@045b6-086a7","462"],
["441","081@086b1-089b7","463"],
["442","081@090a1-148a6","464"],
["443","081@148a6-157b7","466"],
["444","081@158a1-207b7","467"],
["445","081@208a1-277b3","468"],
["446","081@277b3-281b7","469"],
["447","081@282a1-286a6","470"],
["448","081@286b1-295a3","471"],
["449","081@295a4-309a6","472"],
["450","082@001b1-035b7","473"],
["451","082@036a1-058b3","474"],
["452","082@058b3-103a3","475"],
["453","082@103a3-331a5","476"],
["454","083@001b1-003b2","477"],
["455","083@003b2-008a4","478"],
["456","083@008a4-012a5","479"],
["457","083@012a6-015a4","480"],
["458","083@015a5-030a7","481"],
["459","083@030b1-036b3","482"],
["460a","083@036b4-039b6","483"],
["460b","083@039b6-039b7","484"],
["461","083@040a1-065b6","485"],
["462","083@065b6-068a1","486"],
["463","083@068a1-069a7","487"],
["464","083@069a7-090b4","488"],
["465","083@090b4-093b7","489"],
["466","083@094a1-134a7","490"],
["467","083@134b1-151b4","491"],
["468","083@151b4-164a1","492"],
["469","083@164a1-167b5","493"],
["470","083@167b5-173b3","494"],
["471","083@173b3-174a2","495"],
["472","083@174a2-174b7","496"],
["473","083@175a1-185b7","497"],
["474","083@186a1-214b7","498"],
["475","083@215a1-244b7","500"],
["476","083@245a1-247b4","501"],
["477","083@247b4-303a7","502"],
["478","083@303b1-336a3","503"],
["479","084@001b1-142a7","504"],
["480","084@142b1-274a5","505"],
["482","085@010a1-058a7","507"],
["483","085@058b1-096a3","508"],
["484","085@096a3-096a7","509"],
["485","085@096b1-146a7","510"],
["486","085@146b1-150a7","511"],
["487","085@150b1-173a4","512"],
["488","085@173a4-265b7","513"],
["489","085@266a1-272a7","514"],
["490","086@001b1-082a7","515"],
["491","086@082b1-083a7","516"],
["492","086@083b1-119b5","517"],
["493","086@119b5-151b1","518"],
["494","086@151b2-260a7","519"],
["495","086@261a1-322a7","520"],
["496","087@001b1-156b7","521"],
["497","087@157a1-158a6","522"],
["498","087@158a6-167a3","523"],
["499","087@167a3-172a7","524"],
["500","087@172b1-176b7","525"],
["501","087@177a1-181a2","526"],
["502","087@181a2-247a7","527"],
["503","087@248a1-273b7","528"],
["504","087@274a1-283b7","529"],
["505a","087@284a1-286a6","530"],
["505b","087@286a6-286a7","531"],
["506","087@286b1-309a6","532"],
["507","088@001b1-007b3","533"],
["508","088@007b3-024b6","534"],
["509","088@024b6-025b1","535"],
["510","088@025b1-035b3","536"],
["511","088@035b4-039a1","537"],
["512","088@039a1-042b7","538"],
["513","088@043a1-044b1","539"],
["514","088@044b2-046b6","540"],
["515","088@046b6-048a6","541"],
["516","088@048a6-050b2","542"],
["517","088@050b2-054a5","543"],
["518","088@054a5-056a2","544"],
["519","088@056a2-058a6","545"],
["520","088@058a7-059a4","546"],
["521","088@059a4-059a7","547"],
["522","088@059a7-060b4","548"],
["523","088@060b4-062a1","549"],
["524","088@062a1-062a6","550"],
["525","088@062a6-071a1","551"],
["526","088@071a1-071b4","552"],
["527","088@071b4-085a7","553"],
["528","088@085b1-090b3","554"],
["529","088@090b3-092b6","555"],
["530","088@092b6-094a7","556"],
["531","088@094b1-095b3","557"],
["532","088@095b4-099b3","558"],
["533","088@099b3-099b4","559"],
["534","088@099b4-099b7","560"],
["535","088@099b7-100a2","561"],
["536","088@100a2-100a3","562"],
["537","088@100a3-100a5","563"],
["538","088@100a5-100b3","564"],
["539a","088@100b3-100b6","565"],
["539b","088@100b6-100b7","566"],
["539c","088@100b7-101a5","567"],
["540","088@101a5-101b3","568"],
["541","088@101b3-102a3","569"],
["542","088@102a3-104b7","570"],
["543","088@105a1-351a6","571"],
["544","089@001b1-013a6","572"],
["545","089@013a6-013b4","573"],
["546","089@013b5-014a5","574"],
["547","089@014a5-014b1","575"],
["548","089@014b1-014b2","576"],
["549","089@014b3-014b7","577"],
["550","089@014b7-015a4","578"],
["551","089@015a4-015b6","579"],
["552","089@015b6-016a4","580"],
["553","089@016a4-017b4","581"],
["554","089@017b4-018b7","582"],
["555","089@019a1-151a7","583"],
["556","089@151b1-273a7","584"],
["557","090@001b1-062a7","585"],
["558","090@063a1-087b1","586"],
["560","090@117a5-117b4","588"],
["561","090@117b4-138b5","589"],
["562","090@138b6-150b1","590"],
["563","090@150b2-156a7","591"],
["564","090@157a1-158b1","592"],
["565","090@158b2-165b5","593"],
["566","090@165b5-186a3","594"],
["567","090@186a3-191b3","595"],
["568","090@191b4-195a5","596"],
["569","090@195a6-196b4","597"],
["570","090@196b4-198a6","598"],
["571","090@198a6-199a3","599"],
["572","090@199a4-200a2","600"],
["573","090@200a2-200a7","601"],
["574","090@200a7-202a2","602"],
["575","090@202a3-202b5","603"],
["576","090@202b5-203a1","604"],
["577","090@203a1-203a3","605"],
["578","090@203a3-203a5","606"],
["579","090@203a5-203b1","607"],
["580","090@203b1-203b5","608"],
["581","090@203b5-203b6","609"],
["582","090@203b6-204a1","610"],
["583","090@204a1-204a3","611"],
["584","090@204a3-204a4","612"],
["585","090@204a5-204a6","613"],
["586","090@204a6-204b1","614"],
["588","090@204b1-204b3","616"],
["589","090@204b3-204b7","617"],
["590","090@205a1-212b6","618"],
["591","090@212b7-219a7","619"],
["592","090@219a7-224b2","620"],
["593","090@224b2-229b7","621"],
["594","090@230a1-237b4","622"],
["595","090@237b4-242a6","623"],
["596","090@242a6-243b1","624"],
["597","090@243b1-248a3","625"],
["598","090@248a3-250a5","626"],
["599","090@250a5-259b7","627"],
["600","090@260a1-260a3","628"],
["601","090@260a3-266b4","629"],
["602","090@266b4-267a3","630"],
["603","090@267a3-269a3","631"],
["604","090@269a3-287a7","632"],
["604","091@001b1-035b7","632"],
["605","091@036a1-037a2","633"],
["606","091@037a2-039a4","634"],
["607","091@039a5-040b6","635"],
["608","091@040b7-041b5","636"],
["609","091@041b6-043a2","637"],
["610","091@043a3-045a2","638"],
["611","091@045a3-045a7","639"],
["613","091@046b5-047a7","641"],
["614","091@047b1-052a5","642"],
["615","091@052a5-052b5","643"],
["616","091@052b6-056a7","644"],
["617","091@056a7-058b3","645"],
["618","091@058b3-059a6","646"],
["619","091@059a6-060b4","647"],
["620","091@060b4-061a1","648"],
["621","091@061a2-061b7","649"],
["622","091@062a1-062a7","650"],
["623","091@062b1-062b2","651"],
["624","091@062b2-062b3","652"],
["625","091@062b3-063a3","653"],
["626","091@063a4-063a4","654"],
["627","091@063a4-063a6","655"],
["628","091@063a6-067a2","656"],
["629","091@067a2-067b3","657"],
["630","091@067b4-068a2","658"],
["631","091@068a3-080b7","659"],
["632","091@081a1-102b7","660"],
["633","091@103a1-105a2","661"],
["634","091@105a3-107a7","662"],
["635","091@107b1-109a5","663"],
["636","091@109a5-112a4","664"],
["637","091@112a4-116a2","665"],
["638","091@116a2-118b5","666"],
["639","091@118b5-122a1","667"],
["640","091@122a2-124a4","668"],
["641","091@124a5-126a5","669"],
["642","091@126a6-127b2","670"],
["643","091@127b2-128a3","671"],
["644","091@128a3-129a2","672"],
["645","091@129a3-129b7","673"],
["646","091@130a1-132b2","674"],
["647","091@132b2-134a5","675"],
["648","091@134a6-136a7","676"],
["649","091@136a7-136b4","677"],
["650","091@136b4-136b7","678"],
["651","091@136b7-137a2","679"],
["652","091@137a2-137a5","680"],
["653","091@137a5-146a1","682"],
["654","091@146a1-149a2","683"],
["655","091@149a2-149b1","684"],
["656","091@149b2-162b7","685"],
["657","091@163a1-175b2","686"],
["658","091@175b3-180a4","687"],
["659","091@180a4-180b4","688"],
["660","091@180b5-183b4","689"],
["661","091@183b5-186a5","690"],
["662","091@186a5-190a3","692"],
["663","091@190a3-191a2","693"],
["664","091@191a2-192b4","694"],
["665","091@192b4-193a6","695"],
["666","091@193a7-199a5","696"],
["667","091@199a6-201b3","697"],
["668","091@201b3-202a3","698"],
["669","091@202a3-202a7","699"],
["670","091@202b1-202b6","700"],
["671","091@202b6-209b5","701"],
["672","091@209b5-211a6","702"],
["673a","091@211a6-211b1","703"],
["673b","091@211b1-211b2","704"],
["674","091@211b2-216a7","705"],
["675","091@216a7-220b5","706"],
["676","091@220b5-222b1","707"],
["677","091@222b1-222b6","708"],
["678","091@222b6-223a1","709"],
["679","091@223a1-223a5","710"],
["680","091@223a5-223a7","711"],
["681","091@224a1-278a7","712"],
["682","091@278b1-284a7","713"],
["683","091@284b1-287a5","714"],
["684","091@287b1-290a5","715"],
["685","091@290a5-291a2","716"],
["686","092@001b1-316a6","717"],
["686","093@001b1-057b7","717"],
["687","093@058a1-059b3","718"],
["688","093@059b3-062a3","719"],
["689","093@062a3-066a1","720"],
["690","093@066a1-094a7","721"],
["691","093@094b1-129b6","722"],
["692","093@129b7-137a7","723"],
["693","093@137b1-139b1","724"],
["694","093@139b1-147b3","725"],
["695","093@147b3-147b3","726"],
["696","093@147b3-148a2","727"],
["697","093@148a3-149a7","728"],
["698","093@149b1-150a5","729"],
["699","093@150a5-151b1","730"],
["700","093@151b1-157b2","731"],
["701","093@157b2-164b3","732"],
["702","093@164b4-165b5","733"],
["703","093@165b5-171a5","734"],
["704","093@171a5-171b1","735"],
["707","093@175a1-176b1","738"],
["708","093@176b1-177b6","739"],
["709","093@177b6-178a1","740"],
["710","093@178a1-178a7","741"],
["711","093@178a7-178b2","742"],
["712","093@178b2-178b4","743"],
["713","093@178b4-178b6","744"],
["714","093@178b6-179a2","745"],
["715","093@179a2-179a5","746"],
["716","093@179a5-179a7","747"],
["717","093@179b1-179b2","748"],
["718","093@179b2-180a1","749"],
["719","093@180a2-180a4","750"],
["720","093@180a4-180a7","751"],
["721","093@180b1-199b7","752"],
["722","093@200a1-201b3","753"],
["723","093@201b3-204a7","754"],
["724","093@205a1-311a7","755"],
["724","094@001b1-200a7","755"],
["725","094@200b1-202a1","756"],
["726","094@202a1-217a2","757"],
["727","094@217a2-219a6","758"],
["728","094@219a6-222a6","759"],
["729","094@222a6-222a7","760"],
["730","094@222a7-222b5","761"],
["731","094@222b5-224b1","762"],
["732","094@224b1-225a3","763"],
["733","094@225a3-225b6","764"],
["734","094@225b7-227a7","765"],
["735","094@227a7-228a7","766"],
["736","094@228b1-229a3","767"],
["737","094@229a4-229b4","768"],
["738","094@229b4-230a7","769"],
["739","094@230a7-234b2","770"],
["740","094@234b2-235a3","771"],
["741","094@235a4-235b5","772"],
["742","094@235b5-236a3","773"],
["743","094@236a3-236b7","774"],
["744","094@237a1-266a7","775"],
["745","094@266b1-268a7","776"],
["746","095@001b1-237b7","777"],
["747","095@238a1-263a7","778"],
["749","095@264b1-265b3","780"],
["750","095@265b3-266b7","781"],
["751","095@267a1-295a7","782"],
["752","096@001b1-004b4","783"],
["753","096@004b4-005a7","784"],
["754","096@005a7-006a5","785"],
["755","096@006a6-007b4","786"],
["756","096@007b4-008a7","787"],
["757","096@008a7-019a5","788"],
["758","096@019a5-027b4","789"],
["759","096@027b4-050a3","790"],
["760","096@050a4-052a1","791"],
["761","096@052a2-053a6","792"],
["762","096@053a6-054a3","793"],
["763","096@054a3-055b7","794"],
["764","096@056a1-056b2","795"],
["765","096@056b2-069a6","796"],
["766","096@069a7-081b7","797a"],
["767","096@081b7-088b7","797b"],
["768","096@089a1-089b6","798"],
["769","096@089b7-090a6","799"],
["770","096@090a6-104a3","800"],
["771","096@104a3-105b7","801"],
["772","096@105b7-111b7","802"],
["773","096@112a1-112b4","803"],
["774","096@112b4-112b5","804"],
["775","096@112b5-112b7","805"],
["776","096@112b7-113a3","806"],
["777","096@113a3-113b1","807"],
["778","096@113b1-113b3","808"],
["779","096@113b3-113b5","809"],
["780","096@113b5-113b7","810"],
["781","096@114a1-114a1","811"],
["782","096@114a2-114a5","812"],
["783","096@114a5-114a6","813"],
["784","096@114a7-114b1","814"],
["785","096@114b1-114b3","815"],
["786","096@114b3-114b5","816"],
["787","096@114b5-114b7","817"],
["788","096@114b7-115a1","818"],
["789","096@115a1-115a4","819"],
["790","096@115a4-115a5","820"],
["791","096@115a5-115a7","821"],
["792","096@115b1-115b2","822"],
["793","096@115b3-115b5","823"],
["794","096@115b5-116a2","824"],
["795","096@116a2-116a4","825"],
["796","096@116a5-116a6","826"],
["799","096@116b3-116b4","829"],
["800","096@116b4-116b5","830"],
["801","096@116b6-116b7","831"],
["802","096@116b7-117a1","832"],
["803","096@117a2-117a4","833"],
["804","096@117a4-117a7","834"],
["805","096@118a1-140b7","835"],
["806","096@141a1-167b7","836"],
["807","096@168a1-222b7","837"],
["808","096@223a1-225b7","838"],
["809","096@226a1-229a3","839"],
["810","096@229a3-250b3","840"],
["811","096@250b4-251a5","841"],
["812","096@251a5-253a2","842"],
["813","096@253a2-254a6","843"],
["814","096@254a6-254b4","844"],
["815","096@254b4-256a6","845"],
["816","096@256a7-257a5","846"],
["817","096@257a5-258b7","847"],
["818","096@258b7-259b1","848"],
["819","096@259b1-260a5","849"],
["820","096@260a5-260b7","850"],
["821","096@261a1-261b1","851"],
["822","096@261b1-261b7","852"],
["823","096@261b7-262a3","853"],
["824","096@262a3-262a7","854"],
["825","096@262a7-262b3","855"],
["826","096@262b3-263b6","856"],
["827","096@263b7-264a6","857"],
["828","097@001b1-086a7","1118"],
["829","097@086b1-290a7","1119"],
["830","097@290b1-358a7","1120"],
["831","098@001b1-110a7","1121"],
["832","098@110b1-132a7","1122"],
["833","098@132b1-198a7","1123"],
["834","098@198b1-298b7","1124"],
["835","098@299a1-311a7","1125"],
["836","099@001b1-034b3","1126"],
["837","099@034b3-060a4","1127"],
["838","099@060a5-077a5","1128"],
["839","099@077a6-129b7","1129"],
["840","099@130a1-202a3","1130"],
["841a","099@202a3-203a5","1131"],
["841b","099@203a5-207b6","1132"],
["841c","099@207b6-208b7","1133"],
["841d","099@209a1-212a6","1134"],
["841e","099@212a7-213b5","1135"],
["841f","099@213b5-216a4","1136"],
["841g","099@216a4-220a3","1137"],
["841h","099@220a3-223b6","1138"],
["842","099@223b6-253a5","1139"],
["843","099@253a5-267b7","1140"],
["844","099@268a1-287a7","1141"],
["845","100@001b1-469a7","1116"],
["846","101@001b1-003b6","858"],
["847","101@003b6-054b7","859"],
["878","101@011a6-114a2","890"],
["848","101@055a1-057a7","860"],
["849","101@057b1-062a6","861"],
["850","101@062a6-064a2","862"],
["851","101@064a3-064a7","863"],
["852","101@065a1-068b7","864"],
["853","101@069a1-072b1","865"],
["854","101@072b1-074b5","866"],
["855","101@074b6-076a5","867"],
["856","101@076a6-077b7","868"],
["857","101@077b7-079b5","869"],
["858","101@079b5-085a7","870"],
["859","101@085b1-087a1","871"],
["860","101@087a1-087a2","872"],
["861","101@087a2-087a6","873"],
["862","101@087a6-087a7","874"],
["863","101@087b1-087b4","875"],
["864","101@087b4-088a2","876"],
["865","101@088a2-088a5","877"],
["866","101@088a5-088b4","878"],
["867","101@088b4-088b6","879"],
["868","101@088b6-089a2","880"],
["869","101@089a2-089a3","881"],
["870","101@089a3-089a4","882"],
["871","101@089a4-092b7","883"],
["872","101@092b7-095b7","884"],
["873","101@096a1-100b5","885"],
["874","101@100b5-103a2","886"],
["875","101@103a2-104b5","887"],
["876","101@104b6-107b3","888"],
["877","101@107b3-111a6","889"],
["879","101@114a3-117b1","891"],
["880","101@117b2-119b6","892"],
["881","101@119b7-122a2","893"],
["882","101@122a2-123a2","894"],
["883","101@123a2-129a3","895"],
["884","101@129a3-135b3","896"],
["885","101@135b3-159b1","897"],
["886","101@159b1-161b3","898"],
["887","101@161b3-163a2","899"],
["888","101@163a2-165b1","900"],
["890","101@165b4-166a4","902"],
["891","101@166a5-166b4","903"],
["892","101@166b4-167a2","904"],
["893","101@167a3-167b3","905"],
["894","101@167b3-167b4","906"],
["895","101@167b5-168a2","907"],
["896","101@168a2-168a6","908"],
["897","101@168a6-205a5","909"],
["898","101@205a5-213a6","910"],
["899","101@213a6-215b1","911"],
["900","101@215b1-217b2","912"],
["901","101@217b2-223b7","913"],
["902","101@223b7-226b3","914"],
["903","101@226b4-228b3","915"],
["904","101@228b3-230b7","916"],
["905","101@231a1-232a7","917"],
["906","101@232a7-233a5","918"],
["907","101@233a5-239a3","919"],
["908","101@239a3-240a1","920"],
["909","101@240a2-241b4","921"],
["910","101@241b4-242a4","922"],
["911","101@242a4-242a7","923"],
["912","101@242a7-242b3","924"],
["913","101@242b3-244b5","925"],
["914","101@244b6-254b7","926"],
["915","101@255a1-260b1","927"],
["916","101@260b1-261a4","928"],
["917","101@261a5-262a2","929"],
["918","101@262a2-262a7","930"],
["919","101@262b1-264a3","931"],
["920","101@264a3-264b7","932"],
["921","101@265a1-265a7","933"],
["922","101@265b1-267a7","934"],
["923","101@267a7-268b6","935"],
["924","101@268b7-271a4","936"],
["925","101@271a5-272b4","937"],
["926","101@272b4-273b4","938"],
["927","101@273b4-276a1","939"],
["928","101@276a1-277b4","940"],
["929","101@277b4-279a7","941"],
["930","101@279a7-279b7","942"],
["931","101@279b7-280b2","943"],
["932","101@280b2-280b5","944"],
["933","101@280b6-281a2","945"],
["934","101@281a2-281a4","946"],
["935","101@281a4-281a7","947"],
["936","101@281a7-281b6","948"],
["937","101@281b6-281b7","949"],
["938","101@282a1-282a4","950"],
["939","101@282a4-282a6","951"],
["940","101@282a6-282a7","952"],
["941","101@282a7-282b2","953"],
["942","101@282b2-282b3","954"],
["943","101@282b4-282b4","955"],
["944","101@282b5-282b6","956"],
["945","101@282b6-283a5","957"],
["946","102@001b1-030b5","958"],
["947","102@030b5-041a7","959"],
["948","102@041b1-042b1","960"],
["949","102@042b1-043b6","961"],
["950","102@043b6-045a1","962"],
["951","102@045a2-045b7","963"],
["952","102@045b7-046a1","964"],
["953","102@046a1-046b6","965"],
["954","102@046b7-049b7","966"],
["955","102@050a1-050b3","967"],
["956","102@050b3-051b4","968"],
["957","102@051b4-053a6","969"],
["960","102@056a5-056b5","972"],
["961","102@056b5-057a7","973"],
["962","102@057a7-057b2","974"],
["963","102@057b2-058a7","975"],
["964","102@058b1-079b7","976"],
["965","102@080a1-081b5","977"],
["966","102@081b5-083b1","978"],
["967","102@083b2-084a4","979"],
["968","102@084a4-085b3","980"],
["969","102@085b3-086a6","981"],
["970","102@086a6-086b7","982"],
["971","102@087a1-087a7","983"],
["972","102@087a7-089a4","984"],
["973","102@089a4-090a3","985"],
["974","102@090a3-092a7","986"],
["975","102@092a7-095a7","987"],
["976","102@095a7-096a1","988"],
["977","102@096a1-096a7","989"],
["978","102@096a7-096b3","990"],
["979","102@096b3-099a2","991"],
["980","102@099a2-099b7","992"],
["981","102@099b7-100a3","993"],
["982","102@100a3-110b6","994"],
["983","102@110b7-119b7","995"],
["984","102@120a1-124b7","996"],
["985","102@124b7-133b2","997"],
["986","102@133b3-138b2","998"],
["987","102@138b2-141b7","999"],
["988","102@142a1-143a2","1000"],
["989","102@143a3-143b6","1001"],
["990","102@143b6-144b4","1002"],
["991","102@144b4-146b2","1003"],
["992","102@146b2-147a4","1004"],
["993","102@147a4-148a3","1005"],
["994","102@148a3-149a4","1006"],
["995","102@149a4-149b5","1007"],
["996","102@149b6-150a4","1008"],
["997","102@150a4-153a7","1009"],
["999","102@156a3-157b3","1011"],
["1000","102@157b3-160a2","1012"],
["1001","102@160a2-160a4","1013"],
["1002","102@160a4-160b2","1014"],
["1003","102@160b3-167a2","1015"],
["1004","102@167a2-171a6","1016"],
["1005","102@171a7-172a2","1017"],
["1006","102@172a2-172b4","1018"],
["1007","102@172b4-176b1","1019"],
["1008","102@176b1-177b7","1020"],
["1009","102@178a1-179a1","1021"],
["1010","102@179a1-179a6","1022"],
["1011","102@179a7-179b3","1023a"],
["1012","102@179b4-179b5","1023b"],
["1013","102@179b5-179b7","1024"],
["1014","102@180a1-180b2","1025"],
["1015","102@180b2-180b3","1026"],
["1016","102@180b4-181a5","1027"],
["1017","102@181a5-181a7","1028"],
["1018","102@181a7-181b5","1029"],
["1019","102@181b5-181b6","1030"],
["1020","102@181b7-183a1","1031"],
["1021","102@183a1-183a2","1032"],
["1022","102@183a3-183a4","1033"],
["1023","102@183a5-183a6","1034"],
["1024","102@183a7-183b7","1035"],
["1025","102@184a1-184a2","1036"],
["1026","102@184a2-184a3","1037"],
["1027","102@184a3-184a6","1038"],
["1028","102@184a6-184b1","1039"],
["1029","102@184b1-184b3","1040"],
["1030","102@184b3-184b7","1041"],
["1031","102@185a1-185a3","1042"],
["1032","102@185a3-185a4","1043"],
["1033","102@185a4-185a6","1044"],
["1034","102@185a6-185b1","1045"],
["1035","102@185b1-185b2","1046"],
["1036","102@185b2-185b7","1047"],
["1037","102@185b7-186a7","1048"],
["1038","102@186a7-186b2","1049"],
["1039","102@186b3-186b6","1050"],
["1040","102@186b6-187a1","1051"],
["1041","102@187a1-187a3","1052"],
["1042","102@187a4-187a6","1053"],
["1043","102@187a6-187b1","1054"],
["1044","102@187b2-187b4","1055"],
["1045","102@187b4-187b7","1056"],
["1046","102@187b7-188a3","1057"],
["1047","102@188a4-188a6","1058"],
["1048","102@188a7-188b1","1059"],
["1049","102@188b1-188b4","1060"],
["1050","102@188b4-188b6","1061"],
["1051","102@188b7-189a2","1062"],
["1052","102@189a2-189a4","1063"],
["1053","102@189a4-189a6","1064"],
["1054","102@189a6-189a7","1065"],
["1055","102@189b1-189b2","1066"],
["1056","102@189b2-189b3","1067"],
["1057","102@189b3-189b5","1068"],
["1058","102@189b5-189b6","1069"],
["1059","102@189b6-190a1","1070"],
["1060a","102@190a1-190a2","1071"],
["1060b","102@190a3-190a4","1072"],
["1061","102@190a4-205b4","1073"],
["1062","102@205b5-215b7","1074"],
["1063","102@216a1-229b2","1075"],
["1064","102@229b3-234b1","1076"],
["1065","102@234b1-235a1","1077"],
["1066","102@235a2-235b4","1078"],
["1067","102@235b4-239a1","1079"],
["1068","102@239a1-239b1","1080a"],
["1069","102@239b1-239b1","1080b"],
["1070","102@239b1-239b2","1080c"],
["1071","102@239b2-239b2","1080d"],
["1072","102@239b2-239b3","1080e"],
["1073","102@239b3-239b4","1080f"],
["1074","102@239b4-239b5","1081"],
["1075","102@239b5-239b6","1082"],
["1076","102@239b6-240a3","1083"],
["1077","102@240a3-240a7","1084"],
["1078","102@240b1-240b5","1085"],
["1079","102@240b5-242b2","1086"],
["1080","102@242b3-245a4","1087"],
["1081","102@245a4-247a7","1088"],
["1082","102@247a7-247b3","1089"],
["1083","102@247b3-251a6","1090"],
["1084","102@251a7-252a3","1091"],
["1085","102@252a3-252b3","1092"],
["1086","102@252b3-252b7","1093"],
["1087","102@253a1-253a6","1094"],
["1088","102@253a6-254b7","1095"],
["1089","102@254b7-255a2","1096"],
["1090","102@255a2-255b5","1097"],
["1091","102@255b6-256a2","1098"],
["1092","102@256a3-256b7","1099"],
["1093","102@256b7-260b7","1100"],
["1094","102@261a1-262b5","1101"],
["1095","102@262b5-266a3","1102"],
["1096","102@266a4-267a5","1103"],
["1097","102@267a5-268b1","1104"],
["1098","102@268b1-269b5","1105"],
["1099","102@269b5-270a3","1106"],
["1100","102@270a4-270b7","1107"],
["1101","102@271a1-272b3","1108"],
["1102","102@272b4-273a5","1109"],
["1103","102@273a5-274b3","1110"],
["1104","102@274b3-275a4","1111"],
["1105","102@275a5-275b3","1112"],
["1106","102@275b4-275b7","1113"],
["1107","102@275b7-278a2","1114"],
["1108","102@278a2-278a7","1115"],
["4568","103@001b1-171a4","1143"]];
dPedurma.rcode="D";
module.exports=dPedurma;
});
require.register("pedurmacat-dataset/cPedurma.js", function(exports, require, module){
var cPedurma=[["13","002@008b4-050b8","444"],
["14","002@051a1-057b7","445"],
["15","002@057b7-096a2","393"],
["16","002@096a2-233a5","394"],
["17","002@233a5-370b5","395"],
["18","002@370b5-384a8","396"],
["20","003@150b1-206a8","398"],
["21","003@206a8-242b6","399"],
["22","003@242b6-252a2","402"],
["23","003@252a2-264b2","400"],
["24","003@264b2-273b8","401"],
["25","003@273b8-274b3","404"],
["26","003@274b3-371a3","405a"],
["27","003@371a3-400a6","405b"],
["28","004@001b1-004b5","406"],
["29","004@004b5-013b3","407"],
["30","004@013b3-017b1","408"],
["31","004@017b1-020b1","409"],
["32","004@020b1-022a3","410"],
["33","004@022a3-027b5","411"],
["34","004@027b5-033b1","412"],
["35","004@033b1-036a4","413"],
["36","004@036a4-039b2","414"],
["37","004@039b2-041a3","415"],
["38","004@041a3-042b6","416"],
["39","004@042b6-044b1","417"],
["40","004@044b1-045b8","418"],
["41","004@045b8-049a7","419"],
["42","004@049a7-051a3","420"],
["43","004@051a3-052a6","421"],
["44","004@052a6-054a7","422"],
["45","004@054a7-056a6","423"],
["46","004@056a7-058b3","424"],
["47","004@058b3-060b7","425"],
["48","004@060b8-062b6","426"],
["49","004@062b6-063b8","427"],
["51","004@067b1-069a6","429"],
["52","004@069a6-070b7","431"],
["53","004@070b7-071b6","432"],
["54","004@071b6-073a7","430"],
["55","004@073a7-075a8","434"],
["56","004@075a8-077b2","433"],
["57","004@077b2-083a7","436"],
["58","004@083a7-085b6","437"],
["59","004@085b6-088a2","438"],
["60","004@088a2-099b3","403a"],
["61","004@099b3-101a8","403b"],
["62","004@101a8-136a6","439"],
["63","004@136a6-166a6","446"],
["64","004@166a6-170b3","447"],
["65","004@170b3-176a1","448"],
["66","004@176a2-181b7","449"],
["67","004@181b7-241a5","450"],
["68","004@241a5-272b6","451"],
["69","004@272b6-322b3","452"],
["70","004@322b3-371a8","453"],
["71","005@001b1-013b3","454"],
["72","005@013b3-015b8","456"],
["73","005@016a1-018b2","455"],
["74","005@018b2-031a3","457"],
["75","005@031a3-033b4","458"],
["76","005@033b4-049a1","459"],
["77","005@049a2-050a6","460"],
["78","005@050a6-052a7","461"],
["79","005@052a8-097b3","462"],
["80","005@097b4-101b2","463"],
["81","005@101b2-168a3","464"],
["82","005@168a3-179a8","466"],
["83","005@179b1-254a8","468"],
["84","005@254b1-312b2","467"],
["85","005@312b2-316b8","470"],
["86","005@316b8-321b2","469"],
["87","005@321b3-346a5","474"],
["88","005@346a6-385a6","473"],
["89","006@001b1-050a5","475"],
["90","006@050a6-304b4","476"],
["91","006@304b4-306b2","477"],
["92","006@306b2-311b2","478"],
["93","006@311b2-316a1","479"],
["94","006@316a2-319a7","480"],
["95","006@319a7-336b8","481"],
["96","006@337a1-344a4","482"],
["97","006@344a4-348a6","483"],
["98","006@348a7-348a8","484"],
["99","007@001b1-031b5","485"],
["100","007@031b5-033a7","487"],
["101","007@033a7-056a6","488"],
["102","007@056a6-058b1","486"],
["103","007@058b1-061b3","489"],
["104","007@061b3-105b6","490"],
["105","007@105b6-126a8","491"],
["106","007@126a8-139a2","497"],
["107","007@139a2-152b6","492"],
["108","007@152b6-159b7","494"],
["109","007@160a1-164a4","493"],
["110","007@164a4-164b4","495"],
["111","007@164b4-199a3","498"],
["112","007@199a3-202a6","501"],
["113","007@202a7-269a4","502"],
["114","008@001b1-168b6","504"],
["115","008@168b6-314a4","505"],
["116","008@314a4-323a7","506"],
["117","009@001b1-055a8","507"],
["118","009@055a8-099b6","508"],
["119","009@099b6-100a5","509"],
["120","009@100a5-159a7","510"],
["121","009@159a7-163b5","511"],
["122","009@163b6-190b2","512"],
["123","009@190b2-300a7","513"],
["124","009@300a8-309a7","514"],
["125","009@309a7-353a8","517"],
["126","010@001b1-100b3","515"],
["127","010@100b4-101b7","516"],
["128","010@101b7-141b8","518"],
["129","010@142a1-269b3","519"],
["130","010@269b3-342b5","520"],
["131","010@342b5-353a1","523"],
["132","010@353a1-359a6","524"],
["133","011@001b1-184b3","521"],
["134","011@184b3-190a2","525"],
["135","011@190a2-191a6","779"],
["136","011@191a6-196a3","526"],
["141","011@318a6-344a8","532"],
["142","012@001b1-003a3","535"],
["145","012@001b3-016a7","656"],
["143","012@003a3-003b5","630"],
["144","012@003b5-011b3","533"],
["146","012@016a7-016b1","559"],
["147","012@016b1-016b6","560"],
["148","012@016b6-017a2","680"],
["150","012@018a3-018a7","711"],
["151","012@018a7-020a2","541"],
["152","012@020a2-022b5","540"],
["153","012@022b5-024b2","539"],
["154","012@024b2-028a7","537"],
["155","012@028a8-032b8","288"],
["156","012@032b8-033a6","708"],
["157","012@033a6-033b1","709"],
["158","012@033b1-033b3","561"],
["159","012@033b3-033b5","562"],
["160","012@033b5-033b6","563"],
["161","012@033b6-037b4","543"],
["162","012@037b4-040b7","570"],
["163","012@040b7-041b7","672"],
["164","012@041b7-043b6","556"],
["165","012@043b6-045a8","557"],
["166","012@045a8-050a4","558"],
["167","012@050a4-335a3","571"],
["168","013@001b1-016a5","572"],
["169","013@016a6-017a2","579"],
["170","013@017a2-017b1","580"],
["171","013@017b1-017b8","573"],
["172","013@017b8-018b2","574"],
["173","013@018b2-018b6","575"],
["174","013@018b6-018b8","576"],
["175","013@018b8-019a6","577"],
["176","013@019a6-019b3","578"],
["177","013@019b4-021b5","581"],
["178","013@021b5-023b1","582"],
["179","013@023b1-182a1","583"],
["180","013@182a1-312a7","584"],
["181","014@001b1-069b7","585"],
["182","014@069b7-098a3","586"],
["183","014@098a3-132a7","587"],
["184","014@132a7-155a6","589"],
["185","014@155a6-168a3","590"],
["186","014@168a3-175b5","591"],
["187","014@175b5-177a1","592"],
["188","014@177a1-186b4","593"],
["189","014@186b4-211b4","594"],
["190","014@211b4-212b7","766"],
["191","014@212b7-213b4","767"],
["192","014@213b4-222b2","789"],
["193","014@222b2-223a6","641"],
["194","014@223a6-224a5","599"],
["195","014@224a5-226a2","598"],
["196","014@226a2-226b4","763"],
["197","014@226b4-232b8","595"],
["198","014@233a1-237b1","596"],
["199","014@237b1-238a1","588"],
["200","014@238a1-244a7","554"],
["201","014@244a7-246a1","522"],
["202","014@246a1-251a4","623"],
["203","014@251a4-256b1","625"],
["205","014@265b1-268a3","626"],
["206","014@268a3-269b1","624"],
["207","014@269b1-278b6","618"],
["208","014@278b6-286a6","619"],
["209","014@286a6-292a7","620"],
["210","014@292a7-298a4","621"],
["211","014@298a4-309a4","627"],
["212","014@309a4-309b6","650"],
["213","014@309b6-309b8","651"],
["214","014@309b8-310b2","653"],
["215","014@310b2-310b4","652"],
["216","014@310b4-311a2","648"],
["217","014@311a2-311a3","654"],
["218","014@311a3-312a5","649"],
["219","014@312a5-313a1","657"],
["220","014@313a1-313b3","643"],
["221","014@313b3-314a3","741"],
["222","014@314a3-315b5","548"],
["223","014@315b5-327b8","536"],
["224","014@328a1-335a7","629"],
["225","014@335a7-338a5","545"],
["226","014@338a5-339a6","546"],
["227","014@339a6-339b2","547"],
["228","014@339b3-339b4","804"],
["229","014@339b4-339b7","628"],
["230","014@339b7-340a1","531"],
["231","014@340a1-340a3","805"],
["232","014@340a3-340a7","806"],
["233","014@340a8-340b5","807"],
["234","014@340b5-340b7","808"],
["235","014@340b8-341a2","679"],
["236","014@341a2-341a5","751"],
["237","014@341a5-341b6","749"],
["238","014@341b6-342a1","750"],
["239","014@342a1-342a5","678"],
["240","014@342a5-342a8","742"],
["241","014@342a8-342b3","743"],
["242","014@342b3-342b6","744"],
["243","014@342b6-343a2","745"],
["244","014@343a2-343a5","746"],
["246","014@343b1-343b3","748"],
["247","014@343b3-343b6","809"],
["248","014@343b6-344a1","810"],
["249","014@344a1-344a2","811"],
["250","014@344a2-344b1","567"],
["251","014@344b1-344b5","812"],
["252","014@344b5-344b6","813"],
["253","014@344b6-344b8","814"],
["254","014@344b8-345a3","815"],
["255","014@345a3-345a5","816"],
["256","014@345a5-345a7","817"],
["257","014@345a7-345a8","818"],
["258","014@345a8-345b3","819"],
["259","014@345b3-345b5","820"],
["260","014@345b5-345b7","821"],
["261","014@345b7-346a2","822"],
["262","014@346a2-346a4","823"],
["263","014@346a4-346b1","824"],
["264","014@346b1-346b3","825"],
["265","014@346b3-346b5","826"],
["266","014@346b5-346b7","827"],
["267","014@346b7-347a1","828"],
["268","014@347a1-347a2","829"],
["269","014@347a2-347a4","830"],
["270","014@347a4-347a5","831"],
["271","014@347a5-347a7","832"],
["272","014@347a7-347b2","833"],
["275","014@347b5-348a3","773"],
["276","014@348a3-348a6","604"],
["277","014@348a6-348b2","605"],
["278","014@348b2-348b4","606"],
["279","014@348b4-348b8","607"],
["280","014@348b8-349b1","608"],
["281","014@349b1-349b2","609"],
["282","014@349b2-349b6","610"],
["283","014@349b6-350a1","611"],
["284","014@350a1-350a3","612"],
["285","014@350a3-350a6","613"],
["286","014@350a6-350a8","614"],
["287","014@350a8-350b1","615"],
["288","014@350b2-350b3","616"],
["289","014@350b3-351a5","617"],
["290a","015@001b1-002b4","564"],
["290b","015@002b4-002b8","565"],
["291","015@002b8-003a8","710"],
["292","015@003a8-004a2","601"],
["293","015@004a2-004b5","768"],
["294","015@004b5-004b7","655"],
["295","015@004b7-005b4","803"],
["296","015@005b4-065b8","632"],
["297","015@065b8-067b8","602"],
["298","015@067b8-070a2","544"],
["299","015@070a2-071b4","765"],
["300","015@071b4-072a8","646"],
["301","015@072a8-074a3","635"],
["302","015@074a3-075b5","739"],
["303","015@075b5-076a3","550"],
["304","015@076a3-076a6","740"],
["305","015@076a6-077b4","637"],
["306","015@077b4-079a5","597"],
["307","015@079a5-080b5","647"],
["308","015@080b5-081b5","636"],
["309","015@081b6-082a5","658"],
["310","015@082a5-084b2","638"],
["311","015@084b2-086a5","640"],
["312","015@086a5-088a3","549"],
["313","015@088a3-090b4","634"],
["314","015@090b4-096b2","642"],
["315","015@096b2-100a3","683"],
["316","015@100a3-100b1","639"],
["318","015@101a5-101b8","603"],
["319","015@101b8-104a5","661"],
["320","015@104a5-106b6","631"],
["321","015@106b6-109b3","542"],
["322","015@109b3-112b2","555"],
["323","015@112b2-129b5","659"],
["324","015@129b5-156a2","660"],
["325","015@156a2-159a3","662"],
["326","015@159a4-161a4","663"],
["327","015@161a4-164a4","664"],
["328","015@164a5-168a5","665"],
["329","015@168a5-171a2","666"],
["330","015@171a2-174a8","667"],
["331","015@174a8-176b5","668"],
["332","015@176b5-178b7","669"],
["333","015@178b7-180b4","737"],
["334","015@180b4-182a1","670"],
["335","015@182a1-182b1","671"],
["336","015@182b1-184a7","801"],
["337","015@184a8-193b2","682"],
["338","015@193b2-209a2","685"],
["339","015@209a2-223b3","686"],
["340","015@223b3-228b8","687"],
["341","015@228b8-229b2","688"],
["342","015@229b2-236a3","696"],
["343","015@236a3-236b7","695"],
["344","015@236b7-240a6","689"],
["345","015@240a6-243a3","690"],
["346","015@243a3-247b6","692"],
["347","015@247b6-249a2","693"],
["348","015@249a2-251a4","694"],
["349","015@251a4-254a1","697"],
["350","015@254a1-254b2","698"],
["351","015@254b2-255a1","700"],
["352","015@255a2-255a8","699"],
["353","015@255a8-263b5","701"],
["354","015@263b5-265b3","702"],
["355","015@265b3-265b5","703"],
["356","015@265b6-270a8","644"],
["357","015@270a8-270b8","568"],
["358","015@270b8-271a6","677"],
["359","015@271a6-272a7","673"],
["360","015@272a8-274b4","675"],
["361","015@274b4-278a1","674"],
["362","015@278a1-280b6","676"],
["363","015@280b6-281a2","834"],
["365","015@281a7-281a8","704"],
["366","015@281a8-287b4","705"],
["367","015@287b4-293a6","706"],
["368","015@293a6-295b3","707"],
["369","015@295b3-356a8","712"],
["370","016@001b1-297b6","717"],
["371","016@297b6-304a3","713"],
["372","016@304a4-306a4","718"],
["374","016@314a7-354a7","722"],
["376","017@001a8-011b8","727"],
["375","017@001b1-011a8","723"],
["377","017@001b8-012a3","726"],
["378","017@012a3-014b2","724"],
["379","017@014b3-024a2","725"],
["380","017@024a2-032b3","732"],
["381","017@032b4-038b8","731"],
["382","017@038b8-041b4","730"],
["383","017@041b4-043a5","728"],
["384","017@043a5-044a3","764"],
["385","017@044a3-047b6","754"],
["386","017@047b6-049b8","736"],
["387","017@049b8-050b2","799"],
["388","017@050b2-051b2","600"],
["389","017@051b2-053b2","738"],
["390","017@053b2-054b8","733"],
["391","017@055a1-061b8","734"],
["392","017@061b8-062a4","735"],
["393","017@062a4-063a5","729"],
["394","017@063a5-065a3","756"],
["395","017@065a3-083b8","757"],
["396","017@084a1-086a7","758"],
["397","017@086a7-089a8","759"],
["398","017@089a8-089b1","760"],
["399","017@089b2-089b7","761"],
["400","017@089b7-091b4","762"],
["401","017@091b4-092a6","569"],
["402","017@092a6-093a2","769"],
["403","017@093a2-097a6","770"],
["404","017@097a7-098a1","771"],
["405","017@098a1-098b4","772"],
["406","017@098b4-099b4","774"],
["407","017@099b4-364a8","777"],
["408","018@001b1-038a4","775"],
["409","018@038a4-069a2","778"],
["410","018@069a2-070b2","780"],
["411","018@070b2-072a2","781"],
["412","018@072a2-104a3","782"],
["413","018@104a3-107a8","783"],
["414","018@107a8-108a5","784"],
["415","018@108a5-109a4","785"],
["416","018@109a5-132b4","790"],
["417","018@132b4-134b3","791"],
["418","018@134b3-136a1","792"],
["419","018@136a1-136b7","793"],
["420","018@136b7-138b6","794"],
["421","018@138b6-150b6","788"],
["423","018@151a2-152a5","633"],
["424","018@152a5-153b5","786"],
["425","018@153b6-154b3","787"],
["426","018@154b3-155a3","684"],
["427","018@155a3-155b5","795"],
["428","018@155b5-170b2","796"],
["430","018@179b3-180b4","798"],
["431","018@180b4-197a5","800"],
["432","018@197a5-203b2","802"],
["433","018@203b2-231b7","835"],
["434","018@231b8-259b5","836"],
["435","018@259b6-262b7","838"],
["436","018@262b7-324a6","837"],
["437","018@324a6-328a2","839"],
["438","018@328a2-354a5","840"],
["439","018@354a5-354b8","841"],
["440","018@354b8-357a1","842"],
["441","018@357a1-358a8","843"],
["442","018@358a8-358b6","844"],
["443","018@358b6-360b6","845"],
["444","018@360b6-361b7","846"],
["445","018@361b8-363b8","847"],
["446","018@363b8-364b3","848"],
["447","018@364b3-365b1","849"],
["448","018@365b1-366a5","850"],
["449","018@366a5-366b8","851"],
["450","018@366b8-367a8","852"],
["451","018@367a8-367b4","853"],
["452","018@367b4-368a1","854"],
["453","018@368a1-368a5","855"],
["454","018@368a5-369b5","856"],
["455","018@369b5-370a3","857"],
["456","019@001b1-092a7","1118"],
["457","019@092a7-307a2","1119"],
["458","019@307a2-377a4","1120"],
["459","020@001b1-117b2","1121"],
["460","020@117b2-140a5","1122"],
["461","020@140a5-212a5","1123"],
["462","020@212a5-329b3","1124"],
["463","020@329b3-342a8","1125"],
["464","021@001b1-037a1","1126"],
["465","021@037a1-063b5","1127"],
["466","021@063b5-082a4","1128"],
["467","021@082a5-139b6","1129"],
["468","021@139b6-214a2","1130"],
["469a","021@214a2-215a6","1131"],
["469b","021@215a6-220a3","1132"],
["469c","021@220a3-221a6","1133"],
["469d","021@221a6-224b5","1134"],
["469e","021@224b5-226a4","1135"],
["469f","021@226a4-228b3","1136"],
["469g","021@228b3-232b1","1137"],
["469h","021@232b1-236a8","1138"],
["471","021@236a8-268a6","1139"],
["472","021@268a6-284b8","1140"],
["473","021@285a1-305a5","1141"],
["474","022@001b1-312a5","1142"],
["475","023@001b1-004a7","858"],
["477","023@004a7-058b3","163"],
["477","023@004a7-058b3","859"],
["505","023@011b3-113b4","887"],
["479","023@060a4-066a2","861"],
["480","023@066a2-068a4","862"],
["481","023@068a4-068b2","863"],
["482","023@068b2-073a6","538"],
["483","023@073a6-077a6","865"],
["484","023@077a6-080a1","866"],
["485","023@080a1-081b4","867"],
["486","023@081b4-083b1","868"],
["487","023@083b1-085b2","869"],
["488","023@085b2-091b5","870"],
["489","023@091b5-093a8","871"],
["490","023@093a8-093b2","872"],
["491","023@093b2-093b7","873"],
["492","023@093b7-093b8","874"],
["493","023@093b8-094a5","875"],
["494","023@094a5-094b3","876"],
["495","023@094b3-094b8","877"],
["496","023@094b8-095a7","878"],
["497","023@095a7-095b2","879"],
["498","023@095b2-095b5","880"],
["499","023@095b5-095b7","881"],
["500","023@095b7-096a1","882"],
["501","023@096a1-100a6","883"],
["502","023@100a6-103b6","884"],
["503","023@103b6-108b6","885"],
["504","023@108b6-111b2","886"],
["506","023@113b4-117a5","888"],
["507","023@117a5-121b6","889"],
["508","023@121b6-124b2","890"],
["509","023@124b2-127b7","891"],
["510","023@127b7-130a5","892"],
["511","023@130a5-132a8","893"],
["512","023@132a8-133a8","894"],
["513","023@133a8-139b5","895"],
["514","023@139b5-146a8","896"],
["515","023@146a8-171b2","897"],
["516","023@171b2-173b6","898"],
["517","023@173b6-175a6","899"],
["518","023@175a6-177b5","900"],
["519","023@177b5-177b8","901"],
["520","023@177b8-178b2","902"],
["521","023@178b2-179a2","903"],
["522","023@179a2-179b1","904"],
["523","023@179b1-180a3","905"],
["524","023@180a3-180a5","906"],
["525","023@180a5-180b2","907"],
["526","023@180b2-180b7","908"],
["527","023@180b7-220b8","909"],
["528","023@220b8-229b2","910"],
["529","023@229b2-231b5","911"],
["530","023@231b5-233b5","912"],
["531","023@233b5-240b2","913"],
["532","023@240b3-243b5","914"],
["533","023@243b5-246a2","915"],
["534","023@246a2-248b8","916"],
["535","023@248b8-250b3","917"],
["536","023@250b3-251b3","918"],
["537","023@251b3-257b5","919"],
["538","023@257b5-258b2","920"],
["539","023@258b3-260a6","921"],
["540","023@260a6-260b6","922"],
["541","023@260b6-261a1","923"],
["542","023@261a1-261a5","924"],
["543","023@261a5-263b1","925"],
["544","023@263b1-274a4","926"],
["545","023@274a4-280a1","927"],
["546","023@280a2-280b7","928"],
["547","023@280b7-281b4","929"],
["548","023@281b4-282a2","930"],
["549","023@282a3-283b6","931"],
["550","023@283b7-284b4","932"],
["551","023@284b4-285a5","933"],
["552","023@285a5-287a5","934"],
["553","023@287a6-288b7","935"],
["554","023@288b7-291a7","936"],
["555","023@291a7-292b7","937"],
["556","023@292b7-294a1","938"],
["557","023@294a1-296a7","939"],
["558","023@296a8-298a1","940"],
["559","023@298a1-299b6","941"],
["560","023@299b6-300a7","942"],
["561","023@300a7-301a3","943"],
["562","023@301a3-301a6","944"],
["563","023@301a7-301b3","945"],
["564","023@301b3-301b6","946"],
["565","023@301b6-302a2","947"],
["566","023@302a2-302b2","948"],
["567","023@302b3-302b4","949"],
["568","023@302b4-302b7","950"],
["569","023@302b8-303a2","951"],
["570","023@303a2-303a4","952"],
["571","023@303a4-303a7","953"],
["572","023@303a7-303b1","954"],
["573","023@303b1-303b2","955"],
["574","023@303b2-303b4","956"],
["575","023@303b4-304a6","957"],
["576","024@001b1-033b4","958"],
["577","024@033b4-044b5","959"],
["578","024@044b5-045b7","960"],
["579","024@045b7-047a5","961"],
["580","024@047a6-048b2","962"],
["581","024@048b2-049a8","963"],
["582","024@049a8-049b2","964"],
["583","024@049b2-050b1","965"],
["584","024@050b1-053b7","966"],
["585","024@053b7-054b5","967"],
["586","024@054b5-055b8","968"],
["587","024@055b8-057b3","969"],
["588","024@057b3-060a2","970"],
["589","024@060a3-060b4","971"],
["590","024@060b4-061a6","972"],
["591","024@061a6-062a2","973"],
["592","024@062a2-062a5","974"],
["593","024@062a5-063a6","975"],
["594","024@063a6-087b3","976"],
["595","024@087b3-089b1","977"],
["596","024@089b2-091a5","978"],
["597","024@091a5-091b8","979"],
["598","024@091b8-093a8","980"],
["599","024@093a8-094a3","981"],
["600","024@094a3-094b5","982"],
["601","024@094b6-095a5","983"],
["602","024@095a5-097a6","984"],
["603","024@097a6-098a6","985"],
["604","024@098a6-100b6","986"],
["605","024@100b6-104a6","987"],
["606","024@104a6-104b7","988"],
["607","024@104b7-105a7","989"],
["608","024@105a7-105b2","990"],
["609","024@105b2-108a3","991"],
["610","024@108a4-109a2","992"],
["611","024@109a2-109a5","993"],
["612","024@109a5-120b8","994"],
["613","024@120b8-131a8","995"],
["614","024@131a8-136b2","996"],
["615","024@136b2-145a2","997"],
["616","024@145a2-150a2","998"],
["617","024@150a2-153a6","999"],
["618","024@153a6-154a7","1000"],
["619","024@154a7-155a2","1001"],
["620","024@155a2-155b7","1002"],
["621","024@155b7-157b3","1003"],
["622","024@157b3-158a5","1004"],
["623","024@158a5-159a3","1005"],
["624","024@159a3-160a3","1006"],
["625","024@160a3-160b4","1007"],
["626","024@160b4-161a2","1008"],
["627","024@161a2-164a4","1009"],
["628","024@164a4-166b5","1010"],
["629","024@166b5-168a4","1011"],
["631","024@170b1-170b2","1013"],
["632","024@170b3-170b8","1014"],
["633","024@170b8-177a8","1015"],
["634","024@177a8-181b8","1016"],
["635","024@181b8-182b5","1017"],
["636","024@182b5-183a8","1018"],
["637","024@183a8-187b7","1019"],
["638","024@187b7-189b1","1020"],
["639","024@189b1-190b2","1021"],
["640","024@190b2-191a2","1022"],
["641","024@191a2-191a8","1023a"],
["642","024@191a8-191b2","1023b"],
["643","024@191b2-191b5","1024"],
["644","024@191b6-192a7","1025"],
["645","024@192a7-192b1","1026"],
["646","024@192b1-193a3","1027"],
["647","024@193a3-193a5","1028"],
["648","024@193a5-193b3","1029"],
["649","024@193b3-193b4","1030"],
["650","024@193b5-194b6","1031"],
["651","024@194b6-194b8","1032"],
["652","024@194b8-195a2","1033"],
["653","024@195a2-195a4","1034"],
["654","024@195a4-195b6","1035"],
["655","024@195b6-195b7","1036"],
["656","024@195b7-195b8","1037"],
["657","024@196a1-196a4","1038"],
["658","024@196a4-196a6","1039"],
["659","024@196a6-196a8","1040"],
["660","024@196a8-196b5","1041"],
["661","024@196b5-196b7","1042"],
["662","024@196b7-196b8","1043"],
["663","024@196b8-197a3","1044"],
["664","024@197a3-197a5","1045"],
["665","024@197a5-197a6","1046"],
["666","024@197a6-197b4","1047"],
["667","024@197b4-198a4","1048"],
["668","024@198a4-198a7","1049"],
["669","024@198a7-198b2","1050"],
["670","024@198b2-198b4","1051"],
["671","024@198b4-198b7","1052"],
["672","024@198b7-199a2","1053"],
["673","024@199a2-199a4","1054"],
["674","024@199a4-199a8","1055"],
["675","024@199a8-199b3","1056"],
["676","024@199b3-199b6","1057"],
["677","024@199b6-200a2","1058"],
["678","024@200a2-200a4","1059"],
["679","024@200a4-200a7","1060"],
["680","024@200a7-200b1","1061"],
["681","024@200b1-200b3","1062"],
["682","024@200b3-200b5","1063"],
["683","024@200b5-200b8","1064"],
["684","024@200b8-201a1","1065"],
["685","024@201a1-201a2","1066"],
["686","024@201a3-201a4","1067"],
["687","024@201a4-201a5","1068"],
["688","024@201a5-201a7","1069"],
["689","024@201a7-201a8","1070"],
["690","024@201a8-201b2","1071"],
["691","024@201b2-201b4","1072"],
["692","024@201b4-217a8","1073"],
["693","024@217a8-228a1","1074"],
["694","024@228a1-244a1","1075"],
["695","024@244a1-249b3","1076"],
["696","024@249b3-250a5","1077"],
["697","024@250a5-250b8","1078"],
["698","024@250b8-254b7","1079"],
["699","024@254b7-255a8","1080a"],
["700a","024@255a8-255b1","1080b"],
["700b","024@255b1-255b2","1080c"],
["700c","024@255b2-255b2","1080d"],
["700d","024@255b2-255b3","1080e"],
["700e","024@255b3-255b4","1080f"],
["700f","024@255b4-255b5","1081"],
["701","024@255b5-255b7","1082"],
["702","024@255b7-256a3","1083"],
["703","024@256a3-256b1","1084"],
["704","024@256b1-256b8","1085"],
["705","024@256b8-258b7","1086"],
["706","024@258b8-261b6","1087"],
["707","024@261b6-264a6","1088"],
["708","024@264a6-264b1","1089"],
["709","024@264b1-268b1","1090"],
["710","024@268b1-269a6","1091"],
["711","024@269a6-269b7","1092"],
["712","024@269b7-270a4","1093"],
["713","024@270a4-270b3","1094"],
["714","024@270b3-272a7","1095"],
["715","024@272a7-272b1","1096"],
["716","024@272b1-273a7","1097"],
["717","024@273a7-273b3","1098"],
["718","024@273b3-274b1","1099"],
["719","024@274b1-278b6","1100"],
["720","024@278b6-280b8","1101"],
["721","024@280b8-284b4","1102"],
["722","024@284b4-285b6","1103"],
["723","024@285b6-287a2","1104"],
["724","024@287a2-288a7","1105"],
["725","024@288a7-288b6","1106"],
["726","024@288b6-289b3","1107"],
["727","024@289b3-291b1","1108"],
["728","024@291b1-292a3","1109"],
["729","024@292a4-293b3","1110"],
["730","024@293b3-294a6","1111"],
["731","024@294a6-294b6","1112"],
["732","024@294b6-295a3","1113"],
["733","024@295a3-297b6","1114"],
["734","024@297b6-298a7","1115"],
["735","025@001b1-421a4","111"],
["736","026@001b1-268b5","112"],
["737","026@268b5-297b3","113"],
["738","026@297b4-316a5","114"],
["739","026@316a6-339a7","115"],
["740","027@001b1-334a5","117"],
["741","027@334a5-366a8","118"],
["742","028@001b1-284b8","119"],
["743","028@285a1-335b8","120"],
["744","028@336a1-347b3","121"],
["745","028@347b3-349a2","122"],
["746","028@349a3-351a2","123"],
["747","029@001b1-071a7","124"],
["748","029@071a7-239a3","125"],
["749","029@239a3-351a1","126"],
["750","029@351a1-359a3","127"],
["751","030@001b1-066a8","128"],
["752","030@066a8-159a3","129"],
["753","030@159a3-350a3","130"],
["754","031@001b1-212b6","131"],
["755","031@212b6-228a3","132"],
["756","031@228a3-232b1","133"],
["757","031@232b1-285b1","134"],
["758","031@285b1-333b8","135"],
["759","031@334a1-344a5","136"],
["760","032@001b1-412a6","137"],
["760","033@001b1-383a8","137"],
["761","034@001b1-169a5","138"],
["762","034@169a5-171a7","139"],
["763","034@171a7-171b8","140"],
["764","034@171b8-237a6","141"],
["765","034@237a6-328a3","142"],
["766","034@328a3-328b3","143"],
["767","034@328b3-332a5","144"],
["768","035@001b1-200a6","145"],
["769","035@200a6-204b7","146"],
["770","035@204b8-247a5","147"],
["771","035@247a5-270a4","148"],
["772","035@270a4-297b5","149"],
["773","035@297b5-368a8","150"],
["774","036@001b1-091b4","151"],
["775","036@091b4-152a3","152"],
["776","036@152a3-178a7","153"],
["777","036@178a7-217b8","154"],
["778","036@217b8-227a1","155"],
["779","036@227a1-335b2","156"],
["780","036@335b2-350b5","157"],
["781","036@350b5-362a6","158"],
["782","036@362a7-363a8","159"],
["783","037@001b1-007a5","160"],
["784","037@007a5-007b3","161"],
["785","037@007b3-035a6","162"],
["787","037@096b6-212b4","165"],
["788","037@212b4-312a7","166"],
["789","037@312a8-313a3","167"],
["790","037@313a3-313b6","168"],
["791","037@313b6-327a6","169"],
["792","038@001b1-144a2","170"],
["793","038@144a2-239b3","171"],
["794","038@239b3-248a6","172"],
["795","038@248a6-248b8","173"],
["796","038@248b8-304b5","174"],
["797","038@304b5-377a8","175"],
["798","039@001b1-012b1","176"],
["799","039@012b1-026b4","177"],
["800","039@026b4-121b8","178"],
["801","039@121b8-165a2","179"],
["802","039@165a2-170a3","180"],
["803","039@170a3-188a4","181"],
["804","039@188a4-197a2","182"],
["805","039@197a2-201b8","183"],
["806","039@201b8-206a3","184"],
["807","039@206a3-243b2","185"],
["808","039@243b2-305b7","186"],
["809","039@305b7-370b1","187"],
["810","039@370b1-374b5","188"],
["811","039@374b5-381a6","189"],
["812","040@001b1-006b7","190"],
["813","040@006b7-009a6","191"],
["814","040@009a6-088b2","192"],
["815","040@088b3-205a3","193"],
["816","040@205a4-295b2","194"],
["817","040@295b2-296b1","195"],
["818","040@296b1-301b1","196"],
["819","040@301b1-331a6","197"],
["820","040@331a6-372a3","198"],
["821","041@001b1-093b6","199"],
["822","041@093b6-115b6","200"],
["823","041@115b6-117a6","201"],
["824","041@117a6-128a5","202"],
["825","041@128a5-173b2","203"],
["826","041@173b2-191a8","204"],
["827","041@191a8-234a3","205"],
["828","041@234a4-245a8","206"],
["829","041@245b1-247b2","207"],
["830","041@247b2-279a4","208"],
["831","041@279a4-301b7","209"],
["832","041@301b7-304b5","210"],
["833","041@304b6-309b2","211"],
["834","041@309b2-310a7","212"],
["835","041@310a7-328a1","213"],
["836","041@328a1-333b7","214"],
["837","041@333b7-337b3","215"],
["838","041@337b3-363b6","216"],
["839","041@363b6-369a7","218"],
["840","042@001b1-072a8","219"],
["841","042@072a8-089a6","220"],
["842","042@089a6-093a2","221"],
["843","042@093a2-105a6","222"],
["844","042@105a7-107a5","223"],
["845","042@107a5-109a1","224"],
["846","042@109a1-125b5","225"],
["847","042@125b6-128b6","226"],
["848","042@128b6-133b5","227"],
["849","042@133b5-143a6","228"],
["850","042@143a6-145a7","229"],
["851","042@145a7-146b1","230"],
["856","042@316a8-334a6","235"],
["857","042@334a6-351b8","236"],
["858","042@351b8-364a7","237"],
["859","043@001b1-109a1","238"],
["860","043@109a2-117b3","239"],
["861","043@117b4-172b6","240"],
["862","043@172b6-218a4","241"],
["863","043@218a4-229b6","242"],
["864","043@229b6-231a7","243"],
["865","043@231a7-233a8","244"],
["866","043@233a8-246b7","245"],
["867","043@246b7-288a3","246"],
["868","043@288a3-337a1","247"],
["869","043@337a1-375a8","248"],
["870","044@001b1-141a3","249"],
["871","044@141a4-266b2","250"],
["872","044@266b2-306b4","251"],
["873","044@306b4-312b2","252"],
["874","044@312b2-329a1","253"],
["875","044@329a1-358b5","254"],
["876","044@358b5-374a8","255"],
["877","045@001b1-113b3","256"],
["878","045@113b3-274a3","257"],
["879","045@274a3-335b6","258"],
["880","045@335b6-337a8","259"],
["881","045@337a8-341a3","260"],
["882","046@001b1-018a8","261"],
["883","046@018b1-032a1","262"],
["884","046@032a1-037b6","263"],
["885","046@037b6-048b8","264"],
["886","046@048b8-053a3","265"],
["887","046@053a3-067b8","266"],
["888","046@067b8-068b3","267"],
["889","046@068b3-069a5","268"],
["890","046@069a5-069b8","269"],
["891","046@070a1-079b5","270"],
["892","046@079b5-081a1","271"],
["893","046@081a1-081a8","272"],
["894","046@081b1-084b8","273"],
["895","046@084b8-104a1","274"],
["896","046@104a1-274a8","275"],
["897","046@274a8-289a4","276"],
["898","046@289a4-294a2","277"],
["899","046@294a2-314b5","278"],
["900","046@314b6-344a6","279"],
["901","047@001b1-087a5","280"],
["902","047@087a5-224a3","281"],
["903","047@224a3-284b7","282"],
["904","047@284b7-312a3","283"],
["905","047@312a3-349a7","284"],
["906","048@001b1-006b2","285"],
["907","048@006b2-008a6","286"],
["908","048@008a6-015b8","287"],
["909","048@015b8-020b5","864"],
["910","048@020b5-025a4","289"],
["911","048@025a4-031a1","290"],
["912","048@031a1-035a3","291"],
["913","048@035a3-042a7","292"],
["914","048@042a7-053a3","293"],
["915","048@053a3-059b1","294"],
["916","048@059b1-063a2","295"],
["917","048@063a2-065b1","296"],
["918","048@065b1-066a3","297"],
["919","048@066a3-066a8","298"],
["920","048@066a8-066b2","299"],
["921","048@066b2-067a1","300"],
["922","048@067a1-068a2","301"],
["923","048@068a2-092a7","302"],
["924","048@092a7-095b1","303"],
["925","048@095b1-097b7","304"],
["926","048@097b7-356a6","305"],
["926","049@001b1-354a8","305"],
["926","050@001b1-351a4","305"],
["926","051@001b1-269a3","305"],
["927","051@269a3-287a8","306"],
["928","051@287b1-294a7","307"],
["929","051@294a7-299b6","308"],
["930","051@299b7-309b3","309"],
["931","051@309b3-314a1","310"],
["932","051@314a1-315b8","311"],
["933","051@316a1-326b1","312"],
["934","051@326b1-350b1","313"],
["935","051@350b1-352a7","314"],
["936","051@352a7-357b5","315"],
["937","051@357b5-360b2","316"],
["938","051@360b3-361b8","317"],
["939","051@361b8-363a7","318"],
["940","052@001b1-152a5","319"],
["941","052@152a5-154a5","320"],
["942","052@154a5-155a4","321"],
["943","052@155a4-158b1","322"],
["945","052@159a8-174b3","324"],
["946","052@174b3-182b2","325"],
["947","052@182b2-193b1","326"],
["948","052@193b1-194a6","327"],
["949","052@194a6-195b8","328"],
["950","052@195b8-196a7","329"],
["951","052@196a7-200b5","330"],
["952","052@200b5-203b2","331"],
["953","052@203b2-210a2","332"],
["954","052@210a2-211a1","333"],
["955","052@211a1-211b8","334"],
["956","052@212a1-231b3","335"],
["957","052@231b3-237b6","336"],
["958","052@237b6-241a7","337"],
["959","052@241a7-243a8","338"],
["960","052@243a8-246a7","339"],
["961","052@246a7-249b8","340"],
["962","052@249b8-250a3","341"],
["963","052@250a3-250a8","342"],
["964","052@250a8-255b1","343"],
["968","052@309b6-311a7","347"],
["969","052@311a7-312a3","348"],
["970","052@312a3-312b5","349"],
["971","052@312b5-316b5","350"],
["972","052@316b5-321b5","351"],
["973","052@321b5-325a2","352"],
["974","052@325a2-328b4","353"],
["975","052@328b4-329b4","354"],
["976","052@329b4-331b5","355"],
["977","052@331b5-358a1","357"],
["978","052@358a1-371a6","358"],
["979","053@001b1-369a2","360"],
["979","054@001b1-146a2","360"],
["980","054@146a2-334b5","361"],
["982","055@001b1-316b6","363"],
["983","055@316b6-319b4","364"],
["984","055@319b4-321b4","365"],
["985","055@321b4-329a8","366"],
["986","056@001b1-026b8","367"],
["987","056@026b8-037a6","368"],
["988","056@037a6-058b1","369"],
["989","056@058b2-064b2","370"],
["990","056@064b2-081a6","371"],
["991","056@081a6-099a2","372"],
["992","056@099a2-227b3","373"],
["993","056@227b3-241b6","374"],
["994","056@241b6-250b4","375"],
["995","056@250b4-256a2","376"],
["996","056@256a2-269a2","377"],
["999","057@001b1-302a6","25"],
["999","058@001b1-323a5","25"],
["999","059@001b1-317a5","25"],
["999","060@001b1-310a6","25"],
["999","061@001b1-323a2","25"],
["999","062@001b1-307a8","25"],
["999","063@001b1-312a5","25"],
["999","064@001b1-320a4","25"],
["999","065@001b1-310a3","25"],
["999","066@001b1-313a3","25"],
["999","067@001b1-315a7","25"],
["999","068@001b1-319a6","25"],
["999","069@001b1-307a8","25"],
["999","070@001b1-309a4","25"],
["999","071@001b1-328a7","25"],
["999","072@001b1-299a5","25"],
["1000","073@001b1-353a4","26"],
["1000","074@001b1-347a5","26"],
["1000","075@001b1-339a7","26"],
["1000","076@001b1-308a7","26"],
["1001","077@001b1-386a8","29"],
["1002","078@001b1-021b5","30"],
["1003","078@021b5-117b1","31"],
["1004","078@117b2-147b7","41"],
["1005","078@147b8-169a8","32"],
["1006","078@169a8-186a6","33"],
["1007","078@186a6-189a6","35"],
["1008","078@189a6-189b4","40"],
["1009","078@189b4-191a6","43"],
["1010","078@191a6-192b3","44"],
["1011","078@192b3-193a5","45"],
["1012","078@193a5-193b7","46"],
["1013","078@193b7-194b3","47"],
["1014","078@194b3-197b7","48"],
["1015","078@197b7-278b4","49"],
["1016","078@278b4-289b5","50"],
["1017","078@289b5-293b4","51"],
["1018","078@293b4-301a3","52"],
["1019","078@301a3-302a2","53"],
["1020","078@302a3-308b2","54"],
["1021","078@308b2-311b4","55"],
["1022","078@311b4-314a4","56"],
["1023","078@314a4-315a3","57"],
["1024","078@315a4-315b4","58"],
["1025","078@315b4-316a4","59"],
["1026","078@316a4-317a8","60"],
["1027","079@001b1-350a3","27"],
["1027","080@001b1-341a8","27"],
["1028","081@001b1-102a4","28"],
["1027","081@001b1-242a3","27"],
["1028","082@001b1-363a8","28"],
["1029","083@001b1-051a3","62"],
["1029","083@051a3-112b5","63"],
["1029","083@112b5-234a7","64"],
["1029","083@234a7-271b6","65"],
["1029","083@271b6-311a5","66"],
["1029","084@001b1-079a6","67"],
["1029","084@079a6-165a6","68"],
["1029","084@165a6-192b7","69"],
["1029","084@192b7-216b5","70"],
["1029","084@216b5-228a5","71"],
["1029","084@228a5-299a5","72"],
["1029","084@299a5-346a6","73"],
["1029","085@001b1-244a4","73"],
["1029","085@244a4-280b7","74"],
["1029","085@280b7-294a3","75"],
["1029","085@294a3-349a3","76"],
["1029","086@001b1-193a4","77"],
["1029","086@193a4-262a8","78"],
["1029","086@262a8-296b2","79"],
["1029","086@296b3-332a6","80"],
["1029","087@001b1-021b4","81"],
["1029","087@021b4-042a4","82"],
["1029","087@042a4-077b6","83"],
["1029","087@077b6-132b1","84"],
["1029","087@132b1-151a5","85"],
["1029","087@151a5-175a3","86"],
["1029","087@175a3-206a8","87"],
["1029","087@206a8-223a3","88"],
["1029","087@223a3-234b3","89"],
["1029","087@234b3-246b8","90"],
["1029","087@246b8-253b3","91"],
["1029","087@253b3-258a3","92"],
["1029","087@258a3-275a3","93"],
["1029","087@275a3-298a2","94"],
["1029","087@298a2-302b6","95"],
["1029","087@302b6-322a7","96"],
["1029","087@322a7-349a8","97"],
["1029","088@001b1-027b7","97"],
["1029","088@027b7-030b4","98"],
["1029","088@030b4-075a1","99"],
["1029","088@075a1-100b8","100"],
["1029","088@100b8-110b3","101"],
["1029","088@110b3-123a1","102"],
["1029","088@123a1-125b8","103"],
["1029","088@125b8-161a3","104"],
["1029","088@161a3-186b4","105"],
["1029","088@186b4-193b6","106"],
["1029","088@193b6-222a8","107"],
["1029","088@222a8-273a1","108"],
["1029","088@273a1-298b1","109"],
["1029","088@298b1-322a5","110"],
["1030","089@001b1-282a8","61"],
["1030","090@001b1-285a5","61"],
["1030","091@001b1-293a7","61"],
["1030","092@001b1-260a8","61"],
["1030","093@001b1-295a2","61"],
["1030","094@001b1-284a2","61"],
["1031","095@001b1-354b6","1"],
["1031","096@001b1-349a8","1"],
["1031","097@001b1-347a7","1"],
["1031","098@001b1-349a8","1"],
["1032","099@001b1-023a6","2"],
["1033","099@023a6-334a7","3"],
["1033","100@001b1-328a4","3"],
["1033","101@001b1-351a7","3"],
["1033","102@001b1-323a8","3"],
["1034","103@001b1-026b6","4"],
["1035","103@026b6-361a8","5"],
["1036","104@001b1-375a8","6"],
["1036","105@001b1-387a6","6"],
["1037","106@001b1-109b6","7"],
["1038","106@109b6-350a8","8"],
["1038","107@001b1-352a6","8"],
["1039","107@352a6-356a5","9"],
["1040","107@356a5-357b1","10"],
["1041","107@357b1-358b8","11"],
["1042","107@358b8-361a6","12"],
["1043","107@361a6-367a5","13"],
["1044","107@367a5-369a4","14"],
["1045","107@369a4-369b3","15"],
["1046","107@369b3-370b5","16"],
["1047","107@370b5-372b7","17"],
["1048","107@372b7-373b3","18"],
["1049","107@373b3-376a2","19"],
["1050","107@376a2-376b1","20"],
["1051","107@376b1-377a4","21a"],
["1052","107@377a4-377b7","21b"],
["1053","107@377b7-378b3","21c"],
["1054","107@378b3-379b3","22"],
["1055","107@379b3-380a6","23"],
["1056","107@380a7-382a5","24"],
["1057","108@001a1-045a2","1149"]];
cPedurma.rcode="C";
module.exports=cPedurma;
});
require.register("pedurmacat-dataset/jPedurma.js", function(exports, require, module){
var jPedurma=[["1","001@001b1-314a9","1"],
["1","002@001b1-319a8","1"],
["1","003@001b1-315a8","1"],
["1","004@001b1-306a6","1"],
["2","005@001b1-021b4","2"],
["3","005@021b4-300a7","3"],
["3","006@001b1-328a4","3"],
["3","007@001b1-297a4","3"],
["3","008@001b1-264a6","3"],
["4","009@001b1-024a8","4"],
["5","009@025a1-326a7","5"],
["6","010@001b1-330a8","6"],
["6","011@001b1-332a4","6"],
["7","012@001b1-093b8","7"],
["8a","012@094a1-297a7","8"],
["8a","013@001b1-321a6","8"],
["8b","013@321a6-324b7","9"],
["8c","013@324b8-326a4","10"],
["8d","013@326a4-327b1","11"],
["8e","013@327b1-329b2","12"],
["8f","013@329b2-334b5","13"],
["8g","013@334b5-336a6","14"],
["8h","013@336a7-336b5","15"],
["8i","013@336b5-337b4","16"],
["8j","013@337b4-339a8","17"],
["8k","013@339b1-340a1","18"],
["8","013@340a2-342a1","19"],
["8m","013@342a2-342a8","20"],
["8n","013@342a8-343a1","21a"],
["8o","013@343a1-343b3","21b"],
["8p","013@343b3-344a6","21c"],
["8q","013@344a6-345a4","22"],
["8r","013@345a4-345b6","23"],
["8s","013@345b6-347a5","24"],
["9","014@001b1-277a5","25"],
["9","015@001b1-247a4","25"],
["9","016@001b1-279a6","25"],
["9","017@001b1-278a5","25"],
["9","018@001b1-312a4","25"],
["9","019@001b1-298a4","25"],
["9","020@001b1-300a6","25"],
["9","021@001b1-293a8","25"],
["9","022@001b1-326a5","25"],
["9","023@001b1-291a6","25"],
["9","024@001b1-306a6","25"],
["9","025@001b1-317a3","25"],
["9","026@001b1-315a3","25"],
["9","027@001b1-306a6","25"],
["9","028@001b1-308a7","25"],
["9","029@001b1-311a3","25"],
["10","030@001b1-293a8","26"],
["10","031@001b1-313a6","26"],
["10","032@001b1-295a8","26"],
["10","033@001b1-271a9","26"],
["11","034@001b1-314a7","27"],
["11","035@001b1-320a7","27"],
["12","036@001b1-092a8","28"],
["11","036@001b1-211a8","27"],
["","037@001a1-251a3","305"],
["12","037@093b1-400a7","28"],
["13","038@001b1-305a2","29"],
["14","039@001b1-020a8","30"],
["15","039@020b1-105b8","31"],
["16","039@106a1-133b7","41"],
["17","039@133b7-151b8","32"],
["18","039@151b8-164b8","33"],
["19","039@164b8-167a6","35"],
["20","039@167a6-167b4","40"],
["21","039@167b4-169a2","43"],
["22","039@169a2-170a4","44"],
["23","039@170a4-170b5","45"],
["24","039@170b5-171a6","46"],
["25","039@171a6-172a1","47"],
["26","039@172a1-174b8","48"],
["27","039@175a1-248b7","49"],
["28","039@248b7-258b7","50"],
["29","039@258b7-262b4","51"],
["30","039@262b4-269b6","52"],
["31","039@269b6-270b5","53"],
["32","039@270b5-276b2","54"],
["33","039@276b2-279b2","55"],
["34","039@279b2-282a2","56"],
["35","039@282a2-283a1","57"],
["36","039@283a2-283b2","58"],
["37","039@283b2-284a2","59"],
["38","039@284a3-285a6","60"],
["39","040@001b1-308a6","111"],
["40","041@001b1-246b6","112"],
["41","041@247a1-273b8","113"],
["42","041@274a1-290b8","114"],
["43","041@291a1-311a8","115"],
["44","042@001b1-290a8","117"],
["45","042@290a8-323a8","118"],
["46","043@001b1-239b8","119"],
["47","043@240a1-289b7","120"],
["48","043@290a1-300b8","121"],
["49","043@301a1-302a7","122"],
["50","043@302a8-304a8","123"],
["51","044@001b1-059b8","124"],
["53","044@207b2-306b1","126"],
["54","044@306b1-313a8","127"],
["55","045@001b1-061a1","128"],
["56","045@061a2-141a2","129"],
["57","045@141a2-313a8","130"],
["58","046@001b1-198a2","131"],
["59","046@198a2-212b3","132"],
["60","046@212b3-217a1","133"],
["61","046@217a1-265a6","134"],
["62","046@265a6-307b8","135"],
["63","046@308a1-316a8","136"],
["64","047@001b1-360a6","137"],
["64","048@001b1-332a7","137"],
["66","049@147b7-148b5","139"],
["67","049@148b5-149a6","140"],
["68","049@149a6-204a2","141"],
["69","049@204a2-278a8","142"],
["70","049@278a8-279a8","143"],
["71","049@279a8-282a8","144"],
["72","050@001b1-180a4","145"],
["73","050@180b1-184a2","146"],
["74","050@184a3-218b4","147"],
["75","050@218b5-239b6","148"],
["76","050@239b6-265a7","149"],
["77","050@265a7-331a7","150"],
["78","051@001b1-076b8","151"],
["79","051@077a1-131a6","152"],
["80","051@131a6-156a7","153"],
["81","051@156a7-196a2","154"],
["82","051@196a2-204b8","155"],
["83","051@205a1-299b7","156"],
["84","051@299b7-311a6","157"],
["85","051@311a7-320b4","158"],
["86","051@320b4-321a8","159"],
["87","052@001b1-006a4","160"],
["88","052@006a5-006b4","161"],
["89","052@006b4-033b4","162"],
["90","052@033b4-093a6","164"],
["92","052@190b6-277b5","166"],
["93","052@277b5-278a7","167"],
["94","052@278a8-279a2","168"],
["95","052@279a2-292a7","169"],
["96","053@001b1-130b6","170"],
["97","053@130b6-222a1","171"],
["98","053@222a1-230b3","172"],
["99","053@230b3-231a5","173"],
["100","053@231a5-285a1","174"],
["101","053@285a1-359a8","175"],
["102","054@001b1-010b3","176"],
["103","054@010b3-023a4","177"],
["105","054@106a2-144a7","179"],
["106","054@144a7-148b2","180"],
["107","054@148b2-163b8","181"],
["108","054@164a1-171a6","182"],
["109","054@171a6-175a6","183"],
["110","054@175a6-178b4","184"],
["111","054@178b5-213b5","185"],
["112","054@213b5-260a5","186"],
["113","054@260a5-305a1","187"],
["114","054@305a1-307b7","188"],
["115","054@307b8-312a3","189"],
["116","055@001b1-005b2","190"],
["117","055@005b3-007b5","191"],
["118","055@007b5-080b5","192"],
["119","055@080b5-184a7","193"],
["120","055@184a8-260a3","194"],
["121","055@260a3-261a1","195"],
["122","055@261a1-265a6","196"],
["123","055@265a7-291a3","197"],
["124","055@291a3-325a7","198"],
["125","056@001b1-090b1","199"],
["127","056@011a4-112b2","201"],
["126","056@090b1-111a4","200"],
["128","056@112b2-122b1","202"],
["129","056@122b1-164a8","203"],
["130","056@164b1-180a8","204"],
["131","056@180a8-217b8","205"],
["132","056@217b8-227a6","206"],
["133","056@227a7-229a1","207"],
["134","056@229a1-254b8","208"],
["135","056@255a1-275a4","209"],
["136","056@275a5-277b6","210"],
["137","056@277b7-282a3","211"],
["138","056@282a3-282b5","212"],
["139","056@282b5-298b3","213"],
["140","056@298b3-304a3","214"],
["141","056@304a3-307b3","215"],
["142","056@307b3-331a3","216"],
["143","056@331a4-336a8","218"],
["144","057@001b1-072b8","219"],
["145","057@072b8-089a3","220"],
["146","057@089a4-092b6","221"],
["147","057@092b6-104b1","222"],
["148","057@104b1-106a7","223"],
["149","057@106a7-108a2","224"],
["150","057@108a3-124a7","225"],
["151","057@124a7-127a6","226"],
["152","057@127a6-131b7","227"],
["153","057@131b7-140a8","228"],
["154","057@140a8-142a7","229"],
["155","057@142a7-143b8","230"],
["160","057@295a7-311b4","235"],
["161","057@311b4-327b4","236"],
["162","057@327b4-339a8","237"],
["163","058@001b1-086b8","238"],
["164","058@087a1-093b8","239"],
["165","058@094a1-142a1","240"],
["166","058@142a1-184b3","241"],
["167","058@184b4-195b1","242"],
["168","058@195b1-196b8","243"],
["169","058@197a1-198b8","244"],
["170","058@199a1-211b7","245"],
["171","058@211b7-252a3","246"],
["172","058@252a3-295b2","247"],
["173","058@295b2-331a6","248"],
["174","059@001b1-134b7","249"],
["104","059@023a1-100b7","178"],
["175","059@134b8-257b4","250"],
["176a","059@257b4-295a3","251"],
["176b","059@295a4-300b1","252"],
["177","059@300b1-315a6","253"],
["178","059@315a6-342a1","254"],
["179","059@342a1-355a7","255"],
["","060@001b1-108a8","256"],
["181","060@108b1-262a3","257"],
["182","060@262a3-330b4","258"],
["183","060@330b5-332b2","259"],
["184","060@332b2-336a8","260"],
["185","061@001b1-016a7","261"],
["186","061@016a8-029b8","262"],
["187","061@030a1-035b6","263"],
["188","061@035b7-043b5","264"],
["189","061@043b6-047b3","265"],
["190","061@047b4-061a2","266"],
["191","061@061a2-061b4","267"],
["192","061@061b4-062a5","268"],
["193","061@062a5-062b7","269"],
["194","061@062b8-072a2","270"],
["195","061@072a3-073a6","271"],
["196","061@073a6-073b5","272"],
["197","061@073b6-077a2","273"],
["198","061@077a2-095b8","274"],
["199","061@096a1-261b3","275"],
["200","061@261b4-276b6","276"],
["201","061@276b7-281b4","277"],
["202a","061@281b5-302a6","278"],
["202b","061@302a7-331a7","279"],
["203","062@001b1-091a3","280"],
["204","062@091a3-222a6","281"],
["205","062@222a6-279a2","282"],
["206","062@279a2-305a2","283"],
["207","062@305a2-340a7","284"],
["208","063@001b1-005a4","285"],
["209","063@005a4-006b3","286"],
["210","063@006b3-013a4","287"],
["211","063@013a4-017a6","288"],
["212","063@017a6-021a3","289"],
["213","063@021a3-025b8","290"],
["214","063@026a1-029a8","291"],
["215","063@029a8-035b2","292"],
["216","063@035b2-044b1","293"],
["217","063@044b1-049b6","294"],
["218","063@049b7-052b6","295"],
["219","063@052b6-054b6","296"],
["220","063@054b6-055a8","297"],
["221","063@055a8-055b3","298"],
["222","063@055b3-055b6","299"],
["223","063@055b6-056a3","300"],
["224","063@056a4-057a2","301"],
["225","063@057a2-076b8","302"],
["226","063@077a1-079b5","303"],
["227","063@079b5-081b7","304"],
["228","063@081b7-332a3","305"],
["228","064@001b1-334b6","305"],
["228","065@001b1-344a8","305"],
["228","066@001b1-251b1","305"],
["229","066@251b2-267b8","306"],
["230","066@268a1-275a1","307"],
["231","066@275a1-278b7","308"],
["232","066@278b8-288a2","309"],
["233","066@288a3-292a1","310"],
["234","066@292a1-293b8","311"],
["235","066@294a1-303b1","312"],
["236","066@303b1-326a1","313"],
["237","066@326a1-327b3","314"],
["238a","066@327b3-332b3","315"],
["238b","066@332b3-335a5","316"],
["239","066@335a5-336a6","317"],
["240","066@336a7-337a7","318"],
["241","067@001b1-134a5","319"],
["242","067@134a6-135b7","320"],
["243","067@135b7-136b5","321"],
["244","067@136b6-139b2","322"],
["245","067@139b3-140a7","323"],
["246","067@140a7-152b8","324"],
["247","067@152b8-159b5","325"],
["248","067@159b6-169a4","326"],
["249","067@169a5-169b8","327"],
["250","067@169b8-171a6","328"],
["251","067@171a6-171b4","329"],
["252","067@171b5-175b3","330"],
["253","067@175b4-178a2","331"],
["254","067@178a2-183b5","332"],
["255","067@183b6-184b1","333"],
["256","067@184b1-185a5","334"],
["257","067@185a5-202b1","335"],
["258","067@202b2-208a2","336"],
["259","067@208a2-211a5","337"],
["260","067@211a5-213a3","338"],
["261","067@213a3-215b2","339"],
["262","067@215b2-218a7","340"],
["263","067@218a7-218b1","341"],
["264","067@218b2-218b5","342"],
["265","067@218b5-223a3","343"],
["269","067@274a5-275b6","347"],
["270","067@275b7-276b3","348"],
["271","067@276b3-277a5","349"],
["272","067@277a5-281a1","350"],
["273","067@281a1-285b1","351"],
["274","067@285b1-288b2","352"],
["275","067@288b2-291b7","353"],
["276","067@291b7-292b5","354"],
["277","067@292b5-294b2","355"],
["278","067@294b3-316b1","357"],
["279","067@316b1-328a8","358"],
["280","068@001b1-331a4","360"],
["280","069@001b1-147b6","360"],
["281","069@148a1-333a5","361"],
["282","070@001b1-309b7","363"],
["283","070@309b7-313b5","364"],
["284","070@313b6-315b5","365"],
["285","070@315b6-323a8","366"],
["286","071@001b1-022b3","367"],
["287","071@022b4-032a8","368"],
["288","071@032b1-052b6","369"],
["289","071@052b7-058b4","370"],
["290","071@058b4-074b4","371"],
["291","071@074b4-091b5","372"],
["292","071@091b5-203b8","373"],
["293","071@204a1-215b8","374"],
["294","071@215b8-224a1","375"],
["295","071@224a1-229a2","376"],
["296","071@229a2-242a2","377"],
["299","072@001b1-274a6","61"],
["299","073@001b1-285a5","61"],
["299","074@001b1-302a7","61"],
["299","075@001b1-257b3","61"],
["299","076@001b1-296a3","61"],
["299","077@001b1-281a6","61"],
["300","078@001b1-051a3","62"],
["302","078@112b6-235b6","64"],
["303","078@235b6-276a2","65"],
["304","078@276a3-316a8","66"],
["305","079@001b1-077b3","67"],
["306","079@077b4-161b8","68"],
["307","079@161b8-189b8","69"],
["308","079@189b8-213b1","70"],
["309","079@213b1-225b7","71"],
["310","079@225b8-295a2","72"],
["311","079@295a2-340a3","73"],
["311","080@001b1-252a6","73"],
["312","080@252a6-288b6","74"],
["313","080@288b6-302a5","75"],
["314","080@302a6-357a2","76"],
["315","081@001b1-188a4","77"],
["316","081@188a4-257a5","78"],
["317","081@257a5-291b2","79"],
["318","081@291b3-327a8","80"],
["319","082@001b1-019b3","81"],
["320","082@019b4-038b8","82"],
["321","082@039a1-077a7","83"],
["322","082@077a7-128b7","84"],
["323","082@128b8-147b3","85"],
["324","082@147b3-172a4","86"],
["325","082@172a4-203b1","87"],
["326","082@203b1-218a7","88"],
["327","082@218a7-229a8","89"],
["328","082@229a8-241b5","90"],
["329","082@241b5-248b8","91"],
["330","082@249a1-253a5","92"],
["331","082@253a6-272a1","93"],
["332","082@272a2-295b5","94"],
["333","082@295b5-300b7","95"],
["334","082@300b7-322b7","96"],
["335","082@322b7-351a8","97"],
["335","083@001b1-027a3","97"],
["336","083@027a3-029b8","98"],
["337","083@030a1-074b6","99"],
["338","083@074b6-102b7","100"],
["339","083@102b7-113a1","101"],
["340","083@113a1-125b4","102"],
["341","083@125b5-128b5","103"],
["342","083@128b5-164b6","104"],
["343","083@164b6-189b5","105"],
["344","083@189b5-197a3","106"],
["345","083@197a3-226a8","107"],
["346","083@226a8-277a1","108"],
["347","083@277a1-303a4","109"],
["348","083@303a4-327a7","110"],
["349","084@001b1-014a4","385"],
["350","084@015a1-024a2","386"],
["351","084@025a1-144a5","387"],
["352a","084@145a1-161b5","388"],
["352b","084@161b6-164a1","389"],
["353","084@164a1-168a5","390"],
["354a","084@168a5-213a2","391"],
["354b","084@213a2-234b7","392"],
["355a","084@235a1-248a8","440a"],
["355b","084@248a8-266a4","440b"],
["356","084@266a4-304b6","441"],
["357","084@304b6-334a3","442"],
["358","085@001b1-007b1","443"],
["359","085@007b2-048a5","444"],
["360","085@048a5-054b7","445"],
["361","085@055a1-090b8","393"],
["363","085@222a1-348b8","395"],
["364","085@349a1-362a2","396"],
["365","086@001b1-145b8","397"],
["366","086@146a1-197b8","398"],
["367","086@198a1-232b2","399"],
["368a","086@232b2-240b8","402"],
["368b","086@241a1-252a7","400"],
["369","086@252a8-261a7","401"],
["370","086@261a7-262a1","404"],
["371a","086@262a1-358a3","405a"],
["371b","086@358a3-386a8","405b"],
["372","087@001b1-004a2","406"],
["373","087@004a2-012a2","407"],
["374","087@012a2-015b1","408"],
["375","087@015b1-018a3","409"],
["376","087@018a3-019b2","410"],
["377","087@019b2-024b8","411"],
["378","087@024b8-030a7","412"],
["379","087@030a7-033a5","413"],
["380","087@033a6-036b1","414"],
["381","087@036b1-038a1","415"],
["382","087@038a1-039b2","416"],
["383","087@039b2-041a4","417"],
["384","087@041a4-042b3","418"],
["385","087@042b3-045b7","419"],
["386","087@045b7-047b1","420"],
["387","087@047b1-048b3","421"],
["388","087@048b4-050a8","422"],
["389","087@050b1-052a6","423"],
["390","087@052a6-054b3","424"],
["391","087@054b3-056b7","425"],
["392","087@056b8-058b6","426"],
["393","087@058b6-060a1","427"],
["394","087@060a1-063b2","428"],
["395","087@063b3-065a6","429"],
["396","087@065a6-066b5","431"],
["397","087@066b5-067b3","432"],
["398","087@067b3-069a1","430"],
["399","087@069a2-070b8","434"],
["400","087@071a1-072b8","433"],
["401","087@072b8-077b8","436"],
["402","087@078a1-080a3","437"],
["403","087@080a3-082a4","438"],
["404","087@082a4-093a7","403a"],
["405","087@093a7-095a4","403b"],
["406","087@095a4-126a5","439"],
["407","087@126a6-152a3","446"],
["408a","087@152a3-155b5","447"],
["408b","087@155b5-160b5","448"],
["409","087@160b5-165b5","449"],
["410","087@165b5-216b3","450"],
["411","087@216b3-243a7","451"],
["412","087@243a7-285b7","452"],
["413","087@285b7-327a8","453"],
["414a","088@001b1-013a8","454"],
["414b","088@013b1-015b8","456"],
["414c","088@016a1-018a7","455"],
["415","088@018b1-030a2","457"],
["416","088@030a2-032a8","458"],
["417","088@032b1-046b4","459"],
["418","088@046b5-048a3","460"],
["419","088@048a4-050a6","461"],
["420","088@050a8-093b8","462"],
["421","088@094a1-097b8","463"],
["422","088@098a1-165b7","464"],
["423","088@165b7-177a4","466"],
["424","088@177a5-252a6","468"],
["425","088@252b1-306a6","467"],
["426","088@306a7-310b4","470"],
["427","088@310b4-315a1","469"],
["428","088@315a1-337a6","474"],
["429","088@337b1-371a6","473"],
["430","089@001b1-044a6","475"],
["431","089@044b1-283a8","476"],
["432","089@283b1-285a5","477"],
["433","089@285a5-290a2","478"],
["434","089@290a3-294a8","479"],
["435","089@294b1-297b2","480"],
["436","089@297b3-314a8","481"],
["437","089@314b1-320a5","482"],
["438a","089@320a5-323a7","483"],
["438b","089@323a7-323a8","484"],
["439","090@001b1-028b8","485"],
["440","090@029a1-030b8","487"],
["441","090@031a1-053a8","488"],
["442","090@054a1-056a1","486"],
["443","090@056a1-058b8","489"],
["444","090@059a1-102a8","490"],
["445","090@102b1-119b3","491"],
["446","090@119b3-131a4","497"],
["447","090@131a5-144a1","492"],
["448","090@144a1-150b6","494"],
["449","090@151a1-154b2","493"],
["450","090@154b2-155a1","495"],
["451","090@155a1-186b8","498"],
["452","090@187a1-190b8","501"],
["453","090@191a1-250a8","502"],
["454a","091@001b1-159b7","504"],
["454b","091@159b8-297a8","505"],
["454c","091@297b1-306a8","506"],
["455","092@001b1-053b1","507"],
["456a","092@053b1-095b1","508"],
["456b","092@095b1-095b8","509"],
["457","092@095b8-151a8","510"],
["458","092@151b1-155b8","511"],
["459","092@156a1-181a5","512"],
["460","092@181a5-285b5","513"],
["461","092@285b5-293b7","514"],
["462","092@293b8-333a5","517"],
["463","093@001b1-081b8","515"],
["464","093@082a1-082b7","516"],
["465","093@083a1-117a8","518"],
["466","093@117b1-229b8","519"],
["467","093@230a1-293b2","520"],
["468","093@293b2-303b6","523"],
["469","093@303b6-309b8","524"],
["470","094@001b1-163b7","521"],
["471","094@163b7-168b4","525"],
["472","094@168b4-169b8","779"],
["473","094@170a1-174b2","526"],
["474","094@174b3-245b8","527"],
["475","094@246a1-271b8","528"],
["476","094@272a1-280b6","529"],
["477","094@280b7-283b2","530"],
["478","094@283b2-303a7","532"],
["479a","095@001b1-002b2","535"],
["479b","095@002b2-003a3","630"],
["480a","095@003a3-009b1","533"],
["480b","095@009b1-013b1","656"],
["481","095@013b1-013b2","559"],
["482","095@013b3-013b7","560"],
["483","095@013b8-014a4","680"],
["485a","095@015a5-015a8","711"],
["485b","095@015a8-017a3","541"],
["486","095@017a3-019b4","540"],
["487","095@019b4-021a6","539"],
["488","095@021a6-025a1","537"],
["489","095@025a1-029a4","538"],
["490a","095@029a4-029b2","708"],
["490b","095@029b2-029b5","709"],
["491","095@029b5-029b8","561"],
["492","095@029b8-030a1","562"],
["493","095@030a2-030a3","563"],
["494","095@030a3-033b4","543"],
["495","095@033b4-036b3","570"],
["496","095@036b3-037b4","672"],
["497","095@037b4-039b1","556"],
["498","095@039b1-040b7","557"],
["499","095@040b7-045a4","558"],
["500","095@045a5-305a8","571"],
["501","096@001b1-014a5","572"],
["502","096@014a5-014b8","579"],
["503","096@014b8-015a8","580"],
["504","096@015b1-015b8","573"],
["505","096@015b8-016b1","574"],
["506","096@016b2-016b5","575"],
["507","096@016b6-016b7","576"],
["508","096@017a1-017a5","577"],
["509","096@017a5-017a8","578"],
["510","096@018a1-019b3","581"],
["511","096@019b3-020b8","582"],
["512","096@021a1-167b8","583"],
["513","096@168a1-302a8","584"],
["514","097@001b1-067a7","585"],
["515","097@068a1-094a8","586"],
["516","097@095a1-125b7","587"],
["517","097@125b7-147b6","589"],
["518","097@147b6-159b3","590"],
["519","097@159b3-166a8","591"],
["520","097@167a1-168b5","592"],
["521a","097@168b5-176a4","593"],
["521b","097@176a4-196b1","594"],
["521c","097@196b1-197b1","766"],
["522","097@197b1-198a4","767"],
["523","097@198a4-206a8","789"],
["524","097@206a8-207a3","641"],
["525","097@207a4-207b8","599"],
["526","097@208a1-209b4","598"],
["527","097@209b4-210a5","763"],
["528","097@210a6-215b8","595"],
["529","097@216a1-219b6","596"],
["530","097@219b6-220a5","588"],
["531","097@220a6-225b1","554"],
["532","097@225b1-226b8","522"],
["533","097@227a1-231b7","623"],
["534a","097@231b7-236b8","625"],
["534b","097@237a1-244b8","622"],
["535","097@244b8-247a4","626"],
["536","097@247a4-248a7","624"],
["537","097@248a7-257a3","618"],
["538a","097@257a4-263a7","619"],
["538b","097@263a7-268a6","620"],
["538c","097@268a6-274a3","621"],
["539","097@274a3-282b6","627"],
["540a","097@282b7-283a7","650"],
["540b","097@283a8-283b1","651"],
["541","097@283b1-284a2","653"],
["542","097@284a3-284a4","652"],
["543","097@284a4-284b2","648"],
["544","097@284b2-284b3","654"],
["545","097@284b3-285b2","649"],
["546","097@285b3-286a5","657"],
["547","097@286a5-286b6","643"],
["548a","097@286b6-287a5","741"],
["548b","097@287a5-288b3","548"],
["548c","097@288b3-299a7","536"],
["549","097@299a7-306a3","629"],
["550","097@306a4-308b3","545"],
["551","097@308b3-309b2","546"],
["552","097@309b2-309b5","547"],
["553","097@309b6-309b7","804"],
["554","097@309b7-310a2","628"],
["555","097@310a2-310a3","531"],
["556a","097@310a3-310a5","805"],
["556b","097@310a5-310b1","806"],
["556c","097@310b1-310b7","807"],
["557","097@310b7-311a1","808"],
["558","097@311a1-311a3","679"],
["559","097@311a3-311a6","751"],
["560","097@311a6-311b5","749"],
["561a","097@311b6-311b8","750"],
["561b","097@312a1-312a4","678"],
["562a","097@312a4-312a6","742"],
["562b","097@312a7-312b1","743"],
["562c","097@312b1-312b4","744"],
["562d","097@312b4-312b7","745"],
["563","097@312b7-313a2","746"],
["564","097@313a3-313a6","747"],
["565","097@313a6-313a8","748"],
["566","097@313a8-313b3","809"],
["567","097@313b3-313b5","810"],
["568","097@313b5-313b6","811"],
["569","097@313b7-314a5","567"],
["570","097@314a5-314a8","812"],
["571","097@314b1-314b2","813"],
["572","097@314b2-314b4","814"],
["573","097@314b4-314b6","815"],
["574","097@314b6-315a1","816"],
["575","097@315a1-315a2","817"],
["576","097@315a2-315a3","818"],
["577","097@315a4-315a7","819"],
["578","097@315a7-315a8","820"],
["579","097@315a8-315b3","821"],
["580","097@315b3-315b5","822"],
["581","097@315b5-315b8","823"],
["582","097@315b8-316a4","824"],
["583","097@316a4-316a7","825"],
["584","097@316a7-316a8","826"],
["585","097@316a8-316b2","827"],
["586","097@316b3-316b5","828"],
["587","097@316b5-316b6","829"],
["588","097@316b6-316b8","830"],
["589","097@316b8-317a2","831"],
["590","097@317a2-317a3","832"],
["591","097@317a4-317a6","833"],
["594","097@317b2-317b6","773"],
["595","097@317b6-317b8","604"],
["596","097@317b8-318a4","605"],
["597","097@318a4-318a6","606"],
["599","097@318b1-319a1","608"],
["600","097@319a1-319a2","609"],
["601","097@319a2-319a5","610"],
["602","097@319a5-319a8","611"],
["603","097@319a8-319b1","612"],
["604","097@319b1-319b4","613"],
["605","097@319b4-319b5","614"],
["606","097@319b6-319b6","615"],
["607","097@319b6-319b8","616"],
["608","097@319b8-320a7","617"],
["611","098@002a4-002b2","601"],
["612","098@002b3-003a4","768"],
["613a","098@003a4-003a6","655"],
["613b","098@003a6-004a2","803"],
["614a","098@004a3-056b8","632"],
["614b","098@056b8-058b3","602"],
["614c","098@058b3-060a5","544"],
["614d","098@060a5-061b1","765"],
["615","098@061b1-062a3","646"],
["616","098@062a3-063a6","635"],
["617a","098@063a6-064b2","739"],
["617b","098@064b2-064b7","550"],
["617c","098@064b7-065a2","740"],
["618","098@065a2-066a6","637"],
["619","098@066a6-067b4","597"],
["620","098@067b5-069a5","647"],
["621","098@069a5-070a6","636"],
["622","098@070a6-070b6","658"],
["623","098@070b6-072a5","638"],
["624","098@072a6-073b5","640"],
["625","098@073b6-075a6","549"],
["626","098@075a7-077b2","634"],
["627","098@077b2-082b2","642"],
["628","098@082b2-085b4","683"],
["629","098@085b4-086a1","639"],
["631","098@086b5-087b1","603"],
["632","098@087b1-089b3","661"],
["633","098@089b4-091b2","631"],
["634","098@091b2-093b4","542"],
["635","098@093b4-096a2","555"],
["636","098@096a2-110b3","659"],
["637","098@110b3-134a7","660"],
["638","098@134a8-137a3","662"],
["639","098@137a3-139a4","663"],
["640","098@139a4-142a1","664"],
["641","098@142a1-145b5","665"],
["642","098@145b5-148a5","666"],
["643","098@148a5-151b1","667"],
["644","098@151b1-153b7","668"],
["645","098@153b7-155b8","669"],
["646","098@155b8-157b5","737"],
["647","098@157b6-159a1","670"],
["648","098@159a2-159b2","671"],
["649","098@159b2-161a8","801"],
["650","098@161a8-170a5","682"],
["651","098@170a5-184b4","685"],
["652","098@184b4-198b3","686"],
["653","098@198b3-203b3","687"],
["654","098@203b3-204a4","688"],
["655","098@204a4-210a7","696"],
["656","098@210a8-211a4","695"],
["657","098@211a5-214b4","689"],
["658","098@214b4-217b4","690"],
["659a","098@217b4-222a3","692"],
["659b","098@222a3-223a5","693"],
["660","098@223a5-225a5","694"],
["661","098@225a5-228a1","697"],
["662","098@228a1-228a8","698"],
["663","098@228b1-228b7","700"],
["664","098@228b7-229a4","699"],
["665","098@229a4-236a2","701"],
["666a","098@236a2-237b4","702"],
["666b","098@237b4-237b6","703"],
["667","098@237b6-241a8","644"],
["668","098@241b1-241b6","568"],
["669","098@241b7-242a3","677"],
["670","098@242a3-243a1","673"],
["671","098@243a1-244b4","675"],
["672","098@244b5-247a6","674"],
["673","098@247a6-249b2","676"],
["674a","098@249b3-249b6","834"],
["675a","098@250a3-250a4","704"],
["675b","098@250a4-255b1","705"],
["675c","098@255b1-259b7","706"],
["676","098@259b7-261b6","707"],
["677","098@261b7-317a8","712"],
["678","099@001b1-273a7","717"],
["679","099@273b1-280b7","713"],
["680","099@285a1-286b8","718"],
["682","099@295a1-332a8","722"],
["684","100@001a8-011b7","727"],
["685","100@001b7-012a2","726"],
["683b","100@002a1-011a7","723"],
["686","100@012a2-014a5","724"],
["687","100@014a6-023a3","725"],
["688","100@023a4-030b5","732"],
["689","100@030b5-036a3","731"],
["690","100@036a3-038b1","730"],
["691","100@038b1-039b6","728"],
["692","100@039b6-040b3","764"],
["693","100@040b3-043b8","754"],
["694","100@044a1-045b4","736"],
["695","100@045b5-046a5","799"],
["696","100@046a5-047a3","600"],
["697","100@047a4-048b5","738"],
["698","100@048b5-049b8","733"],
["699","100@050a1-055b7","734"],
["700","100@055b7-056a3","735"],
["701","100@056a3-056b8","729"],
["702","100@056b8-058a8","756"],
["703","100@058b1-074b1","757"],
["704","100@074b1-076b5","758"],
["705a","100@076b6-079b7","759"],
["705b","100@079b7-080a1","760"],
["706","100@080a1-080b3","761"],
["707","100@080b3-082a4","762"],
["708","100@082a5-082b7","569"],
["709","100@082b7-083b3","769"],
["710","100@083b4-087b8","770"],
["711a","100@087b8-088b3","771"],
["711b","100@088b3-089a6","772"],
["712","100@089a7-090a6","774"],
["713","100@090a6-331a8","777"],
["714","101@001b1-034b8","775"],
["715","101@035a1-063a8","778"],
["716","101@063b1-064b5","780"],
["717","101@064b6-066a5","781"],
["718","101@066a5-096a4","782"],
["719","101@096a4-099b1","783"],
["720","101@099b1-100a6","784"],
["721","101@100a6-101a6","785"],
["722","101@101a6-126a1","790"],
["723a","101@126a1-128a3","791"],
["723b","101@128a3-129b2","792"],
["723c","101@129b3-130b1","793"],
["723d","101@130b2-132b2","794"],
["724","101@132b3-144b6","788"],
["726","101@145a2-146a4","633"],
["727","101@146a5-147b6","786"],
["728","101@147b6-148b3","787"],
["729","101@148b3-149a2","684"],
["730","101@149a2-149b5","795"],
["731","101@149b5-163b3","796"],
["733","101@171b6-172b5","798"],
["734","101@172b5-186b7","800"],
["735","101@186b7-193a2","802"],
["736","101@193a2-218b5","835"],
["737","101@218b6-246a3","836"],
["738","101@246a3-249a3","838"],
["739","101@249a3-303a1","837"],
["740a","101@303a2-306a1","839"],
["740b","101@306a2-327a4","840"],
["740c","101@327a4-327b5","841"],
["741","101@327b5-329b2","842"],
["742","101@329b3-330b6","843"],
["743","101@330b6-331a4","844"],
["744a","101@331a5-333a1","845"],
["744b","101@333a1-333b8","846"],
["745a","101@333b8-335b4","847"],
["745b","101@335b4-336a6","848"],
["745c","101@336a6-337a3","849"],
["745d","101@337a3-337b6","850"],
["745e","101@337b7-338a8","851"],
["745f","101@338b1-338b8","852"],
["745g","101@338b8-339a4","853"],
["745h","101@339a4-339b1","854"],
["745i","101@339b1-339b5","855"],
["745","101@339b5-341a5","856"],
["745k","101@341a5-341b3","857"],
["746","102@001b1-084a8","1118"],
["747","102@084b1-280b5","1119"],
["748","102@280b5-347a8","1120"],
["749","103@001b1-106a8","1121"],
["750","103@106b1-128a4","1122"],
["751","103@128a5-194b6","1123"],
["752","103@194b7-294b6","1124"],
["753","103@294b6-307a8","1125"],
["754","104@001b1-030b8","1126"],
["755","104@030b8-055b3","1127"],
["756","104@055b3-071b7","1128"],
["757","104@071b7-120a7","1129"],
["758","104@120a7-187a5","1130"],
["759a","104@187a5-188a5","1131"],
["759b","104@188a5-192a4","1132"],
["759c","104@192a4-193a4","1133"],
["759d","104@193a4-196a3","1134"],
["759e","104@196a3-197a6","1135"],
["759f","104@197a6-199a7","1136"],
["759g","104@199a7-202b1","1137"],
["759h","104@202b1-205b3","1138"],
["760","104@205b3-231a1","1139"],
["761","104@231a2-246a5","1140"],
["762","104@247a1-266a8","1141"],
["763","105@001b1-304a6","1142"],
["764","106@001b1-003b6","858"],
["765","106@003b6-053b6","859"],
["765","106@003b6-053b6","163"],
["766","106@053b6-055a6","860"],
["767","106@055a6-061a1","861"],
["768","106@061a1-062b8","862"],
["769","106@062b8-063a5","863"],
["770","106@063a6-067a8","864"],
["771","106@067a8-070b8","865"],
["772","106@070b8-073a5","866"],
["773","106@073a5-074b7","867"],
["774","106@074b7-076b1","868"],
["775","106@076b1-078a7","869"],
["776","106@078a8-083b6","870"],
["777","106@083b7-085a7","871"],
["778","106@085a7-085b1","872"],
["779","106@085b1-085b5","873"],
["780","106@085b5-085b6","874"],
["781","106@085b7-086a3","875"],
["782","106@086a3-086b1","876"],
["783","106@086b1-086b4","877"],
["784","106@086b4-087a3","878"],
["785","106@087a3-087a5","879"],
["786","106@087a5-087a8","880"],
["787","106@087a8-087b1","881"],
["789","106@087b1-087b3","882"],
["790","106@087b3-091a8","883"],
["791","106@091a8-094b1","884"],
["792","106@094b1-098b7","885"],
["793","106@098b7-101a5","886"],
["794","106@101a5-103a2","887"],
["795","106@103a2-106a2","888"],
["796","106@106a2-109b6","889"],
["797a","106@109b6-112b1","890"],
["797b","106@112b1-115b8","891"],
["798","106@115b8-118b1","892"],
["799","106@118b1-120b5","893"],
["800","106@120b5-121b4","894"],
["801","106@121b4-127b5","895"],
["802","106@127b5-134b1","896"],
["803","106@134b1-159b2","897"],
["804","106@159b2-161b6","898"],
["805","106@161b6-163a6","899"],
["806","106@163a6-165b5","900"],
["807","106@165b5-165b8","901"],
["808","106@165b8-166b1","902"],
["809","106@166b1-166b8","903"],
["810","106@167a1-167a7","904"],
["811","106@167a7-167b8","905"],
["812","106@168a1-168a2","906"],
["813","106@168a2-168a8","907"],
["814","106@168a8-168b5","908"],
["815","106@168b5-205b7","909"],
["816","106@205b7-213b3","910"],
["817","106@213b3-215b3","911"],
["818","106@215b3-217b2","912"],
["819","106@217b2-223a6","913"],
["820","106@223a6-225b8","914"],
["821","106@226a1-227b6","915"],
["822","106@227b6-230a2","916"],
["823","106@230a2-231a7","917"],
["824","106@231a7-232a4","918"],
["825","106@232a4-237a5","919"],
["826","106@237a5-238a1","920"],
["827a","106@238a1-239b1","921"],
["827b","106@239b1-239b7","922"],
["828","106@239b7-240a2","923"],
["829","106@240a2-240a6","924"],
["830","106@240a6-242a5","925"],
["831","106@242a5-251a5","926"],
["832","106@251a5-256a3","927"],
["833","106@256a4-256b7","928"],
["834","106@256b7-257b2","929"],
["835","106@257b3-257b8","930"],
["836","106@257b8-259a8","931"],
["837","106@259a8-260a5","932"],
["838","106@260a5-260b4","933"],
["839","106@260b4-262b1","934"],
["840","106@262b1-263b6","935"],
["841","106@263b6-265b7","936"],
["842","106@265b7-267a3","937"],
["843","106@267a3-268a2","938"],
["844","106@268a2-270a3","939"],
["845","106@270a3-271b2","940"],
["846","106@271b2-273a1","941"],
["847","106@273a1-273a8","942"],
["848","106@273a8-274a2","943"],
["849","106@274a2-274a4","944"],
["850","106@274a5-274a8","945"],
["851","106@274a8-274b2","946"],
["852","106@274b2-274b5","947"],
["853","106@274b5-275a3","948"],
["854","106@275a3-275a4","949"],
["855","106@275a4-275a7","950"],
["856","106@275a7-275b1","951"],
["857","106@275b1-275b3","952"],
["858","106@275b3-275b5","953"],
["859","106@275b5-275b6","954"],
["860","106@275b6-275b7","955"],
["861","106@275b7-276a1","956"],
["862","106@276a1-276a8","957"],
["863","107@001b1-027b1","958"],
["864","107@027b1-037b4","959"],
["865","107@037b4-038b5","960"],
["866","107@038b5-040a2","961"],
["867","107@040a2-041a4","962"],
["868","107@041a5-042a2","963"],
["869","107@042a3-042a4","964"],
["870","107@042a4-043a2","965"],
["871","107@043a2-046a1","966"],
["872","107@046a1-046b4","967"],
["873","107@046b4-047b4","968"],
["874","107@047b4-049a2","969"],
["875","107@049a3-051a2","970"],
["876","107@051a2-051a8","971"],
["877","107@051b1-052a1","972"],
["878","107@052a1-052b2","973"],
["879","107@052b3-052b5","974"],
["880","107@052b5-053b3","975"],
["881","107@053b3-073b7","976"],
["882","107@073b7-075b1","977"],
["883","107@075b1-077a3","978"],
["884","107@077a3-077b5","979"],
["885","107@077b5-079a2","980"],
["886","107@079a2-079b3","981"],
["887","107@079b3-080a3","982"],
["888","107@080a3-080b1","983"],
["889","107@080b2-082a3","984"],
["890","107@082a3-082b8","985"],
["891","107@082b8-085a2","986"],
["892","107@085a2-087b7","987"],
["893","107@087b7-088a7","988"],
["894","107@088a7-088b5","989"],
["895","107@088b5-088b8","990"],
["896","107@088b8-091a3","991"],
["897a","107@091a3-091b7","992"],
["897b","107@091b7-092a2","993"],
["898","107@092a2-101b5","994"],
["899","107@101b5-110a4","995"],
["900","107@110a4-114b3","996"],
["901","107@114b3-122a3","997"],
["902","107@122a3-126a8","998"],
["903","107@126b1-129a8","999"],
["904","107@129b1-130b1","1000"],
["905","107@130b1-131a3","1001"],
["906","107@131a3-131b8","1002"],
["907","107@131b8-133b1","1003"],
["908","107@133b2-134a2","1004"],
["909","107@134a2-134b7","1005"],
["910","107@134b7-135b6","1006"],
["911","107@135b6-136a6","1007"],
["912","107@136a6-136b3","1008"],
["913","107@136b3-139a7","1009"],
["914","107@139a7-141b4","1010"],
["915","107@141b5-143a1","1011"],
["916a","107@143a2-145a3","1012"],
["916b","107@145a4-145a5","1013"],
["917","107@145a5-145b3","1014"],
["918a","107@145b3-151a6","1015"],
["918b","107@151a6-154b8","1016"],
["919","107@154b8-155b3","1017"],
["920","107@155b3-156a4","1018"],
["921","107@156a4-160a1","1019"],
["922","107@160a2-161a7","1020"],
["923","107@161a8-162a7","1021"],
["924","107@162a8-162b6","1022"],
["925a","107@162b6-163a3","1023a"],
["925b","107@163a3-163a5","1023b"],
["926","107@163a5-163a8","1024"],
["927a","107@163a8-163b8","1025"],
["927b","107@163b8-164a2","1026"],
["928","107@164a2-164b3","1027"],
["929","107@164b3-164b5","1028"],
["930a","107@164b5-165a2","1029"],
["930b","107@165a3-165a4","1030"],
["931","107@165a4-166a3","1031"],
["932","107@166a4-166a5","1032"],
["933","107@166a5-166a7","1033"],
["934","107@166a7-166b1","1034"],
["935","107@166b2-167a2","1035"],
["936","107@167a2-167a4","1036"],
["937","107@167a4-167a5","1037"],
["938","107@167a5-167a8","1038"],
["939a","107@167a8-167b1","1039"],
["939b","107@167b1-167b3","1040"],
["939c","107@167b3-167b8","1041"],
["940a","107@167b8-168a1","1042"],
["940b","107@168a1-168a2","1043"],
["941a","107@168a2-168a4","1044"],
["941b","107@168a4-168a6","1045"],
["942","107@168a6-168a7","1046"],
["943","107@168a7-168b4","1047"],
["944","107@168b4-169a4","1048"],
["945a","107@169a4-169a7","1049"],
["945b","107@169a7-169b2","1050"],
["946a","107@169b2-169b4","1051"],
["946b","107@169b4-169b7","1052"],
["947a","107@169b7-170a2","1053"],
["947b","107@170a2-170a4","1054"],
["948a","107@170a5-170a7","1055"],
["948b","107@170a8-170b3","1056"],
["948c","107@170b3-170b6","1057"],
["949a","107@170b6-171a1","1058"],
["949b","107@171a1-171a3","1059"],
["950a","107@171a3-171a5","1060"],
["950b","107@171a5-171a7","1061"],
["951a","107@171a8-171b2","1062"],
["951b","107@171b2-171b4","1063"],
["952","107@171b4-171b6","1064"],
["953","107@171b6-171b8","1065"],
["954","107@171b8-172a1","1066"],
["955","107@172a1-172a2","1067"],
["956","107@172a2-172a4","1068"],
["957","107@172a4-172a5","1069"],
["958","107@172a5-172a7","1070"],
["959a","107@172a7-172a8","1071"],
["959b","107@172a8-172b2","1072"],
["960","107@172b2-185b5","1073"],
["961","107@185b5-194a3","1074"],
["962","107@194a4-206b2","1075"],
["963","107@206b2-211a2","1076"],
["964","107@211a2-211b3","1077"],
["965","107@211b3-212a5","1078"],
["966","107@212a5-215a4","1079"],
["967","107@215a4-215b3","1080a"],
["968","107@215b3-215b4","1080b"],
["970","107@215b4-215b5","1080d"],
["972","107@215b5-215b6","1080f"],
["973","107@215b6-215b7","1081"],
["974","107@215b7-216a1","1082"],
["975","107@216a1-216a4","1083"],
["976","107@216a4-216a8","1084"],
["977a","107@216b1-216b6","1085"],
["977b","107@216b6-218a7","1086"],
["978","107@218a8-220b4","1087"],
["979","107@220b4-222b5","1088"],
["980","107@222b6-222b8","1089"],
["981","107@223a1-226a6","1090"],
["982","107@226a7-227a2","1091"],
["983a","107@227a2-227b1","1092"],
["983b","107@227b1-227b6","1093"],
["984","107@227b6-228a4","1094"],
["985","107@228a5-229b5","1095"],
["986","107@229b6-229b7","1096"],
["987","107@229b8-230b3","1097"],
["988","107@230b3-230b7","1098"],
["989","107@230b8-231b6","1099"],
["990","107@231b7-235b2","1100"],
["991","107@235b2-237a4","1101"],
["992","107@237a4-240a2","1102"],
["993","107@240a3-241a2","1103"],
["994","107@241a2-242a3","1104"],
["995","107@242a3-243a5","1105"],
["996","107@243a5-243b2","1106"],
["997","107@243b2-244a5","1107"],
["998","107@244a5-245b4","1108"],
["999","107@245b4-246a3","1109"],
["1000","107@246a4-247a5","1110"],
["1001","107@247a5-247b6","1111"],
["1002","107@247b6-248a3","1112"],
["1003","107@248a3-248a6","1113"],
["1004","107@248a6-249b8","1114"],
["1005","107@250a1-250a6","1115"],
["1007","109@001a1-021b7","1146"]];
jPedurma.rcode="J";
module.exports=jPedurma;
});
require.register("pedurmacat-dataset/hPedurma.js", function(exports, require, module){
var hPedurma=[["1","001@001b1-380a7","1"],
["1","002@001b1-505a3","1"],
["1","003@001b1-435a7","1"],
["1","004@001b1-436a2","1"],
["2","005@001b1-030a6","2"],
["3","005@030a6-413a7","3"],
["3","006@001b1-402a1","3"],
["3","007@001b1-423a6","3"],
["3","008@001b1-386a5","3"],
["4","009@001b1-035a6","4"],
["5","009@035a6-460a7","5"],
["6","010@001b1-467a3","6"],
["6","011@001b1-509a7","6"],
["7","012@001b1-139a6","7"],
["8","012@139a7-448a1","8"],
["8","013@001b1-453a3","8"],
["9","014@001b1-544a1","25"],
["9","015@001b1-535a7","25"],
["9","016@001b1-564a6","25"],
["9","017@001b1-506a5","25"],
["9","018@001b1-544a2","25"],
["9","019@001b1-536a6","25"],
["9","020@001b1-535a3","25"],
["9","021@001b1-563a7","25"],
["9","022@001b1-521a7","25"],
["9","023@001b1-528a3","25"],
["9","024@001b1-540a3","25"],
["9","025@001b1-521a7","25"],
["10","026@001b1-558a6","26"],
["10","027@001b1-548a6","26"],
["10","028@001b1-537a7","26"],
["11","029@001b1-450a4","29"],
["12","030@001b1-453a5","27"],
["12","031@001b1-449a3","27"],
["12","032@001b1-317a5","27"],
["13","032@317a5-456a6","28"],
["13","033@001b1-460a6","28"],
["14","034@001b1-123b1","31"],
["15","034@123b2-162b7","41"],
["16","034@163a1-189a2","32"],
["17","034@189a2-215a4","30"],
["18","034@215a4-235b7","33"],
["19","034@236a1-246a7","34"],
["20","034@246a7-248b7","42"],
["21","034@248b7-252b2","35"],
["22","034@252b2-253a1","40"],
["23","034@253a1-255a5","36"],
["24","034@255a5-257b5","39"],
["25","034@257b5-259a6","37"],
["26","034@259a6-261a3","38"],
["27","034@261a3-263a3","43"],
["28","034@263a3-264b6","44"],
["29","034@264b6-265b4","45"],
["30","034@265b4-266b1","46"],
["31","034@266b1-267a7","47"],
["32","034@268a1-273b1","48"],
["33","034@273b1-388a5","49"],
["34","034@388a5-403b5","50"],
["35","034@403b5-409a6","51"],
["36","034@409a6-420a2","52"],
["37","034@420a2-421b2","53"],
["38","034@421b2-430a5","54"],
["39","034@430a5-434b7","55"],
["40","034@434b7-438b3","56"],
["41","034@438b3-440a3","57"],
["42","034@440a3-441a2","58"],
["43","034@441a2-441b6","59"],
["44","034@441b6-443a3","60"],
["45","035@001b1-068b3","62"],
["46","035@068b3-151a7","63"],
["47","035@151a7-313b7","64"],
["48","035@313b7-367a4","65"],
["49","035@367a4-418a7","66"],
["50","036@001b1-115a1","67"],
["51","036@115a2-229b1","68"],
["52","036@229b1-268a4","69"],
["53","036@268a4-303b7","70"],
["54","036@303b7-322a4","71"],
["55","036@322a4-420a7","72"],
["56","037@001b1-380b5","73"],
["57","037@380b5-399b2","75"],
["58","037@399b2-448a5","74"],
["59","038@001b1-085a5","76"],
["60","038@085a5-358a7","77"],
["61","038@358a7-458b3","78"],
["62","038@458b3-508a4","79"],
["63","039@001b1-050b6","80"],
["64","039@050b6-075a1","81"],
["65","039@075a1-102a4","82"],
["66","039@102a4-152b6","83"],
["67","039@152b6-222a2","84"],
["68","039@222a2-246a2","85"],
["69","039@246a2-278b7","86"],
["70","039@278b7-319a2","87"],
["71","039@319a2-339a5","88"],
["72","039@339a5-355a2","89"],
["73","039@355a2-372a3","90"],
["74","039@372a3-381b3","91"],
["75","039@381b3-387a1","92"],
["76","039@387a1-411b1","93"],
["77","039@411b1-442a7","94"],
["78","039@442a7-449a4","95"],
["79","039@449a4-478a7","96"],
["80","040@001b1-075b5","97"],
["81","040@075b5-079a6","98"],
["82","040@079a6-139b7","99"],
["83","040@139b7-175b3","100"],
["84","040@175b3-189a5","101"],
["85","040@189a5-207a3","102"],
["86","040@207a3-211a5","103"],
["87","040@211a6-260b5","104"],
["88","040@260b5-298a4","105"],
["89","040@298a4-309a2","106"],
["90","040@309a2-350a5","107"],
["91","040@350a5-418a6","108"],
["92","040@418a6-454a4","109"],
["93","040@454a4-488a4","110"],
["94","041@001b1-378a4","61"],
["94","042@001b1-359a4","61"],
["94","043@001b1-386a3","61"],
["94","044@001b1-370a7","61"],
["94","045@001b1-390a7","61"],
["94","046@001b1-341a6","61"],
["98","046@391a1-416a2","114"],
["95","047@001b1-470a4","111"],
["96","048@001b1-352a6","112"],
["97","048@352a6-391a1","113"],
["99","048@416a2-446a3","115"],
["100","048@446a3-520a2","163"],
["101","048@520a2-522a3","116"],
["102","049@001b1-483a4","117"],
["103","049@483a4-535a4","118"],
["104","050@001b1-353b1","119"],
["105","050@353b1-426a3","120"],
["106","050@426a3-442b2","121"],
["107","050@442b2-444b2","122"],
["108","050@444b2-447a4","123"],
["109","051@001b1-087b7","124"],
["110","051@087b7-307a4","125"],
["111","051@307a4-462a2","126"],
["112","051@462a2-473a7","127"],
["113","052@001b1-086a2","128"],
["114","052@086a2-209b6","129"],
["115","052@209b7-474a7","130"],
["116","053@001b1-285b2","131"],
["117","053@285b3-307b6","132"],
["118","053@307b6-314b2","133"],
["119","053@314b2-388a5","134"],
["120","053@388a5-451b4","135"],
["121","053@451b4-464a5","136"],
["122","054@001b1-222b5","138"],
["123","054@222b5-225b6","139"],
["124","054@225b7-226b5","140"],
["125","054@226b5-321b6","141"],
["126","054@321b6-443b2","142"],
["127","054@443b2-444a3","143"],
["128","054@444a3-448a7","144"],
["129","055@001b1-269b4","145"],
["130","055@269b4-275b2","146"],
["131","055@275b2-334a5","147"],
["132","055@334a5-367a2","148"],
["133","055@367a2-403b7","149"],
["134","055@403b7-505a2","150"],
["135","056@001b1-106b4","151"],
["136","056@106b5-186a5","152"],
["137","056@186a5-241a4","154"],
["138","056@241a4-276a4","153"],
["139","056@276a5-289b2","155"],
["140","056@289b3-432a6","156"],
["141","056@432a7-450a3","157"],
["142","056@450a3-464a1","158"],
["143","056@464a1-465a3","159"],
["146","057@001a7-057a3","162"],
["144","057@001b1-010b6","160"],
["145","057@010b6-011a7","161"],
["147","057@057a3-153b6","164"],
["148","057@153b6-319a5","165"],
["149","057@319a5-460b7","166"],
["150","057@460b7-462a1","167"],
["151","057@462a1-463a2","168"],
["152","057@463a2-484a2","169"],
["153","058@001b1-180a3","170"],
["154","058@180a3-303a2","171"],
["155","058@303a2-313b1","172"],
["156","058@313b2-314a4","173"],
["157","058@314a4-383a3","174"],
["158","058@383a3-483a5","175"],
["159","059@001b1-016a2","176"],
["160","059@016a2-034b7","177"],
["161","059@034b7-159a7","178"],
["162","059@159a7-221a3","179"],
["163","059@221a3-227b4","180"],
["164","059@227b4-252b1","181"],
["165","059@252b1-264b5","182"],
["166","059@264b5-271a6","183"],
["167","059@271a6-277a5","184"],
["168","059@277a5-333b5","185"],
["169","059@333b5-412a5","186"],
["170","059@412a6-490a3","187"],
["171","059@490a3-495a4","188"],
["17","059@495a5-502a2","189"],
["173","060@001b1-008a5","190"],
["175","060@001b5-122b5","192"],
["174","060@008a5-011b5","191"],
["176","060@122b5-270b1","193"],
["177","060@270b1-376b3","194"],
["178","060@376b3-377b5","195"],
["179","060@377b6-384a2","196"],
["180","060@384a2-420b4","197"],
["181","060@420b4-469a4","198"],
["182","061@001b1-122b7","199"],
["183","061@122b7-151a5","200"],
["184","061@151a5-153a6","201"],
["185","061@153a6-167a3","202"],
["186","061@167a3-226a2","203"],
["187","061@226a2-248b5","204"],
["188","061@248b5-300b6","205"],
["189","061@300b6-314a6","206"],
["190","061@314a6-316b5","207"],
["191","061@316b5-356a7","208"],
["192","061@356a7-386a5","209"],
["193","061@386a5-390a5","210"],
["194","061@390a6-396b7","211"],
["195","061@396b7-397b6","212"],
["196","061@397b7-420a7","213"],
["197","061@420a7-428b1","214"],
["198","061@428b1-433b5","215"],
["199","061@433b5-468a7","216"],
["200","061@468b1-478b3","217"],
["201","061@478b3-486a3","218"],
["202","062@001b1-097a3","219"],
["203","062@097a3-119b7","220"],
["204","062@119b7-125a2","221"],
["205","062@125a2-142a3","222"],
["206","062@142a3-144b6","223"],
["207","062@144b6-147a3","224"],
["208","062@147a4-169b1","225"],
["209","062@169b1-173b4","226"],
["210","062@173b4-180a3","227"],
["211","062@180a3-192b1","228"],
["212","062@192b1-195a2","229"],
["213","062@195a2-196a6","230"],
["218","062@413a7-438a7","235"],
["219","062@438a7-461a1","236"],
["220","062@461a1-477a6","237"],
["221","063@001b1-130b4","238"],
["222","063@130b4-141a3","239"],
["223","063@141a3-208b4","240"],
["224","063@208b4-267a6","241"],
["225","063@267a6-282a5","242"],
["226","063@282a5-284a5","243"],
["227","063@284a5-287a2","244"],
["228","063@287a2-305b5","245"],
["229","063@305b5-364a4","246"],
["230","063@364a4-428b2","247"],
["231","063@428b2-476a4","248"],
["232","064@001b1-180a6","249"],
["233","064@180a6-337b7","250"],
["234","064@337b7-386a3","251"],
["235","064@386a3-392b5","252"],
["236","064@392b5-412a7","253"],
["237","064@412a7-448b3","254"],
["238","064@448b3-466a7","255"],
["239","065@001b1-154a2","256"],
["240","065@154a2-371b5","257"],
["241","065@371b6-465a1","258"],
["242","065@465a1-467b1","259"],
["243","065@467b1-472a7","260"],
["244","066@001b1-023a6","261"],
["245","066@023a6-041b7","262"],
["246","066@041b7-050a3","263"],
["247","066@050a3-064b6","264"],
["248","066@064b6-070a6","265"],
["249","066@070a6-090a3","266"],
["250","066@090a3-091a4","267"],
["251","066@091a4-092a1","268"],
["252","066@092a1-093a1","269"],
["253","066@093a2-106b7","270"],
["254","066@107a1-108b5","271"],
["255","066@108b5-109b1","272"],
["256","066@109b1-114b6","273"],
["257","066@114b6-145a3","274"],
["258","066@145a3-385a5","275"],
["259","066@385a5-595a7","1117"],
["260","067@001b1-024a2","276"],
["261","067@024a2-030b7","277"],
["262","067@030b7-060b4","278"],
["263","067@060b4-104b7","279"],
["264","067@105a1-235a4","280"],
["265","067@235a4-423a2","281"],
["266","067@423a2-506a4","282"],
["267","067@506a4-544a5","283"],
["268","068@001b1-052b7","284"],
["269","068@052b7-058a6","285"],
["270","068@058a6-060b2","286"],
["271","068@060b2-069b7","287"],
["272","068@069b7-075b4","288"],
["273","068@075b4-080b7","289"],
["274","068@080b7-088a1","290"],
["275","068@088a1-093a1","291"],
["276","068@093a1-101b6","292"],
["277","068@101b6-114b7","293"],
["278","068@114b7-122b7","294"],
["279","068@123a1-127a7","295"],
["280","068@127a7-130b1","296"],
["281","068@130b1-131a5","297"],
["282","068@131a5-131b3","298"],
["283","068@131b3-131b6","299"],
["284","068@131b6-132a7","300"],
["285","068@132b1-133b5","301"],
["286","068@133b5-164a6","302"],
["287","068@164a6-168a6","303"],
["288","068@168a6-171a4","304"],
["289","068@171a4-516a4","305"],
["289","069@001b1-478a6","305"],
["289","070@001b1-521a6","305"],
["289","071@001b1-355b7","305"],
["291","071@445a1-467b4","306"],
["292","071@467b4-476b2","307"],
["293","071@476b2-482a4","308"],
["294","071@482a4-495a7","309"],
["295","071@495a7-501a2","310"],
["296","071@501a2-503b3","311"],
["297","071@503b3-517b2","312"],
["298","071@517b2-549b1","313"],
["299","071@549b1-551b6","314"],
["300","071@551b6-559a1","315"],
["301","071@559a1-562b3","316"],
["302","071@562b3-564a2","317"],
["303","071@564a2-565a6","318"],
["304","072@001b1-193b3","319"],
["305","072@193b3-196a2","320"],
["306","072@196a2-197a6","321"],
["307","072@197a6-201b1","322"],
["308","072@201b1-202b3","323"],
["309","072@202b3-214a2","324"],
["310","072@214a3-223b7","325"],
["311","072@223b7-237b3","326"],
["312","072@237b4-238b4","327"],
["313","072@238b4-241a2","328"],
["315","072@241b4-242a5","329"],
["316","072@242a6-248a7","330"],
["317","072@248a7-252a4","331"],
["318","072@252a4-260b2","332"],
["319","072@260b3-261b4","333"],
["320","072@261b4-262b6","334"],
["321","072@262b6-289a1","335"],
["322","072@289a1-297a7","336"],
["323","072@297a7-302a4","337"],
["324","072@302a4-305a1","338"],
["325","072@305a1-308b6","339"],
["326","072@308b6-313b3","340"],
["327","072@313b3-313b6","341"],
["328","072@313b6-314a5","342"],
["329","072@314a6-320b7","343"],
["333","072@393b1-395b4","347"],
["334","072@395b5-396b6","348"],
["335","072@396b6-397b4","349"],
["336","072@397b4-403a2","350"],
["337","072@403a2-409b1","351"],
["338","072@409b1-413b4","352"],
["339","072@413b4-418b3","353"],
["340","072@418b3-420a2","354"],
["341","072@420a2-423a1","355"],
["342","072@423a1-425b6","356"],
["343","072@425b6-455a7","359"],
["344","072@455a7-490b5","357"],
["345","072@490b5-510a2","358"],
["346","073@001b1-470a7","360"],
["346","074@001b1-207b4","360"],
["347","074@207b4-476b2","361"],
["348","074@476b2-478b7","362"],
["349","074@478b7-489b7","383"],
["350","074@489b7-496a5","384"],
["351","075@001b1-446a1","363"],
["352","075@446a1-450a1","364"],
["353","075@450a1-452b7","365"],
["354","075@452b7-464a5","366"],
["355","076@001b1-034b1","367"],
["360","076@011a5-135b6","372"],
["356","076@034b1-049a6","368"],
["357","076@049a7-079a4","369"],
["358","076@079a4-087b7","370"],
["359","076@087b7-111a4","371"],
["361","076@135b6-313b7","373"],
["362","076@314a1-330b7","374"],
["363","076@331a1-342a6","375"],
["364","076@342a6-349a7","376"],
["365","076@349a7-367b7","377"],
["368","077@001b1-525a4","137"],
["368","078@001b1-529a7","137"],
["369","079@001b1-019a3","385"],
["370","079@019a4-028b5","386"],
["371","079@028b5-186b3","387"],
["372","079@186b3-209a6","388"],
["374","079@237b4-240a5","389"],
["375","079@240a5-246a5","390"],
["376","079@246a5-307a5","391"],
["377","079@307a5-334b7","392"],
["378a","079@334b7-353b3","440a"],
["378b","079@353b3-379a1","440b"],
["379","079@379a1-433b1","441"],
["380","079@433b1-472b7","442"],
["381","079@472b7-482a1","443"],
["382","080@001b1-066a7","444"],
["383","080@066a7-076a2","445"],
["384","080@076a2-131b4","393"],
["385","080@131b4-327b6","394"],
["386","080@327b6-518b7","395"],
["387","080@519a1-539a3","396"],
["388a","080@539a3-554b7","403a"],
["388b","080@554b7-557a5","403b"],
["389","081@001b1-071b7","398"],
["390","081@072a1-266a3","397"],
["391","081@266a3-314a1","399"],
["392","081@314a1-325b3","402"],
["393","081@325b3-326b1","404"],
["394","081@326b2-342b3","400"],
["395","081@342b3-354b2","401"],
["396","081@354b2-482a6","405a"],
["397","081@482a6-520b4","405b"],
["398","081@520b4-566a7","439"],
["399","082@001b1-005b6","437"],
["400","082@005b6-043b1","446"],
["401","082@043b1-049a4","447"],
["402","082@049a4-056b4","448"],
["403","082@056b4-064b2","449"],
["404","082@064b2-135b3","450"],
["405","082@135b3-174a2","451"],
["406","082@174a3-237b3","452"],
["407","082@237b3-254b2","454"],
["408","082@254b2-257b6","456"],
["409","082@257b6-261a6","455"],
["410","082@261a7-278a7","457"],
["411","082@278a7-299b5","459"],
["412","082@299b5-301a6","460"],
["413","082@301a6-305a1","461"],
["414","082@305a1-369a7","462"],
["415","082@369a7-431b6","453"],
["416a","082@431b7-521b2","465"],
["416b","082@521b2-536a6","466"],
["417","083@001b1-105b1","468"],
["418","083@105b1-181b1","467"],
["419","083@181b1-187b3","470"],
["420","083@187b3-193b4","469"],
["421","083@193b4-196a4","477"],
["422","083@196a4-202b2","478"],
["423","083@202b2-208a6","479"],
["424","083@208a6-212b1","480"],
["425","083@212b1-234b5","481"],
["426","083@234b5-243a3","482"],
["427","083@243a4-247b1","483"],
["428","083@247b1-247b3","484"],
["429","083@247b3-284a2","485"],
["430","083@284a2-287a3","486"],
["431","083@287a3-347a5","490"],
["432","083@347a5-373a2","491"],
["433","083@373a2-389a7","497"],
["434","083@389a7-407a7","492"],
["435","083@407a7-416b6","494"],
["436","083@416b6-422a3","493"],
["437","083@422a3-422b6","495"],
["439","083@423a5-424b6","633"],
["440","083@424b6-468b1","499"],
["442","083@516a1-520a7","501"],
["443","083@520a7-522b1","487"],
["444","083@522b1-552b5","488"],
["445","083@552b5-557a3","489"],
["446","084@001b1-092b5","502"],
["447","084@092b5-320a1","504"],
["448","084@320a1-520a5","505"],
["449","085@001b1-014b5","506"],
["450","085@014b5-089b5","507"],
["451","085@089b5-096a7","511"],
["452","085@096a7-097a2","509"],
["453","085@097a2-135b6","512"],
["454","085@135b6-288a2","513"],
["455","085@288a2-299a3","514"],
["456","085@299a3-353b5","517"],
["457","085@353b5-412b5","508"],
["458","085@412b5-493a7","510"],
["459","086@001b1-120b6","515"],
["460","086@120b6-122a7","516"],
["462","086@176b1-341a4","519"],
["463","086@341a4-354a6","523"],
["464","086@354a6-362a5","524"],
["465","086@362a5-456a6","520"],
["466","087@001b1-258a4","521"],
["467","087@258a4-265a6","525"],
["468","087@265a7-267a2","779"],
["469","087@267a2-273a5","526"],
["470","087@273a5-380b3","527"],
["471","087@380b3-419a3","528"],
["472","087@419a3-433b2","529"],
["473","087@433b2-437a2","530"],
["474","087@437a3-437a4","531"],
["475","087@437a4-437b1","834"],
["476","087@437b1-473b5","532"],
["477","087@473b5-503a6","534"],
["478","087@503a6-504b2","535"],
["479","087@504b2-514a5","533"],
["480","088@001b1-008a6","656"],
["481","088@008a6-008b1","559"],
["483","088@008b7-009a5","680"],
["484","088@009a5-009b2","711"],
["485","088@009b2-009b3","562"],
["486","088@009b3-012b7","540"],
["487","088@012b7-015a2","541"],
["488","088@015a2-017a6","539"],
["489","088@017a7-022b2","537"],
["490","088@022b3-028b7","538"],
["491","088@028b7-029a7","708"],
["492","088@029b1-029b4","709"],
["493","088@029b4-030a1","561"],
["494","088@030a1-030a3","563"],
["495","088@030a3-036a2","543"],
["496","088@036a2-040b5","570"],
["497","088@040b5-042a5","672"],
["498","088@042a5-045a1","556"],
["499","088@045a2-047a2","557"],
["500","088@047a2-053b2","558"],
["501","088@053b3-448b3","571"],
["502","088@448b3-468a6","572"],
["503","088@468a6-469a6","579"],
["504","088@469a6-469b7","580"],
["505","088@469b7-470b2","573"],
["506","088@470b2-471a7","574"],
["507","088@471b1-471b3","576"],
["508","088@471b3-472a3","577"],
["509","088@472a3-472a7","575"],
["510","088@472a7-472b6","578"],
["511","088@472b7-475b5","581"],
["512","088@475b5-478a5","582"],
["513","089@001b1-215b2","583"],
["514","089@215b2-405b1","584"],
["515","089@405b1-504a7","585"],
["516","089@504a7-543a4","586"],
["517","090@001b1-052a6","587"],
["518","090@052a6-085b3","589"],
["519","090@085b3-103a7","590"],
["520","090@103a7-112b6","591"],
["521","090@112b6-114b1","592"],
["523","090@126a3-158a4","594"],
["524","090@158a4-159b5","766"],
["525","090@159b5-160b5","767"],
["526","090@160b6-173b1","789"],
["528","090@174b2-175b4","599"],
["529","090@175b4-178a6","598"],
["530","090@178a6-179a5","763"],
["531","090@179a5-185a2","596"],
["532","090@185a2-193b6","595"],
["533","090@193b6-194b1","588"],
["534","090@194b1-202b4","554"],
["535","090@202b4-204b4","522"],
["536","090@204b4-211b4","623"],
["537","090@211b4-218b5","625"],
["538","090@218b5-230a7","622"],
["539","090@230a7-233b2","626"],
["540","090@233b2-235a5","624"],
["541","090@235a5-246b4","618"],
["542","090@246b4-255b2","619"],
["543","090@255b2-262b3","620"],
["544","090@262b3-270a2","621"],
["545","090@270a2-284a3","627"],
["546","090@284a3-284b7","650"],
["547","090@284b7-285a2","652"],
["548","090@285a2-285b5","653"],
["549","090@285b5-286a6","648"],
["550","090@286a6-287b5","649"],
["551","090@287b5-288b4","657"],
["552","090@288b5-289b3","643"],
["553","090@289b3-290a5","741"],
["554","090@290a5-291b1","673"],
["555","090@291b1-292b1","787"],
["556","090@292b1-309a1","536"],
["557","090@309a1-319a4","629"],
["558","090@319a4-319b6","630"],
["559","090@319b6-323b1","545"],
["560","090@323b1-324b6","546"],
["561","090@324b6-325a3","547"],
["562","090@325a3-325a7","628"],
["563","090@325a7-325b2","1070"],
["564","090@325b2-326b5","636"],
["565","090@326b6-326b7","681"],
["566","090@326b7-327a3","679"],
["567","090@327a3-327a6","678"],
["568","090@327a6-327b2","742"],
["569","090@327b3-327b5","743"],
["570","090@327b5-328a2","744"],
["571","090@328a2-328a6","745"],
["572","090@328a6-328b3","746"],
["573","090@328b3-328b5","748"],
["574","090@328b5-329b1","564"],
["575","090@329b1-330a2","710"],
["576","090@330a2-330b2","601"],
["577","090@330b2-331a6","768"],
["578","090@331a6-331b3","751"],
["579","090@331b3-332a3","773"],
["580","090@332a3-332a7","565"],
["581","090@332a7-411b6","632"],
["582","090@411b6-414b3","602"],
["583","090@414b3-417b1","544"],
["584","090@417b1-419b5","765"],
["585","090@419b5-420b6","646"],
["586","090@420b6-423a6","635"],
["587","090@423a6-425a7","637"],
["588","090@425a7-426a2","550"],
["589","090@426a2-426a6","740"],
["590","090@426a6-428b1","739"],
["591","090@428b1-430b5","597"],
["592","090@430b5-432b7","647"],
["593","090@432b7-433b3","658"],
["594","090@433b3-436b6","638"],
["595","090@436b6-438b7","640"],
["596","090@438b7-441a4","549"],
["597","090@441a4-444b1","634"],
["598","090@444b1-452a6","642"],
["599","090@452a6-457a5","683"],
["600","090@457a5-457b5","639"],
["601","090@457b5-458b5","552"],
["602","090@458b6-459b7","603"],
["603","090@459b7-463a4","661"],
["604","090@463a4-466a5","631"],
["605","090@466a5-469b3","542"],
["606","090@469b3-473a5","555"],
["607","090@473a5-473a6","654"],
["608","090@473a6-473b6","749"],
["609","090@473b6-476a5","762"],
["610","090@476a5-476a7","655"],
["611","091@001b1-025b7","659"],
["612","091@025b7-062a4","660"],
["613","091@062a4-066a1","662"],
["614","091@066a1-068b5","663"],
["615","091@068b5-073b2","664"],
["616","091@073b2-079b3","665"],
["617","091@079b3-083b6","666"],
["618","091@083b6-089a1","667"],
["619","091@089a1-092b3","668"],
["620","091@092b3-095b6","669"],
["621","091@095b7-097b6","670"],
["622","091@097b6-098b5","671"],
["623","091@098b5-101b4","801"],
["624","091@101b4-124b1","685"],
["625","091@124b1-147b5","686"],
["626","091@147b5-156a3","687"],
["627","091@156a3-157a1","688"],
["628","091@157a1-167a3","696"],
["629","091@167a3-168b1","695"],
["630","091@168b1-173a2","690"],
["631","091@173a2-177a5","691"],
["632","091@177a5-184a1","692"],
["633a","091@184a1-185b3","693"],
["633b","091@185b3-188b7","694"],
["634","091@188b7-192b1","697"],
["635","091@192b1-193a5","698"],
["636","091@193a5-193b5","700"],
["637","091@193b5-194a4","699"],
["638","091@194a4-205a2","701"],
["639","091@205a2-207b2","702"],
["640","091@207b2-207b5","703"],
["641","091@207b5-213b7","644"],
["642","091@213b7-214b2","568"],
["643","091@214b2-215a2","677"],
["644","091@215a2-217b7","675"],
["645","091@218a1-222a5","674"],
["646","091@222a5-226a1","676"],
["647","091@226a1-234b2","705"],
["648","091@234b2-241b5","706"],
["649","091@241b5-244b5","707"],
["650","091@244b5-244b6","704"],
["651","091@244b7-336b5","712"],
["652","091@336b5-340a1","718"],
["653","091@340a1-392b3","721"],
["654","091@392b3-454b5","722"],
["655","091@454b5-468b1","723"],
["656","091@468b1-472a3","724"],
["657","091@472a3-472a7","726"],
["658","091@472a7-476a2","719"],
["659","091@476a2-481a6","720"],
["660","091@481a6-483a3","728"],
["661","091@483a4-485b2","753"],
["663","092@001b1-003a2","727"],
["664","092@003a2-015a3","732"],
["665","092@015a4-023b7","731"],
["666","092@023b7-027b4","730"],
["667","092@027b4-028b7","764"],
["668","092@028b7-031b7","736"],
["669","092@032a1-032b4","799"],
["670","092@032b5-035a6","738"],
["671","092@035a6-037a6","733"],
["672","092@037a6-047a2","734"],
["673","092@047a2-047a7","735"],
["674","092@047a7-048b4","729"],
["675","092@048b4-051a6","756"],
["676","092@051a6-075b6","757"],
["677","092@075b6-079a5","758"],
["678","092@079a6-083b3","759"],
["679","092@083b4-092a3","870"],
["680","092@092a3-092a5","760"],
["681","092@092a5-092b6","761"],
["682","092@092b6-101b5","713"],
["683","092@101b5-102b6","769"],
["684","092@102b6-109a4","770"],
["685","092@109a4-110a4","771"],
["686","092@110a4-111a3","772"],
["687","092@111a3-157b1","775"],
["688","092@157b1-197a5","778"],
["689","092@197a5-429a2","717"],
["689","093@001b1-360b7","717"],
["690","093@361a1-362a7","774"],
["691","093@362a7-457a6","777"],
["691","094@001b1-283a3","777"],
["692","094@283a4-285a2","780"],
["693","094@285a3-287a5","781"],
["694","094@287a5-335a1","782"],
["695","094@335a1-339b4","783"],
["696","094@339b4-340b6","784"],
["697","094@340b6-342a4","785"],
["698","094@342a4-375a3","790"],
["699","094@375a3-377b6","791"],
["700","094@377b6-380b1","794"],
["701","094@380b1-382a6","792"],
["702","094@382a6-383b1","793"],
["703","094@383b1-385b2","786"],
["704","094@385b2-401b2","788"],
["705","094@401b2-402a5","684"],
["706","094@402a5-421a5","797a"],
["707","095@001b1-014a5","797b"],
["708","095@014a5-015b4","798"],
["709","095@015b4-016b2","569"],
["710","095@016b2-039a6","800"],
["711","095@039a6-420a3","755"],
["711","096@001b1-096a6","755"],
["712","096@096a6-097a6","795"],
["713","096@097a6-117b7","796"],
["714","096@117b7-126a6","802"],
["715","096@126a6-127b1","803"],
["716","096@127b1-127b3","804"],
["717","096@127b3-127b5","805"],
["718","096@127b5-128a3","806"],
["719","096@128a3-128b3","807"],
["720","096@128b3-128b6","808"],
["721","096@128b6-129a3","809"],
["722","096@129a3-129a7","810"],
["723","096@129a7-129b1","811"],
["724","096@129b1-130a4","567"],
["725","096@130a5-132a5","548"],
["726","096@132a5-132a7","813"],
["727","096@132a7-132b2","814"],
["728","096@132b2-132b4","815"],
["729","096@132b4-132b7","816"],
["730","096@132b7-133a2","817"],
["731","096@133a2-133a3","818"],
["732","096@133a3-133a7","819"],
["733","096@133b1-133b2","820"],
["734","096@133b2-133b5","821"],
["735","096@133b5-133b7","822"],
["736","096@133b7-134a3","823"],
["737","096@134a3-134b1","824"],
["738","096@134b1-134b3","825"],
["739","096@134b3-134b4","826"],
["740","096@134b5-134b7","827"],
["741","096@134b7-135a2","828"],
["742","096@135a2-135a4","829"],
["743","096@135a4-135a6","830"],
["744","096@135a6-135b1","831"],
["745","096@135b1-135b3","832"],
["746","096@135b3-135b6","833"],
["747","096@135b6-136a3","604"],
["748","096@136a3-136b1","605"],
["749","096@136b1-136b4","606"],
["750","096@136b4-137a1","607"],
["751","096@137a1-137b3","608"],
["752","096@137b3-137b4","609"],
["753","096@137b4-138a1","610"],
["754","096@138a1-138a4","611"],
["755","096@138a4-138a6","612"],
["756","096@138a6-138b2","613"],
["757","096@138b2-138b4","614"],
["758","096@138b4-138b5","615"],
["759","096@138b6-138b7","616"],
["760","096@138b7-139b3","617"],
["761","096@139b3-177a5","835"],
["762","096@177a6-220a7","836"],
["763","096@220a7-224b6","838"],
["764","096@224b6-306a6","837"],
["766","096@311b3-316a6","839"],
["767","096@316a6-348b2","840"],
["768","096@348b3-349a7","841"],
["769","096@349a7-352a1","842"],
["770","096@352a1-353b5","843"],
["771","096@353b5-354a5","844"],
["772","096@354a5-356b4","845"],
["773","096@356b4-358a1","846"],
["774","096@358a1-360a7","847"],
["775","096@360a7-361a4","848"],
["776","096@361a4-362a4","849"],
["777","096@362a5-363a3","850"],
["778","096@363a4-363b7","851"],
["779","096@363b7-364b1","852"],
["780","096@364b1-364b5","853"],
["781","096@364b5-365a3","854"],
["782","096@365a4-365b1","855"],
["783","096@365b1-367a6","856"],
["784","096@367a6-367b6","857"],
["785","096@367b7-371a3","458"],
["786","096@371a3-376a2","463"],
["787","096@376a2-424a7","473"],
["788","096@424a7-454b1","474"],
["789","096@454b1-517a7","475"],
["790","096@517a7-518b3","600"],
["791","096@518b3-531a7","682"],
["792","097@001b1-123a6","1118"],
["793","097@123a6-422b4","1119"],
["794","097@422b4-522a6","1120"],
["795","098@001b1-176a7","1121"],
["796","098@176a7-213a4","1122"],
["797","098@213a4-323a5","1123"],
["798","098@323a5-472b6","1124"],
["799","098@472b7-492a1","1125"],
["800","099@001b1-049b1","1126"],
["802","099@086b1-112a6","1128"],
["803","099@112a6-188b5","1129"],
["804","099@188b5-297a3","1130"],
["805a","099@297a3-299a1","1131"],
["805b","099@299a1-306a2","1132"],
["805c","099@306a2-307b3","1133"],
["805d","099@307b3-312b4","1134"],
["805e","099@312b4-314b4","1135"],
["805f","099@314b4-318a4","1136"],
["805g","099@318a4-323b4","1137"],
["805h","099@323b4-329a5","1138"],
["806","099@329a5-372b3","1139"],
["807","099@372b3-394b6","1140"],
["808","099@394b6-425a5","1141"],
["810","100@001a1-049a7","1151"],
["809","100@001a1-510a6","1152"]]
hPedurma.rcode="H";
module.exports=hPedurma;
});
require.register("pedurmacat-dataset/nPedurma.js", function(exports, require, module){
var nPedurma=[["1","001@001b1-408a7","1"],
["1","002@001b1-563a5","1"],
["1","003@001b1-478a3","1"],
["1","004@001b1-470a7","1"],
["2","005@001b1-030b1","2"],
["3","005@030b2-439a6","3"],
["3","006@001b1-431a7","3"],
["3","007@001b1-446a6","3"],
["3","008@001b1-417a6","3"],
["4","009@001b1-036b5","4"],
["5","009@036b6-483a7","5"],
["6","010@001b1-324a6","6"],
["6","011@001b1-708a4","6"],
["7","012@001b1-139a3","7"],
["8","012@139a3-458a6","8"],
["8","013@001b1-473a4","8"],
["9","014@001b1-543a5","25"],
["9","015@001b1-528a6","25"],
["9","016@001b1-573a4","25"],
["9","017@001b1-519a5","25"],
["9","018@001b1-532a7","25"],
["9","019@001b1-532a6","25"],
["9","020@001b1-535a8","25"],
["9","021@001b1-544a6","25"],
["9","022@001b1-528a6","25"],
["9","023@001b1-541b4","25"],
["9","024@001b1-531a6","25"],
["9","025@001b1-536a5","25"],
["10","026@001b1-547a3","26"],
["10","027@001b1-545a3","26"],
["10","028@001b1-543a7","26"],
["12","032@001b1-613a7","28"],
["13","033@001b1-462a2","29"],
["14","034@001b1-130a5","31"],
["15","034@130a5-169b7","41"],
["16","034@169b7-196b5","32"],
["17","034@196b6-222a5","30"],
["18","034@222a6-240a3","33"],
["19","034@240a3-249b7","34"],
["20","034@250a1-252a6","42"],
["21","034@252a7-255b4","35"],
["22","034@255b4-256a3","40"],
["23","034@256a3-258a7","36"],
["24","034@258b1-261a1","39"],
["25","034@261a1-262b1","37"],
["26","034@262b1-264a4","38"],
["27","034@264a4-266a3","43"],
["28","034@266a3-267b4","44"],
["29","034@267b4-268b1","45"],
["30","034@268b1-269a5","46"],
["31","034@269a5-270a5","47"],
["32","035@001b1-084a7","62"],
["33","035@084b1-171b2","63"],
["34","035@171b2-341b6","64"],
["35","035@341b6-394a7","65"],
["36","035@394a7-448a5","66"],
["37","036@001b1-112a1","67"],
["38","036@112a2-219b1","68"],
["39","036@219b1-255a4","69"],
["40","036@255a4-286b7","70"],
["41","036@287a1-304a4","71"],
["42","036@304a4-402a5","72"],
["43","037@001b1-408a1","73"],
["44","037@408a1-426b6","75"],
["45","037@426b6-477a6","74"],
["46","038@001b1-080b5","76"],
["47","038@080b5-336b3","77"],
["48","038@336b3-429b4","78"],
["49","038@429b4-478a4","79"],
["50","039@001b1-050b4","80"],
["51","039@050b4-074b5","81"],
["52","039@074b5-100a3","82"],
["53","039@100a3-150b4","83"],
["54","039@150b4-220a1","84"],
["56","039@244a2-277b4","86"],
["57","039@277b5-316b3","87"],
["58","039@316b3-335b6","88"],
["59","039@335b6-350b6","89"],
["60","039@350b6-368a5","90"],
["61","039@368a5-377b2","91"],
["62","039@377b2-382b6","92"],
["63","039@382b6-406b4","93"],
["64","039@406b4-437a6","94"],
["65","039@437a6-443b7","95"],
["66","039@443b7-473a5","96"],
["67","040@001b1-073b2","97"],
["68","040@073b2-077a6","98"],
["70","040@137b1-172a3","100"],
["71","040@172a4-185b6","101"],
["72","040@185b6-203b5","102"],
["73","040@203b5-208a2","103"],
["74","040@208a2-261a2","104"],
["75","040@261a2-298b7","105"],
["76","040@298b7-309a3","106"],
["77","040@309a3-349a4","107"],
["78","040@349a4-419a6","108"],
["79","040@419a6-455b4","109"],
["80","040@455b4-489a6","110"],
["81","041@001b1-384a3","61"],
["81","042@001b1-385a4","61"],
["81","043@001b1-391a7","61"],
["81","044@001b1-375a4","61"],
["81","045@001b1-397a2","61"],
["81","046@001b1-340a7","61"],
["82","047@001b1-547a6","111"],
["83","048@001b1-329a6","112"],
["84","048@329a6-369a5","113"],
["85","048@369a5-395a5","114"],
["86","048@395a5-426a4","115"],
["87","049@001b1-416b2","117"],
["88","049@416b2-466a6","118"],
["89","050@001b1-346b4","119"],
["90","050@346b5-421b1","120"],
["91","050@421b2-438b7","121"],
["92","050@438b7-441a3","122"],
["93","050@441a4-444a4","123"],
["94","051@001b1-081a7","124"],
["95","051@081a7-298a3","125"],
["96","051@298a3-456b5","126"],
["97","051@456b5-468a5","127"],
["98","052@001b1-076a5","128"],
["99","052@076a6-187b7","129"],
["100","052@187b7-443a4","130"],
["101","053@001b1-281b5","131"],
["102","053@281b5-306a4","132"],
["103","053@306a4-313a6","133"],
["104","053@313a6-392a1","134"],
["105","053@392a1-460b3","135"],
["106","053@460b3-474a6","136"],
["107","054@001b1-231b5","138"],
["108","054@231b5-234b7","139"],
["109","054@234b7-235b5","140"],
["110","054@235b5-333a4","141"],
["111","054@333a4-456b4","142"],
["112","054@456b4-457a7","143"],
["113","054@457b1-462a6","144"],
["114","055@001b1-273b5","145"],
["115","055@273b5-279b4","146"],
["116","055@279b4-338a4","147"],
["117","055@338a4-370a4","148"],
["118","055@370a4-407b5","149"],
["120","056@001b1-115a6","151"],
["121","056@115a6-196b6","152"],
["122","056@196b7-254a4","154"],
["123","056@254a4-291a1","153"],
["124","056@291a1-304b6","155"],
["125","056@304b6-455a6","156"],
["126","056@455a6-474b1","157"],
["127","056@474b1-489a2","158"],
["128","056@489a2-490a4","159"],
["129","057@001b1-010a4","160"],
["130","057@010a4-010b5","161"],
["131","057@010b5-057a4","162"],
["132","057@057a5-154b6","164"],
["133","057@154b6-321a5","165"],
["134","057@321a5-470b7","166"],
["135","057@470b7-472a2","167"],
["136","057@472a2-473a3","168"],
["137","057@473a4-494a6","169"],
["138","058@001b1-178a5","170"],
["139","058@178a5-305b5","171"],
["140","058@305b5-317a1","172"],
["141","058@317a1-317b5","173"],
["142","058@317b5-390b6","174"],
["143","058@390b6-494a6","175"],
["144","059@001b1-016a4","176"],
["145","059@016a4-035a7","177"],
["146","059@035a7-162b4","178"],
["147","059@162b4-225b7","179"],
["148","059@225b7-232b4","180"],
["149","059@232b4-258a2","181"],
["150","059@258a2-270a5","182"],
["151","059@270a5-277a2","183"],
["152","059@277a2-283a5","184"],
["153","059@283a5-339b5","185"],
["154","059@339b5-418b6","186"],
["155","059@418b6-498a4","187"],
["156","059@498a4-503b3","188"],
["157","059@503b3-511a3","189"],
["158","060@001b1-008a5","190"],
["160","060@001b5-124a5","192"],
["159","060@008a5-011b5","191"],
["161","060@124a5-274a4","193"],
["162","060@274a4-382a3","194"],
["163","060@382a3-383a7","195"],
["164","060@383a7-390a2","196"],
["165","060@390a2-429a6","197"],
["166","060@429a6-480a6","198"],
["167","061@001b1-121b7","199"],
["168","061@121b7-151a5","200"],
["169","061@151a5-153a4","201"],
["170","061@153a4-167a2","202"],
["171","061@167a2-228a3","203"],
["172","061@228a3-251b6","204"],
["173","061@251b6-307a5","205"],
["174","061@307a5-321b3","206"],
["175","061@321b3-324a6","207"],
["176","061@324a6-363a6","208"],
["177","061@363a6-393a3","209"],
["178","061@393a3-397a2","210"],
["179","061@397a2-403b3","211"],
["180","061@403b3-404b3","212"],
["181","061@404b3-427a7","213"],
["182","061@427a7-435b1","214"],
["183","061@435b1-440b4","215"],
["184","061@440b5-475b2","216"],
["185","061@475b2-483a5","218"],
["186","062@001b1-103a4","219"],
["187","062@103a4-127a5","220"],
["188","062@127a5-132b3","221"],
["189","062@132b3-150a2","222"],
["190","062@150a3-152b7","223"],
["191","062@153a1-155b1","224"],
["192","062@155b1-179b3","225"],
["193","062@179b3-183b7","226"],
["194","062@184a1-190b3","227"],
["195","062@190b4-203b2","228"],
["196","062@203b2-206a7","229"],
["197","062@206a7-207b7","230"],
["202","062@427b6-451a6","235"],
["203","062@451a6-473b7","236"],
["204","062@474a1-490a4","237"],
["205","063@001b1-131b4","238"],
["206","063@131b4-142b1","239"],
["207","063@142b1-208b2","240"],
["208","063@208b2-263a6","241"],
["209","063@263a6-277b6","242"],
["210","063@277b7-279b6","243"],
["211","063@279b6-282b2","244"],
["212","063@282b2-301a1","245"],
["213","063@301a1-356a3","246"],
["214","063@356a3-416a7","247"],
["215","063@416a7-463a7","248"],
["217","064@175b6-331a1","250"],
["218","064@331a1-378b3","251"],
["219","064@378b3-385a5","252"],
["220","064@385a6-404a1","253"],
["221","064@404a1-438a3","254"],
["222","064@438a3-455a7","255"],
["223","065@001b1-154a7","256"],
["224","065@154b1-367b7","257"],
["225","065@367b7-458a1","258"],
["226","065@458a2-460b1","259"],
["227","065@460b1-465a6","260"],
["228","066@001b1-022a3","261"],
["229","066@022a3-039a4","262"],
["230","066@039a4-046b7","263"],
["231","066@046b7-060b6","264"],
["232","066@060b6-065b7","265"],
["233","066@066a1-084b2","266"],
["234","066@084b2-085b1","267"],
["235","066@085b1-086a4","268"],
["236","066@086a5-087a3","269"],
["237","066@087a4-099b5","270"],
["238","066@099b5-101a6","271"],
["239","066@101a6-101b7","272"],
["240","066@102a1-106a4","273"],
["241","066@106a5-131b4","274"],
["242","066@131b5-350b3","275"],
["243","066@350b3-371a1","276"],
["244","066@371a2-377a7","277"],
["245","066@377a7-405b5","278"],
["246","066@405b5-447a6","279"],
["247","067@001b1-137a7","280"],
["248","067@137a7-328a3","281"],
["249","067@328a4-412b7","282"],
["250","067@412b7-451a2","283"],
["251","067@451a2-499a5","284"],
["252","068@001b1-007b4","285"],
["253","068@007b4-009b5","286"],
["254","068@009b6-018b7","287"],
["270","068@011b4-115a7","303"],
["255","068@018b7-024b3","288"],
["256","068@024b4-029b6","289"],
["257","068@029b6-036b7","290"],
["258","068@036b7-041b7","291"],
["259","068@042a1-051a1","292"],
["260","068@051a1-064a3","293"],
["261","068@064a3-072a1","294"],
["262","068@072a2-076a7","295"],
["263","068@076a7-079a7","296"],
["264","068@079a7-080a4","297"],
["265","068@080a5-080b2","298"],
["266","068@080b2-080b5","299"],
["267","068@080b5-081a5","300"],
["268","068@081a6-082b3","301"],
["269","068@082b3-111b3","302"],
["271","068@115a7-118a4","304"],
["272","068@118a4-465a5","305"],
["272","069@001b1-447a5","305"],
["272","070@001b1-459a6","305"],
["272","071@001b1-348b5","305"],
["273","071@348b5-373b3","306"],
["274","071@373b3-383a6","307"],
["275","071@383a6-389a4","308"],
["276","071@389a5-403a3","309"],
["277","071@403a3-409a1","310"],
["278","071@409a2-411b5","311"],
["279","071@411b5-426a1","312"],
["280","071@426a1-458a3","313"],
["281","071@458a3-460b3","314"],
["282","071@460b3-468a2","315"],
["283","071@468a2-471b5","316"],
["284","071@471b5-473a5","317"],
["285","071@473a5-474a7","318"],
["286","072@001b1-189b6","319"],
["287","072@189b6-192a5","320"],
["288","072@192a6-193b2","321"],
["289","072@193b2-197b5","322"],
["290","072@197b5-198b7","323"],
["291","072@199a1-218a1","324"],
["292","072@218a1-228b1","325"],
["293","072@228b1-243a1","326"],
["294","072@243a2-244a4","327"],
["295","072@244a4-246b1","328"],
["296","072@246b1-247a3","329"],
["297","072@247a3-253b1","330"],
["298","072@253b1-257a6","331"],
["299","072@257a6-265b7","332"],
["300","072@266a1-267a3","333"],
["301","072@267a3-268a5","334"],
["302","072@268a5-295b1","335"],
["303","072@295b1-303b6","336"],
["304","072@303b6-308b5","337"],
["305","072@308b5-311b3","338"],
["306","072@311b4-315b6","339"],
["307","072@315b7-321a2","340"],
["308","072@321a2-321a5","341"],
["309","072@321a6-321b4","342"],
["310","072@321b5-329a2","343"],
["314","072@405b6-408a2","347"],
["315","072@408a2-409a3","348"],
["316","072@409a3-409b7","349"],
["317","072@410a1-415a4","350"],
["318","072@415a4-421a7","351"],
["319","072@421a7-425b4","352"],
["320","072@425b4-430a7","353"],
["321","072@430a7-431b4","354"],
["322","072@431b4-434a4","355"],
["323","072@434a4-464a6","357"],
["324","072@464a6-481a6","358"],
["325","073@001b1-482a6","360"],
["325","074@001b1-196b2","360"],
["326","074@196b2-464b2","361"],
["327","074@464b2-466b7","362"],
["328","074@467a1-477b4","383"],
["329","074@477b4-483a7","384"],
["330","075@001b1-422b7","363"],
["331","075@423a1-427a4","364"],
["332","075@427a4-430a3","365"],
["333","075@430a4-442a5","366"],
["334","076@001b1-033b4","367"],
["335","076@033b5-048a4","368"],
["336","076@048a4-076b6","369"],
["337","076@076b6-085b1","370"],
["338","076@085b1-108a4","371"],
["339","076@108a5-132b2","372"],
["340","076@132b2-303b7","373"],
["341","076@304a1-320b1","374"],
["342","076@320b1-330b7","375"],
["343","076@331a1-336b6","376"],
["344","076@336b6-354b4","377"],
["345","076@354b5-420b2","378"],
["347","076@427a5-432a3","48"],
["348","076@432a3-543a5","49"],
["349","076@543a5-558b6","50"],
["350","076@558b6-564b2","51"],
["351","076@564b2-574b6","52"],
["352","076@574b7-576a6","53"],
["353","076@576a6-584b5","54"],
["354","076@584b5-589a1","55"],
["355","076@589a1-592b3","56"],
["356","076@592b3-594a4","57"],
["357","076@594a4-595a3","58"],
["358","076@595a3-595b7","59"],
["359","076@596a1-597a5","60"],
["360","077@001b1-190a7","1117"],
["361","078@001b1-550a5","137"],
["361","079@001b1-527a6","137"],
["362","080@001b1-018b6","385"],
["363","080@018b6-028b3","386"],
["364","080@028b3-186a6","387"],
["365","080@186a6-210a4","388"],
["366","080@210a4-216b1","390"],
["367","080@216b1-277b6","391"],
["368","080@277b6-306b6","392"],
["369a","080@306b6-325b2","440a"],
["369b","080@325b2-352a1","440b"],
["370","080@352a1-412b5","441"],
["371","080@412b5-455b2","442"],
["372","080@455b2-464b7","443"],
["373","080@465a1-527b1","444"],
["374","080@527b2-537a6","445"],
["375","081@001b1-053a7","393"],
["376","081@053a7-245a7","394"],
["377","081@245a7-317b2","398"],
["378","081@317b2-513a6","395"],
["379","082@001b1-192a4","397"],
["380","082@192a4-236b6","399"],
["381","082@236b6-246b7","402"],
["382","082@247a1-262b3","400"],
["383","082@262b3-274b2","401"],
["384","082@274b3-398a4","405a"],
["385","082@398a4-437b4","405b"],
["386","082@437b4-483a4","439"],
["387","083@001b1-005b4","437"],
["388","083@005b4-038b5","446"],
["389","083@038b5-044a2","447"],
["390","083@044a2-050b3","448"],
["391","083@050b3-057b4","449"],
["392","083@057b4-128a6","450"],
["393","083@128a6-166b7","451"],
["395","083@227b1-243b2","454"],
["396","083@243b2-246b7","456"],
["397","083@246b7-250a2","455"],
["398","083@250a2-266b5","457"],
["399","083@266b5-286b6","459"],
["400","083@286b6-288b3","460"],
["401","083@288b3-291b1","461"],
["402","083@291b1-351a3","462"],
["403","084@001b1-064a7","453"],
["404","084@064a7-153a2","465"],
["405","084@153a2-167b3","466"],
["406","084@167b3-267a6","468"],
["407","084@267a6-339b7","467"],
["408","084@339b7-345a7","470"],
["409","084@345a7-351a5","469"],
["410","084@351a5-378b7","474"],
["411","084@379a1-432b4","475"],
["414","085@001a6-016b7","479"],
["412","085@001b1-005a2","477"],
["413","085@005a3-011a6","478"],
["415","085@016b7-020b7","480"],
["416","085@020b7-042b5","481"],
["417","085@042b5-051b1","482"],
["418","085@051b1-056a2","483"],
["419","085@056a2-056a4","484"],
["420","085@056a5-093a2","485"],
["421","085@093a2-096a2","486"],
["422","085@096a2-156a3","490"],
["423","086@001b1-029a4","491"],
["424","086@029a4-046b3","497"],
["425","086@046b3-065a3","492"],
["426","086@065a3-070b3","493"],
["429","086@070b3-071a7","495"],
["430","086@071a7-117b7","499"],
["431","086@117b7-122a3","501"],
["432","086@122a3-213a3","502"],
["433","086@213a4-440a2","504"],
["434","087@001b1-207a5","505"],
["435","087@207a5-218b6","506"],
["436","087@218b6-288a3","507"],
["437a","087@288a3-293b5","511"],
["437b","087@293b5-294a6","509"],
["438","087@294a6-328a3","512"],
["439","087@328a3-466a7","513"],
["440","087@466a7-476b2","514"],
["441","087@476b3-531a5","517"],
["442","088@001b1-061b7","508"],
["443","088@061b7-134b3","510"],
["444","088@134b3-249a5","515"],
["445","088@249a5-250b7","516"],
["446","088@250b7-300b7","518"],
["447","088@301a1-455a2","519"],
["448","088@455a2-467a5","523"],
["449","089@001b1-097a5","520"],
["450","089@097a5-328a4","521"],
["451","089@328a4-334b5","525"],
["452","089@334b5-433b3","527"],
["453","089@433b3-470a6","528"],
["454","089@470a6-484a6","529"],
["455a","089@484a6-488a2","530"],
["455b","089@488a3-488a5","531"],
["456","090@001b1-040a6","532"],
["457","090@040a6-041b1","535"],
["458","090@041b1-050b6","533"],
["459","090@050b6-057a3","656"],
["460","090@057a3-057a5","559"],
["461","090@057a5-057b4","560"],
["462","090@057b4-058a2","680"],
["463","090@058a2-058a6","711"],
["464","090@058a6-058b1","562"],
["465","090@058b1-062a1","540"],
["466","090@062a2-064b2","539"],
["467","090@064b2-070a3","537"],
["468","090@070a3-076b4","538"],
["470","090@077a1-077a5","561"],
["471","090@077a5-077a7","563"],
["472","090@077a7-083a5","543"],
["473","090@083a5-087b7","570"],
["474","090@088a1-089a7","672"],
["475","090@089b1-092a3","556"],
["476","090@092a4-094a2","557"],
["477","090@094a2-100b4","558"],
["478","090@100b4-483a2","571"],
["479","090@483a2-499b2","572"],
["480","090@499b3-500b1","579"],
["481","090@500b1-500b7","580"],
["482","090@501a1-501b1","573"],
["483","090@501b2-502a5","574"],
["484","090@502a5-502a7","576"],
["485","090@502a7-502b6","577"],
["486","090@502b6-503a3","575"],
["488","090@503b1-505b7","581"],
["489","090@505b7-508a3","582"],
["490","091@001b1-208b7","583"],
["491","091@208b7-385a4","584"],
["492","092@001b1-039b3","586"],
["493","092@039b3-086a4","587"],
["494","092@086a4-117b2","589"],
["495","092@117b2-134b7","590"],
["496","092@134b7-143b6","591"],
["497","092@143b6-145a7","592"],
["498","092@145a7-146b7","766"],
["499","092@146b7-147b7","767"],
["500","092@147b7-160a4","789"],
["501","092@160a5-161a5","641"],
["502","092@161a5-162a7","599"],
["503","092@162b1-164b7","598"],
["504","092@164b7-165b6","763"],
["505","092@165b6-171a6","596"],
["506","092@171a7-172a1","588"],
["507","092@172a1-179b3","554"],
["508","092@179b3-181b3","522"],
["509","092@181b4-188b4","623"],
["510","092@188b4-195b2","625"],
["511","092@195b2-207a2","622"],
["512","092@207a3-210a6","626"],
["513","092@210a6-212a2","624"],
["514","092@212a2-223b4","618"],
["515","092@223b5-232a7","619"],
["516","092@232a7-240a7","621"],
["517","092@240a7-254b3","627"],
["518","092@254b3-255a7","650"],
["519","092@255b1-255b2","652"],
["520","092@255b3-256a6","653"],
["521","092@256a6-256b6","648"],
["522","092@256b6-258a7","649"],
["523","092@258a7-259a6","657"],
["524","092@259a7-260a5","643"],
["525","092@260a5-260b7","741"],
["526","092@260b7-263a1","548"],
["527","092@263a1-278b5","536"],
["528","092@278b6-288b4","629"],
["529","092@288b4-292a5","545"],
["530","092@292a5-293b1","546"],
["531","092@293b2-297a2","547"],
["532","092@297a2-297a4","566"],
["533","092@297a4-297b1","628"],
["535","092@297b3-297b5","805"],
["536","092@297b5-298a3","806"],
["537","092@298a3-298b2","807"],
["538","092@298b2-298b4","808"],
["539","092@298b4-298b6","679"],
["540","092@298b7-299a3","678"],
["541","092@299a3-299a6","742"],
["542","092@299a7-299b2","743"],
["543","092@299b2-299b6","744"],
["544","092@299b6-300a3","745"],
["545","092@300a3-300a7","746"],
["546","092@300a7-300b2","748"],
["547","092@300b2-301a5","564"],
["548","092@301a6-301b7","710"],
["549","092@302a1-302b1","601"],
["550","092@302b2-303a5","768"],
["551","092@303a5-304a6","803"],
["552","092@304a6-384b1","632"],
["553","092@384b1-387a4","602"],
["554","092@387a4-389b6","544"],
["555","092@389b7-392a3","765"],
["556","092@392a3-393a5","646"],
["557","092@393a5-395b4","635"],
["558","092@395b4-397b4","637"],
["559","092@397b5-398a5","550"],
["560","092@398a5-398b2","740"],
["561","092@398b2-400b5","739"],
["562","092@400b5-403a1","597"],
["563","092@403a2-405a4","647"],
["564","092@405a4-405b6","658"],
["565","092@405b6-408b7","638"],
["566","092@408b7-411a2","640"],
["567","092@411a2-413a4","549"],
["568","092@413a4-416b2","634"],
["569","092@416b2-424b1","642"],
["570","092@424b1-429a6","683"],
["571","092@429a6-429b6","639"],
["572","092@429b6-430b7","552"],
["573","092@430b7-432a2","603"],
["574","092@432a2-435a6","661"],
["575","092@435a6-438a5","631"],
["576","092@438a5-441b3","542"],
["577","092@441b3-445a5","555"],
["578","093@001b1-023b7","659"],
["579","093@024a1-057b5","660"],
["580","093@057b5-061a4","662"],
["581","093@061a4-063b5","663"],
["582","093@063b5-067b7","664"],
["583","093@068a1-073a6","665"],
["584","093@073a7-077a5","666"],
["585","093@077a5-082a1","667"],
["586","093@082a1-085a4","668"],
["591","093@091b3-112b1","685"],
["592","093@112b1-132b2","686"],
["593","093@132b3-139b3","687"],
["594","093@139b3-140a7","688"],
["595","093@140a7-148b7","696"],
["596","093@148b7-150a2","695"],
["597","093@150a2-153b4","690"],
["598","093@153b4-157a3","691"],
["599","093@157a4-162b4","692"],
["600","093@162b5-164a3","693"],
["602","093@167b2-170b6","697"],
["603","093@170b6-171b2","698"],
["604","093@171b2-172a3","700"],
["605","093@172a3-172b2","699"],
["606","093@172b3-182a7","701"],
["607","093@182a7-184b4","702"],
["608","093@184b4-184b6","703"],
["609","093@184b7-190a5","644"],
["610","093@190a5-190b6","568"],
["611","093@190b6-191a5","677"],
["612","093@191a5-193b5","675"],
["613","093@193b5-197b2","674"],
["614","093@197b3-200b6","676"],
["615","093@200b6-208b1","705"],
["616","093@208b1-215a4","706"],
["617","093@215a4-217b6","707"],
["618","093@217b7-299b6","712"],
["619","093@299b6-302b3","718"],
["620","093@302b3-346a7","721"],
["621","093@346a7-400a5","722"],
["622","093@400a5-410b6","723"],
["623","093@410b6-413b6","724"],
["624","093@413b6-414a3","726"],
["625","093@414a3-414b5","727"],
["626","093@414b5-425b2","732"],
["627","093@425b2-433a6","731"],
["628","093@433a6-436b5","730"],
["629","093@436b5-438a2","764"],
["630","093@438a2-440b4","736"],
["631","093@440b5-441a7","799"],
["632","093@441a7-443b4","738"],
["633","093@443b4-445a7","733"],
["634","093@445b1-453b7","734"],
["635","093@453b7-454a4","735"],
["636","093@454a5-455a7","729"],
["637","093@455a7-457b3","756"],
["638","093@457b3-480a1","757"],
["639","093@480a2-483a5","758"],
["640","093@483a5-487b2","759"],
["641","093@487b2-495b1","870"],
["642","093@495b1-495b3","760"],
["643","093@495b3-496a4","761"],
["644","094@001b1-011b1","713"],
["651","094@001b1-569a7","717"],
["645","094@001b2-012b3","769"],
["646","094@012b3-019a3","770"],
["647","094@019a4-020a4","771"],
["648","094@020a4-021a3","772"],
["649","094@021a3-066a4","775"],
["650","094@066a4-105a5","778"],
["652","095@001b1-003b7","774"],
["653","095@003b7-366a6","777"],
["654","095@366a6-368a7","780"],
["655","095@368a7-370b4","781"],
["656","095@370b4-419b3","782"],
["657","095@419b4-424b5","783"],
["658","095@424b5-426a4","785"],
["659","095@426a4-463b2","790"],
["660","095@463b2-466a7","791"],
["661","095@466a7-469a2","794"],
["662","095@469a2-470b7","792"],
["663","095@470b7-472a2","793"],
["664","095@472a2-474a3","786"],
["667","095@490a1-510a3","797a"],
["668","095@510a3-521b2","797b"],
["669","095@521b2-523a2","798"],
["670","095@523a2-546a4","800"],
["671","096@001b1-453a6","755"],
["672","097@001b1-003a4","795"],
["673","097@003a4-020b4","796"],
["674","097@020b5-027b7","802"],
["675","097@028a1-028b7","981"],
["676","097@028b7-029a2","804"],
["677","097@029a2-029a4","1082"],
["678","097@029a4-029b2","1083"],
["679","097@029b2-030a2","1023a"],
["680","097@030a3-030a5","1023b"],
["681","097@030a5-030b2","809"],
["682","097@030b2-030b6","810"],
["683","097@030b6-030b7","811"],
["684","097@031a1-031b1","567"],
["685","097@031b1-033a6","860"],
["687","097@033b2-033b3","814"],
["688","097@033b3-033b6","815"],
["689","097@033b6-034a1","816"],
["690","097@034a1-034a3","817"],
["691","097@034a3-034a4","818"],
["692","097@034a4-034b1","819"],
["693","097@034b1-034b2","820"],
["694","097@034b2-034b5","821"],
["695","097@034b5-034b7","822"],
["696","097@034b7-035a3","823"],
["697","097@035a3-035b1","824"],
["698","097@035b1-035b3","825"],
["699","097@035b3-035b4","826"],
["700","097@035b5-035b7","827"],
["701","097@035b7-036a2","828"],
["702","097@036a2-036a3","829"],
["703","097@036a4-036a5","830"],
["704","097@036a5-036a7","831"],
["705","097@036a7-036b2","832"],
["706","097@036b2-036b4","833"],
["707","097@036b4-037a1","604"],
["708","097@037a1-037a5","605"],
["709","097@037a5-037b1","606"],
["710","097@037b1-037b4","607"],
["711","097@037b4-038a5","608"],
["712","097@038a5-038a6","609"],
["713","097@038a6-038b3","610"],
["714","097@038b3-038b5","611"],
["715","097@038b5-038b7","612"],
["716","097@038b7-039a2","613"],
["717","097@039a2-039a4","614"],
["718","097@039a4-039a5","615"],
["719","097@039a5-039a7","616"],
["720","097@039a7-040a1","617"],
["721","097@040a1-071b2","835"],
["722","097@071b2-108b4","836"],
["723","097@108b4-112b2","838"],
["724","097@112b2-187b7","837"],
["726","097@193a1-223b7","840"],
["727","097@224a1-225a6","841"],
["728","097@225a7-227b5","842"],
["729","097@227b5-229a7","843"],
["730","097@229a7-229b7","844"],
["731","097@229b7-232a3","845"],
["732","097@232a3-233a5","846"],
["733","097@233a5-235b1","847"],
["734","097@235b1-236a4","848"],
["735","097@236a4-237a4","849"],
["736","097@237a4-238a2","850"],
["737","097@238a2-238b5","851"],
["738","097@238b5-239a6","852"],
["739","097@239a6-239b2","853"],
["740","097@239b3-239b7","854"],
["741","097@239b7-240a5","855"],
["742","097@240a5-242a5","856"],
["743","097@242a6-243a2","857"],
["744","098@001b1-120b4","1118"],
["745","098@120b4-408a2","1119"],
["746","098@408a2-503a7","1120"],
["747","099@001b1-139a6","1121"],
["748","099@139a6-171a4","1122"],
["749","099@171a4-267a3","1123"],
["750","099@267a3-407b5","1124"],
["751","099@407b5-427a3","1125"],
["752","100@001b1-047b6","1126"],
["753","100@047b6-084a5","1127"],
["754","100@084a5-107a7","1128"],
["755","100@107b1-179b5","1129"],
["756","100@179b5-285b2","1130"],
["757a","100@285b2-287a4","1131"],
["757b","100@287a4-293a6","1132"],
["757c","100@293a6-294b3","1133"],
["757d","100@294b3-299a4","1134"],
["757e","100@299a4-301a1","1135"],
["757f","100@301a1-303b5","1136"],
["757g","100@303b5-308a4","1137"],
["757h","100@308a4-312b7","1138"],
["759","100@312b7-349a2","1139"],
["760","100@349a2-369b3","1140"],
["761","100@369b3-397a5","1141"],
["762","101@001b1-010b7","494"],
["763","101@011a1-094b7","585"],
["764","101@095a1-102b5","524"],
["765","101@102b5-103b3","569"],
["766","101@103b3-111b7","595"],
["768","101@118b1-119a3","630"],
["769","101@119a3-120b1","633"],
["770","101@120b1-120b3","654"],
["771","101@120b3-120b5","655"],
["772","101@120b5-121a6","749"],
["773","101@121a6-121b2","751"],
["774","101@121b2-121b7","708"],
["775","101@122a1-124a4","737"],
["776","101@124a4-125b3","779"],
["777","101@125b3-126a6","404"],
["778","101@126a6-128a5","541"],
["779","101@128a5-128a7","1070"],
["780","101@128a7-128b3","834"],
["781","101@128b3-129b3","636"],
["782","101@129b3-129b4","681"],
["784","101@130a1-157b7","359"],
["785","101@158a1-225b6","163"],
["786","101@225b7-227b7","116"],
["792","102@001a1-014a6","1147"],
["793","102@001a1-124a4","1148"]];
nPedurma.rcode="N";
module.exports=nPedurma;
});
require.register("pedurmacat-dataset/uPedurma.js", function(exports, require, module){
var uPedurma=[["1","001@001b1-311a6","1"],
["1","002@001b1-317a6","1"],
["1","003@001b1-293a6","1"],
["1","004@001b1-302a5","1"],
["2","005@001b1-020b7","2"],
["3","005@021a1-292a7","3"],
["3","006@001b1-287a7","3"],
["3","007@001b1-287a7","3"],
["3","008@001b1-269a6","3"],
["4","009@001b1-025a7","4"],
["5","009@025b1-328a6","5"],
["566","009@158b2-165b5","593"],
["6","010@001b1-310a7","6"],
["6","011@001b1-333a7","6"],
["7a","012@001b1-092a7","7"],
["7b","012@092b1-302a7","8"],
["7b","013@001b1-313a5","8"],
["8","014@001b1-394a7","25"],
["8","015@001b1-402a7","25"],
["8","016@001b1-394a4","25"],
["8","017@001b1-381a7","25"],
["8","018@001b1-395a7","25"],
["8","019@001b1-382a7","25"],
["8","020@001b1-398a7","25"],
["8","021@001b1-399a7","25"],
["8","022@001b1-284a7","25"],
["8","023@001b1-388a7","25"],
["8","024@001b1-411a7","25"],
["8","025@001b1-395a6","25"],
["9","026@001b1-382a4","26"],
["9","027@001b1-393a6","26"],
["9","028@001b1-380a7","26"],
["10","029@001b1-300a7","27"],
["10","030@001b1-304a5","27"],
["10","031@001b1-206a7","27"],
["11","032@001b1-397a7","28"],
["12","033@001b1-288a6","29"],
["13","034@001b1-019b7","30"],
["14","034@020a1-104a1","31"],
["15","034@104a1-120b7","32"],
["16","034@121a1-132b7","33"],
["17","034@133a1-139b6","34"],
["18","034@139b6-142a4","35"],
["19","034@142a4-143b5","36"],
["20","034@143b5-144b6","37"],
["21","034@144b6-146a3","38"],
["22","034@146a3-147b3","39"],
["23","034@147b3-148a1","40"],
["24","034@148a1-174a2","41"],
["25","034@174a2-175b3","42"],
["26","034@175b3-176b6","43"],
["27","034@176b6-177b6","44"],
["28","034@177b6-178a6","45"],
["29","034@178a6-178b6","46"],
["30","034@178b6-180b1","47"],
["31","034@180b1-183a7","48"],
["32","034@183a7-250a5","49"],
["33","034@250a5-259b4","50"],
["34","034@259b4-263a4","51"],
["35","034@263a4-270a1","52"],
["36","034@270a1-271a1","53"],
["37","034@271a1-276a5","54"],
["38","034@276a5-279a2","55"],
["40","034@281b1-282a6","57"],
["41","034@282a6-282b6","58"],
["42","034@282b6-283a5","59"],
["43","034@283a5-284a7","60"],
["44","035@001b1-393a5","61"],
["44","036@001b1-396a5","61"],
["287","037@001a1-251a3","305"],
["44","037@001b1-396a7","61"],
["44","038@001b1-362a6","61"],
["45","039@001b1-045a7","62"],
["46","039@045b1-099b7","63"],
["47","039@100a1-203a7","64"],
["48","039@203b1-237a7","65"],
["327","039@218b1-261b8","344"],
["49","039@237b1-270a5","66"],
["50","040@001b1-070a7","67"],
["51","040@070b1-140a7","68"],
["52","040@140b1-164a5","69"],
["53","040@164a5-184b6","70"],
["54","040@184b6-195a7","71"],
["55","040@195b1-255b1","72"],
["56","040@255b1-294a7","73"],
["56","041@001b1-230b1","73"],
["57","041@230b1-262a1","74"],
["58","041@262a1-273b1","75"],
["59","041@273b1-322a4","76"],
["61","042@168a7-227a5","78"],
["62","042@227a5-257a7","79"],
["63","042@257a7-288a4","80"],
["64","043@001b1-017b4","81"],
["65","043@017b4-036a2","82"],
["66","043@036a2-068a1","83"],
["67","043@068a1-115a1","84"],
["68","043@115a1-131a7","85"],
["69","043@131a7-154a1","86"],
["70","043@154a1-181a1","87"],
["71","043@181a1-194a1","88"],
["72","043@194a1-204b1","89"],
["73","043@204b1-215b7","90"],
["74","043@215b7-222a3","91"],
["75","043@222a3-225b3","92"],
["76","043@225b3-241a1","93"],
["78","043@261b6-266b6","95"],
["79","043@266b6-285a1","96"],
["80","043@285a1-309a7","97"],
["80","044@001b1-027a4","97"],
["81","044@027a4-030a1","98"],
["82","044@030a1-071a1","99"],
["83","044@071a1-095a1","100"],
["84","044@095a1-104b1","101"],
["85","044@104b1-116b2","102"],
["86","044@116b2-119a7","103"],
["87","044@119b1-151b7","104"],
["88","044@152a1-175b2","105"],
["89","044@175b2-182b6","106"],
["90","044@182b6-210a1","107"],
["91","044@210a1-254b7","108"],
["92","044@255a1-277b7","109"],
["93","044@278a1-299a7","110"],
["94","045@001b1-340a5","111"],
["95","046@001b1-216b7","112"],
["96","046@217a1-241b7","113"],
["97","046@242a1-257b2","114"],
["98","046@257b2-278a5","115"],
["99","047@001b1-275b7","117"],
["100","047@276a1-305a7","118"],
["101","048@001b1-226b7","119"],
["102","048@227a1-273b7","120"],
["103","048@274a1-284b3","121"],
["104","048@284b3-285b7","122"],
["105","048@285b7-288a5","123"],
["106","049@001b1-055b7","124"],
["107","049@056a1-191b7","125"],
["108","049@191b7-284b7","126"],
["109","049@285a1-292a7","127"],
["110","050@001b1-055b2","128"],
["111","050@055b2-128a4","129"],
["112","050@128a4-296a6","130"],
["113","051@001b1-180b7","131"],
["114","051@181a1-195b4","132"],
["115","051@195b4-200a2","133"],
["116","051@200a3-247b7","134"],
["117","051@248a1-290a7","135"],
["118","051@290b1-298a7","136"],
["119","052@001b1-343a6","137"],
["119","053@001b1-339a7","137"],
["121","054@149b7-151b5","139"],
["122","054@151b5-152a5","140"],
["123","054@152a5-213a1","141"],
["124","054@213a1-292b7","142"],
["125","054@293a1-293a7","143"],
["126","054@293a7-296a7","144"],
["127","055@001b1-170b7","145"],
["128","055@171a1-174b4","146"],
["129","055@174b4-210b3","147"],
["130","055@210b3-230b4","148"],
["131","055@230b4-253b5","149"],
["132","055@253b5-316a6","150"],
["133","056@001b1-070b2","151"],
["134","056@070b2-121b7","152"],
["135","056@122a1-144b2","153"],
["136","056@144b2-179a4","154"],
["137","056@179a5-187b2","155"],
["138","056@187b3-277b7","156"],
["358","056@269a2-316b8","378"],
["140","056@289b4-299a5","158"],
["141","056@299a5-300a4","159"],
["142","057@001b1-006b1","160"],
["143","057@006b1-006b6","161"],
["144","057@006b6-034a3","162"],
["145","057@034a4-082a3","163"],
["146","057@082a3-141b7","164"],
["148","057@243a1-330a7","166"],
["149","057@330b1-331a2","167"],
["150","057@331a2-331b5","168"],
["151","057@331b5-344a4","169"],
["152","058@001b1-115b7","170"],
["153","058@116a1-198a3","171"],
["154","058@198a3-205a6","172"],
["155","058@205a6-205b7","173"],
["156","058@206a1-253b7","174"],
["157","058@254a1-319a7","175"],
["158","059@001b1-010b3","176"],
["159","059@010b3-022b7","177"],
["161","059@101a1-139b4","179"],
["162","059@139b5-143b7","180"],
["163","059@143b7-159b5","181"],
["164","059@159b5-167a6","182"],
["165","059@167a6-171a5","183"],
["166","059@171a6-175a4","184"],
["167","059@175a4-210b7","185"],
["168","059@211a1-259b7","186"],
["169","059@260a1-307a7","187"],
["170","059@307b1-310b3","188"],
["171","059@310b4-314a7","189"],
["172","060@001b1-005a7","190"],
["173","060@005b1-007b4","191"],
["174","060@007b4-078b7","192"],
["175","060@079a1-174b7","193"],
["176","060@175a1-239b7","194"],
["177","060@240a1-240b5","195"],
["178","060@240b5-244b4","196"],
["179","060@244b4-266b7","197"],
["180","060@267a1-296a6","198"],
["181","061@001b1-076b7","199"],
["182","061@077a1-095b1","200"],
["183","061@095b2-096b6","201"],
["184","061@096b6-105b7","202"],
["185","061@106a1-143b4","203"],
["186","061@143b4-158a4","204"],
["187","061@158a4-191a7","205"],
["188","061@191b1-199b5","206"],
["189","061@199b6-201a6","207"],
["190","061@201a6-224b5","208"],
["191","061@224b5-243b5","209"],
["192","061@243b6-246a7","210"],
["193","061@246a7-250b3","211"],
["194","061@250b3-251a5","212"],
["195","061@251a5-266a7","213"],
["197","061@271b2-274b5","215"],
["198","061@274b5-296a7","216"],
["199","061@296b1-303a5","217"],
["200","061@303a5-308a6","218"],
["201","062@001b1-063a5","219"],
["209","062@011b7-115b7","227"],
["202","062@063a5-078a4","220"],
["203","062@078a4-081b2","221"],
["204","062@081b2-092a5","222"],
["205","062@092a5-093b7","223"],
["206","062@094a1-095a7","224"],
["207","062@095a7-109a5","225"],
["208","062@109a6-111b7","226"],
["210","062@116a1-123b1","228"],
["211","062@123b1-125a3","229"],
["212","062@125a3-125b7","230"],
["214","062@207b7-332a3","231"],
["217","062@269a1-284a2","235"],
["218","062@284a3-297b5","236"],
["219","062@297b5-307a7","237"],
["220","063@001b1-077b7","238"],
["221","063@078a1-084b4","239"],
["222","063@084b5-126b7","240"],
["223","063@127a1-164a2","241"],
["224","063@164a2-173b7","242"],
["225","063@174a1-175a5","243"],
["226","063@175a6-177a3","244"],
["227","063@177a3-188b7","245"],
["228","063@188b7-226a7","246"],
["229","063@226b1-265b7","247"],
["230","063@266a1-297a7","248"],
["231","064@001b1-112b7","249"],
["232","064@113a1-214b7","250"],
["233","064@215a1-245b7","251"],
["234","064@246a1-250b2","252"],
["235","064@250b2-263a7","253"],
["236","064@263a7-287a4","254"],
["237","064@287a4-299a4","255"],
["238","065@001b1-099b7","256"],
["239","065@100a1-241b4","257"],
["240","065@241b4-301b6","258"],
["241","065@301b6-303a6","259"],
["242","065@303a6-306a7","260"],
["243","066@001b1-015b1","261"],
["245","066@027b5-033a1","263"],
["246","066@033a1-042b5","264"],
["247","066@042b5-046a7","265"],
["248","066@046b1-059a5","266"],
["249","066@059a5-059b7","267"],
["250","066@059b7-060a7","268"],
["251","066@060b1-061a2","269"],
["252","066@061a2-069b2","270"],
["253","066@069b2-070b3","271"],
["254","066@070b3-071a2","272"],
["255","066@071a3-074a3","273"],
["256","066@074a4-091a7","274"],
["258","066@245b2-259b4","276"],
["259","066@259b5-264a4","277"],
["260","066@264a4-283b2","278"],
["261","066@283b2-310a7","279"],
["262","067@001b1-089b7","280"],
["263","067@090a1-209b7","281"],
["264","067@210a1-264a1","282"],
["265","067@264a1-287b7","283"],
["266","067@288a1-319a6","284"],
["267","068@001b1-005b2","285"],
["268","068@005b2-007a2","286"],
["269","068@007a2-013a7","287"],
["270","068@013a7-017b3","288"],
["271","068@017b3-021a7","289"],
["272","068@021b1-026a5","290"],
["273","068@026a5-029b6","291"],
["274","068@029b6-035b7","292"],
["275","068@036a1-044b2","293"],
["276","068@044b3-049b6","294"],
["277","068@049b6-052b6","295"],
["278","068@052b6-054b6","296"],
["279","068@054b6-055a7","297"],
["280","068@055a7-055b4","298"],
["281","068@055b4-055b6","299"],
["282","068@055b6-056a4","300"],
["283","068@056a5-057a3","301"],
["284","068@057a3-077a3","302"],
["285","068@077a3-079b7","303"],
["286","068@079b7-081b7","304"],
["288","071@230a1-244a7","306"],
["289","071@244b1-249b7","307"],
["290","071@250a1-253b2","308"],
["291","071@253b2-261b7","309"],
["292","071@262a1-265b4","310"],
["293","071@265b4-267a7","311"],
["294","071@267b1-275b7","312"],
["295","071@275b7-295a7","313"],
["296","071@295b1-297a2","314"],
["297","071@297a2-301b2","315"],
["298","071@301b2-303b4","316"],
["299","071@303b4-304b3","317"],
["300","071@304b3-305a7","318"],
["301","072@001b1-125a7","319"],
["302","072@125a7-127a2","320"],
["303","072@127a2-127b7","321"],
["304","072@128a1-130b4","322"],
["305","072@130b4-131b1","323"],
["306","072@131b1-139a4","324"],
["307","072@139a4-145b3","325"],
["308","072@145b4-155a2","326"],
["309","072@155a2-155b5","327"],
["310","072@155b5-157a5","328"],
["311","072@157a6-157b4","329"],
["312","072@157b4-161b1","330"],
["313","072@161b1-163b5","331"],
["314","072@163b5-169a4","332"],
["315","072@169a4-169b7","333"],
["316","072@170a1-170b4","334"],
["317","072@170b4-188a7","335"],
["318","072@188a7-193b7","336"],
["319","072@194a1-196b7","337"],
["320","072@197a1-198b4","338"],
["321","072@198b5-201a5","339"],
["322","072@201a6-204a4","340"],
["323","072@204a4-204a6","341"],
["324","072@204a6-204b3","342"],
["325","072@204b3-208b7","343"],
["329","072@257a7-258b6","347"],
["330","072@258b7-259b3","348"],
["331","072@259b3-260a4","349"],
["332","072@260a5-263b5","350"],
["333","072@263b6-268a4","351"],
["334","072@268a5-271a5","352"],
["335","072@271a5-274a7","353"],
["336","072@274a7-275a6","354"],
["337","072@275a6-277a4","355"],
["338","072@277a4-298b7","357"],
["339a","072@298b7-310a7","358"],
["339b","072@310b1-336a7","359"],
["340","073@001b1-309a7","360"],
["340","074@001b1-128b7","360"],
["341","074@129a1-298b1","361"],
["342","074@298b1-300a4","362"],
["343","075@001b1-286b7","363"],
["344","075@287a1-289b2","364"],
["345","075@289b2-291a7","365"],
["346","075@291b1-298a7","366"],
["347","076@001b1-022a4","367"],
["348","076@022a4-031b3","368"],
["349","076@031b3-050a5","369"],
["350","076@050a5-055b7","370"],
["351","076@055b7-070b1","371"],
["352","076@070b2-086a2","372"],
["353","076@086a2-198b7","373"],
["354","076@199a1-208b7","374"],
["355","076@209a1-216a4","375"],
["356","076@216a5-220b5","376"],
["357","076@220b6-232a7","377"],
["360","076@281b5-282a7","382"],
["361","077@001b1-154a6","1117"],
["362","078@001b1-013b7","385"],
["363","078@014a1-021a7","386"],
["364","078@022a1-128b7","387"],
["365","078@129a1-144a7","388"],
["366","078@144b1-146a7","389"],
["367","078@146a7-150b7","390"],
["368","078@151a1-193a6","391"],
["369","078@193a6-212a7","392"],
["371","078@247a1-370a7","394"],
["372","079@001b1-125a7","395"],
["373","079@125b1-136b7","396"],
["374","079@137a1-264b7","397"],
["375","079@265a1-311a6","398"],
["376","080@001b1-033b7","399"],
["377","080@034a1-044b5","400"],
["378","080@044b6-052b5","401"],
["379","080@052b5-060a7","402"],
["380","080@060b1-071a2","403a"],
["381","080@071a2-072b7","403b"],
["382","080@072b7-073a7","404"],
["383","080@073b1-158b7","405a"],
["384","080@158b7-184a7","405b"],
["385","080@184b1-187a1","406"],
["386","080@187a2-195b7","407"],
["387","080@196a1-199a7","408"],
["388","080@199a7-202a1","409"],
["389","080@202a2-203b1","410"],
["390","080@203b1-208b1","411"],
["391","080@208b2-213b4","412"],
["392","080@213b4-216a3","413"],
["393","080@216a3-219a2","414"],
["394","080@219a2-220a7","415"],
["395","080@220b1-221b7","416"],
["396","080@222a1-223a7","417"],
["397","080@223a7-224b4","418"],
["398","080@224b4-227b2","419"],
["399","080@227b3-229a2","420"],
["400","080@229a2-230a2","421"],
["401","080@230a2-231b3","422"],
["402","080@231b4-233a5","423"],
["403","080@233a5-235a5","424"],
["404","080@235a5-237a5","425"],
["406","080@239a1-239b7","427"],
["407","080@240a1-242b7","428"],
["408","080@242b7-244a7","429"],
["409","080@244b1-245b6","430"],
["410","080@245b6-247a4","431"],
["411","080@247a4-248a1","432"],
["412","080@248a1-249b5","433"],
["413","080@249b6-251b3","434"],
["414","080@251b3-254b5","435"],
["415","080@254b5-259b3","436"],
["417","080@261b3-263a7","438"],
["418","080@263b1-292a6","439"],
["419a","081@001b1-013b5","440a"],
["419b","081@013b5-030a3","440b"],
["420","081@030a4-065b7","441"],
["421","081@066a1-090b7","442"],
["422","081@091a1-096b6","443"],
["423","081@096b6-136b4","444"],
["424","081@136b5-142b7","445"],
["425","081@143a1-167a5","446"],
["426","081@167a6-171a1","447"],
["427","081@171a2-176a2","448"],
["428","081@176a2-180b7","449"],
["429","081@181a1-231b5","450"],
["430","081@231b5-260a2","451"],
["431","081@260a3-304a7","452"],
["432","081@304b1-343a7","453"],
["433","082@001b1-012a7","454"],
["434","082@012b1-014b4","455"],
["435","082@014b4-016b5","456"],
["436","082@016b5-027a6","457"],
["437","082@027a6-029a7","458"],
["438","082@029b1-042b3","459"],
["439","082@042b3-043b6","460"],
["440","082@043b6-045b6","461"],
["441","082@045b6-086a7","462"],
["442","082@086b1-089b7","463"],
["443","082@090a1-148a6","464"],
["444","082@148a6-157b6","466"],
["445","082@157b6-208a1","467"],
["446","082@208a1-277b1","468"],
["447","082@277b1-281b7","469"],
["448","082@282a1-286a6","470"],
["449","083@001b1-038b7","473"],
["450","083@038b7-061a3","474"],
["451","083@061a4-106a4","475"],
["452","083@106a5-355a4","476"],
["453","084@001b1-003b2","477"],
["454","084@003b2-008a4","478"],
["455","084@008a4-012a5","479"],
["456","084@012a6-015a4","480"],
["457","084@015a5-030a7","481"],
["458","084@030b1-036b3","482"],
["459","084@036b4-039b6","483"],
["460","084@039b6-039b7","484"],
["461","084@040a1-065b6","485"],
["462","084@065b7-068a1","486"],
["463","084@068a1-069a6","487"],
["464","084@069a7-090b4","488"],
["465","084@090b4-093b7","489"],
["466","084@094a1-134a7","490"],
["468","084@151b4-164a1","492"],
["469","084@164a1-167b5","493"],
["470","084@167b5-173b3","494"],
["471","084@173b3-174a2","495"],
["472","084@174a2-174b7","496"],
["473","084@175a1-185b7","497"],
["474","084@186a1-214b7","498"],
["475","084@215a1-244b7","500"],
["476","084@245a1-247b4","501"],
["477","084@247b4-303a5","502"],
["478","085@001b1-142a7","504"],
["479","085@142b1-274a7","505"],
["481","086@010a1-058a7","507"],
["482","086@058b1-096a3","508"],
["483","086@096a3-096a7","509"],
["484","086@096b1-146a7","510"],
["485","086@146b1-150a7","511"],
["486","086@150b1-173a4","512"],
["487","086@173a4-265b7","513"],
["488","086@266a1-272a7","514"],
["489","087@001b1-082a7","515"],
["490","087@082b1-083a7","516"],
["491","087@083b1-120b5","517"],
["492","087@120b5-152b1","518"],
["493","087@152b2-261b7","519"],
["494","087@262a1-323a7","520"],
["495","088@001b1-156b7","521"],
["496","088@157a1-158a6","522"],
["497","088@158a6-167a3","523"],
["498","088@167a3-172a7","524"],
["499","088@172b1-176b7","525"],
["500","088@177a1-181a2","526"],
["501","088@181a2-247a7","527"],
["502","088@248a1-273b7","528"],
["503","088@274a1-283b7","529"],
["504","088@284a1-286a6","530"],
["505","088@286a6-286a7","531"],
["506","088@286b1-309a6","532"],
["507","089@001b1-007b3","533"],
["508","089@007b3-024b6","534"],
["509","089@024b6-025b1","535"],
["510","089@025b1-035b3","536"],
["511","089@035b4-039a1","537"],
["512","089@039a1-042b7","538"],
["513","089@043a1-044b1","539"],
["514","089@044b2-046b6","540"],
["515","089@046b6-048a6","541"],
["516","089@048a6-050b2","542"],
["517","089@050b2-054a5","543"],
["518","089@054a5-056a2","544"],
["519","089@056a2-058a6","545"],
["520","089@058a7-059a4","546"],
["521","089@059a4-059a7","547"],
["522","089@059a7-060b4","548"],
["523","089@060b4-062a1","549"],
["524","089@062a1-062a6","550"],
["525","089@062a6-071a1","551"],
["526","089@071a1-071b4","552"],
["527","089@071b4-085a7","553"],
["528","089@085b1-090b3","554"],
["529","089@090b3-092b6","555"],
["530","089@092b6-094a7","556"],
["531","089@094b1-095b3","557"],
["532","089@095b4-099b4","558"],
["533","089@099b4-099b5","559"],
["534","089@099b5-100a1","560"],
["535","089@100a1-100a3","561"],
["536","089@100a3-100a4","562"],
["537","089@100a4-100a5","563"],
["538","089@100a5-100b4","564"],
["539a","089@100b4-100b7","565"],
["539b","089@100b7-101a1","566"],
["540","089@101a1-101a6","567"],
["541","089@101a6-101b3","568"],
["542","089@101b3-102a4","569"],
["543","089@102a4-104b7","570"],
["544","089@105a1-351a7","571"],
["545","090@001b1-013b6","572"],
["546","090@013b7-014a5","573"],
["547","090@014a5-014b6","574"],
["548","090@014b6-015a2","575"],
["549","090@015a2-015a3","576"],
["550","090@015a3-015b2","577"],
["551","090@015b2-015b6","578"],
["552","090@015b6-016b1","579"],
["553","090@016b1-016b6","580"],
["554","090@016b6-018b3","581"],
["555","090@018b3-020a3","582"],
["556","090@020a4-159b3","583"],
["557","090@160a1-292a7","584"],
["558","091@001b1-062a7","585"],
["559","091@062b1-087b1","586"],
["560","091@087b1-117a5","587"],
["561","091@117a5-117b4","588"],
["562","091@117b4-138b5","589"],
["563","091@138b6-150b2","590"],
["564","091@150b2-156a7","591"],
["565","091@157a1-158b1","592"],
["567","091@165b5-186a3","594"],
["568","091@186a3-191b3","595"],
["569","091@191b4-195a5","596"],
["570","091@195a6-196b4","597"],
["571","091@196b4-198a6","598"],
["572","091@198a6-199a3","599"],
["573","091@199a4-200a2","600"],
["574","091@200a2-200a7","601"],
["575","091@200a7-202a3","602"],
["576","091@202a3-202b5","603"],
["577","091@202b5-203a1","604"],
["578","091@203a1-203a3","605"],
["579","091@203a3-203a5","606"],
["580","091@203a5-203a7","607"],
["581","091@203b1-203b5","608"],
["582","091@203b5-203b6","609"],
["583","091@203b6-204a1","610"],
["584","091@204a1-204a3","611"],
["585","091@204a3-204a4","612"],
["586","091@204a4-204a6","613"],
["587","091@204a6-204a7","614"],
["588","091@204b1-204b1","615"],
["589","091@204b1-204b3","616"],
["590","091@204b3-204b7","617"],
["591","091@205a1-212b7","618"],
["592","091@213a1-219a7","619"],
["593","091@219b1-224b2","620"],
["594","091@224b2-229b7","621"],
["595","091@230a1-237b4","622"],
["596","091@237b4-242a6","623"],
["597","091@242a6-243b1","624"],
["598","091@243b1-248a3","625"],
["599","091@248a3-250a5","626"],
["600","091@250a5-259b7","627"],
["601","091@260a1-260a3","628"],
["602","091@260a3-266b4","629"],
["603","091@266b4-267a3","630"],
["604","091@267a3-269a3","631"],
["606","092@036a1-037a2","633"],
["607","092@037a2-039a4","634"],
["608","092@039a5-040b6","635"],
["609","092@040b7-041b6","636"],
["610","092@041b6-043a2","637"],
["611","092@043a3-045a3","638"],
["612","092@045a3-045a7","639"],
["613","092@045b1-046b5","640"],
["614","092@046b5-047a7","641"],
["615","092@047b1-052a5","642"],
["617","092@052b5-056a7","644"],
["618","092@056a7-058b3","645"],
["619","092@058b3-059a6","646"],
["620","092@059a6-060b4","647"],
["621","092@060b4-061a1","648"],
["622","092@061a2-061b7","649"],
["623","092@062a1-062a7","650"],
["624","092@062b1-062b2","651"],
["625","092@062b2-062b3","652"],
["626","092@062b3-063a3","653"],
["627","092@063a3-063a4","654"],
["628","092@063a4-063a6","655"],
["629","092@063a6-067a2","656"],
["630","092@067a2-067b3","657"],
["631","092@067b3-068a2","658"],
["632","092@068a3-080b7","659"],
["633","092@081a1-102b7","660"],
["634","092@103a1-105a2","661"],
["635","092@105a3-107a7","662"],
["636","092@107b1-109a5","663"],
["637","092@109a5-112a4","664"],
["638","092@112a4-116a2","665"],
["639","092@116a2-118b5","666"],
["640","092@118b5-122a1","667"],
["641","092@122a2-124a4","668"],
["642","092@124a5-126a5","669"],
["643","092@126a6-127b2","670"],
["644","092@127b2-128a3","671"],
["645","092@128a3-129a2","672"],
["646","092@129a3-129b7","673"],
["647","092@130a1-132b2","674"],
["648","092@132b2-134a5","675"],
["649","092@134a5-136a7","676"],
["650","092@136a7-136b4","677"],
["651","092@136b4-136b7","678"],
["652","092@136b7-137a2","679"],
["653","092@137a2-137a5","680"],
["654","092@137a5-146a1","682"],
["655","092@146a1-148b7","683"],
["656","092@149a1-149a7","684"],
["658","092@149b1-162b5","685"],
["659","092@162b5-175a5","686"],
["660","092@175a5-180a1","687"],
["661","092@180a1-180b1","688"],
["662","092@180b1-183a7","689"],
["663","092@183b1-186a1","690"],
["664","092@186a1-189b4","692"],
["665","092@189b5-190b3","693"],
["666","092@190b4-192a5","694"],
["667","092@192a5-193a1","695"],
["668","092@193a2-198b7","696"],
["669","092@198b7-201a5","697"],
["670","092@201a5-201b6","698"],
["671","092@201b6-202a4","699"],
["672","092@202a4-202b2","700"],
["673","092@202b2-209b5","701"],
["674","092@209b5-211a6","702"],
["675","092@211a6-211b1","703"],
["677","092@211b2-216a7","705"],
["678","092@216a7-220b5","706"],
["679","092@220b6-222b2","707"],
["680","092@222b2-222b6","708"],
["681","092@222b6-223a1","709"],
["682","092@223a1-223a5","710"],
["683","092@223a5-223a7","711"],
["684","092@224a1-278a7","712"],
["685","092@278b1-284a7","713"],
["686","092@284b1-287a5","714"],
["687","093@001b1-316a6","717"],
["687","094@001b1-057a6","717"],
["689","094@059a3-061b3","719"],
["690","094@061b4-065b1","720"],
["691","094@065b2-094a5","721"],
["692","094@094a5-129b6","722"],
["693","094@129b6-137a6","723"],
["694","094@137a7-139a7","724"],
["695","094@139b1-147a7","725"],
["696","094@147b1-147b3","726"],
["697","094@147b3-148a2","727"],
["698","094@148a2-149a7","728"],
["699","094@149b1-150a5","729"],
["700","094@150a5-152b1","730"],
["701","094@152b1-157b2","731"],
["702","094@157b2-164b3","732"],
["703","094@164b3-165b4","733"],
["704","094@165b4-171a5","734"],
["705","094@171a5-171b1","735"],
["706","094@171b1-173a6","736"],
["707","094@173a6-175a1","737"],
["708","094@175a1-176a7","738"],
["709","094@176b1-177b5","739"],
["710","094@177b5-177b7","740"],
["711","094@177b7-178a6","741"],
["712","094@178a6-178b1","742"],
["713","094@178b1-178b3","743"],
["714","094@178b3-178b5","744"],
["715a","094@178b5-179a1","745"],
["715b","094@179a1-179a3","746"],
["716","094@179a4-179a6","747"],
["717","094@179a6-179b1","748"],
["718","094@179b1-179b7","749"],
["719","094@179b7-180a2","750"],
["720","094@180a3-180a5","751"],
["721","094@180a5-199b7","752"],
["722","094@200a1-201b3","753"],
["723","094@201b3-204a7","754"],
["724","094@205a1-311a6","755"],
["724","095@001b1-200b5","755"],
["725","095@200b6-202a5","756"],
["726","095@202a5-217a2","757"],
["727","095@217a2-219a5","758"],
["728","095@219a6-222a5","759"],
["729","095@222a5-222a6","760"],
["730","095@222a7-222b4","761"],
["731","095@222b4-224b1","762"],
["732","095@224b1-225a2","763"],
["733","095@225a2-225b6","764"],
["734","095@225b7-227a7","765"],
["735","095@227a7-228a7","766"],
["736","095@228b1-229a3","767"],
["737","095@229a3-229b3","768"],
["738","095@229b3-230a6","769"],
["739","095@230a6-234b1","770"],
["740","095@234b1-235a2","771"],
["741","095@235a3-235b4","772"],
["742","095@235b4-236a1","773"],
["743","095@236a1-236b7","774"],
["744","095@236b7-266a7","775"],
["745","095@266b1-277a4","471"],
["746","096@001b1-237b7","777"],
["747","096@238a1-263a7","778"],
["748","096@263b1-264b1","779"],
["749","096@264b1-265b3","780"],
["750","096@265b3-266b7","781"],
["751","096@267a1-295a7","782"],
["752","097@001b1-004b4","783"],
["753","097@004b4-005a7","784"],
["754","097@005a7-006a5","785"],
["755","097@006a5-007b4","786"],
["756","097@007b4-008a7","787"],
["757","097@008a7-019a5","788"],
["773","097@011b5-112a7","803"],
["758","097@019a5-027b4","789"],
["759","097@027b4-050a3","790"],
["760","097@050a4-052a1","791"],
["761","097@052a2-053a6","792"],
["762","097@053a6-054a3","793"],
["763","097@054a3-055b7","794"],
["764","097@055b7-056b2","795"],
["765","097@056b2-069a6","796"],
["766","097@069a7-081b7","797a"],
["767","097@082a1-088b7","797b"],
["768","097@088b7-089b6","798"],
["769","097@089b6-090a6","799"],
["770","097@090a6-104a2","800"],
["771","097@104a3-105b7","801"],
["772","097@105b7-111b4","802"],
["775","097@112b2-112b3","805"],
["776","097@112b4-112b7","806"],
["777","097@112b7-113a4","807"],
["778","097@113a5-113a6","808"],
["779","097@113a6-113b2","809"],
["780","097@113b2-113b4","810"],
["781","097@113b4-113b5","811"],
["782","097@113b5-114a1","812"],
["783","097@114a1-114a3","813"],
["784","097@114a3-114a4","814"],
["785","097@114a5-114a6","815"],
["786","097@114a7-114b1","816"],
["787","097@114b2-114b3","817"],
["788","097@114b3-114b4","818"],
["789","097@114b4-114b7","819"],
["790","097@114b7-115a1","820"],
["791","097@115a1-115a3","821"],
["792","097@115a3-115a5","822"],
["793","097@115a5-115a7","823"],
["794","097@115a7-115b4","824"],
["795","097@115b4-115b6","825"],
["796","097@115b6-115b7","826"],
["797","097@115b7-116a2","827"],
["798","097@116a3-116a4","828"],
["799","097@116a4-116a5","829"],
["800","097@116a5-116a6","830"],
["801","097@116a6-116a7","831"],
["802","097@116b1-116b2","832"],
["803","097@116b2-116b4","833"],
["804","097@116b4-116b7","834"],
["805","097@118a1-140b7","835"],
["806","097@141a1-167b7","836"],
["807","097@168a1-222b7","837"],
["808","097@223a1-225b7","838"],
["809","097@226a1-229a3","839"],
["810","097@229a3-250b3","840"],
["811","097@250b4-251a4","841"],
["812","097@251a5-253a2","842"],
["813","097@253a2-254a5","843"],
["814","097@254a5-254b3","844"],
["815","097@254b3-256a6","845"],
["816","097@256a7-257a5","846"],
["817","097@257a5-258b7","847"],
["818","097@258b7-259b1","848"],
["819","097@259b1-260a4","849"],
["820","097@260a5-260b6","850"],
["821","097@260b7-261a7","851"],
["822","097@261b1-261b6","852"],
["823","097@261b7-262a2","853"],
["824","097@262a3-262a6","854"],
["825","097@262a6-262b3","855"],
["826","097@262b3-263b6","856"],
["827","097@263b7-264a5","857"],
["828","098@001b1-086a7","1118"],
["829","098@086a7-290a7","1119"],
["830","098@290b1-358a7","1120"],
["831","099@001b1-110a7","1121"],
["832","099@110b1-132a7","1122"],
["833","099@132b1-198a7","1123"],
["834","099@198b1-298b7","1124"],
["688","099@285a1-286b8","718"],
["835","099@299a1-311a7","1125"],
["836","100@001b1-034b3","1126"],
["837","100@034b3-060a4","1127"],
["838","100@060a5-077a5","1128"],
["840","100@077a6-129b7","1129"],
["841","100@130a1-202a3","1130"],
["842a","100@202a3-203a5","1131"],
["842b","100@203a5-207b5","1132"],
["842c","100@207b5-208b7","1133"],
["842d","100@209a1-212a6","1134"],
["842e","100@212a7-213b5","1135"],
["842f","100@213b5-216a4","1136"],
["842g","100@216a4-220a3","1137"],
["842h","100@220a3-223b6","1138"],
["844","100@223b6-253a5","1139"],
["846","100@253a5-267b6","1140"],
["847","100@267b6-287a7","1141"],
["848","101@001b1-003b6","858"],
["849","101@003b6-055b6","859"],
["850","101@055b6-057a7","860"],
["851","101@057a7-063a1","861"],
["852","101@063a1-064b7","862"],
["853","101@064b7-065a5","863"],
["854","101@065a5-069b5","864"],
["855","101@069b5-073b4","865"],
["856","101@073b4-076a4","866"],
["857","101@076a5-077b5","867"],
["858","101@077b6-079b2","868"],
["859","101@079b2-081b3","869"],
["860","101@081b3-087a7","870"],
["861","101@087a7-088b7","871"],
["862","101@088b7-089a2","872"],
["863","101@089a2-089a6","873"],
["864","101@089a6-089a7","874"],
["865","101@089a7-089b4","875"],
["866","101@089b4-090a2","876"],
["867","101@090a2-090a6","877"],
["868","101@090a6-090b5","878"],
["869","101@090b5-090b7","879"],
["870","101@090b7-091a3","880"],
["871","101@091a3-091a4","881"],
["872","101@091a4-091a6","882"],
["873","101@091a6-095a5","883"],
["874","101@095a5-098a4","884"],
["875","101@098a5-102a3","885"],
["876","101@102a3-104a6","886"],
["877","101@104a6-106a1","887"],
["878","101@106a2-108b6","888"],
["879","101@108b6-112a7","889"],
["880","101@112a7-114b7","890"],
["881","101@114b7-118a1","891"],
["882","101@118a2-120a3","892"],
["833","101@120a3-122a2","893"],
["884","101@122a2-123a2","894"],
["885","101@123a2-129a1","895"],
["886","101@129a1-135b2","896"],
["887","101@135b2-159b1","897"],
["888","101@159b1-161b3","898"],
["889","101@161b3-163a2","899"],
["890","101@163a2-165a7","900"],
["891","101@165b1-165b3","901"],
["892","101@165b3-166a3","902"],
["893","101@166a4-166b3","903"],
["894","101@166b3-167a1","904"],
["895","101@167a1-167b2","905"],
["896","101@167b2-167b3","906"],
["897","101@167b3-168a1","907"],
["898","101@168a1-168a5","908"],
["899","101@168a5-205a5","909"],
["900","101@205a5-213a6","910"],
["901","101@213a6-215b1","911"],
["902","101@215b1-217b2","912"],
["903","101@217b2-223b7","913"],
["904","101@223b7-226b3","914"],
["905","101@226b4-228b3","915"],
["906","101@228b3-231a1","916"],
["907","101@231a1-232a7","917"],
["908","101@232a7-233a5","918"],
["909","101@233a5-239a3","919"],
["910","101@239a3-240a1","920"],
["911","101@240a1-241b4","921"],
["912","101@241b4-242a4","922"],
["913","101@242a4-242a7","923"],
["914","101@242a7-242b3","924"],
["915","101@242b3-244b5","925"],
["916","101@244b6-254b7","926"],
["917","101@255a1-260a7","927"],
["918","101@260b1-261a4","928"],
["920","101@262a2-262a7","930"],
["922","101@264a3-264b7","932"],
["923","101@265a1-265a7","933"],
["924","101@265b1-267a7","934"],
["925","101@267a7-268b6","935"],
["926","101@268b7-271a4","936"],
["927","101@271a5-272b4","937"],
["928","101@272b4-273b4","938"],
["929","101@273b4-276a1","939"],
["930","101@276a1-277b4","940"],
["931","101@277b4-279a7","941"],
["932","101@279a7-279b7","942"],
["933","101@279b7-280b2","943"],
["934","101@280b2-280b5","944"],
["935","101@280b5-281a2","945"],
["936","101@281a2-281a4","946"],
["937","101@281a4-281a7","947"],
["938","101@281a7-281b6","948"],
["939","101@281b6-281b7","949"],
["940","101@282a1-282a4","950"],
["941","101@282a4-282a6","951"],
["942","101@282a6-282a7","952"],
["943","101@282a7-282b2","953"],
["944","101@282b2-282b3","954"],
["945","101@282b4-282b4","955"],
["946","101@282b5-282b6","956"],
["947","101@282b6-283a5","957"],
["948","102@001b1-030a7","958"],
["949","102@030b1-041a7","959"],
["950","102@041b1-042b1","960"],
["951","102@042b1-043b6","961"],
["952","102@043b6-045a1","962"],
["953","102@045a2-045b6","963"],
["954","102@045b7-046a1","964"],
["955","102@046a1-046b6","965"],
["956","102@046b7-049b7","966"],
["957","102@050a1-050b3","967"],
["958","102@050b3-051b4","968"],
["959","102@051b4-053a6","969"],
["960","102@053a6-055b5","970"],
["961","102@055b5-056a5","971"],
["962","102@056a5-056b5","972"],
["963","102@056b5-057a7","973"],
["964","102@057a7-057b2","974"],
["965","102@057b2-058a7","975"],
["966","102@058b1-079b7","976"],
["967","102@080a1-081b5","977"],
["968","102@081b5-083b1","978"],
["969","102@083b2-084a4","979"],
["970","102@084a4-085b3","980"],
["971","102@085b3-086a6","981"],
["972","102@086a6-086b7","982"],
["973","102@087a1-087a7","983"],
["974","102@087a7-089a4","984"],
["975","102@089a4-090a3","985"],
["976","102@090a3-092a7","986"],
["977","102@092a7-095a7","987"],
["978","102@095a7-096a1","988"],
["979","102@096a1-096a7","989"],
["980","102@096a7-096b3","990"],
["981","102@096b3-099a2","991"],
["982","102@099a2-099b7","992"],
["983","102@099b7-100a3","993"],
["984","102@100a3-110b6","994"],
["985","102@110b7-119b7","995"],
["986","102@120a1-124b7","996"],
["987","102@124b7-133b2","997"],
["988","102@133b3-138b2","998"],
["989","102@138b2-141b7","999"],
["990","102@142a1-143a2","1000"],
["991","102@143a3-143b6","1001"],
["992","102@143b6-144b4","1002"],
["993","102@144b4-146b2","1003"],
["994","102@146b2-147a4","1004"],
["995","102@147a4-148a3","1005"],
["996","102@148a3-149a4","1006"],
["997","102@149a4-149b5","1007"],
["998","102@149b5-150a4","1008"],
["999","102@150a4-153a7","1009"],
["1000","102@153b1-156a2","1010"],
["1001","102@156a3-157b2","1011"],
["1002","102@157b3-160a2","1012"],
["1003","102@160a2-160a4","1013"],
["1004","102@160a4-160b2","1014"],
["1005","102@160b3-167a2","1015"],
["1006","102@167a2-171a6","1016"],
["1007","102@171a7-172a2","1017"],
["1008","102@172a2-172b4","1018"],
["1009","102@172b4-176b1","1019"],
["1010","102@176b1-177b7","1020"],
["1011","102@178a1-179a1","1021"],
["1012","102@179a1-179a7","1022"],
["1013","102@179a7-179b3","1023a"],
["1014","102@179b4-179b5","1023b"],
["1015","102@179b5-180a1","1024"],
["1016","102@180a1-180b2","1025"],
["1017","102@180b2-180b3","1026"],
["1018","102@180b4-181a5","1027"],
["1019","102@181a5-181a7","1028"],
["1020","102@181a7-181b5","1029"],
["1021","102@181b5-181b6","1030"],
["1022","102@181b7-183a1","1031"],
["1023","102@183a1-183a2","1032"],
["1024","102@183a3-183a4","1033"],
["1025","102@183a5-183a6","1034"],
["1026","102@183a7-183b7","1035"],
["1027","102@184a1-184a2","1036"],
["1028","102@184a2-184a3","1037"],
["1029","102@184a3-184a6","1038"],
["1030","102@184a6-184b1","1039"],
["1031","102@184b1-184b3","1040"],
["1032","102@184b3-184b7","1041"],
["1033","102@185a1-185a3","1042"],
["1034","102@185a3-185a4","1043"],
["1035","102@185a4-185a6","1044"],
["1036","102@185a6-185b1","1045"],
["1037","102@185b1-185b2","1046"],
["1038","102@185b2-185b7","1047"],
["1039","102@185b7-186a7","1048"],
["1040","102@186a7-186b2","1049"],
["1041","102@186b3-186b6","1050"],
["1042","102@186b6-187a1","1051"],
["1043","102@187a1-187a3","1052"],
["1044","102@187a4-187a6","1053"],
["1045","102@187a6-187b1","1054"],
["1046","102@187b2-187b4","1055"],
["1047","102@187b4-187b7","1056"],
["1048","102@187b7-188a3","1057"],
["1049","102@188a4-188a6","1058"],
["1050","102@188a7-188b1","1059"],
["1051","102@188b1-188b4","1060"],
["1052","102@188b4-188b6","1061"],
["1053","102@188b7-189a2","1062"],
["1054","102@189a2-189a4","1063"],
["1055","102@189a4-189a6","1064"],
["1056","102@189a6-189a7","1065"],
["1057","102@189b1-189b2","1066"],
["1058","102@189b2-189b3","1067"],
["1059","102@189b3-189b5","1068"],
["1060","102@189b5-189b6","1069"],
["1061","102@189b6-190a1","1070"],
["1062a","102@190a1-190a2","1071"],
["1062b","102@190a3-190a4","1072"],
["1063","102@190a4-205b4","1073"],
["1064","102@205b5-215b7","1074"],
["1065","102@216a1-229b2","1075"],
["1066","102@229b3-234b1","1076"],
["1067","102@234b1-235a1","1077"],
["1068","102@235a2-235b4","1078"],
["1069","102@235b4-239a1","1079"],
["1070","102@239a1-239b1","1080a"],
["1071","102@239b1-239b1","1080b"],
["1072","102@239b1-239b2","1080c"],
["1073","102@239b2-239b2","1080d"],
["1074","102@239b2-239b3","1080e"],
["1075","102@239b3-239b4","1080f"],
["1076","102@239b4-239b5","1081"],
["1077","102@239b5-239b6","1082"],
["1078","102@239b6-240a3","1083"],
["1079","102@240a3-240a7","1084"],
["1080","102@240a7-240b5","1085"],
["1081","102@240b5-242b2","1086"],
["1082","102@242b3-245a4","1087"],
["1083","102@245a4-247a7","1088"],
["1084","102@247a7-247b3","1089"],
["1085","102@247b3-251a6","1090"],
["1086","102@251a7-252a3","1091"],
["1087","102@252a3-252b3","1092"],
["1088","102@252b3-252b7","1093"],
["1089","102@253a1-253a6","1094"],
["1090","102@253a6-254b7","1095"],
["1091","102@254b7-255a2","1096"],
["1092","102@255a2-255b5","1097"],
["1093","102@255b6-256a2","1098"],
["1094","102@256a3-256b7","1099"],
["1095","102@256b7-260b7","1100"],
["1096","102@261a1-262b5","1101"],
["1097","102@262b5-266a3","1102"],
["1098","102@266a4-267a5","1103"],
["1099","102@267a5-268b1","1104"],
["1100","102@268b1-269b5","1105"],
["1101","102@269b5-270a3","1106"],
["1102","102@270a4-270b7","1107"],
["1103","102@271a1-272b3","1108"],
["1104","102@272b4-273a5","1109"],
["1105","102@273a5-274b3","1110"],
["1106","102@274b3-275a4","1111"],
["1107","102@275a5-275b3","1112"],
["1108","102@275b4-275b7","1113"],
["1109","102@275b7-278a2","1114"],
["1110","102@278a2-278a7","1115"],
["1112","105@001b1-073a5","1150"]];
uPedurma.rcode="U";
module.exports=uPedurma;
});
require.register("pedurmacat-dataset/kPedurma.js", function(exports, require, module){
var kPedurma=[["1","001@03-00830","1"],
["1","002@03-00868","1"],
["1","003@03-00819","1"],
["1","004@03-00841","1"],
["2","005@03-1","2"],
["3","005@2-00808","3"],
["3","006@03-00784","3"],
["3","007@03-00833","3"],
["3","008@03-00735","3"],
["4","009@03-1","4"],
["5","009@2-00898","5"],
["6","010@03-00877","6"],
["6","011@03-00979","6"],
["8","012@00256-00828","8"],
["7","012@03-00255","7"],
["9","013@00873-00881","9"],
["10","013@00882-00885","10"],
["11","013@00886-00889","11"],
["12","013@00890-00895","12"],
["13","013@00896-00908","13"],
["14","013@00909-00913","14"],
["15","013@00914-00916","15"],
["16","013@00917-00920","16"],
["17","013@00921-00926","17"],
["18","013@00927-00929","18"],
["19","013@00930-00935","19"],
["20","013@00936-00937","20"],
["21a","013@00938-9,942","21a"],
["21b","013@00939-0,942","21b"],
["21c","013@00940-00942","21c"],
["22","013@00943-00945","22"],
["23","013@00946-00948","23"],
["24","013@00949-00953","24"],
["8","013@03-00872","8"],
["25","014@03-00884","25"],
["25","015@03-00888","25"],
["25","016@03-00890","25"],
["25","017@03-00874","25"],
["25","018@03-00899","25"],
["25","019@03-00887","25"],
["25","020@03-00867","25"],
["25","021@03-00868","25"],
["25","022@03-00812","25"],
["25","023@03-00852","25"],
["25","024@03-00882","25"],
["25","025@03-00907","25"],
["26","026@03-00896","26"],
["26","027@03-00936","26"],
["26","028@03-00891","26"],
["27","029@03-00756","27"],
["27","030@03-00779","27"],
["28","031@00530-00763","28"],
["27","031@03-00529","27"],
["28","032@03-00764","28"],
["29","033@03-00723","29"],
["32","034@00279-00326","32"],
["33","034@00327-00363","33"],
["34","034@00364-00383","34"],
["35","034@00384-00391","35"],
["36","034@00392-00397","36"],
["37","034@00398-00401","37"],
["38","034@00402-00407","38"],
["39","034@00408-00413","39"],
["40","034@00414-00416","40"],
["41","034@00417-00489","41"],
["42","034@00490-00496","42"],
["43","034@00497-00502","43"],
["44","034@00503-00507","44"],
["45","034@00508-00510","45"],
["46","034@00511-00513","46"],
["47","034@00514-00516","47"],
["48","034@00517-00526","48"],
["49","034@00527-00723","49"],
["50","034@00724-00752","50"],
["51","034@00753-00764","51"],
["52","034@00765-00785","52"],
["53","034@00786-00790","53"],
["54","034@00791-00808","54"],
["55","034@00809-00818","55"],
["56","034@00819-00826","56"],
["57","034@00827-00831","57"],
["58","034@00832-00835","58"],
["59","034@00836-00839","59"],
["60","034@00840-00844","60"],
["30","034@03-3","30"],
["31","034@4-00278","31"],
["61","035@03-01038","61"],
["61","036@03-01027","61"],
["61","037@03-01013","61"],
["61","038@03-00960","61"],
["63","039@00129-00288","63"],
["64","039@00289-00598","64"],
["65","039@00599-00696","65"],
["66","039@00697-00795","66"],
["62","039@03-00128","62"],
["68","040@00188-00390","68"],
["69","040@00391-00459","69"],
["70","040@00460-00521","70"],
["71","040@00522-00553","71"],
["72","040@00554-00736","72"],
["73","040@00737-00861","73"],
["67","040@03-00187","67"],
["74","041@00637-00736","74"],
["75","041@00737-00774","75"],
["76","041@00775-00912","76"],
["73","041@03-00636","73"],
["78","042@00496-00682","78"],
["79","042@00683-00774","79"],
["80","042@00775-00868","80"],
["77","042@03-00495","77"],
["83","043@00101-00190","83"],
["84","043@00191-00323","84"],
["85","043@00324-00369","85"],
["86","043@00370-00432","86"],
["87","043@00433-00510","87"],
["88","043@00511-00550","88"],
["89","043@00551-00582","89"],
["90","043@00583-00618","90"],
["91","043@00619-00637","91"],
["92","043@00638-00649","92"],
["93","043@00650-00696","93"],
["94","043@00697-00756","94"],
["95","043@00757-00771","95"],
["96","043@00772-00829","96"],
["97","043@00830-00900","97"],
["81","043@03-6","81"],
["82","043@7-00100","82"],
["100","044@00197-00260","100"],
["101","044@00261-00288","101"],
["102","044@00289-00322","102"],
["103","044@00323-00331","103"],
["104","044@00332-00424","104"],
["105","044@00425-00493","105"],
["106","044@00494-00514","106"],
["107","044@00515-00588","107"],
["108","044@00589-00711","108"],
["109","044@00712-00775","109"],
["110","044@00776-00842","110"],
["97","044@03-1","97"],
["99","044@2-00196","99"],
["98","044@2-1","98"],
["111","045@03-00853","111"],
["113","046@00588-00654","113"],
["114","046@00655-00697","114"],
["115","046@00698-00753","115"],
["116","046@00754-00758","116"],
["112","046@03-00587","112"],
["118","047@00727-00808","118"],
["117","047@03-00726","117"],
["120","048@00582-00707","120"],
["121","048@00708-00738","121"],
["122","048@00739-00744","122"],
["123","048@00745-00751","123"],
["119","048@03-00581","119"],
["125","049@00141-00506","125"],
["126","049@00507-00747","126"],
["127","049@00748-00767","127"],
["124","049@03-00140","124"],
["129","050@00146-00344","129"],
["130","050@00345-00777","130"],
["128","050@03-00145","128"],
["132","051@00477-00515","132"],
["133","051@00516-00528","133"],
["134","051@00529-00655","134"],
["135","051@00656-00763","135"],
["136","051@00764-00786","136"],
["131","051@03-00476","131"],
["137","052@03-00870","137"],
["137","053@03-00870","137"],
["139","054@00377-00383","139"],
["140","054@00384-00386","140"],
["141","054@00387-00552","141"],
["142","054@00553-00757","142"],
["143","054@00758-00760","143"],
["144","054@00761-00769","144"],
["138","054@03-00376","138"],
["146","055@00446-00457","146"],
["147","055@00458-00551","147"],
["148","055@00552-00605","148"],
["149","055@00606-00669","149"],
["150","055@00670-00835","150"],
["145","055@03-00445","145"],
["152","056@00196-00328","152"],
["153","056@00329-00389","153"],
["154","056@00390-00483","154"],
["155","056@00484-00508","155"],
["156","056@00509-00767","156"],
["157","056@00768-00799","157"],
["158","056@00800-00825","158"],
["159","056@00826-00829","159"],
["151","056@03-00195","151"],
["162","057@0-3","162"],
["164","057@00220-00376","164"],
["165","057@00377-00636","165"],
["166","057@00637-00871","166"],
["167","057@00872-00874","167"],
["168","057@00875-00878","168"],
["169","057@00879-00914","169"],
["160","057@03-6","160"],
["163","057@4-00219","163"],
["161","057@7-9","161"],
["171","058@00303-00518","171"],
["172","058@00519-00538","172"],
["173","058@00539-00541","173"],
["174","058@00542-00663","174"],
["175","058@00664-00836","175"],
["170","058@03-00302","170"],
["179","059@00271-00373","179"],
["180","059@00374-00387","180"],
["181","059@00388-00432","181"],
["182","059@00433-00454","182"],
["183","059@00455-00467","183"],
["184","059@00468-00479","184"],
["185","059@00480-00575","185"],
["186","059@00576-00718","186"],
["187","059@00719-00851","187"],
["188","059@00852-00862","188"],
["189","059@00863-00877","189"],
["176","059@03-7","176"],
["178","059@3-00270","178"],
["177","059@8-2","177"],
["193","060@00207-00457","193"],
["194","060@00458-00635","194"],
["195","060@00636-00639","195"],
["196","060@00640-00652","196"],
["197","060@00653-00713","197"],
["198","060@00714-00795","198"],
["190","060@03-3","190"],
["192","060@2-00206","192"],
["191","060@4-1","191"],
["200","061@00203-00256","200"],
["201","061@00257-00262","201"],
["202","061@00263-00288","202"],
["203","061@00289-00386","203"],
["204","061@00387-00425","204"],
["205","061@00426-00509","205"],
["206","061@00510-00535","206"],
["207","061@00536-00541","207"],
["208","061@00542-00606","208"],
["209","061@00607-00659","209"],
["210","061@00660-00667","210"],
["211","061@00668-00680","211"],
["212","061@00681-00683","212"],
["213","061@00684-00724","213"],
["214","061@00725-00739","214"],
["215","061@00740-00750","215"],
["216","061@00751-00809","216"],
["217","061@00810-00827","217"],
["218","061@00828-00841","218"],
["199","061@03-00202","199"],
["220","062@00160-00198","220"],
["221","062@00199-00209","221"],
["222","062@00210-00240","222"],
["223","062@00241-00247","223"],
["224","062@00248-00253","224"],
["225","062@00254-00292","225"],
["226","062@00293-00301","226"],
["227","062@00302-00313","227"],
["228","062@00314-00335","228"],
["229","062@00336-00341","229"],
["230","062@00342-00346","230"],
["231","062@00347-00549","231"],
["232","062@00550-00559","232"],
["233","062@00560-00565","233"],
["234","062@00566-00715","234"],
["235","062@00716-00759","235"],
["236","062@00760-00799","236"],
["237","062@00800-00828","237"],
["219","062@03-00159","219"],
["239","063@00207-00226","239"],
["240","063@00227-00342","240"],
["241","063@00343-00442","241"],
["242","063@00443-00470","242"],
["243","063@00471-00476","243"],
["244","063@00477-00483","244"],
["245","063@00484-00516","245"],
["246","063@00517-00615","246"],
["247","063@00616-00722","247"],
["248","063@00723-00810","248"],
["238","063@03-00206","238"],
["250","064@00314-00598","250"],
["251","064@00599-00682","251"],
["252","064@00683-00697","252"],
["253","064@00698-00736","253"],
["254","064@00737-00801","254"],
["255","064@00802-00836","255"],
["249","064@03-00313","249"],
["257","065@00251-00624","257"],
["258","065@00625-00787","258"],
["259","065@00788-00793","259"],
["260","065@00794-00804","260"],
["256","065@03-00250","256"],
["262","066@0-2","262"],
["265","066@00117-00127","265"],
["266","066@00128-00162","266"],
["267","066@00163-00165","267"],
["268","066@00166-00168","268"],
["269","066@00169-00171","269"],
["270","066@00172-00194","270"],
["271","066@00195-00199","271"],
["272","066@00200-00202","272"],
["273","066@00203-00212","273"],
["274","066@00213-00261","274"],
["275","066@00262-00677","275"],
["276","066@00678-00716","276"],
["277","066@00717-00730","277"],
["278","066@00731-00785","278"],
["279","066@00786-00863","279"],
["261","066@03-9","261"],
["263","066@3-8","263"],
["264","066@9-00116","264"],
["281","067@00221-00550","281"],
["282","067@00551-00702","282"],
["283","067@00703-00769","283"],
["284","067@00770-00858","284"],
["280","067@03-00220","280"],
["290","068@0-3","290"],
["293","068@00102-00125","293"],
["294","068@00126-00141","294"],
["295","068@00142-00150","295"],
["296","068@00151-00157","296"],
["297","068@00158-00160","297"],
["298","068@00161-00162","298"],
["299","068@00163-00164","299"],
["300","068@00165-00167","300"],
["301","068@00168-00171","301"],
["302","068@00172-00222","302"],
["303","068@00223-00230","303"],
["304","068@00231-00237","304"],
["305","068@00238-00842","305"],
["285","068@03-2","285"],
["286","068@3-7","286"],
["291","068@4-4","291"],
["292","068@5-00101","292"],
["288","068@6-8","288"],
["287","068@8-5","287"],
["289","068@9-9","289"],
["305","069@03-00813","305"],
["305","070@03-00829","305"],
["306","071@00604-00643","306"],
["307","071@00644-00660","307"],
["308","071@00661-00674","308"],
["309","071@00675-00698","309"],
["310","071@00699-00709","310"],
["311","071@00710-00716","311"],
["312","071@00717-00740","312"],
["313","071@00741-00795","313"],
["314","071@00796-00801","314"],
["315","071@00802-00815","315"],
["316","071@00816-00823","316"],
["317","071@00824-00828","317"],
["318","071@00829-00832","318"],
["305","071@03-00603","305"],
["320","072@00337-00342","320"],
["321","072@00343-00346","321"],
["322","072@00347-00355","322"],
["323","072@00356-00359","323"],
["324","072@00360-00388","324"],
["325","072@00389-00407","325"],
["326","072@00408-00433","326"],
["327","072@00434-00436","327"],
["328","072@00437-00442","328"],
["329","072@00443-00445","329"],
["330","072@00446-00458","330"],
["331","072@00459-00466","331"],
["332","072@00467-00482","332"],
["333","072@00483-00485","333"],
["334","072@00486-00489","334"],
["335","072@00490-00534","335"],
["336","072@00535-00549","336"],
["337","072@00550-00559","337"],
["338","072@00560-00566","338"],
["339","072@00567-00574","339"],
["340","072@00575-00584","340"],
["341","072@00585-00586","341"],
["342","072@00587-00588","342"],
["343","072@00589-00601","343"],
["344","072@00602-00718","344"],
["345","072@00719-00723","345"],
["346","072@00724-00732","346"],
["347","072@00733-00738","347"],
["348","072@00739-00742","348"],
["349","072@00743-00745","349"],
["350","072@00746-00756","350"],
["351","072@00757-00769","351"],
["352","072@00770-00778","352"],
["353","072@00779-00788","353"],
["354","072@00789-00793","354"],
["355","072@00794-00800","355"],
["356","072@00801-00807","356"],
["357","072@00808-00866","357"],
["358","072@00867-00899","358"],
["359","072@00900-00945","359"],
["319","072@03-00336","319"],
["360","073@03-00838","360"],
["361","074@00399-00995","361"],
["362","074@00996-01001","362"],
["360","074@03-00398","360"],
["364","075@00781-00789","364"],
["365","075@00790-00796","365"],
["366","075@00797-00819","366"],
["363","075@03-00780","363"],
["370","076@00144-00160","370"],
["371","076@00161-00204","371"],
["372","076@00205-00249","372"],
["373","076@00250-00563","373"],
["374","076@00564-00595","374"],
["375","076@00596-00616","375"],
["376","076@00617-00633","376"],
["377","076@00634-00668","377"],
["378","076@00669-00796","378"],
["379","076@00797-00807","379"],
["380","076@00808-00824","380"],
["381","076@00825-00843","381"],
["382","076@00844-00847","382"],
["383","076@00848-00867","383"],
["384","076@00868-00879","384"],
["367","076@03-1","367"],
["369","076@1-00143","369"],
["368","076@2-0","368"],
["388","077@00361-00406","388"],
["389","077@00407-00413","389"],
["390","077@00414-00425","390"],
["391","077@00426-00549","391"],
["392","077@00550-00603","392"],
["393","077@00604-00707","393"],
["394","077@00708-01081","394"],
["385","077@03-6","385"],
["387","077@7-00360","387"],
["386","077@7-6","386"],
["396","078@00372-00403","396"],
["397","078@00404-00773","397"],
["398","078@00774-00911","398"],
["395","078@03-00371","395"],
["401","079@00129-00153","401"],
["402","079@00154-00179","402"],
["403a","079@00180-00211","403a"],
["403b","079@00205-00211","403b"],
["404","079@00212-00215","404"],
["405a","079@00216-00515","405a"],
["405b","079@00410-00529","405b"],
["406","079@00530-00537","406"],
["407","079@00538-00560","407"],
["408","079@00561-00571","408"],
["409","079@00572-00580","409"],
["410","079@00581-00586","410"],
["411","079@00587-00601","411"],
["412","079@00602-00616","412"],
["413","079@00617-00624","413"],
["414","079@00625-00634","414"],
["415","079@00635-00640","415"],
["416","079@00641-00646","416"],
["417","079@00647-00652","417"],
["418","079@00653-00658","418"],
["419","079@00659-00667","419"],
["420","079@00668-00673","420"],
["421","079@00674-00677","421"],
["422","079@00678-00683","422"],
["423","079@00684-00689","423"],
["424","079@00690-00696","424"],
["425","079@00697-00703","425"],
["426","079@00704-00709","426"],
["427","079@00710-00713","427"],
["428","079@00714-00723","428"],
["429","079@00724-00729","429"],
["430","079@00730-00734","430"],
["431","079@00735-00740","431"],
["432","079@00741-00744","432"],
["433","079@00745-00751","433"],
["434","079@00752-00758","434"],
["435","079@00759-00767","435"],
["436","079@00768-00782","436"],
["437","079@00783-00789","437"],
["438","079@00790-00796","438"],
["439","079@00797-00885","439"],
["399","079@03-4","399"],
["400","079@5-00128","400"],
["442","080@00208-00284","442"],
["443","080@00285-00302","443"],
["444","080@00303-00415","444"],
["445","080@00416-00433","445"],
["446","080@00434-00505","446"],
["447","080@00506-00517","447"],
["448","080@00518-00532","448"],
["449","080@00533-00548","449"],
["450","080@00549-00685","450"],
["451","080@00686-00761","451"],
["452","080@00762-00888","452"],
["453","080@00889-01009","453"],
["440a","080@03-3","440a"],
["441","080@3-00207","441"],
["440b","080@3-5","440b"],
["455","081@0-7","455"],
["460","081@00139-00144","460"],
["461","081@00145-00153","461"],
["462","081@00154-00277","462"],
["463","081@00278-00288","463"],
["464","081@00289-00441","464"],
["465","081@00442-00583","465"],
["466","081@00584-00611","466"],
["467","081@00612-00751","467"],
["468","081@00752-00947","468"],
["469","081@00948-00961","469"],
["470","081@00962-00974","470"],
["471","081@00975-00997","471"],
["472","081@00998-01029","472"],
["454","081@03-9","454"],
["459","081@6-00138","459"],
["457","081@6-7","457"],
["458","081@8-5","458"],
["456","081@8-5","456"],
["475","082@00150-00265","475"],
["476","082@00266-00833","476"],
["473","082@03-8","473"],
["474","082@9-00149","474"],
["478","083@0-7","478"],
["482","083@00103-00125","482"],
["483","083@00126-00137","483"],
["484","083@00138-00139","484"],
["485","083@00140-00217","485"],
["486","083@00218-00225","486"],
["487","083@00226-00231","487"],
["488","083@00232-00295","488"],
["489","083@00296-00307","489"],
["490","083@00308-00428","490"],
["491","083@00429-00484","491"],
["492","083@00485-00521","492"],
["493","083@00522-00536","493"],
["494","083@00537-00559","494"],
["495","083@00560-00563","495"],
["496","083@00564-00567","496"],
["497","083@00568-00601","497"],
["498","083@00602-00680","498"],
["499","083@00681-00755","499"],
["500","083@00756-00832","500"],
["501","083@00833-00842","501"],
["502","083@00843-01014","502"],
["503","083@01015-01089","503"],
["477","083@03-09","477"],
["481","083@3-00102","481"],
["480","083@3-2","480"],
["479","083@8-2","479"],
["505","084@00433-00796","505"],
["504","084@03-00432","504"],
["508","085@00164-00274","508"],
["509","085@00275-00277","509"],
["510","085@00278-00431","510"],
["511","085@00432-00446","511"],
["512","085@00447-00513","512"],
["513","085@00514-00800","513"],
["514","085@00801-00821","514"],
["506","085@03-5","506"],
["507","085@6-00163","507"],
["516","086@00233-00237","516"],
["517","086@00238-00341","517"],
["518","086@00342-00435","518"],
["519","086@00436-00756","519"],
["520","086@00757-00935","520"],
["515","086@03-00232","515"],
["522","087@00464-00468","522"],
["523","087@00469-00496","523"],
["524","087@00497-00513","524"],
["525","087@00514-00529","525"],
["526","087@00530-00542","526"],
["527","087@00543-00742","527"],
["528","087@00743-00813","528"],
["529","087@00814-00840","529"],
["530","087@00841-00849","530"],
["531","087@00850-00851","531"],
["532","087@00852-00918","532"],
["521","087@03-00463","521"],
["537","088@00101-00111","537"],
["538","088@00112-00125","538"],
["539","088@00126-00131","539"],
["540","088@00132-00140","540"],
["541","088@00141-00146","541"],
["542","088@00147-00154","542"],
["543","088@00155-00166","543"],
["544","088@00167-00173","544"],
["545","088@00174-00182","545"],
["546","088@00183-00186","546"],
["547","088@00187-00188","547"],
["548","088@00189-00194","548"],
["549","088@00195-00200","549"],
["550","088@00201-00203","550"],
["551","088@00204-00226","551"],
["552","088@00227-00230","552"],
["553","088@00231-00265","553"],
["554","088@00266-00282","554"],
["555","088@00283-00290","555"],
["556","088@00291-00296","556"],
["557","088@00297-00301","557"],
["558","088@00302-00315","558"],
["559","088@00316-00317","559"],
["560","088@00318-00319","560"],
["561","088@00320-00321","561"],
["562","088@00322-00323","562"],
["563","088@00324-00325","563"],
["564","088@00326-00329","564"],
["565","088@00330-00331","565"],
["566","088@00332-00333","566"],
["567","088@00334-00336","567"],
["568","088@00337-00339","568"],
["569","088@00340-00342","569"],
["570","088@00343-00353","570"],
["571","088@00354-01051","571"],
["533","088@03-1","533"],
["536","088@1-00100","536"],
["534","088@2-6","534"],
["535","088@7-0","535"],
["583","089@0-00459","583"],
["584","089@00460-00798","584"],
["572","089@03-4","572"],
["579","089@1-3","579"],
["575","089@2-3","575"],
["576","089@4-5","576"],
["580","089@4-6","580"],
["582","089@4-9","582"],
["573","089@5-7","573"],
["577","089@6-8","577"],
["581","089@7-3","581"],
["574","089@8-1","574"],
["578","089@9-0","578"],
["586","090@00176-00253","586"],
["587","090@00254-00351","587"],
["588","090@00352-00354","588"],
["589","090@00355-00420","589"],
["590","090@00421-00456","590"],
["591","090@00457-00476","591"],
["592","090@00477-00481","592"],
["593","090@00482-00507","593"],
["594","090@00508-00572","594"],
["595","090@00573-00591","595"],
["596","090@00592-00606","596"],
["597","090@00607-00612","597"],
["598","090@00613-00619","598"],
["599","090@00620-00625","599"],
["600","090@00626-00630","600"],
["601","090@00631-00633","601"],
["602","090@00634-00641","602"],
["603","090@00642-00645","603"],
["604","090@00646-00647","604"],
["605","090@00648-00649","605"],
["606","090@00650-00651","606"],
["607","090@00652-00653","607"],
["608","090@00654-00656","608"],
["609","090@00657-00658","609"],
["610","090@00659-00660","610"],
["611","090@00661-00662","611"],
["612","090@00663-00664","612"],
["613","090@00665-00666","613"],
["614","090@00667-00668","614"],
["615","090@00669-00670","615"],
["616","090@00671-00672","616"],
["617","090@00673-00675","617"],
["618","090@00676-00701","618"],
["619","090@00702-00723","619"],
["620","090@00724-00739","620"],
["621","090@00740-00758","621"],
["622","090@00759-00782","622"],
["623","090@00783-00798","623"],
["624","090@00799-00803","624"],
["625","090@00804-00818","625"],
["626","090@00819-00826","626"],
["627","090@00827-00854","627"],
["628","090@00855-00856","628"],
["629","090@00857-00877","629"],
["630","090@00878-00880","630"],
["631","090@00881-00887","631"],
["632","090@00888-00943","632"],
["585","090@03-00175","585"],
["633","091@00106-00110","633"],
["634","091@00111-00119","634"],
["635","091@00120-00126","635"],
["636","091@00127-00131","636"],
["637","091@00132-00137","637"],
["638","091@00138-00145","638"],
["639","091@00146-00148","639"],
["640","091@00149-00155","640"],
["641","091@00156-00159","641"],
["642","091@00160-00177","642"],
["643","091@00178-00181","643"],
["644","091@00182-00194","644"],
["645","091@00195-00201","645"],
["646","091@00202-00205","646"],
["647","091@00206-00211","647"],
["648","091@00212-00214","648"],
["649","091@00215-00219","649"],
["650","091@00220-00222","650"],
["651","091@00223-00224","651"],
["652","091@00225-00226","652"],
["653","091@00227-00230","653"],
["654","091@00231-00232","654"],
["655","091@00233-00234","655"],
["656","091@00235-00247","656"],
["657","091@00248-00251","657"],
["658","091@00252-00254","658"],
["659","091@00255-00301","659"],
["660","091@00302-00372","660"],
["661","091@00373-00380","661"],
["662","091@00381-00389","662"],
["663","091@00390-00396","663"],
["664","091@00397-00406","664"],
["665","091@00407-00418","665"],
["666","091@00419-00428","666"],
["667","091@00429-00440","667"],
["668","091@00441-00448","668"],
["669","091@00449-00456","669"],
["670","091@00457-00461","670"],
["671","091@00462-00465","671"],
["672","091@00466-00470","672"],
["673","091@00471-00474","673"],
["674","091@00475-00483","674"],
["675","091@00484-00490","675"],
["676","091@00491-00498","676"],
["677","091@00499-00501","677"],
["678","091@00502-00504","678"],
["679","091@00505-00506","679"],
["680","091@00507-00508","680"],
["681","091@00509-00510","681"],
["682","091@00511-00535","682"],
["683","091@00536-00546","683"],
["684","091@00547-00550","684"],
["685","091@00551-00590","685"],
["686","091@00591-00630","686"],
["687","091@00631-00646","687"],
["688","091@00647-00650","688"],
["689","091@00651-00660","689"],
["690","091@00661-00669","690"],
["691","091@00670-00677","691"],
["692","091@00678-00690","692"],
["693","091@00691-00695","693"],
["694","091@00696-00702","694"],
["695","091@00703-00706","695"],
["696","091@00707-00725","696"],
["697","091@00726-00734","697"],
["698","091@00735-00738","698"],
["699","091@00739-00741","699"],
["700","091@00742-00744","700"],
["701","091@00745-00765","701"],
["702","091@00766-00771","702"],
["703","091@00772-00773","703"],
["704","091@00774-00775","704"],
["705","091@00776-00792","705"],
["706","091@00793-00807","706"],
["707","091@00808-00815","707"],
["708","091@00816-00818","708"],
["709","091@00819-00820","709"],
["710","091@00821-00823","710"],
["711","091@00824-00825","711"],
["712","091@00826-01001","712"],
["713","091@01002-01021","713"],
["714","091@01022-01028","714"],
["715","091@01029-01036","715"],
["716","091@01037-01039","716"],
["632","091@03-00105","632"],
["717","092@03-00928","717"],
["718","093@00151-00157","718"],
["719","093@00158-00165","719"],
["720","093@00166-00176","720"],
["721","093@00177-00250","721"],
["722","093@00251-00354","722"],
["723","093@00355-00378","723"],
["724","093@00379-00386","724"],
["725","093@00387-00408","725"],
["726","093@00409-00410","726"],
["727","093@00411-00413","727"],
["728","093@00414-00420","728"],
["729","093@00421-00425","729"],
["730","093@00426-00433","730"],
["731","093@00434-00450","731"],
["732","093@00451-00477","732"],
["733","093@00478-00482","733"],
["734","093@00483-00500","734"],
["735","093@00501-00502","735"],
["736","093@00503-00511","736"],
["737","093@00512-00517","737"],
["738","093@00518-00524","738"],
["739","093@00525-00531","739"],
["740","093@00532-00533","740"],
["741","093@00534-00536","741"],
["742","093@00537-00538","742"],
["743","093@00539-00540","743"],
["744","093@00541-00542","744"],
["745","093@00543-00544","745"],
["746","093@00545-00546","746"],
["747","093@00547-00548","747"],
["748","093@00549-00550","748"],
["749","093@00551-00554","749"],
["750","093@00555-00556","750"],
["751","093@00557-00558","751"],
["752","093@00559-00606","752"],
["753","093@00607-00612","753"],
["754","093@00613-00623","754"],
["755","093@00624-00884","755"],
["717","093@03-00150","717"],
["756","094@00511-00516","756"],
["757","094@00517-00572","757"],
["758","094@00573-00581","758"],
["759","094@00582-00591","759"],
["760","094@00592-00593","760"],
["761","094@00594-00596","761"],
["762","094@00597-00602","762"],
["763","094@00603-00606","763"],
["764","094@00607-00613","764"],
["765","094@00614-00619","765"],
["766","094@00620-00625","766"],
["767","094@00626-00629","767"],
["768","094@00630-00633","768"],
["769","094@00634-00637","769"],
["770","094@00638-00650","770"],
["771","094@00651-00654","771"],
["772","094@00655-00658","772"],
["773","094@00659-00661","773"],
["774","094@00662-00666","774"],
["775","094@00667-00751","775"],
["776","094@00752-00758","776"],
["755","094@03-00510","755"],
["778","095@00695-00773","778"],
["779","095@00774-00779","779"],
["780","095@00780-00784","780"],
["781","095@00785-00791","781"],
["782","095@00792-00872","782"],
["777","095@03-00694","777"],
["787","096@0-2","787"],
["791","096@00162-00169","791"],
["792","096@00170-00175","792"],
["793","096@00176-00179","793"],
["794","096@00180-00186","794"],
["795","096@00187-00190","795"],
["796","096@00191-00237","796"],
["797a","096@00238-00267","797a"],
["797b","096@00268-00284","797b"],
["798","096@00290-00294","798"],
["799","096@00295-00297","799"],
["800","096@00298-00341","800"],
["801","096@00342-00348","801"],
["802","096@00349-00366","802"],
["803","096@00367-00369","803"],
["804","096@00370-00371","804"],
["805","096@00372-00373","805"],
["806","096@00374-00375","806"],
["807","096@00376-00378","807"],
["808","096@00379-00380","808"],
["809","096@00381-00382","809"],
["810","096@00383-00384","810"],
["811","096@00385-00386","811"],
["812","096@00387-00388","812"],
["813","096@00389-00390","813"],
["814","096@00391-00392","814"],
["815","096@00393-00394","815"],
["816","096@00395-00396","816"],
["817","096@00397-00398","817"],
["818","096@00399-00400","818"],
["819","096@00401-00402","819"],
["820","096@00403-00404","820"],
["821","096@00405-00406","821"],
["822","096@00407-00408","822"],
["823","096@00409-00410","823"],
["824","096@00411-00413","824"],
["825","096@00414-00415","825"],
["826","096@00416-00417","826"],
["827","096@00418-00419","827"],
["828","096@00420-00421","828"],
["829","096@00422-00423","829"],
["830","096@00424-00425","830"],
["831","096@00426-00427","831"],
["832","096@00428-00429","832"],
["833","096@00430-00431","833"],
["834","096@00432-00433","834"],
["835","096@00434-00508","835"],
["836","096@00509-00582","836"],
["837","096@00583-00737","837"],
["838","096@00738-00747","838"],
["839","096@00748-00757","839"],
["840","096@00758-00818","840"],
["841","096@00819-00822","841"],
["842","096@00823-00829","842"],
["843","096@00830-00834","843"],
["844","096@00835-00837","844"],
["845","096@00838-00843","845"],
["846","096@00844-00847","846"],
["847","096@00848-00853","847"],
["848","096@00854-00856","848"],
["849","096@00857-00860","849"],
["850","096@00861-00863","850"],
["851","096@00864-00866","851"],
["852","096@00867-00869","852"],
["853","096@00870-00871","853"],
["854","096@00872-00873","854"],
["855","096@00874-00875","855"],
["856","096@00876-00880","856"],
["857","096@00881-00885","857"],
["783","096@03-3","783"],
["788","096@3-4","788"],
["786","096@3-9","786"],
["784","096@4-7","784"],
["789","096@5-5","789"],
["790","096@6-00161","790"],
["785","096@8-2","785"],
["859","097@0-00131","859"],
["860","097@00132-00137","860"],
["861","097@00138-00153","861"],
["862","097@00154-00160","862"],
["863","097@00161-00163","863"],
["864","097@00164-00176","864"],
["865","097@00177-00186","865"],
["866","097@00187-00194","866"],
["867","097@00195-00200","867"],
["868","097@00201-00206","868"],
["869","097@00207-00213","869"],
["870","097@00214-00228","870"],
["871","097@00229-00234","871"],
["872","097@00235-00236","872"],
["873","097@00237-00238","873"],
["874","097@00239-00240","874"],
["875","097@00241-00242","875"],
["876","097@00243-00245","876"],
["877","097@00246-00247","877"],
["878","097@00248-00250","878"],
["879","097@00251-00252","879"],
["880","097@00253-00254","880"],
["881","097@00255-00256","881"],
["882","097@00257-00258","882"],
["883","097@00259-00269","883"],
["884","097@00270-00279","884"],
["885","097@00280-00291","885"],
["886","097@00292-00299","886"],
["887","097@00300-00305","887"],
["888","097@00306-00314","888"],
["889","097@00315-00325","889"],
["890","097@00326-00333","890"],
["891","097@00334-00343","891"],
["892","097@00344-00350","892"],
["893","097@00351-00357","893"],
["894","097@00358-00361","894"],
["895","097@00362-00378","895"],
["896","097@00379-00397","896"],
["897","097@00398-00460","897"],
["898","097@00461-00468","898"],
["899","097@00469-00474","899"],
["900","097@00475-00482","900"],
["901","097@00483-00484","901"],
["902","097@00485-00487","902"],
["903","097@00488-00490","903"],
["904","097@00491-00493","904"],
["905","097@00494-00496","905"],
["906","097@00497-00498","906"],
["907","097@00499-00501","907"],
["908","097@00502-00503","908"],
["909","097@00504-00598","909"],
["910","097@00599-00620","910"],
["911","097@00621-00627","911"],
["912","097@00628-00634","912"],
["913","097@00635-00654","913"],
["914","097@00655-00663","914"],
["915","097@00664-00670","915"],
["916","097@00671-00678","916"],
["917","097@00679-00685","917"],
["918","097@00686-00690","918"],
["919","097@00691-00707","919"],
["920","097@00708-00711","920"],
["921","097@00712-00717","921"],
["922","097@00718-00720","922"],
["923","097@00721-00722","923"],
["924","097@00723-00724","924"],
["925","097@00725-00731","925"],
["926","097@00732-00758","926"],
["927","097@00759-00774","927"],
["928","097@00775-00778","928"],
["929","097@00779-00782","929"],
["930","097@00783-00785","930"],
["931","097@00786-00791","931"],
["932","097@00792-00795","932"],
["933","097@00796-00798","933"],
["934","097@00799-00806","934"],
["935","097@00807-00813","935"],
["936","097@00814-00821","936"],
["937","097@00822-00827","937"],
["938","097@00828-00832","938"],
["939","097@00833-00839","939"],
["940","097@00840-00845","940"],
["941","097@00846-00851","941"],
["942","097@00852-00854","942"],
["943","097@00855-00857","943"],
["944","097@00858-00859","944"],
["945","097@00860-00861","945"],
["946","097@00862-00863","946"],
["947","097@00864-00865","947"],
["948","097@00866-00868","948"],
["949","097@00869-00870","949"],
["950","097@00871-00872","950"],
["951","097@00873-00874","951"],
["952","097@00875-00876","952"],
["953","097@00877-00878","953"],
["954","097@00879-00880","954"],
["955","097@00881-00882","955"],
["956","097@00883-00884","956"],
["957","097@00885-00887","957"],
["858","097@03-09","858"],
["960","098@00107-00111","960"],
["961","098@00112-00117","961"],
["962","098@00118-00122","962"],
["963","098@00123-00127","963"],
["964","098@00128-00129","964"],
["965","098@00130-00133","965"],
["966","098@00134-00143","966"],
["967","098@00144-00147","967"],
["968","098@00148-00152","968"],
["969","098@00153-00159","969"],
["970","098@00160-00167","970"],
["971","098@00168-00170","971"],
["972","098@00171-00173","972"],
["973","098@00174-00176","973"],
["974","098@00177-00178","974"],
["975","098@00179-00183","975"],
["976","098@00184-00243","976"],
["977","098@00244-00250","977"],
["978","098@00251-00257","978"],
["979","098@00258-00261","979"],
["980","098@00262-00267","980"],
["981","098@00268-00270","981"],
["982","098@00271-00273","982"],
["983","098@00274-00276","983"],
["984","098@00277-00283","984"],
["985","098@00284-00288","985"],
["986","098@00289-00296","986"],
["987","098@00297-00306","987"],
["988","098@00307-00310","988"],
["989","098@00311-00313","989"],
["990","098@00314-00315","990"],
["991","098@00316-00323","991"],
["992","098@00324-00327","992"],
["993","098@00328-00329","993"],
["994","098@00330-00357","994"],
["995","098@00358-00383","995"],
["996","098@00384-00397","996"],
["997","098@00398-00420","997"],
["998","098@00421-00435","998"],
["999","098@00436-00445","999"],
["1000","098@00446-00450","1000"],
["1001","098@00451-00454","1001"],
["1002","098@00455-00459","1002"],
["1003","098@00460-00465","1003"],
["1004","098@00466-00469","1004"],
["1005","098@00470-00473","1005"],
["1006","098@00474-00478","1006"],
["1007","098@00479-00481","1007"],
["1008","098@00482-00484","1008"],
["1009","098@00485-00494","1009"],
["1010","098@00495-00502","1010"],
["1011","098@00503-00508","1011"],
["1012","098@00509-00515","1012"],
["1013","098@00516-00517","1013"],
["1014","098@00518-00520","1014"],
["1015","098@00521-00538","1015"],
["1016","098@00539-00550","1016"],
["1017","098@00551-00553","1017"],
["1018","098@00554-00556","1018"],
["1019","098@00557-00568","1019"],
["1020","098@00569-00574","1020"],
["1021","098@00575-00579","1021"],
["1022","098@00580-00582","1022"],
["1023a","098@00583-00584","1023a"],
["1023b","098@00584-00585","1023b"],
["1024","098@00586-00587","1024"],
["1025","098@00588-00590","1025"],
["1026","098@00591-00592","1026"],
["1027","098@00593-00595","1027"],
["1028","098@00596-00597","1028"],
["1029","098@00598-00600","1029"],
["1030","098@00601-00602","1030"],
["1031","098@00603-00607","1031"],
["1032","098@00608-00609","1032"],
["1033","098@00610-00611","1033"],
["1034","098@00612-00613","1034"],
["1035","098@00614-00616","1035"],
["1036","098@00617-00618","1036"],
["1037","098@00619-00620","1037"],
["1038","098@00621-00622","1038"],
["1039","098@00623-00624","1039"],
["1040","098@00625-00626","1040"],
["1041","098@00627-00628","1041"],
["1042","098@00629-00630","1042"],
["1043","098@00631-00632","1043"],
["1044","098@00633-00634","1044"],
["1045","098@00635-00636","1045"],
["1046","098@00637-00638","1046"],
["1047","098@00639-00641","1047"],
["1048","098@00642-00644","1048"],
["1049","098@00645-00646","1049"],
["1050","098@00647-00648","1050"],
["1051","098@00649-00650","1051"],
["1052","098@00651-00652","1052"],
["1053","098@00653-00654","1053"],
["1054","098@00655-00656","1054"],
["1055","098@00657-00658","1055"],
["1056","098@00659-00660","1056"],
["1057","098@00661-00662","1057"],
["1058","098@00663-00664","1058"],
["1059","098@00665-00666","1059"],
["1060","098@00667-00668","1060"],
["1061","098@00669-00670","1061"],
["1062","098@00671-00672","1062"],
["1063","098@00673-00674","1063"],
["1064","098@00675-00676","1064"],
["1065","098@00677-00678","1065"],
["1066","098@00679-00680","1066"],
["1067","098@00681-00682","1067"],
["1068","098@00683-00684","1068"],
["1069","098@00685-00686","1069"],
["1070","098@00687-00688","1070"],
["1071","098@00689-00690","1071"],
["1072","098@00691-00692","1072"],
["1073","098@00693-00729","1073"],
["1074","098@00730-00753","1074"],
["1075","098@00754-00790","1075"],
["1076","098@00791-00804","1076"],
["1077","098@00805-00807","1077"],
["1078","098@00808-00810","1078"],
["1079","098@00811-00820","1079"],
["1080a","098@00821-00822","1080a"],
["1080b","098@00822-00822","1080b"],
["1080c","098@00822-00822","1080c"],
["1080d","098@00822-00822","1080d"],
["1080e","098@00822-00823","1080e"],
["1080f","098@00823-00823","1080f"],
["1081","098@00825-00826","1081"],
["1082","098@00827-00828","1082"],
["1083","098@00829-00830","1083"],
["1084","098@00831-00833","1084"],
["1085","098@00834-00836","1085"],
["1086","098@00837-00842","1086"],
["1087","098@00843-00850","1087"],
["1088","098@00851-00857","1088"],
["1089","098@00858-00859","1089"],
["1090","098@00860-00871","1090"],
["1091","098@00872-00875","1091"],
["1092","098@00876-00878","1092"],
["1093","098@00879-00881","1093"],
["1094","098@00882-00884","1094"],
["1095","098@00885-00889","1095"],
["1096","098@00890-00891","1096"],
["1097","098@00892-00895","1097"],
["1098","098@00896-00897","1098"],
["1099","098@00898-00901","1099"],
["1100","098@00902-00913","1100"],
["1101","098@00914-00920","1101"],
["1102","098@00921-00930","1102"],
["1103","098@00931-00934","1103"],
["1104","098@00935-00938","1104"],
["1105","098@00939-00943","1105"],
["1106","098@00944-00946","1106"],
["1107","098@00947-00949","1107"],
["1108","098@00950-00955","1108"],
["1109","098@00956-00958","1109"],
["1110","098@00959-00963","1110"],
["1111","098@00964-00966","1111"],
["1112","098@00967-00968","1112"],
["1113","098@00969-00970","1113"],
["1114","098@00971-00977","1114"],
["1115","098@00978-00980","1115"],
["958","098@03-7","958"],
["959","098@8-00106","959"],
["1116","099@03-00842","1116"],
["1117","100@00275-00595","1117"],
["1116","100@03-00274","1116"],
["1119","101@00219-00748","1119"],
["1120","101@00749-00936","1120"],
["1118","101@03-00218","1118"],
["1122","102@00287-00349","1122"],
["1123","102@00350-00533","1123"],
["1124","102@00534-00809","1124"],
["1125","102@00810-00850","1125"],
["1121","102@03-00286","1121"],
["1128","103@00159-00207","1128"],
["1129","103@00208-00354","1129"],
["1130","103@00355-00559","1130"],
["1131","103@00560-00564","1131"],
["1132","103@00565-00579","1132"],
["1133","103@00580-00584","1133"],
["1134","103@00585-00596","1134"],
["1135","103@00597-00602","1135"],
["1136","103@00603-00611","1136"],
["1137","103@00612-00625","1137"],
["1138","103@00626-00638","1138"],
["1139","103@00639-00725","1139"],
["1140","103@00726-00773","1140"],
["1141","103@00774-00835","1141"],
["1126","103@03-7","1126"],
["1127","103@8-00158","1127"],
["1142","104@03-00952","1142"],
["1144","105@00373-00482","1144"],
["1145","105@00483-00588","1145"],
["1143","105@03-00372","1143"],
["1149","106@00307-00399","1149"],
["1150","106@00401-00529","1150"],
["1151","106@00530-00613","1151"],
["1146","106@03-8","1146"],
["1148","106@1-00306","1148"],
["1147","106@9-0","1147"],
["1152","107@03-00823","1152"],
["1153","108@03-00780","1153"]];
kPedurma.rcode="K";
module.exports=kPedurma;
});
require.register("pedurmacat-dataset/sutranames.js", function(exports, require, module){
﻿//module.exports
//var sutranames
//
var sutranames=[["1","འདུལ་བ་གཞི།"],
["2","སོ་སོར་ཐར་པའི་མདོ།"],
["3","འདུལ་བ་རྣམ་པར་འབྱེད་པ།"],
["4","དགེ་སློང་མའི་སོ་སོར་ཐར་པའི་མདོ།"],
["5","དགེ་སློང་མའི་འདུལ་བ་རྣམ་པར་འབྱེད་པ།"],
["6","འདུལ་བ་ཕྲན་ཚེགས་ཀྱི་གཞི།"],
["7","འདུལ་བ་གཞུང་བླ་མ།"],
["8","འདུལ་བ་གཞུང་དམ་པ།"],
["9","འཕགས་པ་བཟང་པོ་སྤྱོད་པའི་སྨོན་ལམ་གྱི་རྒྱལ་པོ།"],
["10","འཕགས་པ་བྱམས་པའི་སྨོན་ལམ།"],
["11","མཆོག་གི་སྤྱོད་པའི་སྨོན་ལམ།"],
["12","མར་མེའི་སྨོན་ལམ།"],
["13","གསེར་འོད་དམ་པ་མདོ་སྡེའི་དབང་པོའི་རྒྱལ་པོ་ལས་གསུངས་པའི་སྨོན་ལམ།"],
["14","སྟོང་ཆེན་མོ་རབ་ཏུ་འཇོམས་པ་ལས་གསུངས་པའི་སྨོན་ལམ།"],
["15","རིག་སྔགས་ཀྱི་རྒྱལ་མོ་རྨ་བྱ་ཆེན་མོ་ལས་གསུངས་པའི་སྨོན་ལམ་དང་བདེན་ཚིག"],
["16","འདུལ་བ་ལུང་གི་ཆ་ཤས་ཡངས་པའི་གྲོང་ཁྱེར་དུ་འཇུག་པའི་དེ་ལེགས་ཀྱི་ཚིགས་སུ་བཅད་པ།"],
["17","བདེ་ལེགས་ཀྱི་ཚིགས་སུ་བཅད་པ།"],
["18","བདེ་ལེགས་སུ་འགྱུར་བའི་ཚིགས་སུ་བཅད་པ།"],
["19","འབྱུང་བ་ཤིས་པར་བརྗོད་པའི་ཚིགས་སུ་བཅད་པ།"],
["20","དཀོན་མཆོག་གསུམ་གྱི་བཀྲ་ཤིས་ཀྱི་ཚིགས་སུ་བཅད་པ། "],
["21(a)","བཅོམ་ལྡན་འདས་ལ་ལྷའི་དབང་པོ་བརྒྱ་བྱིན་གྱིས་བཀྲ་ཤིས་ཚིགས་སུ་བཅད་པ།"],
["21(b)","བཅོམ་ལྡན་འདས་ལ་ལྷའི་རྒྱལ་པོ་རབ་མཚེ་མས་གྱི་བཀྲ་ཤིས་ཚིགས་སུ་བཅད་པ།"],
["21(c)","བཅོམ་ལྡན་འདས་ལ་ལྷའི་རྒྱལ་པོ་རབ་དགའ་ལྡན་གྱིས་བཀྲ་ཤིས་ཚིགས་སུ་བཅད་པ།"],
["22","ལྷས་ཞུས་པའི་བཀྲ་ཤིས་ཀྱི་ཚིགས་སུ་བཅད་པ།"],
["23","སངས་རྒྱས་རབས་བདུན་གྱི་བཀྲ་ཤིས་ཚིགས་སུ་བཅད་པ།"],
["24","བཀྲ་ཤིས་ཀྱི་ཚིགས་སུ་བཅད་པ།"],
["25","ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པ་སྟོང་ཕྲག་བརྒྱ་པ།"],
["26","ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པ་སྟོང་ཕྲག་ཉི་ཤུ་ལྔ་པ།"],
["27","འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་དུ་ཕྱིན་པ་ཁྲི་བརྒྱད་སྟོང་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["28","འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པ་ཁྲི་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["29","འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་དུ་ཕྱིན་པ་བརྒྱད་སྟོང་བ།"],
["30","འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པ་སྡུད་པ་ཚིགས་སུ་བཅད་པ།"],
["31","འཕགས་པ་རབ་ཀྱི་རྩལ་གྱིས་རྣམ་པར་གནོན་པས་ཞུས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་དུ་ཕྱིན་པ་བསྟན་བ།"],
["41","འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་དུ་ཕྱིན་པ་བདུན་བརྒྱ་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["32","འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་དུ་ཕྱིན་པ་ལྔ་བརྒྱ་པ།"],
["33","འཕགས་ཤེས་རབ་ཀྱི་ཕ་རོལ་དུ་ཕྱིན་པ་རྡོ་རྗེ་གཅོད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["35","འཕགས་པ་བཅོམ་ལྡན་འདས་མ་ཤེས་རབ་ཀྱི་ཕ་རོལ་དུ་ཕྱིན་པ་ལྔ་བཅུ་པའོ།།"],
["40","དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་ཡུམ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་མ་ཡི་གེ་གཅིག་མ་ཞེས་བྱ་བ་།"],
["43"," འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པ་ཉི་མའི་སྙིང་པོ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["44"," འཕགས་པ་ཟླ་བའི་སྙིང་པོ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["45","འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་དུ་ཕྱིན་པ་ཀུན་དུ་བཟང་པོ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["46","འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པ་ལག་ན་རྡོ་རྗེའི་མདོ་ཐེག་པ་ཆེན་པོ།"],
["47","འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་དུ་ཕྱིན་པ་རྡོ་རྗེ་རྒྱལ་མཚན་གྱི་མདོ་ཐེག་པ་ཆེན་པོ།"],
["48","ཆོས་ཀྱི་འཁོར་ལོ་རབ་ཏུ་བསྐོར་བའི་མདོ།"],
["49","སྐྱེས་པ་རབས་ཀྱི་གླེང་གཞི།"],
["50","ལྕང་ལོ་ཅན་གྱི་ཕོ་བྲང་གི་མདོ།"],
["51","འདུས་པ་ཆེན་པོའི་མདོ།"],
["52","བྱམས་པའི་མདོ།"],
["53","བྱམས་པ་བསྒོམ་པའི་མདོ།"],
["54","བསླབ་པ་ལྔའི་ཕན་ཡོན་གྱི་མདོ།"],
["55","རིའི་ཀུན་དགའ་བོའི་མདོ།"],
["56","ཀླུའི་རྒྱལ་པོ་དགའ་བོ་ཉེར་དགའ་འདུལ་བའི་མདོ།"],
["57","འོད་སྲུང་ཆེན་པོའི་མདོ།"],
["58","ཉི་མའི་མདོ།"],
["59","ཟླ་བའི་མདོ།"],
["60","བཀྲ་ཤིས་ཆེན་པོའི་མདོ།"],
["111","འཕགས་པ་བསྐལ་པ་བཟང་པོ་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["112","འཕགས་པ་རྒྱ་ཆེར་རོལ་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["113","འཕགས་པ་འཇམ་དཔལ་རྣམ་པར་རོལ་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["114","འཕགས་པ་འཇམ་དཔལ་རྣམ་པར་འཕྲུལ་པའི་ལེའུ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["115","འཕགས་པ་དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་བྱིན་གྱི་བརླབས་སེམས་ཅན་ལ་གཟིགས་ཤིང་སངས་རྒྱས་ཀྱི་ཞིང་གི་བཀོད་པ་ཀུན་ཏུ་སྟོན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["117","འཕགས་པ་བཅོམ་ལྡན་འདས་ཀྱི་ཡེ་ཤེས་རྒྱས་པའི་མདོ་སྡེ་རིན་པོ་ཆེ་མཐའ་ཡས་པ་མཐར་ཕྱིན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["118","འཕགས་པ་སངས་རྒྱས་ཐམས་ཅད་ཀྱི་ཡུལ་ལ་འཇུག་པའི་ཡེ་ཤེས་སྣང་བའི་རྒྱན་ཅེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["119","འཕགས་པ་དགེ་བའི་རྩ་བ་ཡོངས་སུ་འཛིན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["120","འཕགས་པ་ཟུང་གི་མདོའི་ཆོས་ཀྱི་རྣམ་གྲངས།"],
["121","འཕགས་པ་ཁྱེའུ་སྣང་བ་བསམ་གྱིས་མི་ཁྱབ་པས་བསྟན་པ་ཞེས་བྱ་བའི་ཆོས་ཀྱི་རྣམ་གྲངས།"],
["122","འཕགས་པ་དེ་བཞིན་གཤེགས་པ་རྣམས་ཀྱི་སངས་རྒྱས་ཀྱི་ཞིང་གི་ཡོན་ཏན་བརྗོད་པའི་ཆོས་ཀྱི་རྣམ་གྲངས།"],
["123","འཕགས་པ་དཀྱིལ་འཁོར་བརྒྱད་ཅེས་བྱ་བའི་ཆོས་ཀྱི་རྣམ་གྲངས་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["124","འཕགས་པ་དགོངས་པ་ངེས་པར་འགྲེལ་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["125","འཕགས་པ་ལང་ཀར་གཤེགས་པའི་ཐེག་པ་ཆེན་པོའི་མདོ། །"],
["126","འཕགས་པ་ལང་ཀར་གཤེགས་པ་རིན་པོ་ཆེའི་མདོལས་སངས་རྒྱས་ཐམས་ཅད་ཀྱི་གསུང་གི་སྙིང་པོ་ཞེས་བྱ་བའི་ལེའུ།"],
["127","འཕགས་པ་ག་ཡཱ་མགོའི་རི་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["128","འཕགས་པ་རྒྱན་སྟུག་པོ་བཀོད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["129","འཕགས་པ་སྙིང་རྗེ་ཆེན་པོའི་པད་མ་དཀར་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["130","འཕགས་པ་སྙིང་རྗེ་པད་མ་དཀར་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["131","དམ་པའི་ཆོས་པད་མ་དཀར་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["132","འཕགས་པ་ཆོས་ཐམས་ཅད་ཀྱི་ཡོན་ཏན་བཀོད་པའི་རྒྱལ་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["133","འཕགས་པ་བདེ་བ་ཅན་གྱི་བཀོད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["134","འཕགས་པ་ཟ་མ་ཏོག་བཀོད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["135","འཕགས་པ་དཀོན་མཆོག་གི་ཟ་མ་ཏོག་ཅེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["136","འཕགས་པ་རིན་པོ་ཆེའི་མཐའ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["137","འཕགས་པ་ཡོངས་སུ་མྱ་ངན་ལས་འདས་པ་ཆེན་པོའི་མདོ།"],
["138","འཕགས་པ་ཡོངས་སུ་མྱ་ངན་ལས་འདས་པ་ཆེན་པོ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["139","འཕགས་པ་ཡོངས་སུ་མྱ་ངན་ལས་འདས་པ་ཆེན་པོའི་མདོ།"],
["140","འཕགས་པ་འདའ་ཁ་ཡེ་ཤེས་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["141","སངས་རྒྱས་ཀྱི་མཛོད་ཀྱི་ཆོས་ཀྱི་ཡི་གེ །"],
["142","འཕགས་པ་དཀོན་མཆོག་འབྱུང་གནས་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["143","འཕགས་པ་གསེར་གྱི་མདོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["144","འཕགས་པ་གསེར་གྱི་བྱེ་མ་ལྟ་བུ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["145","འཕགས་པ་ཆོས་ཐམས་ཅད་ཀྱི་རང་བཞིན་མཉམ་པ་ཉིད་རྣམ་པར་སྤྲོས་པ་ཏིང་ངེ་འཛིན་གྱི་རྒྱལ་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["146","འཕགས་པ་ཆོས་ཉིད་རང་གི་ངོ་བོ་སྟོང་པ་ཉིད་ལས་མི་གཡོ་བར་ཐ་དད་པར་ཐམས་ཅད་ལ་སྣང་བའི་མདོ།"],
["147","འཕགས་པ་རབ་ཏུ་ཞི་བ་རྣམ་པར་ངེས་པའི་ཆོ་འཕྲུལ་གྱི་ཏིང་ངེ་འཛིན་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["148","འཕགས་པ་སྒྱུ་མ་ལྟ་བུའི་ཏིང་ངེ་འཛིན་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["149","འཕགས་པ་དེ་བཞིན་གཤེགས་པའི་ཡེ་ཤེས་ཀྱི་ཕྱག་རྒྱའི་ཏིང་ངེ་འཛིན་ཅེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["150","འཕགས་པ་དཔའ་བར་འགྲོ་བའི་ཏིང་ངེ་འཛིན་ཅེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["151","འཕགས་པ་ད་ལྟར་གྱི་སངས་རྒྱས་མངོན་སུམ་དུ་བཞུགས་པའི་ཏིང་ངེ་འཛིན་ཅེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["152","འཕགས་པ་བསོད་ནམས་ཐམས་ཅད་བསྡུས་པའི་ཏིང་ངེ་འཛིན་ཅེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["153","རྡོ་རྗེའི་ཏིང་ངེ་འཛིན་གྱི་ཆོས་ཀྱི་ཡི་གེ"],
["154","འཕགས་པ་ཁྱེའུ་བཞིའི་ཏིང་ངེ་འཛིན་ཅེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["155","འཕགས་པ་ཏིང་ངེ་འཛིན་མཆོག་དམ་པ།"],
["156","འཕགས་པ་འདུས་པ་ཆེན་པོ་རིན་པོ་ཆེ་ཏོག་གི་གཟུངས་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["157","འཕགས་པ་རྡོ་རྗེའི་སྙིང་པོའི་གཟུངས་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["158","འཕགས་པ་སྒོ་མཐའ་ཡས་པ་སྒྲུབ་པ་ཞེས་བྱ་བའི་མདོ།"],
["159","འཕགས་པ་སྒོ་དྲུག་པ་ཞེས་བྱ་བའི་གཟུངས། "],
["160","འཕགས་པ་རྣམ་པར་མི་རྟོག་པར་འཇུག་པ་ཞེས་བྱ་བའི་གཟུངས། "],
["161","ཚིགས་སུ་བཅད་པ་གཉིས་པའི་གཟུངས། "],
["162","འཕགས་པ་ཐེག་པ་ཆེན་པོ་ལ་དད་པ་རབ་ཏུ་སྒོམ་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["164","འཕགས་པ་བྱང་ཆུབ་སེམས་དཔའི་སྤྱོད་ཡུལ་གྱི་ཐབས་ཀྱི་ཡུལ་ལ་རྣམ་པར་འཕྲུལ་པ་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["165","འཕགས་པ་དེ་བཞིན་གཤེགས་པའི་སྙིང་རྗེ་ཆེན་པོ་ངེས་པར་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["166","འཕགས་པ་ནམ་མཁའ་མཛོད་ཀྱིས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["167","འཕགས་པ་བྱམས་པས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["168","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་གིས་ཞུས་པ་ཆོས་བདུན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["169","འཕགས་པ་སྤོབས་པའི་བློ་གྲོས་ཀྱིས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["170","འཕགས་པ་བློ་གྲོས་རྒྱ་མཚོས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["171","འཕགས་པ་ཀླུའི་རྒྱལ་པོ་རྒྱ་མཚོས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["172","འཕགས་པ་ཀླུའི་རྒྱལ་པོ་རྒྱ་མཚོས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["173","འཕགས་པ་ཀླུའི་རྒྱལ་པོ་རྒྱ་མཚོས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["174","འཕགས་པ་ཀླུའི་རྒྱལ་པོ་མ་དྲོས་པས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["175","འཕགས་པ་མི་འམ་ཅིའི་རྒྱལ་པོ་སྡོང་པོས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["176","འཕགས་པ་ཚངས་པས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["177","འཕགས་པ་ཚངས་པས་བྱིན་གྱིས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["178","འཕགས་པ་ཚངས་པ་ཁྱད་པར་སེམས་ཀྱིས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["179","འཕགས་པ་ལྷའི་བུ་རབ་རྩལ་སེམས་ཀྱིས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["180","འཕགས་པ་དཔལ་དབྱིག་གིས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["181","འཕགས་པ་རིན་ཆེན་དྲ་བ་ཅན་གྱིས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["182","འཕགས་པ་རིན་ཆེན་ཟླ་བས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["183","འཕགས་པ་བདེ་བྱེད་ཀྱིས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["184","འཕགས་པ་ཡུལ་འཁོར་སྐྱོང་གིས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["185","འཕགས་པ་རྣམ་པར་འཕྲུལ་པའི་རྒྱལ་པོས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["186","དྲི་མ་མེད་པའི་འོད་ཀྱིས་ཞུས་པ། "],
["187","འཕགས་པ་ཐེག་པ་ཆེན་པོའི་མན་ངག་ཅེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["188","འཕགས་པ་བྲམ་ཟེ་མོ་དཔལ་ལྡན་མས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["189","འཕགས་པ་བགྲེས་མོས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["190","འཕགས་པ་འཇམ་དཔལ་གྱིས་དྲིས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["191","འཕགས་པ་བདག་མེད་པ་དྲིས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["192","འཕགས་པ་འཇིག་རྟེན་འཛིན་གྱིས་ཡོངས་སུ་དྲིས་པ་ཞེས་བྱ་བའི་མདོ།"],
["193","འཕགས་པ་བློ་གྲོས་མི་ཟད་པས་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["194","འཕགས་པ་དྲི་མ་མེད་པར་གྲགས་པས་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["195","འཕགས་པ་འཇམ་དཔལ་གྱིས་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["196","འཕགས་པ་བྱང་ཆུབ་ཀྱི་ཕྱོགས་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["197","འཕགས་པ་ཀུན་རྫོབ་དང་དོན་དམ་པའི་བདེན་པ་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["198","འཕགས་པ་ཆོས་ཐམས་ཅད་འབྱུང་བ་མེད་པར་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["199","འཕགས་པ་ཕ་རོལ་དུ་ཕྱིན་པ་ལྔ་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["200","འཕགས་པ་སྦྱིན་པའི་ཕ་རོལ་ཏུ་ཕྱིན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["201","འཕགས་པ་སྦྱིན་པའི་ཕན་ཡོན་བསྟན་པ། "],
["202","འཕགས་པ་བྱང་ཆུབ་སེམས་དཔའི་སྤྱོད་པ་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོའ། "],
["203","འཕགས་པ་དེ་བཞིན་གཤེགས་པའི་ཡོན་ཏན་དང་ཡེ་ཤེས་བསམ་གྱིས་མི་ཁྱབ་པའི་ཡུལ་ལ་འཇུག་པ་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོའ།"],
["204","འཕགས་པ་སངས་རྒྱས་ཀྱི་སྟོབས་སྐྱེད་པའི་ཆོ་འཕྲུལ་རྣམ་པར་འཕྲུལ་པ་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["205","འཕགས་པ་སངས་རྒྱས་ཀྱི་ཆོས་བསམ་གྱི་མི་ཁྱབ་པ་བསྟན་པ།"],
["206","འཕགས་པ་མར་མེ་མཛད་ཀྱིས་ལུང་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["207","འཕགས་པ་ཚངས་པའི་དཔལ་ལུང་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["208","འཕགས་པ་བུད་མེད་འགྱུར་བ་ལུང་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["209","འཕགས་པ་བུ་མོ་ཟླ་མཆོག་ལུང་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["210","འཕགས་པ་བདེ་ལྡན་མ་ལུང་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["211","འཕགས་པ་ལྷ་མོ་ཆེན་མོ་དཔལ་ལུང་བསྟན་པ། "],
["212","འཕགས་པ་རྒྱལ་བའི་བློ་གྲོས་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["213","འཕགས་པ་སྤྱན་རས་གཟིགས་ཤེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["214","འཕགས་པ་འཇམ་དཔལ་གནས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["215","འཕགས་པ་བདུད་རྩི་བརྗོད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["216","འཕགས་པ་བྱམས་པ་འཇུག་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["218","འཕགས་པ་འཇིག་རྟེན་གྱི་རྗེས་སུ་འཐུན་པར་འཇུག་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["219","འཕགས་པ་དད་པའི་སྟོབས་བསྐྱེད་པ་ལ་འཇུག་པའི་ཕྱག་རྒྱ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["220","འཕགས་པ་ངེས་པ་དང་མ་ངེས་པར་འགྲོ་བའི་ཕྱག་རྒྱ་ལ་འཇུག་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["221","འཕགས་པ་ཆོས་ཀྱི་ཕྱག་རྒྱ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["222","འཕགས་པ་མར་མེ་འབུལ་བ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["223","འཕགས་པ་གྲོང་ཁྱེར་གྱིས་འཚོ་བ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["224","ཟས་ཀྱི་འཚོ་བ་རྣམ་པར་དག་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["225","འཕགས་པ་གླང་པོའི་རྩལ་ཅེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["226","འཕགས་པ་སྒྲ་ཆེན་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["227","འཕགས་པ་སེང་གེའི་སྒྲ་བསྒྲགས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["228","འཕགས་པ་སཱ་ལུའི་ལྗང་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["229","རྟེན་ཅིང་འབྲེལ་པར་འབྱུང་བ་དང་པོ་དང་རྣམ་པར་དབྱེ་བ་བསྟན་པ་ཞེས་བྱ་བའི་མདོ། "],
["230","འཕགས་པ་རྟེན་ཅིང་འབྲེལ་པར་འབྱུང་བ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["231","འཕགས་པ་སོར་མོའི་ཕྲེང་བ་ལ་ཕན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["232","རྒྱལ་པོ་ལ་གདམས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["233","རྒྱལ་པོ་ལ་གདམས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["234","འཕགས་པ་མ་སྐྱེས་དགྲའི་འགྱོད་པ་བསལ་བ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["235","འཕགས་པ་དཔལ་སྦས་ཤེས་བྱ་བའི་མདོ། "],
["236","འཕགས་པ་ལས་ཀྱི་སྒྲིབ་པ་རྣམ་པར་དག་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["237","འཕགས་པ་ལས་ཀྱི་སྒྲིབ་པ་རྒྱུན་གཅོད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["238","སངས་རྒྱས་ཀྱི་སྡེ་སྣོད་ཚུལ་ཁྲིམས་འཆལ་པ་ཚར་གཅོད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["239","འཕགས་པ་རྒྱལ་པོ་ལ་གདམས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["240","འཕགས་པ་རྔ་བོ་ཆེ་ཆེན་པོའི་ལེའུ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["241","འཕགས་པ་སུམ་ཅུ་རྩ་གསུམ་པའི་ལེའུ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["242","འཕགས་པ་ལྷག་པའི་བསམ་པ་བརྟན་པའི་ལེའུ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["243","འཕགས་པ་གསུམ་ལ་སྐྱབས་སུ་འགྲོ་བ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["244","འཕགས་པ་སྲིད་པ་འཕོ་བ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["245","འཕགས་པ་རྣམ་པར་འཐག་པ་ཐམས་ཅད་བསྡུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོོ།"],
["246","འཕགས་པ་སངས་རྒྱས་བགྲོ་བ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["247","དེ་བཞིན་གཤེགས་པ་བགྲོ་བ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["248","འདུས་པ་ཆེན་པོ་ཐེག་པ་ཆེན་པོའི་མདོ་སྡེ་ལས་དེ་བཞིན་གཤེགས་པའི་དཔལ་གྱི་དམ་ཚིག་ཅེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["249","འཕགས་པ་དཀོན་མཆོག་སྤྲིན་ཅེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["250","འཕགས་པ་སྤྲིན་ཆེན་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["251","འཕགས་པ་སྤྲིན་ཆེན་པོའི་མདོ་ལས་ཕྱོགས་བཅུའི་བྱང་ཆུབ་སེམས་དཔའ་རྒྱ་མཚོ་འདུས་པའི་དགའ་སྟོན་ཆེན་པོ་ལ་རྩེ་བ་ཞེས་བྱ་བའི་ལེའུ། "],
["252","འཕགས་པ་སྤྲིན་ཆེན་པོ་རླུང་གི་དཀྱིལ་འཁོར་གྱི་ལེའུ་ཀླུ་ཐམས་ཅད་ཀྱི་སྙིང་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["253","འཕགས་པ་སྤྲིན་ཆེན་པོ། "],
["254","བཅོམ་ལྡན་འདས་ཀྱི་གཙུག་ཏོར་ཆེན་པོ་དེ་བཞིན་གཤེགས་པའི་གསང་བ་སྒྲུབ་པའི་དོན་མངོན་པར་ཐོབ་པའི་རྒྱུ་བྱང་ཆུབ་སེམས་དཔའ་ཐམས་ཅད་ཀྱི་སྤྱོད་པ་དཔའ་བར་འགྲོ་བའི་མདོ། "],
["255","གཙུག་གཏོར་ཆེན་པོའི་བམ་པོ་དགུ་པ་ལས་བདུད་ཀྱི་ལེའུ་ཉི་ཚེ་ཕྱུང་བ།"],
["256","འཕགས་པ་ཆོས་ཡང་དག་པར་སྡུད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["257","འདུས་པ་ཆེན་པོ་ལས་སའི་སྙིང་པོའི་འཁོར་ལོ་བཅུ་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["258","འཕགས་པ་ཕྱིར་མི་ལྡོག་པའི་འཁོར་ལོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["259","འཕགས་པ་ཏིང་ངེ་འཛིན་གྱི་འཁོར་ལོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["260","འཕགས་པ་ཡོངས་སུ་བསྔོ་བའི་འཁོར་ལོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["261","དམ་པའི་ཆོས་ཀྱི་རྒྱལ་པོ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["262","འཕགས་པ་ཆོས་ཀྱི་ཚུལ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["263","འཕགས་པ་ཆོས་ཀྱི་ཕུང་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["264","འཕགས་པ་དོན་དམ་པའི་ཆོས་ཀྱིས་རྣམ་པར་རྒྱལ་བ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["265","འཕགས་པ་ཆོས་དང་དོན་རྣམ་པར་འབྱེད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["266","བྱང་ཆུབ་སེམས་དཔའི་སོ་སོར་ཐར་པ་ཆོས་བཞི་སྒྲུབ་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["267","འཕགས་པ་ཆོས་བཞི་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["268","ཆོས་བཞི་པའི་མདོ།"],
["269","འཕགས་པ་ཆོས་བཞི་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["270","འཕགས་པ་བཞི་པ་སྒྲུབ་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["271",""],
["272","འཕགས་པ་ཆོས་ཀྱི་རྒྱལ་མཚན་གྱི་མདོ་ཐེག་པ་ཆེན་པོའོ།"],
["273","ཐེག་པ་ཆེན་པོའི་མདོ་ཆོས་རྒྱ་མཚོ་ཞེས་བྱ་བ།"],
["274","ཆོས་ཀྱི་རྒྱ་མོ། "],
["275","འཕགས་པ་ཤིན་ཏུ་རྒྱས་པ་ཆེན་པོའི་སྡེ་ཉི་མའི་སྙིང་པོ་ཞེས་བྱ་བའི་མདོ།"],
["276","འཕགས་པ་དེ་བཞིན་གཤེགས་པའི་སྙིང་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["277","འཕགས་པ་ཡི་གེ་མེད་པའི་ཟ་མ་ཏོག་རྣམ་པར་སྣང་མཛད་ཀྱི་སྙིང་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["278","འཕགས་པ་ནམ་མཁའི་སྙིང་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["279","འཕགས་པ་ཐབས་མཁས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["280","སངས་རྒྱས་ཀྱི་མཚན་ལྔ་སྟོང་བཞི་བརྒྱ་ལྔ་བཅུ་རྩ་གསུམ་པ།"],
["281","འཕགས་པ་ཡང་དག་པར་སྤྱོད་པའི་ཚུལ་ནམ་མཁའི་མདོག་གིས་འདུལ་བའི་བཟོད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["282","འཕགས་པ་ཐར་པ་ཆེན་པོ་ཕྱོགས་སུ་རྒྱས་པ་འགྱོད་ཚངས་ཀྱིས་སྡིག་སྦྱངས་ཏེ་སངས་རྒྱས་སུ་གྲུབ་པར་རྣམ་པར་བཀོད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["283","འཕགས་པ་རྟོགས་པ་ཆེན་པོ་ཡོངས་སུ་རྒྱས་པའི་མདོ།"],
["284","འཕགས་པ་མེ་ཏོག་གི་ཚོགས་ཤེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["285","དཔང་སྐོང་ཕྱག་བརྒྱ་པ་ཞེས་བྱ་བ། "],
["286","འཕགས་པ་བསམ་གྱིས་མི་ཁྱབ་པའི་རྒྱལ་པོའི་མདོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["287","འཕགས་པ་ཕྱོགས་བཅུའི་མུན་པ་རྣམ་པར་སེལ་བ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["288","འཕགས་པ་སངས་རྒྱས་བདུན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["289","འཕགས་པ་སངས་རྒྱས་བརྒྱད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["290","སངས་རྒྱས་བཅུ་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["291","འཕགས་པ་སངས་རྒྱས་བཅུ་གཉིས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["292","འཕགས་པ་སངས་རྒྱས་ཀྱི་དབུ་རྒྱན་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ་ཆོས་ཀྱི་རྣམ་གྲངས་ཆེན་པོ།"],
["293","འཕགས་པ་སངས་རྒྱས་ཀྱི་ས་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["294","འཕགས་པ་སངས་རྒྱས་མི་སྤང་བ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["295","འཕགས་པ་དཀྱིལ་འཁོར་བརྒྱད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["296","འཕགས་པ་བཀྲ་ཤིས་བརྒྱད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["297","འཕགས་པ་སངས་རྒྱས་རྗེས་སུ་དྲན་པ། "],
["298","ཆོས་རྗེས་སུ་དྲན་པ། "],
["299","དགེ་འདུན་རྗེས་སུ་དྲན་པ། "],
["300","བསླབ་པ་གསུམ་གྱི་མདོ།"],
["301","འཕགས་པ་སྐུ་གསུམ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["302","འཕགས་པ་ཕུང་པོ་གསུམ་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["303","འཕགས་པ་བསམ་པ་ཐམས་ཅད་ཡོངས་སུ་རྫོགས་པར་བྱེད་པ་ཞེས་བྱ་བའི་ཡོངས་སུ་བསྔོ་བ། "],
["304","འཕགས་པ་འགྲོ་བ་ཐམས་ཅད་ཡོངས་སུ་སྐྱོབ་པར་བྱེད་པ་ཞེས་བྱ་བའི་ཡོངས་སུ་བསྔོ་བ། "],
["305","འཕགས་པ་དམ་པའི་ཆོས་དྲན་པ་ཉེ་བར་གཞག་པ། "],
["306","མདོ་ཆེན་པོ་སྒྱུ་མའི་དྲ་བ་ཞེས་བྱ་བ།"],
["307","མདོ་ཆེན་པོ་གཟུགས་ཅན་སྙིང་པོས་བསུ་བ་ཞེས་བྱ་བ།"],
["308","མདོ་ཆེན་པོ་སྟོང་པ་ཉིད།"],
["309","མདོ་ཆེན་པོ་སྟོང་པ་ཉིད་ཆེན་པོ་ཞེས་བྱ་བ།"],
["310","མདོ་ཆེན་པོ་རྒྱལ་མཚན་མཆོག་ཅེས་བྱ་བ།"],
["311","མདོ་ཆེན་པོ་རྒྱལ་མཚན་དམ་པ་ཞེས་བྱ་བ།"],
["312","མདོ་ཆེན་པོ་ལྔ་གསུམ་པ་ཞེས་བྱ་བ།"],
["313","འཕགས་པ་རྡོ་འཕངས་པའི་མདོ།"],
["314"," གཞོན་ནུ་དཔེའི་མདོ།"],
["315","ཁམས་མང་པོ་པའི་མདོ།"],
["316"," གཎྜིའི་མདོ།"],
["317","གཎྜིའི་དུས་ཀྱི་མདོ།"],
["318","འཕགས་པ་དགེ་བའི་བཤེས་གཉེན་བསྟེན་པའི་མདོ།"],
["319","མངོན་པར་འབྱུང་བའི་མདོ། "],
["320","དགེ་སློང་ལ་རབ་ཏུ་གཅེས་པའི་མདོ་ཞེས་བྱ་བ། "],
["321","ཚུལ་ཁྲིམས་ཡང་དག་པར་ལྡན་པའི་མདོ།"],
["322","ལྟུང་བ་སྡེ་ལྔའི་དགེ་བ་དང་མི་དགེ་བའི་འབྲས་བུ་བརྟག་པའི་མདོ།"],
["323","མཆོག་ཏུ་གདགས་པའི་མདོ།"],
["324","རྣམ་པར་གྲོལ་བའི་ལམ་ལས་སྦྱངས་པའི་ཡོན་ཏན་བསྟན་པ་ཞེས་བྱ་བ།"],
["325","ཚེའི་མཐའི་མདོ།"],
["326","ཚེ་འཕོ་བ་ཇི་ལྟར་འགྱུར་བ་ཞུས་པའི་མདོ།"],
["327","མི་རྟག་པ་ཉིད་ཀྱི་མདོ།"],
["328","མི་རྟག་པ་ཉིད་ཀྱི་མདོ།"],
["329","འཕགས་པ་འདུ་ཤེས་བཅུ་གཅིག་བསྟན་པའི་མདོ།"],
["330","འཕགས་པ་ཡངས་པའི་གྲོང་ཁྱེར་དུ་འཇུག་པའི་མདོ་ཆེན་པོ། "],
["331","འཕགས་པ་མཚན་མོ་བཟང་པོ་ཞེས་བྱ་བའི་མདོ། "],
["332","མུན་གྱི་ནགས་ཚལ་གྱི་སྒོ་ཞེས་བྱ་བའི་མདོ།"],
["333","ཕ་མའི་མདོ།"],
["334","འཕགས་པ་བདེན་པ་བཞིའི་མདོ།"],
["335","དོན་རྣམ་པར་ངེས་པའི་ཞེས་བྱ་བའི་ཆོས་ཀྱི་རྣམ་གྲངས།"],
["336","འཕགས་པ་དོན་རྒྱས་པ་ཞེས་བྱ་བའི་ཆོས་ཀྱི་རྣམ་གྲངས། "],
["337","འཕགས་པ་རྨད་དུ་བྱུང་བ་ཞེས་བྱ་བ་ཆོས་ཀྱི་རྣམ་གྲངས།"],
["338","འཕགས་པ་དེ་བཞིན་གཤེགས་པའི་གཟུགས་བརྙན་བཞག་པའི་ཕན་ཡོན་ཡང་དག་པར་བརྫོད་པ་ཞེས་བྱ་བའི་ཆོས་ཀྱི་རྣམ་གྲངས།"],
["339","མཆོད་རྟེན་བསྐོར་བའི་ཚིགས་སུ་བཅད་པ།"],
["340","གསལ་རྒྱལ་གྱི་ཚིགས་སུ་བཅད་པ།"],
["341","ཚིགས་སུ་བཅད་པ་གཅིག་པ།"],
["342","ཚིགས་སུ་བཅད་པ་བཞི་པ།"],
["343","ཀླུའི་རྒྱལ་པོ་རྔ་སྒྲའི་ཚིགས་སུ་བཅད་པ།"],
["344","ཆེད་དུ་བརྗོད་པའི་ཚོམས།"],
["345","འཕགས་པ་སྐྱེས་བུ་དམ་པའི་མདོ།"],
["346","དགའ་བོ་རབ་ཏུ་བྱུང་བའི་མདོ།"],
["347","ལྷའི་མདོ།"],
["348","ལྷའི་མདོ་ཉུང་ངུ་།"],
["349","ཟླ་བའི་མདོ།"],
["350","ཁང་བུ་བརྩེགས་པའི་མདོ།"],
["351","འཕགས་པ་གནས་འཇོག་གི་མདོ་ཞེས་བྱ།"],
["352","འཕགས་པ་དགའ་བ་ཅན་གྱི་མདོ།"],
["353","འཕགས་པ་མཁར་སིལ་གྱི་མདོ།"],
["354","མཁར་སིལ་འཆང་བའི་ཀུན་ཏུ་སྤྱོད་པའི་ཆོ་ག"],
["355","ཆོས་ཀྱི་འཁོར་ལོའི་མདོ།"],
["357","ལས་རྣམ་པར་འབྱེད་པ།"],
["358","ལས་ཀྱི་རྣམ་པར་འགྱུར་བ་ཞེས་བྱ་བ་ཆོས་ཀྱི་གཞུང་།"],
["360","ལས་བརྒྱ་ཐམ་པ། "],
["361","འཛངས་བླུན་ཞེས་བྱ་བའི་མདོ།"],
["9,1102,61(ch.45.2)","འཕགས་པ་བཟང་པོ་སྤྱོད་པའི་སྨོན་ལམ་གྱི་རྒྱལ་པོ།"],
["363","གང་པོ་ལ་སོགས་པའི་རྟོགས་པ་བརྗོད་པ་བརྒྱ་པ།"],
["364","འཕགས་པ་སངས་རྒྱས་ཀྱི་རྟོགས་པ་བརྗོད་པ་ཤེས་ལྡན་གྱི་མདོ།"],
["365"," ཕག་མོའི་རྟོགས་པ་བརྗོད་པ་ཞེས་བྱ་བའི་མདོ།"],
["366","མ་ག་དྷ་བཟང་མོའི་རྟོགས་པ་བརྗོད་པ།"],
["367","བསོད་ནམས་ཀྱི་སྟོབས་ཀྱི་རྟོགས་པ་བརྗོད་པ།"],
["368","ཟླ་འོད་ཀྱི་རྟོགས་པ་བརྗོད་པ།"],
["369","དཔལ་གྱི་སྡེའི་རྟོགས་པ་བརྗོད་པ།"],
["370","གསེར་མདོག་གི་སྔོན་གྱི་སྦྱོར་བ་ཞེས་བྱ་བ།"],
["371","འཕགས་པ་རྒྱལ་བུ་དོན་འགྲུབ་ཀྱི་མདོ།"],
["372","ཚངས་པའི་དྲ་བའི་མདོ།"],
["373","ཐབས་མཁས་པ་ཆེན་པོ་སངས་རྒྱས་དྲིན་ལན་བསབ་པའི་མདོ།"],
["374","འཕགས་པ་ལེགས་ཉེས་ཀྱི་རྒྱུ་དང་འབྲས་བུ་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["375","དགེ་བ་དང་མི་དགེ་བའི་ལས་ཀྱི་རྣམ་པར་སྨིན་པ་བསྟན་པའི་མདོ། "],
["376","འཕགས་པ་ཟླ་བའི་སྙིང་པོས་ཞུས་པའི་མདོ་ལས། སངས་རྒྱས་ཀྱི་བསྟན་པ་གནས་པ་དང༌འཇིག་པའི་ཚུལ་ལུང་བསྟན་པ།"],
["377","འཕགས་པ་གླང་རུ་ལུང་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོཔའི་མདོ།"],
["378","སྟག་རྣའི་རྟོགས་པ་བརྗོད་པ། "],
["380","མིག་བཅུ་གཉིས་པ་ཞེས་བྱ་བའི་མདོ།"],
["61","སངས་རྒྱས་ཕལ་པོ་ཆེ་ཞེས་བྱ་བ་ཤིན་ཏུ་རྒྱས་པ་ཆེན་པོའི་མདོ། "],
["62","འཕགས་པ་དཀོན་མཆོག་བརྩེགས་པ་ཆེན་པོའི་ཆོས་ཀྱི་རྣམ་གྲངས་སྟོང་ཕྲག་བརྒྱ་པ་ལས་སྡོམ་བ་གསུམ་བསྟན་པའི་ལེའུ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["63","འཕགས་པ་སྒོ་མཐའ་ཡས་པ་རྣམ་པར་སྦྱོང་བ་བསྟན་པའི་ལེའུ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["64","འཕགས་པ་དེ་བཞིན་གཤེགས་པའི་གསང་བ་བསམ་གྱིས་མི་ཁྱབ་པ་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["65","འཕགས་པ་རྨི་ལམ་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["66","འཕགས་པ་འོད་དཔག་མེད་ཀྱི་བཀོད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["67","འཕགས་པ་དེ་བཞིན་གཤེགས་པ་མི་འཁྲུགས་པའི་བཀོད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["68","འཕགས་པ་གོ་ཆའི་བཀོད་པ་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["69","འཕགས་པ་ཆོས་ཀྱི་དབྱིངས་ཀྱི་རང་བཞིན་དབྱེར་མེད་པ་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["70","འཕགས་པ་ཆོས་བཅུ་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["71","འཕགས་པ་ཀུན་ནས་སྒོའི་ལེའུ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["72","འཕགས་པ་འོད་ཟེར་ཀུན་དུ་བཀྱེ་བ་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["73","འཕགས་པ་བྱང་ཆུབ་སེམས་དཔའི་སྡེ་སྣོད་ཅེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["74","འཕགས་པ་དགའ་བོ་ལ་མངལ་ན་གནས་པ་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["75","འཕགས་པ་ཚེ་དང་ལྡན་པ་དགའ་བོ་ལ་མངལ་དུ་འཇུག་པ་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["76","འཕགས་པ་འཇམ་དཔལ་གྱི་སངས་རྒྱས་ཀྱི་ཞིང་གི་ཡོན་ཏན་བཀོད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["77","འཕགས་པ་ཡབ་དང་སྲས་མཇལ་བ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["79","འཕགས་པ་གང་པོས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["78","འཕགས་པ་ཡུལ་འཁོར་སྐྱོང་གིས་ཞུས་པ་ཞེས་བྱ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["80","འཕགས་པ་ཁྱིམ་བདག་དྲག་ཤུལ་ཅན་གྱི་ཞུས་པ་ཞེས་བྱ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["81","འཕགས་པ་གློག་ཐོབ་ཀྱིས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["82","འཕགས་པ་སྒྱུ་མ་མཁན་བཟང་པོ་ལུང་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["83","འཕགས་པ་ཆོ་འཕྲུལ་ཆེན་པོ་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["84","འཕགས་པ་བྱམས་པའི་སེང་གེའི་སྒྲ་ཆེན་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["85","འཕགས་པ་འདུལ་བ་རྣམ་པར་གཏན་ལ་དབབ་པ་ཉེ་བར་འཁོར་གྱིས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["86","འཕགས་པ་ལྷག་པའི་བསམ་པ་བསྐུལ་བ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["87","འཕགས་པ་ལག་བཟངས་ཀྱིས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ"],
["88","འཕགས་པ་ངེས་པས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["89","འཕགས་པ་ཁྱིམ་བདག་དཔས་བྱིན་གྱིས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["90","འཕགས་པ་བད་སའི་རྒྱལ་པོ་འཆར་བྱེད་ཀྱིས་ཞུས་པ་ཞེས་བྱ་བའི་ལེའུ།"],
["91","འཕགས་པ་བུ་མོ་བློ་གྲོས་བཟང་མོས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["92","འཕགས་པ་གང་གཱའི་མཆོག་གིས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["93","འཕགས་པ་མྱ་ངན་མེད་ཀྱིས་བྱིན་པ་ལུང་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["94","འཕགས་པ་དྲི་མ་མེད་ཀྱིས་བྱིན་པས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["95","འཕགས་པ་ཡོན་ཏན་རིན་ཆེན་མེ་ཏོག་ཀུན་ཏུ་རྒྱས་པས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["96","འཕགས་པ་སངས་རྒྱས་ཀྱི་ཡུལ་བསམ་གྱིས་མི་ཁྱབ་པ་བསྟན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["97","འཕགས་པ་ལྷའི་བུ་བློ་གྲོས་རབ་གནས་ཀྱིས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། (འཕགས་པ་ལྷའི་བུ་བློ་གྲོས་རབ་གནས་ཀྱིས་ཞུས་པ་ལུང་བསྟན་པ། ཐེག་པ་ཆེན་པོའི་མདོ།)"],
["98","འཕགས་པ་སེང་གེས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["99","འཕགས་པ་སངས་རྒྱས་ཐམས་ཅད་ཀྱི་གསང་ཆེན་ཐབས་ལ་མཁས་པ་བྱང་ཆུབ་སེམས་དཔའ་ཡེ་ཤེས་དམ་པས་ཞུས་པའི་ལེའུ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["100","འཕགས་པ་ཚོང་དཔོན་བཟང་སྐྱོང་གིས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["101","འཕགས་པ་བུ་མོ་རྣམ་དག་དད་པས་ཞུས་པ། ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["102","འཕགས་པ་བྱམས་པས་ཞུས་པ་ལུང་བསྟན་པའི་མདོ། "],
["103","འཕགས་པ་བྱམས་པས་ཞུས་བ་ཞེས་བྱ་བ་ཐེག་ཆེན་པོའི་མདོ།"],
["104","འཕགས་པ་འོད་སྲུང་གི་ལེའུ་ཞེས་བྱ་བ་ཐེག་ཆེན་པོའི་མདོ།"],
["105","འཕགས་པ་རིན་པོ་ཆེའི་ཕུང་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["106","འཕགས་པ་བློ་གྲོས་མི་ཟད་པས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["107","འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་དུ་ཕྱིན་པ་བདུན་བརྒྱ་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["108","འཕགས་པ་གཅུག་ན་རིན་པོ་ཆེས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["109","འཕགས་པ་ལྷ་མོ་དཔལ་ཕྲེང་གི་སེང་གེའི་སྒྲ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["110","འཕགས་པ་དྲང་སྲོང་རྒྱས་པས་ཞུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["385","འཇམ་དཔལ་ཡེ་ཤེས་སེམས་དཔའི་དོན་དམ་པའི་མཚན་ཡང་དག་པར་བརྗོད་པ།"],
["386","དབང་མདོར་བསྟན་པ།"],
["387","མཆོག་གི་དང་པོའི་སངས་རྒྱས་ལས་ཕྱུང་བ་རྒྱུད་ཀྱི་རྒྱལ་པོ་དཔལ་དུས་ཀྱི་འཁོར་ལོ་ཞེས་བྱ་བ།"],
["388","དཔལ་དུས་ཀྱི་འཁོར་ལོའི་རྒྱུད་ཕྱི་མ་རྒྱུད་ཀྱི་སྙིང་པོ་ཞེས་བྱ་བ།"],
["389","དཔལ་དུས་ཀྱི་འཁོར་ལོ་ཞེས་བྱ་བའི་རྒྱུད་ཀྱི་སྙིང་པོ།"],
["390","དབང་གི་རབ་ཏུ་བྱེད་པ།"],
["391","དཔལ་སངས་རྒྱས་ཐམས་ཅད་མཉམ་པར་སྦྱོར་བ་མཁའ་འགྲོ་མ་སྒྱུ་མ་བདེ་བའི་མཆོག་ཅེས་བྱ་བའི་རྒྱུད་བླ་མ།"],
["392","རྟོགཔ་ཐམས་ཅད་འདུས་པ་ཞེས་བྱ་བ་སངས་རྒྱས་ཐམས་ཅད་དང་མཉམ་པར་སྦྱོར་བ་མཁའ་འགྲོ་སྒྱུ་མ་བདེ་བའི་མཆོག་གི་རྒྱུད་ཕྱི་མའི་ཕྱི་མ།"],
["440(a)","ཀྱེའི་རྡོ་རྗེ་ཞེས་བྱ་བ་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["440(b)","རྒྱུད་ཀྱི་རྒྱལ་པོ་ཆེན་པོ་སྒྱུ་མའི་བརྟག་པ་ཞེས་བྱ་བ་བརྟག་པ་སུམ་བཅོ་ཙ་གཉིས་ལས་ཕྱུང་བ་བརྟག་པ་གཉིས་ཀྱི་བདག་ཉིད་ཀྱེའི་རྡོ་རྗེ་མཁའ་འགྲོ་མ་དྲ་བའི་སྡོམ་པ་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["441","འཕགས་པ་མཁའ་འགྲོ་མ་རྡོ་རྗེ་གུར་ཞེས་བྱ་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཆེན་པོའི་བརྟག་པ།"],
["442","དཔལ་ཕྱག་རྒྱ་ཆེན་པོའི་ཐིག་ལེ་ཞེས་བྱ་བ་རྣལ་འབྱོར་མ་ཆེན་མོའི་རྒྱུད་ཀྱི་རྒྱལ་པོའི་མངའ་བདག"],
["443","དཔལ་ཡེ་ཤེས་སྙིང་པོ་ཞེས་བྱ་བ་རྣལ་འབྱོར་མ་ཆེན་མོའི་རྒྱུད་ཀྱི་རྒྱལ་པོའི་རྒྱལ་པོ།"],
["444","དཔལ་ཡེ་ཤེས་ཐིག་ལེ་རྣལ་འབྱོར་མའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཆེན་པོ་མཆོག་ཏུ་རྨད་དུ་བྱུང་བ་ཞེས་བྱ་བ།"],
["445","དཔལ་དེ་ཁོ་ན་ཉིད་ཀྱི་སྒྲོན་མ་ཞེས་བྱ་བ་རྣལ་འབྱོར་ཆེན་མོའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["393","རྒྱུད་ཀྱི་རྒྱལ་པོ་དཔལ་བདེ་མཆོག་ཉུང་ངུ་ཞེས་བྱ་བ།"],
["394","མངོན་པར་བརྗོད་པའི་རྒྱུད་བླ་མ་ཞེས་བྱ་བ།"],
["395","རྒྱུད་ཀྱི་རྒྱལ་པོ་ཆེན་པོ་དཔལ་རྡོ་རྗེ་མཁའ་འགྲོ་ཞེས་བྱ་བ།"],
["396","རྡོ་རྗེ་མཁའ་འགྲོ་ཞེས་བྱ་བའི་རྒྱུད་ཕྱི་མ།"],
["397","དཔལ་མཁའ་འགྲོ་རྒྱ་མཚོ་རྣལ་འབྱོར་མའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཆེན་པོ་ཞེས་བྱ་བ།"],
["398","དཔལ་བད་མཆོག་འབྱུང་བ་ཞེས་བྱ་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཆེན་པོ།"],
["399","དཔལ་ཁྲག་འཐུང་མངོན་པར་འབྱུང་བ་ཞེས་བྱ་བ།"],
["402","ཕག་མོ་མངོན་པར་བརྗོད་པ་བཤད་པའི་རྒྱུད་ཕྱི་མ་ལས། ཕག་མོ་མངོན་པར་བྱང་ཆུབ་པ་ཞེས་བྱ་བ།"],
["400","རྣལ་འབྱོར་མའི་ཀུན་དུ་སྤྱོད་པ།"],
["401","རྣལ་འབྱོར་མ་བཞིའི་ཁ་སྦྱོར་གྱི་རྒྱུད་ཅེས་བྱ་བ།"],
["404","རིག་པ་འཛིན་པ་རྡོ་རྗེ་རྣལ་འབྱོར་མའི་སྒྲུབ་ཐབས་ཞེས་བྱ་བ།"],
["405(a)","ཡང་དག་པར་སྦྱོར་བ་ཞེས་བྱ་བའི་རྒྱུད་ཆེན་པོ།"],
["405(b)","རྒྱུད་ཀྱི་རྒྱལ་པོ་ཆེན་པོ་དཔལ་ཡང་དག་པར་སྦྱོར་བའི་ཐིག་ལེ་ཞེས་བྱ་བ།"],
["406","དཔལ་གསང་བ་རྡོ་རྗེ་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["407","དཔལ་གསང་བ་ཐམས་ཅད་གཅོད་པའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["408","དཔལ་འཁོར་ལོ་སྡོམ་པ་གསང་བ་བསམ་གྱིས་མི་ཁྱབ་པའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["409","དཔལ་ནམ་མཁའ་དང་མཉམ་པའི་རྒྱུད་གྱི་རྒྱལ་པོ་ཞེས་བྱ་བ།"],
["410","དཔལ་ནམ་མཁའ་ཆེན་པོའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["411","དཔལ་སྐུ་གསུང་ཐུགས་ཀྱི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["412","དཔལ་རིན་ཆེན་ཕྲེང་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["413","དཔལ་དམ་ཚིག་ཆེན་པོའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཞེས་བྱ་བ།"],
["414","དཔལ་སྟོབས་པོ་ཆེའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཞེས་བྱ་བ།"],
["415","དཔལ་ཡེ་ཤེས་གསང་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["416","དཔལ་ཡེ་ཤེས་ཕྲེང་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["417","དཔལ་ཡེ་ཤེས་འབར་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["418","དཔལ་ཟླ་བའི་ཕྲེང་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["419","དཔལ་རིན་ཆེན་འབར་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཞེས་བྱ་བ།"],
["420","དཔལ་ཉི་མའི་འཁོར་ལོའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཞེས་བྱ་བ།"],
["421","དཔལ་ཡེ་ཤེས་རྒྱལ་པོའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["422","དཔལ་རྡོ་རྗེ་མཁའ་འགྲོ་གསང་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["423","དཔལ་གསང་བ་མེ་འབར་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["424","དཔལ་གསང་བ་བདུད་རྩིའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["425","དཔལ་དུར་ཁྲོད་རྒྱན་གྱི་རྒྱུད་ཀྱི་རྒྱལ་པོ། "],
["426","དཔལ་རྡོ་རྗེ་རྒྱལ་པོ་ཆེན་པོའི་རྒྱུད།"],
["427","དཔལ་ཡེ་ཤེས་བསམ་པའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["428","དཔལ་ཆགས་པའི་རྒྱལ་པོའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["429","དཔལ་མཁའ་འགྲོ་མའི་སྡོམ་པའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཞེས་བྱ་བ།"],
["431","དཔལ་མཁའ་འགྲོ་མ་གསང་བ་འབར་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["432","དཔལ་རྡོ་རྗེ་འཇིགས་བྱེད་རྣམ་པར་འཇོམས་པའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["430","དཔལ་མེའི་ཕྲེང་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["434","དཔལ་རྡོ་རྗེ་གྲུབ་པ་དྲ་བའི་སྡོམ་པའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["433","དཔལ་སྟོབས་ཆེན་ཡེ་ཤེས་རྒྱལ་པོའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["436","དཔལ་འཁོར་ལོ་སྡོམ་པའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་དུར་ཁྲོད་ཀྱི་རྒྱན་རྨད་དུ་བྱུང་བ་ཞེས་བྱ་བ།"],
["437","རྒྱུད་ཀྱི་རྒྱལ་པོ་རྙོག་པ་མེད་པ་ཞེས་བྱ་བ།"],
["438","དཔལ་བདེ་མཆོག་ནམ་མཁའ་དང་མཉམ་པའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཞེས་བྱ་བ།"],
["403(a)","མཁའ་འགྲོ་མ་ཐམས་ཅད་ཀྱི་ཐུགས་གཉིས་སུ་མེད་པ་བསམ་གྱིས་མི་ཁྱབ་པའི་ཡེ་ཤེས་རྡོ་རྗེ་ཕག་མོ་མངོན་པར་འབྱུང་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཞེས་བྱ་བ།"],
[" 403(b)","མཁའ་འགྲོ་མ་ཐམས་ཅད་ཀྱི་ཐུགས་གཉིས་སུ་མེད་པའི་ཡེ་ཤེས་བསམ་གྱིས་མི་ཁྱབ་པ་ཕག་མོ་མངོན་པར་འབྱུང་བའི་རྒྱུད་ལས་རྒྱུད་ཕྱི་མ་བསྐྱེད་རིམ་བསྟན་པའི་ལེའུ།"],
["439","དཔལ་རྡོ་རྗེ་ནག་པོ་ཆེན་པོ་ཁྲོས་པའི་མགོན་པོ་གསང་བ་དངོས་གྲུབ་འབྱུང་བ་ཞེས་བྱ་བའི་རྒྱུད།"],
["446","དཔལ་སངས་རྒྱས་ཐོད་པ་ཞེས་བྱ་བ་རྣལ་འབྱོར་མའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["447","དཔལ་སྒྱུ་འཕྲུལ་ཆེན་པོ་ཞེས་བྱ་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["448","རྡོ་རྗེ་ཨ་ར་ལི་ཞེས་བྱ་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཆེན་པོ།"],
["449","རྀ་ཤི་ཨ་ར་ལིའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཞེས་བྱ་བ།"],
["450","རྣལ་འབྱོར་མའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཆེན་པོ་དཔལ་གདན་བཞི་པ་ཞེས་བྱ་བ།"],
["451","དཔལ་གདན་བཞི་པའི་བཤད་པའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་སྔགས་ཀྱི་ཆ་ཞེས་བྱ་བ།"],
["452","དཔལ་གདན་བཞི་པའི་རྣམ་པར་བཤད་པའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཞེས་བྱ་བ།"],
["453","དཔལ་གཏུམ་པོ་ཁྲོ་བོ་ཆེན་པོའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་དཔའ་བོ་གཅིག་པ་ཞེས་བྱ་བ།"],
["454","འཕགས་པ་མི་གཡོ་བའི་རྟོག་པའི་རྒྱུད་ཀྱི་རྒྱལ་པོ། "],
["456","འཕགས་པ་མི་གཡོ་བའི་གསང་རྒྱུད་ཆེན་པོ།"],
["455","ཁྲོ་བོའི་རྒྱལ་པོ་ཐམས་ཅད་གསང་སྔགས་གསང་བའི་རྒྱུད་ཅེས་བྱ་བ།"],
["457","རྡོ་རྗེ་བདུད་རྩིའི་རྒྱུད།"],
["458","རིགས་ཀྱི་འཇིག་རྟེན་མགོན་པོ་ལྔ་བཅུ་པ་ཞེས་བྱ་བ།"],
["459","འཕགས་མ་སྒྲོལ་མ་ཀུ་རུ་ཀུ་ལླེའི་རྟོག་པ།"],
["460","སྒྲོལ་མ་ལ་ཕྱག་འཚལ་ཉི་ཤུ་རྩ་གཅིག་གིས་བསྟོད་པ་ཕན་ཡོན་དང་བཅས་པ།"],
["461","རྡོ་རྗེ་ཕུར་པ་རྩ་བའི་རྒྱུད་ཀྱི་དུམ་བུ།"],
["462","ནག་པོ་ཆེན་པོ་ཞེས་བྱ་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["463","ཇི་བཞིན་བརྙེས་པ་ནམ་མཁའ་དང་མཉམ་པ་ཞེས་བྱ་བའི་རྒྱུད།"],
["464","དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་སྐུ་གསུང་ཐུགས་ཀྱི་གསང་ཆེན་གསང་བ་འདུས་པ་ཞེས་བྱ་བ་བརྟག་པའི་རྒྱལ་པོ་ཆེན་པོ།"],
["466","རྒྱུད་ཕྱི་མ།"],
["468","རྣལ་འབྱོར་ཆེན་པོའི་རྒྱུད་དཔལ་རྡོ་རྗེ་ཕྲེང་བ་མངོན་པར་བརྗོད་པ་རྒྱུད་ཐམས་ཅད་ཀྱི་སྙིང་པོ་གསང་བ་རྣམ་པར་ཕྱེ་བ་ཞེས་བྱ་བ།"],
["467","དགོངས་པ་ལུང་བསྟན་པ་ཞེས་བྱ་བའི་རྒྱུད།"],
["470","ཡེ་ཤེས་རྡོ་རྗེ་ཀུན་ལས་བཏུས་པ་ཞེས་བྱ་བའི་རྒྱུད།"],
["469","ལྷ་མོ་བཞིས་ཡོངས་སུ་ཞུས་པ།"],
["474","དཔལ་རྡོ་རྗེ་སྙིང་པོ་རྒྱན་གྱི་རྒྱུད་ཅེས་བྱ་བ། "],
["473","དཔལ་ཡེ་ཤེས་རྡོ་རྗེ་ཀུན་ལས་བསྡུས་པ། "],
["475","དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་སྐུ་དང་གསུང་དང་ཐུགས་ཡོངས་སུ་དག་པའི་ངོ་བོ་ཉིད་ཀྱི་རྡོ་རྗེ་ཞེས་བྱ་བའི་རྟོག་པ།"],
["(參經尾)"],
["འཕགས་པ་གཉིས་སུ་མེད་པ་མཉམ་པ་ཉིད་རྣམ་པར་རྒྱལ་བ་ཞེས་བྱ་བའི་རྟོག་པའི་རྒྱལ་པོ་ཆེན་པོ། (於德格版D452(58b3-103a3)中可見，但D452, 58b3-59b5 之內容麗江未見。)"],
["476","དཔལ་དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་གསང་བ་རྣལ་འབྱོར་ཆེན་པོ་རྣམ་པར་རྒྱལ་བ་ཞེས་བྱ་བ་མཉམ་པ་ཉིད་གཉིས་སུ་མེད་པའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་རྡོ་རྗེ་དཔལ་མཆོག་ཆེན་པོ་བརྟག་པ་དང་པོའོ།"],
["477","འཕགས་པ་ལག་ན་རྡོ་རྗེ་གོས་སྔོན་པོ་ཅན་དྲག་པོ་གསུམ་འདུལ་བ་ཞེས་བྱ་བའི་རྒྱུད།"],
["478","གསང་བའི་རྒྱུད་རྣམས་ཀྱི་རྣམ་པར་འབྱེད་པ་དྲག་པོ་གསུམ་འདུལ་ཞེས་བྱ་བ།"],
["479","ལག་ན་རྡོ་རྗེ་གོས་སྔོན་པོ་ཅན་གྱི་ཆོ་ག་རྡོ་རྗེ་བེ་ཅོན་གྱི་རྒྱུད།"],
["480","ལག་ན་རྡོ་རྗེ་གོས་སྔོན་པོ་ཅན་རྡོ་རྗེ་གདེངས་པའི་རྒྱུད་ཁམས་གསུམ་ལས་རྣམ་པར་རྒྱལ་བ་ཞེས་བྱ་བ།"],
["481","དཔལ་རྡོ་རྗེ་གཏུམ་པོ་ཐུགས་གསང་བའི་རྒྱུད།"],
["482","དཔལ་རྡོ་རྗེ་གཏུམ་པོ་ཐུགས་གསང་བའི་རྒྱུད་ཕྱི་མ།"],
["483","དཔལ་རྡོ་རྗེ་གཏུམ་པོ་ཐུགས་གསང་བའི་རྒྱུད་ཕྱི་མའི་ཕྱི་མ།"],
["484","རྨི་ལམ་མཐོང་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["485","ཕྱག་ན་རྡོ་རྗེ་གོས་སྔོན་པོ་ཅན་གནོད་སྦྱིན་དྲག་པོ་ཆེན་པོ་རྡོ་རྗེ་མེ་ལྕེའི་རྒྱུད་ཅེས་བྱ་བ།"],
["487","དཔལ་ཕྱག་ན་རྡོ་རྗེ་གསང་བ་བསྟན་པའི་རྒྱུད།"],
["488","བཅོམ་ལྡན་འདས་ཕྱག་ན་རྡོ་རྗེ་གསང་བ་མངོན་པར་བསྟན་པའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཞེས་བྱ་བ།"],
["486","རྡོ་རྗེ་སྙིང་པོ་རྡོ་རྗེ་ལྕེ་དབབ་པ་ཞེས་བྱ་བའི་གཟུང།"],
["489","རྡོ་རྗེ་བདེ་ཁྲོས་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["490","རྒྱུད་ཀྱི་རྒྱལ་པོ་ཆེན་པོ་སྒྱུ་འཕྲུལ་དྲ་བ་ཞེས་བྱ་བ།"],
["491","དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་སྐུ་གསུང་ཐུགས་གཤིན་རྗེ་གཤེད་ནག་པོ་ཞེས་བྱ་བའི་རྒྱུད། "],
["497","གཤིན་རྗེའི་གཤེད་ནག་པོའི་འཁོར་ལོ་ལས་ཐམས་ཅད་གྲུབ་པར་བྱེད་པ་ཞེས་བྱ་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["492","དཔལ་རྡོ་རྗེ་འཇིགས་བྱེད་ཆེན་པོའི་རྒྱུད་ཅེས་བྱ་བ། "],
["494","དཔལ་རྡོ་རྗེ་འཇིགས་བྱེད་ཀྱི་རྟོག་པའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["493","དཔལ་གཤིན་རྗེའི་གཤེད་ནག་པོའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་རྟོག་པ་གསུམ་པ་ཞེས་བྱ་བ།"],
["495","གཏམ་རྒྱུད་ཀྱི་རྟོག་པ། "],
["498","དཔལ་གཤིན་རྗེའི་གཤེད་དམར་པོ་ཞེས་བྱ་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["501","དཔལ་བཅོམ་ལྡན་འདས་རལ་པ་གཅིག་པའི་བརྟག་པའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཆེན་པོ་ཞེས་བྱ་བ། "],
["502","དཔལ་ཟླ་གསང་ཐིག་ལེ་ཞེས་བྱ་བ་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["504","དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་དེ་ཁོ་ན་ཉིད་བསྡུས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། རྣམས་བཞུགས་སོ། །"],
["505","གསང་བ་རྣལ་འབྱོར་ཆེན་པོའི་རྒྱུད་རྡོ་རྗེ་རྩ་མོ།"],
["506","ཐམས་ཅད་གསང་བ་ཞེས་བྱ་བ་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["507","འཇིག་རྟེན་གསུམ་ལས་རྣམ་པར་རྒྱལ་བ་རྟོག་པའི་རྒྱལ་པོ། "],
["508","དེ་བཞིན་གཤེགས་པ་དགྲ་བཅོམ་པ་ཡང་དག་པར་རྫོགས་པའི་སངས་རྒྱས་ངན་སོང་ཐམས་ཅད་ཡོངས་སུ་སྦྱོང་བ་གཟི་བརྗིད་ཀྱི་རྒྱལ་པོའི་བརྟག་པ་ཞེས་བྱ་བ།"],
["509","མངོན་སྤྱོད་ཀྱི་ལས།"],
["510","དེ་བཞིན་གཤེགས་པ་དགྲ་བཅོམ་པ་ཡང་དག་པར་རྫོགས་པའི་སངས་རྒྱས་ངན་སོང་ཐམས་ཅད་ཡོངས་སུ་སྦྱོང་བ་གཟི་བརྗིད་ཀྱི་རྒྱལ་པོའི་བརྟག་པ་ཕྱོགས་གཅིག་པ་ཞེས་བྱ་བ།"],
["511","རབ་ཏུ་གནས་པ་མདོར་བསྡུས་པའི་རྒྱུད།"],
["512","དཔལ་མཆོག་དང་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་རྟོག་པའི་རྒྱལ་པོ།"],
["513","དཔལ་མཆོག་དང་པོའི་སྔགས་ཀྱི་རྟོག་པའི་དུམ་བུ་ཞེས་བྱ་བ།"],
["514","འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པ་ཚུལ་བརྒྱ་ལྔ་བཅུ་པ།"],
["517","དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་སྐུ་གསུང་ཐུགས་ཀྱི་གསང་བ་རྒྱན་གྱི་བཀོད་པ་ཞེས་བྱ་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ།"],
["515","དཔལ་རྡོ་རྗེ་སྙིང་པོ་རྒྱན་ཅེས་བྱ་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཆེན་པོ། "],
["516","འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་དུ་ཕྱིན་པའི་སྒོ་ཉི་ཤུ་རྩ་ལྔ་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["518","འཕགས་པ་གསང་བ་ནོར་བུ་ཐིག་ལེ་ཞེས་བྱ་བའི་མདོ།"],
["519","རྣམ་པར་སྣང་མཛད་ཆེན་པོ་མངོན་པར་རྫོགས་པར་བྱང་ཆུབ་པ་རྣམ་པར་སྤྲུལ་པ་བྱིན་གྱིས་རློབ་པ་ཤིན་ཏུ་རྒྱས་པ་མདོ་སྡེའི་དབང་པོའི་རྒྱལ་པོ་ཞེས་བྱ་བའི་ཆོས་ཀྱི་རྣམ་གྲངས།"],
["520","དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་ཁྲོ་བོའི་རྒྱལ་པོ་འཕགས་པ་མི་གཡོ་བ་དེའི་སྟོབས་དཔག་ཏུ་མེད་པ་བརྟུལ་ཕོད་པ་འདུལ་བར་གསུངས་པ་ཞེས་བྱ་བའི་རྟོག་པ།"],
["523","བཅོམ་ལྡན་འདས་ཕྱག་ན་རྡོ་རྗེ་གོས་སྔོན་པོ་ཅན་གྱི་རྒྱུད་ཅེས་བྱ་བ།"],
["524","འཕགས་པ་ལག་ན་རྡོ་རྗེ་གོས་སྔོན་ཅན་རྡོ་རྗེ་ས་འོག་ཅེས་བྱ་བའི་རྒྱུད།"],
["521","འཕགས་པ་ལག་ན་རྡོ་རྗེ་དབང་བསྐུར་བའི་རྒྱུད་ཆེན་པོ། "],
["525","རྡོ་རྗེ་ས་གསུམ་དུ་རྒྱུ་བ་ཞེས་བྱ་བའི་རྟོག་པའི་རྒྱལ་པོ། "],
["779","འཕགས་པ་ལག་ན་རྡོ་རྗེ་གོས་སྔོན་པོ་ཅན་གྱི་ཆོ་ག་ཞེས་བྱ་བའི་གཟུངས།"],
["526","འཕགས་པ་ལག་ན་རྡོ་རྗེ་གོས་སྔོན་པོ་ཅན་ཞེས་བྱ་བ་འཇིག་རྟེན་གསུམ་འདུལ་བའི་རྒྱུད།"],
["527","དམ་ཚིག་གསུམ་བཀོད་པའི་རྒྱལ་པོ་ཞེས་བྱ་བའི་རྒྱུད།"],
["528","འཕགས་པ་དེ་བཞིན་གཤེགས་པ་བདུན་གྱི་སྔོན་གྱི་སྨོན་ལམ་གྱི་ཁྱད་པར་རྒྱས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["529","འཕགས་པ་བཅོམ་ལྡན་འདས་སྨན་གྱི་བླ་བཻ་ཌཱུརྱའི་འོད་ཀྱི་རྒྱལ་པོའི་སྔོན་གྱི་སྨོན་ལམ་གྱི་ཁྱད་པར་རྒྱས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["530","འཕགས་པ་དེ་བཞིན་གཤེགས་པའི་ཏིང་ངེ་འཛིན་གྱི་སྟོབས་བསྐྱེད་པ་བཻ་ཌཱུརྱའི་འོད་ཅེས་བྱ་བའི་གཟུངས།"],
["532","འཕགས་པ་ནོར་བུ་ཆེན་པོ་རྒྱས་པའི་གཞལ་མེད་ཁང་ཤིན་ཏུ་རབ་ཏུ་གནས་པ་གསང་བ་དམ་པའི་གསང་བའི་ཆོ་ག་ཞིབ་མོའི་རྒྱལ་པོ་ཞེས་བྱ་བའི་གཟུངས།"],
["535","བྱང་ཆུབ་ཀྱི་སྙིང་པོའི་རྒྱན་འབུམ་གྱི་གཟུངས། "],
["630","མཆོད་རྟེན་གཅིག་བཏབ་ན་བྱེ་བ་བཏབ་པར་འགྱུར་བའི་གཟུངས།"],
["533","འཕགས་པ་དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་བྱིན་གྱིས་བརླབས་ཀྱི་སྙིང་པོ་གསང་བ་རིང་བསྲེལ་གྱི་ཟ་མ་ཏོག་ཅེས་བྱ་བའི་གཟུངས་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["656","འཕགས་པ་ཡངས་པའི་གྲོང་ཁྱེར་དུ་འཇུག་པའི་མདོ་ཆེན་པོ།"],
["559","འཕགས་པ་ཤཱཀྱ་ཐུབ་པའི་སྙིང་པོའི་གཟུངས།"],
["560","འཕགས་པ་རྣམ་བར་སྣང་མཛད་ཀྱི་སྙིང་པོའི་ཞེས་བྱ་བའི་གཟུངས།"],
["680","འཕགས་པ་རྒྱལ་བའི་བླ་མའི་གཟུངས།"],
["...","འཕགས་པ་ལས་ཀྱི་སྒྲིབ་པ་ཐམས་ཅད་རྣམ་པར་སྦྱོང་བ་ཞེས་བྱ་བའི་གཟུངས། "],
["711","བདེ་ལྡན་གྱི་སྙིང་པོ།"],
["541","འཕགས་པ་སངས་རྒྱས་ཀྱི་སྙིང་པོ་ཞེས་བྱ་བའི་གཟུངས། "],
["540","འཕགས་པ་སངས་རྒྱས་ཀྱི་སྙིང་པོ་ཞེས་བྱ་བའི་གཟུངས་ཀྱི་ཆོས་ཀྱི་རྣམ་གྲངས། "],
["539","འཕགས་པ་སངས་རྒྱས་ཐམས་ཅད་ཀྱི་ཡན་ལག་དང་ལྡན་པ་ཞེས་བྱ་བའི་གཟུངས། "],
["537","འཕགས་པ་སངས་རྒྱས་བཅུ་གཉིས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["538","འཕགས་པ་སངས་རྒྱས་བདུན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["708","བཅོམ་ལྡན་འདས་སྣང་བ་མཐའ་ཡས་ཀྱི་གཟུངས་སྔགས།"],
["709","སྣང་བ་མཐའ་ཡས་རྗེས་སུ་དྲན་པ། "],
["561","ཟླ་བའི་འོད་ཀྱི་མཚན་རྗེས་སུ་དྲན་པ། "],
["562","དེ་བཞིན་གཤེགས་པ་སྤྱིའི་སྙིང་པོ་རྗེས་སུ་དྲན་པ། "],
["563","སངས་རྒྱས་རིན་ཆེན་གཙུག་གཏོར་ཅན་གྱི་མཚན་རྗེས་སུ་དྲན་པ། "],
["543","འཕགས་པ་དྲི་མ་མེད་པ་ཞེས་བྱ་བའི་གཟུངས། "],
["570","འཕགས་པ་ཁྱད་པར་ཅན་ཞེས་བྱ་བའི་གཟུངས། "],
["672","འཕགས་པ་དཀྱིལ་འཁོར་བརྒྱད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["556","འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པ་ཡི་གེ་ཉུང་ངུ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["557","བཅོམ་ལྡན་འདས་མ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པའི་སྙིང་པོ།"],
["558","སངས་རྒྱས་བཅོམ་ལྡན་འདས་ཀྱི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་གཟུངས་སྔགས་དང་བཅས་པ། "],
["571","འཕགས་པ་འཇམ་དཔལ་གྱི་རྩ་བའི་རྒྱུད།"],
["572","དཔའ་བོ་གཅིག་པུ་གྲུབ་པ་ཞེས་བྱ་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཆེན་པོ།"],
["579","བཅོམ་ལྡན་འདས་ཀྱིས་འཇམ་དཔལ་རྣོན་པོ་ལ་བསྟོད་པ།"],
["580","འཇམ་དཔལ་ངག་གི་དབང་ཕྱུག་ལ་བུ་མོ་བརྒྱད་ཀྱིས་བསྟོད་པ།"],
["573","འཕགས་པ་འཇམ་དཔལ་གྱི་ཞལ་ནས་གསུངས་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["574","འཕགས་པ་འཇམ་དཔལ་གྱིས་དམོད་གཙུག་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["575","འཇམ་དཔལ་གྱིས་དམ་བཅས་པའི་གཟུངས།"],
["576","འཇམ་དཔལ་གྱི་མཚན་གཟུངས།"],
["577","རྗེ་བཙུན་འཕགས་པ་འཇམ་དཔལ་གྱི་ཤེས་རབ་དང་བློ་འཕེལ་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["578","འཕགས་པ་འཇམ་དཔལ་གྱི་སྔགས་ཡི་གེ་འབྲུ་གཅིག་པའི་ཆོ་ག"],
["581","འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པའི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་ཞེས་བྱ་བ།"],
["582","འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པ་ཀཽ་ཤི་ཀ་ཞེས་བྱ་བ།"],
["583","འཕགས་པ་གསེར་འོད་དམ་པ་མཆོག་ཏུ་རྣམ་པར་རྒྱལ་བའི་མདོ་སྡེའི་རྒྱལ་པོ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["584","འཕགས་པ་གསེར་འོད་དམ་པ་མདོ་སྡེའི་དབང་པོའི་རྒྱལ་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["585","འཕགས་པ་གསེར་འོད་དམ་པ་མདོ་སྡེའི་དབང་པོའི་རྒྱལ་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["586","སྟོང་ཆེན་མོ་རབ་ཏུ་འཇོམས་པ་ཞེས་བྱ་བའི་མདོ།"],
["587","རིག་སྔགས་ཀྱི་རྒྱལ་མོ་རྨ་བྱ་ཆེན་མོ།"],
["589","འཕགས་པ་རིག་པའི་རྒྱལ་མོ་སོ་སོར་འབྲང་བ་ཆེན་མོ།"],
["590","བསིལ་བའི་ཚལ་ཆེན་པོའི་མདོ།"],
["591","གསང་སྔགས་ཆེན་པོ་རྗེས་སུ་འཛིན་པའི་མདོ།"],
["592","འཕགས་མ་འོད་ཟེར་ཅན་ཞེས་བྱ་བའི་གཟུངས། "],
["593","སྒྱུ་མའི་འོད་ཟེར་ཅན་འབྱུང་བའི་རྒྱུད་ལས་ཕྱུང་བའི་རྟོག་པའི་རྒྱལ་པོ་ཞེས་བྱ་བ།"],
["594","འཕགས་མ་འོད་ཟེར་ཅན་གྱི་དཀྱིལ་འཁོར་གྱི་ཆོ་ག་འོད་ཟེར་ཅན་འབྱུང་བའི་རྒྱུད་སྟོང་ཕྲག་བཅུ་གཉིས་པ་ལས་ཕྱུང་བའི་རྟོག་པའི་སྙིང་པོ་བདུན་བརྒྱ་པ་ཞེས་བྱ་བ།"],
["766","འཕགས་པ་པརྞ་ཤ་བ་རིའི་མདོ།"],
["767","འཕགས་མ་རི་ཁྲོད་ལོ་མ་གྱོན་མ་ཞེས་བྱ་བའི་གཟུངས།"],
["789","འཕགས་མ་རྡོ་རྗེ་ལུ་གུ་རྒྱུད་མའི་རྒྱུད་ཀྱི་རྟོག་པ།"],
["641","འཕགས་པ་ལྷ་མོ་སྐུལ་བྱེད་མ་ཞེས་བྱ་བའི་གཟུངས།"],
["599","འཕགས་པ་དུག་སེལ་ཅེས་བྱ་བའི་རིག་སྔགས།"],
["598","འཕགས་པ་དབྱིག་དང་ལྡན་ཞེས་བྱ་བའི་གཟུངས།"],
["763","འཕགས་པ་གྲགས་ལྡན་མའི་གཟུངས།"],
["595","འཕགས་པ་རིག་སྔགས་ཀྱི་རྒྱལ་མོ་ཆེན་མོ་རྒྱལ་བ་ཅན་ཞེས་བྱ་བ།"],
["596","འཕགས་པ་རྒྱལ་བ་ཅན་ཞེས་བྱ་བའི་གཟུངས།"],
["588","འཕགས་པ་རིག་སྔགས་ཀྱི་རྒྱལ་མོ་རྨ་བྱའི་ཡང་སྙིང་ཞེས་བྱ་བ།"],
["554","འཕགས་པ་རིག་སྔགས་ཀྱི་རྒྱལ་མོ་སྒྲོན་མ་མཆོག་གི་གཟུངས།"],
["522","འཕགས་པ་ལྷ་མོ་བརྒྱད་ཀྱི་གཟུངས།"],
["623","དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་གཙུག་གཏོར་རྣམ་པར་རྒྱལ་བ་ཞེས་བྱ་བའི་གཟུངས་རྟོག་པ་དང་བཅས་པ།"],
["625","འཕགས་པ་ངན་འགྲོ་ཐམས་ཅད་ཡོངས་སུ་སྦྱོང་བ་གཙུག་གཏོར་རྣམ་པར་རྒྱལ་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["622","དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་གཙུག་ཏོར་རྣམ་པར་རྒྱལ་བ་ཞེས་བྱ་བའི་གཟུངས་རྟོག་པ་དང་བཅས་པ།"],
["626","དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་གཙུག་གཏོར་རྣམ་པར་རྒྱལ་མའི་གཟུངས་ཞེས་བྱ་བའི་རྟོག་པ།"],
["624","འཕགས་པ་དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་གཙུག་གཏོར་རྣམ་པར་རྒྱལ་བ་ཞེས་བྱ་བའི་གཟུངས་རྟོག་པ་དང་བཅས་པ།"],
["618","འཕགས་པ་དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་གཙུག་ཏོར་ནས་བྱུང་བ་གདུགས་དཀར་པོ་ཅན་ཞེས་བྱ་བ་གཞན་གྱིས་མི་ཐུབ་པ་ཕྱིར་ཟློག་པའི་རིག་སྔགས་ཀྱི་རྒྱལ་མོ་ཆེན་མོའོ།"],
["619","འཕགས་པ་དེ་བཞིན་གཤེགས་པའི་གཙུག་ཏོར་ནས་བྱུང་བའི་གདུགས་དཀར་པོ་ཅན་གཞན་གྱིས་མི་ཐུབ་མ་ཕྱིར་ཟློག་པ་ཆེན་མོ་མཆོག་ཏུ་གྲུབ་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["620/998","འཕགས་པ་དེ་བཞིན་གཤེགས་པའི་གཙུག་ཏོར་ནས་བྱུང་བའི་གདུགས་དཀར་པོ་ཅན་ཞེས་བྱ་བ་གཞན་གྱིས་མི་ཐུབ་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["621","འཕགས་པ་དེ་བཞིན་གཤེགས་པའི་གཙུག་ཏོར་ནས་བྱུང་བའི་གདུགས་དཀར་པོ་ཅན་ཞེས་བྱ་བ་གཞན་གྱིས་མི་ཐུབ་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["627","ཀུན་ནས་སྒོར་འཇུག་པའི་འོད་ཟེར་གཙུག་གཏོར་དྲི་མ་མེད་པར་སྣང་བ་དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་སྙིང་པོ་དང་དམ་ཚིགས་ལ་རྣམ་པར་ལྟ་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["650","འཕགས་པ་ནད་ཐམས་ཅད་རབ་ཏུ་ཞི་བར་བྱེད་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["651","འཕགས་པ་ནད་ཐམས་ཅད་རབ་ཏུ་ཞི་བར་བྱེད་པའི་གཟུངས།"],
["653","འཕགས་པ་རིམས་ནད་རབ་ཏུ་ཞི་བར་བྱེད་པའི་གཟུངས།"],
["652","རིམ་ནད་ཞི་བའི་གཟུངས།"],
["648","འཕགས་པ་མིག་ནད་རབ་ཏུ་ཞི་བར་བྱེད་པའི་མདོ།"],
["654","འབྲུམ་བུའི་ནད་ཞི་བར་བྱེད་པའི་གཟུངས།"],
["649","འཕགས་པ་གཞང་འབྲུམ་རབ་ཏུ་ཞི་བར་བྱེད་པའི་མདོ།"],
["657","འཕགས་པ་མི་རྒོད་རྣམ་པར་འཇོམས་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["643","འཕགས་པ་བུ་མང་པོ་རྟོན་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["741","སྟོང་འགྱུར་ཞེས་བྱ་བའི་གཟུངས།"],
["548","འཕགས་པ་ཡེ་ཤེས་ཏ་ལ་ལ་ཞེས་བྱ་བའི་གཟུངས་འགྲོ་བ་ཐམས་ཅད་ཡོངས་སུ་སྦྱོང་བ།"],
["536","འཕགས་པ་འོད་ཟེར་དྲི་མ་མེད་པ་རྣམ་པར་དག་བའི་འོད་ཅེས་བྱ་བའི་གཟུངས།"],
["629","ཤེས་པས་ཐམས་ཅད་མཐར་ཕྱིན་པར་གྲུབ་པའི་མཆོད་རྟེན་ཞེས་བྱ་བའི་གཟུངས།"],
["545","འཕགས་པ་རྟེན་ཅིང་འབྲེལ་བར་འབྱུང་བའི་སྙིང་པོའི་ཆོ་གའི་གཟུངས།"],
["546","འཕགས་པ་རྟེན་ཅིང་འབྲེལ་བར་འབྱུང་བ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["547","འཕགས་པ་རྟེན་ཅིང་འབྲེལ་བར་འབྱུང་བའི་སྙིང་པོ་ཞེས་བྱ་བ།"],
["804","རིན་པོ་ཆེ་བརྡར་བའི་གཟུངས།"],
["628","གཙུག་གཏོར་འབར་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["531","སྨན་གཏོར་པའི་ཚེ་སྨནླ་སྔགས་ཀྱིས་གདབ་པ།"],
["805","བསྐོར་བའི་གཟུངས།"],
["806","འཕགས་པ་དཀོན་མཆོག་གི་རྟེན་ལ་བསྐོར་བ་བྱ་བའི་གཟུངས་ཞེས་བྱ་བ།"],
["807","ཡོན་ཡོངས་སུ་སྦྱོངས་བ་ཞེས་བྱ་བ།"],
["808","ཡོན་ཡོངས་སུ་སྦྱོངས་བའི་གཟུངས།"],
["679","ཐོས་པ་འཛིན་པའི་གཟུངས།"],
["751","ཐོས་པ་འཛིན་པའི་གཟུངས།"],
["749","ཤེས་རབ་བསྐྱེད་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["750","ཤེས་རབ་བསྐྱེད་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["678","ཤེས་རབ་བསྐྱེད་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["742","ཤུ་ལོ་ཀ་བརྒྱ་ལོབས་པ།"],
["743","ཤློ་ཀ་བརྒྱ་ལོབས་བའི་གཟུངས།"],
["744","ཤོ་ལོ་ཀ་སྟོང་ལོབས་པའི་གཟུངས།"],
["745","ཤུ་ལོ་ཀ་སྟོང་ལོབས་པ།"],
["746","ཤློ་ཀ་སུམ་སྟོང་ལོབས་བའི་གཟུངས།"],
["747","ཤུ་ལོ་ཀ་སུམ་སྟོང་ལོབས་བའི་གཟུངས།"],
["748","མི་བརྗེད་པའི་གཟུངས།"],
["809","ཕྱག་བྱ་བའི་གཟུངས།"],
["810","གོས་བརྒྱ་ཐོབ་པའི་གཟུངས།"],
["811","མི་དགའ་བར་བྱེད་པའི་གཟུངས།"],
["567","འཕགས་པ་པད་མའི་སྤྱན་ཞེས་བྱ་བའི་གཟུངས།"],
["812","ངན་སོང་ཐམས་ཅད་ཡོངས་སུ་སྦྱོང་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["813","སྐྲན་ཞི་བའི་གཟུངས།"],
["814","མ་ཞུ་བའི་ནད་འབྱང་བའི་གཟུངས།"],
["815","འཕགས་པ་སྡང་པ་ཐམས་ཅད་རབ་ཏུ་ཞི་བར་བྱེད་པའི་གཟུངས།"],
["816","སྡིག་པ་ཐམས་ཅད་རབ་ཏུ་ཞི་བར་བྱེད་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["817","ཁྲོ་བ་ཞི་བར་བྱེད་པའི་གཟུངས།"],
["818","ཁྲོས་པ་ཞི་བའི་གཟུངས།"],
["819","ཚིག་བཙན་པའི་གཟུངས།"],
["820","བདག་བསྲུང་བའི་གཟུངས།"],
["821","ཡིད་དུ་འོང་བའི་གཟུངས།"],
["822","མགྲིན་པ་སྙན་པའི་གཟུངས།"],
["823","དོན་ཐམས་ཅད་འགྲུབ་པའི་གཟུངས།"],
["824","ལས་འགྲུབ་པའི་གཟུངས།"],
["825","དུག་ཐམས་ཅད་ཞི་བར་བྱེད་པའི་གཟུངས།"],
["826","བཅིངས་པ་ལས་གྲོལ་བའི་གཟུངས།"],
["827","བདུད་ཐམས་ཅད་སྐྲག་པར་བྱེད་པའི་གཟུངས།"],
["828","རྨ་འབྱོར་བར་བྱེད་པའི་གཟུངས།"],
["829","མེའི་ཟུག་རྔུ་རབ་ཏུ་ཞི་བར་བྱེད་པའི་གཟུངས།"],
["830","འཁྲིས་པའི་ནད་སེལ་བའི་གཟུངས།"],
["831","བད་ཀན་གྱི་ནད་སེལ་བའི་གཟུངས།"],
["832","ཀྵ་ཡའི་ནད་སེལ་བའི་གཟུངས།"],
["833","རིམས་དང་སྲོག་ཆགས་གྱིས་མི་ཚུགས་པའི་གཟུངས།"],
["...","སྟོང་ཆེན་མོ་ནས་ཕྱུང་བ་སྨན་ལ་སྔགས་ཀྱི་གདབ་པ་ཞེས་བྱ་བ།"],
["...","སྨན་གཏོང་པའི་ཚེ་སྨན་ལ་སྔགས་ཀྱི་གདབ་པ།"],
["773","མཆོག་ཐོབ་པའི་རིགས་སྔགས།"],
["604","འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཕྱིན་པ་སྟོང་ཕྲག་བརྒྱ་བའི་གཟུངས།"],
["605","འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པ་སྟོང་ཕྲག་ཉི་ཤུ་ལྔ་པའི་གཟུངས།"],
["606","འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པ་བརྒྱད་སྟོང་པའི་གཟུངས། "],
["607","ཕ་རོལ་ཏུ་ཕྱིན་པ་དྲུག་གི་སྙིང་པོའི་གཟུངས།"],
["608","ཕ་རོལ་ཏུ་ཕྱིན་པ་དྲུག་བཟུང་བར་འགྱུར་བའི་གཟུངས།"],
["609","ཕ་རོལ་ཏུ་ཕྱིན་པ་བཅུ་ཐོབ་པར་འགྱུར་པའི་གཟུངས།"],
["610","ཚད་མེད་པ་བཞི་ཐོབ་པར་འགྱུར་པའི་གཟུངས།"],
["611","ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པ་སྟོང་ཕྲག་བརྒྱ་བ་གཟུང་བར་འགྱུར་པའི་གཟུངས།"],
["612","འཕགས་པ་ཕལ་པོ་ཆེ་གཟུང་བར་འགྱུར་བའི་གཟུངས།"],
["613","འཕགས་པ་སྔོང་པོ་བཀོད་པའི་སྙིང་པོ།"],
["614","འཕགས་པ་ཏིང་ངེ་འཛིན་གྱི་རྒྱལ་པོ་རི་མདོ་བཟུང་བར་འགྱུར་བའི་གཟུངས།"],
["615","འཕགས་པ་རྨ་བྱ་ཆེན་པོའི་སྙིང་པོའི་གཟུངས། "],
["616","འཕགས་མ་སོ་སོར་འབྲང་མ་ཆེན་པོ་བཟུང་བར་འགྱུར་བའི་གཟུངས།"],
["617","འཕགས་པ་ལ་དཀར་གཤེགས་པའི་མདོ་ཐམས་ཅད་བཀླགས་པར་འགྱུར་པའི་གཟུངསསྔགས།"],
["564","མཆོད་པའི་སྤྲིན་ཞེས་བྱ་བའི་གཟུངས།"],
["565","ཕྱག་དང་། བསྟོད་པ་དང་། བྱིན་རླབས་དང་། མཆོད་པའི་སྤྲིན་འབྱུང་བ་དང་། མཆོད་པ་དང་། བསྙེན་གནས་དང་། ཕྱག་བྱས་པར་འགྱུར་བ།"],
["710","འཕགས་པ་ཡོན་ཏན་བསྔགས་པ་དཔག་ཏུ་མེད་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["601","འཕགས་པ་ཆོས་ཐམས་ཅད་ཀྱི་ཡུམ་ཞེས་བྱའི་གཟུངས།"],
["768","འཕགས་པ་ཕྱིར་ཟློག་པ་སྟོབས་ཅན་ཞེས་བྱ་བའོ།"],
["655","མདངས་ཕྱིར་མི་འཕྲོག་པ་ཞེས་བྱ་བ།"],
["803","འཕགས་པ་རིག་སྔགས་ཀྱི་རྒྱལ་པོ་དབུགས་ཆེན་པོ་ཞེས་བྱ་བ།"],
["632","ཁྲོ་བོ་རྣམ་པར་རྒྱལ་བའི་རྟོག་པ་གསང་བའི་རྒྱུད།"],
["602","འཕགས་པ་གཙུག་གི་ནོར་བུ་ཞེས་བྱ་བའི་གཟུངས།"],
["544","འཕགས་པ་ཙན་དན་གྱི་ཡན་ལག་ཅེས་བྱ་བའི་གཟུངས།"],
["765","ཕྱིར་ཟློག་པ་འཕགས་པ་རྣམ་པར་རྒྱལ་བ་ཅན་ཞེས་བྱ་བ།"],
["646","འཕགས་པ་མདངས་ཕྱིར་འཕྲོག་པ་ཞེས་བྱ་བའི་མདོ།"],
["635","འཕགས་པ་གཞན་གྱིས་མི་ཐུབ་པ་རིན་པོ་ཆེའི་ཕྲེང་བ་ཞེས་བྱ་བ།"],
["739","འཕགས་པ་གཞན་གྱིས་མི་ཐུབ་པ་མི་འཇིགས་པ་སྦྱིན་པ་ཞེས་བྱ་བ།"],
["550","འཕགས་པ་གདོན་མི་ཟ་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["740","གཞན་གྱིས་མི་ཐུབ་པའི་རིག་པ་ཆེན་མོ།"],
["637","འཕགས་པ་ཐམས་ཅད་ལ་མི་འཇིགས་པ་རབ་ཏུ་སྦྱིན་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["597","འཕགས་པ་དབང་བསྐུར་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["647","འཕགས་པ་མིག་རྣམ་པར་སྦྱོང་བ་ཞེས་བྱ་བའི་རིག་སྔགས།"],
["636","འཕགས་པ་བར་དུ་གཅོད་པ་ཐམས་ཅད་རྣམ་པར་སྦྱོང་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["658","འཕགས་པ་བར་དུ་གཅོད་པ་ཐམས་ཅད་སེལ་བའི་གཟུངས་སྔགས།"],
["638","འཕགས་པ་འགྲོ་ལྡིང་བའི་རིག་སྔགས་ཀྱི་རྒྱལ་པོ།"],
["640","འཕགས་པ་རྒྱལ་མཚན་གྱི་རྩེ་མོའི་དཔུང་རྒྱན་ཅེས་བྱ་བའི་གཟུངས།"],
["549","འཕགས་པ་སའི་དབང་པོ་ཞེས་བྱ་བའི་གཟུངས།"],
["634","འཕགས་པ་བེ་ཅོན་ཆེན་པོ་ཞེས་བྱ་བའི་གཟུངས།"],
["642","འཕགས་པ་སྒོ་བཟང་པོ་ཞེས་བྱ་བའི་གཟུངས།"],
["683","འཕགས་པ་ཆོས་ཀྱི་རྒྱ་མཚོ་ཞེས་བྱ་བའི་གཟུངས།"],
["639","ཚིགས་སུ་བཅད་པ་གཉིས་པའི་གཟུངས།"],
["552","འཕགས་པ་སྒོ་དྲུག་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["603","འཕགས་པ་ཡི་གེ་དྲུག་མའི་རིག་སྔགས།"],
["661","འཕགས་པ་གསེར་ཅན་ཞེས་བྱ་བའི་གཟུངས།"],
["631","སྙིང་རྗེའི་མཆོག་ཅེས་བྱ་བའི་གཟུངས།"],
["542","འཕགས་པ་མེ་ཏོག་བརྩེགས་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["555","འཕགས་པ་གཟུངས་ཆེན་པོ།"],
["659","འཕགས་པ་མི་གཡོ་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["660","འཕགས་པ་རྡོ་རྗེ་ཁྲོ་བོའི་རྒྱལ་པོའི་རྟོག་པ་བསྡུས་པའི་རྒྱུད་ཅེས་བྱ་བ།"],
["662","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་གི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་གཟུངས་སྔགས་དང་བཅས་པ།"],
["663","འཕགས་པ་བྱམས་པའི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་གཟུངས་སྔགས་དང་བཅས་པ།"],
["664","འཕགས་པ་ནམ་མཁའི་སྙིང་པོའི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་གཟུངས་སྔགས་དང་བཅས་པ།"],
["665","འཕགས་པ་ཀུན་དུ་བཟང་པོའི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་གཟུངས་སྔགས་དང་བཅས་པ།"],
["666","འཕགས་པ་ལག་ན་རྡོ་རྗེའི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་གཟུངས་སྔགས་དང་བཅས་པ།"],
["667","འཕགས་པ་འཇམ་དཔལ་གཞོན་ནུར་གྱུར་པའི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་གཟུངས་སྔགས་དང་བཅས་པ།"],
["668","འཕགས་པ་སྒྲིབ་པ་ཐམས་ཅད་རྣམ་པར་སེལ་བའི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་གཟུངས་སྔགས་དང་བཅས་པ།"],
["669","འཕགས་པ་སའི་སྙིང་པོའི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་གཟུངས་སྔགས་དང་བཅས་པ།"],
["737","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་གི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་ཞེས་བྱ་བ།"],
["670","འཕགས་པ་འཇམ་དཔལ་གྱི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་ཞེས་བྱ་བ།"],
["671","འཕགས་པ་བྱམས་པས་དམ་བཅས་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["801","འཕགས་པ་གནོད་འཛིན་གྱི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་ཞེས་བྱ་བ།"],
["682","མདོ་ཆེན་པོ་འདུས་པ་ཆེན་པོའི་མདོ་ཞེས་བྱ་བ།"],
["685","མདོ་ཆེན་པོ་ཀུན་ཏུ་རྒྱུ་བ་དང་། ཀུན་ཏུ་རྒྱུ་བ་མ་ཡིན་པ་དང་མཐུན་པའི་མདོ་ཞེས་བྱ་བ།"],
["686","འཕགས་པ་སྤྲིན་ཆེན་པོ།"],
["687","འཕགས་པ་སྤྲིན་ཆེན་པོ་རླུང་གི་དཀྱིལ་འཁོར་གྱི་ལེའུ་ཀླུ་ཐམས་ཅད་ཀྱི་སྙིང་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["688","འཕགས་པ་ཀླུའི་རྒྱལ་པོ་གཟི་ཅན་གྱིས་ཞུས་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["696","ཚོགས་ཀྱི་བདག་པོ་ཆེན་པོའི་རྒྱུད་ཅེས་བྱ་བ།"],
["695","འཕགས་པ་ཚོགས་ཀྱི་བདག་པོའི་སྙིང་པོ།"],
["689","འཕགས་མ་གཟའ་རྣམས་ཀྱི་ཡུམ་ཞེས་བྱ་བའི་གཟུངས།"],
["690","གཟའ་རྣམས་ཀྱི་ཡུམ་ཞེས་བྱ་བའི་གཟུངས།"],
["692","འཕགས་པ་ནོར་གྱི་རྒྱུན་ཅེས་བྱ་བའི་གཟུངས།"],
["693","བཅོམ་ལྡན་འདས་མ་ནོར་རྒྱུན་མའི་རྟོག་པ།"],
["694","བཅོམ་ལྡན་འདས་མ་ནོར་རྒྱུན་མའི་གཟུངས་ཀྱི་རྟོག་པ།"],
["697","དཔལ་ནག་པོ་ཆེན་པོའི་རྒྱུད།"],
["698","དཔལ་མགོན་པོ་ནག་པོ་ཞེས་བྱ་བའི་གཟུངས།"],
["700","ལྷ་མོ་ནག་མོ་ཆེན་མོའི་གཟུངས།"],
["699","འཕགས་པ་ནག་པོ་ཆེན་པོའི་གཟུངས་རིམས་ནད་ཐམས་ཅད་ལས་ཐར་བར་བྱེད་པ།"],
["701","དཔལ་ལྷ་མོ་ནག་མོའི་བསྟོད་པ་རྒྱལ་པོའི་རྒྱུད།"],
["702","དཔལ་ལྷ་མོ་ནག་མོའི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ།"],
["703","ལྷའི་དབང་པོ་བརྒྱ་བྱིན་གྱིས་བསྟོད་པ། "],
["644","འཕགས་པ་རོ་ལངས་བདུན་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["568","སུ་རུ་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["677","ཡེ་ཤེས་སྐར་མདའི་སྙིང་པོ།"],
["673","བདུད་རྩི་འབྱུང་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["675","ཡི་དགས་མོ་ཁ་འབར་མ་དབུགས་དབྱུང་བའི་གཏོར་མའི་ཆོ་ག"],
["674","ཡི་དགས་ཁ་ནས་མེ་འབར་བ་ལ་སྐྱབས་མཛད་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["676","འཇུར་འགེགས་ཞེས་བྱ་བའི་གཟུངས།"],
["834","ལུས་ཀྱི་ཟག་པ་སྦྱིན་པར་གཏང་བའི་གཟུངས།"],
["...","ཇི་ལྟར་སྨོན་ལམ་བཏབ་པ་བཞིན་དུ་སྐྱེ་བར་གྱུར་རོ།"],
["704","ཕགས་པ་ཚེ་དཔག་མེད་ཀྱི་སྙིང་པོ།"],
["705","འཕགས་པ་ཚེ་དང་ཡེ་ཤེས་དཔག་ཏུ་མེད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["706","འཕགས་པ་ཚེ་དང་ཡེ་ཤེས་དཔག་ཏུ་མེད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["707","འཕགས་པ་ཚེ་དང་ཡེ་ཤེས་དཔག་ཏུ་མེད་པའི་སྙིང་པོ་ཞེས་བྱ་བའི་གཟུངས།"],
["712","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་གི་རྩ་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་པདྨ་དྲ་བ་ཞེས་བྱ་བ།"],
["717","འཕགས་པ་དོན་ཡོད་པའི་ཞགས་པའི་ཆོ་ག་ཞིབ་མོའི་རྒྱལ་པོ།"],
["713","འཕགས་པ་དོན་ཡོད་པའི་ཞགས་པའི་སྙིང་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["718","འཕགས་པ་དོན་ཡོད་པའི་ཞགས་པའི་ཕ་རོལ་ཏུ་ཕྱིན་པ་དྲུག་ཡོངས་སུ་རྫོགས་པར་བྱེད་པ་གཟུངས་ཆེན་པོ།"],
["...","འཕགས་པ་སྤྱན་རས་གཟིགས་ཀྱི་དབང་ཕྱུག་ཕྱག་སྟོང་སྤྱན་སྟོང་དུ་སྤྲུལ་པ་རྒྱ་ཆེན་པོ་ཡོངས་སུ་རྫོགས་པ་ཐོགས་པ་མེད་པར་ཐུགས་རྗེ་ཆེན་པོ་དང་ལྡན་པའི་གཟུངས།"],
["722","འཕགས་པ་བྱང་ཆུབ་སེམས་དཔའ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་ཕྱག་སྟོང་སྤྱན་སྟོང་དང་ལྡན་པ་ཐོགས་པ་མི་མངའ་བའི་ཐུགས་རྗེ་ཆེན་པོའི་སེམས་རྒྱ་ཆེར་ཡོངས་སུ་རྫོགས་པ་ཞེས་བྱ་བའི་གཟུངས་བམ་པོ་གསུམ་རྣམས་བཞུགས་སོ།"],
["...",""],
["723","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་གི་གསང་བའི་མཛོད་ཐོགས་པ་མེད་པའི་ཡིད་བཞིན་གྱི་འཁོར་ལོའི་སྙིང་པོ་ཞེས་བྱ་བའི་གཟུངས།"],
["727","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་གི་གཟུངས་ཞེས་བྱ་བ།"],
["726","འཕགས་པ་སྤྱན་རས་གཟིགས་ཀྱི་སྙིང་པོ།"],
["724","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་ཞལ་བཅུ་གཅིག་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["725","འཕགས་པ་ཞལ་བཅུ་གཅིག་པའི་རིག་སྔགས་ཀྱི་སྙིང་པོ་ཞེས་བྱ་བའི་གཟུངས།"],
["732","པད་མ་ཅོད་པན་ཞེས་བྱ་བའི་རྒྱུད།"],
["731","འཇིག་རྟེན་དབང་ཕྱུག་གི་རྟོག་པ།"],
["730","འཕགས་པ་ཀུན་ཏུ་བཟང་པོ་ཞེས་བྱ་བའི་གཟུངས།"],
["728","འཕགས་པ་ནཱི་ལ་ཀཎྛ་ཞེས་བྱ་བའི་གཟུངས།"],
["764","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་ཧ་ཡ་གྲཱི་བའི་གཟུངས།"],
["754","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་ཐུགས་རྗེ་ཆེན་པོའི་གཟུངས་ཕན་ཡོན་མདོར་བསྡུས་པ་ཞེས་བྱ་བ།"],
["736","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་གི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་ཞེས་བྱ་བ།"],
["799","འཕགས་པ་གནོད་འཛིན་ཆུ་དབང་སྙིང་རྗེ་ཅན་གྱི་གཟུངས་བདེ་བྱེད་ཅེས་བྱ་བ།"],
["600","བཀླགས་པས་གྲུབ་པ་བཅོམ་ལྡན་འདས་མ་འཕགས་མ་སོར་མོ་ཅན་ཞེས་བྱ་བ་རིག་པའི་རྒྱལ་མོ།"],
["738","འཕགས་པ་ལུས་ཀྱི་དབྱིབས་མཛེས་ཞེས་བྱ་བའི་གཟུངས།"],
["733","སེང་གེ་སྒྲའི་རྒྱུད་ཅེས་བྱ་བ།"],
["734","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་སེང་གེ་སྒྲའི་གཟུངས་ཞེས་བྱ་བ།"],
["735","སེང་གེ་སྒྲའི་གཟུངས།"],
["729","འཕགས་པ་སྙིང་རྗེས་མི་བཤོལ་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["756","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་གི་ཡུམ་ཞེས་བྱ་བའི་གཟུངས།"],
["757","དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་ཡུམ་སྒྲོལ་མ་ལས་སྣ་ཚོགས་འབྱུང་བ་ཞེས་བྱ་བའི་རྒྱུད།"],
["758","རྗེ་བཙུན་མ་འཕགས་མ་སྒྲོལ་མའི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་ཞེས་བྱ་བ།"],
["759","ལྷ་མོ་སྒྲོལ་མའི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་ཞེས་བྱ་བ།"],
["760","འཕགས་མ་སྒྲོལ་མའི་གཟུངས།"],
["761","འཕགས་མ་སྒྲོལ་མ་རང་གིས་དམ་བཅས་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["762","འཕགས་མ་སྒྲོལ་མ་འཇིགས་པ་བརྒྱད་ལས་སྐྱོབ་པའི་མདོ།"],
["569","འཕགས་པ་འཇིགས་པ་ཆེན་པོ་བརྒྱད་ལས་སྒྲོལ་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["769","དཔལ་ལྷ་མོ་སྒྲ་དབྱངས་ལ་བསྟོད་པ།"],
["770","འཕགས་པ་ལྷ་མོ་ཆེན་མོ་དཔལ་ལུང་བསྟན་པ།"],
["771","འཕགས་པ་དཔལ་ཆེན་མོའི་མདོ།"],
["772","དཔལ་གྱི་ལྷ་མོའི་མཚན་བཅུ་གཉིས་པ།"],
["774","འཕགས་པ་ལས་ཀྱི་སྒྲིབ་པ་ཐམས་ཅད་རྣམ་པར་སྦྱོང་བ། ཞེས་བྱ་བའི་གཟུངས།"],
["777","འཕགས་པ་རིག་པ་མཆོག་གི་རྒྱུད་ཆེན་པོ།"],
["775","འཕགས་པ་རྡོ་རྗེ་ས་འོག་གི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཞེས་བྱ་བ།"],
["778","འབྱུང་པོ་འདུལ་བ་ཞེས་བྱ་བའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་ཆེན་པོ།"],
["780","འཕགས་པ་ལག་ན་རྡོ་རྗེའི་མཚན་བརྒྱད་པ་གསང་སྔགས་དང་བཅས་པ།"],
["781","རྡོ་རྗེ་རྣམ་པར་འཇོམས་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["782","འཕགས་པ་རྡོ་རྗེའི་རི་རབ་ཆེན་པོའི་རྩེ་མོའི་ཁང་པ་བརྩེགས་པའི་གཟུངས།"],
["783","འཕགས་པ་རྡོ་རྗེ་མི་འཕམ་པ་མེ་ལྟར་རབ་ཏུ་རྨོངས་བྱེད་ཅེས་བྱ་བའི་གཟུངས།"],
["784","རྡོ་རྗེ་ཕྲ་མོ་ཐོག་པ་མེད་པ་ཞེས་བྱ་བའི་གཟུངས། "],
["785","འཕགས་པ་ལག་ན་རྡོ་རྗེ་བཅུའི་སྙིང་པོ།"],
["790","རྡོ་རྗེ་མཆུ་ཞེས་བྱ་བ་ཀླུའི་དམ་ཚིག་གོ"],
["791","རྡོ་རྗེ་གནམ་ལྕགས་མཆུ་ཞེས་བྱ་བའི་གཟུངས།"],
["792","འཕགས་པ་ལྕགས་མཆུ་ཞེས་བྱ་བའི་གཟུངས།"],
["793","འཕགས་པ་ལྕགས་ཀྱི་མཆུ་ཞེས་བྱ་བའི་གཟུངས།"],
["794","འཕགས་པ་ལྕགས་མཆུ་ནག་པོ།"],
["788","འཕགས་པ་སྟོབས་པོ་ཆེ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["...","མཆོད་པའི་སྤྲིན་ཅེས་བྱ་བའི་གཟུངས།"],
["633","འཕགས་པ་རྡོ་རྗེ་འཇིགས་བྱེད་ཀྱི་གཟུངས་ཞེས་བྱ་བ།"],
["786","འཕགས་པ་བདུད་རྩི་ཐབ་སྦྱོར་གྱི་སྙིང་པོ་བཞི་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["787","ཁྲོ་བོའི་རྒྱལ་པོ་སྨེ་བརྩེགས་ལ་བསྟོད་པའི་སྔགས།"],
["684","འཕགས་པ་བགེགས་སེལ་བའི་གཟུངས།"],
["795","འཕགས་པ་ནོར་བུ་བཟང་པོའི་གཟུངས་ཞེས་བྱ་བ།"],
["796","གནོད་སྦྱིན་ནོར་བུ་བཟང་པོའི་རྟོག་པ།"],
["...","གར་མཁན་མཆོག་གི་བསྒྲུབ་པའི་ཆོ་ག"],
["798","འཕགས་པ་གནོད་འཛིན་དཔལ་ཞེས་བྱ་བའི་གཟུངས།"],
["800","འཕགས་པ་གནོད་གནས་དབང་པོ་ཅི་ལྟར་འབྱུང་བའི་རྟོག་པ་ཞེས་བྱ་བ།"],
["802","འཕགས་པ་མེ་ཁ་ལ་ཞེས་བྱ་བའི་གཟུངས།"],
["835","འཕགས་པ་དཔུང་བཟང་གིས་ཞུས་པ་ཞེས་བྱ་བའི་རྒྱུད།"],
["836","དཀྱིལ་འཁོར་ཐམས་ཅད་ཀྱི་སྤྱིའི་ཆོ་ག་གསང་བའི་རྒྱུད།"],
["838","བསམ་གཏན་གྱི་ཕྱི་མ་རིམ་པར་ཕྱེ་བ།"],
["837","ལེགས་པར་གྲུབ་པར་བྱེད་པའི་རྒྱུད་ཆེན་པོ་ལས་སྒྲུབ་པའི་ཐབས་རིམ་པར་ཕྱེ་བ།"],
["839","འཕགས་པ་དགོངས་པའི་རྒྱུད་ཀྱི་ཕྲེང་བ་ཆེན་པོ་བྱང་ཆུབ་སེམས་དཔའི་རྣམ་པར་ངེས་པ་ཆེན་པོ་བསྟན་པ་ལས་ནོར་བུ་ཆེན་པོ་རིན་པོ་ཆེ་ལ་མཁས་པ་བསྟན་པ་ཡོངས་སུ་བསྔོ་བ་ཆེན་པོའི་རྒྱལ་པོ་ཞེས་བྱ་བ།"],
["840","འཕགས་པ་ཡོངས་སུ་བསྔོ་བའི་རྒྱལ་པོ་ཆེན་པོ་སྔགས་དང་བཅས་པ།"],
["841","དཔལ་ལེགས་པར་གྲུབ་པར་བྱེད་པའི་རྒྱུད་ཆེན་པོ་ལས་བྱུང་བའི་སྨོན་ལམ།"],
["842","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་ཡིད་བཞིན་གྱི་ནོར་བུའི་རྟོག་པ་ལས་སྨོན་ལམ་འབྱུང་བ།"],
["སྔགས་སྙིང་བཞི་འབྱུང་བ་དང་། སྨོན་ལམ་དང་ཚིགས་སུ་བཅད་པ་དང་སྔགས་སུ་བཅས་པ།"],
["843","སྟོང་ཆེན་མོ་རབ་ཏུ་འཇོམས་པ་ལས་གསུངས་པའི་སྨོན་ལམ།"],
["844","རིག་སྔགས་ཀྱི་རྒྱལ་མོ་རྨ་བྱ་ཆེན་མོ་ལས་གསུངས་པའི་སྨོན་ལམ་དང་བདེན་ཚིག"],
["845","སྦྱིན་པའི་རབས་ལས་འབྱུང་བའི་སྨོན་ལམ།"],
["846","འཕགས་པ་ཡངས་པའི་གྲོང་ཁྱེར་དུ་འཇུག་པའི་མདོ་ལས་འབྱུང་བའི་བདེ་ལེགས་ཀྱི་ཚིགས་སུ་བཅད་པ།"],
["847","བདེ་ལེགས་ཀྱི་ཚིགས་སུ་བཅད་པ།"],
["848","བདེ་ལེགས་སུ་འགྱུར་བའི་ཚིགས་སུ་བཅད་པ།"],
["849","ལྷས་ཞུས་པའི་བཀྲ་ཤིས་ཀྱི་ཚིགས་སུ་བཅད་པ།"],
["850","དཔལ་རྣལ་འབྱོར་གྱི་རྒྱུད་ཀྱི་དཀྱིལ་འཁོར་གྱི་ལྷ། དེ་བཞིན་གཤེགས་པ་རིགས་ལྔ་འཁོར་དང་བཅས་པ། ལྷ་སུམ་ཅུ་རྩ་བདུན་གྱི་བཀྲ་ཤིས་ཀྱི་ཚིགས་སུ་བཅད་པ།"],
["851","སངས་རྒྱས་རབས་བདུན་གྱི་བཀྲ་ཤིས་ཀྱི་ཚིགས་སུ་བཅད་པ།"],
["852","དེ་བཞིན་གཤེགས་པ་ལྔའི་བཀྲ་ཤིས་ཚིགས་སུ་བཅད་པ།"],
["853","དཔལ་རིགས་གསུམ་གྱི་བཀྲ་ཤིས།"],
["854","དཀོན་མཆོག་གསུམ་གྱི་བཀྲ་ཤིས་ཀྱི་ཚིགས་སུ་བཅད་པ། "],
["855","རིགས་གསུམ་གྱི་བཀྲ་ཤིས།"],
["856","བཀྲ་ཤིས་ཀྱི་ཚིགས་སུ་བཅད་པ།"],
["857","དཀོན་མཆོག་གསུམ་གྱི་བཀྲ་ཤིས་ཀྱི་ཚིགས་སུ་བཅད་པ།"],
["1118","ཆོས་ཐམས་ཅད་རྫོགས་པ་ཆེན་པོ་བྱང་ཆུབ་ཀྱི་སེམས་ཀུན་བྱེད་རྒྱལ་པོ།"],
["1119","དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་ཐུགས་གསང་བའི་ཡེ་ཤེས་དོན་གྱི་སྙིང་པོ་རྡོ་རྗེ་བཀོད་པའི་རྒྱུད་རྣལ་འབྱོར་གྲུབ་པའི་ལུང་ཀུན་འདུས་རིག་པའི་མདོ་ཐེག་པ་ཆེན་པོ་མངོན་པར་རྟོགས་པ་ཆོས་ཀྱི་རྣམ་གྲངས་རྣམ་པར་བཀོད་པ་ཞེས་བྱ་བའི་མདོ།"],
["1120","དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་གསང་བ། གསང་བའི་མཛོད་ཆེན་པོ་མི་ཟད་པ་གཏེར་གྱི་སྒྲོན་མ། བརྟུལ་ཞུགས་ཆེན་པོ་བསྒྲུབ་པའི་རྒྱུད།"],
["1121","དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་ཐུགས་གསང་བའི་ཡེ་ཤེས་དོན་གྱི་སྙིང་པོ་ཁྲོ་བོ་རྡོ་རྗེའི་རིགས་ཀུན་འདུས་རིག་པའི་མདོ་རྣལ་འབྱོར་གྲུབ་པའི་རྒྱུད་ཅེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["1122","དཔལ་གསང་བའི་སྙིང་པོ་དེ་ཁོ་ན་ཉིད་རྣམ་པར་ངེས་པ།"],
["1123","རྡོ་རྗེ་སེམས་དཔའི་སྒྱུ་འཕྲུལ་དྲ་བ་གསང་བ་ཐམས་ཅད་ཀྱི་མེ་ལོང་ཞེས་བྱ་བའི་རྒྱུད།"],
["1124","གསང་བའི་སྙིང་པོ་དེ་ཁོ་ན་ཉིད་ངེས་པ།"],
["1125","འཕགས་པ་ཐབས་ཀྱི་ཞགས་པ་པདྨོའི་ཕྲེང་ཞེས་བྱ་བ།"],
["1126","ལྷ་མོ་སྒྱུ་འཕྲུལ་དྲ་བ་ཆེན་མོ་ཞེས་བྱ་བའི་རྒྱུད། "],
["1127","གསང་བའི་སྙིང་པོ་དེ་ཁོ་ན་ཉིད་ངེས་པའི་བླ་མ་ཆེན་པོའོ།"],
["1128","འཕགས་པ་འཇམ་དཔལ་ལས་བཞི་འཁོར་ལོ་གསང་བའི་སྒྱུད།"],
["1129","དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་དགོངས་པ་བླ་ན་མེད་པ་གསང་བ་རྟ་མཆོག་རོལ་པའི་རྒྱུད་ཆེན་པོ་ཞེས་བྱ་བ།"],
["1130","དཔལ་ཧེ་རུ་ཀ་སྙིང་རྗེ་རོལ་པའི་རྒྱུད་གསང་བ་ཟབ་མོའི་མཆོག་ཅེས་བྱ་བ།"],
["1131","ཐམས་ཅད་བདུད་རྩི་ལྔའི་རང་བཞིན། དངོས་གྲུབ་ཆེན་པོ་ཉེ་བའི་སྙིང་པོ་མཆོག བམ་པོ་ཆེན་པོ་བརྒྱད་པའི་དང་པོ།"],
["1132","ཚངས་པ་ལ་སོགས་པ་དྲང་སྲོང་དང་། ལྷ་དང་། ཀླུ་དང་། མིའི་བྱང་ཆུབ་སེམས་དཔའ་རྣམས་ལ་ཕྱག་འཚལ་ལོ། "],
["1133","བཅོམ་ལྡན་འདས་གཉིས་མེད་ཀྱི་རྒྱལ་པོ་ཆེན་པོ་ལ་ཕྱག་འཚལ་ལོ། དེ་ནས་སྤྱོད་པ་བསྟན་ཏེ། ལུང་ཨ་ནུ་ཡོ་ག་རྫོགས་པའི་རྣལ་འབྱོར་དུ་བསྟན་ཏེ།"],
["1134","འབྲས་བུ་ཆེན་པོ་ལྔ་བསྒྲལ་བའོ།། ཨ་ནུ་ཡོ་གའི་སྤྱོད་པ་བླ་ན་མེད་པ་བསྟན་པ།"],
["1135","རིགས་ལྔ་བདེ་བར་གཤེགས་པ་ལ་ཕྱག་འཚལ་ལོ། །མ་ཧཱ་ཡོ་གའི་དོན་དུ་སྒྲུབ་པའི་ཐབས་འདི་བསྟན་ཏོ། །"],
["1136","བདུད་རྩི་འཁྱིལ་པ་ལ་ཕྱག་འཚལ་ལོ། བདུད་རྩི་སྦྱོར་བའི་ཐབས་བསྟན་པ།"],
["1137","བདུད་རྩི་བུམ་པའི་ལུང་། བསྒྲུབ་པའི་ཡུལ་དང་གནས་བསྟན་པ།"],
["1138","བཅོམ་ལྡན་འདས་འཇམ་དཔལ་རྣོན་པོ་ལ་ཕྱག་འཚལ་ལོ། "],
["1139","མཁའ་འགྲོ་མ་མེ་ལྕེ་འབར་བའི་རྒྱུད།"],
["1140","དྲག་སྔགས་འདུས་པ་རྡོ་རྗེ་རྩ་བའི་རྒྱུད་ཞེས་བྱ་བཿ"],
["1141","འཇིག་རྟེན་མཆོད་བསྟོད་སྒྲུབ་པ་རྩ་བའི་རྒྱུད་ཞེས་བྱ་བ།"],
["1142","རྒྱུད་གཟུངས་འདུས།"],
["858","སྤྱན་འདྲེན་གྱི་རྒྱུད་གསུམ་པ། "],
["163,859","འཕགས་པ་དཀོན་མཆོག་ཏ་ལ་ལའི་གཟུངས་ཤེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["860","འཕགས་པ་ཡེ་ཤེས་ཏ་ལ་ལ་ཞེས་བྱ་བའི་གཟུངས་འགྲོ་བ་ཐམས་ཅད་ཡོངས་སུ་སྦྱོང་བ།"],
["861","འཕགས་པ་ཚེ་དང་ཡེ་ཤེས་དཔག་ཏུ་མེད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["862","འཕགས་པ་ཚེ་དང་ཡེ་ཤེས་དཔག་ཏུ་མེད་པའི་སྙིང་པོ་ཞེས་བྱ་བའི་གཟུངས།"],
["863","འཕགས་པ་ཡོན་ཏན་བསྔགས་པ་དཔག་ཏུ་མེད་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["864","འཕགས་པ་སངས་རྒྱས་བདུན་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["865","འཕགས་པ་སངས་རྒྱས་བཅུ་གཉིས་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["866","འཕགས་པ་སངས་རྒྱས་ཀྱི་སྙིང་པོ་ཞེས་བྱ་བའི་གཟུངས་ཀྱི་ཆོས་ཀྱི་རྣམ་གྲངས།"],
["867","འཕགས་པ་སངས་རྒྱས་ཀྱི་སྙིང་པོ་ཞེས་བྱ་བའི་གཟུངས།"],
["868","འཕགས་པ་སངས་རྒྱས་ཐམས་ཅད་ཀྱི་ཡན་ལག་དང་ལྡན་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["869","འཕགས་པ་ཙན་དན་གྱི་ཡན་ལག་ཅེས་བྱ་བའི་གཟུངས།"],
["870","འཕགས་པ་རིག་སྔགས་ཀྱི་རྒྱལ་པོ་སྒྲོན་མ་མཆོག་གི་གཟུངས།"],
["871","འཕགས་པ་དབང་བསྐུར་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["872","འཕགས་པ་ཤཱཀྱ་ཐུབ་པའི་སྙིང་པོའི་གཟུངས།"],
["873","འཕགས་པ་རྣམ་པར་སྣང་མཛད་ཀྱི་སྙིང་པོ་ཞེས་བྱ་བའི་གཟུངས།"],
["874","དེ་བཞིན་གཤེགས་པ་སྨན་གྱི་བླའི་སྙིང་པོའི་གཟུངས།"],
["875","འཕགས་པ་རྒྱལ་བའི་བླ་མའི་གཟུངས།"],
["876","བཅོམ་ལྡན་འདས་སྣང་བ་མཐའ་ཡས་ཀྱི་གཟུངས་སྔགས།"],
["877","སངས་རྒྱས་རྣམ་པར་སྣང་མཛད་ཀྱི་རྒྱལ་པོའི་གཟུངས།"],
["878","འཕགས་པ་པད་མའི་སྤྱན་ཞེས་བྱ་བའི་གཟུངས།"],
["879","སྣང་བ་མཐའ་ཡས་རྗེས་སུ་དྲན་པ།"],
["880","ཟླ་བའི་འོད་ཀྱི་མཚན་རྗེས་སུ་དྲན་པ།"],
["881","དེ་བཞིན་གཤེགས་པ་སྤྱིའི་སྙིང་པོ་རྗེས་སུ་དྲན་པ།"],
["882","སངས་རྒྱས་རིན་ཆེན་གཙུག་ཏོར་གྱི་མཚན་རྗེས་སུ་དྲན་པ།"],
["883","འཕགས་པ་དྲི་མ་མེད་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["884","འཕགས་པ་ཁྱད་པར་ཅན་ཞེས་བྱ་བའི་གཟུངས།"],
["885","སངས་རྒྱས་བཅོམ་ལྡན་འདས་ཀྱི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་གཟུངས་སྔགས་དང་བཅས་པ།"],
["886","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་གི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་གཟུངས་སྔགས་དང་བཅས་པ།"],
["887","འཕགས་པ་བྱམས་པའི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་གཟུངས་སྔགས་དང་བཅས་པ།"],
["888","འཕགས་པ་ནམ་མཁའི་སྙིང་པོའི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་གཟུངས་སྔགས་དང་བཅས་པ།"],
["889","འཕགས་པ་ཀུན་དུ་བཟང་པོའི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་གཟུངས་སྔགས་དང་བཅས་པ།"],
["890","འཕགས་པ་ལག་ན་རྡོ་རྗེའི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་གཟུངས་སྔགས་དང་བཅས་པ།"],
["891","འཕགས་པ་འཇམ་དཔལ་གཞོན་ནུར་གྱུར་པའི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་གཟུངས་སྔགས་དང་བཅས་པ།"],
["892","འཕགས་པ་སྒྲིབ་པ་ཐམས་ཅད་རྣམ་པར་སེལ་བའི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་གཟུངས་སྔགས་དང་བཅས་པ།"],
["893","འཕགས་པ་སའི་སྙིང་པོའི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་གཟུངས་སྔགས་དང་བཅས་པ།"],
["894","འཕགས་པ་དཀྱིལ་འཁོར་བརྒྱད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["895","འཕགས་པ་དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་བྱིན་གྱིས་བརླབས་ཀྱི་སྙིང་པོ་གསང་བའི་རིང་བསྲེལ་གྱི་ཟ་མ་ཏོག་ཅེས་བྱ་བའི་གཟུངས་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["896","ཤེས་པས་ཐམས་ཅད་མཐར་ཕྱིན་པར་གྲུབ་པའི་མཆོད་རྟེན་ཞེས་བྱ་བའི་གཟུངས།"],
["897","འཕགས་པ་ནོར་བུ་ཆེན་པོ་རྒྱས་པའི་གཞལ་མེད་ཁང་ཤིན་ཏུ་རབ་ཏུ་གནས་པ་གསང་བ་དམ་པའི་གསང་བའི་ཆོ་ག་ཞིབ་མོའི་རྒྱལ་པོ་ཞེས་བྱ་བའི་གཟུངས།"],
["898","འཕགས་པ་མེ་ཏོག་བརྩེགས་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["899","འཕགས་པ་སའི་དབང་པོ་ཆེན་པོ་ཞེས་བྱ་བའི་གཟུངས།"],
["900","འཕགས་པ་གཟུངས་ཆེན་པོ།"],
["901","བདེ་ལྡན་གྱི་སྙིང་པོ།"],
["902","འཕགས་པ་བྱམས་པས་དམ་བཅས་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["903","འཕགས་པ་སྒྲིབ་པ་རྣམ་པར་སེལ་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["904","འཕགས་པ་འཇམ་དཔལ་གྱི་ཞལ་ནས་གསུངས་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["905","འཕགས་པ་འཇམ་དཔལ་གྱིས་དམོད་བཙུགས་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["906","འཕགས་པ་འཇམ་དཔལ་གྱི་མཚན།"],
["907","རྗེ་བཙུན་འཕགས་པ་འཇམ་དཔལ་གྱི་ཤེས་རབ་དང་བློ་འཕེལ་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["908","འཕགས་པ་འཇམ་དཔལ་གྱི་སྔགས་ཡི་གེ་འབྲུ་གཅིག་པའི་ཆོ་ག"],
["909","འཕགས་པ་བྱང་ཆུབ་སེམས་དཔའ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་ཕྱག་སྟོང་སྤྱན་སྟོང་དང་ལྡན་པ་ཐོགས་པ་མི་མངའ་བའི་ཐུགས་རྗེ་ཆེན་པོའི་སེམས་རྒྱ་ཆེར་ཡོངས་སུ་རྫོགས་པ་ཞེས་བྱ་བའི་གཟུངས། བམ་པོ་གསུམ།"],
["910","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་གི་གསང་བའི་མཛོད་ཐོགས་པ་མེད་པའི་ཡིད་བཞིན་གྱི་འཁོར་ལོའི་སྙིང་པོ་ཞེས་བྱ་བའི་གཟུངས།"],
["911","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་ཞལ་བཅུ་གཅིག་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["912","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་གི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ།"],
["913","འཕགས་པ་དོན་ཡོད་ཞགས་པའི་སྙིང་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["914","ས་བཅུ་པའི་གཟུངས།"],
["915","འཕགས་པ་དོན་ཡོད་ཞགས་པའི་ཕ་རོལ་ཏུ་ཕྱིན་པ་དྲུག་ཡོངས་སུ་རྫོགས་པར་བྱེད་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["916","འཕགས་པ་ཀུན་དུ་བཟང་པོ་ཞེས་བྱ་བའི་གཟུངས།"],
["917","འཕགས་པ་ནཱི་ལ་ཀཎ་ཋ་ཞེས་བྱ་བའི་གཟུངས།"],
["918","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་ཧ་ཡ་བའི་གཟུངས།"],
["919","འཕགས་པ་མེ་ཁ་ལ་ཞེས་བྱ་བའི་གཟུངས།"],
["920","སྙིང་རྗེས་མི་བཤོལ་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["921","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་གི་ཡུམ་ཞེས་བྱ་བའི་གཟུངས།"],
["922","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་གི་གཟུངས་ཞེས་བྱ་བ།"],
["923","འཕགས་པ་སྤྱན་རས་གཟིགས་ཀྱི་སྙིང་པོ།"],
["924","སེང་གེ་སྒྲས་དམ་བཅས་པའི་གཟུངས།"],
["925","སྙིང་རྗེའི་མཆོག་ཅེས་བྱ་བའི་གཟུངས།"],
["926","འཕགས་པ་སྒོ་མཐའ་ཡས་པས་སྒྲུབ་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["927","འཕགས་པ་སྒོ་བཟང་པོ་ཞེས་བྱ་བའི་གཟུངས།"],
["928","འཕགས་པ་སྒོ་དྲུག་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["929","འཕགས་པ་ཡི་གེ་དྲུག་པའི་རིག་སྔགས།"],
["930","ཚིགས་སུ་བཅད་པ་གཉིས་པའི་གཟུངས།"],
["931","འཕགས་པ་ལུས་ཀྱི་དབྱིབས་མཛེས་ཞེས་བྱ་བའི་གཟུངས།"],
["932","བྱང་ཆུབ་ཀྱི་སྙིང་པོའི་རྒྱན་འབུམ་གྱི་གཟུངས།"],
["933","མཆོད་རྟེན་གཅིག་བཏབ་ན་བྱེ་བ་བཏབ་པར་འགྱུར་བའི་གཟུངས།"],
["934","འཕགས་པ་གཙུག་གི་ནོར་བུ་ཞེས་བྱ་བའི་གཟུངས།"],
["935","འཕགས་པ་རྒྱལ་མཚན་གྱི་རྩེ་མོའི་དཔུང་རྒྱན་ཅེས་བྱ་བའི་གཟུངས།"],
["936","འཕགས་པ་གསེར་ཅན་ཞེས་བྱ་བའི་གཟུངས།"],
["937","འཕགས་པ་ཐམས་ཅད་ལ་མི་འཇིགས་པ་རབ་ཏུ་སྦྱིན་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["938","འཕགས་པ་བར་དུ་གཅོད་པ་ཐམས་ཅད་རྣམ་པར་སྦྱོང་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["939","འཕགས་པ་འགྲོ་ལྡིང་བའི་རིག་སྔགས་ཀྱི་རྒྱལ་པོ།"],
["940","འཕགས་པ་གཞན་གྱིས་མི་ཐུབ་པ་མི་འཇིགས་པ་སྦྱིན་པ་ཞེས་བྱ་བ།"],
["941","འཕགས་པ་གཞན་གྱིས་མི་ཐུབ་པའི་རིན་པོ་ཆེའི་ཕྲེང་བ་ཞེས་བྱ་བ།"],
["942","སྟོང་འགྱུར་ཞེས་བྱ་བའི་གཟུངས།"],
["943","འཕགས་པ་འཇིགས་པ་ཆེན་པོ་བརྒྱད་ལས་སྒྲོལ་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["944","ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པ་སྟོང་ཕྲག་བརྒྱ་པའི་གཟུངས།"],
["945","འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པ་སྟོང་ཕྲག་ཉི་ཤུ་ལྔ་པའི་གཟུངས།"],
["946","འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པ་བརྒྱད་སྟོང་པའི་གཟུངས།"],
["947","ཕ་རོལ་ཏུ་ཕྱིན་པ་དྲུག་གི་སྙིང་པོའི་གཟུངས།"],
["948","ཕ་རོལ་ཏུ་ཕྱིན་པ་དྲུག་གཟུང་བར་འགྱུར་བའི་གཟུངས།"],
["949","ཕ་རོལ་ཏུ་ཕྱིན་པ་བཅུ་ཐོབ་པར་འགྱུར་བའི་གཟུངས།"],
["950","ཚད་མེད་པ་བཞི་ཐོབ་པར་འགྱུར་བའི་གཟུངས།"],
["951","ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པ་སྟོང་ཕྲག་བརྒྱ་པ་གཟུང་བར་འགྱུར་བའི་གཟུངས།"],
["952","འཕགས་པ་ཕལ་པོ་ཆེ་གཟུང་བར་འགྱུར་བའི་གཟུངས།"],
["953","འཕགས་པ་སྡོང་པོ་བཀོད་པའི་སྙིང་པོ།"],
["954","འཕགས་པ་ཏིང་ངེ་འཛིན་གྱི་རྒྱལ་པོའི་མདོ་གཟུང་བར་འགྱུར་བའི་གཟུངས།"],
["955","འཕགས་པ་རྨ་བྱ་ཆེན་མོའི་སྙིང་པོ།"],
["956","འཕགས་མ་སོ་སོར་འབྲང་མ་ཆེན་མོ་གཟུང་བར་འགྱུར་བའི་གཟུངས།"],
["957","འཕགས་པ་ལང་ཀར་གཤེགས་པའི་མདོ་ཐམས་ཅད་བཀླགས་པར་འགྱུར་བའི་གཟུངས།"],
["958","འཕགས་པ་རྡོ་རྗེ་རི་རབ་ཆེན་པོའི་རྩེ་མོའི་ཁང་པ་བརྩེགས་པའི་གཟུངས། "],
["959","འཕགས་པ་སྟོབས་པོ་ཆེ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། "],
["960","འཕགས་པ་ལག་ན་རྡོ་རྗེ་གོས་སྔོན་པོ་ཅན་གྱི་ཆོ་ག་ཞེས་བྱ་བའི་གཟུངས།"],
["961"," རྡོ་རྗེས་རྣམ་པར་འཇོམས་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["962","འཕགས་པ་ལག་ན་རྡོ་རྗེའི་མཚན་བརྒྱད་པོ་གསང་སྔགས་དང་བཅས་པ།"],
["963","འཕགས་པ་ལག་ན་རྡོ་རྗེ་བཅུའི་སྙིང་པོ།"],
["964","རྨི་ལམ་མཐོང་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["965","ཕྱག་ན་རྡོ་རྗེ་གནོད་སྦྱིན་གྱི་བདག་པོའི་གཟུངས།  "],
["966","འཕགས་པ་རྡོ་རྗེ་མི་ཕམ་པ་མེ་ལྟར་རབ་ཏུ་རྨོངས་བྱེད་ཅེས་བྱ་བའི་གཟུངས།"],
["967","རྡོ་རྗེ་ཕྲ་མོ་ཐོགས་པ་མྱེད་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["968","འཕགས་པ་རྡོ་རྗེ་འཇིགས་བྱེད་ཀྱི་གཟུངས་ཞེས་བྱ་བ།"],
["969","འཕགས་པ་བདུད་རྩི་ཐབ་སྦྱོར་གྱི་སྙིང་པོ་བཞི་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["970","འཕགས་པ་བེ་ཅོན་ཆེན་པོ་ཞེས་བྱ་བའི་གཟུངས།"],
["971","འཕགས་པ་བགེགས་སེལ་བའི་གཟུངས།"],
["972","འཕགས་པ་ཕྱིར་ཟློག་པ་སྟོབས་ཅན་ཞེས་བྱ་བའོ། །"],
["973","འཕགས་པ་མི་རྒོད་རྣམ་པར་འཇོམས་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["974","གཙུག་ཏོར་འབར་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["975","འཕགས་པ་ཁྲོ་བོ་མི་གཡོ་བའི་གཟུངས་ཞེས་བྱ་བ།"],
["976","རྡོ་རྗེ་མཆུ་ཞེས་བྱ་བ་ཀླུའི་དམ་ཚིག་གོ"],
["977","རྡོ་རྗེ་གནམ་ལྕགས་མཆུ་ཞེས་བྱ་བའི་གཟུངས།"],
["978","འཕགས་པ་ལྕགས་མཆུ་ནག་པོ།"],
["979","འཕགས་པ་མདངས་ཕྱིར་འཕྲོག་པ་ཞེས་བྱ་བའི་མདོ།"],
["980","ཕྱིར་ཟློག་པ་འཕགས་པ་རྣམ་པར་རྒྱལ་བ་ཅན་ཞེས་བྱའོ།"],
["981","འཕགས་པ་རིག་སྔགས་ཀྱི་རྒྱལ་པོ་དབུགས་ཆེན་པོ་ཞེས་བྱ་བ།"],
["982","འཕགས་པ་ནོར་བུ་བཟང་པོའི་གཟུངས་ཤེས་བྱ་བ།"],
["983","འཕགས་པ་གནོད་འཛིན་ཆུ་དབང་སྙིང་རྗེ་ཅན་གྱི་གཟུངས་བདེ་བྱེད་ཅེས་བྱ་བ།"],
["984","འཕགས་པ་གནོད་འཛིན་གྱི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་ཞེས་བྱ་བ།"],
["985","འཕགས་པ་གནོད་འཛིན་དཔལ་ཞེས་བྱ་བའི་གཟུངས།"],
["986","འཕགས་པ་མཚན་མོ་བཟང་པོ་ཞེས་བྱ་བའི་མདོ།"],
["987","འཕགས་པ་ཆོས་ཀྱི་རྒྱ་མཚོ་ཞེས་བྱ་བའི་གཟུངས།"],
["988","འཕགས་པ་བུ་མང་པོ་རྟོན་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["989","འཕགས་པ་གདོན་མི་ཟ་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["990","གཞན་གྱིས་མི་ཐུབ་པའི་རིག་པ་ཆེན་མོ།"],
["991","འཕགས་པ་རྟེན་ཅིང་འབྲེལ་པར་འབྱུང་བའི་སྙིང་པོའི་ཆོ་གའི་གཟུངས།"],
["992","འཕགས་པ་རྟེན་ཅིང་འབྲེལ་པར་འབྱུང་བ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["993","རྟེན་ཅིང་འབྲེལ་པར་འབྱུང་བའི་སྙིང་པོ།"],
["994","འཕགས་པ་འོད་ཟེར་དྲི་མ་མེད་པ་རྣམ་པར་དག་པའི་འོད་ཅེས་བྱ་བའི་གཟུངས།"],
["995","ཀུན་ནས་སྒོར་འཇུག་པའི་འོད་ཟེར་གཙུག་ཏོར་དྲི་མ་མེད་པར་སྣང་བ་དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་སྙིང་པོ་དང་དམ་ཚིག་ལ་རྣམ་པར་ལྟ་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["996","འཕགས་པ་ངན་འགྲོ་ཐམས་ཅད་ཡོངས་སུ་སྦྱོང་བ་གཙུག་ཏོར་རྣམ་པར་རྒྱལ་བ་ཞེས་བྱ་བའི་གཟུངས། "],
["997","འཕགས་པ་དེ་བཞིན་གཤེགས་པ་ཐམས་ཅད་ཀྱི་གཙུག་ཏོར་ནས་བྱུང་བའི་གདུགས་དཀར་པོ་ཅན་ཞེས་བྱ་བ་གཞན་གྱིས་མི་ཐུབ་མ་ཕྱིར་ཟློག་པའི་རིག་སྔགས་ཀྱི་རྒྱལ་མོ་ཆེན་མོའོ།"],
["620/998","འཕགས་མ་དེ་བཞིན་གཤེགས་པའི་གཙུག་ཏོར་ནས་བྱུང་བའི་གདུགས་དཀར་པོ་ཅན་གཞན་གྱིས་མི་ཐུབ་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["999","དཔལ་ལྷ་མོ་གཙུག་ཏོར་རོལ་པའི་ཏནྟྲ།"],
["1000","འཕགས་མ་འོད་ཟེར་ཅན་ཞེས་བྱ་བའི་གཟུངས།"],
["1001","འཕགས་པ་ལྷ་མོ་སྐུལ་བྱེད་མ་ཞེས་བྱ་བའི་གཟུངས།"],
["1002","འཕགས་པ་དུག་སེལ་ཅེས་བྱ་བའི་རིག་སྔགས།"],
["1003","འཕགས་པ་དབྱིག་དང་ལྡན་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["1004","འཕགས་པ་གྲགས་ལྡན་མའི་གཟུངས། "],
["1005","བཀླགས་པས་འགྲུབ་པ་བཅོམ་ལྡན་འདས་མ་འཕགས་མ་སོར་མོ་ཅན་ཞེས་བྱ་བ་རིག་པའི་རྒྱལ་མོ།"],
["1006","འཕགས་པ་པརྞྞ་ཤ་བ་རིའི་མདོ།"],
["1007","འཕགས་མ་རི་ཁྲོད་ལོ་མ་གྱོན་པའི་གཟུངས།"],
["1008","འཕགས་མ་ཆོས་ཐམས་ཅད་ཀྱི་ཡུམ་ཞེས་བྱ་བའི་གཟུངས།"],
["1009","འཕགས་མ་གཟའ་རྣམས་ཀྱི་ཡུམ་ཞེས་བྱ་བའི་གཟུངས།"],
["1010","གཟའ་རྣམས་ཀྱི་ཡུམ་ཞེས་བྱ་བའི་གཟུངས།"],
["1011","འཕགས་པ་ལྷ་མོ་བརྒྱད་ཀྱི་གཟུངས།"],
["1012","རྗེ་བཙུན་འཕགས་མ་སྒྲོལ་མའི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ་ཞེས་བྱ་བ།"],
["1013","འཕགས་མ་སྒྲོལ་མའི་གཟུངས།"],
["1014","འཕགས་མ་སྒྲོལ་མ་རང་གིས་དམ་བཅས་པ་ཞེས་བྱ་བའི་གཟུངས། "],
["1015","འཕགས་མ་རིག་སྔགས་ཀྱི་རྒྱལ་མོ་ཆེན་མོ་རྒྱལ་བ་ཅན་ཞེས་བྱ་བ།"],
["1016","འཕགས་པ་རྒྱལ་བ་ཅན་ཞེས་བྱ་བའི་གཟུངས།"],
["1017","འཕགས་པ་དཔལ་ཆེན་མོའི་མདོ།"],
["1018","དཔལ་གྱི་ལྷ་མོའི་མཚན་བཅུ་གཉིས་པ།"],
["1019","འཕགས་པ་ནོར་གྱི་རྒྱུན་ཅེས་བྱ་བའི་གཟུངས། "],
["1020","འཕགས་པ་མིག་རྣམ་པར་སྦྱོང་བ་ཞེས་བྱ་བའི་རིག་སྔགས།"],
["1021","འཕགས་པ་ལས་ཀྱི་སྒྲིབ་པ་ཐམས་ཅད་རྣམ་པར་སྦྱོང་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["1022","འཕགས་པ་བར་དུ་གཅོད་པ་ཐམས་ཅད་སེལ་བའི་གཟུངས་སྔགས།"],
["1023(a)","ཡོན་ཡོངས་སུ་སྦྱོང་བ་ཞེས་བྱ་བ།"],
["1023(b)","ཡོན་ཡོངས་སུ་སྦྱོང་བའི་གཟུངས།"],
["1024","ངན་སོང་ཐམས་ཅད་ཡོངས་སུ་སྦྱོང་བ་ཞེས་བྱ་བའི་གཟུངས།"],
["1025","འཕགས་པ་ནད་ཐམས་ཅད་རབ་ཏུ་ཞི་བར་བྱེད་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["1026","འཕགས་པ་ནད་རབ་ཏུ་ཞི་བར་བྱེད་པའི་གཟུངས།"],
["1027","འཕགས་པ་རིམས་ནད་རབ་ཏུ་ཞི་བར་བྱེད་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["1028","རིམས་ནད་ཞི་བའི་གཟུངས།"],
["1029","འཕགས་པ་མིག་ནད་རབ་ཏུ་ཞི་བར་བྱེད་པའི་མདོ།"],
["1030","འབྲུམ་བུའི་ནད་ཞི་བར་བྱེད་པའི་གཟུངས།"],
["1031","འཕགས་པ་གཞང་འབྲུམ་རབ་ཏུ་ཞི་བར་བྱེད་པའི་མདོ།"],
["1032","མ་ཞུ་བའི་ནད་འབྱང་བའི་གཟུངས།"],
["1033","འཕགས་པ་སྡང་བ་ཐམས་ཅད་རབ་ཏུ་ཞི་བར་བྱེད་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["1034","སྡིག་པ་ཐམས་ཅད་རབ་ཏུ་ཞི་བར་བྱེད་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["1035","སྡུག་བསྔལ་ཐམས་ཅད་རབ་ཏུ་ཞི་བར་བྱེད་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["1036","ཁྲོ་བ་ཞི་བར་བྱེད་པའི་གཟུངས།"],
["1037","འཕགས་པ་ཁྲོས་པ་ཞི་བར་བྱེད་པའི་གཟུངས།"],
["1038","ཚིག་བཙན་པའི་གཟུངས།"],
["1039","བདག་སྲུང་བའི་གཟུངས།"],
["1040","དོན་ཐམས་ཅད་འགྲུབ་པའི་གཟུངས།"],
["1041","ལས་གྲུབ་པའི་གཟུངས།"],
["1042","གོས་བརྒྱ་ཐོབ་པའི་གཟུངས།"],
["1043","མི་དགའ་པར་བྱེད་པའི་གཟུངས།"],
["1044","འཕགས་པ་ཡིད་དུ་འོང་བ་ཞེས་བྱ་བ"],
["1045","མགྲིན་པ་སྙན་པའི་གཟུངས།"],
["1046","བཅིངས་པ་ལས་གྲོལ་བའི་གཟུངས།"],
["1047","མཆོག་ཐོབ་པའི་རིག་སྔགས།"],
["1048","ཤེས་རབ་སྐྱེད་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["1049","ཤེས་རབ་སྐྱེད་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["1050","ཤེས་རབ་སྐྱེད་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["1051","ཐོས་པ་འཛིན་པའི་གཟུངས།"],
["1052","ཐོས་པ་འཛིན་པའི་གཟུངས།"],
["1053","ཤོ་ལོ་ཀ་བརྒྱ་ལོབས་པ།"],
["1054","ཤོ་ལོ་ཀ་བརྒྱ་ལོབས་པ།"],
["1055","ཤོ་ལོ་ཀ་སྟོང་ལོབས་པའི་གཟུངས།"],
["1056","ཤོ་ལོ་ཀ་སྟོང་ལོབས་པའི་གཟུངས།"],
["1057","ཤོ་ལོ་ཀ་སྟོང་ལོབས་པའི་གཟུངས།"],
["1058","ཤོ་ལོ་ཀ་སུམ་སྟོང་ལོབས་པའི་གཟུངས།"],
["1059","མི་བརྗེད་པའི་གཟུངས།"],
["1060","ཕྱག་བྱ་བའི་གཟུངས།"],
["1061","ཕགས་པ་རིམས་དང་སྲོག་ཆགས་ཀྱིས་མི་ཚུགས་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["1062","དུག་ཞི་བར་བྱེད་པ་ཞེས་བྱ་བ།"],
["1063","མདངས་ཕྱིར་མི་འཕྲོག་པ་ཞེས་བྱ་བ།"],
["1064","འཕགས་པ་བདུད་ཐམས་ཅད་སྐྲག་པར་བྱེད་པ་ཞེས་བྱ་བ།"],
["1065","རྨ་འབྱོར་བར་བྱེད་པ་ཞེས་བྱ་བའི་གཟུངས་སྔགས།"],
["1066","མེའི་ཟུག་རྔུ་རབ་ཏུ་ཞི་བར་བྱེད་པའི་གཟུངས།"],
["1067","མཁྲིས་པའི་ནད་སེལ་བའི་སྔགས།"],
["1068","བད་ཀན་གྱི་ནད་སེལ་བའི་གཟུངས་སྔགས།"],
["1069","ཀྵ་ཡའི་ནད་སེལ་བའི་གཟུངས།"],
["1070","སྟོང་ཆེན་མོ་ནས་ཕྱུང་བ་སྨན་ལ་སྔགས་ཀྱིས་གདབ་པ།"],
["1071","སྨན་གཏོང་བའི་ཚེ་སྨན་ལ་སྔགས་ཀྱིས་གདབ་པ།"],
["1072","སྐྲན་ཞི་བའི་གཟུངས།"],
["1073","མདོ་ཆེན་པོ་ཀུན་ཏུ་རྒྱུ་བ་དང་ཀུན་ཏུ་རྒྱུ་བ་མ་ཡིན་པ་དང་མཐུན་པའི་མདོ་ཞེས་བྱ་བ།"],
["1074","མདོ་ཆེན་པོ་འདུས་པ་ཆེན་པོའི་མདོ་ཞེས་བྱ་བ།"],
["1075","འཕགས་པ་སྤྲིན་ཆེན་པོ།"],
["1076","འཕགས་པ་སྤྲིན་ཆེན་པོ་རླུང་གི་དཀྱིལ་འཁོར་གྱི་ལེའུ་ཀླུ་ཐམས་ཅད་ཀྱི་སྙིང་པོ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།"],
["1077","འཕགས་པ་ཀླུའི་རྒྱལ་པོ་གཟི་ཅན་གྱིས་ཞུས་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["1078","འཕགས་པ་སྡོང་པོ་རྒྱན་གྱི་མཆོག་ཅེས་བྱ་བའི་གཟུངས།"],
["1079","སངས་རྒྱས་ཀྱི་ཆོས་གསལ་ཞིང་ཡངས་པ་སྣང་བརྒྱད་ཅེས་བྱ་བའི་མདོ།"],
["1080(a)","མཆོད་པའི་སྤྲིན་ཞེས་བྱ་བའི་གཟུངས།"],
["1080(b)","ཕྱག་བྱ་བའི་གཟུངས།"],
["1080(c)","སྟོད་པའི་གཟུངས།"],
["1080(d)","མཆོད་པ་བྱིན་གྱི་བརླབ་པའི་གཟུངས།"],
["1080(e)","མཆོད་པའི་སཔྲིན་བྱུང་བའི་གཟུངས།"],
["1080(f)","ཕྱག་བྱ་བའི་གཟུངས།"],
["1081","རིན་པོ་ཆེ་བདར་བའི་གཟུངས།"],
["1082","བསྐོར་བའི་གཟུངས།"],
["1083","འཕགས་པ་དཀོན་མཆོག་གི་རྟེན་ལ་བསྐོར་བ་བྱ་བའི་གཟུངས་ཤེས་བྱ་བ།"],
["1084","ཡེ་ཤེས་སྐར་མདའི་སྙིང་པོ།"],
["1085","སུ་རཱུ་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["1086","ཡི་དགས་མོ་ཁ་འབར་མ་དབུགས་དབྱུང་བའི་གཏོར་མའི་ཆོ་ག"],
["1087","ཡི་དགས་ཁ་ནས་མེ་འབར་བ་ལ་སྐྱབས་མཛད་པའི་གཟུངས།"],
["1088","འཇུར་འགེགས་ཞེས་བྱ་བའི་གཟུངས།"],
["1089","ལུས་ཀྱི་ཟག་པ་སྦྱིན་པར་བཏང་བའི་གཟུངས།"],
["1090","འཕགས་པ་རོ་ལངས་བདུན་པ་ཞེས་བྱ་བའི་གཟུངས།"],
["1091","འཕགས་པ་ཚོགས་ཀྱི་བདག་པོའི་སྙིང་པོའོ།"],
["1092","དཔལ་མགོན་པོ་ནག་པོ་ཞེས་བྱ་བའི་གཟུངས།"],
["1093","འཕགས་པ་ནག་པོ་ཆེན་པོའི་གཟུངས་རིམས་ནད་ཐམས་ཅད་ལས་ཐར་བར་བྱེད་པ།"],
["1094","ལྷ་མོ་ནག་མོ་ཆེན་མོའི་གཟུངས།"],
["1095","དཔལ་ལྷ་མོ་ནག་མོའི་མཚན་བརྒྱ་རྩ་བརྒྱད་པ།"],
["1096","ལྷའི་དབང་པོ་བརྒྱ་བྱིན་གྱིས་བསྟོད་པ། "],
["1097","ནད་ཀྱི་བདག་མོ་ལ་བསྟོད་པ།"],
["1098","ལྷ་མོ་ཆེན་མོ་རེ་མ་ཏིའི་གཟུངས།"],
["1099","དཔལ་ལྷ་མོ་སྒྲ་དབྱངས་ལ་བསྟོད་པ།"],
["1100","འཕགས་པ་ཡངས་པའི་གྲོང་ཁྱེར་དུ་འཇུག་པའི་མདོ་ཆེན་པོ།"],
["1101","འཕགས་པ་སྤྱན་རས་གཟིགས་དབང་ཕྱུག་ཡིད་བཞིན་གྱི་ནོར་བུའི་རྟོག་པ་ལས་སྨོན་ལམ་འབྱུང་བ།"],
["1102","འཕགས་པ་བཟང་པོ་སྤྱོད་པའི་སྨོན་ལམ་གྱི་རྒྱལ་པོ།"],
["1103","འཕགས་པ་བྱམས་པའི་སྨོན་ལམ།"],
["1104","མཆོག་གི་སྤྱོད་པའི་སྨོན་ལམ།"],
["1105","སྟོང་ཆེན་མོ་རབ་ཏུ་འཇོམས་པ་ལས་གསུངས་པའི་སྨོན་ལམ།"],
["1106","རིག་སྔགས་ཀྱི་རྒྱལ་མོ་རྨ་བྱ་ཆེན་མོ་ལས་གསུངས་པའི་སྨོན་ལམ་དང་བདེན་ཚིག"],
["1107","ལྷས་ཞུས་པའི་བཀྲ་ཤིས་ཀྱི་ཚིགས་སུ་བཅད་པ།"],
["1108","བདེ་ལེགས་ཀྱི་ཚིགས་སུ་བཅད་པ།"],
["1109","བདེ་ལེགས་སུ་འགྱུར་བའི་ཚིགས་སུ་བཅད་པ།"],
["1110","བཀྲ་ཤིས་ཀྱི་ཚིགས་སུ་བཅད་པ།"],
["1111","སངས་རྒྱས་རབས་བདུན་གྱི་བཀྲ་ཤིས་ཚིགས་སུ་བཅད་པ།"],
["1112","དེ་བཞིན་གཤེགས་པ་ལྔའི་བཀྲ་ཤིས་ཚིགས་སུ་བཅད་པ།"],
["1113","རིགས་གསུམ་གྱི་བཀྲ་ཤིས།"],
["1114","འཕགས་པ་རྒྱ་ཆེར་རོལ་པའི་མདོའི་ཚོང་དཔོན་ག་གོན་དང་བཟང་པོའི་ལེའུ་ལས་འབྱུང་བ་ཤིས་པར་བརྗོད་པའི་ཚིགས་སུ་བཅད་པ།"],
["1115","དཀོན་མཆོག་གསུམ་གྱི་བཀྲ་ཤིས་ཀྱི་ཚིགས་སུ་བཅད་པ། "],
["1116","བསྡུས་པའི་རྒྱུད་ཀྱི་རྒྱལ་པོ་དུས་ཀྱི་འཁོར་ལོའི་འགྲེལ་བཤད། རྩ་བའི་རྒྱུད་ཀྱི་རྗེས་སུ་འཇུག་པ་སྟོང་ཕྲག་བཅུ་གཉིས་པ་དྲི་མ་མེད་པའི་འོད་ཅེས་བྱ་བ། "],
["1146","བདེ་བར་གཤེགས་པའི་བཀའ་གངས་ཅན་གྱི་བརྡས་འདྲེན་པ་སྔི་སྙེད་པའི་ཕྱི་མོ་པར་གྱི་"]];
module.exports=sutranames;
});
require.register("pedurmacat-dataset/taishonames.js", function(exports, require, module){
﻿//generated by https://github.com/ksanaforge/cbeta2014/blob/master/extract_sutra_no_name.js
//Sutra No can be used URL parameter, e.g http://tripitaka.cbeta.org/T01n0001
//module.exports
var taishonames=[["T01n0001","長阿含經"],
["T01n0002","七佛經"],
["T01n0003","毘婆尸佛經"],
["T01n0004","七佛父母姓字經"],
["T01n0005","佛般泥洹經"],
["T01n0006","般泥洹經"],
["T01n0007","大般涅槃經"],
["T01n0008","大堅固婆羅門緣起經"],
["T01n0009","人仙經"],
["T01n0010","白衣金幢二婆羅門緣起經"],
["T01n0011","尼拘陀梵志經"],
["T01n0012","大集法門經"],
["T01n0013","長阿含十報法經"],
["T01n0014","人本欲生經"],
["T01n0015","帝釋所問經"],
["T01n0016","尸迦羅越六方禮經"],
["T01n0017","善生子經"],
["T01n0018","信佛功德經"],
["T01n0019","大三摩惹經"],
["T01n0020","佛開解梵志阿颰經"],
["T01n0021","梵網六十二見經"],
["T01n0022","寂志果經"],
["T01n0023","大樓炭經"],
["T01n0024","起世經"],
["T01n0025","起世因本經"],
["T01n0026","中阿含經"],
["T01n0027","七知經"],
["T01n0028","園生樹經"],
["T01n0029","鹹水喻經"],
["T01n0030","薩缽多酥哩踰捺野經"],
["T01n0031","一切流攝守因經"],
["T01n0032","四諦經"],
["T01n0033","恒水經"],
["T01n0034","法海經"],
["T01n0035","海八德經"],
["T01n0036","本相猗致經"],
["T01n0037","緣本致經"],
["T01n0038","輪王七寶經"],
["T01n0039","頂生王故事經"],
["T01n0040","文陀竭王經"],
["T01n0041","頻婆娑羅王經"],
["T01n0042","鐵城泥犁經"],
["T01n0043","閻羅王五天使者經"],
["T01n0044","古來世時經"],
["T01n0045","大正句王經"],
["T01n0046","阿那律八念經"],
["T01n0047","離睡經"],
["T01n0048","是法非法經"],
["T01n0049","求欲經"],
["T01n0050","受歲經"],
["T01n0051","梵志計水淨經"],
["T01n0052","大生義經"],
["T01n0053","苦陰經"],
["T01n0054","釋摩男本四子經"],
["T01n0055","苦陰因事經"],
["T01n0056","樂想經"],
["T01n0057","漏分布經"],
["T01n0058","阿耨風經"],
["T01n0059","諸法本經"],
["T01n0060","瞿曇彌記果經"],
["T01n0061","受新歲經"],
["T01n0062","新歲經"],
["T01n0063","解夏經"],
["T01n0064","瞻婆比丘經"],
["T01n0065","伏婬經"],
["T01n0066","魔嬈亂經"],
["T01n0067","弊魔試目連經"],
["T01n0068","賴吒和羅經"],
["T01n0069","護國經"],
["T01n0070","數經"],
["T01n0071","梵志頞波羅延問種尊經"],
["T01n0072","三歸五戒慈心厭離功德經"],
["T01n0073","須達經"],
["T01n0074","長者施報經"],
["T01n0075","佛為黃竹園老婆羅門說學經"],
["T01n0076","梵摩渝經"],
["T01n0077","尊上經"],
["T01n0078","兜調經"],
["T01n0079","鸚鵡經"],
["T01n0080","佛為首迦長者說業報差別經"],
["T01n0081","分別善惡報應經"],
["T01n0082","意經"],
["T01n0083","應法經"],
["T01n0084","分別布施經"],
["T01n0085","息諍因緣經"],
["T01n0086","泥犁經"],
["T01n0087","齋經"],
["T01n0088","優陂夷墮舍迦經"],
["T01n0089","八關齋經"],
["T01n0090","鞞摩肅經"],
["T01n0091","婆羅門子命終愛念不離經"],
["T01n0092","十支居士八城人經"],
["T01n0093","邪見經"],
["T01n0094","箭喻經"],
["T01n0095","蟻喻經"],
["T01n0096","治意經"],
["T01n0097","廣義法門經"],
["T01n0098","普法義經"],
["T02n0099","雜阿含經"],
["T02n0100","別譯雜阿含經"],
["T02n0101","雜阿含經"],
["T02n0102","佛說五蘊皆空經"],
["T02n0103","佛說聖法印經"],
["T02n0104","佛說法印經"],
["T02n0105","五陰譬喻經"],
["T02n0106","佛說水沫所漂經"],
["T02n0107","佛說不自守意經"],
["T02n0108","佛說滿願子經"],
["T02n0109","佛說轉法輪經"],
["T02n0110","佛說三轉法輪經"],
["T02n0111","佛說相應相可經"],
["T02n0112","佛說八正道經"],
["T02n0113","佛說難提釋經"],
["T02n0114","佛說馬有三相經"],
["T02n0115","佛說馬有八態譬人經"],
["T02n0116","佛說戒德香經"],
["T02n0117","佛說戒香經"],
["T02n0118","佛說鴦掘摩經"],
["T02n0119","佛說鴦崛髻經"],
["T02n0120","央掘魔羅經"],
["T02n0121","佛說月喻經"],
["T02n0122","佛說波斯匿王太后崩塵土坌身經"],
["T02n0123","佛說放牛經"],
["T02n0124","緣起經"],
["T02n0125","增壹阿含經"],
["T02n0126","佛說阿羅漢具德經"],
["T02n0127","佛說四人出現世間經"],
["T02n0128a","須摩提女經"],
["T02n0128b","須摩提女經"],
["T02n0129","佛說三摩竭經"],
["T02n0130","佛說給孤長者女得度因緣經"],
["T02n0131","佛說婆羅門避死經"],
["T02n0132a","佛說食施獲五福報經"],
["T02n0132b","施食獲五福報經"],
["T02n0133","頻毘娑羅王詣佛供養經"],
["T02n0134","佛說長者子六過出家經"],
["T02n0135","佛說力士移山經"],
["T02n0136","佛說四未曾有法經"],
["T02n0137","舍利弗摩訶目連遊四衢經"],
["T02n0138","佛說十一想思念如來經"],
["T02n0139","佛說四泥犁經"],
["T02n0140","阿那邠邸化七子經"],
["T02n0141","佛說阿速達經"],
["T02n0142a","佛說玉耶女經"],
["T02n0142b","玉耶女經"],
["T02n0143","玉耶經"],
["T02n0144","佛說大愛道般泥洹經"],
["T02n0145","佛母般泥洹經"],
["T02n0146","舍衛國王夢見十事經"],
["T02n0147","佛說舍衛國王十夢經"],
["T02n0148","國王不梨先泥十夢經"],
["T02n0149","佛說阿難同學經"],
["T02n0151","佛說阿含正行經"],
["T03n0152","六度集經"],
["T03n0153","菩薩本緣經"],
["T03n0154","生經"],
["T03n0155","菩薩本行經"],
["T03n0156","大方便佛報恩經"],
["T03n0157","悲華經"],
["T03n0158","大乘悲分陀利經"],
["T03n0159","大乘本生心地觀經"],
["T03n0160","菩薩本生鬘論"],
["T03n0161","長壽王經"],
["T03n0162","金色王經"],
["T03n0163","妙色王因緣經"],
["T03n0164","師子素馱娑王斷肉經"],
["T03n0165","頂生王因緣經"],
["T03n0166","月光菩薩經"],
["T03n0167","太子慕魄經"],
["T03n0168","太子墓魄經"],
["T03n0169","月明菩薩經"],
["T03n0170","德光太子經"],
["T03n0171","太子須大拏經"],
["T03n0172","菩薩投身飴餓虎起塔因緣經"],
["T03n0173","福力太子因緣經"],
["T03n0174","菩薩睒子經"],
["T03n0175a","睒子經"],
["T03n0175b","佛說睒子經"],
["T03n0175c","佛說睒子經"],
["T03n0176","師子月佛本生經"],
["T03n0177","大意經"],
["T03n0178","前世三轉經"],
["T03n0179","銀色女經"],
["T03n0180","過去世佛分衛經"],
["T03n0181a","九色鹿經"],
["T03n0181b","佛說九色鹿經"],
["T03n0182a","鹿母經"],
["T03n0182b","佛說鹿母經"],
["T03n0183","一切智光明仙人慈心因緣不食肉經"],
["T03n0184","修行本起經"],
["T03n0185","太子瑞應本起經"],
["T03n0186","普曜經"],
["T03n0187","方廣大莊嚴經"],
["T03n0188","異出菩薩本起經"],
["T03n0189","過去現在因果經"],
["T03n0190","佛本行集經"],
["T03n0191","眾許摩訶帝經"],
["T04n0192","佛所行讚"],
["T04n0193","佛本行經"],
["T04n0194","僧伽羅剎所集經"],
["T04n0195","佛說十二遊經"],
["T04n0196","中本起經"],
["T04n0197","佛說興起行經"],
["T04n0198","佛說義足經"],
["T04n0199","佛五百弟子自說本起經"],
["T04n0200","撰集百緣經"],
["T04n0201","大莊嚴論經"],
["T04n0202","賢愚經"],
["T04n0203","雜寶藏經"],
["T04n0204","雜譬喻經"],
["T04n0205","雜譬喻經"],
["T04n0206","舊雜譬喻經"],
["T04n0207","雜譬喻經"],
["T04n0208","眾經撰雜譬喻"],
["T04n0209","百喻經"],
["T04n0210","法句經"],
["T04n0211","法句譬喻經"],
["T04n0212","出曜經"],
["T04n0213","法集要頌經"],
["T04n0214","猘狗經"],
["T04n0215","群牛譬經"],
["T04n0216","大魚事經"],
["T04n0217","譬喻經"],
["T04n0218","灌頂王喻經"],
["T04n0219","醫喻經"],
["T05n0220a","大般若波羅蜜多經"],
["T06n0220b","大般若波羅蜜多經"],
["T07n0220c","大般若波羅蜜多經"],
["T07n0220d","大般若波羅蜜多經"],
["T07n0220e","大般若波羅蜜多經"],
["T07n0220f","大般若波羅蜜多經"],
["T07n0220g","大般若波羅蜜多經"],
["T07n0220h","大般若波羅蜜多經"],
["T07n0220i","大般若波羅蜜多經"],
["T07n0220j","大般若波羅蜜多經"],
["T07n0220k","大般若波羅蜜多經"],
["T07n0220l","大般若波羅蜜多經"],
["T07n0220m","大般若波羅蜜多經"],
["T07n0220n","大般若波羅蜜多經"],
["T07n0220o","大般若波羅蜜多經"],
["T08n0221","放光般若經"],
["T08n0222","光讚經"],
["T08n0223","摩訶般若波羅蜜經"],
["T08n0224","道行般若經"],
["T08n0225","大明度經"],
["T08n0226","摩訶般若鈔經"],
["T08n0227","小品般若波羅蜜經"],
["T08n0228","佛說佛母出生三法藏般若波羅蜜多經"],
["T08n0229","佛說佛母寶德藏般若波羅蜜經"],
["T08n0230","聖八千頌般若波羅蜜多一百八名真實圓義陀羅尼經"],
["T08n0231","勝天王般若波羅蜜經"],
["T08n0232","文殊師利所說摩訶般若波羅蜜經"],
["T08n0233","文殊師利所說般若波羅蜜經"],
["T08n0234","佛說濡首菩薩無上清淨分衛經"],
["T08n0235","金剛般若波羅蜜經"],
["T08n0236a","金剛般若波羅蜜經"],
["T08n0236b","金剛般若波羅蜜經"],
["T08n0237","金剛般若波羅蜜經"],
["T08n0238","金剛能斷般若波羅蜜經"],
["T08n0239","佛說能斷金剛般若波羅蜜多經"],
["T08n0240","實相般若波羅蜜經"],
["T08n0241","金剛頂瑜伽理趣般若經"],
["T08n0242","佛說遍照般若波羅蜜經"],
["T08n0243","大樂金剛不空真實三麼耶經"],
["T08n0244","佛說最上根本大樂金剛不空三昧大教王經"],
["T08n0245","佛說仁王般若波羅蜜經"],
["T08n0246","仁王護國般若波羅蜜多經"],
["T08n0247","佛說了義般若波羅蜜多經"],
["T08n0248","佛說五十頌聖般若波羅蜜經"],
["T08n0249","佛說帝釋般若波羅蜜多心經"],
["T08n0250","摩訶般若波羅蜜大明咒經"],
["T08n0251","般若波羅蜜多心經"],
["T08n0252","普遍智藏般若波羅蜜多心經"],
["T08n0253","般若波羅蜜多心經"],
["T08n0254","般若波羅蜜多心經"],
["T08n0255","般若波羅蜜多心經"],
["T08n0256","唐梵翻對字音般若波羅蜜多心經"],
["T08n0257","佛說聖佛母般若波羅蜜多經"],
["T08n0258","佛說聖佛母小字般若波羅蜜多經"],
["T08n0259","佛說觀想佛母般若波羅蜜多菩薩經"],
["T08n0260","佛說開覺自性般若波羅蜜多經"],
["T08n0261","大乘理趣六波羅蜜多經"],
["T09n0262","妙法蓮華經"],
["T09n0263","正法華經"],
["T09n0264","添品妙法蓮華經"],
["T09n0265","薩曇分陀利經"],
["T09n0266","佛說阿惟越致遮經"],
["T09n0267","不退轉法輪經"],
["T09n0268","佛說廣博嚴淨不退轉輪經"],
["T09n0269","佛說法華三昧經"],
["T09n0270","大法鼓經"],
["T09n0271","佛說菩薩行方便境界神通變化經"],
["T09n0272","大薩遮尼乾子所說經"],
["T09n0273","金剛三昧經"],
["T09n0274","佛說濟諸方等學經"],
["T09n0275","大乘方廣總持經"],
["T09n0276","無量義經"],
["T09n0277","佛說觀普賢菩薩行法經"],
["T09n0278","大方廣佛華嚴經"],
["T10n0279","大方廣佛華嚴經"],
["T10n0280","佛說兜沙經"],
["T10n0281","佛說菩薩本業經"],
["T10n0282","諸菩薩求佛本業經"],
["T10n0283","菩薩十住行道品"],
["T10n0284","佛說菩薩十住經"],
["T10n0285","漸備一切智德經"],
["T10n0286","十住經"],
["T10n0287","佛說十地經"],
["T10n0288","等目菩薩所問三昧經"],
["T10n0289","顯無邊佛土功德經"],
["T10n0290","佛說較量一切佛剎功德經"],
["T10n0291","佛說如來興顯經"],
["T10n0292","度世品經"],
["T10n0293","大方廣佛華嚴經"],
["T10n0294","佛說羅摩伽經"],
["T10n0295","大方廣佛華嚴經入法界品"],
["T10n0296","文殊師利發願經"],
["T10n0297","普賢菩薩行願讚"],
["T10n0298","大方廣普賢所說經"],
["T10n0299","大方廣總持寶光明經"],
["T10n0300","大方廣佛華嚴經不思議佛境界分"],
["T10n0301","大方廣如來不思議境界經"],
["T10n0302","度諸佛境界智光嚴經"],
["T10n0303","佛華嚴入如來德智不思議境界經"],
["T10n0304","大方廣入如來智德不思議經"],
["T10n0305","信力入印法門經"],
["T10n0306","大方廣佛花嚴經修慈分"],
["T10n0307","佛說莊嚴菩提心經"],
["T10n0308","佛說大方廣菩薩十地經"],
["T10n0309","最勝問菩薩十住除垢斷結經"],
["T11n0310","大寶積經"],
["T11n0311","大方廣三戒經"],
["T11n0312","佛說如來不思議祕密大乘經"],
["T11n0313","阿閦佛國經"],
["T11n0314","佛說大乘十法經"],
["T11n0315a","佛說普門品經"],
["T11n0315b","佛說普門品經"],
["T11n0316","佛說大乘菩薩藏正法經"],
["T11n0317","佛說胞胎經"],
["T11n0318","文殊師利佛土嚴淨經"],
["T11n0319","大聖文殊師利菩薩佛剎功德莊嚴經"],
["T11n0320","父子合集經"],
["T12n0321","佛說護國尊者所問大乘經"],
["T12n0322","法鏡經"],
["T12n0323","郁迦羅越問菩薩行經"],
["T12n0324","佛說幻士仁賢經"],
["T12n0325","佛說決定毘尼經"],
["T12n0326","佛說三十五佛名禮懺文"],
["T12n0327","發覺淨心經"],
["T12n0328","佛說須賴經"],
["T12n0329","佛說須賴經"],
["T12n0330","佛說菩薩修行經"],
["T12n0331","佛說無畏授所問大乘經"],
["T12n0332","佛說優填王經"],
["T12n0333","佛說大乘日子王所問經"],
["T12n0334","佛說須摩提菩薩經"],
["T12n0335","佛說須摩提菩薩經"],
["T12n0336","須摩提經"],
["T12n0337","佛說阿闍貰王女阿術達菩薩經"],
["T12n0338","佛說離垢施女經"],
["T12n0339","得無垢女經"],
["T12n0340","文殊師利所說不思議佛境界經"],
["T12n0341","聖善住意天子所問經"],
["T12n0342","佛說如幻三昧經"],
["T12n0343","佛說太子刷護經"],
["T12n0344","佛說太子和休經"],
["T12n0345","慧上菩薩問大善權經"],
["T12n0346","佛說大方廣善巧方便經"],
["T12n0347","大乘顯識經"],
["T12n0348","佛說大乘方等要慧經"],
["T12n0349","彌勒菩薩所問本願經"],
["T12n0350","佛說遺日摩尼寶經"],
["T12n0351","佛說摩訶衍寶嚴經"],
["T12n0352","佛說大迦葉問大寶積正法經"],
["T12n0353","勝鬘師子吼一乘大方便方廣經"],
["T12n0354","毘耶娑問經"],
["T12n0355","入法界體性經"],
["T12n0356","佛說寶積三昧文殊師利菩薩問法身經"],
["T12n0357","如來莊嚴智慧光明入一切佛境界經"],
["T12n0358","度一切諸佛境界智嚴經"],
["T12n0359","佛說大乘入諸佛境界智光明莊嚴經"],
["T12n0360","佛說無量壽經"],
["T12n0361","佛說無量清淨平等覺經"],
["T12n0362","佛說阿彌陀三耶三佛薩樓佛檀過度人道經"],
["T12n0363","佛說大乘無量壽莊嚴經"],
["T12n0364","佛說大阿彌陀經"],
["T12n0365","佛說觀無量壽佛經"],
["T12n0366","佛說阿彌陀經"],
["T12n0367","稱讚淨土佛攝受經"],
["T12n0368","拔一切業障根本得生淨土神咒"],
["T12n0369","阿彌陀佛說咒"],
["T12n0370","阿彌陀鼓音聲王陀羅尼經"],
["T12n0371","觀世音菩薩授記經"],
["T12n0372","佛說如幻三摩地無量印法門經"],
["T12n0373","後出阿彌陀佛偈"],
["T12n0374","大般涅槃經"],
["T12n0375","大般涅槃經"],
["T12n0376","佛說大般泥洹經"],
["T12n0377","大般涅槃經後分"],
["T12n0378","佛說方等般泥洹經"],
["T12n0379","四童子三昧經"],
["T12n0380","大悲經"],
["T12n0381","等集眾德三昧經"],
["T12n0382","集一切福德三昧經"],
["T12n0383","摩訶摩耶經"],
["T12n0384","菩薩從兜術天降神母胎說廣普經"],
["T12n0385","中陰經"],
["T12n0386","蓮華面經"],
["T12n0387","大方等無想經"],
["T12n0388","大雲無想經卷第九"],
["T12n0389","佛垂般涅槃略說教誡經"],
["T12n0390","佛臨涅槃記法住經"],
["T12n0391","般泥洹後灌臘經"],
["T12n0392","佛滅度後棺斂葬送經"],
["T12n0393","迦葉赴佛般涅槃經"],
["T12n0394","佛入涅槃密跡金剛力士哀戀經"],
["T12n0395","佛說當來變經"],
["T12n0396","佛說法滅盡經"],
["T13n0397","大方等大集經"],
["T13n0398","大哀經"],
["T13n0399","寶女所問經"],
["T13n0400","佛說海意菩薩所問淨印法門經"],
["T13n0401","佛說無言童子經"],
["T13n0402","寶星陀羅尼經"],
["T13n0403","阿差末菩薩經"],
["T13n0404","大集大虛空藏菩薩所問經"],
["T13n0405","虛空藏菩薩經"],
["T13n0406","虛空藏菩薩神呪經"],
["T13n0407","虛空藏菩薩神咒經"],
["T13n0408","虛空孕菩薩經"],
["T13n0409","觀虛空藏菩薩經"],
["T13n0410","大方廣十輪經"],
["T13n0411","大乘大集地藏十輪經"],
["T13n0412","地藏菩薩本願經"],
["T13n0413","百千頌大集經地藏菩薩請問法身讚"],
["T13n0414","菩薩念佛三昧經"],
["T13n0415","大方等大集經菩薩念佛三昧分"],
["T13n0416","大方等大集經賢護分"],
["T13n0417","般舟三昧經"],
["T13n0418","般舟三昧經"],
["T13n0419","拔陂菩薩經"],
["T13n0420","自在王菩薩經"],
["T13n0421","奮迅王問經"],
["T13n0422","大集譬喻王經"],
["T13n0423","僧伽吒經"],
["T13n0424","大集會正法經"],
["T14n0425","賢劫經"],
["T14n0426","佛說千佛因緣經"],
["T14n0427","佛說八吉祥神咒經"],
["T14n0428","佛說八陽神咒經"],
["T14n0429","佛說八部佛名經"],
["T14n0430","八吉祥經"],
["T14n0431","八佛名號經"],
["T14n0432","佛說十吉祥經"],
["T14n0433","佛說寶網經"],
["T14n0434","佛說稱揚諸佛功德經"],
["T14n0435","佛說滅十方冥經"],
["T14n0436","受持七佛名號所生功德經"],
["T14n0437","大乘寶月童子問法經"],
["T14n0438","佛說大乘大方廣佛冠經"],
["T14n0439","佛說諸佛經"],
["T14n0440","佛說佛名經"],
["T14n0441","佛說佛名經"],
["T14n0442","十方千五百佛名經"],
["T14n0443","五千五百佛名神咒除障滅罪經"],
["T14n0444","佛說百佛名經"],
["T14n0445","佛說不思議功德諸佛所護念經"],
["T14n0446a","過去莊嚴劫千佛名經"],
["T14n0446b","過去莊嚴劫千佛名經"],
["T14n0447a","現在賢劫千佛名經"],
["T14n0447b","現在賢劫千佛名經"],
["T14n0448a","未來星宿劫千佛名經"],
["T14n0448b","未來星宿劫千佛名經"],
["T14n0449","佛說藥師如來本願經"],
["T14n0450","藥師琉璃光如來本願功德經"],
["T14n0451","藥師琉璃光七佛本願功德經"],
["T14n0452","佛說觀彌勒菩薩上生兜率天經"],
["T14n0453","佛說彌勒下生經"],
["T14n0454","佛說彌勒下生成佛經"],
["T14n0455","佛說彌勒下生成佛經"],
["T14n0456","佛說彌勒大成佛經"],
["T14n0457","佛說彌勒來時經"],
["T14n0458","文殊師利問菩薩署經"],
["T14n0459","佛說文殊悔過經"],
["T14n0460","佛說文殊師利淨律經"],
["T14n0461","佛說文殊師利現寶藏經"],
["T14n0462","大方廣寶篋經"],
["T14n0463","佛說文殊師利般涅槃經"],
["T14n0464","文殊師利問菩提經"],
["T14n0465","伽耶山頂經"],
["T14n0466","佛說象頭精舍經"],
["T14n0467","大乘伽耶山頂經"],
["T14n0468","文殊師利問經"],
["T14n0469","文殊問經字母品第十四"],
["T14n0470","佛說文殊師利巡行經"],
["T14n0471","佛說文殊師利行經"],
["T14n0472","佛說大乘善見變化文殊師利問法經"],
["T14n0473","佛說妙吉祥菩薩所問大乘法螺經"],
["T14n0474","佛說維摩詰經"],
["T14n0475","維摩詰所說經"],
["T14n0476","說無垢稱經"],
["T14n0477","佛說大方等頂王經"],
["T14n0478","大乘頂王經"],
["T14n0479","善思童子經"],
["T14n0480","佛說月上女經"],
["T14n0481","持人菩薩經"],
["T14n0482","持世經"],
["T14n0483","三曼陀跋陀羅菩薩經"],
["T14n0484","不思議光菩薩所說經"],
["T14n0485","無所有菩薩經"],
["T14n0486","師子莊嚴王菩薩請問經"],
["T14n0487","離垢慧菩薩所問禮佛法經"],
["T14n0488","寶授菩薩菩提行經"],
["T14n0489","佛說除蓋障菩薩所問經"],
["T14n0490","佛說八大菩薩經"],
["T14n0491","六菩薩亦當誦持經"],
["T14n0492a","佛說阿難問事佛吉凶經"],
["T14n0492b","阿難問事佛吉凶經"],
["T14n0493","佛說阿難四事經"],
["T14n0494","阿難七夢經"],
["T14n0495","佛說阿難分別經"],
["T14n0496","佛說大迦葉本經"],
["T14n0497","佛說摩訶迦葉度貧母經"],
["T14n0498","佛說初分說經"],
["T14n0499","佛為阿支羅迦葉自化作苦經"],
["T14n0500","羅云忍辱經"],
["T14n0501","佛說沙曷比丘功德經"],
["T14n0502","佛為年少比丘說正事經"],
["T14n0503","比丘避女惡名欲自殺經"],
["T14n0504","比丘聽施經"],
["T14n0505","佛說隨勇尊者經"],
["T14n0506","犍陀國王經"],
["T14n0507","佛說未生冤經"],
["T14n0508","阿闍世王問五逆經"],
["T14n0509","阿闍世王授決經"],
["T14n0510","採花違王上佛授決號妙花經"],
["T14n0511","佛說蓱沙王五願經"],
["T14n0512","佛說淨飯王般涅槃經"],
["T14n0513","佛說琉璃王經"],
["T14n0514","佛說諫王經"],
["T14n0515","如來示教勝軍王經"],
["T14n0516","佛說勝軍王所問經"],
["T14n0517","佛說末羅王經"],
["T14n0518","佛說旃陀越國王經"],
["T14n0519","佛說摩達國王經"],
["T14n0520","佛說薩羅國經"],
["T14n0521","佛說梵摩難國王經"],
["T14n0522","普達王經"],
["T14n0523","佛說五王經"],
["T14n0524","佛為優填王說王法政論經"],
["T14n0525","佛說長者子懊惱三處經"],
["T14n0526","佛說長者子制經"],
["T14n0527","佛說逝童子經"],
["T14n0528","佛說菩薩逝經"],
["T14n0529","佛說阿鳩留經"],
["T14n0530","佛說須摩提長者經"],
["T14n0531","佛說長者音悅經"],
["T14n0532","私呵昧經"],
["T14n0533","菩薩生地經"],
["T14n0534","佛說月光童子經"],
["T14n0535","佛說申日經"],
["T14n0536","申日兒本經"],
["T14n0537","佛說越難經"],
["T14n0538","佛說呵雕阿那鋡經"],
["T14n0539","盧至長者因緣經"],
["T14n0540a","佛說樹提伽經"],
["T14n0540b","佛說樹提伽經"],
["T14n0541","佛說佛大僧大經"],
["T14n0542","佛說耶祇經"],
["T14n0543","佛說巨力長者所問大乘經"],
["T14n0544","辯意長者子經"],
["T14n0545","佛說德護長者經"],
["T14n0546","佛說金耀童子經"],
["T14n0547","大花嚴長者問佛那羅延力經"],
["T14n0548","佛說金光王童子經"],
["T14n0549","佛說光明童子因緣經"],
["T14n0550","金色童子因緣經"],
["T14n0551","佛說摩鄧女經"],
["T14n0552","佛說摩登女解形中六事經"],
["T14n0553","佛說㮈女祇域因緣經"],
["T14n0554","佛說奈女耆婆經"],
["T14n0555a","五母子經"],
["T14n0555b","五母子經"],
["T14n0556","佛說七女經"],
["T14n0557","佛說龍施女經"],
["T14n0558","佛說龍施菩薩本起經"],
["T14n0559","佛說老女人經"],
["T14n0560","佛說老母女六英經"],
["T14n0561","佛說老母經"],
["T14n0562","佛說無垢賢女經"],
["T14n0563","佛說腹中女聽經"],
["T14n0564","佛說轉女身經"],
["T14n0565","順權方便經"],
["T14n0566","樂瓔珞莊嚴方便品經"],
["T14n0567","佛說梵志女首意經"],
["T14n0568","有德女所問大乘經"],
["T14n0569","佛說心明經"],
["T14n0570","佛說賢首經"],
["T14n0571","佛說婦人遇辜經"],
["T14n0572","佛說長者法志妻經"],
["T14n0573","差摩婆帝授記經"],
["T14n0574","佛說堅固女經"],
["T14n0575","佛說大方等修多羅王經"],
["T14n0576","佛說轉有經"],
["T14n0577","佛說大乘流轉諸有經"],
["T14n0578","無垢優婆夷問經"],
["T14n0579","優婆夷淨行法門經"],
["T14n0580","佛說長者女菴提遮師子吼了義經"],
["T14n0581","佛說八師經"],
["T14n0582","佛說孫多耶致經"],
["T14n0583","佛說黑氏梵志經"],
["T14n0584","長爪梵志請問經"],
["T15n0585","持心梵天所問經"],
["T15n0586","思益梵天所問經"],
["T15n0587","勝思惟梵天所問經"],
["T15n0588","佛說須真天子經"],
["T15n0589","佛說魔逆經"],
["T15n0590","佛說四天王經"],
["T15n0591","商主天子所問經"],
["T15n0592","天請問經"],
["T15n0593","佛為勝光天子說王法經"],
["T15n0594","佛說大自在天子因地經"],
["T15n0595","佛說嗟襪曩法天子受三歸依獲免惡道經"],
["T15n0596","佛說天王太子辟羅經"],
["T15n0597","龍王兄弟經"],
["T15n0598","佛說海龍王經"],
["T15n0599","佛為海龍王說法印經"],
["T15n0600","十善業道經"],
["T15n0601","佛為娑伽羅龍王所說大乘經"],
["T15n0602","佛說大安般守意經"],
["T15n0603","陰持入經"],
["T15n0604","佛說禪行三十七品經"],
["T15n0605","禪行法想經"],
["T15n0606","修行道地經"],
["T15n0607","道地經"],
["T15n0608","小道地經"],
["T15n0609","禪要經"],
["T15n0610","佛說內身觀章句經"],
["T15n0611","法觀經"],
["T15n0612","身觀經"],
["T15n0613","禪祕要法經"],
["T15n0614","坐禪三昧經"],
["T15n0615","菩薩訶色欲法經"],
["T15n0616","禪法要解"],
["T15n0617","思惟略要法"],
["T15n0618","達摩多羅禪經"],
["T15n0619","五門禪經要用法"],
["T15n0620","治禪病祕要法"],
["T15n0621","佛說佛印三昧經"],
["T15n0622","佛說自誓三昧經"],
["T15n0623","佛說如來獨證自誓三昧經"],
["T15n0624","佛說伅真陀羅所問如來三昧經"],
["T15n0625","大樹緊那羅王所問經"],
["T15n0626","佛說阿闍世王經"],
["T15n0627","文殊支利普超三昧經"],
["T15n0628","佛說未曾有正法經"],
["T15n0629","佛說放缽經"],
["T15n0630","佛說成具光明定意經"],
["T15n0631","佛說法律三昧經"],
["T15n0632","佛說慧印三昧經"],
["T15n0633","佛說如來智印經"],
["T15n0634","佛說大乘智印經"],
["T15n0635","佛說弘道廣顯三昧經"],
["T15n0636","無極寶三昧經"],
["T15n0637","佛說寶如來三昧經"],
["T15n0638","佛說超日明三昧經"],
["T15n0639","月燈三昧經"],
["T15n0640","佛說月燈三昧經"],
["T15n0641","佛說月燈三昧經"],
["T15n0642","佛說首楞嚴三昧經"],
["T15n0643","佛說觀佛三昧海經"],
["T15n0644","佛說金剛三昧本性清淨不壞不滅經"],
["T15n0645","不必定入定入印經"],
["T15n0646","入定不定印經"],
["T15n0647","力莊嚴三昧經"],
["T15n0648","寂照神變三摩地經"],
["T15n0649","觀察諸法行經"],
["T15n0650","諸法無行經"],
["T15n0651","佛說諸法本無經"],
["T15n0652","佛說大乘隨轉宣說諸法經"],
["T15n0653","佛藏經"],
["T15n0654","佛說入無分別法門經"],
["T15n0655","佛說勝義空經"],
["T16n0656","菩薩瓔珞經"],
["T16n0657","佛說華手經"],
["T16n0658","寶雲經"],
["T16n0659","大乘寶雲經"],
["T16n0660","佛說寶雨經"],
["T16n0661","大乘百福相經"],
["T16n0662","大乘百福莊嚴相經"],
["T16n0663","金光明經"],
["T16n0664","合部金光明經"],
["T16n0665","金光明最勝王經"],
["T16n0666","大方等如來藏經"],
["T16n0667","大方廣如來藏經"],
["T16n0668","佛說不增不減經"],
["T16n0669","佛說無上依經"],
["T16n0670","楞伽阿跋多羅寶經"],
["T16n0671","入楞伽經"],
["T16n0672","大乘入楞伽經"],
["T16n0673","大乘同性經"],
["T16n0674","證契大乘經"],
["T16n0675","深密解脫經"],
["T16n0676","解深密經"],
["T16n0677","佛說解節經"],
["T16n0678","相續解脫地波羅蜜了義經"],
["T16n0679","相續解脫如來所作隨順處了義經"],
["T16n0680","佛說佛地經"],
["T16n0681","大乘密嚴經"],
["T16n0682","大乘密嚴經"],
["T16n0683","佛說諸德福田經"],
["T16n0684","佛說父母恩難報經"],
["T16n0685","佛說盂蘭盆經"],
["T16n0686","佛說報恩奉盆經"],
["T16n0687","佛說孝子經"],
["T16n0688","佛說未曾有經"],
["T16n0689","甚希有經"],
["T16n0690","佛說希有挍量功德經"],
["T16n0691","最無比經"],
["T16n0692","佛說作佛形像經"],
["T16n0693","佛說造立形像福報經"],
["T16n0694","佛說大乘造像功德經"],
["T16n0695","佛說灌洗佛形像經"],
["T16n0696","佛說摩訶剎頭經"],
["T16n0697","佛說浴像功德經"],
["T16n0698","浴佛功德經"],
["T16n0699","佛說造塔功德經"],
["T16n0700","右繞佛塔功德經"],
["T16n0701","佛說溫室洗浴眾僧經"],
["T16n0702","佛說施燈功德經"],
["T16n0703","燈指因緣經"],
["T16n0704","佛說樓閣正法甘露鼓經"],
["T16n0705","佛說布施經"],
["T16n0706","佛說五大施經"],
["T16n0707","佛說出家功德經"],
["T16n0708","了本生死經"],
["T16n0709","佛說稻芉經"],
["T16n0710","慈氏菩薩所說大乘緣生稻[卄/幹]喻經"],
["T16n0711","大乘舍黎娑擔摩經"],
["T16n0712","佛說大乘稻芉經"],
["T16n0713","貝多樹下思惟十二因緣經"],
["T16n0714","緣起聖道經"],
["T16n0715","佛說舊城喻經"],
["T16n0716","緣生初勝分法本經"],
["T16n0717","分別緣起初勝法門經"],
["T16n0718","佛說分別緣生經"],
["T16n0719","十二緣生祥瑞經"],
["T16n0720","無明羅剎集"],
["T17n0721","正法念處經"],
["T17n0722","妙法聖念處經"],
["T17n0723","分別業報略經"],
["T17n0724","佛說罪業應報教化地獄經"],
["T17n0725","佛說六道伽陀經"],
["T17n0726","六趣輪迴經"],
["T17n0727","十不善業道經"],
["T17n0728","諸法集要經"],
["T17n0729","佛說分別善惡所起經"],
["T17n0730","佛說處處經"],
["T17n0731","佛說十八泥犁經"],
["T17n0732","佛說罵意經"],
["T17n0733","佛說堅意經"],
["T17n0734","佛說鬼問目連經"],
["T17n0735","佛說四願經"],
["T17n0736","佛說四自侵經"],
["T17n0737","所欲致患經"],
["T17n0738","佛說分別經"],
["T17n0739","佛說慢法經"],
["T17n0740","佛說頞多和多耆經"],
["T17n0741","五苦章句經"],
["T17n0742","佛說自愛經"],
["T17n0743","佛說忠心經"],
["T17n0744","佛說除恐災患經"],
["T17n0745","佛說雜藏經"],
["T17n0746","餓鬼報應經"],
["T17n0747a","佛說罪福報應經"],
["T17n0747b","佛說輪轉五道罪福報應經"],
["T17n0748","佛說護淨經"],
["T17n0749","佛說因緣僧護經"],
["T17n0750","沙彌羅經"],
["T17n0751a","佛說五無反復經"],
["T17n0751b","佛說五無返復經"],
["T17n0752","佛說五無返復經"],
["T17n0753","十二品生死經"],
["T17n0754","佛說未曾有因緣經"],
["T17n0755","佛說淨意優婆塞所問經"],
["T17n0756","佛說八無暇有暇經"],
["T17n0757","佛說身毛喜豎經"],
["T17n0758","佛說諸行有為經"],
["T17n0759","佛說較量壽命經"],
["T17n0760","惟日雜難經"],
["T17n0761","佛說法集經"],
["T17n0762","佛說決定義經"],
["T17n0763","佛說法乘義決定經"],
["T17n0764","佛說法集名數經"],
["T17n0765","本事經"],
["T17n0766","佛說法身經"],
["T17n0767","佛說三品弟子經"],
["T17n0768","三慧經"],
["T17n0769","佛說四輩經"],
["T17n0770","佛說四不可得經"],
["T17n0771","四品學法經"],
["T17n0772","大乘四法經"],
["T17n0773","佛說菩薩修行四法經"],
["T17n0774","大乘四法經"],
["T17n0775","佛說四無所畏經"],
["T17n0776","佛說四品法門經"],
["T17n0777","佛說賢者五福德經"],
["T17n0778","佛說菩薩內習六波羅蜜經"],
["T17n0779","佛說八大人覺經"],
["T17n0780","佛說十力經"],
["T17n0781","佛說佛十力經"],
["T17n0782","佛說十號經"],
["T17n0783","佛說十二頭陀經"],
["T17n0784","四十二章經"],
["T17n0785","得道梯橙錫杖經"],
["T17n0786","佛說木槵子經"],
["T17n0787","曼殊室利咒藏中校量數珠功德經"],
["T17n0788","佛說校量數珠功德經"],
["T17n0789","金剛頂瑜伽念珠經"],
["T17n0790","佛說孛經抄"],
["T17n0791","佛說出家緣經"],
["T17n0792","佛說法受塵經"],
["T17n0793","佛說佛醫經"],
["T17n0794a","佛說時非時經"],
["T17n0794b","佛說時非時經"],
["T17n0795","佛治身經"],
["T17n0796","佛說見正經"],
["T17n0797a","佛說貧窮老公經"],
["T17n0797b","佛說貧窮老公經"],
["T17n0798","佛說進學經"],
["T17n0799","佛說略教誡經"],
["T17n0800","佛說無上處經"],
["T17n0801","佛說無常經"],
["T17n0802","佛說信解智力經"],
["T17n0803","佛說清淨心經"],
["T17n0804","佛說解憂經"],
["T17n0805","佛說栴檀樹經"],
["T17n0806","佛說枯樹經"],
["T17n0807","佛說內藏百寶經"],
["T17n0808","佛說犢子經"],
["T17n0809","佛說乳光佛經"],
["T17n0810","諸佛要集經"],
["T17n0811","佛說決定總持經"],
["T17n0812","菩薩行五十緣身經"],
["T17n0813","佛說無希望經"],
["T17n0814","佛說象腋經"],
["T17n0815","佛昇忉利天為母說法經"],
["T17n0816","佛說道神足無極變化經"],
["T17n0817","佛說大淨法門經"],
["T17n0818","大莊嚴法門經"],
["T17n0819","佛說法常住經"],
["T17n0820","佛說演道俗業經"],
["T17n0821","大方廣如來祕密藏經"],
["T17n0822","佛說諸法勇王經"],
["T17n0823","佛說一切法高王經"],
["T17n0824","諸法最上王經"],
["T17n0825","佛說甚深大迴向經"],
["T17n0826","弟子死復生經"],
["T17n0827","佛說懈怠耕者經"],
["T17n0828","無字寶篋經"],
["T17n0829","大乘離文字普光明藏經"],
["T17n0830","大乘遍照光明藏無字法門經"],
["T17n0831","謗佛經"],
["T17n0832","佛語經"],
["T17n0833","第一義法勝經"],
["T17n0834","大威燈光仙人問疑經"],
["T17n0835","如來師子吼經"],
["T17n0836","大方廣師子吼經"],
["T17n0837","佛說出生菩提心經"],
["T17n0838","佛說發菩提心破諸魔經"],
["T17n0839","占察善惡業報經"],
["T17n0840","稱讚大乘功德經"],
["T17n0841","說妙法決定業障經"],
["T17n0842","大方廣圓覺修多羅了義經"],
["T17n0843","佛說大乘不思議神通境界經"],
["T17n0844","佛說大方廣未曾有經善巧方便品"],
["T17n0845","佛說尊那經"],
["T17n0846","外道問聖大乘法無我義經"],
["T17n0847","大乘修行菩薩行門諸經要集"],
["T18n0848","大毘盧遮那成佛神變加持經"],
["T18n0849","大毘盧遮那佛說要略念誦經"],
["T18n0850","攝大毘盧遮那成佛神變加持經入蓮華胎藏海會悲生曼荼攞廣大念誦儀軌供養方便會"],
["T18n0851","大毘盧遮那經廣大儀軌"],
["T18n0852a","大毘盧遮那成佛神變加持經蓮華胎藏悲生曼荼羅廣大成就儀軌供養方便會"],
["T18n0852b","大毘盧舍那成佛神變加持經蓮華胎藏悲生曼荼羅廣大成就儀軌"],
["T18n0853","大毘盧遮那成佛神變加持經蓮華胎藏菩提幢標幟普通真言藏廣大成就瑜伽"],
["T18n0854","胎藏梵字真言"],
["T18n0855","青龍寺軌記"],
["T18n0856","大毘盧遮那成佛神變加持經略示七支念誦隨行法"],
["T18n0857","大日經略攝念誦隨行法"],
["T18n0858","大毘盧遮那略要速疾門五支念誦法"],
["T18n0859","供養儀式"],
["T18n0860","大日經持誦次第儀軌"],
["T18n0861","毘盧遮那五字真言修習儀軌"],
["T18n0862","阿闍梨大曼荼攞灌頂儀軌"],
["T18n0863","大毘盧遮那經阿闍梨真實智品中阿闍梨住阿字觀門"],
["T18n0865","金剛頂一切如來真實攝大乘現證大教王經"],
["T18n0866","金剛頂瑜伽中略出念誦經"],
["T18n0867","金剛峰樓閣一切瑜伽瑜祇經"],
["T18n0868","諸佛境界攝真實經"],
["T18n0869","金剛頂經瑜伽十八會指歸"],
["T18n0870","略述金剛頂瑜伽分別聖位修證法門"],
["T18n0871","金剛頂瑜伽略述三十七尊心要"],
["T18n0872","金剛頂瑜伽三十七尊出生義"],
["T18n0873","金剛頂蓮華部心念誦儀軌"],
["T18n0874","金剛頂一切如來真實攝大乘現證大教王經"],
["T18n0875","蓮華部心念誦儀軌"],
["T18n0876","金剛頂瑜伽修習毘盧遮那三摩地法"],
["T18n0877","金剛頂經毘盧遮那一百八尊法身契印"],
["T18n0878","金剛頂經金剛界大道場毘盧遮那如來自受用身內證智眷屬法身異名佛最上乘祕密三摩地禮懺文"],
["T18n0879","金剛頂瑜伽三十七尊禮"],
["T18n0880","瑜伽金剛頂經釋字母品"],
["T18n0881","賢劫十六尊"],
["T18n0882","佛說一切如來真實攝大乘現證三昧大教王經"],
["T18n0883","佛說祕密三昧大教王經"],
["T18n0884","佛說祕密相經"],
["T18n0885","佛說一切如來金剛三業最上祕密大教王經"],
["T18n0886","佛說金剛場莊嚴般若波羅蜜多教中一分"],
["T18n0887","佛說無二平等最上瑜伽大教王經"],
["T18n0888","一切祕密最上名義大教王儀軌"],
["T18n0889","一切如來大祕密王未曾有最上微妙大曼拏羅經"],
["T18n0890","佛說瑜伽大教王經"],
["T18n0891","佛說幻化網大瑜伽教十忿怒明王大明觀想儀軌經"],
["T18n0892","佛說大悲空智金剛大教王儀軌經"],
["T18n0893a","蘇悉地羯囉經"],
["T18n0893b","蘇悉地羯羅經"],
["T18n0893c","蘇悉地羯羅經"],
["T18n0894a","蘇悉地羯羅供養法"],
["T18n0894b","蘇悉地羯羅供養法"],
["T18n0895a","蘇婆呼童子請問經"],
["T18n0895b","蘇婆呼童子請問經"],
["T18n0896","妙臂菩薩所問經"],
["T18n0897","蕤呬耶經"],
["T18n0898","佛說毘奈耶經"],
["T18n0899","清淨法身毘盧遮那心地法門成就一切陀羅尼三種悉地"],
["T18n0900","十八契印"],
["T18n0901","陀羅尼集經"],
["T18n0902","總釋陀羅尼義讚"],
["T18n0903","都部陀羅尼目"],
["T18n0904","念誦結護法普通諸部"],
["T18n0905","三種悉地破地獄轉業障出三界祕密陀羅尼法"],
["T18n0906","佛頂尊勝心破地獄轉業障出三界祕密三身佛果三種悉地真言儀軌"],
["T18n0907","佛頂尊勝心破地獄轉業障出三界祕密陀羅尼"],
["T18n0908","金剛頂瑜伽護摩儀軌"],
["T18n0909","金剛頂瑜伽護摩儀軌"],
["T18n0910","梵天擇地法"],
["T18n0911","建立曼荼羅及揀擇地法"],
["T18n0912","建立曼荼羅護摩儀軌"],
["T18n0913","火[合*牛]供養儀軌"],
["T18n0914","火吽軌別錄"],
["T18n0915","受菩提心戒儀"],
["T18n0916","受五戒八戒文"],
["T18n0917","無畏三藏禪要"],
["T19n0918","諸佛心陀羅尼經"],
["T19n0919","諸佛心印陀羅尼經"],
["T19n0920","佛心經"],
["T19n0921","阿閦如來念誦供養法"],
["T19n0922","藥師琉璃光如來消災除難念誦儀軌"],
["T19n0923","藥師如來觀行儀軌法"],
["T19n0925","藥師琉璃光王七佛本願功德經念誦儀軌"],
["T19n0926","藥師琉璃光王七佛本願功德經念誦儀軌供養法"],
["T19n0927","藥師七佛供養儀軌如意王經"],
["T19n0928","修藥師儀軌布壇法"],
["T19n0929","淨琉璃淨土摽"],
["T19n0930","無量壽如來觀行供養儀軌"],
["T19n0931","金剛頂經觀自在王如來修行法"],
["T19n0932","金剛頂經瑜伽觀自在王如來修行法"],
["T19n0933","九品往生阿彌陀三摩地集陀羅尼經"],
["T19n0934","佛說無量功德陀羅尼經"],
["T19n0935","極樂願文"],
["T19n0936","大乘無量壽經"],
["T19n0937","佛說大乘聖無量壽決定光明王如來陀羅尼經"],
["T19n0938","釋迦文尼佛金剛一乘修行儀軌法品"],
["T19n0939","佛說大乘觀想曼拏羅淨諸惡趣經"],
["T19n0940","佛說帝釋巖祕密成就儀軌"],
["T19n0941","釋迦牟尼佛成道在菩提樹降魔讚"],
["T19n0942","釋迦佛讚"],
["T19n0943","佛說無能勝幡王如來莊嚴陀羅尼經"],
["T19n0945","大佛頂如來密因修證了義諸菩薩萬行首楞嚴經"],
["T19n0946","大佛頂廣聚陀羅尼經"],
["T19n0947","大佛頂如來放光悉怛多般怛羅大神力都攝一切咒王陀羅尼經大威德最勝金輪三昧咒品"],
["T19n0948","金輪王佛頂要略念誦法"],
["T19n0949","奇特最勝金輪佛頂念誦儀軌法要"],
["T19n0950","菩提場所說一字頂輪王經"],
["T19n0951","一字佛頂輪王經"],
["T19n0952","五佛頂三昧陀羅尼經"],
["T19n0953","一字奇特佛頂經"],
["T19n0955","一字頂輪王瑜伽觀行儀軌"],
["T19n0956","大陀羅尼末法中一字心咒經"],
["T19n0957","金剛頂一字頂輪王瑜伽一切時處念誦成佛儀軌"],
["T19n0958","金剛頂經一字頂輪王儀軌音義"],
["T19n0959","頂輪王大曼荼羅灌頂儀軌"],
["T19n0960","一切如來說佛頂輪王一百八名讚"],
["T19n0961","如意寶珠轉輪祕密現身成佛金輪咒王經"],
["T19n0962","寶悉地成佛陀羅尼經"],
["T19n0963","佛說熾盛光大威德消災吉祥陀羅尼經"],
["T19n0964","佛說大威德金輪佛頂熾盛光如來消除一切災難陀羅尼經"],
["T19n0965","大妙金剛大甘露軍拏利焰鬘熾盛佛頂經"],
["T19n0966","大聖妙吉祥菩薩說除災教令法輪"],
["T19n0967","佛頂尊勝陀羅尼經"],
["T19n0968","佛頂尊勝陀羅尼經"],
["T19n0969","佛頂最勝陀羅尼經"],
["T19n0970","最勝佛頂陀羅尼淨除業障咒經"],
["T19n0971","佛說佛頂尊勝陀羅尼經"],
["T19n0972","佛頂尊勝陀羅尼念誦儀軌法"],
["T19n0973","尊勝佛頂脩瑜伽法軌儀"],
["T19n0975","白傘蓋大佛頂王最勝無比大威德金剛無礙大道場陀羅尼念誦法要"],
["T19n0976","佛頂大白傘蓋陀羅尼經"],
["T19n0977","佛說大白傘蓋總持陀羅尼經"],
["T19n0978","佛說一切如來烏瑟膩沙最勝總持經"],
["T19n0979","于瑟抳沙毘左野陀囉尼"],
["T19n0980","大勝金剛佛頂念誦儀軌"],
["T19n0981","大毘盧遮那佛眼修行儀軌"],
["T19n0982","佛母大孔雀明王經"],
["T19n0984","孔雀王咒經"],
["T19n0985","佛說大孔雀咒王經"],
["T19n0986","大金色孔雀王咒經"],
["T19n0987","佛說大金色孔雀王咒經"],
["T19n0988","孔雀王咒經"],
["T19n0989","大雲輪請雨經"],
["T19n0990","大雲經祈雨壇法"],
["T19n0991","大雲輪請雨經"],
["T19n0992","大方等大雲經請雨品第六十四"],
["T19n0993","大雲經請雨品第六十四"],
["T19n0994","仁王護國般若波羅蜜多經陀羅尼念誦儀軌"],
["T19n0995","仁王般若念誦法"],
["T19n0996","仁王般若陀羅尼釋"],
["T19n0997","守護國界主陀羅尼經"],
["T19n0998","佛說迴向輪經"],
["T19n0999","佛說守護大千國土經"],
["T19n1000","成就妙法蓮華經王瑜伽觀智儀軌"],
["T19n1001","法華曼荼羅威儀形色法經"],
["T19n1002","不空罥索毘盧遮那佛大灌頂光真言"],
["T19n1003","大樂金剛不空真實三昧耶經般若波羅蜜多理趣釋"],
["T19n1004","般若波羅蜜多理趣經大樂不空三昧真實金剛薩埵菩薩等一十七聖大曼荼羅義述"],
["T19n1006","廣大寶樓閣善住祕密陀羅尼經"],
["T19n1007","牟梨曼陀羅咒經"],
["T19n1008","菩提場莊嚴陀羅尼經"],
["T19n1009","出生無邊門陀羅尼經"],
["T19n1010","佛說出生無邊門陀羅尼儀軌"],
["T19n1011","佛說無量門微密持經"],
["T19n1012","佛說出生無量門持經"],
["T19n1013","阿難陀目佉尼呵離陀經"],
["T19n1014","無量門破魔陀羅尼經"],
["T19n1015","佛說阿難陀目佉尼呵離陀鄰尼經"],
["T19n1016","舍利弗陀羅尼經"],
["T19n1017","佛說一向出生菩薩經"],
["T19n1018","出生無邊門陀羅尼經"],
["T19n1019","大方廣佛華嚴經入法界品四十二字觀門"],
["T19n1020","大方廣佛花嚴經入法界品頓證毘盧遮那法身字輪瑜伽儀軌"],
["T19n1021","華嚴經心陀羅尼"],
["T19n1023","一切如來正法祕密篋印心陀羅尼經"],
["T19n1024","無垢淨光大陀羅尼經"],
["T19n1025","佛頂放無垢光明入普門觀察一切如來心陀羅尼經"],
["T19n1026","佛說造塔延命功德經"],
["T19n1027a","金剛光焰止風雨陀羅尼經"],
["T19n1027b","金剛光焰止風雨陀羅尼經"],
["T19n1029","佛說安宅陀羅尼咒經"],
["T20n1030","觀自在大悲成就瑜伽蓮華部念誦法門"],
["T20n1031","聖觀自在菩薩心真言瑜伽觀行儀軌"],
["T20n1032","瑜伽蓮華部念誦法"],
["T20n1033","金剛恐怖集會方廣軌儀觀自在菩薩三世最勝心明王經"],
["T20n1034","咒五首"],
["T20n1035","千轉陀羅尼觀世音菩薩咒"],
["T20n1036","千轉大明陀羅尼經"],
["T20n1037","觀自在菩薩說普賢陀羅尼經"],
["T20n1038","清淨觀世音普賢陀羅尼經"],
["T20n1039","阿唎多羅陀羅尼阿嚕力經"],
["T20n1040","金剛頂降三世大儀軌法王教中觀自在菩薩心真言一切如來蓮華大曼荼羅品"],
["T20n1041","觀自在菩薩心真言一印念誦法"],
["T20n1042","觀自在菩薩大悲智印周遍法界利益眾生薰真如法"],
["T20n1043","請觀世音菩薩消伏毒害陀羅尼咒經"],
["T20n1044","佛說六字咒王經"],
["T20n1045a","佛說六字神咒王經"],
["T20n1045b","六字神咒王經"],
["T20n1046","六字大陀羅尼咒經"],
["T20n1047","佛說聖六字大明王陀羅尼經"],
["T20n1048","佛說大護明大陀羅尼經"],
["T20n1049","聖六字增壽大明陀羅尼經"],
["T20n1050","佛說大乘莊嚴寶王經"],
["T20n1051","佛說一切佛攝相應大教王經聖觀自在菩薩念誦儀軌"],
["T20n1052","讚觀世音菩薩頌"],
["T20n1053","聖觀自在菩薩功德讚"],
["T20n1054","聖觀自在菩薩一百八名經"],
["T20n1055","佛說聖觀自在菩薩梵讚"],
["T20n1056","金剛頂瑜伽千手千眼觀自在菩薩修行儀軌經"],
["T20n1057a","千眼千臂觀世音菩薩陀羅尼神咒經"],
["T20n1057b","千眼千臂觀世音菩薩陀羅尼神咒經"],
["T20n1058","千手千眼觀世音菩薩姥陀羅尼身經"],
["T20n1059","千手千眼觀世音菩薩治病合藥經"],
["T20n1060","千手千眼觀世音菩薩廣大圓滿無礙大悲心陀羅尼經"],
["T20n1061","千手千眼觀自在菩薩廣大圓滿無礙大悲心陀羅尼咒本"],
["T20n1063","番大悲神咒"],
["T20n1064","千手千眼觀世音菩薩大悲心陀羅尼"],
["T20n1065","千光眼觀自在菩薩祕密法經"],
["T20n1066","大悲心陀羅尼修行念誦略儀"],
["T20n1067","攝無礙大悲心大陀羅尼經計一法中出無量義南方滿願補陀落海會五部諸尊等弘誓力方位及威儀形色執持三摩耶幖幟曼荼羅儀軌"],
["T20n1068","千手觀音造次第法儀軌"],
["T20n1069","十一面觀自在菩薩心密言念誦儀軌經"],
["T20n1070","佛說十一面觀世音神咒經"],
["T20n1071","十一面神咒心經"],
["T20n1073","何耶揭唎婆像法"],
["T20n1074","何耶揭唎婆觀世音菩薩受法壇"],
["T20n1075","佛說七俱胝佛母准提大明陀羅尼經"],
["T20n1076","七俱胝佛母所說准提陀羅尼經"],
["T20n1077","佛說七俱胝佛母心大准提陀羅尼經"],
["T20n1078","七佛俱胝佛母心大准提陀羅尼法"],
["T20n1079","七俱胝獨部法"],
["T20n1080","如意輪陀羅尼經"],
["T20n1081","佛說觀自在菩薩如意心陀羅尼咒經"],
["T20n1082","觀世音菩薩祕密藏如意輪陀羅尼神咒經"],
["T20n1083","觀世音菩薩如意摩尼陀羅尼經"],
["T20n1084","觀世音菩薩如意摩尼輪陀羅尼念誦法"],
["T20n1085","觀自在菩薩如意輪念誦儀軌"],
["T20n1086","觀自在菩薩如意輪瑜伽"],
["T20n1087","觀自在如意輪菩薩瑜伽法要"],
["T20n1088","如意輪菩薩觀門義注祕訣"],
["T20n1089","都表如意摩尼轉輪聖王次第念誦祕密最要略法"],
["T20n1090","佛說如意輪蓮華心如來修行觀門儀"],
["T20n1091","七星如意輪祕密要經"],
["T20n1092","不空罥索神變真言經"],
["T20n1093","不空罥索咒經"],
["T20n1094","不空罥索神咒心經"],
["T20n1095","不空罥索咒心經"],
["T20n1096","不空罥索陀羅尼經"],
["T20n1097","不空罥索陀羅尼自在王咒經"],
["T20n1098","佛說不空罥索陀羅尼儀軌經"],
["T20n1099","佛說聖觀自在菩薩不空王祕密心陀羅尼經"],
["T20n1100","葉衣觀自在菩薩經"],
["T20n1101","佛說大方廣曼殊室利經"],
["T20n1102","金剛頂經多羅菩薩念誦法"],
["T20n1103a","觀自在菩薩隨心咒經"],
["T20n1103b","觀自在菩薩怛嚩多唎隨心陀羅尼經"],
["T20n1104","佛說聖多羅菩薩經"],
["T20n1105","聖多羅菩薩一百八名陀羅尼經"],
["T20n1106","讚揚聖德多羅菩薩一百八名經"],
["T20n1107","聖多羅菩薩梵讚"],
["T20n1109","白救度佛母讚"],
["T20n1110","佛說一髻尊陀羅尼經"],
["T20n1111","青頸觀自在菩薩心陀羅尼經"],
["T20n1112","金剛頂瑜伽青頸大悲王觀自在念誦儀軌"],
["T20n1114","毘俱胝菩薩一百八名經"],
["T20n1115","觀自在菩薩阿麼[齒*來]法"],
["T20n1116","廣大蓮華莊嚴曼拏羅滅一切罪陀羅尼經"],
["T20n1117","佛說觀自在菩薩母陀羅尼經"],
["T20n1118","佛說十八臂陀羅尼經"],
["T20n1119","大樂金剛薩埵修行成就儀軌"],
["T20n1121","金剛頂普賢瑜伽大教王經大樂不空金剛薩埵一切時方成就儀"],
["T20n1122","金剛頂瑜伽他化自在天理趣會普賢修行念誦儀軌"],
["T20n1123","金剛頂勝初瑜伽普賢菩薩念誦法"],
["T20n1124","普賢金剛薩埵略瑜伽念誦儀軌"],
["T20n1125","金剛頂瑜伽金剛薩埵五祕密修行念誦儀軌"],
["T20n1126","佛說普賢曼拏羅經"],
["T20n1127","佛說普賢菩薩陀羅尼經"],
["T20n1128","最上大乘金剛大教寶王經"],
["T20n1129","佛說金剛手菩薩降伏一切部多大教王經"],
["T20n1130","大乘金剛髻珠菩薩修行分"],
["T20n1131","聖金剛手菩薩一百八名梵讚"],
["T20n1132","金剛王菩薩祕密念誦儀軌"],
["T20n1133","金剛壽命陀羅尼念誦法"],
["T20n1135","佛說一切如來金剛壽命陀羅尼經"],
["T20n1136","佛說一切諸如來心光明加持普賢菩薩延命金剛最勝陀羅尼經"],
["T20n1137","佛說善法方便陀羅尼經"],
["T20n1138a","金剛祕密善門陀羅尼咒經"],
["T20n1138b","金剛祕密善門陀羅尼經"],
["T20n1139","護命法門神咒經"],
["T20n1140","佛說延壽妙門陀羅尼經"],
["T20n1141","慈氏菩薩略修瑜伽念誦法"],
["T20n1142","佛說慈氏菩薩陀羅尼"],
["T20n1143","佛說慈氏菩薩誓願陀羅尼經"],
["T20n1144","佛說彌勒菩薩發願王偈"],
["T20n1145","虛空藏菩薩能滿諸願最勝心陀羅尼求聞持法"],
["T20n1146","大虛空藏菩薩念誦法"],
["T20n1147","聖虛空藏菩薩陀羅尼經"],
["T20n1148","佛說虛空藏菩薩陀羅尼"],
["T20n1149","五大虛空藏菩薩速疾大神驗祕密式經"],
["T20n1150","轉法輪菩薩摧魔怨敵法"],
["T20n1151","修習般若波羅蜜菩薩觀行念誦儀軌"],
["T20n1152","佛說佛母般若波羅蜜多大明觀想儀軌"],
["T20n1153","普遍光明清淨熾盛如意寶印心無能勝大明王大隨求陀羅尼經"],
["T20n1154","佛說隨求即得大自在陀羅尼神咒經"],
["T20n1155","金剛頂瑜伽最勝祕密成佛隨求即得神變加持成就陀羅尼儀軌"],
["T20n1157","香王菩薩陀羅尼咒經"],
["T20n1158","地藏菩薩儀軌"],
["T20n1160","日光菩薩月光菩薩陀羅尼"],
["T20n1161","佛說觀藥王藥上二菩薩經"],
["T20n1162","持世陀羅尼經"],
["T20n1163","佛說雨寶陀羅尼經"],
["T20n1164","佛說大乘聖吉祥持世陀羅尼經"],
["T20n1165","聖持世陀羅尼經"],
["T20n1166","馬鳴菩薩大神力無比驗法念誦軌儀"],
["T20n1167","八大菩薩曼荼羅經"],
["T20n1169","佛說持明藏瑜伽大教尊那菩薩大明成就儀軌經"],
["T20n1170","佛說金剛香菩薩大明成就儀軌經"],
["T20n1171","金剛頂經瑜伽文殊師利菩薩法"],
["T20n1172","金剛頂超勝三界經說文殊五字真言勝相"],
["T20n1173","金剛頂經曼殊室利菩薩五字心陀羅尼品"],
["T20n1174","五字陀羅尼頌"],
["T20n1175","金剛頂經瑜伽文殊師利菩薩供養儀軌"],
["T20n1176","曼殊室利童子菩薩五字瑜伽法"],
["T20n1178","文殊菩薩獻佛陀羅尼名烏蘇吒"],
["T20n1179","文殊師利菩薩六字咒功能法經"],
["T20n1180","六字神咒經"],
["T20n1181","大方廣菩薩藏經中文殊師利根本一字陀羅尼經"],
["T20n1182","曼殊室利菩薩咒藏中一字咒王經"],
["T20n1183","一髻文殊師利童子陀羅尼念誦儀軌"],
["T20n1184","大聖妙吉祥菩薩祕密八字陀羅尼修行曼荼羅次第儀軌法"],
["T20n1186","佛說妙吉祥菩薩陀羅尼"],
["T20n1187","佛說最勝妙吉祥根本智最上祕密一切名義三摩地分"],
["T20n1188","文殊所說最勝名義經"],
["T20n1189","佛說文殊菩薩最勝真實名義經"],
["T20n1190","聖妙吉祥真實名經"],
["T20n1191","大方廣菩薩藏文殊師利根本儀軌經"],
["T20n1192","妙吉祥平等祕密最上觀門大教王經"],
["T20n1193","妙吉祥平等瑜伽祕密觀身成佛儀軌"],
["T20n1194","妙吉祥平等觀門大教王經略出護摩儀"],
["T20n1195","大聖文殊師利菩薩讚佛法身禮"],
["T20n1196","曼殊室利菩薩吉祥伽陀"],
["T20n1197","佛說文殊師利一百八名梵讚"],
["T20n1198","聖者文殊師利發菩提心願文"],
["T21n1199","金剛手光明灌頂經最勝立印聖無動尊大威怒王念誦儀軌法品"],
["T21n1200","底哩三昧耶不動尊威怒王使者念誦法"],
["T21n1201","底哩三昧耶不動尊聖者念誦祕密法"],
["T21n1202","不動使者陀羅尼祕密法"],
["T21n1203","聖無動尊安鎮家國等法"],
["T21n1204","聖無動尊一字出生八大童子祕要法品"],
["T21n1205","勝軍不動明王四十八使者祕密成就儀軌"],
["T21n1206","佛說俱利伽羅大龍勝外道伏陀羅尼經"],
["T21n1207","說矩里迦龍王像法"],
["T21n1208","俱力迦羅龍王儀軌"],
["T21n1209","金剛頂瑜伽降三世成就極深密門"],
["T21n1210","降三世忿怒明王念誦儀軌"],
["T21n1211","甘露軍荼利菩薩供養念誦成就儀軌"],
["T21n1212","西方陀羅尼藏中金剛族阿蜜哩多軍吒利法"],
["T21n1213","千臂軍荼利梵字真言"],
["T21n1214","聖閻曼德迦威怒王立成大神驗念誦法"],
["T21n1215","大乘方廣曼殊室利菩薩華嚴本教閻曼德迦忿怒王真言大威德儀軌品"],
["T21n1216","大方廣曼殊室利童真菩薩華嚴本教讚閻曼德迦忿怒王真言阿毘遮嚕迦儀軌品"],
["T21n1217","佛說妙吉祥最勝根本大教經"],
["T21n1218","文殊師利耶曼德迦咒法"],
["T21n1219","曼殊室利焰曼德迦萬愛祕術如意法"],
["T21n1220","金剛藥叉瞋怒王息災大威神驗念誦儀軌"],
["T21n1221","青色大金剛藥叉辟鬼魔法"],
["T21n1222a","聖迦抳忿怒金剛童子菩薩成就儀軌經"],
["T21n1222b","聖迦柅忿怒金剛童子菩薩成就儀軌經"],
["T21n1223","佛說無量壽佛化身大忿迅俱摩羅金剛念誦瑜伽儀軌法"],
["T21n1224","金剛童子持念經"],
["T21n1225","大威怒烏芻澀麼儀軌經"],
["T21n1226","烏芻澀明王儀軌梵字"],
["T21n1227","大威力烏樞瑟摩明王經"],
["T21n1228","穢跡金剛說神通大滿陀羅尼法術靈要門"],
["T21n1229","穢跡金剛禁百變法經"],
["T21n1230","佛說大輪金剛總持陀羅尼經"],
["T21n1231","大輪金剛修行悉地成就及供養法"],
["T21n1232","播般曩結使波金剛念誦儀"],
["T21n1233","佛說無能勝大明王陀羅尼經"],
["T21n1234","無能勝大明陀羅尼經"],
["T21n1235","無能勝大明心陀羅尼經"],
["T21n1236","聖無能勝金剛火陀羅尼經"],
["T21n1237","阿吒婆拘鬼神大將上佛陀羅尼神咒經"],
["T21n1238","阿吒婆[牛*句]鬼神大將上佛陀羅尼經"],
["T21n1239","阿吒薄俱元帥大將上佛陀羅尼經修行儀軌"],
["T21n1240","阿吒薄[牛*句]付囑咒"],
["T21n1241","伽馱金剛真言"],
["T21n1242","佛說妙吉祥瑜伽大教金剛陪囉嚩輪觀想成就儀軌經"],
["T21n1243","佛說出生一切如來法眼遍照大力明王經"],
["T21n1244","毘沙門天王經"],
["T21n1245","佛說毘沙門天王經"],
["T21n1246","摩訶吠室囉末那野提婆喝囉闍陀羅尼儀軌"],
["T21n1247","北方毘沙門天王隨軍護法儀軌"],
["T21n1248","北方毘沙門天王隨軍護法真言"],
["T21n1249","毘沙門儀軌"],
["T21n1250","北方毘沙門多聞寶藏天王神妙陀羅尼別行儀軌"],
["T21n1251","吽迦陀野儀軌"],
["T21n1252a","佛說大吉祥天女十二名號經"],
["T21n1252b","佛說大吉祥天女十二名號經"],
["T21n1253","大吉祥天女十二契一百八名無垢大乘經"],
["T21n1254","末利支提婆華鬘經"],
["T21n1255a","佛說摩利支天菩薩陀羅尼經"],
["T21n1255b","佛說摩利支天經"],
["T21n1256","佛說摩利支天陀羅尼咒經"],
["T21n1257","佛說大摩里支菩薩經"],
["T21n1258","摩利支菩薩略念誦法"],
["T21n1259","摩利支天一印法"],
["T21n1260","大藥叉女歡喜母并愛子成就法"],
["T21n1261","訶利帝母真言經"],
["T21n1262","佛說鬼子母經"],
["T21n1263","冰揭羅天童子經"],
["T21n1264a","觀自在菩薩化身蘘麌哩曳童女銷伏毒害陀羅尼經"],
["T21n1264b","佛說穰麌梨童女經"],
["T21n1265","佛說常瞿利毒女陀羅尼咒經"],
["T21n1266","大聖天歡喜雙身毘那夜迦法"],
["T21n1267","使咒法經"],
["T21n1268","大使咒法經"],
["T21n1269","佛說金色迦那缽底陀羅尼經"],
["T21n1270","大聖歡喜雙身大自在天毘那夜迦王歸依念誦供養法"],
["T21n1271","摩訶毘盧遮那如來定惠均等入三昧耶身雙身大聖歡喜天菩薩修行祕密法儀軌"],
["T21n1272","金剛薩埵說頻那夜迦天成就儀軌經"],
["T21n1273","毘那夜迦誐那缽底瑜伽悉地品祕要"],
["T21n1274","大聖歡喜雙身毘那夜迦天形像品儀軌"],
["T21n1275","聖歡喜天式法"],
["T21n1276","文殊師利菩薩根本大教王經金翅鳥王品"],
["T21n1277","速疾立驗魔醯首羅天說阿尾奢法"],
["T21n1278","迦樓羅及諸天密言經"],
["T21n1279","摩醯首羅天法要"],
["T21n1280","摩醯首羅大自在天王神通化生伎藝天女念誦法"],
["T21n1281","那羅延天共阿修羅王鬥戰法"],
["T21n1282","寶藏天女陀羅尼法"],
["T21n1283","佛說寶藏神大明曼拏羅儀軌經"],
["T21n1284","佛說聖寶藏神儀軌經"],
["T21n1285","佛說寶賢陀羅尼經"],
["T21n1286","堅牢地天儀軌"],
["T21n1287","大黑天神法"],
["T21n1288","佛說最上祕密那拏天經"],
["T21n1289","佛說金毘羅童子威德經"],
["T21n1290","焰羅王供行法次第"],
["T21n1291","深沙大將儀軌"],
["T21n1292","法華十羅剎法"],
["T21n1293","般若守護十六善神王形體"],
["T21n1294","施八方天儀則"],
["T21n1295","供養護世八天法"],
["T21n1296","十天儀軌"],
["T21n1297","供養十二大威德天報恩品"],
["T21n1298","十二天供儀軌"],
["T21n1299","文殊師利菩薩及諸仙所說吉凶時日善惡宿曜經"],
["T21n1300","摩登伽經"],
["T21n1301","舍頭諫太子二十八宿經"],
["T21n1302","諸星母陀羅尼經"],
["T21n1303","佛說聖曜母陀羅尼經"],
["T21n1304","宿曜儀軌"],
["T21n1305","北斗七星念誦儀軌"],
["T21n1306","北斗七星護摩祕要儀軌"],
["T21n1307","佛說北斗七星延命經"],
["T21n1308","七曜攘災決"],
["T21n1309","七曜星辰別行法"],
["T21n1310","北斗七星護摩法"],
["T21n1311","梵天火羅九曜"],
["T21n1312","難你計濕嚩囉天說支輪經"],
["T21n1313","佛說救拔焰口餓鬼陀羅尼經"],
["T21n1314","佛說救面然餓鬼陀羅尼神咒經"],
["T21n1315","施諸餓鬼飲食及水法"],
["T21n1316","佛說甘露經陀羅尼咒"],
["T21n1317","甘露陀羅尼咒"],
["T21n1318","瑜伽集要救阿難陀羅尼焰口軌儀經"],
["T21n1319","瑜伽集要焰口施食起教阿難陀緣由"],
["T21n1320","瑜伽集要焰口施食儀"],
["T21n1321","佛說施餓鬼甘露味大陀羅尼經"],
["T21n1322","新集浴像儀軌"],
["T21n1323","除一切疾病陀羅尼經"],
["T21n1324","能淨一切眼疾病陀羅尼經"],
["T21n1325","佛說療痔病經"],
["T21n1326","佛說咒時氣病經"],
["T21n1327","佛說咒齒經"],
["T21n1328","佛說咒目經"],
["T21n1329","佛說咒小兒經"],
["T21n1330","囉嚩拏說救療小兒疾病經"],
["T21n1331","佛說灌頂經"],
["T21n1332","七佛八菩薩所說大陀羅尼神咒經"],
["T21n1333","虛空藏菩薩問七佛陀羅尼咒經"],
["T21n1334","如來方便善巧咒經"],
["T21n1335","大吉義神咒經"],
["T21n1336","陀羅尼雜集"],
["T21n1337","種種雜咒經"],
["T21n1338","咒三首經"],
["T21n1339","大方等陀羅尼經"],
["T21n1340","大法炬陀羅尼經"],
["T21n1341","大威德陀羅尼經"],
["T21n1342","佛說無崖際總持法門經"],
["T21n1343","尊勝菩薩所問一切諸法入無量門陀羅尼經"],
["T21n1344","金剛上味陀羅尼經"],
["T21n1345","金剛場陀羅尼經"],
["T21n1346","諸佛集會陀羅尼經"],
["T21n1347","息除中夭陀羅尼經"],
["T21n1348","佛說十二佛名神咒校量功德除障滅罪經"],
["T21n1349","佛說稱讚如來功德神咒經"],
["T21n1350","佛說一切如來名號陀羅尼經"],
["T21n1351","佛說持句神咒經"],
["T21n1352","佛說陀鄰尼缽經"],
["T21n1353","東方最勝燈王陀羅尼經"],
["T21n1354","東方最勝燈王如來經"],
["T21n1355","佛說聖最上燈明如來陀羅尼經"],
["T21n1356","佛說華積陀羅尼神咒經"],
["T21n1357","佛說師子奮迅菩薩所問經"],
["T21n1358","佛說花聚陀羅尼咒經"],
["T21n1359","佛說花積樓閣陀羅尼經"],
["T21n1360","六門陀羅尼經"],
["T21n1361","六門陀羅尼經論"],
["T21n1362","佛說善夜經"],
["T21n1363","勝幢臂印陀羅尼經"],
["T21n1364","妙臂印幢陀羅尼經"],
["T21n1365","八名普密陀羅尼經"],
["T21n1366","佛說祕密八名陀羅尼經"],
["T21n1367","佛說大普賢陀羅尼經"],
["T21n1368","佛說大七寶陀羅尼經"],
["T21n1369a","百千印陀羅尼經"],
["T21n1369b","百千印陀羅尼經"],
["T21n1370","佛說持明藏八大總持王經"],
["T21n1371","佛說聖大總持王經"],
["T21n1372","增慧陀羅尼經"],
["T21n1373","佛說施一切無畏陀羅尼經"],
["T21n1374","佛說一切功德莊嚴王經"],
["T21n1375","佛說莊嚴王陀羅尼咒經"],
["T21n1376","佛說聖莊嚴陀羅尼經"],
["T21n1377","佛說寶帶陀羅尼經"],
["T21n1378a","佛說玄師颰陀所說神咒經"],
["T21n1378b","幻師颰陀神咒經"],
["T21n1379","佛說大愛陀羅尼經"],
["T21n1380","佛說善樂長者經"],
["T21n1381","佛說大吉祥陀羅尼經"],
["T21n1382","佛說宿命智陀羅尼"],
["T21n1383","佛說宿命智陀羅尼經"],
["T21n1384","佛說缽蘭那賒嚩哩大陀羅尼經"],
["T21n1385","佛說俱枳羅陀羅尼經"],
["T21n1386","佛說妙色陀羅尼經"],
["T21n1387","佛說栴檀香身陀羅尼經"],
["T21n1388","佛說無畏陀羅尼經"],
["T21n1389","佛說無量壽大智陀羅尼"],
["T21n1390","佛說洛叉陀羅尼經"],
["T21n1391","佛說檀特羅麻油述經"],
["T21n1392","大寒林聖難拏陀羅尼經"],
["T21n1393","佛說摩尼羅亶經"],
["T21n1394","佛說安宅神咒經"],
["T21n1395","拔濟苦難陀羅尼經"],
["T21n1396","佛說拔除罪障咒王經"],
["T21n1397","智炬陀羅尼經"],
["T21n1398","佛說智光滅一切業障陀羅尼經"],
["T21n1399","佛說滅除五逆罪大陀羅尼經"],
["T21n1400","佛說消除一切災障寶髻陀羅尼經"],
["T21n1401","佛說大金剛香陀羅尼經"],
["T21n1402","消除一切閃電障難隨求如意陀羅尼經"],
["T21n1403","佛說如意摩尼陀羅尼經"],
["T21n1404","佛說如意寶總持王經"],
["T21n1405","佛說息除賊難陀羅尼經"],
["T21n1406","佛說辟除賊害咒經"],
["T21n1407","佛說辟除諸惡陀羅尼經"],
["T21n1408","佛說最上意陀羅尼經"],
["T21n1409","佛說聖最勝陀羅尼經"],
["T21n1410","佛說勝幡瓔珞陀羅尼經"],
["T21n1411","佛說蓮華眼陀羅尼經"],
["T21n1412","佛說寶生陀羅尼經"],
["T21n1413","佛說尊勝大明王經"],
["T21n1414","佛說金身陀羅尼經"],
["T21n1415","大金剛妙高山樓閣陀羅尼"],
["T21n1416","金剛摧碎陀羅尼"],
["T21n1417","佛說壞相金剛陀羅尼經"],
["T21n1418","佛說一切如來安像三昧儀軌經"],
["T21n1419","佛說造像量度經解"],
["T21n1420","龍樹五明論"],
["T22n1421","彌沙塞部和醯五分律"],
["T22n1422a","彌沙塞五分戒本"],
["T22n1422b","五分戒本"],
["T22n1423","五分比丘尼戒本"],
["T22n1424","彌沙塞羯磨本"],
["T22n1425","摩訶僧祇律"],
["T22n1426","摩訶僧祇律大比丘戒本"],
["T22n1427","摩訶僧祇比丘尼戒本"],
["T22n1428","四分律"],
["T22n1429","四分律比丘戒本"],
["T22n1430","四分僧戒本"],
["T22n1431","四分比丘尼戒本"],
["T22n1432","曇無德律部雜羯磨"],
["T22n1433","羯磨"],
["T22n1434","四分比丘尼羯磨法"],
["T23n1435","十誦律"],
["T23n1436","十誦比丘波羅提木叉戒本"],
["T23n1437","十誦比丘尼波羅提木叉戒本"],
["T23n1438","大沙門百一羯磨法"],
["T23n1439","十誦羯磨比丘要用"],
["T23n1440","薩婆多毘尼毘婆沙"],
["T23n1441","薩婆多部毘尼摩得勒伽"],
["T23n1442","根本說一切有部毘奈耶"],
["T23n1443","根本說一切有部苾芻尼毘奈耶"],
["T23n1444","根本說一切有部毘奈耶出家事"],
["T23n1445","根本說一切有部毘奈耶安居事"],
["T23n1446","根本說一切有部毘奈耶隨意事"],
["T23n1447","根本說一切有部毘奈耶皮革事"],
["T24n1448","根本說一切有部毘奈耶藥事"],
["T24n1449","根本說一切有部毘奈耶羯恥那衣事"],
["T24n1450","根本說一切有部毘奈耶破僧事"],
["T24n1451","根本說一切有部毘奈耶雜事"],
["T24n1452","根本說一切有部尼陀那目得迦"],
["T24n1453","根本說一切有部百一羯磨"],
["T24n1454","根本說一切有部戒經"],
["T24n1455","根本說一切有部苾芻尼戒經"],
["T24n1456","根本說一切有部毘奈耶尼陀那目得迦攝頌"],
["T24n1457","根本說一切有部略毘奈耶雜事攝頌"],
["T24n1458","根本薩婆多部律攝"],
["T24n1459","根本說一切有部毘奈耶頌"],
["T24n1460","解脫戒經"],
["T24n1461","律二十二明了論"],
["T24n1462","善見律毘婆沙"],
["T24n1463","毘尼母經"],
["T24n1464","鼻奈耶"],
["T24n1465","舍利弗問經"],
["T24n1466","優波離問佛經"],
["T24n1467a","佛說犯戒罪報輕重經"],
["T24n1467b","佛說犯戒罪報輕重經"],
["T24n1468","佛說目連所問經"],
["T24n1469","佛說迦葉禁戒經"],
["T24n1470","大比丘三千威儀"],
["T24n1471","沙彌十戒法并威儀"],
["T24n1472","沙彌威儀"],
["T24n1473","佛說沙彌十戒儀則經"],
["T24n1474","沙彌尼戒經"],
["T24n1475","沙彌尼離戒文"],
["T24n1476","佛說優婆塞五戒相經"],
["T24n1477","佛說戒消災經"],
["T24n1478","大愛道比丘尼經"],
["T24n1479","佛說苾芻五法經"],
["T24n1480","佛說苾芻迦尸迦十法經"],
["T24n1481","佛說五恐怖世經"],
["T24n1482","佛阿毘曇經出家相品"],
["T24n1483a","佛說目連問戒律中五百輕重事"],
["T24n1483b","佛說目連問戒律中五百輕重事經"],
["T24n1484","梵網經"],
["T24n1485","菩薩瓔珞本業經"],
["T24n1486","受十善戒經"],
["T24n1487","佛說菩薩內戒經"],
["T24n1488","優婆塞戒經"],
["T24n1489","清淨毘尼方廣經"],
["T24n1490","寂調音所問經"],
["T24n1491","菩薩藏經"],
["T24n1492","佛說舍利弗悔過經"],
["T24n1493","大乘三聚懺悔經"],
["T24n1494","佛說淨業障經"],
["T24n1495","善恭敬經"],
["T24n1496","佛說正恭敬經"],
["T24n1497","佛說大乘戒經"],
["T24n1498","佛說八種長養功德經"],
["T24n1499","菩薩戒羯磨文"],
["T24n1500","菩薩戒本"],
["T24n1501","菩薩戒本"],
["T24n1502","菩薩受齋經"],
["T24n1503","優婆塞五戒威儀經"],
["T24n1504","菩薩五法懺悔文"],
["T25n1505","四阿鋡暮抄解"],
["T25n1506","三法度論"],
["T25n1507","分別功德論"],
["T25n1508","阿含口解十二因緣經"],
["T25n1509","大智度論"],
["T25n1510a","金剛般若論"],
["T25n1510b","金剛般若波羅蜜經論"],
["T25n1511","金剛般若波羅蜜經論"],
["T25n1512","金剛仙論"],
["T25n1513","能斷金剛般若波羅蜜多經論釋"],
["T25n1514","能斷金剛般若波羅蜜多經論頌"],
["T25n1515","金剛般若波羅蜜經破取著不壞假名論"],
["T25n1516","聖佛母般若波羅蜜多九頌精義論"],
["T25n1517","佛母般若波羅蜜多圓集要義釋論"],
["T25n1518","佛母般若波羅蜜多圓集要義論"],
["T26n1519","妙法蓮華經憂波提舍"],
["T26n1520","妙法蓮華經論優波提舍"],
["T26n1521","十住毘婆沙論"],
["T26n1522","十地經論"],
["T26n1523","大寶積經論"],
["T26n1524","無量壽經優波提舍"],
["T26n1525","彌勒菩薩所問經論"],
["T26n1526","寶髻經四法憂波提舍"],
["T26n1527","涅槃論"],
["T26n1528","涅槃經本有今無偈論"],
["T26n1529","遺教經論"],
["T26n1530","佛地經論"],
["T26n1531","文殊師利菩薩問菩提經論"],
["T26n1532","勝思惟梵天所問經論"],
["T26n1533","轉法輪經憂波提舍"],
["T26n1534","三具足經憂波提舍"],
["T26n1535","大乘四法經釋"],
["T26n1536","阿毘達磨集異門足論"],
["T26n1537","阿毘達磨法蘊足論"],
["T26n1538","施設論"],
["T26n1539","阿毘達磨識身足論"],
["T26n1540","阿毘達磨界身足論"],
["T26n1541","眾事分阿毘曇論"],
["T26n1542","阿毘達磨品類足論"],
["T26n1543","阿毘曇八犍度論"],
["T26n1544","阿毘達磨發智論"],
["T27n1545","阿毘達磨大毘婆沙論"],
["T28n1546","阿毘曇毘婆沙論"],
["T28n1547","鞞婆沙論"],
["T28n1548","舍利弗阿毘曇論"],
["T28n1549","尊婆須蜜菩薩所集論"],
["T28n1550","阿毘曇心論"],
["T28n1551","阿毘曇心論經"],
["T28n1552","雜阿毘曇心論"],
["T28n1553","阿毘曇甘露味論"],
["T28n1554","入阿毘達磨論"],
["T28n1555","五事毘婆沙論"],
["T28n1556","薩婆多宗五事論"],
["T28n1557","阿毘曇五法行經"],
["T29n1558","阿毘達磨俱舍論"],
["T29n1559","阿毘達磨俱舍釋論"],
["T29n1560","阿毘達磨俱舍論本頌"],
["T29n1561","俱舍論實義疏"],
["T29n1562","阿毘達磨順正理論"],
["T29n1563","阿毘達磨藏顯宗論"],
["T30n1564","中論"],
["T30n1565","順中論"],
["T30n1566","般若燈論釋"],
["T30n1567","大乘中觀釋論"],
["T30n1568","十二門論"],
["T30n1569","百論"],
["T30n1570","廣百論本"],
["T30n1571","大乘廣百論釋論"],
["T30n1572","百字論"],
["T30n1573","壹輸盧迦論"],
["T30n1574","大乘破有論"],
["T30n1575","六十頌如理論"],
["T30n1576","大乘二十頌論"],
["T30n1577","大丈夫論"],
["T30n1578","大乘掌珍論"],
["T30n1579","瑜伽師地論"],
["T30n1580","瑜伽師地論釋"],
["T30n1581","菩薩地持經"],
["T30n1582","菩薩善戒經"],
["T30n1583","菩薩善戒經"],
["T30n1584","決定藏論"],
["T31n1585","成唯識論"],
["T31n1586","唯識三十論頌"],
["T31n1587","轉識論"],
["T31n1588","唯識論"],
["T31n1589","大乘唯識論"],
["T31n1590","唯識二十論"],
["T31n1591","成唯識寶生論"],
["T31n1592","攝大乘論"],
["T31n1593","攝大乘論"],
["T31n1594","攝大乘論本"],
["T31n1595","攝大乘論釋"],
["T31n1596","攝大乘論釋論"],
["T31n1597","攝大乘論釋"],
["T31n1598","攝大乘論釋"],
["T31n1599","中邊分別論"],
["T31n1600","辯中邊論"],
["T31n1601","辯中邊論頌"],
["T31n1602","顯揚聖教論"],
["T31n1603","顯揚聖教論頌"],
["T31n1604","大乘莊嚴經論"],
["T31n1605","大乘阿毘達磨集論"],
["T31n1606","大乘阿毘達磨雜集論"],
["T31n1607","六門教授習定論"],
["T31n1608","業成就論"],
["T31n1609","大乘成業論"],
["T31n1610","佛性論"],
["T31n1611","究竟一乘寶性論"],
["T31n1612","大乘五蘊論"],
["T31n1613","大乘廣五蘊論"],
["T31n1614","大乘百法明門論"],
["T31n1615","王法正理論"],
["T31n1616","十八空論"],
["T31n1617","三無性論"],
["T31n1618","顯識論"],
["T31n1619","無相思塵論"],
["T31n1620","解捲論"],
["T31n1621","掌中論"],
["T31n1622","取因假設論"],
["T31n1623","觀總相論頌"],
["T31n1624","觀所緣緣論"],
["T31n1625","觀所緣論釋"],
["T31n1626","大乘法界無差別論"],
["T31n1627","大乘法界無差別論"],
["T32n1628","因明正理門論本"],
["T32n1629","因明正理門論"],
["T32n1630","因明入正理論"],
["T32n1631","迴諍論"],
["T32n1632","方便心論"],
["T32n1633","如實論"],
["T32n1634","入大乘論"],
["T32n1635","大乘寶要義論"],
["T32n1636","大乘集菩薩學論"],
["T32n1637","集大乘相論"],
["T32n1638","集諸法寶最上義論"],
["T32n1639","提婆菩薩破楞伽經中外道小乘四宗論"],
["T32n1640","提婆菩薩釋楞伽經中外道小乘涅槃論"],
["T32n1641","隨相論"],
["T32n1642","金剛針論"],
["T32n1643","尼乾子問無我義經"],
["T32n1644","佛說立世阿毘曇論"],
["T32n1645","彰所知論"],
["T32n1646","成實論"],
["T32n1647","四諦論"],
["T32n1648","解脫道論"],
["T32n1649","三彌底部論"],
["T32n1650","辟支佛因緣論"],
["T32n1651","十二因緣論"],
["T32n1652","緣生論"],
["T32n1653","大乘緣生論"],
["T32n1654","因緣心論頌因緣心論釋"],
["T32n1655","止觀門論頌"],
["T32n1656","寶行王正論"],
["T32n1657","手杖論"],
["T32n1658","諸教決定名義論"],
["T32n1659","發菩提心經論"],
["T32n1660","菩提資糧論"],
["T32n1661","菩提心離相論"],
["T32n1662","菩提行經"],
["T32n1663","菩提心觀釋"],
["T32n1664","廣釋菩提心論"],
["T32n1665","金剛頂瑜伽中發阿耨多羅三藐三菩提心論"],
["T32n1666","大乘起信論"],
["T32n1667","大乘起信論"],
["T32n1668","釋摩訶衍論"],
["T32n1669","大宗地玄文本論"],
["T32n1671","福蓋正行所集經"],
["T32n1672","龍樹菩薩為禪陀迦王說法要偈"],
["T32n1673","勸發諸王要偈"],
["T32n1674","龍樹菩薩勸誡王頌"],
["T32n1675","讚法界頌"],
["T32n1676","廣大發願頌"],
["T32n1677","三身梵讚"],
["T32n1678","佛三身讚"],
["T32n1679","佛一百八名讚"],
["T32n1680","一百五十讚佛頌"],
["T32n1681","佛吉祥德讚"],
["T32n1682","七佛讚唄伽他"],
["T32n1683","犍稚梵讚"],
["T32n1684","八大靈塔梵讚"],
["T32n1685","佛說八大靈塔名號經"],
["T32n1686","賢聖集伽陀一百頌"],
["T32n1687","事師法五十頌"],
["T32n1688","密跡力士大權神王經偈頌"],
["T32n1689","請賓頭盧法"],
["T32n1690","賓頭盧突羅闍為優陀延王說法經"],
["T32n1691","迦葉仙人說醫女人經"],
["T32n1692","勝軍化世百喻伽他經"],
["T33n1693","人本欲生經註"],
["T33n1694","陰持入經註"],
["T33n1695","大般若波羅蜜多經般若理趣分述讚"],
["T33n1696","大品經遊意"],
["T33n1697","大慧度經宗要"],
["T33n1698","金剛般若經疏"],
["T33n1699","金剛般若疏"],
["T33n1700","金剛般若經贊述"],
["T33n1701","金剛般若經疏論纂要"],
["T33n1702","金剛經纂要刊定記"],
["T33n1703","金剛般若波羅蜜經註解"],
["T33n1704","金剛般若波羅蜜經略疏"],
["T33n1705","仁王護國般若經疏"],
["T33n1706","仁王護國般若波羅蜜經疏神寶記"],
["T33n1707","仁王般若經疏"],
["T33n1708","仁王經疏"],
["T33n1709","仁王護國般若波羅蜜多經疏"],
["T33n1710","般若波羅蜜多心經幽贊"],
["T33n1711","般若波羅蜜多心經贊"],
["T33n1712","般若波羅蜜多心經略疏"],
["T33n1713","般若心經略疏連珠記"],
["T33n1714","般若波羅蜜多心經註解"],
["T33n1715","法華經義記"],
["T33n1716","妙法蓮華經玄義"],
["T33n1717","法華玄義釋籤"],
["T34n1718","妙法蓮華經文句"],
["T34n1719","法華文句記"],
["T34n1720","法華玄論"],
["T34n1721","法華義疏"],
["T34n1722","法華遊意"],
["T34n1723","妙法蓮華經玄贊"],
["T34n1724","法華玄贊義決"],
["T34n1725","法華宗要"],
["T34n1726","觀音玄義"],
["T34n1727","觀音玄義記"],
["T34n1728","觀音義疏"],
["T34n1729","觀音義疏記"],
["T34n1730","金剛三昧經論"],
["T35n1731","華嚴遊意"],
["T35n1732","大方廣佛華嚴經搜玄分齊通智方軌"],
["T35n1733","華嚴經探玄記"],
["T35n1734","花嚴經文義綱目"],
["T35n1735","大方廣佛華嚴經疏"],
["T36n1736","大方廣佛華嚴經隨疏演義鈔"],
["T36n1737","大華嚴經略策"],
["T36n1738","新譯華嚴經七處九會頌釋章"],
["T36n1739","新華嚴經論"],
["T36n1740","大方廣佛華嚴經中卷卷大意略敘"],
["T36n1741","略釋新華嚴經修行次第決疑論"],
["T36n1742","大方廣佛華嚴經願行觀門骨目"],
["T36n1743","皇帝降誕日於麟德殿講大方廣佛華嚴經玄義一部"],
["T37n1744","勝鬘寶窟"],
["T37n1745","無量壽經義疏"],
["T37n1746","無量壽經義疏"],
["T37n1747","兩卷無量壽經宗要"],
["T37n1748","無量壽經連義述文贊"],
["T37n1749","觀無量壽經義疏"],
["T37n1750","觀無量壽佛經疏"],
["T37n1751","觀無量壽佛經疏妙宗鈔"],
["T37n1752","觀無量壽經義疏"],
["T37n1753","觀無量壽佛經疏"],
["T37n1754","觀無量壽佛經義疏"],
["T37n1755","阿彌陀經義記"],
["T37n1756","阿彌陀經義述"],
["T37n1757","阿彌陀經疏"],
["T37n1758","阿彌陀經通贊疏"],
["T37n1759","阿彌陀經疏"],
["T37n1760","阿彌陀經疏"],
["T37n1761","阿彌陀經義疏"],
["T37n1762","阿彌陀經要解"],
["T37n1763","大般涅槃經集解"],
["T37n1764","大般涅槃經義記"],
["T38n1765","大般涅槃經玄義"],
["T38n1766","涅槃玄義發源機要"],
["T38n1767","大般涅槃經疏"],
["T38n1768","涅槃經遊意"],
["T38n1769","涅槃宗要"],
["T38n1770","本願藥師經古跡"],
["T38n1771","彌勒經遊意"],
["T38n1772","觀彌勒上生兜率天經贊"],
["T38n1773","彌勒上生經宗要"],
["T38n1774","三彌勒經疏"],
["T38n1775","注維摩詰經"],
["T38n1776","維摩義記"],
["T38n1777","維摩經玄疏"],
["T38n1778","維摩經略疏"],
["T38n1779","維摩經略疏垂裕記"],
["T38n1780","淨名玄論"],
["T38n1781","維摩經義疏"],
["T38n1782","說無垢稱經疏"],
["T39n1783","金光明經玄義"],
["T39n1784","金光明經玄義拾遺記"],
["T39n1785","金光明經文句"],
["T39n1786","金光明經文句記"],
["T39n1787","金光明經疏"],
["T39n1788","金光明最勝王經疏"],
["T39n1789","楞伽阿跋多羅寶經註解"],
["T39n1790","入楞伽心玄義"],
["T39n1791","注大乘入楞伽經"],
["T39n1792","佛說盂蘭盆經疏"],
["T39n1793","溫室經義記"],
["T39n1794","註四十二章經"],
["T39n1795","大方廣圓覺修多羅了義經略疏"],
["T39n1796","大毘盧遮那成佛經疏"],
["T39n1797","大毘盧遮那經供養次第法疏"],
["T39n1798","金剛頂經大瑜伽祕密心地法門義訣"],
["T39n1799","首楞嚴義疏注經"],
["T39n1800","請觀音經疏"],
["T39n1801","請觀音經疏闡義鈔"],
["T39n1802","十一面神咒心經義疏"],
["T39n1803","佛頂尊勝陀羅尼經教跡義記"],
["T40n1804","四分律刪繁補闕行事鈔"],
["T40n1805","四分律行事鈔資持記"],
["T40n1806","四分律比丘含注戒本"],
["T40n1807","四分比丘戒本疏"],
["T40n1808","四分律刪補隨機羯磨"],
["T40n1809","僧羯磨"],
["T40n1810","尼羯磨"],
["T40n1811","菩薩戒義疏"],
["T40n1812","天台菩薩戒疏"],
["T40n1813","梵網經菩薩戒本疏"],
["T40n1814","菩薩戒本疏"],
["T40n1815","梵網經古跡記"],
["T40n1816","金剛般若論會釋"],
["T40n1817","略明般若末後一頌讚述"],
["T40n1818","法華論疏"],
["T40n1819","無量壽經優婆提舍願生偈註"],
["T40n1820","佛遺教經論疏節要"],
["T41n1821","俱舍論記"],
["T41n1822","俱舍論疏"],
["T41n1823","俱舍論頌疏論本"],
["T42n1824","中觀論疏"],
["T42n1825","十二門論疏"],
["T42n1826","十二門論宗致義記"],
["T42n1827","百論疏"],
["T42n1828","瑜伽論記"],
["T43n1829","瑜伽師地論略纂"],
["T43n1830","成唯識論述記"],
["T43n1831","成唯識論掌中樞要"],
["T43n1832","成唯識論了義燈"],
["T43n1833","成唯識論演祕"],
["T43n1834","唯識二十論述記"],
["T44n1835","辯中邊論述記"],
["T44n1836","大乘百法明門論解"],
["T44n1837","大乘百法明門論疏"],
["T44n1838","大乘法界無差別論疏"],
["T44n1839","理門論述記"],
["T44n1840","因明入正理論疏"],
["T44n1841","因明義斷"],
["T44n1842","因明入正理論義纂要"],
["T44n1843","大乘起信論義疏"],
["T44n1844","起信論疏"],
["T44n1845","大乘起信論別記"],
["T44n1846","大乘起信論義記"],
["T44n1847","大乘起信論義記別記"],
["T44n1848","起信論疏筆削記"],
["T44n1849","大乘起信論內義略探記"],
["T44n1850","大乘起信論裂網疏"],
["T44n1851","大乘義章"],
["T45n1852","三論玄義"],
["T45n1853","大乘玄論"],
["T45n1854","二諦義"],
["T45n1855","三論遊意義"],
["T45n1856","鳩摩羅什法師大義"],
["T45n1857","寶藏論"],
["T45n1858","肇論"],
["T45n1859","肇論疏"],
["T45n1860","肇論新疏"],
["T45n1861","大乘法苑義林章"],
["T45n1862","勸發菩提心集"],
["T45n1863","能顯中邊慧日論"],
["T45n1864","大乘入道次第"],
["T45n1865","八識規矩補註"],
["T45n1866","華嚴一乘教義分齊章"],
["T45n1867","華嚴五教止觀"],
["T45n1868","華嚴一乘十玄門"],
["T45n1869","華嚴五十要問答"],
["T45n1870","華嚴經內章門等雜孔目章"],
["T45n1871","華嚴經旨歸"],
["T45n1872","華嚴策林"],
["T45n1873","華嚴經問答"],
["T45n1874","華嚴經明法品內立三寶章"],
["T45n1875","華嚴經義海百門"],
["T45n1876","修華嚴奧旨妄盡還源觀"],
["T45n1877","華嚴遊心法界記"],
["T45n1878","華嚴發菩提心章"],
["T45n1879a","華嚴經關脈義記"],
["T45n1879b","華嚴關脈義記"],
["T45n1880","金師子章雲間類解"],
["T45n1881","華嚴經金師子章註"],
["T45n1882","三聖圓融觀門"],
["T45n1883","華嚴法界玄鏡"],
["T45n1884","註華嚴法界觀門"],
["T45n1885","註華嚴經題法界觀門頌"],
["T45n1886","原人論"],
["T45n1888","解迷顯智成悲十明論"],
["T45n1889","海印三昧論"],
["T45n1890","華嚴一乘成佛妙義"],
["T45n1891","文殊指南圖讚"],
["T45n1892","關中創立戒壇圖經"],
["T45n1893","淨心戒觀法"],
["T45n1894","釋門章服儀"],
["T45n1895","量處輕重儀"],
["T45n1896","釋門歸敬儀"],
["T45n1897","教誡新學比丘行護律儀"],
["T45n1898","律相感通傳"],
["T45n1899","中天竺舍衛國祇洹寺圖經"],
["T45n1900","佛制比丘六物圖"],
["T45n1901","護命放生軌儀法"],
["T45n1902","受用三水要行法"],
["T45n1903","說罪要行法"],
["T45n1904","根本說一切有部出家授近圓羯磨儀範"],
["T45n1905","根本說一切有部苾芻習學略法"],
["T45n1906","菩薩戒本宗要"],
["T45n1907","菩薩戒本持犯要記"],
["T45n1908","大乘六情懺悔"],
["T45n1909","慈悲道場懺法"],
["T45n1910","慈悲水懺法"],
["T46n1911","摩訶止觀"],
["T46n1912","止觀輔行傳弘決"],
["T46n1913","止觀義例"],
["T46n1914","止觀大意"],
["T46n1915","修習止觀坐禪法要"],
["T46n1916","釋禪波羅蜜次第法門"],
["T46n1917","六妙法門"],
["T46n1918","四念處"],
["T46n1919","天台智者大師禪門口訣"],
["T46n1920","觀心論"],
["T46n1921","觀心論疏"],
["T46n1922","釋摩訶般若波羅蜜經覺意三昧"],
["T46n1923","諸法無諍三昧法門"],
["T46n1924","大乘止觀法門"],
["T46n1925","法界次第初門"],
["T46n1926","法華經安樂行義"],
["T46n1927","十不二門"],
["T46n1928","十不二門指要鈔"],
["T46n1929","四教義"],
["T46n1930","天台八教大意"],
["T46n1931","天台四教儀"],
["T46n1932","金剛錍"],
["T46n1933","南嶽思大禪師立誓願文"],
["T46n1934","國清百錄"],
["T46n1935","法智遺編觀心二百問"],
["T46n1936","四明十義書"],
["T46n1937","四明尊者教行錄"],
["T46n1938","天台傳佛心印記"],
["T46n1939","教觀綱宗"],
["T46n1940","方等三昧行法"],
["T46n1941","法華三昧懺儀"],
["T46n1942","法華三昧行事運想補助儀"],
["T46n1943","略法華三昧補助儀"],
["T46n1944","禮法華經儀式"],
["T46n1945","金光明懺法補助儀"],
["T46n1946","金光明最勝懺儀"],
["T46n1947","釋迦如來涅槃禮讚文"],
["T46n1948","天台智者大師齋忌禮讚文"],
["T46n1949","請觀世音菩薩消伏毒害陀羅尼三昧儀"],
["T46n1950","千手眼大悲心咒行法"],
["T46n1951","熾盛光道場念誦儀"],
["T46n1952","觀自在菩薩如意輪咒課法"],
["T46n1953","菩提心義"],
["T46n1954","明佛法根本碑"],
["T46n1955","顯密圓通成佛心要集"],
["T46n1956","密咒圓因往生集"],
["T47n1957","略論安樂淨土義"],
["T47n1958","安樂集"],
["T47n1959","觀念阿彌陀佛相海三昧功德法門"],
["T47n1960","釋淨土群疑論"],
["T47n1961","淨土十疑論"],
["T47n1962","五方便念佛門"],
["T47n1963","淨土論"],
["T47n1964","西方要決釋疑通規"],
["T47n1965","遊心安樂道"],
["T47n1966","念佛鏡"],
["T47n1967","念佛三昧寶王論"],
["T47n1968","往生淨土決疑行願二門"],
["T47n1970","龍舒增廣淨土文"],
["T47n1971","淨土境觀要門"],
["T47n1972","淨土或問"],
["T47n1973","廬山蓮宗寶鑑"],
["T47n1974","寶王三昧念佛直指"],
["T47n1975","淨土生無生論"],
["T47n1976","西方合論"],
["T47n1977","淨土疑辨"],
["T47n1978","讚阿彌陀佛偈"],
["T47n1979","轉經行道願往生淨土法事讚"],
["T47n1980","往生禮讚偈"],
["T47n1981","依觀經等明般舟三昧行道往生讚"],
["T47n1982","集諸經禮懺儀"],
["T47n1983","淨土五會念佛略法事儀讚"],
["T47n1984","往生淨土懺願儀"],
["T47n1985","鎮州臨濟慧照禪師語錄"],
["T47n1988","雲門匡真禪師廣錄"],
["T47n1989","潭州溈山靈祐禪師語錄"],
["T47n1990","袁州仰山慧寂禪師語錄"],
["T47n1991","金陵清涼院文益禪師語錄"],
["T47n1992","汾陽無德禪師語錄"],
["T47n1993","黃龍慧南禪師語錄"],
["T47n1995","法演禪師語錄"],
["T47n1996","明覺禪師語錄"],
["T47n1997","圓悟佛果禪師語錄"],
["T47n1999","密菴和尚語錄"],
["T47n2000","虛堂和尚語錄"],
["T48n2001","宏智禪師廣錄"],
["T48n2003","佛果圜悟禪師碧巖錄"],
["T48n2004","萬松老人評唱天童覺和尚頌古從容庵錄"],
["T48n2005","無門關"],
["T48n2006","人天眼目"],
["T48n2007","南宗頓教最上大乘摩訶般若波羅蜜經六祖惠能大師於韶州大梵寺施法壇經"],
["T48n2008","六祖大師法寶壇經"],
["T48n2009","少室六門"],
["T48n2010","信心銘"],
["T48n2011","最上乘論"],
["T48n2013","禪宗永嘉集"],
["T48n2014","永嘉證道歌"],
["T48n2015","禪源諸詮集都序"],
["T48n2016","宗鏡錄"],
["T48n2017","萬善同歸集"],
["T48n2018","永明智覺禪師唯心訣"],
["T48n2020","高麗國普照禪師修心訣"],
["T48n2021","禪宗決疑集"],
["T48n2022","禪林寶訓"],
["T48n2023","緇門警訓"],
["T48n2024","禪關策進"],
["T48n2025","敕修百丈清規"],
["T49n2026","撰集三藏及雜藏傳"],
["T49n2027","迦葉結經"],
["T49n2028","迦丁比丘說當來變經"],
["T49n2029","佛使比丘迦旃延說法沒盡偈百二十章"],
["T49n2030","大阿羅漢難提蜜多羅所說法住記"],
["T49n2031","異部宗輪論"],
["T49n2032","十八部論"],
["T49n2033","部執異論"],
["T49n2034","歷代三寶紀"],
["T49n2035","佛祖統紀"],
["T49n2036","佛祖歷代通載"],
["T49n2037","釋氏稽古略"],
["T49n2038","釋鑑稽古略續集"],
["T49n2039","三國遺事"],
["T50n2040","釋迦譜"],
["T50n2041","釋迦氏譜"],
["T50n2042","阿育王傳"],
["T50n2043","阿育王經"],
["T50n2044","天尊說阿育王譬喻經"],
["T50n2045","阿育王息壞目因緣經"],
["T50n2046","馬鳴菩薩傳"],
["T50n2047a","龍樹菩薩傳"],
["T50n2047b","龍樹菩薩傳"],
["T50n2048","提婆菩薩傳"],
["T50n2049","婆藪槃豆法師傳"],
["T50n2050","隋天台智者大師別傳"],
["T50n2051","唐護法沙門法琳別傳"],
["T50n2052","大唐故三藏玄奘法師行狀"],
["T50n2053","大唐大慈恩寺三藏法師傳"],
["T50n2054","唐大薦福寺故寺主翻經大德法藏和尚傳"],
["T50n2055","玄宗朝翻經三藏善無畏贈鴻臚卿行狀"],
["T50n2056","大唐故大德贈司空大辨正廣智不空三藏行狀"],
["T50n2057","大唐青龍寺三朝供奉大德行狀"],
["T50n2058","付法藏因緣傳"],
["T50n2059","高僧傳"],
["T50n2060","續高僧傳"],
["T50n2061","宋高僧傳"],
["T50n2062","大明高僧傳"],
["T50n2063","比丘尼傳"],
["T50n2064","神僧傳"],
["T50n2065","海東高僧傳"],
["T51n2066","大唐西域求法高僧傳"],
["T51n2067","弘贊法華傳"],
["T51n2068","法華傳記"],
["T51n2069","天台九祖傳"],
["T51n2070","往生西方淨土瑞應傳"],
["T51n2071","淨土往生傳"],
["T51n2072","往生集"],
["T51n2073","華嚴經傳記"],
["T51n2074","大方廣佛華嚴經感應傳"],
["T51n2075","曆代法寶記"],
["T51n2076","景德傳燈錄"],
["T51n2077","續傳燈錄"],
["T51n2078","傳法正宗記"],
["T51n2079","傳法正宗定祖圖"],
["T51n2080","傳法正宗論"],
["T51n2081","兩部大法相承師資付法記"],
["T51n2082","冥報記"],
["T51n2083","釋門自鏡錄"],
["T51n2084","三寶感應要略錄"],
["T51n2085","高僧法顯傳"],
["T51n2086","北魏僧惠生使西域記"],
["T51n2087","大唐西域記"],
["T51n2088","釋迦方志"],
["T51n2089","遊方記抄"],
["T51n2090","釋迦牟尼如來像法滅盡之記"],
["T51n2091","燉煌錄"],
["T51n2092","洛陽伽藍記"],
["T51n2093","寺塔記"],
["T51n2094","梁京寺記"],
["T51n2095","廬山記"],
["T51n2096","天台山記"],
["T51n2097","南嶽總勝集"],
["T51n2098","古清涼傳"],
["T51n2099","廣清涼傳"],
["T51n2100","續清涼傳"],
["T51n2101","補陀洛迦山傳"],
["T52n2102","弘明集"],
["T52n2103","廣弘明集"],
["T52n2104","集古今佛道論衡"],
["T52n2105","續集古今佛道論衡"],
["T52n2106","集神州三寶感通錄"],
["T52n2107","道宣律師感通錄"],
["T52n2108","集沙門不應拜俗等事"],
["T52n2109","破邪論"],
["T52n2110","辯正論"],
["T52n2111","十門辯惑論"],
["T52n2112","甄正論"],
["T52n2113","北山錄"],
["T52n2114","護法論"],
["T52n2115","鐔津文集"],
["T52n2116","辯偽錄"],
["T52n2117","三教平心論"],
["T52n2118","折疑論"],
["T52n2119","寺沙門玄奘上表記"],
["T52n2120","代宗朝贈司空大辨正廣智三藏和上表制集"],
["T53n2121","經律異相"],
["T53n2122","法苑珠林"],
["T54n2123","諸經要集"],
["T54n2124","法門名義集"],
["T54n2125","南海寄歸內法傳"],
["T54n2126","大宋僧史略"],
["T54n2127","釋氏要覽"],
["T54n2128","一切經音義"],
["T54n2129","續一切經音義"],
["T54n2130","翻梵語"],
["T54n2131","翻譯名義集"],
["T54n2132","悉曇字記"],
["T54n2134","唐梵文字"],
["T54n2135","梵語雜名"],
["T54n2136","唐梵兩語雙對集"],
["T54n2137","金七十論"],
["T54n2138","勝宗十句義論"],
["T54n2139","老子化胡經"],
["T54n2140","摩尼教下部讚"],
["T54n2142","序聽迷詩所經"],
["T54n2143","景教三威蒙度讚"],
["T54n2144","大秦景教流行中國碑頌"],
["T55n2145","出三藏記集"],
["T55n2146","眾經目錄"],
["T55n2147","眾經目錄"],
["T55n2148","眾經目錄"],
["T55n2149","大唐內典錄"],
["T55n2150","續大唐內典錄"],
["T55n2151","古今譯經圖紀"],
["T55n2152","續古今譯經圖紀"],
["T55n2153","大周刊定眾經目錄"],
["T55n2154","開元釋教錄"],
["T55n2155","開元釋教錄略出"],
["T55n2156","大唐貞元續開元釋教錄"],
["T55n2157","貞元新定釋教目錄"],
["T55n2158","續貞元釋教錄"],
["T55n2159","傳教大師將來台州錄"],
["T55n2160","傳教大師將來越州錄"],
["T55n2161","御請來目錄"],
["T55n2162","根本大和尚真跡策子等目錄"],
["T55n2163","常曉和尚請來目錄"],
["T55n2164","靈巖寺和尚請來法門道具等目錄"],
["T55n2165","日本國承和五年入唐求法目錄"],
["T55n2166","慈覺大師在唐送進錄"],
["T55n2167","入唐新求聖教目錄"],
["T55n2169","開元寺求得經疏記等目錄"],
["T55n2170","福州溫州台州求得經律論疏記外書等目錄"],
["T55n2171","青龍寺求法目錄"],
["T55n2172","日本比丘圓珍入唐求法目錄"],
["T55n2173","智證大師請來目錄"],
["T55n2175","錄外經等目錄"],
["T55n2176","諸阿闍梨真言密教部類總錄"],
["T55n2177","華嚴宗章疏并因明錄"],
["T55n2178","天台宗章疏"],
["T55n2179","三論宗章疏"],
["T55n2180","法相宗章疏"],
["T55n2181","注進法相宗章疏"],
["T55n2182","律宗章疏"],
["T55n2183","東域傳燈目錄"],
["T55n2184","新編諸宗教藏總錄"],
["T85n2732","梁朝傅大士頌金剛經"],
["T85n2733","御注金剛般若波羅蜜經宣演"],
["T85n2734","金剛映卷上"],
["T85n2735","金剛般若經旨贊"],
["T85n2736","金剛般若經依天親菩薩論贊略釋秦本義記卷上"],
["T85n2737","金剛經疏"],
["T85n2738","金剛經疏"],
["T85n2739","金剛般若經挾註"],
["T85n2740","金剛般若義記"],
["T85n2741","金剛般若經疏"],
["T85n2742","金剛般若波羅蜜經傳外傳卷下"],
["T85n2743","持誦金剛經靈驗功德記"],
["T85n2744","仁王般若實相論卷第二"],
["T85n2745","仁王經疏"],
["T85n2746","般若波羅蜜多心經還源述"],
["T85n2747","挾註波羅蜜多心經"],
["T85n2748","法華義記卷第三"],
["T85n2749","法華經疏"],
["T85n2750","法華經疏"],
["T85n2751","法華經疏"],
["T85n2752","法華問答"],
["T85n2753","華嚴經章"],
["T85n2754","華嚴略疏卷第三"],
["T85n2755","華嚴經疏"],
["T85n2756","華嚴經義記卷第一"],
["T85n2757","華嚴經疏卷第三"],
["T85n2758","十地義記卷第一"],
["T85n2759","無量壽經義記卷下"],
["T85n2760","無量壽觀經義記"],
["T85n2761","勝鬘經記"],
["T85n2762","勝鬘經疏"],
["T85n2763","挾注勝鬘經"],
["T85n2765","涅槃經疏"],
["T85n2766","藥師經疏"],
["T85n2767","藥師經疏"],
["T85n2768","維摩義記"],
["T85n2769","維摩經義記卷第四"],
["T85n2770","維摩經疏"],
["T85n2771","維摩經疏"],
["T85n2772","維摩經疏卷第三．第六"],
["T85n2773","維摩經抄"],
["T85n2774","維摩經疏"],
["T85n2775","維摩疏釋前小序抄"],
["T85n2776","釋肇序"],
["T85n2777","淨名經集解關中疏"],
["T85n2778","淨名經關中釋抄"],
["T85n2779","佛說楞伽經禪門悉談章"],
["T85n2780","溫室經疏"],
["T85n2781","盂蘭盆經讚述"],
["T85n2782","大乘稻芉經隨聽疏"],
["T85n2783","大乘稻芉經隨聽疏決"],
["T85n2784","大乘四法經釋抄"],
["T85n2785","大乘四法經論廣釋開決記"],
["T85n2786","天請問經疏"],
["T85n2787","四分戒本疏卷第一．第二．第三"],
["T85n2788","律戒本疏"],
["T85n2789","律戒本疏"],
["T85n2790","律雜抄"],
["T85n2791","宗四分比丘隨門要略行儀"],
["T85n2792","毘尼心"],
["T85n2793","三部律抄"],
["T85n2794","律抄"],
["T85n2795","四部律并論要用抄"],
["T85n2796","律抄第三卷手決"],
["T85n2797","梵網經述記卷第一"],
["T85n2798","本業瓔珞經疏"],
["T85n2799","十地論義疏卷第一．第三"],
["T85n2800","廣百論疏卷第一"],
["T85n2801","瑜伽師地論分門記"],
["T85n2802","瑜伽論手記"],
["T85n2803","地持義記卷第四"],
["T85n2804","唯識三十論要釋"],
["T85n2805","攝大乘講疏卷第五．第七"],
["T85n2806","攝大乘論抄"],
["T85n2807","攝大乘論章卷第一"],
["T85n2808","攝論章卷第一"],
["T85n2809","攝大乘義章卷第四"],
["T85n2810","大乘百法明門論開宗義記"],
["T85n2811","大乘百法明門論開宗義記序釋"],
["T85n2812","大乘百法明門論開宗義決"],
["T85n2813","大乘起信論略述"],
["T85n2814","大乘起信論廣釋卷第三．四．五"],
["T85n2815","起信論註"],
["T85n2816","因緣心釋論開決記"],
["T85n2817","大乘經纂要義"],
["T85n2818","大乘二十二問本"],
["T85n2819","諸經要抄"],
["T85n2820","菩薩藏修道眾經抄卷第十二"],
["T85n2821","諸經要略文"],
["T85n2822","大乘要語"],
["T85n2823","大乘入道次第開決"],
["T85n2824","天台分門圖"],
["T85n2825","真言要決卷第一．第三"],
["T85n2826","略諸經論念佛法門往生淨土集卷上"],
["T85n2827","淨土五會念佛誦經觀行儀卷中．下"],
["T85n2828","大乘淨土讚"],
["T85n2829","持齋念佛懺悔禮文"],
["T85n2831","無心論"],
["T85n2832","南天竺國菩提達摩禪師觀門"],
["T85n2833","觀心論"],
["T85n2834","大乘無生方便門"],
["T85n2835","大乘開心顯性頓悟真宗論"],
["T85n2836","大乘北宗論"],
["T85n2837","楞伽師資記"],
["T85n2838","傳法寶紀"],
["T85n2839","讚禪門詩"],
["T85n2840","三界圖"],
["T85n2841","大佛略懺"],
["T85n2842","印沙佛文"],
["T85n2843","大悲啟請"],
["T85n2844","文殊師利菩薩無相十禮"],
["T85n2845","押座文類"],
["T85n2846","祈願文"],
["T85n2847","祈願文"],
["T85n2848","迴向文"],
["T85n2849","大乘四齋日"],
["T85n2850","地藏菩薩十齋日"],
["T85n2851","和菩薩戒文"],
["T85n2852","入布薩堂說偈文等"],
["T85n2853","布薩文等"],
["T85n2854","禮懺文"],
["T85n2855","禮懺文"],
["T85n2856","禮懺文"],
["T85n2857","索法號義辯諷誦文"],
["T85n2858","大目乾連冥間救母變文并圖"],
["T85n2859","惠遠外傳"],
["T85n2860","府君存惠傳"],
["T85n2861","泉州千佛新著諸祖師頌"],
["T85n2862","大蕃沙洲釋門教法和尚洪辯修功德記"],
["T85n2863","王梵志詩集"],
["T85n2864","進旨"],
["T85n2865","護身命經"],
["T85n2866","護身命經"],
["T85n2867","慈仁問八十種好經"],
["T85n2868","決罪福經"],
["T85n2869","妙好寶車經"],
["T85n2870","像法決疑經"],
["T85n2871","大通方廣懺悔滅罪莊嚴成佛經"],
["T85n2872","妙法蓮華經廣量天地品第二十九"],
["T85n2873","首羅比丘經"],
["T85n2874","小法滅盡經"],
["T85n2875","大方廣華嚴十惡品經"],
["T85n2876","天公經"],
["T85n2877","如來在金棺囑累清淨莊嚴敬福經"],
["T85n2878","救疾經"],
["T85n2879","普賢菩薩說證明經"],
["T85n2880","究竟大悲經卷第二．三．四"],
["T85n2881","善惡因果經"],
["T85n2882","咒魅經"],
["T85n2883","法王經"],
["T85n2884","大威儀請問"],
["T85n2885","佛性海藏智慧解脫破心相經"],
["T85n2886","佛為心王菩薩說投陀經卷上"],
["T85n2887","父母恩重經"],
["T85n2888","延壽命經"],
["T85n2889","續命經"],
["T85n2890","如來成道經"],
["T85n2891","山海慧菩薩經"],
["T85n2892","現報當受經"],
["T85n2893","大辯邪正經"],
["T85n2894","三廚經"],
["T85n2895","要行捨身經"],
["T85n2896","示所犯者瑜伽法鏡經"],
["T85n2897","天地八陽神呪經"],
["T85n2898","高王觀世音經"],
["T85n2899","妙法蓮華經馬明菩薩品第三十"],
["T85n2900","齋法清淨經"],
["T85n2901","法句經"],
["T85n2902","法句經疏"],
["T85n2903","無量大慈教經"],
["T85n2904","七千佛神符經"],
["T85n2905","現在十方千五百佛名並雜佛同號"],
["T85n2906","三萬佛同根本神祕之印並法龍種上尊王佛法"],
["T85n2907","普賢菩薩行願王經"],
["T85n2908","大方廣佛華嚴經普賢菩薩行願王品"],
["T85n2909","地藏菩薩經"],
["T85n2910","金有陀羅尼經"],
["T85n2911","讚僧功德經"],
["T85n2912","無常三啟經"],
["T85n2913","七女觀經"],
["T85n2914","觀經"],
["T85n2915","救諸眾生一切苦難經"],
["T85n2916","勸善經"],
["T85n2918","釋家觀化還愚經"],
["T85n2919","佛母經"],
["T85n2920","僧伽和尚欲入涅槃說六度經"]];
module.exports=taishonames;
});
require.register("pedurmacat-dataset/pedurma_taisho.js", function(exports, require, module){
var pedurma_taisho=[
["1","1444,1445,1446,1447,1448,1449,1450"],
["2","1454"],
["3","1442"],
["4","1455"],
["5","1443"],
["6","1451"],
["21c","278"],
["25","220(1)"],
["26","220(2),222,223"],
["27","220(3)"],
["29","220(4)或(5),224,225,226,228,229 cf."],
["30","220(4)或(5) cf.,229"],
["31","220(16)"],
["41","220(7),310(46)"],
["32","260"],
["33","220(9),235,236A,236B,237,238,239"],
["35","248"],
["48","99(379),109,110"],
["49",""],
["50","1244,1245"],
["51","1(19),19,99(1192),100(105)"],
["53","125(49、10)cf."],
["56","597"],
["58","99(583)"],
["59","99(583)"],
["111","425"],
["112","186,187"],
["113","817,818"],
["114","589"],
["115","1375"],
["118","357,358,359"],
["119","657"],
["120","423,424"],
["121","484"],
["122","278(26),279(31),289,290"],
["123","486"],
["124","675,676,677,678,679"],
["125","670,671,672"],
["126","670,671,672"],
["127","464,465,466,467"],
["128","681,682"],
["129","380"],
["130","157,158 cf."],
["131","262,263,264"],
["132","1374"],
["133","366,367"],
["134","1050"],
["135","461,462"],
["136","355,356"],
["137","374+377"],
["138","374(1-6),375(1-18),376"],
["139","390"],
["141","653"],
["145","639,640"],
["147","648"],
["148","371,372"],
["149","632,633,634"],
["150","642"],
["151","416,417,418,419"],
["152","381,382"],
["153","273"],
["154","378,379"],
["156","397(9),402"],
["157","1344,1345"],
["158","1009,1017,1011,1012,1013,1014,1015,1016,1018"],
["159","1360"],
["160","654"],
["164","271,272"],
["165","397(1-2),398"],
["166","397(8),404"],
["167","310(42),349"],
["169","544"],
["170","397(5),400"],
["171","598"],
["172","601"],
["173","599"],
["174","635"],
["175","624,625"],
["178","585,586,587"],
["179","588"],
["181","433"],
["182","437"],
["183","533"],
["185","421,420"],
["187","397,399"],
["188","567,568"],
["189","559,560,561"],
["190","473,661,662"],
["191","846,1643"],
["192","481,482"],
["193","397(12),403"],
["194","474,475,476"],
["195","774"],
["196","472"],
["197","460,1489,1490"],
["198","650,651,652"],
["199","220(11-15)"],
["201","705"],
["202","488"],
["203","302,303,304"],
["205","278(28),279(33)"],
["208","565,566"],
["209","480"],
["210","573"],
["214","470,471"],
["218","807"],
["219","305"],
["220","645,646"],
["222","702"],
["225","813,814"],
["227","835,836"],
["228","708,709,710,711,712"],
["229","99(1248),123,124,125(49、1)"],
["231","99(1077),100(16),118,119,120,125"],
["234","626,627,628,629"],
["235","545"],
["236","1494"],
["237","1491 cf.,1493"],
["238","653"],
["239","514,515,516"],
["240","270"],
["244","575,576,577"],
["245","274,275"],
["246","810"],
["248","397(16)"],
["249","489,658,659"],
["250","387"],
["253","989,991,992,993"],
["254","945"],
["256","761"],
["257","410,411"],
["258","266,267,268"],
["260","998"],
["264","833,834"],
["269","772,773"],
["270","774"],
["274","1484"],
["275","397(14)"],
["276","666,667"],
["277","828,829,830"],
["278","405,406,407,408"],
["279","310(38),345,346"],
["280","443"],
["284","434"],
["287","435"],
["288","1147,1333,1334"],
["289","430,431"],
["290","310(34)"],
["291","13,481,349"],
["292","438"],
["293","680"],
["295","430,431"],
["296","429"],
["305","721卷1-卷18"],
["307","26(62)"],
["308","26(190)"],
["309","26(191)"],
["310","99(980)"],
["311","99(981)"],
["314","99(1226)"],
["315","26(181),776"],
["318","99(726)"],
["325","759"],
["327","801"],
["328","758"],
["331","26(165) cf.,1362"],
["334","99(403),125(25)"],
["335","762,763"],
["336","97,98"],
["337","688,689"],
["339","700"],
["344","210,212,213"],
["347","592"],
["348","99(1299)"],
["349","99(583)"],
["350","704"],
["353","785"],
["354","785"],
["355","99(379),109,110"],
["357","80"],
["358","26(170),78,79,81"],
["361","202"],
["9,1102,61(ch.45.2)","297"],
["363","200"],
["365","595"],
["367","173"],
["368","153(5),166"],
["370","162"],
["371","152(14),171"],
["372","1(21),21"],
["373","156"],
["378","1300"],
["61","278,279,297"],
["62","310(1),311"],
["63","310(2)"],
["64","310(3),312"],
["65","310(4)"],
["66","310(5),360,361,362,363,364"],
["67","310(6),313"],
["68","310(7)"],
["69","310(8)"],
["70","310(9),314"],
["71","310(10),315"],
["72","310(11)"],
["73","310(12),316"],
["74","310(14)"],
["75","310(13),317"],
["76","310(15),318,319"],
["77","310(16),320"],
["79","310(18),321"],
["78","310(17)"],
["80","310(19),322,323"],
["81","310(20)"],
["82","310(21),324"],
["83","310(22)"],
["84","310(23)"],
["85","310(24),325,326"],
["86","310(25),327"],
["87","310(26)"],
["88","310(27),328,329"],
["89","310(28),330,331"],
["90","310(29),332,333"],
["91","310(30),334,335,336"],
["92","310(31)"],
["93","310(32),337"],
["94","310(33),338,339"],
["95","310(34)"],
["96","310(35),340"],
["97","310(36),341,342"],
["98","310(37),343,344"],
["99","310(38),345,346"],
["100","310(39),347"],
["101","310(40)"],
["102","310(41),348"],
["103","310(42),349"],
["104","310(43),350,351,352"],
["105","310(44)"],
["106","310(45)"],
["107","310(46)"],
["108","310(47)"],
["109","310(48),353"],
["110","310(49),354"],
["385","1187,1188,1189,1190"],
["440(a)","892"],
["460","1108A,1108B"],
["464","885"],
["475","887"],
["490","890"],
["504","865,866,882"],
["506","888"],
["507","1171,1172"],
["512","220(10),240,241,242,243,244"],
["513","244第14分-25分"],
["514","220(10),240,241,242,243,244"],
["515","886"],
["519","848,849 cf."],
["528","449,450,451,1331"],
["529","449,450,451,1331"],
["532","1005A,1006,1007"],
["533","1022a,1023"],
["540","918,919"],
["539","1346,1347"],
["537","1348,1349"],
["538","1147,1333,1334"],
["570","1409"],
["672","1167,1168A,1168B"],
["556","258"],
["557","250,251,252,253,254,255,256 cf.,257"],
["571","1191,1215,1216"],
["580","1190"],
["581","230"],
["582","249"],
["583","663,664,665"],
["584","663,664,665"],
["585","663,664,665"],
["586","999"],
["587","982,983A,984,985"],
["589","1153,1154"],
["592","1254,1255,1256,1257"],
["593","1257"],
["594","1257"],
["766","1100"],
["767","1384"],
["641","1075,1076,1077"],
["599","1264"],
["598","1404"],
["554","1029,1351,1352,1353,1354,1355"],
["623","978,979 cf."],
["625","974"],
["622","978"],
["626","978"],
["624","978,979 cf."],
["618","976,977"],
["621","976,977"],
["627","1025"],
["650","1323"],
["649","1325"],
["741","1035"],
["548","1397,1398"],
["536","1024"],
["742","1036"],
["743","901(5)"],
["613","1021"],
["710","369,934,1316,1317"],
["632","1217"],
["544","1387"],
["637","1373"],
["647","1324"],
["640","943"],
["634","1392"],
["642","1137,1138,1139,1140"],
["552","1360"],
["603","1047"],
["542","1356,1357,1358,1359"],
["555","1371"],
["665","1127"],
["670","1190,1197"],
["671","1143"],
["685","1244,1245"],
["686","989,991,992,993"],
["689","1302,1303"],
["690","1302,1303"],
["692","1162,1163,1164"],
["693","1165"],
["694","1165"],
["568","1386"],
["675","1313,1314"],
["674","1313,1314"],
["705","936,937"],
["706","936,937"],
["707","370"],
["717","901(828) cf.,1092,1093 cf.,1094 cf.,1095 cf.,1096 cf.,1097 cf.,1098 cf.,1099 cf."],
["713","1092,1093,1094,1095,1099"],
["718","1092"],
["722","1057,1058,1060"],
["723","1080,1081,1082,1083"],
["724","901(812),1070,1071"],
["725","901(812),1070,1071"],
["730","1037,1038"],
["728","1061,1111,1112,1113A,1113B"],
["764","901(14)"],
["736","1054"],
["799","1285"],
["756","1117"],
["758","1105 cf.,1106,1107"],
["759","1105,1106 cf.,1107 cf."],
["770","1253"],
["771","1252"],
["772","1252"],
["778","1129"],
["781","1416,1417"],
["782","1415"],
["784","1416"],
["788","1243"],
["795","1285"],
["800","1283"],
["802","1377"],
["835","895,896"],
["836","897"],
["837","893"],
["163,859","299"],
["860","1397,1398"],
["861","936,937"],
["862","370"],
["863","369,934,1316,1317"],
["864","1147,1333,1334"],
["865","1348,1349"],
["866","918,919"],
["868","1346,1347"],
["869","1387"],
["870","1029,1351,1352,1353,1354,1355"],
["878","1411"],
["884","1409"],
["889","1127"],
["894","1167,1168A,1168B"],
["895","1022a,1023"],
["897","1005a,1006,1007"],
["898","1356,1357,1358,1359"],
["900","1371"],
["902","1143"],
["909","1057,1058,1060"],
["910","1080,1081,1082,1083"],
["911","901(812),1070,1071"],
["912","1054"],
["913","1092(1),1093,1094,1095,1099"],
["914","1092"],
["915","1092"],
["916","1037,1038"],
["917","1061,1111,1112,1113A,1113B"],
["918","901(14)"],
["919","1377"],
["921","1117"],
["926","1009,1011,1012,1013,1014,1015,1016,1017,1018"],
["927","1137,1138,1139,1140"],
["928","1360"],
["929","1047"],
["935","943"],
["937","1373"],
["942","901(5),1035,1036"],
["953","1021"],
["958","1415"],
["959","1243"],
["960","1416,1417"],
["967","1416"],
["970","1392"],
["982","1285"],
["983","1285"],
["986","26(165) cf.,1362"],
["994","1024"],
["995","1025"],
["996","974"],
["997","976,977"],
["1000","1254,1255,1256,1257"],
["1001","1075,1076,1077"],
["1002","1264"],
["1003","1404"],
["1006","1100"],
["1007","1384"],
["1009","1302,1303"],
["1010","1302,1303"],
["1012","1105 cf.,1106,1107"],
["1017","1252"],
["1018","1252"],
["1019","1162,1163,1164"],
["1020","1324"],
["1025","1323"],
["1031","1325"],
["1070","999cf."],
["1073","1244,1245"],
["1075","989,991,992,993"],
["1085","1386"],
["1086","1313,1314"],
["1087","1313,1314"]];
module.exports=pedurma_taisho;
});
require.register("pedurmacat-dataset/api.js", function(exports, require, module){
var dosearch=function(volpage,from,to) {
	var corresFromVolpage=fromVolpage(volpage,from,to);
		//corresFromVolpage= [經號],[範圍],[對照經號],[對照範圍],[對照行],[K經號]
	return [to.rcode,corresFromVolpage];
}

var fromVolpage=function(volpage,from,to){
	//var volpage=document.getElementById("input").value;
	var out=[];
	var range=findRange(volpage,from);//range=[J經號,J範圍,K經號]
	var corres_range=findCorresRange(range[2],to);//corres_range=[D經號,D範圍]
	//算J和D的範圍
	var vRange=countRange(range[1],range[1]);//[vStart,vEnd-vStart]
	var corres_vRange=countRange(corres_range[0][1],corres_range[corres_range.length-1][1]);//[vStart,vEnd-vStart]
	var corresLine=countCorresLine(volpage,vRange[1],corres_vRange[1],vRange[0],corres_vRange[0]);

	out.push([range[0]],[range[1]],[corres_range[0][0]],[corres_range[0][1]],[corresLine],[range[2]]);
				// [經號],[範圍],[對照經號],[對照範圍],[對照行],[K經號]
	return out;
}

var countCorresLine=function(volpage,range,corres_range,start,corres_start){//volpage=使用者輸入的volpage
	var Vline=volpb2vl(volpage);
	var corres_vLine=(range*corres_start+corres_range*(Vline-start))/range;//對照的虛擬行
	corres_vLine=Math.floor(corres_vLine);
	var corresLine=vl2volpb(corres_vLine);//對照的虛擬行轉回volpage
	return corresLine;
}

var countRange=function(startRange,endRange){//range=034@020a1-103b7
	if(startRange == endRange){  //起始範圍=結束範圍：代表只有對照到一函，沒有跨函
		var p=startRange.split("-");
		var start=p[0];
		var vStart=volpb2vl(start);
		var end=p[0].substr(0,3)+"."+p[1];
		var vEnd=volpb2vl(end);
		//var vRange=vEnd-vStart;
		var vRange=[vStart,vEnd-vStart];
	}
	else if(startRange != endRange){
		var m=startRange.split("-");
		var start=m[0];
		var vStart=volpb2vl(start);
		var n=endRange.split("-");
		var end=n[0].substr(0,3)+"."+n[1];
		var vEnd=volpb2vl(end);
		var vRange=[vStart,vEnd-vStart];
	}
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




var api={dosearch:dosearch}
module.exports=api;
});
require.register("pedurmacat-sutraimage/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
//var longnames={"J":"Lijiang","D":"Derge","C":"Cone","K":"Pedurma","N":"Narthang","H":"Lhasa","U":"Urga"};
var sutraimage = React.createClass({displayName: 'sutraimage',
  getInitialState: function() {
    return {};
  },
  renderImage: function(corresline,to,hasImage){//corresline:對照行(分開成物件的對照行)
    //去掉行數 把vol page side 湊成檔名
    corresline=corresline||"";
    to=to||"";
    var filename=this.id2imageFileName(corresline);//[函號(用來進入該函資料夾),檔名]
    if(hasImage){
      return "http://dharma-treasure.org/kangyur_images/"+to.toLowerCase()+'/'+filename[0]+'/'+filename[1];
    } else return "";
    
  },
  id2imageFileName: function(id){
    var p="00"+id.vol;
    var nameVol=p.substr(p.length-3);
    var q="00"+id.page;
    var namePageSide=q.substr(q.length-3)+id.side;
    var filename=[nameVol,nameVol+"-"+namePageSide+".jpg"];

    return filename;
  },
  render: function() {
    var recen=this.props.recen||"";
    if(recen.match(/[CPNU]/)){
      var hasImage=false;
    } else hasImage=true;
    return (
      React.DOM.div(null, 
        React.DOM.img({src: this.renderImage(this.props.volpage,this.props.recen,hasImage)})
      )
    );
  }
});
module.exports=sutraimage;
});
require.register("pedurmacat/index.js", function(exports, require, module){
var boot=require("boot");
boot("pedurmacat","main","main");
});


























require.alias("ksanaforge-boot/index.js", "pedurmacat/deps/boot/index.js");
require.alias("ksanaforge-boot/index.js", "pedurmacat/deps/boot/index.js");
require.alias("ksanaforge-boot/index.js", "boot/index.js");
require.alias("ksanaforge-boot/index.js", "ksanaforge-boot/index.js");
require.alias("brighthas-bootstrap/dist/js/bootstrap.js", "pedurmacat/deps/bootstrap/dist/js/bootstrap.js");
require.alias("brighthas-bootstrap/dist/js/bootstrap.js", "pedurmacat/deps/bootstrap/index.js");
require.alias("brighthas-bootstrap/dist/js/bootstrap.js", "bootstrap/index.js");
require.alias("brighthas-bootstrap/dist/js/bootstrap.js", "brighthas-bootstrap/index.js");
require.alias("ksana-document/index.js", "pedurmacat/deps/ksana-document/index.js");
require.alias("ksana-document/document.js", "pedurmacat/deps/ksana-document/document.js");
require.alias("ksana-document/api.js", "pedurmacat/deps/ksana-document/api.js");
require.alias("ksana-document/xml.js", "pedurmacat/deps/ksana-document/xml.js");
require.alias("ksana-document/template_accelon.js", "pedurmacat/deps/ksana-document/template_accelon.js");
require.alias("ksana-document/persistent.js", "pedurmacat/deps/ksana-document/persistent.js");
require.alias("ksana-document/tokenizers.js", "pedurmacat/deps/ksana-document/tokenizers.js");
require.alias("ksana-document/markup.js", "pedurmacat/deps/ksana-document/markup.js");
require.alias("ksana-document/typeset.js", "pedurmacat/deps/ksana-document/typeset.js");
require.alias("ksana-document/sha1.js", "pedurmacat/deps/ksana-document/sha1.js");
require.alias("ksana-document/users.js", "pedurmacat/deps/ksana-document/users.js");
require.alias("ksana-document/customfunc.js", "pedurmacat/deps/ksana-document/customfunc.js");
require.alias("ksana-document/configs.js", "pedurmacat/deps/ksana-document/configs.js");
require.alias("ksana-document/projects.js", "pedurmacat/deps/ksana-document/projects.js");
require.alias("ksana-document/indexer.js", "pedurmacat/deps/ksana-document/indexer.js");
require.alias("ksana-document/indexer_kd.js", "pedurmacat/deps/ksana-document/indexer_kd.js");
require.alias("ksana-document/kdb.js", "pedurmacat/deps/ksana-document/kdb.js");
require.alias("ksana-document/kdbfs.js", "pedurmacat/deps/ksana-document/kdbfs.js");
require.alias("ksana-document/kdbw.js", "pedurmacat/deps/ksana-document/kdbw.js");
require.alias("ksana-document/kdb_sync.js", "pedurmacat/deps/ksana-document/kdb_sync.js");
require.alias("ksana-document/kdbfs_sync.js", "pedurmacat/deps/ksana-document/kdbfs_sync.js");
require.alias("ksana-document/html5fs.js", "pedurmacat/deps/ksana-document/html5fs.js");
require.alias("ksana-document/kse.js", "pedurmacat/deps/ksana-document/kse.js");
require.alias("ksana-document/kde.js", "pedurmacat/deps/ksana-document/kde.js");
require.alias("ksana-document/boolsearch.js", "pedurmacat/deps/ksana-document/boolsearch.js");
require.alias("ksana-document/search.js", "pedurmacat/deps/ksana-document/search.js");
require.alias("ksana-document/plist.js", "pedurmacat/deps/ksana-document/plist.js");
require.alias("ksana-document/excerpt.js", "pedurmacat/deps/ksana-document/excerpt.js");
require.alias("ksana-document/link.js", "pedurmacat/deps/ksana-document/link.js");
require.alias("ksana-document/tibetan/wylie.js", "pedurmacat/deps/ksana-document/tibetan/wylie.js");
require.alias("ksana-document/languages.js", "pedurmacat/deps/ksana-document/languages.js");
require.alias("ksana-document/diff.js", "pedurmacat/deps/ksana-document/diff.js");
require.alias("ksana-document/xml4kdb.js", "pedurmacat/deps/ksana-document/xml4kdb.js");
require.alias("ksana-document/buildfromxml.js", "pedurmacat/deps/ksana-document/buildfromxml.js");
require.alias("ksana-document/tei.js", "pedurmacat/deps/ksana-document/tei.js");
require.alias("ksana-document/concordance.js", "pedurmacat/deps/ksana-document/concordance.js");
require.alias("ksana-document/regex.js", "pedurmacat/deps/ksana-document/regex.js");
require.alias("ksana-document/bsearch.js", "pedurmacat/deps/ksana-document/bsearch.js");
require.alias("ksana-document/persistentmarkup_pouchdb.js", "pedurmacat/deps/ksana-document/persistentmarkup_pouchdb.js");
require.alias("ksana-document/underlines.js", "pedurmacat/deps/ksana-document/underlines.js");
require.alias("ksana-document/index.js", "pedurmacat/deps/ksana-document/index.js");
require.alias("ksana-document/index.js", "ksana-document/index.js");
require.alias("ksana-document/index.js", "ksana-document/index.js");
require.alias("ksanaforge-fileinstaller/index.js", "pedurmacat/deps/fileinstaller/index.js");
require.alias("ksanaforge-fileinstaller/index.js", "pedurmacat/deps/fileinstaller/index.js");
require.alias("ksanaforge-fileinstaller/index.js", "fileinstaller/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ksanaforge-fileinstaller/deps/checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ksanaforge-fileinstaller/deps/checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ksanaforge-checkbrowser/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ksanaforge-fileinstaller/deps/htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ksanaforge-fileinstaller/deps/htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ksanaforge-htmlfs/index.js");
require.alias("ksanaforge-fileinstaller/index.js", "ksanaforge-fileinstaller/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "pedurmacat/deps/checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "pedurmacat/deps/checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ksanaforge-checkbrowser/index.js");
require.alias("ksanaforge-htmlfs/index.js", "pedurmacat/deps/htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "pedurmacat/deps/htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ksanaforge-htmlfs/index.js");
require.alias("pedurmacat-main/index.js", "pedurmacat/deps/main/index.js");
require.alias("pedurmacat-main/index.js", "pedurmacat/deps/main/index.js");
require.alias("pedurmacat-main/index.js", "main/index.js");
require.alias("pedurmacat-main/index.js", "pedurmacat-main/index.js");
require.alias("pedurmacat-comp1/index.js", "pedurmacat/deps/comp1/index.js");
require.alias("pedurmacat-comp1/index.js", "pedurmacat/deps/comp1/index.js");
require.alias("pedurmacat-comp1/index.js", "comp1/index.js");
require.alias("pedurmacat-comp1/index.js", "pedurmacat-comp1/index.js");
require.alias("pedurmacat-fromsutra/index.js", "pedurmacat/deps/fromsutra/index.js");
require.alias("pedurmacat-fromsutra/index.js", "pedurmacat/deps/fromsutra/index.js");
require.alias("pedurmacat-fromsutra/index.js", "fromsutra/index.js");
require.alias("pedurmacat-fromsutra/index.js", "pedurmacat-fromsutra/index.js");
require.alias("pedurmacat-searchbar/index.js", "pedurmacat/deps/searchbar/index.js");
require.alias("pedurmacat-searchbar/index.js", "pedurmacat/deps/searchbar/index.js");
require.alias("pedurmacat-searchbar/index.js", "searchbar/index.js");
require.alias("pedurmacat-searchbar/index.js", "pedurmacat-searchbar/index.js");
require.alias("pedurmacat-corressutras/index.js", "pedurmacat/deps/corressutras/index.js");
require.alias("pedurmacat-corressutras/index.js", "pedurmacat/deps/corressutras/index.js");
require.alias("pedurmacat-corressutras/index.js", "corressutras/index.js");
require.alias("pedurmacat-corressutras/index.js", "pedurmacat-corressutras/index.js");
require.alias("pedurmacat-dataset/index.js", "pedurmacat/deps/dataset/index.js");
require.alias("pedurmacat-dataset/dPedurma.js", "pedurmacat/deps/dataset/dPedurma.js");
require.alias("pedurmacat-dataset/cPedurma.js", "pedurmacat/deps/dataset/cPedurma.js");
require.alias("pedurmacat-dataset/jPedurma.js", "pedurmacat/deps/dataset/jPedurma.js");
require.alias("pedurmacat-dataset/hPedurma.js", "pedurmacat/deps/dataset/hPedurma.js");
require.alias("pedurmacat-dataset/nPedurma.js", "pedurmacat/deps/dataset/nPedurma.js");
require.alias("pedurmacat-dataset/uPedurma.js", "pedurmacat/deps/dataset/uPedurma.js");
require.alias("pedurmacat-dataset/kPedurma.js", "pedurmacat/deps/dataset/kPedurma.js");
require.alias("pedurmacat-dataset/sutranames.js", "pedurmacat/deps/dataset/sutranames.js");
require.alias("pedurmacat-dataset/taishonames.js", "pedurmacat/deps/dataset/taishonames.js");
require.alias("pedurmacat-dataset/pedurma_taisho.js", "pedurmacat/deps/dataset/pedurma_taisho.js");
require.alias("pedurmacat-dataset/api.js", "pedurmacat/deps/dataset/api.js");
require.alias("pedurmacat-dataset/index.js", "pedurmacat/deps/dataset/index.js");
require.alias("pedurmacat-dataset/index.js", "dataset/index.js");
require.alias("pedurmacat-dataset/index.js", "pedurmacat-dataset/index.js");
require.alias("pedurmacat-sutraimage/index.js", "pedurmacat/deps/sutraimage/index.js");
require.alias("pedurmacat-sutraimage/index.js", "pedurmacat/deps/sutraimage/index.js");
require.alias("pedurmacat-sutraimage/index.js", "sutraimage/index.js");
require.alias("pedurmacat-sutraimage/index.js", "pedurmacat-sutraimage/index.js");
require.alias("pedurmacat/index.js", "pedurmacat/index.js");
if (typeof exports == 'object') {
  module.exports = require('pedurmacat');
} else if (typeof define == 'function' && define.amd) {
  define(function(){ return require('pedurmacat'); });
} else {
  window['pedurmacat'] = require('pedurmacat');
}})();