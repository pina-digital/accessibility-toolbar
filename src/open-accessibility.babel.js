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
    // console.log("zooming " + selector);
    $(selector)
      .not(".empties")
      .not(".empty")
      .not(".fill")
      .not(".open-accessibility-cursor-workaround")
      .not(".open-accessibility *")
      .not(".open-accessibility") // To avoid messing up the menu bar itself
      .not("body")
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
    // console.log("langs", langs);
    var res = {};
    langs.forEach((key) => {
      var value = (map && map[key]) || locale[key];
      if ($.isPlainObject(value)) {
        res[key] = value;
      } else {
        console.error(key + "language does not set!");
      }
      // console.log("aaaaaa", res);
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
      highlightedLinks: false,
      isMobileEnabled: true,
      grayscale: 0,
      brightness: 100,
      contrast: 100,
      maxFZoomLevel: 3,
      minFZoomLevel: 1,
      fZoomStep: 0.2,
      fZoom: 1,
      maxPZoomLevel: 1.9,
      minPZoomLevel: 1,
      pZoomStep: 0.2,
      pZoom: 1,
      mZoom: 1,
      cursor: false,
      fontSelector: "div,span,p,a,td,table,tr,h1,h2,h3,h4,h5,h6,input",
      invert: false,
      isAnimStopped: false,
      iconSize: "s", // supported sizes are s(mall), m(edium), l(arge)
      // origMenuTop: window.innerHeight * 0.25,
      imagesRemove: false,
      focus: false,
      fontReadable: false,
      headings: false,
      // Default Custom Settings
      localization: ["he"],
      toolbarSide: true,
      toolbarVertPos: "5",
      mainColor: "#114761",
      isMenuOpened: false,
      accessibilityDeclaration: "",
    };

    var userOptions = getUserOptions();
    // console.log("userOptions", userOptions);
    // console.log("defaultOptions", defaultOptions);

    var initialOptions = $.extend({}, defaultOptions, customOptions);
    // console.log("initialOptions", initialOptions);
    // console.log("customOptions", customOptions);

    var options = $.extend({}, initialOptions, customOptions, userOptions);
    // console.log("options", options);
    if (!options.isMobileEnabled && isMobileBrowser()) {
      console.log("disabling accessibility plugin due to mobile browser");
      return;
    }

    $("#saveChangesButton").click(function saveChanges() {
      var updated_local_storage_options_key = localStorage.getItem(
        LOCAL_STORAGE_OPTIONS_KEY
      );
      updated_local_storage_options_key = JSON.parse(
        updated_local_storage_options_key
      );
      delete updated_local_storage_options_key.mainColor;
      delete updated_local_storage_options_key.accessibilityDeclaration;
      delete updated_local_storage_options_key.isMenuOpened;
      delete updated_local_storage_options_key.localization;
      delete updated_local_storage_options_key.toolbarSide;
      delete updated_local_storage_options_key.toolbarVertPos;
      console.log(
        "updated_local_storage_options_key",
        updated_local_storage_options_key
      );
      localStorage.setItem(
        LOCAL_STORAGE_OPTIONS_KEY,
        JSON.stringify(updated_local_storage_options_key)
      );
      location.reload();
      return false;
    });

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
    var imagesButton = $(".open-accessibility-imgRemove-button");
    var focusButton = $(".open-accessibility-focus-button");
    var fontReadableButton = $(".open-accessibility-fontReadable-button");
    var headingsButton = $(".open-accessibility-headings-button");
    var revertButton = $(".open-accessibility-revert-button");
    var cursorWorkaround = $(".open-accessibility-cursor-workaround");
    var languageSelector = $("#lang-sel");
    var toolbarSwitch = $("#togBtn");
    var pZoomIndicator = $("#pZoom-indicator");
    var fZoomInIndicator = $("#fZoomIn-indicator");
    var fZoomOutIndicator = $("#fZoomOut-indicator");

    // Initialize
    applyFontZoom(options.fontSelector, 1);

    // Set icon size
    container.addClass(getIconClass(options.iconSize));

    // Setting Toolbar's Main Color to var in style.scss
    let root = document.documentElement;
    root.style.setProperty("--main-color", options.mainColor);

    // Setting Toolbar's footer logo hover behaviour
    $("#open-accessibility-footer-logo").hover(
      function () {
        $(this).css("background-color", "#e6e6e6");
        $(".pw").css("fill", options.mainColor);
        // $(this).css("fill", "#fff");
      },
      function () {
        $(this).css("background-color", options.mainColor);
        $(".pw").css("fill", "#fff");
        // $(this).css("fill", options.mainColor);
      }
    );

    // -------------
    // Set Langauges
    var languages = getLanguages(options.localization, options.localizationMap);
    translateTheme(languages[Object.keys(languages)[0]]);

    html.addClass("open-accessibility-font-Zoom");

    // -------------
    // Adding Enter or Space trigger to Toolbar Buttons
    $(
      ".open-accessibility-expand-button,.open-accessibility-close-button,.open-accessibility-menu-button, .l-switch, .open-accessibility-language-selector, .open-accessibility-menu-footer"
    ).keyup(function (event) {
      if (event.keyCode == 13 || event.keyCode == 32) {
        event.preventDefault();

        $(this).click();
      }
    });

    // -------------
    // Getting the window height
    var screenHeight;
    $(window).on("load resize", function () {
      screenHeight = this.screen.height;
      apply();
    });

    // -------------
    // Setting the accessibility declaration's url
    $("#accDec").attr("href", options.accessibilityDeclaration);

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
    // Toolbar side switch
    $("#togBtn").prop("checked", options.toolbarSide);
    toolbarSwitch.change(function () {
      options.toolbarSide = !options.toolbarSide;
      apply();
      // location.reload();
    });

    // -------------
    // Get selected lamguage

    // $("#lang-sel").change(function () {
    languageSelector.change(function () {
      options.localization = $(this).val();
      // console.log("options.localization", options.localization);
      var selectedLanguage = options.localization;

      if (selectedLanguage == "he") {
        options.localization = ["he"];
        languages = getLanguages(options.localization, options.localizationMap);
        translateTheme(languages[Object.keys(languages)[0]]);
      } else if (selectedLanguage == "en") {
        options.localization = ["en"];
        languages = getLanguages(options.localization, options.localizationMap);
        translateTheme(languages[Object.keys(languages)[0]]);
      } else if (selectedLanguage == "ru") {
        options.localization = ["ru"];
        languages = getLanguages(options.localization, options.localizationMap);
        translateTheme(languages[Object.keys(languages)[0]]);
      } else if (selectedLanguage == "ar") {
        options.localization = ["ar"];
        languages = getLanguages(options.localization, options.localizationMap);
        translateTheme(languages[Object.keys(languages)[0]]);
      } else if (selectedLanguage == "es") {
        options.localization = ["es"];
        languages = getLanguages(options.localization, options.localizationMap);
        translateTheme(languages[Object.keys(languages)[0]]);
      } else if (selectedLanguage == "fr") {
        options.localization = ["fr"];
        languages = getLanguages(options.localization, options.localizationMap);
        translateTheme(languages[Object.keys(languages)[0]]);
      } else if (selectedLanguage == "pt") {
        options.localization = ["pt"];
        languages = getLanguages(options.localization, options.localizationMap);
        translateTheme(languages[Object.keys(languages)[0]]);
      }

      options.isMenuOpened = true;
      apply();
    });

    // -------------
    // Text Zoom in button click
    function fZoomInRemoveClass() {
      fZoomInIndicator.removeClass("button-indicator");
      fZoomInIndicator.addClass("hidden-indicator");
    }

    fZoomInButton.click(() => {
      options.fZoom = Math.min(
        options.maxFZoomLevel,
        options.fZoom + options.fZoomStep
      );
      // console.log("zi", options.fZoom);
      apply();

      fZoomInIndicator.addClass("button-indicator");
      fZoomInIndicator.removeClass("hidden-indicator");
      setTimeout(fZoomInRemoveClass, 2000);
    });

    // -------------
    // Text Zoom out button click
    function fZoomOutRemoveClass() {
      fZoomOutIndicator.removeClass("button-indicator");
      fZoomOutIndicator.addClass("hidden-indicator");
    }

    fZoomOutButton.click(() => {
      options.fZoom = Math.max(
        options.minFZoomLevel,
        options.fZoom - options.fZoomStep
      );
      // console.log("zo", options.fZoom);
      apply();
      fZoomOutIndicator.addClass("button-indicator");
      fZoomOutIndicator.removeClass("hidden-indicator");
      setTimeout(fZoomOutRemoveClass, 2000);
    });

    // -------------
    // Bigger Cursor button click
    cursorButton.click(() => {
      options.cursor = !options.cursor;
      apply();
    });

    // -------------
    // Page zoom button click
    function pZoomRemoveClass() {
      pZoomIndicator.removeClass("button-indicator");
      pZoomIndicator.addClass("hidden-indicator");
    }

    pZoomButton.click(() => {
      options.pZoom += options.pZoomStep;
      // console.log("pZoom", options.pZoom);

      var calculus = 1 / options.pZoom;
      options.mZoom = calculus;
      // console.log("mZoom", options.mZoom);

      if (options.pZoom > options.maxPZoomLevel) {
        options.pZoom = options.minPZoomLevel;
        options.mZoom = options.minPZoomLevel;
      }
      apply();
      pZoomIndicator.addClass("button-indicator");
      pZoomIndicator.removeClass("hidden-indicator");
      setTimeout(pZoomRemoveClass, 2000);
    });

    // -------------
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
    // Contrast button click
    contrastButton.click(() => {
      options.contrast += 50;

      if (options.contrast > 150) {
        options.contrast = 50;
      }
      apply();
    });

    // -------------
    // Invert button click
    invertButton.click(() => {
      options.invert = !options.invert;
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
      // console.log("options", options);
      options.isAnimStopped = !options.isAnimStopped;
      apply();
    });

    // -------------
    // Images remove button click
    imagesButton.click(() => {
      options.imagesRemove = !options.imagesRemove;
      // console.log("imagesRemove", options.imagesRemove);
      apply();
    });

    // -------------
    // Focus strip button click
    focusButton.click(() => {
      options.focus = !options.focus;
      // console.log("focus", options.focus);
      apply();
    });

    // -------------
    // Readable font button click
    fontReadableButton.click(() => {
      options.fontReadable = !options.fontReadable;
      // console.log("fontReadable", options.fontReadable);
      apply();
    });

    // -------------
    // Headings button click
    headingsButton.click(() => {
      options.headings = !options.headings;
      // console.log("headings", options.headings);
      apply();
    });

    // -------------
    // revert button click
    revertButton.click(() => {
      var newUserOptions = getUserOptions();
      options = $.extend({}, initialOptions);
      options.localization = newUserOptions.localization;
      options.toolbarSide = newUserOptions.toolbarSide;
      // $(".open-accessibility-menu-button").css({
      //   fill: options.mainColor,
      //   color: options.mainColor,
      //   backgroundColor: "transparent",
      // });

      // options.isMenuOpened = false;
      options.isMenuOpened = true;

      apply();
    });

    apply();

    function apply() {
      var userOptions = getUserOptions();
      // console.log("userOptions", userOptions);
      // console.log("initialOptions111", initialOptions);

      var options2 = $.extend({}, options, userOptions);
      // console.log("options2", options2);
      options.toolbarVertPos = options2.toolbarVertPos;
      // console.log("optionstest", options);
      // ----------------
      // Setting the toolbar's buttons section height based on window height
      // if (screenHeight < 1080) {
      //   $(".open-accessibility-menu-buttons").addClass("low-res-screen");
      //   // $("#pina-container").css("width", "262px");
      //   document.getElementById("pina-container").style.width =
      //     "262px !important";
      //   $(".open-accessibility-menu-footer").css("width", "262px");
      // } else {
      //   $(".open-accessibility-menu-buttons").removeClass("low-res-screen");
      //   $("#pina-container").css("width", "256px");
      //   $(".open-accessibility-menu-footer").css("width", "256px");
      // }

      // ----------------
      // Changing between menu closed/open classes
      if (options.isMenuOpened) {
        expandButton.fadeOut(10);
        menu.fadeIn(600);

        container.removeClass("open-accessibility-collapsed");
        container.addClass("open-accessibility-expanded");
      } else {
        expandButton.fadeIn(10);
        menu.fadeOut(300);

        container.removeClass("open-accessibility-expanded");
        container.addClass("open-accessibility-collapsed");
      }

      // ----------
      // Toolbar Side
      if (options.toolbarSide) {
        $("#empties-side").css("right", "0px");
        document.getElementById("empties-side").style.removeProperty("left");
        // $("#empties-side").removeProp("left");
        // $("#empties-side").removeAttr("left");
        $("#empties-side").css("direction", "rtl");
        $("#filler").css("direction", "rtl");
        $("#lbexpand").css("border-radius", "50% 0% 0% 50%");

        $("#side-switch").css("margin", "0 2px 0 43px");
        $("#oals").css("margin", "0 0 0 25px");

        document
          .getElementById("pt-font-zoomin")
          .setAttribute("viewBox", "30 20 70 70");

        document
          .getElementById("pt-font-zoomout")
          .setAttribute("viewBox", "30 20 70 70");
        document
          .getElementById("pt-page-zoomin")
          .setAttribute("viewBox", "30 20 70 70");
        document
          .getElementById("pt-cursor")
          .setAttribute("viewBox", "0 5 60 60");
        document
          .getElementById("pt-contrast")
          .setAttribute("viewBox", "30 20 70 70");
        document
          .getElementById("pt-invert")
          .setAttribute("viewBox", "30 20 70 70");
        document
          .getElementById("pt-monochrome")
          .setAttribute("viewBox", "30 20 65 65");
        document
          .getElementById("pt-links")
          .setAttribute("viewBox", "30 17 65 65");
        document
          .getElementById("pt-pause")
          .setAttribute("viewBox", "32 20 65 65");
        document
          .getElementById("pt-images-remove")
          .setAttribute("viewBox", "0 -4 70 70");
        document
          .getElementById("pt-focus")
          .setAttribute("viewBox", "2 -4 70 70");
        document
          .getElementById("pt-font-readable")
          .setAttribute("viewBox", "-15 -9 55 55");
        document
          .getElementById("fr-11")
          .setAttribute("transform", "translate(11.04 13.97)");
        document
          .getElementById("pt-headings")
          .setAttribute("viewBox", "-12 -4 55 55");
        document
          .getElementById("pt-revert")
          .setAttribute("viewBox", "2 -4 65 65");
        // $("#pt-font-zoomin").attr("viewBox", "30 20 70 70");
        // $("#pt-font-zoomout").attr("viewBox", "30 20 70 70");
        // $("#pt-page-zoomin").attr("viewBox", "30 20 70 70");
        // $("#pt-cursor").attr("viewBox", "0 5 60 60");
        // $("#pt-contrast").attr("viewBox", "30 20 70 70");
        // $("#pt-invert").attr("viewBox", "30 20 70 70");
        // $("#pt-monochrome").attr("viewBox", "30 20 65 65");
        // $("#pt-links").attr("viewBox", "30 17 65 65");
        // $("#pt-pause").attr("viewBox", "32 20 65 65");
        // $("#pt-images-remove").attr("viewBox", "0 -4 70 70");
        // $("#pt-focus").attr("viewBox", "2 -4 70 70");
        // $("#pt-font-readable").attr("viewBox", "-15 -9 55 55");
        // $("#fr-11").attr("transform", "translate(11.04 13.97)");
        // $("#pt-headings").attr("viewBox", "-12 -4 55 55");
        // $("#pt-revert").attr("viewBox", "2 -4 65 65");

        $("#menu-disclaimer").css("margin", "0 53px 0 0");
        $("#menu-version").css("margin", "0 0 0 15px");
      } else {
        $("#empties-side").css("left", "0px");
        document.getElementById("empties-side").style.removeProperty("right");
        $("#empties-side").css("direction", "ltr");
        $("#filler").css("direction", "ltr");
        $("#lbexpand").css("border-radius", "0% 50% 50% 0%");

        $("#side-switch").css("margin", "0 43px 0 2px");
        $("#oals").css("margin", "0 25px 0 0");

        document
          .getElementById("pt-font-zoomin")
          .setAttribute("viewBox", "52 20 70 70");
        document
          .getElementById("pt-font-zoomout")
          .setAttribute("viewBox", "52 20 70 70");
        document
          .getElementById("pt-page-zoomin")
          .setAttribute("viewBox", "52 20 70 70");
        document
          .getElementById("pt-cursor")
          .setAttribute("viewBox", "20 5 60 60");
        document
          .getElementById("pt-contrast")
          .setAttribute("viewBox", "52 20 70 70");
        document
          .getElementById("pt-invert")
          .setAttribute("viewBox", "52 20 70 70");
        document
          .getElementById("pt-monochrome")
          .setAttribute("viewBox", "52 20 65 65");
        document
          .getElementById("pt-links")
          .setAttribute("viewBox", "52 17 65 65");
        document
          .getElementById("pt-pause")
          .setAttribute("viewBox", "52 20 65 65");
        document
          .getElementById("pt-images-remove")
          .setAttribute("viewBox", "22 -4 70 70");
        document
          .getElementById("pt-focus")
          .setAttribute("viewBox", "22 -4 70 70");
        document
          .getElementById("pt-font-readable")
          .setAttribute("viewBox", "3 -9 55 55");
        document
          .getElementById("fr-11")
          .setAttribute("transform", "translate(1.04 13.97)");
        document
          .getElementById("pt-headings")
          .setAttribute("viewBox", "32 -4 55 55");
        document
          .getElementById("pt-revert")
          .setAttribute("viewBox", "22 -4 65 65");

        $("#menu-disclaimer").css("margin", "0 0 0 53px");
        $("#menu-version").css("margin", "0 15px 0 0");
      }

      // ----------
      // Selected language
      var selectedLanguage = options.localization;
      $("#lang-sel").val(selectedLanguage);
      // ----------
      // Text Zoom
      applyFontZoom(options.fontSelector, options.fZoom);
      var fZoomInd = "x " + options.fZoom.toFixed(1);

      $("#fZoomIn-indicator").html(fZoomInd);
      $("#fZoomOut-indicator").html(fZoomInd);

      if (options.fZoom > options.minFZoomLevel) {
        fZoomInButton.addClass("button-pressed");
        fZoomInButton.attr("aria-pressed", "true");
      } else {
        fZoomInButton.removeClass("button-pressed");
        fZoomInButton.attr("aria-pressed", "false");
      }

      if (options.fZoom >= options.maxFZoomLevel) {
        fZoomInButton.addClass("disabled-button");
        fZoomInButton.attr("aria-disabled", "true");
      } else {
        fZoomInButton.removeClass("disabled-button");
        fZoomInButton.attr("aria-disabled", "false");
      }

      if (options.fZoom <= options.minFZoomLevel) {
        fZoomOutButton.removeClass("button-pressed");
        fZoomOutButton.addClass("disabled-button");
        fZoomOutButton.attr("aria-disabled", "true");
      } else {
        fZoomOutButton.removeClass("disabled-button");
        fZoomOutButton.attr("aria-disabled", "false");
      }

      // ----------
      // Page Zoom
      $("body").css("zoom", options.pZoom);
      $(".empty").not(".fill").css("zoom", options.mZoom);

      var pZoomInd = "x " + options.pZoom.toFixed(1);
      $("#pZoom-indicator").html(pZoomInd);

      if (options.pZoom > options.minPZoomLevel) {
        pZoomButton.addClass("button-pressed");
        pZoomButton.attr("aria-pressed", "true");
      } else {
        pZoomButton.removeClass("button-pressed");
        pZoomButton.attr("aria-pressed", "false");
      }

      // ----------
      // Bigger Cursor

      if (options.cursor) {
        cursorButton.addClass("button-pressed");
        cursorButton.attr("aria-pressed", "true");

        $("*").addClass("open-accessibility-cursor");
      } else {
        cursorButton.removeClass("button-pressed");
        cursorButton.attr("aria-pressed", "false");

        $("*").removeClass("open-accessibility-cursor");
      }

      // ----------------
      // Filters

      var filters = [];

      // Contrast

      // if (screenHeight < 1080) {
      //   $(".open-accessibility-menu-buttons").addClass("low-res-screen");
      //   // $("#pina-container").css("width", "262px");
      //   document.getElementById("pina-container").style.width =
      //     "262px !important";
      //   $(".open-accessibility-menu-footer").css("width", "262px");
      // } else {
      //   $(".open-accessibility-menu-buttons").removeClass("low-res-screen");
      //   $("#pina-container").css("width", "256px");
      //   $(".open-accessibility-menu-footer").css("width", "256px");
      // }

      if (options.contrast > 100) {
        contrastButton.addClass("button-pressed");
        contrastButton.attr("aria-pressed", "true");

        $("*")
          .not(".empty")
          .not(".empties")
          .not("#filler")
          .not("#lbexpand")
          .not("#expand-image")
          .not("#lbclose")
          .not("#pt-close")
          .not("#pina-container")
          .not(".open-accessibility-menu-button")
          .not(".open-accessibility-menu-button svg")
          .not(".open-accessibility-menu-button span")
          .not(".button-indicator")
          .not(".hidden-indicator")
          .not(".button-icon")
          .not(".open-accessibility-expand-button")
          .not(".first-line")
          .not(".open-accessibility-expand-button svg")
          .not("#open-accessibility-footer-logo")
          .not(".open-accessibility")
          .not("a")
          .addClass("dc");
        $("*").removeClass("lc");
        $(".open-accessibility-menu-button span").addClass("dc-button");

        $("#lbexpand").css("background-color", "#fff");
        $("#expand-image").css("fill", options.mainColor);
        $("#open-accessibility-footer-logo").css(
          "background-color",
          "transparent"
        );
        $(".open-accessibility-menu").css("border", "2px solid white");
        $(".open-accessibility-menu").css("border-radius", "10px");

        if (screenHeight < 1080) {
          $(".open-accessibility-container").css("width", "262px");
          $(".open-accessibility-menu-buttons").css("width", "262px");
          $(".open-accessibility-menu-buttons").css("height", "376px");
          $(".open-accessibility-menu-footer").css("width", "auto");
        } else {
          $(".open-accessibility-container").css("width", "260px");
          $(".open-accessibility-menu-buttons").css("width", "256px");
          $(".open-accessibility-menu-buttons").css("height", "auto");
          $(".open-accessibility-menu-footer").css("width", "256px");
        }
      } else if (options.contrast < 100) {
        contrastButton.attr("aria-pressed", "true");

        $("*")
          .not(".empty")
          .not(".empties")
          .not("#filler")
          .not("#lbexpand")
          .not("#expand-image")
          .not("#lbclose")
          .not("#pt-close")
          .not("#pina-container")
          .not(".on")
          .not("#lang-sel")
          .not(".open-accessibility-menu-button")
          .not(".open-accessibility-menu-button svg")
          .not(".open-accessibility-menu-button span")
          .not(".button-indicator")
          .not(".hidden-indicator")
          .not(".button-icon")
          .not(".open-accessibility-expand-button")
          .not(".first-line")
          .not(".open-accessibility-expand-button svg")
          .not("#open-accessibility-footer-logo")
          .not(".open-accessibility-menu-disclaimer")
          .not("#menu-version")
          .not("#open-accessibility-footer-logo svg")
          .not(".open-accessibility")
          .not("a")
          .addClass("lc");
        $("*").removeClass("dc");

        $("#lbexpand").css("background-color", options.mainColor);
        $("#expand-image").css("fill", "#fff");
        $("#open-accessibility-footer-logo").css(
          "background-color",
          options.mainColor
        );

        $(".open-accessibility-menu").css("border", "none");
        $(".open-accessibility-menu").css("border-radius", "0px");

        $("*").removeClass("dc-button");

        if (screenHeight < 1080) {
          $(".open-accessibility-container").css("width", "262px");
          $(".open-accessibility-menu-buttons").css("width", "262px");
          $(".open-accessibility-menu-buttons").css("height", "376px");
          $(".open-accessibility-menu-footer").css("width", "262px");
        } else {
          $(".open-accessibility-container").css("width", "260px");
          $(".open-accessibility-menu-buttons").css("width", "256px");
          $(".open-accessibility-menu-buttons").css("height", "auto");
          $(".open-accessibility-menu-footer").css("width", "260px");
        }
      } else {
        contrastButton.removeClass("button-pressed");
        contrastButton.attr("aria-pressed", "false");

        $("*").removeClass("dc");
        $("*").removeClass("dc-button");

        $("*").removeClass("lc");

        $("#lbexpand").css("background-color", options.mainColor);
        $("#expand-image").css("fill", "#fff");

        $("#open-accessibility-footer-logo").css(
          "background-color",
          options.mainColor
        );

        if (screenHeight < 1080) {
          $(".open-accessibility-container").css("width", "262px");
          $(".open-accessibility-menu-buttons").css("width", "262px");
          $(".open-accessibility-menu-buttons").css("height", "376px");
          $(".open-accessibility-menu-footer").css("width", "262px");
        } else {
          $(".open-accessibility-container").css("width", "260px");
          $(".open-accessibility-menu-buttons").css("width", "256px");
          $(".open-accessibility-menu-buttons").css("height", "auto");
          $(".open-accessibility-menu-footer").css("width", "260px");
        }
      }

      // console.log("c", options.contrast);

      // Invert

      if (options.invert) {
        invertButton.addClass("button-pressed");
        invertButton.attr("aria-pressed", "true");

        filters.push("invert(1)");

        //   if (
        //     typeof html.css("background-color") == "undefined" ||
        //     html.css("background-color") == "rgba(0, 0, 0, 0)"
        //   )
        //     html.css("background-color", "#ffffff");

        //   if (
        //     html.attr("data-open-accessibility-background-color-original") == ""
        //   ) {
        //     html.attr(
        //       "data-open-accessibility-background-color-original",
        //       html.css("background-color")
        //     );
        //     html.css(
        //       "background-color",
        //       invertColor(html.css("background-color"))
        //     );
        //   }
      } else {
        invertButton.removeClass("button-pressed");
        invertButton.attr("aria-pressed", "false");

        //   html.css(
        //     "background-color",
        //     html.attr("data-open-accessibility-background-color-original")
        //   );
        //   html.attr("data-open-accessibility-background-color-original", "");
      }

      // Grayscale

      if (options.grayscale == 100) {
        monochromeButton.addClass("button-pressed");
        monochromeButton.attr("aria-pressed", "true");
      } else {
        monochromeButton.removeClass("button-pressed");
        monochromeButton.attr("aria-pressed", "false");
      }

      filters.push("contrast(" + 100 + "%)");
      filters.push("brightness(" + options.brightness + "%)");
      filters.push("grayscale(" + options.grayscale + "%)");
      var filterValue = filters.join(" ");
      // console.log("filterValue", filterValue);
      html.css("filter", filterValue);
      html.css("-ms-filter", filterValue);
      html.css("-moz-filter", filterValue);
      html.css("-webkit-filter", filterValue);
      html.css("-o-filter", filterValue);

      // Link Highlight

      if (options.highlightedLinks) {
        linksButton.addClass("button-pressed");
        linksButton.attr("aria-pressed", "true");

        $("a:not(a:has(img))")
          .not(".open-accessibility *")
          .addClass("highlight-links");
        $("a img").addClass("highlight-links");
      } else {
        linksButton.removeClass("button-pressed");
        linksButton.attr("aria-pressed", "false");

        $("a:not(a:has(img))").removeClass("highlight-links");
        $("a img").removeClass("highlight-links");
        $(".open-accessibility-menu-footer").removeClass("highlight-links");
        $(".open-accessibility-menu-footer svg").removeClass(
          "highlight-links-footer-img"
        );
      }

      // Animation Stop
      if (options.isAnimStopped) {
        animationButton.addClass("button-pressed");
        animationButton.attr("aria-pressed", "true");

        $("*").not(".open-accessibility *").not("img").addClass("paused");

        let iframeLength = document.getElementsByTagName("iframe").length;
        for (let i = 0; i < iframeLength; i++) {
          $("iframe")[i].contentWindow.postMessage(
            '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
            "*"
          );
        }
      } else {
        animationButton.removeClass("button-pressed");
        animationButton.attr("aria-pressed", "false");

        $("*").removeClass("paused");

        // for (var i = 0; i < 999; i++) {
        //   $("iframe")[i].contentWindow.postMessage(
        //     '{"event":"command","func":"' + "playVideo" + '","args":""}',
        //     "*"
        //   );
        // }
      }

      // Images Remove
      if (options.imagesRemove) {
        imagesButton.addClass("button-pressed");
        imagesButton.attr("aria-pressed", "true");

        $("img")
          .not(".empty")
          .not(".empties")
          .not("#filler")
          .not("#lbexpand")
          .not("#lbclose svg")
          .not("#pina-container")
          .not(".open-accessibility-menu-button")
          .not(".open-accessibility-menu-button svg")
          .not(".open-accessibility-menu-button span")
          .not(".button-icon")
          .not(".open-accessibility-expand-button")
          .not(".first-line")
          .not(".open-accessibility-expand-button svg")
          .not("#open-accessibility-footer-logo")
          .not(".open-accessibility-menu-disclaimer")
          .not("#open-accessibility-footer-logo svg")
          .not(".open-accessibility")
          .addClass("hide-images");
        $("svg")
          .not(".empty")
          .not(".empties")
          .not("#filler")
          .not("#lbexpand")
          .not("#lbclose svg")
          .not("#pina-container")
          .not(".open-accessibility-menu-button")
          .not(".open-accessibility-menu-button svg")
          .not(".open-accessibility-menu-button span")
          .not(".button-icon")
          .not(".open-accessibility-expand-button")
          .not(".first-line")
          .not(".open-accessibility-expand-button svg")
          .not("#open-accessibility-footer-logo")
          .not(".open-accessibility-menu-disclaimer")
          .not("#open-accessibility-footer-logo svg")
          .not(".open-accessibility")
          .addClass("hide-images");
        $("a svg")
          .not(".empty")
          .not(".empties")
          .not("#filler")
          .not("#lbexpand")
          .not("#lbclose svg")
          .not("#pina-container")
          .not(".open-accessibility-menu-button")
          .not(".open-accessibility-menu-button svg")
          .not(".open-accessibility-menu-button span")
          .not(".button-icon")
          .not(".open-accessibility-expand-button")
          .not(".first-line")
          .not(".open-accessibility-expand-button svg")
          .not("#open-accessibility-footer-logo")
          .not(".open-accessibility-menu-disclaimer")
          .not("#open-accessibility-footer-logo svg")
          .not(".open-accessibility")
          .addClass("hide-images");
        $("img[src]").addClass("hide-images");
        $("div").addClass("hide-images");

        $("div[src]").addClass("hide-images");
        $("iframe[src]").addClass("hide-images");
      } else {
        imagesButton.removeClass("button-pressed");
        imagesButton.attr("aria-pressed", "false");

        $("*").removeClass("hide-images");
      }

      // Focus strip
      if (options.focus) {
        focusButton.addClass("button-pressed");
        focusButton.attr("aria-pressed", "true");

        var focusDiv =
          '<div id="prefollower"></div><div id="follower"></div><div id="parafollower"></div>';
        $("body").append(focusDiv);

        $("html").bind("mousemove", function (e) {
          var h = window.innerHeight;
          var hh = document.body.scrollHeight;

          if (e.pageY <= 100) {
            $("#prefollower").css({ height: 0 });
            $("#parafollower").css({ top: 201 });
          } else if (e.pageY + 100 >= hh) {
            $("#prefollower").css({ bottom: e.pageY - 100 });
            $("#parafollower").css({ top: hh });
            $("#parafollower").css({ height: 0 });
          } else {
            // if (hh > h) {
            var paraHeight = hh - (e.pageY + 100);
            $("#prefollower").css({ height: e.pageY - 100 });
            $("#parafollower").css({ top: e.pageY + 100 });
            $("#parafollower").css({ height: paraHeight + 37 });
            // } else {
            //   var pageYY = h - (e.pageY + 100);
            //   $("#prefollower").css({ height: e.pageY - 100 });
            //   $("#parafollower").css({ top: e.pageY + 100 });
            //   $("#parafollower").css({ height: pageYY });
            // }

            // console.log("paraHeight", paraHeight);
          }

          // console.log("cursor location", e.pageY);
          // console.log("window height", h);
          // console.log("scroll height", hh);

          $("#prefollower").css("background", "rgba(0,0,0,0.7)");
          $("#parafollower").css("background", "rgba(0,0,0,0.7)");
        });
      } else {
        focusButton.removeClass("button-pressed");
        focusButton.attr("aria-pressed", "false");

        $("html").off("mousemove");
        $("#prefollower").remove();
        $("#follower").remove();
        $("#parafollower").remove();
        // $("#prefollower").css("background", "none");
        // $("#parafollower").css("background", "none");
      }

      // Readable font
      if (options.fontReadable) {
        fontReadableButton.addClass("button-pressed");
        fontReadableButton.attr("aria-pressed", "true");

        $("*")
          .not(".empty")
          .not(".empties")
          .not("#filler")
          .not(".open-accessibility-container")
          .not("#lbexpand")
          .not(".open-accessibility-close-button")
          .not("#pt-close")
          // .not("#pina-container")
          .not(".open-accessibility-side-switch")
          .not(".open-accessibility-language-selector")
          .not(".open-accessibility-menu")
          .not(".open-accessibility-menu-buttons")
          .not(".open-accessibility-menu-button")
          .not(".open-accessibility-top-row")
          .not(".button-indicator, .hidden-indicator")
          .not(".open-accessibility-menu-button svg")
          .not(".open-accessibility-menu-button span")
          .not(".button-icon")
          .not(".open-accessibility-expand-button")
          .not(".first-line")
          .not(".open-accessibility-expand-button svg")
          .not(".open-accessibility-menu-footer")
          .not("#open-accessibility-footer-logo")
          .not(".open-accessibility")
          .not(".open-accessibility-menu-disclaimer")
          .not(".open-accessibility-menu-version")
          .not(".l-switch")
          .not(".on, .off")
          .not("#lang-sel")
          .not("#fr-11")
          .not(".hh")
          .not("a")
          .not(".bottom-links")
          .addClass("readable-font");
      } else {
        fontReadableButton.removeClass("button-pressed");
        fontReadableButton.attr("aria-pressed", "false");

        $("*").removeClass("readable-font");
      }

      // Headings highlight
      if (options.headings) {
        headingsButton.addClass("button-pressed");
        headingsButton.attr("aria-pressed", "true");

        $("h1, h2, h3, h4, h5, h6").addClass("heading-highlight");
      } else {
        headingsButton.removeClass("button-pressed");
        headingsButton.attr("aria-pressed", "false");

        $("h1, h2, h3, h4, h5, h6").removeClass("heading-highlight");
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

    var fill = document.querySelector(".fill");
    var empties = document.querySelectorAll(".empty");

    // appending the fill div to the position from local storage
    var userOptions2 = getUserOptions();
    // console.log("userOptions2", userOptions2);
    var initLoc = userOptions2.toolbarVertPos;
    // console.log("initLoc", initLoc);
    var initLocID = "#patd" + initLoc;
    // console.log("initLocID", initLocID);
    // location.reload();
    $(initLocID).append(fill);

    // Fill Listeneres
    fill.addEventListener("dragstart", dragStart);
    fill.addEventListener("dragend", dragEnd);

    // Loop through empties and call drag events
    for (const empty of empties) {
      empty.addEventListener("dragover", dragOver);
      empty.addEventListener("dragenter", dragEnter);
      empty.addEventListener("dragleave", dragLeave);
      empty.addEventListener("drop", dragDrop);
    }

    function zeroWidthDivs() {
      $(".empty").css("width", "0px");
      $("#empties-side").css("width", "0px");
    }

    function NormalWidthDivs() {
      $(".empty").css("width", "40px");
      $("#empties-side").css("width", "40px");
    }
    // Drag Functions
    function dragStart() {
      NormalWidthDivs();
      this.className += " hold";
      setTimeout(() => (this.className = "invisible"), 0);
    }

    function dragEnd() {
      this.className = "fill";
    }

    function dragOver(e) {
      e.preventDefault();
    }

    function dragEnter(e) {
      e.preventDefault();
      this.className += " hovered";
    }

    function dragLeave() {
      this.className = "empty";
    }
    var newLoc;

    function dragDrop() {
      this.className = "empty";
      this.append(fill);
      // console.log("D&D divName", this.id);
      newLoc = this.id.substring(4);
      // console.log("D&D divNum", newLoc);

      userOptions2 = getUserOptions();
      // console.log("userOptions2", userOptions2.toolbarVertPos);
      userOptions2.toolbarVertPos = newLoc;
      // console.log("userOptions22", userOptions2.toolbarVertPos);

      setUserOptions(userOptions2);

      zeroWidthDivs();
    }

    // If after switching displays resulution and both the
    // display resolution is under 768 and the toolbar location
    // div number is greater than 11 than a new div location is
    // calculated
    var windowHeight;
    var lowerResPos;
    var lowerResPosID;

    $(window).on("load resize", function () {
      // console.log(this);
      windowHeight = this.innerHeight;
      // console.log("windowHeight", windowHeight);

      if (windowHeight < 768 && options.toolbarVertPos >= 20) {
        lowerResPos = parseInt(windowHeight / 40) - 1;
        lowerResPosID = "#patd" + lowerResPos;

        // console.log("lowerResPos", lowerResPos);
        $(lowerResPosID).append(fill);
      } else {
        $(options.toolbarVertPos).append(fill);
      }
    });
  };
})(jQuery || $);
