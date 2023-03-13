const apiService = (function () {
  "use strict";

  const module = {};

  module.addMessage = function (username, content) {
    return fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, content: content }),
    }).then((res) => res.json());
  };

  module.deleteMessage = function (messageId) {
    return fetch(`/api/messages/${messageId}`, {
      method: "DELETE",
    }).then((res) => res.json());
  };

  module.upvoteMessage = function (messageId) {
    return fetch(`/api/messages/${messageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "upvote" }),
    }).then((res) => res.json());
  };

  module.downvoteMessage = function (messageId) {
    return fetch(`/api/messages/${messageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "downvote" }),
    }).then((res) => res.json());
  };

  module.getMessages = function (page = 0) {
    return fetch(`/api/messages?page=${page}`).then((res) => res.json());
  };

  module.getUsername = function () {
    return fetch(`/users/me`).then((res) => res.json());
  };

  module.signin = function (username, password) {
    return fetch("/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then((res) => res.json());
  };

  module.signup = function (username, password) {
    return fetch("/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then((res) => res.json());
  };

<<<<<<< HEAD
=======
  module.addRoom = function (name) {
    return fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).then((res) => res.json());
  };

  module.getRooms = function () {
    return fetch("/api/rooms").then((res) => res.json());
  };

  module.getRoom = function (roomId) {
    return fetch(`/api/rooms/${roomId}`).then((res) => res.json());
  };

  module.addUserToRoom = function (roomId, username) {
    return fetch(`/api/rooms/${roomId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    }).then((res) => res.json());
  };

  module.createBoard = function (roomId) {
    return fetch(`/api/rooms/${roomId}/boards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  module.makeMove = function (roomId, startx, endx, starty, endy) {
    return fetch(`/api/rooms/${roomId}/boards`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startx, endx, starty, endy }),
    }).then((res) => res.json());
  };

>>>>>>> dev
  return module;
})();
