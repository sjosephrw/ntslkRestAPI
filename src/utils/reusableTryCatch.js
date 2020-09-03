//https://stackoverflow.com/questions/11742067/is-there-a-way-to-add-try-catch-to-every-function-in-javascript
//try catch reusable function
const tcWrapper = callback => {
  return (req, res, next) => {
    callback(req, res, next).catch(e => next(e));
  };
};

module.exports = tcWrapper;
