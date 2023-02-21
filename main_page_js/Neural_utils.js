$(":root").css("--th-pri-cld", darkenColor(getComputedStyle(document.documentElement).getPropertyValue('--th-pri-clr'), 80));
current_theme = ['#001824', '#012536', '#ffb703'];

function drawLine ([x1, y1], [x2, y2], color, thickness) {
    const canvas = document.getElementById("bg");
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function Connection(layer1, layer2)
{
    try
    {
        var childs1 = document.getElementById(layer1).childNodes;
        var childs2 = document.getElementById(layer2).childNodes;
    }
    catch {return "";}

    for (child1 of childs1)
    {
        if (child1.nodeName != "#text" && child1.classList.contains("active_node"))
        for (child2 of childs2)
        {
            if (child2.nodeName != "#text" && child2.classList.contains("active_node"))
            {
                var xy1 = child1.getBoundingClientRect();
                var w1 = child1.offsetWidth;
                var h1 = child1.offsetHeight;
                var w2 = child2.offsetWidth;
                var h2 = child2.offsetHeight;
                var xy2 = child2.getBoundingClientRect();
                drawLine ([xy1.left + w1, xy1.top + h1], [xy2.left + w2, xy2.top + h2], current_theme[2], 1);
            }
        }
    }
}

function darkenColor(hex, percent) {
    // Convert hex color to RGB values
    const red = parseInt(hex.substring(1, 3), 16);
    const green = parseInt(hex.substring(3, 5), 16);
    const blue = parseInt(hex.substring(5, 7), 16);
  
    // Reduce RGB values by percentage
    const redDarkened = Math.floor(red * (100 - percent) / 100);
    const greenDarkened = Math.floor(green * (100 - percent) / 100);
    const blueDarkened = Math.floor(blue * (100 - percent) / 100);
  
    // Convert darkened RGB values back to hex format
    const darkenedHex = "#" + ((1 << 24) + (redDarkened << 16) + (greenDarkened << 8) + blueDarkened).toString(16).slice(1);
    return darkenedHex;
}

function lightenColor(color, amount) {
    // Parse the color string into its RGB components
    const rgb = color.match(/\d+/g);
  
    // Calculate the new RGB values based on the amount parameter
    const r = Math.min(parseInt(rgb[0], 10) + amount, 255);
    const g = Math.min(parseInt(rgb[1], 10) + amount, 255);
    const b = Math.min(parseInt(rgb[2], 10) + amount, 255);
  
    // Combine the new RGB values into a new color string
    const newColor = `rgb(${r},${g},${b})`;
  
    // Return the new color string
    return newColor;
  }
  