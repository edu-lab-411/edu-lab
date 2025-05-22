type props = {
    videoUrl: string;
}

function extractYouTubeID(url:any) {
    const regex = /(?:v=|\/)([0-9A-Za-z_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

const YouTubeEmbed = ({ videoUrl }:props) => {
    const videoId = extractYouTubeID(videoUrl);
    return (
        <div className="relative w-[90%] -0 pb-[56.25%] mb-6 m-auto rounded overflow-hidden">
            <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default YouTubeEmbed;
