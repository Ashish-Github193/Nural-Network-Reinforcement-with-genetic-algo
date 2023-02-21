var ctrl_panel_slider = $("#control_panel_slider");
ctrl_panel_slider.html("<i class='fa fa-angle-down' aria-hidden='true'></i>");
var crtl_panel_status = 1;

ctrl_panel_slider.mouseenter(function () {

    $("#control_panel").css("transform", "translate(0, 0%)");
    $("#bg").css("background-color", getComputedStyle(document.documentElement).getPropertyValue('--th-pri-cld'));
    ctrl_panel_slider.html("<i class='fa fa-angle-down' aria-hidden='true'></i>");
    $(".layer").css("border-color", getComputedStyle(document.documentElement).getPropertyValue('--th-pri-clr'));

    // clearInterval(refresh);
    const canvas = document.getElementById("bg");
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    $(".node").addClass("disabled_node");

    crtl_panel_status++;

})

$("#control_panel").mouseenter(function () {

    $("#control_panel").css("transform", "translate(0, 0%)");
    $("#bg").css("background-color", getComputedStyle(document.documentElement).getPropertyValue('--th-pri-cld'));
    ctrl_panel_slider.html("<i class='fa fa-angle-down' aria-hidden='true'></i>");
    $(".layer").css("border-color", getComputedStyle(document.documentElement).getPropertyValue('--th-pri-clr'));

    // clearInterval(refresh);
    const canvas = document.getElementById("bg");
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    $(".node").addClass("disabled_node");

    crtl_panel_status++;

}).mouseleave(function () {
    $("#control_panel").css("transform", "translate(0, 98%)");
    if (!menuWindowState)
        $("#bg").css("background-color", getComputedStyle(document.documentElement).getPropertyValue('--th-pri-clr'));
    ctrl_panel_slider.html("<i class='fa fa-angle-up' aria-hidden='true'></i>");
    $("#num").text(0);
    $(".layer").css("border-color", "transparent");

    if (edit_status % 2 != 0)
        $(".node.active").removeClass("disabled_node");
    else
        $(".node").removeClass("disabled_node");
    updateConnections();
})

$('#menu-button').click(() => {
    menuWindowState === 0 ? $('#menu-window').css('transform', 'translate(-50%, -50%)') : $('#menu-window').css('transform', 'translate(-200%, -50%)');
    menuWindowState === 0 ? $('#bg').css('background-color', getComputedStyle(document.documentElement).getPropertyValue('--th-pri-cld')) : $('#bg').css('background-color', getComputedStyle(document.documentElement).getPropertyValue('--th-pri-clr'));
    menuWindowState === 0 ? menuWindowState = 1 : menuWindowState = 0;
});

menuOptionState = [1, 0, 0];

$('#general').click(() => {
    if (menuOptionState[0] === 0) {

        $('#general-content').css('display', 'flex'); // show general content
        $('#theme-content').css('display', 'none'); // hide theme content
        $('#settings-content').css('display', 'none'); // hide settings content


        // $('#general').css('border', "1px solid #000000");
        // $('#theme').css('border-color', current_theme[2] + " transparent");
        // $('#settings').css('border-color', current_theme[2] + " transparent");
        menuOptionState = [1, 0, 0];
    }
});

$('#settings').click(() => {
    if (menuOptionState[2] === 0) {
        $('#general-content').css('display', 'none');
        $('#theme-content').css('display', 'none');
        $('#settings-content').css('display', 'flex'); // show general content

        // $('#general').css('border-color', current_theme[2] + " transparent");
        // $('#theme').css('border-color', current_theme[2] + " transparent");
        // $('#settings').css('border-color', current_theme[2]);
        menuOptionState = [0, 0, 1];
    }
});

$('#theme').click(() => {
    if (menuOptionState[1] === 0) {
        $('#general-content').css('display', 'none');
        $('#theme-content').css('display', 'grid'); // show theme content
        $('#settings-content').css('display', 'none');

        // $('#general').css('border-color', current_theme[2] + " transparent");
        // $('#theme').css('border-color', current_theme[2]);
        // $('#settings').css('border-color', current_theme[2] + " transparent");
        menuOptionState = [0, 1, 0];
    }
});

// Background, Foreground, Border
var themes = [
    ['#001824', '#012536', '#ffb703'],
    ['#379237', '#10240a', '#F0FF42'],
    ['#4D77FF', '#112530', '#5EE6EB'],
    ["#00213E", "#003A54", "#FF5733"],
    ["#000000", "#1f271b", "#f9c80e"],
    ["#000000", "#000000", "#ff6b6b"],
    ["#000000", "#3a3f44", "#eb984e"],
    ["#f94144", "#301608", "#f9c74f"],
    ["#1a1a1a", "#4d4d4d", "#f2f2f2"],
]

var defaultThemes = $('#theme-content').children().length;

function addThemes() {
    for (i in themes) {
        colors = themes[i];
        const cover = document.createElement('div');
        const banner = document.createElement('div');
        cover.classList.add('theme');
        cover.id = 'theme' + defaultThemes;
        banner.classList.add('theme-banner');
        banner.id = 'th-banner' + defaultThemes;
        cover.append(banner);
        cover.style.backgroundColor = themes[i][0];
        banner.style.backgroundColor = themes[i][1];
        banner.style.borderColor = themes[i][2];
        cover.addEventListener('click', (event) => {
            const element = event.target;
            const themeIndex = element.id.slice(-1);
            $(':root').css('--th-pri-clr', themes[themeIndex][1]);
            $(':root').css('--th-pri-cld', darkenColor(themes[themeIndex][1], 80));
            $(':root').css('--th-brd-clr', themes[themeIndex][2]);
            $('#bg').css('background-color', getComputedStyle(document.documentElement).getPropertyValue('--th-pri-cld'))
            
            current_theme = themes[themeIndex];
            activation_button_update();
            updateConnections();
        });
        
        $('#theme-content').append(cover);
        defaultThemes++;
    }
}
addThemes();

$('.ml-name').click((e) => {
    let currentElement = e;
    currentElement.innerHTML = '<input type=\'text\' id=\'' + currentElement.id + 'text\' class=\'change-model-name\' placeholder=\'enter new name\' >';
})

function set_global_activation (id) {
    if (global_activation != id)
    {
        $(global_activation).css("background-color", "transparent");
        $(global_activation).css("color", "");
        $(id).css("background-color", current_theme[2]);
        $(id).css("color", current_theme[1]);
        global_activation = id;
    }
}

function activation_button_update () {
    $(global_activation).css("background-color", current_theme[2]);
    $(global_activation).css("color", current_theme[1]);
}
