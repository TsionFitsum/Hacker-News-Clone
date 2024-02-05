import { useEffect, useState } from 'react'

import './App.css'

function App() {
 const [stories,setStories] = useState(null);
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
  <h1 className="text-3xl font-bold pb-3">Hacker News</h1>
  {stories ? 
  <div className='grid gap-2 grid-cols-4 grid-rows-4 text-sm'>{
  stories.map(story => (
  <article key={story.id} className='flex items-start gap-1 bg-blue-200 rounded-md pt-2'>
    <span>{story.score}</span>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 18.75 7.5-7.5 7.5 7.5" />
  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 7.5-7.5 7.5 7.5" />
</svg>

    <a href={story.url} target= "_blank" rel="noreferrer" >{story.title}
    </a>
    {" "} by {story.by}
    </article>)) }</div> : (<div><h2>Loading...</h2></div>)}
  </>
)

}

export default App
