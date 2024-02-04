import { useEffect, useState } from 'react'

import './App.css'

function App() {
 const [stories,setStories] = useState([]);
 useEffect (() => {
  async function fetchData(){
    const getTopStories= await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
   const topStoryData = await getTopStories.json();
   const topTwentyStories = topStoryData.splice(0,20);
  

   const storyData = topTwentyStories.map(async (storyId) => {
    const getStoryData = await fetch(` https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
    return await getStoryData.json();


   });

   const allStories = await Promise.all(storyData);
   setStories(allStories);
   
  }
  fetchData();
 });

return (
  <>
  <h1>Header</h1>
  {stories.map(story => (<div key={story.id}>{story.title}</div>))}
  </>
)

}

export default App
