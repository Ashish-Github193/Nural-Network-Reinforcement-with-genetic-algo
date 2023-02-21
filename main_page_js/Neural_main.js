// var nodes = $(".node");
// nodes.click(function () {
//     if ($(this).parent().attr("id") != "layerFirst" && $(this).parent().attr("id") != "layerLast") {
//         $(this).toggleClass("inactive_node active_node");
//     }
// })

function update_value(inc) {
    const num = parseInt($("#num").text()) + inc;
    if (num <= NumberOfLayers && num > 0) {
        $("#num").text(num);
        const currentLayer = $("#layer" + num);
        currentLayer.css("border", "1px solid " + current_theme[2]);
        if (num > 1) {
            currentLayer.prev().css("border-color", current_theme[1]);
        }
        if (num < NumberOfLayers) {
            currentLayer.next().css("border-color", current_theme[1]);
        }
    }
}

const canvas = $("#bg");
const ctx = canvas[0].getContext("2d");

let rectangle = null;

$(document).on("mousedown", (event) => {
    // Check if the right mouse button was pressed
    if (event.which === 1 && menuWindowState == 0) {
        // Get the mouse coordinates
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Create a rectangle object with the mouse coordinates as the top-left corner
        rectangle = {
            x: mouseX,
            y: mouseY,
            width: 0,
            height: 0,
        };

        // Add a mousemove event listener to update the rectangle size and redraw it on the canvas
        $(document).on("mousemove", updateRectangle);

        // Add a mouseup event listener to remove the rectangle and cleanup the event listeners
        $(document).on("mouseup", function mouseUpCallback() {
            ctx.clearRect(0, 0, canvas.width(), canvas.height()); // clear the entire canvas
            trunNodeOn(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
            setTimeout("updateConnections()", 300);
            rectangle = null;
            $(document).off("mousemove", updateRectangle);
            $(document).off("mouseup", mouseUpCallback);
        });
    }
});

function updateRectangle(event) {
    // Get the mouse coordinates
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Update the rectangle size based on the mouse position
    rectangle.width = mouseX - rectangle.x;
    rectangle.height = mouseY - rectangle.y;

    // Clear the canvas and redraw the rectangle
    ctx.clearRect(0, 0, canvas.width(), canvas.height());
    ctx.fillStyle = darkenColor(current_theme[1], 10); // set the fill color to blue
    ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    ctx.strokeStyle = current_theme[2]; // set the border color to red
    ctx.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
}

function trunNodeOn(x, y, width, height) {
    endX = x + width;
    endY = y + height;

    if (endX < x) {
        x = endX;
        width *= -1;
        endX = x + width;
    }
    if (endY < y) {
        y = endY;
        height *= -1;
        endY = y + height;
    }

    for (let i = 1; i <= NumberOfLayers; i++) {
        const layer = document.getElementById("layer" + i);
        const childs = layer.childNodes;

        for (const child of childs) {
            const childRect = child.getBoundingClientRect();
            const childEndX = childRect.left + child.offsetWidth;
            const childEndY = childRect.top + child.offsetHeight;

            if ((childEndX > x && childEndX < endX) && (childEndY > y && childEndY < endY) && (edit_status%2 == 0))
            {
                $(child).toggleClass("inactive_node active_node");
                if ($(child).hasClass("inactive_node")) {$(child).css("background-color", "#a9a9a9");}
                else {$(child).css("background-color", current_theme[2]);}
            }
        }
    }
}


function updateConnections() {
    const canvas = document.getElementById("bg");
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    Connection("layerFirst", "layer1");
    Connection("layer" + NumberOfLayers, "layerLast");
    for (let i = 2; i <= NumberOfLayers; i++) {
        Connection("layer" + (i - 1), "layer" + i);
    }
}

function Add_layer() {
    NumberOfLayers += 1;
    let layer = document.createElement("div");
    layer.id = "layer" + NumberOfLayers;
    layer.classList.add("layer");
    for (let i = 0; i < 7; i++) {
        let node = document.createElement("div");
        node.classList.add("node");
        node.classList.add("disabled_node");
        node.classList.add("inactive_node");
        node.id = "layer" + NumberOfLayers + "_node" + (i + 1);
        node.addEventListener("click", function () {
            if ($(this).parent().attr("id") != "layerFirst" && $(this).parent().attr("id") != "layerLast") {
                if ($(this).hasClass("active_node"))
                    $(this).toggleClass("active_node inactive_node");
                else
                    $(this).toggleClass("inactive_node active_node");
            }
            setTimeout("updateConnections()", 300);
        })
        layer.append(node);
    }
    if ($("#num-6").text() == 0) { Activations.push("None"); }
    else { Activations.push(global_activation); }
    document.getElementById("main").insertBefore(layer, document.getElementById("layerLast"));
}


function delete_layer() {
    layerName = "layer" + parseInt($("#num").text());
    $("#" + layerName).remove();
    Activations.splice(parseInt($("#num").text()), 1);

    index_layer = 1;
    for (layer of document.getElementById("main").children) {
        if (layer.id != "layerLast" && layer.id != "layerFirst") {
            layer.id = "layer" + index_layer;
            index_node = 1;
            for (node of document.getElementById(layer.id).children) {
                node.id = "layer" + index_layer + "_node" + index_node;
                index_node++;
            }
            index_layer++;
        }
    }

    update_value(-1);
    NumberOfLayers = document.getElementById("main").children.length - 2;
}


$(window).resize(function () { updateConnections(); });

var edit_status = 0;
function edit_on_off(id) {
    edit_status++;
    if (edit_status % 2 == 0) {
        $(id).html("Edit-Mode:&nbsp<b>ON</b>");
        $(".node.inactive_node").removeClass("disabled_node");
        $(".inactive_node").css("background-color", "#a9a9a9");
    }
    else {
        $(id).html("Edit-Mode:&nbsp<b>OFF</b>");
        $(".node").addClass("disabled_node");
        $(".inactive_node").css("background-color", "transparent");
    }
}


function Swap_layer(inc) {
    if (inc == -1) { var min = 1; var max = NumberOfLayers; }
    else if (inc == 1) { var min = 0; var max = NumberOfLayers - 1; }

    if (parseInt($("#num").text()) > min && parseInt($("#num").text()) <= max) {
        layer1 = "layer" + parseInt($("#num").text());
        layer2 = "layer" + (parseInt($("#num").text()) + inc);

        type1 = document.getElementById(layer1).childNodes;
        type2 = document.getElementById(layer2).childNodes;

        for (let i = 0; i < type1.length; i++) {
            var s1 = type1[i].classList.contains("inactive_node");
            var s2 = type2[i].classList.contains("inactive_node");

            if (s1 != s2) {
                if (s1) { $("#" + type2[i].id).toggleClass("active_node inactive_node"); $("#" + type1[i].id).toggleClass("inactive_node active_node"); }
                else { $("#" + type1[i].id).toggleClass("active_node inactive_node"); $("#" + type2[i].id).toggleClass("inactive_node active_node"); }
            }
        }
    }
    update_value(inc);
}

function Proceed() {
    var model_list_item = $('<div>').attr({
        id: "model-list" + ($('#general-content').children().length - 1),
        class: "general-content-model"
    });

    var ml_info = $('<div>').attr({ class: 'ml-info' });

    // primary-info
    var ml_primary_info = $('<div>').attr({ class: 'ml-primary-info' });
    var sno = $('<div>').attr({
        id: "sno" + ($('#general-content').children().length - 1),
        class: "ml-sno content-model-class-text"
    }).text(($('#general-content').children().length - 1) + ".");

    var name = $('<div>').attr({
        id: "name" + ($('#general-content').children().length - 1),
        class: "ml-name content-model-class-text"
    }).text("Model " + ($('#general-content').children().length - 1));

    ml_primary_info.append(sno);
    ml_primary_info.append(name);
    ml_info.append(ml_primary_info);

    // secondary-info
    var ml_secondary_info = $('<div>').attr({ class: 'ml-secondary-info' });
    var nol = $('<div>').attr({
        id: "nol" + ($('#general-content').children().length - 1),
        class: "ml-nol content-model-class-text"
    }).text(NumberOfLayers + " layers");

    var fitness = $('<div>').attr({
        id: "fitness" + ($('#general-content').children().length - 1),
        class: "ml-fit content-model-class-text"
    }).text("0");

    var generation = $('<div>').attr({
        id: "fitness" + ($('#general-content').children().length - 1),
        class: "ml-fit content-model-class-text"
    }).text("0");

    ml_secondary_info.append(nol);
    ml_secondary_info.append(fitness);
    ml_secondary_info.append(generation);
    ml_info.append(ml_secondary_info);

    var ml_operations = $('<div>').attr({ class: "ml-operations" });
    var load1 = $('<div>').attr({
        id: "load1",
        class: "ml-ops"
    }).text("load");

    var delete1 = $('<div>').attr({
        id: "delete1",
        class: "ml-ops"
    }).text("delete");

    ml_operations.append(load1);
    ml_operations.append(delete1);

    model_list_item.append(ml_info);
    model_list_item.append(ml_operations);

    $(model_list_item).insertBefore("div.general-content-new-model");
}