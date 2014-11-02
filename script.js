//require("arts.js");

var patterns = $("#patterns");
var controls = $("#controls");
var welcome = $("#welcome");

var rgbRoutes = {
    red: $("#route_red"),
    green: $("#route_green"),
    blue: $("#route_blue")
    };

/* Initial setup */
controls.hide();

var canvas_size = 512;
var updateOnSlide = false;

/*
 * Create the canvas
 */
var canvasContainer = $("#canvasContainer");
var canvas = document.createElement('canvas');
canvas.width = canvas_size;
canvas.height = canvas_size;
canvasContainer.text("")
               .append(canvas);

var ctx = canvas.getContext('2d');

var current_art = null;


var artTemplate = Handlebars.compile($("#art-template").html());
var paramTemplate = Handlebars.compile($("#param-template").html());
var mainControlsTemplate = Handlebars.compile($("#maincontrols-template").html());

$(document.body).append(mainControlsTemplate());

$("#export").click(function() {
    canvas.toBlob(function(blob) {
        saveAs(blob, "MathematicalArt.png");
    });
});
var resizeCanvas = function() {
    canvas.width = canvas_size;
    canvas.height = canvas_size;
    if (current_art) updateCanvas(current_art.f);
}
$("#resize256").click(function() {
    canvas_size = 256;
    resizeCanvas();
});
$("#resize512").click(function() {
    canvas_size = 512;
    resizeCanvas();
});
$("#resize1024").click(function() {
    canvas_size = 1024;
    resizeCanvas();
});
$("#UWSbutton").click(function() {
    var self = $(this);
    if (self.hasClass("on"))
        self.removeClass("on");
    else
        self.addClass("on");
    updateOnSlide = !updateOnSlide;
});
               
/*
 * Method for updating the canvas
 */
var updateCanvas = function(f) {
    var imageData = ctx.getImageData(0,0,canvas_size,canvas_size);
    var data = imageData.data;
    var step = 1024/canvas_size;
    var i = 0;
    for (var y = 0; y < 1024; y += step) {
        for (var x = 0; x < 1024; x += step) {
            data[i++] = f._red(x, y) >> 2;
            data[i++] = f._green(x, y) >> 2;
            data[i++] = f._blue(x, y) >> 2;
            data[i++] = 255; // alpha
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

var sliderMax = function(val) {
    if (val <= 16) {
        return 16;
    } else if (val <= 32) {
        return 32;
    } else if (val <= 256) {
        return 256;
    } else if (val <= 1024) {
        return 1024;
    } else {
        return val;
    }
}

var showControls = function(id) {
    controls.find(".param").remove(); // Clear param controls
    arts[id].f.constants.forEach(function(c) {
        var param = $(paramTemplate({name: c}));
        var sliderChange = function() {
            arts[id].f[c] = slider.slider("value");
            spinner.spinner("value", slider.slider("value"));
            updateCanvas(arts[id].f);
        }
        var slider = param.find(".slider").slider({
            range: "min",
            max: sliderMax(arts[id].f[c]),
            min: 0,
            value: arts[id].f[c],
            change: sliderChange,
            slide: function() {
                if (updateOnSlide) sliderChange();
            }
        });
        var spinnerChange = function() {
                var newval = spinner.spinner("value");
                if (newval > slider.slider("option", "max")) {
                    slider.slider("option", "max", newval);
                } else if (newval < slider.slider("option", "min")) {
                    slider.slider("option", "min", newval);
                }
                arts[id].f[c] = newval;
                slider.slider({value: newval});
                updateCanvas(arts[id].f);
            };
        var spinner = param.find(".paramspinner").val(arts[id].f[c]).spinner({
            change: spinnerChange,
            spin: spinnerChange
        });
        param.find(".ui-spinner-button").click(function(){ $(this).focus(); });
        controls.append(param);
    });
    ['red', 'green', 'blue'].forEach(function(color, index) {
        rgbRoutes[color][0].selectedIndex = index;
        rgbRoutes[color].selectmenu({
            change: function(e, val) {
                arts[id].f["_"+color] = arts[id].f[val.item.value];
                updateCanvas(arts[id].f);
            }
        }).selectmenu('refresh');
    });
    controls.show("slide", {direction: 'right'}, 200);
}

var displayArt = function(id) {
    var art = arts[id];
    updateCanvas(art.f);
    current_art = arts[id];
    if (controls.is(":visible"))
        controls.hide("slide", {direction: 'right'}, 200, function() {
            showControls(id);
        });
    else
        showControls(id);
}

/*
 * Show arts list in pane
 */
var prettifyCode = function(code) {
    return code.replace(/this\./g, "")
               .replace(/\s+/g, " ")
               .replace(/(C\d+)/g, "<span class='constant'>$1<\/span>")
               .replace(/([;{]) /g, "$1<br>&nbsp;&nbsp;&nbsp;&nbsp;");
}
arts.forEach(function(art, id) {
    // Store the default values of each constant
    art.f.constants.forEach(function(c) {
        art.f[c+"_default"] = art.f[c];
    });
    art.f._red = art.f.red;
    art.f._green = art.f.green;
    art.f._blue = art.f.blue;
    art.code_red = prettifyCode(art.f.red.toString());
    art.code_green = prettifyCode(art.f.green.toString());
    art.code_blue = prettifyCode(art.f.blue.toString());
    // Construct the div containing the art information
    var artDiv = $(artTemplate(art));
    patterns.append(artDiv);
    artDiv.find(".code").hide();
    artDiv.find(".pattern_image").click(function() {
        // Hide welcome message
        if (welcome.is(":visible")) welcome.slideUp();
        // Restore defaults
        art.f.constants.forEach(function(c) {
            art.f[c] = art.f[c+"_default"];
        });
        art.f._red = art.f.red;
        art.f._green = art.f.green;
        art.f._blue = art.f.blue;
        // Mark this piece as selected
        $(".pattern_selected").removeClass("pattern_selected").find(".code").slideUp();
        artDiv.addClass("pattern_selected").find(".code").slideDown();
        // Display this guy
        displayArt(id);
    });
});