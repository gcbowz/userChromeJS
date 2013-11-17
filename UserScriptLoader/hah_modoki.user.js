// ==UserScript==
// @name           HaH_modoki
// @namespace      http://d.hatena.ne.jp/atsumu-t/
// @description    按O键，调用字母组合键打开页面链接
// @include        *
// ==/UserScript==

var ESC = String.fromCharCode (27);
var o = {
  start_keys: 'o',
  cancel_keys: 'o' + ESC,
  input_keys: 'abcdefghjklmnprstuvwxy',
  shift_is_new_window: true,
  shift_on_keys: '',
  shift_off_keys: '',
  shift_toggle_keys: 'i',
  blur_keys: '' + ESC,
  
  tip_offset_h: 0,
  tip_offset_v: 0,
  
  tip_class: '_HaHm_tip',
};

function makeTipTemplate () {
  var t = document.createElement ('span');
  t.className = o.tip_class;
  with (t.style) {
    color = 'white';
    backgroundColor = 'rgba(0, 0, 0, 0.5)';
    paddingLeft = '0.2em';
    paddingRight = '0.2em';
    borderColor = 'white';
    borderStyle = 'solid';
    borderWidth = '0.1em';
    
    zIndex = '999999';
    position = 'absolute';
  }
  return t;
}

var g = {
  objs: new Array (),
  tip_digit: new Number (),
  enable: false,
  s: new State (),
};

function State () {
  this.shift = false;
  this.input = new String ();
}

function open (href, shift) {
  if ((o.shift_is_new_window && shift)
      || (!o.shift_is_new_window && !shift))
    //window.open (href, '_blank', '');
    GM_openInTab (href);
  else
    location.href = href;
}

function log (x, base) {
  return Math.log (x) / Math.log (base);
}

function key_match (e, s) {
  return (s.indexOf (String.fromCharCode (e.which)) != -1
          || s.indexOf (String.fromCharCode (e.keyCode)) != -1);
}

function keypress (e) {
  {
    var elem = e.target;
    var elem_name = elem.nodeName.toLowerCase ();
    
    if (key_match (e, o.blur_keys)) {
      elem.blur ();
      if (g.enable) {
        removeTip ();
        g.enable = false;
      }
    }
    if (elem_name == 'textarea'
        || elem_name == 'select'
        || (elem_name == 'input'
            && (elem.type == 'text' || elem.type == 'password'))
        || e.ctrlKey || e.altKey || e.button)
      return true;
  }

  var c = String.fromCharCode (e.which);
  if (!g.enable) {
    if (key_match (e, o.start_keys)) {
      if (!showTip ())
        return true;
      g.enable = true;
      g.s = new State ();
    }
  } else {
    if (key_match (e, o.cancel_keys)) {
      removeTip ();
      g.enable = false;
    } else if (key_match (e, o.shift_on_keys)) {
      g.s.shift = true;
    } else if (key_match (e, o.shift_off_keys)) {
      g.s.shift = false;
    } else if (key_match (e, o.shift_toggle_keys)) {
      g.s.shift = !g.s.shift;
    } else if (key_match (e, o.input_keys)) {
      g.s.input += c;
      var tips = document.getElementsByClassName ('_HaHm_tip');
      
      var removes = [];
      for (var i = 0; i < tips.length; ++i) {
        if (tips.item(i).textContent.indexOf (c) == 0)
          tips.item(i).style.color = 'yellow';
        else
          removes.push (i);
      }
      if (removes.length == tips.length
          && g.s.input.length != g.tip_digit) {
        removeTip ();
        g.enable = false;
        return false;
      }
      for (var i = 0; i < removes.length; ++i) {
        var item = tips.item(removes[i] - i);
        item.parentNode.removeChild (item);
      }
    }

    if (g.s.input.length == g.tip_digit) {
      removeTip ();
      g.enable = false;
      var n = 0;
      for (var i = 0; i < g.tip_digit; ++i) {
        n = n * o.input_keys.length + o.input_keys.indexOf (g.s.input[i]);
      }
      if (n < g.objs.length)
        {
          if (g.objs[n].proc == 'open')
            open (g.objs[n].elem.href, g.s.shift);
          else if (g.objs[n].proc == 'focus')
            g.objs[n].elem.focus ();
        }
    }
  }
  return false;
}

function showTip () {
  var template = makeTipTemplate ();

  var w_left = window.scrollX;
  var w_right = window.scrollX + window.innerWidth;
  var w_top = window.scrollY;
  var w_bottom = window.scrollY + window.innerHeight;
  var w_width = w_right - w_left;
  var w_height = w_bottom - w_top;
  
  g.objs = new Array ();
  Array.filter (
    document.links,
    function (l) {
      var pos = l.getBoundingClientRect ();
      if (0 <= pos.left && pos.right <= w_width
          && 0 <= pos.top && pos.bottom <= w_height)
        g.objs.push ({elem: l, proc: 'open'});
      return true;
    });

  {
    var inputs = document.getElementsByTagName ("input");
    var textareas = document.getElementsByTagName ("textarea");
    var selects = document.getElementsByTagName ("select");
    var as = new Array (inputs.length + textareas.length + selects.length);
    for (var i = 0; i < inputs.length; ++i)
      as[i] = inputs[i];
    for (var i = 0; i < textareas.length; ++i)
      as[inputs.length + i] = textareas[i];
    for (var i = 0; i < selects.length; ++i)
      as[inputs.length + textareas.length + i] = selects[i];

    Array.filter (
      as,
      function (a) {
        var pos = a.getBoundingClientRect ();
        if (0 <= pos.left && pos.right <= w_width
            && 0 <= pos.top && pos.bottom <= w_height)
          g.objs.push ({elem: a, proc: 'focus'});
        return true;
      });
  }

  if (g.objs.length == 0)
    return false;

  g.tip_digit = (g.objs.length == 0 ? 0
                 : Math.floor (log (g.objs.length, o.input_keys.length)) + 1);

  g.objs.forEach (
    function (link, i) {
      var l = link.elem;
      var pos = l.getBoundingClientRect ();
      var tip = template.cloneNode (true);
      var str = "";
      var rest = i;
      for (var d = g.tip_digit; d > 0; --d) {
        str = o.input_keys[rest % o.input_keys.length] + str;
        rest = Math.floor (rest / o.input_keys.length);
      }
      with (tip) {
        textContent = str;
        style.left = pos.left + w_left + o.tip_offset_h * g.tip_digit + 'px';
        style.top = pos.top + w_top + o.tip_offset_v + 'px';
      }
      document.body.appendChild (tip);
    });

  return true;
}

function removeTip () {
  var tips = document.getElementsByClassName (o.tip_class);
  while (tips.length)
    tips[0].parentNode.removeChild (tips[0]);
}

document.addEventListener ('keypress', keypress, false);
