const generateMsg = (username, text) => {
  return {
    username,
    text,
    createdDate: new Date().getTime(),
  };
};

const generateLoc = (username, loc) => {
  return {
    username,
    loc: "https://www.google.com/maps/?q=" + loc.lat + "," + loc.long,
    createdDate: new Date().getTime(),
  };
};

module.exports = {
  generateMsg,
  generateLoc,
};
