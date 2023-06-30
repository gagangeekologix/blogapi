// sourceModel.js
const generateData = (status,code,message,error, results) => {
  const data = {
    status:code?code:0 ,
    code:status ,
    message:message?message:"Something went wrong!",
    results: results,
    error: error?error:"noerror"
  };

  return data;
};

module.exports = generateData;
