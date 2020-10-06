(function ($) {
  var locale = @@include("./locale/locale.json");
  var TEMPLATE = `@@include('./templates/menu.html')`;

  var LOCAL_STORAGE_OPTIONS_KEY = "open-accessibility-config";

  var UNITS = [
    "px",
    "cm",
    "em",
    "ex",
    "in",
    "mm",
    "pc",
    "pt",
    "vh",
    "vw",
    "vmin",
  ];

  function getUnit(fontSize) {
    fontSize = fontSize || "";
    return UNITS.filter((unit) =>
      fontSize.match(new RegExp(unit + "$", "gi"))
    ).pop();
  }

  function isGoogleChrome() {
    var isChromium = window.chrome;
    var winNav = window.navigator;
    var vendorName = winNav.vendor;
    var isOpera = winNav.userAgent.indexOf("OPR") > -1;
    var isIEedge = winNav.userAgent.indexOf("Edge") > -1;

    return (
      isChromium !== null &&
      isChromium !== undefined &&
      vendorName === "Google Inc." &&
      isOpera == false &&
      isIEedge == false
    );
  }

  function isMobileBrowser() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    var product = userAgent.substr(0, 4);
    return (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        userAgent
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        product
      )
    );
  }

  function getUserOptions() {
    var data;

    try {
      data = localStorage.getItem(LOCAL_STORAGE_OPTIONS_KEY);
      data = JSON.parse(data);
    } catch (e) {}

    if (data && typeof data === "object") {
      return data;
    } else {
      return {};
    }
  }

  function setUserOptions(options) {
    localStorage.setItem(LOCAL_STORAGE_OPTIONS_KEY, JSON.stringify(options));
  }

  function applyFontZoom(selector, fZoom) {
    console.log("zooming " + selector);
    $(selector)
      .not(".open-accessibility *")
      .not(".open-accessibility") // To avoid messing up the menu bar itself
      .each(function () {
        var element = $(this);

        var originalFontSize = element.attr(
          "data-open-accessibility-font-original"
        );
        if (!originalFontSize) {
          originalFontSize = element.css("font-size");
          element.attr(
            "data-open-accessibility-font-original",
            originalFontSize
          );
        }

        var units = getUnit(originalFontSize) || "";
        var fontSize = parseFloat(originalFontSize) * fZoom;

        var styleName = "font-size";
        var value = fontSize + units;

        element[0].style.setProperty(styleName, value, "important");
      });
  }

  function translateTheme(lang) {
    var menu = $(".open-accessibility-menu");

    Object.keys(lang).forEach((key, index) => {
      menu.find('[data-lang="' + key + '"]').text(lang[key]);
    });
  }

  function getLanguages(langs, map) {
    console.log("langs", langs);
    var res = {};
    langs.forEach((key) => {
      var value = (map && map[key]) || locale[key];
      if ($.isPlainObject(value)) {
        res[key] = value;
      } else {
        console.error(key + "language does not set!");
      }
      console.log("aaaaaa", res);
    });

    return res;
  }

  function getIconClass(size) {
    var prefix = "open-accessibility-size-";
    return prefix + size;
  }

  $.fn.openAccessibility = function (customOptions) {
    var element = this;

    customOptions = customOptions || {};

    var defaultOptions = {
      isMenuOpened: false,
      highlightedLinks: false,
      isMobileEnabled: true,
      grayscale: 0,
      brightness: 100,
      contrast: 100,
      maxFZoomLevel: 3,
      minFZoomLevel: 1,
      fZoomStep: 0.2,
      fZoom: 1,
      maxPZoomLevel: 1.5,
      minPZoomLevel: 1,
      pZoomStep: 0.1,
      pZoom: 1,
      mZoom: 1,
      cursor: false,
      fontSelector: "div,span,p,a,td,table,tr,h1,h2,h3,h4,h5,h6,input",
      invert: false,
      isAnimStopped: false,
      // localization: ["he"],
      iconSize: "s", // supported sizes are s(mall), m(edium), l(arge)
    };

    var userOptions = getUserOptions();
    var initialOptions = $.extend({}, defaultOptions, customOptions);
    var options = $.extend({}, initialOptions, userOptions, customOptions);

    if (!options.isMobileEnabled && isMobileBrowser()) {
      console.log("disabling accessibility plugin due to mobile browser");
      return;
    }

    // -------------

    element.prepend(TEMPLATE);

    var html = $("html");
    var body = $("body");
    var container = $(".open-accessibility");
    var menu = $(".open-accessibility-menu");
    var expandButton = $(".open-accessibility-expand-button");
    var closeButton = $(".open-accessibility-close-button");
    var invertButton = $(".open-accessibility-invert-button");
    var cursorButton = $(".open-accessibility-cursor-button");
    var fZoomInButton = $(".open-accessibility-font-zoom-in-button");
    var fZoomOutButton = $(".open-accessibility-font-zoom-out-button");
    var pZoomButton = $(".open-accessibility-page-zoom-button");
    var monochromeButton = $(".open-accessibility-monochrome-button");
    var contrastButton = $(".open-accessibility-contrast-button");
    var linksButton = $(".open-accessibility-links-button");
    var animationButton = $(".open-accessibility-animation-button");
    var resetButton = $(".open-accessibility-reset-button");
    var cursorWorkaround = $(".open-accessibility-cursor-workaround");
    var languageSelector = $("#lang-sel");

    // Initialize
    applyFontZoom(options.fontSelector, 1);

    // Set icon size
    container.addClass(getIconClass(options.iconSize));

    // Set Langauges
    var languages = getLanguages(options.localization, options.localizationMap);
    translateTheme(languages[Object.keys(languages)[0]]);

    html.addClass("open-accessibility-font-Zoom");

    // Adding Enter or Space trigger to Toolbar Buttons
    $(
      ".open-accessibility-expand-button,.open-accessibility-close-button,.open-accessibility-menu-button, .open-accessibility-menu-footer"
    ).keyup(function (event) {
      if (event.keyCode == 13 || event.keyCode == 32) {
        event.preventDefault();

        $(this).click();
      }
    });

    // -------------
    // Menu open button click

    expandButton.click(() => {
      options.isMenuOpened = true;
      apply();
    });

    // -------------
    // Menu close button click

    closeButton.click(() => {
      options.isMenuOpened = false;
      apply();
    });

    // -------------
    // Click outside of the menu -> close

    $(document).click((event) => {
      if (!$(event.target).closest(".open-accessibility").length) {
        if (options.isMenuOpened) {
          options.isMenuOpened = false;
          apply();
        }
      }
    });

    expandButton.hide();
    menu.hide();

    if (customOptions.isMenuOpened) {
      options.isMenuOpened = true;
      menu.show();
      expandButton.hide();
    } else {
      options.isMenuOpened = false;
    }

    // -------------
    // Text Zoom in button click

    fZoomInButton.click(() => {
      options.fZoom = Math.min(
        options.maxFZoomLevel,
        options.fZoom + options.fZoomStep
      );
      console.log("zi", options.fZoom);
      apply();
    });

    // -------------
    // Text Zoom out button click

    fZoomOutButton.click(() => {
      options.fZoom = Math.max(
        options.minFZoomLevel,
        options.fZoom - options.fZoomStep
      );
      console.log("zo", options.fZoom);
      apply();
    });

    // -------------
    // Invert button click

    invertButton.click(() => {
      options.invert = !options.invert;
      apply();
    });

    // -------------
    // Cursor button click

    cursorButton.click(() => {
      options.cursor = !options.cursor;
      apply();
    });

    // Mouse cursor workaround

    cursorWorkaround.hide();

    var googleChrome = isGoogleChrome();
    if (!googleChrome) {
      $(document).on("mousemove", function (e) {
        if (!options.cursor) {
          return;
        }

        cursorWorkaround.css({
          left: e.pageX / options.fZoom,
          top: e.pageY / options.fZoom,
        });
      });
    }

    // -------------
    // Page zoom button click

    pZoomButton.click(() => {
      console.log("pZoom", options.pZoom);
      console.log("minPZoomLevel", options.minPZoomLevel);
      console.log("maxPZoomLevel", options.maxPZoomLevel);

      options.pZoom += options.pZoomStep;
      options.mZoom -= options.pZoomStep;

      if (options.pZoom > options.maxPZoomLevel) {
        options.pZoom = options.minPZoomLevel;
      }

      apply();
    });

    // -------------
    // Contrast button click

    contrastButton.click(() => {
      options.contrast += 50;

      if (options.contrast > 150) {
        options.contrast = 50;
      }

      apply();
    });

    // -------------
    // Grayscale button click

    monochromeButton.click(() => {
      options.grayscale += 100;
      if (options.grayscale > 100) {
        options.grayscale = 0;
      }

      apply();
    });

    // -------------
    // Links button click

    linksButton.click(() => {
      options.highlightedLinks = !options.highlightedLinks;
      apply();
    });

    // -------------
    // Animation stop button click

    animationButton.click(() => {
      console.log("options", options);
      options.isAnimStopped = !options.isAnimStopped;
      apply();
    });

    // -------------
    // Reset button click

    resetButton.click(() => {
      options = $.extend({}, initialOptions);
      options.isMenuOpened = false;
      apply();
    });

    // position menu on absolute right
    // if ($("body").css("margin") != "")
    //   $(".open-accessibility-collapsed").css(
    //     "right",
    //     "-" + $("body").css("margin")
    //   );

    // apply();

    // Get selected lamguage

    $("#lang-sel").change(function () {
      // alert($(this).val());

      options.localization = $(this).val();
      console.log("options.localization", options.localization);
      var selectedLanguage = options.localization;

      if (selectedLanguage == "sp") {
        $(function () {
          $("body").openAccessibility({
            isMenuOpened: true,
            localization: ["sp"],
          });
          document.getElementById("lang-sel").value = selectedLanguage;
          // document.getElementById("sp").selected = true;
        });
      } else if (selectedLanguage == "he") {
        $(function () {
          $("body").openAccessibility({
            isMenuOpened: true,
            localization: ["he"],
          });
          document.getElementById("lang-sel").value = selectedLanguage;
          // document.getElementById("he").selected = true;
        });
      } else if (selectedLanguage == "en") {
        $(function () {
          $("body").openAccessibility({
            isMenuOpened: true,
            localization: ["en"],
          });
          // alert(selectedLanguage);
          document.getElementById("lang-sel").value = selectedLanguage;
          // document.getElementById("en").selected = true;
        });
      }
      apply();
    });

    // languageSelector.mousedown(() => {
    //   options.localization = document.getElementById("lang-sel").value;
    //   console.log("options.localization", options.localization);
    //   // alert(options.localization);
    //   var selectedLanguage = options.localization;

    //   if (selectedLanguage == "sp") {
    //     $(function () {
    //       $("body").openAccessibility({
    //         isMenuOpened: true,
    //         localization: ["sp"],
    //       });
    //       document.getElementById("lang-sel").value = selectedLanguage;
    //       // document.getElementById("sp").selected = true;
    //     });
    //   } else if (selectedLanguage == "he") {
    //     $(function () {
    //       $("body").openAccessibility({
    //         isMenuOpened: true,
    //         localization: ["he"],
    //       });
    //       document.getElementById("lang-sel").value = selectedLanguage;
    //       // document.getElementById("he").selected = true;
    //     });
    //   } else if (selectedLanguage == "en") {
    //     $(function () {
    //       $("body").openAccessibility({
    //         isMenuOpened: true,
    //         localization: ["en"],
    //       });
    //       // alert(selectedLanguage);
    //       document.getElementById("lang-sel").value = selectedLanguage;
    //       // document.getElementById("en").selected = true;
    //     });
    //   }
    //   apply();
    // });

    apply();

    function apply() {
      // ----------------

      if (options.isMenuOpened) {
        expandButton.fadeOut(300);
        menu.fadeIn(300);

        container.removeClass("open-accessibility-collapsed");
        container.addClass("open-accessibility-expanded");
      } else {
        expandButton.fadeIn(300);
        menu.fadeOut(300);

        container.removeClass("open-accessibility-expanded");
        container.addClass("open-accessibility-collapsed");
      }

      // ----------
      // Text Zoom
      applyFontZoom(options.fontSelector, options.fZoom);

      if (options.fZoom > options.minFZoomLevel) {
        fZoomInButton.addClass("button-pressed");
        document
          .getElementById("font-zoom-in-button")
          .setAttribute("aria-pressed", "true");
      } else {
        fZoomInButton.removeClass("button-pressed");
        document
          .getElementById("font-zoom-in-button")
          .setAttribute("aria-pressed", "false");
      }

      if (options.fZoom >= options.maxFZoomLevel) {
        fZoomInButton.addClass("disabled-button");
        document
          .getElementById("font-zoom-in-button")
          .setAttribute("aria-disabled", "true");
      } else {
        fZoomInButton.removeClass("disabled-button");
        document
          .getElementById("font-zoom-in-button")
          .setAttribute("aria-disabled", "false");
        fZoomInButton.addClass("open-accessibility-menu-button");
      }

      if (options.fZoom <= options.minFZoomLevel) {
        fZoomOutButton.removeClass("button-pressed");
        fZoomOutButton.addClass("disabled-button");
        document
          .getElementById("font-zoom-out-button")
          .setAttribute("aria-disabled", "true");
      } else {
        fZoomOutButton.removeClass("disabled-button");
        document
          .getElementById("font-zoom-out-button")
          .setAttribute("aria-disabled", "false");
        fZoomOutButton.addClass("open-accessibility-menu-button");
      }

      // $(".open-accessibility-zoom").css(
      //   "transform",
      //   "scale(" + options.zoom + ")"
      // );

      // ----------------
      // Filters

      var filters = [];

      // Invert

      if (options.invert) {
        invertButton.addClass("button-pressed");
        filters.push("invert(1)");

        if (
          typeof html.css("background-color") == "undefined" ||
          html.css("background-color") == "rgba(0, 0, 0, 0)"
        )
          html.css("background-color", "#ffffff");

        if (
          html.attr("data-open-accessibility-background-color-original") == ""
        ) {
          html.attr(
            "data-open-accessibility-background-color-original",
            html.css("background-color")
          );
          html.css(
            "background-color",
            invertColor(html.css("background-color"))
          );
        }
      } else {
        invertButton.removeClass("button-pressed");

        html.css(
          "background-color",
          html.attr("data-open-accessibility-background-color-original")
        );
        html.attr("data-open-accessibility-background-color-original", "");
      }

      // ----------
      // Cursor

      if (options.cursor) {
        html.addClass("open-accessibility-cursor");
        cursorButton.addClass("button-pressed");
        document
          .getElementById("cursor-button")
          .setAttribute("aria-pressed", "true");
        if (!googleChrome) {
          cursorWorkaround.show();
        }
      } else {
        html.removeClass("open-accessibility-cursor");
        cursorButton.removeClass("button-pressed");
        document
          .getElementById("cursor-button")
          .setAttribute("aria-pressed", "false");

        if (!googleChrome) {
          cursorWorkaround.hide();
        }
      }

      // Page Zoom

      // if (options.brightness == 100) {
      //   brightnessButton.removeClass("button-pressed");
      //   document
      //     .getElementById("brightness-button")
      //     .setAttribute("aria-pressed", "false");
      // } else {
      //   // console.log("AAA", options.contrast);
      //   // $("html").css("zoom", "200%");
      //   brightnessButton.addClass("button-pressed");
      //   document
      //     .getElementById("brightness-button")
      //     .setAttribute("aria-pressed", "true");
      // }

      // console.log("b", options.brightness);

      if (options.pZoom > options.minPZoomLevel) {
        $("body")
          // .not(".open-accessibility * svg")
          // .not(".open-accessibility svg")
          // .not(".open-accessibility-expanded")
          .not(".open-accessibility-size-s")
          .not("head")
          .not(".open-accessibility-cursor-workaround")
          .not("script")
          // .not(".open-accessibility-menu-button")
          // .not(".open-accessibility-page-zoom-button")
          // .not(".button-pressed")
          // .not("#page-zoom-button")
          .not(".open-accessibility-font-Zoom")
          .not(".open-accessibility *")
          .not(".open-accessibility")
          .css("zoom", options.pZoom);

        $(".open-accessibility *").css("zoom", 1);

        pZoomButton.addClass("button-pressed");
        document
          .getElementById("page-zoom-button")
          .setAttribute("aria-pressed", "true");
        // var setZoom = (options.pZoom * 100).toFixed(0) + "%";
        // alert(setZoom);
        // document.body.style.zoom = setZoom;
      } else {
        $("*")
          .not(".open-accessibility *")
          .not(".open-accessibility")
          .css("zoom", options.pZoom);
        pZoomButton.removeClass("button-pressed");
        document
          .getElementById("page-zoom-button")
          .setAttribute("aria-pressed", "false");
      }

      // Contrast

      if (options.contrast > 100) {
        $("*")
          // .not(".open-accessibility *")
          // .not(".open-accessibility")
          // .not("a")
          .addClass("dc");

        $("*").removeClass("lc");

        contrastButton.addClass("button-pressed");
        document
          .getElementById("contrast-button")
          .setAttribute("aria-pressed", "true");
      } else if (options.contrast < 100) {
        $("*")
          .not(".open-accessibility *")
          .not(".open-accessibility")
          .not("a")
          // .not("img")
          .addClass("lc");

        $("*").removeClass("dc");

        contrastButton.addClass("button-pressed");
        document
          .getElementById("contrast-button")
          .setAttribute("aria-pressed", "true");
      } else {
        $("*").removeClass("dc");
        $("*").removeClass("lc");

        contrastButton.removeClass("button-pressed");
        document
          .getElementById("contrast-button")
          .setAttribute("aria-pressed", "false");
      }

      console.log("c", options.contrast);

      // Grayscale

      if (options.grayscale == 100) {
        monochromeButton.addClass("button-pressed");
      } else {
        monochromeButton.removeClass("button-pressed");
      }

      filters.push("contrast(" + 100 + "%)");
      filters.push("brightness(" + options.brightness + "%)");
      filters.push("grayscale(" + options.grayscale + "%)");
      var filterValue = filters.join(" ");
      console.log("filterValue", filterValue);
      html.css("filter", filterValue);
      html.css("-ms-filter", filterValue);
      html.css("-moz-filter", filterValue);
      html.css("-webkit-filter", filterValue);
      html.css("-o-filter", filterValue);

      // Link Highlight
      if (options.highlightedLinks) {
        $("a:not(a:has(img))")
          .not(".open-accessibility *")
          .addClass("highlight-links");
        $("a img").addClass("highlight-links");
        // $(".open-accessibility-menu-footer").addClass("highlight-links");
        // $(".open-accessibility-menu-footer svg").addClass(
        //   "highlight-links-footer-img"
        // );

        linksButton.addClass("button-pressed");
        document
          .getElementById("links-button")
          .setAttribute("aria-pressed", "true");
      } else {
        $("a:not(a:has(img))").removeClass("highlight-links");
        $("a img").removeClass("highlight-links");
        $(".open-accessibility-menu-footer").removeClass("highlight-links");
        $(".open-accessibility-menu-footer svg").removeClass(
          "highlight-links-footer-img"
        );

        linksButton.removeClass("button-pressed");
        document
          .getElementById("links-button")
          .setAttribute("aria-pressed", "false");
      }

      // Animation Stop
      if (options.isAnimStopped) {
        $("*").not(".open-accessibility *").addClass("paused");
        animationButton.addClass("button-pressed");
        document
          .getElementById("stop-anim-button")
          .setAttribute("aria-pressed", "true");
      } else {
        $("*").removeClass("paused");
        animationButton.removeClass("button-pressed");
        document
          .getElementById("stop-anim-button")
          .setAttribute("aria-pressed", "false");
      }

      setUserOptions(options);
    }

    function invertColor(rgb) {
      rgb = rgb
        .replace("rgb", "")
        .replace("(", "")
        .replace(")", "")
        .replace(" ", "");
      var rgbArr = rgb.split(",");
      if (rgbArr.length != 3) return "";

      var r = 255 - rgbArr[0],
        g = 255 - rgbArr[1],
        b = 255 - rgbArr[2];

      return "rgb(" + r + "," + g + "," + b + ")";
    }
  };
})(jQuery || $);