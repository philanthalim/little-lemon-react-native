export const validateEmail = (email) => {
    return Boolean(email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ));
  };
  
  export const isAlphabetic = (str) => {
    return Boolean(str.match(/^[a-zA-Z]+$/));
  }
  
   