import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useParams } from 'react-router-dom';
import './App.css';
import { formatDistanceToNow } from 'date-fns';


function App() {
  const [stories, setStories] = useState(null);
  const [showCommentsForStory, setShowCommentsForStory] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const getTopStories = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const topStoryData = await getTopStories.json();
        const topTwentyStories = topStoryData.slice(0, 20);

        const storiesWithData = await Promise.all(
          topTwentyStories.map(async (storyId) => {
            const getStoryData = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
            const storyData = await getStoryData.json();

            if (storyData && storyData.kids) {
              const commentsPromises = storyData.kids.map(async (commentId) => {
                const commentResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`);
                const commentData = await commentResponse.json();

                if (commentData && commentData.kids) {
                  const subCommentsPromises = commentData.kids.map(async (subCommentId) => {
                    const subCommentResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${subCommentId}.json`);
                    const subCommentData = await subCommentResponse.json();
                    return subCommentData;
                  });

                  const subCommentsData = await Promise.all(subCommentsPromises);
                  commentData.comments = subCommentsData; // Associate subcomments with the comment
                }

                return commentData;
              });

              const commentsData = await Promise.all(commentsPromises);
              storyData.comments = commentsData; // Associate comments with the story
            }

            return storyData; // Return the story data including comments
          })
        );

        setStories(storiesWithData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const handleShowComments = (storyId) => {
    setShowCommentsForStory(storyId);
  };

  return (
    <Router>
      <>
        <h1 className="text-3xl font-bold pb-3">Hacker News</h1>
        <Navigation />
        <Routes>
          <Route
            path="/"
            element={<HomePage stories={stories} handleShowComments={handleShowComments} showCommentsForStory={showCommentsForStory} />}
          />
          <Route path="/comment/:storyId" element={<CommentsPage stories={stories} showCommentsForStory={showCommentsForStory} />} />
        </Routes>
      </>
    </Router>
  );
}

function HomePage({ stories, handleShowComments, showCommentsForStory }) {
  return (
    <div className='grid gap-2 grid-cols-4 grid-rows-4 text-sm'>
      {stories && stories.map((story) => (
        <article key={story.id} className='flex items-start gap-1 bg-orange-400 rounded-md pt-2'>
          <div>
            <a href={story.url} target="_blank" rel="noreferrer" className='underline font-bold'>
              {story.title}
            </a>{" "}
            <div className='text-xs mt-0'>by {story.by} </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-1 mt-1 mb-2 w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
              <div className='text-left'>{story.score}</div>
            </div>
            {showCommentsForStory === story.id && story.comments && (
              <div>
                <ul>
                  {story.comments.map((comment) => (
                    <li key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <span className="comment-by ml-5">by: {comment.by}</span>
                      </div>
                      <div className="comment-text" dangerouslySetInnerHTML={{ __html: comment.text }} />
                      {comment.comments && comment.comments.length > 0 && (
                        <ul className="sub-comments-list">
                          {comment.comments.map((subComment) => (
                            <li key={subComment.id} className="sub-comment-item">
                              <div className="comment-header">
                                <span className="comment-by ml-5">by: {subComment.by}</span>
                              </div>
                              <div className="comment-text" dangerouslySetInnerHTML={{ __html: subComment.text }} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <Link to={`/comment/${story.id}`}>
                Show Comments
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function CommentsPage({ stories }) {
  const { storyId } = useParams();
  const story = stories.find((s) => s.id === Number(storyId));

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return formatDistanceToNow(date, { addSuffix: false }); 
  } 

  return (
    <div>
      <h2>Comments for {story.title}</h2>
      <div className="back-to-home">
        <Link to="/">← Back to Home</Link>
      </div>
      <div className="comments-container text-left">
        {story.comments && story.comments.length > 0 ? (
          <ul className="comments-list">
            {story.comments.map((comment) => (
              <li key={comment.id} className="comment-item mb-7">
                <div className='flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" 
                     fill="none" viewBox="0 0 24 24" 
                     stroke-width="1.5" 
                     stroke="currentColor" 
                     class="w-4 h-4">

                <path stroke-linecap="round" 
                stroke-linejoin="round" d="M15.75 
                6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 
                0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 
                17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
               </svg> 

                  <div className="text-left"> {comment.by}</div>
                </div>
                <div className="comment-text" dangerouslySetInnerHTML={{ __html: comment.text }} />
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
<div className="text-left">{formatTime(comment.time)}</div>
</div> 

                {comment.comments && comment.comments.length > 0 && (
                  <ul className='sub-comments-list'>
                    {comment.comments.map((subComment) => (
                      <li key={subComment.id} className='sub-comment-item mt-4'>
                        <div className='flex items-center ml-10'>
                <svg xmlns="http://www.w3.org/2000/svg" 
                     fill="none" viewBox="0 0 24 24" 
                     stroke-width="1.5" 
                     stroke="currentColor" 
                     class="w-4 h-4">

                <path stroke-linecap="round" 
                stroke-linejoin="round" d="M15.75 
                6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 
                0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 
                17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
               </svg> 

                  <div className="text-left"> {comment.by}</div>
                </div>
                        <div className="comment-text ml-10" dangerouslySetInnerHTML={{ __html: subComment.text }} />
                        <div className='flex items-center ml-10'>
                          <svg xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke-width="1.5" 
                                stroke="currentColor" 
                                class="w-4 h-4">
                                  
                          <path stroke-linecap="round" 
                                stroke-linejoin="round" 
                                d="M12 6v6h4.5m4.5 0a9 
                                9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
<div className="text-left">{formatTime(comment.time)}</div>
</div>
                        

                      </li>
                    ))

                    }

                  </ul>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments for this story.</p>
        )}
      </div>
    </div>
  );
}

const Navigation = () => (
  <nav>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/about">About</Link></li>
    </ul>
  </nav>
);

export default App;
