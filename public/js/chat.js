const socket = io();

//elements
const $form = document.querySelector("#Mform");
const $formButton = document.querySelector("#send-Message");
const $forminput = $form.querySelector("input");
const $locButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

//templates

const $messageTemplate = document.querySelector("#message-template").innerHTML;
const $locationTemplate = document.querySelector("#location-template")
  .innerHTML;
const $sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("message", (messgae) => {
  console.log(messgae);
  const html = Mustache.render($messageTemplate, {
    SomeUser: messgae.username,
    message: messgae.text,
    createdAt: moment(messgae.createdDate).format("h:mm a"),
  });

  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("location-message", (messgae) => {
  console.log(messgae);
  const html = Mustache.render($locationTemplate, {
    SomeUser: messgae.username,
    location: messgae.loc,
    createdAt: moment(messgae.createdDate).format("h:mm a"),
  });

  $messages.insertAdjacentHTML("beforeend", html);
});

document.querySelector("#Mform").addEventListener("submit", (e) => {
  e.preventDefault();
  //console.log("button pressed");
  $formButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (server) => {
    $formButton.removeAttribute("disabled");
    $forminput.value = "";
    $forminput.focus();
    console.log(server);
  });
});

document.querySelector("#send-location").addEventListener("click", (e) => {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported");
  }
  $locButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      },
      () => {
        $locButton.removeAttribute("disabled");
      }
    );
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render($sidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
});

socket.on();
