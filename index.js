class Post {
  constructor(index, title, username, content) {
      this.title = title;
      this.username = username;
      this.content = content;
      this.index = index;
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const setPost = (key, post) => blogKVP.put(key, post);
const getPost = key => blogKVP.get(key);


let counter = 0;

async function createPost(index, title, username,content){
  if(!title || !username || !content || !index){
    throw "Invalid input for post.";
  }
  const newPost = new Post(index, title,username, content);
  const key = counter.toString(); //KEY needs to be length of post array +1. 
  //counter doesnt work as very time the website is reloaded the counter is reset
  //pass counter in w/the post data and have that in the front end with a map?
  counter++;
  await setPost(index, JSON.stringify(newPost));
  //return newPost; //no need to return as it is put in db with setPost
}


const defaultdata = new Post("temp", "Admin", "defaultdata");

async function handleRequest(request) {
  //this will be the api "builder, it sets it up and outputs to worker"
  console.log(request.method);
  if(request.method === "POST"){
    console.log("posted");
    //get the data from the request
    // server;
    // let temp = await request.json();
    
    // console.log(temp.username);
    
    let postData = await request.json();
    
    console.log(postData);
    //console.log(typeof(postData.title));
    if(!postData.title || !postData.username || !postData.content || !postData.index){
      console.log("null input detected")
    } else{
      createPost(postData.index, postData.title, postData.username, postData.content);
      //console.log(typeof(postData.title));
    }
  }
  if(request.method === "GET"){
    console.log("get got");
    
    //return the poss
    // for(let j = 0; j<counter;j++){
    //   tempArr.push(getPost(j));
    // }
  }
  
  //this doesnt show all the posts
  
  const posts = await getPost(counter);

  let data;
  if(!posts){
    //no posts then populated
    await setPost(counter,JSON.stringify(defaultdata));
    data = defaultdata;
  }else{
    //show posts at the key
    data = JSON.parse(posts);
  }
  const body = JSON.stringify(data);
  
  return new Response(body, {
    headers: { 'content-type': 'text/html' },
  })
}