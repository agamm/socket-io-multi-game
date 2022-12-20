const http = require("http").createServer();

const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

let players = {};

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", (message) => {
    try {
      const { id, action } = message;

      if (id in players) {
        console.log("Got action:", action, "for id", id);

        if (action === "up") {
          players[id].y -= 10;
        } else if (action === "down") {
          players[id].y += 10;
        } else if (action === "left") {
          players[id].x -= 10;
        } else if (action === "right") {
          players[id].x += 10;
        }
      } else {
        players[id] = { id: id, x: 100, y: 100 };
        console.log(players);
      }

      io.emit("message", JSON.stringify(players));
    } catch (e) {
      console.error(e);
    }
  });
  socket.on("end", function () {
    socket.disconnect(0);
  });
});

http.listen(8080, () => console.log("listening on http://localhost:8080"));
