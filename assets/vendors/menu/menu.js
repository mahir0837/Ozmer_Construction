$.fn.dropdownMenu = function (opt) {
  return $(this).each(function () {
    var el = $(this),
      optsDefault = {
        menuClass: 'dropdown-menu-list',
        breakpoint: 1000,
        toggleClass: 'active',
        classButtonToggle: 'toggle-menu',
        subMenu: {
          class: 'sub-menu',
          parentClass: 'menu-item-has-children',
          toggleClass: 'active'
        }
      },
      options = $.extend({}, optsDefault, opt);

    var STATE_KEY = 'dropdownMenu:init'; // flag on element

    function bind() {
      if (el.data(STATE_KEY)) return; // already bound
      el.data(STATE_KEY, true);

      // Toggle main menu
      $('.' + options.classButtonToggle, el)
        .on('click.dm', function (e) {
          e.stopPropagation();
          $('.' + options.menuClass, el).toggleClass(options.toggleClass);
        });

      // Toggle submenus (only for mobile)
      $('.' + options.subMenu.parentClass, el)
        .on('click.dm', '> a', function (e) {
          // guard: only prevent default on mobile
          if (window.innerWidth <= options.breakpoint) {
            e.preventDefault();
            var self = $(this);
            self.next('.' + options.subMenu.class).stop(true, true).slideToggle(200);
            self.parent().toggleClass(options.subMenu.toggleClass);
          }
        });

      // Click outside closes
      $(document).on('click.dm', function () {
        $('.' + options.menuClass, el).removeClass(options.toggleClass);
        $('.' + options.subMenu.parentClass, el).removeClass(options.subMenu.toggleClass);
        $('.' + options.subMenu.class, el).hide();
      });

      // Prevent closing when clicking inside menu
      $('.' + options.menuClass, el).on('click.dm', function (e) {
        e.stopPropagation();
      });
    }

    function unbind() {
      if (!el.data(STATE_KEY)) return;
      el.data(STATE_KEY, false);

      $('.' + options.classButtonToggle, el).off('.dm');
      $('.' + options.subMenu.parentClass, el).off('.dm');
      $('.' + options.menuClass, el).off('.dm');
      $(document).off('.dm');

      // Reset state
      $('.' + options.menuClass, el).removeClass(options.toggleClass);
      $('.' + options.subMenu.parentClass, el).removeClass(options.subMenu.toggleClass);
      $('.' + options.subMenu.class, el).removeAttr('style'); // remove inline display from slideToggle
    }

    // Initial mount (mobile only)
    if (window.innerWidth <= options.breakpoint) {
      bind();
    } else {
      unbind();
    }

    // Debounced resize + correct bind/unbind
    var rAF, lastW = window.innerWidth;
    $(window).on('resize.dm', function () {
      if (rAF) cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(function () {
        var w = window.innerWidth;
        if (w === lastW) return;
        lastW = w;
        if (w <= options.breakpoint) bind();
        else unbind();
      });
    });
  });
};
