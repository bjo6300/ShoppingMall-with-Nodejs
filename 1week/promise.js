const isReady = true;
// 1. Producer
const promise = new Promise((resolve, reject) => {
  console.log("Promise is created!");
  if (isReady) {
    resolve("It's ready");
  } else {
    reject("Not ready");
  }
});

// 2. Consumer
promise
	// promise에서 resolve가 될경우
  .then(messsage => {
    console.log(messsage);
  })
	// promise에서 reject가 될경우
  .catch(error => {
    console.error(error);
  })

// Promise is created!
// It's ready