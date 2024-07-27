const FetchVideo = require("../models/FetchVideo.js");
const Video = require("../models/Video.js");

module.exports.fetchYoutubeVideo = async (req, res, next) => {
  try {
    const { title, API_KEY, channelId, maxResults } = req.body;

    const videos = await Video.find({ category: title });
    const lastVideoFetched = await FetchVideo.findOne({ title });
    console.log(lastVideoFetched)
    const lastFetchTime =
      new Date(lastVideoFetched.lastFetchedTime).getTime() + 3 * 60 * 60 * 1000;
    const currentTime = new Date();
    if (videos.length > 0 && lastFetchTime > currentTime) {
      return res.status(200).json({
        message: "All videos fetched successfully",
        videos,
      });
    }

    let url =
      "https://www.googleapis.com/youtube/v3/search?key=" +
      API_KEY +
      "&channelId=" +
      channelId +
      "&part=snippet,id&order=date&maxResults=" +
      maxResults;

    fetch(url)
    .then(response => {
      console.log(response);
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(data => {
      // Extract video IDs
      const videoIds = data.items.map(video => video.id.videoId).join(',');
      console.log("Video IDs: ", videoIds);
  
      // Fetch contentDetails for these videos
      return fetch(`https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&part=contentDetails&id=${videoIds}`)
        .then(response => {
          if (response.status >= 400) {
            
            throw new Error("Bad response from server");
          }
          return response.json();
        })
        .then(contentData => {
          // Create a map of contentDetails for quick lookup
          const contentDetailsMap = contentData.items.reduce((map, item) => {
            map[item.id] = item.contentDetails;
            return map;
          }, {});
  
          // Merge contentDetails into the original video data
          const allVideoItems = data.items.map(video => ({
            ...video,
            contentDetails: contentDetailsMap[video.id.videoId] || {} // Merge contentDetails
          }));
  
          // Filter videos based on contentDetails
          const removeShortVideos = allVideoItems.filter(item => {
            const { contentDetails } = item;
            if (contentDetails && contentDetails.duration) {
              const duration = contentDetails.duration;
              if (duration.includes('H')) return true;
  
              if (duration.includes('M')) {
                const ptIndex = duration.indexOf('T');
                const minuteIndex = duration.indexOf('M');
                const secondIndex = duration.indexOf('S');
  
                const minutes = parseInt(duration.slice(ptIndex + 1, minuteIndex));
                const seconds = parseInt(duration.slice(minuteIndex + 1, secondIndex));
                
                if (minutes > 1) return true;
                if (seconds > 30) return true;
                return false;
              }
  
              if (duration.includes('M') && !duration.includes('S')) {
                const ptIndex = duration.indexOf('T');
                const minuteIndex = duration.indexOf('M');
                const minutes = parseInt(duration.slice(ptIndex + 1, minuteIndex));
                return minutes > 1;
              }
            }
            return false;
          });
  
          console.log("Filtered Videos: ", removeShortVideos.length);
            return Promise.all(removeShortVideos.map(newVideo => 
            Video.create({
              category: title,
              videoId: newVideo.id.videoId,
              snippet: newVideo.snippet
            })
          ));
        })
        .then(() => {
          lastVideoFetched.lastFetchedTime = new Date(Date.now());
          return lastVideoFetched.save();
        })
        .then(() => {
          return Video.find({ category: title });
        })
        .then(newFetchedVideos => {
          console.log(newFetchedVideos);
          res.status(200).json({
            videos: newFetchedVideos,
            message: "All videos fetched successfully"
          });
        })
        .catch(error => {
          console.error("Error: ", error);
          res.status(500).json({ message: "An error occurred" });
        });
    })
    .catch(error => {
      console.error("Error fetching initial data: ", error);
      res.status(500).json({ message: "An error occurred" });
    });
  
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
