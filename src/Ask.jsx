import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";



function Ask(){

const [askStories, setAskStories] = useState([]);

useEffect(() => {


async function fetchAskStory(){


        try{    
        const response = await fetch('https://hacker-news.firebaseio.com/v0/askstories.json');
          if(!response.ok){
            throw new Error('Failed to fetch data');
          }
          const askStoryId = await response.json();

          const storiesPromises = askStoryId.slice(0,10).map(async (storyId) => {
            const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
            if(!storyResponse.ok) {
                throw new Error('Failed to fetch story details')
            }
            return storyResponse.json();
          });

          const stories = await Promise.all(storiesPromises);
          setAskStories(stories);
      }catch (error) {
          console.error('Error fetching data : ', error);
        }
        
        }
        fetchAskStory();
     

},[]);

if(!askStories && askStories.length === 0){
    return <div>Loading</div>
}

const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return formatDistanceToNow(date, { addSuffix: false }); 
  } 
return(
    <div className='grid gap-2 grid-cols-2 grid-rows-2 text-sm bg-orange-100 mt-10 ml-40 mr-40 mb-4'>
        {askStories.map(askStory => (
            <article key={askStory.id} className='flex flex-col justify-between bg-stone-50 rounded-md pt-2 border border-gray-200'>
          <a key={askStory.id} href={askStory.url}>{askStory.title}</a>
                 
            </article>
        ))}
      
       
    </div>
)



}
export default Ask