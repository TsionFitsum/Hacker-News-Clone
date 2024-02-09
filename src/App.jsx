import { useEffect, useState } from 'react'

import './App.css'

function App() {
 const [stories,setStories] = useState(null);
 const [comments,setComments] = useState(null);
 useEffect (() => {
  async function fetchData(){
    const getTopStories= await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
   const topStoryData = await getTopStories.json();
   const topTwentyStories = topStoryData.splice(0,20);
  

   const storyData = topTwentyStories.map(async (storyId) => {
    const getStoryData = await fetch(` https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
    return await getStoryData.json();

   });

   const commentData = topTwentyStories.map(async (commentId) => {
    const getComment = await fetch(` https://hacker-news.firebaseio.com/v0/item/${commentId}.json`);
    return await getComment.json();
    
   });

   const allComments = await Promise.all(commentData);
   setComments(allComments);

   const allStories = await Promise.all(storyData);
   setStories(allStories);
   
  }
  fetchData();
 });

return (
  <>
  <h1 className="text-3xl font-bold pb-3">Hacker News</h1>
  {stories && comments ? 
  <div className='grid gap-2 grid-cols-4 grid-rows-4 text-sm'>{
  stories && comments.map(story  => (
  <article key={story.id} className='flex items-start gap-1 bg-orange-400 rounded-md pt-2'>
   
<div>
    <a href={story.url} target= "_blank" rel="noreferrer" className='underline font-bold'>
      {story.title}
    </a>
    {" "} 
    <div className='text-xs mt-0'>by {story.by} </div>
    <div className="flex items-center">
      
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
      className="ml-1 mt-1 mb-2 w-4 h-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
</svg>
<div className='text-left'>{story.score}</div>
    </div>
    </div>
    </article>)) }</div> : (<div><h2>Loading...</h2></div>)}
  </>
)

}

export default App
