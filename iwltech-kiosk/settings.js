const menu = [
    ["Squadron", `firefox --new-window https://iwltechnology.github.io/Squadron`, "Squadron.png"],
    ["Firefox", `firefox --new-window`, "Firefox.png"]
];

const dev_menu = [
    ["Files", `nautilus ~`, "Files.png"],
    ["Terminal", `ptyxis --new-window`, "Terminal.png"],
    ["Admin mode", `firefox --new-window https://localhost:9090`]
];

module.exports = { menu, dev_menu };
