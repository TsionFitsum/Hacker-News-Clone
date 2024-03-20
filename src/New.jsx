import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';


function New(){
const [newStories, setNewStories] = useState([]);

useEffect(() => {

async function fetchNewStory() {
   try{
    const response = await fetch('https://hacker-news.firebaseio.com/v0//v0/newstories.json');
    if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
    const newStoryIds = await response.json();
    // Fetch details of each story
    const storiesPromises = newStoryIds.slice(0, 10).map(async (storyId) => {
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

return (
    <div>
        <h1>New Stories</h1>
        <ul>
            {newStories.map(newStory => (
                <li key={newStory.id}>{newStory.title} </li>
            ))}
        </ul>

    </div>
)



}
export default New;