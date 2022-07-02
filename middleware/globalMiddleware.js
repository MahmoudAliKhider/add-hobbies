module.exports = (err, req, res, next) => {
  const codeStatus = res.statuscode ? res.statuscode : 500;

  res.status(codeStatus);
  res.json({
    message: err.message,
  });
};
