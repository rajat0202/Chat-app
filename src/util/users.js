const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return { error: "Username androom are required", user: undefined };
  }

  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return { error: "usernmae already exist", user: undefined };
  }

  const user = { id, username, room };
  users.push(user);
  return { error: undefined, user };
};

const removeUser = (id) => {
  const index = users.filter((user) => (user.id = id));

  if (index !== -1) {
    console.log(users);
    return users.splice(index, 1)[0];
  }
};

const getUsers = (id) => {
  return users.filter((user) => user.id === id);
};

const getUsersRoom = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUsers,
  getUsersRoom,
};
