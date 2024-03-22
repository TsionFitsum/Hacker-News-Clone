import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from 'date-fns';

function New() {
  const [newStories, setNewStories] = useState([]);

  useEffect(() => {
    async function fetchNewStory() {
      try {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/newstories.json');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const newStoryIds = await response.json();

        // Fetch details of each story
        const storiesPromises = newStoryIds.slice(0, 20).map(async (storyId) => {
          const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
          if (!storyResponse.ok) {
            throw new Error('Failed to fetch story details');
          }
          return storyResponse.json();
        });

        const stories = await Promise.all(storiesPromises);
        setNewStories(stories);
      } catch (error) {
        console.error('Error fetching data : ', error);
      }
    }

    fetchNewStory();
  }, []);

  if (!newStories || newStories.length === 0) {
    return <div>Loading...</div>; // Display a loading indicator while fetching data
  }


  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return formatDistanceToNow(date, { addSuffix: false }); 
  } 



  return (
    
      <div className='grid gap-2 grid-cols-2 grid-rows-2 text-sm bg-orange-100 mt-10 ml-40 mr-40 mb-4'>
        {newStories && newStories.map(newStory => (
          <article className='flex flex-col justify-between bg-stone-50 rounded-md pt-2 border border-gray-200' key={newStory.id}>
            <a href={newStory.url} target="_blank" rel="noreferrer" className='font-bold'>{newStory.title}</a>{" "}
            <div className='text-xs mt-0'>by {newStory.by} </div>   
 
            <div className="flex items-center mr-4 mt-3 gap-4">
            <div className="flex items-center">

            <svg xmlns="http://www.w3.org/2000/svg" 
         fill="none" viewBox="0 0 24 24" 
         strokeWidth={1.5} stroke="currentColor" 
         className="ml-1 mt-1 mb-2 w-4 h-4">
      <path strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M11.48 3.499a.562.562 0 0 1 1.04 
            0l2.125 5.111a.563.563 0 0 0 
            .475.345l5.518.442c.499.04.701.663.321.988l-4.204 
            3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 
            0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 
            20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 
            0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 
            0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
    <div>{newStory.score}</div>
              </div>

              <div className='flex items-center'>
                          <svg xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke-width="1" 
                                stroke="currentColor" 
                                class="w-4 h-4">
                                  
                          <path stroke-linecap="round" 
                                stroke-linejoin="round" 
                                d="M12 6v6h4.5m4.5 0a9 
                                9 0 1 1-18 0 9 9 0 0 1 18 0Z" /> 
</svg>
<div className="text-left">{formatTime(newStory.time)}</div>
</div> 



            </div>
           

            </article>
        ))}
      </div> 
    
  );
}

export default New;
