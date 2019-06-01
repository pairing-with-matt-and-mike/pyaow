const { color } = require('./tuple');

function canvas(width, height) {
    return new Canvas(width, height);
}

class Canvas {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.pixels = [];
        for (let rowIndex = 0; rowIndex < height; rowIndex++) {
            const row = [];
            this.pixels.push(row);
            for (let columnIndex = 0; columnIndex < width; columnIndex++) {
                row.push(black);
            }
        }
    }

    getPixel(x, y) {
        return this.pixels[y][x];
    }

    setPixel(x, y, pixel) {
        this.pixels[y][x] = pixel;
    }

    toPpm() {
        const header = `P3
${this.width} ${this.height}
255\n`;
        return header + this.pixels.map(rowToByteString).join('\n') + '\n';
    }
}

const black = color(0, 0, 0);

function channelToByte(c) {
    c = Math.min(1, Math.max(0, c));
    return Math.round(c * 255).toString();
}

function colorToByteString(c) {
    return `${channelToByte(c.red)} ${channelToByte(c.green)} ${channelToByte(c.blue)}`;
}

function rowToByteString(row) {
    let output = "";
    let lineLength = 0;

    const append = channel => {
        const channelString = channelToByte(channel);
        if (lineLength + channelString.length >= 70) {
            lineLength = 0;
            output += "\n";
        } else if (lineLength > 0) {
            lineLength++;
            output += ' ';
        }
        lineLength += channelString.length;
        output += channelString;
    };

    for (const color of row) {
        append(color.red);
        append(color.green);
        append(color.blue);
    }
    return output;
}

module.exports = {
    canvas,
};
