// Cache jQuery versions of DOM elements
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

// Create the loader
var loader = $(Handlebars.compile($("#loader-template").html())()).hide();
canvasContainer.append(loader);

function updateProgress(percent) {
  loader.css("border-width", Math.max(1, Math.round(20*percent))+"px");
}

var ctx = canvas.getContext('2d');

var current_art = null;
var render_number = 0;


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
    if (current_art !== null) {
        loader.removeClass("loader-done").show();
        updateProgress(0);
        W.postMessage({
            type: 'resize',
            id: current_art,
            imageData: ctx.getImageData(0,0,canvas_size,canvas_size),
            size: canvas_size
        });
    }
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
var W = new Worker("src/drawArt.js");

W.onmessage = function(e) {
    if (e.data.type === 'artlist') {
        loadArts(e.data.list);
    } else if (e.data.type === 'art') {
        if (e.data.size !== canvas_size) return;
        ctx.putImageData(e.data.imageData, 0, 0);
        current_art = e.data.id;
        if (e.data.render_number === render_number) loader.addClass("loader-done");
        if (controls.is(":visible"))
            controls.hide("slide", {direction: 'right'}, 200, function() {
                showControls(e.data.id, e.data.constants);
            });
        else
            showControls(e.data.id, e.data.constants);
    } else if (e.data.type === 'altered') {
        if (e.data.size !== canvas_size) return;
        ctx.putImageData(e.data.imageData, 0, 0);
        if (e.data.render_number === render_number) loader.addClass("loader-done");
    } else if (e.data.type === 'progress') {
        if (e.data.render_number !== render_number) return;
        updateProgress(e.data.percent);
    }
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

var showControls = function(id, constants) {
    controls.find(".param").remove(); // Clear param controls

    var constantNames = [];
    for (var c in constants) {
        if (constants.hasOwnProperty(c)) {
            constantNames.push(c);
        }
    }
    var colorRoutes = {};

    constantNames.forEach(function(c) {
        var param = $(paramTemplate({name: c}));
        var sliderChange = function() {
            constants[c] = slider.slider("value");
            spinner.spinner("value", slider.slider("value"));
            displayArt(id, constants, colorRoutes);
        }
        var slider = param.find(".slider").slider({
            range: "min",
            max: sliderMax(constants[c]),
            min: 0,
            value: constants[c],
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
            constants[c] = newval;
            slider.slider({value: newval});
            displayArt(id, constants, colorRoutes);
        };
        var spinner = param.find(".paramspinner").val(constants[c]).spinner({
            change: spinnerChange,
            spin: spinnerChange
        });
        param.find(".ui-spinner-button").click(function(){ $(this).focus(); });
        controls.append(param);
    });
    
    ['red', 'green', 'blue'].forEach(function(color, index) {
        colorRoutes[color] = color;
        rgbRoutes[color][0].selectedIndex = index;
        rgbRoutes[color].selectmenu({
            change: function(e, val) {
                colorRoutes[color] = val.item.value;
                displayArt(id, constants, colorRoutes);
            }
        }).selectmenu('refresh');
    });
    controls.show("slide", {direction: 'right'}, 200);
}

var displayDelay = null;
var displayArt = function(id, constants, colorRoutes) {
    if (displayDelay !== null) return;
    displayDelay = setTimeout(function() {
        displayDelay = null;
    }, 50);
    var imageData = ctx.getImageData(0,0,canvas_size,canvas_size);
    render_number++;
    if (typeof constants === 'undefined') {
        W.postMessage({
            type: 'job',
            id: id,
            imageData: imageData,
            size: canvas_size,
            renderNumber: render_number
        });
    } else {
        W.postMessage({
            type: 'alter',
            id: id,
            imageData: imageData,
            size: canvas_size,
            constants: constants,
            colorRoutes: colorRoutes,
            renderNumber: render_number
        });
    }
    loader.removeClass("loader-done").show();
    updateProgress(0);
}

/*
 * Show arts list in pane
 */

var loadArts = function(arts) {
    arts.forEach(function(art, id) {
        // Store the default values of each constant
        art.f.constants.forEach(function(c) {
            art.f[c+"_default"] = art.f[c];
        });
        art.code_red = art.f.red;
        art.code_green = art.f.green;
        art.code_blue = art.f.blue;
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
}